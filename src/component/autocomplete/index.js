/**
 * AutoComplete组件实现
 */
import {
  Widget
} from "../component.js";
import moment from 'moment';
import React from 'react';
import ReactDom from 'react-dom';
import style from './autocomplete.css';

let instanceId = 0;
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}
class AutoComplete extends Widget {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      currentOptions: [],
    };
    this.searchAvailableFrom = moment()._d;
    this.searchTimeout = null;
    this.instanceId = instanceId++;
  }
  componentWillMount() {
    this.proceedWillReceiveProps(this.props, {});
  }
  componentDidMount() {
    const self = this;
    $(document).on('mousedown.AutoComplete' + self.instanceId, (evt) => {
      if(self.state.isEditing) {
        const $target = $(evt.target);
        const $autocomplete = $(`.${self.props.prefixCls}-${self.instanceId}`);
        const $dropdown = $autocomplete.find(`.${self.props.prefixCls}-dropdown`);
        const $consoleText = $autocomplete.find(`.${self.props.prefixCls}-console-text`);
        if (!$target.is($dropdown) &&
            !$target.closest($dropdown).length &&
            !$target.is($consoleText)) {
          self.handleDisableInputs(self);
        }
      }
    });
  }
  componentWillUnmount() {
    clearTimeout(this.searchTimeout);
    $(document).off('mousedown.AutoComplete' + this.instanceId);
    this.searchTimeout = null;
    this.instanceId = null;
  }
  componentWillReceiveProps(nextProps) {
    this.proceedWillReceiveProps(nextProps, this.props);
  }
  proceedWillReceiveProps(nextProps, prevProps) {
    const state = {};
    (nextProps.allOptions!==prevProps.allOptions) && (state.currentOptions = nextProps.allOptions);
    this.setState(state);
  }
  handleEnableInputs(e) {
    const self = this;
    self.setState({ isEditing : true }, ()=>{
      const domInput = self.refs.inputText;
      domInput.select();
      domInput.focus();
      if(self.props.onEnableInput) {
        self.props.onEnableInput.call(this, {
          target: self,
          currentOption: {
            text: self.props.text,
            value: self.props.value,
          },
        });
      }
      else {
        self.handleSearch(self.props.text);
      }
    });
  }
  handleDisableInputs(e) {
    const self = this;
    self.setState({ isEditing: false }, ()=>{
      if(self.props.onDisableInput) {
        self.props.onDisableInput.call(this, {
          target: self,
          currentOption: {
            text: self.props.text,
            value: self.props.value,
          },
        });
      }
      else {
      }
    });
  }
  handleInputChange(e) {
    const self = this;
    self.setState({isEditing: true});
    self.props.onChange.call(this, {
      target: self,
      currentOption: {
        text: e.target.value,
        value: e.target.value,
      },
    });
    self.searchAvailableFrom = moment(moment() + self.props.minSearchInterval*1000)._d;
    self.searchTimeout = setTimeout(()=>{
      if(self.searchAvailableFrom<=moment()._d) {
        self.handleSearch(self.props.text);
        clearTimeout(self.searchTimeout);
      }
    }, self.props.minSearchInterval*1000);
  }
  handleKeyDown(e) {
    const self = this;
    const stroke = e.which || e.keyCode;
    switch (stroke) {
      case 38:
        e.preventDefault(); // prevent cursor move
        self.handleDropdownRoam('up');
        break;
      case 40:
        e.preventDefault(); // prevent cursor move
        self.handleDropdownRoam('down');
        break;
      case 13:
        e.preventDefault();
        break;
    }
  }
  handleKeyUp(e) {
    const self = this;
    const stroke = e.which || e.keyCode;
    switch (stroke) {
      case 13:
        e.preventDefault();
        const $li = $(self.refs.ulItems).children('li');
        const $highlightLi = $(self.refs.ulItems).children('li.highlight');
        if($highlightLi.length) {
          let selectedOption;
          self.state.currentOptions.forEach((itm, x)=>{
            if($li[x]===$highlightLi[0])
              selectedOption = itm;
          });
          self.handleSelect(selectedOption);
        }
        break;
    }
  }
  handleDropdownRoam(roamType) {
    const self = this;
    const $autocomplete = $(`.${self.props.prefixCls}-${self.instanceId}`);
    const $ul = $autocomplete.find(`ul.${self.props.prefixCls}-dropdown-items`);
    const $li = $ul.children('li');
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
  handleSearch(text) {
    const self = this;
    text = escapeRegExp(text||'');
    if(!text || !text.trim || !(text=text.trim()) || (''+text).length<self.props.minLengthToSearch) return;
    if(self.props.onSearch) {
      self.props.onSearch.call(this, {
        target: self,
        searchText: ''+text,
      });
    }
    else {
      const currentOptions = self.props.allOptions.filter(itm => (new RegExp(text,'i')).exec(itm.text));
      self.setState({currentOptions: currentOptions});
    }
  }
  handleSelect(curOption) {
    const self = this;
    self.setState({
      isEditing: false,
    });
    self.props.onSelect.call(this, {
      target: self,
      selectedOption: curOption,
    });
  }
  render() {
    var props = this.props,
        state = this.state,
        prefixCls = props.prefixCls;
    return (<div className={`${prefixCls} ${prefixCls}-${this.instanceId} ${props.className || ''} ${(state.isEditing ? `${prefixCls}-isediting` : '')}`}>
        <div className={`${prefixCls}-console`}
             onClick={ state.isEditing ? undefined : this.handleEnableInputs.bind(this) }>
          <input type="text" ref="inputText"
                 className={`${prefixCls}-console-text`}
                 value={props.text}
                 title={props.text}
                 onKeyDown={ this.handleKeyDown.bind(this) }
                 onKeyUp={ this.handleKeyUp.bind(this) }
                 onChange={ this.handleInputChange.bind(this) } />
          <span className={`${prefixCls}-console-toggle`}>&nbsp;</span>
        </div>
        <div className={`${prefixCls}-dropdown`}
             style={{display: !state.isEditing ? 'none' : undefined}}>
          <ul ref="ulItems" className={`${prefixCls}-dropdown-items`}>
            {state.currentOptions.map((itm, x)=>
              (<li key={x} title={ itm.text }
                   onClick={ this.handleSelect.bind(this, itm) }
                   onMouseEnter={ (e)=>{ $(e.currentTarget).addClass('highlight').siblings().removeClass('highlight'); } }
                   onMouseLeave={ (e)=>{ $(e.currentTarget).removeClass('highlight'); } }>
                { itm.text }
              </li>))}
          </ul>
        </div>
    </div>);
  }
}
export default AutoComplete;
AutoComplete.defaultProps = {
  prefixCls: 'ui-form-autocomplete',
  className: '',
  text: '',
  value: null,
  allOptions: [],  // {text: '', value: {} }
  minLengthToSearch: 2,
  minSearchInterval: .5,
  onChange: () => {},
  onSelect: () => {},
  onSearch: undefined,  // Execute default search logic when value is undefined, otherwise value is a function to override this logic
  onEnableInput: undefined,  // Search props.text when value is undefined, otherwise value is a function to override this logic
  onDisableInput: undefined,  // Restore to initialText when value is undefined, otherwise value is a function to override this logic
};
