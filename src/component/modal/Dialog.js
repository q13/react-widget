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
    const titleBarProps = {
      title: this.props.title,
      onClickClose: this.props.onClickClose,
    };
    const actionbarProps = {
      closeText: this.props.closeText,
      submitText: this.props.submitText,
      actionContent: this.props.actionContent,
      onClickClose: this.props.onClickClose,
      onClickSubmit: this.props.onClickSubmit,
    };
    let jsxTitlebar = !this.props.hasTitleBar ? null : (<TitleBar {...titleBarProps} />);
    let jsxActionbar = !this.props.hasActionBar ? null : (<ActionBar {...actionbarProps} />);
    const classNameString = [...new Set([this.props.classDialogOuter, ...(this.props.className||'').split(' ')])].join(' ');
    return (<div name="RCZDialog" className={classNameString} style={this.props.styleTmpl}>
      {this.renderCustom(otherProps, super.jsxElementToRender)}
      {jsxActionbar}
      {jsxTitlebar}
    </div>);
  }
}

export default Dialog;

