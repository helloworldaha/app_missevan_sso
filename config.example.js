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
    dev_mode: true
  },
  sys: {
    root_dir: root_dir
  },
  db: {
    /* database configurations */
    username: '',
    password: '',
    host: '127.0.0.1:27017',
    name: 'sso'
  }
};


module.exports = config;
