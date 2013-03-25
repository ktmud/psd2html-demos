function checkEmpty(a){
	if ($(a).val()== "请输入关键字..."|$(a).val()== ""){
	  alert("请输入查询关键字！");
	  $("#queryKey").focus();
	  return false;
	  }
	  return true;
	  }
function formFocus(a){
	if( $(a).val()=="请输入关键字..."){
	  $(a).val("");
    }
	  $(a).css("font-style","normal");
}
function formBlur(a){
	  if( $(a).val()==""|$(a).val()=="请输入关键字...") {
	  $(a).val("请输入关键字..." );
	  $(a).css("font-style","italic");
	  }
}

function showGoTip(a){
	if($(a).val()== "请输入关键字..."){
	$("#goTip").text("要查询的关键字可以是文章标题、正文或者服务项目名称")
	}
	else{
	$("#goTip").text("输入关键字后直接按回车可以节省时间")
	}
	$("#goTip").show("fast");
}