/**
 * This module exports Action Creators
 * @module Speed/Actions
 * @requires {@link module:Speed/ActionTypes}
 */
import {
  FETCH_ALL_LOCATIONS_SPEED_REQUEST,
  FETCH_ALL_LOCATIONS_SPEED_SUCCEED,
  FETCH_ALL_LOCATIONS_SPEED_FAILURE,
  ZOOM_END,
  FETCH_ALL_STATISTICS_REQUEST,
  FETCH_ALL_STATISTICS_SUCCEED,
  FETCH_ALL_STATISTICS_FAILURE,
} from './actionTypes';

/**
 * This action is to be received by saga to fetch api
 * @param  {string} options.cityCode - City code value
 * @return {Object} redux action
 */
export const fetchAllLocationsSpeedRequest = ({cityCode}) => (
  {
    type: FETCH_ALL_LOCATIONS_SPEED_REQUEST,
    payload: {
      cityCode,
    },
  }
);

export const fetchAllLocationsSpeedSucceed = (response) => (
  {
    type: FETCH_ALL_LOCATIONS_SPEED_SUCCEED,
    payload: {
      response,
    },
  }
);

export const fetchAllLocationsSpeedFailure = ({name, details, message}) => (
  {
    type: FETCH_ALL_LOCATIONS_SPEED_FAILURE,
    payload: {
      name,
      details,
      message,
    },
  }
);

export const zoomEnd = ({zoom}) => (
  {
    type: ZOOM_END,
    payload: {
      zoom,
    },
  }
);

export const fetchAllStatisticsRequest = ({cityCode}) => (
  {
    type: FETCH_ALL_STATISTICS_REQUEST,
    payload: {
      cityCode,
    },
  }
);

export const fetchAllStatisticsSucceed = (response) => (
  {
    type: FETCH_ALL_STATISTICS_SUCCEED,
    payload: {
      ...response,
    },
  }
);

export const fetchAllStatisticsFailure = ({name, details, message}) => (
  {
    type: FETCH_ALL_STATISTICS_FAILURE,
    payload: {
      name,
      details,
      message,
    },
  }
);
