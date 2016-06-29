/**
* @Date:   2016-06-23T19:18:04+08:00
* @Last modified time: 2016-06-29T16:33:59+08:00
*/

/**
 * Dropdown组件实现
 */
import {Widget} from "../component.js";
import React from 'react';
import ReactDom from 'react-dom';
import style from './form.css';

var activeInstanceId; //当前激活的实例Id
var instanceId = 0;
var panelContainer;

class Dropdown extends Widget {
  constructor(props) {
    super(props);
    this.adaptProps(props);
    this.state = {
      text: '',
      panelStyle: {
        display: 'none'
      }
    };
    this.instanceId = instanceId++;
  }
  adaptProps(props) {
    //同步value
    if (typeof props.value !== 'undefined') {
      props.options.forEach((option) => {
        if (option.value === props.value) {
          option.selected = true;
        } else {
          option.selected = false;
        }
      });
    }
    //默认选中第一个
    if (props.options.length) {
      if (!props.options.some((itemData) => {
        return itemData.selected;
      })) {
        props.options[0].selected = true;
      }
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
      panelContainer.appendTo('body');
      panelContainer = panelContainer[0];
    }
  }
  componentDidMount() {
    const state = this.state;
    this.syncStateFromProps(this.props);
    $('body').on('mousedown.Dropdown' + this.instanceId, (evt) => {
      if (!Dropdown.isInContainer(evt.target, [ReactDom.findDOMNode(this), panelContainer])) {
        this.setState({
          panelStyle: {
            display: 'none'
          }
        });
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    this.adaptProps(nextProps);
    this.syncStateFromProps(nextProps);
  }
  componentWillUnmount() {
    if (activeInstanceId === this.instanceId) {
      ReactDom.unmountComponentAtNode(panelContainer);
      activeInstanceId = -1;
    }
    $('body').off('mousedown.Dropdown' + this.instanceId);
    this.instanceId = null;
  }
  componentDidUpdate() {}
  handleInputClick() {
    const props = this.props;
    const state = this.state;
    if (!props.disabled) {
      activeInstanceId = this.instanceId;
      this.setState({
        display: 'none'
      }, () => {
        Dropdown.renderPanel(this, () => {
          this.setState({
            panelStyle: Dropdown.getPanelStyle(ReactDom.findDOMNode(this), panelContainer.firstChild)
          });
        });
      });
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
          itemData.selected = itemData.value === option.value
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
      itemData.hover = (itemData.value === option.value
        ? true
        : false);
      return itemData;
    }));
  }
  handleOptionMouseLeave(option) {
    const props = this.props;
    props.onOptionsChange.call(this, [].concat(props.options).map((itemData) => {
      itemData.hover = (itemData.value === option.value
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
    if (activeInstanceId === this.instanceId) {
      setTimeout(() => {
        Dropdown.renderPanel(this);
      }, 0);
    }
    let cls = props.disabled
      ? prefixCls + '-disabled'
      : '';
    return (
      <span className={`${prefixCls} ${prefixCls}-${this.instanceId} ${props.className} ${cls}`}>
        <input type="text" className={`${prefixCls}-input-text`} value={state.text} title={state.text} onKeyDown={this.handleInputKeydown.bind(this)} onClick={this.handleInputClick.bind(this)} readOnly={true} placeholder={props.placeholder} /><span className={`${prefixCls}-input-icon`}></span>
      </span>
    );
  }
}

Dropdown.renderPanel = function(cpt, callback) {
  const props = cpt.props;
  const state = cpt.state;
  ReactDom.render(
    <div className={`${props.prefixCls}-panel ${props.prefixCls}-panel-${cpt.instanceId}`} style={state.panelStyle}>
    {props.getDefaultPanelTemplate.call(cpt)}
  </div>, panelContainer, () => {
    callback && callback();
    Dropdown.scrollToSelectedItem(props.options.findIndex((itemData) => {
      return itemData.selected;
    }));
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
    panelWidth = panelEl.outerWidth(),
    winHeight = winEl.height(),
    winWidth = winEl.width(),
    winScrollTop = winEl.scrollTop(),
    winScrollLeft = winEl.scrollLeft();
  var style = {
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

    if (baseOffset.top + baseHeight + panelHeight - winScrollTop <= winHeight) {
      style.top = baseOffset.top + baseHeight + 'px';
    } else {
      style.top = baseOffset.top - panelHeight + 1 + 'px';
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
  prefixCls: React.PropTypes.string,
  className: React.PropTypes.string,
  value: React.PropTypes.string,
  disabled: React.PropTypes.bool,
  placeholder: React.PropTypes.string,
  options: React.PropTypes.array,
  onChange: React.PropTypes.func,
  onOptionsChange: React.PropTypes.func,
  getDefaultPanelTemplate: React.PropTypes.func
};
Dropdown.defaultProps = {
  prefixCls: 'ui-form-dropdown',
  className: '',
  options: [], // {text: '', value: {}, selected: false, disabled: false, hover: false}
  value: void(0), //value 比options里selected优先级大
  disabled: false, //是否禁用
  placeholder: '',
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
            <li key={x} title={option.text} className={`${props.prefixCls}-options-item ${optionCls}`} onMouseEnter={this.handleOptionMouseEnter.bind(this, option)} onMouseLeave={this.handleOptionMouseLeave.bind(this, option)} onClick={this.handleOptionClick.bind(this, option)}>
              {option.text}
            </li>
          );
        })}
      </ul>
    );
  }
};

export default Dropdown;
