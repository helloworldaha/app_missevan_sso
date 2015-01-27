require("chai");
require("should");

var co = require('co');
var Model = require('./../model'),
  Account = Model.Account,
  Session = Model.Session;

var name = "model";

describe("Account", function () {
  describe("#getByEmail", function () {
    it('should get an account', function (done) {
      co(function *() {
        var account = new Account();
        var user = yield account.getByEmail('mowangsk@gmail.com');
        done(user ? null : new Error('couldn\'t get an account'));
      });
    });
    it('shouldn\'t get an account', function (done) {
      co(function *() {
        var account = new Account();
        var user = yield account.getByEmail('no this email');
        done(user ? new Error('got an account') : null);
      });
    });
  });
  describe("#getByThirdUid", function () {
    it('should get an account', function (done) {
      co(function *() {
        var account = new Account();
        var user = yield account.getByThirdUid('qquid', 'E3227E2460D6D45B2EC272B0DA4037E2');
        done(user ? null : new Error('couldn\'t get an account'));
      });
    });
    it('shouldn\'t support', function (done) {
      co(function *() {
        var account = new Account();
        try {
          var user = yield account.getByThirdUid('unsuid', 'test');
          done(new Error('no error was thrown when it should have been'));
        } catch (err) {
          done(/^unsupport/.test(err.message) ? null : err);
        }
      });
    });
  });
  describe("#checkPassword", function () {
    it('should match', function () {
      Account.checkPassword('123456', '7490b5a39b1ddfe7c290fd0b6b986bcb', 'hAGFoJ1CSzPe').should.eql(true);
    });
    it('shouldn\'t match', function () {
      Account.checkPassword('1234567', '7490b5a39b1ddfe7c290fd0b6b986bcb', 'hAGFoJ1CSzPe').should.eql(false);
    });
  });
});
