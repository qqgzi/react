//添加分类的Form组件
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import{
  Form,Input
} from 'antd'

const Item = Form.Item;
class AddUpdateForm extends Component {
  static propTypes = {
    setForm:PropTypes.func.isRequired,
    categoryName :PropTypes.string,
  }
  componentWillMount(){
    //这里调用setForm 的函数将form的属性交给父组件
    //this.props.form是因为子组件经过Form包装过有的属性
    //this.props.setForm是因为父组件设置了方法，子组件经过this.props拿到父组件的方法进行调用。
    //子组件调用父组件的方法后传递给父组件实参，父组件拿到子组件的form的属性。
   this.props.setForm(this.props.form)
  }
  render() {
    const { getFieldDecorator} = this.props.form
    console.log(this,this.props)
    const {categoryName} =this.props
    return (
      <Form>
        <Item>
          {
            getFieldDecorator(
              'categoryName',{
                initialValue: categoryName ||'',
                rules:[
                  {required:true,message:'分类名称必须输入'}
                ]
              }
            )
              (< Input type='text' placeholder='please input categoryName'></Input>)
          }
          
        </Item>
      </Form>
    )
  }
}
export default Form.create()(AddUpdateForm)