/**
 * Speed Component Module
 * @module Speed/Components/Echarts
 * @requires react
 * @requires prop-types
 * @requires material-ui
 * @requires echarts-for-react
 * @requires moment
 */
import React from 'react';
import {object, number, shape, arrayOf} from 'prop-types';
import {withStyles} from 'material-ui/styles';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';

const styles = (theme) => ({
  echarts: {
    width: '100%',
    height: '100%',
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
    speedTrend: arrayOf(shape({
      time: number,
      speed: number,
    })),
  };

  /**
   * Return react tree of Echarts component
   * @return {Component}
   */
  render() {
    const {
      classes,
      speedTrend,
    } = this.props;

    // Config echarts options with props
    const echartsOptions = {
      title: {
        show: false,
      },
      legend: {
        show: false,
      },
      grid: {
        right: '5px',
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
      <ReactEcharts className={classes.echarts} option={echartsOptions} />
    );
  }
}

export default Component;
