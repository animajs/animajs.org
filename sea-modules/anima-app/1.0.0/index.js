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



if ( !_.isObject(options) ){
  if ( _.isFunction(options) ){
    callback = options;
  }
  options = {}
}

app.options = {
  enableScroll: false,
  enableNavbar: false,
  enableToolbar: false,
  enableTransition: true,
  enableMessageLog: false,
  raiseErrors: false,
  headerCls: "am-header",
  cacheLength: 5,
  plugins: {},
  initPage: "",
  headerTpl: {
    title: '<h1>{title}</h1>',
    btnLeft: '<a class="am-header-reverse am-header-reverse-btn">{text}</a>',
    btnRight: '<a class="am-header-operate am-header-operate-btn">{text}</a>'
  },
  transTimes: 300,
  highAnims: ios
}


for (var option in options) {
  app.options[option] = options[option];
}


app.element = doc.querySelector(element) || doc.body;
app.contentEl = app.element.querySelector(".content");
app.navbarEl = app.element.querySelector(".navbar");
app.toolbarEl = app.element.querySelector(".toolbar");
app.viewHeight = !app.options.enableScroll ? app.element.offsetHeight : win.innerHeight;
app.page = {};
app.options.enableMessageLog = app.options.raiseErrors || app.options.enableMessageLog;

app.plugins = app.options.plugins;



// 路由
app.router = function(route, name, callback){
  this.log("[Router][Registration][" + route + "]");
  // 注册路由
  this.Router.route(route, name, callback)
  app.pluginHook('addRouter', route);
  return this;
};
// 刷新DOM框架size
app.refreshContent = function(){
  var offsetHeight = this.viewHeight;
  offsetHeight = offsetHeight < win.innerHeight ? win.innerHeight : offsetHeight;
  if ( this.options.enableNavbar ){
    offsetHeight -= this.navbarEl.offsetHeight
  }
  if ( this.options.enableToolbar ){
    offsetHeight -= this.toolbarEl.offsetHeight
  }
  // this.contentEl.querySelector(".wrap").style[( this.options.enableScroll ? "height" : "minHeight")] = offsetHeight + 'px';
  this.contentEl.style[( this.options.enableScroll ? "height" : "minHeight")] = offsetHeight + 'px';

};
// 路由回调环境
app.RenderContext = function(){
  var args = _.toArray(arguments);
  var name = args[0];
  var callback = args[1];
  var subArgs = args[2];
  var fragment = args[3];
  var route = args[4] || "default";
  var options = args[5] || {};

  var context = app.RouterInstances[name] || ( app.RouterInstances[name] = new RouterInstance(callback) );
  context.render(name, subArgs, fragment, route, options);
  return context;
};
app.getPage = function(name) {
  var name = name || "default";
  return pages[name];
};
// add公用方法
app.use = function() {
  // flatten the arguments
  var args = _.toArray(arguments),
    plugin = args.shift(),
    plugin_name = plugin || '';

  try {
    args.unshift(this);
    if (typeof plugin == 'string') {
      plugin_name = 'Plugin.' + plugin;
      plugin = App[plugin];
    }
    plugin.apply(this, args);
  } catch(e) {
    if (typeof plugin === 'undefined') {
      this.error("Plugin Error: called plugin() but plugin (" + plugin_name.toString() + ") is not defined", e);
    } else if (!_.isFunction(plugin)) {
      this.error("Plugin Error: called plugin() but '" + plugin_name.toString() + "' is not a function", e);
    } else {
      this.error("Plugin Error", e);
    }
  }
  return this;
};
// 挂载方法到Page
app.helpers = function(extensions) {
  _.extend(RouterInstance.prototype, extensions);
  return this;
};
// 挂载单个方法到Page
app.helper = function(name, method) {
  RouterInstance.prototype[name] = method;
  return this;
}











  // Handles cross-browser history management, based on either
  // [pushState](http://diveintohtml5.info/history.html) and real URLs, or
  // [onhashchange](https://developer.mozilla.org/en-US/docs/DOM/window.onhashchange)
  // and URL fragments. If the browser supports neither (old IE, natch),
  // falls back to polling.
  var History = function() {
    this.handlers = [];
    this.state = new StateStack();
    _.bindAll(this, 'checkUrl');

    // Ensure that `History` can be used outside of the browser.
    if (typeof window !== 'undefined') {
      this.location = window.location;
      this.history = window.history;
    }
  };

  // Cached regex for stripping a leading hash/slash and trailing space.
  var routeStripper = /^[#\/]|\s+$/g;

  // Cached regex for stripping leading and trailing slashes.
  var rootStripper = /^\/+|\/+$/g;

  // Cached regex for detecting MSIE.
  var isExplorer = /msie [\w.]+/;

  // Cached regex for removing a trailing slash.
  var trailingSlash = /\/$/;

  // Cached regex for stripping urls of hash.
  var pathStripper = /#.*$/;

  // Has the history handling already been started?
  History.started = false;

  // Set up all inheritable **Backbone.History** properties and methods.
  _.extend(History.prototype, Events, {

    // The default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50,

    // Are we at the app root?
    atRoot: function() {
      return this.location.pathname.replace(/[^\/]$/, '$&/') === this.root;
    },

    // Gets the true hash value. Cannot use location.hash directly due to bug
    // in Firefox where location.hash will always be decoded.
    getHash: function(window) {
      var match = (window || this).location.href.match(/#(.*)$/);
      return match ? match[1] : '';
    },

    // Get the cross-browser normalized URL fragment, either from the URL,
    // the hash, or the override.
    getFragment: function(fragment, forcePushState) {
      if (fragment == null) {
        if (this._hasPushState || !this._wantsHashChange || forcePushState) {
          fragment = decodeURI(this.location.pathname + this.location.search);
          var root = this.root.replace(trailingSlash, '');
          if (!fragment.indexOf(root)) fragment = fragment.slice(root.length);
        } else {
          fragment = this.getHash();
        }
      }
      return fragment.replace(routeStripper, '');
    },

    // Start the hash change handling, returning `true` if the current URL matches
    // an existing route, and `false` otherwise.
    start: function(options) {
      if (History.started) throw new Error("history has already been started");
      History.started = true;

      // Figure out the initial configuration. Do we need an iframe?
      // Is pushState desired ... is it available?
      this.options          = _.extend({root: '/'}, this.options, options);
      this.root             = this.options.root;
      this._wantsHashChange = this.options.hashChange !== false;
      this._wantsPushState  = !!this.options.pushState;
      this._hasPushState    = !!(this.options.pushState && this.history && this.history.pushState);
      var fragment          = this.getFragment();
      var docMode           = document.documentMode;
      var oldIE             = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));

      // Normalize root to always include a leading and trailing slash.
      this.root = ('/' + this.root + '/').replace(rootStripper, '/');

      // Depending on whether we're using pushState or hashes, and whether
      // 'onhashchange' is supported, determine how we check the URL state.
      if (this._hasPushState) {
        $(window).on('popstate', this.checkUrl);
      } else if (this._wantsHashChange && ('onhashchange' in window) && !oldIE) {
        $(window).on('hashchange', this.checkUrl);
      } else if (this._wantsHashChange) {
        this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
      }

      // Determine if we need to change the base url, for a pushState link
      // opened by a non-pushState browser.
      this.fragment = fragment;
      var loc = this.location;

      // Transition from hashChange to pushState or vice versa if both are
      // requested.
      if (this._wantsHashChange && this._wantsPushState) {

        // If we've started off with a route from a `pushState`-enabled
        // browser, but we're currently in a browser that doesn't support it...
        if (!this._hasPushState && !this.atRoot()) {
          this.fragment = this.getFragment(null, true);
          this.location.replace(this.root + '#' + this.fragment);
          // Return immediately as browser will do redirect to new url
          return true;

        // Or if we've started out with a hash-based route, but we're currently
        // in a browser where it could be `pushState`-based instead...
        } else if (this._hasPushState && this.atRoot() && loc.hash) {
          this.fragment = this.getHash().replace(routeStripper, '');
          this.history.replaceState({}, document.title, this.root + this.fragment);
        }

      }

      if (!this.options.silent) return this.loadUrl();
    },

    // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
    // but possibly useful for unit testing Routers.
    stop: function() {
      $(window).off('popstate', this.checkUrl).off('hashchange', this.checkUrl);
      if (this._checkUrlInterval) clearInterval(this._checkUrlInterval);
      History.started = false;
    },

    // Add a route to be tested when the fragment changes. Routes added later
    // may override previous routes.
    route: function(route, callback) {
      return this.handlers.unshift({route: route, callback: callback});
    },

    // Checks the current URL to see if it has changed, and if it has,
    // calls `loadUrl`, normalizing across the hidden iframe.
    checkUrl: function(e) {
      var current = this.getFragment();
      if (current === this.fragment && this.iframe) {
        current = this.getFragment(this.getHash(this.iframe));
      }
      if (current === this.fragment) return false;
      if (this.iframe) this.navigate(current);
      this.loadUrl();
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl: function(fragment, data) {
      fragment = this.fragment = this.getFragment(fragment);
      return _.any(this.handlers, function(handler) {
        if (handler.route.test(fragment)) {
          handler.callback(fragment, data);
          return true;
        }
      });
    },

    // Save a fragment into the hash history, or replace the URL state if the
    // 'replace' option is passed. You are responsible for properly URL-encoding
    // the fragment in advance.
    //
    // The options object can contain `trigger: true` if you wish to have the
    // route callback be fired (not usually desirable), or `replace: true`, if
    // you wish to modify the current URL without adding an entry to the history.
    navigate: function(fragment, options) {
      if (!History.started) return false;
      if (!options || options === true) options = {trigger: false};

      var url = this.root + (fragment = this.getFragment(fragment || ''));

      // Strip the hash for matching.
      fragment = fragment.replace(pathStripper, '');

      if (this.fragment === fragment) return;
      this.fragment = fragment;

      // Don't include a trailing slash on the root.
      if (fragment === '' && url !== '/') url = url.slice(0, -1);


      // If pushState is available, we use it to set the fragment as a real URL.
      if (this._hasPushState) {
        this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

      // If hash changes haven't been explicitly disabled, update the hash
      // fragment to store history.
      } else if (this._wantsHashChange) {
        this._updateHash(this.location, fragment, options.replace);
        if (this.iframe && (fragment !== this.getFragment(this.getHash(this.iframe)))) {
          // Opening and closing the iframe tricks IE7 and earlier to push a
          // history entry on hash-tag change.  When replace is true, we don't
          // want this.
          if(!options.replace) this.iframe.document.open().close();
          this._updateHash(this.iframe.location, fragment, options.replace);
        }

      // If you've told us that you explicitly don't want fallback hashchange-
      // based history, then `navigate` becomes a page refresh.
      } else {
        return this.location.assign(url);
      }
      if (!options.trigger) return this.loadUrl(fragment, options);
    },

    // Update the hash location, either replacing the current entry, or adding
    // a new one to the browser history.
    _updateHash: function(location, fragment, replace) {
      if (replace) {
        var href = location.href.replace(/(javascript:|#).*$/, '');
        location.replace(href + '#' + fragment);
      } else {
        // Some browsers require that `hash` contains a leading #.
        location.hash = '#' + fragment;
      }
    },

    pop: function(options) {
      var that = this,
        stack = this.state,
        stateIdx = stack.getIndex();

      if (stateIdx === 0) return;

      stack.move = 'backward';
      stack.transition = 'backward';
      console.log(stack)
      if (options && options.transition === 'forward') {
        stack.transition = 'forward';
      }

      this.history.back();
    },

  });

  app.History = new History();

  // Routers map faux-URLs to actions, and fire events when routes are
  // matched. Creating a new one sets its `routes` hash, if not set statically.
  var Router = function() {
    this.initialize.apply(this, arguments);
  };

  // Cached regular expressions for matching named param parts and splatted
  // parts of route strings.
  var optionalParam = /\((.*?)\)/g;
  var namedParam    = /(\(\?)?:\w+/g;
  var splatParam    = /\*\w+/g;
  var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;
  var nameArgParam  = /(\(\?)?(:|\*)\w+/g;

  // Set up all inheritable **Backbone.Router** properties and methods.
  _.extend(Router.prototype, Events, {

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    route: function(route, name, callback) {
      var argName = route.match(nameArgParam) || [];
      if (_.isFunction(name)) {
        callback = name;
        name = route;
      }
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      if ( !_.isFunction(callback) ){
        this.error("callback is not find")
      }
      var router = this;
      var instance = app.History.route(route, function(fragment, options) {
        var args = router._extractParameters(route, fragment, argName);
        router.execute(name, callback, args, fragment, route, options);
      });
    },

    // Execute a route handler with the provided parameters.  This is an
    // excellent place to do pre-route setup or post-route cleanup.
    execute: function(name, callback, args, fragment, route, options) {
      if (callback) app.RenderContext.apply(app, arguments) //callback.call(this.pageInstance, args, fragment);
    },

    // Simple proxy to `Backbone.history` to save a fragment into the history.
    navigate: function(fragment, options) {
      app.History.navigate(fragment, options);
      return this;
    },


    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routeToRegExp: function(route) {
      route = route.replace(escapeRegExp, '\\$&')
                   .replace(optionalParam, '(?:$1)?')
                   .replace(namedParam, function(match, optional) {
                     return optional ? match : '([^/?]+)';
                   })
                   .replace(splatParam, '([^?]*?)');
      return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted decoded parameters. Empty or unmatched parameters will be
    // treated as `null` to normalize cross-browser behavior.
    _extractParameters: function(route, fragment, name) {
      var params = route.exec(fragment).slice(1);
      params = _.map(params, function(param, i) {
        // Don't decode the search params.
        if (i === params.length - 1) return param || null;
        return param ? decodeURIComponent(param) : null;
      });
      var datas = {
        query: params.pop()
      };

      for (var i = 0; i < name.length; i++) {
        datas[name[i].replace(/(:|\*)/, "")] = params[i]
      };

      return datas
    }

  });

  app.Router = new Router()


  // log init
  var loggers = [];
  if (typeof window.console != 'undefined') {
    if (typeof window.console.log === 'function' && _.isFunction(window.console.log.apply)) {
      loggers.push(function() {
        window.console.log.apply(window.console, arguments);
      });
    } else {
      loggers.push(function() {
        window.console.log(arguments);
      });
    }
  } else if (typeof console != 'undefined') {
    loggers.push(function() {
      console.log.apply(console, arguments);
    });
  }

  app.log = function()  {
    var args = _.toArray(arguments);
    if ( !app.options.enableMessageLog ){
      return false;
    }
    var t = new Date();
    var now = [t.getHours(),t.getMinutes(),t.getSeconds(),t.getMilliseconds()]
    args.unshift("color:blue")
    args.unshift("color:green")
    args.unshift("%c[" + now.join(":") + "]%c %s");
    $.each(loggers, function(i, logger) {
      logger.apply(app, args);
    });
  }
  app.error = function(message, original_error) {
    if (!original_error) { original_error = new Error(); }
    original_error.message = [message, original_error.message].join(' ');
    app.trigger('error', {message: original_error.message, error: original_error});
    if (app.options.raiseErrors) {
      throw(original_error);
    } else  {
      app.log(original_error.message, original_error);
    }
  }



  // _.extend(App.prototype, appLog)

  // A module that can be mixed in to *any object* in order to provide it with
  // custom events. You may bind with `on` or remove with `off` callback
  // functions to an event; `trigger`-ing an event fires all callbacks in
  // succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  var Events = {

    // Bind an event to a `callback` function. Passing `"all"` will bind
    // the callback to all events fired.
    on: function(name, callback, context) {
      if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
      this._events || (this._events = {});
      var events = this._events[name] || (this._events[name] = []);
      events.push({callback: callback, context: context, ctx: context || this});
      return this;
    },

    // Bind an event to only be triggered a single time. After the first time
    // the callback is invoked, it will be removed.
    once: function(name, callback, context) {
      if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
      var self = this;
      var once = _.once(function() {
        self.off(name, once);
        callback.apply(this, arguments);
      });
      once._callback = callback;
      return this.on(name, once, context);
    },

    // Remove one or many callbacks. If `context` is null, removes all
    // callbacks with that function. If `callback` is null, removes all
    // callbacks for the event. If `name` is null, removes all bound
    // callbacks for all events.
    off: function(name, callback, context) {
      var retain, ev, events, names, i, l, j, k;
      if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
      if (!name && !callback && !context) {
        this._events = void 0;
        return this;
      }
      names = name ? [name] : _.keys(this._events);
      for (i = 0, l = names.length; i < l; i++) {
        name = names[i];
        if (events = this._events[name]) {
          this._events[name] = retain = [];
          if (callback || context) {
            for (j = 0, k = events.length; j < k; j++) {
              ev = events[j];
              if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
                  (context && context !== ev.context)) {
                retain.push(ev);
              }
            }
          }
          if (!retain.length) delete this._events[name];
        }
      }

      return this;
    },

    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    trigger: function(name) {
      // app.log("[Event Trigger][" + name + "]", arguments);
      if (!this._events) return this;
      var args = slice.call(arguments, 1);
      if (!eventsApi(this, 'trigger', name, args)) return this;
      var events = this._events[name];
      var allEvents = this._events.all;
      if (events) triggerEvents(events, args);
      if (allEvents) triggerEvents(allEvents, arguments);
      return this;
    },

    // Tell this object to stop listening to either specific events ... or
    // to every object it's currently listening to.
    stopListening: function(obj, name, callback) {
      var listeningTo = this._listeningTo;
      if (!listeningTo) return this;
      var remove = !name && !callback;
      if (!callback && typeof name === 'object') callback = this;
      if (obj) (listeningTo = {})[obj._listenId] = obj;
      for (var id in listeningTo) {
        obj = listeningTo[id];
        obj.off(name, callback, this);
        if (remove || _.isEmpty(obj._events)) delete this._listeningTo[id];
      }
      return this;
    }

  };

  // Regular expression used to split event strings.
  var eventSplitter = /\s+/;

  // Implement fancy features of the Events API such as multiple event
  // names `"change blur"` and jQuery-style event maps `{change: action}`
  // in terms of the existing API.
  var eventsApi = function(obj, action, name, rest) {
    if (!name) return true;

    // Handle event maps.
    if (typeof name === 'object') {
      for (var key in name) {
        obj[action].apply(obj, [key, name[key]].concat(rest));
      }
      return false;
    }

    // Handle space separated event names.
    if (eventSplitter.test(name)) {
      var names = name.split(eventSplitter);
      for (var i = 0, l = names.length; i < l; i++) {
        obj[action].apply(obj, [names[i]].concat(rest));
      }
      return false;
    }

    return true;
  };

  // A difficult-to-believe, but optimized internal dispatch function for
  // triggering events. Tries to keep the usual cases speedy (most internal
  // Backbone events have 3 arguments).
  var triggerEvents = function(events, args) {
    var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
    switch (args.length) {
      case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
      case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
      case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
      case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
      default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
    }
  };

  var listenMethods = {listenTo: 'on', listenToOnce: 'once'};

  // Inversion-of-control versions of `on` and `once`. Tell *this* object to
  // listen to an event in another object ... keeping track of what it's
  // listening to.
  _.each(listenMethods, function(implementation, method) {
    Events[method] = function(obj, name, callback) {
      var listeningTo = this._listeningTo || (this._listeningTo = {});
      var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
      listeningTo[id] = obj;
      if (!callback && typeof name === 'object') callback = this;
      obj[implementation](name, callback, this);
      return this;
    };
  });


  _.extend(app, Events)

  app.Events = Events;


  var Content = function(el, options){
    this._wrapEl = el;
    this._cacheLength = Math.max(options.cacheLength, 1);
    this._cacheIndex = 0;

    var html = '';
    for (var i = 0; i < this._cacheLength; i++) {
      html += '<section class="inactive" index="' + i + '"></section>';
    }
    this._wrapEl.innerHTML = '<div class="wrap">' + html + '</div><div class="trans"><div></div></div>';
    this.contentEl = this._wrapEl.childNodes[0];
    this.transEl = this._wrapEl.childNodes[1];
    this.transShadeEl = this.transEl.childNodes[0];
    this.setClassName();
    app.scroll = new Scroll(this.contentEl).init();
  }

  var ContentProto = {

    switchTransition: function(x, callback){
      var _self = this;
      var offsetWidth = _self.contentEl.getBoundingClientRect().width;
      _self.transEl.style.display = 'block';
      _self.transShadeEl.style[( x == "backward" ? "right" : "left")] = offsetWidth + 'px';
      $(_self.transShadeEl).animate({
        translateX: ( x == "backward" ? "100%" : "-100%")
      }, app.transTimes, 'ease-in-out', function(){
        _self.transEl.style.cssText = " ";
        _self.transShadeEl.style.cssText = " ";
        callback && callback()
      })
    },
    switchTransitionIos: function(oldel, el, x, callback){
      var _self = this;
      var offsetWidth = _self.contentEl.getBoundingClientRect().width;
      el.style.cssText = "display: block;position: absolute; width: 100%; top: 0; bottom:0; z-index: 99;-webkit-transform: translateX(" + ( x == "backward" ? "-320px" : "320px") + "); -webkit-backface-visibility: hidden; -webkit-transform-style: preserve-3d;"
      $(oldel).animate({
        translateX: ( x == "backward" ? "100px" : "-100px")
      }, app.transTimes, 'ease-in-out', function(){
        oldel.style.cssText = " ";
        callback && callback()
      })
      $(el).animate({
        translateX: "0px"
      }, app.transTimes, 'ease-in-out', function(){
        el.style.cssText = " ";
        // callback && callback()
      })
    },

    setClassName: function() {
      this.getActive().className = 'active';
      if (this._cacheLength > 2) {
        this.getPrevious().className = 'inactive prev';
        this.getNext().className = 'inactive next';
      } else if (this._cacheLength > 1){
        this.getPrevious().className = 'inactive';
      }
    },

    getActive : function() {
      var index = this._cacheIndex;
      return this.contentEl.childNodes[index];
    },

    getNext: function() {
      var index = (this._cacheIndex + 1) % this._cacheLength;
      return this.contentEl.childNodes[index];
    },

    getPrevious: function() {
      var index = (this._cacheIndex - 1 + this._cacheLength) % this._cacheLength;
      return this.contentEl.childNodes[index];
    },

    next: function() {
      if (this._cacheLength > 2) {
        this.getPrevious().className = 'inactive';
      }
      this._cacheIndex = (this._cacheIndex + 1) % this._cacheLength;
    },

    previous: function() {
      if (this._cacheLength > 2) {
        this.getNext().className = 'inactive';
      }
      this._cacheIndex = (this._cacheIndex - 1 + this._cacheLength) % this._cacheLength;
    },

    html: function(html) {
      this.getActive().innerHTML = html;
    }
  }


  for (var p in ContentProto) {
    Content.prototype[p] = ContentProto[p];
  }



  function StateStack() {
    var that = this;

    that.move = null;
    that.transition = null;
    that.datas = null;

    that._states = [];
    that._stateIdx = 0;
    that._stateLimit = 100;
  }

  var StateStackProto = {
    reset: function() {
      var that = this;

      that.move = null;
      that.transition = null;
      that.datas = null;
      that.type = null;

      that._states = [];
      that._stateIdx = 0;
      that._stateLimit = 100;
    },

    pushState: function(name, fragment, params, args) {
      var that = this,
        states = that._states,
        stateIdx = that._stateIdx,
        stateLimit = that._stateLimit,
        stateLen = states.length,
        move = that.move,
        transition = that.transition,
        datas = that.datas,
        type = that.type,

        prev = states[stateIdx - 1],
        next = states[stateIdx + 1],
        cur = {
          name : name,
          fragment : fragment,
          type: type,
          params : params || {},
          datas : datas || {}
        }
        ;


      for (var p in args) {
        cur.datas[p] = args[p];
      }

      if (move == null) {
        if (!datas && StateStack.isEquals(prev, cur)) {
          transition = move = 'backward';
        } else {
          transition = move = 'forward';
        }
      }

      if (move === 'backward') {
        if (stateIdx === 0 && stateLen > 0) {
          states.unshift(cur);
        } else if (stateIdx > 0) {
          stateIdx--;
          cur = prev;
        }
      } else if (move === 'forward') {
        if (stateIdx === stateLimit - 1) {
          states.shift();
          states.push(cur);
          cur.referer = location.href.replace(/#[^#]*/, '#' + states[stateIdx - 1].fragment);
        } else if (stateIdx === 0 && stateLen === 0) {
          states.push(cur);
          cur.referer = document.referer || '';
        } else if (!datas && StateStack.isEquals(next, cur)){
          stateIdx++;
          cur = next;
        } else if (StateStack.isEquals(states[stateIdx], cur)){
          cur = states[stateIdx];
        } else {
          stateIdx++;
          states.splice(stateIdx);
          states.push(cur);
          cur.referer = location.href.replace(/#[^#]*/, '#' + states[stateIdx - 1].fragment);
        }
      } else if (move === 'replace') {
        cur.referer = location.href.replace(/#[^#]*/, '#' + states[stateIdx].fragment);
        states[stateIdx] = cur;
      }

      cur.move = move;
      cur.transition = transition;
      cur.index = stateIdx;

      that.move = null;
      that.transition = null;
      that.datas = null;
      that._stateIdx = stateIdx;

      return cur;
    },

    getState: function() {
      return this._states[this._stateIdx];
    },

    getIndex: function() {
      return this._stateIdx;
    }
  }

  for (var p in StateStackProto) {
    StateStack.prototype[p] = StateStackProto[p];
  }

  StateStack.isEquals = function(state1, state2) {
    if (!state1 || !state2) return false;

    if (state1.name !== state2.name ||
        state1.fragment !== state2.fragment)
      return false;

    return true;
  }

  app.pages = {};
  app.RouterInstances = {};
  var pagecache = {};

  var RouterInstance = function( callback){
    // this.app = context
    this._state = null;
    this.state = app.History.state;

    this.callback = callback;
    // this.options = {
    //   enableMessageLog: this.context.options.enableMessageLog,
    //   raiseErrors: this.context.options.raiseErrors,
    // },
    this.isSamePage;
    this.isSameState;
    return this;
  }
  _.extend(RouterInstance.prototype, Events, {
    render: function(name, args, fragment, route, options){
      this.args = args;
      this.name = name;
      this.fragment = fragment;
      this.route = route;
      this.datas = options.data;
      this.move = options.move;
      this.callback && this.callback.apply(this)
    },
    loaded: {},
    load: function(url){
      var that = this;
      if ( that.loaded[url] ){
        that.renderPage(that.loaded[url]);
      } else {
        app.log("[Page][Loading]");
        app.pluginHook('loadStart', url);
        seajs.use(url,function(config){
          that.loaded[url] = config;
          app.pluginHook('loadEnd', url, config);
          that.renderPage(config);
        })
      }
    },
    renderPage: function(config){

      var page;
      var state;

      config.name = this.name || this.route;

      this.trigger('page:render', config);
      app.log("[Page][renderPage]");

      if (app.page.lastState) {
        this.isSamePage = app.page.lastState.name === config.name;
        this.isSameState = app.page.lastState.fragment === config.fragment;
      }
      if ( !this.isSamePage ){


        this._state = this.state.pushState((this.name || this.route), this.fragment, this.args, this.datas)
        this.move && ( this._state.move = this.move );
        if ( app.pages[this.route] ){
          page = app.pages[this.route];
        } else {
          page = app.pages[this.route] = _.extend(new PageView(), config)
          initPage.call(this, page)
          page.ready();
        }


        if ( this.route == "default" ){
          this._state.isDefault = true
        }

        var oldEl = app.Content.getActive();
        this._state.move === 'backward' ? app.Content.previous() : app.Content.next();
        page.el = app.Content.getActive();

        // page event
        $(page.el).off();
        if ( page.events ){
          for (var i = 0; i < page.events.length; i++) {
            var handler = page.events[i][2]
            if (typeof handler === 'string') {
              handler = page[page.events[i][2]];
            }
            var h = (function(handler) {
              return function(e) {
                e.preventDefault();
                handler && handler.call(page, e);
              }
            })(handler);

            $(page.el).on(toolbar.events[i][0], toolbar.events[i][1], h)
          };
        }


        // toolbar
        $(app.toolbarEl).off().html("");

        //
        if ( app.options.enableTransition && app.page.lastPage ){
          this.setNavbar(page, this._state, true)
          app.pluginHook('pageBeforeSwitch', page, state);
          if ( app.options.highAnims ){
            app.Content.switchTransitionIos(oldEl, page.el, this._state.move, function(){
              app.Content.setClassName();
              app.pluginHook('pageAfterSwitch', page, state);
              // app.refreshScroll(page.el);
            })
          } else {
            app.Content.switchTransition(this._state.move, function(){
              app.Content.setClassName();
              app.pluginHook('pageAfterSwitch', page, state);
              // app.refreshScroll(page.el);
            })
          }
        } else {
          this.setNavbar(page, this._state)
          app.Content.setClassName();
          // app.refreshScroll(page.el);
        }
        this.showPage(page, this._state)
      } else {

      }

    },
    setNavbar: function(page, state){
      if ( !app.options.enableNavbar ){ return false}
      var title = page.title,
        buttons = page.buttons;

      if (buttons) {
        for (var i = 0; i < buttons.length; i++)  {
          var button = buttons[i],
            handler = button.handler;

          button.id || (button.id = 'btn-' + Date.now() + '-' + parseInt(Math.random() * 10));

          if (typeof handler === 'string') {
            handler = page[handler];
          }

          if (button.type === 'back') {
            button.hide = (button.autoHide !== false && state.index < 1);
            handler || (handler = function() {
              app.History.pop();
            });
          }

          button.handler = (function(handler) {
            return function(e) {
              e.preventDefault();
              handler && handler.call(page, e, state.index);
            }
          })(handler);
        }
      } else {
        buttons = [{
          id: 'back',
          type: 'back',
          text: 'back',
          hide: state.index < 1?true:false,
          handler: function() {
            app.History.pop();
          }
        }];
      }

      if (this.isSamePage || !app.page.lastPage) {
        app.Navbar.resetNavbar();
        app.Navbar.setTitle(title);
        for (var i = 0; i < buttons.length; i++) {
          app.Navbar.setButton(buttons[i]);
        }
      } else {
        app.Navbar.switchNavbar(title, state.move, buttons);
      }
    },
    setToolbar: function(page){
      var toolbar = page.toolbar;
      app.toolbarEl.innerHTML = '';

      if ( app.options.enableToolbar && toolbar ) {

        toolbar.html && (app.toolbarEl.innerHTML = toolbar.html);
        toolbar.el && ((app.toolbarEl.innerHTML = '') || app.toolbarEl.appendChild(toolbar.el));

        !toolbar.events && ( toolbar.events = [] );
        for (var i = 0; i < toolbar.events.length; i++) {
          var handler = toolbar.events[i][2]
          if (typeof handler === 'string') {
            handler = page[toolbar.events[i][2]];
          }
          var h = (function(handler) {
            return function(e) {
              e.preventDefault();
              handler && handler.call(page, e);
            }
          })(handler);

          $(app.toolbarEl).on(toolbar.events[i][0], toolbar.events[i][1], h)
        };

      }
    },
    showPage: function(page, state){


      var oldFragment = page.el.getAttribute('data-fragment')
      var oldCache = pagecache[oldFragment];


      if (!this.isSameState && !(this.isSamePage && state.isDefault)) {
        app.page.lastPage && app.page.lastPage.hide(app.page.lastState);

        if (oldFragment !== state.fragment && !this.isSamePage) {

          if ( oldCache ){
            oldCache.page.teardown(oldCache.state);
            delete pagecache[oldFragment];
          }

          pagecache[state.fragment] = {state:state, page:page};
          page.el.innerHTML = '';
          page.el.setAttribute('data-fragment', state.fragment);
          page.startup.apply(this, state);

        }

        page.show.apply(this, state);
        this.setToolbar(page);
        app.refreshContent();
        //
        // setTimeout(function() {app.refreshScroll(page.el);}, app.options.transTimes + 1100);

        app.page.lastPage = page;
        app.page.lastState = state;
      }

    },
    redirect: function(hash, options){
      var options = options || {};
      this.trigger('page:redirect', arguments);
      app.log("[Page][Redirect]");
      if ( !options.move ){options.move = "forward"}
      app.Router.navigate(hash, options)
    },
    getReferer: function(){
      return this.state.getState().referer;
    },
    getParameter: function(name) {
      var state = this.state.getState();
      return state.params[name] || state.datas[name];
    },
    getParameters: function() {
      var params = {};
      for (var n in this.args) {
        params[n] = this.args[n];
      }

      for (var n in this.datas) {
        params[n] = this.datas[n];
      }

      return params;
    },

    setData: function(name, value) {
      this.state.getState().datas[name] = value;
    },
    log: function(){
      app.log.apply(app, arguments)
    }

  })

  function initPage(page){
    var ready = page.ready,
      startup = page.startup,
      teardown = page.teardown,
      show = page.show,
      hide = page.hide;
      page.isReady = false;
      page.persisted = false;

    page.ready = function(state) {
      if (page.isReady) return;
      this.trigger('page:ready', state);
      app.pluginHook('pageReady', page, state);
      this.log("[Page Ready][" + page.name + "]")
      ready.call(page);
      this.isReady = true;
    }

    page.startup = function(state) {
      this.trigger('page:startup');
      app.pluginHook('pageStartup', page, state);
      this.log("[Page Startup][" + page.name + "]")
      startup.apply(page, arguments);
    }

    page.show = function(state) {
      this.trigger('page:show', state);
      app.pluginHook('pageShow', page, state);
      this.log("[Page Show][" + page.name + "]")
      show.call(page, this.persisted);
      this.persisted = true;
    }

    page.hide = function(state) {
      this.trigger('page:hide', state);
      app.pluginHook('pageHide', page, state);
      this.log("[Page Hide][" + page.name + "]")
      hide.call(page, this.persisted);
    }

    page.teardown = function(state) {
      this.trigger('page:teardown', state);
      app.pluginHook('pageTeardown', page, state);
      this.log("[Page Teardown][" + page.name + "]")
      teardown.call(page);
      this.persisted = false;
    }

    page.html = function(html) {
      this.el.innerHTML = html;
    }
  }

  function PageView() {
  }

  _.extend(PageView.prototype, Events, {
    ready : function() {/*implement*/},
    startup : function() {/*implement*/},
    teardown : function() {/*implement*/},
    show : function() {/*implement*/},
    hide : function() {/*implement*/},
    log: function(){
      app.log.apply(app, arguments)
    }
  })


  function Navbar(wrapEl, options) {
    this.options = options;
    this.wrapEl = wrapEl;
    this.wrapEl.appendChild(this.animWrapEl = doc.createElement('div'));
    this.animWrapEl.className = options.cls;
    this.animWrapEl.innerHTML = _.substitute(options.tpl.title, {title : ""});
    this.wrapEl.style.height = this.animWrapEl.offsetHeight + "px";
    this.animWrapEl.style.cssText = "position: absolute; width: 100%; top: 0; z-index: 99;";
  }

  _.extend(Navbar.prototype, {
    setTitle: function(title) {
      if (typeof title === 'string') {
        this.animWrapEl.innerHTML = _.substitute(this.options.tpl.title, {title : title});
      }
    },

    setButton: function(options) {
      var btn = $(_.substitute(this.options.tpl[(( options.type == "back" || options.type == "left") ? "btnLeft" : "btnRight")], options.text))[0];
      this.animWrapEl.appendChild(btn);

      (options.id != null) && btn.setAttribute('data-id', options.id);
      (options['class'] != null) && (btn.className = options['class']);
      (options.text != null) && (btn.innerHTML = options.text);
      (options.bg != null) && (btn.style.background = options.bg);
      (options.icon != null) && (btn.innerHTML = '<img src="' + options.icon + '" border="0" width="100%" height="100%" />');
      (options.hide === true) ? (btn.style.display = 'none'):(btn.style.display = '');
      options.onChange && options.onChange.call(btn, options);
      if (options.handler) {
        btn.handler && btn.removeEventListener('click', btn.handler, false);
        btn.addEventListener('click', (btn.handler = options.handler), false);
      }

    },

    switchNavbar: function(title, transition, buttons){
      var that = this;
      var oldHeader = this.animWrapEl;
      this.removeButton();
      this.wrapEl.appendChild(this.animWrapEl = doc.createElement('div'));
      this.animWrapEl.className = this.options.cls;
      this.animWrapEl.innerHTML = _.substitute(this.options.tpl.title, {title : title});
      this.wrapEl.style.height = this.animWrapEl.offsetHeight + "px";
      this.animWrapEl.style.cssText = "position: absolute; width: 100%; top: 0; z-index: 99;";



      var offsetWidth = oldHeader.getBoundingClientRect().width
      this.animWrapEl.style.zIndex = '999';
      this.animWrapEl.style[( transition == "backward" ? "right" : "left")] = offsetWidth + 'px';

      $(this.animWrapEl).trigger($.fx.animationEnd).off($.fx.animationEnd).animate({
        translateX: ( transition == "backward" ? "100%" : "-100%")
      }, app.transTimes, 'ease-in-out', function(){
        oldHeader.parentNode.removeChild(oldHeader);
        that.animWrapEl.style.cssText = "position: absolute; width: 100%; top: 0; z-index: 99;";
      })

      for (var i = 0; i < buttons.length; i++) {
        this.setButton(buttons[i]);
      }

    },
    resetNavbar: function(){
      this.removeButton();
      this.animWrapEl.innerHTML = "";
    },
    getButton: function(id) {
      return this.wrapEl.querySelector('a[data-id="' + id + '"]');
    },

    removeButton: function(id) {
      function remove(btn) {
        if (btn) {
          btn.handler && btn.removeEventListener('click', btn.handler);
          btn.parentNode.removeChild(btn);
        }
      }

      if (!id) {
        var btns = this.wrapEl.querySelectorAll('a');
        for (var i = 0; i < btns.length; i++) {
          remove(btns[i]);
        }
      } else {
        if (typeof id === 'string') {
          var btn = this.getButton(id);
        } else if (id instanceof HTMLElement) {
          var btn = id;
        }
        remove(btn);
      }
    }
  })

var _plugins = [];
  app.initPlugins = function () {
    // Initialize plugins
    for (var plugin in app.plugins) {
      var p = app.plugins[plugin](app, app.options[plugin]);
      if (p) _plugins.push(p);
    }
  };
  // Plugin Hooks
  app.pluginHook = function (hook) {
    for (var i = 0; i < _plugins.length; i++) {
      if (_plugins[i].hooks && hook in _plugins[i].hooks) {
        _plugins[i].hooks[hook](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
      }
    }
  };
  // Prevented by plugin
  app.pluginPrevent = function (action) {
    var prevent = false;
    for (var i = 0; i < _plugins.length; i++) {
      if (_plugins[i].prevents && action in _plugins[i].prevents) {
        if (_plugins[i].prevents[action](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5])) prevent = true;
      }
    }
    return prevent;
  };
  // Preprocess content by plugin
  app.pluginProcess = function (action, data) {
    var processed = data;
    for (var i = 0; i < _plugins.length; i++) {
      if (_plugins[i].preprocess && process in _plugins[i].preprocess) {
        processed = _plugins[i].preprocess[process](data, arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
      }
    }
    return processed;
  };


  app.initPlugins();

  // 初始化主DOM框架
  app.Content = new Content(app.contentEl, {
    cacheLength: app.options.cacheLength
  });

  // 导航栏
  if ( app.options.enableNavbar ){
    app.element.className += " enableNavbar";
    app.Navbar = new Navbar(app.navbarEl, {
      tpl: app.options.headerTpl,
      cls: app.options.headerCls
    });
  }
  // 是否启用动画
  if ( app.options.enableTransition ){
    app.element.className += " enableTransition";
  }
  // 是否启用滚动
  if ( app.options.enableScroll ){
    app.element.className += " enableScroll";
  }
  // 是否启用工具栏
  if ( app.options.enableToolbar ){
    app.element.className += " enableToolbar";
  }




  //DOM Event Initial
  if ('onorientationchange' in win) {
    window.addEventListener('onorientationchange', function(e){
      setTimeout(function() {
        app.refreshContent();
        app.trigger('orientaion:change');
        app.log("[Window][Orientaion Change]");
      }, 10);
    }, false);
  }
  window.addEventListener('resize', function(e){
    setTimeout(function() {
      app.refreshContent();
      app.trigger('screen:resize');
      app.log("[Window][Screen Resize]");
    }, 10);
  });

  app.log("[App][Start]");
  app.pluginHook('appInit');
  callback && callback.apply(this, arguments);
  // History监听开始
  app.History.start();
  app.options.initPage && (app.History.navigate(app.options.initPage, {replace: true}))


  //Return instance
  return app;
}

App.prototype.device = (function () {
    var device = {};
    var ua = navigator.userAgent;

    var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
    var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
    var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);

    device.ios = device.android = device.iphone = device.ipad = false;

    // Android
    if (android) {
        device.os = 'android';
        device.osVersion = android[2];
        device.android = true;
    }
    if (ipad || iphone || ipod) {
        device.os = 'ios';
        device.ios = true;
    }
    // iOS
    if (iphone && !ipod) {
        device.osVersion = iphone[2].replace(/_/g, '.');
        device.iphone = true;
    }
    if (ipad) {
        device.osVersion = ipad[2].replace(/_/g, '.');
        device.ipad = true;
    }
    if (ipod) {
        device.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
        device.iphone = true;
    }

    // Webview
    device.webView = (iphone || ipad || ipod) && ua.match(/.*AppleWebKit(?!.*Safari)/i);

    // Minimal UI
    if (device.os && device.os === 'ios') {
        var osVersionArr = device.osVersion.split('.');
        device.minimalUi = !device.webView &&
                            (ipod || iphone) &&
                            (osVersionArr[0] * 1 === 7 ? osVersionArr[1] * 1 >= 1 : osVersionArr[0] * 1 > 7) &&
                            $('meta[name="viewport"]').length > 0 && $('meta[name="viewport"]').attr('content').indexOf('minimal-ui') >= 0;
    }

    // Check for status bar and fullscreen app mode
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    device.statusBar = false;
    if (
        device.webView &&
        (
            // iPhone 5
            (windowWidth === 320 && windowHeight === 568) ||
            (windowWidth === 568 && windowHeight === 320) ||
            // iPhone 4
            (windowWidth === 320 && windowHeight === 480) ||
            (windowWidth === 480 && windowHeight === 320) ||
            // iPad
            (windowWidth === 768 && windowHeight === 1024) ||
            (windowWidth === 1024 && windowHeight === 768)
        )
    ) {
        device.statusBar = true;
    }
    else {
        device.statusBar = false;
    }

    // Pixel Ratio
    device.pixelRatio = window.devicePixelRatio || 1;

    // Add html classes
    if (device.os) {
        var className = device.os +
                        ' ' +
                        device.os + '-' + device.osVersion.split('.')[0] +
                        ' ' +
                        device.os + '-' + device.osVersion.replace(/\./g, '-');
        if (device.os === 'ios') {
            var major = parseInt(device.osVersion.split('.')[0], 10);
            for (var i = major - 1; i >= 6; i--) {
                className += ' ' + 'ios-gt-' + i;
            }
        }
        $('html').addClass(className);
    }
    if (device.statusBar) {
        $('html').addClass('with-statusbar-overlay');
    }
    else {
        $('html').removeClass('with-statusbar-overlay');
    }

    // Export object
    return device;
})();


module.exports = App;
