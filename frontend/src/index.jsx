import React from 'react';
import ReactDOM from 'react-dom';

import CurrentWeather from './components/CurrentWeather';
import ForecastWeather from './components/ForecastWeather';

const baseURL = process.env.ENDPOINT;

const getWeatherFromApi = async () => {
  try {
    const response = await fetch(`${baseURL}/weather`);
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
    };
  }

  async componentWillMount() {
    this.setState({ pending: true });
    const weatherResponse = await getWeatherFromApi();
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
