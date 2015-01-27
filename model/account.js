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
  hat = require('hat'),
  mysql = require('mysql'),
  validator = require('validator');
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

function Account(user) {
  if (user) {
    this.id = user.id;
  }
}

Account.table = config2['table'];
Account.supportThirdUid = ['qquid', 'weibouid'];

Account.prototype.find = function *(id) {
  if (!id) id = this.id;
  var r = yield yconn.query('SELECT * FROM ' + Account.table + ' WHERE ? LIMIT 1', {
    id: id
  });
  return (r && r[0]) ? r[0][0] : null;
};

Account.prototype.update = function *(data) {
  var ud = {};
  var fields = {
    'username': 'string', 'password': 'string', 'email': 'string',
    'iconid': 'number', 'iconurl': 'string', 'iconcolor': 'string'
  };
  for (var k in fields) {
    if (data[k] && typeof data[k] === fields[k]) {
      ud[k] = data[k];
    }
  }
  if (ud.username) {
    ud.username = ud.trim();
  }
  if (ud.password) {
    ud.salt = hat(48); //12di
    ud.password = Account.hashPassword(ud.password, ud.salt);
  }
  if (ud.email) {
    ud.email = ud.email.toLowerCase().trim();
    if (!validator.isEmail(ud.email)) {
      //not an email
      ud.email = undefined;
      delete ud.email;
    }
  }

  var r = yield yconn.query('UPDATE ' + Account.table + ' SET ? WHERE ?',
    [ ud, { id: this.id } ]);
  return (r && r[0]) ? r[0][0] : null;
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

Account.hashPassword = function (input_pass, salt) {
  if (input_pass && salt) {
    var phash = common.md5(common.md5(input_pass) + salt);
    return phash;
  }
  return '';
};

module.exports = Account;
