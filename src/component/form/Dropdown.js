/**
 * Dropdown组件实现
 */
import {
  Widget
} from "../component.js";
import React from 'react';
import ReactDom from 'react-dom';
import style from './form.css';

let instanceId = 0;
class Dropdown extends Widget {
  constructor(props) {
    super(props);
    this.state = {
      isInputing: false,
      hoverOption: undefined,
      focusOption: undefined,
      selectedOption: undefined,
    };
    this.instanceId = instanceId++;
    this.datapaneContainer = null;
  }
  componentWillMount() {
    this.datapaneContainer = document.createElement("div");
    document.body.appendChild(this.datapaneContainer);
  }
  componentDidMount() {
    const self = this;
    self.renderDatapane({
      visible: false
    });
    $(document).on('mousedown.Dropdown' + self.instanceId, (evt) => {
      if(self.state.isInputing) {
        const $target = $(evt.target);
        const $dropdown = $(`.${self.props.prefixCls}-${self.instanceId}`);
        const $datapane = $dropdown.find(`.${self.props.prefixCls}-datapane`);
        const $consoleText = $dropdown.find(`.${self.props.prefixCls}-console-text`);
        if (!$target.is($datapane) &&
            !$target.closest($datapane).length &&
            !$target.is($consoleText)) {
          self.handleDisableInputs(self);
        }
      }
    });
    $(document).on('keydown.Dropdown' + self.instanceId, (evt) => {
      if(self.state.isInputing) {
        self.handleKeyDown(evt);
      }
    });
    $(document).on('keyup.Dropdown' + self.instanceId, (evt) => {
      if(self.state.isInputing) {
        self.handleKeyUp(evt);
      }
    });
  }
  componentWillUnmount() {
    ReactDom.unmountComponentAtNode(this.datapaneContainer);
    document.body.removeChild(this.datapaneContainer);
    $(document).off('.Dropdown' + this.instanceId);
    this.datapaneContainer = null;
    this.instanceId = null;
  }
  componentDidUpdate() {
    const self = this;
    self.renderDatapane({
      visible: self.state.isInputing
    });
  }
  handleEnableInputs(evt) {
    const self = this;
    self.setState({
      isInputing: true
    }, () => {
      const inputText = self.refs.inputText;
      inputText.select();
      inputText.focus();
      if (typeof self.props.onEnableInputs === 'function') {
        self.props.onEnableInputs.call(this, {
          target: self,
        });
      }
    });
  }
  handleDisableInputs(evt) {
    const self = this;
    self.setState({
      isInputing: false,
      focusOption: self.state.selectedOption,
    }, () => {
      if (typeof self.props.onDisableInputs === 'function') {
        self.props.onDisableInputs.call(this, {
          target: self,
        });
      } else {}
    });
  }
  handleKeyDown(e) {
    const self = this;
    const stroke = e.which || e.keyCode;
    switch (stroke) {
      case 38: // 上
        e.preventDefault(); // prevent cursor move
        self.handleOptionsRoam('up');
        break;
      case 40: // 下
        e.preventDefault(); // prevent cursor move
        self.handleOptionsRoam('down');
        break;
      case 13: // 回车
        e.preventDefault();
        break;
    }
  }
  handleKeyUp(e) {
    const self = this;
    const stroke = e.which || e.keyCode;
    switch (stroke) {
      case 13: // 回车
        e.preventDefault();
        if (self.state.focusOption !== undefined) {
          const focusIndex = self.props.options.findIndex(i => i === self.state.focusOption);
          self.handleOptionClick(focusIndex);
        }
      break;
    }
  }
  handleOptionsRoam(roamType) {
    const self = this;
    const optionsLength = self.props.options.length;
    if (!optionsLength) return;
    let focusIndex = self.props.options.findIndex(i => i === self.state.focusOption);
    if (roamType == 'up') {
      focusIndex = !(focusIndex >= 0) ? 0 : focusIndex - 1 >= 0 ? focusIndex - 1 : optionsLength - 1;
    }
    if (roamType == 'down') {
      focusIndex = !(focusIndex >= 0) ? 0 : focusIndex + 1 <= optionsLength - 1 ? focusIndex + 1 : 0;
    }
    // UI定位与翻页
    const $ul = $(`.${self.props.prefixCls}-datapane-options`, self.datapaneContainer);
    const $newHighlightLi = $ul.children(`.${self.props.prefixCls}-datapane-option-${focusIndex}`);
    const maxHeight = parseInt($ul.css('maxHeight'));
    let visibleTop = $ul.scrollTop();
    let visibleBottom = maxHeight + visibleTop;
    let newHighlightLiTop = $newHighlightLi.position().top + visibleTop;
    let newHighlightLiBottom = newHighlightLiTop + $newHighlightLi.outerHeight();
    if (newHighlightLiBottom >= visibleBottom) {
      $ul.scrollTop((newHighlightLiBottom - maxHeight) > 0 ? newHighlightLiBottom - maxHeight : 0);
    } else if (newHighlightLiTop < visibleTop) {
      $ul.scrollTop(newHighlightLiTop);
    }
    // 设定focus状态
    self.setState({
      focusOption: self.props.options[focusIndex]
    });
  }
  handleOptionClick(currentIndex) {
    const self = this;
    const props = self.props;
    if (!(currentIndex >= 0)) return;
    if (!props.options[currentIndex].disabled) { // 如果该option未被禁用
      // const targetOptions = $.extend(true, [], props.options);
      const targetOptions = JSON.parse(JSON.stringify(props.options));
      // 更新options下各项的被选择值
      targetOptions.forEach((option, x) => {
        option.selected = currentIndex === x ? true : false;
      });
      // 设定focus, selected状态以及执行回调
      self.setState({
        isInputing: false,
        focusOption: props.options[currentIndex],
        selectedOption: props.options[currentIndex],
      }, () => {
        self.props.onChange.call(self, targetOptions[currentIndex]);
        self.props.onOptionsChange.call(self, targetOptions);
      });
    }
  }
  render() {
    const props = this.props;
    const state = this.state;
    const prefixCls = props.prefixCls;

    const text = state.focusOption ? state.focusOption.text :
                 (props.options.find(i => i.selected) || {text: '--请选择--'}).text;
    return (<div className={ `${prefixCls} ${prefixCls}-${this.instanceId} ${props.className || ''} ${(state.isInputing ? `${prefixCls}-isinputing` : '')}` }>
      <div className={ `${prefixCls}-console` }
        ref='console'
           onClick={ state.isInputing ? undefined : this.handleEnableInputs.bind(this) }>
        <input type="text" ref="inputText"
               className={ `${prefixCls}-console-text` }
               value={ text }
               title={ text }
               readOnly={ true } />
        <span className={ `${prefixCls}-console-toggle` }>&nbsp;</span>
      </div>
    </div>);
  }
  getOptionClass(currentIndex) {
    const { prefixCls, options } = this.props;
    const { hoverOption, focusOption } = this.state;
    const option = options[currentIndex];
    let classString = `${prefixCls}-datapane-option ${prefixCls}-datapane-option-${currentIndex}`;
    if (hoverOption === options[currentIndex]) classString += ` ui-common-hover`;
    if (focusOption === options[currentIndex]) classString += ` ui-common-focus`;
    if (option.disabled) classString += ` ui-common-disabled`;
    if (option.selected && options.findIndex(i => i.selected) === currentIndex) classString += ` ui-common-selected`;
    return classString;
  }
  renderDatapane(data) {
    var props = this.props,
        state = this.state,
        prefixCls = props.prefixCls;
    var visible = data.visible;
    var consoleEl,
        datapaneEl,
        winEl,
        inputOffset,
        inputHeight,
        inputWidth,
        datapaneHeight,
        datapaneWidth,
        winWidth,
        winHeight,
        winScrollTop,
        winScrollLeft,
        top = 0,
        left = 0;
    if (visible) {
        consoleEl = $(ReactDom.findDOMNode(this.refs.console));
        datapaneEl = $(`.${prefixCls}-datapane`, this.datapaneContainer);
        winEl = $(window);
        inputOffset = consoleEl.offset();
        inputHeight = consoleEl.outerHeight();
        inputWidth = consoleEl.outerWidth();
        datapaneHeight = datapaneEl.outerHeight();
        datapaneWidth = datapaneEl.outerWidth();
        winWidth = winEl.width();
        winHeight = winEl.height();
        winScrollTop = winEl.scrollTop();
        winScrollLeft = winEl.scrollLeft();
        if (inputOffset.top - winScrollTop >= datapaneHeight) {
            if (winHeight - (inputOffset.top - winScrollTop) - inputHeight >= datapaneHeight) {   //下面放得下优先放下面
                top = inputOffset.top + inputHeight - 1;
            } else {
                top = inputOffset.top - datapaneHeight + 1;
            }
        } else {    //上面放不下直接放下面
            top = inputOffset.top + inputHeight - 1;
        }
        if (inputOffset.left - winScrollLeft + inputWidth >= datapaneWidth) {
            if (winWidth - (inputOffset.left - winScrollLeft) >= datapaneWidth) {   //左面放得下优先放右面
                left = inputOffset.left;
            } else {
                left = inputOffset.left + inputWidth - datapaneWidth;
            }
        } else {    //左面放不下直接放右面
            left = inputOffset.left;
        }
    }
    ReactDom.render(<div className={ `${prefixCls} ${prefixCls}-${this.instanceId} ${props.className || ''}` } style={{
      "zIndex": 10000,
      "display": visible ? "block" : "none",
      "position": "absolute",
      "top": top + "px",
      "left": left + "px"
    }}>
    <div className={ `${prefixCls}-datapane` } style={{
      minWidth: $(`.${prefixCls}-${this.instanceId}`).outerWidth(true)
    }}>
        { props.getTemplateDatapane.call(this, this) }
      </div>
    </div>, this.datapaneContainer);
  }
}
Dropdown.defaultGetTemplateDatapane = function(self) {
  return (<div className={ `${self.props.prefixCls}-datapane-options` }>
    {
      self.props.options.map((option, x, options) =>
      (<div key={x} title={ option.text }
            className={ self.getOptionClass(x) }
            onClick={ self.handleOptionClick.bind(self, x) }
            onMouseEnter={ (e)=>{ self.setState({hoverOption: options[x]}); } }
            onMouseLeave={ (e)=>{ self.setState({hoverOption: undefined}); } }>
        { option.text }
      </div>))
    }
  </div>);
}
Dropdown.propTypes = {
  prefixCls: React.PropTypes.string,
  className: React.PropTypes.string,
  options: React.PropTypes.array,
  onChange: React.PropTypes.func,
  onOptionsChange: React.PropTypes.func,
  getTemplateDatapane: React.PropTypes.func,
  onEnableInputs: React.PropTypes.func,
  onDisableInputs: React.PropTypes.func,
};
Dropdown.defaultProps = {
  prefixCls: 'ui-form-dropdown',
  className: '',
  options: [], // {text: '', value: {}, selected: false, disabled: false }
  onChange: (evt) => {},
  onOptionsChange: (evt) => {},
  getTemplateDatapane: Dropdown.defaultGetTemplateDatapane,
  onEnableInputs: (evt) => {},
  onDisableInputs: (evt) => {},
};

export default Dropdown;
