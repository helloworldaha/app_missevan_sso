
var Router = require('koa-router');
var sso = new Router();

require('./login')(sso);

module.exports = sso;
