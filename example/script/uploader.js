/**
* @Date:   2016-10-12T17:20:23+08:00
* @Last modified time: 2016-10-12T18:52:44+08:00
*/

import babelPolyfill from 'babel-polyfill';  // enable es6 to es5 transform
import React from 'react';
import ReactDom from 'react-dom';
import { Uploader } from "../../index.js";

class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      imgSrc: '',
      test: 1
    };
  }
  componentDidMount() {
  }
  render() {
    const state = this.state;
    return (<div>
      <Uploader width="60" height="60" autoUpload={false} onChange={(value, results) => {
        this.setState({
          imgSrc: results,
          test: 2
        });
      }}>
        <button type="button">上传</button>
      </Uploader>
      <img src={state.imgSrc} />
    </div>);
  }
}
ReactDom.render(<App />, document.getElementById('container'));
