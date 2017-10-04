let http = require('http');
let fs = require('fs');
let path = require('path');
let argollector = require('argollector');
let childProcess = require('child_process');
let myStatic = require('node-static');
let glob = require('glob');
let base = new myStatic.Server('./');

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

let list = argollector.reduce(function(receiver, wildcard) {
  return receiver.concat(glob.sync(wildcard));
}, []).map(function(file) {
  let stat = fs.statSync(file);
  if (stat.isDirectory()) {
    return glob.sync(path.join(file, '**/*.html'));
  } else {
    return file;
  }
});

let html = [
  '<script src="/tester.js"></script>',
  '<script>',
  'Tester.run(' + JSON.stringify(list, null, 2) + ');',
  '</script>'
].join('\n');

let tester = fs.readFileSync(path.join(__dirname, '../tester.js'));

var server = http.createServer(function(req, res) {
  switch (req.url.match(/[^?]*/)[0]) {
    case '/':
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(html);
      break;
    case '/tester.js':
      res.writeHead(200, {'Content-Type': 'application/javascript'});
      res.end(tester);
      break;
    default:
      req.on('end', function() {
        base.serve(req, res);
      }).resume();
  }
}).listen(function() {
  let port = server.address().port;
  let command = 'open http://127.0.0.1:' + port;
  console.log(command);
  childProcess.exec(command);
});
