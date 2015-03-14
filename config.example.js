/**
* missevan sso project configuration
*/

var path = require('path');

//'..' for config folder, '.' for config.js file
var root_dir = path.resolve(__dirname, '.') + '/';
//var public_dir = root_dir + 'public/';

var config = {
  web: {
    address: '115.29.235.9',
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
  db: {
    /* database configurations */
    mysql: {
      host: 'appmissevan.mysql.rds.aliyuncs.com',
      name: 'app_missevan_sso',
      username: 'missevan',
      password: '1111111111',
      table: 'm_user'
    },
    mongo: {
      host: '10.132.84.6',
      name: 'sso',
      username: '',
      password: '',
      collection: 'records'
    }
  }
};


module.exports = config;
