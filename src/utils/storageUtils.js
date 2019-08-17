//操作local数据中的工具函数模块
import store from 'store'//引入github中的库，兼容性更好
const USER_KEY = 'user_key'
export default{
    saveUser(user){//保存数据到localStorage
        //localStorage.setItem(USER_KEY,JSON.stringify(user))
        store.set(USER_KEY,user)
    },
    getUser(){//读取localStorage的user中的数据并且返回该数据的id，找不到返回{}
       // return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
       return store.get(USER_KEY) || {}//store.get(USER_KEY)这里是将返回值解析好的，如果不存在返回的是null
    },
    removeUser(){
       // localStorage.removeItem(USER_KEY)
       store.remove(USER_KEY)
    },
}