/**
 * 基础组件
 */
import babelPolyfill from "babel-polyfill";
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
}
reactMixin.onClass(Widget, PureRenderMixin);
export {
    Widget
}
