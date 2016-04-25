/**
 * Checkboxgroup demo
 */
import babelPolyfill from "babel-polyfill";  // enable es6 to es5 transform
import React from "react";
import ReactDom from "react-dom";
import Checkboxgroup from "../../src/component/checkboxgroup/index.js";

let options = [
  {name: 'name1', checked: true, disabled: false, text: 'Checkboxgroup class', value: Checkboxgroup },
  {name: 'name2', checked: true, disabled: false, text: 'window', value: window },
  {name: 'name3', checked: true, disabled: false, text: 'document', value: document },
  {name: 'name4', checked: true, disabled: false, text: 'navigator.userAgent', value: navigator.userAgent },
  {name: 'name5', checked: true, disabled: false, text: 'navigator.languages', value: navigator.languages },
];
const example1 = {
  allOptions: options,
  selectedOptions: options.filter(i=>i.checked),
};
function runner () {
  ReactDom.render(<div>
    <style>
    {`
      .checkboxgroup-instance input[type=text] {
        width: 400px;
      }
      .checkboxgroup-instance li.highlight {
        background: #ff0;
      }
      .checkboxgroup-instance ul {
        margin-top: 0;
        width: 300px;
        max-height: 150px;
      }
    `}
    </style>
    <div style={{display: 'inline-block'}}>
      Typical use:<br/>
      <div>
        <Checkboxgroup className="checkboxgroup-instance checkboxgroup-typical"
                       options={ example1.allOptions }
                       onChange={ (evt) => {
                         const {target, currentIndex, currentOptions} = evt;
                         example1.selectedOptions = currentOptions;
                         runner();
                       } } />
      </div>
      &nbsp;<br/>
    </div>
    <div>
      Selected options:<br/>
      { example1.selectedOptions.map(i=>` [${i.text}] `) }
    </div>
  </div>, document.getElementById("container"));
}
runner();
