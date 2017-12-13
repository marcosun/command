/**
 * Speed Component Module
 * @module Speed/Components/SpeedBoard
 * @requires react
 * @requires prop-types
 * @requires material-ui
 */
import React from 'react';
import {object, string, number, oneOfType} from 'prop-types';
import {withStyles} from 'material-ui/styles';

const styles = (theme) => ({
  title: {
    marginBottom: '10px',
    color: 'white',
    fontSize: '22px',
    fontWeight: '900',
  },
  value: {
    marginRight: '10px',
    color: '#ffa600',
    fontSize: '40px',
    fontWeight: '900',
  },
  unit: {
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
    title: string.isRequired,
    value: oneOfType([number, string]),
    color: string,
  };

  /**
   * Constructor
   * @param  {Object} props
   */
  constructor(props) {
    super(props);
    this.props = props;
  }

  /**
   * Return react tree of SpeedBoard component
   * @return {Component}
   */
  render() {
    const {
      classes,
      title,
      value,
      color = '#ffa600', // Default color
    } = this.props;

    return (
      <div>
        <h5 className={classes.title}>{title}</h5>
        <div>
          <span className={classes.value} style={{color}}>{value}</span>
          <span className={classes.unit}>km/h</span>
        </div>
      </div>
    );
  }
}

export default Component;
