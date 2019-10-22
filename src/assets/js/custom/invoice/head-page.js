var headBaseMix = {
	data:function(){
		return {			
			inVoiceList:null,
			show:false,
			checkAccount:false,
			editBtn:true,
			inVoice:{},			
		}
	},
	methods:{
		addInvoices:function(){			
			if(this.inVoiceList.length>=5){
				this.$dispatch("remindMessage", "最多可设置5条抬头", 3000);
				return;
			}
			this.$router.go("/head/detail");
		},
		showInVoice:function(f){
			this.inVoice = f;
			this.show = true;
			this.codeSrc = baseUrl + "/wechat/receipt/qrcode?content=" + f.name+"&width=250&height=250";
		},
		useChecked:function(){
			this.checkAccount = !this.checkAccount;
		},
		editState:function(){
			this.editBtn = false;
		},
		saveState:function(){
			var that = this;
			this.show = false;
			if(this.inVoice.id){
				if(this.checkAccount){
					updateInvoice(customerInfo.id,that.inVoice.id,that.inVoice.type,that.inVoice.name,
						that.inVoice.dutyParagraph,that.inVoice.companyAddress,that.inVoice.mobileNo,that.inVoice.bankOfDeposit,that.inVoice.bankNumber,1,function(result){
						if(result.success){
							getInvoiceList(customerInfo.id,function(result){
				    			setTimeout(function(){
				    				Vue.nextTick(function(){
										that.inVoiceList = result.data;
									});
				    			},500)					
							})
						}					
		    		});		    		
				}else{
					updateInvoice(customerInfo.id,that.inVoice.id,that.inVoice.type,that.inVoice.name,
						that.inVoice.dutyParagraph,that.inVoice.companyAddress,that.inVoice.mobileNo,that.inVoice.bankOfDeposit,that.inVoice.bankNumber,0,function(result){
						if(result.success){
	//						that.$dispatch("successMessage", "取消默认成功", 3000);
							getInvoiceList(customerInfo.id,function(result){
								setTimeout(function(){
				    				Vue.nextTick(function(){
										that.inVoiceList = result.data;
									});
				    			},500)
							})
						}					
		    		});
				}
			}else{
				getInvoiceList(customerInfo.id,function(result){
					that.inVoiceList = result.data;
				})				  
			}				
			this.editBtn = true;
		}
	},	
	created:function(){
		var that = this;
		getInvoiceList(customerInfo.id,function(result){
			that.inVoiceList = result.data;			
		})		
	},	
	events: {
		"update-state": function (f) {
			var that = this;
            this.show = true;
            this.inVoice = f; 
//          console.log(JSON.stringify(this.inVoice.id));
            this.codeSrc = baseUrl + "/wechat/receipt/qrcode?content=" + f.name+"&width=250&height=250";
       	},
	}
}