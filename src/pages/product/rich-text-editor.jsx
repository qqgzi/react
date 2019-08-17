import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { EditorState, convertToRaw ,ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import _ from 'lodash'//暴露的是_
//额外的引入
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

export default class RichTextEditor extends Component {
  static propTypes = {
    detail:PropTypes.string//接受传递值
  }
  state = {
    editorState: EditorState.createEmpty(),
  }

  onEditorStateChange = _.debounce((editorState) => {//防抖的操作_.debounce（）返回I的是防抖的函数
    this.setState({
      editorState,
    });
  },500)

 uploadImageCallBack = (file)=> {
  return new Promise(
    (resolve, reject) => {//执行器函数
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/manage/img/upload');
      xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
      const data = new FormData();
      data.append('image', file);//这里是指定的上传的文件的名字
      xhr.send(data);
      xhr.addEventListener('load', () => {
        const response = JSON.parse(xhr.responseText);//response 是响应的的参数体{status：0，data：{}}
        resolve(response);
      });
      xhr.addEventListener('error', () => {
        const error = JSON.parse(xhr.responseText);
        reject(error);
      });
    }
  );
}

componentWillMount(){
  //取出
  const detail = this.props.detail;
  if (detail) {
    //根据detail生成那个框editorState
    const contentBlock = htmlToDraft(detail);
    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
    const editorState = EditorState.createWithContent(contentState);
    //更新state
    this.setState({
      editorState
    })
  }
}

getDetail = ()=>draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          editorStyle={{ height: 200, border:'1px solid black',paddingLeft:10}}
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{
            
            image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
          }}
        />
        
        {/* <textarea
          disabled
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        /> */}
      </div>
    );
  }
}