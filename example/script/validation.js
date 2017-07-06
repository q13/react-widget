/**
 * Validation demo
 */
import babelPolyfill from "babel-polyfill";  // enable es6 to es5 transform
import React from "react";
import ReactDom from "react-dom";
import { Validation } from "../../index.js";

function run(v, trigger) {
    ReactDom.render(
            <form action="#">
            <input type="text" value={v} onChange={function (evt) {
                run(evt.target.value, true);
            }} />
            <Validation value={v} rule={["money"]} failMsg={"不符合金额格式"} trigger={trigger} />
            </form>, document.getElementById("container"));
}
run(1.111, false);
