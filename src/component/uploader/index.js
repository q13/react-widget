/**
* @Date:   2016-06-17T14:29:19+08:00
* @Last modified time: 2016-07-12T20:00:21+08:00
*/

/**
 * Uploader
 * @require Jquery
 */
import {
  Widget
} from "../component.js";
import React from 'react';
import ReactDom from 'react-dom';
import style from './uploader.css';

class Uploader extends Widget {
  constructor(props) {
    super(props);
    this.state = {
      filePath: ''
    };
  }
  componentDidMount() {}
  componentWillUnmount() {}
  upload() {
    const props = this.props;
    const state = this.state;
    const prefixCls = props.prefixCls;
    const self = this;
    var ifrEl = $(`${prefixCls}-ifr`),
    form = this.refs.form;
    if (!ifrEl.length) {
      ifrEl = $(`<iframe name="upload-result-iframe" class="${prefixCls}-ifr"/>`);
      ifrEl.css({
        position: 'absolute',
        top: '-10000px',
        left: '-10000px'
      }).appendTo('body');
    }
    form.setAttribute('target', 'upload-result-iframe');
    let filePath = state.filePath;
    if (filePath) { //有值的情况下才会上传
      ifrEl[0].onload = function() {
        var responseText = $(ifrEl[0].contentWindow.document.body).text(),
          responseData;
        try {
          responseData = JSON.parse(responseText);
          ifrEl[0].onload = null;
          ifrEl.remove(); //每次都重新创建
          if (responseData.flag) {
            props.onSuccess(responseData.data);
          } else {
            self.setState({
              filePath: ''
            });
            props.onFailure(responseData);
          }
        } catch(evt) {
          self.setState({
            filePath: ''
          });
          props.onFailure({
            flag: 0,
            message: evt.message
          });
        }
      };
      form.submit();
    }
  }
  handleChange(evt) {
    const props = this.props;
    this.setState({
      filePath: evt.target.value
    }, () => {
      if (props.autoUpload) {  //自动上传
        this.upload();
      }
    });
  }
  render() {
    const props = this.props;
    const state = this.state;
    const prefixCls = props.prefixCls;
    var requestData = props.requestData;

    return (<div className={ `${prefixCls} ${props.className || ''}`} style={{
        width: props.width,
        height: props.height
      }}>
      <form className={`${prefixCls}-form`} action={props.url} ref="form" method="post" encType="multipart/form-data">
        <input type="file" value={state.filePath} accept={props.accept} name={props.fieldName} className={`${prefixCls}-file`} onChange={this.handleChange.bind(this)} />
        {!requestData ? null :
            Object.keys(requestData).map((i,x)=>
                (<input type="hidden" key={x} name={i} value={requestData[i]} />))}
      </form>
      <div className={`${prefixCls}-handler`}>{props.children}</div>
    </div>);
  }
}
Uploader.propTypes = {
  requestData: React.PropTypes.object,
  url: React.PropTypes.string,
  text: React.PropTypes.string,
  fieldName: React.PropTypes.string,
  accept: React.PropTypes.string,
  className: React.PropTypes.string,
  onProgress: React.PropTypes.func,
  onSuccess: React.PropTypes.func,
  onFailure: React.PropTypes.func
};
Uploader.defaultProps = {
  prefixCls: 'ui-uploader',
  className: '',
  autoUpload: true,  //自定上传
  requestData: null,  //默认上传参数
  width: 'auto',
  height: 'auto',
  fieldName: 'file',
  accept: '*',
  onProgress: () => {},
  onSuccess: () => {},
  onFailure: () => {}
};

export default Uploader;
