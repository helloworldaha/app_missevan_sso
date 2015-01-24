
var mount = require('koa-mount');

var sso = require('./sso');

module.exports = function (app) {
  app.use(mount('/sso', sso.middleware()));
};
