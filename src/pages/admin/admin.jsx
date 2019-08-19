import React, { Component } from 'react'
import {Redirect,Switch,Route}  from 'react-router-dom'
import { Layout } from 'antd';

import memoryUtils  from '../../utils/memoryUtils'
import LeftNav from '../../components/left-nav'
import Header from '../../components/header';

// 注册路由的组件
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
// import Role from '../role/role'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'



//const的代码不能写在import的上面
const {  Footer, Sider, Content } = Layout;
export default class Admin extends Component {
    render() {
        // 读取并且判断带到的user，不存在，跳转到登陆界面

        //const user = JSON.parse(localStorage.getItem('user_key') || '{}');
        const user = memoryUtils.user;
        if(!user._id){//此时是空的对象，将返回登陆界面
            //this.props.history('/login')//事件回调函数中进行路由跳转
            return <Redirect to="/login"/>
        }
        return (
            <Layout style={{height:'100%'}}>
            <Sider>
              {/* 单独将左侧的分开来写 */}
              <LeftNav/>
            </Sider>
            <Layout>
              <Header/>
              <Content style={{backgroundColor:'white', margin:'20px'}}>
                <Switch>
                  <Route path='/home' component = {Home}/>
                  <Route path='/category' component = {Category}/>
                  <Route path='/product' component = {Product}/>
                  <Route path='/role' component = {Role}/>
                  <Route path='/user' component = {User}/>
                  <Route path='/bar' component = {Bar}/>
                   <Route path='/line' component = {Line}/>
                  <Route path='/pie' component = {Pie}/>
                  <Redirect to='/home'/> 
                </Switch>
              </Content>
              <Footer style={{textAlign:'center',color:'rgba(0,0,0,0.5)'}}>推荐使用谷歌浏览器</Footer>
            </Layout>
          </Layout>
        )
    }
}
