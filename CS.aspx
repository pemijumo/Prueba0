<%@ Page Language="C#" AutoEventWireup="true"  CodeFile="CS.aspx.cs" Inherits="_Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
<%--<script src="scripts/jquery-1.3.2.min.js" type="text/javascript"></script>--%>
 <script src="js/jquery-1.10.2.js"></script>
    <script src="js/jquery-ui.js"></script>

</head>
<body style = "font-family:Arial; font-size:10pt">
<form id="form1" runat="server">
<div>
Your Name : 
<asp:TextBox ID="txtUserName" runat="server"></asp:TextBox>
<input id="btnGetTime" type="button" value="Show Current Time" 
    onclick = "ShowCurrentTime()" />
</div>
</form>
</body>
</html>
