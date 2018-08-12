import React from 'react';
import moment from 'moment';
import date_picker_locale from 'antd/lib/date-picker/locale/zh_CN';
import { AutoComplete,Select, Input, InputNumber, Popconfirm, Form , DatePicker, TimePicker} from 'antd';

import {EditableContext} from './EditableRow';
import './EditableCell.less'
import {TASK,TRACK,TRAINID} from '../../config';

import './EditableCell.less'

const dateFormat = 'YYYY/MM/DD HH:mm';
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
  picker=null
  componentDidMount(){
    if(!this.picker) return
    console.log(this.picker.picker.input)
    this.picker.picker.input.addEventListener('input',(input)=>{
      console.log()
    })
    let inupts=[...document.querySelectorAll('.ant-calendar-input')]
    console.log(inupts)
    inupts.forEach(input=>{
      input.addEventListener('input',(a)=>{
        console.log(a.target.value);
        a.target.value=a.target.value.replace('.',':')
      })
    })

  }
  handlePanelChange = (value, mode) => {
    console.log(value)
    this.setState({ mode });
  }
  handleTimerChange=(time,timeString)=>{

  }
  handleDateChange=(time,timeString)=>{
    console.log(time,timeString)
  }
  handleOpenChange=(status)=>{
    //下拉框出来的时候添加事件监听
    if(!status)return
    setTimeout(()=>{
      let inupts=[...document.querySelectorAll('.ant-calendar-input')]
      inupts.forEach(input=>{
        input.addEventListener('keyup',(e)=>{
          console.log(e.target.value);
          e.target.value=e.target.value.replace('.',':') //替换.
          e.target.value=e.target.value.replace(';',':') //替换.
          e.target.value=e.target.value.replace(/([^0-9])([0-9]:)/,'$10$2')   //替换9=>09
        })
      })
    },0)
  }
  getInput = () => {
    switch(this.props.inputType){
      case 'time':
        return <DatePicker
          ref={ref=>this.picker=ref}
          onPanelChange={this.handlePanelChange}
          onChange={this.handleDateChange}
          onOpenChange={this.handleOpenChange}
          locale={date_picker_locale}
          mode={this.state.mode}
          showTime={
            {
              format:"HH:mm",
              onChange:this.handleTimerChange
            }
          }
          format="YYYY-MM-DD HH:mm" />
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