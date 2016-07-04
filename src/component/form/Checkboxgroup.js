/**
* @Date:   2016-06-17T16:39:08+08:00
* @Last modified time: 2016-07-04T11:52:12+08:00
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
    this.adaptProps(props);
    this.state = {};
  }
  componentDidMount() {}
  componentWillUnmount() {}
  componentWillReceiveProps(nextProps) {
    this.adaptProps(nextProps);
  }
  adaptProps(props) {
    //同步value
    if (typeof props.value !== 'undefined') {
      props.options.forEach((option) => {
        if ([].concat(props.value).some((valueItem) => {
          return valueItem === option.value;
        })) {
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
      targetOptions[currentIndex].checked = !targetOptions[currentIndex].checked;
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
        props.options.map((option, x) => (
          <div key={ x }
               className={ Checkboxgroup.getOptionClass(prefixCls, option, x) }
               onClick={ this.handleOptionClick.bind(this, x) }>
            { option.text }
          </div>
        ))
      }
    </div>);
  }
}
Checkboxgroup.getOptionClass = function(prefixCls, option, x) {
  let classString = `${prefixCls}-option ${prefixCls}-option-${x}`;
  if (option.disabled) classString += ` ui-common-disabled`;
  if (option.checked) classString += ` ui-common-selected`;
  return classString;
};
Checkboxgroup.propTypes = {
  prefixCls: React.PropTypes.string,
  className: React.PropTypes.string,
  options: React.PropTypes.array,
  onChange: React.PropTypes.func,
  onOptionsChange: React.PropTypes.func,
};
Checkboxgroup.defaultProps = {
  prefixCls: 'ui-form-checkboxgroup',
  className: '',
  options: [], // {text: '', value: {}, checked: false, disabled: false }
  value: void(0),
  onChange: (evt) => {},
  onOptionsChange: (evt) => {},
};

export default Checkboxgroup;
