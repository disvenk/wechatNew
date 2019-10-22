productState[2] = productState[3];
var tableNumber = null;
var overTime = 99999999;
Vue.component("order-mini-detailed", {
    mixins: [orderMiniMax],
    methods: {
        vailedPushOrder: function () {
            if (this.order.tableNumber == null) {
                this.showOrderDetailed();
                this.$dispatch("emptyMessage", "请扫描桌号二维码", 3000);
                throw new Error('没有桌号')
            }
        }
    },
    components: {
        'ver-code': {
            props: ["order"],
            template: '<span v-if="order.tableNumber && order.distributionModeId != 2">桌号:{{order.tableNumber}} </span>'
        }
    }
});

Vue.component("order-detailed-dialog", {
    mixins: [orderdetailMax],
    data: function () {
        return {
            pushOrderBtnName: "扫码下单",
            showScan:true
        }
    },
    components: {
        'code-components': {
            props: ["order"],
            template:
            '<p  class="ver-code"><span class="c-gray" style="font-size:16px;line-height: 26px;">交易码:</span> <span class="ver-code">{{order.verCode}}</span></p>'+
            '<div class="weui_cell weui_vcode table-number" v-if="order.distributionModeId != 2 || order.needScan == 1">' +
            '	<div class="weui_cell_hd"><label class="weui_label">桌号</label></div>  ' +
            '	<div class="weui_cell_bd weui_cell_primary">' +
            '		<input class="weui_input" type="number" id="tableNumber" placeholder="扫描桌号"  v-model="order.tableNumber" readonly="readonly" >' +
            '	</div>                                                                    ' +
            '	<div class="weui_cell_ft" >                                                ' +
            //'		<i class="iconcode icon-saoyisao"  v-if="order.productionStatus==0"></i>                                      '+
            '	</div>                                                                    ' +
            '</div>                                                                       ',
        }
    },
    methods: {
        jumpAliPayPageBoss: function(){
            if(this.order.payMode == 2 && this.order.orderState == 1 &&  "open" == getParam("openAliPayPage")){
                window.location.href = getParam("baseUrl")+"/restowechat/src/openAliPay.html?orderId="+this.order.id;
//              window.location.href = "/wechatNew/src/openAliPay.html?orderId="+this.order.id+"&loginpage="+pageType;
            }
        },
        pushOrderSuccess: function () {
            if(this.order.payMode == 2){
                // this.$dispatch("successMessage", "打开支付宝，扫描桌位二维码支付下单", overTime);
                //直接跳转到 提示使用浏览器 打开的页面
                this.jumpAliPayPageBoss();
            }else{
                if(this.order.distributionModeId != 2){
                    this.$dispatch("loadingMessage", "正在下单中……请不要更换座位", overTime);
                }
                console.log("下单成功");
            }
        },
        orderStateChange: function (orderState) {
            console.log("订单状态改变" + orderState);
        },
        orderProductionStatusChange: function (pstate) {
            var that = this;
            console.log("订单状态改变", pstate);
            if(that.order.isConsumptionRebate == 2){
                this.$dispatch("successMessage", "已参与店庆活动，稍后请关注账户余额", 5000);
            }else if (pstate == 2) {
                if(that.order.distributionModeId != 2){
                    this.$dispatch("successMessage", "下单成功，请勿离开", overTime);
                }
            } else if (pstate == 1) {
                if(that.order.distributionModeId != 2){
                    this.$dispatch("loadingMessage", "正在下单中……请不要更换座位", overTime);
                }
            } else if (pstate == 5) {
                this.$dispatch("remindMessage", "下单失败，请速与餐厅服务员联系", overTime);
            } else if (pstate == 0) {
                this.$dispatch("loadingMessage", "正在自动下单", overTime);
                this.pushOrder();
            }
        },
        pushOrderClick: function () {
            this.openScan();
        },

        openScan: function () {
            var that = this;
            scanTableNumber(function (data) {
                getShopInfo(function (shop) {
                    if(shop.isNewQrcode == 0){
                        var reg_allNumber = /^[\d]+$/;
                        var reg_tableNumber = /tableNumber=[\d]+/;
                        that.order.tableNumber = null;
                        that.order.shopId = null;
                        if (reg_allNumber.test(data)) {
                            that.order.tableNumber = data;
                            tableNumber = data;
                        } else if (reg_tableNumber.test(data)) {
                            var tbNumber = data.match(reg_tableNumber)[0].match(/[\d]+/)[0];
                            that.order.tableNumber = tbNumber;
                            tableNumber = tbNumber;
                        }
                        var reg_shopId = /shopId=[a-zA-Z0-9]+/;
                        if (reg_shopId.test(data)) {
                            that.order.shopId = data.match(reg_shopId)[0].split("=")[1];
                            if (that.order.shopId == null || that.order.tableNumber == null) {
                                that.$dispatch("remindMessage", "未识别改格式的数据:" + data, 2000);
                                return;
                            }
                            that.autoPushOrder();
                            console.log("返回扫描结果,解析二维码数据，搞定桌号");
                        }
                        var reg_vv = /vv=[-.-_A-Za-z0-9]+/;
                        if(reg_vv.test(data)){
                            getTable(data.match(reg_vv)[0].split("=")[1],function(res){
                                if(res != null || res != ""){
                                    if(res.shopDetailId != shop.id){
                                        that.$dispatch("remindMessage", "该二维码与门店信息不符！", 2000);
                                        return;
                                    }
                                    if(res.state == 0){
                                        that.$dispatch("remindMessage", "该二维码无效！", 2000);
                                        return;
                                    }
                                    that.order.shopId = res.shopDetailId;
                                    that.order.tableNumber = res.tableNumber;
                                }
                                if (that.order.shopId == null || that.order.tableNumber == null) {
                                    that.$dispatch("remindMessage", "未识别改格式的数据:" + data, 2000);
                                    return;
                                }
                                that.autoPushOrder();
                                console.log("返回扫描结果,解析二维码数据，搞定桌号");
                            });
                        }
                    }else{
                        var reg_vv = /vv=[-.-_A-Za-z0-9]+/;
                        that.order.tableNumber = null;
                        that.order.shopId = null;
                        if(reg_vv.test(data)){
                            getTable(data.match(reg_vv)[0].split("=")[1],function(res){
                                if(res != null || res != ""){
                                    if(res.shopDetailId != shop.id){
                                        that.$dispatch("remindMessage", "该二维码与门店信息不符！", 2000);
                                        return;
                                    }
                                    if(res.state == 0){
                                        that.$dispatch("remindMessage", "该二维码无效！", 2000);
                                        return;
                                    }
                                    that.order.shopId = res.shopDetailId;
                                    that.order.tableNumber = res.tableNumber;
                                }
                                if (that.order.shopId == null || that.order.tableNumber == null) {
                                    that.$dispatch("remindMessage", "未识别改格式的数据:" + data, 2000);
                                    return;
                                }
                                that.autoPushOrder();
                                console.log("返回扫描结果,解析二维码数据，搞定桌号");
                            });
                        }else{
                            that.$dispatch("remindMessage", "该门店二维码已启用加密服务，请核实您的二维码！", 2000);
                            return;
                        }
                    }
                });
            });
        },
        pushOrder: function () {
            var that = this;
            if (that.order.tableNumber == null && (that.order.distributionModeId != 3 || that.showScan)) {
                this.$dispatch("emptyMessage", "请扫描桌号二维码"+that.showScan, 3000);
                return;
            }
            if (that.order.shopId == null) {
                var o = that.order;
                if((o.tableNumber != "" && o.tableNumber != null) || (o.distributionModeId == 3 && !that.showScan) ){
                    setTableNumber(o.id, o.tableNumber, function (result) {
                        if (result.success) {
                            pushOrderRequest(o.id, function (re) {
                                if (re.success) {
                                    that.$dispatch("successMessage", "扫码完成");
                                    that.order.productionStatus = 1;
                                    that.pushOrderSuccess && that.pushOrderSuccess(that.order);
                                } else {
                                    that.$dispatch(re.message);
                                }
                            });
                        } else {
                            that.$dispatch(result.message);
                        }
                    });
                }
            } else {
                $.ajax({
                    url: baseUrl+"/wechat/order/new/checkShopId",
                    data: {shopId: that.order.shopId, orderId: that.order.id},
                    success: function (result) {
                        if (result.success) {
                            var o = that.order;
                            setTableNumber(o.id, o.tableNumber, function (result) {
                                if (result.success) {
                                    pushOrderRequest(o.id, function (re) {
                                        if (re.success) {
                                            that.order.productionStatus = 1;
                                            document.getElementById("tableNumber").value = tableNumber;
                                            that.pushOrderSuccess && that.pushOrderSuccess(that.order);
                                            //that.$set("order.tableNumber", o.tableNumber);
                                            that.order.tableNumber = null;

                                        } else {
                                            that.$dispatch(re.message);
                                        }
                                    });
                                } else {
                                    that.$dispatch(result.message);
                                }
                            });
                        } else {
                            that.order.tableNumber = null;
                            that.order.shopId = null;
                            that.$dispatch("emptyMessage", result.message, 81000);
                        }
                    }
                });
            }
        },
        autoPushOrder: function () {
            var that = this;
            if(this.show  && (this.order.payMode == 3 || this.order.payMode == 4 || this.order.payMode == 6) && this.order.orderState == 1){
                this.$dispatch("emptyMessage", "付款中，请勿离开当前座位", overTime);
                return;
            }
            if(this.show  && this.order.payMode == 2 && this.order.orderState == 1 && this.order.productionStatus >= 1){
                // 暂不提示，后续可能更改 2017年4月18日 10:49:07   ——lmx
                // this.$dispatch("emptyMessage", "请打开支付宝，扫描桌上二维码进行支付", overTime);
                this.jumpAliPayPageBoss();
                return;
            }
            if(this.show && this.order.productionStatus == 0 && this.order.orderState == 2 && this.order.distributionModeId == 3
                && this.order.payMode != 2 && !this.showScan){
                this.pushOrder();
                return;
            }
            if(this.show && this.order.productionStatus == 0 && this.order.orderState == 1 &&  (this.order.tableNumber != null && this.order.tableNumber != "")
                && this.order.payMode == 2){ //支付宝
                this.pushOrder();
                return;
            }

            if(this.order.payType == 0){
                if (this.show && this.order.productionStatus == 0 && this.order.orderState == 2 && (this.order.tableNumber != null && this.order.tableNumber != "")) {
                    this.$dispatch("loadingMessage", "正在自动下单", overTime);
                    this.pushOrder();
                }else if(this.order.isConsumptionRebate == 2){
                    this.$dispatch("successMessage", "已参与店庆活动，稍后请关注账户余额", 5000);
                }else if (this.show && this.order.productionStatus == 1 && this.order.orderState == 2 && this.order.tableNumber != null && this.order.distributionModeId != 2) {
                    this.$dispatch("loadingMessage", "正在下单中……请不要更换座位", overTime);
                } else if (this.show && this.order.productionStatus == 2 && this.order.orderState == 10 && this.order.tableNumber != null
                    && this.order.allowContinueOrder && this.order.distributionModeId != 2) {
                    this.$dispatch("successMessage", "下单成功，请勿离开", 5000);
                } else if (this.show && this.order.productionStatus == 2 && this.order.orderState == 2 && this.order.tableNumber != null && this.order.distributionModeId != 2) {
                    this.$dispatch("successMessage", "下单成功，请勿离开", 5000);
                } else if (this.show && this.order.productionStatus == 5 && this.order.orderState == 2 && this.order.tableNumber != null) {
                    this.$dispatch("remindMessage", "下单成功，请勿离开", 5000);
                }
            }else if(this.order.payType == 1){
                if(this.order.isConsumptionRebate == 2){
                    this.$dispatch("successMessage", "已参与店庆活动，稍后请关注账户余额", 5000);
                }if (this.show && this.order.productionStatus == 0 && this.order.orderState == 1 && this.order.tableNumber != null && this.order.distributionModeId != 2) {
                    this.$dispatch("emptyMessage", "正在下单中……请不要更换座位", overTime);
                } else if (this.show && this.order.productionStatus == 2 && this.order.orderState == 1 && this.order.tableNumber != null
                    && this.order.allowContinueOrder && this.order.distributionModeId != 2) {
                    this.$dispatch("successMessage", "下单成功，请勿离开", 5000);
                }else if (this.show && this.order.productionStatus == 5 && this.order.orderState == 1 && this.order.tableNumber != null) {
                    this.$dispatch("remindMessage", "下单失败，请速与餐厅服务员联系", 5000);
                } else if (this.show && this.order.productionStatus == 2 && this.order.orderState == 10 && this.order.tableNumber != null
                    && this.order.allowContinueOrder) {
                    this.$dispatch("successMessage", "付款成功！", 5000);
                } else if (this.show && this.order.productionStatus == 2 && this.order.orderState == 2 && this.order.tableNumber != null){
                    this.$dispatch("successMessage", "付款成功", 5000);
                }
            }
        }
    },

    created: function () {
        var that = this;

        that.$watch("show", function () {
            if(this.show){
                that.autoPushOrder();
                getShopSetting(function(result){
                    if(result.continueOrderScan == 1){
                        that.showScan = true;
                    }else{
                        that.showScan = false;
                    }
                });
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
