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

function *createConnection() {
  let authStr = '';
  if (config1['username'] && config1['password']) {
    authStr = config1['username'] + ':' + config1['password'] + '@';
  }
  var db = yield function (callback) {
    MongoClient.connect(
      'mongodb://' + authStr + config1['host'] + '/' + config1['name'], {w: 1},
      callback);
  };

  var _collection = db.collection(config1['collection']);
  ycollection = new generator(_collection,
    {wrapResult: ['find', 'limit', 'skip', 'sort']});

  return yield new Session().ensureIndex();
}

co(createConnection).catch(function (err) {
  console.error(err.stack);
});

function Session(sess, maxAgeType) {

  this.collection = ycollection;

  if (sess) {
    this.set(sess);
    this.setTime(maxAgeType);
  }
}

Session.AccountFilter = function (user) {
  var suser = {
    user_id: user.id,
    username: user.username,
    email: user.email,
    iconid: user.iconid,
    iconurl: user.iconurl,
    iconcolor: user.iconcolor,
    teamid: user.teamid || 0,
    teamname: user.teamname || '',
    subtitle: user.subtitle || '',
  };
  return suser;
};

Session.prototype.valueOf = function () {
  return {
    _id: this._id,
    user_id: this.user_id,
    username: this.username,
    email: this.email,
    iconid: this.iconid,
    iconurl: this.iconurl,
    iconcolor: this.iconcolor,
    teamid: this.teamid,
    teamname: this.teamname,
    subtitle: this.subtitle,

    maxAgeType: this.maxAgeType,
    loginAt: this.loginAt,
    expireAt: this.expireAt
  };
};

Session.prototype.set = function (sess) {
  if (sess) {
    this._id = sess._id;
    this.user_id = sess.user_id;
    this.username = sess.username;
    this.email = sess.email;
    this.iconid = sess.iconid;
    this.iconurl = sess.iconurl;
    this.iconcolor = sess.iconcolor;
    this.teamid = sess.teamid;
    this.teamname = sess.teamname;
    this.subtitle = sess.subtitle;
  } else {
    this._id = this.user_id = this.username = this.email
      = this.teamid = this.teamname = this.subtitle
      = this.iconid = this.iconurl = this.iconcolor = undefined;
  }
};

Session.prototype.find = function *(_id) {
  if (!_id) _id = this._id;
  var r = yield this.collection.findOne({_id: new ObjectID(_id)});
  this.set(r);
  return r;
};

Session.prototype.getUserInfo = function () {
  return {
    user_id: this.user_id,
    username: this.username,
    email: this.email,
    iconid: this.iconid,
    iconurl: this.iconurl,
    iconcolor: this.iconcolor,
    teamid: this.teamid,
    teamname: this.teamname,
    subtitle: this.subtitle,
  };
};

Session.prototype.setTime = function (maxAgeType) {
  var d = new Date();
  this.loginAt = new Date(d);

/*
  0: 两小时
  1: 一天
  2: 一个月
  3: 一年
*/
  switch (maxAgeType) {
    case 1:
      this.maxAgeType = 1;
      d.setDate(d.getDate() + 1);
      break;
    case 2:
      this.maxAgeType = 2;
      d.setMonth(d.getMonth() + 1);
      break;
    case 3:
      this.maxAgeType = 3;
      d.setFullYear(d.getFullYear() + 1);
      break;
    case 0:
    default:
      this.maxAgeType = 0;
      d.setHours(d.getHours() + 2);
      break;
  }

  this.expireAt = d;
};

Session.prototype.ensureIndex = function *() {
  return yield this.collection.ensureIndex({
    expireAt: 1
  }, { expireAfterSeconds: 0 });
  //, background: true, w: 1
};

Session.prototype.save = function *() {
  var data = this.valueOf();
  delete data._id;
  var r = yield this.collection.save(data);
  this.set(r);
  return r ? r : null;
};

Session.prototype.update = function *(data) {
  if (!data) {
    data = this.valueOf();
    delete data._id;
  }
  var r = yield this.collection.update(
    { _id: new ObjectID(this._id) }, { $set: data }, { w: 1 });
  return r[0];
};

Session.prototype.updateByUserId = function *(user_id, data) {
  if (!data) {
    data = this.valueOf();
    delete data._id;
    delete data.user_id;
  }
  var r = yield this.collection.update(
    { user_id: this.user_id }, { $set: data }, { w: 1, multi: true });
  return r[0];
};

Session.prototype.remove = function *(_id) {
  if (!_id) _id = this._id;
  var r = yield this.collection.remove({_id: new ObjectID(_id)});
  return r[0];
};

module.exports = Session;
