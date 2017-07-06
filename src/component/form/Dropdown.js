/**
* @Date:   2016-06-23T19:18:04+08:00
* @Last modified time: 2017-01-11T11:43:56+08:00
*/

/**
 * Dropdown组件实现
 */
import {Widget} from "../component.js";
import React from 'react';
import ReactDom from 'react-dom';
import PropTypes from "prop-types";
import style from './form.css';

var panelContainer;

class Dropdown extends Widget {
  constructor(props) {
    super(props);
    //this.adaptProps(props);
    this.state = {
      text: '',
      panelStyle: {
        display: 'none'
      }
    };
    this.instanceId = Dropdown.instanceId++;
  }
  /**
   * 根据value值调整option
   */
  adaptOptions() {
    const props = this.props;
    let options = props.options.map((itemData) => {
      return Object.assign({}, itemData);
    });
    let needChange = false;
    if (typeof props.value !== 'undefined') {
      options.forEach((option) => {
        if (option.value == props.value) {
          if (!option.selected) {
            needChange = true;
          }
          option.selected = true;
        } else {
          if (option.selected) {
            needChange = true;
          }
          option.selected = false;
        }
      });
    }
    //默认选中第一个
    if (props.autoSelectFirstOption) {
      if (options.length) {
        if (!options.some((itemData) => {
          return itemData.selected;
        })) {
          if (!options[0].selected) {
            needChange = true;
          }
          options[0].selected = true;
        }
      }
    }
    if (needChange) {
      props.onOptionsChange(options);
    }
  }
  syncStateFromProps(props) {
    var selectedOption = props.options.find((itemData) => {
      return itemData.selected;
    });
    if (selectedOption) {
      this.setState({
        text: selectedOption.text
      });
    }
  }
  componentWillMount() {
    if (!panelContainer) { //不存在panel容器，动态创建
      panelContainer = $(`<div class="${Dropdown.defaultProps.prefixCls}-panel-manager"></div>`);
      panelContainer.on('mouseenter', `.${Dropdown.defaultProps.prefixCls}-options-item`, function () {
        $(this).addClass(`${Dropdown.defaultProps.prefixCls}-options-item-hover`);
      }).on('mouseleave', `.${Dropdown.defaultProps.prefixCls}-options-item`, function () {
        $(this).removeClass(`${Dropdown.defaultProps.prefixCls}-options-item-hover`);
      });
      panelContainer.appendTo('body');
      panelContainer = panelContainer[0];
    }
  }
  componentDidMount() {
    const state = this.state;
    this.adaptOptions();
    this.nextTick(() => {
      this.syncStateFromProps(this.props);
    });
    this.panelContainer = panelContainer;
    $('body').on('mousedown.Dropdown' + this.instanceId, (evt) => {
      if (Dropdown.activeInstanceId === this.instanceId) {
        if (!Dropdown.isInContainer(evt.target, [ReactDom.findDOMNode(this), panelContainer])) {
          this.setState({
            panelStyle: {
              display: 'none'
            }
          }, () => {
            Dropdown.activeInstanceId = -1;
          });
        }
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    //this.adaptProps(nextProps);
    this.syncStateFromProps(nextProps);
  }
  componentWillUnmount() {
    if (Dropdown.activeInstanceId === this.instanceId) {
      ReactDom.unmountComponentAtNode(panelContainer);
      Dropdown.activeInstanceId = -1;
    }
    $('body').off('mousedown.Dropdown' + this.instanceId);
    this.instanceId = null;
    this.panelContainer = null;
  }
  componentDidUpdate(prevProps, prevState) {
    this.adaptOptions();
  }
  handleInputClick() {
    const props = this.props;
    const state = this.state;
    if (!props.disabled) {
      Dropdown.activeInstanceId = this.instanceId;
      Dropdown.renderPanel(this, () => {
        this.setState({
          panelStyle: Dropdown.getPanelStyle(ReactDom.findDOMNode(this), panelContainer.firstChild)
        });
      });
      // this.setState({
      //   display: 'none'
      // }, () => {
      // });
    }
  }
  handleInputKeydown(evt) {
    const props = this.props;
    const state = this.state;
    var currentSelectedIndex = -1;
    var expr = 0;
    if (evt.keyCode === 38) {
      expr = -1;
    } else if (evt.keyCode === 40) {
      expr = 1;
    } else if (evt.keyCode === 13) { //回车
      let selectedOption = props.options.find((itemData) => {
        return itemData.selected;
      });
      this.setState({
        text: selectedOption.text,
        panelStyle: {
          display: 'none'
        }
      });
      props.onChange.call(this, selectedOption);
    }
    if (expr) {
      currentSelectedIndex = props.options.findIndex((itemData) => {
        return itemData.selected;
      });
      if (currentSelectedIndex + expr >= props.options.length) {
        currentSelectedIndex = 0;
      } else if (currentSelectedIndex + expr < 0) {
        currentSelectedIndex = props.options.length - 1;
      } else {
        currentSelectedIndex = currentSelectedIndex + expr;
      }
      this.setState({
        text: props.options[currentSelectedIndex].text
      });
      //反射
      props.onOptionsChange.call(this, [].concat(props.options).map((itemData, i) => {
        itemData.selected = (i === currentSelectedIndex
          ? true
          : false);
        return itemData;
      }));
    }
  }
  handleOptionClick(option) {
    const props = this.props;
    if (!option.disabled) { // 如果该option未被禁用
      let oldSelectedValue = props.options.find((itemData) => {
        return itemData.selected;
      });
      oldSelectedValue = oldSelectedValue ? oldSelectedValue.value : '';
      if (option.value !== oldSelectedValue) {  //新值和旧值不同才发生作用
        let newOptions = [].concat(props.options);
        // 更新options下各项的被选择值
        newOptions.forEach((itemData) => {
          itemData.selected = itemData.value == option.value
          ? true
          : false;
        });
        this.setState({
          text: option.text,
          panelStyle: {
            display: 'none'
          }
        });
        //反射
        props.onOptionsChange.call(this, newOptions);
        props.onChange.call(this, option);
      } else {
        this.setState({
          panelStyle: {
            display: 'none'
          }
        });
      }
    }
  }
  handleOptionMouseEnter(option) {
    const props = this.props;
    props.onOptionsChange.call(this, [].concat(props.options).map((itemData) => {
      itemData.hover = (itemData.value == option.value
        ? true
        : false);
      return itemData;
    }));
  }
  handleOptionMouseLeave(option) {
    const props = this.props;
    props.onOptionsChange.call(this, [].concat(props.options).map((itemData) => {
      itemData.hover = (itemData.value == option.value
        ? false
        : itemData.hover);
      return itemData;
    }));
  }
  render() {
    const props = this.props;
    const state = this.state;
    const prefixCls = props.prefixCls;
    //渲染面板
    if (Dropdown.activeInstanceId === this.instanceId) {
      setTimeout(() => {
        Dropdown.renderPanel(this);
      }, 0);
    }
    let cls = props.disabled
      ? prefixCls + '-disabled'
      : '';
    let stateCls = (Dropdown.activeInstanceId === this.instanceId && state.panelStyle.display === 'block') ? `${prefixCls}-state-active` : '';
    return (
      <span className={`${prefixCls} ${prefixCls}-${this.instanceId} ${props.className} ${cls} ${stateCls}`}>
        <input type="text" className={`${prefixCls}-input-text`} value={state.text} title={state.text} onKeyDown={this.handleInputKeydown.bind(this)} onClick={this.handleInputClick.bind(this)} readOnly={true} placeholder={props.placeholder} /><span className={`${prefixCls}-input-icon`}></span>
      </span>
    );
  }
}
Dropdown.activeInstanceId = -1;
Dropdown.instanceId = 0;

Dropdown.renderPanel = function(cpt, callback) {
  const props = cpt.props;
  const state = cpt.state;

  let appearAnimateCls = (state.panelStyle.display === 'block' ? `${props.prefixCls}-panel-transition-appear` : '');
  let panelCls = '';
  if (props.className) {
    panelCls += `${props.prefixCls}-panel-` + props.className;
  }
  ReactDom.render(
    <div className={`${props.prefixCls}-panel ${panelCls} ${props.prefixCls}-panel-${cpt.instanceId} ${appearAnimateCls}`} style={state.panelStyle} key={`${cpt.instanceId}`}>
    {props.getDefaultPanelTemplate.call(cpt)}
  </div>, panelContainer, () => {
    callback && callback();
    // Dropdown.scrollToSelectedItem(props.options.findIndex((itemData) => {
    //   return itemData.selected;
    // }));
  });
};

Dropdown.getPanelStyle = function(baseSelector, panelSelector) {
  var baseEl = $(baseSelector),
    panelEl = $(panelSelector),
    winEl = $(window),
    baseOffset = baseEl.offset(),
    baseHeight = baseEl.outerHeight(),
    baseWidth = baseEl.outerWidth(),
    panelHeight = panelEl.outerHeight(),
    panelVisibleHeight = 0,
    panelWidth = panelEl.outerWidth(),
    winHeight = winEl.height(),
    winWidth = winEl.width(),
    winScrollTop = winEl.scrollTop(),
    winScrollLeft = winEl.scrollLeft();
  var style = {
    display: 'block',
    position: 'absolute',
    zIndex: 10100,
    top: '-10000px',
    left: '-10000px',
    minWidth: baseEl.outerWidth() - 2 + 'px'
  };

  //先垂直设置
  if (baseOffset.top - winScrollTop > winHeight - (baseOffset.top - winScrollTop + baseHeight)) { //如果上方的高度大于下方
    //设置面板最大高度

    style.maxHeight = baseOffset.top - winScrollTop + 'px';
    panelHeight = panelEl.outerHeight(); //重新获取面板高度
    panelVisibleHeight = Math.min(panelHeight, parseFloat(style.maxHeight));

    if (baseOffset.top + baseHeight + panelVisibleHeight - winScrollTop <= winHeight) {
      style.top = baseOffset.top + baseHeight + 'px';
    } else {
      style.top = baseOffset.top - panelVisibleHeight + 1 + 'px';
    }
  } else { //否则永远从下方显示
    //设置面板最大高度
    style.maxHeight = winHeight - (baseOffset.top - winScrollTop + baseHeight) - 2 + 'px';
    style.top = baseOffset.top + baseHeight + 'px';
  }
  //再水平设置
  if (baseOffset.left + panelWidth - winScrollTop <= winWidth) {
    style.left = baseOffset.left + 'px';
  } else {
    style.left = baseOffset.left + baseWidth - panelWidth + 'px';
  }
  return style;
};

Dropdown.isInContainer = function(elemSelector, container) {
  var elEl = $(elemSelector);
  return [].concat(container).some((cSelector) => {
    var cEl = $(cSelector);
    return elEl.is(cEl) || $.contains(cEl[0], elEl[0]);
  });
};
/**
 * 跟随滚动条滚动
 * @method scrollToSelectedItem
 * @param  {[type]}             vm                   [description]
 * @param  {[type]}             currentSelectedIndex [description]
 * @return {[type]}                                  [description]
 */
Dropdown.scrollToSelectedItem = function(currentSelectedIndex) {
  var panelEl = $(panelContainer.firstChild);
  //滚动条跟随
  panelEl && panelEl.is(':visible') && panelEl.scrollTop($('.' + Dropdown.defaultProps.prefixCls + 'options-item', panelEl).outerHeight() * (currentSelectedIndex + 1) - panelEl.height());
};
Dropdown.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  autoSelectFirstOption: PropTypes.bool,
  options: PropTypes.array,
  onChange: PropTypes.func,
  onOptionsChange: PropTypes.func,
  getDefaultPanelTemplate: PropTypes.func
};
Dropdown.defaultProps = {
  prefixCls: 'ui-form-dropdown',
  className: '',
  options: [], // {text: '', value: {}, selected: false, disabled: false, hover: false}
  value: void(0), //value 比options里selected优先级大
  disabled: false, //是否禁用
  placeholder: '',
  autoSelectFirstOption: true,
  onChange: (evt) => {},
  onOptionsChange: (evt) => {},
  getDefaultPanelTemplate: function () {
    const props = this.props;
    const state = this.state;
    return (
      <ul className={`${props.prefixCls}-options-list`}>
        {props.options.map((option, x, options) => {
          var optionCls = '';
          if (option.selected) {
            optionCls += ` ${props.prefixCls}-options-item-selected`;
          }
          if (option.disabled) {
            optionCls += ` ${props.prefixCls}-options-item-disabled`;
          }
          if (option.hover) {
            optionCls += ` ${props.prefixCls}-options-item-hover`;
          }
          return (
            <li key={`${x}-${option.value}`} title={option.text} className={`${props.prefixCls}-options-item ${optionCls}`} onClick={this.handleOptionClick.bind(this, option)}>
              {option.text}
            </li>
          );
        })}
      </ul>
    );
  }
};

export default Dropdown;
