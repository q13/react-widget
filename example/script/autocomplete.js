/**
 * AutoComplete demo
 */
import babelPolyfill from "babel-polyfill";  // enable es6 to es5 transform
import React from "react";
import ReactDom from "react-dom";
import { AutoComplete } from "../../index.js";

let allOptions = [
  {selected: false, disabled: false, text: 'parent instance', value: document.getElementById("container").toString() },
  {selected: false, disabled: false, text: 'jQuery instance', value: $.toString() },
  {selected: false, disabled: false, text: 'AutoComplete class', value: AutoComplete.toString() },
  {selected: false, disabled: true, text: 'window', value: window.toString() },
  {selected: false, disabled: true, text: 'document', value: document.toString() },
  {selected: false, disabled: false, text: 'navigator.userAgent', value: navigator.userAgent.toString() },
  {selected: false, disabled: false, text: 'navigator.languages', value: navigator.languages.toString() },
  {selected: false, disabled: false, text: 'document.head', value: document.head.toString() },
  {selected: false, disabled: false, text: 'document.body', value: document.body.toString() },
  {selected: false, disabled: false, text: 'document.scripts', value: document.scripts.toString() },
  {selected: false, disabled: false, text: '$("body")', value: $("body").toString() },
  {selected: false, disabled: false, text: `* RegExp characters: a.b*c+d?e^f$g{h}i(j)k|l[m]n\\ escaped`, value: undefined },
];
const example2 = {
  currentInput: {text: 'click me to start Case-Sensitive search with all options listed initially', value: 'out of scope value 2'},
  options: allOptions, // search result list
  allOptions: $.extend(true, [], allOptions), // search through list
};
function runner () {
  ReactDom.render(<div>
    <style dangerouslySetInnerHTML={ {__html: `
      .autocomplete-instance input[type=text] {
        width: 400px;
      }
      .autocomplete-instance .ui-form-autocomplete-datapane-options {
        background: #ccc;
        margin-top: 0;
        width: 300px;
        max-height: 150px;
        overflow-y: auto;
      }
      .autocomplete-instance .ui-form-autocomplete-datapane-option:before {
        content: " - ";
      }
      .autocomplete-instance .ui-form-autocomplete-datapane-option.ui-common-hover {
        background: #ff0;
      }
      .autocomplete-instance .ui-form-autocomplete-datapane-option.ui-common-focus {
        background: #0f0;
      }
      .autocomplete-instance .ui-form-autocomplete-datapane-option.ui-common-selected:before {
        content: " + ";
      }
      .autocomplete-instance .ui-form-autocomplete-datapane-option.ui-common-selected:after {
        content: "(selected)";
      }
      .autocomplete-instance .ui-form-autocomplete-datapane-option.ui-common-disabled {
        opacity: .5;
      }
      .autocomplete-instance .ui-form-autocomplete-datapane-option.ui-common-disabled:after {
        content: "(disabled)";
      }
    `} } />
    <div>
      Available Text Options:<br/>
      { allOptions.map((i,x) => <div key={x}> - {i.text}</div>) }
      &nbsp;<br/>
    </div>
    <div style={{display: 'inline-block'}}>
      Customized use:<br/>
      <AutoComplete className="autocomplete-instance autocomplete-custom"
                    text={ example2.currentInput.text }
                    value={ example2.currentInput.value }
                    options={ example2.options }
                    searchMinLength={ 3 }
                    searchInterval={ .2 }
                    getTemplateDatapane={ (self) => {
                      return (<div className={ `${self.props.prefixCls}-datapane-options` }>
                        <div><b>Customized AutoComplete Datapane:</b></div>
                        {
                          self.props.options.map((option, x, options) =>
                          (<div key={x} title={ option.text }
                                className={ self.getOptionClass(x) }
                                onClick={ self.handleOptionClick.bind(self, x) }
                                onMouseEnter={ (e)=>{ self.setState({hoverOption: options[x]}); } }
                                onMouseLeave={ (e)=>{ self.setState({hoverOption: undefined}); } }>
                            { option.text }
                          </div>))
                        }
                      </div>);
                    } }
                    onTextChange={ (evt) => {
                      // console.log('onTextChange Triggered:', evt);
                      const newText = evt.target.value;
                      example2.currentInput = { text: newText, value: newText};
                      runner();
                    } }
                    onOptionsChange={ (options) => {
                      console.log('onChange Triggered:', evt);
                      // const { options } = evt;
                      const selectedOption = options.find(i => i.selected);
                      example2.currentInput = $.extend(true, {}, selectedOption);
                      example2.options = options; // reset options to reflect selection status
                      runner();
                    } }
                    onTextSearch={ (evt) => {
                      const { searchText } = evt;
                      console.log('onSearch Triggered:', searchText);
                      example2.options = example2.allOptions.filter(i => (new RegExp(searchText, 'i')).exec(i.text));
                      runner();
                    } }
                    onEnableInputs={ (evt) => {
                      console.log('onEnableInput Triggered:', evt);
                      const { target } = evt;
                      const searchText = '';
                      example2.options = example2.allOptions.filter(i => (new RegExp(searchText, 'i')).exec(i.text));
                      runner();
                    } }
                    onDisableInputs={ (evt) => {
                      console.log('onDisableInput Triggered:', evt);
                      const { target } = evt;
                      const newText = evt.target.refs.inputText.value;
                      example2.currentInput = { text: newText, value: newText};
                      runner();
                    } } />
    </div>
  </div>, document.getElementById("container"));
}
runner();
