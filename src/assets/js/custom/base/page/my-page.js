var myBaseMix = {
	template:$("#my-temp").html(),	
	mixins:[subpageMix,orderMiniMax],
	data:function(){
		return {
			orderlist:[],
			chargeList:[],
			shareSetting:null,
			isc:null,
			load:false,
			over:false,
			pageOption:{start:0,datalength:5,orderState:"1,2,10,11",},
			setting: null,
			money:0,
			iframeDialogCode:{show:false},
			allSetting:allSetting,
			customerInfo:customerInfo,
			pageType:pageType,
			customerDiscount: null,
			invoiceType:{show:false}
		};
	},
	methods:{
		showMeCode:function(){
    		this.iframeDialogCode.customer = this.customerInfo;
        	this.iframeDialogCode.show = true;			
		},
		showMyComment:function(){
			//window.location.href = "/wechatNew/src/views/myComment.html";
			location.href = baseUrl + "/restowechat/src/views/myComment.html?baseUrl="+baseUrl;
		},
		showMyRecord:function(){
//			window.location.href = "/wechatNew/src/views/myRecord.html";
			location.href = baseUrl + "/restowechat/src/views/myRecord.html?baseUrl="+baseUrl;
		},
		showInvoice:function(){
			if(allSetting.openTicket == true){		//bo端开启电子发票
				this.invoiceType.show = true;
			}else{
				//window.location.href = "/wechatNew/src/views/invoice.html?invoiceType="+1;
				location.href = baseUrl + "/restowechat/src/views/invoice.html?baseUrl="+baseUrl+"&invoiceType="+1;
			}			
		},
		showMyAddress:function(){
//			window.location.href = "/wechatNew/src/views/myAddress.html";
			location.href = baseUrl + "/restowechat/src/views/myAddress.html?baseUrl="+baseUrl;
		},
		registerNow:function(){
			var that = this;
			that.$dispatch("receive-red-papper-registered");
		},
		openMybirthdayGift:function(){
			var that = this;
			that.$dispatch("open-myBirthday-gift");
		},
		reflushIsc:function(){
			if(this.isc){
				this.isc.refresh();
			}else{
				var that = this;
				this.isc = new IScroll(this.$el,{
					probeType : 2,
					click:iScrollClick(),
				});
				this.isc.on("scrollEnd",function(){
					if (this.y <= this.maxScrollY) {
						that.loadNextPage();
					}
				});
			}
		},
		loadNextPage:function(sbk){
			var that = this;
			if(!this.load&&!this.over){
				this.load=true;
				that.pageOption.start = that.pageOption.start+that.pageOption.datalength;
				getOrderList(that.pageOption,function(orderlist){
					for(var i in orderlist){
						that.orderlist.push(orderlist[i]);
					}
					if(orderlist.length<that.pageOption.datalength){
						that.over=true;
					}
					Vue.nextTick(function(){
						that.reflushIsc();
					});
					that.load=false;
				});
			}
		},
		customerByOrderForMyPage:function(callback){
			customerByOrderForMyPage(function(o){
				callback&&callback(o);
			});
		},
		getOrderAndBind:function(oid,callback){
			var that = this;
			getCustomerNewOrder(oid,function(o){
				if(!o){
					return;
				}
				for(var i in that.orderlist){
					var od = that.orderlist[i];
					if(od.id==o.id){
						o = $.extend(od,o);
						break;
					}
				}
				callback&&callback(o);
			});
		},
		getOrderListInfo:function(){
			var that = this;
			getOrderList(this.pageOption,function(orderlist){
				that.orderlist  = orderlist||[];
				Vue.nextTick(function(){
					that.reflushIsc();
				})
				var showDialogName = getParam("dialog");

				var oid = getParam("orderId");
				switch (showDialogName) {
					case "redpackage":
						that.getOrderAndBind(oid,function(o){
							if(o.orderState == 10 && o.allowAppraise == 1){
								that.$dispatch("receive-red-papper",o);
							}else{
								that.$dispatch("show-custom-neworder",o);
							}
						});
						break;
					case "callnumber":
						that.getOrderAndBind(oid,function(o){
							if(o.productionStatus==2){
								that.$dispatch("show-callnumber-dialog",o);
							}else if(o.productionStatus==0){
								that.$dispatch("push-order-api",o);
								that.$dispatch("show-callnumber-dialog",o);
							}else{
								that.$dispatch("show-custom-neworder",o);
							}
						});
						break;
					case "account":
						this.$dispatch('open-iframe','views/informationCoupon.html');
						break;
					default:
						that.getOrderAndBind(null,function(o){
							if(o.orderMode != 2){ //不是电视叫号
								//if(o.orderState==10){
								//	that.$dispatch("receive-red-papper",o);
								//}else{
									that.$dispatch("show-custom-neworder",o);
								//}
							}else{ //电视叫号模式
								if(o.productionStatus == 0 && o.payMode != 1){
									that.autoPrint(o);
								}else{
									that.$dispatch("show-custom-neworder",o);
								}
							}
						});
						break;
				}
			});
		}
	},
	created:function(){
		var that = this;
		this.allSetting = allSetting;
		if(memberActivityCustomer!=null){
        	this.customerDiscount = memberActivityCustomer.discount*10;
        }
		$.ajax({
			url : baseUrl+"/wechat/customer/new/customer",
			type:"post",
			async: false,
			success : function(user) {
				that.customer = user.data;
				that.customerInfo = user.data;
			}
		});			
		
		getChargeList(function(chargeRules){
			var chargeListOther = [];
			for(var i = 0; i < chargeRules.length; i++){
				if(chargeRules[i].state == 1){
					chargeListOther.push(chargeRules[i]);
				}
			}
			that.chargeList = chargeListOther;
			if(getParam("dialog")!= null && getParam("dialog")=="reChargeOrder"){
				that.$dispatch('show-charge-dialog', that.chargeList);
			}
		});

		this.getOrderListInfo();
		this.$on("customerInfo-refresh", function () {
			$.ajax({
				url : baseUrl+"/wechat/customer/new/customer",
				type:"post",
				async: false,
				success : function(user) {
					that.customer = user.data;
					that.customerInfo = user.data;
					customerInfo = user.data;
				}
			});
		});
		
		this.$on("refresh-customerInfo", function (customer) {
            that.customerInfo = customer;
        });
		
		this.$on("pay-success", function () {
            that.getOrderListInfo();
        });
		if(getParam("dialog")!= null && getParam("dialog")=="myYue"){
			that.$dispatch("open-iframe","views/informationAccount.html");
		}
		if(getParam("dialog")!= null && getParam("dialog")=="myCouponList" || getParam("dialog")=="myCoupon"){
			that.$dispatch("open-iframe","views/informationCoupon.html");
		}
		if(getParam("dialog")!= null && getParam("dialog")=="scanAqrCode"){
			that.showMeCode();
		}

        if(getParam("waitQueue")!= null){
			getOrderById(getParam("waitQueue"), function (o) {
                that.$dispatch("show-callnumber-dialog", o);
            })
        }
			
		if(getParam("dialog")!= null && getParam("dialog")=="invite"){
			that.showMeCode();
		}		
		
		if(getParam("dialog")!= null && getParam("dialog")=="closeBossOrder"){
			this.$broadcast("close-bossOrder");
		}

        if(getParam("showRedMoney") != null && getParam("showRedMoney") == "true"){
        	getCustomerNewOrder(getParam("orderId"), function (o) {
				if(o.allowAppraise == 1){
					that.order = $.extend(that.order, o);
					that.$dispatch("receive-red-papper", that.order);
					that.$broadcast("orderDetail-closed");
				}
            })
        }
	},
	ready:function(){
		$('#myCode').bind("click",function(event){
	        event.stopPropagation();    //  阻止事件冒泡
	    });
		$('#myBirth').bind("click",function(event){
	        event.stopPropagation();    //  阻止事件冒泡
	    });
	    $('#register').bind("click",function(event){
	        event.stopPropagation();    //  阻止事件冒泡
	    });
	    $('#myInfo').bind("click",function(event){
			//window.location.href = "/wechatNew/src/views/myInformation.html";
			location.href = baseUrl + "/restowechat/src/views/myInformation.html?baseUrl="+baseUrl;
	    });
	},
	detached:function(){
		this.$dispatch("my-page-detached");
	},
	components:{
		"iframe-dialog-code":{
			props:["show","customer","setting","money"],
			template: '<div class="weui_dialog_confirm sencond_mask red_papper" v-if="show">' +
		    '	<div class="weui_mask" @click="close"></div>' +
		    '	<div class="weui_dialog red_bg" style="font-family:微软雅黑;">' +
		    '		<div class="topcontent">' +
		    '			<div class="red_avatar">' +
		    '				<img :src="customer.headPhoto">' +
		    '				<span class="close" @click="close">+</span>' +
		    '			</div>' +
		    '			<div>' +
		    '				<span class="text">{{customer.nickname}}</span>' +
		    '				<img class="customerSexSmallCode" src="assets/img/oldMan.png" v-if="customer.sex == 1" />'+
			'				<img class="customerSexSmallCode" src="assets/img/oldWoman.png" v-if="customer.sex == 2" />'+
		    '			</div>' +
		    '			<span class="scanCode" style="margin-top:5px;">邀请朋友扫一扫,送他/她<i v-if="money>0">{{money}}元红包</i><i v-if="money==0">红包</i></span>' +
		    '			<span class="scanCode">朋友到店消费后,您将获得<i v-if="setting.minMoney>=0&&setting.maxMoney>0">{{setting.minMoney}}-{{setting.maxMoney}}元</i>返利</span>' +
            //'			<span class="scanCode" style="margin-top:3px;">邀请您体验{{brand.brandName}}</span>' +
            //'			<span class="scanCode">扫一扫/长按二维码，领取<i v-if="money>0">{{money}}元红包</i><i v-if="money==0">红包</i></span>' +
		     '		</div>' +
		    '		<div class="posCode">' +
		    '       	<img src="{{codeSrc}}" class="myCodeSrc" alt="二维码" />' +
		    '			<span class="scanCodeMar" style="display:block;color:#fff;">已成功邀请<i>{{count}}</i>名好友到店消费</span>' +
    		'			<span style="display:block;color:#fff;">总计获得<i>{{sumMoney.toFixed(2)}}</i>元奖励</span>' +
		    '		</div>' +
		    '   </div>' +
		    '</div>',
			data: function () {
				return {
					codeSrc:null,
					count:0,
					sumMoney:0,
					brand:{},
				}
			},
			methods: {
				close: function () {
					this.show = false;
				}
			},
			created:function(){
				var that = this;
				this.$watch("show",function(){
					if(that.show){
						$.ajax({
							url: getParam("baseUrl") + "/wechat/setting",
							type:"post",
							success: function (result) {
								that.brand = result.brand;
							}
						});
						getCustomer(function (customer) {
							that.customer = customer;
							shareCustomerCount(customer.id,function(result){
								that.count = result.count;
								if(result.sumMoney != null){
									that.sumMoney = result.sumMoney;
								}
							});
						});
						getModuleSetting(function (res) {
							var arr = res.toString().split(",");
							var flag = false;
							for(var i in arr){
								if(arr[i] == 1){
									flag = true;
								}
							}
							if(flag){
								getShareDetailed(null, function (result) {
									if(result.setting.isActivity == 1){
										that.setting = result.setting;
									}
								});
							}
						});
						showCouponList({"couponType": "1"}, function(result){
							that.money = 0;
							if (result.success && result.data.length > 0) {
								for(var i=0; i<result.data.length; i++){
									that.money += result.data[i].couponValue * result.data[i].couponNumber;
								}
							}
						});
					}
				});
				this.codeSrc = baseUrl + "/wechat/customer/new/vCode?baseUrl=" + baseUrl;
			}
		},
		"invoice-type":{
            props:["show"],
            template:'<div class="weui_dialog_confirm" v-if="show">' +
            '	<div class="weui_mask" @click="close"></div>' +
            '	<div class="weui_dialog transparent choice-mode" style="top:35%;">' +
            '		<a class="weui_btn weui_btn_primary" @click="choiceInvoiceType(2)" style="width:50vw;margin:0 auto;">电子发票</a>' +
            '		<a class="weui_btn weui_btn_default" @click="choiceInvoiceType(1)" style="background-color: #868686;color: #fff;width:50vw;margin-left:0;">纸质发票</a>' +
            '	</div>' +
            '</div>',
            data:function(){
                return {
                    
                }
            },
            created:function(){
                var that = this;                
                this.$watch("show", function () {
                    if(this.show){
                    		
                    }
                });
            },
            methods:{
                close:function(){
                    this.show=false;
                },
                choiceInvoiceType: function(mode){
            		this.show = false;
            		//window.location.href = "/wechatNew/src/views/invoice.html?invoiceType="+mode;
            		location.href = baseUrl + "/restowechat/src/views/invoice.html?baseUrl="+baseUrl+"&invoiceType="+mode;
                }
            }
        }
	}
};