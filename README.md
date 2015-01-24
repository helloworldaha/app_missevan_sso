# MissEvan SSO

## 使用方法

```
POST /sso
```

## 参数

```
auth='&lt;message&gt; &lt;sign&gt; &lt;timestamp&gt;'
```

### message (base64-encoded):

base64-encoded JSON data

```
base64('{"username":"&lt;username&gt;","password":"&lt;password&gt;"}')
```

### sign:

```
HMAC->SHA1(secret_key, '&lt;message&gt; &lt;timestamp&gt;')
```
