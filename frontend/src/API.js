const baseURL = process.env.ENDPOINT;

const getWeather = async (latitude, longitude, city = null, units = null) => {
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
    if (response.ok) {
      return response.json();
    }
    throw await response.text();
  } catch (error) {
    throw error;
  }
};

export default {
  getWeather,
};
