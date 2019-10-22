function getHtml5Location() {  
    if(navigator.geolocation) {  
        // navigator.geolocation.watchPosition(updateLocation, handleLocationError, {  
        navigator.geolocation.getCurrentPosition(updateLocation, handleLocationError,{  
            // 指示浏览器获取高精度的位置，默认为false  
            enableHighAcuracy: true,  
            // 指定获取地理位置的超时时间，默认不限时，单位为毫秒  
            //timeout: 5000,  
            // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。  
            maximumAge: 20000  
        });  
    }else{  
        $("#wdialogContent2").text("无法获取您当前地理位置");  
        $("#wdialog2").show();  
    }  
}  
function updateLocation(position) {  
    var latitude = position.coords.latitude;  
    var longitude = position.coords.longitude;  
    var accuracy = position.coords.accuracy;  
    // 如果accuracy的值太大，我们认为它不准确，不用它计算距离  
    if (accuracy >= 1000) {  
        return;  
    }  
    var pt = new BMap.Point(longitude,latitude);  
    setTimeout(function(){  
        BMap.Convertor.translate(pt,0,translateCallback);     //真实经纬度转成百度坐标  
    }, 100);  
    translateCallback = function (point){  
        createBaiduMap(point.lat,point.lng,1);  
    };  
}  
  
function handleLocationError(error) {  
    switch (error.code) {  
        case 0:  
            $("#wdialogContent2").text("尝试获取您的位置信息时发生错误："+ error.message);  
            $("#wdialog2").show();  
            break;  
        case 1:  
            $("#wdialogContent2").text("用户拒绝了获取位置信息请求");  
            $("#wdialog2").show();  
            break;  
        case 2:  
            $("#wdialogContent2").text("浏览器无法获取您的位置信息："+ error.message);  
            $("#wdialog2").show();  
            break;  
        case 3:  
            $("#wdialogContent2").text("获取您位置信息超时");  
            $("#wdialog2").show();  
            break;  
    }  
}  
/** 
 * 传人坐标获得详细地址 
 * @param lat 
 * @param lon 
 */  
function getAddressInfo(lon,lat,type) {  
    var myGeo = new BMap.Geocoder();  
    var pt = new BMap.Point(lon,lat);  
    translateCallback2 = function (point){  
        myGeo.getLocation(point, function(rs) {  
            var addComp = rs.addressComponents;  
            //rs.surroundingPois;//附近地址  
            var addr = addComp.province+ addComp.city + addComp.district+ addComp.street+ addComp.streetNumber;  
            searchMap(addr);  
        });  
    };  
    setTimeout(function(){  
        if(type==1){  
            BMap.Convertor.translate(pt,0,translateCallback2);     //真实经纬度转成百度坐标  
        }else{  
            translateCallback2(pt);  
        }  
    }, 100);  
}  
var map = null;  
function setMapEvent(){  
    map.enableDragging();//启用地图拖拽事件，默认启用(可不写)  
    map.enableScrollWheelZoom();//启用地图滚轮放大缩小  
    map.enableDoubleClickZoom();//启用鼠标双击放大，默认启用(可不写)  
    map.enableKeyboard();//启用键盘上下左右键移动地图  
}  
var marker = null;  
function createBaiduMap(longitude, latitude,type) {
    if(map==null){  
        map =new BMap.Map("container");   
    }  
    setMapEvent();
    mSearchManager.clear();  
    var pt= new BMap.Point(longitude,latitude);    
    translateCallback = function (point){  
        var point= new BMap.Point(point.lng, point.lat);    
        map.setCenter(point);  
        map.centerAndZoom(point, 24);    
        // 添加带有定位的导航控件  
        var navigationControl = new BMap.NavigationControl({  
           // 靠左上角位置  
           anchor: BMAP_ANCHOR_TOP_LEFT,  
           // LARGE类型  
           type: BMAP_NAVIGATION_CONTROL_LARGE,  
           // 启用显示定位  
           enableGeolocation: true  
        });  
        map.addControl(navigationControl);    
        marker = new BMap.Marker(point); //标注    
        marker.enableDragging();  
        marker.addEventListener("dragend",getAttr);  
        function getAttr(){  
            var p = marker.getPosition();       //获取marker的位置  
            getAddressInfo(p.lng,p.lat);  
        }  
        map.clearOverlays();  
        map.addOverlay(marker);  
        map.addEventListener("click", function(e){
            var gc = new BMap.Geocoder();   
            var pt = new BMap.Point(e.point.lng,e.point.lat);   
            $("#lng").val() = e.point.lng;  
            $("#lat").val() = e.point.lat;  
            window.map.removeOverlay(marker);  
            marker = new BMap.Marker(e.point);//创建一个覆盖物    
            map.addOverlay(marker);//增加一个标示到地图上    
            var dress = gc.getLocation(pt, function(rs){  
                var addComp = rs.addressComponents;  
                var address = addComp.city+addComp.district+addComp.street+addComp.streetNumber;  
//              if(typeof(addId)!="undefined" && addId !=null){  
//                  $("#"+addId).text(address);  
//              }  
                searchMap(address);  
            });  
        });  
        // 添加定位控件  
     var geolocationControl = new BMap.GeolocationControl();  
     geolocationControl.addEventListener("locationSuccess", function(e){  
            window.map.removeOverlay(marker);  
            marker = new BMap.Marker(e.point);//创建一个覆盖物    
            map.addOverlay(marker);//增加一个标示到地图上    
            map.panTo(e.point);   
             // 定位成功事件  
            var address = '';  
//          address += e.addressComponent.province;  
            address += e.addressComponent.city;  
            address += e.addressComponent.district;  
            address += e.addressComponent.street;  
            address += e.addressComponent.streetNumber;  
            searchMap(address);  
      });  
      geolocationControl.addEventListener("locationError",function(e){  
          // 定位失败事件  
          alert(e.message);  
     });  
        //地图拖动事件  
        map.addEventListener("dragging", function(evt){ 
           var offsetPoint = new BMap.Pixel(evt.offsetX, evt.offsetY);  
        });  
      map.addControl(geolocationControl);  
        // 添加带有定位的导航控件  
    };  
    setTimeout(function(){  
        if(type==1){  
            translateCallback(pt);  
        }else{  
            BMap.Convertor.translate(pt,0,translateCallback);     //真实经纬度转成百度坐标  
        }  
    }, 100);  
}  

var isR = false; 
var mSearchManager = new SearchManager();  
 
function SearchManager(){  
    this.SearchResultList = new Array();  
    this.showSearchResult = function(poi){  
        var index = this.SearchResultList.length;  
        var marker = new BMap.Marker(poi.point);  
        var a=document.createElement("a");    
        var p=document.createElement("P");  
        this.SearchResultList[index] = new KzSearchResult( marker , poi , a , p);  
        var address = "";  
        if(this.SearchResultList[index].poi.province!=undefined && this.SearchResultList[index].poi.province!=null  
                && this.SearchResultList[index].poi.province !=""){  
            address = this.SearchResultList[index].poi.province;  
        }  
        if(this.SearchResultList[index].poi.city!=undefined && this.SearchResultList[index].poi.city!=null  
                && this.SearchResultList[index].poi.city !=""){  
            address +=this.SearchResultList[index].poi.city;  
        }  
        var div = document.getElementById("search-result");  
        a.href="javascript:mSearchManager.zoomto("+index+")";  
        var $a = $("<a class=\"weui-cell_access\" style=\"text-align: left;width: 100%;\" href=\"javascript:mSearchManager.zoomto("+index+")\"></a>");  
        var section = $("<section class=\"weui-cell\"></section>");  
        var div1 = $("<div  class=\"page__title\" style=\"text-align: left;\">"+poi.title+"</div>"); 
        var div3 = $("<div class=\"weui-cells_result\">"+poi.address+"</div>");   
        $a.append(div1).append(div3); 
        section.append($a);  
        $("#search-result").append(section);  
    };  
    this.clear = function(){  
        var div = $("#search-result section");  
        div.remove();  
        window.map.removeOverlay(marker);  
        this.SearchResultList.length = 0;  
    };  
    this.clear2 = function(){  
        var div = $("#search-result section");  
        div.remove();  
        this.SearchResultList.length = 0;  
    };  
    this.zoomto = function (index){ 
        window.map.removeOverlay(marker);  
        marker = new BMap.Marker(this.SearchResultList[index].poi.point);  
        window.map.addOverlay(marker);  
        window.map.centerAndZoom(this.SearchResultList[index].poi.point, 20); 
        
      	document.getElementById(addResult).innerHTML = JSON.stringify(this.SearchResultList[index].poi.address);
        console.log(JSON.stringify(this.SearchResultList[index].poi.address));
//      document.getElementById(longitude).value = JSON.stringify(this.SearchResultList[index].poi.address);
//      document.getElementById(longitude).value = this.SearchResultList[index].poi.point.lng;  
//      document.getElementById(latitude).value = this.SearchResultList[index].poi.point.lat;  
        
//      if(typeof(addId)!="undefined" && addId !=null){  
        
//      }  
        
    };    
}  

function KzSearchResult(m , b ,a , p){  
    this.marker = m;  
    this.poi = b;  
    this.a = a;  
    this.p = p;  
}  
function searchMap(area) {  
   if(map==null){  
        map =new BMap.Map("container");   
   }  
   var ls = new BMap.LocalSearch(map);  
   ls.setSearchCompleteCallback(function(rs) {  
      mSearchManager.clear2();  
      if(ls.getStatus() == BMAP_STATUS_SUCCESS) {  
        for(var index=0;index<rs.getCurrentNumPois();index++){  
            var poi = rs.getPoi(index);  
            if (poi) {  
                mSearchManager.showSearchResult(poi);  
            }  
        }  
      }  
   });  
   ls.search(area);  
}  

function getSearch(){
	map =new BMap.Map("container");
	var ac = new BMap.Autocomplete({
		"input" : "suggestId",
		"location" : map
	});	
	ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
		var str = "";
		var _value = e.fromitem.value;
		var value = "";
		if (e.fromitem.index > -1) {
			value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
		}    
		str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
		
		value = "";
		if (e.toitem.index > -1) {
			_value = e.toitem.value;
			value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
		}    
		str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
		G("searchResultPanel").innerHTML = str;
	});
}
