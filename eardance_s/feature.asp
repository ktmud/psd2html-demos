<%@LANGUAGE="VBSCRIPT" CODEPAGE="65001"%>
<!--#include file="inc/conn.asp"-->
<!--#include file="inc/common.asp"-->
<% 
If Request.QueryString() = "" then
  Response.Write("此页面需要查询参数才能显示！<a href='index.html'>＜返回首页</a>")
  cn.close:set cn=nothing
  Response.End()
End If

  s= Request("singer")
  infosql="SELECT * FROM [singerInfo] WHERE singerAbbr='"&s&"'"
  Set rs=Server.CreateObject("Adodb.Recordset")
  rs.Open infosql,cn,1,1
  SgrName=rs("singerName")
  SgrBirthday=rs("singerBirth")
  SgrDetail=rs("singerDetail")
  albumInfo=rs("albumInfo")
  rs.close:set rs=nothing
 %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><%= SgrName %>- 耳舞华章 - 台湾华语流行乐现状简介</title>
<script type="text/javascript" src="js/jquery.js"></script>
<script type="text/javascript" src="js/feature.js" ></script>
<link href="css/basic.css" rel="stylesheet" type="text/css" />
<link href="css/sub.css" rel="stylesheet" type="text/css" />
<link href="css/feature.css" rel="stylesheet" type="text/css" />
</head>
<body>
<div id="all">
  <div id="header"><a href="index.html" title="＜返回首页"><img src="img/eardance.jpg" alt="耳舞华章" width="180" height="84" /></a><img src="img/top_title.jpg" alt="台湾华语流行乐现状简介" width="334" height="44" style="margin:12px 0 0 96px;" /></div>
  <div id="nav">
    <h2><%= SgrName %></h2>
    <ul id="menu">
      <li><a href="pop.html" title="大众流行音乐" class="pop">乐感华章</a></li>
      <li><a href="summer.html" title="青春摇滚乐团" class="summer">追梦盛夏</a></li>
      <li><a href="wind.html" title="独立音乐简介" class="wind">风的姿态</a></li>
      <li><a href="feature.asp?singer=cheer" title="感受Cheer" class="cheer">陈绮贞专题</a></li>
      <li><a href="feature.asp?singer=jay" title="Jay的专属地带" class="jay">周杰伦专题</a></li>
    </ul>
  </div>
  <hr />
  <div id="contents">
    <div id="container1">
      <div id="singerInfo">
        <table>
          <tr>
            <td ><strong>出生日期：</strong><%=SgrBirthday %></td>
          </tr>
          <tr>
            <td ><strong>個人簡介：</strong> </td>
          </tr>
          <tr>
            <td ><%= SgrDetail %></td>
          </tr>
        </table>
      </div>
      <hr />
      <div id="albumInfo"> <%= albumInfo %></div>
      <hr />
      <div id="articleList">
      <h3>那些关于<%= s %>的</h3>
      <%call articleList() %>
      <br />
      <a href="articles.asp" title="查看更多">&gt;&gt;&nbsp;More...</a>
      <blockquote>此处内容皆转自<a href="http://www.douban.com" title="分享喜爱的音乐、电影">豆瓣</a>以及<a href="http://www.hitoradio.com" title="台湾最好听的流行乐广播">Hitoradio</a></blockquote>
      </div>
    </div>
    <hr />
    <img src="img/<%= s %>.jpg" />
    <div id="bottomInfo">
    <blockquote>图片素材来自互联网</blockquote>
    <hr />
    <br />  
      <p id="backLink"><a href="index.html" title="点击左上角的LOGO图片也能返回">←返回首页</a>&nbsp;&nbsp;<a href="#" title="回到顶部" style="color:#d3ee65">【▲】</a></p>
    </div>
    <div id="footer">
      <div class="l"></div>
      <div class="c">
        <div class="cont"><em>版权所有</em> 山东大学 <strong><a href="about.html">付诚</a></strong>　　部分资料来自互联网</div>
      </div>
      <div class="r"></div>
    </div>
  </div>
</div>
</body>
</html>
