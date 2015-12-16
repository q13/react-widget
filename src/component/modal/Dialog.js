/**
 * Dialog组件实现
 */
import {
    Widget
} from "../component.js";
import React from 'react';
import TitleBar from './TitleBar.js';
import ActionBar from './ActionBar.js';
import Pane from './Pane.js';

// 对话框组件
class Dialog extends Pane {
  static defaultProps = { ...Object.getPrototypeOf(Dialog).defaultProps,
    prefixCls: 'ui-dialog',
    classDialogOuter : 'ui-dialog-outer',
    classPaneOuter : 'ui-dialog-pane-outer',
    hasTitleBar: true,
    hasActionBar: true,
    // version: '2015.12.10',
  }
  constructor(props) {
    super(props);
  }
  jsxElementToRender() {
    const {classDialogOuter, hasTitleBar, hasActionBar, title, actionContent, ...otherProps} = this.props;
    let jsxTitlebar = !this.props.hasTitleBar ? null : (<TitleBar 
      title={this.props.title} 
      onCloseClick={this.props.onClose} />);
    let jsxActionbar = !this.props.hasActionBar ? null : (<ActionBar 
      actionContent={this.props.actionContent} onCancelClick={this.props.onClose} />);
    return (<div name="RCZDialog" className={this.props.classDialogOuter} style={this.props.styleTmpl}>
      {this.renderCustom(otherProps, super.jsxElementToRender)}
      {jsxActionbar}
      {jsxTitlebar}
    </div>);
  }
}

export default Dialog;

