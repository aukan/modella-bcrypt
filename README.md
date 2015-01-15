modella-bcrypt
======

Adds hashed field using bcrypt-nodejs and a compareField method to verify it. Can be used for password encryption.

# Installation

```
npm install modella-bcrypt
```

# Usage

Encrypt field `password`.

```js
var modella = require('modella');
var encrypter = require('modella-bcrypt');
var User = modella('User');

User.use(encrypter({ fieldName: 'password' }));

User.
  attr('_id').
  attr('email').
  attr('password');

var user = new User({
  email: 'test@example.com',
  password: 'secret'
});

user.save(function () {
  // user.password === [Hashed password]
});
```

To verify the password of the user:

```js
user.compareField('password', pass, function (match) {
  // match === true if verification is correct
});

// or
user.compareFieldSync(pass); // true or false
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
