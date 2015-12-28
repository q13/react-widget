/**
 * 验证组件，多用于表单
 */
import {
    Widget
} from "../component.js";
import React from 'react';

var defaultRule = {
    money: function (v) {
        if (!/^(0|[1-9]([0-9]{0,1}){1,})(\.[0-9]{1,2})?$/.test(v)) {
            return false;
        } else {
            return true;
        }
    },
    /**
     * 正整数
     * @param  {[type]} v    [description]
     * @param  {[type]} opts [description]
     * @return {[type]}      [description]
     */
    pi: function (v, opts) {
        opts = Object.assign({
            min: 1,
            max: Number.POSITIVE_INFINITY
        }, opts || {});
        if (/^([1-9]([0-9]{0,1}){1,})?$/.test(v)) {
            if (parseFloat(v) < opts.min) {
                return {
                    isPassed: false,
                    why: "downward"
                };
            }
            if (parseFloat(v) > opts.max) {
                return {
                    isPassed: false,
                    why: "upper"
                };
            }
            return true;
        } else {
            return false;
        }
    },
    /**
     * 字符长度判定，默认一个汉字对应2个英文字符
     * @param  {[type]} v    [description]
     * @param  {[type]} opts [description]
     * @return {[type]}      [description]
     */
    length: function (v, opts) {
        opts = Object.assign({
            min: 1,
            max: Number.POSITIVE_INFINITY
        }, opts || {});
        let num = v.replace(/[^\x00-\xff]/g,"01").length;
        if (num < opts.min) {
            return {
                isPassed: false,
                why: "downward"
            };
        }
        if (num > opts.max) {
            return {
                isPassed: false,
                why: "upper"
            };
        }
        return true;
    }
};
class Validation {
    static validate(data) {
        let rule = data.rule,
            value = data.value;
        let isPassed = true;
        if (typeof rule === "string") {
            rule = rule.split('{');
            let ruleName = rule[0];
            let pattern = rule[1].slice(0, -1);
            let opts = null;
            if (pattern) {
                pattern = pattern.split(',');
                opts = {
                    min: parseFloat(pattern[0]),
                    max: parseFloat(pattern[1])
                };
            }
            if (defaultRule[ruleName]) {
                isPassed = defaultRule[ruleName](value, opts);
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
Validation.defaultRule = defaultRule;
export default Validation;
