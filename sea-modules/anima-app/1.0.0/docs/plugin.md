# 开发一个插件
----

## 结构

```javascript
var MyPlugin = function(app, params) {
  return {
    hooks: {}, // Plugin Hooks
    prevents: {}, // Prevented 未注入
    preprocess: {} // Preprocess 未注入
  };
};
```

## 使用

```javascript
var app = new App(".viewport", {
    plugins: {"PluginDemo": MyPlugin}, // 注册插件 {插件名：插件实例}
    PluginDemo: { // 加载插件时可以附加参数
        a : 1,
        b : 2
    }
})
```

## Hooks列表

| Hook Name      |     - |
| :-------- | :--------|
| appInit | 应用初始化 |
| pageReady | page数据初始化 |
| pageStartup | page页面初始化 |
| pageShow | page显示 |
| pageHide | page隐藏 |
| pageTeardown | page销毁 |
| pageBeforeSwitch | 转场开始 |
| pageAfterSwitch | 转场结束 |
| loadStart | 异步加载page开始 |
| loadEnd | 异步加载page结束 |
| addRouter | 注册路由 |

## 插件Demo
```javascript
var MyPlugin = function(params) {
  console.log(params)
  function appInit() {
    // Do something when app fully initialized
    console.log('appInit');
  }
  // Return object
  return {
    // Object contains hooks, all hooks are optional, don't use those you don't need
    hooks: {
      appInit: appInit,
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

## CMD
```javascript
define("MyPlugin", [], function (require, exports, module) {
  module.exports = function(params) {
      console.log(params)
      function appInit() {
        // Do something when app fully initialized
        console.log('appInit');
      }
      // Return object
      return {
        // Object contains hooks, all hooks are optional, don't use those you don't need
        hooks: {
          appInit: appInit,
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
});
```

```javascript
var MyPlugin = require('MyPlugin');
```

```javascript
var app = new App(".viewport", {
    plugins: {"PluginDemo": MyPlugin}, // 注册插件 {插件名：插件实例}
    PluginDemo: { // 加载插件时可以附加参数
        a : 1,
        b : 2
    }
})
```
