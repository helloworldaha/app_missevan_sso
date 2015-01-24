'use strict';

var config = require('./../../config');

module.exports = function (sso) {
  sso.post('/login', function *(next) {
    this.body = 'login';
  });
};
