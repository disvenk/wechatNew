productState[2] = productState[3];
Vue.component("order-mini-detailed",{
	mixins:[orderMiniMax],
	data:function(){
		return {
			//pushOrderBtnName:"我已到店"
			pushOrderBtnName:""
		}
	},
});

Vue.component("auto-print",{
	mixins:[orderMiniMaxByTV]

});

Vue.component("order-detailed-dialog",{
	mixins:[orderdetailMax],
	data:function(){
		return {
			pushOrderBtnName:"我已到店"
		}
	},
	components: {
        'code-components': {
            props: ["order"],
            template:
            '<p  class="ver-code"><span class="c-gray" style="font-size:16px;line-height: 26px;">交易码:</span> <span class="ver-code">{{order.verCode}}</span></p>'           
        }
    },
	methods:{
		pushOrderSuccess:function(order){
			this.$dispatch("loadingMessage","正在下单中");
		},
		orderProductionStatusChange:function(pstate){
			console.log("订单状态改变",pstate);
			if(pstate==2){
				this.show=false;
				this.$dispatch("show-callnumber-dialog",this.order);
			}else if (pstate == 1){
				this.$dispatch("loadingMessage","正在下单中");
			}
		},
		jumpAliPayPage: function(){
			window.location.href = getParam("baseUrl")+"/restowechat/src/openAliPay.html?orderId="+this.order.id;
		}
	},
	created:function(){

//		this.pushOrder();
//		this.$dispatch("show-callnumber-dialog",this.order);
//		this.$watch("show",function(){
//			if(this.show){
//				if(this.order.productionStatus==2){
//					this.show=false;
//					this.$dispatch("show-callnumber-dialog",this.order);
//				}else if(this.order.productionStatus==1){
//					this.$dispatch("message","正在下单中");
//				}
//        
//			}
//		})
		this.$watch("show",function(){
			if(this.show){
				//如果是支付宝支付的话  则跳转到支付宝支付页面
				if(this.order.payMode == 2 && this.order.orderState == 1 && "open" == getParam("openAliPayPage")){
					this.jumpAliPayPage();
				}
			}
		});
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

var MainPage = new Vue({
    mixins: [mainBaseMix],
    components: {
        'home-page': HomePage,
        'tangshi-page': TangshiPage,
        'my-page': MyPage,
    },
    events: {}
});


