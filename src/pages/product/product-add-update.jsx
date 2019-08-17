import React, { Component } from 'react'

import {
  Card, Select, Input, Button, Icon,Form,message
} from 'antd'
import {reqCategorys,reqAddUpdateProduct} from '../../api'
import LinkButton from '../../components/link-button'

import PicturesWall from './pictures-wall';
import RichTextEditor from './rich-text-editor'
const Option = Select.Option
const Item = Form.Item;


 class ProductAddUpdate extends Component {
   state = {
     categorys:[]
   }
   constructor(props){
     super(props)
     //创建一个ref的容器
     this.pwRef = React.createRef();
     this.editorRef = React.createRef();
   }
   //异步获取所有分类列表
   getCategorys=async()=>{
     const result = await reqCategorys();
     if(result.status===0){
       this.setState({
         categorys:result.data
       })
     }
   }

   //检查价格
   validatePrice = (rule,value,callback)=>{
    if(value<0){
      callback('价格不能小于0')
    }else{
      callback();
    }
   }
   //提交按钮事件
   handleSubmit =(event)=>{
    event.preventDefault();
     this.props.form.validateFields(async (err, values)=>{
      if(!err){
        const { name, desc, price, categoryId }=values;
        //得到所有上传的图片的文件名的数组进行上传
        // const imgs = this.refs.pw.getImgs()
        //this.pwRef.current得到组件对象
        const imgs= this.pwRef.current.getImgs();
        //输入的商品的详情的字符串
        const detail = this.editorRef.current.getDetail();
        //封装product的对象
        const product = {name,desc,price,categoryId,imgs,detail}
        if(this.isUpdate){
          product._id = this.product._id;
        }
        //发请求添加或者进行修改
        const result = await reqAddUpdateProduct(product)
        if(result.status===0){
          message.success(`${this.isUpdate?'修改':'添加'}商品成功`)
          this.props.history.replace('/product');
        }else{
          message.error(result.msg)
        }
      }
    })
   }
   componentDidMount(){
     this.getCategorys()
   }
   componentWillMount(){
     const product = this.props.location.state
    
    this.product = product || {}
     
    this.isUpdate = !!this.product._id//得到布尔值
  
   }
  render() {
    const {product,isUpdate} = this
    console.log(product, isUpdate);
    const {categorys} = this.state
    const {getFieldDecorator} = this.props.form
    const title = (
      <span>
        <LinkButton onClick={()=>
          this.props.history.goBack()
        }>
          <Icon type="arrow-left" />
        </LinkButton>
        <span>{isUpdate?'更新':'添加'}商品</span>
      </span>
    );

    //表单的布局
    const formLayout = {
      labelCol:{span:2},
      wrapperCol:{span:8}
    }
    return (
      <Card title={title}>
        <Form {...formLayout}  onSubmit={this.handleSubmit}>  
          <Item label="商品名称">
              {
                getFieldDecorator('name', {
                  initialValue: product.name ,

                  rules: [
                    { required: true, message: '商品名称是必须填写!' },
                  ]
                })(
                  <Input type='text' placeholder="商品名称" />)
              }
          </Item>
          <Item label="商品描述">
            {
              getFieldDecorator('desc', {
                initialValue: product.desc,
                rules: [
                  { required: true, message: '商品描述是必须填写!' },
                ]
              })(
                <Input type='text' placeholder="商品描述" />)
            }
          </Item>
          <Item label="商品价格">
            {
              getFieldDecorator('price', {
                initialValue: product.price,
                rules: [
                  { required: true, message: '商品价格是必须填写!' },
                  { validator:this.validatePrice}
                ]
              })(
                <Input type='number' placeholder="商品价格" addonAfter="元"/>)
            }
          </Item>
          <Item label="商品分类">
            {
              getFieldDecorator('categoryId', {
                initialValue: product.categoryId,
                rules: [
                  { required: true, message: '商品分类是必须填写!' },
                ]
              })(
                <Select>
                  <Option value="">未选择</Option>
                  {
                    categorys.map(c=><Option value={c._id} key={c._id}>{c.name}</Option>)
                  }
                </Select>
              )
           }
          </Item>
          <Item label="商品图片" wrapperCol={{ span: 15 }}>
            {/* 内部会将组件对象保存到ref容器对象: current: 组件对象 */}
           <PicturesWall 
           ref = {this.pwRef}
           imgs = {product.imgs}/>
          </Item>
          <Item label="商品详情"
            wrapperCol= {{span:20}}
          >
           <RichTextEditor
              ref={this.editorRef } 
           detail = {product.detail}/>
          </Item>
          <Item>
            <Button type="primary" htmlType='submit'>提交</Button>
          </Item>

          
        </Form>
      </Card>
    )
  }
}
export default Form.create()(ProductAddUpdate)