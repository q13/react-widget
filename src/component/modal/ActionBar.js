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
    actionContent : '行动栏',
    // version: '2015.12.10',
  };
  constructor(props) {
    super(props);
  }
  jsxElementToRender() {
    return (<div name="RCZActionBar" className={this.props.classActionBarOuter}>
      {this.props.actionContent}
    </div>);
  }
}

export default ActionBar;

