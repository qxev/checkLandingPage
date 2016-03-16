<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" contentType="text/html;charset=UTF-8"%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Landing Page Check</title>
<link href="css/reset.css" rel="stylesheet" type="text/css">
<link href="css/layout.css" rel="stylesheet" type="text/css">
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
</head>

<body>
	<div id="layout">
        <div>
        	<img src="images/line.jpg" />
        </div>
        <div id="content">
<form action="youku" method="get">        	
<div id="project">
            	<div class="text">优酷ID</div>
                <div>
                	<input type="text" name="id" value="${id}"></input>                	<input value="搜索" type="submit"/>
                	
                </div>
            </div>
</form>
            <div id="infor">
            	<p>标题：${youku.title}</p>
            	<p>类别：${youku.category}</p>
            	<p>创建时间：${youku.created}</p>
            	<p>描述：${youku.description}</p>
            	<p>下载次数：${youku.down_count}</p>
            	<p>片源长度：${youku.duration}秒</p>
            	<p>发布时间：${youku.published}</p>
            	<p>标签：${youku.tags}</p>
            	<p>观看次数：${youku.view_count}</p>
            	<p>状态：${youku.state}</p>
            </div>
        </div>
        <div>
        	<img src="images/line_02.jpg" />
        </div>
    </div>
</body>
</html>
