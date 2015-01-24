# MissEvan SSO

## 使用方法

```
POST /sso
```

## 参数

```
auth='<message> <sign> <timestamp>'
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
