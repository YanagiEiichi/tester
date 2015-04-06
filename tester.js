var Tester = new function() {
  var heap = {};
  var head = document.documentElement.firstChild;

  addEventListener('message', function(e) {
    var data = e.data;
    if(data.jsonrpc !== '2.0' || data.method !== 'Tester.feedback') return;
    path = data.params[0];
    result = data.params[1];
    file = path.match(/[^/]+$/)[0];
    heap[path][result ? 'resolve' : 'reject'](file);
  });
  
  var runTest = function(file) {
    if(file instanceof Array) return Promise.all(file.map(runTest));
    var iframe = document.createElement('iframe');
    iframe.src = file;
    head.insertBefore(iframe, head.firstChild);
    return new Promise(function(resolve, reject) {
      heap[iframe.src] = { resolve: resolve, reject: reject };
      setTimeout(reject, 5000, file);
    }).then(function() {
      console.log('[DONE]', file);
    }, function() {
      console.log('[FAIL]', file);
    });
  };

  this.feedback = function(result) {
    if(parent === window) return console.log(result);
    parent.postMessage({
      'jsonrpc': '2.0',
      'method': 'Tester.feedback',
      'params': [ location.href, result ]
    }, '*');
  };

  this.run = function() {
    var tests = Array.prototype.slice.call(arguments);
    return tests.reduce(function(promise, file) {
      return promise.then(runTest.bind(null, file)); 
    }, runTest(tests.shift()));
  };
}();

