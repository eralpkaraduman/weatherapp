import 'babel-polyfill';
import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';

import API from './API';
import CurrentWeather from './components/CurrentWeather';
import ForecastWeather from './components/ForecastWeather';
import TemperatureUnitSelector from './components/TemperatureUnitSelector';

class Weather extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pending: false,
      failed: false,
      errorMessage: null,
      currentWeather: null,
      currentTemp: null,
      city: '',
      country: '',
      units: null,
      forecasts: [],
      browserGeolocationPosition: null,
    };
  }

  componentWillMount() {
    this.updateWeatherData();
    this.checkGeolocation();
  }

  componentDidUpdate(prevProps, prevState) {
    const { browserGeolocationPosition, units } = this.state;
    const unitsChanged = units && prevState.units !== units;
    const geolocationChanged = browserGeolocationPosition && browserGeolocationPosition.coords
      && prevState.browserGeolocationPosition !== browserGeolocationPosition;

    if (geolocationChanged || unitsChanged) {
      this.updateWeatherData();
    }
  }

  checkGeolocation(delay = 2000) {
    setTimeout(() => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.setState({ browserGeolocationPosition: position });
        });
      }
    }, delay);
  }

  async updateWeatherData() {
    const { units, browserGeolocationPosition } = this.state;

    this.setState({ pending: true });

    let weatherResponse = null;
    try {
      const coords = browserGeolocationPosition && browserGeolocationPosition.coords;
      weatherResponse = await API.getWeather(
        coords && coords.latitude,
        coords && coords.longitude,
        null,
        units
      );
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
      const errorMessage = (error.message || error).toString();
      this.setState({ pending: false, failed: true, errorMessage });
    }

    if (weatherResponse) {
      this.setState({
        pending: false,
        failed: false,
        errorMessage: null,

        city: weatherResponse.city,
        country: weatherResponse.country,
        units: weatherResponse.units,
        currentWeather: weatherResponse.weather.current.weather,
        currentTemp: weatherResponse.weather.current.temp,
        forecasts: weatherResponse.weather.forecasts,
      });
    }
  }

  render() {
    const {
      pending, failed, errorMessage,
      city, country, units,
      currentWeather, currentTemp,
      forecasts,
    } = this.state;

    if (pending) {
      return (
        <div className="container">
          <h1>Loading...</h1>
        </div>
      );
    }

    if (failed) {
      return (
        <div className="container">
          <h1>Error</h1>;
          <h2>{errorMessage || 'Unknown Error'}</h2>
        </div>
      );
    }

    return (
      <div className="container">
        <TemperatureUnitSelector
          selectedUnit={units}
          onUnitSelected={newUnit => this.setState({ units: newUnit })}
        />
        <CurrentWeather
          weatherIcon={currentWeather.icon}
          country={country}
          city={city}
          units={units}
          temp={currentTemp}
        />
        { forecasts.length > 0 &&
          <h2 className="forecast-title">Forecast</h2>
        }
        <div className="forecast-list">
          {forecasts.map(({ dt, weather, temp }) => (
              <ForecastWeather
                key={`forecast-${dt}`}
                dateTime={dt}
                weatherIcon={weather.icon}
                units={units}
                temp={temp}
              />
          ))}
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Weather />,
  document.getElementById('app')
);
