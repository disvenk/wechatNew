var allSetting = new Object();
var shopInfo = new Object();
var brand = new Object();
var customerInfo = new Object();
var pageType = null;
var memberActivityCustomerType = false;
var memberActivityCustomer = null;
var tableNumber = null;
var groupId = null;
var turnIndex = 0;

var rand = "";
for (var i = 0; i < 3; i++) {
    var r = Math.floor(Math.random() * 10);
    rand += r;
}
/**
 * 此处必须同步
 * 如果需要async true的话  可能会出现bug  ------wyj
 */
$.ajax({
    url : baseUrl+"/wechat/customer/new/customer",
    type:"post",
    async: false,
    success : function(user) {
        customerInfo = user.data;
        if(customerInfo.telephone != null && customerInfo.isBindPhone){
            $.ajax({
                url : baseUrl+"/wechat/customer/getMemberActivityByTelephone",
                data:{telephone: customerInfo.telephone},
                type:"post",
                async: false,
                success : function(r) {
                    if(r.data != null && r.data != ""){
                        memberActivityCustomerType = true;
                        memberActivityCustomer = r.data;
                    }
                }
            });
        }
    }
});
/**
 * 进入店铺判断是堂食还是外卖
 */
if(getParam("loginpage") != null && getParam("loginpage") != ""){
    var pageType = getParam("loginpage");
}
/**
 * 扫码进入桌号
 */
if (getParam("tableNumber") != null && getParam("tableNumber") != "") {
    var tableNumber = getParam("tableNumber");
}

$.ajax({
    url: baseUrl + "/wechat/setting",
    data: {"random": rand},
    async: false,
    success: function (result) {
        brand = result.brand;
        allSetting = result.data;
        allSetting.wechatWelcomeImg = getPicUrl(allSetting.wechatWelcomeImg);
        allSetting.redPackageLogo = getPicUrl(allSetting.redPackageLogo);
    },
    error: function () {
        var search = window.location.search;
        if(search.indexOf("qiehuan") == -1){
            search = search + "&qiehuan=qiehuan";
        }
        window.location.href = getParam("baseUrl") + "/wechat/index" + search;
    }
});

$.ajax({
    url : baseUrl+"/wechat/shop/new/currentshop",
    type:"post",
    async: false,
    success : function(res) {
        shopInfo = res.data;
     	var url = getUrlParam(window.location.href);
   		getPortSoup(shopInfo.id,getParam("tableNumber"),customerInfo.id,function(result){
			if(result.success){
				if(result.data && getParam("articleBefore") == null && getParam("dialog") == null && getParam("orderBossId") == null && url.indexOf("#my") == -1 && url.indexOf("subpage=my") == -1){
					url = url + "&articleBefore=1";
					// window.location.href = "/wechatNew/src/soup.html?" + url;
					window.location.href = getParam("baseUrl")+"/restowechat/src/soup.html?"+url;
				}
			}
		})
    }
});

/**
 * 组件加载之前，首先确定用户位置，并选择对应的
 */

var mainBaseMix = {
	el:"#main-page",
    data: function () {
        return {
            wAlter: {title: "", show: 0, content: "",type:null,order:{}},
            wMessage: {show: 0, message: "",type:null},
            iframeDialogCode: {show: false},
            showBindPhone: false,
            articleMapAll:new HashMap(),
            loadShow: false,
            orderSum: 0,
            appraiseSum: 0,
            confirmDialogShow: 0,
            dialogOptions: {},
            page: "",
            shop: {},
            customer: {},
            tangshiArtList: [],
            menuList: [],
            chargeDialog: {show: false, chargeList: []},
            payAlter: {show: false, order: null, iamPaying:true},
            customNewOrder: {show: false, order: null, customer: null, option: {}},
            customNewOrderHouFu: {show: false, order: null, customer: null, option: {}},
            appraiseOrder: {show: false, order: null},	/*老评论*/
            redPapperDialog: {show: false, name: "", title: "", order: {}, appraise: null, customer:{}},
            redPapperRegisteredDialog: {show: false, name: "", title: "", order: {}, appraise: null},
            redOpenDialog: {show: false, name: "", title: "", money: 0, appraise: null, order: {}, allowshare : false},
            iframeDialog: {show: false, src: ""},
            callNumberDialog: {show: false, order: null},
            shopListDialog: {show: false, shoplist: null},
            shopListDialogBig: {show: false, shoplist: null,subpage:null},
            noticeDialog: {show: false, notice: {}},
            noticeListDialog: {show: false, noticelist: []},
            shareDialog: {show: false, isshare: true, appraise: null, setting: null},
            rewardDialog: {show: false, appraise: null},
            currentCoupon:{show: false, coupons: null},
        	myShareCoupon:{show: false,sharecoupons:null},
            allSetting: allSetting,
            customerInfo:customerInfo,
            otherdata: null,
            myBirthdayGift:{show: false},
            openBirthdayGift:{show: false},
            pageType:pageType,
            changeShop:{show:false,mode:null},
            groupListDialog:{show:false},
            groupListShowed:false,
            shopClose:{show:false,shop:shopInfo},
            appraiseMode:1,
            newAppraiseDialog:{show:false, order: null}		/*新评论*/
        };
    },
    created: function () {
    	var that = this;
        var home = {name: "home", title: allSetting.wechatBrandName};
        var tangshi = {name: "tangshi", title: allSetting.wechatTangshiName};
        var my = {name: "my", title: allSetting.wechatMyName};
		
		if(getParam("loginpage") != null && getParam("loginpage") != ""){
            that.shopListDialogBig.subpage = getParam("loginpage");
       	}		
        this.menuList.push(home);
        this.menuList.push(tangshi);
        this.menuList.push(my);
    },  
    ready: function () {
        $("#main-menu").css("display", "block");
        var that = this;               
		/*判断是老用户进入店铺*/
		if(getUrlParam(window.location.href).indexOf("oldCustomer=1") != -1 && getParam("orderBossId") == null 
			&& getParam("waitId") == null && getParam("articleBefore") == null){
		    if(getUrlParam(window.location.href).indexOf("my") == -1){
	            that.changeShop.show = true;
	        }
		} 
        var showDialogName = getParam("dialog");
        var aid = getParam("appraiseId");
        $.ajax({
            url : baseUrl+"/wechat/customer/new/customer",
            type:"post",
            async: false,
            success : function(user) {
                var customer = user.data;
                that.customNewOrder.customer = customer;
                that.customer = customer;
                customerInfo = customer;
                that.$broadcast("refresh-customerInfo", customer);
                switch (showDialogName) {
                    case "share":
                        getShareDetailed(aid, function (result) {
                            var dialog = that.shareDialog;
                            //通过分享链接是进入堂吃页面不弹窗
                            if (getParam("allowInviteRegistration")){
                                dialog.show = false;
                            }else{
                                dialog.show = true;
                            }
                            dialog.isshare = true;
                            dialog.appraise = result.appraise;
                            dialog.setting = result.setting;
                        });
                        console.log("显示分享弹窗");
                        break;
                    case "sharefriend":
                        getShareDetailed(aid, function (result) {
                            var dialog = that.shareDialog;
                            //通过分享链接是进入堂吃页面不弹窗
                            if (getParam("allowInviteRegistration")){
                                dialog.show = false;
                            }else{
                                dialog.show = true;
                            }
                            dialog.isshare = false;
                            dialog.appraise = result.appraise;
                            dialog.setting = result.setting;
                            if (!customer.isBindPhone) {
                                dialog.setting.registered = false;
                            }else{
                                dialog.setting.registered = true;
                            }
                        });
                        console.log("被分享弹窗");
                        break;
                    default:
                        break;
                }
                if(customer.isBindPhone == 1 && getParam("shareCustomer")){
                    that.$dispatch("successMessage", "您已注册，感谢您的关注！", 3000);
                }
            }
        });

        that.shop = shopInfo;
        that.shop.photo = getBoPic(that.shop.photo);

        setTimeout(function () {
            resetWindow();
        }, 50);
		window.onhashchange = function () {
            var hash = location.hash;
            if ("#" + that.page != hash) {
                var page = hash.substr(1);
                that.changePage(that.findMenu(page));
            }
            this.otherdata = null;
        }
        var default_page = location.hash;
        if (default_page) {
            default_page = default_page.substr(1);
        } else {
            default_page = getParam("subpage");
            if (!default_page) {
                default_page = "tangshi";
            }
        }       
    	this.changePage(this.findMenu(default_page));
    },
    methods: {
        showShopListDialog: function (shoplist,switchMode) {
            if(switchMode == 0){
                this.shopListDialogBig = {
                    show: true,
                    shoplist: shoplist,
                    subpage:subpage
                }
            }else if(switchMode == 1){
                window.location.href = getParam("baseUrl")+"/restowechat/src/shopList.html?"+getUrlParam(window.location.href);
            }
        },
        findMenu: function (name) {
            for (var i = 0; i < this.menuList.length; i++) {
                var menu = this.menuList[i];
                if (name == menu.name) {
                    return menu;
                }
            }
        },
        showCustomerNewOrder: function (order, op) {
//          if(order.orderState == 10 && order.allowAppraise == 1){
//              if("closeRedPacket" == getParam("dialog")){
//                  this.redPapperDialog.show = false;
//              }else{
//                  this.redPapperDialog.show = true;
//              }
//              this.redPapperDialog.name = this.shop.name;
//              this.redPapperDialog.customer = this.customer;
//              this.redPapperDialog.title = "完成消费评价即可领取!";
//              this.redPapperDialog.order = order;
//          }else{
//				if(getParam("subpage") == "waimai"){
//	            	return;
//	            }
				/*退菜订单不显示*/
				if(order.productionStatus == 6){
					return;
				}
                this.customNewOrder.order = order;
                this.customNewOrder.customer = this.customer;
                this.customNewOrder.show = true;
                this.customNewOrder.option = op || {};
//          }
            var that = this;
            setTimeout(function(){
                if(order.orderMode == 2&& order.productionStatus == 2 && order.orderState == 2
                    && (getParam("subpage") == "my" || getUrlJingHao(window.location.href) == "my")){
                    that.callNumberDialog.order = order;
                    that.callNumberDialog.show = true;
                }
            },3000);
        },
        showCustomerNewOrderHouFu: function (order, op) {
            this.customNewOrderHouFu.order = order;
            this.customNewOrderHouFu.customer = this.customer;
            this.customNewOrderHouFu.show = true;
            this.customNewOrderHouFu.option = op || {};
        },
        showCustomerNewOrderHouFuFalse: function () {
            this.customNewOrderHouFu.show = false;
        },
        changePage: function (menu) {
			var that = this;
            if (typeof menu == "string") {
                menu = this.findMenu(menu);
            }
            var menuName = menu.name;
            if( timeRange(new Date(shopInfo.openTime.time).format("hh:mm"),new Date(shopInfo.closeTime.time).format("hh:mm")) == false ){
	        	if((menuName == "my" || menuName == "home")){
	        		that.shopClose.show = false;
	        	}else{
	        		that.shopClose.show = true;
	        	}
	        }else{
	        	this.beforeChangeMenu(menu);
	        }	        
            this.page = menuName;
            setTimeout(function () {
                resetWindow();
            }, 50);
            location.hash = this.page;
            Vue.nextTick(function () {
            	if(menu.title == allSetting.wechatTangshiName){
            		$("title").html(shopInfo.name);
            	}else{
            		$("title").html(menu.title);
            	}
                that.afterChangeMenu && that.afterChangeMenu(menu);
            });
        },
        beforeChangeMenu: function (menu) {
            var menuName = menu.name;           
            if ((menuName == "tangshi" || menuName == "home") && getParam("oldCustomer") ==null) {//查看是否有新红包
                this.showNewPackage();
            }
        },
        showNewPackage: function () {
            var showDialogName = getParam("dialog");
            if (showDialogName && !getParam("allowInviteRegistration") && !getParam("loginpage")) {  //如果有其他dialog，则不弹出红包  --->修改逻辑：如果是点邀请链接关注后进入系统的弹领取注册红包的框
                return;
            }
            var that = this;
        	$.ajax({
                url: baseUrl + "/wechat/customer/new/checkRegistered",
                type: 'post',
                dataType: 'json',
                success: function (result) {
                    if (result.success) {
                        //未注册                        
                        if(that.shop.currentTimeCoupon){
                        	console.log("店铺开启了实时优惠券");
                            that.$dispatch("show-currentTimeCoupon");
                        }else{
                        	if(customerInfo.isBindPhone == false){
								that.$emit("receive-red-papper-registered");
                        	}                       	
                        }
                    } else {
                        getCustomerNewPackage(function (order) {
                            if(that.shop.currentTimeCoupon){
                            	console.log("店铺开启了实时优惠券");
                                that.$dispatch("show-currentTimeCoupon");
                            }else if(order && order.id) {
                                console.log("有未领取的红包，显示未领取的红包");
                                that.$emit("receive-red-papper", order);
                            }else{
                            	console.log("查找到的订单为空，弹出广告");
                                that.$broadcast("can-show-notice");
                            }
                        });
                    }
                }
            });
        },
        showAlter: function (title, content) {
            this.wAlter.title = title;
            this.wAlter.content = content;
            this.wAlter.show = 1;
            this.loadShow = false;
        },
        showPriceAlter: function (title,type,content) {
            this.wAlter.title = title;
            this.wAlter.content = content;
            this.wAlter.type = type;
            this.wAlter.show = 1;
            this.loadShow = false;
        },
        showAlterForBossOrderAfter: function (title,type,content,order) {
            this.wAlter.title = title;
            this.wAlter.content = content;
            this.wAlter.type = type;
            this.wAlter.show = 1;
            this.wAlter.order = order;
            this.loadShow = false;
        },
        showMessage: function (msg, time) {
            this.wMessage.show = 1;
            this.wMessage.message = msg;
            var that = this;
            setTimeout(function () {
                that.wMessage.show = 0;
            }, time || 1000);
        },
        showSuccessMessage: function (msg ,type, time) {
            this.wMessage.show = 1;
            this.wMessage.type = type;
            this.wMessage.message = msg;
            var that = this;
            setTimeout(function () {
                that.wMessage.show = 0;
            }, time || 1000);
        },
        showSuccessMessageFail: function (type) {
            this.wMessage.show = 0;
            this.wMessage.type = type;
        },
        showDialog: function (option) {
            this.dialogOptions = option;
            this.confirmDialogShow = 1;
            this.loadShow = false;
        },
        paySuccess: function (order) {
            var that = this;
            if (this.otherdata && this.otherdata.event == "continue-order") {
                this.showSuccessMessage("加菜成功，请稍等片刻",1, 20000);
            }
            if (getParam("dialog") && getParam("dialog") != 'closeRedPacket' && getParam("dialog") != 'invite' ) {
                location.href = baseUrl + "/wechat/index?subpage=my&qiehuan=qiehuan&shopId=" + order.shopDetailId +"&loginpage="+pageType;
                return false;
            }
            order.orderState = 2;
            this.changePage("my");
            this.loadShow = false;
            this.$broadcast("pay-success");
            if(that.shop.shopMode == 6){
            	that.$dispatch("open-customer-code");
            }
        },
        paySuccessHouFu: function (order,o) {
            var that = this;
            if(o.order.parentOrderId != null && o.order.orderMode == 5 && o.order.orderState == 1 && o.order.productionStatus == 0){
                this.showSuccessMessage("加菜成功，请稍等片刻",1, 20000);
                pushOrderRequest(order.id, function (re) {
                    if (re.success) {
                        that.$dispatch("successMessage", "扫码完成");
                        that.order.productionStatus = 1;
                        that.pushOrderSuccess && that.pushOrderSuccess(that.order);
                    } else {
                        that.$dispatch(re.message);
                    }
                });
            }
            if (this.otherdata && this.otherdata.event == "continue-order") {
                this.showSuccessMessage("加菜成功，请稍等片刻",1, 20000);
                pushOrderRequest(order.id, function (re) {
                    if (re.success) {
                        that.$dispatch("successMessage", "扫码完成");
                        that.order.productionStatus = 1;
                        that.pushOrderSuccess && that.pushOrderSuccess(that.order);
                    } else {
                        that.$dispatch(re.message);
                    }
                });
            }
            if (getParam("dialog")) {
                location.href = baseUrl + "/wechat/index?subpage=my&qiehuan=qiehuan";
                return false;
            }
            order.orderState = 1;
            this.changePage("my");
            this.loadShow = false;
            this.$broadcast("pay-success");
        },
        payOrderWx: function (order) {
            var that = this;
            if (!that.loadShow) {
                //that.loadShow = true;
                openWechatPay(order.id, function (result) {
                    that.paySuccess({orderId: order.id});
					that.$broadcast("change-pay-state");
                }, function (errMsg) {
                    that.showAlter("支付失败", errMsg);
                    that.$broadcast("change-pay-state");
                }, function () {
                    that.loadShow = false;
                    refundPaymentByUnfinishedOrder(order.id, function (result) {
                        if (result.success) {
                            $.ajax({
                                url : baseUrl+"/wechat/customer/new/customer",
                                type:"post",
                                success : function(user) {
                                    that.customer = user.data;
                                    customerInfo = user.data;
                                    that.$broadcast("refresh-customerInfo", user.data);
                                }
                            });
                            //that.$broadcast("reflush-info");
                            if(getParam("orderBossId") != null){
                                that.$broadcast("refresh-orderBoss");
                            }
                            that.$broadcast("change-pay-state");
                        }
                    }, function (errMsg) {
                        that.showAlter("支付失败", errMsg);
                    });
                    //location.href = baseUrl + "/wechat/index?subpage=my";
                });
            }
        },
        payDialog: function (order) {
            this.payAlter.show = true;
            this.payAlter.order = order;
        },
        closeOrder: function (order) {
            var that = this;
            cancelOrderRequest(order.id, function (result) {
                if (result.success) {
                    that.showSuccessMessage("取消订单成功",1,2000);
                    order.orderState = 9;
                    that.$broadcast("cancel-order-success", order);
                } else {
                    that.showAlter("取消失败", result.message);
                }
            });
        },
        redPapperOpen: function (order) {
            this.showAppraiseOrder(order);
        },
        openRegisteredPapper: function () {
            this.showBindPhone = true;
            //this.$dispatch("toRegistered");
        },
        showAppraiseOrder: function (order) {
        	if(this.allSetting.appraiseEdition == 0){
        		this.appraiseOrder.show = true;
        		this.appraiseOrder.order = order;
        	}else if(this.allSetting.appraiseEdition == 1){
        		console.log("-------------"+"新模式评论");
        		this.newAppraiseDialog.show = true;
        		this.newAppraiseDialog.order = order;
        	}                        
        },
        customerRefresh: function(){
            this.$broadcast("customerInfo-refresh");
        }
    },
    events: {
    	"pay-state-close":function(){
    		var that = this;
    		this.$broadcast("change-pay-state");
    	},
        "switch-shop": function (sid) {
            switchShopApi(sid, function (result) {
                if (result.success) {
                    //window.location.reload();
                    var search = window.location.search;
                    if(search.indexOf("qiehuan") == -1){
                        search = search + "&qiehuan=qiehuan";
                    }
                    window.location.href = getParam("baseUrl")+"/wechat/index"+search;
                } else {
                    this.showMessage(result.message);
                }
            });
        },
        "refresh-customer": function (user) {
            this.customer = user;
            customerInfo = user;
        },
//      "pay-order-Android": function () {
//      	var that = this;
//      	that.showSuccessMessage("亲，请输入就餐人数~",5,1000);
//          if (/Android/i.test(navigator.userAgent) || /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) {
//          	$("#customerCount").focus();
//          }
//      },
        "show-shoplist-dialog": function () {
            var that = this;
            that.loadShow = true;
            getShopList(function (list) {
                that.showShopListDialog(list, 0);
                that.loadShow = false;
                Vue.nextTick(function () {
                    var isc = new IScroll("#test_div_ddd", {
                        probeType: 2,
                        click: iScrollClick()
                    });
                });
            });
        },
        "alter": function (title, content) {
            this.showAlter(title, content);
        },
        "bind-phone": function () {
            this.showBindPhone = true;
        },
        "show-myBirthday-gift":function(){
        	this.myBirthdayGift.show = true;
        },
        "open-myBirthday-gift":function(){
        	this.openBirthdayGift.show = true;
        },
        "show-currentTimeCoupon":function(){
	    	var that = this;
	    	this.currentCoupon.show = true;
	    	this.currentCoupon.coupons = this.shop.currentCouponList;
	    	that.shop.currentTimeCoupon = false;
	    },
        "bindPhoneSuccess": function () {
            var that = this;
            getCustomer(function (customer) {//绑定手机后，更新当前账户信息
                that.customer = customer;
                customerInfo = customer;
                that.$broadcast("refresh-customerInfo", customerInfo);
                getNoticeList(2, function (data) {
                    if (data && data.length > 0) {
                        that.$emit("show-notice-list", data);
                    } else {
                        //目前不显示 优惠券 页面
                        //that.$emit("open-iframe","customer/informationCoupon");
                    }
                });
            });
        },
        "open-customer-code":function(){
        	this.iframeDialogCode.show = true;
        },
        "show-wechat-pay": function (orderForm) {
            this.payDialog(orderForm);
        },
        "reshow-wechat-pay": function (orderForm) {
            this.payAlter.show = true;
            this.payAlter.order = orderForm;
        },
        "open-subscribe": function(customer){
            location.href = baseUrl + "/restowechat/src/subscribe.html?baseUrl="+baseUrl+"&dialog=attentionPage";
        },
        "again-alipay-order":function(order){
            // this.$dispatch("emptyMessage", "请打开支付宝，扫描桌上二维码进行支付", 9999999);
            //直接跳转到 提示使用浏览器 打开的页面
            window.location.href = getParam("baseUrl")+"/restowechat/src/openAliPay.html?orderId="+order.id;
			//window.location.href = "/wechatNew/src/openAliPay.html?orderId="+order.id+"&loginpage="+pageType;
        },
        "again-shanhui-order":function(){
            window.location.href = "//m.dianping.com/shop/"+shopInfo.dazhongShopId;
        },
        "save-order-fail":function(){
            this.showPriceAlter("订单创建失败", 1, "当前订单已经不可以加菜，请重新下单！");
        },
        "save-orderBoss-fail":function(order,result){
            if(result.code == 50){
                this.showAlterForBossOrderAfter("支付失败", 1, result.message,order);
            }else if(result.code == 100){
                this.showAlterForBossOrderAfter("订单支付失败", 1, "订单金额发生改变，请重新买单！",order);
            }
        },
        "update-order-paymode": function(order){
            var that = this;
            updateOrderPayMode(order.id, order.payMode, function(res){
                that.$dispatch("emptyMessage", "付款中，请勿离开当前座位", 999999);
            });
        },
        "save-order": function (formStr, successbck) {
            var that = this;
            //this.loadShow = true;
            if(formStr.customerCount == 0 && formStr.parentOrderId == null && formStr.distributionModeId == 1){
                this.loadShow=false;
                this.showSuccessMessage("亲，请输入就餐人数~",5,1000);
                if (/Android/i.test(navigator.userAgent) || /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) {
                    $("#customerCount").focus();
                }
            } else {
                saveOrderForm(formStr, function (result) {                	
                    if(result){
                        if (result.success) {
                            that.$broadcast("save-order-success");
                            that.$broadcast("get-old-orderId", result.data.id);
                            that.loadShow = false;
                            getCustomer(function (customer) {
                                that.customer = customer;
                                customerInfo = customer;
                                that.$broadcast("refresh-customerInfo", customer);
                            });

                            if (result.data.payMode == 2) { //支付宝支付
                                if(result.data.orderState == 1){
                                    window.location.href = getParam("baseUrl") + "/wechat/index?&articleBefore=1&openAliPayPage=open&subpage=my&qiehuan=qiehuan&loginpage="+pageType;
                                    //window.location.href = "/wechatNew/src/index.html?openAliPayPage=open&subpage=my&qiehuan=qiehuan&loginpage="+pageType;
                                }else{
                                    that.changePage("my");
                                    return;
                                }
                            }
                            if(result.data.payMode == 3 || result.data.payMode == 4 || result.data.payMode == 5 || result.data.payMode == 6){// 银联，现金，美团闪惠支付
                                that.changePage("my");
                                if(result.data.payMode == 5){
                                    window.location.href = "//m.dianping.com/shop/"+shopInfo.dazhongShopId;
                                }
                                return;
                            }

                            if (result.data.paymentAmount == 0) {
                                that.paySuccess({id: result.data.id});
                            } else {
                                successbck && successbck(result.data);
                            }
                            if(result.data.payMode != 1){
                                that.iframeDialogCode.show = true;
                            }
                        } else {
                        	if(shopInfo.openManyCustomerOrder == 1){
                        		that.showPriceAlter("订单创建失败", 2, result.message);
                        	}else{
                        		that.showPriceAlter("订单创建失败", 1, result.message);
                        	}
                            
                        }
                    }

                }, function (a, b, c, d) {
                    console.log(a, b, c, d);
                    that.showAlter("提示", a + b + c + d);
                    this.loadShow = false;
                });
            }
        },
        "repay-order": function (formStr, successbck) {
            var that = this;
            //this.loadShow = true;
            if(formStr.customerCount == 0 && formStr.parentOrderId == null && formStr.distributionModeId == 1){
                this.loadShow=false;
                this.showSuccessMessage("亲，请输入就餐人数~",5,1000);
                if (/Android/i.test(navigator.userAgent) || /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) {
                    $("#customerCount").focus();
                }
            } else {
                resaveOrderForm(formStr, function (result) {
                    if (result.success) {
                        that.loadShow = false;
                        getCustomer(function (customer) {
                            that.customer = customer;
                            customerInfo = customer;
                            that.$broadcast("refresh-customerInfo", customer);
                        });

                        if (result.data.payMode == 2) { //支付宝支付
                            that.changePage("my");
                            return;
                        }

                        if (result.data.paymentAmount == 0) {
                            that.paySuccess({id: result.data.id});
                        } else {
                            successbck && successbck(result.data);
                        }
                    } else {
                        that.showAlter("买单失败", result.message);
                    }
                }, function (a, b, c, d) {
                    console.log(a, b, c, d);
                    that.showAlter("提示", a + b + c + d);
                    this.loadShow = false;
                });
            }
        },
        "save-order-houfu": function (formStr, successbck) {
            var that = this;
            if(formStr.customerCount == 0 && formStr.parentOrderId == null && formStr.distributionModeId == 1){
                this.showSuccessMessage("亲，请输入就餐人数~",5,1000);
                if (/Android/i.test(navigator.userAgent) || /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) {
                    $("#customerCount").focus();
                }
            } else {
                saveOrderForm(formStr, function (result) {
                    if (result.success) {
                        getCustomer(function (customer) {
                            that.customer = customer;
                        });
                        if (result.data.paymentAmount == 0) {
                            successbck && successbck(result.data);
                        } else {
                            that.paySuccessHouFu({id: result.data.id}, {order: result.data});
                        }
                        that.iframeDialogCode.show = true;
                    } else {
                        if(shopInfo.openManyCustomerOrder == 1){
                            that.showPriceAlter("订单创建失败", 2, result.message);
                        }else{
                            that.showPriceAlter("订单创建失败", 1, result.message);
                        }
                    }
                }, function (error) {
                    this.loadShow = false;
                });
            }
        },
        "loading": function () {
            this.loadShow = true;
        },
        "loaded": function () {
            this.loadShow = false;
        },
        "close-message": function () {
            this.wMessage.show = false;
        },
        "message": function (msg, time) {
            this.showMessage(msg, time);
        },
        "successMessage": function (msg,time) {
            this.showSuccessMessage(msg,1,time);
        },
        "remindMessage": function (msg,time) {
            this.showSuccessMessage(msg,2,time);
        },
        "emptyMessage": function (msg,time) {
            this.showSuccessMessage(msg,3,time);
        },
        "loadingMessage": function (msg,time) {
            this.showSuccessMessage(msg,4,time);
        },
        "loadingUnit": function (msg,time) {
            this.showSuccessMessage(msg,6,time);
        },
        "loadingUnitSuccess": function () {
            this.showSuccessMessageFail(6);
        },
        "show-dialog": function (option) {
            this.showDialog(option);
        },
        "total-push-order": function (sum) {
            this.orderSum = sum;
        },
        "push-order": function (order) {
            this.paySuccess(order);
        },
        "charge": function (charge_id, successCbk, cancelCbk) {
            var that = this;
            //if(!that.customer.isBindPhone||!that.customer.telephone){
            //	this.chargeDialog.show=false;
            //	that.$dispatch("bind-phone");
            //	that.$dispatch("loaded");
            //	return;
            //}
            chargeWxRequest(charge_id, that.customer.id, function () {
                that.$broadcast("charge-success");
                getCustomer(function (customer) {
                    that.customer = customer;
                    customerInfo = customer;
                    that.$broadcast("refresh-customerInfo", customer);
                });
                getChargeList(function(chargeRules){
					var chargeListOther = [];
					for(var i = 0; i < chargeRules.length; i++){
						if(chargeRules[i].state == 1){
							chargeListOther.push(chargeRules[i]);
						}
					}
					that.chargeList = chargeListOther;
				});
//              that.$broadcast("charge-success-money");
            }, function () {
                cancelCbk && cancelCbk();
            });
        },
        "show-charge-dialog": function (chargeList) {
            if (chargeList.length > 0) {
                this.chargeDialog.chargeList = chargeList;
                this.chargeDialog.show = true;
            }
        },
        "pay-order": function (paymode, order) {
            if ("wechat" == paymode) {
                this.payOrderWx(order);
            }
        },
        "show-custom-neworder": function (order, op) {
            this.showCustomerNewOrder(order, op);
        },
        "show-custom-neworder-houfu": function (order, op) {
            this.showCustomerNewOrderHouFu(order, op);
        },
        "show-custom-neworder-houfu-false": function () {
            this.showCustomerNewOrderHouFuFalse();
        },
        "cancel-order": function (order) {
            this.closeOrder(order);
        },
        "appraise-order": function (order) {
            this.showAppraiseOrder(order);
        },
        "save-appraise": function (appraise) {
            var that = this;
            saveOrderAppraise(appraise, function (result) {
                if (result.success) {
                    var shareSetting = result.shareSetting;
                    var money = result.data.redMoney;
                    that.redOpenDialog = $.extend(that.redOpenDialog, that.redPapperDialog, {appraise: result.data});
                    that.redOpenDialog.money = money;
                    that.redOpenDialog.show = true;
                    if (appraise.level >= shareSetting.minLevel && appraise.content.length >= shareSetting.minLength){
                        that.redOpenDialog.allowshare = true;
                    }
                    that.$broadcast("save-appraise-success");
                    //that.customer.account += money;
                    //customerInfo.account += money;
                    that.customerRefresh();
                    getCustomerNewOrder(appraise.orderId, function (order) {
                        that.redOpenDialog.order = order;
                    });
                } else {
                    that.showAlter(result.message);
                }
            });
        },
        "save-new-appraise":function(data,appraise){
        	var that = this;
        	console.log(JSON.stringify(data));
        	var shareSetting = data.shareSetting;
            var money = data.redMoney;
            that.redOpenDialog = $.extend(that.redOpenDialog, that.redPapperDialog, {appraise: appraise});
            that.redOpenDialog.money = money;
            that.redOpenDialog.show = true;
            
            that.customerRefresh();
            if (appraise.level >= shareSetting.minLevel && appraise.content.length >= shareSetting.minLength){
                that.redOpenDialog.allowshare = true;
            }
            that.$broadcast("save-appraise-successful");
        },
        "my-page-detached": function () {
            this.customNewOrder.show = false;
        },
        "receive-red-papper": function (order) {
            var that = this;
            if("closeRedPacket" == getParam("dialog")){
                that.redPapperDialog.show = false;
            }else{
                that.redPapperDialog.show = true;
            }
            that.redPapperDialog.name = that.shop.name;
            that.redPapperDialog.customer = that.customer;
            that.redPapperDialog.title = "完成消费评价即可领取!";
            that.redPapperDialog.order = order;
        },
        "receive-red-papper-registered": function () {
            var that = this;
            //根据 链接 判断 显示的优惠券(新用户注册或者邀请注册)
            var couponType = getParam("dialog") ? "1" : "0";
            if("closeRedPacket" == getParam("dialog") || "myYue" == getParam("dialog") || "invite" == getParam("dialog")
                || "myCouponList" == getParam("dialog") || "reChargeOrder" == getParam("dialog")){
                couponType = "0";
            }
            if(openRedRegiest){
                showCouponList({"couponType": couponType}, function (result) {
                    //如果商家设定的有优惠券，则显示  【红包-开】 样式
                    //if(that.customer.lastOrderShop.length > 0){
                    if (result.success && result.data.length > 0) {
                        that.redPapperRegisteredDialog.show = true;
                        that.redPapperRegisteredDialog.name = that.shop.name;
                        that.redPapperRegisteredDialog.title = "完成注册即可领取!";
                    } else {//否则 直接显示注册页面
                        that.openRegisteredPapper();
                    }
                    //}
                })
            }
        },
        "show-callnumber-dialog": function (order) {
            this.callNumberDialog.order = order;
            this.callNumberDialog.show = true;
        },
        "open-iframe": function (src) {
            src = src + "?baseUrl=" + baseUrl;
            this.iframeDialog.src = src;
            this.iframeDialog.show = true;
        },
        "show-notice": function (n) {
            this.noticeDialog.show = true;
            this.noticeDialog.notice = n;
            this.noticeDialog.noticelist = n;
        },
        "show-notice-list": function (notices) {
            this.noticeListDialog.show = true;
            this.noticeListDialog.noticelist = notices;
        },
        "continue-order": function (order) {
            var menu = this.findMenu('tangshi');
            this.changePage(menu);
            this.otherdata = order;
            this.$set("otherdata.event", "continue-order");
        },
        "open-reward-dialog": function (appraise) {
            this.rewardDialog.show = true;
            this.rewardDialog.appraise = appraise;
        },
        "use-my-coupon": function(){
        	var that = this;
    		that.changePage("tangshi");
    		that.$broadcast("close-coupon-dialog");
        },
        "to-my-page":function(){
        	var that = this;
    		that.changePage("my");
        },
        "show-share-coupon": function(obj){
        	this.myShareCoupon.show = true;
        	this.myShareCoupon.sharecoupons = obj;
        },
        "show-new-package":function(){
        	this.showNewPackage();
        },
        "reload-shop-cart":function(){
        	this.$broadcast("reload-cart");
        }
    },
};

function resetWindow() {
    var main_menu = $("#main-menu")
    var content = $("#content-home");
    var height = $(window).height();
    content.height(height - main_menu.height());
    content.css({
        overflow: "hidden",
        position: "relative"
    });
    $(".stopIscroll").height(height - main_menu.height());
}