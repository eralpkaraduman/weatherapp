import React from 'react';
import ReactDOM from 'react-dom';

import API from './API';
import CurrentWeather from './components/CurrentWeather';
import ForecastWeather from './components/ForecastWeather';

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
      units: '',
      forecasts: [],
      browserGeolocationPosition: null,
    };
  }

  async componentWillMount() {
    this.updateWeatherData();
    this.checkGeolocation();
  }

  async componentDidUpdate(prevProps, prevState) {
    const { browserGeolocationPosition } = this.state;
    if (browserGeolocationPosition && browserGeolocationPosition.coords &&
      prevState.browserGeolocationPosition !== browserGeolocationPosition) {
      const { latitude, longitude } = browserGeolocationPosition.coords;
      this.updateWeatherData(latitude, longitude);
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

  async updateWeatherData(latitude = null, longitude = null) {
    this.setState({ pending: true });

    let weatherResponse = null;
    try {
      weatherResponse = await API.getWeather(latitude, longitude);
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
      this.setState({ pending: false, failed: true, errorMessage: error });
    }

    if (weatherResponse) {
      this.setState({ pending: false, failed: false, errorMessage: null });

      const { weather, city, country, units } = weatherResponse;

      this.setState({
        city,
        country,
        units,
        currentWeather: weather.current.weather,
        currentTemp: weather.current.temp,
        forecasts: weather.forecasts,
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
          <h1>Loading...</h1>;
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
        { currentWeather && currentTemp &&
          <CurrentWeather
            weatherIcon={currentWeather.icon}
            country={country}
            city={city}
            units={units}
            temp={currentTemp}
          />
        }
        { forecasts.length > 0 &&
          <h2 className="forecast-title">Forecast</h2>
        }
        <div className="forecast-list">
          {
            forecasts.map(({ dt, weather, temp }) => (
              <ForecastWeather
                key={`forecast-${dt}`}
                dateTime={dt}
                weatherIcon={weather.icon}
                units={units}
                temp={temp}
              />
            )
          )}
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Weather />,
  document.getElementById('app')
);
