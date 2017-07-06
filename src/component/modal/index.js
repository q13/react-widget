/**
* @Date:   2016-06-24T13:59:13+08:00
* @Last modified time: 2016-11-16T16:45:45+08:00
*/

import {Widget} from "../component.js";
import React from 'react';
import ReactDom from 'react-dom';
import PropTypes from "prop-types";
import Dnd from '../dnd/index.js';
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
    this.dnd && this.dnd.destroy();
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
    const props = this.props;
    const container = this.container;
    modalIndex++;
    //存起来
    modalStore.push({"index": modalIndex, "modal": this});
    this.index = modalIndex;
    this.zIndex = 1;
    //初始化后调整一次
    if (this.props.visible) {
      this.forceUpdate(() => {
        //定位到一个footer里的第一个button
        //$(`.${props.prefixCls}-footer button`, this.container)[0].focus();
        this.adjustPosition();
      });
    }
  }
  componentWillReceiveProps() {}
  componentWillUpdate() {}
  componentDidUpdate(prevProps) {
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
      "zIndex": Modal.BASE_Z_INDEX + this.zIndex,
      "position": props.centerFixed ? 'fixed' : 'absolute',
      "top": 0,
      "left": 0,
      width: props.width,
      height: props.height
    };
    if (props.visible && props.visible !== prevProps.visible) {
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
    let appearAnimateCls = (style.display === 'block' ? `${prefixCls}-transition-appear` : '');
    ReactDom.render(
      <div className={`${prefixCls} ${props.className} ${appearAnimateCls}`} style={style}>
      {props.customTemplate
        ? props.children
        : <div className={`${prefixCls}-inner`}>
          {props.title ? <div className={`${prefixCls}-header`}>
            <h3 className={`${prefixCls}-title`}>{props.title}</h3>
            {props.closeOption === 'visible' ? <span className={`${prefixCls}-close-btn`} onClick={this.handleCloseClick.bind(this)}>&times;</span> : null}
          </div> : null}
          <div className={`${prefixCls}-body`}>
            {props.children}
          </div>
          <div className={`${prefixCls}-footer`}>
            {props.submitOption === 'visible' ? <button type="button" className="btn-submit" onClick={this.handleSubmitClick.bind(this)}>{props.submitText}</button> : null}
            {props.submitOption === 'visible' && props.closeOption === 'visible' ? <span>&nbsp;&nbsp;&nbsp;</span> : null}
            {props.closeOption === 'visible' ? <button type="button" className="btn-close" onClick={this.handleCloseClick.bind(this)}>{props.closeText}</button> : null}
            {/*<div className="footer-l">
              <div className="footer-l-inner">
                <button type="button" className="btn-submit" onClick={this.handleSubmitClick.bind(this)}>确&nbsp;认</button>
              </div>
            </div>
            <div className="footer-r">
              <div className="footer-r-inner">
                <button type="button" className="btn-close" onClick={this.handleCloseClick.bind(this)}>取&nbsp;消</button>
              </div>
            </div>*/}
          </div>
        </div>}
    </div>, container[0], () => {
      //重设位置
      if (!prevProps.visible && props.visible) {
        this.adjustPosition();
      }
      //调整层级和遮罩
      Modal.ajustModalZIndex();
      //初始化dnd
      this.initailDndEffect();
    });
  }
  render() {
    const props = this.props;
    if (props.isLocal) {  //局部modal

    } else {  //全局modal
      return false;
    }
  }
  initailDndEffect() {
    const props = this.props;
    const container = this.container;
    if (!props.isLocal) {
      this.dnd = new Dnd($(`.${props.prefixCls}`, container), {
        container: $('body'),
        limit: true,
        handler: `.${props.prefixCls}-title`
      });
    }
  }
  adjustPosition() {
    const props = this.props;
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
        ? (winH - modalH) / 2 - 30 + (props.centerFixed ? 0 : winTop) + "px"
        : (2 + 'px'),
      "left": winW > modalW
        ? (winW - modalW) / 2 + (props.centerFixed ? 0 : winLeft) + "px"
        : 0
    });
  }
  handleSubmitClick() {
    var props = this.props;
    props.onSubmitClick.call(this);
  }
  handleCloseClick() {
    var props = this.props;
    props.onVisibleChange.call(this, false);
    props.onCloseClick.call(this);
  }
}

Modal.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  isLocal: PropTypes.bool,
  centerFixed: PropTypes.bool,
  width: PropTypes.any,
  height: PropTypes.any,
  visible: PropTypes.bool,
  title: PropTypes.string,
  ddSelector: PropTypes.string,
  closeText: PropTypes.string,
  submitText: PropTypes.string,
  submitOption: PropTypes.string,
  closeOption: PropTypes.string,
  onVisibleChange: PropTypes.func,
  onCloseClick: PropTypes.func,
  onSubmitClick: PropTypes.func
};
Modal.defaultProps = {
  prefixCls: 'ui-modal',
  className: '', // ui-dialog-outer||ui-popup-outer
  isLocal: false,
  centerFixed: false,
  width: 600,
  height: 600,
  visible: false,
  title: '',
  ddSelector: '.ui-modal-header', //被拖拽DOM选择符
  closeText: '取消',
  submitText: '确定',
  submitOption: 'visible',  //hidden or visible
  closeOption: 'visible',
  onVisibleChange: () => {},
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
      "zIndex": Modal.BASE_Z_INDEX + modalVisible.length
    }).show();
    //调整各modal z-index
    modalVisible.forEach((itemData) => {
      var modal = itemData.modal,
        container = modal.container;
      if (container) {
        $(`.${prefixCls}`, container).css({"zIndex": Modal.BASE_Z_INDEX + itemData.modal.zIndex});
      }
    });
  } else {
    mask.hide();
  }
};
Modal.BASE_Z_INDEX = 10000;

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
