
jQuery(document).ready(function () {


/*----------------------------------------------------*/
/*	Revolution Slider Nav Arrow Show Hide
/*----------------------------------------------------*/

    jQuery(document).ready(function(){
      jQuery('#J_HomeSilder').bxSlider({
        mode:'fade'
      });
    });

    jQuery('#J_DEMOButton').click(function(){
        jQuery('#J_DEMO').attr('src','http://h5.m.taobao.com/bx/vbaocenter.html?itemId=5001');
    });

    jQuery('#J_Floor0').mouseenter(function(){
        jQuery('.bx-controls-direction').show();
    })
    jQuery('#J_Floor0').mouseleave(function(){
        jQuery('.bx-controls-direction').hide();
    })
});
