// 包含应用中所有接口的函数
//返回的都是promise的对象
import jsonp from 'jsonp'//axiios不能发jsonp
import ajax from './ajax'
import { message } from 'antd';
import { resolve } from 'url';

//请求登录的函数
const BASE = ''
//在后面多行语句的时候
export const reqLogin =(username,password)=>ajax.post(BASE+'/login',{username,password})
 // ajax({//返回的是promise的对象
    //     method:'post',
    //     url:BASE+'/login',
    //     data:{//有两种形式的传参://1;data是对象，默认使用json 的格式发送请求，2.a&b
    //         username,
    //         password
    //     }
    //     //data:qs.stringify({username,password})
    // })

     //将Ajax作为函数来使用，无论Ajax是作为函数使用还是作为对象使用，都是promise的语法，后面接then，

// const name = 'admin';
// const pwd = 'admin'
// reqLogin(name,pwd).then(result=>{
//     console.log("请求成功了",result)
// });
//发送jsonp请求得到天气的信息
export const reqWeather=(city)=>{

    return new Promise((resolve,reject)=>{//执行器函数，内部执行异步任务，成功调用resolve，
        //失败不调用reject(),直接提示，直接处理，
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`;
        jsonp(url,{},(error,data)=>{
            if(!error && data.error ===0){
                //这里是成功的登陆,提供天气的图片和天气的状况
               const {dayPictureUrl,weather}= data.results[0].weather_data[0]
                resolve({dayPictureUrl,weather});
            }else{//这里是失败的登陆
                message.error("获取天气失败")
            }
        })
    })
   
}

//获取分类列表
export const reqCategorys = ()=> ajax(BASE +'/manage/category/list')





//添加分类
export const reqAddCategorys = (categoryName) => ajax.post(BASE + '/manage/category/add',{
    categoryName:categoryName
})
//修改分类
export const reqUpdateCategorys = 
    ({
        categoryId,
        categoryName
    }) => ajax.post(BASE + '/manage/category/add', {
    categoryId,
    categoryName
})
//根据分类ID获取分类
export const reqCategory = (categoryId) => ajax("/manage/category/info", {
    params:{
        categoryId
    }
})
//请求的参数分为两种，jquery：路由：/login ,请求的path:/login?username=a&password=b

//param参数  路由：/login/:username/:username   请求的path：、login/a/b
//但是在配置Ajax的get请求的时候，带参数的形式只能是配置jquery的。
export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', {
    //这里配置的jquery的参数 ，只是名字起的不是很合理params 的参数只能配置在路径里面
    params:{
        pageNum,
        pageSize
    }
})

// 根据name或者desc来获取产品分类列表
export const reqSearchProducts = ({
    pageNum,
    pageSize,
    searchName,
    searchType,//二选一  produceName或者是productDesc
}) => ajax(BASE + '/manage/product/search',{
    params:{
        pageNum,
        pageSize,
        [searchType]:searchName,//当参数的类型不确定的时候，
    }
})
//对商品进行上架或者下架的操作
export const reqUpdateStatus = 
    (productId,
    status) =>
    ajax(BASE + '/manage/product/updateStatus',{
        method:'POST',
        data:{
        productId,
        status,
        }
    })
    //根据商品的ID发送请求
    export const reqProduct = (productId) => ajax.get('/manage/product/info', {
        params:{
            productId
        }
    })
    //将商品的信息提交
    export const reqSubmitProduct = ({
            name,
            desc,
            price,
            categoryId
        }) => ajax.get('/manage/product/update', {
        params:{
            name, desc, price, categoryId
        }
    })
    //删除图片
    export const reqDeleteImg = (name) => ajax.post('/manage/img/delete',{name})

    //添加或者更新商品根据id是否有数值
    export const reqAddUpdateProduct = (product) => ajax.post(
        BASE + '/manage/product/'+(product._id?'update':'add'),
        product
    )
