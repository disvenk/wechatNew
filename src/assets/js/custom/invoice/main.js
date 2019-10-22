
var customerInfo = new Object();
var shopInfo = new Object();
var ticketMode = new Object();

//如果从消息推送进入页面
if(getParam("shopId") != null && getParam("customerId") != null){
	shopInfo.id = getParam("shopId");
	customerInfo.id = getParam("customerId");
}else{
	$.ajax({
	    url : baseUrl+"/wechat/customer/new/customer",
	    type:"post",
	    async: false,
	    success : function(user) {
	        customerInfo = user.data;
	    }
	});	
	$.ajax({
	    url : baseUrl+"/wechat/shop/new/currentshop",
	    type:"post",
	    async: false,
	    success : function(res) {
	        shopInfo = res.data;
	    }
	});
}

if(getParam("invoiceType") == 1){
	ticketMode = 1;
}else if(getParam("invoiceType") == 2){
	ticketMode = 2;
}



var mainBaseMix = {
	el:"#app",
	data : function(){
		return {
			wMessage: {show: false, message: null, type:null},
			choiceType:1,
			paperTypeList:[
				{
					name:'发票抬头',
					selectMenuType : 1,
					routerName:'head'
				},
				{
					name:'申请发票',
					selectMenuType : 2,
					routerName:'apply'
				},
				{
					name:'历史记录',
					selectMenuType : 3,
					routerName:'history'
				}
			],
			ticketMode:ticketMode		//选择的发票类型
		}
	},
	created:function(){
		var localUrl = window.location.href;
		if (localUrl.indexOf("head") != -1){
			this.choiceType = 1;
		}else if(localUrl.indexOf("apply") != -1){
			this.choiceType = 2;
		}else{
			this.choiceType = 3;
		}				
		console.log(this.ticketMode);
	},
	ready:function(){
		var that = this;
		window.addEventListener("popstate", function(e) {			
			var localUrl = window.location.href;
			if (localUrl.indexOf("head") != -1){
				that.choiceType = 1;
			}else if(localUrl.indexOf("apply") != -1){
				that.choiceType = 2;
			}else{
				that.choiceType = 3;
			}
		}, false);
	},	
	methods:{
		showAlter: function (msg ,type, time) {
			this.wMessage.show = true;
			this.wMessage.type = type;
			this.wMessage.message = msg;
			var that = this;
			setTimeout(function () {
				that.wMessage.show = false;
			}, time || 1000);
		},
		selectType:function(f){
			this.choiceType = f.selectMenuType;
		}
	},
	events: {
		"successMessage": function (msg,time) {
            this.showAlter(msg,1,time);
        },
        "remindMessage": function (msg,time) {
            this.showAlter(msg,2,time);
        },
	}
}