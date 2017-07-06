/**
 * ColorInput demo
 */
import babelPolyfill from "babel-polyfill";  // enable es6 to es5 transform
import React from "react";
import ReactDom from "react-dom";
import moment from "moment";
import { ColorInput } from "../../index.js";
let value = "#ff0000";
function runner () {
    ReactDom.render(<div style={{
        position: "absolute",
        left: "1800px",
        top: "800px"
    }}><ColorInput value={value} onChange={function (color) {
        value = color;
        runner();
    }} /></div>, document.getElementById("container"));
}
runner();
