/**
 * AutoComplete demo
 */
import React from "react";
import ReactDom from "react-dom";
import moment from "moment";
import AutoComplete from "../../src/component/autocomplete/index.js";

let value = "abc";
function runner () {
    ReactDom.render(<div style={{
        position: "absolute",
        // left: "1800px",
        // top: "800px"
    }}>
    	<AutoComplete initialValue={value} minLengthToSearch={2}
    		onSelect={()=>{ console.log('onSelect'); }}
    		onSearch={()=>{ console.log('onSearch'); }}
    		onStartInputs={()=>{ console.log('onStartInputs'); }}
    		onCancelInputs={()=>{ console.log('onCancelInputs'); }} />
    </div>, document.getElementById("container"));
}
runner();
