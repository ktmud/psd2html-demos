<%@LANGUAGE="VBSCRIPT" CODEPAGE="65001"%>
<!--#include file="inc/conn.asp"-->
<% 
id= trim(Request("id"))
sql="SELECT title,content FROM [article] WHERE ID="&id
Set rs=Server.CreateObject("Adodb.Recordset")
rs.Open sql,cn,1,1
content = rs("content")
title = rs("title")
If Len(title)>17 then
content = "<h4>"&title&"</h4>"&content
End If
Response.Write(content)
 %>