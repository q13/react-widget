/**
* @Date:   2016-06-24T13:59:13+08:00
* @Last modified time: 2016-06-27T11:44:25+08:00
*/

import {Widget} from "../component.js";
import React from 'react';
import ReactDom from 'react-dom';
import uiStyle from './index.css';

//渲染到body下
var dm,
  mask,
  maskTid,
  modalIndex = -1,
  modalStore = [];

/**
 * Modal component define
 */
class Modal extends Widget {
  constructor(props) {
    super(props);
    //初始state值
    //this.state = {
    //"display": "none"
    //};
  }
  componentWillUnmount() {
    var this_ = this;
    //干掉存储
    modalStore = modalStore.filter((itemData) => itemData.index !== this.index);
    this.index = null;
    this.zIndex = null;
    if (this.container) {
      ReactDom.unmountComponentAtNode(this.container[0]);
      this.container.remove();
      this.container = null;
      //调整层级和遮罩
      Modal.ajustModalZIndex();
    }
  }
  componentWillMount() {}
  componentDidMount() {
    modalIndex++;
    //存起来
    modalStore.push({"index": modalIndex, "modal": this});
    this.index = modalIndex;
    this.zIndex = 1;
    //初始化后调整一次
    if (this.props.visible) {
      this.forceUpdate();
    }
  }
  componentWillReceiveProps() {}
  componentWillUpdate() {}
  componentDidUpdate() {
    var container = this.container,
      props = this.props,
      atIndex = -1,
      tempModalStore,
      style;
    var prefixCls = props.prefixCls;

    if (!container) {
      container = $('<div></div>');
      container.appendTo(dm);
      this.container = container;
    }
    style = {
      "display": props.visible
        ? "block"
        : "none",
      "zIndex": this.zIndex,
      "position": props.centerFixed ? 'fixed' : 'absolute',
      "top": 0,
      "left": 0,
      width: props.width,
      height: props.height
    };
    if (props.visible) {
      if (modalStore.length > 1) {
        tempModalStore = modalStore.filter((itemData, i) => {
          if (itemData.index !== this.index) {
            return true;
          } else {
            atIndex = i;
          }
        });
        tempModalStore.push(modalStore[atIndex]);
        modalStore = tempModalStore;
      }
    }
    ReactDom.render(
      <div className={`${prefixCls} ${props.className}`} style={style}>
      {props.customTemplate
        ? props.children
        : <div className={`${prefixCls}-inner`}>
          <div className={`${prefixCls}-header`}>
            <h3 className={`${prefixCls}-title`}>{props.title}</h3>
            <span className={`${prefixCls}-close-btn`} onClick={this.handleCloseClick.bind(this)}>&times;</span>
          </div>
          <div className={`${prefixCls}-body`}>
            {props.children}
          </div>
          <div className={`${prefixCls}-footer`}>
            <div className="footer-l">
              <div className="footer-l-inner">
                <button type="button" className="btn-submit" onClick={this.handleSubmitClick.bind(this)}>确&nbsp;认</button>
              </div>
            </div>
            <div className="footer-r">
              <div className="footer-r-inner">
                <button type="button" className="btn-close" onClick={this.handleCloseClick.bind(this)}>取&nbsp;消</button>
              </div>
            </div>
          </div>
        </div>}
    </div>, container[0], () => {
      //重设位置
      this.adjustPosition();
      //调整层级和遮罩
      Modal.ajustModalZIndex();
    });
  }
  render() {
    const props = this.props;
    if (props.isLocal) {  //局部modal

    } else {  //全局modal
      return false;
    }
  }
  adjustPosition() {
    var container = this.container,
      modal = $(`.${this.props.prefixCls}`, container),
      modalH = modal.outerHeight(),
      modalW = modal.outerWidth(),
      win = $(window),
      winH = win.height(),
      winW = win.width(),
      winTop = win.scrollTop(),
      winLeft = win.scrollLeft();
    modal.css({
      "top": winH > modalH + 30
        ? (winH - modalH) / 2 - 30 + winTop + "px"
        : (2 + 'px'),
      "left": winW > modalW
        ? (winW - modalW) / 2 + winLeft + "px"
        : 0
    });
  }
  handleSubmitClick() {
    var props = this.props;
    props.onSubmitClick.call(this);
  }
  handleCloseClick() {
    var props = this.props;
    props.onCloseClick.call(this);
  }
}

Modal.propTypes = {
  prefixCls: React.PropTypes.string,
  className: React.PropTypes.string,
  isLocal: React.PropTypes.bool,
  centerFixed: React.PropTypes.bool,
  width: React.PropTypes.any,
  height: React.PropTypes.any,
  visible: React.PropTypes.bool,
  onCloseClick: React.PropTypes.func,
  onSubmitClick: React.PropTypes.func
};
Modal.defaultProps = {
  prefixCls: 'ui-modal',
  className: '', // ui-dialog-outer||ui-popup-outer
  isLocal: false,
  centerFixed: false,
  width: 600,
  height: 600,
  visible: true,
  title: '',
  closeText: '',
  submitText: '',
  onCloseClick: () => {},
  onSubmitClick: () => {}
};

let prefixCls = Modal.defaultProps.prefixCls;
/**
 * 自动调整弹框层级
 * @return {[type]} [description]
 */
Modal.ajustModalZIndex = function() {
  var modalVisible = modalStore.filter((itemData) => {
    return itemData.modal.props.visible;
  });
  modalVisible.forEach((itemData, i) => {
    var zIndex = i + 1;
    if (i === modalVisible.length - 1) { //给mask留出位置
      zIndex++;
    }
    itemData.modal.zIndex = zIndex;
  });
  if (modalVisible.length) {
    mask.css({
      "zIndex": modalVisible.length
    }).show();
    //调整各modal z-index
    modalVisible.forEach((itemData) => {
      var modal = itemData.modal,
        container = modal.container;
      if (container) {
        $(`.${prefixCls}`, container).css({"zIndex": itemData.modal.zIndex});
      }
    });
  } else {
    mask.hide();
  }
};

//初始化弹框容器和遮罩
dm = $(`<div class="${prefixCls}-manager"></div>`);
dm.html(`<div class="${prefixCls}-mask" style="display: none;"></div>`);
dm.prependTo('body');
mask = $(`.${prefixCls}-mask`, dm);
$(window).on('resize.dm', function() {
  clearTimeout(maskTid);
  maskTid = setTimeout(function() {
    if (mask.is(':visible')) {
      modalStore.forEach((itemData) => {
        var modal = itemData.modal;
        if (modal.props.visible) {
          modal.adjustPosition();
        }
      });
    }
  }, 60);
}); //暴露给外部

export default Modal;
