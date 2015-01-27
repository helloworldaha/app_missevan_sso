
var Router = require('koa-router');
var sso = new Router();

require('./login')(sso);
require('./update')(sso);
require('./user')(sso);

module.exports = sso;
