/**
 * Speed Container Module
 * @module Speed/Container
 * @requires react-redux
 * @requires {@link module:Speed/Component}
 * @requires {@link module:Speed/Actions}
 */
import {connect} from 'react-redux';

import Component from './component';
import {fetchAllLocationsSpeedRequest} from './actions';

const mapStateToProps = (state, ownProps) => {
  return {
    cityCode: state.app.cityCode,
    heatmapDataSet: state.speed.heatmapDataSet,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchAllLocationsSpeedRequest: (payload) => {
      dispatch(fetchAllLocationsSpeedRequest(payload));
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
