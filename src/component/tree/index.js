/**
* @Date:   2016-06-17T16:39:09+08:00
* @Last modified time: 2017-02-22T18:04:02+08:00
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
import PropTypes from "prop-types";
import style from './tree.css';

class Tree extends Widget {
  constructor(props) {
    super(props);
    this.adaptOptionStatus(props);
    this.state = {
      checkedStatusRecord: null, //checked记录
      selectedStatusRecord: null  //selected记录
    };
  }
  componentDidMount() {
    const props = this.props;
    this.renderTid = null;  //用于延时加载
    //判定初始状态下是否需要展开节点
    let options = Tree.getCloneOptions(props.options);
    if (props.unfoldMode === 'all') {
      options.forEach((itemData) => {
        this.lazyUnfoldOption(itemData, (options) => {
          props.onOptionsChange(options); //反射
        }, true);
      });
    } else if (props.unfoldMode === 1) {  //只展开第一层
      options.forEach((itemData) => {
        this.lazyUnfoldOption(itemData, (options) => {
          props.onOptionsChange(options); //反射
        });
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    this.adaptOptionStatus(nextProps);
  }
  componentWillUnmount() {
    clearTimeout(this.renderTid);
    this.renderTid = null;
  }
  adaptOptionStatus(props) {
    //处理半勾选状态
    if (props.checkMode !== 'none') {
      loop(props.options);
    }

    function loop(options, forceCheck) {
      options.forEach((itemData) => {
        if (forceCheck) { //直接选中所有的子节点
          itemData.checkedStatus = 'checked';
        }
        if (itemData.checkedStatus === 'checked') {
          if (itemData.children && itemData.children.length) {
            loop(itemData.children, true);
          }
        } else {
          if (itemData.children && itemData.children.length) {
            loop(itemData.children);
            let checkedCounts = 0;
            let halfCheckedCounts = 0;
            itemData.children.forEach((itemData) => {
              if (itemData.checkedStatus === 'checked') {
                checkedCounts++;
              }
              if (itemData.checkedStatus === 'halfChecked') {
                halfCheckedCounts++;
              }
            });
            if (checkedCounts === 0) {  //没有子节点被checked
              if (halfCheckedCounts > 0) {
                itemData.checkedStatus = 'halfChecked';
              } else {
                itemData.checkedStatus = 'unchecked';
              }
            } else {
              if (checkedCounts === itemData.children.length) { //全部子节点被checked
                itemData.checkedStatus = 'checked';
              } else {  //部分子节点被checked
                itemData.checkedStatus = 'halfChecked';
              }
            }
          }
        }
      });
    }
  }
  /**
   * 获取selected或者checked状态
   * @param  {[type]} statusType [description]
   * @param  {[type]} options    [description]
   * @return {[type]}            [description]
   */
  getStatusRecord(statusType, options) {
    var record = [];
    loop(options);
    function loop(options) {
      options.forEach((itemData) => {
        if(itemData[statusType + 'Status'] === statusType) {
          record.push(itemData.value);
        }
        if (itemData.children && itemData.children.length) {
          loop(itemData.children);
        }
      });
    }
    return record;
  }
  lazyUnfoldOption(option, callback, isDeepin) {
    const self = this;
    let options_ = Tree.getCloneOptions(this.props.options);
    option = Tree.getOptionFromValue(option.value, options_);
    option.foldedStatus = 'unfolded';
    if (option.children && option.children.length) {
      let loop = function (options) {
        if (options.length > 50) {
          //let totalChildren = option.children;
          let counts = Math.ceil(options.length / 50.0);
          let i = 0;
          //option.children = [];
          let unfoldLoop = function () {
            self.renderTid = setTimeout(() => {
              //option.children = option.children.concat(totalChildren.slice(i * 100, 100));
              options.slice(i * 50, (i + 1) * 50).forEach((itemData) => {
                itemData.rendered = true;
              });
              callback(Tree.getCloneOptions(options_));
              i++;
              if (i < counts) {
                unfoldLoop();
              } else {
                if (isDeepin) { //判定是否做深层次展开
                  options.forEach((itemData) => {
                    itemData.foldedStatus = 'unfolded';
                    if (itemData.children && itemData.children.length) {
                      loop(itemData.children);
                    }
                  });
                }
              }
            }, 0);
          };
          unfoldLoop();
        } else {
          options.forEach((itemData) => {
            itemData.rendered = true;
          });
          callback(options_);
          if (isDeepin) { //判定是否做深层次展开
            options.forEach((itemData) => {
              itemData.foldedStatus = 'unfolded';
              if (itemData.children && itemData.children.length) {
                loop(itemData.children);
              }
            });
          }
        }
      };
      loop(option.children);
    }
  }
  /**
   * Node check handler
   * @param  {[type]} node [description]
   * @return {[type]}      [description]
   */
  handleOptionCheck(option) {
    const props = this.props;
    const state = this.state;
    if (option.disabled) {
      return;
    }
    let options = Tree.getCloneOptions(props.options);
    option = Tree.getOptionFromValue(option.value, options);
    option.checkedStatus = (option.checkedStatus === 'checked' ? 'unchecked' : 'checked');
    //反选其它node
    if (props.checkMode === 'single') {
      uncheckOtherNode(options);
    }
    //同步状态
    syncStatusLoop(options);
    props.onOptionsChange(options); //反射
    let newCheckedStatusRecord = this.getStatusRecord('checked', options);
    if (JSON.stringify(state.checkedStatusRecord) !== JSON.stringify(newCheckedStatusRecord)) {
      this.setState({
        checkedStatusRecord: newCheckedStatusRecord
      });
      props.onCheckedChange(option, newCheckedStatusRecord);
    }

    //向上向下控制
    function uncheckOtherNode(options) {
      options.forEach((itemData) => {
        if (itemData.value !== option.value) {
          itemData.checkedStatus = 'unchecked';
        }
        if (itemData.children && itemData.children.length) {
          uncheckOtherNode(itemData.children);
        }
      });
    }
    function syncStatusLoop(options, checkedStatus) {
      options.forEach((itemData) => {
        if (itemData.value === option.value) {  //处理当前节点
          itemData.children && itemData.children.length && syncStatusLoop(itemData.children, itemData.checkedStatus);
        } else {  //处理其它节点
          if (typeof checkedStatus !== 'undefined') { //children lookup
            itemData.checkedStatus = checkedStatus;
            itemData.children && itemData.children.length && syncStatusLoop(itemData.children, checkedStatus);
          } else {  //parent lookup
            let checkedCounts = 0;
            let halfCheckedCounts = 0;
            if (itemData.children && itemData.children.length) {
              syncStatusLoop(itemData.children);
              itemData.children.forEach((itemData) => {
                if (itemData.checkedStatus === 'checked') {
                  checkedCounts++;
                }
                if (itemData.checkedStatus === 'halfChecked') {
                  halfCheckedCounts++;
                }
              });
              if (checkedCounts === 0) {  //没有子节点被checked
                if (halfCheckedCounts > 0) {
                  itemData.checkedStatus = 'halfChecked';
                } else {
                  itemData.checkedStatus = 'unchecked';
                }
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
  }
  handleOptionSelect(option) {
    const props = this.props;
    const state = this.state;
    if (props.selectMode === 'none') {
      return;
    }
    if (option.disabled) {
      return;
    }
    let options = Tree.getCloneOptions(props.options);
    option = Tree.getOptionFromValue(option.value, options);
    option.selectedStatus = (option.selectedStatus === 'selected' ? 'unselected' : 'selected');
    //反选其它node
    if (props.selectMode === 'single') {
      unselectOtherNode(options);
    }
    function unselectOtherNode(options) {
      options.forEach((itemData) => {
        if (itemData.value !== option.value) {
          itemData.selectedStatus = 'unselected';
        }
        if (itemData.children && itemData.children.length) {
          unselectOtherNode(itemData.children);
        }
      });
    }
    props.onOptionsChange(options); //反射
    let newSelectedStatusRecord = this.getStatusRecord('selected', options);
    if (JSON.stringify(state.selectedStatusRecord) !== JSON.stringify(newSelectedStatusRecord)) {
      this.setState({
        selectedStatusRecord: newSelectedStatusRecord
      });
      props.onSelectedChange(option, newSelectedStatusRecord);
    }
  }
  handleOptionFold(option) {
    const props = this.props;
    let options = Tree.getCloneOptions(props.options);
    option = Tree.getOptionFromValue(option.value, options);
    option.foldedStatus = (option.foldedStatus === 'unfolded' ? 'folded' : 'unfolded');
    clearTimeout(this.renderTid);
      // props.onOptionsChange([].concat(options)); //反射
      // return;
    if (option.foldedStatus === 'unfolded') { //分时渲染调优性能
      this.lazyUnfoldOption(option, (options) => {
        props.onOptionsChange(options); //反射
        props.onFoldedChange(option);
      });
    } else {
      option.children.forEach((itemData) => {
        itemData.rendered = false;
      });
      props.onOptionsChange([].concat(options)); //反射
      props.onFoldedChange(option);
    }
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
                var nodeSelectedCls = itemData.selectedStatus === 'selected' ? `${prefixCls}-node-text-selected` : '';
                var nodeCls = itemData.className || '';
                var textSuffix = '';
                if (itemData.disabled) {
                  nodeCls += ` ${prefixCls}-node-disabled`;
                  textSuffix += '-禁用';
                }
                if (itemData.checkType === 'checkbox') {
                  nodeCls += ` ${prefixCls}-node-with-checkbox`;
                }
                return ((level === 0 || itemData.rendered) ? (<li className={`${prefixCls}-item item-${level}`} key={i}>
                  <div className={`${prefixCls}-node ${nodeCls}`}>
                    {(itemData.children && itemData.children.length) ? <span className={`${prefixCls}-node-foldder ${prefixCls}-node-foldder-${itemData.foldedStatus || 'folded'}`} onClick={self.handleOptionFold.bind(self, itemData)}>{Tree.getFoldderTextFromStatus(itemData.foldedStatus)}</span> : <span className={`${prefixCls}-node-foldder`}></span>}
                    {itemData.checkType === 'checkbox' ? <span className={`${prefixCls}-node-checkbox ${prefixCls}-node-checkbox-${itemData.checkedStatus || 'unchecked'}`} onClick={self.handleOptionCheck.bind(self, itemData)}>{Tree.getCheckboxTextFromStatus(itemData.checkedStatus)}</span> : null}
                    <span className={`${prefixCls}-node-text ${nodeSelectedCls}`} title={itemData.text + textSuffix} onClick={self.handleOptionSelect.bind(self, itemData)}>&nbsp;{props.getDefaultNodeTemplate(itemData)}</span></div>
                  {(itemData.foldedStatus === 'unfolded' && itemData.children && itemData.children.length) ? <div className={`${prefixCls}-children`}>
                    {
                      (function () {
                        return loop(itemData.children, level + 1);
                      }())
                    }
                  </div> : null}
                </li>) : null);
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
Tree.getFoldderTextFromStatus = function (status) {
  var text = '';
  switch (status) {
    case 'unfolded':
      text = '－';
    break;
    case 'folded':
    default:
      text = '＋';
    break;
  }
  return text;
};
Tree.getCloneOptions = function (options) {
  // return options.map((itemData) => {
  //   return Object.assign({}, itemData);
  // });
  return JSON.parse(JSON.stringify(options));
};
Tree.getOptionFromValue = function (value, options) {
  let option = null;
  loop(options);
  function loop(options) {
    options.some((itemData) => {
      if (itemData.value === value) {
        option = itemData;
        return true;
      }
      if (itemData.children && itemData.children.length) {
        loop(itemData.children);
      }
    });
  }
  return option;
};
Tree.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  checkMode: PropTypes.string,
  selectMode: PropTypes.string,
  unfoldMode: PropTypes.any,
  options: PropTypes.array,
  getDefaultNodeTemplate: PropTypes.func,
  onOptionsChange: PropTypes.func,
  onCheckedChange: PropTypes.func,
  onSelectedChange: PropTypes.func
};
Tree.defaultProps = {
  prefixCls: 'ui-tree',
  className: '',
  checkMode: 'multi', //multi or single or none
  selectMode: 'single', //multi or single or none
  unfoldMode: 'none', // none or all
  options: [],  //{value, text, checkedStatus, checkType, selectedStatus, disabled} checkedStatus取值checked，halfChecked,unchecked(默认) checkType取值none(默认),checkbox
  getDefaultNodeTemplate: function (node) {
    return <span>{node.text}</span>;
  },
  onOptionsChange: () => {},
  onCheckedChange: () => {},
  onSelectedChange: () => {},
  onFoldedChange: () => {}
};

export default Tree;
