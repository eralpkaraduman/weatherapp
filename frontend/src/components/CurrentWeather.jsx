import React, { Component } from 'react';
import PropTypes from 'prop-types';
import WeatherDisplay from './WeatherDisplay';

class CurrentWeather extends Component {
  static countryCodeToEmoji(countryCode) {
    if (countryCode && countryCode.length > 0) {
      // Based On: https://binarypassion.net/lets-turn-an-iso-country-code-into-a-unicode-emoji-shall-we-870c16e05aad
      return countryCode
        .toUpperCase()
        .replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397));
    }

    return '';
  }

  render() {
    const { city, country, weatherIcon, units, temp } = this.props;
    const countryFlagEmoji = CurrentWeather.countryCodeToEmoji(country);
    return (
      <div className="current-weather">
        <h1>{ `Weather in ${city} ${countryFlagEmoji}` }</h1>
        <WeatherDisplay
          weatherIcon={weatherIcon}
          units={units}
          temp={temp}
        />
      </div>
    );
  }
}

CurrentWeather.propTypes = {
  weatherIcon: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  units: PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired,
};

export default CurrentWeather;
