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
      isEditing: false,
    };
    this.instanceId = instanceId++;
  }
  componentDidMount() {
    const self = this;
    $(document).on('mousedown.Dropdown' + self.instanceId, (evt) => {
      if(self.state.isEditing) {
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
  }
  componentWillUnmount() {
    $(document).off('mousedown.Dropdown' + this.instanceId);
    this.instanceId = null;
  }
  handleEnableInputs(e) {
    const self = this;
    self.setState({ isEditing : true });
  }
  handleDisableInputs(e) {
    const self = this;
    self.setState({ isEditing: false });
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
        const $li = $(self.refs.ulItems).children(`.${self.props.prefixCls}-datapane-option`);
        const $highlightLi = $li.filter('.highlight');
        if ($highlightLi.length) {
          const selectedIndex = self.props.options.findIndex((option, x) => $li[x] === $highlightLi[0]);
          self.handleOptionClick(selectedIndex);
        }
        break;
    }
  }
  handleOptionsRoam(roamType) {
    const self = this;
    const $dropdown = $(`.${self.props.prefixCls}-${self.instanceId}`);
    const $ul = $(self.refs.ulItems);
    const $li = $(self.refs.ulItems).children(`.${self.props.prefixCls}-datapane-option`);
    if(!$li.length) return false;
    let $oldHighlightLi = $li.filter('.highlight');
    let $newHighlightLi = $li.first();
    if(roamType == 'up') {
      if($oldHighlightLi.length) {
        $newHighlightLi = $oldHighlightLi.prev();
        $newHighlightLi.length || ($newHighlightLi = $li.last());
      }
    }
    if(roamType == 'down') {
      if($oldHighlightLi.length) {
        $newHighlightLi = $oldHighlightLi.next();
        $newHighlightLi.length || ($newHighlightLi = $li.first());
      }
    }
    $newHighlightLi.addClass('highlight').siblings().removeClass('highlight');

    const maxHeight = parseInt($ul.css('maxHeight'));
    let visible_top = $ul.scrollTop();
    let visible_bottom = maxHeight + visible_top;
    let newHighlightLi_top = $newHighlightLi.position().top + visible_top;
    let newHighlightLi_bottom = newHighlightLi_top + $newHighlightLi.outerHeight();
    if (newHighlightLi_bottom >= visible_bottom) {
      $ul.scrollTop((newHighlightLi_bottom - maxHeight) > 0 ? newHighlightLi_bottom - maxHeight : 0);
    } else if (newHighlightLi_top < visible_top) {
      $ul.scrollTop(newHighlightLi_top);
    }
  }
  handleOptionClick(currentIndex) {
    const self = this;
    const props = self.props;
    if(!props.options[currentIndex].disabled) { // 如果该option未被禁用
      // 单选：更新各option的选择状态
      props.options.forEach((option, x) => {
        option.selected = currentIndex === x ? true : false;
      });
      // 单选：获取当前选择option
      const selectedOption = props.options.find(option => option.selected);
      self.setState({
        isEditing: false,
      });
      self.props.onSelect.call(this, {
        // target: self,
        selectedOptions: [selectedOption],
      });
    }
  }
  render() {
    const props = this.props;
    const state = this.state;
    const prefixCls = props.prefixCls;

    return (<div className={ `${prefixCls} ${prefixCls}-${this.instanceId} ${props.className || ''} ${(state.isEditing ? `${prefixCls}-isediting` : '')}` }>
      <div className={ `${prefixCls}-console` }
           onClick={ state.isEditing ? undefined : this.handleEnableInputs.bind(this) }>
        <input type="text" ref="inputText"
               className={ `${prefixCls}-console-text` }
               value={ (props.options.find(i=>i.selected)||{text:'--请选择--'}).text }
               title={ (props.options.find(i=>i.selected)||{text:'--请选择--'}).text }
               onKeyDown={ this.handleKeyDown.bind(this) }
               onKeyUp={ this.handleKeyUp.bind(this) }
               readOnly={ true } />
        <span className={ `${prefixCls}-console-toggle` }>&nbsp;</span>
      </div>
      <div className={ `${prefixCls}-datapane` }
           style={ {display: !state.isEditing ? 'none' : undefined} }>
        <div ref="ulItems" className={ `${prefixCls}-datapane-options` }>
          {
            props.options.map((option, x, options)=>
            (<div key={x} title={ option.text }
                  className={ Dropdown.getOptionClass(prefixCls, option, x, options) }
                  onClick={ this.handleOptionClick.bind(this, x) }
                  onMouseEnter={ (e)=>{ $(e.currentTarget).addClass('highlight').siblings().removeClass('highlight'); } }
                  onMouseLeave={ (e)=>{ $(e.currentTarget).removeClass('highlight'); } }>
              { option.text }
            </div>))
          }
        </div>
      </div>
    </div>);
  }
}
Dropdown.getOptionClass = function(prefixCls, option, x, options) {
  let classString = `${prefixCls}-datapane-option ${prefixCls}-datapane-option_${x}`;
  if (option.disabled) classString += ` ${prefixCls}-datapane-option_disabled`;
  if (option.selected && options.findIndex(i => i.selected) === x) classString += ` ${prefixCls}-datapane-option_selected`;
  return classString;
};
Dropdown.propTypes = {
  prefixCls: React.PropTypes.string,
  className: React.PropTypes.string,
  options: React.PropTypes.array,
  onSelect: React.PropTypes.func,
};
Dropdown.defaultProps = {
  prefixCls: 'ui-form-dropdown',
  className: '',
  options: [], // {text: '', value: '' }
  onSelect: (evt) => {},
};

export default Dropdown;
