'use strict';

var fs   = require('fs');
var path = require('path');

// halt the app in case of failure during configs' load
var HALT = process.env.NODE_CONFIG_NO_HALT === undefined;

// print out debug messages if enabled
var LOG = process.env.NODE_CONFIG_LOG !== undefined;

/**
 * Fetch js files under the directory specified in parameter. 
 * @param {String} dir The environment to search in for config files
 * @returns {Array} List of files as an object with name and path. 
 */
function getFiles(dir) {
    if (LOG)
        console.info('Reading files under', dir);

    var configs = [];
    var dirContent = fs.readdirSync(dir);
    var stat, file, ext;

    // strips away file extensions
    dirContent.forEach(function(val, i, arr) {
        file = dir + '/' + val;
        stat = fs.statSync(file);
        // skip all items but files
        if (!stat.isFile())
            return;

        // adds JS file types only
        ext = path.extname(val);
        if (ext === '.js')
            configs.push({
                name: path.basename(val, ext),
                path: file
            });
    });

    return configs;
}

module.exports = function(dir){
    var files = {};

    if (dir === undefined || dir === null || typeof dir !== 'string')
        return files;
    else
        dir = path.resolve(dir) + '/';

    // check for non-existence of configuration directory
    if (!fs.existsSync(dir)) {
        if (LOG || HALT) // always print the error if halting the app
            console.error('Configuration directory for the app is missing. Expected location is', dir);
        if (HALT) {
            console.error('Halting the app.');
            process.exit(-1);
        } else {
            return files;
        }
    }

    // get the files
    var dirFiles = getFiles(dir);

    // add all files available into the object being returned by require('app-path') call
    dirFiles.forEach(function(val, index, arr) {
        // delete the module from cache if in there
        // this will ensure the files get reloaded every time this code is being run
        // useful for unit tests which may delete the `app-path` module from cache to get the files reloaded
        //var requireKey = require.resolve(val.path);
        //if (require.cache[requireKey])
        //    delete require.cache[requireKey];

        files[val.name] = require(val.path);
    });

    return files;
};