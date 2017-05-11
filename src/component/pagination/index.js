/**
 * 分页控件
 * @require jQuery
 */
import React from 'react';
import PropTypes from "prop-types";
import {
    Widget
} from '../component.js';
import Dropdown from '../form/Dropdown.js';
import style from './pagination.css';

class Pagination extends Widget {
    constructor(props) {
      super(props);
      this.state = {
        currentInput: props.currentPage,
        currentPage: props.currentPage,
        max: Math.ceil(props.total / props.pageSize),
        pageSizeList: [1, 2, 3, 4, 5, 6].map((v) => {
          var pageSize = v * props.pageSize
          return {
            value: pageSize,
            text: pageSize + '条/页',
            selected: pageSize == props.pageSize
          };
        })
      };
    }

    componentWillUnmount() {
      // this.props.onBeforeDestroy(this.props.record);
    }

    componentWillReceiveProps(nextProps) {
      this.setState({
        currentInput: nextProps.currentPage,
        currentPage: nextProps.currentPage,
        max: Math.ceil(nextProps.total / nextProps.pageSize),
        pageSizeList: this.state.pageSizeList.map((itemData) => {
          return Object.assign(itemData, {
            selected: itemData.value == nextProps.pageSize
          });
        })
      });
    }

    getPages() {
      let total = this.props.total,
        size = this.props.pageSize,
        currentPage = this.state.currentPage,
        span = this.props.pages,
        max = Math.ceil(total / size),
        pages = [],
        left,
        right;

      if (currentPage > max) {
        currentPage = max;
      }

      left = currentPage - Math.floor(span / 2) + 1;
      if (left < 1) {
        left = 1;
      }

      right = left + span - 2;
      if (right >= max) {
        right = max;
        left = right - span + 2;
        if (left < 1) {
          left = 1;
        }
      } else {
        right -= left > 1 ? 1 : 0;
      }

      // add first
      if (left > 1) {
        pages.push(1);
        if (left !== 2) pages.push(-1);
      }

      for (let i = left; i < right + 1; i++) {
        pages.push(i);
      }

      // add last
      if (right < max) {
        if (right + 1 != max) pages.push(-2);
        pages.push(max);
      }

      return { pages, max };
    }

    setCurrent(currentPage) {
      currentPage = parseInt(currentPage);
      this.setState({
        currentInput: currentPage,
        currentPage: currentPage,
      });
    }

    handleChange(currentPage) {
      const state = this.state;
      if (state.currentPage != currentPage) {
        this.setCurrent(currentPage);
        this.props.onPageChange(currentPage);
      }
    }

    handleInputChange({ range, value }, e) {
      const state = this.state;
      var currentPage = this.getPropertyRange(value === undefined ? (+e.target.value) : value, range.min, range.max);
      if (state.currentPage != currentPage) {
        this.setState({ currentInput: currentPage });
        this.props.onPageChange(currentPage);
      }
    }
    handlePageSizeChange(data) {
      const props = this.props;
      props.onPageSizeChange.call(this, data.value);
    }
    handleClickArrowNav(direction) {
      const state = this.state;
      var { max } = this.getPages();
      const range = { min: 1, max: max === 0 ? 1 : max };
      var currentPage = this.state.currentPage;
      if (direction === 'prev') {
        currentPage--;
      } else if (direction === 'next') {
        currentPage++;
      }
      currentPage = this.getPropertyRange(currentPage, range.min, range.max);
      if (state.currentPage != currentPage) {
        this.setState({ currentInput: currentPage });
        this.props.onPageChange(currentPage);
      }
    }
    getPropertyRange(number, min, max) {
      return isNaN(number) || number < min ? min : number > max ? max : number;
    }
    render() {
      var currentInput = this.state.currentInput;
      var currentPage = this.state.currentPage;
      var { pages, max } = this.getPages();
      var items = [];
      var props = this.props, 
        state = this.state,
        prefixCls = props.prefixCls; 
      var self = this;
      /*
      items.push(
        <li key="previous" onClick={currentPage <= 1 ? null : this.handleChange.bind(this, currentPage - 1)} className={currentPage <= 1 ? 'disabled' : '' }>
          <a>prev</a>
        </li>
      )
      */
      //总记录数
      items.push(
        <li className={ prefixCls + '-total'} key="total">共<a href="javascript:;">{ this.props.total }</a>个记录</li>
      );
      //向前箭头
      items.push(
        <li className={ prefixCls + '-prev'} key="prev" onClick={this.handleClickArrowNav.bind(this, 'prev')}><a href="javascript:;">&lt;</a></li>
      );
      //items.push(
        //<li className="ui-pagination-pole" key="current">第<a>{ currentPage }</a>页</li>
      //);

      pages.forEach(function (page) {
        if (page === -1 || page === -2) {
          items.push(
            <li className={ prefixCls + '-ellipsis'} key={ page }><a>...</a></li>
          );
        }else {
          items.push(
            <li onClick={ self.handleChange.bind(self, page)} className={ page === currentPage ? (prefixCls + '-item ' + prefixCls +'-active') : (prefixCls + '-item') } key={page}>
              <a>{page}</a>
            </li>
          );
        }
      });
      //向后箭头
      items.push(
        <li className={ prefixCls + '-next'} key="next" onClick={this.handleClickArrowNav.bind(this, 'next')}><a href="javascript:;">&gt;</a></li>
      );
      //每页记录数切换
      items.push(
        <li className={ prefixCls + '-switch'} key="switch">
          <Dropdown className={prefixCls + 'switch-dd'} options={state.pageSizeList} onOptionsChange={
            (v) => {
              this.setState({
                pageSizeList: v
              });
            }
          } onChange={this.handlePageSizeChange.bind(this)} />
        </li>
      );

      //items.push(
          //<li className="ui-pagination-pole" key="total"> 共<a>{ max === 0 ? 1 : max }</a>页</li>
      //);
      /*
      items.push(
        <li key="next" onClick={currentPage >= max ? null : this.handleChange.bind(this, currentPage + 1)} className={currentPage >= max ? ' disabled' : '' }>
          <a>next</a>
        </li>
      )*/
      const range = { min: 1, max: max === 0 ? 1 : max };
      items.push(
        <li className={prefixCls + '-pole'} key="input">
          跳至<span className={prefixCls + '-inputs'}>
          <input type="text" ref="number" className={ prefixCls + '-inputs-number'} min={range.min} max={range.max}
           value={currentInput} onFocus={(e)=> {e.target.select();}}
           onChange={ this.handleInputChange.bind(self, { range }) } />
          <button className={ prefixCls + '-inputs-btn ' + prefixCls + '-inputs-up-btn'}
           onClick={ this.handleInputChange.bind(self, { range, value: currentInput + 1 }) }></button>
                              <button className={prefixCls + '-inputs-btn ' + prefixCls + '-inputs-down-btn'}
           onClick={ this.handleInputChange.bind(self, { range, value: currentInput - 1 }) }></button>
        </span>页</li>
      );
      //<button className={prefixCls + '-submit-btn'} onClick={ self.handleChange.bind(self, (currentInput > max ? max : currentInput) || 1)}>确定</button>
      return (
        <div className={prefixCls + ' ' + props.className}>
          <ul>
            { items }
          </ul>
        </div>
      );
    }
}

Pagination.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  currentPage: PropTypes.number, // 当前页
  total: PropTypes.number,   // 记录总条数
  pageSize: PropTypes.number,// 每页条数
  pages: PropTypes.number,   // 显示页码数
  onPageChange: PropTypes.func,   // 翻页后回调
  onPageSizeChange: PropTypes.func,  //pageSize反射
};
Pagination.defaultProps = {
  prefixCls: 'ui-pagination',
  className: '',
  currentPage: 1,
  pageSize: 10,
  pages: 6,
  total: 0,
  onPageChange: () => {},
  onPageSizeChange: () => {}
};

export default Pagination;
