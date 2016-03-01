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
      #container input[type=text] {
        width: 400px;
      };
    `}
    </style>
    <div>
      Available Text Options:<br/>
      { availableOptions.map((i,x) => <div key={x}> - {i.text}</div>) }
      &nbsp;<br/>
    </div>
    <div style={{display: 'inline-block'}}>
      Typical use:<br/>
      <AutoComplete inputOption={ example1.inputOption }
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
                      runner();
                    } } />
    </div>
    <div style={{display: 'inline-block'}}>
      Customized use:<br/>
      <AutoComplete inputOption={ example2.inputOption }
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
                      example2.initialOption.text = selectedOption.text;
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
