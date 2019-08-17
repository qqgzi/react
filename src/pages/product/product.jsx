import React, { Component } from 'react'
import {Switch,Route,Redirect} from 'react-router-dom'


import ProductHome from './product-home'
import ProductDetail from './product-detail'
import ProductAddUpdate from './product-add-update'
import './product.less'

//商品管理

export default class Product extends Component {
    render() {
        return (
           <Switch>
                <Route path="/product" component={ProductHome} exact />
                <Route path="/product/detail/:id" component={ProductDetail}/> {/* 占位符的作用，发送的是get 的query的请求方式 */}
                <Route path="/product/addupdate" component={ProductAddUpdate}/>
                <Redirect to = '/product'/>
           </Switch>
        )
    }
}
