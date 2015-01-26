/**
* missevan sso project configuration
*/

var path = require('path');

//'..' for config folder, '.' for config.js file
var root_dir = path.resolve(__dirname, '.') + '/';
//var public_dir = root_dir + 'public/';

var config = {
  web: {
    address: '127.0.0.1',
    port: 3002
  },
  app: {
    dev_mode: true,
    secret_key: 'H1m60ntHOwKXniIXNxEBMxSSsk0Env1deAhJ'
  },
  sys: {
    root_dir: root_dir
  },
  db: {
    /* database configurations */
    mysql: {
      host: '192.168.1.147',
      name: 'app_missevan_sso',
      username: 'root',
      password: '123456789',
      table: 'm_user'
    },
    mongo: {
      host: '192.168.1.147',
      name: 'sso',
      username: '',
      password: '',
      collection: 'records'
    }
  }
};


module.exports = config;
