# Anima-App 介绍
----

[![spm version](http://spmjs.io/badge/anima-app)](http://spmjs.io/package/anima-app)

## 文档
- [5分钟开发一个SPA(Single Page Application)应用](./docs/howto-use.md)
- [开发一个插件](./docs/plugin.md)




## Usage

#### Javascript
```javascript
seajs.use('anima-app', function(App) {
    var app = new App(selector, config, callback);
}
```

#### Html
```html
<div class="viewport">
  <header class="navbar"></header>
  <section class="content"></section>
  <footer class="toolbar"></footer>
</div>
```

#### Css
```css
html, body {
    margin: 0;
    padding: 0;
    width:100%;
    height:100%;
}
ul, ol {
    -webkit-margin-before: 0;
    -webkit-margin-after: 0;
    -webkit-margin-start: 0;
    -webkit-margin-end: 0;
    -webkit-padding-before: 0;
    -webkit-padding-after: 0;
    -webkit-padding-start: 0;
    -webkit-padding-end: 0;
}
body * {
    -webkit-text-size-adjust:none;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
}
.navbar {
    -webkit-box-sizing: border-box;
    position: relative;
    width: 100%;
    z-index: 99;
    top: 0;
    left: 0;
}
.toolbar {
    position: relative;
    z-index: 99;
}
.viewport {
    width: 100%;
    min-height: 100%;
}
.viewport > .navbar {
    display: none;
}
.viewport > .content {
  position: relative;
    overflow: auto;
    width: auto;
    height: auto;
}
.viewport > .toolbar {
    display: none;
}
.viewport > .content > .wrap,
    .viewport > .content > .wrap > .active,
        .viewport > .content > .wrap > .inactive {
    width: 100%;
    min-height: 100%;
}
.viewport > .content > .wrap > .active{
    display: block;
}
.viewport > .content > .wrap > .inactive{
    display: none;
}
.viewport > .content > .trans {
    display: none;
    background: transparent;
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    overflow: hidden;
    z-index: 9999;
}
.viewport > .content > .trans > div {
    position: absolute;
    width: 100%;
    height: 100%;
}
.viewport.enableNavbar > .navbar {
    display: block;
}
.viewport.enableToolbar > .toolbar {
    display: block;
}
.viewport.enableScroll,
    .viewport.enableScroll > .content,
    .viewport.enableScroll > .content > .wrap {
    position: relative;
    overflow-y: hidden;
    height: 100%;
}
.viewport.enableScroll > .content > .wrap {
    height: auto;
}
.viewport.enableTransition,
    .viewport.enableTransition > .content,
    .viewport.enableTransition > .content > .wrap {
    position: relative;
    overflow-x: hidden;
    width: 100%;
}

/* 自定义样式 */
.viewport {
  background: #fff;
}
.viewport > .content {
  background: #ddd;
}
.viewport > .content > .wrap,
.viewport > .content > .wrap > section {
  background: #fafafa;
}
/* 低性能下转场loading样式 */
.viewport > .content > .trans > div {
  background-color: red;
}
```

## Config

```javascript
{
    enableScroll: false,  // 是否开启滚动
    enableNavbar: false,  // 是否开启导航栏
    enableToolbar: false,  // 是否开启工具栏
    enableTransition: true,  // 是否开启转场动画
    enableMessageLog: false,  // 是否输出日志
    raiseErrors: false,  // 是否提高错误警告级别
    headerCls: "am-header",  // 导航栏样式名
    cacheLength: 5,  // 内容区缓存page数
    plugins: {}, // 插件模块
    initPage: "", // 默认hash
    transTimes: 300, // 转场动画时间
    highAnims: false, // 更牛逼的动画，性能差机器慎用
    headerTpl: {  // 导航栏模板
      title: '<h1>{title}</h1>',  // title模板
      btnLeft: '<a class="am-header-reverse am-header-reverse-btn">{text}</a>',  // 左侧按钮模板
      btnRight: '<a class="am-header-operate am-header-operate-btn">{text}</a>'  // 右侧按钮模板
    }
}
```

## App方法

```javascript
    this.router(route, name, callback);
    this.refreshContent();
    this.getPage(name);
    this.use(function);
    this.log(massage);
    this.error(massage);
```


## Route
### Rule
```javascript
search/:query/p:page
#search/obama/p2 // ==> {query: "obama", page: 2}
```

```javascript
file/*path
#file/nested/folder/file.txt // ==> {path: "nested/folder/file.txt"}
```

```javascript
docs/:section(/:subsection)
#docs/faq/installing // ==> {section: "faq", subsection: "installing"}
```

### Registration
```javascript
this.router(routeRule, routeName, function(){
    this.getParameter(name) // 获取指定参数
    this.getParameters() // 获取所有参数
    this.renderPage(page) // 渲染Page
    this.load(url) // 异步获取Page配置并渲染  url = url or model name
    this.getReferer() // 获取来源
    this.redirect(route, options) // 跳转  route：地址  options = {data:{/*传递参数*/}}
}
```

## Page

### Config
```javascript
title : "标题", //设置标题
buttons: [ // 导航栏按钮
    {
      id: 'haha', // 按钮id
      type: 'right', // 按钮类别 left or right or back
      text: 'TEST', // 按钮文字
      hide: false, // 是否隐藏
      handler: function() { // 按钮事件
        this.log("click button")
      }
    }
],
events: [ // page事件绑定
      ["click", ".am-button-blue", function(){this.log("I'm blue!")}] // event type, selector, function or this[function name],
toolbar: {
    html: '<div class="am-flexbox am-flexbox-average"><div class="am-flexbox-item"><button type="button" class="am-button am-button-white">白色按钮</button></div><div class="am-flexbox-item"><button type="button" class="am-button am-button-blue">蓝色按钮</button></div></div>', // 工具栏html
    el: window.document.createElement('div'), // 工具栏node节点, 和html二选一
    events: [ // 工具栏事件绑定
      ["click", ".am-button-blue", function(){this.log("I'm blue!")}] // event type, selector, function or this[function name]
    ]
}
ready : function() {/*page准备完毕*/},
startup : function() {/*第一次渲染*/},
teardown : function() {/*销毁*/},
show : function() {/*展示*/},
hide : function() {/*隐藏*/},
_youself: function(){/*自定义方法*/}
```



## Events

```javascript
var object = {};

_.extend(object, app.Events);

object.on("alert", function(msg) {
  alert("Triggered " + msg);
});

object.trigger("alert", "an event");
```

- **on** _object.on(event, callback, [context])_
    > Bind a callback function to an object. The callback will be invoked whenever the event is fired. If you have a large number of different events on a page, the convention is to use colons to namespace them: "poll:start", or "change:selection". The event string may also be a space-delimited list of several events...

    ```javascript
    book.on("change:title change:author", ...);
    ```
    > To supply a context value for this when the callback is invoked, pass the optional third argument: model.on('change', this.render, this)

    > Callbacks bound to the special "all" event will be triggered when any event occurs, and are passed the name of the event as the first argument. For example, to proxy all events from one object to another:

    ```javascript
    proxy.on("all", function(eventName) {
      object.trigger(eventName);
    });
    ```

- **off** _object.off([event], [callback], [context])_

    > Remove a previously-bound callback function from an object. If no context is specified, all of the versions of the callback with different contexts will be removed. If no callback is specified, all callbacks for the event will be removed. If no event is specified, callbacks for all events will be removed.

    ```javascript
    // Removes just the `onChange` callback.
    object.off("change", onChange);

    // Removes all "change" callbacks.
    object.off("change");

    // Removes the `onChange` callback for all events.
    object.off(null, onChange);

    // Removes all callbacks for `context` for all events.
    object.off(null, null, context);

    // Removes all callbacks on `object`.
    object.off();
    ```

- **trigger** _object.trigger(event, [*args])_
    > Trigger callbacks for the given event, or space-delimited list of events. Subsequent arguments to trigger will be passed along to the event callbacks.

- **once** _object.once(event, callback, [context])_
    > Just like on, but causes the bound callback to only fire once before being removed. Handy for saying "the next time that X happens, do this".

- **listenTo** _object.listenTo(other, event, callback)_
    > Tell an object to listen to a particular event on an other object. The advantage of using this form, instead of other.on(event, callback, object), is that listenTo allows the object to keep track of the events, and they can be removed all at once later on. The callback will always be called with object as context.

    ```javascript
    view.listenTo(model, 'change', view.render);
    ```

- **stopListening** _object.stopListening([other], [event], [callback])_
    > Tell an object to stop listening to events. Either call stopListening with no arguments to have the object remove all of its registered callbacks ... or be more precise by telling it to remove just the events it's listening to on a specific object, or a specific event, or just a specific callback.

    ```javascript
    view.stopListening();
    view.stopListening(model);
    ```

- **listenToOnce** _object.listenToOnce(other, event, callback)_

    >Just like listenTo, but causes the bound callback to only fire once before being removed.


## Device

| app.device      |     type |       |
| :-------- | :------:| :-------- |
| app.device.os | string |  Contains "android" (for Android), "ios" (for iOS), undefined (for any other OS/platform) |
| app.device.osVersion | string | Contains version of operating system. Available only for Android and iOS devices. For example, if it is iOS device with iOS version 7.1 then it will contain "7.1". |
| app.device.iso | boolean | Contains true for iOS device, otherwise contains false |
| app.device.android | boolean | Contains true for Android device, otherwise contains false |
| app.device.ios | boolean | Contains true for iOS device, otherwise contains false |
| app.device.ipad | boolean | Contains true for iPad, otherwise contains false |
| app.device.iphone | boolean | Contains true for iPhone/iPod Touch, otherwise contains false |
| app.device.pixelRatio | number | Returns device screen pixel ratio. Actually it is a shortcut of window.devicePixelRatio |
| app.device.webView | boolean | Contains true if app runs in UIWebView - webapp installed to home screen or phone gap. |
| app.device.minimalUi | boolean | Contains true if minimal-ui mode is enabled: web app running in browser on iPhone/iPod with iOS 7.1+ and minimal-ui viewport meta tag value. |
| app.device.statusBar | boolean | Contains true if app running in full-screen mode and requires for Status bar overlay. iOS only |


> Also this Device detecting library adds additional classes on <html> element which can help you with different CSS styles for different OS and platforms.

So if you open app with iOS 7.1 device you will have the following classes:
```html
<html class="ios ios-7 ios-7-1 ios-gt-6">
...
```
If you open app with iOS 7.1 device and your app running in full screen mode (myApp.device.statusBar = true):
```html
<html class="ios ios-7 ios-7-1 ios-gt-6 with-statusbar-overlay">
...
```
If you open app with iOS 8.0 device and your app running in full screen mode (myApp.device.statusBar = true):
```html
<html class="ios ios-8 ios-8-0 ios-gt-6 ios-gt-7 with-statusbar-overlay">
...
```
If you open app with Android 4.4 device you will have the following classes:
```html
<html class="android android-4 android-4-4">
...
```
In other words class calculated by the following rule:
```html
<html class="[os] [os major version] [os full version] [with-statusbar-overlay]">
...
```
> Note that "greater than" (ios-gt-6: for all iOS greater than iOS 6) classes available only for iOS


## Plugin


#### Usage
```javascript
var app = new App(".viewport", {
    plugins: {"PluginDemo": MyPlugin},
    PluginDemo: { // Plugin params
        a : 1,
        b : 2
    }
})
```

#### Define
```javascript
var MyPlugin = function(app, params) {
  console.log(params)
  function appInit() {
    // Do something when app fully initialized
    console.log('appInit');
  }
  // Return object
  return {
    // Object contains hooks, all hooks are optional, don't use those you don't need
    hooks: {
      appInit: appInit, // app initialized
      pageReady: function (navbar, pageData) {
          console.log('pageReady', pageData);
      },
      pageStartup: function (pageData) {
          console.log('pageStartup', pageData);
      },
      pageShow: function (pageData) {
          console.log('pageShow', pageData);
      },
      pageHide: function (pageData) {
          console.log('pageHide', pageData);
      },
      pageTeardown: function (pageData) {
          console.log('pageTeardown', pageData);
      },
      pageBeforeSwitch: function (pageData) {
          console.log('pageBeforeSwitch', pageData);
      },
      pageAfterSwitch: function (pageData) {
          console.log('pageBeforeSwitch', pageData);
      },
      loadStart: function (url) {
          console.log('load', url);
      },
      loadEnd: function (url, config) {
          console.log('load', url, config);
      },
      addRouter: function (route) {
          console.log('addRouter', route);
      }
    }
  };
};
```

#### Hook

- appInit
- pageReady
- pageStartup
- pageShow
- pageHide
- pageTeardown
- pageBeforeSwitch
- pageAfterSwitch
- loadStart
- loadEnd
- addRouter
