'use strict';

/**
* model/account.js
* MissEvan SSO
*
* Author: 腾袭 TomCao
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
  this.set(user);
}

Account.table = config2['table'];
Account.fields = {
  'email': 'string', 'qquid': 'string', 'weibouid': 'string',
  'username': 'string', 'password': 'string', 'mobile': 'number',
  'teamid': 'number', 'teamname': 'string', 'subtitle': 'string',
  'cip': 'string', 'uip': 'string',
  'confirm': 'number',
  'iconid': 'number', 'iconurl': 'string', 'iconcolor': 'string'
};
Account.supportThirdUid = ['qquid', 'weibouid'];

Account.format = function (data) {
  var ud = {};
  var fields = Account.fields;
  for (var k in fields) {
    if ((data[k] || data[k] === '') && typeof data[k] === fields[k]) {
      ud[k] = data[k];
    }
  }
  if (ud.username) {
    ud.username = ud.username.trim();
  }
  if (ud.password) {
    ud.salt = hat(48); //12di
    ud.password = Account.hashPassword(ud.password, ud.salt);
  }
  return ud;
};

Account.prototype.set = function (user) {
  if (user) {
    this.id = user.id;
  }
};

Account.prototype.find = function *(id) {
  if (!id) id = this.id;
  var r = yield yconn.query('SELECT * FROM ' + Account.table + ' WHERE ? LIMIT 1', {
    id: id
  });
  return (r && r[0]) ? r[0][0] : null;
};

Account.prototype.exists = function *(data) {
  if (common.is_empty_object(data)) {
    throw new Error('数据为空');
  }
  var r = yield yconn.query('SELECT COUNT(id) as count FROM ' + Account.table + ' WHERE ? LIMIT 1', data);
  return (r && r[0] && r[0][0]) ? r[0][0].count > 0 : false;
};

Account.prototype.save = function *(data) {
  var ud = Account.format(data);
  if (common.is_empty_object(ud)) {
    return false;
  }

  ud.ctime = Math.floor(Date.now() / 1000);
  var r = yield yconn.query('INSERT INTO ' + Account.table + ' SET ?', ud);
  return (r && r[0]) ? r[0].insertId : 0;
};

Account.prototype.update = function *(data) {
  var ud = Account.format(data);
  if (common.is_empty_object(ud)) {
    return false;
  }

  ud.utime = Math.floor(Date.now() / 1000);

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

Account.prototype.getByMobile = function *(mobile) {
  var r = yield yconn.query('SELECT * FROM ' + Account.table + ' WHERE ? LIMIT 1', {
    mobile: mobile
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
