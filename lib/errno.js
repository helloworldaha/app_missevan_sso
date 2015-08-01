
exports.errmsg = function (code) {
  switch (code) {
    case -2:
      return '服务器错误';
    case -1:
      return '参数错误';
    case 0:
      return '成功';
    case 1:
      return '用户不存在或密码错误';
    case 2:
      return '该用户名已存在';
    case 3:
      return '该邮箱或手机号已存在';
    case 5:
      return 'Token过期或不存在';
  }
  return '未知错误';
};
