import React from 'react';
import ReactDOM from 'react-dom';

import CurrentWeather from './components/CurrentWeather';

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
    });
  }

  render() {
    const {
      pending,
      city, country, units,
      currentWeather,
      currentTemp,
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
      </div>
    );
  }
}

ReactDOM.render(
  <Weather />,
  document.getElementById('app')
);
