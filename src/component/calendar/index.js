/**
 * 日期控件
 */
import {
    Widget
} from "../component.js";
import React from 'react';
import moment from "moment";
class Calendar extends Widget {
    constructor(props) {
        super(props);
        this.state = {
            panelState: "date", //date、month、year三个面板状态切换
            focusDate: props.initialDate //当前切换到的参考日期
        };
    }
    componentWillReceiveProps(nextProps) {
        this.setState(() => ({
            "focusDate": nextProps.initialDate
        }));
    }
    getDateList(date) {
        date = moment(date);
        let props = this.props;
        let state = this.state;
        let firstDateOfMonth = date.clone().startOf('month'),
            beginDate = firstDateOfMonth.startOf('week'),
            tmpDate,
            tmpCls,
            isOutDate,  //是否在可用日期范围外
            isToday;
        let result = [[]];
        let firstLevelIndex = 0;
        let prefixCls = props.prefixCls;
        let i = 0;
        while (i < 42) {
            tmpDate = beginDate.clone();
            tmpDate.add('d', i);
            isOutDate = false;
            isToday = false;
            //区分className
            if (parseInt(tmpDate.format('M'), 10) < parseInt(date.format('M'), 10)) { //上一个月
                tmpCls = `${prefixCls}-prev-month-date ${prefixCls}-inactive`;
            } else if (parseInt(tmpDate.format('M'), 10) > parseInt(date.format('M'), 10)) { //下一个月
                tmpCls = `${prefixCls}-next-month-date ${prefixCls}-inactive`;
            } else {
                tmpCls = `${prefixCls}-current-month-date ${prefixCls}-active`;
            }
            //当前日期标志
            if (tmpDate.format('YYYY-MM-DD') == moment().format('YYYY-MM-DD')) {
                tmpCls += ` ${prefixCls}-is-today`;
                isToday = true;
            }
            //focus date标志
            if (tmpDate.format('YYYY-MM-DD') == moment(state.focusDate).format('YYYY-MM-DD')) {
                tmpCls += ` ${prefixCls}-is-focus-date`;
            }
            //最大日期判断
            if (props.maxDate) {
                if (tmpDate.isAfter(props.maxDate, 'day')) {
                    tmpCls += ` ${prefixCls}-is-out-date`;
                    isOutDate = true;
                }
            }
            //最小日期判断
            if (props.minDate) {
                if (tmpDate.isBefore(props.minDate, 'day')) {
                    tmpCls += ` ${prefixCls}-is-out-date`;
                    isOutDate = true;
                }
            }
            result[firstLevelIndex].push({
                text: tmpDate.format('D'),
                value: tmpDate._d,
                className: tmpCls,
                isFocus: date.isSame(tmpDate, 'day'),
                isOutDate: isOutDate,
                isToday: isToday
            });
            if (i % 7 === 0) { //模7加tr
                if (i === 0) {
                    firstLevelIndex = 0;
                } else {
                    result.push([]);
                    firstLevelIndex++;
                }
            }
            i++; //自增1
        }
        return result;
    }
    getYearList(year) {
        let result = [];
        year = parseInt(year, 10);
        result.push({
            text: year,
            value: year,
            isFocus: true
        });
        Array(59).keys().map((i) => {
            result.push({
                text: year + i + 1,
                value: year + i + 1,
                isFocus: false
            });
            result.unshift({
                text: year - i - 1,
                value: year - i - 1,
                isFocus: false
            });
        });
        return result;
    }
    getMonthList(month) {
        let result = [];
        month = parseInt(month, 10);
        Array(12).keys().map((i) => {
            let isRefer = false;
            if (i + 1 == month) {
                isRefer = true;
            }
            result.push({
                text: i + 1,
                value: i + 1,
                isRefer: isRefer
            });
        });
        return result;
    }
    /*
     * 月导航减1
     */
    onClickNavPrev() {
        this.setState(({
            focusDate
        }) => ({
            focusDate: moment(focusDate).subtract('months', 1)._d,
            panelState: "date"
        }));
    }
    /**
     * 月导航加1
     */
    onClickNavNext() {
        this.setState(({
            focusDate
        }) => ({
            focusDate: moment(focusDate).add('months', 1)._d,
            panelState: "date"
        }));
    }
    /**
     * 点击year label切换到年份选择面板
     * @private
     */
    onClickLabelYear() {
        this.setState(({
            panelState
        }) => ({
            panelState: panelState === "year" ? "date" : "year"
        }));
    }
    /**
     * 点击month label切换到月份选择面板
     * @private
     */
    onClickLabelMonth() {
        this.setState(({
            panelState
        }) => ({
            panelState: panelState === "month" ? "date" : "month"
        }));
    }
    onClickDateCell(v) {
        if (!v.isOutDate) {
            if (this.props.focusChangeWithClick) {
                this.setState(() => ({
                    focusDate: v.value
                }));
            }
            this.props.onClickDate.call(this, v.value);
        }
    }
    render() {
        var props = this.props,
            state = this.state,
            prefixCls = props.prefixCls,
            className = props.className,
            enableYearMonthChange = props.enableYearMonthChange,
            focusDate = state.focusDate,
            panelState = state.panelState;
        let currentDateList = this.getDateList(focusDate);
        return (<div className={`${prefixCls}` + ' ' +  className}>
                <div className={`${prefixCls}-header`}>
                <div className={`${prefixCls}-nav-prev`} style={{
                    "display": enableYearMonthChange ? "block": "none" 
                }} onClick={this.onClickNavPrev}>&#9668;</div>
                <div className={`${prefixCls}-title`}>
                <span className={`${prefixCls}-label-year`} style={{
                    "display": panelState !== "year" ? "block": "none" 
                }} onClick={this.onClickLabelYear}>{moment(focusDate).format("YYYY")}</span><select
                className={`${prefixCls}-year-selector`} style={{
                    "display": panelState === "year" ? "block": "none" 
                }} onChange={this.onChangeYear}></select>年<span
                className={`${prefixCls}-label-month`} style={{
                    "display": panelState !== "month" ? "block": "none" 
                }} onClick={this.onClickLabelMonth}>{moment(focusDate).format("MM")}</span><select className={`${prefixCls}-month-selector`} style={{
                    "display": panelState === "month" ? "block": "none" 
                }} onChange={this.onChangeMonth}></select>月
                </div>
                <div className={`${prefixCls}-nav-next`} style={{
                    "display": enableYearMonthChange ? "block": "none" 
                }} onClick={this.onClickNavNext}>&#9658;</div>
                </div>
                    <table cellPadding="0" cellSpacing="0">
                    <thead className={`${prefixCls}-week-header`}>
                    <tr>
                    <th><span className={`${prefixCls}-date-cell`}>日</span></th>
                    <th><span className={`${prefixCls}-date-cell`}>一</span></th>
                    <th><span className={`${prefixCls}-date-cell`}>二</span></th>
                    <th><span className={`${prefixCls}-date-cell`}>三</span></th>
                    <th><span className={`${prefixCls}-date-cell`}>四</span></th>
                    <th><span className={`${prefixCls}-date-cell`}>五</span></th>
                    <th><span className={`${prefixCls}-date-cell`}>六</span></th>
                    </tr>
                    </thead>
                    <tbody className={`${prefixCls}-date-body`}>
                    { 
                        currentDateList.map((arr, i) => {
                            return (<tr key={i}>
                                { 
                                    arr.map((v, j) => {
                                        return (<td key={j} className={`${prefixCls}-date-cell ` + v.className} onClick={this.onClickDateCell.bind(this, v)}>{v.text}</td>);
                                    })
                                }
                                </tr>);
                        })
                    }
                </tbody>
                    </table>
                    </div>);
    }
}
Calendar.defaultProps = {
    initialDate: new Date(),
    maxDate: null,
    minDate: null,
    enableYearMonthChange: true, //年份和月份面板切换
    showTime: true, //是否显示时间
    focusChangeWithClick: true, //每次点击date cell，focusDate同时改变
    onClickDate: () => {},
    prefixCls: 'ui-calendar'
};

export default Calendar;
