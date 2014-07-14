var PageTransitions = (function() {
  var $main = $( '#pt-main' ),
    $pages = $main.children( 'div.pt-page' ),
    $iterate = $( '.iterateEffects' ),
    pagesCount = $pages.length,
    current = 0,
    goal = 0,
    dir = 1;
    isAnimating = false,
    endCurrPage = false,
    endNextPage = false,
    animEndEventNames = {
      'WebkitAnimation' : 'webkitAnimationEnd',
      'OAnimation' : 'oAnimationEnd',
      'msAnimation' : 'MSAnimationEnd',
      'animation' : 'animationend'
    },
    // animation end event name
    animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ],
    // support css animations
    support = Modernizr.cssanimations;
  
  function init() {

    $pages.each( function() {
      var $page = $( this );
      $page.data( 'originalClassList', $page.attr( 'class' ) );
    } );

    $pages.eq( current ).addClass( 'pt-page-current' );

    $(document).delegate('.iterateEffects', 'click', function() {
      
      goal = $(this).attr('class').split(' ')[1][2];
      if (current == goal) {
        return;
      }
      
      //恢复一下
      $("#iframe").css('display', 'none');
      $("#pt-main").css('display', 'block');

      if( isAnimating ) {
        return false;
      }
      nextPage( goal );
    } );

  }

  function nextPage( animation ) {

    if( isAnimating ) {
      return false;
    }

    isAnimating = true;
    
    var $currPage = $pages.eq( current );

    current = goal;

    var $nextPage = $pages.eq( current ).addClass( 'pt-page-current' ),
      outClass = '', inClass = '';

    // to-do
    switch( dir ) {

      case 1:
        outClass = 'pt-page-moveToTop pt-page-ontop';
        inClass = 'pt-page-scaleUp';
        dir = 2; 
        break;
      case 2:
        outClass = 'pt-page-moveToBottom pt-page-ontop';
        inClass = 'pt-page-scaleUp';
        dir = 1;
        break;
    }
  
    $(document).delegate($currPage.addClass( outClass ), animEndEventName, function() {
      
      $currPage.off( animEndEventName );
      endCurrPage = true;
      if( endNextPage ) {
        onEndAnimation( $currPage, $nextPage );
      }
    } );

    $(document).delegate($nextPage.addClass( inClass ), animEndEventName, function() {
      $nextPage.off( animEndEventName );
      endNextPage = true;
      if( endCurrPage ) {
        onEndAnimation( $currPage, $nextPage );
      }
    } );

    if( !support ) {
      onEndAnimation( $currPage, $nextPage );
    }
  }

  function onEndAnimation( $outpage, $inpage ) {
    endCurrPage = false;
    endNextPage = false;
    resetPage( $outpage, $inpage );
    isAnimating = false;
  }

  function resetPage( $outpage, $inpage ) {
    $outpage.attr( 'class', $outpage.data( 'originalClassList' ) );
    $inpage.attr( 'class', $inpage.data( 'originalClassList' ) + ' pt-page-current' );
  }

  init();

  return { init : init };
})();
