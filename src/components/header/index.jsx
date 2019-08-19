import React, { Component } from 'react';
import {Modal} from 'antd';//引入confirm
import LinkButton from '../../components/link-button';
import {withRouter} from 'react-router-dom'
import {reqWeather} from '../../api'
import {formateDate} from '../../utils/dateUtils.js'
import  menuList from '../../config/menuConfig'
import memoryUtils from '../../utils/memoryUtils.js'
import storageUtils from '../../utils/storageUtils'
import './index.less'



 class Header extends Component{
     state = {
         currentTime : formateDate(Date.now()),
         dayPictureUrl:"",
         weather:"",
     }
    //退出登陆的函数
    logout = ()=>{
        //首先提醒用户是否退出
        Modal.confirm({
            title:'确认退出吗？',
            onOk:()=>{
                console.log('Ok');
                storageUtils.removeUser();
                memoryUtils.user = {};
                //跳转到登陆的界面
               this.props.history.replace('/login')
            },
            onCancel(){
                console.log('Cacel');
            },
        })
        //确定后，删除用户的信息
    }
    // 根据当前请求的path得到对应tilte
    getTitle = ()=>{
        let title = '';
        const path = this.props.location.pathname;
        menuList.forEach(item=>{
           if(item.key === path) {//判读当前外层是否有title
               title = item.title
           }else if(item.children){
                const cItem = item.children.find(cItem=>cItem.key===path)
                if(cItem){
                    title = cItem.title;
                }
           }
        })
        return title;
    }
    //显示天气的函数
    getWeather = async()=>{
        //调用接口，发送天气的请求
       const {dayPictureUrl,weather} =  await reqWeather('北京')
       //及时更新天气的状态
       this.setState({
           dayPictureUrl,
           weather,
       })
    }
    componentDidMount(){
        //启动渲染时间的定时器
       this.intervalId = setInterval(() => {
            this.setState({
                currentTime:formateDate(Date.now())
            }
            )
        }, 1000);
        //发送请求jsonph获取天气的信息显示
        this.getWeather()

    }
    componentWillMount(){
        //清楚定时器
        clearInterval(this.intervalId)
    }
     render() {
         const {currentTime,dayPictureUrl,weather} = this.state
         const user = memoryUtils.user
         //得到要显示的title
         const title = this.getTitle();
         return (
            <div className='header'>
                <div className = 'header-top'>
                    欢迎，{user.username}   &nbsp;&nbsp;
                    {/* 组件的标签体作为标签的children属性输入 */}
                    <LinkButton onClick = {this.logout}>退出</LinkButton>
                    </div>
                <div className = 'header-bottom'>
                    <div className='header-bottom-left'>{title}</div>
                    <div className='header-bottom-right'>
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="weather"/>
                        <span>{weather}</span>
                    </div>
                </div>
             </div>
         );
     }
 }
 export default withRouter(Header)