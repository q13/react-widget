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
    this.state = {};
  }
  componentDidMount() {}
  componentWillUnmount() {}
  handleOptionClick(currentIndex, evt) {
    const self = this;
    const props = self.props;
    if (!props.options[currentIndex].disabled) {
      const targetOptions = $.extend(true, [], props.options);
      targetOptions.forEach((option, x) => {
        option.checked = currentIndex === x ? true : false;
      });
      self.props.onChange.call(self, {
        options: targetOptions,
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
  let classString = `${prefixCls}-option ${prefixCls}-option_${x}`;
  if (option.disabled) classString += ` ui-common_disabled`;
  if (option.checked && options.findIndex(i => i.checked) === x) classString += ` ui-common_selected`;
  return classString;
};
Radiogroup.propTypes = {
  prefixCls: React.PropTypes.string,
  className: React.PropTypes.string,
  options: React.PropTypes.array,
  onChange: React.PropTypes.func,
};
Radiogroup.defaultProps = {
  prefixCls: 'ui-form-radiogroup',
  className: '',
  options: [], // {text: '', value: {}, checked: false, disabled: false }
  onChange: (evt) => {},
};

export default Radiogroup;
