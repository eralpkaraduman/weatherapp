const debug = require('debug')('weathermap');

const Koa = require('koa');
const router = require('koa-router')();
const fetch = require('node-fetch');
const cors = require('kcors');

const appId = process.env.APPID || '';
const mapURI = process.env.MAP_ENDPOINT || 'http://api.openweathermap.org/data/2.5';
const corsOrigin = process.env.CORS_ORIGIN;
const targetCity = process.env.TARGET_CITY || 'Helsinki,fi';

debug('corsOrigin: ' + corsOrigin);

const port = process.env.PORT || 9000;

const app = new Koa();

let corsOptions = {};
if (corsOrigin) {
  console.log(`cors.origin = ${corsOrigin}`);
  corsOptions.origin = corsOrigin;
}

app.use(cors(corsOptions));

const fetchWeather = async () => {
  const endpoint = `${mapURI}/weather?q=${targetCity}&appid=${appId}&`;
  const response = await fetch(endpoint);

  return response ? response.json() : {};
};

router.get('/api/weather', async ctx => {
  const weatherData = await fetchWeather();
  ctx.type = 'application/json; charset=utf-8';
  debug(weatherData);
  ctx.body = weatherData.weather ? weatherData.weather[0] : {};
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port);

console.log(`App listening on port ${port}`);
