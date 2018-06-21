import React from 'react';
import moment from 'moment';
import date_picker_locale from 'antd/lib/date-picker/locale/zh_CN';
import { AutoComplete,Select, Input, InputNumber, Popconfirm, Form , DatePicker, TimePicker} from 'antd';

import {EditableContext} from './EditableRow';
import './EditableCell.less'
import {TASK,TRACK,TRAINID} from '../../config';

import './EditableCell.less'

const dateFormat = 'YYYY/MM/DD HH:mm:ss';
const FormItem = Form.Item;
const Option = Select.Option;
const filter=(inputValue, option) => {
  if(option.props.children.indexOf(inputValue)!==-1) return true
  return false
}
class EditableCell extends React.Component {
  state={
    mode:'time'
  }
  handlePanelChange = (value, mode) => {
    this.setState({ mode });
  }
  getInput = () => {
    switch(this.props.inputType){
      case 'time':
        return <DatePicker onPanelChange={this.handlePanelChange} locale={date_picker_locale} mode={this.state.mode} showTime format="YYYY-MM-DD HH:mm:ss" />
      case 'select':
        switch (this.props.dataIndex){
          case 'task':
            return <AutoComplete
              className={'select'}
              dataSource={TASK}
              placeholder="任务名称"
              filterOption={filter}
            />
          case 'trainId':
            return <AutoComplete
              style={{ width: 140 }}
              className={'select'}
              dataSource={TRAINID}
              placeholder="输入车组号"
              filterOption={filter}
            />
          default:
            return <AutoComplete
              className={'select'}
              dataSource={TRACK}
              placeholder="轨道名称"
              filterOption={filter}
            />
        }

      case 'number':
      return <InputNumber />;
      default:
        return <Input />;
    }
  };
  get cell(){
    const {record,children,dataIndex}=this.props
    switch (dataIndex){
      default:
        return children
    }
  }
  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      ...restProps
    } = this.props;

    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [{
                      required: dataIndex!=='description',             //true,
                      message: `Please Input ${title}!`,
                    }],
                    get initialValue(){
                      switch(inputType){
                        case 'time':
                          return moment(record[dataIndex], dateFormat)
                        case 'select':
                        default:
                          return record[dataIndex];
                      }
                    },
                  })(this.getInput())}
                </FormItem>
              ) : this.cell}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}

export default EditableCell