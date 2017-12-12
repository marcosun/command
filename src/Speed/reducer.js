/**
 * This module receives redux actions and responses with action handlers
 * @module Speed/Reducer
 * @requires {@link module:Speed/ActionTypes}
 */
import {FETCH_ALL_LOCATIONS_SPEED_SUCCEED} from './actionTypes';

/**
 * Initial state value of react store
 */
const initialState = {
  heatmapDataSet: [],
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
    case FETCH_ALL_LOCATIONS_SPEED_SUCCEED:
      const heatmapDataSet = action.payload.response.items.map((location) => {
        return {
          lng: location.lng,
          lat: location.lat,
          count: parseFloat(location.avgSpeed.toFixed(2)),
        };
      });

      return {
        ...state,
        heatmapDataSet,
      };
    default:
      return state;
  }
}
