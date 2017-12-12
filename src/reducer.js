/**
 * This module composes root reducer including react-router
 * @module App/Reducer
 * @requires redux
 * @requires react-router-redux
 * @requires {@link module:Speed}
 */
import {combineReducers} from 'redux';
import {routerReducer as router} from 'react-router-redux';
import {reducer as formReducer} from 'redux-form';

import speed from './Speed/reducer';

/**
 * App reducer maintain states to be shared across modules
 * @param  {Object} state - Previous leaf node of redux store
 * @param  {string} state.cityCode - City code, hangzhou => 330100
 * @param  {Object} action - Redux action
 * @return {Object}
 */
const app = (state={cityCode: '330100'}, action) => {
  return state;
};

/**
 * Return root reducer
 * Name of each leaf store should match Page Name or Functionality Name
 */
export default combineReducers({
  router,
  form: formReducer,
  app,
  speed,
});
