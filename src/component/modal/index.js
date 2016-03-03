/**
 * Modal组件实现
 */
import {
    Widget
} from "../component.js";
import React from 'react';
import ReactDOM from 'react-dom';
import Dialog from './Dialog.js';
import './index.css';

let eventNSId = 0;
let instances = [];
const $maskEl = $('<div class="ui-modal-mask"></div>');

// 模式对话框组件
class Modal extends Widget {
  constructor(props) {
    super(props);
    this.state = {
      parentWidth: $(window).width(),
      parentHeight: $(window).height(),
      needPositioning: true,
    };
    this.eventNSId = eventNSId++;
    this.$containerNonLocal = null;
  }
  componentWillMount() {
  }
  componentDidMount() {
    $(window).on('resize.Modal' + this.eventNSId, (evt)=>{
      this.handleResize.call(this);
    });
    this.handleResize(); // trigger repositioning
    this.forceUpdate(); // for calling componentDidUpdate
  }
  componentWillReceiveProps(nextProps) {
  }
  componentDidUpdate(prevProps, prevState) {
    if(false == this.props.isLocal) {
      if(!this.$containerNonLocal) { // 如果尚未创建global container
        this.$containerNonLocal = $('<div style="position:absolute;left:0;top:0;"></div>');
        this.$containerNonLocal.appendTo($(document.body));
      }
      ReactDOM.render(this.getJsxToRender(), this.$containerNonLocal[0], ()=>{
        this.proceedDidUpdate(prevProps, prevState, this.props, this.state);
      });
    }
    else
      this.proceedDidUpdate(prevProps, prevState, this.props, this.state);
  }
  proceedDidUpdate(prevProps, prevState, nextProps, nextState) {
    if(!this.props.visible && prevProps.visible) {
      this.setState({needPositioning: true});
    }
    if(this.props.visible && this.state.needPositioning) {
      const $dialog = $(`.${this.props.prefixCls}-dialog`, (this.$containerNonLocal&& this.$containerNonLocal[0]) || ReactDOM.findDOMNode(this))
      let dialogOffsets = $dialog.offset(),
          width = isNaN(parseInt(this.props.width)) ? $dialog.width() : this.props.width,
          height = isNaN(parseInt(this.props.height)) ? $dialog.height() : this.props.height,
          winScrollLeft = $(window).scrollLeft(),
          winScrollTop = $(window).scrollTop(),
          winHeight = $(window).height(),
          parentLeftOffset = 0,
          parentTopOffset = 0,
          parentWinWidth = this.state.parentWidth,
          parentWinHeight = this.state.parentHeight;
      const styleTmpl = {};
      styleTmpl.position = 'absolute';
      if(false == this.props.isLocal) {
        if(this.props.centerFixed) { // fixed position/centerFixed only applies to non-local dialogs
          styleTmpl.position = 'fixed';
        }
        else {
          parentLeftOffset = winScrollLeft;
          parentTopOffset = winScrollTop;
        }
      }
      else {
        parentWinHeight = Math.min(parentWinHeight, winHeight+winScrollTop-dialogOffsets.top);
      }
      // 将组件位置居中
      styleTmpl.left = parentLeftOffset + (parentWinWidth-width)/2;
      styleTmpl.top = parentTopOffset + (parentWinHeight<height ? 0 : (parentWinHeight-height)/2);
      $dialog.css(styleTmpl);
      this.setState({needPositioning: false});
    }
    this.updateMask(this.props.visible);
  }
  componentWillUnmount() {
    if(this.$containerNonLocal && this.$containerNonLocal.length) {
      ReactDOM.unmountComponentAtNode(this.$containerNonLocal[0]);
      this.$containerNonLocal.remove();
    }
    $(window).off('resize.Modal' + this.eventNSId);
    this.$containerNonLocal = null;
    this.eventNSId = null;
    instances && (instances = instances.filter((x)=>(x!=this)));
    instances && instances[0] && instances[0].forceUpdate(); // enable its mask if there is any

    if(this.props.onBeforeDestroy)
      this.props.onBeforeDestroy(this);
  }
  updateMask(propsVisible) {
    if(propsVisible) {
      instances = [...new Set([this, ...instances])]; // map in the instance to array
    }
    else {
      instances = instances.filter((x)=>(x!=this)); // map out the instance from array
    }
    if(instances && instances[0]) {
      const $instanceContainer = instances[0].props.isLocal ? $(ReactDOM.findDOMNode(instances[0])).parent() : instances[0].$containerNonLocal;
      $('.ui-modal-mask-container', $instanceContainer).empty().append($maskEl);
      const $parentContainer = instances[0].props.isLocal ? $instanceContainer : $(window);
      this.setupMaskStyle($maskEl, $parentContainer);
      // $parentContainer.resize(this.setupMaskStyle($maskEl, $parentContainer));
    }
    else {
      $maskEl.remove();
    }
  }
  setupMaskStyle($maskEl, $parentContainer) {
    var myStyle = {};
    if($parentContainer[0] === window) {
      myStyle = {
        position: 'fixed',
        left: '0',
        top: '0',
        width: $(window).width() + 'px',
        height: $(window).height() + 'px',
      };
    }
    else {
      // const valPosition = $parentContainer.css('position')=='absolute' ? 'absolute' : 'relative';
      if($parentContainer.css('position')=='static') $parentContainer.css('position', 'relative');
      myStyle = {
        position: 'absolute',
        left: '0',
        top: '0',
        width: $parentContainer.outerWidth() + 'px',
        height: $parentContainer.outerHeight() + 'px',
      };
    }
    $maskEl.css(myStyle);
  }
  handleResize() {
    if(false == this.props.isLocal) {
      this.setState({
        parentWidth: $(window).width(),
        parentHeight: $(window).height(),
        needPositioning: true,
      });
    }
    else {
      const $parentContainer = $(ReactDOM.findDOMNode(this)).parent();
      this.setState({
        parentWidth: $parentContainer.outerWidth(),
        parentHeight: $parentContainer.outerHeight(),
        needPositioning: true,
      });
    }
  }
  getJsxToRender() {
    const props = this.props;
    let jsxElement = <div></div>;
    const {prefixCls, className, isLocal, centerFixed, width, height, visible, paneType, onClickClose, onClickSubmit, onBeforeDestroy, ...otherProps} = this.props;
    const styleTmpl = {};
    styleTmpl.width = width;
    styleTmpl.height = height;

    let jsxPane = null;
    switch(props.paneType) {
      case Modal.PaneType.Popup:
        jsxPane = (<Dialog {...otherProps} prefixCls={props.prefixCls+'-dialog'} hasTitleBar={false} hasActionBar={false}
                      styleTmpl={styleTmpl} onClickClose={props.onClickClose} onClickSubmit={props.onClickSubmit} />);
        break;
      case Modal.PaneType.Dialog:
        jsxPane = (<Dialog {...otherProps} prefixCls={props.prefixCls+'-dialog'}
                      styleTmpl={styleTmpl} onClickClose={props.onClickClose} onClickSubmit={props.onClickSubmit} />);
        break;
      default: break;
    }
    if(true || props.visible) {
      const classNameString = [...new Set([props.prefixCls, ...(props.className||'').split(' ')])].join(' ');
      jsxElement = (<div name="RCZModal" className={classNameString} style={{display: props.visible ? 'block' : 'none'}}>
        <div className="ui-modal-mask-container"></div>
        {jsxPane}
      </div>)
    }
    return jsxElement;
  }
  render() {
    // return this.getJsxToRender();
    return this.props.isLocal ? this.getJsxToRender() : null;
  }
}
Modal.PaneType = {
  Popup: Symbol(),
  Dialog: Symbol(),
};
Modal.defaultProps = {
  prefixCls: 'ui-modal',
  className: '', // ui-dialog-outer||ui-popup-outer
  isLocal: false,
  centerFixed: true,
  width: 600,
  height: 600,
  visible: true,
  paneType: Modal.PaneType.Dialog,
  hasTitleBar: undefined,
  hasActionBar: undefined,
  title: undefined,
  closeText: undefined,
  submitText: undefined,
  onClickClose: ()=>{},
  onClickSubmit: ()=>{},
  // onBeforeMount : ()=>{},
  // onAfterMount : ()=>{},
  onBeforeDestroy : ()=>{},
};
Dialog.propTypes = {
  prefixCls: React.PropTypes.string,
  className: React.PropTypes.string,
  isLocal: React.PropTypes.bool,
  centerFixed: React.PropTypes.bool,
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  visible: React.PropTypes.bool,
  // paneType: React.PropTypes.symbol,
  // hasTitleBar: undefined,
  // hasActionBar: undefined,
  // title: undefined,
  // closeText: undefined,
  // submitText: undefined,
  onClickClose: React.PropTypes.func,
  onClickSubmit: React.PropTypes.func,
  // onBeforeMount : React.PropTypes.func,
  // onAfterMount : React.PropTypes.func,
  onBeforeDestroy : React.PropTypes.func,
};

export default Modal;
