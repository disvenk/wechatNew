productState[2]="已消费";

Vue.component("order-mini-detailed",{
	mixins:[orderMiniMax],
	methods:{
		showOrderDetailed:function(){
			var that = this;
			getCustomerNewOrder(that.order.id,function(o){
				that.order = $.extend(that.order,o);
				that.$dispatch("show-custom-neworder",that.order);
			});
		},
		pushOrderClick:function(){
			var o  = this.order;
			if(o.parentOrderId&&o.tableNumber){
				this.pushOrder();
			}else{
				this.helpOrder();
			}
		},
	}
});

Vue.component("order-detailed-dialog",{
	mixins:[orderdetailMax],
	created:function(){
		this.$watch("show",function(){
			if(this.show){
				if(this.order&&this.order.orderState==2&&this.order.productionStatus==0&&!this.option.cancel&&!this.order.parentOrderId){
					this.helpOrder();
				}
				//如果是支付宝支付的话  则跳转到支付宝支付页面
				if(this.order.payMode == 2 && this.order.orderState == 1 && "open" == getParam("openAliPayPage")){
					this.jumpAliPayPage();
				}
			}
		})	
	},
	components: {
        'code-components': {
            props: ["order"],
            template:
            '<p  class="ver-code"><span class="c-gray" style="font-size:16px;line-height: 26px;">交易码:</span> <span class="ver-code">{{order.verCode}}</span></p>'           
        }
    },
	methods:{
		pushOrderClick:function(){
			var o  = this.order;
			if(o.parentOrderId&&o.tableNumber){
				this.pushOrder();
			}else{
				this.helpOrder();
			}
		},
		jumpAliPayPage: function(){
			window.location.href = getParam("baseUrl")+"/restowechat/src/openAliPay.html?orderId="+this.order.id;
		}
	}
});

var HomePage = Vue.extend({
    mixins: [homeBaseMix]
});

var MyPage = Vue.extend({
    mixins: [myBaseMix]
});

var TangshiPage = Vue.extend({
    mixins: [tangshiBaseMix]
});

//var fansPage = Vue.extend({
//  mixins: [fansBaseMix]
//});

var MainPage = new Vue({
    mixins: [mainBaseMix],
    components: {
        'home-page': HomePage,
        'tangshi-page': TangshiPage,
        'my-page': MyPage,
//      'fans-page': fansPage,
    },
    events: {}
});


