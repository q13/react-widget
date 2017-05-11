/**
* @Date:   2016-09-13T19:05:50+08:00
* @Last modified time: 2016-12-28T16:20:11+08:00
*/

import React from 'react';
import PropTypes from "prop-types";
import {
  Widget
} from '../component.js';

class GridRow extends Widget {
  componentWillUnmount() {
    this.props.onBeforeDestroy(this.props.record);
  }

  render() {
    const props = this.props;
    const prefixCls = props.prefixCls;
    const columns = props.columns;
    const record = props.record;
    const index = props.index;
    const cells = [];

    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      const colCls = col.className || '';
      const renderer = col.renderer;
      let width = col.width || 'auto';
      let style = col.style || {};
      let text = record[col.dataIndex];

      let tdProps;
      let colSpan;
      let rowSpan;
      let notRender = false;
      if (/^[0-9]*$/.test(width)) {
        width = width + 'px';
      }

      if (renderer) {
        text = renderer(text, record, index) || {};
        tdProps = text.props || {};
        if (!React.isValidElement(text) && 'content' in text) {
          text = text.content;
        }
        rowSpan = tdProps.rowSpan;
        colSpan = tdProps.colSpan;
      }
      if (rowSpan === 0 || colSpan === 0) {
        notRender = true;
      }
      if (!notRender) {
        cells.push(<td key={i} colSpan={colSpan} rowSpan={rowSpan} className={`${colCls}`} data-index={col.dataIndex} style={Object.assign({}, style, {
          width: width
        })}>
          {text}
        </td>);
      }
    }
    return (<tr className={`${prefixCls} ${props.className || ''}`}>{cells}</tr>);
  }
}
GridRow.propTypes = {
  onBeforeDestroy: PropTypes.func,
  record: PropTypes.object,
  prefixCls: PropTypes.string,
};
GridRow.defaultProps = {
  onBeforeDestroy: () => {
  }
};

export default GridRow;
