'use strict';

var config = require('./../../config');
var errmsg = require('./../../lib/errno').errmsg,
  common = require('./../../lib/common');

var validator = require('validator');
var Model = require('./../../model'),
  Account = Model.Account,
  Session = Model.Session;

module.exports = function (sso) {
  sso.post('/update', function *(next) {
    var r = { code: -1 };
    if (this.auth && this.auth.token) {
      var vt = common.parse_token(this.auth.token);
      if (vt && vt.valid) {
        var session = new Session();
        var sess = yield session.find(vt.sid);
        if (sess
          && sess.expireAt > new Date()) {
          //update
          var account = new Account({id: sess.user_id});
          if (this.auth.update) {
            var u = this.auth.update;
            if (u.username && (typeof u.username !== 'string'
              || u.username === sess.username)) {
              u.username = undefined;
              delete u.username;
            }
            if (u.username) {
              u.username = u.username.trim();
              var exists = yield account.exists({
                username: u.username
              });
              if (exists) {
                r.code = 2;
                r.message = errmsg(r.code);
                this.body = r;
                return;
              }
            }
            yield account.update(u);
          }

          var user = yield account.find();
          if (user) {
            var suser = Session.AccountFilter(user);
            suser._id = sess._id;

            session.set(suser);
            if (this.auth.update) {
              // update history session info
              yield session.updateByUserId(sess.user_id);
            }
            session.setTime(sess.maxAgeType);
            sess = null;
            // update current session expires
            if (yield session.update()) {
              r.code = 0;
              r.expire = Math.floor(session.expireAt.valueOf() / 1000);
              r.token = common.sign_token(session._id, session.loginAt);
              r.user = session.getUserInfo();
            } else {
              r.code = -2;
            }
          } else {
            r.code = 1;
          }
        } else {
          r.code = 5;
        }
      }
    } else if (this.auth && this.auth.user_id && this.auth.update) {
      if (validator.isNumeric(this.auth.user_id) && typeof this.auth.update == 'object') {
        //update
        var uid = parseInt(this.auth.user_id);
        var u = this.auth.update;
        var account = new Account({id: uid});
        if (u.username) {
          u.username = u.username.trim();
          var exists = yield account.exists({
            username: u.username
          });
          if (exists) {
            r.code = 2;
            r.message = errmsg(r.code);
            this.body = r;
            return;
          }
        }
        if (this.auth.ip) {
          u.uip = this.auth.ip;
        }
        yield account.update(u);
        r.code = 0;

        // update session
        var session = new Session();
        yield session.updateByUserId(uid, u);
      }
    }
    r.message = errmsg(r.code);
    this.body = r;
  });
};
