import React, { Component } from 'react'
import PropType from 'prop-types'
import {
  Form,
  Input,
  Select
} from 'antd';
const Item = Form.Item
const Option = Select.Option
//更新或者添加Form的组件
 class UserForm extends Component {
   static propType ={
     setForm:PropType.func.object,
     user: PropType.object,
     roles: PropType.array
   }
   componentWillMount(){
     this.props.setForm(this.props.form);
   }
  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout={
      labelCol:{span:4},
      wrapperCol:{span:16}
    }
    const {user,roles} = this.props;
    return (
      <Form {...formItemLayout}>
        <Item label="用户名">
          {
            getFieldDecorator('username',{
              initialValue:user.username
            })(
              <Input type='text' placeholder='请输入用户名'/>
            )
          }
        </Item>
          {/*根据是是否有user._id 决定是否显示修改密码的操作 
          ,没有id代表的添加框，显示pwd框，*/}
          
       {
          !user._id ? 
          (
            <Item label="修改密码">
              {
                getFieldDecorator('password', {
                  initialValue: ''
                })(
                  <Input type="password" placeholder="请输入密码" />
                )
              }
            </Item>
          ) : null
       }
       <Item label = '手机号码'>
          {
            getFieldDecorator('phone', {
              initialValue: user.phone
            })(
              <Input type="phone" placeholder="请输入手机号" />
            )
          }
       </Item>
        <Item label="邮箱">
          {
            getFieldDecorator('email', {
              initialValue: user.email
            })(
              <Input type="email" placeholder="请输入邮箱" />
            )
          }
       </Item>
       <Item label="角色"> 
          {
            getFieldDecorator('role_id', {
              initialValue: user.role_id,
              rules: [
                { required: true, message: '必须指定角色' }
              ]
            })(
              <Select style={{ width: 200 }} placeholder='请选择角色'>
                {
                  
                 roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                  
                }
              </Select>
            )
          }
       </Item>
      </Form>
    )
  }
}
export default Form.create()(UserForm);