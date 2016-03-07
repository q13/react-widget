/**
 * AutoComplete demo
 */
import babelPolyfill from "babel-polyfill";  // enable es6 to es5 transform
import React from "react";
import ReactDom from "react-dom";
import moment from "moment";
import AutoComplete from "../../src/component/autocomplete/index.js";

let availableOptions = [
  {text: 'parent instance', value: document.getElementById("container") },
  {text: 'jQuery instance', value: $ },
  {text: 'AutoComplete class', value: AutoComplete },
  {text: 'window', value: window },
  {text: 'document', value: document },
  {text: 'navigator.userAgent', value: navigator.userAgent },
  {text: 'navigator.languages', value: navigator.languages },
  {text: 'document.head', value: document.head },
  {text: 'document.body', value: document.body },
  {text: 'document.scripts', value: document.scripts },
  {text: '$("body")', value: $("body") },
  {text: `* RegExp characters: a.b*c+d?e^f$g{h}i(j)k|l[m]n\\ escaped`, value: undefined },
];
const example1 = {
  inputOption: {text: 'click me to start Case-Insensitive text search', value: 'out of scope value 1'},
  allOptions: availableOptions,
};
const example2 = {
  initialOption: {text: 'click me to start Case-Sensitive search with all options listed initially', value: 'out of scope value 2'},
  inputOption: {text: 'click me to start Case-Sensitive search with all options listed initially', value: 'out of scope value 2'},
  allOptions: availableOptions,
};
function runner () {
  ReactDom.render(<div>
    <style>
    {`
      .autocomplete-instance input[type=text] {
        width: 400px;
      }
      .autocomplete-instance li.highlight {
        background: #ff0;
      }
      .autocomplete-instance ul {
        margin-top: 0;
        width: 300px;
        max-height: 150px;
      }
    `}
    </style>
    <div>
      Available Text Options:<br/>
      { availableOptions.map((i,x) => <div key={x}> - {i.text}</div>) }
      &nbsp;<br/>
    </div>
    <div style={{display: 'inline-block'}}>
      Typical use:<br/>
      <AutoComplete className="autocomplete-instance autocomplete-typical"
                    text={ example1.inputOption.text }
                    value={ example1.inputOption.value }
                    allOptions={ example1.allOptions }
                    minLengthToSearch={ 3 }
                    minSearchInterval={ .2 }
                    onChange={ (evt) => {
                      const {target, currentOption} = evt;
                      example1.inputOption.text = currentOption.text;
                      runner();
                    } }
                    onSelect={ (evt) => {
                      const {target, selectedOption} = evt;
                      example1.inputOption.text = selectedOption.text;
                      example1.inputOption.value = selectedOption.value;
                      runner();
                    } } />
    </div>
    <div style={{display: 'inline-block'}}>
      Customized use:<br/>
      <AutoComplete className="autocomplete-instance autocomplete-custom"
                    text={ example2.inputOption.text }
                    value={ example2.inputOption.value }
                    allOptions={ example2.allOptions }
                    minLengthToSearch={ 3 }
                    minSearchInterval={ .2 }
                    onChange={ (evt) => {
                      console.log('onChange Triggered:', evt);
                      const {target, currentOption} = evt;
                      example2.inputOption.text = currentOption.text;
                      runner();
                    } }
                    onSelect={ (evt) => {
                      console.log('onSelect Triggered:', evt);
                      const {target, selectedOption} = evt;
                      example2.inputOption.text = selectedOption.text;
                      example2.inputOption.value = selectedOption.value;
                      example2.initialOption.text = selectedOption.text;
                      example2.initialOption.value = selectedOption.value;
                      runner();
                    } }
                    onSearch={ (evt) => {
                      console.log('onSearch Triggered:', evt);
                      const {target, searchText} = evt;
                      example2.allOptions = availableOptions.filter(i=>(new RegExp(searchText)).exec(i.text));
                      runner();
                    } }
                    onEnableInput={ (evt) => {
                      console.log('onEnableInput Triggered:', evt);
                      const {target, currentOption} = evt;
                      example2.allOptions = availableOptions;
                      runner();
                    } }
                    onDisableInput={ (evt) => {
                      console.log('onDisableInput Triggered:', evt);
                      const {target, currentOption} = evt;
                      example2.inputOption = Object.assign({}, example2.initialOption);
                      runner();
                    } } />
    </div>
  </div>, document.getElementById("container"));
}
runner();
