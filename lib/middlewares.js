
var config = require('./../config');

var logger = require('koa-logger');
var parse = require('co-body');

module.exports = function (app) {

  app.proxy = true;

  if (config['app']['dev_mode']) {
    app.use(logger());
  }

  app.use(function *(next) {
    if ('POST' == this.method) {
      this.request.body = yield parse(this);
    }
    yield next;
  });
};
