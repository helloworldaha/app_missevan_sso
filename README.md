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
token, login, logout, register, update
```

### message (base64-encoded):

base64-encoded JSON data

```
login: {"username":"<username>","password":"<password>","ip":"<ip>","maxAgeType":<max-age type>}
可选: "maxAgeType", 默认: 0

token, update, login: {"token":"<token>","ip":"<ip>"}

base64('<JSON data>')
```

### sign:

```
HMAC->SHA1(secret_key, '<message> <timestamp>')
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

### token, login:

```
{"code",<code num>,"message":"<message>","expire":<timestamp>,"token":"<token>","user":<userdata>}
```

### logout:

```
{"code",<code num>,"message":"<message>"}
```

### update:

```
{"code",<code num>,"message":"<message>","token":"<token>"}
```

## Code

```
-2: 服务器错误
-1: 参数错误
0: 成功
1: 用户不存在或密码错误
2: <保留>
3: Token过期或不存在
```