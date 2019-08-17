import storageUtils from "./storageUtils";

//这里是解决每次从文件中进行读取数据的缺点，存在内存中，方便读取
export default {
    user:storageUtils.getUser(),//用来存储登陆用户的信息，初始是local中的数据
    product:{},//初始值是空的对戏那个，显示的商品
}