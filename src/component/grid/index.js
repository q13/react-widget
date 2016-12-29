/**
* @Date:   2016-07-11T14:20:03+08:00
* @Last modified time: 2016-12-29T15:51:28+08:00
*/
/**
 * Grid组件实现
 */
import {Widget} from "../component.js";
import React from 'react';
import ReactDom from 'react-dom';
import GridRow from './GridRow.js';
import Pagination from '../pagination';
import style from './grid.css';
class Grid extends Widget {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const self = this;
    const props = this.props;
    //注册滚动事件
    $(this.refs.body).on('scroll', function () {
      let rowRange = self.getVisibleRowRangeOnScroll();
      props.onBodyScroll(rowRange);
    });
    setTimeout(() => {
      this.updateFixedHeaderColWidth();
    }, 0);
    //页面resize后重新计算
    $(window).resize(() => {
      this.updateFixedHeaderColWidth();
    });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.data !== this.props.data) {
      this.updateFixedHeaderColWidth();
    }
  }
  componentWillUnmount() {
    const props = this.props;
    $(`.${props.prefixCls}-body`, ReactDom.findDOMNode(this)).off('scroll');
  }
  getThs() {
    return this.props.columns.map((c, i) => {
      return <th key={i} className={c.className || ''} data-index={c.dataIndex}>{c.text}</th>;
    });
  }
  getRowsByData(data) {
    const props = this.props;
    const columns = props.columns;
    let rst = [];
    for (let i = 0; i < data.length; i++) {
      const record = data[i];
      rst.push(<GridRow record={record} index={i} prefixCls={`${props.prefixCls}-row`} columns={columns} key={i}/>);
    }
    if (rst.length == 0) {
      return <tr>
        <td colSpan={columns.length} className="ui-grid-empty">
          <span className="empty-text">{this.props.emptyText}</span>
        </td>
      </tr>;
    } else {
      return rst;
    }
  }
  updateFixedHeaderColWidth() {
    const props = this.props;
    if (props.useFixedHeader) {
      let noData = props.data.total === 0 || props.data.rows.length === 0;
      let $tds = $('tr:first', this.refs.tbody).find('td');
      //let factor = ($(this.refs.tbody).height() - $(this.refs.body).height()) > 10 ? 0 : 0.5;
      let $ths = $('th[data-index]', this.refs.thead);
      if (noData) {
        $(this.refs.thead).closest('table').width($tds.width() + 2);
      } else {
        $(this.refs.thead).closest('table').css({
          width: 'auto'
        });
      }
      $ths.each(function (i) {
        let w = 0;
        let $th = $(this);
        if (!noData) {
          let rectValue = $tds.filter('[data-index="' + $th.data('index') + '"]').get(0).getBoundingClientRect();
          w = rectValue.width ? rectValue.width : (rectValue.right - rectValue.left);
          w = (w - 1) + 'px';
        } else {
          w = 100 / $ths.length + '%';
        }
        //jquery Width方法精度不够
        $th.css({
          paddingLeft: 0,
          paddingRight: 0,
          marginLeft: 0,
          marginRight: 0,
          width: w
        });
      });
    }
  }
  /**
   * 获取滚动过程中可视区域的行index范围
   */
  getVisibleRowRangeOnScroll() {
    var $body = $(this.refs.body);
    var $tr = $('tr', $body);
    var startIndex = -1;
    var endIndex = -1;
    var scrollTop = $body.scrollTop();
    var bodyHeight = $body.height();
    var tmpRowHeight = 0;
    $tr.each(function (i) {
      tmpRowHeight += $(this).outerHeight() - 1;
      if (startIndex < 0 && tmpRowHeight > scrollTop) {
        startIndex = i;
      }
      if (endIndex < 0 && tmpRowHeight > scrollTop + bodyHeight) {
        endIndex = i;
        return false;
      }
      if ((i + 1) === $tr.length && endIndex === -1) {
        endIndex = $tr.length;
      }
    });
    return {
      startIndex: startIndex,
      endIndex: endIndex
    };
  }
  onPageChange(currentPage) {
    if (this.props.onPageChange) {
      this.props.onPageChange({currentPage: currentPage, pageSize: this.props.data.pageSize});
    }
  }
  render() {
    const props = this.props;
    const prefixCls = props.prefixCls;
    const rows = this.getRowsByData(props.data.rows || []);
    let className = props.prefixCls;
    if (props.className) {
      className += ' ' + props.className;
    }
    let headerTable = null;
    let thead = null;
    if (props.header) {
      thead = (<thead className={`${prefixCls}-thead`} ref="thead">
        {props.header.props.children}
      </thead>);
    } else {
      thead = (
        <thead className={`${prefixCls}-thead`} ref="thead">
          <tr>{this.getThs()}</tr>
        </thead>
      );
    }
    if (props.useFixedHeader) {
      headerTable = (
        <div className={`${prefixCls}-header`} style={{
          marginBottom: '-1px'
        }}>
          <table cellPadding="0" cellSpacing="0" style={{
            tableLayout: 'fixed',
            width: 'auto'
          }}>
            {thead}
          </table>
        </div>
      );
      thead = null;
    }
    let paginationProps = {
      currentPage: props.data.currentPage,
      total: props.data.total,
      pageSize: props.data.pageSize
    };
    return (
      <div className={className}>
        {headerTable}
        <div className={`${prefixCls}-body`} ref="body">
          <table cellPadding="0" cellSpacing="0">
            {thead}
            <tbody className={`${prefixCls}-tbody`} ref="tbody">
              {rows}
            </tbody>
          </table>
        </div>
        {(props.pagination && paginationProps.pageSize !== Number.MAX_VALUE)
          ? <Pagination { ...paginationProps } onPageChange={(currentPage) => {
              props.onPageChange.call(this, currentPage);
            }} onPageSizeChange={(pageSize) => {
              props.onPageSizeChange.call(this, pageSize);
            }}/>
          : null}
      </div>
    );
  }
}
Grid.defaultProps = {
  data: {
    currentPage: 1,
    total: 0,
    pageSize: 10,
    rows: []
  },
  header: false, //支持自定义表格头，多用于组合单元格头展示
  useFixedHeader: false,
  columns: [],
  prefixCls: 'ui-grid',
  emptyText: '无数据',
  pagination: true,
  onPageChange: () => {},
  onPageSizeChange: () => {},
  onBodyScroll: () => {}  //body滚动
};
export default Grid;
