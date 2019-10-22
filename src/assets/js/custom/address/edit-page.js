var editMix = {
	data:function(){
		return {
			id:null,
			name:'',
        	sex:'',
        	phone: '',
        	address:null,
        	detailedAddress:'',
        	addressId:null,
        	checkAccount:0,
        	Height:null,
        	customerInfo:customerInfo,
        	longitude:null,
        	latitude:null
		}
	},
	methods:{
		useChecked: function () {
            this.checkAccount = !this.checkAccount;
        },
        showBaiduMap:function(){
	    	this.$router.go("/map");
	    },
        saveAddress:function(){
    		var that = this;
    		if(!that.name || !that.address || !that.detailedAddress) {
				that.$dispatch("remindMessage", "请补充完整信息", 30000);
				return;
			}
    		if(that.id){	      
    			if(that.checkAccount){
    				editCustomerAddress(that.id,that.name,that.sex,that.phone,that.address,that.detailedAddress,1,function (result) {
	        			if(result.success){
	        				that.$router.go("/address");
	        				that.$dispatch("successMessage", "设置默认地址成功", 2000);
	        			}else{
	        				that.$dispatch("remindMessage", "设置默认地址失败", 2000);
	        			}
	        		})
    			}else{
    				editCustomerAddress(that.id,that.name,that.sex,that.phone,that.address,that.detailedAddress,0,function (result) {
	        			if(result.success){
	        				that.$router.go("/address");
	        				that.$dispatch("successMessage", "修改地址成功", 2000);
	        			}else{
	        				that.$dispatch("remindMessage", "修改地址失败", 2000);
	        			}
	        		})
    			}
    		}else{
				addCustomerAddress(that.name,that.sex,that.phone,that.address.replace(/,/g,' '),that.detailedAddress,that.longitude,that.latitude,0,function (result) {
        			if(result.success){
        				that.$router.go("/address");
        				that.$dispatch("successMessage", "添加地址成功", 2000);
        			}else{
        				that.$dispatch("remindMessage", "添加地址失败", 2000);
        			}
        		})	        			
    		}
			that.name = null;
    		that.sex = null;
    		that.phone = null;
    		that.address = null;
    		that.detailedAddress = null;
    	}
	},
	created:function(){
		var that = this;
		alert(window.location.search);
		this.id = getParam("id");
		alert(this.id);
 		choiceCustomerAddress(this.id,function (result) {
        	if(result.success){
        		that.name = result.data.name;
        		that.sex = result.data.sex;
        		that.phone = result.data.mobileNo;
        		that.address = result.data.address;
        		that.detailedAddress = result.data.addressReality;
        	}
    	})
	},
	ready:function(){
		
	}
}