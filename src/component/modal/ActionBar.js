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
    onClickSubmit : ()=>{},
    onClickClose : ()=>{},
    // version: '2015.12.10',
  };
  constructor(props) {
    super(props);
  }
  jsxElementToRender() {
    const jsxActionContent = this.props.actionContent ||
      <div style={{textAlign:'center'}}>
        <button className="ui-modal-btn-submit" onClick={this.props.onClickSubmit}>确定</button>
        &nbsp;
        <button className="ui-modal-btn-cancel" onClick={this.props.onClickClose}>取消</button>
      </div>;

    return (<div name="RCZActionBar" className={this.props.classActionBarOuter}>
      {jsxActionContent}
    </div>);
  }
}

export default ActionBar;

