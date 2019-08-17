import React from 'react'
import PropTypes from 'prop-types'
import { Upload, Icon, Modal, message } from 'antd';
import { reqDeleteImg} from '../../api'


const BASE_URL = 'http://localhost:5000/upload/'
 function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends React.Component {
  //接受属性的声明,之前进行了标签的属性的传值
  static propTypes = {
    imgs:PropTypes.array
  }
  state = {
    previewVisible: false,//是否进行大图预览
    previewImage: '',//预览大图的url
    fileList: [],//上传的文件的列表
  };
  //将子组件的方法进行暴露，然后再父组件中得到子组件的对象，然后调用子组件的getImgs的方法
  //这样父组件就可以得到子组件的数据
  getImgs = () => {//取出fileList中每一个对象中的图片组成新的数组
    return this.state.fileList.map(
      file =>file.name
    )
  }
//隐藏大图的预览
  handleCancel = () => this.setState({ 
    previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };


//当进行文件上传或者删除时，文件状态发生改变是调用
//file代表当前操作的文件对象，fileList是所有的操作对象的集合
//file对象包含着uid,name,status,response,
  handleChange =async  ({ file,fileList }) => {
    if(file.status==='done'){
      file = fileList[fileList.length-1]//取出当前的
      const { name, url } = file.response.data
      file.name = name;
      file.url = url;
      
    }else if(file.status==='removed'){//删除界面上的
      //发送请求进行删除
      const result = await reqDeleteImg(file.name);
      if(result.status ===0){
        message.success("delete pic success")
      }
    }
    this.setState({ fileList })
  }
componentWillMount(){
  const imgs = this.props.imgs//标签属性进行的传值
  if(imgs && imgs.length>0){
    // 生成一个对象
    const fileList = imgs.map((img,index)=>({
      uid:-index,
      name:img,
      status:'done',
      url: BASE_URL+img,

    }))
    //更新状态
    this.setState({
      fileList
    })
  }
}
  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div >
        <Upload
          action="/manage/img/upload"//组件内部已经发好请求
          listType="picture-card"
          name = 'image'//指定发送请求的属性名，默认是file，本来是属性名是file类型
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {/* //限制上图的图片的数量 */}
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

