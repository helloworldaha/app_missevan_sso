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
  //sauth='<message> <sign> <timestamp>'
  if (sauth && typeof sauth == 'string') {
    var parts = sauth.split(' ');
    if (parts.length === 3 && validator.isNumeric(parts[2])) {
      var rt = parseInt(parts[2]);
      var now = Math.floor(new Date().valueOf() / 1000);
      //1min alive
      if (Math.abs(now - rt) < 60) {
    	//smsg = <message>
        var smsg = parts[0];
        var text = smsg + ' ' + parts[2];
        //vilidate sign
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
  var smsg = base64(JSON.stringify(message));
  var timestamp = Math.round(new Date().valueOf() / 1000).toString();
  var text = smsg + ' ' + timestamp;
  var sign = hmac_sha1(config['app'].secret_key, text);

  return smsg + ' ' + sign + ' ' + timestamp;
}

function parse_token(token) {
  if (token && typeof token == 'string') {
    var parts = token.split('|');
    if (parts.length === 3 && validator.isMongoId(parts[0])
      && validator.isNumeric(parts[1])) {
      var fullsign = hmac_sha1(config['app'].token_key, parts[0] + ' ' + parts[1]);
      var r = (fullsign.substring(3, 19) === parts[2]);
      return r ? {
        valid: true,
        sid: parts[0],
        timestamp: parseInt(parts[1])
      } : {
        valid: false
      };
    }
  }
  return null;
}

function sign_token(sid, date) {
  var sdate = Math.floor(date.valueOf() / 1000).toString();
  var sign = hmac_sha1(config['app'].token_key, sid + ' ' + sdate);
  return sid + '|' + sdate + '|' + sign.substring(3, 19);
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
exports.parse_token = parse_token;
exports.sign_token = sign_token;
