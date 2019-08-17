//封装的能发Ajax的函数
import axios from 'axios'
import qs from 'qs';
import {message} from 'antd'
//请求拦截器是在真正的发送请求之前进行的
//添加请求拦截器,将json的字符串（POST的格式）的格式转为a&b的形式，就是传递一个字符串加工方便使用
axios.interceptors.request.use(function(config){
    const {method,data} = config
    //处理POST请求,将data对象转化为参数格式字符串
    if(method.toLowerCase() === 'post' && typeof data ==='object'){
        config.data = qs.stringify(data);
    }


    return config;
})
//添加响应拦截器，在请求成功之后且我们指定的请求回调函数执行执行，
axios.interceptors.response.use(function(response){
    return response.data;//将response交给我们指定的真正的回调函数的response使用，就是在真正的回调函数执行执行，对response进行加工

},function(error){//return new Promise统一处理所有出错的情况，中断promise链，
   message.error('请求出错'+error.message)
    return new Promise(()=>{ })
})


export default axios;