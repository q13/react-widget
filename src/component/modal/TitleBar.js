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
    title : '标题栏',
    onClickClose : ()=>{},
    // version: '2015.12.10',
  };
  constructor(props) {
    super(props);
  }
  jsxElementToRender() {
    return (<div name="RCZTitleBar" className={this.props.classTitleBarOuter}>
      <div className="cmdbutton float-right" onClick={this.props.onClickClose}>×</div>
      <div title={this.props.title}>{this.props.title}</div>
    </div>);
  }
}

export default TitleBar;

