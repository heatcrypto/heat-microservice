/*
 * The MIT License (MIT)
 * Copyright (c) 2017 Heat Ledger Ltd
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * */

require('es6-promise').polyfill(); /* usemin requires this */
var gulp = require('gulp');
var util = require('gulp-util');
var chalk = require('chalk');
var _ = require('underscore');
var heatledger;
try {
  heatledger = require('./heatledger.json');
} catch (e) {}

// There are three 'modes' in which we can run and test our microservices
//
//    * --mode main     Will start and connect heatledger on the main network
//    * --mode test     Will start and connect heatledger on the test network
//    * --mode fake     Will start heatledger on a fake one-time blockchain,
//                      in this mode you must use the heat.driver to manually
//                      generate blocks.
//                      You have access to a funded account with the secretphrase
//                      'fake' (without quotes) which has 10,000,000 fake HEAT.
//
// When no mode is provided fake mode is assumed.
var modes = {
  main: {
    "heat.replicatorEnabled": "true",
    "heat.enableAPIServer": "true"
  },
  test: {
    "heat.replicatorEnabled": "true",
    "heat.enableAPIServer": "true",
    "heat.isTestnet": "true",
    "heat.numberOfForkConfirmations": "0"    
  },
  fake: {
    "heat.replicatorEnabled": "true",
    "heat.enableAPIServer": "true",
    "heat.isTestnet": "true",
    "heat.blockchainDir": "microservice-test",     
    "heat.isTestnet": "true",
    "heat.deleteBlockchain": "true",
    "heat.deleteHeatDb": "true",
    "heat.isOffline": "true",
    "heat.isSilent": "false",
    "heat.numberOfForkConfirmations": "0",
    "heat.shareMyAddress": "false",
    "heat.disableGenerateBlocksThread": "true",
    "heat.disableGetMoreBlocksThread": "true",
    "heat.enableFakeForging": "true",
    "heat.savePeers": "false",
    "heat.disableProcessTransactionsThread": "true",
    "heat.disableRemoveUnconfirmedTransactionsThread": "true",
    "heat.disableRebroadcastTransactionsThread": "true",
    "heat.disablePeerUnBlacklistingThread": "true",
    "heat.getMorePeers": "false"    
  }  
};

var PATHS = {
  src: [
    'src/*.ts',
    'src/**/*.ts'
  ]
};

gulp.task('clean', function () {
  var del = require('del');
  return del(['dist']);
});

gulp.task('ts2js', function () {
  var typescript = require('gulp-typescript');
  var sourcemaps = require('gulp-sourcemaps');  
  var tscConfig = require('./tsconfig.json');
  var extend = require('util')._extend;
  var concat = require('gulp-concat');  

  return gulp.src(PATHS.src)
    .pipe(sourcemaps.init())  
    .pipe(typescript(extend(tscConfig.compilerOptions)))
    .pipe(concat('index.js'))     
    .pipe(sourcemaps.write('../dist'))    
    .pipe(gulp.dest('dist'));
});

gulp.task('verify', function (cb) {
  var path = require('path');
  var fs = require('fs');
  if (!heatledger) {
    util.log(chalk.red.bold("ERROR")+" you did not create a heatledger.json file");
  }
  else if (!heatledger.dir) {
    util.log(chalk.red.bold("ERROR")+" missing 'dir' property in heatledger.json, make sure it points to HEAT server installation directory");
  }
  else if (!fs.existsSync(heatledger.dir)) {
    util.log(chalk.red.bold("ERROR")+" heatledger.json 'dir' path value points to non existing file");
  }
  else {
    var isWin = /^win/.test(process.platform);
    var heatbin = isWin ? path.join(heatledger.dir, 'bin', 'heatledger.bat') : path.join(heatledger.dir, 'bin', 'heatledger');
    if (!fs.existsSync(heatbin)) {
      util.log(chalk.red.bold("ERROR")+" could not find "+heatbin+" in installation directory");
    }
    else {
      util.log(chalk.green.bold("VERIFIED")+" you are good to go!");
    }
  }
});

/**
 * To test a microservice we write a javascript test script which is passed
 * to the heatledger binary as its -run paramater.
 * Upon seeing the -run parameter the heatledger server will after loading 
 * execute this test script which in turns performs the test.
 * 
 * Usage: 
 * 
 *    `gulp test --run "script.to.execute()" --mode fake`
 * 
 * Parameters:
 * 
 *    --heatdir     Absolute path to heat installation directory.
 *                  Note: The installation directory folder layout looks like this
 *      
 *                    - heatledger            <-- This is the installation directory
 *                      - bin
 *                      - blockchain
 *                      - conf
 *                      - lib
 *                      etc...
 * 
 *    --run         The script to execute, must be surrounded in quotes ("..")
 * 
 *    --config      The path to a json document whose contents will be encoded to a single line string
 *                  and are passed to HEAT server as the --properties argument, each property in the 
 *                  json object will be added to HEAT configuration properties.
 * 
 *    --verbose     When provided will also include all console output from heat server,
 *                  otherwise only console output from your script is shown.
 * 
 *    --mode        Either; main, test or fake (default)
 */
gulp.task('test', ['build'], function (cb) {
  var argv = require('yargs').argv;
  var exec = require('child_process').exec;
  var spawn = require('child_process').spawn;
  var path = require('path');
  var conf = modes[argv.mode||'fake'];
  var properties = getProperties(argv.config, conf);

  var scriptsDir = path.join(__dirname, 'dist');
  var isWin = /^win/.test(process.platform);
  var heatdir = (heatledger&&heatledger.dir) || argv.heatdir;
  var heatbin = isWin ? heatdir + "/bin/heatledger.bat" : "bin/heatledger";
  var sourcedir = path.join(__dirname, 'src');

  if (conf['heat.deleteHeatDb']=='true') {
    var del = require('del');
    del.sync([
      path.join(heatdir, 'heat_db')
    ], {force:true});
  }

  var args = ["-path", scriptsDir, "-run", argv.run, "-sourcedir", sourcedir, "-properties", properties];

  var server = spawn(heatbin, args, { cwd: heatdir });

  function logVerbose(msg) {
    if (!msg || msg.trim().length == 0) return;
    var lines = msg.split(/(\r?\n)/g);
    for (var i=0; i<lines.length; i++) {
      if (lines[i].match(/\S/)) {
        util.log(lines[i]);
      }
    }
  }

  function logScript(msg) {
    if (!msg || msg.trim().length == 0) return;
    var lines = msg.split(/(\r?\n)/g);
    for (var i=0; i<lines.length; i++) {
      if (lines[i].match(/\S/)) {
        // matches 2017-04-30 21:37:18 [main] INFO  com.heatledger.HeatProperties - heat.replicatorEnabled = "false"
        var parts = /\S+\s+\S+\s+\[.*\]\s+\S+\s+(\S+)/.exec(lines[i]);
        if (parts) {
          var className = parts[1];
          if (className.trim() == "<script>") {
            var cleaned = lines[i].replace(/(^.*<script>\s+-)/,chalk.red("<script>"));
            util.log(cleaned);
          }
        }
        // matches 21:32:33,278 |-INFO in ch.qos.logback.classic.LoggerContext[default] - Could NOT find resource [logback-test.xml]
        else if (lines[i].match(/^.*\|-\S+\s+in\s+ch.qos.logback/)) {
          continue;
        }
        else {
          util.log(lines[i]);
        }
      }
    }
  }

  var log = argv.verbose ? logVerbose : logScript;

  server.stdout.on('data', (data) => { log(data+"") });
  server.stderr.on('data', (data) => { log(data+"") });
});

function getProperties(configPath, conf) {
  var properties = null;
  try {
    properties = require(configPath)||{};
  } catch (e) {
    console.log("Either not provided or cant load --config path "+configPath);
  }  
  var temp = {};
  _.extendOwn(temp, conf);
  _.extendOwn(temp, properties);
  properties = JSON.stringify(temp);
  return properties;
}

gulp.task('inject', ['build'], function (cb) {
  var del = require('del');
  var path = require('path');
  var distDir = path.join(__dirname, 'dist');
  var heatdir = "/home/dirk/git/heatledger";
  var scriptsDir = path.join(heatdir, 'scripts');
  del([scriptsDir+"/*"]);
  return gulp.src(['dist/*'])
    .pipe(gulp.dest(scriptsDir));  
});

gulp.task('build', ['clean','ts2js']);
gulp.task('default', ['build']);
