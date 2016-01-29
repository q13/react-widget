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
    		onSelect={ (itemData) => { value=itemData.text; console.log(itemData.value); runner(); } }
    		onSearch={ (searchText, callback) => { callback(options.filter(i=>(new RegExp(searchText)).exec(i.text))); } }
    		onEnableInput={ (searchText, callback) => { callback(options); } }
    		onDisableInput={ (searchText, callback) => { callback(value); } } />
    </div>, document.getElementById("container"));
}
runner();
