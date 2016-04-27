/**
 * AutoComplete demo
 */
import babelPolyfill from "babel-polyfill";  // enable es6 to es5 transform
import React from "react";
import ReactDom from "react-dom";
import moment from "moment";
import AutoComplete from "../../src/component/autocomplete/index.js";

let allOptions = [
  {selected: false, disabled: false, text: 'parent instance', value: document.getElementById("container") },
  {selected: false, disabled: false, text: 'jQuery instance', value: $ },
  {selected: false, disabled: false, text: 'AutoComplete class', value: AutoComplete },
  {selected: false, disabled: true, text: 'window', value: window },
  {selected: false, disabled: true, text: 'document', value: document },
  {selected: false, disabled: false, text: 'navigator.userAgent', value: navigator.userAgent },
  {selected: false, disabled: false, text: 'navigator.languages', value: navigator.languages },
  {selected: false, disabled: false, text: 'document.head', value: document.head },
  {selected: false, disabled: false, text: 'document.body', value: document.body },
  {selected: false, disabled: false, text: 'document.scripts', value: document.scripts },
  {selected: false, disabled: false, text: '$("body")', value: $("body") },
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
      .autocomplete-instance ul {
        margin-top: 0;
        width: 300px;
        max-height: 150px;
      }
      .autocomplete-instance .ui-form-autocomplete-datapane-option.ui-common_highlight {
        background: #ff0;
      }

      .autocomplete-instance .ui-form-autocomplete-datapane-option:before {
        content: " - ";
      }
      .autocomplete-instance .ui-form-autocomplete-datapane-option.ui-common_selected:before {
        content: " + ";
      }
      .autocomplete-instance .ui-form-autocomplete-datapane-option.ui-common_selected:after {
        content: "(selected)";
      }
      .autocomplete-instance .ui-form-autocomplete-datapane-option.ui-common_disabled {
        opacity: .5;
      }
      .autocomplete-instance .ui-form-autocomplete-datapane-option.ui-common_disabled:after {
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
                    onTextChange={ (evt) => {
                      // console.log('onChange Triggered:', evt);
                      example2.currentInput.text = evt.target.value;
                      example2.currentInput.value = evt.target.value;
                      runner();
                    } }
                    onSelect={ (evt) => {
                      console.log('onSelect Triggered:', evt);
                      const { selectedOptions } = evt;
                      example2.currentInput.text = selectedOptions[0].text;
                      example2.currentInput.value = selectedOptions[0].value;
                      example2.allOptions.forEach(i => i.selected = selectedOptions.some(i2 => i2 === i)); // reset allOptions to reflect selection status
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
                      const searchText = example2.currentInput.text;
                      example2.options = example2.allOptions.filter(i => (new RegExp(searchText, 'i')).exec(i.text));
                      runner();
                    } }
                    onDisableInputs={ (evt) => {
                      console.log('onDisableInput Triggered:', evt);
                      const { target } = evt;
                      const selectedOptions = example2.allOptions.filter(i=>i.selected);
                      if (selectedOptions.length) {
                        example2.currentInput.text = selectedOptions[0].text;
                        example2.currentInput.value = selectedOptions[0].value;
                      }
                      runner();
                    } } />
    </div>
  </div>, document.getElementById("container"));
}
runner();
