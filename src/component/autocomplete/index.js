/**
 * AutoComplete组件实现
 */
import {
  Widget
} from "../component.js";
import moment from 'moment';
import React from 'react';
import ReactDom from 'react-dom';
import style from './autocomplete.css';

class AutoComplete extends Widget {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      curText: '',
      curOptions: [],
    };
    this.searchAvailableFrom = moment()._d;
    this.searchTimeout = null;
  }
  componentWillMount() {
    this.proceedWillReceiveProps(this.props, {});
  }
  componentDidMount() {
  }
  componentWillUnmount() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = null;
  }
  componentWillReceiveProps(nextProps) {
    this.proceedWillReceiveProps(nextProps, this.props);
  }
  proceedWillReceiveProps(nextProps, prevProps) {
    this.setState({curText: nextProps.initialText});
  }
  handleEnableInputs(e) {
    const self = this;
    self.setState({ isEditing : true }, ()=>{
      const domInput = self.refs.inputText;
      domInput.select();
      domInput.focus();
      if(self.props.onEnableInput) {
        self.props.onEnableInput(self.state.curText, (curOptions)=>{
          self.setState({curOptions: curOptions});
        });
      }
      else {
        self.handleSearch(self.state.curText);
      }
    });
  }
  handleInputBlur(e) {
    const self = this;
    if(!self.isMouseHover) { // Disable Inputs
      self.setState({ isEditing: false }, ()=>{
        if(self.props.onDisableInput) {
          self.props.onDisableInput(self.state.curText, (curText)=>{
            self.setState({curText: curText});
          });
        }
        else {
          self.setState({curText: self.props.initialText});
        }
      });
    }
  }
  handleInputChange(e) {
    const self = this;
    self.searchAvailableFrom = moment(moment() + self.props.minSearchInterval*1000)._d;
    self.setState({curText: e.target.value}, ()=>{
      self.searchTimeout = setTimeout(()=>{
        if(self.searchAvailableFrom<=moment()._d) {
          self.handleSearch(self.state.curText);
          clearTimeout(self.searchTimeout);
        }
      }, self.props.minSearchInterval*1000);
    });
  }
  handleEnterSearch(e) {
    // if(e.keyCode === 13)
    //     this.handleSearch(e.target.value);
  }
  handleSearch(text) {
    const self = this;
    if(!text || !text.trim || !(text=text.trim()) || (''+text).length<self.props.minLengthToSearch) return;
    if(self.props.onSearch) {
      self.props.onSearch(''+text, (curOptions)=>{
        self.setState({curOptions: curOptions});
      });
    }
    else {
      const curOptions = self.props.initialOptions.filter(itm => (new RegExp(text,'i')).exec(itm.text));
      self.setState({curOptions: curOptions});
    }
  }
  handleSelect(curOption) {
    const self = this;
    self.setState({
      isEditing: false,
      curText: curOption.text,
    });
    self.props.onSelect(curOption);
  }
  render() {
    var props = this.props,
        state = this.state,
        prefixCls = props.prefixCls;
    return (<div className={`${prefixCls} ${props.className || ''}`}>
      <div className={`${prefixCls}-inputs`}>
        <div className={`${prefixCls}-inputs-console`}
             onClick={ state.isEditing ? undefined : this.handleEnableInputs.bind(this) }>
          {state.isEditing ?
            (<input type="text" ref="inputText"
                    className={`${prefixCls}-inputs-console-text`}
                    value={state.curText}
                    onBlur={ this.handleInputBlur.bind(this) }
                    onChange={ this.handleInputChange.bind(this) } />) :
            (<span className={`${prefixCls}-inputs-console-label`}
                   title={state.curText}
                   onClick={ this.handleEnableInputs.bind(this) }>
              {state.curText}
            </span>)}
          <span className={`${prefixCls}-inputs-console-toggle`}></span>
        </div>
        <div className={`${prefixCls}-inputs-dropdown`}
             style={{display: !state.isEditing ? 'none' : undefined}}
             onMouseEnter={(e)=>{ this.isMouseHover = true; }}
             onMouseLeave={(e)=>{ this.isMouseHover = false; }}>
          <ul className={`${prefixCls}-inputs-dropdown-items`}>
            {state.curOptions.map((itm, x)=>
              (<li key={x} title={itm.text} onClick={ this.handleSelect.bind(this, itm) }>{itm.text}</li>))}
          </ul>
        </div>
      </div>
    </div>);
  }
}
export default AutoComplete;
AutoComplete.defaultProps = {
  prefixCls: 'ui-form-autocomplete',
  className: '',
  initialText: '',
  initialOptions: [],  // {text: '', value: {} }
  minLengthToSearch: 2,
  minSearchInterval: .5,
  onSelect: () => {},
  onSearch: undefined,  // Once it is set initialOptions will not be used
  onEnableInput: undefined,  // Could be used to replace curOptions result
  onDisableInput: undefined,  // Could be used to replace curText result
};
