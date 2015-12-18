/**
 * Popup组件实现
 */
import {
    Widget
} from "../component.js";
import React from 'react';
import Pane from './Pane.js';

// 基本弹框组件
class Popup extends Pane {
  static defaultProps = { ...Object.getPrototypeOf(Popup).defaultProps,
    prefixCls: 'ui-popup',
    classPopupOuter : 'ui-popup-outer',
    classPaneOuter : 'ui-popup-pane-outer',
    // version: '2015.12.10',
  };
  constructor(props) {
    super(props);
  }
  jsxElementToRender() {
    const {classPopupOuter, ...otherProps} = this.props;
    const classNameString = [...new Set([this.props.classPopupOuter, ...(this.props.className||'').split(' ')])].join(' ');
    return (<div name="RCZPopup" className={classNameString} style={this.props.styleTmpl}>
      {this.renderCustom(otherProps, super.jsxElementToRender)}
    </div>);
  }
}

export default Popup;

