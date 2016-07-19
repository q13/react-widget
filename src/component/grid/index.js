/**
* @Date:   2016-07-11T14:20:03+08:00
* @Last modified time: 2016-07-19T16:37:42+08:00
*/

/**
 * Grid组件实现
 */
import {
    Widget
} from "../component.js";
import React from 'react';
import GridRow from './GridRow.js';
import Pagination from '../pagination';
import style from './grid.css';

class Grid extends Widget {
    constructor(props) {
        super(props);
    }
    getThs() {
        return this.props.columns.map((c, i)=> {
            return <th key={i} className={c.className || ''}>{c.text}</th>;
        });
    }
    getRowsByData(data) {
        const props = this.props;
        const columns = props.columns;
        let rst = [];
        for (let i = 0; i < data.length; i++) {
            const record = data[i];
            rst.push(<GridRow
                record={record}
                index={i}
                prefixCls={`${props.prefixCls}-row`}
                columns={columns}
                key={i} />
            );
        }
        if(rst.length == 0) {
          return <tr><td colSpan={ columns.length } className="ui-grid-empty"><span className="empty-text">{ this.props.emptyText }</span></td></tr>
        } else {
            return rst;
        }
    }
    getColGroup() {
        let cols = [];
        cols = cols.concat(this.props.columns.map((c, i)=> {
            return <col key={i} style={{width: c.width}}></col>;
        }));
        return <colgroup>{cols}</colgroup>;
    }
    onPageChange(currentPage){
      if (this.props.onPageChange) {
          this.props.onPageChange({
              currentPage: currentPage,
              pageSize: this.props.data.pageSize
          })
      }
    }
    render() {
        const props = this.props;
        const prefixCls = props.prefixCls;
        const ths = this.getThs();
        const rows = this.getRowsByData(props.data.rows || []);
        let className = props.prefixCls;
        if (props.className) {
            className += ' ' + props.className;
        }
        let headerTable = null;
        let thead = (<thead className={`${prefixCls}-thead`}>
            <tr>{ths}</tr>
        </thead>);
        if (props.useFixedHeader) {
            headerTable = (<div className={`${prefixCls}-header`}>
                <table>
                    {this.getColGroup()}
                    {thead}
                </table>
            </div>);
            thead = null;
        }
        let paginationProps = {
            currentPage: props.data.currentPage,
            total: props.data.total,
            pageSize: props.data.pageSize
        }
        return (<div className={className}>
            {headerTable}
            <div className={`${prefixCls}-body`}>
                <table>
                    {this.getColGroup()}
                    {thead}
                    <tbody className={`${prefixCls}-tbody`}>
                        {rows}
                    </tbody>
                </table>
            </div>
            {
            (props.pagination && Props.pageSize !== Number.MAX_VALUE) ?
              <Pagination { ...paginationProps } onPageChange={ (currentPage) => {
                props.onPageChange.call(this, currentPage);
              }} onPageSizeChange={
                (pageSize) => {
                  props.onPageSizeChange.call(this, pageSize);
                }
              }/> : null
            }
        </div>);
    }
}

Grid.defaultProps = {
    data: {
      currentPage: 1,
      total: 0,
      pageSize: 10,
      rows: []
    },
    useFixedHeader: false,
    columns: [],
    prefixCls: 'ui-grid',
    emptyText: '无数据',
    pagination: true, //是否存在分页
    onPageChange: () => {},
    onPageSizeChange: () => {}
};

export default Grid;
