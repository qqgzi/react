import React, { Component } from 'react';
import {Link,withRouter} from 'react-router-dom'

import { Menu, Icon} from 'antd';

import menuList from '../../config/menuConfig.js'
import logo from '../../assets/images/logo.jpg'
import './index.less'


const { SubMenu } = Menu;


// 左侧的导航组件
 class LeftNav extends Component{
  getMenuNodes = (menuList)=>{
    const path = this.props.location.pathname;
    return menuList.reduce((pre,item)=>{
      //可能添加pre也有可能添加Submenu
      if(!item.children){
        pre.push(<Menu.Item key = {item.key}>
                      <Link to = {item.key}>
                      <Icon type={item.icon}/>
                      <span>{item.title}</span>
                      </Link>
                 </Menu.Item>)
      }else{
        // 判断当前的Item是否是我要的openKey，查找Item的所有的children中的Item的key，看是否有一个和请求的path匹配
        const cItem = item.children.find(cItem=>path.indexOf(cItem.key)===0)
        if(cItem){
          this.openKey = item.key;
        }
        pre.push(
          <SubMenu    
              key = {item.key}
              title={
                <span>
                  <Icon type={item.icon}/>
                  <span>{item.title}</span>
                </span>
              }
          >
              {
                this.getMenuNodes(item.children)//递归调用当前的函数显示Submenu中的Item的子菜单
              }
          </SubMenu>
        )
      }
      return pre;
    },[])
  }
 //这里做代码的优化，因为这里的left-nav执行了两次
 componentDidMount(){
   //这个函数的作用是在render（）之后执行一次。执行异步请求，发送Ajax，和定时器
 }
 componentWillMount(){
   //在第一次render（）之前执行一次
   //为第一次的render（）做一些同步的准备工作

   this.menuNodes = this.getMenuNodes(menuList);
 }
     render() {
       //取出当前的路由路径//注意这里的属性必须是路由才有的属性
     
       let selectKey = this.props.location.pathname
       if(selectKey.indexOf('/product/')===0){
         selectKey='/product'
       }
         return (
              <div className='left-nav'>
                  <Link className='left-nav-link' to='/home'>
                      <img src={logo} alt="logo"/>
                      <h1>硅谷后台</h1>
                  </Link>

                  <Menu
                  //defaultSelectedKeys:认识默认值
                  //selectedKeysz:只是认识更新的值
                //defaultSelectedKeys = {[selectKey]}
                selectedKeys = {[selectKey]}
                  defaultOpenKeys = {[this.openKey]}//这里应该是当前请求的路由
                     mode="inline"
                     theme="dark"
                  >
                    {this.menuNodes}
                    </Menu>
        
              </div>
         );
     }
 }
//  因为admin组件式路由组件，而left-nav不是路由组件，不能用路由组件的三个属性，所以引入withRoute，将组件进行包装
//这样leftNav就会具有路由组件的属性，将三个属性传递给新的组件
 export default withRouter(LeftNav)