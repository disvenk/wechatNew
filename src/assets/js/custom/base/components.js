var mode = {1: "堂食", 2: "外卖", 3: "外带"},
    orderState = {1: "未付款", 2: "已付款", 9: "已取消", 10: "已消费", 11: "已评价"}, /*订单状态码*/
    classState = {1: "gray", 2: "red", 9: "gray", 10: "black", 11: "black"},
    houfuState = {0: "待下单", 1: "下单中", 2: "待支付", 5: "下单失败"},
    productState = {0: "待下单", 1: "待接单", 2: "等待叫号", 3: "已消费", 4: "已消费", 5: "下单失败"};


var subpageMix = {
    props: ["shop", "customer", "otherdata", "noticelist"]
};

var noticeNeedToShow = true;

var noticeMix = {
    props: ["noticelist"],
    data: function () {
        return {
            noticeNeedToShow: true
        }
    },
    computed: {
        hasNotice: function () {
            var noticeArr = [];
            for (var i = 0; i < this.noticelist.length; i++) {
                var n = this.noticelist[i];
                if (n.noticeType == 1 || n.noticeType == 3) {
                    noticeArr.push(n);
                }
            }
            return noticeArr;
        },
        newNotice: function () {
            var nArr = [];
            for (var i = 0; i < this.hasNotice.length; i++) {
                var nt = this.hasNotice[i];
                if (!nt.isRead) {
                    nArr.push(nt);
                }
            }
            return nArr;
        }
    },
    methods: {
        showNotice: function (n) {
            var that = this;
            this.$on("can-show-notice", function () {
                console.log("广告弹出");
                that.$dispatch("show-notice",n);
            });
//          if(noticeNeedToShow){
//              noticeNeedToShow = false;
//              if(getParam("subpage") == "my" || getUrlJingHao(window.location.href) == "my"){
//                  noticeNeedToShow = true;
//              }else if(customerInfo.isBindPhone == false){
//                  noticeNeedToShow = true;
//              }else if(getParam("dialog") != null){
//                  noticeNeedToShow = true;
//              }else{
//                  that.$dispatch("show-notice",n);
//              }
//          }

        },
    },
    created: function () {
        var that = this;

        getNoticeList(null, function (noticelist) {
            that.noticelist = noticelist;
            var temp = [];
            for(var i = 0;i < noticelist.length;i++){
                if(!noticelist[i].isRead){
                    temp.push(noticelist[i]);
                }
            }
            if(temp.length > 0){
                that.showNotice(temp);
            }

        });

    }
}
//订单混合对象
var orderDetailed = {
    props: ["order"],
    computed: {
        modeName: function () {
            return mode[this.order.distributionModeId];
        },
        statusText: function () {
            var state = this.order.orderState;
            var proState = this.order.productionStatus;
            var st = "";
            switch (state) {
                case 1:
                    if(this.order.payMode == 3 || this.order.payMode == 4 || this.order.payMode == 5 || this.order.payMode == 6){
                        st = "付款中";
                    }else{
                        st = orderState[state];
                    }

                    break;
                case 2:
                    st = productState[proState];
                    break;
                case 9:
                    st = orderState[state];
                    break;
                case 10:
                    if (this.order.isPosPay == 1){
                        st = orderState[state];
                    }else{
                        st = productState[proState];
                    }
                    break;
                case 11:
                    st = orderState[state];
                    break;
            }
            return st;
        },
        pStatusText: function () {
            var state = this.order.orderState;
            var proState = this.order.productionStatus;
            var st = "";
            if (state == 1) {
                switch (proState) {
                    case 0:
                        st = houfuState[proState];
                        break;
                    case 1:
                        st = houfuState[proState];
                        break;
                    case 2:
                        st = houfuState[proState];
                        break;
                    case 5:
                        st = houfuState[proState];
                        break;
                }
            } else if (state == 2 || state == 10) {
                st = orderState[state];
            } else if (state == 11){
                st = orderState[state];
            }
            return st;
        }
    },
    data: function () {
        return {
            wxPayBtn: true,
        };
    },
    methods: {
        cancelOrder: function () {
            this.$dispatch("cancel-order", this.order);
        },
        pushOrderClick: function () {
            this.pushOrder();
        },
        pushOrderHouFuClick: function () {
            this.pushOrderHouFu();
        },
        pushOrder: function () {
            var order = this.order;
            var that = this;
            if(order.orderMode != 2 ){
                this.vailedPushOrder && this.vailedPushOrder();
            }
            pushOrderRequest(order.id, function () {
                that.$dispatch("successMessage", "下单成功");
                order.productionStatus = 1;
                that.order = $.extend(that.order, order);
                that.pushOrderSuccess && that.pushOrderSuccess(order);
                if(order.orderMode == 2 || order.orderMode == 7){
                    window.location.reload();
                }
            });
        },
        pushOrderHouFu: function () {
            this.vailedPushOrder && this.vailedPushOrder();
            var order = this.order;
            var that = this;
            pushOrderRequest(order.id, function () {
                that.$dispatch("successMessage", "下单成功");
                order.productionStatus = 1;
                that.pushOrderSuccess && that.pushOrderSuccess(order);
            });
        },
        payOrder: function () {
            var that = this;
            if(that.wxPayBtn){
                that.wxPayBtn = false;
                setTimeout(function(){
                    that.wxPayBtn = true;
                }, 3000);
                updateIsPay(that.order.id, function(){
                    that.$dispatch("pay-order", 'wechat', that.order);
                });
            }
        },
        helpOrder: function () {
            var msg = "支付成功，请到吧台出示交易码";
            this.$dispatch("successMessage", msg, 300000);
        },
        receiveRedPapper: function () {
            var that = this;
            getCustomerNewOrder(this.order.id, function (o) {
                that.order = $.extend(that.order, o);
                that.$dispatch("receive-red-papper", that.order);
            })
        },
        jumpShare: function () {
            var that = this;
            getCustomerNewOrder(that.order.id, function (o) {
                that.order = $.extend(that.order, o);
            })
            getAppraiseByOrderId(that.order.id, function (a) {
                window.location.href=allSetting.wechatWelcomeUrl+"?shopId="+that.order.shopDetailId+"&subpage=home&dialog=share&appraiseId="+ a.id;
            })
        },
        continueOrder: function () {
            var that = this;
            getOrderStates(this.order.id, function (o) {
                if(o.allowContinueOrder && o.orderBefore == null){
                    that.$dispatch("show-custom-neworder-houfu-false");
                    that.$dispatch("continue-order", that.order);
                }else{
                    var search = window.location.search;
                    if(search.indexOf("qiehuan") == -1){
                        search = search + "&qiehuan=qiehuan";
                    }
                    window.location.href = getParam("baseUrl")+"/wechat/index"+search;
                }
            });

        },
    },
};
//弹窗混合对象
var dialogMix = {
    props: ["show"],
    methods: {
        close: function () {
            this.show = false;
        },
        jumpShare: function () {
            var that = this;
            getCustomerNewOrder(that.order.id, function (o) {
                that.order = $.extend(that.order, o);
            })
            getAppraiseByOrderId(that.order.id, function (a) {
                window.location.href=allSetting.wechatWelcomeUrl+"?shopId="+that.order.shopDetailId+"&subpage=home&dialog=share&appraiseId="+ a.id;
            })
        }
    },
    created: function () {
        this.$watch("show", function () {
            if (this.show) {
                this.onShow && this.onShow();
            }
        });
    }
};

//店铺打烊提示
Vue.component("shop-closed",{
    props: ["show","shop"],
    template: '<div class="weui_dialog_confirm" v-if="show">' +
    '	<div class="weui_mask" style="top:-76px;"></div>' +
    '	<div class="weui_dialog" style="top:15%;">' +
    '		<div class="full-height">'+
    '			<img class="scanImg" src="assets/img/dayang.png" style="height:28vh;"/>'+
    '			<div style="color:#b4b4b4;padding:20px 0px;">'+
    '			<p style="font-size:1.2rem;">店铺打烊啦</p>' +
    '			<p style="font-size:1rem;">营业时间 : {{new Date(shop.openTime.time).format("hh:mm")}} - {{new Date(shop.closeTime.time).format("hh:mm")}}</p>' +
    '			</div>'+
    '		</div>' +
    '	</div>' +
    '</div>',
})

//该段代码需要优化，因为此代码只为大boss模式先弹出扫码界面
Vue.component("iframe-dialog-code",{
    props:["show","customer","setting","money"],
    template: '<div class="weui_dialog_confirm sencond_mask red_papper" v-if="show">' +
    '	<div class="weui_mask" @click="close"></div>' +
    '	<div class="weui_dialog red_bg" style="font-family:微软雅黑;z-index:17;" >' +
    '		<div class="topcontent">' +
    '			<div class="red_avatar">' +
    '				<img :src="customer.headPhoto">' +
    '				<span class="close" @click="close">+</span>' +
    '			</div>' +
    '			<div>' +
    '				<span class="text">{{customer.nickname}}</span>' +
    '				<img class="customerSexSmallCode" src="assets/img/oldMan.png" v-if="customer.sex == 1" />'+
    '				<img class="customerSexSmallCode" src="assets/img/oldWoman.png" v-if="customer.sex == 2" />'+
    '			</div>' +
    '			<span class="scanCode" style="margin-top:5px;">邀请朋友扫一扫,送他/她<i v-if="money>0">{{money}}元红包</i><i v-if="money==0">红包</i></span>' +
    '			<span class="scanCode">朋友到店消费后,您将获得<i v-if="setting.minMoney>=0&&setting.maxMoney>0">{{setting.minMoney}}-{{setting.maxMoney}}元</i>返利</span>' +
    '		</div>' +
    '		<div class="posCode">' +
    '       	<img src="{{codeSrc}}" class="myCodeSrc" alt="二维码" />' +
    '			<span class="scanCodeMar" style="display:block;color:#fff;">已成功邀请<i>{{count}}</i>名好友到店消费</span>' +
    '			<span style="display:block;color:#fff;">总计获得<i>{{sumMoney}}</i>元奖励</span>' +
    '		</div>' +
    '   </div>' +
    '</div>',
    data: function () {
        return {
            codeSrc:null,
            count:0,
            sumMoney:0,
            brand:{},
        }
    },
    methods: {
        close: function () {
            this.show = false;
        }
    },
    created:function(){
        var that = this;
        this.$watch("show",function(){
            if(that.show){
                getCustomer(function (customer) {
                    that.customer = customer;
                    shareCustomerCount(customer.id,function(result){
                        that.count = result.count;
                        if(result.sumMoney != null){
                            that.sumMoney = result.sumMoney;
                        }
                    });
                });
                getModuleSetting(function (res) {
                    var arr = res.toString().split(",");
                    var flag = false;
                    for(var i in arr){
                        if(arr[i] == 1){
                            flag = true;
                        }
                    }
                    if(flag){
                        getShareDetailed(null, function (result) {
                            if(result.setting.isActivity == 1){
                                that.setting = result.setting;
                            }
                        });
                    }
                });
                showCouponList({"couponType": "1"}, function(result){
                    that.money = 0;
                    if (result.success && result.data.length > 0) {
                        for(var i=0; i<result.data.length; i++){
                            that.money += result.data[i].couponValue * result.data[i].couponNumber;
                        }
                    }
                });
            }
        });

        this.codeSrc = baseUrl + "/wechat/customer/new/vCode?baseUrl=" + baseUrl;
    },
});

/*店铺通知*/
Vue.component("notice-dialog", {
    mixins: [dialogMix],
    props: ["noticelist"],
    template:
    '<div class="weui_dialog_alert notice_mask" @touchstart="start" @touchend="end" v-if="show">'+
    '	<div class="weui_mask pop_up" @click="close"></div>'+
    '		<div class="weui_dialog notice-dialog big-dialog">'+
    '		<div class="full-height" v-if="notice.noticeType==1||notice.noticeType==2">'+
    '			<div class="weui_dialog_bd ">'+
    '				<img class="art-image" :src="notice.noticeImage"/>'+
    '			</div>'+
    '    		<div class="weui_article article-desc">'+
    '    			<div>'+
    '	    			<h3 class="article-name">{{notice.title}}</h3>'+
    '	    			<p class="article-desc">{{{notice.content}}}</p>'+
    '    			</div>'+
    '    		</div>' +
    '    	</div>' +
    '    	<div class="full-height" v-if="notice.noticeType==3">'+
    '	    	<div class="weui_dialog_bd big-image">'+
    '	    		<img class="art-image" :src="notice.noticeImage"/>' +
    '	    	</div>'+
    '    	</div>'+
    '    <div class="dialog-close" @click="close"><i class="icon-remove-sign"></i></div>' +
    '    </div>' +
    '</div>',
    computed: {
        notice: function () {
            var notice = this.noticelist[this.current];
            notice.content = notice.content.replace(/\n/g, "<br/>");
            //addNoticeHistory(notice.id);
            return notice;
        }
    },
    data: function () {
        return {
            current: 0,
            startPoint: 0,
        }
    },
    methods: {
        start: function (e) {
            var touch = e.targetTouches[0];
            this.startPoint = touch.pageX;
        },
        end: function (e) {
            var touch = e.changedTouches[0];
            var offset = this.startPoint - touch.pageX;
            if (offset > 30) {
                if (this.current < this.noticelist.length - 1) {
                    this.current += 1;
                }
            } else if (offset < -30) {
                if (this.current > 0) {
                    this.current -= 1;
                }
            }
        },

    },
    created:function(){
        var that = this;

        this.$watch("show", function () {
            if(this.show){
                getNoticeList(null, function (noticelist) {
                    var temp = [];
                    for(var i = 0;i < noticelist.length;i++){
                        if(!noticelist[i].isRead){
                            temp.push(noticelist[i]);
                        }
                    }
                    if(temp.length > 0){
                        that.noticelist = [];
                        that.noticelist = temp;
                        addNoticeHistory(temp[0].id);
                    }

                });
            }

        });
    }

});

/*店铺最新公告弹窗*/
Vue.component("noticelist-dialog", {
    mixins: [dialogMix],
    props: ["noticelist"],
    template:
    '<div class="weui_dialog_alert third_mask" @touchstart="start" @touchend="end" v-if="show">'+
    '	<div class="weui_mask pop_up" @click="close"></div>'+
    '		<div class="weui_dialog notice-dialog big-dialog">'+
    '		<div class="full-height" v-if="notice.noticeType==1||notice.noticeType==2">'+
    '			<div class="weui_dialog_bd ">'+
    '				<img class="art-image" :src="notice.noticeImage"/>'+
    '			</div>'+
    '    		<div class="weui_article article-desc">'+
    '    			<div>'+
    '	    			<h3 class="article-name">{{notice.title}}</h3>'+
    '	    			<p class="article-desc">{{{notice.content}}}</p>'+
    '    			</div>'+
    '    		</div>' +
    '    	</div>' +
    '    	<div class="full-height" v-if="notice.noticeType==3">'+
    '	    	<div class="weui_dialog_bd big-image">'+
    '	    		<img class="art-image" :src="notice.noticeImage"/>' +
    '	    	</div>'+
    '    	</div>'+
    '    <div class="dialog-close" @click="close"><i class="icon-remove-sign"></i></div>' +
    '    </div>' +
    '</div>',
    computed: {
        notice: function () {
            var notice = this.noticelist[this.current];
            notice.content = notice.content.replace(/\n/g, "<br/>");
            addNoticeHistory(notice.id);
            return notice;
        }
    },
    data: function () {
        return {
            current: 0,
            startPoint: 0,
        }
    },
    methods: {
        start: function (e) {
            var touch = e.targetTouches[0];
            this.startPoint = touch.pageX;
        },
        end: function (e) {
            var touch = e.changedTouches[0];
            var offset = this.startPoint - touch.pageX;
            if (offset > 30) {
                if (this.current < this.noticelist.length - 1) {
                    this.current += 1;
                }
            } else if (offset < -30) {
                if (this.current > 0) {
                    this.current -= 1;
                }
            }

        }
    },
});

var orderMiniMaxByTV = {
    mixins: [orderDetailed],

    methods: {
        showOrderDetailed: function () {
            var that = this;
            getCustomerNewOrder(that.order.id, function (o) {
                that.order = $.extend(that.order, o);
                //that.$dispatch("show-custom-neworder",that.order);
                that.pushOrder();
            });
        }
    }
};

/*实时优惠券*/
Vue.component("current-time-coupon", {
    props: ['show','coupons'],
    mixins: [dialogMix],
    template:
    '<div class="weui_dialog_alert sencond_mask" v-if="show">' +
    '<div class="weui_mask pop_up"></div>' +
    '<div class="weui_dialog" style="max-height: 120vw;">' +
    '<div class="full-height" style="font-family: 微软雅黑;background: #DF5548;border-radius: 10px;">' +
    '<div class="coupon-title">恭喜您获得幸运礼券</div>' +
    '<div class="form-group-coupon">' +
    '<span class="comments">获得奖励</span>' +
    '</div>' +
    '<div id="scroll-coupon">' +
    '<div>'+
    '<div class="coupon-card" v-for="f in coupons">'+
    '<span class="coupon-type" style="font-size:20px;color:#DF5548;width:72%;">{{f.name}}</span>'+
    '<span class="coupon-type">有效期至{{new Date(f.endDate.time).format("yyyy-MM-dd")}} {{new Date(f.endTime.time).format("hh:mm")}}</span>'+
    '<span class="coupon-type">堂吃满{{f.minAmount}}元可使用</span>'+
    '<span class="coupon-type">使用时间:{{new Date(f.beginTime.time).format("hh:mm")}}-{{new Date(f.endTime.time).format("hh:mm")}}</span>'+
    '<span class="coupon-money"><i style="font-size:initial;">￥</i>{{f.value}}</span>'+
    '</div>'+
    '</div>'+
    '</div>' +
    '<div class="coupon-cash">支付时自动抵扣现金</div>' +
    '<a class="weui_btn_coupon" @click="useCouponNow">立即使用</a>' +
    '</div>' +
    '<div class="dialog-close" @click="close"><i class="icon-remove-sign"></i></div>' +
    '</div>' +
    '</div>',
    data: function () {
        return {
            scrollCoupon:null,
        }
    },
    methods: {
        useCouponNow:function(){
            var that = this;
            that.$dispatch("use-my-coupon");
        }
    },
    created:function(){
        var that = this;
        this.$watch("show", function () {
            if (this.show) {
                Vue.nextTick(function () {
                    that.scrollCoupon = new IScroll("#scroll-coupon", {
                        click: iScrollClick()
                    });
                });
            }
        })
        this.$on("close-coupon-dialog",function () {
            this.show = false;
        });
    }
})

/*分享优惠券*/
Vue.component("share-coupon", {
    props: ['show','sharecoupons'],
    mixins: [dialogMix],
    template:
    '<div class="weui_dialog_alert sencond_mask" v-if="show">' +
    '<div class="weui_mask pop_up"></div>' +
    '<div class="weui_dialog" style="max-height: 120vw;">' +
    '<div class="full-height" style="font-family: 微软雅黑;background: #DF5548;border-radius: 10px;">' +
    '<div class="coupon-title">感谢分享</div>' +
    '<div class="form-group-coupon">' +
    '<span class="comments">获得奖励</span>' +
    '</div>' +
    '<div id="scroll-coupon">' +
    '<div>'+
    '<div class="coupon-card" v-for="f in sharecoupons">'+
    '<span class="coupon-type" style="font-size:20px;color:#DF5548;">{{f.name}}</span>'+
    '<span class="coupon-type">有效期至{{new Date(f.endDate.time).format("yyyy-MM-dd hh:mm")}}</span>'+
    '<span class="coupon-type">堂吃满{{f.minAmount}}元可使用</span>'+
    '<span class="coupon-type">使用时间:{{new Date(f.beginTime.time).format("hh:mm")}}-{{new Date(f.endTime.time).format("hh:mm")}}</span>'+
    '<span class="coupon-money"><i style="font-size:initial;">￥</i>{{f.value}}</span>'+
    '</div>'+
    '</div>'+
    '</div>' +
    '<div class="coupon-cash">支付时自动抵扣现金</div>' +
    '<a class="weui_btn_coupon" @click="useCouponNow">立即使用</a>' +
    '</div>' +
    '<div class="dialog-close" @click="close"><i class="icon-remove-sign"></i></div>' +
    '</div>' +
    '</div>',
    data: function () {
        return {
            scrollCoupon:null,
        }
    },
    methods: {
        useCouponNow:function(){
            var that = this;
            that.$dispatch("use-my-coupon");
        }
    },
    created:function(){
        var that = this;
        this.$watch("show", function () {
            if (this.show) {
                Vue.nextTick(function () {
                    that.scrollCoupon = new IScroll("#scroll-coupon", {
                        click: iScrollClick()
                    });
                });
            }
        })
        this.$on("close-coupon-dialog",function () {
            this.show = false;
        });
    }
})

/*我的订单列表明细*/
var orderMiniMax = {
    mixins: [orderDetailed],
    template: '<div class="weui_cell item" v-if="order.orderState!=9">' +
    '<div class="weui_cell_bd weui_cell_primary order-mini-detailed" @click="showOrderDetailed">' +
    '<p>{{order.shopName}}</p>' +
    '<p><ver-code :order="order"></ver-code> <span class="font-mini">共计{{order.countWithChild||order.articleCount}}个餐品</span></p>' +
    '<p>' + '<span class="font-mini">下单时间:<span v-if="!order.lastOrderTime">{{new Date(order.createTime.time).format("yyyy-MM-dd hh:mm")}}</span><span>{{new Date(order.lastOrderTime.time).format("yyyy-MM-dd hh:mm")}}</span></span>' + '</p>' +
    '</div>' +
    '<div class="weui_cell_ft">' +
    '<span class="order-state">{{statusText}}</span>' +
    '<a class="weui_btn weui_btn_mini weui_btn_main order-operator" @click="continueOrder" v-if="order.distributionModeId==1&&order.allowContinueOrder&&order.orderMode!=6">继续选购</a>' +
    '<a class="weui_btn weui_btn_mini weui_btn_main order-operator" @click="continueOrder" v-if="order.distributionModeId==1&&order.orderMode==6&&order.allowContinueOrder&&order.productionStatus>=2&&(order.orderState>9||order.orderState==2||(order.orderState==1&&order.payMode!=3&&order.payMode!=4&&order.payMode!=5&&order.payMode!=6&&order.isPay!=11))">继续选购</a>' +
    '<a class="weui_btn weui_btn_mini weui_btn_main order-operator cancel-order-btn" @click="cancelOrder" v-if="order.orderMode != 6  && order.orderMode != 2 && order.orderMode != 7 && (((order.orderState==1||order.orderState==2)&&order.productionStatus==0) || (order.payMode == 2 && order.productionStatus == 1 &&( order.orderState == 1 || order.orderState == 2 )))">取消订单</a>' +
    '<a class="weui_btn weui_btn_mini weui_btn_main order-operator cancel-order-btn" @click="cancelOrder" v-if="order.orderMode == 6 && (order.payMode == 1 || order.payMode == 2) && order.orderState == 1 && order.payType == 0">取消订单</a>' +
    //'<a class="weui_btn weui_btn_mini weui_btn_main order-operator" @click="pushOrderClick" v-if="order.productionStatus==0&&order.orderState==2">{{pushOrderBtnName}}</a>' +
    '<a class="weui_btn weui_btn_mini weui_btn_main order-operator" @click="showOrderDetailed" v-if="(order.distributionModeId==1&&order.productionStatus==0&&order.orderState==2&&order.orderMode!=6) || (order.distributionModeId==1&&order.productionStatus==0&&order.orderState==1&&order.payMode== 2&&order.orderMode!=6&&order.orderMode!=3)">{{pushOrderBtnName}}</a>' +
    '<a class="weui_btn weui_btn_mini weui_btn_main order-operator" @click="payOrder" v-if="order.orderState==1 && order.payMode == 1 && order.orderMode != 6 && order.isPay != 1">微信支付</a>' +
    '<a class="weui_btn weui_btn_mini weui_btn_main order-operator" @click="payOrderBoss" v-if="order.orderState==1 && order.orderMode==6 && order.productionStatus==2 &&( order.payMode == 1 || order.payMode == 0)">立即支付</a>' +
    '<a class="weui_btn weui_btn_mini weui_btn_main order-operator" @click="payOrderBoss" v-if="order.orderState==1 && order.orderMode==6 && order.productionStatus==0 && order.payMode == 1)">立即支付</a>' +
    //'<a class="weui_btn weui_btn_mini weui_btn_main order-operator" @click="showOrderDetailed"  v-if="order.orderState==1 && order.payMode == 2 && order.productionStatus >= 1">支付宝支付</a>' +
    '<a class="weui_btn weui_btn_mini weui_btn_main order-operator" @click="showPayDaiLog"  v-if="order.orderState==1 && order.payMode == 2 && ((order.productionStatus >= 1 && order.orderMode ==6) || (order.productionStatus >= 0 && (order.orderMode == 2 || order.orderMode == 3 || order.orderMode == 7)))">更换方式</a>' +
    '<a class="weui_btn weui_btn_mini weui_btn_main order-operator" @click="shanhuiPayDaiLog"  v-if="order.orderState==1 && order.payMode == 5">闪惠支付</a>' +
    '<a class="weui_btn weui_btn_mini weui_btn_main order-operator" @click="receiveRedPapper" v-if="(order.orderMode==2||order.orderMode==7)&&order.productionStatus>=2&&order.allowAppraise">领取红包</a>' +
    '<a class="weui_btn weui_btn_mini weui_btn_main order-operator" @click="receiveRedPapper" v-if="order.orderMode!=2&&order.orderMode!=7&&order.orderMode!=6&&order.allowAppraise">领取红包</a>' +
    '<a class="weui_btn weui_btn_mini weui_btn_main order-operator" @click="receiveRedPapper" v-if="order.payType==0&&order.orderMode==6&&order.allowAppraise">领取红包</a>' +
    '<a class="weui_btn weui_btn_mini weui_btn_main order-operator" @click="receiveRedPapper" v-if="order.orderState==10&&order.payType==1&&order.orderMode==6&&order.allowAppraise">领取红包</a>' +
    '<a class="weui_btn weui_btn_mini weui_btn_main order-operator" @click="jumpShare" v-if="order.isShare==1">分享返利</a>' +
    '</div>' +
    '</div>',
    data: function () {
        return {
            pushOrderBtnName: "立即下单"
        }
    },
    methods: {
        payOrderBoss: function(){
            location.href = getParam("baseUrl") + "/wechat/index?orderBossId=" + this.order.id + "&dialog=closeRedPacket&articleBefore=1";
            //window.location.href = "/wechatNew/src/index.html?orderBossId=" + this.order.id + "&dialog=closeRedPacket";
        },
        shanhuiPayDaiLog: function(){
            window.location.href = "//m.dianping.com/shop/"+shopInfo.dazhongShopId;
        },
        showPayDaiLog: function(){
            var that = this;
            updateIsPay(this.order.id, function(result){
                if(result.success){
                    if(that.order.payType == 0){
                        that.$dispatch("show-wechat-pay", that.order);
                    }else{
                        location.href = baseUrl + "/wechat/index?orderBossId=" + that.order.id + "&dialog=closeRedPacket";
                    }
                }
            });
        },
        showOrderDetailed: function () {
            var that = this;
            if (that.order.orderMode == 2 || that.order.orderMode == 7) {
                getCustomerNewOrder(that.order.id, function (o) {
                    that.order = $.extend(that.order, o);
                    if (o.productionStatus == 0 && o.orderState != 1) {
                        that.pushOrder();
                    } else {
                        that.$dispatch("show-custom-neworder", that.order);
                    }
                });
            } else {
                getCustomerNewOrder(that.order.id, function (o) {
                    that.order = $.extend(that.order, o);
                    that.$dispatch("show-custom-neworder", that.order);
                });
            }
        },
        autoPrint: function (o) {
            var that = this;
            getCustomerNewOrder(o.id, function (order) {
                that.order = $.extend(that.order, order);
                if (order.productionStatus == 0 && o.orderState != 1) {
                    that.pushOrder();
                    //window.location.reload();
//					$(".order-state").html("待接单");
//					$(".cancel-order-btn").attr("style","display:none");
                } else {
                    that.$dispatch("show-custom-neworder", that.order);
                }
            });
        },

        cancelOrder: function () {
            var that = this;
            getCustomerNewOrder(that.order.id, function (o) {
                that.order = $.extend(that.order, o);
                that.$dispatch("show-custom-neworder", that.order, {
                    cancel: true
                });
            });
        }
    },
    components: {
        'ver-code': {
            props: ["order"],
            template: '<span>消费码:{{order.verCode}} </span>'
        }
    },
};

/*顾客订单状态弹窗*/
var orderdetailMax = {
    mixins: [orderDetailed],
    props: ["order", "show", "option","shop"],
    template: '<div class="weui_dialog_alert" v-if="show">' +
    '<div class="weui_mask pop_up" @click="close"></div>' +
    '<div class="weui_dialog order-desc">' +

    '<div class="text-left padding-10">' +
    '<div>'+
    '<div><h4 class="pull-left mode-shop-name">{{order.shopName}}</h4><div class="pull-right"><span class="order-state-span">{{statusText}}</span></div></div>' +
    '<div class="clearfix"></div>' +
    '<p><span class="c-gray">下单时间: </span><span v-if="!order.lastOrderTime">{{new Date(order.createTime.time).format("yyyy-MM-dd hh:mm")}}</span><span>{{new Date(order.lastOrderTime.time).format("yyyy-MM-dd hh:mm")}}</span></p>' +
    '<div class="order-items">' +
    '<span class="item-name" v-if="item.type!=4 && item.count != 0" v-for="item in order.orderItems | orderBy \'createTime\'">{{item.articleName}} <span v-if="item.count>1">x{{item.count}}</span></span>' +
    '<div>' +
    '<span class="price sale font-bold font-em4">{{order.amountWithChildren||order.orderMoney}}</span>' +
    '<span class="font-mini">共计{{order.countWithChild||order.articleCount}}个餐品</span>' +
    '</div>' +
    '</div>' +
    '<div class="address-items weui_cells no-border-bottom margin-top-0">' +
    '<code-components :order.sync="order"></code-components>' +
    //	'<p class="ver-code" ><span class="c-gray" style="font-size:16px;line-height: 26px;">交易码:</span><span class="ver-code">{{order.verCode}}</span></p>'+
    '<p v-if="order.customerAddressId"><span class="c-gray" style="font-size:16px;">收货人:</span><span>{{customerAddress.name}}</span></p>'+
    '<p v-if="order.customerAddressId"><span class="c-gray" style="font-size:16px;">手机号:</span><span>{{customerAddress.mobileNo}}</span></p>'+
    '<p v-if="order.customerAddressId"><span class="c-gray" style="font-size:16px;">配送地址:</span><span>{{customerAddress.address}} {{customerAddress.addressReality}}</span></p>' +
    '</div>' +
    '</div>' +
    '</div>' +

    '<div class="bottom-button">' +
    '<div class="order-remind" v-if="order.allowContinueOrder">继续选购，红包金额会增加哦</div>' +
    '<div class="weui_dialog_ft margin-top-0 no-border-top" v-if="option.cancel">' +
    '<a class="weui_btn_dialog primary cancel-order-btn" @click="cancelOrder">取消订单</a>' +
    '</div>' +
    '<div class="weui_dialog_ft margin-top-0 no-border-top" v-else>' +
    '<a class="weui_btn_dialog primary" @click="continueOrder" v-if="order.distributionModeId==1&&order.allowContinueOrder&&order.orderMode!=6">继续选购</a>' +
    '<a class="weui_btn_dialog primary" @click="continueOrder" v-if="order.distributionModeId==1&&order.orderMode==6&&order.allowContinueOrder&&order.productionStatus>=2&&(order.orderState>9||order.orderState==2||(order.orderState==1&&order.payMode!=2&&order.payMode!=3&&order.payMode!=4&&order.payMode!=5&&order.payMode!=6))">继续选购</a>' +
    '<a class="weui_btn_dialog primary" @click="pushOrderClick" v-if=" (order.orderMode==3&&order.orderState==2&&tableNumber!=null) || (order.needScan == 1 && order.productionStatus==0&&order.orderState==2&&order.orderMode!=6 && order.orderMode!=2 && order.orderMode!=7 &&order.distributionModeId!=2) || (order.distributionModeId==1&&order.productionStatus == 0 && order.orderState == 1 && order.payMode == 2&&order.orderMode!=6&&order.orderMode!=2&&order.orderMode!=3&&order.distributionModeId!=2)">{{pushOrderBtnName}}</a>' +
    '<a class="weui_btn_dialog primary disabled" v-if="order.isPay==1&&order.orderState==1 && order.payMode==1 && order.orderMode != 6&&wechatPayTime.show">正在微信支付({{wechatPayTime.time}})</a>' +
    '<a class="weui_btn_dialog primary" @click="payOrder" v-if="order.isPay==0&&order.orderState==1&&order.payMode==1&&order.orderMode!=6">微信支付</a>' +
    '<a class="weui_btn_dialog primary" @click="payOrderBoss" v-if="order.orderMode==6 && order.orderState==1 && order.productionStatus==2 && order.payMode != 2 && order.payMode != 3 && order.payMode != 4 && order.payMode != 6  && order.payMode != 5">立即支付</a>' +
    '<a class="weui_btn_dialog primary" @click="payOrderBoss" v-if="order.orderMode==6 && order.orderState==1 && order.productionStatus==0 && order.payMode == 1">立即支付</a>' +
    //'<a class="weui_btn_dialog primary" @click="autoPushOrder" v-if="order.orderState==1 && order.payMode==2 && order.productionStatus>=1">支付宝支付</a>' +
    '<a class="weui_btn_dialog primary" @click="showPayDaiLog" v-if="order.orderState==1 && order.payMode==2 && ((order.productionStatus >= 1 && order.orderMode ==6) || (order.productionStatus >= 0 && (order.orderMode == 2 || order.orderMode == 3 || order.orderMode == 7)))">更换方式</a>' +
    '<a class="weui_btn_dialog primary" @click="shanhuiPayDaiLog" v-if="order.orderState==1 && order.payMode==5">闪惠支付</a>' +
    '<a class="weui_btn_dialog primary disabled" v-if="order.orderMode!=2&&order.orderMode!=6&&remainPackageTime.show&&!order.allowAppraise">领取红包({{remainPackageTime.time}})</a>' +
    '<a class="weui_btn_dialog primary disabled" v-if="order.orderMode==2&&order.productionStatus>=2&&order.orderState!=1&&remainPackageTime.show&&!order.allowAppraise">领取红包({{remainPackageTime.time}})</a>' +
    '<a class="weui_btn_dialog primary disabled" v-if="order.orderMode==6&&order.orderState==2&&remainPackageTime.show&&!order.allowAppraise">领取红包({{remainPackageTime.time}})</a>' +
    '<a class="weui_btn_dialog primary" @click="showReceiveRed" v-if="order.orderMode==2&&order.productionStatus>=2&&order.allowAppraise">领取红包</a>' +
    '<a class="weui_btn_dialog primary" @click="showReceiveRed" v-if="order.orderMode!=2&&order.orderMode!=6&&order.allowAppraise">领取红包</a>' +
    '<a class="weui_btn_dialog primary" @click="showReceiveRed" v-if="order.payType==0&&order.orderMode==6&&order.allowAppraise">领取红包</a>' +
    '<a class="weui_btn_dialog primary" @click="showReceiveRed" v-if="order.orderState==10&&order.payType==1&&order.orderMode==6&&order.allowAppraise">领取红包</a>' +
    '<a class="weui_btn_dialog primary" @click="jumpAliPay" v-if="order.orderState==1&&order.payMode==2">支付宝支付</a>' +
    '<a class="weui_btn_dialog primary" @click="jumpShare" v-if="order.isShare==1">分享返利</a>' +
    '<a href="tel:{{shop.phone}}" class="weui_btn_dialog primary" v-if="order.customerAddressId && order.orderState==2">联系商家</a>' +
    '</div>' +
    '<div class="dialog-close" @click="close"><i class="icon-remove-sign"></i></div>' +
    '</div>' +
    '</div>' +
    '</div>',
    data: function () {
        return {
            remainPackageTime: {show: false, time: 0},
            wechatPayTime: {show: false, time: 60},
            shareMoneyTime: {show: false},
            pushOrderBtnName: "立即下单",
            customerAddress:null,
            orderScroll:null
        }
    },
    methods: {
        jumpAliPay: function(){
            //直接跳转到 提示使用浏览器 打开的页面
            window.location.href = getParam("baseUrl")+"/restowechat/src/openAliPay.html?orderId=" +this.order.id;
            //window.location.href = "/wechatNew/src/openAliPay.html?loginpage="+pageType+"&orderId=" +this.order.id;
        },
        payOrderBoss: function(){
            location.href = getParam("baseUrl") + "/wechat/index?orderBossId=" + this.order.id + "&dialog=closeRedPacket&baseUrl="+getParam("baseUrl");
            //window.location.href = "/wechatNew/src/index.html?orderBossId=" + this.order.id + "&dialog=closeRedPacket";
        },
        shanhuiPayDaiLog: function(){
            window.location.href = "//m.dianping.com/shop/"+shopInfo.dazhongShopId;
        },
        showPayDaiLog: function(){
            var that = this;
            updateIsPay(this.order.id, function(result){
                if(result.success){
                    if(that.order.payType == 0){
                        that.$dispatch("show-wechat-pay", that.order);
                    }else{
                        location.href = baseUrl + "/wechat/index?orderBossId=" + that.order.id + "&dialog=closeRedPacket";
                    }
                }
            });
        },
        close: function () {
            this.show = false;
        },
        showReceiveRed: function () {
            this.receiveRedPapper();
            this.close();
        },
        reflushOrderState: function () {
            var that = this;
            getOrderStates(that.order.id, function (o) {
                if (that.order.orderState != o.orderState) {
                    that.orderStateChange && that.orderStateChange(o.orderState);
                }
                if (o.orderState == 11 && o.isShare == 1) {
                    that.shareMoneyTimeBegin(o);
                }
                if (that.order.productionStatus != o.productionStatus) {
                    console.log("订单状态改变:", o.productionStatus);
                    if (o.productionStatus == 2) {
                        getOrderById(that.order.id, function (od) {
                            that.order = $.extend(that.order, od);
                            that.reflushRemainTime();
                        });
                    }
                    that.orderProductionStatusChange && that.orderProductionStatusChange(o.productionStatus);
                } else if (o.isPay == 0 && o.orderMode == 2 && o.orderState == 1 && o.payMode == 1){
                    getOrderById(that.order.id, function (od) {
                        Vue.nextTick(function () {
                            that.order = $.extend(that.order, od);
                        })
                    });
                } else if (o.isPay == 1 && o.orderMode == 2 && o.orderState == 1 && o.payMode == 1){
                    getOrderById(that.order.id, function (od) {
                        Vue.nextTick(function () {
                            that.order = $.extend(that.order, od);
                        })
                    });
                }
                that.order = $.extend(that.order, o);
            })
        },
        shareMoneyTimeBegin: function(o){
            var time = o.time;
            var appraiseTime = o.appraiseTime.time;
            var now = new Date().getTime();
            var remindTime = (now - appraiseTime) / 1000;
            if(remindTime >= time && this.show){
                this.shareMoneyTime.show = true;
                setTimeout(this.shareMoneyTimeBegin, 1000);
            }
        },
        reflushRemainTime: function () {
            var now = new Date().getTime();
            var printOrderTime = 0;
            if(this.order.printOrderTime != null){
                printOrderTime = this.order.printOrderTime.time;
            }
            if(!printOrderTime){
                clearInterval(this.remainTimeInt);
                this.remainTimeInt=null;
            }
            var remindTime = (now - printOrderTime) / 1000;
            if (allSetting.autoConfirmTime > remindTime && this.show) {
                this.remainPackageTime.show = true;
                this.remainPackageTime.time = parseInt(allSetting.autoConfirmTime - remindTime);
                setTimeout(this.reflushRemainTime, 1000);
            } else {
                this.remainPackageTime.show = false;
            }

        },
        reflushWechatPayTime: function () {
            var that = this;
            if (this.order.isPay==1) {
                this.wechatPayTime.show = true;
                this.wechatPayTime.time = parseInt(this.wechatPayTime.time-1);
                if(this.wechatPayTime.time <= 0){
                    updateIsPay(this.order.id, function(result){
                        that.wechatPayTime.time = 10;
                        that.wechatPayTime.show = false;
                    });
                }else{
                    setTimeout(this.reflushWechatPayTime, 1000);
                }
            } else {
                this.wechatPayTime.show = false;
            }
        },
        startReflush: function () {
            this.reflushInt = setInterval(this.reflushOrderState, 5000);
            this.reflushRemainTime();
        },
        stopReflush: function () {
            clearInterval(this.reflushInt);
            this.reflushInt = null;
        },
        resetWindow:function(){
            var btnHeight = $(".bottom-button");
            var content = $(".text-left");
            var height = $(".weui_dialog").height();
            content.height(height - btnHeight.height()-20);
            content.css({
                overflow: "hidden",
                position: "relative"
            })
        }
    },
    created: function () {
        var that = this;
        this.show = false;
        this.$watch("show", function () {
            if(this.show){
                choiceCustomerAddress(that.order.customerAddressId,function (result) {		//根据地址ID查询详细地址
                    if(result.success){
                        that.customerAddress = result.data;
                    }
                });
                that.resetWindow();
                Vue.nextTick(function () {
                    setTimeout(function(){
                        that.orderScroll = new IScroll(".text-left", {
                            click: iScrollClick()
                        });
                    },1000)
                });
                if (this.reflushInt == null) {
                    that.startReflush();
                }
                if(this.order.isPay==1){
                    that.reflushWechatPayTime();
                }
            }else{
                that.stopReflush();
            }
        });
//      if(this.order.productionStatus == 6){
//          this.show = false;
//      }
        if(getParam("dialog") != null && ("scanAqrCode" == getParam("dialog") || "myCoupon" == getParam("dialog"))){
            this.show = false;
        }
        if(getParam("showRedMoney") != null && getParam("showRedMoney") == "true"){
            this.show = false;
        }
        this.$on("cancel-order-success", function () {
            this.show = false;
        });
        this.$on("orderDetail-closed", function () {
            this.show = false;
        });
    }
};

Vue.component("share-dialog", {
    mixins: [dialogMix],
    props: ["appraise", "setting", "isshare", "show"],
    template: '<div class="weui_dialog_alert sencond_mask" v-if="show">' +
    '   <div class="weui_mask"></div>' +
    '   <div class="weui_dialog big-dialog share-dialog">' +
    '	   <div class="full-height">' +
    '<div class="appraise-item-div">' +
    '	<div class="reviewListPhotoBox">' +
    '		<img :src="shopDetail.photo">' +
    '	</div>' +
    '	<div class="reviewListInfo">' +
    '		<div class="reviewListInfoTitle">' +
    '			<div class="avatar">' +
    '				<img :src="appraise.headPhoto">' +
    '			</div>' +
    '			<p>' +
    '				<span>{{appraise.nickName}}爱上了{{shopDetail.name}}</span>' +
    '			</p>' +
    '			<div class="comment-rst">' +
    '				<span>{{new Date(appraise.createTime.time).format("MM-dd hh:mm")}}</span>' +
    '				<start-span :level="appraise.level" v-if="allSetting.appraiseEdition == 0"></start-span>' +
    '			</div>' +
    '		</div>' +
    '		<div class="reviewListInfoContent">' +
    '			<p>{{appraise.content}}</p>' +
    '		</div>' +
    '	</div>' +
    '</div>' +
    '<div class="setting-content" v-if="isshare">' +
    '{{{setting.dialogText}}}' +
    '</div>' +
    '		<div v-if="!isshare && !setting.registered" class="bottom-button weui_dialog_ft"><a class="weui_btn_dialog primary" @click="showRegister">{{setting.registerButton}}</a></div>' +
    '		</div>' +
    '		<div v-if="!isshare && setting.registered" class="bottom-button weui_dialog_ft"><a class="weui_btn_dialog primary" @click="hiddenRegister">{{setting.registerButton}}</a></div>' +
    '		<div v-if="isshare"><div class="share-line"><div class="share-point"><i class="icon-share"></i></div>' +
//			'<div class="share-alg"><p>(点击右上角分享按钮分享至朋友圈或好友)</p></div>'+
    '</div></div>' +
    ' 	<div class="dialog-close"><i  @click="close" class="icon-remove-sign"></i></div>' +
    '	</div>' +
    '</div>',
    data: function () {
        return {
            shopDetail : shopInfo,
            customer : null,
            allSetting:allSetting
        }
    },
    methods: {
        close: function () {
            this.show = false;
        },
        showRegister: function () {
            var that = this;
            if (that.customer.subscribe == 0 && allSetting.intoShopSubscribe == 1){
                var url = brand.brandSign + ".restoplus.cn/restowechat/src/subscribe.html?shareLink=" + that.customer.shareLink;
                if (allSetting.openHttps == 1){
                    url = "https://" + url;
                }else {
                    url = "http://" + url;
                }
                window.location.href = url + "&isSetShare=true";
                return;
            }
            this.$dispatch("bind-phone");
            this.show = false;
        },
        hiddenRegister: function () {
            this.$dispatch("successMessage", "你已注册，感谢你的关注！", 2000);
        },
        onShow: function () {
            var that = this;
            var setting = this.setting;
            var desc = "[" + this.shopDetail.name + "]\n" + this.appraise.content;
            if (this.isshare) {
                var shareLink = allSetting.wechatWelcomeUrl + "?shopId=" + this.appraise.shopDetailId + "&shareOrderId=" + this.appraise.orderId + "&shareCustomer=" + this.appraise.customerId + "&subpage=home&appraiseId=" + this.appraise.id + "&dialog=sharefriend&isShareLink=true";
                console.log(shareLink);
                executeWxFunction(function () {
                    wx.onMenuShareTimeline({
                        title: setting.shareTitle, // 分享标题
                        link: shareLink, // 分享链接
                        imgUrl: setting.shareIcon, // 分享图标
                        success: function () {
                            that.show = false;
                            var object = {
                                type : 1,
                                customerId : that.appraise.customerId,
                                shopId : that.appraise.shopDetailId,
                                appraiseId : that.appraise.id
                            };
                            customerShare(object,function (result) {
                                if (result.isGetShareCoupon){
                                    that.$dispatch("show-share-coupon",result.couponList);
                                }
                            });
                        }
                    });
                    wx.onMenuShareAppMessage({
                        title: setting.shareTitle, // 分享标题
                        desc: desc, // 分享描述
                        link: shareLink, // 分享链接
                        imgUrl: setting.shareIcon, // 分享图标
                        success: function () {
                            that.show = false;
                            var object = {
                                type : 2,
                                customerId : that.appraise.customerId,
                                shopId : that.appraise.shopDetailId,
                                appraiseId : that.appraise.id
                            };
                            customerShare(object,function (result) {
                                if (result.isGetShareCoupon){
                                    that.$dispatch("show-share-coupon",result.couponList);
                                }
                            });
                        }
                    });
                });
            }
        }
    },
    created: function () {
        var that = this;
//      that.$watch("show", function () {
//          if (this.show) {
//          	getShopInfo(function (shop) {
//		            that.shopDetail = shop;
//		            that.shopDetail.photo = getBoPic(that.shopDetail.photo);
//		        });
//          }
//      });
        if (getParam("isShareLink")) {
            var shareLink = window.location.href;
            shareLink = shareLink.replace("#home", "");
            var urlLink = shareLink.split("?")[1];
            var object = new Object();
            var urls = urlLink.split("&");
            for (var index in urls) {
                var url = urls[index];
                var urlValue = url.split("=");
                var key = urlValue[0];
                if (key != "subpage" && key != "isShareLink") {
                    object[key] = urlValue[1];
                } else if (key != "isShareLink") {
                    object[key] = "tangshi";
                }
            }
            updateCustomerShareLink(JSON.stringify(object), function (customer) {
                that.customer = customer;
            });
        }
    }
});

Vue.component("table-number-dialog", {
    mixins: [dialogMix],
    template: '<div class="weui_dialog_alert sencond_mask" v-if="show">' +
    '   <div class="weui_mask" @click="close"></div>' +
    '   <div class="weui_dialog ">' +
    '	   <div class="padding-10 ">' +
    '		   <h5 class="text-left">请输入座位号</h5>' +
    '		   <div class="seat_content" style="padding:20px 40px;overflow:hidden;">' +
    '			<a style="float:left;width:49%; "><li><i class="iconcode" style="font-size:30px;">&#xe647;</i></li>扫码输入</a>' +
    '			<a style="float:left;width:49%; "><li><i class="iconcode" style="font-size:35px;">&#xe63f;</i></li>键盘输入</a>' +
    '			</div>' +
    '		</div>' +
    '		<div class="dialog-close" @click="close"><i class="icon-remove-sign"></i></div>' +
    '	</div>' +
    '</div>',
});

/*店铺星级评分组件*/
Vue.component("start-span", {
    props: ['level'],
    template: '<span class="starLevel">' +
    '<i class="icon-star" v-for="i of level"></i>' +
    '<i class="icon-star-empty" v-for="i of 5-level"></i></span>',
});

Vue.component("start-span-img", {
    props: ['level'],
    template: '<span class="starLevel">' +
    '<img src="assets/img/star_red.png" v-if="level==5" v-for="i of level" style="height:20px;width:20px;"/>'+
    '<img src="assets/img/star_black.png" v-if="level<=4" v-for="i of level" style="height:20px;width:20px;"/>'+
    '<img src="assets/img/star_empty.png" v-for="i of 5-level" style="height:20px;width:20px;"/>',
});

Vue.component("start-span-image", {
    props: ['level'],
    template: '<span class="starLevel">' +
    '<img src="../assets/img/star_red.png" v-if="level==5" v-for="i of level" style="height:20px;width:20px;"/>'+
    '<img src="../assets/img/star_black.png" v-if="level<=4" v-for="i of level" style="height:20px;width:20px;"/>'+
    '<img src="../assets/img/star_empty.png" v-for="i of 5-level" style="height:20px;width:20px;"/>',
});

Vue.component("heart-span", {
    props: ['level'],
    template: '<span class="starLevel">' +
    '<i class="icon-heart" v-for="i of level"></i>' +
    '<i class="icon-heart-empty" v-for="i of 5-level"></i></span>',
});

/*状态提示弹窗*/
Vue.component("weui-dialog", {
    props: ['show','msg','type'],
    mixins: [dialogMix],
    template: '<div class="weui_loading_toast" v-if="show">' +
    '<div class="weui_mask_transparent" @click="close" v-if="type && type != 5"></div>' +
    '<div class="weui_toast msg-dialog">' +
    '<img src="assets/img/correctImg.png" class="msgImg" v-if="type && type == 1" />' +
    '<img src="assets/img/errorMsg.png" class="msgImg" v-if="type && type == 2" />' +
    '<img src="assets/img/empty.png" class="msgImg" v-if="type && type == 3" />' +
    '<img src="assets/img/loading.gif" class="msgImg" v-if="type && type == 4" />' +
    '<img src="assets/img/table.png" class="msgImg" v-if="type && type == 5" />' +
    '<img src="assets/img/loading.gif" class="msgImg" v-if="type && type == 6" />' +
    '<p style="top:0px;">{{msg}}</p>' +
    '</div>' +
    '</div>',
    methods: {
        close: function () {
            if(this.type && this.type != 6){
                this.show = false;
            }

        }
    }
});

/*注册成功提示领取优惠券*/
Vue.component("weui-registered-successful", {
    props: ['show'],
    mixins: [dialogMix],
    template:
    '<div class="weui_dialog_alert sencond_mask" v-if="show">' +
    '<div class="weui_mask pop_up" @click="close"></div>' +
    '<div class="weui_dialog dish_details">' +
    '<div class="full-height" style="font-family: 微软雅黑;">' +
    '<div style="position:relative;top:2rem;"><img src="assets/img/redArrow.png" style="width:8rem;height:8rem;" /></div>' +
    '<p style="color:#D81E06;position:relative;top: 2rem;font-size: 16px;font-weight: bold;">注册成功</p>' +
    '<div class="form-group form-gift" style="position: relative;top: 3rem;">' +
    '<p style="color:#666;"><span>获得奖励</span></p>' +
    '</div>' +
    '<div id="scroll-couponList" v-if="showCouponList" >' +
    '<div id="couponList" style="margin: 5px 35px;"></div>' +
    '</div>' +
    '<p class="redBagCash">红包扣除时自动抵扣现金</p>' +

    '<a class="weui_btn_birthGift" @click="receiveGift" v-if="setting.birthGift && customer.customerDetail.birthDate == null">领取生日券</a>' +
    '</div>' +
    '<div class="dialog-close" @click="close"><i class="icon-remove-sign"></i></div>' +
    '</div>' +
    '</div>',
    data: function () {
        return {
            couponType: 0, /*优惠券的类型*/
            showCouponList: true,
            setting: {},
            customer: {},
        }
    },
    created: function () {
        var that = this;
        this.setting = allSetting;
        this.$watch("show", function () {
            if (this.show) {
                $("#scroll-couponList").height();

                //根据 链接 判断 显示的优惠券(新用户注册或者邀请注册)
                that.couponType = getParam("dialog") ? "1" : "0";
                getCustomer(function (customer) {
                    that.customer = customer;
                    if(getParam("df") != null && customer.id != getParam("shareCustomer")){
                        that.couponType = "1";
                    }else if(getParam("df") != null && customer.id == getParam("shareCustomer")){
                        that.couponType = "0";
                    }else if(getParam("dialog") != null && customer.id == getParam("shareCustomer")){
                        that.couponType = "0";
                    }
                    var isc = new IScroll("#scroll-couponList", {click: true});
                    $.post({
                        url: baseUrl + "/wechat/customer/new/showCoupon",
                        data: {"couponType": that.couponType},
                        success: function (result) {
                            if (result.success) {
                                $('#couponList').text("");
                                if (result.data == null || result.data.length == 0) {
                                    //如果没有 优惠券 则不显示 优惠券列表
                                    that.showCouponList = false;
                                    return;
                                }
                                for (var i = 0; i < result.data.length; i++) {
                                    var obj = result.data[i];

                                    var coupon = '<div class="couponName" style="font-size:16px;"><span class="couponValue">'+obj.couponName+'<i style="margin-left:5px;">¥'+ obj.couponValue+'</i></span><span class="couponNumber">×'+obj.couponNumber+'</span></div>';
                                    $('#couponList').append(coupon);
                                }
                                isc.refresh();
                            }
                        }
                    });
                });
                document.addEventListener('touchmove', function (e) {
                    e.preventDefault();
                }, false);
            }
        });
    },
    methods: {
        close: function () {
            this.show = false;
        },
        receiveGift:function(){
            var that = this;
            this.show = false;
            that.$dispatch("open-myBirthday-gift");
        }
    }
});

/*领取生日礼包*/
Vue.component("open-birthdaygift", {
    props: ['show'],
    mixins: [dialogMix],
    template:
    '<div class="weui_dialog_alert sencond_mask" v-if="show">' +
    '<div class="weui_mask pop_up" @click="close"></div>' +
    '<div class="weui_dialog dish_details">' +
    '<div class="full-height" style="font-family: 微软雅黑;" v-if="noGift">' +
    '<div style="position:relative;top:2rem;"><img src="assets/img/gift.png" style="width:8rem;height:8rem;" /></div>' +
    '<div style="position:relative;color:#666;">' +
    '<div style="position:relative;top:2rem;color:#666;margin:10px;">' +
    '<span style="font-size:18px;text-align: left;">生日</span>' +
    '<span class="fillBirth">' +
    '<input type="date" id="myAgeInput" class="weui_input" v-model="age" style="width:85%;text-align: right;font-size:18px;font-family: 微软雅黑;">' +
    '<img src="assets/img/date.png" style="width:1.6rem;height:1.6rem;"/>' +
    '</span>' +
    '</div>' +
    '<div style="position:relative;top:2rem;color:#666;margin:10px;">' +
    '<span style="font-size:18px;text-align: left;">星座</span>' +
    '<span class="fillBirth">{{starSign ? starSign : "魔羯座"}}</span>' +
    '</div>' +
    '</div>' +
    '<p class="birthSurprise">填写生日，领取生日惊喜(限修改一次)</p>' +
    '<a class="weui_btn_birthGift" @click="openMyGift">拆开礼包</a>' +
    '</div>' +
    '<div class="full-height" style="font-family: 微软雅黑;" v-if="openGift">' +
    '<div style="position:relative;top:2rem;"><img src="assets/img/address.png" style="width:8rem;height:8rem;" /></div>' +
    '<p class="receiveSuccess">领取成功</p>' +
    '<p class="birthGift">神秘礼物会在生日前{{giftTime}}天准时发放至您的账户，记得查看哦~</p>' +
    '</div>' +
    '<div class="dialog-close" @click="close"><i class="icon-remove-sign"></i></div>' +
    '</div>' +
    '</div>',
    data: function () {
        return {
            customer: {},
            age:"2000-01-01",
            openGift:false,
            noGift:true,
            starSign:'',
            personDate:null,
            giftTime:null,
        }
    },
    watch: {
        'age':function (newVal, oldVal){
            this.personDate = newVal;
            var nowYear = new Date().getFullYear(); //获取当前年份
            var myYear = newVal.substring(0,4); //获取出生年份
            var myMouth = newVal.substring(5,7); //获取出生月份
            var myDay = newVal.substring(8,10); //获取出生天数
            var star = this.getStarSign(myMouth,myDay);
            this.starSign = star + "座";
        },
        'show':function(newVal, oldVal){
            if(newVal){
                if (/Android/i.test(navigator.userAgent) || /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) {
                    $("#myAgeInput").focus();
                }
            }
        }
    },
    created:function(){
        var that = this;
        this.starSign = '';
        this.$watch("show", function () {
            if(this.show){
                getCustomer(function (customer) {
                    that.customer = customer;
                });
            }
        });
    },
    methods: {
        close: function () {
            this.show = false;
        },
        getStarSign:function(month,day){
            var s="魔羯水瓶双鱼牡羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯";
            var arr=[20,19,21,21,21,22,23,23,23,23,22,22];
            return s.substr(month*2-(day<arr[month-1]?2:0),2);
        },
        openMyGift:function(){
            var that = this;
            if(this.starSign == null || this.starSign == ''){
                this.$dispatch("emptyMessage","请录入您的生日", 3000);
                return;
            }
            modifyBirthDate(that.customer.id,that.personDate,that.personAge,that.starSign,function(result){
                if(result.success){
                    that.giftTime = result.data;
                    allSetting.birthGift = false;
                }else{
                    this.$dispatch("emptyMessage",result.message, 3000);
                }
            });
            this.noGift = false;
            this.openGift = true;
            this.personDate=this.customer.customerDetail.birthDate;
        }
    }
});

/*正在加载弹窗*/
Vue.component("weui-loading", {
    props: ["msg", "show"],
    template: '<div class="weui_loading_toast" v-if="show">' +
    '	<div class="weui_mask_transparent" style="background: url({{allSetting.loadingBackground}}) no-repeat;background-size: 100% 100%;"></div>' +
    '	<div class="weui_toast loading" :style="{color: allSetting.loadingTextColor}">' +
    '		<img class="logoStyle" :src="allSetting.loadingLogo" />'+
    '		<div class="programContainer">'+
    '			<div class="progress">'+
    '				<div class="progress-bar"></div>'+
    '			</div>'+
    '		</div>'+
    '		<p style="font-size: 16px;">{{msg||"加载中，请稍候"}}</p>' +
    '		<p class="footTitle" style="bottom:3rem;">Resto+ V' + getParam("version") + '</p>'+
    '		<p class="footTitle">技术服务热线:400-805-1711</p>'+
    '	</div>' +
    '</div>',
    data: function () {
        return {
            allSetting: allSetting
        }
    },
    created:function(){
        this.allSetting = allSetting;
    }
});

Vue.component("weui_alter", {
    props: ["show", "title", "content","type","order"],
    template: '<div class="weui_dialog_alert third_mask" v-if="show">                          ' +
    '	<div class="weui_mask"></div>                                                         ' +
    '	<div class="weui_dialog">                                                             ' +
    '		<div class="weui_dialog_hd"><strong class="weui_dialog_title">{{title}}</strong></div>' +
    '		<div class="weui_dialog_bd">{{content}}</div>                                     ' +
    '		<div class="weui_dialog_ft">                                                      ' +
    '			<a class="weui_btn_dialog default" @click="close" v-if="!type">确定</a> ' +
    '			<a class="weui_btn_dialog default" @click="reloadPrice" v-if="type && type == 1">确定</a> ' +
    '			<a class="weui_btn_dialog default" @click="reloadShopCart" v-if="type && type == 2">确定</a> ' +
    '		</div>                                                                            ' +
    '	</div>                                                                                ' +
    '</div>',
    methods: {
        close: function () {
            this.show = false;
        },
        reloadPrice:function(){
            this.show = false;
            if("订单金额发生改变，请重新买单！" == this.content){
                location.href = getParam("baseUrl") + "/wechat/index?subpage=my&articleBefore=1&dialog=closeBossOrder&orderBossId="+this.order.id;
            }else if("微信支付过于频繁，请10秒再试！" == this.content){
                this.show = false;
            }else{
                window.location.reload();
            }
        },
        reloadShopCart:function(){
            this.show = false;
            this.$dispatch("reload-shop-cart");
            if(this.content.indexOf("支付中，请勿重复买单！") > -1){
                //location.href = getParam("baseUrl") + "/wechat/index?subpage=my&articleBefore=1&dialog=closeBossOrder";
                this.$dispatch("to-my-page");
            }
        }
    }
});

Vue.component("weui_dialog_confirm", {
    props: ["show", "option"],
    template: '<div class="weui_dialog_confirm sencond_mask" v-if="show">' +
    '	<div class="weui_mask"></div>' +
    '	<div class="weui_dialog ">' +
    '		<div class="weui_dialog_hd"><strong class="weui_dialog_title">{{option.title}}</strong></div>' +
    '		<div class="weui_dialog_bd">{{option.content}}</div>' +
    '		<div class="weui_dialog_ft">' +
    '			<a href="javascript:;" class="weui_btn_dialog default" @click="cancelFunction">{{option.cancalvalue||"否"}}</a>' +
    '			<a href="javascript:;" class="weui_btn_dialog primary" @click="okFunction">{{option.okvalue||"是"}}</a>' +
    '		</div>' +
    '	</div>' +
    '</div>',
    methods: {
        okFunction: function () {
            var close = this.option.ok && this.option.ok();
            this.show = close;
        },
        cancelFunction: function () {
            var close = this.option.cancel && this.option.cancel();
            this.show = close;
        }
    }
});

Vue.component("bind-phone", {
    props: ["show", "content", "couponList"],
    template: '<div class="weui_dialog_alert" v-if="show">' +
    '	<div class="weui_mask"></div>' +
    '	<div class="weui_dialog user_register" style="position:absolute;" :style="{ top: dialogTop }" >' +
    '	<div class="register_title">{{content}}</div>' +
    '		<div class="weui_cells weui_cells_form">' +
    '			<div class="weui_cell" :class="{\'weui_cell_warn\':errMsg}" >' +
    '				<div class="weui_cell_bd weui_cell_primary">' +
    '					<input class="weui_input" type="tel"  placeholder="{{errMsg||\'请输入手机号\'}}" id="phone-input" v-model="phone">' +
    '				</div>' +
    '				<div class="weui_cell_ft">' +
    '				<i class="weui_icon_warn"></i>' +
    '				<button class="weui_btn weui_btn_mini weui_btn_main" @click="getCode" v-bind="{disabled:remainTime>0}" >{{remainTime||"获取验证码"}}</button>' +
    '				</div>' +
    '				</div>' +
    '			<div class="weui_cell" :class="{\'weui_cell_warn\':codeErr}">' +
    '				<div class="weui_cell_bd weui_cell_primary">' +
    '					<input class="weui_input" type="tel"  placeholder="{{codeErr||\'请输入验证码\'}}" id="code-input" v-model="code" v-bind="{readonly:!getCodeSuccess}">' +
    '				</div>' +
    '				<div class="weui_cell_ft">                                                                                      ' +
    '					<i class="weui_icon_warn"></i>' +
    '					<button class="weui_btn weui_btn_mini weui_btn_main" @click="bindPhone" v-bind="{disabled:!getCodeSuccess}">领取红包 </button>' +
    '				</div>' +
    '			</div>' +
    '		</div>' +
    '		<div class="content information informationCoupon">' +
    '			<div class="tabnav CouponCategory list3" style="border-radius: 10px 10px 0px 0px;"  v-if="showCouponList" >' +
    '				<div class="tabnav-item active" style="height:15px" data-status="0"></div>' +
    '			</div>' +
    '		</div>' +
    '		<div id="scroll-wapper"  v-if="showCouponList" style="overflow: hidden;" >' +
    '			<ul class="CouponList mt30" id="couponList" ' +
    '			</ul>' +
    '		</div>' +

    '		<div class="dialog-close" @click="close"><i class="icon-remove-sign"></i></div>' +
    '	</div>' +
    '</div>',
    data: function () {
        return {
            phone: "",
            oldphone: "",
            code: "",
            rcode: "",
            errMsg: "",
            codeErr: "",
            remainTime: 0,
            getCodeBtn: true,
            getCodeSuccess: false,
            couponType: 0,
            showCouponList: true,
            dialogTop: "2%",
            shareCustomer: "",
            flagBindPhone: false
        }
    },
    created: function () {
        var that = this;
        this.$watch("show", function () {
            if (this.show) {
                if (/Android/i.test(navigator.userAgent) || /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) {
                    $("#phone-input").focus();
                }
                if(localStorage.getItem("remainTime") != null && localStorage.getItem("remainTime") != ""){
                    var time = Date.parse(new Date()) - parseInt(localStorage.getItem("remainTime"));
                    if(( 60000 -time) > 0){
                        that.remainTime = ( 60000 -time)/1000;
                        console.log("剩余时间："+that.remainTime);
                        if(that.remainTime){
                            that.cutRemainTime();
                        }
                    }
                }
                var h = $(".informationCoupon").height();
                $("#scroll-wapper").height($(".weui_dialog ").height() - h);

                //根据 链接 判断 显示的优惠券(新用户注册或者邀请注册)
                that.couponType = getParam("dialog") ? "1" : "0";
                if("closeRedPacket" == getParam("dialog")){
                    that.couponType = 0;
                }
                getCustomer(function (customer) {
                    if(getParam("df") != null && customer.id != getParam("shareCustomer")){
                        that.couponType = "1";
                    }else if(getParam("df") != null && customer.id == getParam("shareCustomer")){
                        that.couponType = "0";
                    }else if(getParam("dialog") != null && customer.id == getParam("shareCustomer")){
                        that.couponType = "0";
                    }
                    if("myYue" == getParam("dialog") || "invite" == getParam("dialog") || "myCouponList" == getParam("dialog")
                        || "reChargeOrder" == getParam("dialog")){
                        that.couponType = "0";
                    }
                    var isc = new IScroll("#scroll-wapper", {click: true});
                    $.post({
                        url: baseUrl + "/wechat/customer/new/showCoupon",
                        data: {"couponType": that.couponType},
                        success: function (result) {
                            if (result.success) {
                                $('#couponList').text("");
                                var modeText = {0: "通用", 1: "堂吃", 2: "外卖"};
                                if (result.data == null || result.data.length == 0) {
                                    //如果没有 优惠券 则不显示 优惠券列表
                                    that.showCouponList = false;
                                    that.dialogTop = "25%";
                                    return;
                                }
                                for (var i = 0; i < result.data.length; i++) {
                                    var obj = result.data[i];
                                    var DATE;
                                    if (obj.timeConsType == 1) {
                                        DATE = new Date().format("yyyy-MM-dd") + "至" + that.getTimeAfterDays(obj.couponValiday);
                                    } else if (obj.timeConsType == 2) {
                                        var eDate = new Date(obj.endDateTime.time).format("yyyy-MM-dd");
                                        var bDate = new Date(obj.beginDateTime.time).format("yyyy-MM-dd");
                                        DATE = bDate + " 至 " + eDate;
                                    }

                                    var MODE_name = modeText[obj.distributionModeId];
                                    var time = new Date(obj.beginTime.time).format("hh:mm:ss") + " - " + new Date(obj.endTime.time).format("hh:mm:ss");
                                    if (obj.couponMinMoney > 0) {
                                        MODE_name += " 消费满" + obj.couponMinMoney + "元可使用"
                                    }
                                    if (that.couponType == 1 && obj.recommendDelayTime > 0){
                                        MODE_name += "<font color='red'>（领取"+obj.recommendDelayTime+"小时后生效）</font>"
                                    }
                                    var coupon = '<li class="pepper-con coupon-item"><div class="pepper-w"><div class="pepper pepper-blue" style="margin: 0">'
                                        + '<div class="pepper-l" style="text-align: left;"><p class="pepper-l-num" style="text-align: left;"><i>¥</i><span >' + obj.couponValue + '</span><span data-key="name" style="font-size:12px">' + obj.name + '</span></p>'
                                        + '<p class="pepper-l-con">使用条件：<span >' + MODE_name + '</span></p><p class="pepper-l-tim">使用时间：<span >' + time + '</span></p>'
                                        +
                                        '</div><div class="pepper-r"><span>有效期限</span><div >' + DATE + '</div>'
                                        + '</div></div><div class="pepper-b pepper-blue"><div class="pb-con"></div><div class="pb-border"></div></div>'
                                        + '</div></li>';
                                    for (var n = 0; n < obj.couponNumber; n++) {
                                        $('#couponList').append(coupon);
                                    }
                                }
                                isc.refresh();
                            }
                        }
                    });
                });
                document.addEventListener('touchmove', function (e) {
                    e.preventDefault();
                }, false);
            }
        });
    },
    methods: {
        close: function () {
            this.show = false;
            this.phone = '';
        },
        cutRemainTime: function () {
            if (this.remainTime > 0) {
                this.remainTime--;
                var that = this;
                setTimeout(function () {
                    that.cutRemainTime();
                }, 1000);
            }
        },
        getTimeAfterDays: function (tdData) {
            var now = new Date();
            var time = now.getTime();
            time += 1000 * 60 * 60 * 24 * tdData;//加上3天
            now.setTime(time);
            return now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
        },
        getCode: function () {
            var that = this;
            var phone = $('#phone-input').val();
            if(!this.getCodeBtn){
                return;
            };
            this.oldphone = this.phone;
            if (this.remainTime > 0) {
                return false;
            } else if (this.phone.length == 0) {
                that.$dispatch("remindMessage", "手机号码不能为空", 3000);
                return false;
            }
            if(!(/^1[34578]\d{9}$/.test(phone))) {
                that.$dispatch("remindMessage", "手机号码格式错误", 3000);
                return false;
            }
            this.getCodeBtn = false;
            sendCode(this.phone, function (result) {
                that.errMsg = null;
                if (result.success) {
                    that.getCodeBtn = true;
                    localStorage.setItem("remainTime", Date.parse(new Date()));
                    that.rcode = result.rcode;
                    that.getCodeSuccess = true;
                    that.remainTime = 60;
                    that.cutRemainTime();
                    sendAliCode(that.phone, function (res){
                        if (res.success) {
                            that.rcode = res.rcode;
                        }
                    });
                } else {
                    that.phone = null;
                    that.errMsg = result.message;
                    that.$dispatch("remindMessage", result.message, 3000);
                    that.remainTime = 30;
                    that.getCodeBtn = true;
                    that.cutRemainTime();
                }
            });
        },
        bindPhone: function () {
            var that = this;
            if(that.code != this.rcode){
                that.$dispatch("remindMessage", "验证码错误", 3000);
                return;
            }
            if(!that.flagBindPhone){
                this.shareCustomer = getParam("shareCustomer");
                this.shareOrderId = getParam("shareOrderId");
                if(that.oldphone != this.phone){
                    that.$dispatch("remindMessage", "手机号变动，请核实！", 3000);
                    return false;
                } else {
                    that.flagBindPhone = true;
                    editPhone(this.phone, this.code, this.rcode, that.couponType, this.shareCustomer, this.shareOrderId,function (result) {
                        if (result.success) {
                            that.show = false;
                            var sum = 0;
                            $.ajax({
                                url: baseUrl + "/wechat/customer/new/showCoupon",
                                data: {"couponType": that.couponType},
                                success: function (result) {
                                    if (result.success) {
                                        for (var i = 0; i < result.data.length; i++) {
                                            sum += result.data[i].couponValue * result.data[i].couponNumber;
                                        }
                                        that.$dispatch("show-myBirthday-gift");
                                        that.$dispatch("bindPhoneSuccess");
                                    } else {
                                        that.flagBindPhone = false;
                                        that.$dispatch("remindMessage", "优惠券异常", 3000);
                                    }
                                }
                            });
                        } else {
                            that.$dispatch("remindMessage", "验证码错误", 3000);
                        }
                    });
                }
            }
        }
    },
});
/*我的充值列表*/
Vue.component("charge-rules", {
    props: ["chargelist"],
    template: '<div class="weui_cell weui_cells_access charge-rules" @click.stop="showDialog" v-if="chargelist.length">' +
    '	<div class="weui_cell_hd"></div>' +
    '	<div class="weui_cell_bd weui_cell_primary">' +
    '		<p>' +
    '			<span>充值赠送 </span>' +
    '		</p>' +
    '	</div>' +
    '	<div class="weui_cell_ft">' +
    '	<button class="weui_btn weui_btn_mini charge-btn colorFix" v-for="c in chargelist" v-if="$index <= 1" >' +
    '   	<span >{{c.labelText}}</span>' +
    '    </button>' +
    '	 </div>' +
    '</div>',
    data: function () {
        return {
            times: 0
        }
    },
    methods: {
        showDialog: function () {
            this.$dispatch('show-charge-dialog', this.chargelist);
        },
        charge: function (chargeid) {
            this.$dispatch('charge', chargeid);
        }
    }
});

/*购物车的充值列表*/
Vue.component("charge-rule", {
    props: ["chargelist"],
    template: '<div class="weui_cell weui_cells_access charge-rules" @click.stop="showDialog" v-if="chargelist.length" style="border-bottom:1px solid #e7e7e7;">' +
    '	<div class="weui_cell_hd"></div>' +
    '	<div class="weui_cell_bd weui_cell_primary">' +
    '		<p>' +
    '			<span>充值赠送 </span>' +
    '		</p>' +
    '	</div>' +
    '	<div class="weui_cell_ft">' +
    '			<button class="weui_btn weui_btn_mini charge-btn colorFix" ' +
    '			v-for="c in chargelist" v-if="$index <= 1" ' +
    '			><span>{{c.labelText}}</span></button>' +
    '</div>' +
    '</div>',
    data: function () {
        return {
            times: 0
        }
    },
    methods: {
        showDialog: function () {
            this.$dispatch('show-charge-dialog', this.chargelist);
        },
        charge: function (chargeid) {
            this.$dispatch('charge', chargeid);
        }
    }
});

/*充值列表弹窗*/
Vue.component("charge-dialog", {
    props: ["chargeList", "show"],
    template: '<div class="weui_dialog_confirm sencond_mask" v-if="show">' +
    '	<div class="weui_mask" @click="close"></div>' +
    '	<div class="weui_dialog shadow">' +
    '		<div class="weui_dialog_hd"><strong class="weui_dialog_title" style="font-size:18px;">充值列表</strong></div>' +
    '		<div class="weui_cells_radios" id="scrollList" style="max-height:40vh;overflow:hidden;position:relative;">' +
    '			<div>' +
    '			<label class="weui_cell weui_check_label" @click="choiceId=(c.id)" ontouchend="click()" v-for="c in chargeList">' +
    '				<div class="weui_cell_primary">' +
    '					<span style="margin-left:10px;font-size:16px;">{{c.labelText}}</span>' +
    '				</div>' +
    '				<div class="weui_cell_ft">' +
    '					<input type="radio" class="weui_check" v-model="choiceId" :value="c.id">' +
    '					<span class="weui_icon_checked"></span>' +
    '				</div>' +
    '			</label>' +
    '			</div>' +
    '		</div>' +
    '		<div class="weui_dialog_ft margin-top-0">' +
    '			<a href="javascript:;" class="weui_btn_dialog primary" style="font-size:18px;" v-if="!choiceId">充值</a>' +
    '			<a href="javascript:;" class="weui_btn_dialog primary" style="font-size:18px;" @click.stop="this.$dispatch(\'charge\',choiceId,close)" v-else >充值</a>' +
    '		</div>' +
    '		<div class="dialog-close" @click="close"><i class="icon-remove-sign"></i></div>' +
    '	</div>' +
    '</div>',
    data: function () {
        return {
            choiceId: null,
            myScroll:null
        }
    },
    methods: {
        close: function () {
            this.show = false;
        }
    },
    created: function () {
        var that = this;
        this.$on("charge-success", function () {
            that.close();
            getChargeList(function (chargeList) {
                that.chargeList = chargeList;
            });
        });
        getChargeList(function (chargeList) {
            that.chargeList = chargeList;
            that.choiceId = chargeList.length ? chargeList[0].id : "";
        });
        this.$watch("show", function () {
            if(this.show){
                setTimeout(function(){
                    Vue.nextTick(function () {
                        that.myScroll = new IScroll("#scrollList",{
                            click:iScrollClick()
                        })
                    });
                },500)
            }
        });
    }
});

/*微信支付弹窗*/
Vue.component("pay-dialog", {
    props: ["order", "show" , "iamPaying"],
    template: '<div class="weui_dialog_confirm sencond_mask" v-if="show">' +
    '   <div class="weui_mask pop_up"></div>' +
    '   <div class="weui_dialog shadow middle-dialog" style="height:initial;">' +
    '       <div class="full-height weui_cells_radios">' +
    '       <p class="choice-pay-title">' +
    '           <span style="font-family:微软雅黑;color:#000;">实付金额</span>' +
    '           <span class="sales price pull-right font-blod" style="font-size:1.2em;" v-if="order.orderMode != 6">{{order.paymentAmount.toFixed(2)}}元</span>' +
    '           <span class="sales price pull-right font-blod" style="font-size:1.2em;" v-if="order.orderMode == 6">{{money}}元</span>' +
    '       </p>' +
    '   <div class="weui_dialog_pay weui_cells_radios" id="scroll-payList" v-if="shop.shopMode == 6">' +
    '       <div>'+
    /*外卖只有两种支付方式*/
    '           <label class="weui_cell weui_check_label" @click="orderPayType=1" v-if="order.distributionModeId == 2">' +
    '               <div class="weui_cell_primary">' +
    '                   <img class="pull-left imgBox" src="assets/img/wxpay.png" />'+
    '                   <span style="margin-left:10px;">微信支付</span>' +
    '               </div>' +
    '               <div class="weui_cell_ft">' +
    '                   <input type="radio" v-model="orderPayType" class="weui_check" value="1" >' +
    '                   <span class="weui_icon_checked"></span>' +
    '               </div>' +
    '           </label>' +
    '           <label class="weui_cell weui_check_label" v-if="setting.aliPay==1 && shop.aliPay==1 && order.distributionModeId == 2" @click="orderPayType=2">' +
    '               <div class="weui_cell_primary">' +
    '                   <img class="pull-left imgBox" src="assets/img/ali.jpg" />' +
    '                   <span style="margin-left:10px;">支付宝支付</span>' +
    '               </div>' +
    '               <div class="weui_cell_ft">' +
    '                   <input type="radio" v-model="orderPayType" class="weui_check" value="2" >' +
    '                   <span class="weui_icon_checked"></span>' +
    '               </div>' +
    '           </label>' +
    /*大boss模式并且堂食有多种支付方式*/
    '           <label class="weui_cell weui_check_label" @click="orderPayType=1" v-if="order.distributionModeId != 2">' +
    '               <div class="weui_cell_primary">' +
    '                   <img class="pull-left imgBox" src="assets/img/wxpay.png" />'+
    '                   <span style="margin-left:10px;">微信支付</span>' +
    '               </div>' +
    '               <div class="weui_cell_ft">' +
    '                   <input type="radio" v-model="orderPayType" class="weui_check" value="1" >' +
    '                   <span class="weui_icon_checked"></span>' +
    '               </div>' +
    '           </label>' +
    '           <label class="weui_cell weui_check_label" v-if="setting.aliPay==1 && shop.aliPay==1 && order.distributionModeId != 2" @click="orderPayType=2">' +
    '               <div class="weui_cell_primary">' +
    '                   <img class="pull-left imgBox" src="assets/img/ali.jpg" />' +
    '                   <span style="margin-left:10px;">支付宝支付</span>' +
    '               </div>' +
    '               <div class="weui_cell_ft">' +
    '                   <input type="radio" v-model="orderPayType" class="weui_check" value="2" >' +
    '                   <span class="weui_icon_checked"></span>' +
    '               </div>' +
    '           </label>' +
    '           <label class="weui_cell weui_check_label" v-if="setting.openShanhuiPay==1 && shop.openShanhuiPay==1 && order.distributionModeId != 2" @click="orderPayType=5">' +
    '               <div class="weui_cell_primary">' +
    '                   <img class="pull-left imgBox" src="assets/img/dazhong.png" />' +
    '                   <span style="margin-left:10px;">大众点评支付</span>' +
    '               </div>' +
    '               <div class="weui_cell_ft">' +
    '                   <input type="radio" v-model="orderPayType" class="weui_check" value="5" >' +
    '                   <span class="weui_icon_checked"></span>' +
    '               </div>' +
    '           </label>' +
    '           <label class="weui_cell weui_check_label" v-if="setting.openUnionPay==1 && shop.openUnionPay==1 && order.distributionModeId != 2" @click="orderPayType=3">' +
    '               <div class="weui_cell_primary">' +
    '                   <img class="pull-left imgBox" src="assets/img/bankPay.png" />' +
    '                   <span style="margin-left:10px;">刷卡支付</span>' +
    '               </div>' +
    '               <div class="weui_cell_ft">' +
    '                   <input type="radio" v-model="orderPayType" class="weui_check" value="3" >' +
    '                   <i class="weui_icon_checked"></i>' +
    '               </div>' +
    '           </label>' +
    '           <label class="weui_cell weui_check_label" v-if="setting.openMoneyPay==1 && shop.openMoneyPay==1 && order.distributionModeId != 2" @click="orderPayType=4">' +
    '               <div class="weui_cell_primary">' +
    '                   <img class="pull-left imgBox" src="assets/img/cash.png" />' +
    '                   <span style="margin-left:10px;">现金支付</span>' +
    '               </div>' +
    '               <div class="weui_cell_ft">' +
    '                   <input type="radio" v-model="orderPayType" class="weui_check" value="4">' +
    '                   <i class="weui_icon_checked"></i>' +
    '               </div>' +
    '           </label>' +
    '           <label class="weui_cell weui_check_label" v-if="setting.integralPay==1 && shop.integralPay==1 && order.distributionModeId != 2" @click="orderPayType=6">' +
    '               <div class="weui_cell_primary">' +
    '                   <img class="pull-left imgBox" src="assets/img/jifen.png" />' +
    '                   <span style="margin-left:10px;">会员支付</span>' +
    '               </div>' +
    '               <div class="weui_cell_ft">' +
    '                   <input type="radio" v-model="orderPayType" class="weui_check" value="6" >' +
    '                   <i class="weui_icon_checked"></i>' +
    '               </div>' +
    '           </label>' +
    '       </div>' +
    '   </div>' +
    '<div class="weui_dialog_pay weui_cells_radios" v-if="shop.shopMode != 6">' +
    '   <label class="weui_cell weui_check_label" @click="orderPayType=1">' +
    '       <div class="weui_cell_primary">' +
    '           <img class="pull-left imgBox" src="assets/img/wxpay.png" />'+
    '           <span style="margin-left:10px;">微信支付</span>' +
    '       </div>' +
    '       <div class="weui_cell_ft">' +
    '           <input type="radio" class="weui_check" v-model="orderPayType" value="1">' +
    '           <span class="weui_icon_checked"></span>' +
    '       </div>' +
    '   </label>' +
    '   <label class="weui_cell weui_check_label" v-if="setting.aliPay==1 && shop.aliPay==1" @click="orderPayType=2">' +
    '       <div class="weui_cell_primary">' +
    '           <img class="pull-left imgBox" src="assets/img/ali.jpg" />' +
    '           <span style="margin-left:10px;">支付宝支付</span>' +
    '       </div>' +
    '       <div class="weui_cell_ft">' +
    '           <input type="radio" class="weui_check"  v-model="orderPayType" value="2">' +
    '           <span class="weui_icon_checked"></span>' +
    '       </div>' +
    '   </label>' +
    '</div>' +

    '<div class="bottom-button" style="position: initial;">' +
    '   <div class="weui_dialog_ft">' +
    '       <a href="javascript:;" class="weui_btn_dialog primary" @click="payorder" v-if="order.orderMode != 6">' +
    '           <span>确认支付<span class="price"></span>{{order.paymentAmount.toFixed(2)}}</span>' +
    '       </a>' +
    '       <a href="javascript:;" class="weui_btn_dialog primary" @click="payorder | debounce 0" v-if="order.orderMode == 6">' +
    '           <span>确认支付<span class="price"></span>{{money}}</span>' +
    '       </a>' +
    '   </div>' +
    '</div>' +
    '</div>' +
    '<div class="dialog-close" @click="close"><i class="icon-remove-sign"></i></div>' +
    '</div>',
    data: function () {
        return {
            shop:{},
            setting:{},
            money:null,
            createOrder:false,
            payList:null,
            orderPayType : 1    //订单支付方式，默认为微信支付
        }
    },
    methods: {
        close: function () {
            var that = this;
            this.show = false;
            this.$dispatch("pay-state-close");
        },
        payorder: function () {
            // this.loadShow = true;
            if(this.createOrder){
                return;
            }
            var that = this;
            this.createOrder = true;
            setTimeout(function(){//10秒后才能再次点击
                that.createOrder = false;
            },3000);

            //先付店铺判断当前店铺是否是newpos开启店铺，如果开启判断是否断连。
            if(this.order.payType == 0){
                checkShopOpenNewPosNow(shopInfo.id,function(result){
                    if(!result.success){
                        that.$dispatch("remindMessage", result.message, 10000);
                        return;
                    }
                });
            }

            if(this.orderPayType == 2 && this.order.payType == 0){     //支付宝支付
                this.order.payMode = 2;
                if(this.order.id != null){
                    this.$dispatch("again-alipay-order", that.order);
                }else{
                    this.$dispatch("save-order", that.order);
                }
                this.show = false;
            }else if(this.orderPayType == 1 && this.order.payType == 0){     //微信支付
                this.order.payMode = 1;
                this.show = false;
                if (this.order.id) {
                    this.$dispatch("pay-order", "wechat", this.order);
                } else {
                    console.log("订单为为保存的订单，保存订单先");
                    var that = this;
                    this.$dispatch("save-order", this.order, function (order) {
                        that.order = order;
                        that.$dispatch("pay-order", "wechat", that.order);
                    });
                }
            }else if(this.orderPayType == 3 && this.order.payType == 0){     //银联支付
                this.order.payMode = 3;
                this.show = false;
                if (this.order.id) {
                    this.$dispatch("update-order-paymode", this.order);
                }else{
                    this.$dispatch("save-order", this.order);
                }
            }else if(this.orderPayType == 4 && this.order.payType == 0){     //现金支付
                this.order.payMode = 4;
                this.show = false;
                if (this.order.id) {
                    this.$dispatch("update-order-paymode", this.order);
                }else{
                    this.$dispatch("save-order", this.order);
                }
            }else if(this.orderPayType == 5 && this.order.payType == 0){     //美团闪惠支付
                this.order.payMode = 5;
                if(this.order.id != null){
                    this.$dispatch("again-shanhui-order", that.order);
                }else{
                    this.$dispatch("save-order", that.order);
                }
                this.show = false;
            }else if(this.orderPayType == 6 && this.order.payType == 0){     //积分支付
                this.order.payMode = 6;
                this.$dispatch("save-order", this.order);
                this.show = false;
            }else if(this.order.payType == 1){
                var shijiMoney = 0;
                if(that.order.amountWithChildren > 0){
                    shijiMoney = that.order.amountWithChildren-that.order.originalAmount;
                }else{
                    shijiMoney = that.order.paymentAmount-that.order.originalAmount;
                }
                afterPay(that.order.id,that.order.useCoupon, shijiMoney.toFixed(2),that.order.originalAmount,that.order.waitMoney,that.orderPayType,function(result){
                    if(result.success){
                        if(that.orderPayType == 1){
                            that.$dispatch("pay-order", "wechat", that.order);
                        }else if(that.orderPayType == 2){
                            if(that.order.distributionModeId == 2){
                                location.href = getParam("baseUrl") + "/wechat/index?subpage=my&qiehuan=qiehuan&openAliPayPage=open&loginpage="+pageType;
                            }else{
                                location.href = getParam("baseUrl") + "/wechat/index?subpage=my&qiehuan=qiehuan&openAliPayPage=open&loginpage="+pageType;
                            }
                        }else{
                            location.href = getParam("baseUrl") + "/wechat/index?subpage=my&qiehuan=qiehuan&payMode=houfuSuccess&orderId="+that.order.id;
                        }
                    }else{
                        if(result.code == 50){
                            that.$dispatch("save-orderBoss-fail", that.order, result);
                        }else if(result.code == 100){
                            that.$dispatch("save-orderBoss-fail", that.order, result);
                        }
                    }
                });
            }
        }
    },
    created: function () {
        var that = this;
        this.$watch("show", function () {
            if(that.show){
                if(that.order.payMode == 2 && that.order.orderState != 1){
                    that.money = that.order.paymentAmount;
                }else{
                    that.money = that.order.originalAmount;
                }
                that.shop = shopInfo;
                that.setting = allSetting;
                Vue.nextTick(function () {
                    that.payList = new IScroll("#scroll-payList", {
                        click: iScrollClick()
                    });
                });
            }else{
                that.$dispatch("pay-state-close");
            }
        });
        this.$on("pay-success", function () {
            that.close();
        });
    }
});

Vue.component("iframe-dialog", {
    mixins: [dialogMix],
    props: ["src","mode"],
    template: '<div class="weui_dialog_alert sencond_mask" v-if="show">' +
    '<div class="weui_mask pop_up" @click="close"></div>' +
    '<div class="weui_dialog iframe-dialog" style="height:72%;">' +
    '<iframe :src="src" :mode="mode">' + '</iframe>' +
    '<div class="dialog-close" @click="close"><i class="icon-remove-sign"></i></div>' +
    '</div>' +
    '</div>',
});

/*消费者领完红包之后的评论弹窗*/
Vue.component("order-appraise-dialog", {
    mixins: [orderDetailed],
    props: ["show"],
    template: '<div class="weui_dialog_alert sencond_mask" v-if="show">' +
    '	<div class="weui_mask pop_up" @click="close"></div>' +

    '		<div class="weui_dialog order-desc">' +
    '			<div class="text-left appraise-dialog" :class="currentClass">' +
    '				<div class="form-group">' +
    '					<h4 class="shop-name-money">' +
    '						<span>{{shopInfo.name}}</span>' +
    '						<span class="c-gray">账单消费{{order.amountWithChildren||order.orderMoney}}元</span>' +
    '					</h4>' +
    '				</div>' +
    '				<div class="scoreCircle" style="margin:0px auto;">'+
    '					<div id="boomsakalaka" :data-percent="personalScore" v-if="scrollCircle"></div>' +
    '					<div id="myBoomsakalaka" data-text="请选择评分" v-if="circle"></div>' +
    '				</div>' +

    '				<div class="form-group">' +
    '					<p><span class="comments" id="satisfied" style="color:#a4a7b1">满意度</span></p>' +
    '					<div class="appraise-level" v-if="!selectState">' +
    '						 <span v-for="n in 5" > ' +
    '							<i :class="{\'icon-star-empty\':level<n,\'icon-star\':level>=n}" @click="selectLevel($index)" style="margin-right: -4px"></i>' +
    '						 </span>' +
    '					</div> ' +
    '					<div class="appraise-level" v-if="selectState">' +
    '						 <span v-for="n in 5" > ' +
    '							<i :class="{\'icon-star-empty\':level<n,\'icon-star\':level>=n}" @click="selectLevelSmall($index)" style="margin-right: -4px"></i>' +
    '						 </span>' +
    '					</div> ' +
    '				</div>' +

    '				<div class="mainAppraise" v-if="isSelectLevel">'+
    '					<div class="form-group">' +
    '						<p><span class="comments">{{{appraiseTypeName}}}</span></p> ' +
    '						<div class="appraise-content scroll" id="scrollComment">' +
    '							<div style="width:100%;height:100%;">'+
    '								<span class="appraise-name" :class="{bad:level<4,good:level==4,\'active\':isActive(item)}" v-for="item in showphotos" @click="choiceItem(item,2)">{{item.title}}</span>' +
    '							</div>'+
    '						</div>' +

    '						<div class="appraise-items text-left">' +
    '							<div>' +
    '								<div class="appraise-content" v-if="allSetting.isOptionalPhoto" style="margin-top:-12px">' +
    '									<span><img class="photoImg" style="position: relative;bottom: -10px;" @click="showCamera" src="/restowechat/src/assets/img/photo.png" /></span>' +
    '									<span class="appraise-name article" :class="{bad:level<4,good:level==4,\'active\':isActive(photo)}" v-for="photo in photoList" @click="choiceItem(photo,1)">{{photo.articleName}}</span>' +
    '									<span class="appraise-name article" :class="{bad:level<4,good:level==4,\'active\':isActive(item)}" v-if="item.type!=4"  v-for="item in order.orderItems | orderBy \'createTime\'" @click="choiceItem(item,3)">{{item.articleName}}</span> ' +
    '								</div> ' +
    '								<div class="appraise-content" v-if="!allSetting.isOptionalPhoto">' +
    '									<span v-if="allSetting.isOptionalPhoto"><img class="photoImg" style="position: relative;bottom: -10px;" @click="showCamera" src="/restowechat/src/assets/img/photo.png" /></span>'+
    '									<span class="appraise-name article" :class="{bad:level<4,good:level==4,\'active\':isActive(item)}" v-for="photo in photoList" @click="choiceItem(photo,1)">{{photo.articleName}}</span>' +
    '									<span class="appraise-name article" :class="{bad:level<4,good:level==4,\'active\':isActive(item)}" v-if="item.type!=4"  v-for="item in order.orderItems | orderBy \'createTime\'" @click="choiceItem(item,3)">{{item.articleName}}</span> ' +
    '								</div> ' +
    '							</div> ' +
    '						</div> ' +

    '					</div>' +
    '					<div class="form-group-title"> ' +
    '						<span class="comments" :class="{bad:level<4,good:level==4}">消费评价</span> ' +
    '						<div class="weui_cell_bd weui_cell_primary"> ' +
    '							<textarea class="weui_textarea" placeholder="请输入评论~" rows="3" v-model="content"></textarea> ' +
    '							<span v-if="level>=0 && level<4" id="RemainingTextBad" style="font-size:12px;position:absolute;right:6px;color:#bdbdbd;bottom:56px;">还差{{allSetting.badAppraiseLength}}个字哟</span>'+
    '							<span v-if="level==4" id="RemainingTextGood" style="font-size:12px;position:absolute;right:6px;color:#bdbdbd;bottom:56px;">还差{{allSetting.goodAppraiseLength}}个字哟</span>' +
    '						</div> ' +
    '					</div> ' +
    '				</div> ' +
    '			</div> ' +

    '			<div class="bottom-button">' +
    '				<div class="weui_dialog_ft margin-top-0">' +
    '					<a class="weui_btn_dialog defult order" v-if="level<0" style="color: #C81624;white-space: nowrap;">请评价您的订单,领取{{allSetting.brandName}}红包</a> ' +
    '					<a class="weui_btn_dialog primary" @click="saveAppraise" v-if="isSelectLevel && clickState == false">领取红包</a> ' +
    '					<a class="weui_btn_dialog primary disableClick" v-if="clickState">领取中</a> ' +
    '				</div>' +
    '				<div class="dialog-close" @click="close"><i class="icon-remove-sign"></i></div>' +
    '			</div>' +
    '		</div> ' +
    '	</div> ' +
    '</div>',
    data: function () {
        return {
            level: -1,
            currentItem: null,
            feedback: [],
            feedbackArticle: [],
            content: "",
            showphotos: [],
            showphotosGood: [],
            showphotosBad: [],
            itemsIsc: null,
            photoList:[],
            index:1,
            types:[".jpg",".png",".gif",".bmp"],
            articleFeedBack: 0,
            clickState:false,
            isSelectLevel:false,
            circle:true,
            scrollCircle:false,
            personalScore: "",
            selectState:false,
            shopInfo:shopInfo,
            appraiseType:1
        }
    },
    watch: {
        'content': function (newVal, oldVal) {
            if(newVal.length >= allSetting.badAppraiseLength){
                $("#RemainingTextBad").css("display","none");
            }else{
                $("#RemainingTextBad").css("display","block");
            }
            if(newVal.length >= allSetting.goodAppraiseLength){
                $("#RemainingTextGood").css("display","none");
            }else{
                $("#RemainingTextGood").css("display","block");
            }
        },
        'isSelectLevel':function(newVal, oldVal){
            if(newVal){
                var that = this;
                var appraiseItems = $(that.$el.nextSibling).find(".appraise-items").get(0);
                that.itemsIsc = new IScroll(appraiseItems, {
                    click: iScrollClick()
                });
                that.appraiseIsc = new IScroll("#scrollComment", {
                    click: iScrollClick()
                });
                Vue.nextTick(function () {
                    that.itemsIsc.refresh();
                    that.appraiseIsc.refresh();
                })
            }
        }
    },
    computed: {
        currentClass: function () {
            if (this.isGood) {
                return "good-appraise";
            } else if(this.isNull) {
                return "no-appraise";
            }else{
                return "bad-appraise";
            }
        },
        appraiseTypeName: function () {
            if(this.level == -1){
                return "<font style='color: black;'>消费体验</font>";
            }else if(this.level == 4){
                return "<font style='color: #C81624;'>我要点赞</font>";
            }else if(this.level == 3){
                return "<font style='color: black;'>需要改进</font>";
            }else{
                return "<font style='color: black;'>我要投诉</font>";
            }
        },
        isGood: function () {
            if (this.level == 4) {
                return true;
            } else {
                return false;
            }
        },
        isNull: function () {
            if (this.level == -1) {
                return true;
            } else {
                return false;
            }
        },
        appraiseType: function () {
            if (this.isGood) {
                return this.currentItem.showType || 1;
            } else {
                return 4;
            }
        }
    },
    created: function () {
        var that = this;
        this.allSetting = allSetting;
        /*评分动画初始化*/
        this.$on("save-appraise-success", function () {
            that.order.allowAppraise = false;
            that.order.orderState = 11;
            that.clickState = false;
            that.close();
        });
        this.$watch("show", function () {
            if (this.show) {
                Vue.nextTick(function () {
                    $("#myBoomsakalaka").circliful({
                        foregroundBorderWidth: 10,
                        backgroundBorderWidth: 10,
                        noPercentageSign: true,
                    });
                })
                getShowPhoto(function (result) {
                    var list = result.goodList;
                    that.showphotosBad = result.badList;
                    that.showphotosGood = list;
                    //that.showphotos = list;
                });
            } else {
                this.photoList = [];
                this.index = 1;
                this.level = -1;
                this.currentItem = [];
                this.feedback = [];
                this.feedbackArticle = [];
                this.content = "";
            }
        })
    },
    methods: {
        showCamera:function(){
            var that = this;
            wx.chooseImage({
                count: 9, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    $("#imghead").attr('src',localIds[0]);
                    var img = document.getElementById('imghead');
                    that.uploadimgtoweChat(localIds);
                }
            });
        },
        uploadimgtoweChat:function(localIds){
            var that = this;
            if (localIds.length == 0) {
                modalAlert("请拍照或选择相册照片");
            } else {
                var i = 0, length = localIds.length;
                function upload() {
                    wx.uploadImage({
                        localId: localIds[i],
                        success: function (res) {
                            var serverId = res.serverId; // 返回图片的服务器端ID
                            var photoInfo = {};
                            photoInfo.id = serverId;
                            photoInfo.localId = localIds[i];
                            photoInfo.articleName = "自选照片"+that.index;
                            that.photoList.push(photoInfo);
                            that.$dispatch("message", "图片上传中");
                            i++;
                            that.index++;
                            if (i <= length) {
                                upload();
                            }
                        },
                        fail: function (res) {
                            modalAlert("上传失败");
                        }
                    });
                };
                upload();
            };
        },
        selectLevel: function (index) {
            var that = this;
            this.circle = false;
            this.isSelectLevel = false;
            this.scrollCircle = true;
            this.selectState = true;
            this.feedback = [];
            this.feedbackArticle = [];
            this.level = index;
            if (index == 0) {
                $('#satisfied').html("<label style='color: black;'>非常不满意,各方面都很差</label>");
                that.showphotos = that.showphotosBad;
                that.personalScore = 20;
            } else if (index == 1) {
                $('#satisfied').html("<label style='color: black;'>不满意，比较差</label>");
                that.showphotos = that.showphotosBad;
                that.personalScore = 40;
            } else if (index == 2) {
                $('#satisfied').html("<label style='color: black;'>一般体验，还需改进</label>");
                that.showphotos = that.showphotosBad;
                that.personalScore = 60;
            } else if (index == 3) {
                $('#satisfied').html("<label style='color: black;'>基本满意，仍可改进</label>");
                that.showphotos = that.showphotosBad;
                that.personalScore = 80;
            } else if (index == 4) {
                $('#satisfied').html("<label style='color: #C81624;'>非常满意，五星体验</label>");
                that.showphotos = that.showphotosGood;
                that.personalScore = 100;
            }
            Vue.nextTick(function () {
                $("#boomsakalaka").circliful({
                    animation: 1,
                    animationStep: 18,
                    foregroundBorderWidth: 10,
                    backgroundBorderWidth: 10,
                    noPercentageSign: true,
                    percentageTextSize:24,
                });
            })
            setTimeout(function(){
                that.scrollCircle = false;
                that.isSelectLevel = true;
                $(".appraise-level").addClass("active");
            },1500);
        },
        selectLevelSmall:function(index){
            var that = this;
            this.feedback = [];
            this.feedbackArticle = [];
            this.level = index;
            if (index == 0) {
                $('#satisfied').html("<label style='color: black;'>非常不满意,各方面都很差</label>");
                that.showphotos = that.showphotosBad;
            } else if (index == 1) {
                $('#satisfied').html("<label style='color: black;'>不满意，比较差</label>");
                that.showphotos = that.showphotosBad;
            } else if (index == 2) {
                $('#satisfied').html("<label style='color: black;'>一般体验，还需改进</label>");
                that.showphotos = that.showphotosBad;
            } else if (index == 3) {
                $('#satisfied').html("<label style='color: black;'>基本满意，仍可改进</label>");
                that.showphotos = that.showphotosBad;
            } else if (index == 4) {
                $('#satisfied').html("<label style='color: #C81624;'>非常满意，五星体验</label>");
                that.showphotos = that.showphotosGood;
            }
            Vue.nextTick(function () {
                that.itemsIsc.refresh();
                that.appraiseIsc.refresh();
            })
        },
        choiceItem: function (item,type) {
            var that = this;
            item.classifyType = type;
            var flag = true;
            for (var i = 0; i < this.feedback.length; i++) {
                var fb = this.feedback[i];
                if (item.id == fb.id) {
                    this.feedback.splice(i, 1);
                    flag = false;
                }
            }
            for (var j = 0; j < this.feedbackArticle.length; j++) {
                var fba = this.feedbackArticle[j];
                if (item.id == fba.id) {
                    this.feedbackArticle.splice(j, 1);
                }
                if(j >= 8){
                    this.feedbackArticle.shift();
                    for (var k = 0; k < this.feedback.length; k++) {
                        var fbk = this.feedback[k];
                        if (this.feedbackArticle[0].id == fbk.id) {
                            this.feedback.splice(k, 1);
                        }
                    }
                }
            }
            if(flag){
                this.feedback.push(item);
                if(type == 3){
                    this.feedbackArticle.push(item);
                }
            }

        },
        isActive: function (item) {
            var that = this;
            for (var i = 0; i < this.feedback.length; i++) {
                var bk = this.feedback[i];
                if (bk.id == item.id) {
                    return true;
                }
            }
            return false;
        },
        close: function () {
            this.show = false;
            this.level = -1;
            this.isSelectLevel = false;
            this.selectState = false;
            this.circle = true;
            this.showphotos = [];
        },
        error: function (msg) {
            this.$dispatch("emptyMessage", msg);
        },
        saveAppraise: function () {
//          if(!this.feedback.length){
//          	this.$dispatch("emptyMessage", "请选择要点评的对象", 3000);
//              return;
//          }
			if(this.appraiseType == 1){
				
			}
			
            var that = this;
            var key= $(".weui_textarea").val();
            var type = this.level + 1;
            var feedbackText = "";
            var feedbackArticle = "";
            var id = "";
            var photoIds = "";
            var mediaIds = "";

//          if (!this.feedbackArticle.length) {
//              this.$dispatch("emptyMessage", "请选择要点评的菜品", 2000);
//          }
            if (key.length < allSetting.goodAppraiseLength && this.isGood) {
                this.error("请输入" + allSetting.goodAppraiseLength + "字以上的评论");
            } else if (key.length < allSetting.badAppraiseLength && !this.isGood) {
                this.error("请输入" + allSetting.badAppraiseLength + "字以上的评论");
            }else{
                for (var i = 0; i < that.feedback.length; i++) {
                    if(that.feedback[i].classifyType == 1 ){
                        if (mediaIds == "") {
                            mediaIds = that.feedback[i].id;
                        } else {
                            mediaIds = mediaIds+ ","+ that.feedback[i].id;
                        }
                        feedbackText += that.feedback[i].articleName + ",";
                    }
                    if(that.feedback[i].classifyType == 3 ){
                        if (id == "") {
                            id = that.feedback[i].id;
                        } else {
                            id = id+ ","+ that.feedback[i].id;
                        }
                        feedbackText += that.feedback[i].articleName + ",";
                        feedbackArticle = feedbackArticle + " " + that.feedback[i].articleName + " ";
                    }
                    if(that.feedback[i].classifyType == 2 ){
                        if (photoIds == "") {
                            photoIds = that.feedback[i].id;
                        } else {
                            photoIds = photoIds+ ","+ that.feedback[i].id;
                        }
                        feedbackText += that.feedback[i].title + ",";
                    }
//	                this.saveAppraiseBtn = false;
                }
                var appraise = {
                    mediaIds: mediaIds,
                    type: type,
                    articleId: id,
                    photoIds: photoIds,
                    feedback: feedbackText,
                    feedbackArticle: feedbackArticle,
                    level: this.level + 1,
                    orderId: this.order.id,
                    content: key,
                };
                this.clickState = true;
                if(appraise.level <= 0 || appraise.level == null){
                    this.$dispatch("emptyMessage", "未获取到您的评分等级，请重新评论！", 5000);
                }else{
                    this.$dispatch("save-appraise", appraise);
                }
            }
        }
    }
});

/*新评论模式*/
Vue.component("new-appraise-dialog", {
    props: ["show","order"],
    template:'<div class="weui_dialog_confirm" v-if="show">' +
        '	<div class="weui_mask" @click="close"></div>' +
        		'<div class="weui_dialog red_bg" style="z-index:100;background-color:#eee;">'+
        		'<div id="scrollAppraise">'+
        		'<div>'+
        			'<div class="expression_tab">'+
        				'<p class="header_title" v-if="!scoreLevel">本次消费满意度</p>'+
        				'<p class="header_title" v-if="scoreLevel == 5" style="color: #ff8932;">超赞</p> '+
        				'<p class="header_title" v-if="scoreLevel == 4">待改进</p> '+
        				'<p class="header_title" v-if="scoreLevel == 3">一般</p> '+
        				'<p class="header_title" v-if="scoreLevel == 2">较差</p>'+
        				'<p class="header_title" v-if="scoreLevel == 1">极差</p>'+
        				'<div class="flex-container-score">'+
    						'<img class="expression_img" v-for="f in scoreDetaile.expressionList" :src="f.state ? f.brightSrc : f.expressionSrc" @click="getScore(f)"/>'+
    					'</div>'+
    					<!--好评-->
    					'<div v-if="scoreLevel == 5">'+
    						'<div class="flex-container-tab">'+
	    						'<span class="flex_item_label good" :class="{checkedgood:isActive(a)}" v-for="a in goodLabelList" @click="choiceLabel(a)">{{a.title}}</span>'+
	    					'</div>'+
	    					'<p>你会推荐哪些菜品</p> '+
	    					'<div class="flex-container-tab">'+
	    						'<span class="flex_item_label good" :class="{checkedgood:isActiveArticle(a)}" v-if="a.type!=4" v-for="a in order.orderItems" @click="choiceArticle(a)">{{a.articleName}}</span>'+
	    					'</div>'+
    					'</div>'+
    					<!--差评-->
    					'<div v-if="scoreLevel < 5">'+
    						'<div class="flex-container-tab">'+
	    						'<span class="flex_item_label bad" :class="{checkedbad:isActive(a)}" v-for="a in badLabelList" @click="choiceLabel(a)">{{a.title}}</span>'+
	    					'</div>'+
	    					'<p style="">你要吐槽哪些菜品</p> '+	
	    					'<div class="flex-container-tab">'+
	    						'<span class="flex_item_label bad" :class="{checkedbad:isActiveArticle(a)}" v-if="a.type!=4" v-for="a in order.orderItems" @click="choiceArticle(a)">{{a.articleName}}</span>'+
	    					'</div>'+
    					'</div>'+
    					<!--评论内容-->
        				'<div class="weui_cell appraise">'+
			                '<div class="weui_cell_primary" style="padding: 5px;">'+
			                    '<textarea class="weui_textarea" placeholder="你说，我们在倾听..." rows="3" maxlength="100" style="background: #eee;" v-model="appraise"></textarea>'+
			                    '<div class="weui_textarea_counter"><span>{{appraise.length}}</span>/{{remainWord}}</div>'+
			                '</div>'+
			           ' </div>'+  					   					    					
        			'</div>'+	

	        		'<div class="appraise_main">'+     			
	        			'<div class="expression_tab">'+
	        				<!--评论打分-->
	        				'<div class="appraise_score" v-for="tab in tabList">'+
	        					'<p class="tab_text">{{tab.name}}</p>'+
	        					'<div class="expression_content">'+
	        						'<div class="flex-container">'+
		        						'<img class="expression_img" v-for="f in tab.expressionList" :src="f.state ? f.brightSrc : f.expressionSrc" @click="changeExpression(f,tab)"/>'+
		        					'</div>'+
	        					'</div>' +
	        				'</div>'+	        					        						            
	        			'</div>'+
	        			'<div style="position: relative;top:1.5vw;padding: 4vw 0;">'+
		        			'<button class="weui_btn receive" @click="receiveReward">领取奖励</button>'+
		        		'</div>'+
	        		'</div>'+	        			        		
        		'</div>'+
        		'</div>'+
	        '</div>'+
        '</div>',
    data:function (){
    	return {
    		scoreDetaile:{
        		scoreInfo:[],
        		expressionList:[
	        		{
		                expressionSrc:'assets/img/jicha_normal.png',
		                brightSrc:'assets/img/jicha_seltted.png',
		                state:false,
		                level:1,
		                score:20
		            },
		            {
		                expressionSrc:'assets/img/buman_normal.png',
		                brightSrc:'assets/img/buman_seltted.png',
		                state:false,
		                level:2,
		                score:40
		            },
		            {
		                expressionSrc:'assets/img/yiban_normal.png',
		                brightSrc:'assets/img/yiban_seltted.png',
		                state:false,
		                level:3,
		                score:60
		            },
		            {
		                expressionSrc:'assets/img/manyi_normal.png',
		                brightSrc:'assets/img/manyi_seltted.png',
		                state:false,
		                level:4,
		                score:80
		            },
		            {
		                expressionSrc:'assets/img/chaozan_normal.png',
		                brightSrc:'assets/img/chaozan_seltted.png',
		                state:false,
		                level:5,
		                score:100
		            }
	        	]
        	},
			tabList:[
                {
                    name:"服务",
                    type:1,
                    currentExpression:[],
                    expressionList:[
                        {
                            expressionSrc:'assets/img/jicha_normal.png',
                            brightSrc:'assets/img/jicha_seltted.png',
                            state:false,
                            grade:20,
                        },
                        {
                            expressionSrc:'assets/img/buman_normal.png',
                            brightSrc:'assets/img/buman_seltted.png',
                            state:false,
                            grade:40
                        },
                        {
                            expressionSrc:'assets/img/yiban_normal.png',
                            brightSrc:'assets/img/yiban_seltted.png',
                            state:false,
                            grade:60
                        },
                        {
                            expressionSrc:'assets/img/manyi_normal.png',
                            brightSrc:'assets/img/manyi_seltted.png',
                            state:false,
                            grade:80,
                        },
                        {
                            expressionSrc:'assets/img/chaozan_normal.png',
                            brightSrc:'assets/img/chaozan_seltted.png',
                            state:false,
                            grade:100,
                        }
                    ]

                },
                {
                    name:"环境",
                    type:2,
                    currentExpression:[],
                    expressionList:[
                        {
                            expressionSrc:'assets/img/jicha_normal.png',
                            brightSrc:'assets/img/jicha_seltted.png',
                            state:false,
                            grade:20,
                        },
                        {
                            expressionSrc:'assets/img/buman_normal.png',
                            brightSrc:'assets/img/buman_seltted.png',
                            state:false,
                            grade:40,
                        },
                        {
                            expressionSrc:'assets/img/yiban_normal.png',
                            brightSrc:'assets/img/yiban_seltted.png',
                            state:false,
                            grade:60,
                        },
                        {
                            expressionSrc:'assets/img/manyi_normal.png',
                            brightSrc:'assets/img/manyi_seltted.png',
                            state:false,
                            grade:80,
                        },
                        {
                            expressionSrc:'assets/img/chaozan_normal.png',
                            brightSrc:'assets/img/chaozan_seltted.png',
                            state:false,
                            grade:100,
                        }
                    ]
                    
                },
                {
                    name:"性价比",
                    type:3,
                    currentExpression:[],
                    expressionList:[
                        {
                            expressionSrc:'assets/img/jicha_normal.png',
                            brightSrc:'assets/img/jicha_seltted.png',
                            state:false,
                            grade:20,
                        },
                        {
                            expressionSrc:'assets/img/buman_normal.png',
                            brightSrc:'assets/img/buman_seltted.png',
                            state:false,
                            grade:40,
                        },
                        {
                            expressionSrc:'assets/img/yiban_normal.png',
                            brightSrc:'assets/img/yiban_seltted.png',
                            state:false,
                            grade:60,
                        },
                        {
                            expressionSrc:'assets/img/manyi_normal.png',
                            brightSrc:'assets/img/manyi_seltted.png',
                            state:false,
                            grade:80,
                        },
                        {
                            expressionSrc:'assets/img/chaozan_normal.png',
                            brightSrc:'assets/img/chaozan_seltted.png',
                            state:false,
                            grade:100,
                        }
                    ]

                },
                {
                    name:"氛围",
                    type:4,
                    currentExpression:[],
                    expressionList:[
                        {
                            expressionSrc:'assets/img/jicha_normal.png',
                            brightSrc:'assets/img/jicha_seltted.png',
                            state:false,
                            grade:20,
                        },
                        {
                            expressionSrc:'assets/img/buman_normal.png',
                            brightSrc:'assets/img/buman_seltted.png',
                            state:false,
                            grade:40
                        },
                        {
                            expressionSrc:'assets/img/yiban_normal.png',
                            brightSrc:'assets/img/yiban_seltted.png',
                            state:false,
                            grade:60
                        },
                        {
                            expressionSrc:'assets/img/manyi_normal.png',
                            brightSrc:'assets/img/manyi_seltted.png',
                            state:false,
                            grade:80
                        },
                        {
                            expressionSrc:'assets/img/chaozan_normal.png',
                            brightSrc:'assets/img/chaozan_seltted.png',
                            state:false,
                            grade:100
                        }
                    ]
                },
                {
                    name:"出品",
                    type:5,
                    currentExpression:[],
                    expressionList:[
                        {
                            expressionSrc:'assets/img/jicha_normal.png',
                            brightSrc:'assets/img/jicha_seltted.png',
                            state:false,
                            grade:20,
                        },
                        {
                            expressionSrc:'assets/img/buman_normal.png',
                            brightSrc:'assets/img/buman_seltted.png',
                            state:false,
                            grade:40,
                        },
                        {
                            expressionSrc:'assets/img/yiban_normal.png',
                            brightSrc:'assets/img/yiban_seltted.png',
                            state:false,
                            grade:60,
                        },
                        {
                            expressionSrc:'assets/img/manyi_normal.png',
                            brightSrc:'assets/img/manyi_seltted.png',
                            state:false,
                            grade:80,
                        },
                        {
                            expressionSrc:'assets/img/chaozan_normal.png',
                            brightSrc:'assets/img/chaozan_seltted.png',
                            state:false,
                            grade:100,
                        }
                    ]
                }
            ],
            appraise:'',
            remainWord:100,
            goodLabelList:[],	//好评lable
            badLabelList:[],	//差评lable
            selectionList:[],	//选择的标签
            articleList:[],		//菜品的标签及赞踩
            myScroll:null,
            appraiseBtn:true
    	}
    },
    computed: {
        scoreStatus:function(){
            var that = this;
            var status = false;
            that.tabList.forEach(function(tab){
                if(tab.currentExpression.length == 0){
                    status = true;
                }
            })
            return status;
        },
        average:function(){
            var that = this;
            var sum = 0;
            var averageScore = 0;
            that.tabList.forEach(function(tab){
                sum += tab.currentExpression[0].grade;
                averageScore = sum / that.tabList.length;
            })
            return averageScore;
        },
        scoreLevel:function(){
        	var that = this;
        	var level = 0;
        	that.scoreDetaile.expressionList.forEach(function(s){
        		if(that.scoreDetaile.scoreInfo[0].state == s.state){
                    level = s.level;
                }
        	})
        	return level;
        },
        score:function(){
        	var that = this;
        	var score = 0;
        	that.scoreDetaile.expressionList.forEach(function(s){
        		if(that.scoreDetaile.scoreInfo[0].state == s.state){
                    score = s.score;
                }
        	})
        	return score;
        }
    },
    created: function () {
        var that = this;
        this.$on("save-appraise-successful", function () {
            that.order.allowAppraise = false;
            that.order.orderState = 11;
            that.appraiseBtn = true;
        });
        this.$watch("show", function () {
        	if(this.show){
	        	getShowPhoto(function (result) {
	                var list = result.goodList;
	                that.badLabelList = result.badList;
	                that.goodLabelList = result.goodList;
	            });
	            that.myScroll = new IScroll("#scrollAppraise",{
		            click:iScrollClick()
		        });
        	}        	        
        });
    },
    methods: {
    	close:function(){
    		this.show = false;
    		this.remainWord = 100,
            this.appraise = '';			//评论成功清空信息
            this.articleList = [];
         	this.tabList.forEach(function(tab){
                tab.expressionList.forEach(function(expression){
                    expression.state = false;		//表情设为初始状态
                })
            });
            this.selectionList = [];	//选择满意度清空已选label
            this.goodLabelList.forEach(function(k){
                k.statue = true;
            })
            this.badLabelList.forEach(function(k){
                k.statue = true;
            })
    	},
        getScore:function(f){
    	 	var that = this;
            if (that.scoreDetaile.scoreInfo.length == 0) { 
                f.state = true;
                that.scoreDetaile.scoreInfo.push(f);
            } else {
                that.scoreDetaile.expressionList.forEach(function(expression){
                    if(that.scoreDetaile.scoreInfo[0].state == expression.state){
                        expression.state = false;
                    }
                })
                that.scoreDetaile.scoreInfo = [];
                that.scoreDetaile.scoreInfo.push(f);
                f.state = true;
            }
            that.selectionList = [];	//选择满意度清空
            that.articleList = [];		//选择的菜品清空
            Vue.nextTick(function () {
        		that.myScroll.refresh();             
            });
        },
        isActive: function (a) {
            var that = this;
            for (var i = 0; i < this.selectionList.length; i++) {
                var bk = this.selectionList[i];
                if (bk.id == a.id) {
                    return true;
                }
            }
            return false;
        },
        isActiveArticle: function (a) {
            var that = this;
            for (var i = 0; i < this.articleList.length; i++) {
                var bk = this.articleList[i];
                if (bk.articleId == a.articleId) {
                    return true;
                }
            }
            return false;
        },
        changeExpression:function(f,tab){
            var that = this;
            if (tab.currentExpression.length == 0) { //未选择表情
                f.state = true;
                tab.currentExpression.push(f);
            }else { //选择表情后
                tab.expressionList.forEach(function(expression){
                    if(tab.currentExpression[0].state == expression.state){
                        expression.state = false;
                    }
                })
                tab.currentExpression = [];
                tab.currentExpression.push(f);
                f.state = true;
            }           
        },       
        choiceLabel:function(a){
        	var that = this;
        	var flag = false;
       		for (var i = 0; i < that.selectionList.length; i++) {
                if (that.selectionList[i].id == a.id) {
                    flag = true;
                    that.selectionList.splice(i, 1);
                }
            }
            if (!flag) {
                that.selectionList.push(a);
            }   
        },
        choiceArticle:function(a){
        	var that = this;
        	var flag = false;
       		for (var i = 0; i < that.articleList.length; i++) {
                if (that.articleList[i].articleId == a.articleId) {
                    flag = true;
                    that.articleList.splice(i, 1);
                }
            }
            if (!flag) {
            	var temp = {};
            	temp.articleId = a.articleId;
            	if(this.scoreLevel == 5){
            		temp.state = 1;
            	}else{
            		temp.state = 0;
            	}
                that.articleList.push(temp);
            }
        },
        receiveReward:function(){
        	var that = this;
        	var feedback = '';
        	var appraiseGrade = [];
        	if(that.appraiseBtn){
        		if(!this.scoreLevel){
	                that.$dispatch("remindMessage", "亲，请选择满意度!",3000);
	                return;
	            }
	            if(this.appraise == null || this.appraise == ''){
	                that.$dispatch("remindMessage", "亲，评论不能为空哦~",3000);
	                return;
	            }
	            if(that.scoreStatus){
                    that.$dispatch("remindMessage", "亲，请勾选所有评分项~",3000);
                    return;
                }
	            that.tabList.forEach(function(tab){
                    var temp = {};
                    temp.type = tab.type;
                	temp.grade = tab.currentExpression[0].grade;                                
                    appraiseGrade.push(temp);
               })
	            this.selectionList.forEach(function(label){
	                feedback += label.title + ",";
	            })
	            
	            var options = {
	                content:this.appraise,
	                allGrade:this.average,
	                appraiseGrades:appraiseGrade,
	                appraiseSteps:this.articleList,
	                orderId: that.order.id,
	                level:this.score,
	                feedback:feedback
	            };
	            that.appraiseBtn = false;
	            console.log(JSON.stringify(options));	
	            saveNewAppraise(options,function(result){
	            	if(result.success){
	            		that.remainWord = 100,
                        that.appraise = '';			//评论成功清空信息
                        that.articleList = [];
                     	that.tabList.forEach(function(tab){
	                        tab.expressionList.forEach(function(expression){
	                            expression.state = false;		//表情设为初始状态
	                        })
	                    });
	                    that.selectionList = [];	//选择满意度清空已选label
	                    that.goodLabelList.forEach(function(k){
	                        k.statue = true;
	                    })
	                    that.badLabelList.forEach(function(k){
	                        k.statue = true;
	                    })
	            		that.show = false;
	            		that.$dispatch("save-new-appraise",result,options);
	            	}
            	})
        	}
        	                      
        }
    }
})

/*顾客消费之后的红包弹窗*/
Vue.component("red-papper-dialog", {
    mixins: [dialogMix],
    props: ["name", "title", "order", "customer"],
    template: '<div class="weui_dialog_confirm sencond_mask red_papper" v-if="show">' +
    '<div class="weui_mask" @click="close"></div>' +
    '<div class="weui_dialog red_bg">' +
    '<div class="topcontent">' +
    '<div class="red_avatar">' +
    '<img :src="logo">' +
    '<span class="close" @click="close">+</span>' +
    '</div>' +
    '<h2>{{name}}</h2>' +
    '<span class="text">发了一个红包</span>' +
    '<div class="red_description">{{title}}</div>' +
    '</div>' +
    '<div class="chai" id="chai">' +
    '<span @click="openPapper">開</span>' +
    '</div>' +
    '</div>' +
    '</div>',
    methods: {
        openPapper: function (e) {
            var that = this;
            this.show = false;
//          if( allSetting.allowAppraiseSubscribe == 1 && that.customer.subscribe == 0){
//              that.$dispatch("open-subscribe", that.customer);
//          }else{
                that.$dispatch("open", {
                    title: that.title,
                    name: that.name,
                    money: that.money
                });
//          }
        }
    },
    data: function () {
        return {
            logo: allSetting.redPackageLogo
        }
    }
});

/*打赏功能*/
Vue.component("reward-dialog", {
    mixins: [dialogMix],
    props: ["appraise"],
    template: '<div  v-if="show">' +
    '<div class="weui_dialog_confirm">' +
    '	<div class="weui_mask" @click="close"></div>' +
    '<div class="weui_dialog ex_dialog reward-dialog">' +
    '<div class="full-height">' +
    '<div class="red_bag_open"> ' +
    '	<div class="red_open"> ' +
    '		<div class="red_open_topcontent"> ' +
    '		</div>' +
    '		<div class="red_open_avatar">' +
    '			<img :src="logo">' +
    '		</div>' +
    '		<h2>{{allSetting.brandName}}</h2> ' +
    '		<div class="red_open_description">{{rewardSetting.title}}</div> ' +
    '	</div> ' +
    '	<div class="reward-detailed">' +
    '		<div class="reward-area">' +
    '<p class="reward-t">打赏对象:</p>' +
    '<p class="reward-t-span"><span>对象名称{{appraise.feedback}}</span></p>' +
    '<p class="reward-sg2">（您的打赏是我们做得更好的动力源泉）</p>' +
    '</div>' +
    '		<div class="reward-area">' +
    '<div class="reward-value-div">' +
    '<span class="reward-value" v-for="n in 6" @click="paymentShow(moneyList[n])"><span class="reward-money">{{moneyList[n]}}</span></span>' +
    '</div>' +
    '<div class="other-money" @click="inputMoneyShow"><a >其他金额</a></div>' +
    '</div>' +
    '	</div> ' +
    '</div> ' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<input-number-dialog :show.sync="inputNumberDialog.show" @yes="inputYes"></input-number-dialog> ' +
    '<payment-dialog :show.sync="paymentDialog.show" :appraise="appraise" :customer="customer" :money="paymentDialog.money"></payment-dialog> ' +
    '</div>',
    data: function () {
        return {
            allSetting: allSetting,
            rewardSetting: {},
            inputNumberDialog: {show: false},
            paymentDialog: {show: false, money: 0},
            customer: {},
        }
    },
    computed: {
        moneyList: function () {
            var moneyList = this.rewardSetting.moneyList;
            var reg = /[\d]{1,},[\d]{1,},[\d]{1,},[\d]{1,},[\d]{1,},[\d]{1,}/;
            if (moneyList && moneyList.match(reg)) {
                return moneyList.match(reg)[0].split(",");
            } else {
                return [1, 2, 8, 12, 18, 28];
            }
        }
    },
    methods: {
        inputYes: function (number) {
            this.paymentShow(number);
        },
        inputMoneyShow: function () {
            this.inputNumberDialog.show = true;
        },
        inputMoneyClose: function () {
            this.inputNumberDialog.show = false;
        },
        paymentShow: function (number) {
            this.paymentDialog.show = true;
            this.paymentDialog.money = parseFloat(number);
        },
        paymentClose: function () {
            this.paymentDialog.show = false;
        },
        onShow: function () {
            var that = this;
            getRewardDetailed(function (setting) {
                that.rewardSetting = setting;
            });
            getCustomer(function (customer) {
                that.customer = customer;
            });
        }
    },
    components: {
        'input-number-dialog': {
            mixins: [dialogMix],
            data: function () {
                return {
                    number: "",
                }
            },
            template: '<div class="weui_dialog_confirm sencond_mask" v-if="show">                     ' +
            '	<div class="weui_mask" @click="close"></div>                                 ' +
            '<div class="weui_dialog middle-top">' +
            '<div class="full-height">' +
            '<div class="weui_dialog_hd"><strong class="weui_dialog_title">其他金额</strong></div>' +
            '<div class="weui_dialog_bd">' +
            '<div class="weui_cell">                                                                  ' +
            '	<div class="weui_cell_hd">金额(元)&nbsp;&nbsp;</div>                  ' +
            '	<div class="weui_cell_bd weui_cell_primary">                                          ' +
            '		<input class="weui_input" type="number" v-model="number">' +
            '	</div>                                                                                ' +
            '</div>                                                                                   ' +
            '</div>                       ' +
            '<div class="weui_dialog_ft">                                                         ' +
            '	<a class="weui_btn_dialog primary" @click="yes">确定</a>                   ' +
            '</div>                                                                               ' +
            '</div>' +
            '<div class="dialog-close" @click="close"><i class="icon-remove-sign"></i></div>' +
            '</div>' +
            '</div>',
            methods: {
                yes: function () {
                    var money = parseFloat(this.number);
                    if (!money || money == "NaN" || money < 0.1) {
                        this.$dispatch("emptyMessage", "请输入至少0.1元的打赏金额哦！", 2000);
                        return false;
                    }
                    this.$dispatch("yes", this.number);
                    this.close();
                }
            }
        },
        'payment-dialog': {
            mixins: [dialogMix],
            props: ["show", "mode"],
            template: '<div class="weui_dialog_confirm sencond_mask" v-if="show">                     ' +
            '	<div class="weui_mask" @click="close"></div>                                 ' +
            '<div class="weui_dialog middle-top">' +
            '<div class="full-height">' +
            '<div class="weui_dialog_hd"><strong class="weui_dialog_title">打赏</strong></div>' +
            '<div class="weui_dialog_bd">' +
            '<div class="reward-hd-div">' +
            '<h1>￥{{money.toFixed(2)}}</h1>' +
            '</div>' +
            '<div class="weui_cells">                           ' +
            '	<div class="weui_cell" v-if="customer.account>0">                         ' +
            '		<div class="weui_cell_bd weui_cell_primary">' +
            '			<p>使用余额: {{customer.account}} 元</p>                         ' +
            '		</div>                                      ' +
            '       <div class="weui_cell_ft"><i class="icon-check"></i></div>' +
            '	</div>                                          ' +
            '	<div class="weui_cell" v-if="needWechat">                         ' +
            '		<div class="weui_cell_bd weui_cell_primary">' +
            '			<p>微信支付: {{needWechat}} 元</p>                         ' +
            '		</div>                                      ' +
            '	</div>                                          ' +
            '</div>                                             ' +
            '</div>                       ' +
            '<div class="weui_dialog_ft">                                                         ' +
            '	<a href="javascript:;" class="weui_btn_dialog primary" @click="createRewardOrder">确定</a>                   ' +
            '</div>                                                                               ' +
            '</div>' +
            '<div class="dialog-close" @click="close"><i class="icon-remove-sign"></i></div>' +
            '</div>' +
            '</div>',
            computed: {
                needWechat: function () {
                    var m = this.money - this.customer.account;
                    if (m > 0) {
                        return m;
                    } else {
                        return 0;
                    }
                }
            },
            methods: {
                createRewardOrder: function () {

                    console.log(this.appraise.id, this.money);
                }
            }

        }
    },
});

//未注册则在每次进入页面时弹出此红包
Vue.component("red-papper-dialog-registered", {
    mixins: [dialogMix],
    props: ["name", "title"],
    template: '<div class="weui_dialog_confirm sencond_mask red_papper" v-if="show">' +
    '	<div class="weui_mask" @click="close"></div>' +
    '	<div class="weui_dialog red_bg">' +
    '		<div class="topcontent">' +
    '			<div class="red_avatar">' +
    '				<img :src="logo">' +
    '				<span class="close" @click="close">+</span>' +
    '			</div>' +
    '			<h2>{{name}}</h2>' +
    '			<span class="text">发了一个红包</span>' +
    '			<div class="red_description">{{title}}</div> ' +
    '		</div>' +
    '		<div class="chai" id="chai">' +
    '			<span @click="openRegisteredPapper">開</span>' +
    '		</div>' +
    '   </div>' +
    '</div>',
    methods: {
        openRegisteredPapper: function (e) {
            this.show = false;
            this.$dispatch("open", {
                title: this.title,
                name: this.name,
                money: this.money
            });
        }
    },
    data: function () {
        return {
            logo: allSetting.redPackageLogo
        }
    }
});

/*打开红包获取金额*/
Vue.component("red-papper-open", {
    mixins: [dialogMix],
    props: ["name", "title", "money", "appraise", "order", "allowshare"],
    template: '<div class="weui_dialog_confirm sencond_mask red_papper" v-if="show">' +
    '<div class="weui_mask" @click="close"></div>' +
    '<div class="weui_dialog order-desc">' +
    '<div class="red_bag_open">' +
    '<div class="red_open">' +
    '<div class="red_open_topcontent">' +
    '<span class="red_avatar_close" @click="close">+</span>' +
    '</div>' +
    '<div class="red_open_avatar">' +
    '<img :src="logo">' +
    '</div>' +
    '<h2>{{name}}的红包</h2>' +
    '<div class="red_open_description">恭喜发财，大吉大利！</div>' +
    '<div class="red_open_get"> <span>{{money}}</span>元</div>' +
    '<a class="pocket_money">红包将于{{times}}分钟后到账</a>' +
    '</div>' +
    '<div class="" v-if="appraise.canReward">' +
	    '<div class="reward-btn" @click="clickReward"> <span>赏</span> </div>' +
	    '<div class="reward-bg"></div>' +
	    '<div class="reward-sg">客官，对我们的服务满意吗？打赏点零花钱吧！</div>' +
    '</div>' +
    '<div class="weui_cells red_open_people">' +
//							'<a class="words">余额可在付款时直接抵用现金</a>' +
    '</div>' +
    '<a class="weui_btn_ShareRebate" @click="jumpShare" v-if="allowshare">分享评价，再送红包</a>' +
    '<a class="weui_btn_ShareRebate" @click="jumpShare" v-if=""></a>' +
    '</div>' +
    '</div>' +
    '</div>',
    data: function () {
        return {
            logo: allSetting.redPackageLogo,
            appraiseMoneyTime:allSetting.delayAppraiseMoneyTime
        }
    },
    computed: {
        times:function(){
            var readyTime = 0;
            readyTime = parseInt(this.appraiseMoneyTime/60);
            return readyTime;
        }
    },
    methods: {
//      openAccount: function () {
//          this.show = false;
//          this.$dispatch('open-iframe', 'views/informationAccount.html');
//      },
        onShow: function () {
        },
        clickReward: function () {
            this.$dispatch("open-reward-dialog", this.appraise)
            this.close();
        }
    }
});

/*叫号等待队列*/
Vue.component("callnumber-dialog", {
    mixins: [dialogMix],
    props: ["order", "customer"],
    template: '<div class="weui_dialog_alert" v-if="show">' +
    '	<div class="weui_mask" @click="close"></div>' +
    '	<div class="weui_dialog order-desc callnumber">' +
    '		<div class="full-height">' +
    '			<div class="clearfix"><span class="callnumber-title">等待队列</span></div>' +
    '			<div class="call-list">' +
    '				<p v-for="o in list1" :class="{active:o.active}">{{o.text}}</p>' +
    '			</div>' +
    '			<div class="call-list">' +
    '				<p v-for="o in list2" :class="{active:o.active}">{{o.text}}</p>' +
    '			</div>' +
    '			<div class="call-list">' +
    '				<p v-for="o in list3" :class="{active:o.active}">{{o.text}}</p>' +
    '			</div>' +
    '			<div class="clearfix"></div>' +
    '<div class="bottom-button text-center">' +
    '			<p v-if="orderlist!=null">您的前面还有 {{beforeNumber}} 位在等待</p>' +
    '			<p v-else><i class="icon-spinner icon-spin"></i>正在加载中...</p>' +
    '</div>' +
    '		</div>' +
    '		<div class="dialog-close" @click="close"><i class="icon-remove-sign"></i></div>' +
    '	</div>' +
    '</div>',
    computed: {
        oid: function () {
            return this.order.id;
        },
        beforeNumber: function () {
            var orderlist = this.orderlist;
            for (var i = 0; i < orderlist.length; i++) {
                var od = orderlist[i];
                if (od.id == this.order.id) {
                    return i;
                }
            }
            return orderlist.length;
        },
        currentCode: function () {
            return this.order.verCode;
        },
        list1: function () {
            var list = this.getList(0, 10);
            return list;
        },
        list2: function () {
            var list = this.getList(10, 10);
            return list;
        },
        list3: function () {
            var list = this.getList(20, 10);
            if (list.length >= 10) {
                list[8] = {text: "...."};
                list[9] = {text: this.currentCode};
            }
            return list;
        }
    },
    methods: {
        getList: function (begin, length) {
            var arr = [];
            if (this.orderlist.length > begin) {
                var listLength = begin + length;
                if (listLength > this.orderlist.length) {
                    listLength = this.orderlist.length;
                }
                var hasCurrent = false;
                for (var i = begin; i < listLength; i++) {
                    var order = this.orderlist[i];
                    var nickname = order.remark;

                    var showText = {text: order.verCode};
                    if (this.oid == order.id) {
                        hasCurrent = true;
                        showText.active = true;
                    }
                    arr.push(showText);
                }
            }
            return arr;
        }
    },
    data: function () {
        return {
            orderlist: null,
            orderListIntr: null,
            orderStateIntr: null,
        }
    },
    created: function () {
        var that = this;
        this.$watch("show", function () {
            if (this.show) {
                findReadyOrderList(null, function (orderlist) {
                    that.orderlist = orderlist;
                });

                that.orderListIntr = setInterval(function () {
                    findReadyOrderList(null, function (orderlist) {
                        that.orderlist = orderlist;

                    });
                }, 3000);
                that.orderStateIntr = setInterval(function () {
                    getOrderStates(that.oid, function (o) {
                        that.order = $.extend(that.order, o);
                        if (o.productionStatus == 3) {
                            that.$dispatch("show-custom-neworder", that.order);
                            that.show = false;
                            that.$dispatch("successMessage", "已经叫号啦！请取餐！", 300 * 3000);
                        }
                    });
                }, 3000);
            } else {
                if (that.orderListIntr) {
                    clearInterval(that.orderListIntr);
                    that.orderListIntr = null;
                }
                if (that.orderStateIntr) {
                    clearInterval(that.orderStateIntr);
                    that.orderStateIntr = null;
                }
            }
        });
    }
});

/*切换店铺弹窗*/
Vue.component("shoplist-dialog-big", {
    mixins: [dialogMix],
    props: ["shoplist","subpage"],
    template: '<div class="weui_dialog_alert" v-if="show">' +
    '<div class="weui_mask pop_up"></div>' +
    '<div class="weui_dialog map-dialog">' +
    '<div class="full-height" id="test_div_ddd" style="overflow:hidden">' +
    '<div>' +
    '<div class="weui_dialog_bd" id="map-div" v-show="">map' + '</div>' +
    /*外卖模式*/
    '<div class="list_map" v-for="shop in dis_shoplist" @click="switchShop(shop.id)" v-if="shop.isTakeout == 1 && shopType == 0">' +
    '<span v-if="shop.photo.length > 0"><img src="{{shop.photo}}"/></span>' +
    '<span v-if="shop.photo.length == 0"><img src="/restowechat/src/assets/img/resto.png"/></span>' +
    '<span class="shop_city">{{shop.name}}</span>' +
    '<div class="shop_distance"><img src="//api0.map.bdimg.com/images/marker_red_sprite.png" /><span>{{shop.distance}}</span></div>' +
    '</div>' +
    /*堂食模式*/
    '<div class="list_map" v-for="shop in dis_shoplist" @click="switchShop(shop.id)" v-if="shopType == 1">' +
    '<span v-if="shop.photo.length > 0"><img src="{{shop.photo}}"/></span>' +
    '<span v-if="shop.photo.length == 0"><img src="/restowechat/src/assets/img/resto.png"/></span>' +
    '<span class="shop_city">{{shop.name}}</span>' +
    '<div class="shop_distance"><img src="//api0.map.bdimg.com/images/marker_red_sprite.png" /><span>{{shop.distance}}</span></div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    //'<div class="dialog-close" @click="close"><i class="icon-remove-sign"></i></div>' +
    '</div>',
    data: function () {
        return {
            map: null,
            lng: 121.47489949,
            lat: 31.24916171,
            myMarker: null,
            appraiseCount: {},
            countList: [],
            appraiseList: [],
            pictureList: [],
            maxLevel: 5,
            minLevel: 4,
            dis_shoplist: [],
            num: 0,
            shopType:0
        }
    },
    created:function () {
        var that = this;
        if(that.subpage == 'waimai'){
            that.shopType = 0;
        }else{
            that.shopType = 1;
        }
    },
    computed: {
        dis_shoplist: function () {
            var shoplist = [];
            var mypoint = new BMap.Point(this.lng, this.lat);
            for (var i = 0; i < this.shoplist.length; i++) {
                var s = this.shoplist[i];
                var shop = $.extend({}, s);
                shoplist.push(shop);
                var pointB = new BMap.Point(shop.longitude, shop.latitude);
                var distance = this.map.getDistance(mypoint, pointB).toFixed(0);
                shop.distance = distance == "NaN" ? 99999999999 :distance;
            }
            var shoplistorgin = shoplist;
            var shoplisttemp = [];
            if(mypoint.lng=="121.47489949" && mypoint.lat=="31.24916171"){
                for (var j = 0; j < shoplistorgin.length; j++) {
                    var sh = shoplistorgin[j];
                    var shopInfo = $.extend({}, sh)
                    shoplisttemp.push(shopInfo);
                    shopInfo.distance = "未知";
                    shopInfo.photo = getBoPic(shopInfo.photo);
                }
                return shoplisttemp;
            }else{
                for (var i = 0;i<shoplistorgin.length;i++) {
                    for (var j = i; j < shoplistorgin.length; j++) {
                        if (parseInt(shoplistorgin[i].distance) > parseInt(shoplistorgin[j].distance)) {
                            var temp = shoplistorgin[i];
                            shoplistorgin[i] = shoplistorgin[j];
                            shoplistorgin[j] = temp;
                        }
                    }
                    var sh = shoplistorgin[i];
                    var shopInfo = $.extend({}, sh);
                    shoplisttemp.push(shopInfo);
                    var pointA = new BMap.Point(shopInfo.longitude, shopInfo.latitude);
                    var distance = this.map.getDistance(mypoint, pointA).toFixed(0);
                    shopInfo.distance = distance == "NaN" ? "未知" : distance;
                    if(parseInt(shopInfo.distance) > 1000){
                        shopInfo.distance = (Math.round(parseInt(shopInfo.distance)/100)/10).toFixed(2) + "km";
                    }else if(shopInfo.distance != "未知"){
                        shopInfo.distance = shopInfo.distance +"m";
                    }
                    shopInfo.photo = getBoPic(shopInfo.photo);
                }
                return shoplisttemp;
            }
        },
    },
    methods: {
        reloadAppraise: function (min, max) {
            this.isLoad = false;
            this.isOver = false;
            this.currentPage = 0;
            this.minLevel = min;
            this.maxLevel = max;
            this.appraiseList = [];
            this.loadNextPage();
        },
        loadNextPage: function () {
            var that = this;
            if (!that.isLoad && !that.isOver) {
                that.isLoad = true;
                var option = {
                    currentPage: that.currentPage,
                    minLevel: that.minLevel,
                    maxLevel: that.maxLevel,
                    showCount: that.showCount
                };
                getAppraiseList(function (appraiseList) {
                    for (var i in appraiseList) {
                        that.appraiseList.push(appraiseList[i]);
                    }
                    if (appraiseList.length < that.showCount) {
                        that.isOver = true;
                    }
                    that.isLoad = false;
                }, option);
                that.currentPage = that.currentPage + that.showCount;
            }
        },
        addBlueMarker: function (lng, lat) {
            if (this.map) {
                var toPoint = new BMap.Point(lng, lat);
                var myIcon = new BMap.Icon("//api.map.baidu.com/img/markers.png", new BMap.Size(23, 25), {
                    offset: new BMap.Size(19, 25), // 指定定位位置
                    imageOffset: new BMap.Size(0, 0 - 10 * 25) // 设置图片偏移
                });
                var marker = new BMap.Marker(toPoint, {icon: myIcon});
                this.map.addOverlay(marker);
                return marker;
            }
        },
        addMyMarker: function (lng, lat) {
            if (this.myMarker) {
                this.myMarker.hide();
                this.myMarker = addBlueMarker(lng, lat);
                this.lng = lng;
                this.lat = lat;
            }
        },
        addMarker: function (lng, lat) {
            if (this.map) {
                var point = new BMap.Point(lng, lat);
                var marker = new BMap.Marker(point);
                this.map.addOverlay(marker);
                return marker;
            }
        },
        switchShop: function (sid) {
            var that = this;
            Vue.nextTick(function () {
                var shoplist = $(that.$el).find(".weui_cells");
                var parentH = shoplist.parent().height();
                shoplist.siblings().each(function () {
                    parentH -= $(this).height();
                });
                shoplist.height(parentH);
                that.shopCartIsc = new IScroll(shoplist.get(0), {
                    click: iScrollClick(),
                });
            });

            console.log(sid);
            this.$dispatch("switch-shop", sid);
        }
    },
    ready: function () {
        var that = this;
        this.$watch("show", function () {
            getAppraiseCount(function (appraiseCount, countList) {
                that.appraiseCount = appraiseCount;
                that.countList = countList;
            });
            if (this.show) {
                var map = new BMap.Map("map-div");            // 创建Map实例
                var point = new BMap.Point(this.lng, this.lat); // 创建点坐标
                map.centerAndZoom(point, 16);	// 初始化地图,设置中心点坐标和地图级别
                map.enableScrollWheelZoom();	//启用滚轮放大缩小
                map.addControl(new BMap.NavigationControl());	//添加地图地图平移缩放控件
                this.map = map;
                var gc = new BMap.Geocoder();
                gc.getLocation(point, function (rs) {
                    var addComp = rs.addressComponents;
                    // console.log(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
                });
                if (!this.myMarker) {
                    wx.getLocation({
                        type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                        success: function (res) {
                            var lng = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                            var lat = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                            var ggPoint = new BMap.Point(lng, lat);
                            var convertor = new BMap.Convertor();
                            var translateCallback = function (data) {
                                if (data.status === 0) {
                                    var point = data.points[0];
                                    that.addMyMarker(point.lng, point.lat);
                                    map.panTo(new BMap.Point(point.lng, point.lat));
                                    that.lng = point.lng;
                                    that.lat = point.lat;
                                }
                            }
                            var pointArr = [];
                            pointArr.push(ggPoint);
                            convertor.translate(pointArr, 3, 5, translateCallback);
                        }
                    });
                }

                if (this.shoplist) {
                    for (var i = 0; i < this.shoplist.length; i++) {
                        var shop = this.shoplist[i];
                        this.addMarker(shop.longitude, shop.latitude);
                    }
                }
            } else {
                this.map = null;
            }
        });
    }
});

Vue.component("choice-shop", {
    props: ["show","mode"],
    template: '<div class="weui_dialog_alert" v-if="show">' +
    '<div class="weui_mask" style="background: rgba(12, 12, 12, 0.78);"></div>' +
    '<div class="weui_dialog_shop">' +
    '<div class="main-height">' +
    '<div class="remainLamp">' +
    '<img src="assets/img/background.png" class="backgroundImg" />' +
    '</div>' +
    '<div class="toEnter">' +
    '<img src="{{shop.photo}}" style="width:12vh;height:12vh;border-radius: 50%;" />' +
    '</div>' +
    '<div class="shopName">{{shop.name}}</div>' +
    '<div class="detailedInfor">' +
    '<img src="assets/img/location.png" class="smallImg" />' +
    '<span class="shop_addressInfo">{{shop.address}}</span>' +
//					'<span style="vertical-align: middle;margin-left: 8px;">{{distance}}</span>' +
    '</div>' +
    '<div class="detailedInfor">' +
    '<img src="assets/img/shoping.png" class="smallImg" style="height: 14px;"/>' +
    '<span style="vertical-align: middle;margin-left: 7px;">营业时间 : {{new Date(shop.openTime.time).format("hh:mm")}} - {{new Date(shop.closeTime.time).format("hh:mm")}}</span>' +
    '</div>' +
    '<div class="changeBtn">' +
    '<button class="weui-btn weui_mini_btn weui-btn_change" @click="switchShop(mode)">切换门店</button>' +
    '<button class="weui-btn weui_mini_btn weui-btn_into" @click="inToShop" style="margin-top: initial;">进入店铺</button>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>',
    data: function () {
        return {
            map:null,
            shop:shopInfo,
            distance:null
        }
    },
    created: function () {
        var that = this;
        this.$watch("show", function () {
            if(this.show){
                that.$dispatch("close-choice-shop");
                that.map = new BMap.Map();
                var pointA = new BMap.Point(longitude, latitude);
                var pointB = new BMap.Point(shopInfo.longitude, shopInfo.latitude);
                var distance = that.map.getDistance(pointA,pointB).toFixed(0);
                that.distance = (Math.round(parseInt(distance)/100)/10).toFixed(2) + "km";
            }
        })
    },
    methods: {
        inToShop:function(){
            this.show = false;
            this.$dispatch("show-new-package");
        },
        switchShop: function (switchMode) {
            var that = this;
            if (switchMode == 0) {
                that.show = false;
                that.$dispatch("show-shoplist-dialog");
            } else if (switchMode == 1) {
                that.show = false;
                window.location.href = getParam("baseUrl") + "/restowechat/src/shopList.html?qiehuan=qiehuan&loginpage="+pageType+"&baseUrl="+getParam("baseUrl");
//				window.location.href = "/wechatNew/src/shopList.html?qiehuan=qiehuan&loginpage="+pageType;
            }
        },

    }
})