import React from 'react';
import './index.less'
import { Button, Divider, Table } from 'antd';
import low from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import {  Link, Prompt } from "react-router-dom";
import _ from 'lodash'

const adapter = new LocalStorage('db')
const db = low(adapter)
const ButtonGroup = Button.Group;
// Set some defaults (required if your JSON file is empty)
db.defaults({tables: []})
  .write()

class List extends React.Component {
  constructor (props) {
    super(props);
    db.read()                                //get latest
    this.state = {
      tables: db.get('tables').value()
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    db.read()
    return {
      ...prevState,
      tables: db.get('tables').value()
    }
  }

  handleInputChange = (name, e) => {
    this.setState({
      [name]: e.target.value
    })
  }
  handleView = (record) => {

  }
  handleDelete = (record) => {
    let tables=db.get('tables')
      .remove({ id: record.id })
      .write()
    this.setState({
      tables:db.get('tables').value()
    })
  }
  getColumns = () => {
    let columns = [{
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: text => <a href="javascript:;">{text}</a>,
    }, {
      title: '时间',
      dataIndex: 'createTime',
      key: 'createTime',
    }, {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    }, {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <ButtonGroup>
            <Button type={'primary'}><Link to={`/add/${record.id}`}>查看</Link></Button>
            <Button type={'primary'}><Link to={`/chart/${record.id}`}>图表</Link></Button>
            <Button type={'danger'} onClick={this.handleDelete.bind(this,record)}>删除</Button>
          </ButtonGroup>
    </span>
      ),
    }];
    return columns
  }

  render () {
    const {tables} = this.state
    return (
      <div className="container">
        <Table rowKey={"id"} columns={this.getColumns()} dataSource={tables} />
      </div>
    )
  }

}

export default List