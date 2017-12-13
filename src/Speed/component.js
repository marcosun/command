/**
 * Speed Component Module
 * @module Speed/Component
 * @requires react
 * @requires prop-types
 * @requires material-ui
 * @requires echarts-for-react
 * @requires react-amap
 * @requires react-amap-plugin-heatmap
 * @requires moment
 */
import React from 'react';
import {object, func, string, number, shape, arrayOf} from 'prop-types';
import {withStyles} from 'material-ui/styles';
import ReactEcharts from 'echarts-for-react';
import {Map as ReactAMap} from 'react-amap';
import Heatmap from 'react-amap-plugin-heatmap';
import moment from 'moment';

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
    right: '100px',
    bottom: '300px',
    color: 'white',
    textAlign: 'right',
  },
  peakSpeedTitle: {
    marginBottom: '10px',
    color: 'white',
    fontSize: '22px',
    fontWeight: '900',
  },
  dayAvgSpeedTitle: {
    marginTop: '60px',
    marginBottom: '10px',
    color: 'white',
    fontSize: '25px',
    fontWeight: '900',
  },
  peakSpeedValue: {
    marginRight: '10px',
    color: '#ffa600',
    fontSize: '40px',
    fontWeight: '900',
  },
  dayAvgSpeedValue: {
    marginRight: '10px',
    color: '#13d5e8',
    fontSize: '50px',
    fontWeight: '900',
  },
  speedUnit: {
    color: '#888',
    fontSize: '20px',
  },
  statisticsEcharts: {
    position: 'absolute',
    right: '100px',
    bottom: 0,
    color: 'white',
    textAlign: 'right',
  },
  echarts: {
    width: '450px',
    height: '250px',
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

    // Call saga to fetch statistics api
    this.props.fetchAllStatisticsRequest({
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
      morningPeakSpeed,
      eveningPeakSpeed,
      dayAvgSpeed,
      speedTrend,
    } = this.props;

    const echartsOptions = {
      title: {
        show: false,
      },
      legend: {
        show: false,
      },
      grid: {
        right: 0,
      },
      xAxis: {
        type: 'category',
        axisLine: {
          lineStyle: {
            color: 'gray',
            width: 2,
          },
        },
        axisLabel: {
          color: 'lightgray',
        },
        axisTick: {
          alignWithLabel: true,
          inside: true,
          lineStyle: {
            color: 'gray',
            width: 2,
          },
        },
        data: speedTrend.map((trend) => {
          return moment(trend.time).format('H:mm');
        }),
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: 'lightgray',
        },
        splitLine: {
          lineStyle: {
            color: 'gray',
          },
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: 'darkgray',
            opacity: 0.1,
          },
        },
      },
      tooltip: {
        show: false,
      },
      series: [{
        // name: '速度',
        type: 'line',
        showSymbol: false,
        lineStyle: {
          normal: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'orange', // 0% 处的颜色
              }, {
                offset: 1, color: '#13d5e8', // 100% 处的颜色
              }],
              globalCoord: false,
            },
          },
        },
        data: speedTrend.map((trend) => {
            return trend.speed;
          }),
        }],
    };

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
            <span className={classes.peakSpeedValue}>{morningPeakSpeed}</span>
            <span className={classes.speedUnit}>km/h</span>
          </div>
          <h5 className={classes.peakSpeedTitle}>晚高峰运送速度</h5>
          <div>
            <span className={classes.peakSpeedValue}>{eveningPeakSpeed}</span>
            <span className={classes.speedUnit}>km/h</span>
          </div>
          <h5 className={classes.dayAvgSpeedTitle}>当前平均运送速度</h5>
          <div>
            <span className={classes.dayAvgSpeedValue}>{dayAvgSpeed}</span>
            <span className={classes.speedUnit}>km/h</span>
          </div>
        </div>
        <div className={classes.statisticsEcharts}>
          <ReactEcharts className={classes.echarts} option={echartsOptions} />
        </div>
      </div>
    );
  }
}

export default Component;
