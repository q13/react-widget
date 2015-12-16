/**
 * Grid demo
 */
import React from "react";
import ReactDom from "react-dom";
import Grid from "../../src/component/grid/index.js";

class App extends React.Component{
    constructor(props){
        super(props);


        this.state = {
            currentPage: 1,
            sortDataIndex: ''
        }
    }
    render(){
        var columns = [
          {
            text: <div onClick= {this.sortHandle.bind(this)}>表头↑↓</div>, dataIndex: 'a', colSpan: 2, width: 200
          },
          {id: '123', text: '表头2', dataIndex: 'b', colSpan: 0, width: 500, sort: 'asc', renderer: function(o, row, index){
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
        var data = {
            pageSize: 10,
            currentPage: 1,
            total: 58,
            rows: [{a: '123'}, {a: 'cdd', b: 'edd'}, {a: '1333', c: 'eee', d: 2}]
        }
        data.rows[0].a = Math.random();
        return(
          <div>
              <Grid columns={ columns } data={ data } onPageChange={ this.onPageChange.bind(this) } useFixedHeader={true}/>
          </div>
        )
    }
    onPageChange(obj){
        console.log(obj)
        this.setState({
            currentPage: obj.currentPage
        })
    }
    sortHandle(sort){
        console.log(sort)
    }
}
ReactDom.render(<App />, document.getElementById("container"));
