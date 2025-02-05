<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<%String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath() + "/";%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <base href="<%=basePath %>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>编辑转换监控</title>
    <link href="static/css/bootstrap.min.css?v=3.3.6" rel="stylesheet">
    <link href="static/css/font-awesome.css?v=4.4.0" rel="stylesheet">
    <link href="static/css/animate.css" rel="stylesheet">
    <%--<link href="static/css/plugins/cron-generator/cronGen.css" rel="stylesheet">--%>
    <link href="static/css/style.css" rel="stylesheet">
</head>
<body class="gray-bg">
<div class="wrapper wrapper-content animated fadeInRight">
    <div class="ibox float-e-margins">
        <div class="ibox-title">
            <h5>编辑转换监控</h5>
            <div class="ibox-tools">
                <a class="collapse-link">
                    <i class="fa fa-chevron-up"></i>
                </a>
                <a class="close-link">
                    <i class="fa fa-times"></i>
                </a>
            </div>
        </div>
        <div class="ibox-content">
            <form class="form-horizontal m-t" id="RepositoryJobForm">
                <input type="hidden" name="monitorId" id="monitorId" value="${monitorId }">
                <div class="form-group">
                    <label class="col-sm-3 control-label required">上次执行时间：</label>
                    <div class="col-sm-7">
                        <input id="lastExecuteTime" name="lastExecuteTime" onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})"/>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-3 control-label required">上次成功时间：</label>
                    <div class="col-sm-7">
                        <input id="lastSuccessTime" name="lastSuccessTime" onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})"/>
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-sm-9 col-sm-offset-3">
                        <button class="btn btn-w-m btn-primary" type="submit"><i class="fa fa-check" aria-hidden="true"></i>&nbsp;保存</button>
                        <button class="btn btn-w-m btn-primary" type="button" onclick="cancel()"><i class="fa fa-reply" aria-hidden="true"></i>&nbsp;取消</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
<!-- 全局js -->
<script src="static/js/jquery.min.js?v=2.1.4"></script>
<%--<script src="static/js/plugins/cron-generator/cronGen.js"></script>--%>
<!-- jQuery Validation plugin javascript-->
<script src="static/js/plugins/validate/jquery.validate.min.js"></script>
<script src="static/js/plugins/validate/messages_zh.min.js"></script>
<script src="static/js/bootstrap.min.js?v=3.3.6"></script>
<!-- layer javascript -->
<script src="static/js/plugins/layer/layer.min.js"></script>
<!-- WdatePicker -->
<script src="static/js/my97datepicker/WdatePicker.js"></script>
<!-- 自定义js -->
<script src="static/js/content.js?v=1.0.0"></script>
<script src="static/js/my/trans-monitor-edit.js"></script>
</body>
</html>