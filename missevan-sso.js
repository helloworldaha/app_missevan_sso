
var config = require('./config');
var koa = require('koa');

var controller = require('./controller');

var app = module.exports = koa();

controller(app);
