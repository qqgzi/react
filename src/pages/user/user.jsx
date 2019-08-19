import React, { Component } from 'react'
import {
  Card,
  Table,
  Modal,
  Button,
  message
} from 'antd'
import UserForm from './user-form'
import {formateDate} from '../../utils/dateUtils';
import  LinkButton from '../../components/link-button'
import {reqUsers,
  reqDeleteUser,
  reqAddOrUpdateUser
} from '../../api'
export default class User extends Component {
  state = {
    isShow:false,//是否显示对话框
    users:[],//所有用户的列表
    roles:[],//所有角色的列表
  }
  
  initColumns = ()=>{
    
    this.columns = [
      {
        title:'用户名',
        dataIndex:'username'
      },
      {
        title: '邮箱',
        dataIndex: 'eamil'
      },
      {
        title: '电话',
        dataIndex: 'phone'
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        render:formateDate,
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        render:role_id=>this.rolesObj[role_id]
        //render;
      },
      {
        title: '操作',
        render:(user)=>(
          <span>
            <LinkButton onClick = {()=>this.showUpdate(user)}>修改</LinkButton>
            &nbsp;&nbsp;&nbsp;
            <LinkButton onClick={()=>this.clickDelete(user)}>删除</LinkButton>
          </span>
        )
      },
    ]
  }

  //将角色的数组生成一个包含一个包含所有角色名的对象容器
  
  initRolesObj=(roles)=>{
    this.rolesObj = roles.reduce((pre,role)=>{
      pre[role._id] = role.name;
      return pre
    },{})
  }
  //删除用户的按钮
  clickDelete=(user)=>{
    Modal.confirm({
      content:`确定要删除${user.username}吗？`,
      onOk:async()=>{
        const result = await reqDeleteUser(user._id)
        if(result.status===0){
          message.success('delete success!');
          this.getUsers();
        }
      }
    })
  }
  //显示修改的界面
  showUpdate= (user)=>{
    //
    this.user = user;
    this.setState({
      isShow:true
    })
  }
  //异步获取所有用户的信息
  getUsers=async()=>{
    const result = await reqUsers()
    if(result.status===0){
      const {users,roles} = result.data;
      //根据roles的数组生成roles的对象容器
      this.initRolesObj(roles)
      this.setState({
        users,
        roles,
      })
    }
  }
//显示添加用户的界面
  showAddUser=()=>{
    this.user = null;
    this.setState({
      isShow:true,
    })
  }

  // AddOrUpdateUser更新或者添加
  //获取扁表单数据
  AddOrUpdateUser = async()=>{
    //收集表单数据
    const user = this.form.getFieldsValue();
    this.form.resetFields();//
    if(this.user){
      user._id = this.user._id;
    }
    this.setState({
      isShow:false
    })
    const result = await reqAddOrUpdateUser(user)
    if(result.status===0){
      this.getUsers()
    }
  }




  componentWillMount(){
    this.initColumns()
  }
  componentDidMount(){
    this.getUsers();
  }
  render() {
    const {users,roles,isShow} = this.state
    const user = this.user || {}
    const title = <Button type='primary' onClick={this.showAddUser}>创建用户</Button>
    return (
      <Card title={title}>
        <Table
        columns = {this.columns}
        rowKey = '_id'
        dataSource = {users}
        bordered
        pagination = {{defaultPageSize:5,showQuickJumper:true}}

        />

      <Modal
      title = {user._id?'修改用户':'添加用户'}
      visible = {isShow}
      onCancel = {
        ()=>this.setState({isShow:false})
      }
      //点击确定的时候有可能添加，有可能是更新，根据后面用户是否有Id判
      onOk = {
        this.AddOrUpdateUser
      }
      >
        <UserForm 
        setForm = {(form)=>this.form = form}
        user = {user}
        roles = {roles}
        />
      </Modal>

      </Card>
    )
  }
}
