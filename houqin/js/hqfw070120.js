$(document).ready(
	function(){
		$('img[@src$=.png], input#searchGo').ifixpng();
		$('#showHotLinks').toggle(
			function(){
				$('#hotLinks').slideDown();
				$('#showHotLinks img').attr("title","点击收缩友情链接");
				$('#bg-leftBar').animate({
										 height:"+=140px"
										 })
				},function(){
					$('#hotLinks').slideUp();
					$('#showHotLinks img').attr("title","点击展开友情链接");
					$('#bg-leftBar').animate({
										 height:"-=140px"
										 })
				});
		$('#wideContents h2').corner();
		$('#doubleBox .bg').corner("8px");	
		$('#secondGroup .bg').corner("#629129 8px bottom");
		$('#tips .bg').corner("#eff0d0 20px bl tr");
		$('#introGlow').corner("#629129 13px tl bl br");
			})