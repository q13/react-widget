/**
 * ActionBar组件实现
 */
import {
    Widget
} from "../component.js";
import React from 'react';
import WidgetEx from './WidgetEx.js';

// 行动栏组件
class ActionBar extends WidgetEx {
  static defaultProps = { ...Object.getPrototypeOf(ActionBar).defaultProps,
    prefixCls: 'ui-actionbar',
    classActionBarOuter : 'ui-actionbar-outer',
    // actionContent : '行动栏',
    actionContent : undefined,
    onOKClick : ()=>{},
    onCancelClick : ()=>{},
    // version: '2015.12.10',
  };
  constructor(props) {
    super(props);
  }
  jsxElementToRender() {
    const jsxActionContent = this.props.actionContent ||
      <div style={{textAlign:'center'}}>
        <button onClick={this.props.onOKClick}>确定</button> <button onClick={this.props.onCancelClick}>取消</button>
      </div>;

    return (<div name="RCZActionBar" className={this.props.classActionBarOuter}>
      {jsxActionContent}
    </div>);
  }
}

export default ActionBar;

