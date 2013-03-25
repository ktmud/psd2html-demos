	// jquery-roundcorners-canvas
	// www.meerbox.nl
	
(function($){
	
	var _corner = function(options) {
		
		// no native canvas support, or its msie and excanvas.js not loaded
		var testcanvas = document.createElement("canvas");
		if (typeof G_vmlCanvasManager == 'undefined' && $.browser.msie) {
			return this.each(function() {});
		}
		
		// get lowest number from array
		var asNum = function(a, b) { return a-b; };
		var getMin = function(a) {
			var b = a.concat();
			return b.sort(asNum)[0];
		};
		
		// get CSS value as integer
		var getCSSint = function(el, prop) {
			return parseInt($.css(el.jquery?el[0]:el,prop))||0;
		};
			
		// draw the round corner in Canvas object
		var drawRoundCornerCanvasShape = function(canvas,radius,r_type,bg_color,border_width,border_color) {
			
			// change rgba(1,2,3,0.9) to rgb(1,2,3)
			var reg = /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/;   
			var bits = reg.exec(bg_color);
			if (bits) {
				channels = new Array(parseInt(bits[1]),parseInt(bits[2]),parseInt(bits[3]));
				bg_color = 'rgb('+channels[0]+', '+channels[1]+', '+channels[2]+')';
			} 
		
			var border_width = parseInt(border_width);
			
			var ctx = canvas.getContext('2d');
			
			if (radius == 1) {
				ctx.fillStyle = bg_color;
				ctx.fillRect(0,0,1,1);
				return;
			}
	
			if (r_type == 'tl') {
				var steps = new Array(0,0,radius,0,radius,0,0,radius,0,0);
			} else if (r_type == 'tr') {
				var steps = new Array(radius,0,radius,radius,radius,0,0,0,0,0);
			} else if (r_type == 'bl') {
				var steps = new Array(0,radius,radius,radius,0,radius,0,0,0,radius);
			} else if (r_type == 'br') {
				var steps = new Array(radius,radius,radius,0,radius,0,0,radius,radius,radius);
			}
	          
			ctx.fillStyle = bg_color;
	    	ctx.beginPath();
	     	ctx.moveTo(steps[0],steps[1]); 
	     	ctx.lineTo(steps[2], steps[3]); 
	    	if(r_type == 'br') ctx.bezierCurveTo(steps[4], steps[5], radius, radius, steps[6], steps[7]); 
	    	else ctx.bezierCurveTo(steps[4], steps[5], 0, 0, steps[6], steps[7]);
			ctx.lineTo(steps[8], steps[9]); 
	        ctx.fill(); 
	        
	        // draw border
	        if (border_width > 0 && border_width < radius) {
		        
		        // offset caused by border
		        var offset = border_width/2; 
		        
		        if (r_type == 'tl') {
					var steps = new Array(radius-offset,offset,radius-offset,offset,offset,radius-offset);
					var curve_to = new Array(0,0);
				} else if (r_type == 'tr') {
					var steps = new Array(radius-offset,radius-offset,radius-offset,offset,offset,offset);
					var curve_to = new Array(0,0);
				} else if (r_type == 'bl') {
					var steps = new Array(radius-offset,radius-offset,offset,radius-offset,offset,offset,offset,radius-offset);
					var curve_to = new Array(0,0);
				} else if (r_type == 'br') {
					var steps = new Array(radius-offset,offset,radius-offset,offset,offset,radius-offset,radius-offset,radius-offset);
					var curve_to = new Array(radius, radius);
				}
		        
		        ctx.strokeStyle = border_color;
		        ctx.lineWidth = border_width;
	    		ctx.beginPath();
	    		// go to corner to begin curve
	     		ctx.moveTo(steps[0], steps[1]); 
	     		// curve from righttop to leftbottom (for the tl canvas)
	    		ctx.bezierCurveTo(steps[2], steps[3], curve_to[0], curve_to[1], steps[4], steps[5]); 
				ctx.stroke();
		        
		    }
		};
		
		var creatCanvas = function(p,radius) {
			var elm = document.createElement('canvas');
			elm.setAttribute("height", radius);
    		elm.setAttribute("width", radius); 
			elm.style.display = "block";
			elm.style.position = "absolute";
			elm.className = "cornercanvas";
			elm = p.appendChild(elm); 
			// if G_vmlCanvasManager in defined the browser (ie only) has loaded excanvas.js 
			if (!elm.getContext && typeof G_vmlCanvasManager != 'undefined') {
				var elm = G_vmlCanvasManager.initElement(elm);
			}
			return elm;
		};
		
		// interpret the (string) argument
   		var o = (options || "").toLowerCase();
   		var radius = parseInt((o.match(/(\d+)px/)||[])[1]) || null; // corner width
   		var bg_color = ((o.match(/(#[0-9a-f]+)/)||[])[1]);  // strip color
   		if (radius == null) { radius = "auto"; }
   		
   		var edges = { T:0, B:1 };
    	var opts = {
        	tl:  /top|tl/.test(o),       
        	tr:  /top|tr/.test(o),
        	bl:  /bottom|bl/.test(o),    
        	br:  /bottom|br/.test(o)
    	};
    	if ( !opts.tl && !opts.tr && !opts.bl && !opts.br) {
        	opts = { tl:1, tr:1, bl:1, br:1 };
        }
      
		return this.each(function() {

			var elm = $(this);
			
			// give the element 'haslayout'
	   		if ($.browser.msie) { this.style.zoom = 1; }
			
			// the size of the corner is not defined...
			var widthheight_smallest = getMin(new Array(getCSSint(this,'height'),getCSSint(this,'width')));
			if (radius == "auto") {
				radius = widthheight_smallest/4;
				if (radius > 10) { radius = 10; }
			}

			// the size of the corner can't be to high
			if (widthheight_smallest < radius) { 
				radius = (widthheight_smallest/2); 
			}
			
			// remove old canvas objects
			elm.children("canvas.cornercanvas").remove();
			
			// some css thats required in order to position the canvas elements
			if (elm.css('position') == 'static') { 
				elm.css('position','relative'); 
			// only needed for ie6 and (ie7 in Quirks mode) , CSS1Compat == Strict mode
			} else if (elm.css('position') == 'fixed' && $.browser.msie && !(document.compatMode == 'CSS1Compat' && typeof document.body.style.maxHeight != "undefined")) { 
				elm.css('position','absolute'); 
			}
			elm.css('overflow','visible'); 
			
			// get border width
			var border_t = getCSSint(this, 'borderTopWidth');
			var border_r = getCSSint(this, 'borderRightWidth');
			var border_b = getCSSint(this, 'borderBottomWidth');
			var border_l = getCSSint(this, 'borderLeftWidth');
			
			// get the lowest borderwidth of the corners in use
			var bordersWidth = new Array();
			if (opts.tl || opts.tr) { bordersWidth.push(border_t); }
			if (opts.br || opts.tr) { bordersWidth.push(border_r); }
			if (opts.br || opts.bl) { bordersWidth.push(border_b); }
			if (opts.bl || opts.tl) { bordersWidth.push(border_l); }
			
			borderswidth_smallest = getMin(bordersWidth);
			
			// creat the canvas elements and position them
			var p_top = 0-border_t;
			var p_right = 0-border_r;
			var p_bottom = 0-border_b;
			var p_left = 0-border_l;	

			if (opts.tl) { var tl = $(creatCanvas(this,radius)).css({left:p_left,top:p_top}).get(0); }
			if (opts.tr) { var tr = $(creatCanvas(this,radius)).css({right:p_right,top:p_top}).get(0); }
			if (opts.bl) { var bl = $(creatCanvas(this,radius)).css({left:p_left,bottom:p_bottom}).get(0); }
			if (opts.br) { var br = $(creatCanvas(this,radius)).css({right:p_right,bottom:p_bottom}).get(0); }
			
			// get the background color of parent element
			
			if (bg_color == undefined) {
				
				var current_p = elm.parent();
				var bg = current_p.css('background-color');
				while((bg == "transparent" || bg == "rgba(0, 0, 0, 0)") && current_p.get(0).tagName.toLowerCase() != "html") {
					bg = current_p.css('background-color');
					current_p = current_p.parent();
				}
			} else {
				bg = bg_color;
			}

			if (bg == "transparent" || bg == "rgba(0, 0, 0, 0)") { bg = "#ffffff"; }
			
			if (opts.tl) { drawRoundCornerCanvasShape(tl,radius,'tl',bg,borderswidth_smallest,elm.css('borderTopColor')); }
			if (opts.tr) { drawRoundCornerCanvasShape(tr,radius,'tr',bg,borderswidth_smallest,elm.css('borderTopColor')); }
			if (opts.bl) { drawRoundCornerCanvasShape(bl,radius,'bl',bg,borderswidth_smallest,elm.css('borderBottomColor')); }
			if (opts.br) { drawRoundCornerCanvasShape(br,radius,'br',bg,borderswidth_smallest,elm.css('borderBottomColor')); }
			
			elm.addClass('roundCornersParent');
				
   		});  
	};
	
	if ($.browser.msie && typeof G_vmlCanvasManager == 'undefined') {
		
		var corner_buffer = new Array();
		var corner_buffer_args = new Array();
		
		$.fn.corner = function(options){
			corner_buffer[corner_buffer.length] = this;
    		corner_buffer_args[corner_buffer_args.length] = options;
			return this.each(function(){});
		};
		
		// load excanvas.pack.js
		document.execCommand("BackgroundImageCache", false, true);
		var elm = $("script[@src*=jquery.corner.]");
		if (elm.length == 1) {
			var jc_src = elm.attr('src');
			var pathArray = jc_src.split('/');
			pathArray.pop();
			var base = pathArray.join('/') || '.';
			var excanvasjs = base+'/excanvas.pack.js';
			$.getScript(excanvasjs,function(){
				 execbuffer();
			});
		}
		
		var execbuffer = function() {
			// set back function
			$.fn.corner = _corner;
			// execute buffer and set back function
			for(var i=0;i<corner_buffer.length;i++){
				corner_buffer[i].corner(corner_buffer_args[i]);
			}
			corner_buffer = null;
			corner_buffer_args = null;
		}
		
	} else {
		$.fn.corner = _corner;
	}
	
})(jQuery);

/*
 * jQuery clueTip plugin
 * Version 0.9.8  (05/22/2008)
 * @requires jQuery v1.1.4+
 * @requires Dimensions plugin (for jQuery versions < 1.2.5)
 *
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */
;(function($) { 
/*
 * @name clueTip
 * @type jQuery
 * @cat Plugins/tooltip
 * @return jQuery
 * @author Karl Swedberg
 *
 * @credit Inspired by Cody Lindley's jTip (http://www.codylindley.com)
 * @credit Thanks to the following people for their many and varied contributions:
      Shelane Enos, Glen Lipka, Hector Santos, Torben Schreiter, Dan G. Switzer, J?rn Zaefferer 
 * @credit Thanks to Jonathan Chaffer, as always, for help with the hard parts. :-)
 */

 /**
 * 
 * Displays a highly customizable tooltip when the user hovers (default) or clicks (optional) the matched element. 
 * By default, the clueTip plugin loads a page indicated by the "rel" attribute via ajax and displays its contents.
 * If a "title" attribute is specified, its value is used as the clueTip's heading.
 * The attribute to be used for both the body and the heading of the clueTip is user-configurable. 
 * Optionally, the clueTip's body can display content from an element on the same page.
 * * Just indicate the element's id (e.g. "#some-id") in the rel attribute.
 * Optionally, the clueTip's body can display content from the title attribute, when a delimiter is indicated. 
 * * The string before the first instance of the delimiter is set as the clueTip's heading.
 * * All subsequent strings are wrapped in separate DIVs and placed in the clueTip's body.
 * The clueTip plugin allows for many, many more options. Pleasee see the examples and the option descriptions below...
 * 
 * 
 * @example $('#tip).cluetip();
 * @desc This is the most basic clueTip. It displays a 275px-wide clueTip on mouseover of the element with an ID of "tip." On mouseout of the element, the clueTip is hidden.
 *
 *
 * @example $('a.clue').cluetip({
 *  hoverClass: 'highlight',
 *  sticky: true,
 *  closePosition: 'bottom',
 *  closeText: '<img src="cross.png" alt="close" />',
 *  truncate: 60,
 *  ajaxSettings: {
 *    type: 'POST'
 *  }
 * });
 * @desc Displays a clueTip on mouseover of all <a> elements with class="clue". The hovered element gets a class of "highlight" added to it (so that it can be styled appropriately. This is esp. useful for non-anchor elements.). The clueTip is "sticky," which means that it will not be hidden until the user either clicks on its "close" text/graphic or displays another clueTip. The "close" text/graphic is set to diplay at the bottom of the clueTip (default is top) and display an image rather than the default "Close" text. Moreover, the body of the clueTip is truncated to the first 60 characters, which are followed by an ellipsis (...). Finally, the clueTip retrieves the content using POST rather than the $.ajax method's default "GET."
 * 
 * More examples can be found at http://plugins.learningjquery.com/cluetip/demo/
 * 
 * Full list of options/settings can be found at the bottom of this file and at http://plugins.learningjquery.com/cluetip/
 */

  var $cluetip, $cluetipInner, $cluetipOuter, $cluetipTitle, $cluetipArrows, $dropShadow, imgCount;
  $.fn.cluetip = function(js, options) {
    if (typeof js == 'object') {
      options = js;
      js = null;
    }
    return this.each(function(index) {
      var $this = $(this);      
      
      // support metadata plugin (v1.0 and 2.0)
      var opts = $.extend(false, {}, $.fn.cluetip.defaults, options || {}, $.metadata ? $this.metadata() : $.meta ? $this.data() : {});

      // start out with no contents (for ajax activation)
      var cluetipContents = false;
      var cluezIndex = parseInt(opts.cluezIndex, 10)-1;
      var isActive = false, closeOnDelay = 0;

      // create the cluetip divs
      if (!$('#cluetip').length) {
        $cluetipInner = $('<div id="cluetip-inner"></div>');
        $cluetipTitle = $('<h3 id="cluetip-title"></h3>');        
        $cluetipOuter = $('<div id="cluetip-outer"></div>').append($cluetipInner).prepend($cluetipTitle);
        $cluetip = $('<div id="cluetip"></div>').css({zIndex: opts.cluezIndex})
        .append($cluetipOuter).append('<div id="cluetip-extra"></div>')[insertionType](insertionElement).hide();
        $('<div id="cluetip-waitimage"></div>').css({position: 'absolute', zIndex: cluezIndex-1})
        .insertBefore('#cluetip').hide();
        $cluetip.css({position: 'absolute', zIndex: cluezIndex});
        $cluetipOuter.css({position: 'relative', zIndex: cluezIndex+1});
        $cluetipArrows = $('<div id="cluetip-arrows" class="cluetip-arrows"></div>').css({zIndex: cluezIndex+1}).appendTo('#cluetip');
      }
      var dropShadowSteps = (opts.dropShadow) ? +opts.dropShadowSteps : 0;
      if (!$dropShadow) {
        $dropShadow = $([]);
        for (var i=0; i < dropShadowSteps; i++) {
          $dropShadow = $dropShadow.add($('<div></div>').css({zIndex: cluezIndex-i-1, opacity:.1, top: 1+i, left: 1+i}));
        };
        $dropShadow.css({position: 'absolute', backgroundColor: '#000'})
        .prependTo($cluetip);
      }
      var tipAttribute = $this.attr(opts.attribute), ctClass = opts.cluetipClass;
      if (!tipAttribute && !opts.splitTitle && !js) return true;
      // if hideLocal is set to true, on DOM ready hide the local content that will be displayed in the clueTip      
      if (opts.local && opts.hideLocal) { $(tipAttribute + ':first').hide(); }
      var tOffset = parseInt(opts.topOffset, 10), lOffset = parseInt(opts.leftOffset, 10);
      // vertical measurement variables
      var tipHeight, wHeight;
      var defHeight = isNaN(parseInt(opts.height, 10)) ? 'auto' : (/\D/g).test(opts.height) ? opts.height : opts.height + 'px';
      var sTop, linkTop, posY, tipY, mouseY, baseline;
      // horizontal measurement variables
      var tipInnerWidth = isNaN(parseInt(opts.width, 10)) ? 275 : parseInt(opts.width, 10);
      var tipWidth = tipInnerWidth + (parseInt($cluetip.css('paddingLeft'))||0) + (parseInt($cluetip.css('paddingRight'))||0) + dropShadowSteps;
      var linkWidth = this.offsetWidth;
      var linkLeft, posX, tipX, mouseX, winWidth;
            
      // parse the title
      var tipParts;
      var tipTitle = (opts.attribute != 'title') ? $this.attr(opts.titleAttribute) : '';
      if (opts.splitTitle) {
        if(tipTitle == undefined) {tipTitle = '';}
        tipParts = tipTitle.split(opts.splitTitle);
        tipTitle = tipParts.shift();
      }
      var localContent;

/***************************************      
* ACTIVATION
****************************************/
    
//activate clueTip
    var activate = function(event) {
      if (!opts.onActivate($this)) {
        return false;
      }
      isActive = true;
      $cluetip.removeClass().css({width: tipInnerWidth});
      if (tipAttribute == $this.attr('href')) {
        $this.css('cursor', opts.cursor);
      }
      $this.attr('title','');
      if (opts.hoverClass) {
        $this.addClass(opts.hoverClass);
      }
      linkTop = posY = $this.offset().top;
      linkLeft = $this.offset().left;
      mouseX = event.pageX;
      mouseY = event.pageY;
      if ($this[0].tagName.toLowerCase() != 'area') {
        sTop = $(document).scrollTop();
        winWidth = $(window).width();
      }
// position clueTip horizontally
      if (opts.positionBy == 'fixed') {
        posX = linkWidth + linkLeft + lOffset;
        $cluetip.css({left: posX});
      } else {
        posX = (linkWidth > linkLeft && linkLeft > tipWidth)
          || linkLeft + linkWidth + tipWidth + lOffset > winWidth 
          ? linkLeft - tipWidth - lOffset 
          : linkWidth + linkLeft + lOffset;
        if ($this[0].tagName.toLowerCase() == 'area' || opts.positionBy == 'mouse' || linkWidth + tipWidth > winWidth) { // position by mouse
          if (mouseX + 20 + tipWidth > winWidth) {  
            $cluetip.addClass(' cluetip-' + ctClass);
            posX = (mouseX - tipWidth - lOffset) >= 0 ? mouseX - tipWidth - lOffset - parseInt($cluetip.css('marginLeft'),10) + parseInt($cluetipInner.css('marginRight'),10) :  mouseX - (tipWidth/2);
          } else {
            posX = mouseX + lOffset;
          }
        }
        var pY = posX < 0 ? event.pageY + tOffset : event.pageY;
        $cluetip.css({left: (posX > 0 && opts.positionBy != 'bottomTop') ? posX : (mouseX + (tipWidth/2) > winWidth) ? winWidth/2 - tipWidth/2 : Math.max(mouseX - (tipWidth/2),0)});
      }
        wHeight = $(window).height();

/***************************************
* load a string from cluetip method's first argument
***************************************/
      if (js) {
        $cluetipInner.html(js);
        cluetipShow(pY);
      }
/***************************************
* load the title attribute only (or user-selected attribute). 
* clueTip title is the string before the first delimiter
* subsequent delimiters place clueTip body text on separate lines
***************************************/

      else if (tipParts) {
        var tpl = tipParts.length;
        for (var i=0; i < tpl; i++){
          if (i == 0) {
            $cluetipInner.html(tipParts[i]);
          } else { 
            $cluetipInner.append('<div class="split-body">' + tipParts[i] + '</div>');
          }            
        };
        cluetipShow(pY);
      }
/***************************************
* load external file via ajax          
***************************************/

      else if (!opts.local && tipAttribute.indexOf('#') != 0) {
        if (cluetipContents && opts.ajaxCache) {
          $cluetipInner.html(cluetipContents);
          cluetipShow(pY);
        }
        else {
          var ajaxSettings = opts.ajaxSettings;
          ajaxSettings.url = tipAttribute;
          ajaxSettings.beforeSend = function() {
            $cluetipOuter.children().empty();
            if (opts.waitImage) {
              $('#cluetip-waitimage')
              .css({top: mouseY+20, left: mouseX+20})
              .show();
            }
          };
         ajaxSettings.error = function() {
            if (isActive) {
              $cluetipInner.html('<i>sorry, the contents could not be loaded</i>');
            }
          };
          ajaxSettings.success = function(data) {
            cluetipContents = opts.ajaxProcess(data);
            if (isActive) {
              $cluetipInner.html(cluetipContents);
            }
          };
          ajaxSettings.complete = function() {
          	imgCount = $('#cluetip-inner img').length;
        		if (imgCount && !$.browser.opera) {
        		  $('#cluetip-inner img').load(function() {
          			imgCount--;
          			if (imgCount<1) {
          				$('#cluetip-waitimage').hide();
          			  if (isActive) cluetipShow(pY);
          			}
        		  }); 
        		} else {
      				$('#cluetip-waitimage').hide();
        		  if (isActive) cluetipShow(pY);    
        		} 
          };
          $.ajax(ajaxSettings);
        }

/***************************************
* load an element from the same page
***************************************/
      } else if (opts.local){
        var $localContent = $(tipAttribute + ':first');
        var localCluetip = $.fn.wrapInner ? $localContent.wrapInner('<div></div>').children().clone(true) : $localContent.html();
        $.fn.wrapInner ? $cluetipInner.empty().append(localCluetip) : $cluetipInner.html(localCluetip);
        cluetipShow(pY);
      }
    };

// get dimensions and options for cluetip and prepare it to be shown
    var cluetipShow = function(bpY) {
      $cluetip.addClass('cluetip-' + ctClass);
      
      if (opts.truncate) { 
        var $truncloaded = $cluetipInner.text().slice(0,opts.truncate) + '...';
        $cluetipInner.html($truncloaded);
      }
      function doNothing() {}; //empty function
      tipTitle ? $cluetipTitle.show().html(tipTitle) : (opts.showTitle) ? $cluetipTitle.show().html('&nbsp;') : $cluetipTitle.hide();
      if (opts.sticky) {
        var $closeLink = $('<div id="cluetip-close"><a href="#">' + opts.closeText + '</a></div>');
        (opts.closePosition == 'bottom') ? $closeLink.appendTo($cluetipInner) : (opts.closePosition == 'title') ? $closeLink.prependTo($cluetipTitle) : $closeLink.prependTo($cluetipInner);
        $closeLink.click(function() {
          cluetipClose();
          return false;
        });
        if (opts.mouseOutClose) {
          if ($.fn.hoverIntent && opts.hoverIntent) { 
            $cluetip.hoverIntent({
              over: doNothing, 
              timeout: opts.hoverIntent.timeout,  
              out: function() { $closeLink.trigger('click'); }
            });
          } else {
            $cluetip.hover(doNothing, 
            function() {$closeLink.trigger('click'); });
          }
        } else {
          $cluetip.unbind('mouseout');
        }
      }
// now that content is loaded, finish the positioning 
      var direction = '';
      $cluetipOuter.css({overflow: defHeight == 'auto' ? 'visible' : 'auto', height: defHeight});
      tipHeight = defHeight == 'auto' ? Math.max($cluetip.outerHeight(),$cluetip.height()) : parseInt(defHeight,10);   
      tipY = posY;
      baseline = sTop + wHeight;
      if (opts.positionBy == 'fixed') {
        tipY = posY - opts.dropShadowSteps + tOffset;
      } else if ( (posX < mouseX && Math.max(posX, 0) + tipWidth > mouseX) || opts.positionBy == 'bottomTop') {
        if (posY + tipHeight + tOffset > baseline && mouseY - sTop > tipHeight + tOffset) { 
          tipY = mouseY - tipHeight - tOffset;
          direction = 'top';
        } else { 
          tipY = mouseY + tOffset;
          direction = 'bottom';
        }
      } else if ( posY + tipHeight + tOffset > baseline ) {
        tipY = (tipHeight >= wHeight) ? sTop : baseline - tipHeight - tOffset;
      } else if ($this.css('display') == 'block' || $this[0].tagName.toLowerCase() == 'area' || opts.positionBy == "mouse") {
        tipY = bpY - tOffset;
      } else {
        tipY = posY - opts.dropShadowSteps;
      }
      if (direction == '') {
        posX < linkLeft ? direction = 'left' : direction = 'right';
      }
      $cluetip.css({top: tipY + 'px'}).removeClass().addClass('clue-' + direction + '-' + ctClass).addClass(' cluetip-' + ctClass);
      if (opts.arrows) { // set up arrow positioning to align with element
        var bgY = (posY - tipY - opts.dropShadowSteps);
        $cluetipArrows.css({top: (/(left|right)/.test(direction) && posX >=0 && bgY > 0) ? bgY + 'px' : /(left|right)/.test(direction) ? 0 : ''}).show();
      } else {
        $cluetipArrows.hide();
      }

// (first hide, then) ***SHOW THE CLUETIP***
      $dropShadow.hide();
      $cluetip.hide()[opts.fx.open](opts.fx.open != 'show' && opts.fx.openSpeed);
      if (opts.dropShadow) $dropShadow.css({height: tipHeight, width: tipInnerWidth}).show();
      if ($.fn.bgiframe) { $cluetip.bgiframe(); }
      // trigger the optional onShow function
      if (opts.delayedClose > 0) {
        closeOnDelay = setTimeout(cluetipClose, opts.delayedClose);
      }
      opts.onShow($cluetip, $cluetipInner);
      
    };

/***************************************
   =INACTIVATION
-------------------------------------- */
    var inactivate = function() {
      isActive = false;
      $('#cluetip-waitimage').hide();
      if (!opts.sticky || (/click|toggle/).test(opts.activation) ) {
        cluetipClose();
clearTimeout(closeOnDelay);        
      };
      if (opts.hoverClass) {
        $this.removeClass(opts.hoverClass);
      }
      $('.cluetip-clicked').removeClass('cluetip-clicked');
    };
// close cluetip and reset some things
    var cluetipClose = function() {
      $cluetipOuter 
      .parent().hide().removeClass().end()
      .children().empty();
      if (tipTitle) {
        $this.attr(opts.titleAttribute, tipTitle);
      }
      $this.css('cursor','');
      if (opts.arrows) $cluetipArrows.css({top: ''});
    };

/***************************************
   =BIND EVENTS
-------------------------------------- */
  // activate by click
      if ( (/click|toggle/).test(opts.activation) ) {
        $this.click(function(event) {
          if ($cluetip.is(':hidden') || !$this.is('.cluetip-clicked')) {
            activate(event);
            $('.cluetip-clicked').removeClass('cluetip-clicked');
            $this.addClass('cluetip-clicked');

          } else {
            inactivate(event);

          }
          this.blur();
          return false;
        });
  // activate by focus; inactivate by blur    
      } else if (opts.activation == 'focus') {
        $this.focus(function(event) {
          activate(event);
        });
        $this.blur(function(event) {
          inactivate(event);
        });
  // activate by hover
    // clicking is returned false if cluetip url is same as href url
      } else {
        $this.click(function() {
          if ($this.attr('href') && $this.attr('href') == tipAttribute && !opts.clickThrough) {
            return false;
          }
        });
        //set up mouse tracking
        var mouseTracks = function(evt) {
          if (opts.tracking == true) {
            var trackX = posX - evt.pageX;
            var trackY = tipY ? tipY - evt.pageY : posY - evt.pageY;
            $this.mousemove(function(evt) {
              $cluetip.css({left: evt.pageX + trackX, top: evt.pageY + trackY });
            });
          }
        };
        if ($.fn.hoverIntent && opts.hoverIntent) {
          $this.mouseover(function() {$this.attr('title',''); })
          .hoverIntent({
            sensitivity: opts.hoverIntent.sensitivity,
            interval: opts.hoverIntent.interval,  
            over: function(event) {
              activate(event);
              mouseTracks(event);
            }, 
            timeout: opts.hoverIntent.timeout,  
            out: function(event) {inactivate(event); $this.unbind('mousemove');}
          });           
        } else {
          $this.hover(function(event) {
            activate(event);
            mouseTracks(event);
          }, function(event) {
            inactivate(event);
            $this.unbind('mousemove');
          });
        }
      }
    });
  };
  
/*
 * options for clueTip
 *
 * each one can be explicitly overridden by changing its value. 
 * for example: $.fn.cluetip.defaults.width = 200; 
 * would change the default width for all clueTips to 200. 
 *
 * each one can also be overridden by passing an options map to the cluetip method.
 * for example: $('a.example').cluetip({width: 200}); 
 * would change the default width to 200 for clueTips invoked by a link with class of "example"
 *
 */
  
  $.fn.cluetip.defaults = {  // set up default options
    width:            275,      // The width of the clueTip
    height:           'auto',   // The height of the clueTip
    cluezIndex:       97,       // Sets the z-index style property of the clueTip
    positionBy:       'auto',   // Sets the type of positioning: 'auto', 'mouse','bottomTop', 'fixed'
    topOffset:        15,       // Number of px to offset clueTip from top of invoking element
    leftOffset:       15,       // Number of px to offset clueTip from left of invoking element
    local:            false,    // Whether to use content from the same page for the clueTip's body
    hideLocal:        true,     // If local option is set to true, this determines whether local content
                                // to be shown in clueTip should be hidden at its original location
    attribute:        'rel',    // the attribute to be used for fetching the clueTip's body content
    titleAttribute:   'title',  // the attribute to be used for fetching the clueTip's title
    splitTitle:       '',       // A character used to split the title attribute into the clueTip title and divs
                                // within the clueTip body. more info below [6]
    showTitle:        true,     // show title bar of the clueTip, even if title attribute not set
    cluetipClass:     'default',// class added to outermost clueTip div in the form of 'cluetip-' + clueTipClass.
    hoverClass:       '',       // class applied to the invoking element onmouseover and removed onmouseout
    waitImage:        true,     // whether to show a "loading" img, which is set in jquery.cluetip.css
    cursor:           'help',
    arrows:           false,    // if true, displays arrow on appropriate side of clueTip
    dropShadow:       true,     // set to false if you don't want the drop-shadow effect on the clueTip
    dropShadowSteps:  6,        // adjusts the size of the drop shadow
    sticky:           false,    // keep visible until manually closed
    mouseOutClose:    false,    // close when clueTip is moused out
    activation:       'hover',  // set to 'click' to force user to click to show clueTip
                                // set to 'focus' to show on focus of a form element and hide on blur
    clickThrough:     false,    // if true, and activation is not 'click', then clicking on link will take user to the link's href,
                                // even if href and tipAttribute are equal
    tracking:         false,    // if true, clueTip will track mouse movement (experimental)
    delayedClose:     0,        // close clueTip on a timed delay (experimental)
    closePosition:    'top',    // location of close text for sticky cluetips; can be 'top' or 'bottom' or 'title'
    closeText:        'Close',  // text (or HTML) to to be clicked to close sticky clueTips
    truncate:         0,        // number of characters to truncate clueTip's contents. if 0, no truncation occurs

    // effect and speed for opening clueTips
    fx: {             
                      open:       'show', // can be 'show' or 'slideDown' or 'fadeIn'
                      openSpeed:  ''
    },     

    // settings for when hoverIntent plugin is used             
    hoverIntent: {    
                      sensitivity:  3,
              			  interval:     50,
              			  timeout:      0
    },

    // function to run just before clueTip is shown.           
    onActivate:       function(e) {return true;},

    // function to run just after clueTip is shown.
    onShow:           function(ct, c){},
    
    // whether to cache results of ajax request to avoid unnecessary hits to server    
    ajaxCache:        true,  

    // process data retrieved via xhr before it's displayed
    ajaxProcess:      function(data) {
                        data = data.replace(/<s(cript|tyle)(.|\s)*?\/s(cript|tyle)>/g, '').replace(/<(link|title)(.|\s)*?\/(link|title)>/g,'');
                        return data;
    },                

    // can pass in standard $.ajax() parameters, not including error, complete, success, and url
    ajaxSettings: {   
                      dataType: 'html'
    },
    debug: false
  };


/*
 * Global defaults for clueTips. Apply to all calls to the clueTip plugin.
 *
 * @example $.cluetip.setup({
 *   insertionType: 'prependTo',
 *   insertionElement: '#container'
 * });
 * 
 * @property
 * @name $.cluetip.setup
 * @type Map
 * @cat Plugins/tooltip
 * @option String insertionType: Default is 'appendTo'. Determines the method to be used for inserting the clueTip into the DOM. Permitted values are 'appendTo', 'prependTo', 'insertBefore', and 'insertAfter'
 * @option String insertionElement: Default is 'body'. Determines which element in the DOM the plugin will reference when inserting the clueTip.
 *
 */
   
  var insertionType = 'appendTo', insertionElement = 'body';
  $.cluetip = {};
  $.cluetip.setup = function(options) {
    if (options && options.insertionType && (options.insertionType).match(/appendTo|prependTo|insertBefore|insertAfter/)) {
      insertionType = options.insertionType;
    }
    if (options && options.insertionElement) {
      insertionElement = options.insertionElement;
    }
  };
  
})(jQuery);


jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        var path = options.path ? '; path=' + options.path : '';
        var domain = options.domain ? '; domain=' + options.domain : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};


(function($) {
	
	/**
	 * helper variables and function
	 */
	$.ifixpng = function(customPixel) {
		$.ifixpng.pixel = customPixel;
	};
	
	$.ifixpng.getPixel = function() {
		return $.ifixpng.pixel || '/pixel.gif';
	};
	
	var hack = {
		ltie7  : $.browser.msie && /MSIE\s(5\.5|6\.)/.test(navigator.userAgent),
		filter : function(src) {
			return "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true,sizingMethod=crop,src='"+src+"')";
		}
	};
	
	 
	$.fn.ifixpng = hack.ltie7 ? function() {
    	return this.each(function() {
			var $$ = $(this);
			var base = $('base').attr('href'); // need to use this in case you are using rewriting urls
			if ($$.is('img') || $$.is('input')) { // hack image tags present in dom
				if ($$.attr('src').match(/.*\.png([?].*)?$/i)) { // make sure it is png image
					// use source tag value if set 
					var source = (base && $$.attr('src').substring(0,1)!='/') ? base + $$.attr('src') : $$.attr('src');
					// apply filter
					$$.css({filter:hack.filter(source), width:$$.width(), height:$$.height()})
					  .attr({src:$.ifixpng.getPixel()})
					  .positionFix();
				}
			} else { // hack png css properties present inside css
				var image = $$.css('backgroundImage');
				if (image.match(/^url\(["']?(.*\.png([?].*)?)["']?\)$/i)) {
					image = RegExp.$1;
					$$.css({backgroundImage:'none', filter:hack.filter(image)})
					  .positionFix();
				}
			}
		});
	} : function() { return this; };
	 
	$.fn.iunfixpng = hack.ltie7 ? function() {
    	return this.each(function() {
			var $$ = $(this);
			var src = $$.css('filter');
			if (src.match(/src=["']?(.*\.png([?].*)?)["']?/i)) { // get img source from filter
				src = RegExp.$1;
				if ($$.is('img') || $$.is('input')) {
					$$.attr({src:src}).css({filter:''});
				} else {
					$$.css({filter:'', background:'url('+src+')'});
				}
			}
		});
	} : function() { return this; };
	
	/**
	 * positions selected item relatively
	 */
	 
	$.fn.positionFix = function() {
		return this.each(function() {
			var $$ = $(this);
			var position = $$.css('position');
			if (position != 'absolute' && position != 'relative') {
				$$.css({position:'relative'});
			}
		});
	};

})(jQuery);

/**
 * jQuery.ScrollTo - Easy element scrolling using jQuery.
 * Copyright (c) 2008 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 * Date: 2/19/2008
 * @author Ariel Flesler
 * @version 1.3.3
 */
;(function($){var o=$.scrollTo=function(a,b,c){o.window().scrollTo(a,b,c)};o.defaults={axis:'y',duration:1};o.window=function(){return $($.browser.safari?'body':'html')};$.fn.scrollTo=function(l,m,n){if(typeof m=='object'){n=m;m=0}n=$.extend({},o.defaults,n);m=m||n.speed||n.duration;n.queue=n.queue&&n.axis.length>1;if(n.queue)m/=2;n.offset=j(n.offset);n.over=j(n.over);return this.each(function(){var a=this,b=$(a),t=l,c,d={},w=b.is('html,body');switch(typeof t){case'number':case'string':if(/^([+-]=)?\d+(px)?$/.test(t)){t=j(t);break}t=$(t,this);case'object':if(t.is||t.style)c=(t=$(t)).offset()}$.each(n.axis.split(''),function(i,f){var P=f=='x'?'Left':'Top',p=P.toLowerCase(),k='scroll'+P,e=a[k],D=f=='x'?'Width':'Height';if(c){d[k]=c[p]+(w?0:e-b.offset()[p]);if(n.margin){d[k]-=parseInt(t.css('margin'+P))||0;d[k]-=parseInt(t.css('border'+P+'Width'))||0}d[k]+=n.offset[p]||0;if(n.over[p])d[k]+=t[D.toLowerCase()]()*n.over[p]}else d[k]=t[p];if(/^\d+$/.test(d[k]))d[k]=d[k]<=0?0:Math.min(d[k],h(D));if(!i&&n.queue){if(e!=d[k])g(n.onAfterFirst);delete d[k]}});g(n.onAfter);function g(a){b.animate(d,m,n.easing,a&&function(){a.call(this,l)})};function h(D){var b=w?$.browser.opera?document.body:document.documentElement:a;return b['scroll'+D]-b['client'+D]}})};function j(a){return typeof a=='object'?a:{top:a,left:a}}})(jQuery);

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
		_l = $(".main-nav .active").offset().left;
		if($(".main-nav .active").is(".first")){
			_l += 14;
		}else{
			_l += 30;
		}
	}
	
	p = _l;
	
	//为IE7以下浏览器屏蔽掉高级效果
	if($.browser.msie&&parseInt($.browser.version)<7){
		_l += 2
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
								_l = $(this).offset().left;
								if($(this).parent().is(".first")){
										_l += 14;
									}else{
										_l += 30;
									}
								try {
									clearTimeout(_mtimeOut2);
								} catch(_e) {};
								_mtimeOut2 = setTimeout(function(){pointThis(_l);},200);
								});

};

setTabEvents = function(){
		$("ul.tab-tt li").click(function(){
				$("<div class=\"loading\"><\/div>").appendTo($(this).parents(".tabs-group")).fadeTo(3000,0.4);
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
		$(_h_obj).css({position:"relative",marginTop:-$("#first-content").height()});
	}	
};