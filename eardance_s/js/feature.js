// CopyRight Eardance 2007.12.26
$(document).ready(
  function (){
	  for(i=0;i<=2;i++){
       $("dd a").eq(i).click(
	      function(){
			 id = $(this).attr("href").slice(4);
			 ids = "#article_"+id+" .summary";
			 idd = "#article_"+id+" .detail";
		    if($(this).html()=="|&nbsp;跳到这段&gt;&gt;"){
			   $(this).html("载入中...").addClass("running");
               full = $.get("article_full.asp","ID="+id);
		       $(this).ajaxError(function(){
				  $(this).html("对不起！载入出错！")
				    }).ajaxSuccess(function(){
                        $(ids).slideUp("fast");
						fullText = full.responseText;
						$(idd).html(fullText).show("slow");
	                    $(this).html("&lt;&lt;收起").attr("title","返回简洁显示").removeClass("running");
			                                 });
		    } if ($(this).html()=="|展开&gt;&gt;"){
				 $(ids).slideUp("fast");
			     $(idd).show("slow");
			     $(this).html("&lt;&lt;收起").attr("title","返回简洁显示");
				 return;
			};
			if($(this).html()=="&lt;&lt;收起") {
			     $(idd).slideUp("fast");
			     $(ids).show("fast");
			     $(this).html("|展开&gt;&gt;").attr("title","查看全文...");
	          }
		 });
      }
  })