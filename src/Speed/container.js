/**
 * Speed Container Module
 * @module Speed/Container
 * @requires react-redux
 * @requires {@link module:Speed/Component}
 */
import {connect} from 'react-redux';

import Component from './component';

const mapStateToProps = (state, ownProps) => {
  return {

  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {

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
