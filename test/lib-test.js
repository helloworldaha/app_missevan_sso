require("should");

var validator = require('validator');
var common = require('./../lib/common');

var name = "lib";

describe("common", function() {
  it("md5('a') should be '0cc175b9c0f1b6a831c399e269772661'", function() {
    common.md5('a').should.eql("0cc175b9c0f1b6a831c399e269772661");
  });
  it("is_empty_object({}) should be true", function() {
    common.is_empty_object({}).should.eql(true);
  });
  it("make_auth(data) should be have format '<message> <sign> <timestamp>'", function() {
    var data = { test: 'test' };
    var auth_message = common.make_auth(data);

    var parts = auth_message.split(' ');
    var checked = 0;
    if (validator.isBase64(parts[0])) {
      checked++;
    }
    if (validator.isHexadecimal(parts[1])) {
      checked++;
    }
    if (validator.isNumeric(parts[2])) {
      checked++;
    }
    checked.should.eql(3);
  });
  it("make_auth(data) should be equal check_auth()", function() {
    var data = { test: 'test' };
    var sdata = JSON.stringify(data);

    var auth_message = common.make_auth(data);
    var auth_data = common.check_auth(auth_message);

    var sauth_data = JSON.stringify(auth_data);

    sdata.should.eql(sauth_data);
  });
});
