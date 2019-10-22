
//var MainPage = new Vue({
//	mixins:[mainBaseMix],
//	created:function(){
//		var that  = this;
//		this.loadShow=true;
//		getShopList(function(list){
//			that.showShopListDialog(list);
//			that.loadShow=false;
//		});
//		Vue.nextTick(function () {
//          setTimeout(function(){
//              var isc = new IScroll("#test_div_ddd",{
//              	probeType: 2,
//                  click: iScrollClick()
//              });
//          }, 2000)                
//  	});
//	},
//});

var MainPage = new Vue({
	mixins:[mainBaseMix],
	created:function(){
		var that  = this;
		this.loadShow=true;
		var switchMode = allSetting.switchMode;
		if(switchMode == 0){
			getShopList(function(list){
				that.showShopListDialog(list,switchMode);
				that.loadShow=false;
			});
			Vue.nextTick(function () {
			  setTimeout(function(){
				  var isc = new IScroll("#test_div_ddd",{
					probeType: 2,
					  click: iScrollClick()
				  });
			  }, 2000)
			});
		}else if(switchMode == 1){
			getShopList(function(list){
				that.showShopListDialog(list,switchMode);
				that.loadShow=false;
			});
		}
	},
});


