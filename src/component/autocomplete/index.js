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
      foundItems: [],
      isEditing: false,
      textValue: '',
    };
  }
  componentWillMount() {
    this.setState({textValue: this.props.initialValue});
  }
  componentDidMount() {
  }
  componentWillUnmount() {
  }
  handleEnableInputs(e) {
    const self = this;
    self.setState({ isEditing : true }, ()=>{
      self.props.onStartInputs && self.props.onStartInputs(self);
      const domInput = self.refs.inputText;
      domInput.select();
      domInput.focus();
      self.handleSearch(self.state.textValue);
    });
  }
  handleInputBlur(e) {
    const self = this;
    if(!self.isMouseHover) { // Disable Inputs
      self.setState({
        isEditing: false,
        textValue: self.props.initialValue,
      }, ()=>{
        self.props.onCancelInputs && self.props.onCancelInputs(self);
      });
    }
  }
  handleInputChange(e) {
    const self = this;
    self.setState({textValue: e.target.value}, ()=>{
      self.handleSearch(self.state.textValue);
    });
  }
  handleEnterSearch(e) {
    // if(e.keyCode === 13)
    //     this.handleSearch(e.target.value);
  }
  handleSearch(value) {
    const self = this;
    if(!value || (''+value).length<self.props.minLengthToSearch) return;
    self.props.onSearch(''+value, (data)=>{
      const foundItems = [];
      data.forEach((itm) => {
        foundItems.push({ dataParams: itm, text: itm['label'] });
      });
      self.setState({foundItems: foundItems});
    }, (err)=>{
      console.log('failed to search: ' + err);
    });
  }
  handleSelect(dataParams) {
    const self = this;
    self.props.onSelect(dataParams, (textValue)=>{
      self.setState({
        isEditing: false,
        textValue: textValue,
      });
    }, (err)=>{
      console.log('failed to select: ' + err);
    });
  }
  render() {
    var props = this.props,
        state = this.state,
        prefixCls = props.prefixCls;
    return (<div className={`${prefixCls} ${props.className || ''}`}>
      <div className={`${prefixCls}-label`} style={{display: state.isEditing ? 'none' : undefined}}
       onClick={ this.handleEnableInputs.bind(this) }>
        {state.textValue}
      </div>
      <div ref="divInputs" className={`${prefixCls}-inputs`} style={{display: !state.isEditing ? 'none' : undefined}}
       onMouseEnter={(e)=>{ this.isMouseHover = true; }} onMouseLeave={(e)=>{ this.isMouseHover = false; }}>
        <div>
          <input type="text" ref="inputText" className={`${prefixCls}-inputs-text`}
           value={state.textValue}
           onBlur={ this.handleInputBlur.bind(this) }
           onChange={ this.handleInputChange.bind(this) } />
        </div>
        <div className={`${prefixCls}-inputs-dropdown`}>
          <ul className={`${prefixCls}-inputs-dropdown-items`}>
            {state.foundItems.map((itm, x)=>
              (<li key={x} onClick={ this.handleSelect.bind(this, itm.dataParams) }>{itm.text}</li>))}
          </ul>
        </div>
      </div>
    </div>);
  }
}
export default AutoComplete;
AutoComplete.defaultProps = {
  initialValue: '',
  minLengthToSearch: 2,
  onSelect: () => {},
  onSearch: () => {},
  onStartInputs: () => {},
  onCancelInputs: () => {},
  prefixCls: "ui-form-autocomplete"
};
