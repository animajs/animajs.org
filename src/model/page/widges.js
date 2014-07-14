define(function(require, exports, module){
(function(){
  var aTpl = require('anima-template');

	var tpl = '' +
		'<% for (var i in list) { %>' + 
		'<div class="col-xs-6 col-md-3">' +
		'	<div class="thumbnail">' +
		'	  <img src="<%=list[i].img%>" width="100%" alt="<%=list[i].title%>">' +
		'	  <div class="caption">' +
		'	    <h3><%=list[i].title%></h3>' +
		'	    <p style="height:60px;"><%=list[i].detail%></p>' +
		'	    <p><a href="<%=list[i].doc%>" target="anima-doc" class="doc btn btn-primary" role="button">doc</a> <a href="<%=list[i].demo%>" class="btn btn-default" role="button">demo</a></p>' +
		'	  </div>' +
		'	</div>' +
		'</div>' +
		'<% } %>',
		data = {
			list:[
				{
					img:'./src/img/widget/loading.gif',
					title: 'loading',
					detail:'加载动画的浮层',
					doc:'http://spmjs.io/docs/anima-loading/',
					demo:'http://spmjs.io/docs/anima-app/examples/'
				},
				{
					img:'./src/img/widget/carousel.png',
					title: 'Carousel',
					detail:'也就是Slider，为了区分“滑块”组件，因此命名为Carouse',
					doc:'http://spmjs.io/docs/anima-carousel/',
					demo:'http://spmjs.io/docs/anima-carousel/examples/'
				},
				{
					img:'./src/img/widget/keypicker.gif',
					title: 'keypicker',
					detail:'优化的虚拟键盘，仅支持单一键盘，不支持多键盘切换 ',
					doc:'http://spmjs.io/docs/anima-keypicker/',
					demo:'http://spmjs.io/docs/anima-keypicker/examples/'
				},
				{
					img:'./src/img/widget/chart.png',
					title: 'chart',
					detail:'移动端canvas组件',
					doc:'http://spmjs.io/docs/anima-chart/',
					demo:'http://spmjs.io/docs/anima-chart/examples/'
				},
				{
					img:'./src/img/widget/tabview.png',
					title: 'tabview',
					detail:'选项卡组件',
					doc:'http://spmjs.io/docs/anima-tabview/',
					demo:'http://spmjs.io/docs/anima-tabview/examples/'
				},
				{
					img:'./src/img/widget/list.png',
					title: 'list',
					detail:'列表，根据模板渲染，直接使用Dom 渲染 查找、单选、多选 增删改',
					doc:'http://spmjs.io/docs/anima-list/',
					demo:'http://spmjs.io/docs/anima-list/examples/'
				},
				{
					img:'./src/img/widget/datescroller.png',
					title: 'datescroller',
					detail:'日期组件',
					doc:'http://spmjs.io/docs/anima-datescroller/',
					demo:'http://spmjs.io/docs/anima-datescroller/examples/'
				},
				{
					img:'./src/img/widget/keyboard.png',
					title: 'keyboard',
					detail:'虚拟键盘，数字键盘、全键盘、安全键盘',
					doc:'http://spmjs.io/docs/anima-keyboard/',
					demo:'http://spmjs.io/docs/anima-keyboard/examples/'
				},
				{
					img:'./src/img/widget/gotop.png',
					title: 'gotop',
					detail:'返回页面顶部',
					doc:'http://spmjs.io/docs/anima-gotop/',
					demo:'http://spmjs.io/docs/anima-gotop/examples/'
				},
				{
					img:'./src/img/widget/dialog.png',
					title: 'dialog',
					detail:'模拟native的dialog,prompt,alert',
					doc:'http://spmjs.io/docs/anima-dialog/',
					demo:'http://spmjs.io/docs/anima-dialog/examples/'
				},
				{
					img:'./src/img/widget/toast.png',
					title: 'toast',
					detail:'toast 简单的提示信息，接口跟webview基本保持一致',
					doc:'http://spmjs.io/docs/anima-toast/',
					demo:'http://spmjs.io/docs/anima-toast/examples/'
				},
				{
					img:'./src/img/widget/miniScroll.png',
					title: 'scroll',
					detail:'精简版iscroll实现',
					doc:'http://spmjs.io/docs/anima-scroll/',
					demo:'http://spmjs.io/docs/anima-scroll/examples/'
				}
			]
		};

	$('.J_WidgetList').html(aTpl(tpl,data));
})();
});
