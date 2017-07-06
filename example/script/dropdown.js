/**
 * Dropdown demo
 */
import babelPolyfill from "babel-polyfill";  // enable es6 to es5 transform
import React from "react";
import ReactDom from "react-dom";
import { Dropdown } from "../../index.js";

let allOptions = [
  {selected: false, disabled: false, text: 'parent instance', value: document.getElementById("container").toString() },
  {selected: false, disabled: false, text: 'jQuery instance', value: $.toString() },
  {selected: true, disabled: false, text: 'Dropdown class', value: Dropdown.toString() },
  {selected: false, disabled: false, text: 'window', value: window.toString() },
  {selected: false, disabled: false, text: 'document', value: document.toString() },
  {selected: false, disabled: false, text: 'navigator.userAgent', value: navigator.userAgent.toString() },
  {selected: false, disabled: false, text: 'navigator.languages', value: navigator.languages.toString() },
  {selected: false, disabled: true, text: 'document.head', value: document.head.toString() },
  {selected: false, disabled: true, text: 'document.body', value: document.body.toString() },
  {selected: false, disabled: true, text: 'document.scripts', value: document.scripts.toString() },
  {selected: false, disabled: false, text: '$("body")', value: $("body").toString() },
];
const example1 = {
  allOptions: allOptions,
  selectedOptions: [allOptions.find(i=>i.selected)],
};
function runner () {
  ReactDom.render(<div>
    <style dangerouslySetInnerHTML={ {__html: `
      .dropdown-instance input[type=text] {
        width: 400px;
      }
      .dropdown-instance .ui-form-dropdown-datapane-options {
        background: #ccc;
        margin-top: 0;
        width: 300px;
        max-height: 150px;
        overflow-y: auto;
      }
      .dropdown-instance .ui-form-dropdown-datapane-option:before {
        content: " - ";
      }
      .dropdown-instance .ui-form-dropdown-datapane-option.ui-common-hover {
        background: #ff0;
      }
      .dropdown-instance .ui-form-dropdown-datapane-option.ui-common-focus {
        background: #0f0;
      }
      .dropdown-instance .ui-form-dropdown-datapane-option.ui-common-selected:before {
        content: " + ";
      }
      .dropdown-instance .ui-form-dropdown-datapane-option.ui-common-selected:after {
        content: "(selected)";
      }
      .dropdown-instance .ui-form-dropdown-datapane-option.ui-common-disabled {
        opacity: .5;
      }
      .dropdown-instance .ui-form-dropdown-datapane-option.ui-common-disabled:after {
        content: "(disabled)";
      }
    `} } />
    <div>
      Available Text Options:<br/>
      { allOptions.map((i,x) => <div key={x}> - {i.text}</div>) }
      &nbsp;<br/>
    </div>
    <div style={{display: 'inline-block'}}>
      Typical use:<br/>
      <Dropdown className="dropdown-instance dropdown-typical"
                options={ example1.allOptions }
                // getTemplateDatapane={ (self) => {
                //   return (<div className={ `${self.props.prefixCls}-datapane-options` }>
                //     <div><b>Customized Dropdown Datapane:</b></div>
                //     {
                //       self.props.options.map((option, x, options) =>
                //       (<div key={x} title={ option.text }
                //             className={ self.getOptionClass(x) }
                //             onClick={ self.handleOptionClick.bind(self, x) }
                //             onMouseEnter={ (e)=>{ self.setState({hoverOption: options[x]}); } }
                //             onMouseLeave={ (e)=>{ self.setState({hoverOption: undefined}); } }>
                //         { option.text }
                //       </div>))
                //     }
                //   </div>);
                // } }
                onOptionsChange={ (options) => {
                  // const { options } = evt;
                  example1.allOptions = options;
                  runner();
                } } />
      &nbsp;<br/>
    </div>
    <div>
      Selected options:<br/>
      { example1.allOptions.filter(i => i.selected).map(i => ` [${i.text}] `) }
    </div>
  </div>, document.getElementById("container"));
}
runner();
