'use strict';

var config = require('./../../config');
var Model = require('./../../model');

module.exports = function (sso) {
  sso.post('/login', function *(next) {
    console.log(this.auth);
    this.body = 'login';
  });
};
