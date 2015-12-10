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
import Calendar from '../calendar/index.js';
class DateInput extends Widget {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentWillMount() {
        this.calendarContainer = document.createElement("div");
        document.body.appendChild(this.calendarContainer);
    }
    componentDidMount() {
        this.renderCalendar({
            visible: false
        });
    }
    componentWillUnmount() {
        ReactDom.unmountComponentAtNode(this.calendarContainer);
        document.body.removeChild(this.calendarContainer);
        this.calendarContainer = null;
    }
    handleFocus() {
        this.renderCalendar({
            visible: true
        });
    }
    handleBlur() {
        this.renderCalendar({
            visible: false
        });
    }
    handleChange(evt) {
        this.setState({
            value: evt.target.value
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
                    top = inputOffset.top + inputHeight;
                } else {
                    top = inputOffset.top - calendarHeight;
                }
            } else {    //上面放不下直接放下面
                top = inputOffset.top + inputHeight;
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
        ReactDom.render(<div style={{
            "zIndex": 10000,
            "display": visible ? "block" : "none",
            "position": "absolute",
            "top": top + "px",
            "left": left + "px"
        }}>
            <Calendar className={`${prefixCls}-calendar`} focusDate={moment(state.value, "YYYY-MM-DD")._d} onClickDate={
                (date) => {
                    props.onChange.call(this, {
                        target: {
                            value: moment(date).format("YYYY-MM-DD")
                        }
                    });
                }
            } />
        </div>, this.calendarContainer);
    }
    render() {
        var props = this.props;
        return (<input {...props} type="text" ref="input" value={props.value} readOnly={true} onFocus={this.handleFocus.bind(this)} onBlur={this.handleBlur.bind(this)} onChange={props.onChange.bind(this)} />);
    }
}
export default DateInput;
DateInput.defaultProps = {
    onChange: () => {},
    prefixCls: "ui-form-dateinput"
};
