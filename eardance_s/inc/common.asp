<% 
'去掉HTML标签
Function RemoveHTML(strHTML)
    Dim objRegExp, Match, Matches 
    Set objRegExp = New Regexp
    
    objRegExp.IgnoreCase = True
    objRegExp.Global = True
    '取闭合的<>
    objRegExp.Pattern = "<.+?>"
    '进行匹配
    Set Matches = objRegExp.Execute(strHTML)
    
    ' 遍历匹配集合，并替换掉匹配的项目
    For Each Match in Matches 
    strHtml=Replace(strHTML,Match.Value,"")
    Next
    RemoveHTML=strHTML
    Set objRegExp = Nothing
End Function

'专题页文章列表生成
Sub articleList()
    articlesql="SELECT TOP 3 * FROM [article] WHERE  ftrName='"&s&"' ORDER BY addDate DESC"
   Set rs=Server.CreateObject("Adodb.Recordset")
   rs.Open articlesql,cn,1,1
   do while not rs.eof
   articleID=rs("ID")
   sortID=rs("sortID")
   title=rs("title")
   content=rs("content")
   summary=left(RemoveHTML(rs("content")),200)
   author=rs("author")
   addDate=formatdatetime(rs("addDate"),2)
   If Len(title)>17 then
   title = Left(title,16)+"..."
   End If
   Response.Write("<dl><dt id='tt_"&articleID&"'>"&title&"<span class='author'>[作者:"&author&"]</span>&nbsp;&nbsp;<span class='date'>添加日期:"&addDate&"</span></dt><dd id='article_"&articleID&"'><div class='summary'>"&summary&"</div><div class='detail'></div><a href='#tt_"&articleID&"' title='让页面从这段开始显示...' class='more'>|&nbsp;跳到这段&gt;&gt;</a></dd></dl>")
   rs.movenext
   loop
   if rs.eof and rs.bof then
      Response.Write "抱歉，暂未添加信息..."
   end if
   rs.close:set rs=nothing
End Sub
 %>
