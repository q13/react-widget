/**
* @Date:   2016-09-13T19:05:50+08:00
* @Last modified time: 2016-10-12T17:50:45+08:00
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
import PropTypes from "prop-types";
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
  plainUpload() {
    const props = this.props;
    const state = this.state;
    const prefixCls = props.prefixCls;
    var self = this;
    var ifrEl = $(`${prefixCls}-ifr`);
    var form = this.refs.form;
    var filePath = state.filePath;
    if (!ifrEl.length) {
      ifrEl = $(`<iframe name="upload-result-iframe" class="${prefixCls}-ifr"/>`);
      ifrEl.css({
        position: 'absolute',
        top: '-10000px',
        left: '-10000px'
      }).appendTo('body');
    }
    form.setAttribute('target', 'upload-result-iframe');
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
            if (props.autoReset) {
              this.setState({
                filePath: ''
              }, () => {
                props.onChange('');
              });
            }
          } else {
            self.setState({
              filePath: ''
            }, () => {
              props.onChange('');
            });
            props.onFailure(responseData);
          }
        } catch(evt) {
          self.setState({
            filePath: ''
          }, () => {
            props.onChange('');
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
  ajaxUpload() {
    const props = this.props;
    var requestData = props.requestData || {};
    var fileSelector = this.refs.fileSelector;
    var files = fileSelector.files;
    var promiseStore = [];
    var index = 0;
    if (files.length) {
      while(index < files.length) {
        promiseStore.push(new Promise(function (resolve, reject) {
          var formData = new FormData();
          var fileName = files[index].name;
          formData.append(props.fieldName, files[index]);
          Object.keys(requestData).forEach((k) => {
            formData.append(k, requestData[k]);
          });
          $.ajax({
            url: props.url,
            type: 'POST',
            dataType: 'json',
            cache: false,
            data: formData,
            processData: false,
            contentType: false
          }).done(function(responseData) {
            if (responseData.flag) {
              resolve(responseData.data);
            } else {
              reject(responseData);
            }
          }).fail(function(responseData) {
            reject({
              flag: 0,
              message: fileName + '上传失败'
            });
          });
        }));
        index++;
      }
      Promise.all(promiseStore).then((successDataList) => {
        props.onSuccess(successDataList.length === 1 ? successDataList[0] : successDataList);
        if (props.autoReset) {
          this.setState({
            filePath: ''
          }, () => {
            props.onChange('');
          });
        }
      }).catch((data) => {
        this.setState({
          filePath: ''
        }, () => {
          props.onChange('');
        });
        props.onFailure({
          flag: 0,
          message: data.message
        });
      });
    }
  }
  uploadShell() {
    const props = this.props;
    props.onStart();  //可以用来通知外界
    if (Uploader.isSupportFileApi()) {
      this.ajaxUpload();
    } else {
      this.plainUpload();
    }
  }
  upload() {
    if (this.state.filePath) {
      this.uploadShell();
    }
  }
  handleChange(evt) {
    const props = this.props;
    let value = evt.target.value;
    let files = evt.target.files;
    let validateParams = [];
    let filesResultPromiseList = [];
    if (files) {
      let i = 0;
      while(i < files.length) {
        validateParams.push(files[i].name);
        if (window.FileReader) {
          filesResultPromiseList.push(new Promise(function (resolve, reject) {
            let fr = new FileReader();
            fr.onload = function (evt) {
              resolve(evt.target.result);
            };
            fr.onerror = function (err) {
              reject(err);
            };
            fr.readAsDataURL(files[i]);
          }));
        }
        i++;
      }
    } else {
      validateParams = value.split(',');
    }
    if (props.onValidate(validateParams) !== false) {
      if (props.autoUpload) {  //自动上传
        this.setState({
          filePath: value
        }, () => {
          if (filesResultPromiseList.length) {
            Promise.all(filesResultPromiseList).then(function (results) {
              if (results.length === 1) {
                results = results[0];
              }
              props.onChange(value, results);
            }).catch(function () {
              props.onChange(value);
            });
          } else {
            props.onChange(value);
          }
          this.uploadShell();
        });
      } else {
        this.setState({
          filePath: value
        }, () => {
          if (filesResultPromiseList.length) {
            Promise.all(filesResultPromiseList).then(function (results) {
              props.onChange(value, results);
            }).catch(function () {
              props.onChange(value);
            });
          } else {
            props.onChange(value);
          }
        });
      }
    } else {
      this.setState({
        filePath: ''
      });
    }
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
        <input type="file" ref="fileSelector" value={state.filePath} accept={props.accept} name={props.fieldName} className={`${prefixCls}-file`} multiple={props.multiple} onChange={this.handleChange.bind(this)} />
        {!requestData ? null :
            Object.keys(requestData).map((i,x)=>
                (<input type="hidden" key={x} name={i} value={requestData[i]} />))}
      </form>
      <div className={`${prefixCls}-handler`}>{props.children}</div>
    </div>);
  }
}
Uploader.isSupportFileApi = function () {
  //判断是否支持FormData对象
  if (window.FormData) {
    return true;
  } else {
    return false;
  }
};
Uploader.propTypes = {
  requestData: PropTypes.object,
  url: PropTypes.string,
  text: PropTypes.string,
  fieldName: PropTypes.string,
  accept: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
  onStart: PropTypes.func,
  onProgress: PropTypes.func,
  onSuccess: PropTypes.func,
  onFailure: PropTypes.func
};
Uploader.defaultProps = {
  prefixCls: 'ui-uploader',
  className: '',
  requestData: {},
  autoUpload: true,  //自定上传
  width: 'auto',
  height: 'auto',
  fieldName: 'file',
  accept: '*',
  multiple: false,
  autoReset: false, //true表示在成功上传后清空file
  onValidate: () => {}, //返回false表示未通过验证，不会进行提交
  onChange: () => {},
  onStart: () => {},
  onProgress: () => {},
  onSuccess: () => {},
  onFailure: () => {}
};

export default Uploader;
