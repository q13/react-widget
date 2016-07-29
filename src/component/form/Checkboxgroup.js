/**
* @Date:   2016-06-17T16:39:08+08:00
* @Last modified time: 2016-07-08T14:51:17+08:00
*/

/**
 * Checkboxgroup组件实现
 */
import {
  Widget
} from "../component.js";
import React from 'react';
import ReactDom from 'react-dom';
import style from './form.css';

class Checkboxgroup extends Widget {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.adaptOptions();
  }
  componentDidUpdate() {
    this.adaptOptions();
  }
  componentWillUnmount() {}
  componentWillReceiveProps(nextProps) {
  }
  /**
   * 根据value值调整option的checked状态
   */
  adaptOptions() {
    const props = this.props;
    const options = [].concat(props.options);
    let needChange = false;
    if (typeof props.value !== 'undefined') {
      options.forEach((option) => {
        if ([].concat(props.value).some((valueItem) => {
            return valueItem === option.value;
          })) {
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
      this.onPropertyChange('options', options);
    }
  }
  handleOptionClick(currentIndex, evt) {
    const self = this;
    const props = self.props;
    if (!props.disabled && !props.options[currentIndex].disabled) {
      // const targetOptions = $.extend(true, [], props.options);
      const targetOptions = JSON.parse(JSON.stringify(props.options));
      targetOptions[currentIndex].checked = !targetOptions[currentIndex].checked;
      let result = Object.assign({}, targetOptions[currentIndex]);
      this.onPropertyChange('options', targetOptions);
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
        props.options.map((option, x) => (
          <div key={ x }
               className={ Checkboxgroup.getOptionClass(prefixCls, option, x, props) }
               onClick={ this.handleOptionClick.bind(this, x) }>
            <i className="icon-handler"></i>
            <span className="text">{ option.text }</span>
          </div>
        ))
      }
    </div>);
  }
}
Checkboxgroup.getOptionClass = function(prefixCls, option, x, props) {
  let classString = `${prefixCls}-option ${prefixCls}-option-${x}`;
  if (option.disabled || props.disabled) {
    classString += ` ${prefixCls}-option-state-disabled`;
  }
  if (option.checked) {
    classString += ` ${prefixCls}-option-state-checked`;
  }
  return classString;
};
Checkboxgroup.propTypes = {
  prefixCls: React.PropTypes.string,
  className: React.PropTypes.string,
  options: React.PropTypes.array,
  disabled: React.PropTypes.bool,
  onChange: React.PropTypes.func,
  onOptionsChange: React.PropTypes.func,
};
Checkboxgroup.defaultProps = {
  prefixCls: 'ui-form-checkboxgroup',
  className: '',
  options: [], // {text: '', value: {}, checked: false, disabled: false }
  disabled: false,
  value: void(0),
  onChange: (evt) => {},
  onOptionsChange: (evt) => {},
};

export default Checkboxgroup;
