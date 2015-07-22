# auto-js-loader

Ps. This module is based on "app-config" - https://www.npmjs.com/package/app-config

Loader utility for `Node.js` to load different set of files in a folder based on working directory.

Use `require('auto-js-loader')('DIRECTORY')` when "DIRECTORY" is the directory of the files you want to load.

NOTE: The file is loaded only one time. If you want to load the file again, you will need to reload the application. 

# Quick intro to usage

Create the file 

```
/app_root/commons/connection.js
```

Give the file some content

```js
// Driver for MongoDB
var mongoose = require('mongoose');

// Connection properties
mongoose.connect('mongodb://localhost/mydb');

// MongoDB connection
var db = mongoose.connection;
db.on('error', console.log('Connection error...'));
db.once('open', function(callback) {
    console.log("MongoDB connected.");
});

module.exports = mongoose;
```

Load the file in your app

```js
var commons = require('auto-js-loader')('commons');
var mongoose = commons.connection;

console.log(mongoose.connection.readyState);
```

Run your app

```bash
node app.js
```

# Installation

`npm install auto-js-loader`

# Dependencies

The tool does not depend on any other code. For developers of this tool, `Mocha` and `Should` are the only dependencies for running unit tests.

# Development

In order to develop this plugin, these steps are required:

* Clone the git repo by running `git clone URL`
* Go to the newly created directory in Terminal
* Run `npm install` to download dependencies
* Run unit tests by `npm test`