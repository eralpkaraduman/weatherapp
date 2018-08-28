const debug = require('debug')('weatherapp');

const Koa = require('koa');
const router = require('koa-router')();
const fetch = require('node-fetch');
const cors = require('kcors');

const appId = process.env.APPID || '';
const mapURI = process.env.MAP_ENDPOINT || 'http://api.openweathermap.org/data/2.5';

// expects CORS_ALLOWED_ORIGINS to be in , seperated format ie: "http://a.com,https://b.com,http://c.com"
const corsAllowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || '').split(',');
console.log(`corsAllowedOrigins: "${corsAllowedOrigins}"`);

const defaultTargetCity = process.env.TARGET_CITY || 'Helsinki,fi';
const defaultUnits = process.env.TARGET_CITY || 'metric';

const port = process.env.PORT || 9000;

const app = new Koa();

function verifyOrigin (ctx) {
  var origin = ctx.headers.origin;
  if (corsAllowedOrigins.length > 0 && corsAllowedOrigins.indexOf(origin) !== -1) {
    ctx.set('Access-Control-Allow-Origin', origin);
  }
}
app.use(cors(verifyOrigin));

const errorHandler = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    ctx.app.emit('error', err, ctx);
  }
};
app.use(errorHandler);

const fetchWeatherApi = async (endpoint) => {
  try {
    const response = await fetch(`${mapURI}${endpoint}&appid=${appId}`);
    if (response && response.ok) {
      return response.json();
    }
  } catch (err) { debug(err); }
  debug(`Failed to fetch weather api: ${endpoint}`);
  return null;
};

const fetchWeatherForCity = async (targetCity, units) =>
  fetchWeatherApi(`/weather?q=${targetCity}&units=${units}`);

const fetchWeatherForecastForCity = async (targetCity, units) =>
  fetchWeatherApi(`/forecast?q=${targetCity}&units=${units}`);

const fetchWeatherForGeolocation = async ({ latitude, longitude, }, units) =>
  fetchWeatherApi(`/weather?lat=${latitude}&lon=${longitude}&units=${units}`);

const fetchWeatherForecastForGeolocation = async ({ latitude, longitude, }, units) =>
  fetchWeatherApi(`/forecast?lat=${latitude}&lon=${longitude}&units=${units}`);

router.get('/api/weather', async ctx => {
  const targetCity = ctx.query.city || defaultTargetCity;
  const units = ctx.query.units || defaultUnits;

  const { latitude, longitude, } = ctx.query;
  const geolocation = latitude && longitude && { latitude, longitude, };

  if (geolocation) {
    debug(`Using geolocation in API calls: ${JSON.stringify(geolocation)}`);
  } else {
    debug(`Using city name in API calls: ${JSON.stringify(targetCity)}`);
  }

  debug(`Fetching Weather...`);
  const currentWeatherData = geolocation
    ? await fetchWeatherForGeolocation(geolocation, units)
    : await fetchWeatherForCity(targetCity, units);

  ctx.assert(currentWeatherData, 500, 'Failed to fetch current weather');

  const currentWeather = currentWeatherData.weather ? currentWeatherData.weather[0] : {};
  debug(`Weather: ${JSON.stringify(currentWeather)}`);

  const currentTemp = currentWeatherData.main && currentWeatherData.main.temp;
  debug(`Temperature: ${currentTemp} ${units}`);

  const city = currentWeatherData.name;
  const country = currentWeatherData.sys && currentWeatherData.sys.country;

  debug(`Fetching Forecasts...`);
  const forecastWeatherData = geolocation
    ? await fetchWeatherForecastForGeolocation(geolocation, units)
    : await fetchWeatherForecastForCity(targetCity, units);

  ctx.assert(forecastWeatherData, 500, 'Failed to fetch weather forecasts');

  // Get first 5 forecasts
  const forecasts = (forecastWeatherData.list || []).slice(0, 5).map(forecast => ({
    dt: forecast.dt,
    weather: forecast.weather ? forecast.weather[0] : {},
    temp: forecast.main && forecast.main.temp,
  }));

  debug(`Forecasts: ${JSON.stringify(forecasts)}`);

  ctx.type = 'application/json; charset=utf-8';
  ctx.body = {
    city,
    country,
    units,
    weather: {
      current: {
        weather: currentWeather,
        temp: currentTemp,
      },
      forecasts,
    },
  };
});

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(port);

console.log(`App listening on port ${port}`);
