
  var App = require('../index.js'),
    $ = require('anima-yocto'),
    expect = require('expect.js');
  var app;


  var html = $('<link rel="stylesheet" type="text/css" href="https://a.alipayobjects.com/anima/dpl/1.1.0/amui.css" media="all"><style>html, body {    margin: 0;    padding: 0;    width:100%;    height:100%;}ul, ol {    -webkit-margin-before: 0;    -webkit-margin-after: 0;    -webkit-margin-start: 0;    -webkit-margin-end: 0;    -webkit-padding-before: 0;    -webkit-padding-after: 0;    -webkit-padding-start: 0;    -webkit-padding-end: 0;}body * {    -webkit-text-size-adjust:none;    -webkit-tap-highlight-color: rgba(0,0,0,0);}.navbar {    -webkit-box-sizing: border-box;    position: relative;    width: 100%;    z-index: 99;    top: 0;    left: 0;}.toolbar {    position: relative;    z-index: 99;}.viewport {    width: 100%;    min-height: 100%;}.viewport > .navbar {    display: none;}.viewport > .content {  position: relative;    overflow: auto;    width: auto;    height: auto;}.viewport > .toolbar {    display: none;}.viewport > .content > .wrap,    .viewport > .content > .wrap > .active,        .viewport > .content > .wrap > .inactive {    width: 100%;    min-height: 100%;}.viewport > .content > .wrap > .active{    display: block;}.viewport > .content > .wrap > .inactive{    display: none;}.viewport > .content > .trans {    display: none;    background: transparent;    position: absolute;    width: 100%;    height: 100%;    left: 0;    top: 0;    overflow: hidden;    z-index: 9999;}.viewport > .content > .trans > div {    position: absolute;    width: 100%;    height: 100%;}.viewport.enableNavbar > .navbar {    display: block;}.viewport.enableToolbar > .toolbar {    display: block;}.viewport.enableScroll,    .viewport.enableScroll > .content,    .viewport.enableScroll > .content > .wrap {    position: relative;    overflow-y: hidden;    height: 100%;}.viewport.enableScroll > .content > .wrap {    height: auto;}.viewport.enableTransition,    .viewport.enableTransition > .content,    .viewport.enableTransition > .content > .wrap {    position: relative;    overflow-x: hidden;    width: 100%;}/* 自定义样式 */.viewport {  background: #fff;}.viewport > .content {  background: #ddd;}.viewport > .content > .wrap,.viewport > .content > .wrap > section {  background: #fafafa;}/* 低性能下转场loading样式 */.viewport > .content > .trans > div {  background-color: red;}</style><div class="viewport"><header class="navbar"></header><section class="content"></section><footer class="toolbar"></footer></div>');
  $(html).appendTo('body')
  app = new App(".viewport", {
    enableScroll: true,
    enableNavbar: true,
    enableMessageLog: false,
    enableToolbar: true,
    initPage: "!/test"
  })

  describe('#1 Initialize', function() {


    it('#1001 normal usage', function() {
      expect(app).to.be.ok();
    });
    it('#1002 content', function() {
      expect($(".content section").length).to.equal(5);
    });
    it('#1003 hash', function() {
      expect(location.hash).to.equal("#!/test");
    });
    it('#1004 history', function() {
      expect(app.History.fragment).to.equal("!/test");
    });

  });

  describe('#2 Router', function() {
    var r = false;
    app.router("!/test1", function(){
      r = true
    })
    app.router("!/p1/:id", function(){

      var _self = this;

      this.renderPage({
        title: "免责条款1",
        toolbar: {
          html: '<div class="am-flexbox am-flexbox-average"><div class="am-flexbox-item"><button type="button" class="am-button am-button-white">白色按钮</button></div><div class="am-flexbox-item"><button type="button" class="am-button am-button-blue">蓝色按钮</button></div></div>',
          events: [
            ["click", ".am-button-blue", function(){this.log("I'm blue!");_self.redirect("!/p2/123")}],
            ["click", ".am-button-white", "_btnClick"],
          ]
        },
        startup: function() {
          var _self = this;
          console.log("p1 startup")
          _self.html('<div class="am-button-group"><a class="am-button-group-current" href="#!/p1/123">标签一</a><a href="#!/p2/123">标签二</a><a href="#!/p3/123">标签三</a></div><a data-spm-protocol="i" href="#!/a/123" class="am-button am-button-red">load</a>');
        },
        show: function(){
          console.log("p1 show")
        },
        _btnClick: function(){
          this.log("I'm white")
        }
      })
    })
    it('#2001 add router', function() {
      expect(app.History.handlers).have.length(2);
    });

    it('#2002 navigate', function() {
      app.Router.navigate("!/test1")
      expect(r).to.equal(true);
      app.Router.navigate("!/p1/123")
      expect(app.History.fragment).to.equal("!/p1/123");
    });

    it('#2003 rule', function() {
      var namedParam    = /(\(\?)?(:|\*)\w+/g;
      function test(r, f){
        var route = app.Router._routeToRegExp(r);
        var argName = (r).match(namedParam) || [];
        var arg = app.Router._extractParameters(route, f, argName);

        return [route, arg]
      }
      var rule = [
        ["search/:query/p:page", "search/obama/p2"],
        ["file/*path", "file/nested/folder/file.txt"],
        ["docs/:section(/:subsection)", "docs/faq/installing"]
      ]
      var a = test(rule[0][0], rule[0][1])
      expect(a[0].test("search/obama/p2")).to.equal(true);
      expect( a[1].query ).to.equal("obama");
      expect( a[1].page ).to.equal("2");

      var b = test(rule[1][0], rule[1][1])
      expect(b[0].test("file/nested/folder/file.txt")).to.equal(true);
      expect( b[1].path ).to.equal("nested/folder/file.txt");

      var c = test(rule[2][0], rule[2][1])
      expect(c[0].test("docs/faq/installing")).to.equal(true);
      expect(c[0].test("docs/faq")).to.equal(true);
      expect( c[1].section ).to.equal("faq");


    });

  })

