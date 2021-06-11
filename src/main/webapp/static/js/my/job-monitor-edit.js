$(document).ready(function () {
    reset();
});

var reset = function(){
    var monitorId = $("#monitorId").val();
    $.ajax({
        type: 'POST',
        async: false,
        url: 'job/monitor/getJobMonitor.shtml',
        data: {
            monitorId : monitorId
        },
        success: function (data) {
            var monitor = data.data;
            $("#lastExecuteTime").val(monitor.lastExecuteTime);
            $("#lastSuccessTime").val(monitor.lastSuccessTime);
        },
        error: function () {
            alert("请求失败！请刷新页面重试");
        },
        dataType: 'json'
    });
};

$.validator.setDefaults({
    highlight: function (element) {
        $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
    },
    success: function (element) {
        element.closest('.form-group').removeClass('has-error').addClass('has-success');
    },
    errorElement: "span",
    errorPlacement: function (error, element) {
        if (element.is(":radio") || element.is(":checkbox")) {
            error.appendTo(element.parent().parent().parent());
        } else {
            error.appendTo(element.parent());
        }
    },
    errorClass: "help-block m-b-none",
    validClass: "help-block m-b-none"
});

$().ready(function () {
    var icon = "<i class='fa fa-times-circle'></i> ";
    $("#RepositoryJobForm").validate({
        rules: {

        },
        messages: {

        },
        submitHandler:function(form){
            $.post("job/monitor/update.shtml", decodeURIComponent($(form).serialize(),true), function(data){
                var result = JSON.parse(data);
                if(result.status == "success"){
                    layer.msg('更新成功',{
                        time: 2000,
                        icon: 6
                    });
                    setTimeout(function(){
                        location.href = "view/job/monitor/listUI.shtml";
                    },2000);
                }else {
                    layer.msg(result.message, {icon: 2});
                }
            });
        }
    });
});

var cancel = function(){
    location.href = "view/job/monitor/listUI.shtml";
};