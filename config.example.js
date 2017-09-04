/**
* missevan sso project configuration
*/

var path = require('path');

//'..' for config folder, '.' for config.js file
var root_dir = path.resolve(__dirname, '.') + '/';
//var public_dir = root_dir + 'public/';

var config = {
  web: {
    address: '0.0.0.0',
    port: 3002
  },
  app: {
    dev_mode: true,
    secret_key: 'ME0XDi71bSZwCFEtZTDinJZoj1IhQN9dJ7IR',
    token_key: 'AylLzOstESuH5fd9m9my3FDdgFuY4DGEerFf'
  },
  sys: {
    root_dir: root_dir
  },
  notify: [
    'http://example.com/api/user/notify',
  ],
  db: {
    /* database configurations */
   mysql: {
      host: '192.168.2.10',
      name: 'app_missevan_sso',
      username: 'root',
      password: 'rootmysql',
      table: 'm_user'
    },
    mongo: {
      host: '192.168.2.10',
      name: 'sso',
      username: '',
      password: '',
      collection: 'records'
    }
  }
};


module.exports = config;
