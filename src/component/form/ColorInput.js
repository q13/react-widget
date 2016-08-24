/**
* @Date:   2016-06-17T14:29:19+08:00
* @Last modified time: 2016-08-15T11:49:56+08:00
*/
/**
 * ColorInput
 * @require jQuery
 */
import {Widget} from "../component.js";
import moment from 'moment';
import React from 'react';
import ReactDOM from 'react-dom';
import style from './form.css';
import ColorPicker from '../colorpicker/index.js';
let instanceId = 0;
class ColorInput extends Widget {
  constructor(props) {
    super(props);
    this.state = {
      colorPickerVisible: false
    };
    this.instanceId = instanceId++;
  }
  componentWillMount() {
    this.componentContainer = document.createElement("div");
    document.body.appendChild(this.componentContainer);
  }
  componentDidMount() {
    $(document).on('mousedown.ColorInput' + this.instanceId, (evt) => {
      let target = evt.target;
      if (!$(target).is(`.${this.props.prefixCls}-` + this.instanceId) && !$(target).closest(`.${this.props.prefixCls}-` + this.instanceId).length && !$(target).is(`.${this.props.prefixCls}-colorpicker-` + this.instanceId) && !$(target).closest(`.${this.props.prefixCls}-colorpicker-` + this.instanceId).length) {
        this.setState({colorPickerVisible: false});
      }
    });
    this.proceedDidUpdate({}, {}, this.props, this.state);
  }
  componentWillUnmount() {
    ReactDOM.unmountComponentAtNode(this.componentContainer);
    document.body.removeChild(this.componentContainer);
    $(document).off('mousedown.ColorInput' + this.instanceId);
    this.componentContainer = null;
    this.instanceId = null;
  }
  componentDidUpdate(prevProps, prevState) {
    this.proceedDidUpdate(prevProps, prevState, this.props, this.state);
  }
  proceedDidUpdate(prevProps, prevState, nextProps, nextState) {
    this.renderColorPicker({visible: this.state.colorPickerVisible});
  }
  handleClick() {
    this.setState(({colorPickerVisible}) => ({
      colorPickerVisible: !colorPickerVisible
    }));
  }
  renderColorPicker(data) {
    const props = this.props,
      state = this.state,
      prefixCls = props.prefixCls;
    const visible = data.visible;
    let inputEl,
      componentEl,
      winEl,
      inputOffset,
      inputHeight,
      inputWidth,
      componentHeight,
      componentWidth,
      winWidth,
      winHeight,
      winScrollTop,
      winScrollLeft,
      top = 0,
      left = 0;
    if (visible) {
      inputEl = $(ReactDOM.findDOMNode(this.refs.input));
      componentEl = $(`.${prefixCls}-component`, this.componentContainer);
      winEl = $(window);
      inputOffset = inputEl.offset();
      inputHeight = inputEl.outerHeight();
      inputWidth = inputEl.outerWidth();
      componentHeight = componentEl.outerHeight();
      componentWidth = componentEl.outerWidth();
      winWidth = winEl.width();
      winHeight = winEl.height();
      winScrollTop = winEl.scrollTop();
      winScrollLeft = winEl.scrollLeft();
      if (inputOffset.top - winScrollTop >= componentHeight) {
        if (winHeight - (inputOffset.top - winScrollTop) - inputHeight >= componentHeight) { //下面放得下优先放下面
          top = inputOffset.top + inputHeight - 1;
        } else {
          top = inputOffset.top - componentHeight + 1;
        }
      } else { //上面放不下直接放下面
        top = inputOffset.top + inputHeight - 1;
      }
      if (inputOffset.left - winScrollLeft + inputWidth >= componentWidth) {
        if (winWidth - (inputOffset.left - winScrollLeft) >= componentWidth) { //右面放得下优先放右面
          left = inputOffset.left;
        } else {
          left = inputOffset.left + inputWidth - componentWidth;
        }
      } else { //左面放不下直接放右面
        left = inputOffset.left;
      }
    }
    ReactDOM.render(
      <div style={{
      "zIndex": 10000,
      "display": visible
        ? "block"
        : "none",
      "position": "absolute",
      "top": top + "px",
      "left": left + "px"
    }}>
      <ColorPicker className={`${prefixCls}-component ${prefixCls}-colorpicker ${prefixCls}-colorpicker-${this.instanceId}`} color={props.value} onChange={props.onChange}/>
    </div>, this.componentContainer);
  }
  render() {
    const props = this.props,
      prefixCls = props.prefixCls;
    return (<input ref="input" type="text" value={props.value} readOnly={true} maxLength="7" size="7" className={`${prefixCls} ${prefixCls}-${this.instanceId} ${props.className || ''}`} onClick={this.handleClick.bind(this)}/>);
  }
}
ColorInput.defaultProps = {
  prefixCls: 'ui-form-colorinput',
  className: '',
  value: undefined,
  onChange: undefined
};
export default ColorInput;
