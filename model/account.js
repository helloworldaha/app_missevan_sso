'use strict';

/**
* model/account.js
* MissEvan SSO
*
* Author: 腾袭
*
* account model
*/

var config = require('./../config'),
  config2 = config['db'].mysql;
var util = require('util'),
  mysql = require('mysql');
var generator = require('./../lib/generator'),
  common = require('./../lib/common');

var dbopts = {
  host     : config2['host'],
  user     : config2['username'],
  password : config2['password'],
  database : config2['name']
};
if (config2['port']) {
  dbopts.port = config2['port'];
}

var conn = mysql.createConnection(dbopts);
var yconn = new generator(conn);

function Account() {

}

Account.table = config2['table'];
Account.supportThirdUid = ['qquid', 'weibouid'];

Account.prototype.getById = function *(id) {

};

Account.prototype.getByEmail = function *(email) {
  email = email.toLowerCase();
  var r = yield yconn.query('SELECT * FROM ' + Account.table + ' WHERE ? LIMIT 1', {
    email: email
  });
  return (r && r[0]) ? r[0][0] : null;
};

Account.prototype.getByThirdUid = function *(third, uid) {
  if (Account.supportThirdUid.indexOf(third) < 0) {
    throw new Error('unsupported third uid');
    return null;
  }
  var qd = {};
  qd[third] = uid;
  var r = yield yconn.query('SELECT * FROM ' + Account.table + ' WHERE ? LIMIT 1', qd);
  return (r && r[0]) ? r[0][0] : null;
};

Account.checkPassword = function (input_pass, pass, salt) {
  if (input_pass && pass && salt) {
    var phash = common.md5(common.md5(input_pass) + salt);
    return (phash === pass);
  }
  return false;
};

module.exports = Account;
