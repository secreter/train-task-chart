/**
 * Created by So on 2018/6/7.
 */
import _ from 'lodash';
import React from 'react';
import moment from 'moment';
import { Table, Button,Input,Icon, InputNumber, Popconfirm, Form } from 'antd';

import EditableCell from './EditableCell'
import EditableFormRow,{EditableContext} from './EditableRow'
import {TASK,TRACK,TRAINID} from '../../config';

import './EditTabe.less'
const dateFormat = 'YYYY/MM/DD HH:mm:ss';
const ButtonGroup = Button.Group;


class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data:_.cloneDeep(props.data),
      editingKey: props.editingKey
    };
    this.columns = [
      {
        title: '股道号',
        dataIndex: 'trackId',
        width: '12%',
        editable: true,
      },
      {
        title: '车组号',
        dataIndex: 'trainId',
        width: '12%',
        editable: true,
      },
      {
        title: '任务',
        dataIndex: 'task',
        width: '10%',
        editable: true,
      },
      {
        title: '开始时间',
        dataIndex: 'startTime',
        width: '20%',
        editable: true,
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
        width: '20%',
        editable: true,
      },
      {
        title: '备注',
        dataIndex: 'description',
        width: '18%',
        editable: true,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: '8%',
        render: (text, record) => {
          const editable = this.isEditing(record);
          return (
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a
                        href="javascript:;"
                        onClick={() => this.save(form, record.key)}
                        style={{ marginRight: 8 }}
                      >
                        保存
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm
                    title="确定取消吗?"
                    onConfirm={() => this.cancel(record.key)}
                  >
                    <a>取消</a>
                  </Popconfirm>
                </span>
              ) : (
                <span>
                  <a onClick={() => this.edit(record.key)} style={{ marginRight: 8 }}> 编辑</a>
                  <a onClick={() => this.remove(record.key)}>删除</a>
                </span>
              )}
            </div>
          );
        },
      },
    ];
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if(prevState.data.length<nextProps.data.length){
      //增加数据的时候更新
      return {
        ...prevState,
        editingKey:nextProps.editingKey,
        data:_.cloneDeep(nextProps.data)
      }
    }
    return null
  }
  isEditing = (record) => {
    return record.key === this.state.editingKey;
  };
  edit(key) {
    this.setState({ editingKey: key });
  }
  remove=(key)=>{
    const {onChange,data}=this.props
    let newData=data
    const index = newData.findIndex(item => key === item.key);

    if (index > -1) {
      newData.splice(index, 1);
      this.setState({ data: newData, editingKey: '' });
      onChange(newData)                                 //传递到父组件
    }
  }

  save(form, key) {
    const {onChange}=this.props
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      // console.log(form.getFieldValue('task'))
      // 居然select 返回的不是标签里的value
      for (let key in row) {
        if (row[key] instanceof moment){
          row[key]=row[key].format(dateFormat)
        }

      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ data: newData, editingKey: '' });
        onChange(newData)                                 //传递到父组件
      }
    });
  }
  cancel = () => {
    this.setState({ editingKey: '' });
  };
  render() {
    const {editingKey}=this.state
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          get inputType(){
            switch(col.dataIndex){
              case 'startTime':
              case 'endTime':
                return 'time'
              case 'trackId':
              case 'trainId':
              case 'task':
                return 'select'
              default:
                return 'text'
            }
          },
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    return (
      <Table
        components={components}
        bordered
        dataSource={this.state.data}
        columns={columns}
        pagination={false}
        rowClassName="editable-row"
      />
    );
  }
}

export default EditableTable