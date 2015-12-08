/**
 * 验证组件，多用于表单
 */
import {
    Widget
} from "../component.js";
import React from 'react';

class Validation extends Widget {
    constructor(props) {
        super(props);
    }
    applyRule() {
        var props = this.props,
            rule = [].concat(props.rule),
             failMsg = [].concat(props.failMsg),
             value = props.value,
             tipMsg = "",
             result;
        if (rule.some((ruleItem, i) => {   
            if (typeof ruleItem === "string") {
                if (Validation.defaultRule[ruleItem] && !Validation.defaultRule[ruleItem](value)) {
                    tipMsg = failMsg[i];
                    return true;
                }
            }
            if (ruleItem instanceof RegExp) {
                if (!ruleItem.test(value)) {
                    tipMsg = failMsg[i];
                    return true;
                }
            }
            if (typeof ruleItem === "function") {
                if (ruleItem(value) === false) {
                    tipMsg = failMsg[i];
                    return true;
                }
            }
            return false;
        })) {
            result = {
                isPassed: false,
                tipMsg: tipMsg
            }; 
        } else {
            result = true;
        }
        props.onAfterValidate(result);
        return result;
    }
    render() {
        var props = this.props,
            trigger = props.trigger,
            result;
        if (trigger) {
            result = this.applyRule();
            if (result !== true) {
                return (<div className={`${props.prefixCls + ' ' + props.className}`}>{result.tipMsg}</div>);
            }
        }
        return null;
    }
}
Validation.defaultProps = {
    rule: [], //验证规则, 支持预设字符串，正则表达式，自定义函数
    failMsg: [], //验证失败提示
    value: "",    //待验证的值
    trigger: false,    //是否启动
    onAfterValidate: () => {},
    prefixCls: 'ui-validation'
};
Validation.defaultRule = {
    "money": function (v) {
        if (!/^(0|[1-9]([0-9]{0,1}){1,})(\.[0-9]{1,2})?$/.test(v)) {
            return false;
        } else {
            return true;
        }
    }
};
export default Validation;
