/**
* @Date:   2016-06-17T14:29:19+08:00
* @Last modified time: 2016-09-22T15:55:57+08:00
*/

/**
 * Validator demo
 */
import babelPolyfill from 'babel-polyfill';  // enable es6 to es5 transform
import React from 'react';
import ReactDom from 'react-dom';
import { Validator } from "../../index.js";

class App extends React.Component{
  constructor(props) {
    super(props);
    var this_ = this;
    this.state = {
      addNewFields: false,
      formFields: Validator.getOrderFields([{
          name: 'test',
          value: '111',
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
        {
          name: 'test2',
          value: '111',
          bindField: 'test',
          rule: function (v, test) {
            if (v !== test) {
              return '必须是test field';
            }
          },
          onValidate: (result) => {
            console.log('2', result);
          }
      }, {
          name: 'test3',
          value: '223',
          bindField: 'test',
          rule: function (v, test) {
            if (v !== '222') {
              return '必须是222';
            }
          },
          onValidate: (result) => {
            console.log('3', result);
          }
      }])
    };
  }
  componentDidMount() {
    this.setState({
      formFields: Validator.getNewFields({
        index: 0,
        name: 'test3',
        value: '223'
      }, this.state.formFields)
    }, () => {
      var result = this.refs.v.di('validate', 'all');
      setTimeout(() => {
        console.log('Add new fields.');
        this.setState({
          formFields: Validator.getNewFields([{
            name: 'test4',
            value: '224',
            groupName: 'g',
            rule: function (v) {
              if (v !== '224') {
                return '必须是224';
              }
            }
          }, {
            name: 'test5',
            value: '225',
            groupName: 'g',
            rule: function (v) {
              if (v !== '225') {
                return '必须是225';
              }
            }
          }], this.state.formFields),
          addNewFields: true
        }, () => {
          var result = this.refs.v.di('validate', 'all');
          result = this.refs.v.di('getValidValue');
          console.log(result);
        });
      }, 3000);
    });
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
  handleTest3Change(evt) {
    this.setState({
      formFields: Validator.getNewFields(evt.target.value, 'test3', this.state.formFields)
    });
  }
  handleTest4Change(evt) {
    this.setState({
      formFields: Validator.getNewFields(evt.target.value, 'test4', this.state.formFields)
    });
  }
  handleTest5Change(evt) {
    this.setState({
      formFields: Validator.getNewFields(evt.target.value, 'test5', this.state.formFields)
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
    const state = this.state;
    var formFields = this.state.formFields;
    return (
      <Validator ref="v" fields={formFields} onValidate={this.handleValidate.bind(this)} onFieldsChange={this.handleFieldsChange.bind(this)}>
      <div>
        <div>
          <input type="text" value={formFields.test.value} onChange={this.handleTestChange.bind(this)} />
          <span className="error">{formFields.test.isValid === false ? formFields.test.message : ''}</span>
        </div>
        <div>
          <input type="text" value={formFields.test2.value} onChange={this.handleTest2Change.bind(this)} />
          <span className="error">{formFields.test2.isValid === false ? formFields.test2.message : ''}</span>
        </div>
        <div>
          <input type="text" value={formFields.test3.value} onChange={this.handleTest3Change.bind(this)} />
          <span className="error">{formFields.test3.isValid === false ? formFields.test3.message : ''}</span>
        </div>
        {state.addNewFields ?
        <div>
        <div>
          <input type="text" value={formFields.test4.value} onChange={this.handleTest4Change.bind(this)} />
          <span className="error">{formFields.test4.isValid === false ? formFields.test4.message : ''}</span>
        </div>
        <div>
          <input type="text" value={formFields.test5.value} onChange={this.handleTest5Change.bind(this)} />
          <span className="error">{formFields.test5.isValid === false ? formFields.test5.message : ''}</span>
        </div>
      </div> : null}
      </div>
  </Validator>
    );
  }
}
ReactDom.render(<App />, document.getElementById('container'));
