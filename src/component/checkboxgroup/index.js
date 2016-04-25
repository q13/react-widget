/**
 * Checkboxgroup组件实现
 */
import {
  Widget
} from "../component.js";
import React from 'react';
import ReactDom from 'react-dom';
import style from './checkboxgroup.css';

class Checkboxgroup extends Widget {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}
  componentWillUnmount() {}
  handleInputChange(currentIndex, e) {
    const self = this;
    const props = self.props;
    const currentOptions = props.options.filter((option, x) => {
      if (currentIndex == x) {
        option.checked = e.target.checked;
      }
      return option.checked;
    });
    self.props.onChange.call(self, {
      target: self,
      currentOptions: currentOptions,
      __currentIndex: currentIndex,
    });
  }
  render() {
    const props = this.props;
    const state = this.state;
    const prefixCls = props.prefixCls;

    return (<div className={ `${prefixCls} ${props.className || ''}` }>
      {
        props.options.map((option, x) => (
          <div key={ x } className={ getOptionClass(option, x) }>
            { null && option.text }
            <label>
              <input { ...option } type="checkbox" ref={ `input_${x}` }
                     className={ `${prefixCls}-option-input` }
                     value={ option.value }
                     onChange={ this.handleInputChange.bind(this, x) } />
              { option.text }
            </label>
          </div>
        ))
      }
    </div>);

    function getOptionClass(option, x) {
      let classString = `${prefixCls}-option ${prefixCls}-option_${x}`;
      if(option.disabled) classString += `${prefixCls}-option_disabled`;
      if(option.checked) classString += `${prefixCls}-option_checked`;
      return classString;
    }
  }
}
export default Checkboxgroup;
Checkboxgroup.propTypes = {
  prefixCls: React.PropTypes.string,
  className: React.PropTypes.string,
  options: React.PropTypes.array,
  onChange: React.PropTypes.func,
};
Checkboxgroup.defaultProps = {
  prefixCls: 'ui-form-checkboxgroup',
  className: '',
  options: [],  // {text: '', ... }
  onChange: (evt) => {},
};
