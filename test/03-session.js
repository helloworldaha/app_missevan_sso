require('should')

var co = require('co')
var Model = require('./../model')
var Account = Model.Account
var Session = Model.Session

describe("Session", function () {
  var account = new Account()
  var user
  var user_id
  var sess_id

  describe("#save", function () {
    it('should save a session', function (done) {
      co(function *() {
        user = yield account.getByEmail('mowangsk@gmail.com')
        if (!user) {
          throw new Error('couldn\'t get an account')
        }
        var suser = Session.AccountFilter(user)
        // maxAgeType = 0: 2 hours
        var session = new Session(suser, 0)
        var sess = yield session.save()
        if (!sess) {
          throw new Error('failed to save session')
        }
        sess.should.have.property('_id')
        sess.should.have.property('user_id')
        sess.should.have.property('expireAt')
        user_id = sess.user_id
        sess_id = sess._id
      }).then(done).catch(done)
    })
  })

  describe("#find", function () {
    it('should find a session', function (done) {
      co(function *() {
        var session = new Session()
        var sess = yield session.find(sess_id)
        if (!sess) {
          throw new Error('couldn\'t find a session')
        }
        sess.should.have.property('_id')
        sess.should.have.property('user_id')
        sess.should.have.property('expireAt')
      }).then(done).catch(done)
    })
  })

  describe("#update", function () {
    it('should update successfully', function (done) {
      co(function *() {
        var session = new Session()
        var sess = yield session.find(sess_id)
        if (!sess) {
          throw new Error('couldn\'t find a session')
        }
        var d = new Date()
        var r = yield session.update({ loginAt: d })
        r.should.eql(1)
      }).then(done).catch(done)
    })
  })

  describe("#updateByUserId", function () {
    it('should updateByUserId successfully', function (done) {
      co(function *() {
        var session = new Session()
        var d = new Date()
        var r = yield session.updateByUserId(user_id, { loginAt: d })
        r.should.eql(1)
      }).then(done).catch(done)
    })
  })

  describe("#remove", function () {
    it('should remove successfully', function (done) {
      co(function *() {
        var session = new Session()
        var sess = yield session.find(sess_id)
        if (!sess) {
          throw new Error('couldn\'t find a session')
        }
        var r = yield session.remove()
        r.should.eql(1)
      }).then(done).catch(done)
    })
  })
})
