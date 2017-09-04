'use strict';

var config = require('./../config');
var common = require('./common'),
  co = require('co'),
  request = require('request');

function requestAsync(opts) {
  return function (callback) {
    request(opts, function (err, resp, body) {
      if (err) {
        return callback(err)
      }
      return callback(null, [ resp, body ])
    })
  }
}

function *notify(user) {
  var notifyUrls = config['notify']
  if (notifyUrls && notifyUrls instanceof Array) {
    for (var i = 0; i < notifyUrls.length; i++) {
      var body = {
        type: 'user',
        event: 'updated',
        user_id: user.user_id,
        user: user,
      };
      var opts = {
        method: 'POST',
        url: notifyUrls[i],
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'text/plain',
          'User-Agent': 'MissEvan SSO',
        },
        gzip: true,
        body: common.make_auth2(body),
      };
      yield requestAsync(opts);
    }
  }
}

function notify_user_updated(user) {
  var fn = co.wrap(notify);
  fn(user).catch(function (err) {
    console.error('notify_user_updated', user.user_id, err);
  });
}

exports.notify_user_updated = notify_user_updated
