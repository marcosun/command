/**
 * This module exports saga
 * @module Speed/Saga
 * @requires redux-saga/effects
 * @requires axios
 * @requires {@link module:Speed/ActionTypes}
 */
import {put, takeEvery} from 'redux-saga/effects';
import axios from 'axios';

import {
  FETCH_ALL_LOCATIONS_SPEED_REQUEST,
} from './actionTypes';
import {
  fetchAllLocationsSpeedSucceed,
  fetchAllLocationsSpeedFailure,
} from './actions';

/**
 * Call auth login request
 * If authen succeeded, Fire login succeeded event
 * If authen failed, Fire login failed event
 * @param {string} options.payload: {cityCode} - City code
 */
export function* fetchAllLocationsSpeedRequest({payload: {cityCode}}) {
  try {
    const request = { // Http request options
      method: 'GET',
      url: 'http://dev.ibus.org.cn:8083/v1/opstat/getPointAvgSpeed',
      params: {
        city: cityCode,
      },
    };

    // Fire http request
    const response = yield axios(request);

    // Response success and failure check must be replace by http status code
    if (response.data.message !== 'success') { // Failure
      throw new Error('路网时速获取失败，请重新再试');
    }

    // Fire success action
    yield put(fetchAllLocationsSpeedSucceed(response.data));
  } catch (err) {
    const failureResponse = {
      name: 'REQUEST_ERROR',
      // details: [{
      //   field: 'password',
      //   issue: '密码错误',
      //   location: 'body',
      // }],
      message: '路网时速获取失败，请重新再试',
    };

    // Fire failure action
    yield put(fetchAllLocationsSpeedFailure(failureResponse));
  }
}

/**
 * Watch login request
 */
export default function* watchFetchAllLocationsSpeedRequest() {
  yield takeEvery(FETCH_ALL_LOCATIONS_SPEED_REQUEST, fetchAllLocationsSpeedRequest);
}
