/**
* @Author: 13
* @Date:   2016-06-17T16:39:09+08:00
* @Last modified by:
* @Last modified time: 2016-09-23T16:56:23+08:00
*/
/**
 * 验证组件，多用于表单
 */
import {Widget} from "../component.js";
import React from 'react';
import ReactDom from 'react-dom';
import PropTypes from "prop-types";
import equal from 'deep-equal';
class Validator extends Widget {
  constructor(props) {
    super(props);
    this.state = {
      validateResult: null, //存储验证结果
      diffValueOfFields: [], //记录value有变化的field name
      fields: {} //存储rules对应的field相关状态 {name: {isValid: null, message: '', originMessage: ''}}  //如果isValid === false, message为当前提示信息，originMessage记录原始信息
    };
  }
  static validate(field, bindFieldValue) {
    var rule = [].concat(field.rule);
    var message = [].concat(field.message);
    var value = field.value + '';
    var allowBlank = field.allowBlank;
    var ignore = field.ignore;
    var indexOffset = 0;
    if (typeof allowBlank === 'function') { //用作及时判定
      allowBlank = allowBlank(value, ...bindFieldValue);
    }
    if (allowBlank === true) {
      rule = [
        true,
        function(v) {
          if (!v) { //如果为空，忽略后面的验证
            return 'abort';
          }
        }
      ].concat(rule);
      indexOffset = 2;
    } else {
      rule = [
        true,
        function(v) {
          if (!v) { //如果为空，给予空值提示
            return (typeof allowBlank === 'string'
              ? allowBlank
              : false);
          }
        },
        function(v) {
          if (!v) { //如果为空，中断后面的验证
            return 'abort';
          }
        }
      ].concat(rule);
      indexOffset = 3;
    }
    if (ignore) {
      if (ignore === true) {
        rule = [
          true,
          function() {
            return 'abort';
          }
        ].concat(rule);
        indexOffset = 2;
      } else if (typeof ignore === 'function') {
        if (ignore(value, ...bindFieldValue)) {
          rule = [
            true,
            function() {
              return 'abort';
            }
          ].concat(rule);
          indexOffset = 2;
        }
      }
    }
    //处理不同的rule形式 string/boolean/regx/object/function
    return rule.reduce((pv, cv, ci, arr) => {
      var validateResult;
      if (pv.isAbort) {
        return pv;
      }
      if (typeof cv === 'boolean') {
        validateResult = cv;
      } else if (typeof cv === 'string') {
        let params = [value].concat(bindFieldValue);
        validateResult = Validator.defaultRule[cv](...params);
      } else if (cv instanceof RegExp) {
        validateResult = cv.test(value);
      } else if (typeof cv === 'function') {
        validateResult = cv(value, ...bindFieldValue);
      } else { //object
        validateResult = Validator.defaultRule[cv['name']](value, cv['params'], ...bindFieldValue);
      }
      //判断结果
      if (validateResult === 'abort') {
        pv.isAbort = true;
        return pv; //中断的化直接返回前面的验证结果
      } else if (typeof validateResult === 'undefined') {
        return Object.assign(pv, {
          isValid: pv.isValid && true
        });
      } else if (typeof validateResult === 'string') {
        return Object.assign(pv, {
          isValid: pv.isValid && false
        }, (() => {
          if (pv.firstInvalidIndex < 0) {
            return {
              firstInvalidIndex: ci - indexOffset,
              message: validateResult
            };
          }
        })());
      } else if (typeof validateResult === 'boolean') {
        return Object.assign(pv, validateResult, {
          isValid: pv.isValid && validateResult
        }, (() => {
          if (validateResult === false && pv.firstInvalidIndex < 0) {
            return {
              firstInvalidIndex: ci - indexOffset
            };
          }
        })());
      } else { //认为返回object
        return Object.assign(pv, validateResult, {
          isValid: pv.isValid && validateResult.isValid
        }, (() => {
          if (validateResult.isValid === false && pv.firstInvalidIndex < 0) {
            let rs = {
              firstInvalidIndex: ci - indexOffset
            };
            if (validateResult.message) {
              rs.message = validateResult.message;
            }
            return rs;
          }
        })());
      }
    }, {
      isValid: true,
      isAbort: false,
      firstInvalidIndex: -1, //记录第一个验证未通过的位置
      message: ''
    });
  }
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {
    const props = this.props;
    const state = this.state;
    var diffValueOfFields = [];
    Object.keys(props.fields).forEach((k) => {
      //if (props.fields[k] !== nextProps.fields[k]) {
      if (state.fields[k] && (nextProps.fields[k].value != state.fields[k].value)) {
        diffValueOfFields.push(k);
      }
    });
    this.setState({
      diffValueOfFields: diffValueOfFields
    }, () => {
      this.validate();
    });
  }
  componentDidUpdate() {}
  componentWillUnmount() {}
  /**
   * @param excludeEmpty {String} 是否排除空值
   */
  getValidValue(excludeEmpty) {
    var props = this.props;
    var fields = props.fields;
    var values = {};
    Object.keys(fields).forEach((fieldName) => {
      var value = fields[fieldName].value + '';
      if (excludeEmpty) {
        if (value) {
          if (fields[fieldName].groupName) {
            values[fields[fieldName].groupName] = values[fields[fieldName].groupName] || {};
            values[fields[fieldName].groupName][fieldName] = value;
          } else {
            values[fieldName] = value;
          }
        }
      } else {
        if (fields[fieldName].groupName) {
          values[fields[fieldName].groupName] = values[fields[fieldName].groupName] || {};
          values[fields[fieldName].groupName][fieldName] = value;
        } else {
          values[fieldName] = value;
        }
      }
    });
    return {isValid: this.validate('all').isValid, values: values};
  }
  validate(fieldName) {
    var props = this.props;
    var state = this.state;
    var fields = props.fields;
    var stateFields = state.fields;
    var diffValueOfFields = state.diffValueOfFields;
    var validateResult = [];
    var returnData;
    if (fieldName) { //单field验证
      diffValueOfFields = [];
      if (fieldName === 'all') { //all表示验证所有fields
        Object.keys(fields).forEach((key) => {
          diffValueOfFields[fields[key].index] = key;
        });
      } else if (fields[fieldName]) {
        diffValueOfFields.push(fieldName);
      }
    } //验证value有差异的field，只要有一个没通过验证就算没通过
    //依赖绑定也需要走一遍验证
    let refFields = [];
    let fieldKeys = Object.keys(fields);
    diffValueOfFields.forEach((v) => {
      let targetFieldName;
      if (fieldKeys.some((k) => {
        if ([].concat(fields[k].bindField).some((j) => {
          if (j === v) {
            targetFieldName = k;
            return true;
          }
        })) {
          return true;
        }
      })) {
        refFields.push(targetFieldName);
      }
    });
    //拼接diffValueOfFields
    diffValueOfFields = diffValueOfFields.concat(refFields);
    //去重
    diffValueOfFields = Array.from(new Set(diffValueOfFields));
    //重排
    diffValueOfFields.sort((a, b) => {
      return fields[a].index - fields[b].index;
    });
    diffValueOfFields.forEach((fieldName) => {
      validateField(fieldName);
    });
    function validateField(fieldName) {
      let bindField = [].concat(fields[fieldName].bindField || []);
      bindField = bindField.map((fieldName) => {
        return fields[fieldName].value + '';
      });
      let stateField = state.fields[fieldName] || {};
      let fieldValidateResult = Validator.validate(fields[fieldName], bindField);
      !stateField.originMessage && (stateField.originMessage = [].concat(fields[fieldName].message));
      if (!fieldValidateResult.isValid && !fieldValidateResult.message) {
        fieldValidateResult.message = stateField.originMessage[fieldValidateResult.firstInvalidIndex]; //如果验证过程没返回message，那么从默认message里取
      }
      fieldValidateResult.fieldName = fieldName;
      //存储验证结果
      let newFields = {};
      newFields[fieldName] = stateField;
      if (fields[fieldName].onValidate && stateField.isValid !== fieldValidateResult.isValid && stateField.message !== fieldValidateResult.message) {
        fields[fieldName].onValidate(fieldValidateResult.isValid, fieldValidateResult);
      }
      stateField.isValid = fieldValidateResult.isValid;
      //存储新的value
      stateField.value = fields[fieldName].value || '';
      //更新message
      stateField.message = fieldValidateResult.message;
      Object.assign(stateFields, newFields);
      validateResult.push(fieldValidateResult);
    }
    //存储新的内部状态
    this.setState({fields: stateFields});
    //过滤出没通过验证的
    let validateErrorResult = validateResult.filter((itemData) => {
      return !itemData.isValid;
    });
    let newFields = {};
    //构建验证返回结果和新的fields
    if (validateErrorResult.length) {
      returnData = {
        isValid: false,
        fieldName: validateErrorResult[0].fieldName,
        message: validateErrorResult[0].message,
        validateErrorResult: validateErrorResult
      };
      diffValueOfFields.forEach((k) => {
        var fieldValidateResult = validateErrorResult.find((itemData) => {
          return itemData.fieldName === k;
        }) || {
          isValid: true,
          message: ''
        };
        newFields[k] = Object.assign({}, fields[k], {
          isValid: fieldValidateResult.isValid,
          message: fieldValidateResult.message
        });
      });
    } else {
      returnData = {
        isValid: true
      };
      diffValueOfFields.forEach((k) => {
        newFields[k] = Object.assign({}, fields[k], {
          isValid: true,
          message: ''
        });
      });
    }
    //合并未受影响的field反射回去
    Object.keys(fields).forEach((k) => {
      if (!newFields[k]) {
        newFields[k] = fields[k];
      }
    });
    //对比fields是否发生了改变，有改变触发反射
    if (!equal(newFields, fields)) {
      props.onFieldsChange(newFields);
    }
    //构建整体验证结果
    returnData = Object.keys(stateFields).reduce((pv, cv) => {
      pv.isValid = pv.isValid && stateFields[cv].isValid;
      if (!stateFields[cv].isValid) {
        pv.fieldName = pv.fieldName || [];
        pv.fieldName.push(cv);
        pv.message = pv.message || [];
        pv.message.push(stateFields[cv].message);
      }
      return pv;
    }, {isValid: true});
    if (fieldName === 'all' && !equal(state.validateResult, returnData)) { //validate all才触发
      this.setState({
        validateResult: returnData
      }, () => {
        props.onValidate(returnData);
      });
    }
    return returnData;
  }
  reset() {
    const props = this.props;
    const fields = this.fields;
    let newFields = {};
    Object.keys(props.fields).forEach((k) => {
      newFields[k] = fields[k];
      newFields[k].isValid = null;
    });
    props.onFieldsChange(newFields);
  }
  render() {
    const props = this.props;
    const prefixCls = props.prefixCls;
    return (
      <div className={`${prefixCls} ${props.className || ''}`}>
        {props.children}
      </div>
    );
  }
}
Validator.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  fields: PropTypes.object,
  onRulesChange: PropTypes.func
};
Validator.defaultProps = {
  prefixCls: 'ui-validator',
  className: '',
  fields: {
    name: {
      name: '', //用于取值函数getValidValue返回值key
      value: '',
      isValid: null, //not true or false
      allowBlank: true, //是否必填，只有值为true时空值才允许进行rule的验证, false和string表示不允许为空，string为提示内容
      bindField: [], // string or array 用于处理field间的关联验证
      rule: [], //第一个rule function 返回abort将会忽略后面的验证，在取值函数getValidValue返回值里被忽略
      message: [],
      onValidate: () => {}
    }
  },
  onFieldsChange: () => {}, //fields反射
  onValidate: () => {} //任一field的isValid有改变就会触发
};
//默认验证规则, 局部验证，默认都是true
Validator.defaultRule = {
  money(v, params) {
    params = Object.assign({
      min: 0,
      max: Number.POSITIVE_INFINITY
    }, params || {});
    if (/^(0|[1-9]([0-9]{0,1}){1,})(\.[0-9]{1,2})?$/.test(v)) {
      if (parseFloat(v) < params.min) {
        return false;
      }
      if (parseFloat(v) > params.max) {
        return false;
      }
    } else {
      return false;
    }
  },
  /**
   * 正整数
   * @param  {[type]} v    [description]
   * @param  {[type]} params [description]
   * @return {[type]}      [description]
   */
  pi(v, params) {
    params = Object.assign({
      min: 1,
      max: Number.POSITIVE_INFINITY
    }, params || {});
    if (/^([1-9]([0-9]{0,1}){1,})?$/.test(v)) {
      if (parseFloat(v) < params.min) {
        return false;
      }
      if (parseFloat(v) > params.max) {
        return false;
      }
    } else {
      return false;
    }
  },
  /**
   * 字符长度判定，默认一个汉字对应1个英文字符
   * @param  {[type]} v    [description]
   * @param  {[type]} params [description]
   * @return {[type]}      [description]
   */
  length(v, params) {
    params = Object.assign({
      hanCharLength: 1,
      min: 1,
      max: Number.POSITIVE_INFINITY
    }, params || {});
    let num = v.replace(/[^\x00-\xff]/g, "0123456789".slice(0, params.hanCharLength)).length;
    if (num < params.min) {
      return false;
    }
    if (num > params.max) {
      return false;
    }
  }
};
/**
 * 获取新的fields
 * @param  {[type]} value      [description]
 * @param  {[type]} key        [description]
 * @param  {[type]} fields     [description]
 * @param  {[type]} configMode full or simple，full表示传入的是完整配置项{name, value, rule...}，simple表示传入的是key:value形式
 * @return {[type]}            [description]
 */
Validator.getNewFields = function(value, key, fields, configMode) {
  var result = Object.assign({}, fields);
  //var result = fields;
  let target = {};
  if (!fields) {
    fields = key;
    result = Object.assign({}, fields);
    target = value;
    if (Array.isArray(target)) {
      //configMode没定义，默认array下用完整配置项模式
      //已定义则根据configMode扩展成完整模式
      if (typeof configMode !== 'undefined') {
        if (configMode === 'simple') {
          target = target.map((itemData) => {
            let keys = Object.keys(itemData);
            return {
              name: keys[0],
              value: itemData[keys[0]]
            };
          });
        }
      }
    } else {  //直接默认是object形式
      //object配置方式下，如果configMode没定义，默认是simple模式
      if (typeof configMode === 'undefined' || (typeof configMode !== 'undefined' && configMode === 'simple')) {
        let keys = Object.keys(target);
        target = keys.map((name) => {
          return {
            name: name,
            value: target[name]
          };
        });
      }
    }
  } else {
    //多参数模式下肯定是simple模式，不用考虑configMode
    target = {
      name: key,
      value: value
    };
  }
  if (Array.isArray(target)) { //批量更新或添加或删除(index === -1)
    target.forEach((itemData) => {
      //itemData.value = itemData.value + ''; //强制转成字符串
      update(itemData);
    });
  } else {
    //标准化
    //target.value = target.value + '';
    update(target);
  }
  // Object.keys(target).forEach((k) => {
  //   let v = target[k];
  //   if (typeof v === 'undefined') {
  //     v = '';
  //   }
  //   result[k] = Object.assign({}, result[k], {
  //     value: v
  //   });
  // });
  function update(itemData) {
    //看是否需要更新或者删除field
    if (typeof itemData.index !== 'undefined') {
      if (itemData.index === -1) { //直接干掉对应field
        delete result[itemData.name];
        //重排一遍index
        let keys = Object.keys(result);
        keys.sort((a, b) => {
          return result[a].index - result[b].index;
        });
        keys.forEach((v, i) => {
          result[v].index = i;
        });
      } else { //更新配置项和排序
        if (result[itemData.name] && itemData.index === result[itemData.name].index) { //直接更新配置项
          result[itemData.name] = Object.assign({}, result[itemData.name], itemData);
        } else {
          let keys = Object.keys(result);
          keys.sort((a, b) => {
            return result[a].index - result[b].index;
          });
          //先干掉对应的key
          keys = keys.filter((v) => {
            return v !== itemData.name;
          });
          //再插入
          keys.splice(itemData.index, 0, itemData.name);
          //重排
          keys.forEach((v, i) => {
            result[v].index = i;
          });
          //更新配置
          delete itemData.index;
          result[itemData.name] = Object.assign({}, result[itemData.name] || {}, itemData);
        }
      }
    } else { //直接更新配置
      result[itemData.name] = Object.assign({}, result[itemData.name] || {}, itemData);
      if (typeof result[itemData.name].index === 'undefined') {
        result[itemData.name] = Validator.getStandardField(result[itemData.name]);
        result[itemData.name].index = Object.keys(result).length - 1;
      }
    }
  }
  return result;
  //let newFields = Object.assign({}, result, tmpResult);
  //let newFields = Object.assign({}, result);
  //console.log('bool', newFields === result);
  //return newFields;
};
/**
 * 按顺序构建fields object.
 */
Validator.getOrderFields = function(fields) {
  return fields.reduce((pv, cv, ci) => {
    pv[cv.name] = Object.assign({}, cv, {index: ci});
    pv[cv.name] = Validator.getStandardField(pv[cv.name]);
    return pv;
  }, {});
};
/**
 * 获取标准化的field配置信息
 * @param  {[type]} field [description]
 * @return {[type]}       [description]
 */
Validator.getStandardField = function(field) {
  if (typeof field.allowBlank === 'undefined') { //默认允许为空
    field.allowBlank = true;
  }
  if (typeof field.rule === 'undefined') { //添加默认rule
    field.rule = [true];
  }
  if (typeof field.message === 'undefined') {
    field.message = [];
  }
  if (typeof field.ignore === 'undefined') { //默认验证所有项
    field.ignore = false;
  }
  if (typeof field.value === 'undefined') { //默认值
    field.value = '';
  }
  if (typeof field.bindField === 'undefined') { //默认值
    field.bindField = [];
  }
  return field;
};
export default Validator;
