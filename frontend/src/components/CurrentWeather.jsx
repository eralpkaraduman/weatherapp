import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
    const { city, country, weatherIcon } = this.props;
    const countryFlagEmoji = CurrentWeather.countryCodeToEmoji(country);
    return (
      <div className="current-weather">
        <h1>{ `Weather in ${city} ${countryFlagEmoji}` }</h1>
        <div className="icon">
          { weatherIcon &&
            <img
              src={`/img/${weatherIcon.slice(0, -1)}.svg`}
              alt="current-weather-icon"
            />
          }
        </div>
      </div>
    );
  }
}

CurrentWeather.propTypes = {
  weatherIcon: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
};

export default CurrentWeather;
