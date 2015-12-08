/**
 * Grid组件实现
 */
import {
    Widget
} from "../component.js";
import React from 'react';
import GridRow from './GridRow.js';

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
        return rst;
    }
    getColGroup() {
        let cols = [];
        cols = cols.concat(this.props.columns.map((c, i)=> {
            return <col key={i} style={{width: c.width}}></col>;
        }));
        return <colgroup>{cols}</colgroup>;
    }
    render() {
        const props = this.props;
        const prefixCls = props.prefixCls;
        const ths = this.getThs();
        const rows = this.getRowsByData(props.data);
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
        </div>);
    }
}
Grid.defaultProps = {
    data: [],
    useFixedHeader: false,
    columns: [],
    prefixCls: 'ui-grid'
};

export default Grid;

