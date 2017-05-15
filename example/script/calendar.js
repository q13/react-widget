/**
 * Calendar demo
 */
import babelPolyfill from "babel-polyfill";  // enable es6 to es5 transform
import React from "react";
import ReactDom from "react-dom";
import { Calendar } from "../../index.js";
function test() {}
ReactDom.render(<Calendar onTest={function () {}} />, document.getElementById("container"));
ReactDom.render(<Calendar onTest={function () {}} />, document.getElementById("container"));
