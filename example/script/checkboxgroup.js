/**
 * Checkboxgroup demo
 */
import babelPolyfill from "babel-polyfill";  // enable es6 to es5 transform
import React from "react";
import ReactDom from "react-dom";
import Checkboxgroup from "../../src/component/checkboxgroup/index.js";

let options = [
  {name: 'name1', checked: true, disabled: false, text: 'Checkboxgroup class', value: Checkboxgroup },
  {name: 'name2', checked: true, disabled: true, text: 'window', value: window },
  {name: 'name3', checked: false, disabled: true, text: 'document', value: document },
  {name: 'name4', checked: false, disabled: false, text: 'navigator.userAgent', value: navigator.userAgent },
  {name: 'name5', checked: true, disabled: false, text: 'navigator.languages', value: navigator.languages },
];
const example1 = {
  allOptions: options,
  selectedOptions: options.filter(i=>i.checked),
};
function runner () {
  ReactDom.render(<div>
    <style dangerouslySetInnerHTML={ {__html: `
      .checkboxgroup-instance .ui-form-checkboxgroup-option:before {
        content: " - ";
      }
      .checkboxgroup-instance .ui-form-checkboxgroup-option.ui-form-checkboxgroup-option_checked:before {
        content: " + ";
      }
      .checkboxgroup-instance .ui-form-checkboxgroup-option_disabled {
        opacity: .5;
      }
      .checkboxgroup-instance .ui-form-checkboxgroup-option_disabled:after {
        content: "(disabled)";
      }
    `} } />
    <div style={{display: 'inline-block'}}>
      Typical use:<br/>
      <div>
        <Checkboxgroup className="checkboxgroup-instance checkboxgroup-typical"
                       options={ example1.allOptions }
                       onChange={ (evt) => {
                         const { selectedOptions } = evt;
                         example1.selectedOptions = selectedOptions;
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
