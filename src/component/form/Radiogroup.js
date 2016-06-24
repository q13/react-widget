/**
* @Date:   2016-06-17T16:39:09+08:00
* @Last modified time: 2016-06-23T14:57:07+08:00
*/

/**
 * Radiogroup组件实现
 */
import {
  Widget
} from "../component.js";
import React from 'react';
import ReactDom from 'react-dom';
import style from './form.css';

class Radiogroup extends Widget {
  constructor(props) {
    super(props);
    this.adaptProps(props);
    this.state = {};
  }
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {
    this.adaptProps(nextProps);
  }
  componentWillUnmount() {}
  adaptProps(props) {
    //同步value
    if (typeof props.value !== 'undefined') {
      props.options.forEach((option) => {
        if (option.value === props.value) {
          option.checked = true;
        } else {
          option.checked = false;
        }
      });
    }
  }
  handleOptionClick(currentIndex, evt) {
    const self = this;
    const props = self.props;
    if (!props.options[currentIndex].disabled) {
      // const targetOptions = $.extend(true, [], props.options);
      const targetOptions = JSON.parse(JSON.stringify(props.options));
      targetOptions.forEach((option, x) => {
        option.checked = currentIndex === x ? true : false;
      });
      self.props.onChange.call(self, targetOptions[currentIndex]);
      self.props.onOptionsChange.call(self, targetOptions);
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
               className={ Radiogroup.getOptionClass(prefixCls, option, x, options) }
               onClick={ this.handleOptionClick.bind(this, x) }>
            { option.text }
          </div>
        ))
      }
    </div>);
  }
}
Radiogroup.getOptionClass = function(prefixCls, option, x, options) {
  let classString = `${prefixCls}-option ${prefixCls}-option-${x}`;
  if (option.disabled) classString += ` ui-common-disabled`;
  if (option.checked && options.findIndex(i => i.checked) === x) classString += ` ui-common-selected`;
  return classString;
};
Radiogroup.propTypes = {
  prefixCls: React.PropTypes.string,
  className: React.PropTypes.string,
  options: React.PropTypes.array,
  value: React.PropTypes.any,
  onChange: React.PropTypes.func,
  onOptionsChange: React.PropTypes.func,
};
Radiogroup.defaultProps = {
  prefixCls: 'ui-form-radiogroup',
  className: '',
  options: [], // {text: '', value: {}, checked: false, disabled: false }
  value: null,  //默认选中值
  onChange: (evt) => {},
  onOptionsChange: (evt) => {},
};

export default Radiogroup;
