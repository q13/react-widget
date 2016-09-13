/**
* @Date:   2016-09-02T14:48:41+08:00
* @Last modified time: 2016-09-13T16:41:20+08:00
*/

/**
 * 日期控件
 * @require jQuery
 */
import {Widget} from "../component.js";
import React from 'react';
import moment from "moment";
import style from "./calendar.css";
let cptId = 0;
class Calendar extends Widget {
  constructor(props) {
    super(props);
    this.state = {
      panelState: "date", //date、month、year三个面板状态切换
      focusDate: props.initialDate //当前切换到的参考日期
    };
    this.cptId = cptId++;
  }
  componentWillReceiveProps(nextProps) {
    this.setState(() => ({"focusDate": nextProps.initialDate}));
  }
  componentDidMount() {
    $(document).on('mousedown.Calendar' + this.cptId, () => {
      this.setState({"panelState": "date"});
    }).on('mousedown.Calendar' + this.cptId, `.${this.props.prefixCls}-` + this.cptId, (evt) => {
      evt.stopPropagation();
    });
  }
  componentWillUnmount() {
    $(document).off('mousedown.Calendar' + this.cptId);
  }
  getDateList(date) {
    date = moment(date);
    let props = this.props;
    let state = this.state;
    let firstDateOfMonth = date.clone().startOf('month'),
      beginDate = firstDateOfMonth.startOf('week'),
      tmpDate,
      tmpCls,
      isOutDate, //是否在可用日期范围外
      isToday;
    let result = [
      []
    ];
    let firstLevelIndex = 0;
    let prefixCls = props.prefixCls;
    let i = 0;
    while (i < 42) {
      tmpDate = beginDate.clone();
      tmpDate.add(i, 'd');
      isOutDate = false;
      isToday = false;
      //区分className
      if (parseInt(tmpDate.format('M'), 10) < parseInt(date.format('M'), 10)) { //上一个月
        tmpCls = `${prefixCls}-prev-month-date ${prefixCls}-date-inactive`;
      } else if (parseInt(tmpDate.format('M'), 10) > parseInt(date.format('M'), 10)) { //下一个月
        tmpCls = `${prefixCls}-next-month-date ${prefixCls}-date-inactive`;
      } else {
        tmpCls = `${prefixCls}-current-month-date ${prefixCls}-date-active`;
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
      if (i % 7 === 0) { //模7加tr
        if (i === 0) {
          firstLevelIndex = 0;
        } else {
          result.push([]);
          firstLevelIndex++;
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
      i++; //自增1
    }
    return result;
  }
  getYearList(date) {
    let result = [];
    let year = parseInt(moment(date).format("YYYY"), 10);
    result.push({text: year, value: year, isFocus: true});
    for (let i of Array(59).keys()) {
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
    }
    return result;
  }
  getMonthList(date) {
    let result = [];
    let month = parseInt(moment(date).format("M"), 10);
    for (let i of Array(12).keys()) {
      let isFocus = false;
      if (i + 1 == month) {
        isFocus = true;
      }
      result.push({
        text: i + 1,
        value: i + 1,
        isFocus: isFocus
      });
    }
    return result;
  }
  /*
     * 月导航减1
     */
  handleClickNavPrev() {
    this.setState(({focusDate}) => ({
      focusDate: moment(focusDate).subtract(1, 'months')._d,
      panelState: "date"
    }));
  }
  /**
     * 月导航加1
     */
  handleClickNavNext() {
    this.setState(({focusDate}) => ({
      focusDate: moment(focusDate).add(1, 'months')._d,
      panelState: "date"
    }));
  }
  /**
     * 点击year label切换到年份选择面板
     * @private
     */
  handleClickLabelYear(evt) {
    this.setState(({panelState}) => ({
      panelState: panelState === "year"
        ? "date"
        : "year"
    }));
    evt.stopPropagation();
  }
  /**
     * 点击month label切换到月份选择面板
     * @private
     */
  handleClickLabelMonth(evt) {
    this.setState(({panelState}) => ({
      panelState: panelState === "month"
        ? "date"
        : "month"
    }));
    evt.stopPropagation();
  }
  handleClickDateCell(v) {
    if (!v.isOutDate) {
      let d = v.value,
        focusDate = moment(this.state.focusDate);
      if (this.props.showTime) { //是否附加时间
        d = moment(d).hour(focusDate.hour()).minute(focusDate.minute()).second(focusDate.second())._d;
      }
      if (this.props.focusChangeWithClick) {
        this.setState(() => ({focusDate: d}));
      }
      this.props.onClickDate.call(this, d);
    }
    this.setState(() => ({panelState: "date"}));
  }
  handleChangeYear(evt) {
    var target = evt.target;
    this.setState(({focusDate}) => ({
      focusDate: moment(focusDate).set("year", target.value / 1)._d,
      panelState: "date"
    }));
  }
  handleChangeMonth(evt) {
    var target = evt.target;
    this.setState(({focusDate}) => ({
      focusDate: moment(focusDate).set("month", target.value / 1 - 1)._d,
      panelState: "date"
    }));
  }
  handleClickSelf() {
    this.setState(() => ({panelState: "date"}));
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
    let currentYearList = this.getYearList(focusDate);
    let currentMonthList = this.getMonthList(focusDate);
    let timePanel = null,
      showTime = props.showTime;
    if (showTime) {
      if (showTime === true) {
        showTime = ["hour", "minute", "second"];
      }
      timePanel = showTime.map((v) => {
        if (v === "hour") {
          return (
            <select className="hour" key="hour" value={moment(focusDate).hour()} onChange={(evt) => {
              this.setState({
                focusDate: moment(focusDate).hour(evt.target.value)._d
              });
            }}>
              {Array.from(Array(24).keys()).map((i) => {
                return (
                  <option value={i} key={i}>{('0' + i).slice(-2)}</option>
                );
              })}
            </select>
          );
        } else if (v === "minute") {
          return (
            <span key="minute">：<select className="minute" value={moment(focusDate).minute()} onChange={(evt) => {
              this.setState({
                focusDate: moment(focusDate).minute(evt.target.value)._d
              });
            }}>
                {Array.from(Array(60).keys()).map((i) => {
                  return (
                    <option value={i} key={i}>{('0' + i).slice(-2)}</option>
                  );
                })}
              </select>
            </span>
          );
        } else if (v === "second") {
          return (
            <span key="second">：<select className="second" value={moment(focusDate).second()} onChange={(evt) => {
              this.setState({
                focusDate: moment(focusDate).second(evt.target.value)._d
              });
            }}>
                {Array.from(Array(60).keys()).map((i) => {
                  return (
                    <option value={i} key={i}>{('0' + i).slice(-2)}</option>
                  );
                })}
              </select>
            </span>
          );
        }
      });
    }
    return (
      <div className={`${prefixCls}` + ` ${prefixCls}-` + this.cptId + ' ' + (className || '')} onClick={this.handleClickSelf.bind(this)}>
        <div className={`${prefixCls}-header`}>
          <div className={`${prefixCls}-nav-prev`} style={{
            "display": enableYearMonthChange
              ? "block"
              : "none"
          }} onClick={this.handleClickNavPrev.bind(this)}>&lt;</div>
          <div className={`${prefixCls}-title`}>
            <span className={`${prefixCls}-label-year`} style={{
              "display": panelState !== "year"
                ? "inline-block"
                : "none"
            }} onClick={this.handleClickLabelYear.bind(this)}>{moment(focusDate).format("YYYY")}</span>
            <select className={`${prefixCls}-year-selector`} style={{
              "display": panelState === "year"
                ? "inline-block"
                : "none"
            }} onChange={this.handleChangeYear.bind(this)} value={currentYearList.filter((v) => {
              return v.isFocus;
            })[0].value} onClick={(evt) => evt.stopPropagation()}>
              {currentYearList.map((v, i) => {
                return (
                  <option key={i} value={v.value}>{v.text}</option>
                );
              })}
            </select>&nbsp;年&nbsp;<span className={`${prefixCls}-label-month`} style={{
        "display": panelState !== "month"
          ? "inline-block"
          : "none"
      }} onClick={this.handleClickLabelMonth.bind(this)}>{moment(focusDate).format("MM")}</span>
            <select className={`${prefixCls}-month-selector`} style={{
              "display": panelState === "month"
                ? "inline-block"
                : "none"
            }} onChange={this.handleChangeMonth.bind(this)} value={currentMonthList.filter((v) => {
              return v.isFocus;
            })[0].value} onClick={(evt) => evt.stopPropagation()}>
              {currentMonthList.map((v, i) => {
                return (
                  <option key={i} value={v.value}>{v.text}</option>
                );
              })}
            </select>&nbsp;月
          </div>
          <div className={`${prefixCls}-nav-next`} style={{
            "display": enableYearMonthChange
              ? "block"
              : "none"
          }} onClick={this.handleClickNavNext.bind(this)}>&gt;</div>
        </div>
        <table cellPadding="0" cellSpacing="0" className={`${prefixCls}-date-panel`}>
          <thead className={`${prefixCls}-week-header`}>
            <tr>
              <th>
                <span className={`${prefixCls}-date-cell`}>日</span>
              </th>
              <th>
                <span className={`${prefixCls}-date-cell`}>一</span>
              </th>
              <th>
                <span className={`${prefixCls}-date-cell`}>二</span>
              </th>
              <th>
                <span className={`${prefixCls}-date-cell`}>三</span>
              </th>
              <th>
                <span className={`${prefixCls}-date-cell`}>四</span>
              </th>
              <th>
                <span className={`${prefixCls}-date-cell`}>五</span>
              </th>
              <th>
                <span className={`${prefixCls}-date-cell`}>六</span>
              </th>
            </tr>
          </thead>
          <tbody className={`${prefixCls}-date-body`}>
            {currentDateList.map((arr, i) => {
              return (
                <tr key={i}>
                  {arr.map((v, j) => {
                    return (
                      <td key={j} onClick={this.handleClickDateCell.bind(this, v)}>
                        <span className={`${prefixCls}-date-cell ` + v.className}>{v.text}</span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className={`${prefixCls}-footer clearfix`}>
          <div className={`${prefixCls}-time-panel`}>
            <label className={`${prefixCls}-time-label`}>时间：</label>{timePanel}
          </div>
          <div className={`${prefixCls}-footer-action`}>
            <button type="button" className={`${prefixCls}-to-today-btn`} onClick={() => {
              this.setState({focusDate: new Date()});
            }}>今天</button>
            <button type="button" className={`${prefixCls}-submit-btn`} onClick={() => {
              this.props.onClickDate.call(this, this.state.focusDate);
            }}>确定</button>
          </div>
        </div>
      </div>
    );
  }
}
Calendar.defaultProps = {
  initialDate: new Date(),
  maxDate: null,
  //minDate: moment().subtract(1, 'days'),
  minDate: null,
  enableYearMonthChange: true, //年份和月份面板切换
  showTime: false, //是否显示时间, true/false or ["hour", "minute", "second"]
  focusChangeWithClick: true, //每次点击date cell，focusDate同时改变
  onClickDate: () => {},
  prefixCls: 'ui-calendar'
};
export default Calendar;
