import React, { Component, createRef } from "react";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import * as yaml from "yamljs";
import './style.css'
import prettyJson from './prettyJson'
import createstr from './createstr'


class Home extends Component {

  constructor() {
    super();
    this.state = {
      fileData: {},
      path: {},
      loading: true
    }
    this.jsonOutput = createRef()
  }

  componentDidMount() {
    yaml.load('/yaml/demo2.yaml', (result) => {
      console.log('result', result)
      this.setState({ fileData: result, loading: false })
    })
  }

  showDef(def) {
    this.setState({
      definationName: def
    })
  }

  showCode(codeType, path, pathName) {
    this.setState({
      codeType, path, pathName
    })
  }

  render() {
    const state = this.state
    const yaml = state.fileData
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-4">
            <br />
            <div class="alert alert-info">{yaml.info?.title}</div>
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Operations</h5>
                <ul class="list-group">
                  {yaml.paths ? Object.keys(yaml['paths']).map(path => {
                    const paths = yaml['paths']
                    return <li class="list-group-item">{paths[path].post ? 'POST' : ''} {paths[path].get ? 'GET' : ''}  {path}</li>
                  }) : ''}
                </ul>
              </div>
            </div>
            <br />
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Definations</h5>
                <ul class="list-group">
                  {yaml.definitions ? Object.keys(yaml['definitions']).map(def => {
                    return <li class="list-group-item">{def}</li>
                  }) : ''}
                </ul>
              </div>
            </div>


          </div>
          <div className="col-md-8">
            {
              state.loading ? <i className="fa fa-5x fa-spinner fa-spin text-primary loader"></i> : <React.Fragment>
                <div className="col-md-12">
                  <h1 className="main-heading text-primary">{yaml.info?.title}</h1>
                  <p>Version : {yaml.info?.version}</p>
                </div>
                <div className="col-md-12">
                  <p>Server Schema : {yaml.schemes.map(item => item)}</p>
                  {yaml['x-ibm-endpoints'].map(endpoint => {
                    return (
                      <div>
                        <button type="button" class="btn btn-primary">
                          {endpoint.endpointUrl}
                          {endpoint.type.map(type => <span class="badge badge-warning">{type}</span>)}
                        </button>
                      </div>
                    )
                  })
                  }
                  <br />
                  <br />
                  <h3>Paths</h3>

                  {Object.keys(yaml['paths']).map(path => {
                    const paths = yaml['paths']
                    const method = paths[path].post || paths[path].get
                    return (<div className="jumbotron">
                      <h3>{path}</h3>
                      <p>Method : {paths[path].post ? 'POST' : ''} {paths[path].get ? 'GET' : ''}</p>
                      <hr />
                      <button className="btn btn-primary" onClick={this.showCode.bind(this, 'curl', paths[path], path)} data-toggle="modal" data-target="#codeModal">Curl</button>
                      <button className="btn btn-primary" onClick={this.showCode.bind(this, 'nodejs', paths[path], path)} data-toggle="modal" data-target="#codeModal">NodeJs</button>
                      <br /> <br />
                      <h4>Security </h4>
                      <table class="table">
                        <thead class="thead-dark">
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Key</th>
                            <th scope="col">Name</th>
                            <th scope="col">Type</th>
                            <th scope="col">Location</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            Object.keys(yaml.security[0]).map((skey, i) => {
                              return (<tr>
                                <th scope="row">{i + 1}</th>
                                <td>{skey}</td>
                                <td>{yaml['securityDefinitions'][skey]['name']}</td>
                                <td>{yaml['securityDefinitions'][skey]['type']}</td>
                                <td>{yaml['securityDefinitions'][skey]['in']}</td>
                              </tr>)
                            })
                          }
                        </tbody>
                      </table>
                          <br />
                          <h4>Parameters </h4>
                          <table class="table">
                            <thead class="thead-dark">
                              <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Required</th>
                                <th scope="col">Location</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <th scope="row">{1}</th>
                                <td>accept (Accept:application/xml)</td>
                                <td>{'Optional'}</td>
                                <td>{'Headers'}</td>
                              </tr>
                              <tr>
                                <th scope="row">{2}</th>
                                <td>content-type (content-type:application/xml)</td>
                                <td>{'Optional'}</td>
                                <td>{'Headers'}</td>
                              </tr>
                              {
                                paths[path].parameters?.map((param, i) => {
                                  return (<tr>
                                    <th scope="row">{i + 3}</th>
                                    <td>{param['name']}</td>
                                    <td>{param['required'] ? 'Required' : 'Optional'}</td>
                                    <td>{param['in']}</td>
                                  </tr>)
                                })
                              }
                            </tbody>
                          </table>
                     
                      <br />
                      <h4>Responses</h4>
                      {Object.keys(method.responses).map(res => {
                        return (
                          <p>{res + " : " + method.responses[res].description}</p>
                        )
                      })}
                    </div>)
                  })
                  }

                  <br />
                  <br />
                  <h3>Definations</h3>

                  {
                    Object.keys(yaml.definitions).map(def => {
                      return (
                        <button type="button" onClick={this.showDef.bind(this, def)} class="btn btn-dark defButton" data-toggle="modal" data-target="#definationModal">
                          {def}
                        </button>
                      )
                    })
                  }
                  <br />
                  <br />


                </div>
              </React.Fragment>
            }
          </div>

        </div>
        <div class="modal fade" id="definationModal" tabindex="-1" aria-labelledby="definationModalLabel" aria-hidden="true">
          <div class="modal-dialog  modal-xl">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="definationModalLabel">Defination : {state.definationName} </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <pre dangerouslySetInnerHTML={{ __html: state.definationName ? prettyJson(JSON.stringify(yaml.definitions[state.definationName], null, 4)) : '' }}>
                </pre>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>


        <div class="modal fade" id="codeModal" tabindex="-1" aria-labelledby="codeModalLabel" aria-hidden="true">
          <div class="modal-dialog  modal-xl">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="codeModalLabel">{state.codeType} Request </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                {state.codeType == 'curl' && <div>


                  {`curl -X ${state.path.post ? 'POST' : ''} ${state.path.get ? 'GET' : ''} `} <br />
                  {`"${JSON.stringify(yaml['x-ibm-endpoints'][0].endpointUrl).replace(/"/g, '')}${state.pathName}" `} <br />
                  
                  {
                    Object.keys(yaml.security[0]).filter(skey => yaml['securityDefinitions'][skey]['in'] == 'header').map((skey, i) => {
                      return (
                        `-H '${skey}: ${createstr(10)}' \n` 
                      )
                    })
                  }
                  {`-H 'Content-Type: application/xml' `} <br />
                  {`-H 'Accept: application/xml' `} <br />

                  {`-d '{`} <br />
                  
                  {
                    state.path.parameters && state.path.parameters?.map((param, i) => {
                      return (<>
                         '{param.name}': '{createstr(10)}', <br/>
                      </>)
                    })
                  }
                  {`}'`} <br />






                </div>}

                {state.codeType == 'nodejs' && <div>
                  {`var request = require("request");`} <br />
                  {`var options = {`}<br />
                  &nbsp;&nbsp;{`method: ${state.path.post ? 'POST' : ''} ${state.path.get ? 'GET' : ''}', `} <br />
                  &nbsp;&nbsp;{`url: "${JSON.stringify(yaml['x-ibm-endpoints'][0].endpointUrl).replace(/"/g, '')}${state.pathName}",`} <br />


                  &nbsp;&nbsp;{`headers: `} <br />
                  &nbsp;&nbsp;{`{`} <br />
                  {
                    Object.keys(yaml.security[0]).filter(skey => yaml['securityDefinitions'][skey]['in'] == 'header').map((skey, i) => {
                      return (<>
                        &nbsp;&nbsp;{` '${skey}': '${createstr(10)}',`} <br />
                      </>)
                    })
                  }


                  &nbsp;&nbsp;{` 'Accept': 'application/xml',`} <br />
                  &nbsp;&nbsp;{` 'Content-Type': 'application/xml' `} <br />
                  &nbsp;&nbsp;{`} `} <br />



                  &nbsp;&nbsp;{`body: { `} <br />
                  {
                    state.path.parameters && state.path.parameters?.map((param, i) => {
                      return (<>
                        &nbsp;&nbsp;{` '${param.name}': '${createstr(10)}',`} <br />
                      </>)
                    })
                  }


                  &nbsp;&nbsp;{`};`} <br />
                  <br />
                  {`request(options, function (error, response, body) {`} <br />
                  &nbsp;&nbsp;&nbsp;{`if (error) throw new Error(error);`} <br />
                  &nbsp;&nbsp;&nbsp;{`console.log(body);`} <br />
                  {`});`} <br />

                </div>}


              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>


      </div>

    );
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
  }
}

const mapDispatchToProps = {}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)
