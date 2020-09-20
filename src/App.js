import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Header from './layout/header';
import Home from './components/home/index';

import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './redux/rootReducer';
import rootSaga from './redux/rootSaga';
import createSagaMiddleware from 'redux-saga'
const sagaMiddleware = createSagaMiddleware()

const store = createStore(rootReducer,  applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSaga);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
            <Router basename={process.env.PUBLIC_URL}>
              <Header/>
              <Switch>
                    <Route exact path= "/" component={Home} />
                    <Route exact path= "**" component={Home} />
              </Switch>
        </Router>
    </Provider>
    );
  }
}

export default App;