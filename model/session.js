'use strict';

/**
* model/session.js
* MissEvan SSO
*
* Author: 腾袭
*
* session model
*/

var config = require('./../config'),
  config1 = config['db'].mongo;

var util = require('util'),
  co = require('co');

var MongoClient = require('mongodb'),
  ObjectID = require('mongodb').ObjectID;

var generator = require('./../lib/generator');

var ycollection;

function createConnection(callback) {
  let authStr = '';
  if (config1['username'] && config1['password']) {
    authStr = config1['username'] + ':' + config1['password'] + '@';
  }
  MongoClient.connect('mongodb://' + authStr + config1['host'] + '/' + config1['name'], {w: 1}, function (err, db) {
    if (err) {
      console.error(err);
      return callback(err);
    }

    var _collection = db.collection(config1['collection']);
    ycollection = new generator(_collection,
      {wrapResult: ['find', 'limit', 'skip', 'sort']});

    if (callback) callback(null, ycollection);
  });
}

createConnection();

function Session() {

}


module.exports = Session;
