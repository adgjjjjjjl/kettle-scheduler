/*
 * My97 DatePicker 4.72 Release
 * License: http://www.my97.net/dp/license.asp
 */
var $dp,
    WdatePicker; (function() {
    var defaults = {
        $wdate: true,
        $dpPath: "",
        $crossFrame: true,
        doubleCalendar: false,
        enableKeyboard: false,
        enableInputMask: true,
        autoUpdateOnChanged: null,
        whichDayIsfirstWeek: 4,
        position: {},
        lang: "auto",
        skin: "default",
        dateFmt: "yyyy-MM-dd",
        realDateFmt: "yyyy-MM-dd",
        realTimeFmt: "HH:mm:ss",
        realFullFmt: "%Date %Time",
        minDate: "1900-01-01 00:00:00",
        maxDate: "2099-12-31 23:59:59",
        startDate: "",
        alwaysUseStartDate: false,
        yearOffset: 1911,
        firstDayOfWeek: 0,
        isShowWeek: false,
        highLineWeekDay: true,
        isShowClear: true,
        isShowToday: true,
        isShowOK: true,
        isShowOthers: true,
        readOnly: true,
        errDealMode: 0,
        autoPickDate: null,
        qsEnabled: true,
        autoShowQS: false,

        specialDates: null,
        specialDays: null,
        disabledDates: null,
        disabledDays: null,
        opposite: false,
        onpicking: null,
        onpicked: null,
        oncancel:null,
        onclearing: null,
        oncleared: null,
        ychanging: null,
        ychanged: null,
        Mchanging: null,
        Mchanged: null,
        dchanging: null,
        dchanged: null,
        Hchanging: null,
        Hchanged: null,
        mchanging: null,
        mchanged: null,
        schanging: null,
        schanged: null,
        eCont: null,
        vel: null,
        errMsg: "",
        quickSel: [],
        has: {}
    };
    WdatePicker = InitDatePicker;
    var currentwindow = window,//当前窗口
        controlwindow,//日历控件所在窗口
        directory,//脚本目录
        msie,
        ff,
        opera;
    switch (navigator.appName) {
        case "Microsoft Internet Explorer":
            msie = true;
            break;
        case "Opera":
            opera = true;
            break;
        default:
            ff = true;
            break
    }
    directory = getDirectory();
    if (defaults.$wdate) loadStyleSheet(directory + "skin/WdatePicker.css");
    controlwindow = currentwindow;
    if (defaults.$crossFrame) {
        try {
            while (controlwindow.parent && controlwindow.parent.document != controlwindow.document && controlwindow.parent.document.getElementsByTagName("frameset").length == 0)
                controlwindow = controlwindow.parent
        } catch(P) {}
    }
    if (!controlwindow.$dp) controlwindow.$dp = {
        ff: ff,
        ie: msie,
        opera: opera,
        el: null,
        win: currentwindow,
        status: 0,
        defMinDate: defaults.minDate,
        defMaxDate: defaults.maxDate,
        flatCfgs: []
    };
    InitDatePickerControl();
    if ($dp.status == 0)
        onload(currentwindow,function() {
            InitDatePicker(null, true)
        });
    if (!currentwindow.document.docMD) {
        addEvent(currentwindow.document, "onmousedown", closeDatePicker);
        currentwindow.document.docMD = true
    }
    if (!controlwindow.document.docMD) {
        addEvent(controlwindow.document, "onmousedown", closeDatePicker);
        controlwindow.document.docMD = true
    }
    addEvent(currentwindow, "onunload",function() {if ($dp.dd) displayStatus($dp.dd, "none")});
    function InitDatePickerControl() {
        controlwindow.$dp = controlwindow.$dp || {};
        var obj = {
            $: function(selector) {
                return (typeof selector == "string") ? currentwindow.document.getElementById(selector) : selector
            },
            $D: function(selector, dateFormat) {
                return this.$DV(this.$(selector).value, dateFormat)
            },
            $DV: function(date, dateFormat) {
                if (date != "") {
                    this.dt = $dp.cal.splitDate(date, $dp.cal.dateFmt);
                    if (dateFormat)
                        for (var pro in dateFormat)
                            if (this.dt[pro] === undefined)
                                this.errMsg = "invalid property:" + pro;
                            else {
                                this.dt[pro] += dateFormat[pro];
                                if (pro == "M") {
                                    var C = dateFormat["M"] > 0 ? 1: 0,
                                        A = new Date(this.dt["y"], this.dt["M"], 0).getDate();
                                    this.dt["d"] = Math.min(A + C, this.dt["d"])
                                }
                            }
                    if (this.dt.refresh()) return this.dt
                }
                return ""
            },
            show: function() {
                var divs = controlwindow.document.getElementsByTagName("div"),
                    defaultZIndex = 100000;
                for (var i = 0; i < divs.length; i++) {
                    var maxZIndex = parseInt(divs[i].style.zIndex);
                    if (maxZIndex > defaultZIndex) defaultZIndex = maxZIndex;
                }
                this.dd.style.zIndex = defaultZIndex + 2;
                displayStatus(this.dd, "block");
            },
            hide: function() {
                displayStatus(this.dd, "none");
                if($dp.oncancel)
                    $dp.oncancel();
            },
            attachEvent: addEvent
        };
        for (var pro in obj) controlwindow.$dp[pro] = obj[pro];
        $dp = controlwindow.$dp;
        $dp.dd = controlwindow.document.getElementById("_my97DP")
    }
    function addEvent(elem, eventName, func) {
        if (msie) elem.attachEvent(eventName, func);
        else if (func) {
            var name = eventName.replace(/on/, "");
            func._ieEmuEventHandler = function(e) {
                return func(e)
            };
            elem.addEventListener(name, func._ieEmuEventHandler, false)
        }
    }
    function getDirectory() {
        var path,
            index,
            scripts =window.document.getElementsByTagName("script") ;
        for (var B = 0; B < scripts.length; B++) {
            path = scripts[B].src.substring(0, scripts[B].src.toLowerCase().indexOf("wdatepicker.js"));
            index = path.lastIndexOf("/");
            if (index > 0) path = path.substring(0, index + 1);
            if (path) break;
        }
        return path;
    }
    function checkPath(url) {
        if (url.substring(0, 1) != "/" && url.indexOf("://") == -1) {
            var E = controlwindow.location.href;
            var C = location.href;
            if (E.indexOf("?") > -1) E = E.substring(0, E.indexOf("?"));
            if (C.indexOf("?") > -1) C = C.substring(0, C.indexOf("?"));
            var G,
                I,
                $ = "",
                D = "",
                A = "",
                J,
                H,
                B = "";
            for (J = 0; J < Math.max(E.length, C.length); J++) {
                G = E.charAt(J).toLowerCase();
                I = C.charAt(J).toLowerCase();
                if (G == I) {
                    if (G == "/") H = J
                } else {
                    $ = E.substring(H + 1, E.length);
                    $ = $.substring(0, $.lastIndexOf("/"));
                    D = C.substring(H + 1, C.length);
                    D = D.substring(0, D.lastIndexOf("/"));
                    break
                }
            }
            if ($ != "") for (J = 0; J < $.split("/").length; J++) B += "../";
            if (D != "") B += D + "/";
            url = E.substring(0, E.lastIndexOf("/") + 1) + B + url
        }
        defaults.$dpPath = url
    }
    function loadStyleSheet(url, title, charset) {
        var head = currentwindow.document.getElementsByTagName("HEAD").item(0),
            stylesheet = currentwindow.document.createElement("link");
        if (head) {
            stylesheet.href = url;
            stylesheet.rel = "stylesheet";
            stylesheet.type = "text/css";
            if (title) stylesheet.title = title;
            if (charset) stylesheet.charset = charset;
            head.appendChild(stylesheet);
        }
    }
    function onload(elem, func) {
        addEvent(elem, "onload", func);
    }
    function getControlWindowPosition(win) {
        win = win || controlwindow;
        var left = 0,
            top = 0;
        while (win != controlwindow) {
            var D = win.parent.document.getElementsByTagName("iframe");
            for (var F = 0; F < D.length; F++) {
                try {
                    if (D[F].contentWindow == win) {
                        var E = getBoundingClientRect(D[F]);
                        left += E.left;
                        top += E.top;
                        break
                    }
                } catch(B) {}
            }
            win = win.parent
        }
        return {
            "leftM": left,
            "topM": top
        }
    }
    function getBoundingClientRect(elem) {
        if (elem.getBoundingClientRect) return elem.getBoundingClientRect();
        else {
            var regTestObj = {
                    ROOT_TAG: /^body|html$/i,
                    OP_SCROLL: /^(?:inline|table-row)$/i
                },
                isFixed = false,
                documentView = null,
                top = elem.offsetTop,
                left = elem.offsetLeft,
                right = elem.offsetWidth,
                bottom = elem.offsetHeight,
                parent = elem.offsetParent;
            if (parent != elem)
                while (parent) {
                    left += parent.offsetLeft;
                    top += parent.offsetTop;
                    if (getStyleAttribute(parent, "position").toLowerCase() == "fixed") isFixed = true;
                    else if (parent.tagName.toLowerCase() == "body") documentView = parent.ownerDocument.defaultView;
                    parent = parent.offsetParent
                }
            parent = elem.parentNode;
            while (parent.tagName && !regTestObj.ROOT_TAG.test(parent.tagName)) {
                if (parent.scrollTop || parent.scrollLeft) if (!regTestObj.OP_SCROLL.test(displayStatus(parent))) if (!opera || parent.style.overflow !== "visible") {
                    left -= parent.scrollLeft;
                    top -= parent.scrollTop
                }
                parent = parent.parentNode
            }
            if (!isFixed) {
                var location = getDocumentPosition(documentView);
                left -= location.left;
                top -= location.top
            }
            right += left;
            bottom += top;
            return {
                "left": left,
                "top": top,
                "right": right,
                "bottom": bottom
            }
        }
    }
    function getWindowRectangle(win) {
        win = win || controlwindow;
        var docu = win.document,
            width = (win.innerWidth) ? win.innerWidth: (docu.documentElement && docu.documentElement.clientWidth) ? docu.documentElement.clientWidth: docu.body.offsetWidth,
            height = (win.innerHeight) ? win.innerHeight: (docu.documentElement && docu.documentElement.clientHeight) ? docu.documentElement.clientHeight: docu.body.offsetHeight;
        return {
            "width": width,
            "height": height
        }
    }
    function getDocumentPosition(win) {
        win = win || controlwindow;
        var docu = win.document,
            elem = docu.documentElement,
            _body = docu.body;
        docu = (elem && elem.scrollTop != null && (elem.scrollTop > _body.scrollTop || elem.scrollLeft > _body.scrollLeft)) ? elem: _body;
        return {
            "top": docu.scrollTop,
            "left": docu.scrollLeft
        }
    }
    function closeDatePicker(e) {
        var elem = e ? (e.srcElement || e.target) : null;
        try {
            if ($dp.cal && !$dp.eCont && $dp.dd && elem != $dp.el && $dp.dd.style.display == "block") $dp.cal.close()
        } catch(err) {}
    }
    function Y() {
        $dp.status = 2;
        H()
    }
    function H() {
        if ($dp.flatCfgs.length > 0) {
            var $ = $dp.flatCfgs.shift();
            $.el = {
                innerHTML: ""
            };
            $.autoPickDate = true;
            $.qsEnabled = false;
            createAndShow($)
        }
    }
    var R,
        $;
    function InitDatePicker(options, C) {
        $dp.win = window;
        InitDatePickerControl();
        options = options || {};
        if (C) {
            if (!documentReady()) {//等待元素加载完成
                $ = $ || setInterval(function() {
                        if (controlwindow.document.readyState == "complete") clearInterval($);
                        InitDatePicker(null, true)
                    },
                    50);
                return
            }
            if ($dp.status == 0) {
                $dp.status = 1;
                createAndShow({el: {innerHTML: ""}},true)
            } else return
        } else if (options.eCont) {
            options.eCont = $dp.$(options.eCont);
            $dp.flatCfgs.push(options);
            if ($dp.status == 2) H()
        } else {
            if ($dp.status == 0) {
                InitDatePicker(null, true);
                return
            }
            if ($dp.status != 2) return;
            var e = event;
            if (e) {
                $dp.srcEl = e.srcElement || e.target;
                e.cancelBubble = true
            }
            $dp.el = options.el = $dp.$(options.el || $dp.srcEl);
            if (!$dp.el || $dp.el["My97Mark"] === true || $dp.el.disabled || ($dp.el == $dp.el && displayStatus($dp.dd) != "none" && $dp.dd.style.left != "-1970px")) {
                $dp.el["My97Mark"] = false;
                return
            }
            createAndShow(options);
            if (e && $dp.el.nodeType == 1 && $dp.el["My97Mark"] === undefined) {
                $dp.el["My97Mark"] = false;
                var _,
                    A;
                if (e.type == "focus") {
                    _ = "onclick";
                    A = "onfocus"
                } else {
                    _ = "onfocus";
                    A = "onclick"
                }
                addEvent($dp.el, _, $dp.el[A])
            }
        }
        function documentReady() {
            if (msie && controlwindow != currentwindow && controlwindow.document.readyState != "complete") return false;
            return true
        }
    }
    function getStyleAttribute(element, attr) {
        return element.currentStyle ? element.currentStyle[attr] : document.defaultView.getComputedStyle(element, false)[attr]
    }
    function displayStatus(element, status) {
        if (element)
            if (status != null){
                element.style.display = status;
            }else
                return getStyleAttribute(element, "display")
    }
    function createAndShow(options, isOnlyCreate) {
        //加载默认配置
        for (var pro in defaults) if (pro.substring(0, 1) != "$") $dp[pro] = defaults[pro];
        //加载自定义配置
        for (pro in options) if ($dp[pro] !== undefined) $dp[pro] = options[pro];

        var nodeName = $dp.el ? $dp.el.nodeName: "INPUT";
        if (isOnlyCreate || $dp.eCont || new RegExp(/input|textarea|div|span|p|a/ig).test(nodeName)) $dp.elProp = nodeName == "INPUT" ? "value": "innerHTML";
        else return;
        if ($dp.lang == "auto") $dp.lang = msie ? navigator.browserLanguage.toLowerCase() : navigator.language.toLowerCase();
        if (!$dp.dd || $dp.eCont || ($dp.lang && $dp.realLang && $dp.realLang.name != $dp.lang && $dp.getLangIndex && $dp.getLangIndex($dp.lang) >= 0)) {
            if ($dp.dd && !$dp.eCont) controlwindow.document.body.removeChild($dp.dd);
            if (defaults.$dpPath == "") checkPath(directory);
            var frame = "<iframe style=\"width:1px;height:1px\" src=\"" + defaults.$dpPath + "My97DatePicker.htm\" frameborder=\"0\" border=\"0\" scrolling=\"no\"></iframe>";
            if ($dp.eCont) {
                $dp.eCont.innerHTML = frame;
                onload($dp.eCont.childNodes[0], Y)
            } else {
                $dp.dd = controlwindow.document.createElement("DIV");
                $dp.dd.id = "_my97DP";
                $dp.dd.style.cssText = "position:absolute";
                $dp.dd.innerHTML = frame;
                controlwindow.document.body.appendChild($dp.dd);
                onload($dp.dd.childNodes[0], Y);
                if (isOnlyCreate) $dp.dd.style.left = $dp.dd.style.top = "-1970px";
                else {
                    $dp.show();
                    setControlPosition()
                }
            }
        } else if ($dp.cal) {
            $dp.show();
            $dp.cal.init();
            if (!$dp.eCont) setControlPosition()
        }
        function setControlPosition() {
            var left = $dp.position.left,
                top = $dp.position.top,
                elem = $dp.el;
            if (elem != $dp.srcEl && (displayStatus(elem) == "none" || elem.type == "hidden")) elem = $dp.srcEl;
            var H = getBoundingClientRect(elem),
                $ = getControlWindowPosition(currentwindow),
                windowSize = getWindowRectangle(controlwindow),
                documentLocation = getDocumentPosition(controlwindow),
                offsetHeight = $dp.dd.offsetHeight,
                offsetWidth = $dp.dd.offsetWidth;
            if (isNaN(top)) {
                if (top == "above" || (top != "under" && (($.topM + H.bottom + offsetHeight > windowSize.height) && ($.topM + H.top - offsetHeight > 0)))) top = documentLocation.top + $.topM + H.top - offsetHeight - 2;
                else top = documentLocation.top + $.topM + Math.min(H.bottom, windowSize.height - offsetHeight) + 2
            } else top += documentLocation.top + $.topM;
            if (isNaN(left)) left = documentLocation.left + Math.min($.leftM + H.left, windowSize.width - offsetWidth - 5) - (msie ? 2: 0);
            else left += documentLocation.left + $.leftM;
            $dp.dd.style.top = top + "px";
            $dp.dd.style.left = left + "px"
        }
    }
})()