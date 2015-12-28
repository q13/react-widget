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
    closeText: '取消',
    submitText: '确定',
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
        <button className="ui-modal-btn-cancel" onClick={this.props.onClickClose}>{this.props.closeText}</button>
        <span className="btn-separater"></span>
        <button className="ui-modal-btn-submit" onClick={this.props.onClickSubmit}>{this.props.submitText}</button>
      </div>;

    return (<div name="RCZActionBar" className={this.props.classActionBarOuter}>
      {jsxActionContent}
    </div>);
  }
}

export default ActionBar;
