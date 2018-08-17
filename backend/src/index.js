const debug = require('debug')('weathermap');

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

const port = process.env.PORT || 9000;

const app = new Koa();

function verifyOrigin (ctx) {
  var origin = ctx.headers.origin;
  if (corsAllowedOrigins.length > 0 && corsAllowedOrigins.indexOf(origin) !== -1) {
    ctx.set('Access-Control-Allow-Origin', origin);
  }
}

app.use(cors(verifyOrigin));

const fetchWeather = async (targetCity, units) => {
  const endpoint = `${mapURI}/weather?q=${targetCity}&appid=${appId}&units=${units}`;
  const response = await fetch(endpoint);

  return response ? response.json() : {};
};

const fetchWeatherForecast = async (targetCity, units) => {
  const endpoint = `${mapURI}/forecast?q=${targetCity}&appid=${appId}&units=${units}`;
  const response = await fetch(endpoint);

  return response ? response.json() : {};
};

router.get('/api/weather', async ctx => {
  const targetCity = ctx.query.city || defaultTargetCity;
  const units = ctx.query.units || 'metric';
  debug(`Fetching weather (${targetCity})...`);

  const currentWeatherData = await fetchWeather(targetCity, units);

  const currentWeather = currentWeatherData.weather ? currentWeatherData.weather[0] : {};
  debug(`Current weather (${targetCity}): ${JSON.stringify(currentWeather)}`);

  const currentTemp = currentWeatherData.main && currentWeatherData.main.temp;
  debug(`Current temp (${targetCity}): ${currentTemp}`);

  const city = currentWeatherData.name;
  const country = currentWeatherData.sys && currentWeatherData.sys.country;

  debug(`City (${targetCity}): ${city}`);
  debug(`Country (${targetCity}): ${country}`);

  const weatherForecastData = await fetchWeatherForecast(targetCity, units);

  // Get first 3 forecasts
  const forecasts = (weatherForecastData.list || []).slice(0, 3).map(forecast => ({
    dt: forecast.dt,
    weather: forecast.weather ? forecast.weather[0] : {},
    temp: forecast.main && forecast.main.temp,
  }));

  debug(`Weather forecasts (${targetCity}): ${JSON.stringify(forecasts)}`);

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
