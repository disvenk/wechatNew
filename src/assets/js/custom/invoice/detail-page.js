
var detailBaseMix = {
	data : function(){
		return {			
			typeList:[
				{
					name:"单位",
					type:1
				},
				{
					name:"个人",
					type:2
				}
			],
			currentType:{},
			companyName:'',
			taxNum:'',
			address:'',
			telephone:'',
			bankName:'',
			bankNum:'',
			personName:'',
			inVoiceList:[],
			Height:null,
			showAddBtn:true
		}
	},
	methods:{
		changeType:function(f){
			this.currentType = f;
		},
		saveInvoice:function(){
			var that = this;
			if(this.currentType.type == 1){
				if(!that.companyName || !that.taxNum) {
					that.$dispatch("remindMessage", "请填写公司名称和税号", 3000);
					return;
				};
			}else{
				if(!that.personName) {
					that.$dispatch("remindMessage", "请输入姓名", 3000);
					return;
				};
			}			
			var fA = {
				customerId : customerInfo.id,
				type : that.currentType.type,
				name : that.companyName,
				dutyParagraph : that.taxNum,
				companyAddress : that.address,
				mobileNo : that.telephone,
				bankOfDeposit : that.bankName,
				bankNumber : that.bankNum
			};
			var fB = {
				customerId : customerInfo.id,
				type : that.currentType.type,
				name : that.personName
			};
			if(that.currentType.type == 1){									
				addInvoice(0,customerInfo.id,that.currentType.type,that.companyName,that.taxNum,that.address,that.telephone,that.bankName,that.bankNum,function (result) {
					if(result.success){
						that.$dispatch("successMessage", "添加成功", 3000);
            			that.$dispatch("update-state",fA);
            			that.$router.replace({ path: '/head' });
					}										   					  				
	    		})
			}else{
				addInvoicePerson(0,customerInfo.id,that.currentType.type,that.personName,function (result) {
					if(result.success){
						that.$dispatch("successMessage", "添加成功", 3000);
            			that.$dispatch("update-state",fB);
            			that.$router.replace({ path: '/head' });
					}	    			
	    		})
			}			
		}
	},
	created:function(){
		this.currentType = this.typeList[0];
	},
	ready: function () {
    	var that = this;
    	that.Height = $(window).height();
    	
		window.onresize = function () {
			that.showAddBtn = false;
	        if (that.Height > window.innerHeight) {
	            that.showAddBtn = false;
	        }else{
	        	that.showAddBtn = true;
	        }
	    }
    }
}