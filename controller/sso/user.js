'use strict';

var config = require('./../../config');
var errmsg = require('./../../lib/errno').errmsg,
common = require('./../../lib/common');
var Model = require('./../../model'),
Account = Model.Account,
Session = Model.Session;

module.exports = function (sso) {
  sso.post('/user', function *(next) {
    var r = { code: -1 };
    if (this.auth && this.auth.token) {
      var vt = common.parse_token(this.auth.token);
      if (vt && vt.valid) {
        var session = new Session();
        var sess = yield session.find(vt.sid);

        if (sess && Math.floor(sess.loginAt.valueOf() / 1000) === vt.timestamp
          && sess.expireAt > new Date()) {
          r.code = 0;
          r.user = session.getUserInfo();
        } else {
          r.code = 3;
        }
      } else {
        r.code = 3;
      }
    } else {
      r.code = -1;
    }
    r.message = errmsg(r.code);
    this.body = r;
  });
};
