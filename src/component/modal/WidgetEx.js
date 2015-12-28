/**
 * WidgetEx组件实现
 */
import {
    Widget
} from "../component.js";
import React from 'react';
import ReactDOM from 'react-dom';

class ZComHelper {
  // 被管理组件实例容器的容器
  static __maintainedCOMsRenderRepo = null;

  constructor(...args) {
  }

  // 获取被管理组件实例容器的容器
  static GetMaintainedCOMsRenderRepo() {
    return ZComHelper.__maintainedCOMsRenderRepo ||
      (ZComHelper.__maintainedCOMsRenderRepo = document.body.appendChild(document.createElement('div')));
  }

  static fnComLog(com, msg) {
    var info_isMaintainedRender = !com.props ? '' : com.props.isMaintainedRender ? 'MaintainedCOM' : 'OrdinaryCOM';
    if(info_isMaintainedRender==='MaintainedCOM') return;

    location && location.search && (((queryArr)=>{
      (queryArr.filter(x=>(x=x.split('='))&&x[0]==='debug'&&x[1]==='1').length>0) &&
        console.log(`Instance of ${com.__rczid} ${com.constructor.name}: ${msg} :${info_isMaintainedRender}`);
    })(location.search.slice(1).split('&')));
  }

  static getWindowWidth() {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  }
  static getWindowHeight() {
    // return "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  }
}

class WidgetEx extends Widget {
  static defaultProps = { // cannot be inherited...
    version: '2015.12.09',
    isMaintainedRender: false,
  };
  constructor(props) {
    super(props);
    // 被管理容器
    this.maintainedRenderContainer = null;
    // 被管理实例
    this.maintainedInstance = null;
    // 实例之唯一标识id(内部使用)
    this.__rczid = new Date().getTime();
    // 日志输出(调试使用)
    ZComHelper.fnComLog(this, 'Constructed');
  }
  componentWillMount() {
    ZComHelper.fnComLog(this, 'Mounting');
  }
  componentDidMount() {
    if(this.props.isMaintainedRender) {
      // 创建被管理容器
      this.maintainedRenderContainer = ZComHelper.GetMaintainedCOMsRenderRepo().appendChild(document.createElement('div'));
      this.forceUpdate();
    }
    ZComHelper.fnComLog(this, 'Mounted');
  }
  componentWillReceiveProps() {
    ZComHelper.fnComLog(this, 'Receiving Props');
  }
  componentWillUpdate() {
    ZComHelper.fnComLog(this, 'Updating');
  }
  componentDidUpdate() {
    if(this.props.isMaintainedRender) {
      // 渲染至被管理容器
      this.maintainedInstance = ReactDOM.render(
        React.createElement(this.constructor, {...this.props, isMaintainedRender:false}),
        this.maintainedRenderContainer);
    }
    ZComHelper.fnComLog(this, 'Updated');
  }
  componentWillUnmount() {
    ZComHelper.fnComLog(this, 'Unmounting');
    if(this.props.isMaintainedRender) {
      // 销毁被管理实例与被管理容器
      ReactDOM.unmountComponentAtNode(this.maintainedRenderContainer);
      ZComHelper.GetMaintainedCOMsRenderRepo().removeChild(this.maintainedRenderContainer);
    }
  }
  // 将被渲染至本实例的jsxElement，如果为被管理实例则渲染空内容
  render() {
    return this.props.isMaintainedRender ? <div /> : this.jsxElementToRender();
  }
  // 获取ZComHelper实例
  static getZComHelper(allCOMsContainer) {
    return ZComHelper;
  }
  // 将被渲染的jsxElement，如果为被管理实例则此方法不被调用
  jsxElementToRender() {
    return null;
  }
  // 获取被实际渲染的实例
  getInstanceForRender() {
    return this.props.isMaintainedRender ? this.maintainedInstance : this;
  }
  // 避免super RCZCom获取与自身无关的props/state
  renderCustom(myProps, myRender) {
    let thisProps, thisState, jsxElement;
    ([thisProps, this.props] = [this.props, myProps]);
    ([jsxElement, this.props] = [myRender.apply(this), thisProps]);
    return jsxElement;
  }
}

export default WidgetEx;
