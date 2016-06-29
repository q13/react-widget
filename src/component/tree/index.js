/**
* @Date:   2016-06-17T16:39:09+08:00
* @Last modified time: 2016-06-29T17:22:07+08:00
*/

/**
 * Tree
 * @require Jquery
 */
import {
  Widget
} from "../component.js";
import React from 'react';
import ReactDom from 'react-dom';
import style from './tree.css';

class Tree extends Widget {
  constructor(props) {
    super(props);
    this.adaptOptionStatus(props);
    this.state = {};
  }
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {
    this.adaptOptionStatus(nextProps);
  }
  componentWillUnmount() {}
  adaptOptionStatus(props) {
    //处理半勾选状态
    loop(props.options);

    function loop(options) {
      options.forEach((itemData) => {
        if (itemData.children && itemData.children.length) {
          loop(itemData.children);
          let checkedCounts = 0;
          itemData.children.forEach((itemData) => {
            if (itemData.checkedStatus === 'checked') {
              checkedCounts++;
            }
          });
          if (checkedCounts === 0) {  //没有子节点被checked
            itemData.checkedStatus = 'unchecked';
          } else {
            if (checkedCounts === itemData.children.length) { //全部子节点被checked
              itemData.checkedStatus = 'checked';
            } else {  //部分子节点被checked
              itemData.checkedStatus = 'halfChecked';
            }
          }
        }
      });
    }
  }
  /**
   * Node check handler
   * @param  {[type]} node [description]
   * @return {[type]}      [description]
   */
  handleOptionCheck(option) {
    const props = this.props;
    let options = [].concat(props.options);
    option.checkedStatus = (option.checkedStatus === 'checked' ? 'unchecked' : 'checked');
    loop(options);
    //向上向下控制
    function loop(options, checkedStatus) {
      options.forEach((itemData) => {
        if (itemData.value === option.value) {  //处理当前节点
          itemData.children && itemData.children.length && loop(itemData.children, itemData.checkedStatus);
        } else {  //处理其它节点
          if (typeof checkedStatus !== 'undefined') { //children lookup
            itemData.checkedStatus = checkedStatus;
            itemData.children && itemData.children.length && loop(itemData.children, checkedStatus);
          } else {  //parent lookup
            let checkedCounts = 0;
            if (itemData.children && itemData.children.length) {
              loop(itemData.children);
              itemData.children.forEach((itemData) => {
                if (itemData.checkedStatus === 'checked') {
                  checkedCounts++;
                }
              });
              if (checkedCounts === 0) {  //没有子节点被checked
                itemData.checkedStatus = 'unchecked';
              } else {
                if (checkedCounts === itemData.children.length) { //全部子节点被checked
                  itemData.checkedStatus = 'checked';
                } else {  //部分子节点被checked
                  itemData.checkedStatus = 'halfChecked';
                }
              }
            }
          }
        }
      });
    }
    props.onOptionsChange(options); //反射
  }
  render() {
    const props = this.props;
    const state = this.state;
    const prefixCls = props.prefixCls;
    const options = props.options;
    const self = this;
    return (<div className={ `${prefixCls} ${props.className || ''}`}>
      {
        (function loop(options, level) {
          return (<ul className={`${prefixCls}-list list-${level}`}>
            {
              options.map((itemData, i) => {
                //var nodeCheckedCls = '';  //节点选中状态：空/半选/全选
                return (<li className={`${prefixCls}-item item-${level}`} key={i}>
                  <div className={`${prefixCls}-node`}><span className={`${prefixCls}-node-checkbox ${prefixCls}-node-checkbox-${itemData.checkedStatus || 'unchecked'}`} onClick={self.handleOptionCheck.bind(self, itemData)}>{Tree.getCheckboxTextFromStatus(itemData.checkedStatus)}</span><span className={`${prefixCls}-node-text`} title={itemData.text}>&nbsp;{itemData.text}</span></div>
                  {(itemData.children && itemData.children.length) ? <div className={`${prefixCls}-children`}>
                    {
                      (function () {
                        return loop(itemData.children, level + 1);
                      }())
                    }
                  </div> : null}
                </li>);
              })
            }
          </ul>);
        }(options, 0))
      }
    </div>);
  }
}
Tree.getCheckboxTextFromStatus = function (status) {
  var text = '';
  switch (status) {
    case 'checked':
      text = '√';
    break;
    case 'halfChecked':
      text = '－';
    break;
    case 'unchecked':
      text = '';
    break;
    default:
    break;
  }
  return text;
};
Tree.propTypes = {
  prefixCls: React.PropTypes.string,
  className: React.PropTypes.string,
  options: React.PropTypes.array,
  onOptionsChange: React.PropTypes.func
};
Tree.defaultProps = {
  prefixCls: 'ui-tree',
  className: '',
  options: [],
  onOptionsChange: () => {}
};

export default Tree;
