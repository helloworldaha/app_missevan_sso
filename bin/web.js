#!/usr/bin/env iojs

var app = require('../missevan-sso');

var config = require('../config');

var server = app.listen(
	process.env.PORT || config['web'].port || 3000,
	config['web'].address || '::',
	function(){
		console.log('MissEvan SSO Server listen on ' +
				server.address().address + ':' + server.address().port);
	});
	
