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
