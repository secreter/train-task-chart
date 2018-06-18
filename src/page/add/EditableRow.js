import React from 'react';
import { Table, Input, InputNumber, Popconfirm, Form } from 'antd';

const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);
const EditableFormRow = Form.create()(EditableRow);
export default EditableFormRow
export {
  EditableContext
}