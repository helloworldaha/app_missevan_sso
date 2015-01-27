'use strict';

var config = require('./../../config');
var validator = require('validator');
var errmsg = require('./../../lib/errno').errmsg,
  common = require('./../../lib/common');
var Model = require('./../../model'),
  Account = Model.Account,
  Session = Model.Session;

module.exports = function (sso) {
  sso.post('/register', function *(next) {
    var r = { code: -1 };
    if (this.auth && this.auth.email && this.auth.ip
      && this.auth.username && this.auth.password) {
      if (validator.isEmail(this.auth.email) && validator.isIP(this.auth.ip)) {

        var account = new Account();

        var u = {
          username: this.auth.username.trim(),
          password: this.auth.password,
          email: this.auth.email.trim().toLowerCase(),
          cip: this.auth.ip
        };

        var exists1 = yield account.exists({ username: u.username });
        if (exists1) {
          r.code = 2;
          r.message = errmsg(r.code);
          this.body = r;
          return;
        }
        var exists2 = yield account.exists({ email: u.email });
        if (exists2) {
          r.code = 3;
          r.message = errmsg(r.code);
          this.body = r;
          return;
        }

        var user_id = yield account.save(u);
        var user;
        if (user_id) {
          account.set({id: user_id});
          user = yield account.find();
        }
        if (user) {
          var suser = {
            user_id: user.id,
            username: user.username,
            email: user.email,
            iconid: user.iconid,
            iconurl: user.iconurl,
            iconcolor: user.iconcolor
          };

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
    }
    r.message = errmsg(r.code);
    this.body = r;
  });
};
