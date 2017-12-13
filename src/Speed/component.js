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
  statisticsBoard: {
    position: 'absolute',
    top: '200px',
    right: '100px',
    color: 'white',
    textAlign: 'right',
  },
  peakSpeedTitle: {
    marginBottom: '0',
    color: 'white',
    fontSize: '22px',
    fontWeight: '900',
  },
  avgSpeedTitle: {
    marginTop: '60px',
    marginBottom: '0',
    color: 'white',
    fontSize: '25px',
    fontWeight: '900',
  },
  peakSpeedValue: {
    color: '#ffa600',
    fontSize: '40px',
    fontWeight: '900',
  },
  avgSpeedValue: {
    color: '#13d5e8',
    fontSize: '50px',
    fontWeight: '900',
  },
  speedUnit: {
    color: '#888',
    fontSize: '20px',
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
    fetchAllLocationsSpeedRequest: func.isRequired,
    zoomEndHandler: func.isRequired,
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
      zooms: [3, 16],
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
        <div className={classes.statisticsBoard}>
          <h5 className={classes.peakSpeedTitle}>早高峰运送速度</h5>
          <div>
            <span className={classes.peakSpeedValue}></span>
            <span className={classes.speedUnit}>km/h</span>
          </div>
          <h5 className={classes.peakSpeedTitle}>晚高峰运送速度</h5>
          <div>
            <span className={classes.peakSpeedValue}></span>
            <span className={classes.speedUnit}>km/h</span>
          </div>
          <h5 className={classes.avgSpeedTitle}>当前平均运送速度</h5>
          <div>
            <span className={classes.avgSpeedValue}></span>
            <span className={classes.speedUnit}>km/h</span>
          </div>
        </div>
      </div>
    );
  }
}

export default Component;
