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
    if (this.auth && (this.auth.email || this.auth.mobile)&& this.auth.ip
      && this.auth.username && this.auth.password) {
      if ((validator.isEmail(this.auth.email) || validator.isMobilePhone(this.auth.mobile,'zh-CN'))
          && validator.isIP(this.auth.ip)) {

        var account = new Account();

        var u = {
          username: this.auth.username.trim(),
          password: this.auth.password,
          cip: this.auth.ip
        };

        if(this.auth.email){
          u.email = this.auth.email.trim().toLowerCase();
        }else{
          u.mobile = parseInt(this.auth.mobile);
        }

        var exists1 = yield account.exists({ username: u.username });
        if (exists1) {
          r.code = 2;
          r.message = errmsg(r.code);
          this.body = r;
          return;
        }

        if(u.email){
          var params = {email: u.email};
        }else{
          var params = {mobile: u.mobile};
        }
        var exists2 = yield account.exists(params);
        if (exists2) {
          r.code = 3;
          r.message = errmsg(r.code);
          this.body = r;
          return;
        }
        var user_id = yield account.save(u);
        var user;
        if (user_id) {
          user = yield account.find(user_id);
        }
        if (user) {
          var suser = Session.AccountFilter(user);

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
