import React, { Component } from 'react';
import PropTypes from 'prop-types';

const unitTempSymbols = {
  metric: '°C',
  imperial: '°F',
  kelvin: '°K',
};

class WeatherDisplay extends Component {
  componentDidMount() {
    this.state = {};
  }

  render() {
    const { weatherIcon, units, temp } = this.props;
    const tempMetricSymbol = unitTempSymbols[units] || '';
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
        <div className="temp">{ `${temp}${tempMetricSymbol}` }</div>
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
