import React, { Component } from 'react'
import {
  Card,
  Icon,
  List,

} from 'antd';
import LinkButton from '../../components/link-button'
import memoryUtils from '../../utils/memoryUtils';
import {reqProduct,reqCategory} from '../../api'
const Item = List.Item;
const BASE_URL = 'http://localhost:5000/upload/'
export default class ProductDetail extends Component {
  state = {
    product:{},
    categoryName :'',
  }
  getCategory = async (categoryId)=>{
    const result = await reqCategory(categoryId);
    if(result.status===0){
      const categoryName = result.data.name||"";
      this.setState({
        categoryName
      })
    }

  }
 
  componentWillMount(){//加载内存中product
    const product = memoryUtils.product;
    if(product._id){
      this.setState({product})
    }

  }
  async componentDidMount(){
    //如果状态中的product没有数据，根据路由的param则发送请求数据
    if(!this.state.product._id){//没有
      const productId = this.props.match.params.id
      const result = await reqProduct(productId);
      if(result.status===0){
        const product = result.data;
        //得到商品对象后获取分类的显示
        this.getCategory(product.categoryId)
        this.setState({product});
      }
    }else{//当前有商品的信息，发请求请求分类的ID
      const categoryId = this.state.product.categoryId
      this.getCategory(categoryId);
    }
  }
  render() {
    // const product = memoryUtils.product;
    //这里传入的id是为了防止用户在当前的界面进行刷新，导致内存中保存的product对象被清空
    //如果用户没有刷新，直接从内存中读取


    //读数据
    const {product,categoryName} = this.state;
    const title = (
      <span>
        <LinkButton onClick={()=>{
          this.props.history.goBack()
        }}>
          <Icon type="arrow-left"/>
        </LinkButton>
        <span>商品详情</span>
      </span>
    );
    return (
      <Card title={title} className='product-detail'>
        <List>
          <Item>
            <span className='product-detail-left'>商品名称</span>
            <span>{product.name}</span>
          </Item>
          <Item>
            <span className='product-detail-left'>商品描述</span>
            <span>{product.desc}</span>
          </Item>
          <Item>
            <span className='product-detail-left'>商品价格</span>
            <span>{product.price}元</span>
          </Item>
          <Item>
            <span className='product-detail-left'>所属分类</span>
            <span>{categoryName}</span>
          </Item>
          <Item>
            <span className='product-detail-left'>商品图片</span>
            <span>
            {
                product.imgs && product.imgs.map(img=>(
                <img className="product-detail-img" key = {img} src={BASE_URL+img} alt="img" />
              ))
            }
            </span>
          </Item>
          <Item>
            <span className='product-detail-left'>商品详情:</span>
            <span dangerouslySetInnerHTML={{
              __html:product.detail
            }}></span>
          </Item>
            
        </List>
      </Card>
    )
  }
}
