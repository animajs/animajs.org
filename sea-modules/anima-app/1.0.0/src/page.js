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

