var addressMix = {
	data:function(){
		return {			
			addressListInfo:null,
        	addBtn:true		
		}
	},
	created:function(){
    	var that = this;
		getCustomerAddress(customerInfo.id,function (result) {
        	if(result.success){
        		that.addressListInfo = result.data;	
        		that.resetHeight();	
        	}
    	});    	
		setTimeout(function () {				            
            Vue.nextTick(function () {							
				that.scrollIsc = new IScroll(".order_address_list",{
					click:true
				});
	        })
        }, 1000);
    },
    methods: {
        choiceAddress:function(id){  
    		var that = this;  
    		that.$router.go("/edit&id="+id);
    	},
    	addAddress:function(){
       		this.$router.go("/edit");
        },
    	resetHeight:function() {
		    var main_menu = $("#addAddress");
		    var content = $(".order_address_list");
		    var height = $(window).height();
		    content.height(height - main_menu.height());
		    content.css({
		        overflow: "hidden",
		        position: "relative"
		    });
		}
    },
    ready: function () {
    	var that = this;
    	var Height = $(window).height();
		window.onresize = function () {
			that.addBtn = false;
	        if (Height > window.innerHeight) {
	            that.addBtn = false;
	        }else{
	        	that.addBtn = true;
	        }
	    }
    }
}