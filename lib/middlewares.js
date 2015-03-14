
var config = require('./../config');

var common = require('./../lib/common'),
  errmsg = require('./../lib/errno').errmsg;
var logger = require('koa-logger'),
  parse = require('co-body');

module.exports = function (app) {

  app.proxy = true;

  if (config['app']['dev_mode']) {
    app.use(logger());
  }

  app.use(function *(next) {
    if ('POST' == this.method) {
      var body = yield parse(this);

      if (body) {
        //auth = JSON <message>
        this.auth = common.check_auth(body.auth);
      }
    }
    if (!this.auth) {
      this.body = 'Not auth';
      return;
    }
    yield next;
  });

  app.use(function *(next) {
    try {
      yield next;
    } catch (e) {
      if (config['app'].dev_mode) {
        console.error(e.stack);
      }
      this.body = {
        code: -2,
        message: e.message
      };
    }
  });
};
