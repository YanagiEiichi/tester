var Tester = new function() {
  var heap = {};
  var head = document.documentElement.firstChild;

  var initStyle = function() {
    var style = document.createElement('style');
    style.id = 'tester';
    style.innerHTML = '\
      .tester { border-collapse: collapse; }\
      .tester td { border: 1px solid #ccc; padding: 5px; }\
      .tester thead td { background: #eee; font-weight: bold; }\
      .tester tfoot td { text-align: right; }\
    ';
    head.insertBefore(style, head.firstChild);
  };

  var createReport  = function() {
    if(!document.querySelector('#tester')) initStyle();
    var table = document.createElement('table');
    table.className = 'tester';
    var row = table.createTHead().insertRow(-1);
    row.insertCell().innerHTML = 'Time';
    row.insertCell().innerHTML = 'File';
    row.insertCell().innerHTML = 'State';
    var append = function() {
      document.body.appendChild(table);
    };
    document.readyState === 'complete' ? append() : addEventListener('load', append);
    var tbody = table.createTBody();
    return {
      insert: function(status, file) {
        var row = tbody.insertRow(-1);
        row.insertCell().innerHTML = new Date().toLocaleString();
        row.insertCell().innerHTML = file;
        row.insertCell().innerHTML = status;
      },
      end: function(message) {
        var row = table.createTFoot().insertRow(-1);
        var cell = row.insertCell();
        cell.setAttribute('colspan', 3);
        cell.innerHTML = message;
      }
    };
  };

  addEventListener('message', function(e) {
    var data;
    try { data = JSON.parse(e.data); } catch(error) { data = {}; };
    if(data.jsonrpc !== '2.0' || data.method !== 'Tester.feedback') return;
    path = data.params[0];
    result = data.params[1];
    file = path.match(/[^/]+$/)[0];
    heap[path][result ? 'resolve' : 'reject'](file);
  });
  
  var runTest = function(report, file) {
    if(file instanceof Array) return Promise.all(file.map(runTest.bind(null, report)));
    var iframe = document.createElement('iframe');
    iframe.src = file;
    head.insertBefore(iframe, head.firstChild);
    return new Promise(function(resolve, reject) {
      heap[iframe.src] = { resolve: resolve, reject: reject };
      setTimeout(reject, 5000, file);
    }).then(function() {
      report.insert('OK'.fontcolor('green'), file);
    }, function() {
      report.insert('Error'.fontcolor('red'), file);
    });
  };

  this.feedback = function(result) {
    if(parent === window) return console.log(result);
    parent.postMessage(JSON.stringify({
      'jsonrpc': '2.0',
      'method': 'Tester.feedback',
      'params': [ location.href, result ]
    }), '*');
  };

  this.run = function() {
    var report = createReport();
    var tests = Array.prototype.slice.call(arguments);
    var promise = tests.reduce(function(promise, file) {
      return promise.then(runTest.bind(null, report, file)); 
    }, runTest(report, tests.shift()));
    promise.then(function() {
      report.end('Success');
    }, function() {
      report.end('Error');
    });
    return promise;
  };
}();

