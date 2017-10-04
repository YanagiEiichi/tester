!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.ES6Promise=e()}(this,function(){"use strict";function t(t){return"function"==typeof t||"object"==typeof t&&null!==t}function e(t){return"function"==typeof t}function n(t){I=t}function r(t){J=t}function o(){return function(){return process.nextTick(a)}}function i(){return function(){H(a)}}function s(){var t=0,e=new V(a),n=document.createTextNode("");return e.observe(n,{characterData:!0}),function(){n.data=t=++t%2}}function u(){var t=new MessageChannel;return t.port1.onmessage=a,function(){return t.port2.postMessage(0)}}function c(){var t=setTimeout;return function(){return t(a,1)}}function a(){for(var t=0;t<G;t+=2){var e=$[t],n=$[t+1];e(n),$[t]=void 0,$[t+1]=void 0}G=0}function f(){try{var t=require,e=t("vertx");return H=e.runOnLoop||e.runOnContext,i()}catch(n){return c()}}function l(t,e){var n=arguments,r=this,o=new this.constructor(p);void 0===o[et]&&k(o);var i=r._state;return i?!function(){var t=n[i-1];J(function(){return x(i,o,t,r._result)})}():E(r,o,t,e),o}function h(t){var e=this;if(t&&"object"==typeof t&&t.constructor===e)return t;var n=new e(p);return g(n,t),n}function p(){}function v(){return new TypeError("You cannot resolve a promise with itself")}function d(){return new TypeError("A promises callback cannot return that same promise.")}function _(t){try{return t.then}catch(e){return it.error=e,it}}function y(t,e,n,r){try{t.call(e,n,r)}catch(o){return o}}function m(t,e,n){J(function(t){var r=!1,o=y(n,e,function(n){r||(r=!0,e!==n?g(t,n):S(t,n))},function(e){r||(r=!0,j(t,e))},"Settle: "+(t._label||" unknown promise"));!r&&o&&(r=!0,j(t,o))},t)}function b(t,e){e._state===rt?S(t,e._result):e._state===ot?j(t,e._result):E(e,void 0,function(e){return g(t,e)},function(e){return j(t,e)})}function w(t,n,r){n.constructor===t.constructor&&r===l&&n.constructor.resolve===h?b(t,n):r===it?j(t,it.error):void 0===r?S(t,n):e(r)?m(t,n,r):S(t,n)}function g(e,n){e===n?j(e,v()):t(n)?w(e,n,_(n)):S(e,n)}function A(t){t._onerror&&t._onerror(t._result),P(t)}function S(t,e){t._state===nt&&(t._result=e,t._state=rt,0!==t._subscribers.length&&J(P,t))}function j(t,e){t._state===nt&&(t._state=ot,t._result=e,J(A,t))}function E(t,e,n,r){var o=t._subscribers,i=o.length;t._onerror=null,o[i]=e,o[i+rt]=n,o[i+ot]=r,0===i&&t._state&&J(P,t)}function P(t){var e=t._subscribers,n=t._state;if(0!==e.length){for(var r=void 0,o=void 0,i=t._result,s=0;s<e.length;s+=3)r=e[s],o=e[s+n],r?x(n,r,o,i):o(i);t._subscribers.length=0}}function T(){this.error=null}function M(t,e){try{return t(e)}catch(n){return st.error=n,st}}function x(t,n,r,o){var i=e(r),s=void 0,u=void 0,c=void 0,a=void 0;if(i){if(s=M(r,o),s===st?(a=!0,u=s.error,s=null):c=!0,n===s)return void j(n,d())}else s=o,c=!0;n._state!==nt||(i&&c?g(n,s):a?j(n,u):t===rt?S(n,s):t===ot&&j(n,s))}function C(t,e){try{e(function(e){g(t,e)},function(e){j(t,e)})}catch(n){j(t,n)}}function O(){return ut++}function k(t){t[et]=ut++,t._state=void 0,t._result=void 0,t._subscribers=[]}function Y(t,e){this._instanceConstructor=t,this.promise=new t(p),this.promise[et]||k(this.promise),B(e)?(this._input=e,this.length=e.length,this._remaining=e.length,this._result=new Array(this.length),0===this.length?S(this.promise,this._result):(this.length=this.length||0,this._enumerate(),0===this._remaining&&S(this.promise,this._result))):j(this.promise,q())}function q(){return new Error("Array Methods must be provided an Array")}function F(t){return new Y(this,t).promise}function D(t){var e=this;return new e(B(t)?function(n,r){for(var o=t.length,i=0;i<o;i++)e.resolve(t[i]).then(n,r)}:function(t,e){return e(new TypeError("You must pass an array to race."))})}function K(t){var e=this,n=new e(p);return j(n,t),n}function L(){throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")}function N(){throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")}function U(t){this[et]=O(),this._result=this._state=void 0,this._subscribers=[],p!==t&&("function"!=typeof t&&L(),this instanceof U?C(this,t):N())}function W(){var t=void 0;if("undefined"!=typeof global)t=global;else if("undefined"!=typeof self)t=self;else try{t=Function("return this")()}catch(e){throw new Error("polyfill failed because global object is unavailable in this environment")}var n=t.Promise;if(n){var r=null;try{r=Object.prototype.toString.call(n.resolve())}catch(e){}if("[object Promise]"===r&&!n.cast)return}t.Promise=U}var z=void 0;z=Array.isArray?Array.isArray:function(t){return"[object Array]"===Object.prototype.toString.call(t)};var B=z,G=0,H=void 0,I=void 0,J=function(t,e){$[G]=t,$[G+1]=e,G+=2,2===G&&(I?I(a):tt())},Q="undefined"!=typeof window?window:void 0,R=Q||{},V=R.MutationObserver||R.WebKitMutationObserver,X="undefined"==typeof self&&"undefined"!=typeof process&&"[object process]"==={}.toString.call(process),Z="undefined"!=typeof Uint8ClampedArray&&"undefined"!=typeof importScripts&&"undefined"!=typeof MessageChannel,$=new Array(1e3),tt=void 0;tt=X?o():V?s():Z?u():void 0===Q&&"function"==typeof require?f():c();var et=Math.random().toString(36).substring(16),nt=void 0,rt=1,ot=2,it=new T,st=new T,ut=0;return Y.prototype._enumerate=function(){for(var t=this.length,e=this._input,n=0;this._state===nt&&n<t;n++)this._eachEntry(e[n],n)},Y.prototype._eachEntry=function(t,e){var n=this._instanceConstructor,r=n.resolve;if(r===h){var o=_(t);if(o===l&&t._state!==nt)this._settledAt(t._state,e,t._result);else if("function"!=typeof o)this._remaining--,this._result[e]=t;else if(n===U){var i=new n(p);w(i,t,o),this._willSettleAt(i,e)}else this._willSettleAt(new n(function(e){return e(t)}),e)}else this._willSettleAt(r(t),e)},Y.prototype._settledAt=function(t,e,n){var r=this.promise;r._state===nt&&(this._remaining--,t===ot?j(r,n):this._result[e]=n),0===this._remaining&&S(r,this._result)},Y.prototype._willSettleAt=function(t,e){var n=this;E(t,void 0,function(t){return n._settledAt(rt,e,t)},function(t){return n._settledAt(ot,e,t)})},U.all=F,U.race=D,U.resolve=h,U.reject=K,U._setScheduler=n,U._setAsap=r,U._asap=J,U.prototype={constructor:U,then:l,"catch":function(t){return this.then(null,t)}},U.polyfill=W,U.Promise=U,U}),ES6Promise.polyfill();var Tester = new function() {
  var console = {
    log: function(message) {
      if (window.console && window.console.log) window.console.log(message);
    },
    error: function(message) {
      if (window.console && window.console.error) {
        window.console.error(message);
      } else {
        console.log('[ERROR] ' + message);
      }
    }
  };

  var heap = {};

  var initStyle = function() {
    var style = document.createElement('style');
    style.id = 'tester';
    var head = document.documentElement.firstChild;
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
    if (style.styleSheet && 'cssText' in style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.innerHTML = css;
    }
  };

  var createReport = function(tests) {
    if (!document.querySelector('#tester')) initStyle();
    var table = document.createElement('table');
    table.className = 'tester';
    var row = table.insertRow(-1);
    var state = row.insertCell(-1);
    state.width = 120;
    state.innerHTML = 'State';
    row.insertCell(-1).innerHTML = 'File';
    var time = row.insertCell(-1);
    time.innerHTML = 'Time';
    time.width = 80;
    var append = function() {
      document.body.appendChild(table);
    };
    document.readyState === 'compvare' ? append() : on(window, 'load', append);
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
      row.insertCell(-1).appendChild(link);
      var time = row.insertCell(-1);
      time.align = 'right';
      time.innerHTML = '-';
      status.innerHTML = 'Pending'.fontcolor('gray');
      var panel = table.insertRow(-1).insertCell(-1);
      panel.colSpan = 3;
      panel.className = 'tester-panel';
      return {firstTd: firstTd, status: status, time: time, panel: panel, row: row};
    };
    var walker = function(args) {
      for (var i = 0; i < args.length; i++) {
        if (args[i] instanceof Array) {
          walker(args[i]);
        } else {
          testMap[args[i]] = addTest(args[i]);
        }
      }
    };
    walker(tests);
    return {
      log: function(file, message) {
        var name = 'tester-log';
        var item = testMap[file];
        var status = item.status;
        void status;
        var firstTd = item.firstTd;
        var num = firstTd.querySelector('.' + name);
        if (!num) {
          item.row.className = 'tester-haslog';
          num = document.createElement('a');
          num.className = name;
          num.innerHTML = '0';
          num.style.background = '#ccc';
          num.href = 'JavaScript:';
          num.onclick = function() {
            item.panel.style.display = !item.panel.style.display ? 'table-cell' : '';
          };
          firstTd.appendChild(num);
        }
        num.innerHTML++;
        item.panel.insertAdjacentHTML('beforeend', message + '<br/>');
      },
      error: function(file, message) {
        var name = 'tester-error';
        var item = testMap[file];
        var status = item.status;
        void status;
        var firstTd = item.firstTd;
        var num = firstTd.querySelector('.' + name);
        if (!num) {
          item.row.className = 'tester-haslog';
          num = document.createElement('a');
          num.className = name;
          num.innerHTML = '0';
          num.style.background = '#e99';
          num.href = 'JavaScript:';
          num.onclick = function() {
            item.panel.style.display = !item.panel.style.display ? 'table-cell' : '';
          };
          firstTd.appendChild(num);
        }
        num.innerHTML++;
        item.panel.insertAdjacentHTML('beforeend', message.fontcolor('#e00') + '<br/>');
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
    if (element.addEventListener) {
      element.addEventListener(type, wrapper, true);
    } else if (element.attachEvent) {
      element.attachEvent('on' + type, wrapper);
    }
  };

  on(window, 'message', function(e) {
    var data, message, path, file, result;
    try {
      data = JSON.parse(e.data);
    } catch (error) {
      data = {};
    };
    if (data.jsonrpc !== '2.0') return;
    switch (data.method) {
      case 'Tester.feedback':
        path = data.params[0];
        result = data.params[1];
        file = path.match(/[^/]+$/)[0];
        if (heap[path]) heap[path][result ? 'resolve' : 'reject'](file);
        break;
      case 'Tester.log':
        path = data.params[0];
        message = data.params[1];
        file = path.match(/[^/]+$/)[0];
        if (heap[path]) heap[path].log(message);
        break;
      case 'Tester.error':
        path = data.params[0];
        message = data.params[1];
        file = path.match(/[^/]+$/)[0];
        if (heap[path]) heap[path].error(message);
        break;
    }
  });

  var map = function(array, callback) {
    var result = [];
    for (var i = 0; i < array.length; i++) {
      result[i] = callback(array[i], i);
    }
    return result;
  };

  var reduce = function(array, callback, init) {
    var result = init;
    for (var i = 0; i < array.length; i++) {
      result = callback(result, array[i], i);
    }
    return result;
  };

  var runTest = function(report, file) {
    if (file instanceof Array) {
      return Promise.all(map(file, function(file) {
        return runTest(report, file);
      }));
    }
    var iframe = document.createElement('iframe');
    var log = function(message) {
      report.log(file, message);
    };
    var error = function(message) {
      report.error(file, message);
    };
    iframe.src = file;
    var promise = new Promise(function(resolve, reject) {
      heap[iframe.src] = {resolve: resolve, reject: reject, log: log, error: error};
    });
    iframe.addEventListener('load', function() {
      setTimeout(heap[iframe.src].reject, 5000, file);
      report.setPromise(file, promise);
    });
    var insert = function() {
      iframe.style.position = 'absolute';
      iframe.style.left = '-9999px';
      document.body.appendChild(iframe, document.body.firstChild);
    };
    document.body ? insert() : on(window, 'load', insert);
    return promise;
  };

  this.href = location.href;

  this.feedback = function(result) {
    var that = this;
    if (typeof result.then === 'function') {
      result.then(function() {
        that.feedback(true);
      }, function() {
        that.feedback(false);
      });
      return;
    }
    // '===' will be error on IE8
    if (parent == window) return console.log('[feedback] ' + result); // eslint-disable-line eqeqeq
    parent.postMessage(JSON.stringify({
      'jsonrpc': '2.0',
      'method': 'Tester.feedback',
      'params': [this.href, result]
    }), '*');
  };

  this.log = function(message) {
    // '===' will be error on IE8
    if (parent == window) return console.log(message); // eslint-disable-line eqeqeq
    parent.postMessage(JSON.stringify({
      'jsonrpc': '2.0',
      'method': 'Tester.log',
      'params': [this.href, message]
    }), '*');
  };

  this.error = function(message) {
    // '===' will be error on IE8
    if (parent == window) return console.error(message); // eslint-disable-line eqeqeq
    parent.postMessage(JSON.stringify({
      'jsonrpc': '2.0',
      'method': 'Tester.error',
      'params': [this.href, message]
    }), '*');
  };

  this.assert = function(condition, message) {
    if (condition) return;
    this.feedback(false);
    var errorMessage = 'Assertor Rejected: ' + message;
    console.error(errorMessage);
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

Tester.Expection = function() {
  var that = this;
  [].push.apply(this, arguments);
  this.promise = new Promise(function(resolve, reject) {
    that.answer = function(result) {
      var top = this[0];
      if (JSON.stringify(result) === JSON.stringify(top)) {
        this.shift();
      } else if (top instanceof Array) {
        for (var i = 0; i < top.length; i++) {
          if (JSON.stringify(top[i]) === JSON.stringify(result)) {
            top.splice(i, 1);
            i = 0 / 0;
          }
        }
        if (i !== i) {
          if (top.length === 0) this.shift();
        } else {
          return reject();
        }
      } else {
        return reject();
      }
      if (this.length === 0) resolve();
    };
  });
};
Tester.Expection.prototype = [];
Tester.Expection.prototype.answer = Function.prototype;
Tester.Expection.prototype.then = function(done, fail) { return this.promise.then(done, fail); };
Tester.Expection.prototype['catch'] = function(fail) { return this.promise.then(null, fail); };
Tester.Expection.prototype.done = function(done) { this.promise.then(done); return this; };
Tester.Expection.prototype.fail = function(fail) { this.promise.then(null, fail); return this; };
Tester.Expection.prototype.feedback = function() { Tester.feedback(this.promise); return this; };
