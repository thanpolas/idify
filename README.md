# Idify

Get any unique Id format guaranteed, power by the powerfull Redis Set Data Store.

[![Build Status](https://secure.travis-ci.org/thanpolas/idify.png?branch=master)](http://travis-ci.org/thanpolas/idify)

## Install

Install the module with: `npm install idify --save`

## Documentation


### Initialize Idify

```js
var idify = require('idify');

// you can configure idify inline or afterwards.
var userid = idify({
    // The prefix to use for stored keys in redis.
    prefix: 'awesomeapp',

    // The name of the id (i.e. for the user table)
    name: 'user',

    // how long do you want the id to be
    idLength: 5,

    // Safety net, idify uses recursion until a unique id is secured.
    maxLoops: 100,

    // Redis configuration
    redis: {
      port: 6379,
      host: 'localhost',
      pass: null,
      redisOptions: null, // special redis options, pass as object
    },
});

// a connection to redis is required before you perform any operation
userid.connect().then(function() {
    // ready to get going
}).catch(function(err) {
    // an error occured
});
```

### Get a Unique Id

```js
userid.get().then(function(id) {
    console.log('A 5 char Unique id guaranteed:', id);
});
```



## Release History

- **v0.0.1**, *09 Mar 2014*
    - Big Bang

## License
Copyright (c) 2014 Thanasis Polychronakis. Licensed under the MIT license.

[express]: expressjs.com
[kansas]: https://github.com/thanpolas/kansas
