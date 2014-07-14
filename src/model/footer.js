(function(){

var tpl = ''+
'      <!--FLOOR 导航-->'+
'      <div id="J_StickyWrapper" class="sticky-wrapper">'+
'         <div class="main-header">'+
'            <div class="container">'+
'               <!-- TopNav Start -->'+
'               <div class="topnav navbar-header">'+
'                  <a class="navbar-toggle down-button" data-toggle="collapse" data-target=".slidedown">'+
'                     <span class="icon-bar"></span>'+
'                     <span class="icon-bar"></span>'+
'                     <span class="icon-bar"></span>'+
'                  </a> '+
'               </div>'+
'               <!-- TopNav End -->'+
'               <!-- Logo Start -->'+
'               <div class="logo pull-left">'+
'                  <h1>'+
'                     <a href="index.html">'+
'                        <img src="img/logo.png" alt="AnimaJS" width="144" height="57">'+
'                     </a>'+
'                  </h1>'+
'               </div>'+
'               <!-- Logo End -->'+
'               <!-- Menu Start -->'+
'               <nav class="collapse navbar-collapse menu">'+
'                  <ul class="nav navbar-nav sf-menu sf-js-enabled sf-arrows">'+
'                     <li class="">'+
'                        <a href="index.html"{{=it.index}}>'+
'                           <span class="sf-sub-indicator">'+
'                           Home'+
'                           </span>'+
'                           <i class="icon-angle-down ">'+
'                              <img src="http://gtms03.alicdn.com/tps/i3/T1PakPFFxXXXbpm9Pe-40-34.png"/>'+
'                           </i>'+
'                        </a>'+
'                     </li>'+
'                     <li class="">'+
'                        <a href="start.html"{{=it.start}}>'+
'                           <span class="sf-sub-indicator">'+
'                           Start'+
'                           </span>'+
'                           <i class="icon-angle-down ">'+
'                              <img src="http://gtms02.alicdn.com/tps/i2/T1NaZJFTtbXXamt9jd-34-34.png"/>'+
'                           </i>'+
'                        </a>'+
'                     </li>'+
'                     <li class="">'+
'                        <a href="repository.html"{{=it.repository}}>'+
'                           <span class="sf-sub-indicator">'+
'                           Repository'+
'                           </span>'+
'                           <i class="icon-angle-down ">'+
'                              <img src="http://gtms03.alicdn.com/tps/i3/T1UvoLFS8cXXXjA8Pc-31-34.png"/>'+
'                           </i>'+
'                        </a>'+
'                     </li>'+
'                     <li class="">'+
'                        <a href="tools.html"{{=it.tools}}>'+
'                           <span class="sf-sub-indicator">'+
'                           Tools'+
'                           </span>'+
'                           <i class="icon-angle-down ">'+
'                              <img src="http://gtms02.alicdn.com/tps/i2/T1XHMMFG8aXXamt9jd-34-34.png"/>'+
'                           </i>'+
'                        </a>'+
'                     </li>'+
'                     <li class="">'+
'                        <a href="demo.html"{{=it.demo}}>'+
'                           <span class="sf-sub-indicator">'+
'                           DEMO'+
'                           </span>'+
'                           <i class="icon-angle-down ">'+
'                              <img src="http://gtms03.alicdn.com/tps/i3/T1wIcPFIhXXXcgHRjb-25-34.png"/>'+
'                           </i>'+
'                        </a>'+
'                     </li>'+
'                     <li>'+
'                        <a href="contact.html"{{=it.contact}}>'+
'                           <span class="sf-sub-indicator">'+
'                           Contact'+
'                           </span>'+
'                           <i class="icon-angle-down ">'+
'                              <img src="http://gtms04.alicdn.com/tps/i4/T18jUKFMtdXXXnrHPe-35-34.png"/>'+
'                           </i>'+
'                        </a>'+
'                     </li>'+
'                  </ul>'+
'               </nav>'+
'               <!-- Menu End --> '+
'            </div>'+
'         </div>'+
'      </div>';

   //根据当前config.js的引用路径来获取myloan的use路径
   var scripts = document.getElementsByTagName('script'),
      items = {'index':'','start':'','repository':'','tools':'','demo':'','contact':''};

   for(var i in items){
      if ( location.href.indexOf(i) !== -1 ){
         items[i] = ' class="current"';
      }
   }

   $(scripts).before(doT.template(tpl)(items)).remove();

   //吊顶
   var header = new Headroom(document.querySelector("#J_StickyWrapper"), {
      tolerance: 5,
      offset : 205,
      classes: {
         initial: "animated",
         pinned: "slideDown",
         unpinned: "slideUp"
      }
   });
   header.init();

   jQuery('.navbar-toggle').click(function(){
        if (!jQuery('.menu').height()) {
            jQuery('.menu').height(260);
        } else {
            jQuery('.menu').height(0);
        }
    });
})();
