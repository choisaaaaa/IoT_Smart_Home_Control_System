import config from '../config';

export default {
  host: config.app.host,
  port: config.app.port,
  env: config.app.env,
  apiPrefix: config.app.apiPrefix
};
