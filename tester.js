var Tester = new function() {

  var console = {
    log: function(message) {
      if(window.console && window.console.log) window.console.log(message);
    },
    error: function(message) {
      if(window.console && window.console.error) {
        window.console.error(message);
      } else {
        console.log('[ERROR] ' + message);
      }
    }
  }

  var heap = {};
  var head = document.documentElement.firstChild;

  var initStyle = function() {
    var style = document.createElement('style');
    style.id = 'tester';
    head.insertBefore(style, head.firstChild);
    var css = '\
      .tester { border-collapse: collapse; font-size: 14px; font-family: monospace; }\
      .tester td { border: 1px solid #ccc; padding: 5px; }\
      .tester a { color: #00f; }\
      .tester tr:first-child td { background: #eee; font-weight: bold; }\
      .tester td:first-child { position: relative; }\
      .tester-panel { display: none; font-size: 12px; }\
      .tester-haslog .tester-panel { display: table-cell; }\
      .tester-haslog td:first-child a {\
        font-size: 12px;\
        text-decoration: none;\
        line-height: 14px;\
        background: #ccc;\
        color: #fff;\
        font-style: normal;\
        padding: 0px 3px;\
        margin-left: 5px;\
        border-radius: 4px;\
      }\
    ';
    if(style.styleSheet && 'cssText' in style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.innerHTML = css;
    }
  };

  var createReport = function(tests) {
    if(!document.querySelector('#tester')) initStyle();
    var table = document.createElement('table');
    table.className = 'tester';
    var row = table.insertRow(-1);
    var state = row.insertCell();
    state.width = 80;
    state.innerHTML = 'State';
    row.insertCell().innerHTML = 'File';
    var time = row.insertCell();
    time.innerHTML = 'Time';
    time.width = 80;
    var append = function() {
      document.body.appendChild(table);
    };
    document.readyState === 'complete' ? append() : on(window, 'load', append);
    var testMap = {};
    var addTest = function(file) {
      var row = table.insertRow(-1);
      var link = document.createElement('a');
      link.href = file;
      link.target = '_blank';
      link.innerHTML = file;
      var firstTd = row.insertCell(-1);
      var status = document.createElement('span');
      firstTd.appendChild(status);
      row.insertCell().appendChild(link);
      var time = row.insertCell(-1);
      time.align = 'right';
      status.innerHTML = 'Pending'.fontcolor('gray');
      var panel = table.insertRow(-1).insertCell(-1);
      panel.colSpan = 4;
      panel.className = 'tester-panel';
      return { firstTd: firstTd, status: status, time: time, panel: panel, row: row };
    }
    var walker = function(args) {
      for(var i = 0; i < args.length; i++) {
        if(args[i] instanceof Array) {
          walker(args[i]);
        } else {
          testMap[args[i]] = addTest(args[i]);
        }
      }
    };
    walker(tests);
    return {
      log: function(file, message) {
        var item = testMap[file];
        var status = item.status;
        var firstTd = item.firstTd;
        var num = firstTd.lastChild;
        if(num.tagName !== 'A') {
          item.row.className = 'tester-haslog';
          num = document.createElement('a');
          num.innerHTML = '0';
          num.href = 'JavaScript:';
          num.onclick = function() {
            if(item.panel.style.display === 'block') {
              item.panel.style.display = '';
            } else {
              item.panel.style.display = 'block';
            }
          }
          firstTd.appendChild(num);
        }
        num.innerHTML++;
        item.panel.insertAdjacentHTML('beforeend', message + '<br/>');
      },
      setPromise: function(file, promise) {
        var item = testMap[file];
        var startTime = new Date().getTime();
        item.status.innerHTML = 'Running'.fontcolor('brown');
        var itv = setInterval(function() {
          item.time.innerHTML = new Date().getTime() - startTime + ' ms';
        }, 16);
        promise.then(function() {
          clearInterval(itv);
          item.status.innerHTML = 'OK'.fontcolor('green');
          item.time.innerHTML = new Date().getTime() - startTime + ' ms';
        }, function() {
          clearInterval(itv);
          item.status.innerHTML = 'Error'.fontcolor('red');
          item.time.innerHTML = 'N/A';
        });
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
    if(data.jsonrpc !== '2.0') return;
    switch(data.method) {
      case 'Tester.feedback':
        path = data.params[0];
        result = data.params[1];
        file = path.match(/[^/]+$/)[0];
        if(heap[path]) heap[path][result ? 'resolve' : 'reject'](file);
        break;
      case 'Tester.log':
        path = data.params[0];
        message = data.params[1];
        file = path.match(/[^/]+$/)[0];
        if(heap[path]) heap[path].log(message);
        break;
    }
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
    var log = function(message) {
      report.log(file, message);
    };
    var promise = new SimplePromise(function(resolve, reject) {
      heap[iframe.src] = { resolve: resolve, reject: reject, log: log };
      setTimeout(reject, 5000, file);
    });
    report.setPromise(file, promise);
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
    if(parent == window) return console.log('[feedback] ' + result);
    parent.postMessage(JSON.stringify({
      'jsonrpc': '2.0',
      'method': 'Tester.feedback',
      'params': [ location.href, result ]
    }), '*');
  };

  this.assert = function(condition, message) {
    if(condition) return;
    this.feedback(false);
    var errorMessage = 'Assertor Rejected: ' + message;
    console.error(errorMessage);
  };

  this.log = function(message) {
    // '===' will be error on IE8
    if(parent == window) return console.log(result);
    parent.postMessage(JSON.stringify({
      'jsonrpc': '2.0',
      'method': 'Tester.log',
      'params': [ location.href, message ]
    }), '*');
  };

  this.run = function() {
    var tests = Array.prototype.slice.call(arguments);
    var report = createReport(tests);
    var promise = reduce(tests, function(promise, file) {
      return promise.then(function() {
        return runTest(report, file);
      }, function() {
        throw file;
      });
    }, runTest(report, tests.shift()));
    return promise;
  };

}();

