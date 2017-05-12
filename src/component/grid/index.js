/**
* @Date:   2016-07-11T14:20:03+08:00
* @Last modified time: 2016-12-29T15:51:28+08:00
*/
/**
 * Grid组件实现
 */
import React from 'react';
import {Grid as GridSimple} from "./index.js";
import {Grid as GridAnt} from "antd";
var GridMoudle;
class Grid extends React.Component{
  constructor(props) {
    super(props)
    if(props.test === "simple") {
        GridMoudle = GridSimple;
    }else {
        GridMoudle = GridAnt;
    }
  }
  render() {
    return <GridMoudle {...this.props} />
  }
}
export default Grid;
