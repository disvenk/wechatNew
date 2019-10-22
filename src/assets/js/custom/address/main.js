
var customerInfo = new Object();
$.ajax({
    url : baseUrl+"/wechat/customer/new/customer",
    type:"post",
    async: false,
    success : function(user) {
        customerInfo = user.data;
    }
});

var mainBaseMix = {
	el:"#app",
	data : function(){
		return {
			wMessage: {show: false, message: null, type:null}			
		}
	},
	created:function(){
				
	},
	ready:function(){
		
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