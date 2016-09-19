# feathers-auth-bug

## About

This project uses [Feathers](http://feathersjs.com), an open source web framework for building modern real-time applications. In particular, this demonstrates the issue I'm experiencing when using the [`feathers-authentication`](https://github.com/feathersjs/feathers-authentication) package.


## Solution

It was a matter of config.

Previously, I had:
```json
{
  "auth": {
    "idField": "id",
    "token": {
      "secret": "redacted"
    },
    "local": {
      "userEndpoint": "/api/users"
    }
  }
}
```
But what I really needed was:
```json
{
  "auth": {
    "idField": "id",
    "token": {
      "secret": "redacted"
    },
    "userEndpoint": "/api/users",
    "local": {}
  }
}
```
So when I called it via REST, it had nothing to get from, since it didn't actually get a user back (had the wrong `userEndpoint`; it was only defined in `local`). Makes much more sense now. Works with both REST and websockets now. Woot.
