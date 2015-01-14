modella-bcrypt
======

Adds encrypted password field using bcrypt-nodejs and a verification method for that field.

# Installation

```
npm install modella-bcrypt
```

# Usage

Add encrypted field `password`.

```js
var modella = require('modella');
var encrypter = require('modella-bcrypt');
var User = modella('User');

User.use(encrypter);

User.
  attr('_id').
  attr('email').
  attr('password');


var user = new User({
  email: 'test@example.com',
  password: 'secret'
});

user.save(function () {
  // user.password === [Password hashed]
});
```

To verify the password of the user:

```js
user.verifyPassword(pass, function (match) {
  // match === true if verification is correct
});
```

# Options

## fieldName

Sets the name of the field to use, defaults to `password`.

```js
User.use(encrypter({ fieldName: 'pass' });
```

## rounds

Sets the bcrypt rounds. Rounds determine the complexity used for encryption with bcrypt-nodejs (see bcrypt-nodejs docs).

```js
User.use(encrypter({ rounds: 8 });
```
