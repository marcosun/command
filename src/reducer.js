/**
 * This module composes root reducer including react-router
 * @module App/Reducer
 * @requires redux
 * @requires react-router-redux
 * @requires {@link module:Dashboard}
 * @requires {@link module:Login}
 */
import {combineReducers} from 'redux';
import {routerReducer as router} from 'react-router-redux';

import count from './Dashboard';
import login from './Login';

/**
 * Return root reducer
 */
export default combineReducers({
  count,
  login,
  router,
});