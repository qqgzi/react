import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'
import { Form, Icon, Input, Button,message} from 'antd';
import memoryUtils from '../../utils/memoryUtils'
import storageUtils  from '../../utils/storageUtils.js'
import {reqLogin} from '../../api'
import logo from '../../assets/images/logo.jpg'
import './login.less' 
const Item = Form.Item
 class Login extends Component {                                                                                                                                
    handleSubmit = e => {
        //阻止事件点击的默认行为
        e.preventDefault();
        //取出输入的相关数据
        // const form = this.props.form;//利用Form的属性取出表单的数据
        // const values = form.getFieldsValue();//取出来的是一个对象，所有的输入的值。
        // const username = form.getFieldValue('username');//取出来是特定的值
        // const password = form.getFieldValue('password');
        // console.log(values,username,password);
           this.props.form.validateFields(async(err,{username,password})=>{
            if(!err){//validateFields接受一个回调函数作为参数，
                const result = await reqLogin(username,password)
                if(result.status ===0){//所有的路由组件都接受三个参数push,replace
                    //将user的信息保存在到local中
                    const user = result.data;
                   storageUtils.saveUser(user);//在本地中保存一份，
                   memoryUtils.user = user;//在内存中进行保存一份
                    //跳转到admin界面
                    this.props.history.replace('/')
                    message.success('登陆成功')
                }else{
                    message.error(result.msg)
                }
               //value是一个对象，将表单的数据收集在values中
            }else {
                alert('验证失败')
            }
        })//对表单进行统一的验证,因为之前将Form进行了包装，具备了form 的属性
     
        //alert('这里是将要发动的Ajax 的请求')
      };
      //对密码进行自定义的验证
      validatePwd =(rule,value,callback)=>{
          value = value.trim();
        if(!value){
           callback('密码不能为空！') 
        }else if(value.length<4){
            callback('密码不可以小于4位！') 
        }else if(value.length>12){
            callback('密码不可以大于12位！') 
        }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
            callback('用户名必须是英文，数字或者下划线组成！') 
        }else {
            callback()//这里是验证通过了
        }
      }
    render() {
        //读取当前的user，如果存在，就直接跳转到管理的界面
        //const user = JSON.parse(localStorage.getItem('user_key') || '{}');
       // const user = storageUtils.getUser();
       const user = memoryUtils.user
        if(user._id){//判断，如果local中存在此用户，就跳转到admin界面
            //this.props.history('/login')//事件回调函数中进行路由跳转
            return <Redirect to="/"/>
        }
        //当前的用户不存在localStorage的话，进行下面的流程
        const {getFieldDecorator} = this.props.form
        return (
            <div className = 'login'>
               <div className = 'login-header'>
                   <img src={logo} alt="logo"/>
                   <h1>后台管理系统</h1>
               </div>
               <div className = 'login-content'>
                <h1>用户登录</h1>
                    
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <Item>
                        {
                            getFieldDecorator('username',{//配置对象：属性名是特定的
                                initialValue:'',
                                rules:[
                                    //这里是声明式的验证
                                    { required: true,whitespace:true, message: '用户名是必须填写!' },
                                    {min:4,message:'用户名不能少于4位'},
                                    {max:12,message:'用户名不能大于12位'},
                                    {pattern:/^[a-zA-Z0-9_]+$/,message:'用户名必须是英文，数字或者下划线组成'}
                                ]
                            })(
                            
                        <Input
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="username"
                        />)
                        }
                    </Item>
                    <Item>
                    {
                            getFieldDecorator('password',{
                                initialValue:'',
                                rules:[
                                    {validator:this.validatePwd}
                                ]
                            })(
                        <Input
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            type="password"
                            placeholder="Password"
                        />)
                        }
                    
                    </Item>
                    <Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        登录
                    </Button>
                    </Item>
                </Form>
                </div>
              </div>
              )
             }
}
//标签是组件的实例对象，标签只是将组件进行实例化，这个是jsx的语法，方便react的操作
//对现在的Form进行包装， Form.create()包装Form组件生成一个新的组件，
//新的组件会给Form组件传递一个新的属性   属性名：form   属性值：对象


//高阶函数  高阶组件
//高阶组件接受一个组件，返回一个 新的组件Form.create()返回的就是一个高阶组件
const WrapperForm = Form.create()(Login);
export default WrapperForm;//c产生<Form (Login)/>.
// 用户名和密码的前端验证
//1.必须有，2：大于等于4位数且小于等于12，3：必须是英文
