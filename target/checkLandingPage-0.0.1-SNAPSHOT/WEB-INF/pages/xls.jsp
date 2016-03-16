<%@ page contentType="text/html; charset=utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<HTML lang="en" xml:lang="en" xmlns="http://www.w3.org/1999/xhtml">
	<HEAD>
		<META content="application/xhtml+xml; charset=UTF-8" http-equiv="Content-Type">
		<META name="description" content="I offer professional web development services, providing stunning web design, xhtml/css coding, database driven websites,  wordpress templates and customization, custom content management systems built especially for you, and much more. Drop me a line for more information.">
		<META name="verify-v1" content="8fK7bJQU/cbNZpHOvCbcIRybznEtPO6AYyyzSMoq3m4="><LINK rel="icon" href="favicon.ico">
		<LINK rel="stylesheet" type="text/css" href="css/reset.css">
		<LINK rel="stylesheet" type="text/css" href="css/style.css">
		<LINK id="mainstyle" rel="stylesheet" type="text/css" href="css/day.css">
		<LINK rel="stylesheet" type="text/css" href="css/jquery.lightbox-0.4.css">
		<link rel="stylesheet" type="text/css" href="css/jquery/jquery.ui.all.css">
		<link rel="stylesheet" type="text/css" href="css/jquery.flexigrid.css"/>
		<LINK rel="stylesheet" type="text/css" href="css/darwin.ui.css">
		<script type="text/javascript" src="js/jquery.js" />"></script>
		<script type="text/javascript" src="js/jquery.flexigrid.js" />"></script>
		<script type="text/javascript" src="js/job.js" />"></script>
		<script type="text/javascript" src="js/jquery.ui.core.js" />"></script>
		<script type="text/javascript" src="js/jquery.ui.widget.js" />"></script>
		<script type="text/javascript" src="js/jquery.ui.position.js" />"></script>
		<script type="text/javascript" src="js/jquery.ui.autocomplete.js" />"></script>
		<TITLE>Landing Page Check</TITLE>
		<META name="GENERATOR" content="MSHTML 9.00.8112.16441">
	</HEAD>
	<BODY>
	<DIV id="outer">
		<DIV id="content">
		<H1>目前正在检查的项目：</H1>
			<table id="job-grid"></table>
		</DIV><!-- end of content-->
		<DIV id="sidebar">
		<DIV id="result"></DIV>
		<form action="importXls" method="post" enctype="multipart/form-data">
			<DIV>
				<LABEL for="eb37ad328083366dd3940a82074472e53">项目名:</LABEL>
				<select id="project" name="project">
					<option value="HRS">HRS</option>
				</select>
				<LABEL for="e3ae1db45a50a82d17aaee2ca76edfcd1">你上传的文件:</LABEL>
				<input id="file" name="file" type="file"/></td>
				<INPUT class="submit" value="上传" type="submit">
			</DIV>
		</FORM>
	<DIV id="sidebar_bot"></DIV>
</DIV><!-- end of sidebar-->
<DIV id="clearfooter">
</DIV><!-- end of clearfooter-->
</DIV><!-- end of outer-->
<DIV id="header">
<DIV class="centered">
<DIV id="switcher"><A id="day" 
href="http://www.eanka.com/index.php?style=day"><SPAN>some text</SPAN></A><A id="night" 
href="http://www.eanka.com/index.php?style=night"><SPAN>some text</SPAN></A></DIV>
<DIV id="girl"></DIV>
<DIV id="intro">
<H1>LandPage检查小工具</H1>
<P>任务完成后，系统会把有问题的链接，自动生成Excel。</P>
<P>系统暂时只是单线程，差不多1.5秒检测一个链接，请控制好要检测URL的数量。</P>
<P>友情提示：若有其它项目，需要LandPage检查，请联系技术部Harry，进行“错误页的过滤文字”的配置。</P>
</DIV></DIV><!-- end of centered-->
<DIV id="banner">
<DIV class="centered"></DIV></DIV>
</DIV><!-- end of header-->

</BODY></HTML>