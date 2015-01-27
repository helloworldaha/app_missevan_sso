
var Router = require('koa-router');
var sso = new Router();

require('./login')(sso);
require('./update')(sso);
require('./session')(sso);

module.exports = sso;
