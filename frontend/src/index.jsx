import React from 'react';
import ReactDOM from 'react-dom';

import CurrentWeather from './components/CurrentWeather';
import ForecastWeather from './components/ForecastWeather';

const baseURL = process.env.ENDPOINT;

const getWeatherFromApi = async (latitude, longitude, city = null, units = null) => {
  let path = `${baseURL}/weather`;

  const queryParams = [];

  if (latitude) {
    queryParams.push(`latitude=${latitude}`);
  }

  if (longitude) {
    queryParams.push(`longitude=${longitude}`);
  }

  if (city) {
    queryParams.push(`city=${city}`);
  }

  if (units) {
    queryParams.push(`units=${units}`);
  }

  const queryString = queryParams.join('&');

  if (queryString.length > 0) {
    path = `${path}?${queryString}`;
  }

  try {
    const response = await fetch(path);
    return response.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }

  return {};
};

class Weather extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pending: false,
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
  }

  componentDidMount() {
    // Attempt to update with browser geolocation 3 seconds later
    setTimeout(() => {
      // eslint-disable-next-line no-undef
      if ('geolocation' in navigator) {
        // eslint-disable-next-line no-undef
        navigator.geolocation.getCurrentPosition((position) => {
          this.setState({ browserGeolocationPosition: position });
        });
      }
    }, 3000);
  }

  async componentDidUpdate(prevProps, prevState) {
    const { browserGeolocationPosition } = this.state;
    if (browserGeolocationPosition && browserGeolocationPosition.coords &&
      prevState.browserGeolocationPosition !== browserGeolocationPosition) {
      const { latitude, longitude } = browserGeolocationPosition.coords;
      this.updateWeatherData(latitude, longitude);
    }
  }

  async updateWeatherData(latitude = null, longitude = null) {
    this.setState({ pending: true });
    const weatherResponse = await getWeatherFromApi(latitude, longitude);
    this.setState({ pending: false });

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

  render() {
    const {
      pending,
      city, country, units,
      currentWeather, currentTemp,
      forecasts,
    } = this.state;

    if (pending) {
      return <h1>Loading...</h1>;
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
        <h2 className="forecast-title">Forecast</h2>
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
