(function(){

var tpl = '' +
'' +
'   <div class="pt-page pt-page1">' +
'      <!--FLOOR 首屏 Slider Start-->' +
'      <div class="floor-0" id="J_Floor0">' +
'         <ul class="bxslider" id="J_HomeSilder">' +
'           <li>' +
'            <div class="silider-box">' +
'               <div class="container">' +
'                  <div class="container-box">' +
'                     <img style="margin:20px auto 0;display:block;" src="./src/img/a.png"/>' +
'                     <div><img style="margin:20px auto 0;display:block;" src="./src/img/bt.png"/></div>' +
'                  </div>' +
'               </div>' +
'            </div>' +
'           </li>' +
'           <li>' +
'            <div class="silider-box container">' +
'               <div class="container">' +
'                  <div class="container-box">' +
'                     <img style="margin:20px auto 0;display:block;" src="./src/img/B.png"/>' +
'                  </div>' +
'               </div>' +
'            </div>' +
'           </li>' +
'           <li>' +
'            <div class="silider-box container">' +
'               <div class="container">' +
'                  <div class="container-box">' +
'                     <img style="margin:20px auto 0;display:block;" src="./src/img/C.png"/>' +
'                  </div>' +
'               </div>' +
'            </div>' +
'           </li>' +
'         </ul>' +
'         <div class="container">' +
'            <div id="J_IndexDEMO" class="index-demo-box">' +
'               <div class="index-demo-content">' +
'                  <iframe id="J_DEMO" src="http://h5.m.taobao.com/bx/vbaocenter.html?itemId=5001" width="320" height="480" style="border:0;"></iframe>' +
'               </div>' +
'               <a id="J_DEMOButton" class="index-demo-button"></a>' +
'            </div>' +
'         </div>' +
'      </div>' +
'' +
'      <!--FLOOR 间隔带-->' +
'      <div class="middle-line">' +
'         <div style="position: relative;z-index: -1; width:100%; height:100%; background:url(./src/img/img-bg.jpg) repeat 50% -300px; background-size:100%; "></div>' +
'      </div>' +
'' +
'      <!--FLOOR 分享 -->' +
'      <div class="middle-share">' +
'         <div class="container">' +
'            ' +
'         </div>' +
'      </div>' +
'      ' +
'      <!--FLOOR 优点 -->' +
'      <div class="main-content">' +
'         <div class="container">' +
'            <div class="row">' +
'               <div class="col-lg-4 col-md-4 col-sm-4">' +
'                  <div class="content-box big ch-item bottom-pad-small" style="min-height: 340px;">' +
'                     <div class="ch-info-wrap">' +
'                        <div class="ch-info">' +
'                           <div class="ch-info-front ch-img-1"><i class="icon-fullscreen"></i></div>' +
'                           <div class="ch-info-back">' +
'                              <i class="icon-fullscreen"></i>' +
'                           </div>' +
'                        </div>' +
'                     </div>' +
'                     <div class="content-box-info">' +
'                        <h4>完整的生态圈形成强大的力量</h4>' +
'                        <p style="text-align:left;">' +
'                            依托于Arale以及spm3的成熟生态体系，以及强大的社区支持，所有的组件都是开放而成熟的，并且有更多更好的选择以及更大的自由度和想象空间，使你更加容易地站在巨人的肩膀上。' +
'                        </p>' +
'                        <a style="cursor: pointer;">Read More <i class="icon-angle-right"></i><i class="icon-angle-right"></i></a>' +
'                     </div>' +
'                  </div>' +
'               </div>' +
'               <div class="col-lg-4 col-md-4 col-sm-4">' +
'                  <div class="content-box big ch-item bottom-pad-small" style="min-height: 340px;">' +
'                     <div class="ch-info-wrap">' +
'                        <div class="ch-info">' +
'                           <div class="ch-info-front ch-img-1"><i class="icon-eye-open"></i></div>' +
'                           <div class="ch-info-back">' +
'                              <i class="icon-eye-open"></i>' +
'                           </div>' +
'                        </div>' +
'                     </div>' +
'                     <div class="content-box-info">' +
'                        <h4> 更快速，更轻盈，更便捷</h4>' +
'                        <p style="text-align:left;">' +
'                        所有的组件都专门且只针对于移动平台（iOS5+ Android2.3+）特别进行优化和定制，更加专注于主流移动平台，让你的应用极速如飞。' +
'                        </p>' +
'                        <p style="text-align:left;">' +
'                        坚决实行“适度重复、适度灵活”的扁平化设计原则，减少组件依赖，减少耦合复杂度，组件的使用上追求更加轻松便捷的目标' +
'                        </p>' +
'                        <a style="cursor: pointer;">Read More <i class="icon-angle-right"></i><i class="icon-angle-right"></i></a>' +
'                     </div>' +
'                  </div>' +
'               </div>' +
'               <div class="col-lg-4 col-md-4 col-sm-4">' +
'                  <div class="content-box big ch-item bottom-pad-small" style="min-height: 340px;">' +
'                     <div class="ch-info-wrap">' +
'                        <div class="ch-info">' +
'                           <div class="ch-info-front ch-img-1"><i class="icon-edit"></i></div>' +
'                           <div class="ch-info-back">' +
'                              <i class="icon-edit"></i>' +
'                           </div>' +
'                        </div>' +
'                     </div>' +
'                     <div class="content-box-info">' +
'                        <h4> 完善而开放的知识管理体系（Anima KM）</h4>' +
'                        <p style="text-align:left;">' +
'                           知识碎片的输入、取其精粹的输出，反哺到项目中，形成良性循环，打造一个完整的知识流转闭环。' +
'                        </p>' +
'                        <a style="cursor: pointer;">Read More <i class="icon-angle-right"></i><i class="icon-angle-right"></i></a>' +
'                     </div>' +
'                  </div>' +
'               </div>' +
'            </div>' +
'         </div>' +
'      </div>' +
'' +
'      <!--FLOOR 间隔带-->' +
'      <div class="middle-line">' +
'         <div style="position: relative;z-index: -1; width:100%; height:100%; background:url(./src/img/img-bg.jpg) repeat 50% -500px; background-size:100%; "></div>' +
'      </div>' +
'' +
'      <!--FLOOR 文案 -->' +
'      <div style="width:100%;background:#e1f0f0;">' +
'         <div class="container" style="background: none;">' +
'            <div class="featurette">' +
'              <img class="featurette-image pull-right" src="http://gtms03.alicdn.com/tps/i3/T15O.QFJxaXXXiZPbo-600-500.gif">' +
'              <h2 class="featurette-heading">应用场景</h2>' +
'              <H3 class="muted">具有高兼容性的层叠样式</H3>' +
'              <p class="lead">AMUI是支付宝无线端快速建站的解决方案，包含通用样式库、场景解决方案等。</p>' +
'              <div class="btn-group">' +
'                 <button class="btn btn-primary">android</button>' +
'                 <button class="btn btn-primary">IOS</button>' +
'               </div>' +
'            </div>' +
'         </div>' +
'      </div>' +
'' +
'      <!--FLOOR 页尾 -->' +
'      <div class="middle-share">' +
'         <div class="container">' +
'            ' +
'         </div>' +
'      </div>' +
'    </div>';

   //根据当前config.js的引用路径来获取myloan的use路径
   var scripts = document.getElementsByTagName('script');
   $(scripts[scripts.length - 1]).before(tpl).remove();
})();
