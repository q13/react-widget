/**
* @Date:   2016-08-24T13:57:16+08:00
* @Last modified time: 2016-08-24T16:38:45+08:00
*/

/**
 * AutoComplete组件实现
 */
import {
  Widget
} from "../component.js";
import moment from 'moment';
import React from 'react';
import ReactDom from 'react-dom';
import PropTypes from "prop-types";
import Dropdown from '../form/Dropdown.js';
import style from './autocomplete.css';

function escapeRegExp(text) {
  return text.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
class AutoComplete extends Dropdown {
  constructor(props) {
    super(props);
    this.queryTid = null;
  }
  handleTextChange(evt) {
    const props = this.props;
    let text = escapeRegExp(evt.target.value.trim());
    this.setState({
      text: evt.target.value
    }, () => {
      // 更新props文本内容
      clearTimeout(this.queryTid);
      if (text.length >= props.minQueryLength) {
        this.queryTid = setTimeout(() => {
          props.onTextChange.call(this, text);
        }, props.delayQueryTime);
      } else {
        props.onOptionsChange([]);
        this.nextTick(() => {
          props.onTextChange.call(this, text);
        });
      }
    });
  }
  render() {
    const props = this.props;
    const state = this.state;
    const prefixCls = props.prefixCls;
    //渲染面板
    if (Dropdown.activeInstanceId === this.instanceId) {
      setTimeout(() => {
        Dropdown.renderPanel(this);
      }, 0);
    }
    let cls = props.disabled
      ? prefixCls + '-disabled'
      : '';
    let stateCls = (Dropdown.activeInstanceId === this.instanceId && state.panelStyle.display === 'block') ? `${prefixCls}-state-active ${Dropdown.defaultProps.prefixCls}-state-active` : '';
    return (
      <span className={`${prefixCls} ${prefixCls}-${this.instanceId} ${props.className} ${cls} ${stateCls}`}>
        <input type="text" className={`${prefixCls}-input-text ${Dropdown.defaultProps.prefixCls}-input-text`} value={state.text} title={state.text} onKeyDown={this.handleInputKeydown.bind(this)} onClick={this.handleInputClick.bind(this)} onChange={this.handleTextChange.bind(this)} placeholder={props.placeholder} /><span className={`${prefixCls}-input-icon ${Dropdown.defaultProps.prefixCls}-input-icon`}></span>
      </span>
    );
  }
}
AutoComplete.propTypes = Object.assign({
  onTextChange: PropTypes.func,
  minQueryLength: PropTypes.number,
  delayQueryTime: PropTypes.number
}, Dropdown.propTypes);

AutoComplete.defaultProps = Object.assign({
  onTextChange: () => {}
}, Dropdown.defaultProps, {
  prefixCls: 'ui-form-autocomplete',
  minQueryLength: 1, //最小查询长度
  delayQueryTime: 600,
  autoSelectFirstOption: false
});

export default AutoComplete;
