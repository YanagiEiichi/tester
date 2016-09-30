#!/usr/bin/env node

var http = require('http');
var fs = require('fs');
var url = require('url');
var childProcess = require('child_process');
var myStatic = require('node-static');
var base = new myStatic.Server('./');

var tests = process.argv[2] || 'tests';

var server = http.createServer(function(req, res) {
  req.addListener('end', function () {
    base.serve(req, res);
  }).resume();
}).listen(function() {
  var port = server.address().port;
  childProcess.exec('open http://127.0.0.1:' + port + '/' + tests);
});
