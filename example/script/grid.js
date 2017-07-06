/**
* @Date:   2016-06-17T14:29:19+08:00
* @Last modified time: 2016-12-28T18:36:11+08:00
*/
/**
 * Grid demo
 */
import babelPolyfill from "babel-polyfill"; // enable es6 to es5 transform
import React from "react";
import ReactDom from "react-dom";
// import Grid from "../../src/component/grid/index.js";
import { Grid } from "../../index.js";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      sortDataIndex: ''
    }
  }
  render() {
    var columns = [
      {
        text: <div onClick={this.handleSort.bind(this)}>表头↑↓</div>,
        dataIndex: 'a',
        colSpan: 2,
        width: 200
      }, {
        id: '123',
        text: '表头2',
        dataIndex: 'b',
        colSpan: 0,
        width: 500,
        sort: 'asc',
        renderer: function(o, row, index) {
          let obj = {
            content: o,
            props: {}
          }
          if (index === 0) {
            obj.props.rowSpan = 2;
          }
          if (index === 1) {
            obj.props.rowSpan = 0;
          }
          return obj;
        }
      }, {
        text: '表头3',
        dataIndex: 'c',
        width: 200
      }, {
        text: '操作',
        dataIndex: 'd',
        width: 300,
        renderer: function() {
          return <a href="#">操作</a>
        }
      }
    ];
    var data = this.state.gridData;
    return (
      <div>
        <Grid header={
          <thead>
            <tr><th>11</th><th>22</th><th>33</th><th>44</th></tr>
            <tr><th colSpan="2">1 + 2</th><th rowSpan="2" data-index="c">表头3</th><th rowSpan="2" data-index="d">表头4</th></tr>
            <tr><th data-index="a" onClick={this.handleSort.bind(this)}>表头1 ↑↓</th><th data-index="b">表头2</th></tr>
          </thead>
        } useFixedHeader={true} columns={columns} data={data} onPageChange={this.onPageChange.bind(this)}/>
        <button onClick={this.handleSearch.bind(this)}>search</button>
      </div>
    )
  }
  onPageChange(obj) {
    console.log(obj)
    this.setState({
      gridData: {
        pageSize: 10,
        currentPage: obj.currentPage,
        total: 63,
        rows: [
          {
            a: Math.random(),
            b: 'test',
            c: 'c1',
            d: 'd1'
          }, {
            a: 'cdd',
            c: 'edd',
            d: 'd2'
          }, {
            a: '1333',
            b: 'b3',
            c: 'eee',
            d: 2
          }
        ]
      }
    });
  }
  handleSort() {
    console.log('Sort')
    this.setState({
      gridData: {
        pageSize: 10,
        currentPage: 1,
        total: 63,
        rows: [
          {
            a: Math.random(),
            b: 'test',
            c: 'c1',
            d: 'd1'
          }, {
            a: '1333',
            b: 'b3',
            c: 'eee',
            d: 2
          }, {
            a: 'cdd',
            c: 'edd',
            d: 'd2'
          }
        ]
      }
    })
  }
  handleSearch(sort) {
    this.setState({
      gridData: {
        pageSize: 10,
        currentPage: 1,
        total: 63,
        rows: [
          {
            a: Math.random(),
            b: 'test',
            c: 'c1',
            d: 'd1'
          }, {
            a: 'cdd',
            c: 'edd',
            d: 'd2'
          }, {
            a: '1333',
            b: 'b3',
            c: 'eee',
            d: 2
          }
        ]
      }
    })
  }
}
ReactDom.render(
  <App/>, document.getElementById("container"));
