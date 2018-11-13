const http = require('http');
const fs = require('fs');
const coolest = require('coolest');
const path = require('path');
const argollector = require('argollector');
const denodeify = require('denodeify');
const childProcess = require('child_process');
const myStatic = require('node-static');
const glob = denodeify(require('glob'));
const stat = denodeify(fs.stat.bind(fs));
const base = new myStatic.Server('./', { cache: 0 });

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

const renderEntry = coolest(function *() {
  let list = yield Promise.all(argollector.map(wildcard => glob(wildcard)));
  list = [].concat(...list);
  list = list.map(coolest(function *(file) {
    if ((yield stat(file)).isDirectory()) {
      return yield glob(path.join(file, '**/*.html'));
    } else {
      return file;
    }
  }));
  return [
    '<script src="/tester.js"></script>',
    '<script>',
    'Tester.run(' + JSON.stringify(yield Promise.all(list), null, 2) + ');',
    '</script>'
  ].join('\n');
});

const tester = fs.readFileSync(path.join(__dirname, '../tester.js'));

const server = http.createServer((req, res) => {
  switch (req.url.match(/[^?]*/)[0]) {
    case '/':
      renderEntry().then(html => {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'private, max-age=3600' });
        res.end(html);
      }, error => {
        res.writeHead(500, { 'Content-Type': 'text/plain', 'Cache-Control': 'no-cache' });
        res.end(error.stack);
      });
      break;
    case '/tester.js':
      res.writeHead(200, { 'Content-Type': 'application/javascript', 'Cache-Control': 'private, max-age=3600' });
      res.end(tester);
      break;
    default:
      req.on('end', () => {
        base.serve(req, res);
      }).resume();
  }
}).listen(() => {
  let port = server.address().port;
  let command = 'open http://127.0.0.1:' + port;
  console.log(command);
  childProcess.exec(command);
});
