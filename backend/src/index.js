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

const fetchCurrentWeather = async (targetCity) => {
  const endpoint = `${mapURI}/weather?q=${targetCity}&appid=${appId}&`;
  const response = await fetch(endpoint);

  return response ? response.json() : {};
};

const fetchForecastWeather = async (targetCity) => {
  const endpoint = `${mapURI}/forecast?q=${targetCity}&appid=${appId}&`;
  const response = await fetch(endpoint);

  return response ? response.json() : {};
};

router.get('/api/weather', async ctx => {
  const targetCity = defaultTargetCity; // TODO: Get from request parameters
  debug(`Fetching weather (${targetCity})...`);
  
  const currentWeatherData = await fetchCurrentWeather(targetCity);
  const current = currentWeatherData.weather ? currentWeatherData.weather[0] : {};
  debug(`Current weather (${targetCity}): ${JSON.stringify(current)}`);
  const city = currentWeatherData.name;
  const country = currentWeatherData.sys && currentWeatherData.sys.country;

  const forecastWeatherData = await fetchCurrentWeather(targetCity);
  const forecastWeather = forecastWeatherData.weather ? forecastWeatherData.weather[0] : {};
  debug(`Forecast weather (${targetCity}): ${JSON.stringify(forecastWeather)}`);

  ctx.type = 'application/json; charset=utf-8';
  ctx.body = {
    city,
    country,
    weather: {
      current,
      forecast: {
        forecastWeather
      }
    }
  };
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port);

console.log(`App listening on port ${port}`);
