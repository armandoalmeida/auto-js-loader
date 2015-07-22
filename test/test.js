'use strict';

var should  = require('should');
var path    = require('path');
var pkg     = require('../package.json');
var modName = pkg.name;
var modFile = path.resolve(pkg.main);
var processDir = __dirname;

describe(modName, function() {
    beforeEach(function() {
        // reset node variables to defaults
        delete process.env.NODE_CONFIG_LOG;
        // prevent halting the app when config load fails, to catch the error
        process.env.NODE_CONFIG_NO_HALT = true;

        // set current working directory of the process to the same dir as this script is located in
        // this allows to have tests and their data in a dedicated directory
        process.chdir(processDir);

        // delete require cache to enforce reloading the index.js
        delete require.cache[modFile];
    });

    describe('unsuccessful require', function() {
        it('should fail to load files in non-existing directory', function() {
            var config = require(modFile)('blah');
            config.should.be.empty;
        });

        it('should fail to load non-existing files for "dev" directory', function() {
            var config = require(modFile)('dev');
            should.exist(config);

            should.not.exist(config.blah);
        });

        it('should not halt the app on failure', function() {
            // set the directory to non-existing one to cause an error
            var config = require(modFile)('blah');
            config.should.be.empty;
        });
    });

    describe('successful require', function() {
        it('should load DB config for DEV directory', function() {
            var config = require(modFile)('dev');
            should.exist(config);

            config = config.db;
            should.exist(config);
            config.should.be.an.Object;
            config.should.have.a.property('dbURI', 'mongodb://localhost:27017/dev-db');
        });

        it('should print out log information', function() {
            process.env.NODE_CONFIG_LOG = true;

            var log = false;
            // backup the functions' definition
            var err = console.error;
            var info = console.info;
            var warn = console.warn;

            // mocks to catch logging attempts
            console.error = console.info = console.warn = function() {log = true;}

            require(modFile)('dev');

            // restore the functions' definition
            console.error = err;
            console.info = info;
            console.warn = warn;

            log.should.be.true;
        });

        it('should not print out log information', function() {
            var log = false;
            // backup the functions' definition
            var err = console.error;
            var info = console.info;

            // mocks to catch logging attempts
            console.error = console.info = function() {log = true;}

            require(modFile)('dev');

            // restore the functions' definition
            console.error = err;
            console.info = info;

            log.should.be.false;
        });

        
    });
});
