import React from 'react';
import EditTable from './EditTabe';
import './index.less'
import {Row,Col,Input, Button, Icon ,message} from 'antd';
import low from 'lowdb'
import LocalStorage   from 'lowdb/adapters/LocalStorage'
import shortid from 'shortid'
import _ from 'lodash'
import {  Link, Prompt } from "react-router-dom";

const adapter = new LocalStorage ('db')
const db = low(adapter)
const ButtonGroup = Button.Group;
// Set some defaults (required if your JSON file is empty)
db.defaults({ tables: []})
  .write()

class Add extends React.Component {
  constructor (props) {
    super(props);
    let {data,title,id}=Add.init(props)
    this.state = {
      modified:false,                   //is modified
      data,
      editingKey: '',
      title,
      id,              //edit or new
      match:props.match
    }
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if(prevState.match.params.id!==nextProps.match.params.id){
      //url 改变
      let {data,title,id}=Add.init(nextProps)
      return {
        ...prevState,
        data,
        title,
        id,
        modified:false,
        match:nextProps.match
      }
    }
    return null
  }
  static init=(props)=>{
    let {id}=props.match.params
    let data=[Add.getDefaultRecord()],title=''
    if(id){
      db.read()
      let table=db.get('tables')
        .find({ id})
        .value()
      data=table.data
      title=table.title
    }
    id=id||shortid.generate()
    return {data,title,id}
  }
  static getDefaultRecord(){
    return {
      key: +new Date(),
      trackId: 'k32-1',
      trainId: '23454',
      startTime: '2018-06-12 17:54:51',
      endTime: '2018-06-12 17:54:51',
      description: 'werer'
    }
  }
  getTableData=(data)=>{
    this.setState({
      data,
      modified:true,
    })
  }
  handleInputChange=(name,e)=>{
    this.setState({
      [name]:e.target.value,
      modified:true,
    })
    console.log(this.state)
  }
  handleAddData=()=>{
    const {data}=this.state
    this.setState({
      data:[...data,this.defaultRecord],
      editingKey:this.defaultRecord.key,
      modified:true,
    })
  }
  handleSaveData=()=>{
    const {data,title,id}=this.state
    if(!title||data.length===0){
      return message.warn('标题和数据不能为空！')
    }
    db.read()                               //no cache
    let item=db.get('tables')
      .find({ id})
      .value()
    if(item){
      //update
      db.get('tables')
        .find({ id})
        .assign({
          id,
          title,
          data
        })
        .write()
    }else{
      //add
      db.get('tables')
        .push({
          id,
          title,
          data
        })
        .write()
      console.log(db.get('tables').value())
    }
    return message.success('保存成功！')
  }
  handleDrawChart=()=>{

  }
  render () {
    const {modified,data,editingKey,title}=this.state
    return (
      <div className="container">
        <Prompt
          when={modified}
          message={location =>
            `当前更改还未保存，确认离开吗？`
          }
        />
        <div className="tool-bar">
          <Row gutter={12}>
            <Col span={8}>
              <Input value={title} onChange={this.handleInputChange.bind(this,'title')} placeholder={'添加标题'}/>
            </Col>
            <Col span={16}>
              <ButtonGroup>
                <Button type='primary' onClick={this.handleAddData}>添加数据</Button>
                <Button type='primary' onClick={this.handleDrawChart}>生成图表</Button>
                <Button type='primary' onClick={this.handleSaveData}>保存</Button>
              </ButtonGroup>
            </Col>
          </Row>

        </div>
        <EditTable editingKey={editingKey} data={data} onChange={this.getTableData}>

        </EditTable>
      </div>
    )
  }

}

export default Add