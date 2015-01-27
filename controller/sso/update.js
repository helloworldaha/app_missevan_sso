'use strict';

var config = require('./../../config');
var errmsg = require('./../../lib/errno').errmsg,
  common = require('./../../lib/common');
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

        if (sess && Math.floor(sess.loginAt.valueOf() / 1000) === vt.timestamp
          && sess.expireAt > new Date()) {
          //update
          var account = new Account({id: sess.user_id});

          if (this.auth.user) {
            yield account.update(this.auth.user);
          }

          var user = yield account.find();
          if (user) {
            var suser = {
              _id: sess._id, //session id
              user_id: user.id,
              username: user.username,
              email: user.email,
              iconid: user.iconid,
              iconurl: user.iconurl,
              iconcolor: user.iconcolor
            };

            session.set(suser);
            session.setTime(sess.maxAgeType);
            sess = null;

            if (yield session.update()) {
              r.code = 0;
              r.expire = Math.floor(session.expireAt.valueOf() / 1000);
              r.token = common.sign_token(session._id, session.loginAt);
              r.user = suser;
            } else {
              r.code = -2;
            }
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
    }
  });
}
