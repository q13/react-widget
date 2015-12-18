/**
 * 验证组件，多用于表单
 */
import {
    Widget
} from "../component.js";
import React from 'react';

var defaultRule = {
    "money": function (v) {
        if (!/^(0|[1-9]([0-9]{0,1}){1,})(\.[0-9]{1,2})?$/.test(v)) {
            return false;
        } else {
            return true;
        }
    }
};
class Validation {
    static validate(data) {
        let rule = data.rule,
            value = data.value;
        let isPassed = true;
        if (typeof rule === "string") {
            if (defaultRule[rule] && !defaultRule[rule](value)) {
                isPassed = false;
            }
        } else if (rule instanceof RegExp) {
            if (!rule.test(value)) {
                isPassed = false;
            }
        } else if (typeof rule === "function") {
            isPassed = rule(value);
        }
        return isPassed;
    }
}
export default Validation;
