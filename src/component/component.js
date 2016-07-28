/**
* @Date:   2016-06-17T16:39:08+08:00
* @Last modified time: 2016-06-29T15:15:34+08:00
*/

/**
 * 基础组件
 */
import React, {
  Component
} from 'react';
import PureRenderMixin from "react-addons-pure-render-mixin";
import reactMixin from "react-mixin";

/**
 * Base class
 */
class Widget extends Component {
  constructor(props) {
    super(props);
  }
  di(callback, property) {
    var args = Array.prototype.slice.call(arguments, 2) || [];
    if (typeof callback === 'string') {
      property = callback;
      callback = function (v) {
        return v;
      };
      if (typeof arguments[1] !== 'undefined') {
        args.unshift(arguments[1]);
      }
    }
    if (this[property]) { //不存在的化默默失效
      if (typeof this[property] === 'function') {
        return callback(this[property].apply(this, args));
      } else {
        return callback(this[property]);
      }
    }
  }
  onPropertyChange(propertyName, value) { //Concurrency way
    setTimeout(() => {
      let callbackName = 'on' + propertyName.slice(0, 1).toUpperCase() + propertyName.slice(1) + 'Change';
      this.props[callbackName] && this.props[callbackName](value);
    }, 0);
  }
  nextTick(callback) {
    setTimeout(() => {
      callback && callback();
    }, 0);
  }
}
reactMixin.onClass(Widget, PureRenderMixin);

export {
  Widget
}
