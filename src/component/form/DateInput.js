/**
 * @Date:   2016-06-17T16:39:08+08:00
 * @Last modified time: 2017-07-06T17:46:33+08:00
 */

/**
 * input[type="date"]
 * @require jQuery
 */

import {
  Widget
} from "../component.js";
import moment from 'moment';
import React from 'react';
import ReactDom from 'react-dom';
import style from './form.css';
import Calendar from '../calendar/index.js';

let cptId = 0;
class DateInput extends Widget {
  constructor(props) {
    super(props);
    this.state = {};
    this.cptId = cptId++;
  }

  componentWillMount() {
    this.calendarContainer = document.createElement("div");
    document.body.appendChild(this.calendarContainer);
  }

  componentDidMount() {
    this.renderCalendar({
      visible: false
    });
    $(document).on('mousedown.DateInput' + this.cptId, (evt) => {
      let target = evt.target;
      if (!$(target).is(`.${this.props.prefixCls}-` + this.cptId) && !$(target).closest(`.${this.props.prefixCls}-` + this.cptId).length && !$(target).is(`.${this.props.prefixCls}-calendar-` + this.cptId) && !$(target).closest(`.${this.props.prefixCls}-calendar-` + this.cptId).length && !$(target).is(`.${this.props.prefixCls}-clear-btn`)) {
        this.renderCalendar({
          visible: false
        });
      }

    });

  }

  componentWillUnmount() {
    ReactDom.unmountComponentAtNode(this.calendarContainer);
    document.body.removeChild(this.calendarContainer);
    $(document).off('mousedown.DateInput' + this.cptId);
    this.calendarContainer = null;
    this.cptId = null;
  }

  handleClick() {
    const props = this.props;
    if (!props.disabled) {
      this.renderCalendar({
        visible: true
      });
    }
  }
  handleClearClick() {
    const props = this.props;
    this.renderCalendar({
      visible: false
    });
    props.onChange.call(this, {
      target: {
        value: ''
      }
    });
  }

  renderCalendar(data) {
    var props = this.props,
      state = this.state,
      prefixCls = props.prefixCls;
    var visible = data.visible;
    var inputEl,
      calendarEl,
      winEl,
      inputOffset,
      inputHeight,
      inputWidth,
      calendarHeight,
      calendarWidth,
      winWidth,
      winHeight,
      winScrollTop,
      winScrollLeft,
      top = 0,
      left = 0;
    if (visible) {
      inputEl = $(ReactDom.findDOMNode(this.refs.input));
      calendarEl = $(`.${prefixCls}-calendar`, this.calendarContainer);
      winEl = $(window);
      inputOffset = inputEl.offset();
      inputHeight = inputEl.outerHeight();
      inputWidth = inputEl.outerWidth();
      calendarHeight = calendarEl.outerHeight();
      calendarWidth = calendarEl.outerWidth();
      winWidth = winEl.width();
      winHeight = winEl.height();
      winScrollTop = winEl.scrollTop();
      winScrollLeft = winEl.scrollLeft();
      if (inputOffset.top - winScrollTop >= calendarHeight) {
        if (winHeight - (inputOffset.top - winScrollTop) - inputHeight >= calendarHeight) {   //下面放得下优先放下面
          top = inputOffset.top + inputHeight - 1;
        } else {
          top = inputOffset.top - calendarHeight + 1;
        }
      } else {    //上面放不下直接放下面
        top = inputOffset.top + inputHeight - 1;
      }
      if (inputOffset.left - winScrollLeft + inputWidth >= calendarWidth) {
        if (winWidth - (inputOffset.left - winScrollLeft) >= calendarWidth) {   //左面放得下优先放右面
          left = inputOffset.left;
        } else {
          left = inputOffset.left + inputWidth - calendarWidth;
        }
      } else {    //左面放不下直接放右面
        left = inputOffset.left;
      }
    }
    let initialDate = props.value;
    if (initialDate) {
      let showTime = false;
      if (this.props.calendarProps && this.props.calendarProps.showTime) {
        showTime = true;
      }
      let formatPattern = "YYYY-MM-DD";
      if (props.calendarProps && showTime) {
        if (showTime === true) {
          showTime = ["HH", "mm", "ss"];
        }
      }
      if (showTime) {
        formatPattern = "YYYY-MM-DD " + showTime.join(":");
      }
      initialDate = moment(initialDate, formatPattern)._d;
    } else {
      initialDate = new Date();
    }
    let appearAnimateCls = (visible ? `${prefixCls}-transition-appear` : '');
    ReactDom.render(<div style={{
      "zIndex": 10100,
      "display": visible ? "block" : "none",
      "position": "absolute",
      "top": top + "px",
      "left": left + "px"
    }} className={`${prefixCls}-calendar-panel ${appearAnimateCls}`}>
      <Calendar {...props.calendarProps} className={`${prefixCls}-calendar ${prefixCls}-calendar-` + this.cptId}
                initialDate={initialDate} onClickDate={
        (date) => {
          this.renderCalendar({
            visible: false
          });
          props.onChange.call(this, {
            target: {
              value: date
            }
          });
        }
      }/>
      <button type="button" className={`${prefixCls}-clear-btn`} onClick={this.handleClearClick.bind(this)}>清除</button>
    </div>, this.calendarContainer);
  }

  render() {
    const props = this.props;
    //const prefixCls = props.prefixCls;
    let otherCls = '';
    if (props.disabled) {
      otherCls += `${prefixCls}-input-state-disabled`;
    }
    let {prefixCls, calendarProps, ...validProps} = props;
    return (<input {...validProps} className={`${prefixCls}` + ` ${prefixCls}-` + this.cptId + ' ' + (props.className || '') + ' ' + otherCls}
                   type="text" ref="input" value={props.value === 'Invalid date' ? '' : props.value} readOnly={true} onClick={this.handleClick.bind(this)}/>);
  }
}
DateInput.defaultProps = {
  calendarProps: null,
  onChange: () => {
  },
  prefixCls: "ui-form-dateinput",
  disabled: false,
};
export default DateInput;
