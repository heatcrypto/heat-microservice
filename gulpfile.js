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

var PATHS = {
  src: [
    'src/*.ts',
    'src/**/*.ts'
  ],
  heatdir: "../heatledger/build/install/heatledger"
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

/**
 * To test a microservice we write a javascript test script which is passed
 * to the heatledger binary as its -run paramater.
 * Upon seeing the -run parameter the heatledger server will after loading 
 * execute this test script which in turns performs the test.
 * 
 * Usage: 
 * 
 *    `gulp -run "script.to.execute()" --heatdir /foo/bar --verbose`
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
 *    --verbose     When provided will also include all console output from heat server,
 *                  otherwise only console output from your script is shown.
 */
gulp.task('test', ['build'], function (cb) {
  var argv = require('yargs').argv;
  var exec = require('child_process').exec;
  var spawn = require('child_process').spawn;
  var path = require('path');
  
  var scriptsDir = path.join(__dirname, 'dist');
  var isWin = /^win/.test(process.platform);
  var heatbin = isWin ? "bin\heatledger.bat" : "bin/heatledger";
  var heatdir = argv.heatdir || PATHS.heatdir;
  var sourcedir = path.join(__dirname, 'src');
  var server = spawn(heatbin, ["-path", scriptsDir, "-run", argv.run, "-sourcedir", sourcedir], { cwd: heatdir });

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

gulp.task('build', ['clean','ts2js']);
gulp.task('default', ['build']);
