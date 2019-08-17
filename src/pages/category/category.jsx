import React, { Component } from 'react';

import { Card,Button,Icon,Table,message,Modal} from 'antd'
import { reqCategorys, reqAddCategorys, reqUpdateCategorys } from '../../api'


import LinkButton from '../../components/link-button'
import AddUpdateForm from './add-update-form'
/*  分类管理界面*/



export default class Category extends Component {
    state = {
        categorys:[],//所有分类的数组
        loading:false,//是否在loading加载中
        showState:0,//0代表的是不显示1，显示添加，2显示修改
    };
    //初始化Table中的所有列的信息
    initColums=()=>{
        this.columns = [
            {
                title:'分类的名称',
                dataIndex:'name',
                
            },
            {
                title:'操作',
                render:(category)=><LinkButton onClick = {()=>{
                    this.category = category//保存当前的category让这里的函数可以使用
                    this.setState({
                        showState:2,
                    })
                }}>修改分类</LinkButton>
            },
        ]
    }
    //异步获取数据显示
    getCategorys = async()=>{
        this.setState({
            loading:true
        })
        const result  = await reqCategorys();
        this.setState({
            loading:false
        })
        if(result.status===0){
            //取出信息
            const categorys = result.data;
            this.setState({
                categorys
            })
        }else{
            message.error("当前无法获取数据的信息")
        }

    }
   //点击添加按钮或者修改分类，弹出的对话框中的确定的按钮
    handleOk=()=>{
        //进行表单验证
    this.form.validateFields(async(err,values)=>{
         if (!err) {
             this.form.resetFields();//请求成功后，将按钮的数据重置为当前选择的。
            //验证通过后，得到输入数据
                const {categoryName} = values
                const {showState} = this.state;
                let result//在外层进行声明，且用let进行
                if(showState==1){//add
                     result = await reqAddCategorys(categoryName)
                }else{//修改数据,const 有块级作用域问题
                    const categoryId = this.category._id
                    result = await reqUpdateCategorys({
                        categoryId,categoryName
                    })
                }
                
                this.setState({showState:0})
                const action = showState ===1 ?'Add' : 'modify'
                //根据结果，做不同的处理
                if(result.status===0){//成功的添加
                    //将更新后的状态填写到state的状态中，触发render，重新渲染界面
                    //因为接口中定义了获取全部列表，添加列表和更新列表的方法
                    this.getCategorys()
                    message.success(action +" category success!")
                }else{
                    message.error(action  +" category error!")
                }
            }
        }
        )
        
        //这里主要的是发请求，
     
       
    }
    //点击取消的回调函数
    handleCancel = ()=>{
        //重置当前的输入框的数据，当不添加数据的时候，不会做任何的添加
        this.form.resetFields()
        this.setState({
            showState:0//让对话框隐藏
        })
    }
  componentWillMount(){
      this.initColums();
  } 
  componentDidMount(){
      this.getCategorys();//发请求，获取后台的数据，展示Table的信息
  }
    render() {
        //取出状态数据
        const {categorys,loading,showState} = this.state
        //读取更新的分类的名称
        const category = this.category || {}
       
        // Card右上角的结构
        const extra = (
            //这里不能直接写onClick的事件，因为页
            //面加载后会自动执行，要包在一个箭头函数的里，这样点击才会执行
            <Button type='primary' onClick={() => {
                this.category = {};
                this.setState({
                    showState: 1
                })}} >
                <Icon type='plus'/>
                 添加
            </Button>  
        )
        return (
            <Card  extra={extra}>
                <Table
                bordered = {true}//当前的border是否存在
                rowKey = '_id'
                loading = {loading}//根据当前的状态是否显示loading的加载界面
                columns = {this.columns}
                dataSource = {categorys}
                pagination = {{defaultPageSize:2,showQuickJumper:true
                }}
                />
                <Modal
                    title={showState===1?'添加分类':'修改分类'}
                    visible={showState!==0}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    {/* //按钮弹出的对话框中的表单的验证 */}
                    {/* //将子组件传递过来的form对象保存在当前的组件上 */}
                <AddUpdateForm setForm = {(form)=>this.form = form} categoryName={category.name}/>

                </Modal>
            </Card>
        )
    }
}