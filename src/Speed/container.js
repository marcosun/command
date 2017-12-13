/**
 * Speed Container Module
 * @module Speed/Container
 * @requires react-redux
 * @requires {@link module:Speed/Component}
 * @requires {@link module:Speed/Actions}
 */
import {connect} from 'react-redux';

import Component from './component';
import {
  fetchAllLocationsSpeedRequest,
  fetchAllStatisticsRequest,
  zoomEnd,
} from './actions';

const mapStateToProps = (state, ownProps) => {
  return {
    cityCode: state.app.cityCode,
    heatmapOptions: state.speed.heatmap,
    morningPeakSpeed: state.speed.statistics.morningPeakSpeed,
    eveningPeakSpeed: state.speed.statistics.eveningPeakSpeed,
    dayAvgSpeed: state.speed.statistics.dayAvgSpeed,
    speedTrend: state.speed.statistics.speedTrend,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchAllLocationsSpeedRequest: (payload) => {
      dispatch(fetchAllLocationsSpeedRequest(payload));
    },
    zoomEndHandler: (payload) => {
      dispatch(zoomEnd(payload));
    },
    fetchAllStatisticsRequest: (payload) => {
      dispatch(fetchAllStatisticsRequest(payload));
    },
  };
};

/**
 * Connected react component
 */
@connect(mapStateToProps, mapDispatchToProps)
class Container extends Component {

}

/**
 * Return redux connected Speed page
 */
export default Container;
