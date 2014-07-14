
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










