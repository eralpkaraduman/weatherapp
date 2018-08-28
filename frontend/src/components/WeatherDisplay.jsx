import React, { Component } from 'react';
import PropTypes from 'prop-types';
import constants from './constants';

class WeatherDisplay extends Component {
  componentDidMount() {
    this.state = {};
  }

  render() {
    const { weatherIcon, units, temp } = this.props;
    const tempMetricSymbol = constants.unitTempSymbols[units] || '';
    return (
      <div className="weather-display">
        <div className="icon">
          { weatherIcon &&
            <img
              src={`/img/${weatherIcon.slice(0, -1)}.svg`}
              alt="current-weather-icon"
            />
          }
        </div>
        <h3 className="temp">{ `${temp}${tempMetricSymbol}` }</h3>
      </div>
    );
  }
}

WeatherDisplay.propTypes = {
  weatherIcon: PropTypes.string.isRequired,
  units: PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired,
};

export default WeatherDisplay;
