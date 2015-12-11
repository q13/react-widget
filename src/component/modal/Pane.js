/**
 * Pane组件实现
 */
import {
    Widget
} from "../component.js";
import React from 'react';
import WidgetEx from './WidgetEx.js';

// 内容体组件
class Pane extends WidgetEx {
  static defaultProps = { ...Object.getPrototypeOf(Pane).defaultProps,
    prefixCls: 'ui-pane',
    classPaneOuter : 'ui-pane-outer',
    // version: '2015.12.10',
  };
  constructor(props) {
    super(props);
  }
  jsxElementToRender() {
    return (<div name="RCZPane" className={this.props.classPaneOuter} /*{...this.props}*/>
      {this.props.children}
    </div>);
  }
}

export default Pane;

