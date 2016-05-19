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
    this.state = {};
  }
  componentDidMount() {}
  componentWillUnmount() {}
  uploadFile() {
    var props = this.props,
      prefixCls = props.prefixCls;
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
    form.setAttribute('target', 'upload-result-iframe')

    ifrEl[0].onload = function() {
      var responseText = $(ifrEl[0].contentWindow.document.body).text(),
        responseData = JSON.parse(responseText);
      ifrEl[0].onload = null;
      if (responseData.flag) {
        props.onSuccess(responseData.data);
      } else {
        props.onFailure(responseData);
      }
    };
    form.submit();
  }
  handleChange() {
    if (this.props.autoUpload) {  //自动上传
      this.uploadFile();
    }
  }
  render() {
    const props = this.props;
    const state = this.state;
    const prefixCls = props.prefixCls;
    var additionalRequestParams = props.additionalRequestParams;

    return (<div className={ `${prefixCls} ${props.className || ''}`} style={{
        width: props.width,
        height: props.height
      }}>
      <form className={`${prefixCls}-form`} action={props.url} ref="form" method="post" encType="multipart/form-data">
        <input type="file" name={props.fieldName} className={`${prefixCls}-file`} onChange={this.handleChange.bind(this)} />
        {!additionalRequestParams ? null : 
            Object.keys(additionalRequestParams).map((i,x)=>
                (<input type="hidden" key={x} name={i} value={additionalRequestParams[i]} />))}
      </form>
      <div className={`${prefixCls}-handler`}>{props.children}</div>
    </div>);
  }
}
Uploader.propTypes = {
  additionalRequestParams: React.PropTypes.object,
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
  width: 'auto',
  height: 'auto',
  fieldName: 'file',
  accept: '*',
  onProgress: () => {},
  onSuccess: () => {},
  onFailure: () => {}
};

export default Uploader;

