/** 
* 先获取浏览器类型，再使用不同方法获取IP
*/
var ipEle = document.getElementById("ipAddress")

function getBrowser() {
    var ua = window.navigator.userAgent;
    var isIE = window.ActiveXObject != undefined && ua.indexOf("MSIE") != -1;
    var isChrome = ua.indexOf("Chrome") && window.chrome;
    if (isIE) {
        return "IE";
    } else if (isChrome) {
        return "Chrome";
    }
}

if (getBrowser() == "IE") {
    var locator = document.createElement("object"),
        foo = document.createElement("object");

    locator.setAttribute("id","locator")
    locator.setAttribute("classid","clsid:76a64158-cb41-11d1-8b02-00600806d9b6")

    foo.setAttribute("id","foo")
    foo.setAttribute("classid","clsid:75718c9a-f029-11d1-a1ac-00c04fb6c223")

    document.body.appendChild(locator)
    document.body.appendChild(foo)

    var service = locator.connectserver(),ipaddr;
    service.security_.impersonationlevel = 3;
    service.instancesofasync(foo, 'win32_networkadapterconfiguration');

    foo.attachEvent("onobjectready", function(obj) {
        if (obj.ipenabled != null && obj.ipenabled != "undefined" && obj.ipenabled == true) {
            if (obj.ipenabled && obj.ipaddress(0) != null && obj.ipaddress(0) != "undefined") {
                ipEle.innerHTML = unescape(obj.ipaddress(0));
            }
        }
    })
} else if (getBrowser() == "Chrome") {
    var ipaddress = '';

    function getLocalIPs(callback) {
        var ips = [],
            RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection,
            pc = new RTCPeerConnection({ iceServers: [] });

        pc.createDataChannel('');
        pc.onicecandidate = function(e) {
            if (!e.candidate) {
                pc.close();
                callback(ips);
                return;
            }
            var ip = /^candidate:.+ (\S+) \d+ typ/.exec(e.candidate.candidate)[1];
            if (ips.indexOf(ip) == -1)
                ips.push(ip);
        };
        pc.createOffer(function(sdp) {
            pc.setLocalDescription(sdp);
        }, function onerror() {});
    }

    document.addEventListener('DOMContentLoaded', function() {
        getLocalIPs(function(_ips) {
            var ips = _ips.filter(function(item){
                return item.indexOf(":")<0
            })
            ipaddress = ips.join('\n');
            ipEle.innerHTML = ipaddress;
        });
    }, false);
}
