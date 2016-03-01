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
      currentOptions: [],
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
    const state = {};
    (nextProps.allOptions!==prevProps.allOptions) && (state.currentOptions = nextProps.allOptions);
    this.setState(state);
  }
  handleEnableInputs(e) {
    const self = this;
    self.setState({ isEditing : true }, ()=>{
      const domInput = self.refs.inputText;
      domInput.select();
      domInput.focus();
      if(self.props.onEnableInput) {
        self.props.onEnableInput.call(this, {
          target: self,
          currentOption: {
            text: self.props.text,
            value: self.props.value,
          },
        });
      }
      else {
        self.handleSearch(self.props.text);
      }
    });
  }
  handleInputBlur(e) {
    const self = this;
    if(!self.isMouseHover) { // Disable Inputs
      self.setState({ isEditing: false }, ()=>{
        if(self.props.onDisableInput) {
          self.props.onDisableInput.call(this, {
            target: self,
            currentOption: {
              text: self.props.text,
              value: self.props.value,
            },
          });
        }
        else {
        }
      });
    }
  }
  handleInputChange(e) {
    const self = this;
    self.props.onChange.call(this, {
      target: self,
      currentOption: {
        text: e.target.value,
        value: e.target.value,
      },
    });
    self.searchAvailableFrom = moment(moment() + self.props.minSearchInterval*1000)._d;
    self.searchTimeout = setTimeout(()=>{
      if(self.searchAvailableFrom<=moment()._d) {
        self.handleSearch(self.props.text);
        clearTimeout(self.searchTimeout);
      }
    }, self.props.minSearchInterval*1000);
  }
  handleEnterSearch(e) {
    // if(e.keyCode === 13)
    //     this.handleSearch(e.target.value);
  }
  handleSearch(text) {
    const self = this;
    if(!text || !text.trim || !(text=text.trim()) || (''+text).length<self.props.minLengthToSearch) return;
    if(self.props.onSearch) {
      self.props.onSearch.call(this, {
        target: self,
        searchText: ''+text,
      });
    }
    else {
      const currentOptions = self.props.allOptions.filter(itm => (new RegExp(text,'i')).exec(itm.text));
      self.setState({currentOptions: currentOptions});
    }
  }
  handleSelect(curOption) {
    const self = this;
    self.setState({
      isEditing: false,
    });
    self.props.onSelect.call(this, {
      target: self,
      selectedOption: curOption,
    });
  }
  render() {
    var props = this.props,
        state = this.state,
        prefixCls = props.prefixCls;
    return (<div className={`${prefixCls} ${props.className || ''} ${(state.isEditing ? `${prefixCls}-isediting` : '')}`}>
        <div className={`${prefixCls}-console`}
             onClick={ state.isEditing ? undefined : this.handleEnableInputs.bind(this) }>
          <input type="text" ref="inputText"
                 className={`${prefixCls}-console-text`}
                 value={props.text}
                 title={props.text}
                 onBlur={ this.handleInputBlur.bind(this) }
                 onChange={ this.handleInputChange.bind(this) } />
          <span className={`${prefixCls}-console-toggle`}>&nbsp;</span>
        </div>
        <div className={`${prefixCls}-dropdown`}
             style={{display: !state.isEditing ? 'none' : undefined}}
             onMouseEnter={(e)=>{ this.isMouseHover = true; }}
             onMouseLeave={(e)=>{ this.isMouseHover = false; }}>
          <ul className={`${prefixCls}-dropdown-items`}>
            {state.currentOptions.map((itm, x)=>
              (<li key={x} title={itm.text} onClick={ this.handleSelect.bind(this, itm) }>{itm.text}</li>))}
          </ul>
        </div>
    </div>);
  }
}
export default AutoComplete;
AutoComplete.defaultProps = {
  prefixCls: 'ui-form-autocomplete',
  className: '',
  text: '',
  value: null,
  allOptions: [],  // {text: '', value: {} }
  minLengthToSearch: 2,
  minSearchInterval: .5,
  onChange: () => {},
  onSelect: () => {},
  onSearch: undefined,  // Execute default search logic when value is undefined, otherwise value is a function to override this logic
  onEnableInput: undefined,  // Search props.text when value is undefined, otherwise value is a function to override this logic
  onDisableInput: undefined,  // Restore to initialText when value is undefined, otherwise value is a function to override this logic
};
