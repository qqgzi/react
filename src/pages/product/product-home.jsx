import React, { Component } from 'react'
import {
  Card,Select,Input,Button,Icon,Table, message
} from 'antd'
import {reqProducts,
   reqSearchProducts,
   reqUpdateStatus,
  } from '../../api'
import LinkButton from '../../components/link-button'
import memoryUtils from '../../utils/memoryUtils';
const Option = Select.Option
//商品管理的默认的子路由``
export default class ProductHome extends Component {
  //受控组件1.设置好状态，2读取初始的状态3，绑定onchange的事件
  state ={
    products:[],
    //当前页的数据
    total:0,//product的总的记录的数据
    searchType:'productName',//默认是按照商品的名称进行搜索
    searchName:'',//搜索的关键字
  }
  //
   updateStatus = async (productId, status) => {
    
    //读取原来的数值进行更新
    status=status===1?2:1;
   const result = await reqUpdateStatus(productId,status);
   if(result.status===0){//请求的状态返回的成功，对错误的请求不处理
    message.success("update success!");
    this.getProducts(this.pageNum);//获取新的信息要在当前的页面进行显示

   }
  }
 
 
  initColumns = () => {
   
    this.columns=[
      {
        title:'商品名称',
        dataIndex:'name'
      },
      {
        title: '商品描述',
        dataIndex: 'desc'
      },
      {
        title: '价格',
        dataIndex: 'price',
        render:(price)=>`￥${price}`
      },
      {
        title: '状态',
        width:80,
        // dataIndex: 'status',
        render: ({_id,status})=>{
          let btnText = '下架'
          let text = '在售'
          if(status ===2){
            btnText = '上架'
            text = '已下架'
          }
          return (
            <span>
              <button onClick={() => { this.updateStatus( _id,status)}}>{btnText}</button>
              <span>{text}</span>
            </span>
          )
        }
      },
      {
        title: '操作',
        width: 100,
        render: product => (
          <span>
            <LinkButton 
            onClick={() => {
              //将product保存到内存中
              memoryUtils.product = product;
                this.props.history.push(`/product/detail/${product._id}`)
            }}
            >详情
            </LinkButton>
            <LinkButton
            onClick={()=>{
                this.props.history.push('/product/addupdate', product)
            }}
            >修改</LinkButton>
          </span>
        )
      } 
         
    ]
  };
  //异步获取指定页码的数据(可能带有搜索)的显示
  getProducts = async(pageNum)=>{
    //保存当前的页码
    this.pageNum = pageNum;
    const {searchName,searchType} = this.state
    let result;
    if(!searchName){
      result = await reqProducts(pageNum, 5);//
    }else{
       result = await reqSearchProducts({pageNum,pageSize:5,searchName,searchType});
    }
    
    if(result.status===0){
      let {total,list} =  result.data;
      this.setState({
        total,
        products:list,
      })
    }
  }
  componentWillMount() {
    this.initColumns();
  }
  componentDidMount(){
    this.getProducts(1);
  }
  render() {
    const {products,total,searchType,searchName} = this.state;
    const title = (
      <span>
        <Select 
        value={searchType} 
        style={{ width: 200 }} 
        onChange={(value)=>this.setState(
          {
            searchType:value,//受控组件
          }
        )}>
          <Option value='productName'>按名称搜索</Option>
          <Option value='productDesc'>按描述搜索</Option>
        </Select>
        <Input 
        type='text'
        style={{width:200,margin:'0 20px'}} 
        placeholder="please input!"
        value={searchName}
        onChange ={(event)=>this.setState({
          searchName : event.target.value
        })}/>
        <Button type="primary" onClick={() => { this.getProducts(1)}}>搜索</Button>
      </span>
    )
    //card的头部右侧
    const extra=(
      <Button type="primary" onClick={
        ()=>this.props.history.push("/product/addupdate")
      }>
        <Icon type="plus"/>
        添加商品
      </Button>
    )
    return (
      <Card title = {title} extra = {extra}>
        <Table 
        bordered
        rowKey='_id'
        dataSource={products}
        columns = {this.columns}
        pagination = {{
          current:this.pageNum,
          pageSize:5 ,
          total,
          onChange:this.getProducts}}
        />
      </Card>
    )
  }
}
