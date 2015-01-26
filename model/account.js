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
var generator = require('./../lib/generator');

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

var user_table = config2['table'];

function Account() {

}


module.exports = Account;
