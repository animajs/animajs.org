var $ = window.$ = require('anima-yocto');
var _ = require('anima-underscore');
var Scroll = require('anima-scroll');
var Fx = require('anima-fx');

_.substitute = function(string, object, regexp) {
  return String(string).replace(regexp || (/\\?\{([^{}]+)\}/g), function(match, name) {

    if (match.charAt(0) == '\\') return match.slice(1);
    if (object[name] != null) return object[name];

    var path = name.split('.'),
      length = path.length,
      sub = object,
      i;

    if (length <= 1)
      return match;

    for (i = 0; i < length; i++) {
      if ((sub = sub[path[i]]) == null) return match;
    }
    return sub;
  });
}

var App = function(element, options, callback){

  var win = window, doc = win.document;
  var ios = window.navigator.appVersion.match(/iphone|ipad/gi);

  var array = [];
  var push = array.push;
  var slice = array.slice;
  var splice = array.splice;

  var app = this;

