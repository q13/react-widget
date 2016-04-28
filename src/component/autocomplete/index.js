/**
 * AutoComplete组件实现
 */
import {
  Widget
} from "../component.js";
import moment from 'moment';
import React from 'react';
import ReactDom from 'react-dom';
import Dropdown from '../form/Dropdown.js';
import style from './autocomplete.css';

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}
class AutoComplete extends Dropdown {
  constructor(props) {
    super(props);

    this.searchAvailableFrom = moment()._d;
    this.searchTimeout = null;
  }
  handleTextChange(evt) {
    const self = this;
    // 更新props文本内容
    self.props.onTextChange.call(self, evt);
    // 设定focus状态以及执行回调
    self.setState({
      focusOption: undefined,
    }, () => {
      self.searchAvailableFrom = moment(moment() + self.props.searchInterval * 1000)._d;
      self.searchTimeout = setTimeout(() => {
        if (self.searchAvailableFrom <= moment()._d) {
          self.handleTextSearch(evt.target.value);
          clearTimeout(self.searchTimeout);
        }
      }, self.props.searchInterval * 1000);
    });
  }
  handleTextSearch(text) {
    const self = this;
    text = escapeRegExp('' + text || '').trim();
    if (text.length && text.length < self.props.searchMinLength) return;
    if (self.props.onTextSearch) {
      self.props.onTextSearch.call(this, {
        searchText: text,
      });
    }
  }
  render() {
    const props = this.props;
    const state = this.state;
    const prefixCls = props.prefixCls;

    const text = state.focusOption ? state.focusOption.text :
                 props.text !== undefined ? props.text :
                 (props.options.find(i => i.selected) || {text: '--请选择--'}).text;
    return (<div className={ `${prefixCls} ${prefixCls}-${this.instanceId} ${props.className || ''} ${(state.isEditing ? `${prefixCls}-isediting` : '')}` }>
      <div className={ `${prefixCls}-console` }
           onClick={ state.isEditing ? undefined : this.handleEnableInputs.bind(this) }>
        <input type="text" ref="inputText"
               className={ `${prefixCls}-console-text` }
               value={ text }
               title={ text }
               onChange={ this.handleTextChange.bind(this) }
               readOnly={ false } />
        <span className={ `${prefixCls}-console-toggle` }>&nbsp;</span>
      </div>
    </div>);
  }
}
export default AutoComplete;
AutoComplete.defaultProps = {
  prefixCls: 'ui-form-autocomplete',
  className: '',
  options: [], // {text: '', value: {}, selected: false, disabled: false }
  onChange: (evt) => {},
  text: '',
  searchMinLength: 2,
  searchInterval: .5,
  onTextChange: (evt) => {},
  onTextSearch: undefined, // Execute when a text search is required - parameter: {searchText: ''}
  onEnableInputs: (evt) => {}, // Execute when Component is switched to editing state (ie. isEditing === true) - parameter: {target: Component}
  onDisableInputs: (evt) => {}, // Execute when Component is switched off editing state (ie. isEditing === false) - parameter: {target: Component}
  getTemplateDatapane: Dropdown.defaultGetTemplateDatapane,
};
