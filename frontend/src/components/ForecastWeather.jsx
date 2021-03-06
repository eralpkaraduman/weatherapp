import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import WeatherDisplay from './WeatherDisplay';

class ForecastWeather extends Component {
  componentDidMount() {
    this.state = {};
  }

  render() {
    const { dateTime, weatherIcon, units, temp } = this.props;
    const humanReadableDateTime = moment.unix(dateTime).calendar();
    return (
      <div className="forecast-weather">
        <h3>{ humanReadableDateTime }</h3>
        <WeatherDisplay
          weatherIcon={weatherIcon}
          units={units}
          temp={temp}
        />
      </div>
    );
  }
}

ForecastWeather.propTypes = {
  dateTime: PropTypes.number.isRequired,
  weatherIcon: PropTypes.string.isRequired,
  units: PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired,
};

export default ForecastWeather;
