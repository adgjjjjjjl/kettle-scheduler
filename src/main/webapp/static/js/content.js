var $parentNode = window.parent.document;

function $childNode(name) {
    return window.frames[name]
}

// tooltips
$('.tooltip-demo').tooltip({
    selector: "[data-toggle=tooltip]",
    container: "body"
});

// 使用animation.css修改Bootstrap Modal
$('.modal').appendTo("body");

$("[data-toggle=popover]").popover();

//折叠ibox
$('.collapse-link').click(function () {
    var ibox = $(this).closest('div.ibox');
    var button = $(this).find('i');
    var content = ibox.find('div.ibox-content');
    content.slideToggle(200);
    button.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
    ibox.toggleClass('').toggleClass('border-bottom');
    setTimeout(function () {
        ibox.resize();
        ibox.find('[id^=map-]').resize();
    }, 50);
});

//关闭ibox
$('.close-link').click(function () {
    var content = $(this).closest('div.ibox');
    content.remove();
});

//判断当前页面是否在iframe中
if (top == this) {
    var gohome = '<div class="gohome"><a class="animated bounceInUp" href="view/indexUI.shtml" title="返回首页"><i class="fa fa-home"></i></a></div>';
    $('body').append(gohome);
}

//animation.css
function animationHover(element, animation) {
    element = $(element);
    element.hover(
        function () {
            element.addClass('animated ' + animation);
        },
        function () {
            //动画完成之前移除class
            window.setTimeout(function () {
                element.removeClass('animated ' + animation);
            }, 2000);
        });
}

//拖动面板
function WinMove() {
    var element = "[class*=col]";
    var handle = ".ibox-title";
    var connect = "[class*=col]";
    $(element).sortable({
            handle: handle,
            connectWith: connect,
            tolerance: 'pointer',
            forcePlaceholderSize: true,
            opacity: 0.8,
        })
        .disableSelection();
};

$.ajaxSetup({
    beforeSend: function(jqXHR, settings) {
        if (window.location.search.indexOf("token=") > 0 && settings.url.indexOf("token=") < 0) {

            if(settings.type === "GET"){
                settings.url += settings.url.match(/\?/) ? "&" : "?";
                settings.url += "token=" + getUrlParam("token");
            }
            else{
                if(settings.data !== ""){
                    settings.data += "&";
                }
                settings.data += "token=" + encodeURIComponent(getUrlParam("token"));
                //将token放入请求头中，解决后台拦截器无法获取请求体重的参数token的问题
                jqXHR.setRequestHeader("Authorization", getUrlParam("token"));
            }
        }
    }
});

//URL参数获取工作
function getUrlParam(paraName) {
    var url = document.location.toString();
    var arrObj = url.split("?");

    if (arrObj.length > 1) {
        var arrPara = arrObj[1].split("&");
        var index;

        for (var i = 0; i < arrPara.length; i++) {
            index = arrPara[i].indexOf("=");

            var name = arrPara[i].substr(0,index);
            var value = arrPara[i].substr(index+1,arrPara[i].length)
            if (name == paraName) {
                return value;
            }
        }
        return "";
    }
    else {
        return "";
    }
}