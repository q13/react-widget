/**
 * Form demo
 */
import React from "react";
import ReactDom from "react-dom";
import DateInput from "../../src/component/form/DateInput.js";
let value = "2015-12-03";
function runner () {
    ReactDom.render(<div style={{
        position: "absolute",
        left: "1800px",
        top: "800px"
    }}><DateInput value={value} onChange={function (evt) {
        value = evt.target.value;
        runner();
    }} /></div>, document.getElementById("container"));
}
runner();
