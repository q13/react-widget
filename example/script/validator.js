/**
 * Validator demo
 */
import babelPolyfill from 'babel-polyfill';  // enable es6 to es5 transform
import React from 'react';
import ReactDom from 'react-dom';
import Validator from '../../src/component/validator/index.js';

class App extends React.Component{
  constructor(props) {
    super(props);
    var this_ = this;
    this.state = {
      formFields: {
        test: {
          value: 111,
          allowBlank: true,
          rule: [function (v) {
            return v < 111;
          }, function (v) {
            if (v > 55) {
              return '小于55提示信息覆盖';
            }
          }],
          onValidate: (result) => {
            console.log('1', result);
          },
          message: ['首先要小于111', '然后要小于55']
        },
        test2: {
          value: 111,
          bindField: 'test',
          rule: function (v, test) {
            if (v !== test) {
              return '必须是test field';
            }
          },
          onValidate: (result) => {
            console.log('2', result);
          }
        },
      }
    };
  }
  handleTestChange(evt) {
    this.setState({
      formFields: Validator.getNewFields(evt.target.value, 'test', this.state.formFields)
    });
  }
  handleTest2Change(evt) {
    this.setState({
      formFields: Validator.getNewFields(evt.target.value, 'test2', this.state.formFields)
    });
  }
  handleValidate(result) {
    console.log('validateResult1111', result);
  }
  handleFieldsChange(fields) {
    this.setState({
      formFields: fields
    });
  }
  render() {
    var formFields = this.state.formFields;
    return (
      <Validator fields={formFields} onValidate={this.handleValidate.bind(this)} onFieldsChange={this.handleFieldsChange.bind(this)}>
      <div>
        <div>
          <input type="text" value={formFields.test.value} onChange={this.handleTestChange.bind(this)} />
          <span className="error">{formFields.test.isValid === false ? formFields.test.message : ''}</span>
        </div>
        <div>
          <input type="text" value={formFields.test2.value} onChange={this.handleTest2Change.bind(this)} />
          <span className="error">{formFields.test2.isValid === false ? formFields.test2.message : ''}</span>
        </div>
      </div>
  </Validator>
    );
  }
}
ReactDom.render(<App />, document.getElementById('container'));
