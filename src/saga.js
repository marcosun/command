/**
 * Saga entrance file
 * @requires redux-saga
 * @requires redux-form-saga
 * @requires {@link module:Speed/Saga}
 */
import {all} from 'redux-saga/effects';

import formActionSaga from 'redux-form-saga';
// import speed from './Speed/saga';

/**
 * [*rootSaga description]
 * @yield {[type]} [description]
 */
export default function* rootSaga() {
  yield all([
    formActionSaga(),
    // speed(),
  ]);
}
