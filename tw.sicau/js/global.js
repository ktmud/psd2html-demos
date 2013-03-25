var p,_l,_crtPic=1;

$(this).ready(function(){
	$("img[@src$=.png], #right-content .tt, table.system-status-report tr th, h2,#block-views-commonlist-block_10 h2 a,.picture").ifixpng();
	$(".node").corner("bottom");
	$(".tabs-group").corner("bottom");
	$(".comment").corner("top");
	$(".profile").corner("bl");
	$('a[href="/user/login"]').attr("href","/user/login?destination="+window.location.href);
	
	$("input.form-submit").hover(
		function(){$(this).addClass("hover")},
		function(){$(this).removeClass("hover")});
	
	if($.cookie("hinted")==null||$.cookie("hinted").indexOf("searchForm") == -1){
		$("#search-keyword").cluetip({
			cluetipClass: "jackoko",
			showTitle: false,
			local:true,
			dropShadowSteps:  2,
			width: 172,
			sticky: true,
			activation: "focus",
			positionBy: 'fixed', 
			topOffset: -78, 
			leftOffset: -160,
			fx: {
				open: "fadeIn",
				openSpeed :　200
			},
			onShow: function(){
				$(".cluetip-arrows, #cluetip-close").ifixpng();
				$.cookie("hinted", "searchForm", { expires: 365 });
						}
		});
	}
	$("#search-keyword").focus(function(){
			if($(this).val()=="搜索..."){
			$(this).val("");
			}
		});
	if($(".main-nav .active").length==0){
		$(".main-nav li:first").addClass("active");
		_l = 212;
	}else{
		_l = $(".main-nav .active").offset().left - $("#all").offset().left - 7;
		if($(".main-nav .active").is(".first")){
			_l += 32;
		}else{
			_l += 50;
		}
	}
	
	p = _l;
	
	//为IE7以下浏览器屏蔽掉高级效果
	if($.browser.msie&&parseInt($.browser.version)<7){
	}else if($.browser.msie&&parseInt($.browser.version)==7){
	}else{
		$("head").append("<link type=\"text/css\" rel=\"stylesheet\" media=\"all\" href=\"\/sites\/all\/themes/twred\/css\/extra.css\" \/>");
		$("ul.tab-tt li").each(function(i){
					$(this).prepend("<span class='l sd'></span><span class='r sd'></span>");
										});
	}
	
	$("<div id=\"main-nav-pointer\"><\/div>").css("left",_l).appendTo("#brand").fadeIn(1000).fadeTo(500,0.5);
	
	setNavEvents();
	
	if($(".pic-slider").length>0){
		setPicSliderEvents();
	}
	
	if($("#hotlinks-list").length>0){
		setHotLinksEvents();
	}
	
	//标签卡式
	if($("ul.tab-tt").length>0){
		setTabEvents();
	};
	
	$("ul.common-list > li:odd").addClass("alt");
	
	$("ul.menu li.expanded").hover(
		function(){
			$(this).addClass("hover").children("ul.menu").show();
					},
		function(){
			$(this).removeClass("hover").children("ul.menu").hide();
					});
	
	fixHeight();	//修正主要栏目绝对定位和相对定位
});



setNavEvents = function(){
		$(".main-nav").hover(function(){menuOver()},function(){menuOut()});
		$(".main-nav a").mouseover(function(){
								_l = $(this).offset().left - $("#all").offset().left - 7;
								if($(this).parent().is(".first")){
										_l += 32;
									}else{
										_l += 50;
									}
								try {
									clearTimeout(_mtimeOut2);
								} catch(_e) {};
								_mtimeOut2 = setTimeout(function(){pointThis(_l);},200);
								});

};

setTabEvents = function(){
		$("ul.tab-tt li").click(function(){
				$("<div class=\"loading\"><\/div>").appendTo($(this).parents(".tabs-group")).fadeTo(300,0.5).fadeTo(3000,0.2);
				if($(this).parent().hasClass("ajax") && !$(this).hasClass("active")){
					var args = this.className.split(" ");
					// args[0]=view_name
					// args[1]=view_display_id
					
					var _url = "/views/ajax?page=0&view_name="+args[0]+"&view_display_id="+args[1]+"&view_args=all&"+new Date();
					$.getJSON(_url, 
						function(json){
							  $(json.display).replaceAll($("."+args[1]).parents(".tabs-group")).corner("bottom");
							  setTabEvents();
							  $("ul.common-list > li:odd").addClass("alt");
							  $(".loading").remove();
						});
					return false;
				};
				$(this).addClass("active").siblings().removeClass("active");
			})
};


setHotLinksEvents = function(){
				_ltimeOut = setTimeout("scrollHotLinks()",6000);
				$("#hotlinks-list").hover(
						function(){
							try {
								clearTimeout(_ltimeOut);
							} catch(_e) {}},
						function(){
							_ltimeOut = setTimeout("scrollHotLinks()",3000);
							})
};


function scrollHotLinks(){
				$("#hotlinks-list li:first")
					.animate({"marginTop": "-=60px"},1000,function(){
							$(this).css("marginTop","").insertAfter("#hotlinks-list li:last")
							});
				
				_ltimeOut = setTimeout("scrollHotLinks()",3000);
};

menuOver = function() {
		$("#main-nav-pointer").fadeTo(400,1);
		try {
			clearTimeout(_mtimeOut);
		} catch(_e) {}
	};

menuOut = function() {
		 	_mtimeOut = setTimeout("pointerGoBack()",800);
			try {
				clearTimeout(_mtimeOut2);
			} catch(_e) {}
	};
	
function pointerGoBack (){
		$("#main-nav-pointer").stop().animate({left: p,opacity:0.5},1000)
};

function pointThis(_l){
		$("#main-nav-pointer").stop().animate({left: _l},600)
};

setPicSliderEvents = function(){
				setTimeout("picAutoSlide()",4000);
				$("#pic-slider-1 h4").after("<div id=\"bg-pic-slider-title\"><\/div>");
				$(".pic-slider").hover(function(){picOver()},function(){picOut()});
				$(".pic-slider-goto li a").focus(function(){$(this).addClass("focus")})
										.blur(function(){$(this).removeClass("focus")})
										.click(function(){
												var _c = this.className;
												_crtPic = parseInt($(this).text());
												if(_c.indexOf("active")==-1){
													picThis(_crtPic);
													return false
												}else{
													return false
												}
														});
};

function picAutoSlide(){
	picThis(_crtPic);
	if(_crtPic<4){
		_crtPic++
	}else{
		_crtPic = 1
	}
	_ptimeOut = setTimeout("picAutoSlide()",5000);
};

picOver = function() {
		try {
			clearTimeout(_ptimeOut);
		} catch(_e) {}
	};

picOut = function() {
		 	_ptimeOut = setTimeout("picAutoSlide()",5000);
	};
	
function picThis(_crtPic){
	_id = "#pic-slider-" + _crtPic;
	_class = ".pic-slider-" + _crtPic;
	$(".pic-slider-goto a").removeClass("active");
	$(".pic-slider-goto a"+_class).addClass("active");
	$(".pic-slider-list li").fadeTo(200,0.2).removeClass("active");
	$("#bg-pic-slider-title").stop().fadeTo(200,0).insertAfter(_id+" h4").fadeTo(300,0.9).fadeTo(500,0.5);
	$(_id).fadeTo(400,1).addClass("active");
	try {
			clearTimeout(_ptimeOut);
		} catch(_e) {}
};

//保证始终是最高的元素为相对定位，以使底部不会飘到上面来。

fixHeight = function(){
	var _h = 60;
	var _h_obj = "";
	$("#main-contents > div").each(function(i){
										if(_h < $(this).height()){
											_h = $(this).height();
											_h_obj = this;
										}}
									);
	if( _h_obj.id == "left-content" ){
		$(_h_obj).css({"position":"relative","marginTop":-$("#first-content").height()});
	}	
};