var stickyClone;
var crt = 0;

$("#aggregator .feed-item:first").addClass("current");

$("#feed-tool a").click(function(){
	var id = this.hash;
	if(id=="#prev"){
		if(crt==0){
			$.scrollTo($(".feed-item")[0]||'.main-nav',600);
		}else{
			$.scrollTo($(".feed-item")[crt-1],1000);
		}
	}else if(id=="#next"){
		if(crt>=$(".feed-item").length - 1){
			return false;
		}else{
			$.scrollTo($(".feed-item")[crt+1],1000);
		}
	}else{
		$.scrollTo(id,1000);
	}
	return false;
})


$('div.sticky-enabled .needSticky:not(.processed)').each(function () {
    // Clone thead so it inherits original jQuery properties.
    stickyClone = $(this).clone(true).insertBefore(this).wrap('<div class="sticky-div above"></div>');

    stickyClone = $(stickyClone)[0];

    // Store parent doh_bar.
    var doh_bar = $("#left-content")[0];
    stickyClone.doh_bar = doh_bar;
    // Finish initialzing header positioning.
    tracker(stickyClone);

    $(doh_bar).addClass('sticky-doh_bar');
    $(this).addClass('processed');
  });

  // Track positioning and visibility.
  function tracker(e) {
    // Save positioning data.
    var viewHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
	
    if (e.viewHeight != viewHeight) {
      e.viewHeight = viewHeight;
      e.vPosition = $("div.sticky-enabled").offset().top + 6;
      e.hPosition = $("#left-content").offset().left;
      e.vLength = $("#first-content").height() - 100;
      // Resize header and its cell widths.
      var parentCell = $('th', e.doh_bar);
      $('th', e).each(function(index) {
        var cellWidth = parentCell.eq(index).css('width');
        // Exception for IE7.
        if (cellWidth == 'auto') {
          cellWidth = parentCell.get(index).clientWidth +'px';
        }
        $(this).css('width', cellWidth);
      });
      $('.sticky-div').css('width', $(e.doh_bar).css('width'));
    }
	
	$(".feed-item").each(function(i){
			var iH  = (document.documentElement.scrollTop || document.body.scrollTop) - $(this).offset().top;
			if( iH>=0 && iH<$(this).height() ){
				crt = i;
			}
		})

    // Track horizontal positioning relative to the viewport and set visibility.
    var hScroll = document.documentElement.scrollLeft || document.body.scrollLeft;
    var vOffset = (document.documentElement.scrollTop || document.body.scrollTop) - e.vPosition;
	var vOpacity = 0;
	if(vOffset > 0){
		vOpacity = vOffset/200;
	}else{
	}
    $('.sticky-div').css({left: -hScroll + e.hPosition +'px',opacity: vOpacity});
	if($('.sticky-div').css("position")=="absolute"){
		 $('.sticky-div').css({left:"0px",top:"0px"});
	}
	
  }

  // Only attach to scrollbars once, even if Drupal.attachBehaviors is called
  //  multiple times.
$(window).scroll(function() {
      tracker(stickyClone);
 	});
$(document).scroll(function() {
      tracker(stickyClone);
 	});
