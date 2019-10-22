var historyBaseMix = {
	data:function(){
		return {
			historyList:[],
			myScroll:null,
			ticketMode:ticketMode,
			emailDialog:{show:false,ticket:null}
		}
	},
	methods:{
		resetHeight:function() {
		    var content = $("#historyList");
		    var height = $(window).height();
		    content.height(height - 50);
		    content.css({
		        overflow: "hidden",
		        position: "relative"
		    });
		},
		sendEmail:function(f){
			this.emailDialog.show = true;
			this.emailDialog.ticket = f;
		}
	},
	created:function(){	
		var that = this;
		searchInvoiceOrder(shopInfo.id,customerInfo.id,3,function(result){
			that.historyList = result.data;
		})			
	},
	ready:function(){
		var that = this;
		that.resetHeight();
		if(that.historyList){
			setTimeout(function(){
				that.myScroll = new IScroll("#historyList",{
					probeType : 2,
					click:iScrollClick
				});
			},1000)			
		}
	},
	components:{
		"email-dialog":{
			props:["show","ticket"],
			template:
			'<div v-if="show">'+
			'<div class="weui-mask"></div>'+
				'<div class="weui-dialog" style="z-index:1000;">'+
				'<div class="weui-dialog__hd"><strong class="weui-dialog__title">邮箱地址</strong></div>'+
				'<div class="weui-dialog__bd">'+
				'<div class="weui-cell">'+
                	'<div class="weui-cell__bd">'+
	                    '<input class="weui-input" type="text" v-model="email" placeholder="请输入邮箱">'+
	                '</div>'+
            	'</div>'+
                '<div class="weui-dialog__ft">'+
                    '<a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_default" @click="close">取消</a>'+
                    '<a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary" @click="send">确定</a>'+
                '</div>'+
            '</div>'+
            '</div>',
            data:function(){
            	return {
        		  	ticketMode:ticketMode,
        		  	email:'',
        		  	sendBtn:true
            	}
            },
			created:function(){	
				
			},
			methods:{
				close:function(){
					this.show = false;
					this.email = ''
					console.log(this.ticket);
				},
				send:function(){
					var that = this;
					if(this.sendBtn){
						var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
						if(this.email == ''){
							that.$dispatch("remindMessage", "请输入邮箱", 3000);
							return;
						}
						if(!reg.test(this.email)){
							that.$dispatch("remindMessage", "邮箱格式错误!", 3000);
						}else{
							that.sendBtn = false;
							sendEmail(this.email,this.ticket.id,function(res){
								if(res.success){
									that.show = false;
									this.email = ''
									that.$dispatch("successMessage", "发送成功", 3000);
									setTimeout(function () {
	                                    that.sendBtn = true;
	                                },3000);
								}else{
									that.show = false;
									that.$dispatch("remindMessage", "发送失败,请联系商家", 3000);
								}
							})
						}
					}
										
				}
			}
		}
	}
}