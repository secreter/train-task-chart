import React from 'react';
import EditableRow,{EditableContext} from './EditableRow';
import { LocaleProvider,Select, Input, InputNumber, Popconfirm, Form , DatePicker, TimePicker} from 'antd';
import './EditableCell.less'
import date_picker_locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';
import {TASK} from '../../config';
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
            return <Select  placeholder="任务">
              {Object.keys(TASK).map(key=>{
                return <Option value={key}>{TASK[key]}</Option>
              })}
            </Select>
          default:
            return <Select placeholder="选择轨道">
              <Option value="k38-1">k38-1</Option>
              <Option value="k38-2">k38-2</Option>
              <Option value="k39-1">k39-1</Option>
              <Option value="k39-2">k39-2</Option>
              <Option value="k40-1">k40-1</Option>
              <Option value="k40-2">k40-2</Option>
              <Option value="k41-1">k41-1</Option>
              <Option value="k41-2">k41-2</Option>
              <Option value="k48-1">k48-1</Option>
              <Option value="k48-2">k48-2</Option>
              <Option value="k49-1">k49-1</Option>
              <Option value="k49-2">k49-2</Option>
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
    console.log(record,44)

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