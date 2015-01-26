
var config = require('./../config');

var crypto = require('crypto');
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

      //check auth data
      if (body && body.auth && typeof body.auth == 'string') {
        var parts = body.auth.split(' ');
        if (parts.length === 3 && /^[0-9]+$/.test(parts[2])) {
          //auth='<message> <sign> <timestamp>'
          var rt = parseInt(parts[2]);
          var now = Math.floor(new Date().valueOf() / 1000);
          if (Math.abs(now - rt) < 60) {
            //1min alive
            var smsg = parts[0];
            var text = smsg + ' ' + parts[2];
            var hash = crypto.createHmac('sha1', config['app'].secret_key)
              .update(text).digest('hex');
            if (hash === parts[1]) {
              var sjson = new Buffer(smsg, 'base64').toString('utf8');
              this.auth = JSON.parse(sjson);
            }
          }
        }
      }

    }
    yield next;
  });

};
