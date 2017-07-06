/**
 * Modal demo
 */
import babelPolyfill from "babel-polyfill";  // enable es6 to es5 transform
import React from "react";
import ReactDOM from "react-dom";
import { Modal } from "../../index.js";
// import "./modal.css";

var pageContainer = document.getElementById("container");
// 测试页面组件
class Page extends React.Component {
  constructor() {
    super();
    this.state = {
      visible1: true,
      visible2: false,
    };
  }
  jsxModals() {
    //JSX描述第一个弹框：简单调用
    var jsxModal1 = (<Modal ref="jsxModal1"
       isLocal={true}
       visible={this.state.visible1}
       onClickSubmit={() => { this.setState({visible1: false}); }}
       onClickClose={() => { this.setState({visible1: false}); }}
       >
        这是在弹框1内显示的内容-开始
        <br/><button onClick={() => { this.setState({visible2: true}); }}>显示第2个弹框</button>
        <hr/>点击右上×按钮关闭本弹框<hr/>
        <br/>这是在弹框1内显示的内容-结束
      </Modal>);
    //JSX描述第二个弹框：参数调用
    var jsxModal2 = (<Modal ref="jsxModal2"
       prefixCls='ui-modal'
       className="class-modal-test"
       isLocal={false}
       centerFixed={false}
       width="400"
       height="1800"
       visible={this.state.visible2}
       paneType={this.props.paneType2||Modal.PaneType.Dialog}
       hasTitleBar={true}
       hasActionBar={true}
       title="第2个弹框的标题 by x"
       closeText="Close Now"
       submitText="Submit Now"
       onClickClose={() => { this.setState({visible2: false}); }}
       onClickSubmit={() => { alert('确定被点击'); }}
       onBeforeMount={(_this)=>{alert('即将生成弹框')}}
       onAfterMount={(_this)=>{alert('弹框已生成')}}
       onBeforeDestroy={(_this)=>{alert('即将销毁弹框')}}
       >
        <div><b>这是在弹框2内显示的内容-开始</b></div><hr/>
        <button onClick={() => { var toggledType = this.refs.jsxModal2.props.paneType === Modal.PaneType.Popup ? Modal.PaneType.Dialog : Modal.PaneType.Popup;
                                  ReactDOM.render(<Page paneType2={toggledType} isVisibleInitial2={true} />, pageContainer); }}>更改本弹框类型</button>
        <button onClick={() => { this.setState({visible2: false}); }}>关闭本弹框</button>
        <button onClick={() => { ReactDOM.render(<div />, pageContainer); }}>销毁页面内容</button>
        <div><b>这是在弹框2内显示的内容-结束</b></div>
      </Modal>);
    return {jsxModal1, jsxModal2};
       // classTitleBarOuter="ui-titlebar-outer-2"
       // titleContent="第2个弹框的标题"
       // classActionBarOuter="ui-actionbar-outer-2"
       // actionContent="第2个弹框的行动栏"
       // classPaneOuter="ui-pane-outer-2"
       // classPopupOuter="ui-popup-outer-2"
       // classDialogOuter="ui-dialog-outer-2"
       // hasTitleBar={true}
       // hasActionBar={true}
       // classMaskOuter="ui-mask-outer-2"
       // classModalOuter="ui-modal-outer-2"
       // isVisibleInitial={this.props.isVisibleInitial2||false}
       // paneType={this.props.paneType2||Modal.PaneType.Dialog}
       // onBeforeMount={(_this)=>{alert('即将生成弹框')}}
       // onAfterMount={(_this)=>{alert('弹框已生成')}}
       // onBeforeDestroy={(_this)=>{alert('即将销毁弹框')}}
  }
  render() {
    let styleTmpl = `
      .ui-modal .----class-modal-test {
        position: fixed;
        left: 25%;
        top: 25%;
        right: 25%;
        bottom: 25%;
        background: rgba(0, 128, 196, 1);
      }
    `;
    var myjsxModals = this.jsxModals();
    var jsxPage = (<div style={{background:'#036', width: '800px', height: '800px'}}>
      <style>
      {styleTmpl}
      </style>
      <table>
        <tbody>
          <tr>
            <td colSpan="20">弹框测试页</td>
          </tr>
          <tr>
            <td colSpan="20">
              <button onClick={() => { this.setState({visible1: true}); }}>显示第1个弹框</button>
              <button onClick={() => { ReactDOM.render(<div />, pageContainer); }}>销毁页面内容</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div>文本行 1</div>
      <div>文本行 2</div>
      {myjsxModals.jsxModal1}
      {myjsxModals.jsxModal2}
      <div>文本行 n</div>
      <div>文本行 n+1</div>
      <div>文本行 n+2</div>
      <div style={{position:'absolute', zIndex:300, width:'200px', height:'200px', background:'lightgreen'}}>z-index:300</div>
      <div style={{position:'absolute', zIndex:200, width:'400px', height:'400px', background:'pink', textAlign:'right'}}>z-index:200</div>
    </div>);
    return jsxPage;
  }
}
function run() {
  ReactDOM.render(<Page />, pageContainer);
}
run();
