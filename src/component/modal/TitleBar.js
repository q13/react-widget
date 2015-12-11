/**
 * TitleBar组件实现
 */
import {
    Widget
} from "../component.js";
import React from 'react';
import WidgetEx from './WidgetEx.js';

// 标题栏组件
class TitleBar extends WidgetEx {
  static defaultProps = { ...Object.getPrototypeOf(TitleBar).defaultProps,
    prefixCls: 'ui-titlebar',
    classTitleBarOuter : 'ui-titlebar-outer',
    titleContent : '标题栏',
    onClose : ()=>{},
    // version: '2015.12.10',
  };
  constructor(props) {
    super(props);
  }
  jsxElementToRender() {
    return (<div name="RCZTitleBar" className={this.props.classTitleBarOuter}>
      <div className="cmdbutton float-right" onClick={this.props.onClose}>×</div>
      <div>{this.props.titleContent}</div>
    </div>);
  }
}

export default TitleBar;

