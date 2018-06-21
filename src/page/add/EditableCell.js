import React from 'react';
import moment from 'moment';
import date_picker_locale from 'antd/lib/date-picker/locale/zh_CN';
import { LocaleProvider,Select, Input, InputNumber, Popconfirm, Form , DatePicker, TimePicker} from 'antd';

import {EditableContext} from './EditableRow';
import './EditableCell.less'
import {TASK,TRACK} from '../../config';

import './EditableCell.less'

const dateFormat = 'YYYY/MM/DD HH:mm:ss';
const FormItem = Form.Item;
const Option = Select.Option;

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
            return <Select className={'select'}  placeholder="任务">
              {Object.keys(TASK).map(key=>{
                return <Option key={key} value={key}>{TASK[key]}</Option>
              })}
            </Select>
          default:
            return <Select className={'select'} placeholder="选择轨道">
              {Object.keys(TRACK).map(key=>{
                return <Option key={key} value={key}>{TRACK[key]}</Option>
              })}
            </Select>
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
      case 'task':
        return TASK[record[dataIndex]]
      case 'trackId':
        return TRACK[record[dataIndex]]
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
                          switch (dataIndex){
                            case 'task':
                              return TASK[record[dataIndex]]
                            case 'trackId':
                              return TRACK[record[dataIndex]]
                            default:
                              return record[dataIndex]
                          }
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