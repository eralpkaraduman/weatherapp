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

const targetCity = process.env.TARGET_CITY || 'Helsinki,fi';

const port = process.env.PORT || 9000;

const app = new Koa();

function verifyOrigin (ctx) {
  var origin = ctx.headers.origin;
  if (corsAllowedOrigins.length > 0 && corsAllowedOrigins.indexOf(origin) !== -1) {
    ctx.set('Access-Control-Allow-Origin', origin);
  }
}

app.use(cors(verifyOrigin));

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
