/**
 * Speed Component Module
 * @module Speed/Component
 * @requires react
 * @requires prop-types
 * @requires material-ui
 * @requires echarts-for-react
 * @requires react-amap
 */
import React from 'react';
import {object} from 'prop-types';
import {withStyles} from 'material-ui/styles';
// import ReactEcharts from 'echarts-for-react';
import {Map as ReactAMap} from 'react-amap';

const styles = (theme) => ({
  root: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
  },
  mapContainer: {
    width: '100vw',
    height: '100vh',
  },
});

/**
 * Speed Component
 * @extends {Component}
 * @param {Object} props
 */
@withStyles(styles)
class Component extends React.Component {
  /**
   * Props validation
   * Declares props validation as high as possible,
   * since they serve as documentation.
   * We’re able to do this because of JavaScript function hoisting.
   */
  static propTypes = {
    classes: object.isRequired,
  };

  /**
   * Return react tree of Speed page
   * @return {Component}
   */
  render() {
    const {
      classes,
    } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.mapContainer}>
          <ReactAMap amapkey='dfba0f951c70f029a888263a3e931d0a' />
        </div>
      </div>
    );
  }
}

export default Component;
