/**
 * Dropdown demo
 */
import babelPolyfill from "babel-polyfill";  // enable es6 to es5 transform
import React from "react";
import ReactDom from "react-dom";
import Dropdown from "../../src/component/form/dropdown.js";

let availableOptions = [
  {selected: false, disabled: false, text: 'parent instance', value: document.getElementById("container") },
  {selected: false, disabled: false, text: 'jQuery instance', value: $ },
  {selected: true, disabled: false, text: 'Dropdown class', value: Dropdown },
  {selected: false, disabled: false, text: 'window', value: window },
  {selected: false, disabled: false, text: 'document', value: document },
  {selected: false, disabled: false, text: 'navigator.userAgent', value: navigator.userAgent },
  {selected: false, disabled: false, text: 'navigator.languages', value: navigator.languages },
  {selected: false, disabled: true, text: 'document.head', value: document.head },
  {selected: false, disabled: true, text: 'document.body', value: document.body },
  {selected: false, disabled: true, text: 'document.scripts', value: document.scripts },
  {selected: false, disabled: false, text: '$("body")', value: $("body") },
];
const example1 = {
  allOptions: availableOptions,
  selectedOptions: [availableOptions.find(i=>i.selected)],
};
function runner () {
  ReactDom.render(<div>
    <style dangerouslySetInnerHTML={ {__html: `
      .dropdown-instance input[type=text] {
        width: 400px;
      }
      .dropdown-instance ul {
        margin-top: 0;
        width: 300px;
        max-height: 150px;
      }
      .dropdown-instance .ui-form-dropdown-datapane-option.highlight {
        background: #ff0;
      }

      .dropdown-instance .ui-form-dropdown-datapane-option:before {
        content: " - ";
      }
      .dropdown-instance .ui-form-dropdown-datapane-option.ui-form-dropdown-datapane-option_selected:before {
        content: " + ";
      }
      .dropdown-instance .ui-form-dropdown-datapane-option_selected:after {
        content: "(selected)";
      }
      .dropdown-instance .ui-form-dropdown-datapane-option_disabled {
        opacity: .5;
      }
      .dropdown-instance .ui-form-dropdown-datapane-option_disabled:after {
        content: "(disabled)";
      }
    `} } />
    <div>
      Available Text Options:<br/>
      { availableOptions.map((i,x) => <div key={x}> - {i.text}</div>) }
      &nbsp;<br/>
    </div>
    <div style={{display: 'inline-block'}}>
      Typical use:<br/>
      <Dropdown className="dropdown-instance dropdown-typical"
                options={ example1.allOptions }
                onSelect={ (evt) => {
                  const { selectedOptions } = evt;
                  example1.selectedOptions = selectedOptions;
                  runner();
                } } />
      &nbsp;<br/>
    </div>
    <div>
      Selected options:<br/>
      { example1.selectedOptions.map(i=>` [${i.text}] `) }
    </div>
  </div>, document.getElementById("container"));
}
runner();
