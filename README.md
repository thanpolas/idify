# Idify

Get any unique Id format guaranteed, power by the powerfull Redis Set Data Store.

[![Build Status](https://secure.travis-ci.org/thanpolas/idify.png?branch=master)](http://travis-ci.org/thanpolas/idify)

## Install

Install the module with: `npm install idify --save`

## Documentation

```js

var idify = require('idify');

var userid = idify({
    name: 'user',
    prefix: 'app',
    idLength: 5,
});

userid.get().then(function(id) {
    console.log('A Unique 5 char id guarantee:', id);
});
```



## Release History

- **v0.0.1**, *09 Mar 2014*
    - Big Bang

## License
Copyright (c) 2014 Thanasis Polychronakis. Licensed under the MIT license.

[express]: expressjs.com
[kansas]: https://github.com/thanpolas/kansas
