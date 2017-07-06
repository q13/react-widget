/**
* @Date:   2016-06-17T16:39:09+08:00
* @Last modified time: 2016-09-23T15:50:26+08:00
*/

/**
 * Radiogroup组件实现
 */
import {
  Widget
} from "../component.js";
import React from 'react';
import ReactDom from 'react-dom';
import PropTypes from "prop-types";
import style from './form.css';

class Radiogroup extends Widget {
  constructor(props) {
    super(props);
    //this.adaptProps(props);
    this.state = {};
  }
  componentDidMount() {
    this.adaptOptions();
  }
  componentDidUpdate() {
    this.adaptOptions();
  }
  componentWillReceiveProps(nextProps) {
    //this.adaptProps(nextProps);
  }
  componentWillUnmount() {}
  /**
   * 根据value值调整option的checked状态
   */
  adaptOptions() {
    const props = this.props;
    let options = props.options.map((itemData) => {
      return Object.assign({}, itemData);
    });
    let needChange = false;
    if (typeof props.value !== 'undefined') {
      options.forEach((option) => {
        if (option.value == props.value) {
          if (!option.checked) {
            needChange = true;
          }
          option.checked = true;
        } else {
          if (option.checked) {
            needChange = true;
          }
          option.checked = false;
        }
      });
    }
    if (needChange) {
      props.onOptionsChange(options);
    }
  }
  handleOptionClick(currentIndex, evt) {
    const self = this;
    const props = self.props;
    if (!props.disabled && !props.options[currentIndex].disabled) {
      // const targetOptions = $.extend(true, [], props.options);
      const targetOptions = JSON.parse(JSON.stringify(props.options));
      targetOptions.forEach((option, x) => {
        option.checked = currentIndex === x ? true : false;
      });
      let result = Object.assign({}, targetOptions[currentIndex]);
      props.onOptionsChange(targetOptions);
      this.nextTick(() => {
        props.onChange(result);
      });
    }
  }
  render() {
    const props = this.props;
    const state = this.state;
    const prefixCls = props.prefixCls;

    return (<div className={ `${prefixCls} ${props.className || ''}` }>
      {
        props.options.map((option, x, options) => (
          <div key={ x }
               className={ Radiogroup.getOptionClass(prefixCls, option, x, options, props) }
               onClick={ this.handleOptionClick.bind(this, x) }>
            <i className="icon-handler"></i>
            <span className="text" title={option.text}>{ option.text }</span>
          </div>
        ))
      }
    </div>);
  }
}
Radiogroup.getOptionClass = function(prefixCls, option, x, options, props) {
  let classString = `${prefixCls}-option ${prefixCls}-option-${x}`;
  if (option.disabled || props.disabled) {
    classString += ` ${prefixCls}-option-state-disabled`;
  }
  if (option.checked && options.findIndex(i => i.checked) === x) {
    classString += ` ${prefixCls}-option-state-checked`;
  }
  return classString;
};
Radiogroup.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  options: PropTypes.array,
  disabled: PropTypes.bool,
  value: PropTypes.any,
  onChange: PropTypes.func,
  onOptionsChange: PropTypes.func,
};
Radiogroup.defaultProps = {
  prefixCls: 'ui-form-radiogroup',
  className: '',
  options: [], // {text: '', value: {}, checked: false, disabled: false }
  disabled: false,
  value: void(0),  //默认选中值
  onChange: (evt) => {},
  onOptionsChange: (evt) => {},
};

export default Radiogroup;
