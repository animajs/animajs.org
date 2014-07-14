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

