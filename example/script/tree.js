/**
 * Tree demo
 */
import babelPolyfill from 'babel-polyfill';  // enable es6 to es5 transform
import React from 'react';
import ReactDom from 'react-dom';
import { Tree } from "../../index.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [{
        text: 'Root',
        value: 0,
        children: [{
          text: 'Node1-1',
          value: '1-1',
          className: 'node-1-1'
        }, {
          text: 'Node1-2',
          value: '1-2',
          className: 'node-1-2',
          children: [{
            text: 'Node2-1',
            value: '2-1',
            className: 'node-2-1'
          }]
        }]
      }]
    };
  }
  componentDidMount() {
  }
  render() {
    const state = this.state;
    return (
      <div>
        <style>
          {`
            .node-1-1 {
              background: red;
            }
            .node-1-2 {
              background: blue;
            }
            .node-2-1 {
              background: green;
            }
          `}
        </style>
        <Tree options={state.data} onOptionsChange={(data) => {
          this.setState({
            data: data
          });
        } } />
      </div>
    );
  }
}
ReactDom.render(<App />, document.getElementById('container'));

