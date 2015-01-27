'use strict';

var config = require('./../../config');
var validator = require('validator');
var errmsg = require('./../../lib/errno').errmsg,
  common = require('./../../lib/common');
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
        var suser = {
          user_id: user.id,
          username: user.username,
          email: user.email,
          iconid: user.iconid,
          iconurl: user.iconurl,
          iconcolor: user.iconcolor
        };

        if (this.auth.ip) {
          if (validator.isIP(this.auth.ip)) {
            account.set({id: user.id});
            yield account.update({uip: this.auth.ip});
          }
        }

        var session = new Session(suser, this.auth.maxAgeType);
        var sess = yield session.save();
        if (sess) {
          r.code = 0;
          r.expire = Math.floor(sess.expireAt.valueOf() / 1000);
          r.token = common.sign_token(sess._id, sess.loginAt);
          r.user = suser;
        } else {
          r.code = -2;
        }
      } else {
        r.code = 1;
      }
    }

    r.message = errmsg(r.code);
    this.body = r;
  });
};
