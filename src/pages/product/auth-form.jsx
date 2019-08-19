import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Input,
  Tree
} from 'antd';

import menuList from '../config/menuConfig'
const Item = Form.Item
const {TreeNode} = Tree
export default class Auth extends Component {
 static proTypes={
   role:PropTypes.object,
   
 }
 

 state = {
   checkedKeys :[]
 }
 getMenus = ()=>{
   return this.state.checkedKeys
 }

  getTreeNodes = (menuList) => {
    return menuList.map(item => {
      return (
        <TreeNode title={item.title} key={item.key}>
          {item.children ? this.getTreeNodes(item.children) : null}
        </TreeNode>
      )
    })
  }


  handelCheck = (checkedKeys)=>{
    this.setState({
      checkedKeys
    })
  }

 
  //加载第一次role的权限进行显示,但是这个函数只加载一次，当再一次更新状态，不会改变
  //所以用到周期函数
  // componentWillMount(){
  //   const menus = this.props.role.menus
  
  //  // this.setState({checkedKeys:menus})
  // }
  //当组件的属性发生改变的时候进行渲染界面
  componentWillReceiveProps(nextProps){
    const menus = nextProps.role.menus;
    this.setState({
      checkedKeys:menus
    })
  }
  render() {
    const {name} = this.props.role//拿到之前的role整个对象
    const {checkedKeys} = this.state;//取出当前对象原有的选择

    const formItemLayout = {
      labelCol: { span: 4},
      wrapperCol: { span: 8 }
    }
    return (
      <div>
        <Item label='角色名称:' {...formItemLayout}>
          <Input disabled value={name}/>
          <Tree
           checkable//可勾选
           defaultExpandAll//默认是全部展开的
           onCheck = {this.handelCheck}
           checkedKeys = {checkedKeys}
          >
            <TreeNode title='平台权限' key="0-0">
              {
                //遍历输出当前的权限menus
                this.getTreeNodes(menuList)
              }
          </TreeNode>
          </Tree>
        </Item>
      </div>
    )
  }
}
