'use strict';

var config = require('./../config');
var crypto = require('crypto'),
  validator = require('validator');

function preg_quote(str, delimiter) {
  //  discuss at: http://phpjs.org/functions/preg_quote/
  // original by: booeyOH
  // improved by: Ates Goral (http://magnetiq.com)
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: Onno Marsman
  //   example 1: preg_quote("$40");
  //   returns 1: '\\$40'
  //   example 2: preg_quote("*RRRING* Hello?");
  //   returns 2: '\\*RRRING\\* Hello\\?'
  //   example 3: preg_quote("\\.+*?[^]$(){}=!<>|:");
  //   returns 3: '\\\\\\.\\+\\*\\?\\[\\^\\]\\$\\(\\)\\{\\}\\=\\!\\<\\>\\|\\:'

  return String(str)
    .replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
}

function md5(str) {
  var hash = crypto
    .createHash('md5')
    .update(str)
    .digest('hex');

  return hash;
}

function base64(str) {
  return new Buffer(str).toString('base64');
}

function hmac_sha1(secret_key, str) {
  var hash = crypto.createHmac('sha1', secret_key)
    .update(str).digest('hex');

  return hash;
}

function check_auth(sauth) {
  if (sauth && typeof sauth == 'string') {
    var parts = sauth.split(' ');
    if (parts.length === 3 && validator.isNumeric(parts[2])) {
      //auth='<message> <sign> <timestamp>'
      var rt = parseInt(parts[2]);
      var now = Math.floor(new Date().valueOf() / 1000);
      if (Math.abs(now - rt) < 60) {
        //1min alive
        var smsg = parts[0];
        var text = smsg + ' ' + parts[2];
        var hash = hmac_sha1(config['app'].secret_key, text);
        if (hash === parts[1]) {
          var sjson = new Buffer(smsg, 'base64').toString('utf8');
          return JSON.parse(sjson);
        }
      }
    }
  }
  return null;
}

function make_auth(message) {
  var smsg = new Buffer(JSON.stringify(message)).toString('base64');
  var timestamp = Math.round(new Date().valueOf() / 1000).toString();
  var text = smsg + ' ' + timestamp;
  var sign = hmac_sha1(config['app'].secret_key, text);

  return smsg + ' ' + sign + ' ' + timestamp;
}

function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}

exports.preg_quote = preg_quote;
exports.is_empty_object = isEmptyObject;

exports.md5 = md5;
exports.base64 = base64;
exports.hmac_sha1 = hmac_sha1;

exports.check_auth = check_auth;
exports.make_auth = make_auth;
