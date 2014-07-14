module.exports = {
  title: "免责条款4444",
  toolbar: {
    html: '<a data-spm-protocol="i" href="#!/form" class="am-button am-button-red">关闭</a>',
  },
  startup: function() {
    var _self = this;
    console.log("p1 startup")
    _self.html('<div class="am-button-group"><a class="am-button-group-current" href="#!/p1/123">标签一</a><a href="#!/p2/123">标签二</a><a href="#!/p3/123">标签三</a></div><a data-spm-protocol="i" href="#!/a/123" class="am-button am-button-red">关闭</a>');
  },
  show: function(){
    console.log("p1 show")
  }
}
