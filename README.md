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
login, logout, update
```

### message (base64-encoded):

base64-encoded JSON data

```
base64('{"username":"<username>","password":"<password>"}')
```

### sign:

```
HMAC->SHA1(secret_key, '<message> <timestamp>')
```

### timestamp:

秒级时间戳

## 返回

JSON data

### login:

```
{"code",<code num>,"token":"<token>","user":<userdata>}
```

### logout:

```
{"code",<code num>}
```

### update:

```
{"code",<code num>,"token":"<token>"}
```
