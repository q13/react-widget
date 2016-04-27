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
    this.state = {};

    this.searchAvailableFrom = moment()._d;
    this.searchTimeout = null;
  }
  handleTextChange(evt) {
    const self = this;
    // self.setState({isEditing: true});
    self.props.onTextChange.call(self, evt);
    self.searchAvailableFrom = moment(moment() + self.props.searchInterval * 1000)._d;
    self.searchTimeout = setTimeout(() => {
      if (self.searchAvailableFrom <= moment()._d) {
        self.handleTextSearch(evt.target.value);
        clearTimeout(self.searchTimeout);
      }
    }, self.props.searchInterval * 1000);
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

    return (<Dropdown prefixCls={ prefixCls || undefined }
                      className={ props.className || undefined }
                      options={ props.options }
                      onSelect={ props.onSelect.bind(this) }
                      text={ props.text }
                      // value={ props.value }
                      textReadOnly={ false }
                      onTextChange={ this.handleTextChange.bind(this) }
                      onEnableInputs={ props.onEnableInputs.bind(this) }
                      onDisableInputs={ props.onDisableInputs.bind(this) } />);
  }
}
export default AutoComplete;
AutoComplete.defaultProps = {
  prefixCls: 'ui-form-autocomplete',
  className: '',
  options: [], // {text: '', value: {}, selected: false, disabled: false }
  onSelect: (evt) => {},
  text: '',
  // value: null,
  searchMinLength: 2,
  searchInterval: .5,
  onTextChange: (evt) => {},
  onTextSearch: undefined, // Execute when a text search is required - parameter: {searchText: ''}
  onEnableInputs: (evt) => {}, // Execute when Component is switched to editing state (ie. isEditing === true) - parameter: {target: Component}
  onDisableInputs: (evt) => {}, // Execute when Component is switched off editing state (ie. isEditing === false) - parameter: {target: Component}
};
