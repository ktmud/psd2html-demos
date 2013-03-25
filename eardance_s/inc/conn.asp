<% '创建链接
   dim cn   
   dim connstr
   connstr="DBQ="+server.mappath("data/#data.mdb")+";DefaultDir=;DRIVER={Microsoft Access Driver (*.mdb)};"
   set cn=server.createobject("ADODB.CONNECTION")
   cn.open connstr
   %>