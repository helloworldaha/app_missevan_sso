'use strict';

var config = require('./../../config');
var errmsg = require('./../../lib/errno').errmsg;
var Model = require('./../../model'),
  Account = Model.Account,
  Session = Model.Session;

module.exports = function (sso) {
  sso.post('/login', function *(next) {
    var r = { code: -1 };
    if (this.auth && this.auth.password) {
      var user;
      var account = new Account();
      if (this.auth.email) {
        user = yield account.getByEmail(this.auth.email);
      }
      if (this.auth.qquid) {
        user = yield account.getByThirdUid('qquid', this.auth.qquid);
      }
      if (this.auth.weibouid) {
        user = yield account.getByThirdUid('weibouid', this.auth.weibouid);
      }

      if (user && !user.ban
        && Account.checkPassword(this.auth.password, user.password, user.salt)) {
        var session = new Session({
          user_id: user.id,
          username: user.username,
          email: user.email,
        });
        var sess = yield session.save();
        r.code = 0;
      } else {
        r.code = 1;
      }
    }

    r.message = errmsg(r.code);
    this.body = r;
  });
};
