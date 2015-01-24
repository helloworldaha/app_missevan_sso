'use strict';

var crypto = require('crypto');

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

exports.preg_quote = preg_quote;

exports.md5 = md5;
exports.base64 = base64;
exports.hmac_sha1 = hmac_sha1;
