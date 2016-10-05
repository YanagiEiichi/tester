#!/usr/bin/env node

var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var argollector = require('argollector');
var childProcess = require('child_process');
var myStatic = require('node-static');
var glob = require('glob');
var base = new myStatic.Server('./');

if (argollector['-h'] || argollector['--help'] || argollector['-?'] || argollector.length === 0) {
  console.log('Usage: ui-tester-start [list]');
  console.log();
  console.log('[list]: one or more [case]');
  console.log();
  console.log('[case]: html file or directory');
  console.log();
  console.log('  html file: run case');
  console.log();
  console.log('  directory: run parallelly cases in this direcotry');
  console.log();
  process.exit(1);
}

var list = argollector.reduce(function(receiver, wildcard) {
  return receiver.concat(glob.sync(wildcard));
}, []).map(function(file) {
  var stat = fs.statSync(file);
  if (stat.isDirectory()) {
    return glob.sync(path.join(file, '**/*.html'));
  } else {
    return file;
  }
});

var html = [
  '<script src="/tester.js"></script>',
  '<script>',
  'Tester.run(' + JSON.stringify(list, null, 2) + ');',
  '</script>'
].join('\n');

var tester = fs.readFileSync('./tester.js');

var server = http.createServer(function(req, res) {
  switch (req.url.match(/[^?]*/)[0]) {
    case '/': 
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
      break;
    case '/tester.js': 
      res.writeHead(200, { 'Content-Type': 'application/javascript' });
      res.end(tester);
      break;
    default:
      req.on('end', function() {
        base.serve(req, res);
      }).resume();
  }
}).listen(function() {
  var port = server.address().port;
  childProcess.exec('open http://127.0.0.1:' + port);
});
