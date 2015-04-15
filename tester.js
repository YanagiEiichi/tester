var Tester = new function() {
  var heap = {};
  var head = document.documentElement.firstChild;

  var initStyle = function() {
    var style = document.createElement('style');
    style.id = 'tester';
    head.insertBefore(style, head.firstChild);
    var css = '\
      .tester { border-collapse: collapse; }\
      .tester td { border: 1px solid #ccc; padding: 5px; }\
      .tester a { color: #00f; }\
      .tester tr:first-child td { background: #eee; font-weight: bold; }\
    ';
    if(style.styleSheet && 'cssText' in style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.innerHTML = css;
    }
  };

  var createReport  = function() {
    if(!document.querySelector('#tester')) initStyle();
    var table = document.createElement('table');
    table.className = 'tester';
    var row = table.insertRow(-1);
    row.insertCell().innerHTML = 'Time';
    row.insertCell().innerHTML = 'File';
    row.insertCell().innerHTML = 'State';
    var append = function() {
      document.body.appendChild(table);
    };
    document.readyState === 'complete' ? append() : on(window, 'load', append);
    return {
      insert: function(status, file) {
        var row = table.insertRow(-1);
        var tr;
        row.insertCell().innerHTML = new Date().toLocaleString();
        var tr = row.insertCell();
        var link = document.createElement('a');
        link.target = '_blank';
        link.href = file;
        link.innerHTML = file;
        tr.appendChild(link);
        row.insertCell().innerHTML = status;
      },
      end: function(message) {
        var row = table.insertRow(-1);
        var cell = row.insertCell();
        cell.setAttribute('colspan', 3);
        cell.innerHTML = message;
      }
    };
  };

  var on = function(element, type, handler) {
    var wrapper = function(e) {
      e = e || event;
      e.target = e.target || e.srcElement;
      handler.call(e.target, e);
    };
    if(element.addEventListener) {
      element.addEventListener(type, wrapper, true);
    } else if(element.attachEvent) {
      element.attachEvent('on' + type, wrapper);
    }
  };

  on(window, 'message', function(e) {
    var data;
    try { data = JSON.parse(e.data); } catch(error) { data = {}; };
    if(data.jsonrpc !== '2.0' || data.method !== 'Tester.feedback') return;
    path = data.params[0];
    result = data.params[1];
    file = path.match(/[^/]+$/)[0];
    if(heap[path]) heap[path][result ? 'resolve' : 'reject'](file);
  });

  var SimplePromise = function(resolver) {
    var status = -1;
    var result;
    var queue = [];
    queue.trigger = function() {
      if(status === -1) return;
      for(var i = 0; i < queue.length; i++) {
        var handler = queue[i][status];
        var $result = typeof handler === 'function' ? handler(result) : result;
        queue[i].callback($result);
      }
      queue.splice(0);
    };
    resolver(function(value) {
      if(status !== -1) return;
      status = 0;
      result = value;
      queue.trigger();
    }, function(value) {
      if(status !== -1) return;
      status = 1;
      result = value;
      queue.trigger();
    });
    this.then = function(done, fail) {
      var $resolve, $reject;
      var chain = new SimplePromise(function(resolve, reject) {
        $resolve = resolve, $reject = reject;
        if(result);
      });
      arguments.callback = function($result) {
        if($result && typeof $result.then === 'function') {
          $result.then($resolve, $reject);
        } else {
          $resolve($result);
        };
      };
      queue.push(arguments);
      queue.trigger();
      return chain;
    };
  };
  SimplePromise.all = function(array) {
    return new SimplePromise(function(resolve, reject) {
      var count = array.length;
      var result = [];
      if(!count) return resolve(result);
      for(var i = 0; i < array.length; i++) void function(i) {
        array[i].then(function(data) {
          result[i] = data;
          if(!--count) resolve(result);
        }, reject);
      }(i);
    });
  };

  var map = function(array, callback) {
    var result = [];
    for(var i = 0; i < array.length; i++) {
      result[i] = callback(array[i], i);
    }
    return result;
  };

  var reduce = function(array, callback, init) {
    var result = init;
    for(var i = 0; i < array.length; i++) {
      result = callback(result, array[i], i);
    }
    return result;
  };

  var runTest = function(report, file) {
    if(file instanceof Array) {
      return SimplePromise.all(map(file, function(file) {
        return runTest(report, file);
      }));
    }
    var iframe = document.createElement('iframe');
    iframe.src = file;
    var promise = new SimplePromise(function(resolve, reject) {
      heap[iframe.src] = { resolve: resolve, reject: reject };
      setTimeout(reject, 5000, file);
    }).then(function() {
      report.insert('OK'.fontcolor('green'), file);
    }, function() {
      report.insert('Error'.fontcolor('red'), file);
    });
    var insert = function() {
      iframe.style.position = 'absolute';
      iframe.style.left = '-9999px';
      document.body.appendChild(iframe, document.body.firstChild);
    };
    document.body ? insert() : on(window, 'load', insert);
    return promise;
  };

  this.feedback = function(result) {
    // '===' will be error on IE8
    if(parent == window) return console.log(result);
    parent.postMessage(JSON.stringify({
      'jsonrpc': '2.0',
      'method': 'Tester.feedback',
      'params': [ location.href, result ]
    }), '*');
  };

  this.run = function() {
    var report = createReport();
    var tests = Array.prototype.slice.call(arguments);
    var promise = reduce(tests, function(promise, file) {
      return promise.then(function() {
        return runTest(report, file);
      });
    }, runTest(report, tests.shift()));
    promise.then(function() {
      report.end('Success');
    }, function() {
      report.end('Error');
    });
    return promise;
  };
}();

