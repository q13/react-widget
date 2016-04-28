/**
 * Checkboxgroup demo
 */
import babelPolyfill from "babel-polyfill";  // enable es6 to es5 transform
import React from "react";
import ReactDom from "react-dom";
import Checkboxgroup from "../../src/component/form/Checkboxgroup.js";

let options = [
  {name: 'name1', checked: true, disabled: false, text: 'Checkboxgroup class', value: Checkboxgroup },
  {name: 'name2', checked: true, disabled: true, text: 'window', value: window },
  {name: 'name3', checked: false, disabled: true, text: 'document', value: document },
  {name: 'name4', checked: false, disabled: false, text: 'navigator.userAgent', value: navigator.userAgent },
  {name: 'name5', checked: true, disabled: false, text: 'navigator.languages', value: navigator.languages },
];
const example1 = {
  allOptions: options,
};
function runner () {
  ReactDom.render(<div>
    <style dangerouslySetInnerHTML={ {__html: `
      .checkboxgroup-instance .ui-form-checkboxgroup-option:before {
        content: " - ";
      }
      .checkboxgroup-instance .ui-form-checkboxgroup-option.ui-common_selected:before {
        content: " + ";
      }
      .checkboxgroup-instance .ui-form-checkboxgroup-option.ui-common_selected:after {
        content: "(checked)";
      }
      .checkboxgroup-instance .ui-form-checkboxgroup-option.ui-common_disabled {
        opacity: .5;
      }
      .checkboxgroup-instance .ui-form-checkboxgroup-option.ui-common_disabled:after {
        content: "(disabled)";
      }
    `} } />
    <div style={{display: 'inline-block'}}>
      Typical use:<br/>
      <div>
        <Checkboxgroup className="checkboxgroup-instance checkboxgroup-typical"
                       options={ example1.allOptions }
                       onOptionsChange={ (evt) => {
                         const { options } = evt;
                         example1.allOptions = options;
                         runner();
                       } } />
      </div>
      &nbsp;<br/>
    </div>
    <div>
      Selected options:<br/>
      { example1.allOptions.filter(i => i.checked).map(i => ` [${i.text}] `) }
    </div>
  </div>, document.getElementById("container"));
}
runner();
