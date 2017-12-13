/**
 * This module exports saga
 * @module Speed/Saga
 * @requires redux-saga/effects
 * @requires axios
 * @requires {@link module:Speed/ActionTypes}
 */
import {put, takeEvery, all} from 'redux-saga/effects';
import axios from 'axios';

import {
  FETCH_ALL_LOCATIONS_SPEED_REQUEST,
  FETCH_ALL_STATISTICS_REQUEST,
} from './actionTypes';
import {
  fetchAllLocationsSpeedSucceed,
  fetchAllLocationsSpeedFailure,
  fetchAllStatisticsSucceed,
  fetchAllStatisticsFailure,
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

export function* fetchAllStatisticsRequest({payload: {cityCode}}) {
  try {
    const fetchFrom = (address) => {
      return { // Http request options
        method: 'GET',
        url: `http://dev.ibus.org.cn:8083/v1/opstat/${address}`,
        params: {
          city: cityCode,
        },
      };
    };

    // Fire http request
    const response = yield all([
      axios(fetchFrom('getMorningAvgSpeed')),
      axios(fetchFrom('getEveningAvgSpeed')),
      axios(fetchFrom('getNowAvgSpeed')),
      axios(fetchFrom('getTodayAvgSpeeds')),
    ]);

    // Response success and failure check must be replace by http status code
    if (response.find((response) => {
      return response.data.message !== 'success';
    }) !== void 0) { // Failure
      throw new Error('时速统计获取失败，请重新再试');
    }

    const [
      {data: {item: morningPeakSpeed}},
      {data: {item: eveningPeakSpeed}},
      {data: {item: dayAvgSpeed}},
      {data: {items: speedTrend}},
    ] = response;

    // Fire success action
    yield put(fetchAllStatisticsSucceed({
      morningPeakSpeed,
      eveningPeakSpeed,
      dayAvgSpeed,
      speedTrend,
    }));
  } catch (err) {
    const failureResponse = {
      name: 'REQUEST_ERROR',
      // details: [{
      //   field: 'password',
      //   issue: '密码错误',
      //   location: 'body',
      // }],
      message: '时速统计获取失败，请重新再试',
    };

    // Fire failure action
    yield put(fetchAllStatisticsFailure(failureResponse));
  }
}

/**
 * Watch api request
 */
export default function* watchFetchAllLocationsSpeedRequest() {
  yield takeEvery(FETCH_ALL_LOCATIONS_SPEED_REQUEST, fetchAllLocationsSpeedRequest);
  yield takeEvery(FETCH_ALL_STATISTICS_REQUEST, fetchAllStatisticsRequest);
}
