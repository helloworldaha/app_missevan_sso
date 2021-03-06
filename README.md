# MissEvan SSO

## 使用方法

```
POST /sso/<action>
```

## 参数

```
auth='<message> <sign> <timestamp>'
```

### action:

```
login		#登录
logout		#登出
register	#注册，获取到token和session
update		#更新用户信息
session		#根据token获取session信息
```

### message (base64-encoded):

base64-encoded JSON data

```
login: {"email":"<email>","password":"<password>","ip":"<ip>","maxAgeType":<max-age type>,"pwhash":<pwhash boolean>}
register: {"email":"<email>","username":"<username>","password":"<password>","ip":"<ip>","maxAgeType":<max-age type>}
可选: "maxAgeType", 默认: 0

session, update, login: {"token":"<token>","ip":"<ip>"}

update: {"user_id":<user_id>,"update":{<user>},"ip":"<ip>"}

base64('<JSON data>')
```
**注**：mobile 属性一定为 Number 类型，如果为 String 类型，更新会导致失败。

### sign:

```
HMAC->SHA1(secret_key, '<message> <timestamp>')  (小写hex文本)
```

### timestamp:

秒级时间戳

### maxAgeType:

```
0: 两小时
1: 一天
2: 一个月
3: 一年
```

## 返回

JSON data

### update, login, register, session:

```
{"code":<code num>,"message":"<message>","expire":<timestamp>,"token":"<token>","user":<userdata>}
```

### logout, update (update from userId):

```
{"code":<code num>,"message":"<message>"}
```

## Code

```
-2: 服务器错误
-1: 参数错误
0: 成功
1: 用户不存在或密码错误
2: 该用户名已存在
3: 该邮箱已存在
4: <保留>
5: Token过期或不存在
```

## 通知

### sign

```
HMAC->SHA256(secret_key, '<message> <timestamp>')  (小写hex文本)
```

### message

```json
{
  "type": "user",
  "event": "updated",
  "user_id": <user_id>,
  "user": <userdata>
}
```
