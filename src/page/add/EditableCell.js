import React from 'react';
import EditableRow,{EditableContext} from './EditableRow';
import { LocaleProvider,Select, Input, InputNumber, Popconfirm, Form , DatePicker, TimePicker} from 'antd';
import './EditableCell.less'
import date_picker_locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';
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
          case 'isDouble':
            return <Select  placeholder="是否重组">
              <Option value="是">是</Option>
              <Option value="否">否</Option>
            </Select>
          default:
            return <Select placeholder="选择轨道">
              <Option value="k12-1">k12-1</Option>
              <Option value="k12-2">k12-2</Option>
              <Option value="k11-1">k11-1</Option>
              <Option value="k11-2">k11-2</Option>
            </Select>
        }

      case 'number':
      return <InputNumber />;
      default:
        return <Input />;
    }
  };
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
                      required: true,
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
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}

export default EditableCell