
var applyBaseMix = {
	data : function(){
		return {			
			applyInvoice:false,
			orderList:null,
//			checkId:null,
			selectOrder:0,		
			orderInfo:true,
			inVoiceMoney:null,
			typeList:[
				{
					name:'单位',
					state:1
				},
				{
					name:'个人',
					state:2
				}
			],
			currentType:{},
			choiceVoiceDialog:{show:false,type:null},
			applySuccessDialog:{show:false},
			selectInfor:null,
			alreadyChoice:[],
			insertReceiptList:[],
			confirmBtn:false,
			myScroll:null,
			ticketMode:ticketMode,		//发票类型
			eleTicketInfo:{
				type:null,			//类型1单位2个人
				name:"",			//抬头名称
				dutyParagraph:"",	//公司税号	
				companyAddress:"",	//公司地址
			    bankNumber:"",		//银行账号				    
			    mobileNo:"",		//联系电话	    
			    bankOfDeposit:"",	//开户银行	    
			    customerId:"",		//用户id	   
			    email:"",
			    state:0
			},
			editBtn:true,
			newTicketInfo:null
		}
	},
	computed : {
		alreadyChoiceMoney : function(){
			var sum = 0;
			for(var i = 0 ; i < this.alreadyChoice.length ; i++){
				// 是否需要四舍五入
				sum += parseInt(this.alreadyChoice[i].receiptMoney);
			}
			return sum;
		}
	},
	methods:{
		confirmInvoice:function(){
			var that = this;
			if((!that.eleTicketInfo.name || !that.eleTicketInfo.dutyParagraph) && that.currentType.state == 1){
				that.$dispatch("remindMessage", "请补全发票抬头", 3000);
				return;				
			}
			if(!that.eleTicketInfo.name && that.currentType.state == 2){
				that.$dispatch("remindMessage", "请填写发票抬头", 3000);
				return;
			}
			
			/*避免重复点击多次*/
			if(this.confirmBtn){
                return;
            }
            this.confirmBtn = true;            
            setTimeout(function(){
                that.confirmBtn = false;
            },5000);
            if(this.ticketMode == 1){
            	for(var i=0;i<this.alreadyChoice.length;i++){
					var item = this.alreadyChoice[i];
					insertVoices(item.orderNumber,new Date(item.payTime.time).format("yyyy-MM-dd hh:mm:ss"),item.orderMoney,item.receiptMoney,this.selectInfor.id,shopInfo.id,0,function(result){
						if(result.success){
							that.insertReceiptList = result.data;
							that.$dispatch("successMessage", "申请发票成功", 3000);
							that.applySuccessDialog.show = true;
						}					
					})
				}
            }
            else if(this.ticketMode == 2){
				var obj = {
				 	receipt:{
						payTimeStr:	new Date(this.newTicketInfo.payTime.time).format("yyyy-MM-dd hh:mm:ss"),		//支付时间
	   					orderNumber: this.newTicketInfo.orderNumber,		//流水号
					   	orderMoney:	this.newTicketInfo.orderMoney,		 	//订单金额
					   	receiptMoney: this.newTicketInfo.receiptMoney,		//可开票金额
					   	receiptTitleId: this.eleTicketInfo.id				//抬头id
				  	},
					title:{
						type: that.currentType.state,
						name: that.eleTicketInfo.name,
						dutyParagraph: that.eleTicketInfo.dutyParagraph,
					  	companyAddress: that.eleTicketInfo.companyAddress,
					  	mobileNo: that.eleTicketInfo.mobileNo,
					   	bankOfDeposit: that.eleTicketInfo.bankOfDeposit,
					   	bankNumber: that.eleTicketInfo.bankNumber,
					   	customerId: customerInfo.id,
					   	email: that.eleTicketInfo.email,
						state: 0
					}
				}
									
            	applyEleTicket(obj,function(res){
            		if(res.success){
            			that.$dispatch("successMessage", "申请发票成功", 3000);
						that.applySuccessDialog.show = true;
            		}else{
            			that.$dispatch("remindMessage", "申请发票失败", 3000);
            		}
            	})
            }
						
		},
		applyTicket:function(){	
			var that = this;	
			if(this.alreadyChoice.length==0){
				return;
			} 
					
			this.applyInvoice = true;
			this.orderInfo = false;
			getDefault(customerInfo.id,function(result){
				that.selectInfor = result.data[0];
				console.log(JSON.stringify(that.selectInfor));
			})			
		},
		getTicketInfo:function(f){
			this.newTicketInfo = f;
			this.applyInvoice = true;
			this.orderInfo = false;
			console.log(JSON.stringify(f));
		},
		changeType:function(f){
			this.currentType = f;
		},
		choiceVoices:function(){
			this.choiceVoiceDialog.show = true;
			this.choiceVoiceDialog.type = this.currentType.state;
		},
		selectBox:function(f){
			var that = this;
			for(var i = 0;i < this.alreadyChoice.length;i++){
				var item = this.alreadyChoice[i];
				if(item.orderNumber == f.orderNumber){
					this.alreadyChoice.splice(i, 1);
					return;
				}
			}			
			this.alreadyChoice.push(f);
			this.selectOrder = this.alreadyChoice.length;
		},
		resetWindow:function(){
			var main_menu = $(".applyBtn")
		    var content = $("#hasOrderInfo");
		    var height = $(window).height();
		    content.height(height - main_menu.height()-49);
		    content.css({
		        overflow: "hidden",
		        position: "relative"
		    })	
		}
	},
	created:function(){
		var that = this;
		this.currentType = this.typeList[0];
		searchInvoiceOrderList(customerInfo.id,shopInfo.id,function(result){
			that.orderList = result.data;
		})
//		applyEleTicket(customerInfo.id,shopInfo.id,function(result){
//			console.log(JSON.stringify(result));
//		})
	},
	ready:function(){
		var that = this;
		that.resetWindow();
//		if(that.orderList.length>0){
			setTimeout(function(){
				that.myScroll = new IScroll("#hasOrderInfo",{	
					click:true
				});
			},1500)			
//		}
	},
	events: {
		"sent-invoice":function(f){
    		this.selectInfor = f;
    		this.eleTicketInfo = f;
    		console.log(JSON.stringify(this.selectInfor));
    	},
	},
	components:{
		"voices-list":{
			props:["show","type"],
			template:
				'<div class="weui_success_toast" style="background-color: #f8f8f8;" v-if="show">' +
					'<div class="weui-cell weui-cell_access" v-if="this.inVoiceList.length>0" v-for="f in inVoiceList" @click="close(f)">'+
		                '<div class="weui-cell__bd">'+
		                    '<p>{{f.name}}</p>'+
		                    '<p class="weui-btn weui-btn_mini" style="background-color: #0398ff;margin-top: 10px;" v-if="f.type == 1">单位</p>'+
		                    '<p class="weui-btn weui-btn_mini" style="background-color: #ff7421;margin-top: 10px;" v-if="f.type == 2">个人</p>'+
		                '</div>'+		                
		            '</div>	'+
		            '<div class="successInfo" v-if="!inVoiceList.length">'+
	        			'<p>暂未有任何发票抬头</p>'+
	        		'</div>'+
	        		'<button type="button" class="weui-btn weui-btn_primary" id="addBtn" v-if="!inVoiceList.length" @click="creatdInvoice">新建抬头</button>'+
				'</div>',
            data:function(){
            	return {
            		inVoiceList:[],           		
            	}
            },
			created:function(){
				var that = this;
				this.$watch("show", function () {
					if(this.show){
						getTypeList(customerInfo.id,that.type,function(result){
							that.inVoiceList = result.data;							
						})
					}
				});								
			},
			methods:{
				creatdInvoice:function(){
					this.show=false;
					this.$router.replace({ path: '/head' });
				},
				close:function(f){
					this.show=false;
					this.$dispatch("sent-invoice",f);
				}
			}
		},
		"apply-success":{
			props:["show"],
			template:
				'<div class="weui_success_toast" v-if="show">'+
        		'<div class="successInfo" v-if="ticketMode == 1">'+
        			'<p>开票信息已发送到前台</p>'+
		        	'<p>请用餐后到前台领取相关发票</p>'+
		        	'<p>感谢您的支持</p>'+
        		'</div>'+	
        		'<div class="successInfo" v-if="ticketMode == 2">'+
        			'<p>开票已完成</p>'+
		        	'<p>请至历史记录发送至个人邮箱</p>'+
		        	'<p>感谢您的支持</p>'+
        		'</div>'+
        		'<button type="button" class="weui-btn weui-btn_primary" id="addBtn" @click="backToApply">发送至邮箱</button>'+
	       ' </div>',
            data:function(){
            	return {
        		  	ticketMode:ticketMode    		
            	}
            },
			created:function(){
//				var that = this;
//				this.$watch("show", function () {
//					if(this.show){
//						
//					}
//				});								
			},
			methods:{
				backToApply:function(){
					this.show=false;
					this.$router.replace({ path: '/history' });
				}
			}
		}
	}
}