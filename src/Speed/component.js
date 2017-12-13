/**
 * Speed Component Module
 * @module Speed/Component
 * @requires react
 * @requires prop-types
 * @requires material-ui
 * @requires react-amap
 * @requires react-amap-plugin-heatmap
 * @requires {@link module:Speed/Components/Echarts}
 * @requires {@link module:Speed/Components/SpeedBoard}
 */
import React from 'react';
import {object, func, string, number, shape, arrayOf} from 'prop-types';
import {withStyles} from 'material-ui/styles';
import {Map as ReactAMap} from 'react-amap';
import Heatmap from 'react-amap-plugin-heatmap';

import Echarts from './components/echarts';
import SpeedBoard from './components/speedBoard';

import movingPictures from './movingPictures.gif';

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
  gif: {
    position: 'absolute',
    top: '100px',
    left: '50px',
    width: '200px',
    height: '200px',
  },
  statisticsBoard: {
    position: 'absolute',
    right: '100px',
    bottom: '300px',
    color: 'white',
    textAlign: 'right',
  },
  echarts: {
    position: 'absolute',
    right: '100px',
    bottom: 0,
    width: '450px',
    height: '300px',
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
    heatmapOptions: object.isRequired,
    morningPeakSpeed: number.isRequired,
    eveningPeakSpeed: number.isRequired,
    dayAvgSpeed: number.isRequired,
    speedTrend: arrayOf(shape({
      time: number,
      speed: number,
    })),
    fetchAllLocationsSpeedRequest: func.isRequired,
    zoomEndHandler: func.isRequired,
    fetchAllStatisticsRequest: func.isRequired,
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
      center: [120.182217, 30.25316],
      zoom: 13,
      zooms: [10, 16],
      features: ['bg', 'road'],
      showIndoorMap: false,
      events: {
        created: (ins) => { // Save amap instance
          this.AMapInstance = ins;
        },
        zoomend: this.zoomEndHandler.bind(this),
      },
    };

    // Call saga to fetch heat map data api
    this.props.fetchAllLocationsSpeedRequest({
      cityCode: this.props.cityCode,
    });

    // Call saga to fetch statistics api
    this.props.fetchAllStatisticsRequest({
      cityCode: this.props.cityCode,
    });

    // Auto refresh every 30 seconds
    this.timer = window.setInterval(() => {
      // Call saga to fetch heat map data api
      this.props.fetchAllLocationsSpeedRequest({
        cityCode: this.props.cityCode,
      });

      // Call saga to fetch statistics api
      this.props.fetchAllStatisticsRequest({
        cityCode: this.props.cityCode,
      });
    }, 30000);
  }

  /**
   * Clear auto refresh process
   */
  componentWillUnmount() {
    window.clearInterval(this.timer);
  }

  /**
   * Fire redux action to update heat map radius and data-max value
   */
  zoomEndHandler() {
    const zoom = this.AMapInstance.getZoom();
    this.props.zoomEndHandler({zoom});
  }

  /**
   * Return react tree of Speed page
   * @return {Component}
   */
  render() {
    const {
      classes,
      heatmapOptions,
      morningPeakSpeed,
      eveningPeakSpeed,
      dayAvgSpeed,
      speedTrend,
    } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.mapContainer}>
          <ReactAMap
            {...this.AMapOptions}
          >
            <Heatmap {...heatmapOptions} />
          </ReactAMap>
        </div>
        <img className={classes.gif} src={movingPictures} />
        <div className={classes.statisticsBoard}>
          <SpeedBoard title='早高峰运送速度' value={morningPeakSpeed} />
          <SpeedBoard title='晚高峰运送速度' value={eveningPeakSpeed} />
          <SpeedBoard title='当前平均运送速度' value={dayAvgSpeed} color='#13d5e8' />
        </div>
        <div className={classes.echarts}>
          <Echarts speedTrend={speedTrend} />
        </div>
      </div>
    );
  }
}

export default Component;
