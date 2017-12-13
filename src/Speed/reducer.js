/**
 * This module receives redux actions and responses with action handlers
 * @module Speed/Reducer
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
 * Initial state value of react store
 */
const initialState = {
  heatmap: {
    radius: 10,
    dataSet: {
      data: [],
      max: 15,
    },
    gradient: {
      0.25: 'rgb(0,0,255)',
      0.45: 'rgb(1,255,255)',
      0.65: 'rgb(0,255,0)',
      0.9: 'yellow',
      1: 'rgb(255,0,0)',
    },
    opacity: [0, 0.8],
    zooms: [9, 16],
    isLoading: false,
  },
  statistics: {
    morningPeakSpeed: 0,
    eveningPeakSpeed: 0,
    dayAvgSpeed: 0,
    speedTrend: [],
    isLoading: false,
  },
};

/**
 * This is a one by one mapping of zoom level and heat map radius field
 * @type {Object}
 */
const zoomToRadiusDataMaxValueMapping = {
  10: {
    radius: 1,
  },
  11: {
    radius: 2,
  },
  12: {
    radius: 4,
  },
  13: {
    radius: 10,
  },
  14: {
    radius: 20,
  },
  15: {
    radius: 40,
  },
  16: {
    radius: 80,
  },
};

const heatmapReducer = (state, action) => {
  switch (action.type) {
    case FETCH_ALL_LOCATIONS_SPEED_REQUEST:
      // Switch on loading indicator
      return {
        ...state,
        isLoading: true,
      };
    case FETCH_ALL_LOCATIONS_SPEED_SUCCEED:
      // Compose data for heatmap
      const dataSet = action.payload.response.items.map((location) => {
        return {
          lng: location.lng,
          lat: location.lat,
          count: +location.avgSpeed.toFixed(2),
        };
      });

      return {
        ...state,
        dataSet: {
          data: dataSet,
          max: state.dataSet.max,
        },
        isLoading: false,
      };
    case FETCH_ALL_LOCATIONS_SPEED_FAILURE:
      // Switch off loading indicator
      return {
        ...state,
        isLoading: false,
      };
    case ZOOM_END:
      // Lookup radius value corresponds to current zoom level
      return {
        ...state,
        radius: zoomToRadiusDataMaxValueMapping[action.payload.zoom].radius,
      };
    default:
      return state;
  }
};

const statisticsReducer = (state, action) => {
  switch (action.type) {
    case FETCH_ALL_STATISTICS_REQUEST:
      // Switch on loading indicator
      return {
        ...state,
        isLoading: true,
      };
    case FETCH_ALL_STATISTICS_SUCCEED:
      // Compose data for statistics
      const speedTrend = action.payload.speedTrend.map((trend) => {
        return {
          time: +(`${trend.opTime}000`), // Convert to standard timestamp format
          speed: +trend.avgSpeed.toFixed(2),
        };
      });

      return {
        ...state,
        morningPeakSpeed: +action.payload.morningPeakSpeed.toFixed(2),
        eveningPeakSpeed: +action.payload.eveningPeakSpeed.toFixed(2),
        dayAvgSpeed: +action.payload.dayAvgSpeed.toFixed(2),
        speedTrend,
        isLoading: false,
      };
    case FETCH_ALL_STATISTICS_FAILURE:
      // Switch off loading indicator
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};

/**
 * Reducer function manipulates home leaf node of redux store
 * @param {Object} state - Previous leaf node of redux store
 * @param {Object} action - Redux action
 * @param {string} action.type - Redux action name
 * @return {Object}
 */
export default function Reducer(state=initialState, action) {
  switch (action.type) {
    case FETCH_ALL_LOCATIONS_SPEED_REQUEST:
    case FETCH_ALL_LOCATIONS_SPEED_SUCCEED:
    case FETCH_ALL_LOCATIONS_SPEED_FAILURE:
    case ZOOM_END:
      return {
        ...state,
        heatmap: heatmapReducer(state.heatmap, action),
      };
    case FETCH_ALL_STATISTICS_REQUEST:
    case FETCH_ALL_STATISTICS_SUCCEED:
    case FETCH_ALL_STATISTICS_FAILURE:
      return {
        ...state,
        statistics: statisticsReducer(state.statistics, action),
      };
    default:
      return state;
  }
}
