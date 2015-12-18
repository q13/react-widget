/**
 * Mask组件实现
 */
import {
    Widget
} from "../component.js";
import React from 'react';
import ReactDOM from 'react-dom';
import WidgetEx from './WidgetEx.js';

// 遮罩层组件
class Mask extends WidgetEx {
  static defaultProps = { ...Object.getPrototypeOf(Mask).defaultProps,
    prefixCls: 'ui-mask',
    classMaskOuter : 'ui-mask-outer',
    // version: '2015.12.10',
  };
  constructor(props) {
    super(props);
  }
  // 获取页面统一遮罩层组件静态实例
  static getStaticInstance() {
    return StaticMask.staticInstance || (StaticMask.staticInstance = ReactDOM.render(<StaticMask />,
      WidgetEx.getZComHelper().GetMaintainedCOMsRenderRepo().appendChild(document.createElement('div'))));
  }
  jsxElementToRender() {
    return (<div name="RCZMask" className={this.props.classMaskOuter}>
    </div>);
  }
}

// 静态遮罩组件
class StaticMask extends Mask {
  // 页面统一遮罩层组件静态实例
  static staticInstance = null;
  // 放置遮罩层静态实例之组件列表：array索引值与该组件z轴位置成反比
  static comMaskHosts = [];
  constructor(props) {
    super(props);
  }
  componentDidUpdate() {
    // 将遮罩层静态实例放入可放置组件列表中第一个组件即z轴顶层：StaticMask.comMaskHosts[0]
    let comMaskHosts, comMaskHost, MaskReservedContainer;
    (comMaskHosts = StaticMask.comMaskHosts) &&
      (comMaskHost = comMaskHosts[0]) &&
      (MaskReservedContainer = comMaskHost.refs.MaskReservedContainer) && ((()=>{
        // MaskReservedContainer.appendChild(this.comContainer);
        MaskReservedContainer.appendChild(ReactDOM.findDOMNode(this).parentNode);
      })());
  }
  // 将目标组件映射入遮罩层放置组件列表
  mapInContainer(comMaskHost) {
    StaticMask.comMaskHosts = [...new Set([comMaskHost, ...StaticMask.comMaskHosts])];
    this.forceUpdate();
  }
  // 将目标组件从遮罩层放置组件列表中移除
  mapOutContainer(comMaskHost) {
    StaticMask.comMaskHosts = StaticMask.comMaskHosts.filter((x)=>(x!=comMaskHost));
    this.forceUpdate();
  }
}

export default Mask;

