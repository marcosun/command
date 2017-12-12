/**
 * Speed Component Module
 * @module Speed/Component
 * @requires react
 * @requires prop-types
 * @requires material-ui
 * @requires echarts-for-react
 * @requires react-amap
 * @requires react-amap-plugin-heatmap
 */
import React from 'react';
import {object, func, string, number, shape, arrayOf} from 'prop-types';
import {withStyles} from 'material-ui/styles';
import ReactEcharts from 'echarts-for-react';
import {Map as ReactAMap} from 'react-amap';
import Heatmap from 'react-amap-plugin-heatmap';

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
    cityCode: string.isRequired,
    heatmapDataSet: arrayOf(shape({
      lng: number,
      lat: number,
      avgSpeed: number,
    })),
    fetchAllLocationsSpeedRequest: func.isRequired,
  };

  /**
   * Constructor
   * @param  {Object} props
   */
  constructor(props) {
    super(props);
    this.props = props;

    this.AMapOptions = { // AMap init options
      amapkey: 'dfba0f951c70f029a888263a3e931d0a',
      mapStyle: 'amap://styles/47cf2cc474c7ad6c92072f0b267adff0?isPublic=true',
      features: ['bg', 'road'],
      showIndoorMap: false,
      events: {
        created: (ins) => { // Save amap instance
          this.AMapInstance = ins;
        },
        zoomend: this.zoomEndHandler.bind(this),
      },
    };

    // Call saga to fetch api
    this.props.fetchAllLocationsSpeedRequest({
      cityCode: this.props.cityCode,
    });
  }

  zoomEndHandler() {
    this.amapRadius = this.AMapInstance.getZoom();
  }

  /**
   * Return react tree of Speed page
   * @return {Component}
   */
  render() {
    const {
      classes,
    } = this.props;

    this.heatmapOptions = {
      radius: this.amapRadius,
      dataSet: {
        data: this.props.heatmapDataSet,
        max: 100,
      },
    };

    return (
      <div className={classes.root}>
        <div className={classes.mapContainer}>
          <ReactAMap
            {...this.AMapOptions}
          >
            <Heatmap {...this.heatmapOptions} />
          </ReactAMap>
        </div>
      </div>
    );
  }
}

export default Component;
