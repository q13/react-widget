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
    if (this[property]) {   //不存在的化默默失效
      if (typeof this[property] === 'function') {
        callback(this[property].apply(this, args));
      } else {
        callback(this[property]);
      }
    }
  }
}
reactMixin.onClass(Widget, PureRenderMixin);
export {
  Widget
}
