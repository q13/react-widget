/**
 * AutoComplete demo
 */
import babelPolyfill from "babel-polyfill";  // enable es6 to es5 transform
import React from "react";
import ReactDom from "react-dom";
import moment from "moment";
import AutoComplete from "../../src/component/autocomplete/index.js";

let value = 'click me to start case-sensitive text search';
let options = [
    {text: 'parent instance', value: document.getElementById("container") },
    {text: 'jQuery instance', value: $ },
    {text: 'window', value: window },
    {text: 'document', value: document },
    {text: 'navigator.userAgent', value: navigator.userAgent },
    {text: 'navigator.languages', value: navigator.languages },
];
function runner () {
    ReactDom.render(<div style={{
        position: "absolute",
        width: "200px",
        // left: "1800px",
        // top: "800px"
    }}>
    	<AutoComplete
            initialText={ value }
            initialOptions={ options }
            minLengthToSearch={ 3 }
            minSearchInterval={ .2 }
    		onSelect={ (evt) => {
                console.log('onSelect Triggered:', evt);
                const {target, selectedOption} = evt;
                value = selectedOption.text;
                runner();
            } }
    		onSearch={ (evt) => {
                console.log('onSearch Triggered:', evt);
                const {target, searchText, callback} = evt;
                callback(options.filter(i=>(new RegExp(searchText)).exec(i.text)));
            } }
    		onEnableInput={ (evt) => {
                console.log('onEnableInput Triggered:', evt);
                const {target, searchText, callback} = evt;
                callback(options);
            } }
    		onDisableInput={ (evt) => {
                console.log('onDisableInput Triggered:', evt);
                const {target, searchText} = evt;
                runner();
            } } />
    </div>, document.getElementById("container"));
}
runner();
