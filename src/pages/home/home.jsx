// import React, { Component } from 'react';
// import {
//     Card, Select, Input, Button, Icon, Table
// } from 'antd'
// import {reqProducts} from '../../api'
// import LinkButton from '../../components/link-button'
// const Option = Selet.Option
// // 首页路由组件,
// export default class Home extends  Component{
//     state = {
//         loading:false,
//         product:[],
//         total:0,
//     }
//     initColumns = ()=>{
//         this.columns = [
//             {
//                 title:
//             },
//             {

//             },
//         ]
//     }
//     componentWillMount(){
//         this.initColumns();
//     }
//      render() {
//          return (
//               <div className = 'home'>
//                   Home
//               </div>
//          );
//      }
//  }
import React, { Component } from 'react'

import "./home.less";

/* 
首页路由组件
*/
export default class Home extends Component {
    render() {
        return (
            <div className="home">
                欢迎使用硅谷后台管理系统
      </div>
        )
    }
}
