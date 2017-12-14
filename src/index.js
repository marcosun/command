/**
 * Insert react app into the dom and enable HMR
 * @module App
 * @requires react
 * @requires react-dom
 * @requires redux
 * @requires react-redux
 * @requires react-router-redux
 * @requires history
 * @requires redux-logger
 * @requires react-hot-loader
 * @requires {@link module:App/Router}
 * @requires {@link module:App/Store}
 */
import React from 'react';
import ReactDom from 'react-dom';
import {applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import {ConnectedRouter, routerMiddleware} from 'react-router-redux';
import {createBrowserHistory as createHistory} from 'history';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import {AppContainer} from 'react-hot-loader';

// Separate local imports from dependencies
import Root from './router';
import configureStore from './store';
import Styles from './styles.css';
import rootSaga from './saga';

/**
 * Contains HTML5 browser history instance
 */
const history = createHistory();

/**
 * Represents history middleware to be injected into redux
 */
const historyMiddleware = routerMiddleware(history);

/**
 * Represents saga middleware
 */
const sagaMiddleware = createSagaMiddleware();

// Create middlewares
// Disable logger middlewares in production mode
let middlewares = [historyMiddleware, sagaMiddleware];
if (process.env.NODE_ENV !== 'production') {
  middlewares = [...middlewares, logger];
}
/**
 * Represents the integration of redux store and react router
 * Logger must be the last middleware in chain,
 * otherwise it will log thunk and promise, not actual actions
 */
const store = configureStore(applyMiddleware(...middlewares));

let sagaTask = sagaMiddleware.run(rootSaga);

/**
 * Wrap react app into hot loader container to enable HMR.
 * Having spent days of time debugging and searching for the formula
 * intergrating react, redux, router, and HMR for development mode,
 * only to discover that one should ALWAYS put store on top level of containers.
 * {@link https://github.com/reactjs/react-redux/issues/356#issuecomment-333321556}
 * @param  {Router} Component - React router
 * created by {@link module:App/Router}
 */
const render = (Component) => {
  ReactDom.render(
    <AppContainer>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Component />
        </ConnectedRouter>
      </Provider>
    </AppContainer>,
    document.getElementById('app')
  );
};

render(Root);

/**
 * Watching for HMR
 */
if (module.hot) {
  /**
   * Any changes detected from React App would cause HMR
   */
  module.hot.accept('./router', () => {
    render(Root);
  });

  // Enable Webpack hot module replacement for saga
  module.hot.accept('./saga', () => {
    sagaTask.cancel();
    sagaTask.done.then(() => {
      sagaTask = sagaMiddleware.run(rootSaga);
    });
  });
}
