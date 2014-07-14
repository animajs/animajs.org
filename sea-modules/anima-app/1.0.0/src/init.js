
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
