import React from 'react';
import moment from 'moment';
import EditTable from './EditTabe';
import './index.less'
import { Breadcrumb, Button, Col, Input, message, Row } from 'antd';
import low from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import shortid from 'shortid'
import { Prompt,Link } from "react-router-dom";

const adapter = new LocalStorage('db')
const db = low(adapter)
const ButtonGroup = Button.Group;
const dateFormat = 'YYYY/MM/DD HH:mm:ss';
// Set some defaults (required if your JSON file is empty)
db.defaults({tables: []})
  .write()

class Add extends React.Component {
  constructor (props) {
    super(props);
    let {data, title, id, isNew,createTime} = Add.init(props)
    this.state = {
      modified: false,                   //is modified
      data,
      editingKey: '',
      title,
      isNew,
      createTime,
      id,              //edit or new
      match: props.match
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (prevState.match.params.id !== nextProps.match.params.id) {
      //url 改变
      let {data, title, id, isNew,createTime} = Add.init(nextProps)
      return {
        ...prevState,
        data,
        title,
        id,
        isNew,
        createTime,
        modified: false,
        match: nextProps.match
      }
    }
    return null
  }

  static init = (props) => {
    let {id} = props.match.params
    let data = [Add.getDefaultRecord()], title = '', isNew = true,createTime=''
    if (id) {
      db.read()
      let table = db.get('tables')
        .find({id})
        .value()
      data = table.data
      title = table.title
      createTime = table.createTime
      isNew = false
    }
    id = id || shortid.generate()
    createTime = createTime || +new Date()
    return {data, title, id, isNew,createTime}
  }

  static getDefaultRecord () {
    return {
      key: +new Date(),
      trackId: 'k38-1',
      trainId: '9527',
      task:1,
      startTime: moment().format(dateFormat),
      endTime: moment().format(dateFormat),
      description: ''
    }
  }

  getTableData = (data) => {
    this.setState({
      data,
      modified: true,
    })
  }
  handleInputChange = (name, e) => {
    this.setState({
      [name]: e.target.value,
      modified: true,
    })
  }
  handleAddData = () => {
    const {data} = this.state
    let defaultRecord=Add.getDefaultRecord()
    this.setState({
      data: [...data, defaultRecord],
      editingKey: defaultRecord.key,
      modified: true,
    })
  }
  handleSaveData = (cb) => {
    const {data, title, id} = this.state
    if (!title || data.length === 0) {
      return message.warn('标题和数据不能为空！')
    }
    db.read()                               //no cache
    let item = db.get('tables')
      .find({id})
      .value()
    if (item) {
      //update
      db.get('tables')
        .find({id})
        .assign({
          id,
          title,
          data
        })
        .write()
    } else {
      //add
      db.get('tables')
        .push({
          id,
          title,
          data
        })
        .write()
    }
    this.setState({
      modified: false
    },()=>{
      message.success('保存成功！')
      cb&&cb()
    })

  }
  handleDrawChart = () => {
    const {history}=this.props
    const {id}=this.state
    history.push(`/chart/${id}`)
  }

  render () {
    const {isNew, modified, data, editingKey, title,id} = this.state
    return (
      <div className="container">
        <Prompt
          when={modified}
          message={location =>
            `当前更改还未保存，确认离开吗？`
          }
        />
        <Row>
          {
            isNew ? <Breadcrumb style={{margin: '0px 0'}}>
                <Breadcrumb.Item>新建表格</Breadcrumb.Item>
              </Breadcrumb>
              :
              <Breadcrumb style={{margin: '0px 0'}}>
                <Breadcrumb.Item><Link to={'/list'}>{'<< 返回'}</Link></Breadcrumb.Item>
                <Breadcrumb.Item>{title}</Breadcrumb.Item>
              </Breadcrumb>
          }
        </Row>
        <div className="tool-bar">
          <Row gutter={12}>
            <Col span={8}>
              <Input value={title} onChange={this.handleInputChange.bind(this, 'title')} placeholder={'添加标题'} />
            </Col>
            <Col span={16}>
              <ButtonGroup>
                <Button type='primary' onClick={this.handleAddData}>添加数据</Button>
                <Button type='primary' onClick={this.handleSaveData.bind(this,this.handleDrawChart)}>生成图表</Button>
                <Button type='primary' onClick={this.handleSaveData.bind(this,null)}>保存</Button>
              </ButtonGroup>
            </Col>
          </Row>

        </div>
        <EditTable key={id} editingKey={editingKey} data={data} onChange={this.getTableData}>

        </EditTable>
      </div>
    )
  }

}

export default Add