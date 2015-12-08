/**
 * Grid demo
 */
import React from "react";
import ReactDom from "react-dom";
import Grid from "../../src/component/grid/index.js";
var columns = [
  {text: '表头1', dataIndex: 'a', colSpan: 2, width: 100},
  {id: '123', text: '表头2', dataIndex: 'b', colSpan: 0, width: 500, renderer: function(o, row, index){
      let obj ={
        content:o,
        props:{}
      }
      if(index === 0){
        obj.props.rowSpan = 2;
      }
      if(index === 1){
        obj.props.rowSpan = 0;
      }
      return obj;
    }},
  {text: '表头3', dataIndex: 'c',width: 200},
  {
    text: '操作', dataIndex: '',renderer: function () {
    return <a href="#">操作</a>
  }
  }
];

var data = [{a: '123'}, {a: 'cdd', b: 'edd'}, {a: '1333', c: 'eee', d: 2}];
ReactDom.render(<Grid columns={
    columns
} data={data} useFixedHeader={true}/>, document.getElementById("container"));
