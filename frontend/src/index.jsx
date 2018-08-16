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
      city: '',
      country: '',
    };
  }

  async componentWillMount() {
    this.setState({ pending: true });
    const weatherResponse = await getWeatherFromApi();
    this.setState({ pending: false });

    const { weather, city, country } = weatherResponse;

    this.setState({
      city,
      country,
      currentWeather: weather.current,
    });
  }

  render() {
    const {
      pending,
      city, country,
      currentWeather,
    } = this.state;

    if (pending) {
      return <h1>Loading...</h1>;
    }

    return (
      <div className="container">
        { currentWeather &&
          <CurrentWeather
            weatherIcon={currentWeather.icon}
            country={country}
            city={city}
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
