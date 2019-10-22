var tangshiBaseMix = {
    template: $("#tangshi-temp").html(),
    mixins: [subpageMix, noticeMix],
    data: function () {
        return {
            familyList: [],
            checkRecommend:false,
            articleMap: new HashMap(), /*所有菜品的Map*/
            customerArticleCount: new HashMap(), /*获取用户菜品数量的Map*/
            checkRepartMap: new HashMap(), /*验证菜品是否重复*/
            articlePriceMap: new HashMap(),
            articleOldMap: new HashMap(),
            articleRecommendMap: new HashMap(),
            articleMealsMap: new HashMap(),
            unitMap: new HashMap(),
            unitArticleMap: new HashMap(),
            weightPackageMap: new HashMap(),
            unitPriceShopCart: {},
            currentFamily: {}, /*选中的菜品分类*/
            currentArticle: null, /*当前选择的菜品*/
            recommendList: {items: [], count: null}, /*推荐餐品列表*/
            unitList: {currentItem: null, item: null}, /*新规格列表*/
            allAttr: {},
            unitArr: [],
            beforeId: null,
            currentAttrs: [],
            unitArticleList: [],
            remmcondArticleList: [],
            weightPackageArticleList: [],
            currentUnits: null,
            currentUnitPrice: null,
            isShowShopcart: false,
            isCreateOrder: false,		//订单详情界面显示状态
            allCoupon: [],				//优惠券列表
            showContinue: false,
            showBindPhone: false,
            couponId: "",
            checkAccount: 1,
            currentCount: 0,
            totalMoney: 0,
            chargeList: [],				//充值列表
            servicePrice: 0,			//服务费(堂食)
            mealFeePrice: 0,			//餐盒费(外带)
            mealAllNumber: 0,
            remindDialog: {show: false, articles: []},
            choiceModeDialog: {show: false, mode: null},
            allSetting: {},
            shopInfo: {},				//店铺信息
            customerInfo: customerInfo,	//用户信息
            waitRedMoney: false,
            useWaitMoney: false,
            waitMoney: 0,
            parentId: null,
            firstPayType: 0,
            tableNumber: null,
            shopId: null,
            waitId: null,
            selectRecommendArticle: [],//推荐餐品包选中的餐品
            selectCurrentArticle: {show: false, name: '', count: null, price: null},//新规格包选中的餐品
            selectWeightArticle: {show: false, name: '', count: null, price: null},//重量包选中的餐品
            startMoney: 0,
            articleDesc: null,
            sleepCreateOrder: false,//点击买单后，1秒内禁止再次点击
            distributionModeId: 1,	//就餐模式
            editModel: false,		//是否从购物车点击编辑进入
            payOrderClick: false,
            newOrder: true, 		//是否是一个新的订单,
            oldOrderId: null, 		//老订单的id（点击买单后取消支付生成）
            openBossOrder: false,  	//大boss模式是否通过推送进入买单页面
            orderBoss: {},       	//大boss订单
            orderBossItem: [],		//大boss订单菜品项
            orderBossItemAll: [],
            orderBossPrice: null,
            orderBossCanhePrice: null,
            createOrderBtn: false,
            showDistributionModeId: {show: false, mode: null},
            orderRemarks: {show: false},					//订单备注显示
            orderRemarksText: "",							//订单备注信息文本
            remarks: false,									//订单备注
            payBossOrderBtn: false,
            payStates: false,								//支付中
            canUseCouponHoufu: false,
            couponListHoufu: [],
            addressList: [],									//用户的地址列表
            choiceAddressList: {show: false, customerid: null},	//用户选中地址界面
            customerAddress: {show: false, customerid: null},	//用户添加地址的界面
            customerId: null,		//用户的ID
            myAddress: null,			//外卖地址
            recommendTypeList: [],	//新品推荐列表
            currentRecommend: {},	//选中的新品推荐
            choiceList: false,		//区别新品推荐还是菜品类别
            articlePhotoDefault: shopInfo.articlePhoto,		//默认选中的图片显示模式
            getBaiduLocation: {show: false},
            myDistance: null,			//外卖默认地址距离
            map: null,
            attentionPage: {show: false},	//扫码关注
            groupShow: false,			//多人点餐群组
            groupBox: true,
            groupListInfo: [],
            swiperIndex: 0,
//          joinRemain:false,			//成员加入及加菜提示
            groupShopCartShow: false,	//多人点餐购物车
            shopCartBox: true,
            nowRepeatArticle: {},		//重复的菜品
            repeatDialog: {show: false, count: null, name: null, price: null},	//多人点餐重复菜品提示
            customerGroupList: null,		//多人点餐购物车成员
            groupArticleCount: null,		//多人点餐购物车菜品总数
            groupShopCart: [],			//多人点餐购物车菜品
            groupScanPage: {show: false},			//多人点餐进入未扫码点好了提示扫码
            groupCreateOrder: false,
            numberKeyboard: {show: false, count: null},		//就餐人数九宫格
            customerCountNow: null,		//就餐人数
            soupList: [],					//锅底菜品
            memberActivityCustomerType: memberActivityCustomerType,
            memberActivityCustomer: memberActivityCustomer,
            customerDiscount:null,
            pageType:pageType,
//          weightPackage:{
//          	name:'',
//          	currentItem:[],
//          	details:[]
//          }
        }
    },
    computed: {
        articleList: function () {
            var artList = [];
            for (var i = 0; i < this.familyList.length; i++) {
                for (var j = 0; j < this.familyList[i].articles.length; j++) {
                    var art = this.familyList[i].articles[j];
                    artList.push(art);
                    this.articleMap.put(art.id, art);
                }
            }
            return artList;
        },
        reArticleList: function () {
            var artList = [];
            for (var i = 0; i < this.recommendTypeList.length; i++) {
                for (var j = 0; j < this.recommendTypeList[i].articles.length; j++) {
                    var art = this.recommendTypeList[i].articles[j];
                    artList.push(art);
//                  this.articleRecommendMap.put(art.id, art);
                }
            }
            return artList;
        },
        useAccount: function () {
            if (this.checkAccount) {
                return customerInfo.account;
            } else {
                return 0;
            }
        },
        unitPriceList: function () {
            var upList = [];
            for (var j = 0; j < this.articleList.length; j++) {
                var ups = this.articleList[j].articlePrices;
                for (var i = 0; i < ups.length; i++) {
                    var up = ups[i];
                    upList.push(up);
                    this.articlePriceMap.put(up.id, up);
                }
            }
            return upList;
        },

        /*购物车的总数价格及套餐模式*/
        shopCart: function () {
            var shop = this.shop;
            var cart = {
                items: [],
                totalNumber: 0,
                totalPrice: 0,
                originPrice: 0,
                canheNumber: 0
            };
            var fam = this.familyList;

            for (var j = 0; j < this.reArticleList.length; j++) {
                var art = this.reArticleList[j];
                if (art.number > 0 && art.articlePrices.length == 0 && art.recommendList.length > 0) {
                    var item = {};
                    item.name = art.name;
                    item.data = art;
                    item.id = art.id;
                    item.type = 6;
                    item.current_working_stock = art.currentWorkingStock;
                    cart.totalNumber += art.number;
                    cart.totalPrice += art.number * parseFloat(art.realPrice);
                    cart.originPrice += art.number * parseFloat(art.originalAmount);
                    for (var i = 0; i < art.recommendList.length; i++) {
                        cart.totalPrice += art.recommendList[i].count * parseFloat(art.recommendList[i].price);
                        cart.originPrice += art.recommendList[i].count * parseFloat(art.recommendList[i].price);
                    }
                    cart.canheNumber += art.number * art.mealFeeNumber;
                    cart.items.push(item);
                }
            }
            /*纯单品*/
            for (var j = 0; j < this.articleList.length; j++) {
                var art = this.articleList[j];
                if (art.number > 0 && art.articlePrices.length == 0 && art.recommendList.length == 0 && art.recommendId == null) {
                    var item = {};
                    item.name = art.name;
                    item.data = art;
                    item.id = art.id;
                    item.type = 1;
                    var customerList = art.customerList;

                    item.current_working_stock = art.currentWorkingStock;
                    cart.totalNumber += art.number;
                    cart.totalPrice += art.number * parseFloat(art.realPrice);
                    cart.originPrice += art.number * parseFloat(art.originalAmount);
                    cart.canheNumber += art.number * art.mealFeeNumber;
                    cart.items.push(item);
                }
            }
            /*单品加推荐餐包*/
            for (var j = 0; j < this.remmcondArticleList.length; j++) {
                var art = this.remmcondArticleList[j];
                if (art.number > 0 && art.articlePrices.length == 0) {
                    var item = {};
                    item.name = art.name;
                    item.data = art;
                    item.id = art.id;
                    item.type = 6;
                    //item.shopCartId = art.shopCartId;
                    item.current_working_stock = art.currentWorkingStock;
                    cart.totalNumber += art.number;
                    cart.totalPrice += art.number * parseFloat(art.realPrice);
                    cart.originPrice += art.number * parseFloat(art.originalAmount);
                    for (var i = 0; i < art.recommendList.length; i++) {
                        cart.totalPrice += art.recommendList[i].count * parseFloat(art.recommendList[i].price);
                        cart.originPrice += art.recommendList[i].count * parseFloat(art.recommendList[i].price);
                    }
                    cart.canheNumber += art.number * art.mealFeeNumber;
                    cart.items.push(item);
                }
            }
            for (var i = 0; i < this.soupList.length; i++) {
                cart.totalPrice += this.soupList[i].unitPrice * this.soupList[i].count;
            }

            for (var j = 0; j < this.unitPriceList.length; j++) {
                var up = this.unitPriceList[j];
                if (up.number > 0) {
                    var item = {};
                    item.name = up.article.name + up.name;
                    item.data = up;
                    item.id = up.id;
                    item.type = 2;
                    item.current_working_stock = up.currentWorkingStock;
                    cart.totalNumber += up.number;
                    cart.totalPrice += up.number * parseFloat(up.realPrice);
                    cart.originPrice += up.number * parseFloat(up.originalAmount);
                    for (var i = 0; i < up.recommendList.length; i++) {
                        cart.totalPrice += up.recommendList[i].count * parseFloat(up.recommendList[i].price);
                        cart.originPrice += up.recommendList[i].count * parseFloat(up.recommendList[i].price);
                    }
                    var aid = up.id;
                    if (aid.indexOf("@") > -1) {
                        aid = aid.substr(0, aid.indexOf('@'));
                        var art = this.findArticleById(aid);
                        up.mealFeeNumber = art.mealFeeNumber;
                    }
                    cart.canheNumber += up.number * up.mealFeeNumber;
                    cart.items.push(item);
                }
            }
            var mealArticles = this.articleMealsMap.values || [];
            for (var j = 0; j < mealArticles.length; j++) {
                var art = mealArticles[j];
                if (art.number > 0) {
                    var item = {};
                    item.name = art.name;
                    item.data = art;
                    item.id = art.id;
                    item.type = 3;
                    item.current_working_stock = art.currentWorkingStock;
                    cart.totalNumber += art.number;
                    cart.totalPrice += art.number * parseFloat(art.realPrice);
                    cart.originPrice += art.number * parseFloat(art.originalAmount);
                    cart.canheNumber += art.number * art.mealFeeNumber;
                    cart.items.push(item);
                    for (var m = 0; m < art.mealAttrs.length; m++) {
                        for (var c = 0; c < art.mealAttrs[m].currentItem.length; c++) {
                            cart.originPrice += art.mealAttrs[m].currentItem[c].priceDif;
                        }
                    }
                }
            }
            for (var i = 0; i < this.unitArticleList.length; i++) {
                var art = this.unitArticleList[i];
                if (art.count > 0) { //无规格单品
                    //console.log(JSON.stringify(art));
                    var item = {};
                    item.name = art.unitName == null ? art.name : art.unitName;
                    item.id = art.articleId;
                    item.data = art;
                    item.type = 5;
                    cart.totalNumber += art.count;
                    cart.totalPrice += art.count * parseFloat(art.realPrice);
                    cart.originPrice += art.count * parseFloat(art.orgPrice);
                    for (var j = 0; j < art.recommendList.length; j++) {
                        cart.totalPrice += art.recommendList[j].count * parseFloat(art.recommendList[j].price);
                        cart.originPrice += art.recommendList[j].count * parseFloat(art.recommendList[j].price);
                    }
                    for (var u = 0; u < art.unitList.length; u++) {
                        for (var c = 0; c < art.unitList[u].currentItem.length; c++) {
                            cart.originPrice += art.unitList[u].currentItem[c].price;
                        }
                    }
                    var article = this.findArticleById(art.articleId);
                    cart.canheNumber += art.count * article.mealFeeNumber;
                    cart.items.push(item);
                }
            }
            for (var i = 0; i < this.weightPackageArticleList.length; i++) {
                var art = this.weightPackageArticleList[i];
                if (art.count > 0) { //无规格单品
                    var item = {};
                    item.name = art.unitName == null ? art.name : art.unitName;
                    item.id = art.articleId;
                    item.data = art;
                    item.type = 8;
                    cart.totalNumber += art.count;
                    cart.totalPrice += parseFloat(art.realPrice);
                    cart.originPrice += parseFloat(art.orgPrice);
                    for (var j = 0; j < art.recommendList.length; j++) {
                        cart.totalPrice += art.recommendList[j].count * parseFloat(art.recommendList[j].price);
                        cart.originPrice += art.recommendList[j].count * parseFloat(art.recommendList[j].price);
                    }
                    var article = this.findArticleById(art.articleId);
                    cart.canheNumber += art.count * article.mealFeeNumber;
                    cart.items.push(item);
                }
            }
            if (cart.items.length == 0) {
                this.isCreateOrder = false;
            }
            if (this.servicePrice) {
                cart.totalPrice += this.servicePrice;
                cart.originPrice += this.servicePrice;
            }
            if (this.distributionModeId != 1 && shop.isMealFee && allSetting.isMealFee) {
                this.mealAllNumber = cart.canheNumber;
                this.mealFeePrice = cart.canheNumber * shop.mealFeePrice;
                cart.totalPrice += this.mealFeePrice;
                cart.originPrice += this.mealFeePrice;
            }
            if (this.orderBoss != null && this.orderBoss.orderState == 1) {
                if (this.orderBoss.amountWithChildren > 0) {
                    this.orderBossPrice = cart.totalPrice + this.orderBoss.amountWithChildren;
                } else {
                    this.orderBossPrice = cart.totalPrice + this.orderBoss.orderMoney;
                }
            }
            /*循环所有的菜品分类,当分类的ID等于购物车菜品的ID时,角标加1*/
            for (var f = 0; f < fam.length; f++) {
                var fcount = 0;
                for (var m = 0; m < cart.items.length; m++) {
                    if (fam[f].id == cart.items[m].data.articleFamilyId) {
                    	if(cart.items[m].type == 5 || cart.items[m].type == 8){
                    		fcount += cart.items[m].data.count;
                    	}else{
                    		fcount += cart.items[m].data.number;
                    	}
                    }
                }
                fam[f].currentCount = fcount;
            }
            return cart;
        },
        useCouponAmount: function () {
            var totalPrice = null;
            if (this.orderBossPrice == null) {
                totalPrice = this.shopCart.totalPrice;
                if(this.memberActivityCustomerType){
                    totalPrice = totalPrice * this.memberActivityCustomer.discount;
                }
            } else {
                totalPrice = this.orderBossPrice;
            }
            if (totalPrice > 0 && this.parentId == null) {
                totalPrice -= this.useCoupon;
            } else if (totalPrice > 0 && this.parentId != null) {
                return totalPrice;
            } else {
                totalPrice = 0;
            }
            return totalPrice;
        },
        finalAmount: function () {
            var totalPrice = this.useCouponAmount;
            if (totalPrice > 0) {
                totalPrice -= this.useAccount;
            }
            if (this.useWaitMoney) {
                totalPrice -= this.waitMoney;
            }

            return totalPrice > 0 ? totalPrice : 0;
        },
        memberDiscountAmount: function(){
            if(!this.memberActivityCustomerType){
                return 0;
            }else{
                var totalPrice = null;
                if (this.orderBossPrice == null) {
                    totalPrice = this.shopCart.totalPrice;
                    totalPrice = totalPrice - (totalPrice * this.memberActivityCustomer.discount);
                } else {
                    totalPrice = this.orderBossPrice;
                }
                return totalPrice;
            }
        },
        useCouponAmountBoss: function () {
            var totalPrice = null;
            if (this.orderBoss != null) {
                if (this.orderBoss.amountWithChildren > 0) {
                    totalPrice = this.orderBoss.amountWithChildren;
                } else {
                    totalPrice = this.orderBoss.paymentAmount;
                }
            } else {
                totalPrice = 0;
            }
            if (this.orderBoss.ifUseCoupon) {
                return totalPrice;
            }
            if (totalPrice > 0) {
                totalPrice -= this.useCoupon;
                totalPrice -= this.useCouponHoufu;
            } else {
                totalPrice = 0;
            }
            return totalPrice;
        },
        finalAmountBoss: function () {
            var totalPrice = this.useCouponAmountBoss;
            if (totalPrice > 0) {
                totalPrice -= this.useAccount;
            }
            if (this.useWaitMoney) {
                totalPrice -= this.waitMoney;
            }
            return totalPrice > 0 ? totalPrice : 0;
        },

        canUseCoupon: function () {
            var canUse = [];
            var canUseCouponList = this.allCoupon.sort(this.keysert("value", "desc"));
            for (var i = 0; i < canUseCouponList.length; i++) {
                var c = canUseCouponList[i];
                if (c.minAmount <= this.shopCart.totalPrice) {
                    if (!c.useWithAccount && this.checkAccount) {
                        continue;
                    }
                    canUse.push(c);
                }
            }
            return canUse;
        },
        useCoupon: function () {
            for (var i = 0; i < this.canUseCoupon.length; i++) {
                var c = this.canUseCoupon[i];
                if (c.id == this.couponId) {
                    return c.value;
                }
            }
            return 0;
        },
        useCouponHoufu: function () {
            for (var i = 0; i < this.couponListHoufu.length; i++) {
                var c = this.couponListHoufu[i];
                if (c.id == this.couponId) {
                    return c.value;
                }
            }
            return 0;
        },
        /*未点提示*/
        hasRemind: function () {
            console.log("未点提示");
            var arts = [];
            for (var i = 0; i < this.articleList.length; i++) {
                var art = this.articleList[i];
                if (art.number == 0 && art.isRemind) {
                    if (art.articlePrices.length == 0) {
                        arts.push(art);
                    } else {
                        var needRemind = true;
                        for (var j = 0; j < art.articlePrices.length; j++) {
                            var price = art.articlePrices[j];
                            if (price.number > 0) {
                                needRemind = false;
                                console.log("已有餐品点过，不需要提示");
                                break;
                            }
                        }
                        if (needRemind) {
                            console.log("没有餐品点过，需要提示");
                            for (var j = 0; j < art.articlePrices.length; j++) {
                                var price = art.articlePrices[j];
                                arts.push(price);
                            }
                        }
                    }
                }
            }
            return arts.length && arts;
        },
        servicePrice: function () {
            var price = 0;
            if (this.allSetting.isUseServicePrice == 1 && this.shopInfo.isUseServicePrice == 1 && !this.showContinue && this.distributionModeId == 1) {
                price = this.customerCountNow * this.shopInfo.servicePrice;
                return price;
            }
        }
    },
    watch: {
//      'joinRemain':function(newVal,oldVal){
//      	var that = this;
//      	if(newVal){
//      		setTimeout(function(){
//      			that.joinRemain = false;
//      		},2000)
//      	}
//      },
        'groupShow': function (newVal, oldVal) {
            var that = this;
            if (newVal && shopInfo.openManyCustomerOrder == 1) {
                showGroupList(customerInfo.id, that.tableNumber, shopInfo.id, function (result) {
                    if (result.success) {
                        that.groupListInfo = result.data;
                        Vue.nextTick(function () {
                            var mySwiper = new Swiper('.swiper-group', {
                                pagination: '.swiper-pagination',
                                direction: 'vertical',
                                onSlideChangeEnd: function (swiper) {
                                    that.swiperIndex = mySwiper.activeIndex;
                                }
                            });
                        });
                    }
                })
            }
        }
    },
    methods: {
        showCustomerCount: function () {
            this.numberKeyboard.show = true;
        },
        getArticleName: function (article) {
            if (article.type == 2) {
                return article.article.name + article.name;
            } else if (article.type == 5) {
                return article.unitName == null ? article.name : article.unitName;
            } else {
                return article.name;
            }
        },
        getArticlePrice: function (data) {
            if (data.recommendList.length > 0) {
                var t = data.realPrice;
                var recommend = 0;
                for (var i = 0; i < data.recommendList.length; i++) {
                    recommend += data.recommendList[i].price * data.recommendList[i].count;
                }
                return parseFloat(t + recommend).toFixed(2);
            } else {
                return parseFloat(data.realPrice).toFixed(2);
            }
        },
        getArticleCountByCustomer: function (customerId, data) {
            if (!data.uuid) {
                return this.customerArticleCount.get(customerId + data.id);
            } else {
                return this.customerArticleCount.get(customerId + data.articleId);
            }
        },
        checkGroupLeader: function (customerGroupList, f) {
            var result = false;
            for (var i = 0; i < customerGroupList.length; i++) {
                if (customerGroupList[i].isLeader == 1 && f.id == customerGroupList[i].customerId) {
                    result = true;
                }
            }
            return result;
        },
        checkUserArticle: function (customerId, data) {
            var result = false;
            for (var i = 0; i < data.customerList.length; i++) {
                if (data.customerList[i] == customerId) {
                    result = true;
                }
            }
            return result;
        },
        removeCustomer: function (f) {
            var that = this;
            getOutOffGroup(f.customerId, shopInfo.id, this.tableNumber, function (result) {
                if (result.success) {
                    that.$dispatch("successMessage", "移除用户成功", 2000);
                    that.loadShopCartGroup(1, groupId, function (result) {
                    });
                }
            })
        },
        openOtherGroup: function () {
            var that = this;
            createNewGroup(customerInfo.id, shopInfo.id, this.tableNumber, function (result) {
                if (result.success) {
                    that.groupBox = false;
                    setTimeout(function () {
                        that.groupShow = false;
                        that.groupBox = true;
                    }, 500);
                    groupId = result.groupId;
                }
            })
        },
        joinThem: function () {
            var that = this;
            if (!this.groupListInfo.length) {
                that.$dispatch("remindMessage", "当前还未创建组,不能加入", 3000);
                return;
            }
            groupId = this.groupListInfo[this.swiperIndex].groupId;
            addNowGroup(shopInfo.id, this.tableNumber, customerInfo.id, groupId, function (result) {
                if (result.success) {
                    that.groupBox = false;
                    setTimeout(function () {
                        that.groupShow = false;
                        that.groupBox = true;
                    }, 500);
                    that.loadShopCartGroup();
                }
            })
        },
        changeTemplate: function () {
            var that = this;
            if (shopInfo.articlePhoto != 2) {
                shopInfo.articlePhoto = 2;
            } else {
                shopInfo.articlePhoto = this.articlePhotoDefault;
            }
            Vue.nextTick(function () {
                setTimeout(function () {
                    that.refreshArticleList();
                }, 500);
            });
        },
        deliveryAddress: function () {
            var that = this;
            this.choiceAddressList.customerid = that.customerId;
            if (this.addressList.length == 0) {
                this.customerAddress.show = true;
            } else {
                this.choiceAddressList.show = true;
            }
        },
        choiceDistributionModeId: function () {
            this.showDistributionModeId.show = true;
        },
        showDishRemarks: function () {
            this.orderRemarks.show = true;
        },
        keysert: function (key, type) {
            return function (a, b) {
                var value1 = a[key];
                var value2 = b[key];
                if (type == "asc") {
                    return value1 - value2;
                } else {
                    return value2 - value1;
                }
            }
        },
        switchShop: function (switchMode) {
            var shopId = getParam("shopId");
            if (switchMode == 0) {
                if (shopId == null && this.tableNumber == null) {
                    this.$dispatch("show-shoplist-dialog");
                }
            } else if (switchMode == 1) {
                if (shopId == null && this.tableNumber == null) {
                    window.location.href = getParam("baseUrl") + "/restowechat/src/shopList.html?" + getUrlParam(window.location.href) + "&qiehuan=qiehuan&loginpage=" + pageType;
//					window.location.href = "/wechatNew/src/shopList.html?qiehuan=qiehuan&loginpage="+pageType;
                }
            }
        },
        moveToAttr: function (attr) {
            var aid = attr.id;
            var dom = $("[data-attr-id='" + aid + "']").get(0);
            if (this.articleIsc) {
                this.articleIsc.scrollToElement(dom);
            }
        },
        findUnitDetailById: function (id) {
            return this.unitMap.get(id);
        },
        findWeightPackById: function (id) {
            return this.weightPackageMap.get(id);
        },
        findUnitByArticleId: function (articleId) {
            return this.unitArticleMap.get(articleId);
        },
        findArticleById: function (id) {
            if (id.indexOf("@") > -1) {
                return this.articlePriceMap.get(id);
            } else {
                return this.articleMap.get(id);
            }
        },
        findRecommendById: function (id) {
            if (id.indexOf("@") > -1) {
                return this.articleOldMap.get(id);
            } else {
                return this.articleRecommendMap.get(id);
            }
        },
        findMealItemById: function (id, attrId, itemId) {
            for (var i = 0; i < this.familyList.length; i++) {
                for (var j = 0; j < this.familyList[i].articles.length; j++) {
                    var art = this.familyList[i].articles[j];
                    if (id == art.id) {
                        for (var l = 0; l < art.mealAttrs.length; l++) { //找到所有的套餐属性
                            if (art.mealAttrs[l].id == attrId) { //找到对应属性
                                if(art.mealAttrs[l].mealItems != null){
                                    for (var k = 0; k < art.mealAttrs[l].mealItems.length; k++) {
                                        if (art.mealAttrs[l].mealItems[k].articleId == itemId) {
                                            art.mealAttrs[l].mealItems[k].click = true;
                                            return art.mealAttrs[l].mealItems[k];
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        findUnitById: function (unitId) {
            for (var i = 0; i < this.allAttr.length; i++) {
                var attr = this.allAttr[i];
                for (var n = 0; n < attr.articleUnits.length; n++) {
                    var unit = attr.articleUnits[n];
                    if (unit.id == unitId) {
                        return unit;
                    }
                }
            }
        },
        closeShopCart: function () {
            this.isShowShopcart = false;
            this.shopCartIsc = null;
        },
        closeRepeatDialog: function () {
            this.repeatDialog.show = false;
        },

        showShopCart: function () {
            var that = this;
//          if (this.waitRedMoney) {
//              return;
//          }
            if (groupId == null) {
                that.loadShopCartGroup();
                this.isShowShopcart = true;
                Vue.nextTick(function () {
                    var cartlist = $(that.$el).find(".shopcart-list");
                    var parentH = cartlist.parent().height();
                    cartlist.siblings().each(function () {
                        parentH -= $(this).height();
                    });
                    cartlist.height(parentH);
                    that.shopCartIsc = new IScroll(cartlist.get(0), {
                        click: iScrollClick(),
                        scrollbars: true,
                    });
                });
            } else {
                that.loadShopCartGroup();
                setTimeout(function () {
                    that.resetGroupHeight();
                }, 500);
                Vue.nextTick(function () {
                    setTimeout(function () {
                        that.groupIsc = new IScroll(".groupScroll", {
                            click: iScrollClick()
                        });
                    }, 2000);
                });
                that.groupShopCartShow = true;
            }
        },
        clearShopCart: function () {
            var shopcart = this.shopCart;
            for (var i = 0; i < shopcart.items.length; i++) {
                var art = shopcart.items[i];
                if (art.number) {
                    art.number = 0;
                }
                if (art.data) {
                    art.data.number = 0;
                }

                for (var k = 0; k < this.unitArticleList.length; k++) {
                    if (this.unitArticleList[k].articleId == art.id) {
                        this.unitArticleList[k].count = 0;
                    }
                }
            }

            for (var j = 0; j < this.reArticleList.length; j++) {
                this.reArticleList[j].recommendList = [];
                if (this.reArticleList[j].count) {
                    this.reArticleList[j].count = 0;
                }
                if (this.reArticleList[j].number) {
                    this.reArticleList[j].number = 0;
                }
            }

            for (var j = 0; j < this.articleList.length; j++) {
                this.articleList[j].recommendList = [];
                if (this.articleList[j].count) {
                    this.articleList[j].count = 0;
                }
            }

            var keys = this.customerArticleCount.getKeys();
            for (var i = 0; i < keys.length; i++) {
                if (keys[i].toString().indexOf(customerInfo.id) != -1) {
                    this.customerArticleCount.put(keys[i].toString(), 0);
                }

            }
            clearShopcartApi();
        },
        showGroup: function () {
            var that = this;
            groupId = null;
            that.loadShopCartGroup(1, groupId, function () {
            });
            if(shopInfo.openManyCustomerOrder == 1){
                showGroupList(customerInfo.id, that.tableNumber, shopInfo.id, function (result) {
                    if (result.success) {
                        groupId = result.groupId;
                        if (!groupId) {
                            that.groupShow = true;
                        }
                    }
                })
            }
        },
        updateToServerCart: function (unitOrArt, t) {
            var id = unitOrArt.id;
            var uuid = null;
            var that = this;
            if(t == undefined){
                t = this.customerArticleCount.get(customerInfo.id + id);
                if(t == null){
                    t = unitOrArt.number;
                }
                console.log(t);
            }
            if (unitOrArt.articleType == 1 || unitOrArt.id.indexOf("@") > -1) {
                var shopType;
                if (unitOrArt.recommendList.length > 0 || unitOrArt.recommendId != null) {
                    shopType = 4
                    uuid = unitOrArt.uuid;
                } else {
                    shopType = 1;
                }
                updateShopCartDanpin(null, id, uuid, 1, t, groupId, shopType, function (result) {
                    if (!result.success) {
                        that.$dispatch("emptyMessage", result.message, 4000);
                        that.showGroup();
                    }else{
                        that.customerArticleCount.put(customerInfo.id + id, t);
                    }
                });

            } else if (unitOrArt.articleType == undefined) {
                updateShopCart(unitOrArt.shopCartId, 1, t, groupId, function (result) {
                    if (!result.success) {
                        that.$dispatch("emptyMessage", result.message, 4000);
                        that.showGroup();
                    }else{
                        that.customerArticleCount.put(customerInfo.id + id, t);
                    }
                });
            } else if (unitOrArt.articleType == 2) {
                delMealArticle(unitOrArt.shopCartId, function () {
                    //if (shopInfo.openManyCustomerOrder == 1) {
                    //    that.loadShopCartGroup(1, groupId, function () {
                    //    });
                    //}
                });
            } else if (unitOrArt.articleType == 8) {
                delMealArticle(unitOrArt.shopCartId, function () {

                });
            }
        },
        updateToServerCartTwo: function (unitOrArt) {
            var that = this;
            updateShopCartTwo(unitOrArt, groupId, function (result) {
                if (!result.success) {
                    that.$dispatch("emptyMessage", result.message, 4000);
                    that.showGroup();
                } else {
                    that.loadShopCartGroup(1, groupId, function () {
                    });
                }
            });
        },
        updateToServerCartThree: function (unitOrArt) {
            var that = this;
            if (unitOrArt.length > 0) {
                updateShopCartThree(unitOrArt[unitOrArt.length - 1], groupId, function (result) {
                    if (!result.success) {
                        that.$dispatch("emptyMessage", "请选择规格", 4000);
                        that.showGroup();
                    } else {
                        if (shopInfo.openManyCustomerOrder == 1) {
                            that.loadShopCartGroup(1, groupId, function () {
                            });
                        }
                    }
                });
            } else {
                updateShopCartThree(unitOrArt, groupId, function (result) {
                    if (!result.success) {
                        that.$dispatch("emptyMessage", result.message, 4000);
                        that.showGroup();
                    } else {
                        if (shopInfo.openManyCustomerOrder == 1) {
                            that.loadShopCartGroup(1, groupId, function () {
                            });
                        }
                    }
                });
            }
        },
        updateToServerCartFour: function (weightPackageArticle) {
            var that = this;
            updateShopCartFour(weightPackageArticle, groupId, function (result) {
                if (!result.success) {
                    that.$dispatch("emptyMessage", result.message, 4000);
                    that.showGroup();
                } else {
                    that.loadShopCartGroup(1, groupId, function () {
                    });
                }
            });
        },
        addToNewShopCart: function () {
            var that = this;
            var canhePrice = 0;
            this.nowRepeatArticle = this.currentArticle;
            this.nowRepeatArticle.recommendList = that.recommendList.items;
            var check = that.checkRepartMap.get(that.nowRepeatArticle.id) == null ? false : that.checkRepartMap.get(that.nowRepeatArticle.id) ? true : false;
            /*验证菜品是否重复*/
            if (shopInfo.openManyCustomerOrder == 1 && getParam("tableNumber") != null && !check) {
                that.checkRepeat();
                //if(that.checkRecommend){
                //    this.$dispatch("emptyMessage", "该组已经有人点过这个菜啦", 2000);
                //    return;
                //}
                if (that.repeatDialog.show) {
                    return;
                }
            }
            if (this.recommendList.items.length > 0 && this.selectRecommendArticle.length == 0 && this.recommendList.choiceType == 1 && this.currentCount == 0) {
                this.$dispatch("emptyMessage", "请选择推荐餐品", 2000);
                return;
            }
            if (this.currentCount > this.recommendList.count) {
                this.$dispatch("emptyMessage", "配餐最大购买数量为" + this.recommendList.count, 2000);
                return;
            }
            if (!this.editModel) {
                this.selectRecommendArticle = [];
            }

            for (var i = 0; i < this.unitArr.length; i++) { //遍历规格
                if (this.unitArr[i].choiceType == 0) { //单选
                    if (this.unitArr[i].currentItem.length == 0) {
                        this.$dispatch("emptyMessage", "请选择" + this.unitArr[i].name, 2000);
                        return;
                    }
                }
            }
            if (this.recommendCart) {
                for (var i = 0; i < this.recommendCart.length; i++) {
                    if (this.recommendCart[i].key == this.currentArticle.id) {
                        this.recommendCart[i].item = [];
                    }
                }
            }
            var list = this.recommendList;
            var artList = this.articleList;
            var value;

            if (this.unitArr.length > 0 || this.currentArticle.articlePrices.length > 0) {
                value = [];
            } else {
                value = this.currentArticle.recommendList;
            }
            if (!this.editModel) {
                for (var i = 0; i < list.items.length; i++) { //遍历推荐餐品列表
                    var obj = list.items[i];
                    var no = obj.count;
                    if (obj.count > 0) {//判断是有存在购买的推荐商品
                        var check = false;
                        for (var u = 0; u < value.length; u++) {
                            if (value[u].articleId == obj.articleId && value[u].count > 0) {
                                //value[u].count += obj.count;
                                check = true;
                            }
                        }
                        if (!check) {
                            value.push(obj);
                        }
                    }
                }
            } else if (this.editModel && this.currentArticle.unitList.length > 0) {
                for (var u = 0; u < this.currentArticle.recommendList.length; u++) {
                    if (this.currentArticle.recommendList[u].count > 0) {
                        value.push(this.currentArticle.recommendList[u]);
                    }
                }
            } else if (this.editModel && this.currentArticle.recommendList.length > 0) {
                value = this.selectRecommendArticle;
            }
            this.currentArticle.recommendList = value;

            var recommend = {
                key: this.currentArticle.id,
                item: value
            }
            this.recommendCart = [recommend];
            if (this.unitArr.length > 0) { //有规格单品
                var sum = this.currentArticle.fansPrice ? this.currentArticle.fansPrice : this.currentArticle.price;
                var orgPrice = this.currentArticle.fansPrice ? this.currentArticle.fansPrice : this.currentArticle.price;
                var orgName = this.currentArticle.name;
                var name = this.currentArticle.name;
                var currentList = [];

                for (var i = 0; i < this.unitArr.length; i++) {
                    for (var t = 0; t < this.unitArr[i].currentItem.length; t++) {
                        currentList.push(this.unitArr[i].currentItem[t]);
                        name = name + "(" + this.unitArr[i].currentItem[t].name + ")";
                        sum += this.unitArr[i].currentItem[t].price;
                    }
                }
                var contains = false;
                //for (var i = 0; i < this.unitArticleList.length; i++) {
                //    if (this.unitArticleList[i].id == this.currentArticle.uid) {
                //        this.unitArticleList[i].realPrice = sum;
                //        this.unitArticleList[i].name = name;
                //        this.unitArticleList[i].unitList = this.unitArr,
                //        contains = true;
                //        this.unitArticleList[i].count = this.selectCurrentArticle == null ? 1 : this.selectCurrentArticle.count;
                //    }
                //}
                var uuid = null;
                if (this.currentArticle.uuid != null) {
                    uuid = this.currentArticle.uuid;
                    for (var i = 0; i < this.unitArticleList.length; i++) {
                        if (this.unitArticleList[i].uuid == uuid) {
                            this.unitArticleList.splice(i, 1);
                        }
                    }
                } else {
                    uuid = this.uuid();
                }

                if (!contains) {
                    this.unitArticleList.push({
                        name: name,
                        id: uuid,
                        customerList: [customerInfo.id],
                        uuid: uuid,
                        articleFamilyId: this.currentArticle.articleFamilyId,
                        articleId: this.currentArticle.id,
                        realPrice: sum,
                        orgPrice: orgPrice,
                        orgName: orgName,
                        unitList: this.unitArr,
                        count: this.selectCurrentArticle == null ? 1 : this.selectCurrentArticle.count,
                        sum: sum,
                        recommendList: value,
                        recommendId: this.currentArticle.recommendId,
                        showBig: this.currentArticle.showBig,
                        photoSmall: this.currentArticle.photoSmall,
                        description: this.currentArticle.description
                    });
                }

                if (this.customerArticleCount.get(customerInfo.id + this.currentArticle.id)) {
                    this.customerArticleCount.put(customerInfo.id + this.currentArticle.id, this.customerArticleCount.get(customerInfo.id + this.currentArticle.id) + this.currentArticle.count);
                } else {
                    this.customerArticleCount.put(customerInfo.id + this.currentArticle.id, this.currentArticle.count);
                }
                this.updateToServerCartThree(this.unitArticleList);
            } else if(this.currentArticle.weightPackageId){
                console.log("----------添加重量包");
                var sum = this.currentArticle.cattyMoney * this.currentArticle.weightPackageList.currentItem[0].weight;
                var orgPrice = this.currentArticle.cattyMoney * this.currentArticle.weightPackageList.currentItem[0].weight;
                var orgName = this.currentArticle.name;
                var name = this.currentArticle.name + "(" + this.currentArticle.weightPackageList.currentItem[0].name + ")";

                var uuid = null;
                if (this.currentArticle.uuid != null) {
                    uuid = this.currentArticle.uuid;
                    for (var i = 0; i < this.weightPackageArticleList.length; i++) {
                        if (this.weightPackageArticleList[i].uuid == uuid) {
                            this.weightPackageArticleList.splice(i, 1);
                        }
                    }
                } else {
                    uuid = this.uuid();
                }
                var weightPackageArticle = {
                    name: name,
                    id: uuid,
                    customerList: [customerInfo.id],
                    uuid: uuid,
                    articleFamilyId: this.currentArticle.articleFamilyId,
                    articleId: this.currentArticle.id,
                    realPrice: sum,
                    orgPrice: orgPrice,
                    orgName: orgName,
                    weightPackageList: this.currentArticle.weightPackageList,
                    weightPackageId: this.currentArticle.weightPackageId,
                    weight: this.currentArticle.weightPackageList.currentItem[0].weight,
                    count: 1,
                    sum: sum,
                    recommendList: this.currentArticle.recommendList,
                    recommendId: this.currentArticle.recommendId,
                    showBig: this.currentArticle.showBig,
                    photoSmall: this.currentArticle.photoSmall,
                    description: this.currentArticle.description
                }
                this.weightPackageArticleList.push(weightPackageArticle);
                this.updateToServerCartFour(weightPackageArticle);
            } else if (this.currentArticle.articlePrices.length == 0 && !this.currentArticle.recommendId && this.currentArticle.openCatty == 0) { //无规格单品,并且没有推荐包和重量包
                if (this.currentArticle.count == 0) {
                    this.$dispatch("emptyMessage", "您还未选择餐品哦", 2000);
                    return;
                }
                this.currentArticle.number += this.currentArticle.count;
                if (this.customerArticleCount.get(customerInfo.id + this.currentArticle.id)) {
                    this.customerArticleCount.put(customerInfo.id + this.currentArticle.id, this.customerArticleCount.get(customerInfo.id + this.currentArticle.id) + this.currentArticle.count);
                } else {
                    this.customerArticleCount.put(customerInfo.id + this.currentArticle.id, this.currentArticle.count);
                }
                this.updateToServerCart(this.currentArticle);
            } else if (this.currentArticle.articlePrices.length > 0) { //老规格单品
                var flag = false;

                for (var i = 0; i < this.currentArticle.articlePrices.length; i++) {
                    if (this.currentArticle.articlePrices[i].count > 0) {
                        flag = true;
                        this.currentArticle.articlePrices[i].recommendList = value;
                        this.currentArticle.articlePrices[i].recommendId = this.currentArticle.recommendId;
                    }
                }
                if (!flag) {
                    this.$dispatch("emptyMessage", "您还未选择餐品哦", 2000);
                    return;
                }
                for (var i = 0; i < this.currentArticle.articlePrices.length; i++) { //遍历所有规格
                    var t = 0;
                    if (this.customerArticleCount.get(customerInfo.id + this.currentArticle.articlePrices[i].id)) {
                        //如果这个人买过这个规格的
                        this.customerArticleCount.put(customerInfo.id + this.currentArticle.articlePrices[i].id, this.customerArticleCount.get(customerInfo.id + this.currentArticle.articlePrices[i].id) + this.currentArticle.articlePrices[i].count);
                        t = this.customerArticleCount.get(customerInfo.id + this.currentArticle.articlePrices[i].id);
                    } else {
                        //这个人没有买过
                        this.customerArticleCount.put(customerInfo.id + this.currentArticle.articlePrices[i].id, this.currentArticle.articlePrices[i].count);
                        t = this.currentArticle.articlePrices[i].count;
                    }

                    this.currentArticle.articlePrices[i].count += this.currentArticle.articlePrices[i].number;
                    this.currentArticle.articlePrices[i].number = this.currentArticle.articlePrices[i].count;
                    this.currentArticle.articlePrices[i].articleType = 1;
                    this.updateToServerCart(this.currentArticle.articlePrices[i], t);
                }
                if (this.currentArticle.recommendCategoryId) {
                    for (var i = 0; i < this.articleList.length; i++) {
                        if (this.articleList[i].id == this.currentArticle.id) {
                            this.articleList[i].articlePrices = this.currentArticle.articlePrices;
                        }
                    }
                }

            } else if (this.currentArticle.recommendId) { //单品推荐包
                this.currentArticle.uuid = this.uuid();
                if (!this.editModel) {
                    this.currentArticle.number = 1;
                    this.currentArticle.shopCartId = null;
                    this.updateToServerCartTwo(this.currentArticle);
                } else {
                    console.log(JSON.stringify(this.currentArticle));
                    this.updateToServerCartTwo(this.currentArticle);
                }
            }

//          console.log(JSON.stringify(this.currentArticle));

            this.currentArticle = null;
            this.selectCurrentArticle.show = false;
            this.selectWeightArticle.show = false;
            //this.closeAction();
        },
        cutToShopCartNew: function (a) {
            this.totalMoney -= a.realPrice;
            if (a.count > 0) {
                a.count--;
                this.selectCurrentArticle.count--;
            }
            if (a.count == 0) {
                this.shopCartIsc && this.shopCartIsc.refresh();
            }
            this.updateToServerCartThree(a);

        },
        uuid: function () {
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "-";

            var uuid = s.join("");
            return uuid;
        },
        checkRepeat: function () {
            var that = this;

            checkRepeatArticle(this.nowRepeatArticle.id, groupId, customerInfo.id, function (result) {
                if (!result.success) {
                    if(that.nowRepeatArticle.recommendList.length > 0 || that.nowRepeatArticle.articleType == 2){
                        that.checkRecommend = true;
                    }else{
                        that.checkRecommend = false;
                        that.repeatDialog.count = result.count;
                        that.repeatDialog.name = that.nowRepeatArticle.name;
                        that.repeatDialog.price = that.nowRepeatArticle.fansPrice ? that.nowRepeatArticle.fansPrice : that.nowRepeatArticle.price;
                        that.repeatDialog.show = true;
                    }

                }
            });
        },
        addToShopCart: function (a, t) {
            var that = this;
            this.nowRepeatArticle = a;
            var check = that.checkRepartMap.get(a.id) == null ? false : that.checkRepartMap.get(a.id) ? true : false;
            if (shopInfo.openManyCustomerOrder == 1 && getParam("tableNumber") != null && t != "false" && !check) {
                that.checkRepeat();
                if (that.repeatDialog.show) {
                    return;
                }
            }
            a.number++;
            if (a.recommendCategoryId) {
                if (a.id.indexOf("@") > -1) {
                    var aid = a.id.substr(0, a.id.indexOf('@'));
                    var art = this.findArticleById(aid);
                    art.number++;
                } else {
                    var art = this.findArticleById(a.id);
                    art.number++;
                }
            } else {
                var articleId;
                if (a.id.indexOf("@") > -1) {
                    articleId = a.id.substr(0, a.id.indexOf('@'));
                } else {
                    articleId = a.id;
                }
                for (var i = 0; i < this.reArticleList.length; i++) {
                    if (this.reArticleList[i].id == articleId) {
                        this.reArticleList[i].number++;
                    }
                }
            }
            this.totalMoney += a.price;
            if(shopInfo.openManyCustomerOrder == 1 && groupId != null){
            	if (this.customerArticleCount.get(customerInfo.id + a.id) && this.customerArticleCount.get(customerInfo.id + a.id) > 0) {
	                this.customerArticleCount.put(customerInfo.id + a.id, this.customerArticleCount.get(customerInfo.id + a.id) + 1);
	            } else {
	                this.customerArticleCount.put(customerInfo.id + a.id, 1);
	            }
	            this.updateToServerCart(a, this.customerArticleCount.get(customerInfo.id + a.id));
            }else{
            	this.updateToServerCart(a, a.number);
            }
        },
        cutToShopCart: function (a) {
			var that = this;
            if (a.recommendCategoryId) {
                if (a.id.indexOf("@") > -1) {
                    var aid = a.id.substr(0, a.id.indexOf('@'));
                    var art = this.findArticleById(aid);
                    art.number--;
                } else {
                    var art = this.findArticleById(a.id);
                    art.number--;
                }
            } else {
                var articleId;
                if (a.id.indexOf("@") > -1) {
                    articleId = a.id.substr(0, a.id.indexOf('@'));
                } else {
                    articleId = a.id;
                }
                for (var i = 0; i < this.reArticleList.length; i++) {
                    if (this.reArticleList[i].id == articleId) {
                        this.reArticleList[i].number--;
                    }
                }
            }
            this.totalMoney -= a.price;
            if (a.number > 0) {
                if(groupId == null){
                    a.number--;
                    this.updateToServerCart(a,a.number);
                }else if (this.customerArticleCount.get(customerInfo.id + a.id) && this.customerArticleCount.get(customerInfo.id + a.id) > 0) {
                    this.customerArticleCount.put(customerInfo.id + a.id, this.customerArticleCount.get(customerInfo.id + a.id) - 1);
                    a.number--;
                    this.updateToServerCart(a);
                } else {
                    this.$dispatch("emptyMessage", "这个餐品不是您点的哟", 2000);
                    return;
                }
            }
            if (a.number == 0) {
                a.count = 0;
                a.recommendList = [];
                this.shopCartIsc && this.shopCartIsc.refresh();
                this.closeGroupOrder();
            }

            if (a.count > 0) {
                if (a.unitList.length > 0) {
                    a.count--;
                    this.updateToServerCartThree(a);
                } else if (a.weightPackageId != undefined && a.weightPackageId  != null) {
                    this.selectCurrentArticle.count--;
                    if(groupId == null){
                        a.count--;
                        this.selectCurrentArticle.count--;
                        this.updateToServerCart(a,a.count);
                    }else if (this.customerArticleCount.get(customerInfo.id + a.id) && this.customerArticleCount.get(customerInfo.id + a.id) > 0) {
                        if (!a.unitIds) {
                            this.customerArticleCount.put(customerInfo.id + a.id, this.customerArticleCount.get(customerInfo.id + a.id) - 1);
                            this.updateToServerCart(a);
                        }
                        a.count--;
                    } else {
                        this.$dispatch("emptyMessage", "这个餐品不是您点的哟", 2000);
                    }
                } else {
                    this.selectCurrentArticle.count--;
                    if(groupId == null){
                        a.count--;
                        this.selectCurrentArticle.count--;
                        this.updateToServerCart(a,a.count);
                    }else if (this.customerArticleCount.get(customerInfo.id + a.id) && this.customerArticleCount.get(customerInfo.id + a.id) > 0) {
                        if (!a.unitIds) {
                            this.customerArticleCount.put(customerInfo.id + a.id, this.customerArticleCount.get(customerInfo.id + a.id) - 1);
                            this.updateToServerCart(a,a.count);
                        }
                        a.count--;
                    } else {
                        this.$dispatch("emptyMessage", "这个餐品不是您点的哟", 2000);
                    }
                }
            }
            if (a.count == 0) {
                a.recommendList = [];
                this.shopCartIsc && this.shopCartIsc.refresh();
            }
			//loadShopCart(1, groupId, function (res) {
			//	if(groupId != null && res.totalArticleCount == 0){
			//		that.groupCreateOrder = false;
			//	}
			//});
        },
        cutToWeightArticle:function(){
        	this.selectWeightArticle.count = 0;
        	this.selectWeightArticle.show = false;
        },
        addToOldSingleShopCart: function (a) {
            a.count++;
            this.startMoney += a.fansPrice == null ? a.price : a.fansPrice;
            var that = this;
            Vue.nextTick(function () {
                that.articleIsc.refresh();
            });
        },
        cutToOldSingleShopCart: function (a) {
            var current = this.currentArticle; //得到当前菜品
            var check = false;
            for (var i = 0; i < current.articlePrices.length; i++) { //遍历菜品规格
                if (current.articlePrices[i].count > 0 && current.articlePrices[i].id != a.id) {
                    //如果任何一个其他规格的数量大于0
                    check = true;
                }
            }
            if (!check && this.selectRecommendArticle.length > 0 && a.count == 1) {
                this.$dispatch("emptyMessage", "未选择主食", 2000);
                return;
            }

            this.startMoney -= a.fansPrice == null ? a.price : a.fansPrice;
            if (a.count > 0) {
                a.count--;
            }
            var that = this;
            Vue.nextTick(function () {
                that.articleIsc.refresh();
            });
        },
        addToSingleShopCart: function (a) {
            a.count++;
            if (a.recommendCategoryId) {
                if (a.id.indexOf("@") > -1) {
                    var aid = a.id.substr(0, a.id.indexOf('@'));
                    var art = this.findArticleById(aid);
                    art.number++;
                }
                for (var i = 0; i < this.reArticleList.length; i++) {
                    if (this.reArticleList[i].id == articleId) {
                        this.reArticleList[i].number++;
                    }
                }
            } else {
                var articleId;
                if (a.id.indexOf("@") > -1) {
                    articleId = a.id.substr(0, a.id.indexOf('@'));
                } else {
                    articleId = a.id;
                }
//              for (var i = 0; i < this.reArticleList.length; i++) {
//                  if (this.reArticleList[i].id == articleId) {
//                      this.reArticleList[i].number++;
//                  }
//              }
            }
            this.startMoney += a.fansPrice == null ? a.price : a.fansPrice;
        },
        cutToSingleShopCart: function (a) {
            this.startMoney -= a.fansPrice == null ? a.price : a.fansPrice;
            if (a.count > 0) {
                a.count--;
            }
        },
        cutCurrentCount: function (a) {
            //console.log(JSON.stringify(a));
            if (this.selectRecommendArticle.length > 0 && a.count == 1) {
                this.$dispatch("emptyMessage", "未选择主食", 2000);
                return;
            }
            if (a.count && a.count > 0) {
                a.count--;
                this.totalMoney = a.price * a.count;
            }
            if (a.count == 0) {
                a.show = false;
                this.selectCurrentArticle.show = false;
            }
        },
        addCurrentCount: function (a) {
            a.count++;
            this.totalMoney = a.price * a.count;
        },
        cutRecommendCount: function (a) {
            if (a.count && a.count > 0) {
                this.startMoney -= a.price;
                this.totalMoney -= a.price;
                a.count--;
                this.currentCount--;
            }
            if (a.count == 0) {
                a.show = true;
                this.selectRecommendArticle.$remove(a);
            }
            var that = this;
            Vue.nextTick(function () {
                that.articleIsc.refresh();
                that.articleImage.refresh();
            });
        },
        addRecommendCount: function (a) {
            if (a.count < a.maxCount) {
                this.totalMoney += a.price;
                this.startMoney += a.price;
                a.count++;
                this.currentCount++;
            } else {
                this.$dispatch("emptyMessage", "此商品最大购买" + a.maxCount + "个", 2000);
            }
            var that = this;
            Vue.nextTick(function () {
                that.articleIsc.refresh();
                that.articleImage.refresh();
            });
        },
        findMeals: function (art) {
            var saveArt = $.extend(true, {}, art);
            if (!saveArt.tempId) {
                saveArt.tempId = saveArt.id + "@" + new Date().getTime();
            }
            saveArt.number = 1;
            this.articleMealsMap.put(saveArt.tempId, saveArt);
            this.$set("articleMealsMap.values", this.articleMealsMap.getValues());
            this.closeAction();
        },
        saveMeals: function (art) {
            var that = this;
            this.nowRepeatArticle = art;
            if (shopInfo.openManyCustomerOrder == 1 && getParam("tableNumber") != null) {
                that.checkRepeat();
                //if(that.checkRecommend){
                //    this.$dispatch("emptyMessage", "该组已经有人点过这个菜啦", 2000);
                //    return;
                //}
                if (that.repeatDialog.show) {
                    return;
                }
            }
            var saveArt = $.extend(true, {}, art);
            if (!saveArt.tempId) {
                saveArt.tempId = saveArt.id + "@" + new Date().getTime();
                art.shopCartId = null;
                updateShopCartOne(art, groupId, function (result) {
                    if (!result.success) {
                        that.$dispatch("emptyMessage", result.message, 4000);
                        that.showGroup();
                    } else {
                        saveArt.shopCartId = result.id;
                    }

                });
                console.log("添加套餐");
            } else {
                updateShopCartOne(art, groupId, function (result) {
                    if (!result.success) {
                        that.$dispatch("emptyMessage", result.message, 4000);
                        that.showGroup();
                    }
                });
                console.log("修改套餐");
                //console.log("-----添加套餐--失败 ");
            }
            saveArt.number = 1;
            this.articleMealsMap.put(saveArt.tempId, saveArt);
            this.$set("articleMealsMap.values", this.articleMealsMap.getValues());
            this.closeAction();
        },
        getMealsReadPrice: function (art) {
            var og = art.fansPrice || art.price;
            for (var i = 0; i < art.mealAttrs.length; i++) {
                var attr = art.mealAttrs[i];
                if(attr.currentItem != null && attr.currentItem.length > 0){
                    for (var k = 0; k < attr.currentItem.length; k++) {
                        if(attr.currentItem[k] != null){
                            og += attr.currentItem[k].priceDif * art.discount / 100;
                        }
                    }
                }
            }
            art.realPrice = og;
            return art.realPrice.toFixed(2);
        },
        selectMealItem: function (item, attr) {
            if (attr.choiceType == 0) {
                if (item.click) {
                    return;
                }
                if (!attr.currentItem) {
                    attr.currentItem = [];
                    attr.currentItem.push(item);
                } else {
                    attr.currentItem.push(item);
                }
                if (attr.choiceCount < attr.currentItem.length) {
                    attr.currentItem.$remove(attr.currentItem[0]);
                }
                //单选
                for (var i = 0; i < attr.mealItems.length; i++) {
                    if (attr.mealItems[i].click) {
                        attr.mealItems[i].click = false;
                    }
                    for (var k = 0; k < attr.currentItem.length; k++) {
                        if (attr.currentItem[k].id == attr.mealItems[i].id) {
                            attr.mealItems[i].click = true;
                        }

                    }
                }

            } else {
                if (!attr.currentItem) {
                    attr.currentItem = [];
                    attr.currentItem.push(item);
                } else {
                    //if (attr.currentItem.length == 1 && item.click) {
                    //    this.$dispatch("message", attr.name + "为必选", 81000);
                    //    return;
                    //}
                    if (item.click) {
                        for (var i = 0; i < attr.currentItem.length; i++) {
                            if (attr.currentItem[i].id == item.id) {
                                attr.currentItem.splice(i, 1);
                            }
                        }

                    } else {
                        attr.currentItem.push(item);
                    }
                }
                if (item.click) {
                    item.click = false;

                } else {
                    item.click = true;
                }
            }
            var that = this;
            Vue.nextTick(function () {
                that.articleImageIsc.refresh();
            });
        },
        selectWeightItem:function(item,attr){
        	var that = this;
            if (attr.currentItem.length == 0) {
                attr.currentItem.push(item);
                item.click = true;
            } else {
                if (attr.currentItem[0].id == item.id) {
                    this.$dispatch("emptyMessage", attr.name + "为必选项", 2000);
                    item.click = true;
                } else {
                    attr.currentItem[0].click = false;
                    this.totalMoney -= attr.currentItem[0].price;
                    for (var k = 0; k < attr.details.length; k++) {
                        if (attr.details[k].id == attr.currentItem[0].id) {
                            attr.details[k].click = false;
                        }
                    }
                    attr.currentItem = [];
                    attr.currentItem.push(item);
                    console.log(JSON.stringify(attr));
                    item.click = true;
                }
            }
            var unitName = this.currentArticle.name;
            if (attr.currentItem.length > 0) {
               	this.selectWeightArticle.show = true;
               	this.selectWeightArticle.count = 1;
               	this.totalMoney = this.currentArticle.cattyMoney * this.selectWeightArticle.count;
               	this.selectWeightArticle.price = this.currentArticle.cattyMoney;
               	attr.details.forEach(function(obj){
               		if(obj.click){
               			that.selectWeightArticle.name = unitName + "(" + obj.name + ")";
               		}
               	})
            }else{
            	this.selectWeightArticle.show = false;
            }

        },
        selectUnitItem: function (item, attr) {
            if (attr.choiceType == 0) { //单选
                if (attr.currentItem.length == 0) { //未选择
                    attr.currentItem.push(item);
                    item.click = true;
                } else { //选择的情况
                    if (attr.currentItem[0].id == item.id) { //选的是自己
                        this.$dispatch("emptyMessage", attr.name + "为必选项", 2000);
                        item.click = true;
                    } else {
                        attr.currentItem[0].click = false;
                        this.totalMoney -= attr.currentItem[0].price;
                        for (var k = 0; k < attr.details.length; k++) {
                            if (attr.details[k].id == attr.currentItem[0].id) {
                                attr.details[k].click = false;
                            }
                        }
                        attr.currentItem = [];
                        attr.currentItem.push(item);
                        item.click = true;
                    }
                }
            } else { //多选
                var has = false;
                for (var i = 0; i < attr.currentItem.length; i++) {
                    if (attr.currentItem[i].id == item.id) {
                        has = true;
                        item.click = false;
                        attr.currentItem.splice(i, 1);
                    }
                }
                if (!has) {
                    attr.currentItem.push(item);
                    item.click = true;
                }
            }
            var unitName = this.currentArticle.name;
            var price = this.currentArticle.fansPrice ? this.currentArticle.fansPrice : this.currentArticle.price;
            for (var k = 0; k < this.unitArr.length; k++) {
                var obj = this.unitArr[k];
                for (var i = 0; i < obj.details.length; i++) {
                    if (obj.details[i].click) {
                        unitName = unitName + "(" + obj.details[i].name + ")";
                        price += obj.details[i].price;
                    }
                }
            }
            for (var u = 0; u < this.currentArticle.recommendList.length; u++) {
                var obj = this.currentArticle.recommendList[u];
                price += obj.price * obj.count;
            }

            if (!this.selectCurrentArticle.show) { //还没选中规格的情况
                var result = true;
                for (var i = 0; i < this.unitArr.length; i++) { //遍历规格
                    if (this.unitArr[i].choiceType == 0) { //单选
                        if (this.unitArr[i].currentItem.length == 0) {
                            result = false;
                            break;
                        }
                    }
                }
                if (result) {
                    this.selectCurrentArticle.show = true;
                } else {
                    this.selectCurrentArticle.show = false;
                }

                this.selectCurrentArticle.count = 1;
            }
            this.totalMoney = price * this.selectCurrentArticle.count;
            this.selectCurrentArticle.name = unitName;
            this.selectCurrentArticle.price = price;
            var that = this;
            Vue.nextTick(function () {
                that.articleIsc.refresh();
            });
        },
        selectRecommend: function (item) {
            var current = this.currentArticle; //先得到当前菜品
            var check = false;
            for (var i = 0; i < current.articlePrices.length; i++) { //便利菜品的规格
                if (current.articlePrices[i].count > 0) {
                    check = true;
                }
            }

            if (this.unitArr.length > 0 && !this.selectCurrentArticle.show) { //新规格单品
                this.$dispatch("emptyMessage", "未选择主食", 2000);
                return;
            }
            if (current.articlePrices.length > 0 && !check) { //如果是有规格单品
                this.$dispatch("emptyMessage", "未选择主食", 2000);
                return;
            }
            if (item.count < item.maxCount) {
                this.startMoney += item.price;
                this.totalMoney += item.price;
                item.count++;
                this.currentCount++;
            }
            item.show = false;
            this.selectRecommendArticle.push(item);

            var that = this;
            Vue.nextTick(function () {
                that.articleIsc.refresh();
                that.articleImage.refresh();
            });
            if (this.articleIsc) {
                that.articleIsc.scrollToElement(document.querySelector('#scrollOffset'), 1200, null, null, IScroll.utils.ease.quadratic); //点击配餐滚动到指定位置
            }
        },
        selectUnit: function (item, attr) {
            if (attr.type == 0) { //单选
                for (var i = 0; i < attr.detailList.length; i++) {
                    if (attr.detailList[i].click && attr.detailList[i].id != item.id) {
                        attr.detailList[i].click = false;
                        this.totalMoney -= attr.detailList[i].spread;
                    }
                }
            } else { //多选或不选

            }
            if (item.click) { //选中
                item.click = false;
                $(".item-name-change").removeClass("select");
                this.totalMoney -= item.spread;
            } else {  //没有选中
                item.click = true;
                $(".item-name-change").removeClass("select");
                this.totalMoney += item.spread;
            }
        },
        showActionNew: function (a) {
            var that = this;
            this.currentArticle = a;
            this.editModel = true;
            this.currentArticle.articleType = 1;
            this.currentArticle.showDesc = true;
            this.currentArticle.price = a.orgPrice;
            this.currentArticle.name = a.orgName;
            this.currentArticle.id = a.articleId;
            this.currentArticle.uuid = a.uuid;
            this.currentArticle.orgName = a.orgName;
            this.totalMoney = a.realPrice;
            for (var i = 0; i < a.recommendList.length; i++) {
                this.totalMoney = this.totalMoney + a.recommendList[i].price * a.recommendList[i].count;
            }
            this.currentArticle.articlePrices = [];
            if(!this.currentArticle.weightPackageId){
            	this.selectCurrentArticle.show = true;
	            this.selectCurrentArticle.name = a.name;
	            this.selectCurrentArticle.count = a.count;
	            this.selectCurrentArticle.price = a.realPrice;
            }
            this.selectRecommendArticle = a.recommendList;
            if(this.currentArticle.weightPackageId){
            	this.selectWeightArticle.name = a.unitName;
                this.selectWeightArticle.count = a.count;
                this.selectWeightArticle.price = a.realPrice;
            	that.selectWeightArticle.show = true;
            }

            $.ajax({
                type: "post",
                url: baseUrl + "/wechat/order/new/getRecommend",
                async: false,
                data: {
                    articleId: a.articleId,
                    groupId:groupId
                },
                success: function (result) {
                    that.recommendList.items = [];
                    var obj = result.data;
                    if (!obj) {
                        return;
                    }
                    that.recommendList.choiceType = obj.choiceType;
                    that.recommendList.count = obj.count;
                    if (obj.articles) {
                        for (var i = 0; i < obj.articles.length; i++) {
                            var stock = null;
                            for (var j = 0; j < that.articleList.length; j++) {
                                var b = that.articleList[j];
                                if (b.id == obj.articles[i].articleId) {
                                    stock = that.articleList[j].currentWorkingStock;
                                    break;
                                }
                            }
                            var flag = true;
                            for (var j = 0; j < that.currentArticle.recommendList.length; j++) {
                                var aid = that.currentArticle.recommendList[j].articleId;
                                if (obj.articles[i].articleId == aid) {
                                    flag = false;
                                }
                            }
                            if (flag) {
                                //var art = that.findArticleById(obj.articles[i].articleId);
                                that.recommendList.items.push({
                                    articleId: obj.articles[i].articleId,
                                    //price: (obj.articles[i].price * art.discount / 100).toFixed(2),
                                    price: obj.articles[i].price,
                                    articleName: obj.articles[i].articleName,
                                    count: 0,
                                    maxCount: obj.articles[i].maxCount,
                                    currentWorkingStock: stock,
                                    show: true,
                                    imageUrl: getPicUrl(obj.articles[i].imageUrl)
                                });
                            }
                        }
                    }

                }
            });

            Vue.nextTick(function () {
                var dis = $(that.$el).find(".weui_article");
                var totalHeight = dis.parent().height();
                var otherHeight = 0;
                dis.siblings().each(function () {
                    var he = $(this).outerHeight(true);
                    otherHeight += he;
                })
                var remainHeight = totalHeight - otherHeight;
                var h = dis.height();
                dis.height(remainHeight);
                dis.css({
                    overflow: "hidden"
                });
                that.articleIsc = new IScroll(dis.get(0), {
                    probeType: 2,
                    click: iScrollClick(),
                });
            });
            that.unitArr = [];
            that.unitArr = a.unitList;
        },
        showAction: function (a, t) {
            if (a.isEmpty) {
                return;
            }
            var that = this;
            /*加载中提示（防止规格或推荐餐包未加载完成）*/
            this.$dispatch("loadingUnit", "加载中，请稍等...", 99999);
            /*选中当前选择的菜品*/
            this.currentArticle = a;
            this.totalMoney = a.fansPrice ? a.fansPrice : a.price;
            this.currentCount = 0;
            this.startMoney = 0;
            /*获取重量包*/
            if(this.currentArticle.openCatty == 1){
            	console.log("该菜品存在重量包~~~");
            	getWeightPacketInfo(this.currentArticle.weightPackageId,function(res){
            		if(res.success){
            			that.currentArticle.weightPackageList.currentItem = [];
                        that.currentArticle.weightPackageList.details = [];
                        var obj = res.data;
                        that.currentArticle.weightPackageList.name = obj.name;
                        for (var k = 0; k < obj.details.length; k++) {
                            var detail = {
                                id: obj.details[k].id,
                                name: obj.details[k].name,
                                weight:obj.details[k].weight,
                                click: false,
                            }
                            that.currentArticle.weightPackageList.details.push(detail);
                        }
                        console.log(JSON.stringify(that.currentArticle.weightPackageList));
                    }

            	})
            }
            if (t == "edit") {
                this.editModel = true;
                this.selectRecommendArticle = a.recommendList;
                for (var i = 0; i < a.recommendList.length; i++) {
                    this.totalMoney += a.recommendList[i].price * a.recommendList[i].count;
                }

            } else {
                this.editModel = false;
                this.selectRecommendArticle = [];
            }

            var that = this;
            if (a.articleType == 2) { //套餐

                var that = this;
                Vue.nextTick(function () {
                    that.articleImageIsc = new IScroll("#bigbox", {
                        probeType: 2,
                        scrollX: true,
                        scrollY: false,
                        click: iScrollClick()
                    });
                });

                Vue.nextTick(function () {
                    var dis = $(that.$el).find(".dish_size_bg");
                    var totalHeight = dis.parent().height();
                    var otherHeight = -22;
                    dis.siblings().each(function () {
                        var he = $(this).outerHeight(true);
                        otherHeight += he;
                    })
                    var remainHeight = totalHeight - otherHeight;
                    var h = dis.height() + 50;
                    dis.height(remainHeight);
                    if (dis.height() < h) {
                        dis.css({
                            overflow: "hidden"
                        });
                        that.articleIsc = new IScroll(dis.get(0), {
                            probeType: 2,
                            click: iScrollClick(),
                        });
                    }
                    ;
                });
            }
            var flag = true;
            $.ajax({
                type: "post",
                url: baseUrl + "/wechat/order/new/getRecommend",
                //async: false,
                data: {
                    articleId: a.id,
                    groupId:groupId
                },
                success: function (result) {
                	if(result.success){
                		that.recommendList.items = [];
	                    var obj = result.data;
	                    if (!obj) {
	                        return;
	                    }
	                    that.recommendList.count = obj.count;
	                    that.recommendList.choiceType = obj.choiceType;
	                    if (obj.articles) {
	                        for (var i = 0; i < obj.articles.length; i++) {
	                            var stock = null;
	                            for (var j = 0; j < that.articleList.length; j++) {
	                                var b = that.articleList[j];
	                                if (b.id == obj.articles[i].articleId) {
	                                    stock = that.articleList[j].currentWorkingStock;
	                                    break;
	                                }
	                            }
	                            var check = false;
	                            var number = 0;
	                            if (that.selectRecommendArticle != null) {
	                                for (var k = 0; k < that.selectRecommendArticle.length; k++) {
	                                    if (that.selectRecommendArticle[k].articleId == obj.articles[i].articleId) {
	                                        check = true;
	                                        number = that.selectRecommendArticle[k].count;
	                                        that.selectRecommendArticle[k].maxCount = obj.articles[i].maxCount;
	                                        break;
	                                    }
	                                }
	                            }
	
	                            if (!check) {
	                                //var art = that.findArticleById(obj.articles[i].articleId);
	                                that.recommendList.items.push({
	                                    articleId: obj.articles[i].articleId,
	                                    //price: (obj.articles[i].price * art.discount / 100).toFixed(2),
	                                    price: obj.articles[i].price,
	                                    articleName: obj.articles[i].articleName,
	                                    count: 0,
	                                    maxCount: obj.articles[i].maxCount,
	                                    currentWorkingStock: stock,
	                                    show: true,
	                                    isEmpty: false,
	                                    imageUrl: getPicUrl(obj.articles[i].imageUrl)
	                                });
	                            }else{
	                                that.recommendList.items.push({
	                                    articleId: obj.articles[i].articleId,
	                                    //price: (obj.articles[i].price * art.discount / 100).toFixed(2),
	                                    price: obj.articles[i].price,
	                                    articleName: obj.articles[i].articleName,
	                                    count: number,
	                                    maxCount: obj.articles[i].maxCount,
	                                    currentWorkingStock: stock,
	                                    show: false,
	                                    isEmpty: false,
	                                    imageUrl: getPicUrl(obj.articles[i].imageUrl)
	                                });
	                            }
	                        }
	                    }
                	}else{
                		that.$dispatch("remindMessage","推荐餐包返回失败,请重试!",3000);
                	}
                    
                }
            });
            if(!flag){
                return;
            }
            if (a.hasUnit.length > 0 && a.articleType != 2) {
                for (var i = 0; i < this.allAttr.length; i++) {
                    var attr = this.allAttr[i];
                    var units = attr.articleUnits;
                    if (!units) {
                        continue;
                    }
                    var cAttr = {id: attr.id, name: attr.name, units: []};
                    for (var n = 0; n < units.length; n++) {
                        var un = units[n];
                        if ($.inArray(un.id.toString(), a.hasUnit) > -1) {
                            un.attr_id = attr.id;
                            cAttr.units.push(un);
                        }
                    }
                    if (cAttr.units.length > 0) {
                        this.currentAttrs.push(cAttr);
                    }
                }
                var that = this;
                Vue.nextTick(function () {
                    var dis = $(that.$el).find(".weui_article");
                    var totalHeight = dis.parent().height();
                    var otherHeight = 0;
                    dis.siblings().each(function () {
                        var he = $(this).outerHeight(true);
                        otherHeight += he;
                    })
                    var remainHeight = totalHeight - otherHeight;
                    var h = dis.height() + 20;
                    dis.height(remainHeight);

                    dis.css({
                        overflow: "hidden"
                    });
                    that.articleIsc = new IScroll(".weui_article", {
                        probeType: 2,
                        click: iScrollClick(),
                    });
                });

                if (this.currentArticle.description) {
                    Vue.nextTick(function () {
                        that.articleDesc = new IScroll(".currentArticle-description", {
                            probeType: 2,
                            click: iScrollClick()
                        });
                    });
                }

            }

            $.ajax({
                type: "post",
                url: baseUrl + "/wechat/order/new/getUnit",
                //async: false,
                data: {
                    articleId: a.id
                },
                success: function (result) {
                	if(result.success){
                		that.unitArr = [];
	                    var obj = result.data;
	                    for (var i = 0; i < obj.length; i++) {
	                        var details = [];
	                        for (var k = 0; k < obj[i].details.length; k++) {
	                            var detail = {
	                                id: obj[i].details[k].id,
	                                name: obj[i].details[k].name,
	                                click: false,
	                                price: obj[i].details[k].price
	                            }
	                            if (a.discount) { //如果当前菜品当前时间存在折扣
	                                detail.price = parseFloat((detail.price * a.discount / 100).toFixed(2));
	                            }
	                            details.push(detail);
	                        }
	                        that.unitArr.push({
	                            currentItem: [],
	                            name: obj[i].name,
	                            choiceType: obj[i].choiceType,
	                            sort: obj[i].sort,
	                            details: details,
	                            show: true,
	                            isEmpty: false,
	                        });
	                    }
	                    that.$dispatch("loadingUnitSuccess");
                	}else{
                		that.$dispatch("remindMessage","新规格返回失败,请重试!",3000);
                	}
                }
            });
            if (a.hasUnit.length == 0 && a.articleType == 1) {
                Vue.nextTick(function () {
                    var dis = $(that.$el).find(".weui_article");
                    var totalHeight = dis.parent().height();
                    var otherHeight = 0;
                    dis.siblings().each(function () {
                        var he = $(this).outerHeight(true);
                        otherHeight += he;
                    })
                    var remainHeight = totalHeight - otherHeight;
                    var h = dis.height();
                    dis.height(remainHeight);
                    dis.css({
                        overflow: "hidden"
                    });
                    that.articleIsc = new IScroll(dis.get(0), {
                        probeType: 2,
                        click: iScrollClick(),
                    });
                });
                if (that.currentArticle.description) {
                    Vue.nextTick(function () {
                        that.articleDesc = new IScroll(".currentArticle-description", {
                            probeType: 2,
                            click: iScrollClick()
                        });
                    });
                }
                ;
                if (t != "edit") {
                    Vue.nextTick(function () {
                        that.articleImage = new IScroll("#recommendImg", {
                            probeType: 2,
                            scrollX: true,
                            scrollY: false,
                            click: iScrollClick()
                        });
                    })
                }
            }

            if (a.articlePrices.length > 0) {
                for (var i = 0; i < a.articlePrices.length; i++) {
                    a.articlePrices[i].count = 0;
                }
            }
            for (var i = 0; i < this.articleList.length; i++) {
                this.articleList[i].count = 0;
            }
            for (var i = 0; i < this.reArticleList.length; i++) {
                this.reArticleList[i].count = 0;
            }
        },
        changeCurrentFamily: function (f) {
            this.currentFamily = f;
            var that = this;
            var fid = this.currentFamily.id;
            this.choiceList = true;
            if (that.artListIsc) {
                var fidDom = $(that.$el).find("[data-family-id='" + fid + "']");
                if (shopInfo.rollingSwitch == 0) {
                    that.artListIsc.scrollToElement(fidDom.get(0), 0);
                } else if (shopInfo.rollingSwitch == 1) {
                    that.artListIsc.scrollToElement(fidDom.get(0));
                }
            }
        },
        changeRecommendType: function (f) {
            var that = this;
            this.currentRecommend = f;
            this.choiceList = false;
            var fid = this.currentRecommend.id;
            if (that.artListIsc) {
                var fidDom = $(that.$el).find("[data-recommend-id='" + fid + "']");
                if (shopInfo.rollingSwitch == 0) {
                    that.artListIsc.scrollToElement(fidDom.get(0), 0);
                } else if (shopInfo.rollingSwitch == 1) {
                    that.artListIsc.scrollToElement(fidDom.get(0));
                }
            }
        },
        closeAction: function () {
            this.currentArticle = null;
            this.currentAttrs = [];
            this.currentUnits = null;
            this.currentUnitPrice = null;
            this.selectRecommendArticle = [];
            this.selectCurrentArticle.show = false;
            this.selectWeightArticle.show = false;
            for (var i = 0; i < this.articleList.length; i++) {
                this.articleList[i].count = 0;
            }
            for (var i = 0; i < this.reArticleList.length; i++) {
                this.reArticleList[i].count = 0;
            }
        },
        hasUnit: function (unitId) {
            if (this.currentUnits && this.currentUnits.values.length > 0 && this.currentUnits.containsValue(unitId)) {
                return true;
            }
            return false;
        },
        hasFansPrice: function (article) {
            var ups = article.articlePrices;
            if (ups.length == 0) {
                return false;
            }
            var fans_price = null;
            for (var i = 0; i < ups.length; i++) {
                var up = ups[i];
                var fans = 0;
                if (fans_price == null && up.fansPrice) {
                    fans_price = up.fansPrice;
                } else if (up.fansPrice && fans_price != null && up.fansPrice < fans_price) {
                    fans_price = up.fansPrice;
                }

            }
            return fans_price;
        },
        choiceUnit: function (unit) {
            if (!this.currentUnits) {
                var map = new HashMap();
                map.price = 0;
                map.unit_price = 0;
                map.attr = 0;
                map.values = [];
                this.currentUnits = map;
            }
            this.currentUnits.put(unit.attr_id, unit.id.toString());
            this.currentUnits.values = this.currentUnits.getValues();
            for (var n = 0; n < this.currentArticle.articlePrices.length; n++) {
                var unit = this.currentArticle.articlePrices[n];
                var isThis = true;
                for (var i = 0; i < unit.ids.length; i++) {
                    var unit_id = unit.ids[i];
                    if (!this.currentUnits.containsValue(unit_id)) {
                        isThis = false;
                        break;
                    }
                }
                if (isThis) {
                    this.currentUnitPrice = unit;
                    break;
                } else {
                    this.currentUnitPrice = null;
                }
            }
        },
        closeRemindDialog: function () {
            this.remindDialog.show = false;
            this.remindDialog.articles = [];
        },
        remindDialogOk: function () {
            this.closeRemindDialog();
            this.showCreateOrder(false);
        },
        closeShopCartAndShowCreate: function () {
            //关闭购物车
            if (this.isShowShopcart = true) {
                this.isShowShopcart = false;
            }
            //execute showCreateOrder(true)
            this.showCreateOrder();
        },
        showOrderInfo: function () {
            var that = this;
            $.ajax({
                url: baseUrl + "/wechat/customer/new/customer",
                type: "post",
                async: false,
                success: function (user) {
                    that.customerInfo = user.data;
                }
            });
        },
        closeGroupShopCart: function () {
            var that = this;
            this.shopCartBox = false;
            setTimeout(function () {
                that.groupShopCartShow = false;
                that.shopCartBox = true;
            }, 500);
        },
        resetGroupHeight: function () {
            var group_title = $("#groupTitle");
            var content = $(".groupScroll");
            var main = $(".cart-height").height();
            content.height(main - group_title.height() - 55);
            content.css({
                overflow: "hidden",
                position: "relative"
            })
        },
        showCreateOrder: function (showRemind, afterShow, scan) {
            var that = this;
            if (pageType == "waimai") {
                this.showOrderInfo();
                getCustomerAddress(customerInfo.id, function (result) {
                    if (result.success) {
                        that.addressList = result.data;
                        that.myAddress = that.addressList[0];
                    }
                })
            };
            var soupNumber = getParam("tableNumber") == null ? that.orderBoss.tableNumber : getParam("tableNumber");
            getSoupOrder(soupNumber, shopInfo.id, customerInfo.id, function (result) {
                if (result.success) {
                    if (result.data) {
                        that.soupList = result.data;
                        that.beforeId = result.data[0].orderId;
                    }
                }
            })
            if (this.groupShopCartShow) {
                that.groupShopCartShow = false;
            };
            that.loadShopCartGroup(1, groupId, function () {});

            /*进入外卖店铺未注册直接弹出注册弹窗*/
            if (pageType == "waimai" && that.customerInfo.isBindPhone == false) {
                that.$dispatch("receive-red-papper-registered");
                return;
            }
            this.customerId = that.customerInfo.id;
            /*获取充值列表信息*/
            getChargeList(function (chargeRules) {
                that.chargeList = chargeRules;
            });
            //点击点好前判断是否还需要等待--
            if (that.waitRedMoney) {
                $.ajax({
                    url: baseUrl + "/wechat/customer/new/getWaitInfo",
                    type: "post",
                    async: false,
                    success: function (result) {
                        if (result.statusCode == "200") {
                            if (result.data.state == 1 || result.data.state == 3) {
                                that.waitRedMoney = false;
                            } else if (result.data.state == 0) {
                                that.waitRedMoney = true;
                            }
                        } else {
                            that.waitRedMoney = false;
                        }
                    }
                });
            }

            if (that.waitRedMoney) {
                that.$dispatch("emptyMessage", "排队中,请耐心等待,入座后可扫描桌码即刻下单", 3000);
                //if(that.waitRedMoney){
                //    $.ajax({
                //        url: baseUrl + "/geekqueuing/waitModel/getWaitState",
                //        type: "post",
                //        data: {
                //            brandId: brand.id,
                //            id : getParam("waitId")
                //        },
                //        success: function (result) {
                //
                //            if(result.code == "200"){
                //                if(result.rightShop == 1){  //店铺正确
                //                    if(result.data.state == 0){ //等位状态
                //                        that.waitRedMoney = true;
                //                        that.waitId = getParam("waitId");
                //                    }else{
                //                        that.waitRedMoney = false;
                //                    }
                //
                //                    if(result.data.state == 1){
                //                        that.useWaitMoney = true;
                //                        that.waitMoney = result.data.finalMoney;
                //                        that.waitId = getParam("waitId");
                //                    }
                //                }else{
                //                    that.waitRedMoney = false;
                //                    that.useWaitMoney = false;
                //                }
                //            }else{
                //                that.waitRedMoney = false;
                //            }
                //        }
                //    });
                //
                //}else{
                //    $.ajax({
                //        url: baseUrl + "/wechat/customer/new/getWaitInfo",
                //        type: "post",
                //        success: function (result) {
                //            if(result.statusCode == "200"){
                //                if(result.data.state == 1){
                //                    that.waitRedMoney = false;
                //                    that.useWaitMoney = true;
                //                    that.waitMoney = result.data.finalMoney;
                //                    that.waitId = result.data.id;
                //                }else if (result.data.state == 0){
                //                    that.waitId = result.data.id;
                //                    that.waitRedMoney = true;
                //                }
                //            }else{
                //                that.useWaitMoney = false;
                //                that.waitRedMoney = false;
                //            }
                //        }
                //    });
                //}
                return;
            } else {
                /**
                 * 此处必须同步
                 * 如果需要async true的话  可能会出现bug  ------wyj
                 */
                var groupIdIt = null;
                if(groupId != undefined && groupId != null && groupId != ""){
                    groupIdIt = groupId;
                }
                $.ajax({
                    url: baseUrl + "/wechat/customer/new/lastOrderByCustomer",
                    type: "post",
                    data: {customerId:customerInfo.id, shopId:shopInfo.id, groupId: groupIdIt, tableNumber: tableNumber},
                    async: false,
                    success: function (result) {
                        if (result.data) {
                            //同步人员信息（主要为了余额）
                            getCustomer(function (customer) {
                                that.customer = customer;
                            });
                            //if(result.data.orderState == 2 || result.data.orderState == 10){
                            //	that.$dispatch("remindMessage", "其他伙伴已为您买单~", 2000);
                            //	setTimeout(function(){
                            //		that.$dispatch("to-my-page");
                            //	},2000);
                            //	return;
                            //}
                            if (result.data.allowContinueOrder && result.data.tableNumber != null) {
                                that.showContinue = true;
                                that.customerCountNow = result.data.customerCount;
                                that.parentId = result.data.id;
                                that.firstPayType = result.data.payType;
                                that.distributionModeId = result.data.distributionModeId;
                                that.tableNumber = result.data.tableNumber;
                                groupId = result.data.groupId;
                                if(groupId != null){
                                    that.loadShopCartGroup(1, groupId, function () {
                                    });
                                }
                                if (getParam("orderBossId") == null) {
                                    $.ajax({
                                        url: baseUrl + "/wechat/order/new/getOrderDetail",
                                        type: "post",
                                        data: {id: result.data.id},
                                        dataType: "json",
                                        success: function (res) {
                                            var orderItems = [];
                                            var orderItemAll = [];
                                            for (var i = 0; i < res.data.orderItems.length; i++) {
                                                if (res.data.orderItems[i].type != 4 && res.data.orderItems[i].type != 6) {
                                                    orderItems.push(res.data.orderItems[i]);
                                                }
                                                if (res.data.orderItems[i].type != 4) {
                                                    orderItemAll.push(res.data.orderItems[i]);
                                                }
                                            }
                                            that.orderBoss = res.data;
                                            that.orderBossItem = orderItems;
                                            that.orderBossItemAll = orderItemAll;
                                            that.orderBossCanhePrice = res.mealFeeNumber;
                                            setTimeout(function () {
                                                that.reflushOrderList();
                                            }, 500);
                                        }
                                    });
                                }
                            }else{
                                that.parentId = null;
                                that.tableNumber = null;
                            }
                        }
                    }
                });

                if (this.shopCart.totalNumber == 0) {
                    this.$dispatch("emptyMessage", "还没有添加产品~", 120500);
                    this.closeCreateOrder();
                } else {
                    this.allSetting = allSetting;
                    this.shopInfo = shopInfo;
                    if (showRemind && this.hasRemind) {
                        this.remindDialog.articles = this.hasRemind;
                        var count = 0;
                        for (var i = 0; i < this.remindDialog.articles.length; i++) {
                            var article = this.remindDialog.articles[i];
                            if (article.currentWorkingStock == 0 || article.isEmpty) {
                                count += 1;
                            }
                        }
                        if (count == this.remindDialog.articles.length) {
                            this.remindDialog.show = false;
                            this.remindDialog.articles = [];
                            this.showCreateOrder(false);
                        } else {
                            this.remindDialog.show = true;
                        }

                        this.$nextTick(function () {
                            var list = $(this.$el).find(".remind-list");
                            var pH = list.parent().height();
                            list.siblings().each(function () {
                                pH -= $(this).height();
                            })
                            list.height(pH);
                            new IScroll(list.get(0), {
                                probeType: 2,
                                click: iScrollClick(),
                            });
                        });
                        return false;
                    }
                    /*开启多人点餐未扫码提示扫码*/
                    if (allSetting.openManyCustomerOrder == 1 && shopInfo.openManyCustomerOrder == 1 && (getParam("tableNumber") == null && groupId == null) && this.tableNumber == null) {
                        that.groupScanPage.show = true;
                        return;
                    }
                    //桌号不能超过5位
                    if ((this.tableNumber + "").length >= 5) {
                        this.tableNumber = null;
                    }
                    /*如果没有桌号并且没有扫码,弹出选择就餐模式*/
                    if (shopInfo.isChoiceMode && this.tableNumber == null && !scan && this.distributionModeId != 2) {
                        this.choiceModeDialog.show = true;
                        return false;
                    }
                    if (shopInfo.isChoiceMode && !this.choiceModeDialog.mode && this.tableNumber == null && this.distributionModeId != 2) {  //是否手动选择模式
                        if (getParam("tableNumber") == null) {
                            this.choiceModeDialog.show = true;
                            return false;
                        }
                    } else if (shopInfo.isChoiceMode && !this.choiceModeDialog.mode && this.tableNumber != null && this.parentId == null && shopInfo.sweepMode == 1 && this.distributionModeId != 2) {
                        this.choiceModeDialog.show = true;
                        return false;
                    }
                    if (getParam("tableNumber") == null && (shopInfo.shopMode == 1 || shopInfo.shopMode == 5) && this.tableNumber == null) {
                        if (this.distributionModeId == 3 & shopInfo.continueOrderScan == 0) {

                        } else {
                            this.penScan();
                            return false;
                        }
                    }

                    var that = this;
                    getCouponList(1, function (coupon) {
                        that.allCoupon = coupon;
                        if (shopInfo.openManyCustomerOrder == 1) {
                            loadShopCart(1, groupId, function (res) {
                                if(groupId != null && res.totalArticleCount == 0){
                                    that.groupCreateOrder = false;
                                    that.$dispatch("remindMessage", "其他小伙伴已为您买单~", 4000);
                                }else{
                                    that.groupCreateOrder = true;
                                    if (!that.showContinue && that.distributionModeId == 1 && !that.customerCountNow
                                        && allSetting.isUseServicePrice == 1 && shopInfo.isUseServicePrice == 1) {
                                        that.numberKeyboard.show = true;
                                    }
                                }
                            });
                        } else {
                            that.isCreateOrder = true;
                            if (!that.showContinue && that.distributionModeId == 1 && !that.customerCountNow
                                && allSetting.isUseServicePrice == 1 && shopInfo.isUseServicePrice == 1) {
                                that.numberKeyboard.show = true;
                            }
                        }
                        console.log("加载优惠券");
                        that.newOrder = true;
                        Vue.nextTick(function () {
                            setTimeout(function () {
                                that.reflushOrderList();
                                if (that.canUseCoupon.length > 0 && !that.couponId) {
                                    that.couponId = that.canUseCoupon[0].id;
                                }
                            }, 500);
                            afterShow && afterShow();
                        });
                    });
                }
            }
        },
        closeBossOrder: function (orderBoss) {
            var that = this;
            that.tableNumber = orderBoss.tableNumber;
            if (shopInfo.openManyCustomerOrder == 1) {
                showGroupList(customerInfo.id, that.tableNumber, shopInfo.id, function (result) {
                    if (result.success) {
                        groupId = result.groupId;
                        that.loadShopCartGroup();
                    }
                })
            }
            that.showContinue = true;
            that.openBossOrder = false;
        },
        closeCreateOrder: function () {
            this.isCreateOrder = false;
            this.groupCreateOrder = false;
            this.openBossOrder = false;
        },
        closeGroupOrder: function () {
            this.isCreateOrder = false;
            this.groupCreateOrder = false;
            this.openBossOrder = false;
        },
        checkCouponHoufu: function (value) {
            var that = this;
            that.couponListHoufu = [];
            getCouponList(1, function (coupon) {
                var couponLists = coupon.sort(that.keysert("value", "desc"));
                for (var i = 0; i < couponLists.length; i++) {
                    var c = couponLists[i];

                    if (c.minAmount <= value) {
                        if (!c.useWithAccount && this.checkAccount) {
                            continue;
                        }
                        that.couponListHoufu.push(c);
                    }
                }
                if (that.couponListHoufu.length > 0) {
                    that.canUseCouponHoufu = true;
                } else {
                    that.canUseCouponHoufu = false;
                }
            });
        },
        createOrder: function (shopMode, state) {
            var that = this;
            /*外卖地址为空验证*/
            if (!that.myAddress && that.distributionModeId == 2) {
                that.$dispatch("emptyMessage", "请选择地址~", 2000);
                return;
            }
            /*外卖默认地址超出配送范围验证*/
            if (that.distributionModeId == 2 && that.myAddress) {
                this.map = new BMap.Map();
                var pointA = new BMap.Point(this.myAddress.longitude, that.myAddress.latitude);
                var pointB = new BMap.Point(shopInfo.longitude, shopInfo.latitude);
                var distance = this.map.getDistance(pointA, pointB).toFixed(2);
                this.myDistance = Math.round(parseInt(distance) / 100) / 10;
                if (this.myDistance > shopInfo.apart) {
                    this.$dispatch("remindMessage", "抱歉客官,您的地址不在本店配送范围", 3000);
                    return;
                }
            }

            if (this.sleepCreateOrder) {
                return;
            }
            this.sleepCreateOrder = true;
            setTimeout(function () {//一秒后才能再次点击
                that.sleepCreateOrder = false;
            }, 3000);

            var orderForm = {};
            if (that.tableNumber != null) {
                orderForm.tableNumber = that.tableNumber;
            }
            if (this.parentId) {
                if (this.beforeId == null) {
                    orderForm.parentOrderId = this.parentId;
                }
                orderForm.tableNumber = this.tableNumber;
            }
            if (this.otherdata && this.otherdata.event == "continue-order") {
                var parentOrder = this.otherdata;
                if (this.beforeId == null) {
                    orderForm.parentOrderId = parentOrder.id;
                }
                orderForm.tableNumber = parentOrder.tableNumber;
                orderForm.verCode = parentOrder.verCode;
                orderForm.customerCount = parentOrder.customerCount;
            } else if (getParam("tableNumber") != "" && getParam("tableNumber") != null) {
                var tableNumber = getParam("tableNumber");
                orderForm.tableNumber = tableNumber;
                if (this.allSetting.isUseServicePrice == 1 && this.shopInfo.isUseServicePrice == 1) {
                    orderForm.customerCount = that.customerCountNow;
                }
            }
            if (this.allSetting.isUseServicePrice == 1 && this.shopInfo.isUseServicePrice == 1) {
                orderForm.customerCount = that.customerCountNow;
            }
            orderForm.customerId = this.customer.id;
            orderForm.distributionModeId = that.distributionModeId;
            //  这里的逻辑是如有可用优惠卷默认调用第一张
            // if (that.canUseCoupon.length > 0) {
            //     that.couponId = that.canUseCoupon[0].id;
            // }
            if (this.canUseCoupon && this.canUseCoupon.length > 0 && this.couponId && orderForm.parentOrderId == null && shopMode == 6) {
                orderForm.useCoupon = this.couponId + "";
            } else if (this.canUseCoupon && this.canUseCoupon.length > 0 && this.couponId) {
                orderForm.useCoupon = this.couponId + "";
            }
            if (this.useAccount) {
                orderForm.useAccount = true;
            } else {
                orderForm.useAccount = false;
            }
            if (this.orderRemarksText != "" && this.orderRemarksText.length > 0) {
                orderForm.remark = this.orderRemarksText;
            }
            orderForm.orderItems = [];
            for (var i = 0; i < this.shopCart.items.length; i++) {
                var item = this.shopCart.items[i];
                var orderItem;
                if (item.data.recommendList != null && item.data.recommendList.length > 0) {
                    for (var k = 0; k < item.data.recommendList.length; k++) {
                        var recommend = item.data.recommendList[k];
                        var recommendResult = {
                            articleId: recommend.articleId,
                            count: recommend.count,
                            type: 6,
                            recommendId: item.data.recommendId,
                            parentId: item.data.id
                        }
                        orderForm.orderItems.push(recommendResult);
                    }
                }
                if (item.type == 5) {
                    orderItem = {
                        articleId: item.id,
                        count: item.data.count,
                        type: item.type,
                        name: item.name,
                        parentId: item.data.id,
                        price: item.data.realPrice
                    };
                } else if (item.type == 6) {
                    orderItem = {
                        articleId: item.id,
                        count: item.data.number,
                        type: 1
                    };
                } else if (item.type == 8) {
                    orderItem = {
                        articleId: item.id,
                        count: item.data.count,
                        type: item.type,
                        name: item.name,
                        price: item.data.realPrice,
                        parentId: item.data.id,
                        weight: item.data.weightPackageList.currentItem[0].weight
                    };
                } else {
                    orderItem = {
                        articleId: item.id,
                        count: item.data.number,
                        type: item.type
                    };
                }
                if (item.type == 3) {
                    orderItem.mealItems = [];
                    for (var n = 0; n < item.data.mealAttrs.length; n++) {
                        var mealAttr = item.data.mealAttrs[n];
                        for (var k = 0; k < mealAttr.currentItem.length; k++) {
                            orderItem.mealItems.push(mealAttr.currentItem[k].id);
                        }
                    }
                }
                //保存此菜品当前时间段的折扣,用于和后台做对比（1：无规格单品，2：老规格单品，3：套餐主品，5：新规格单品）
                if (item.type == 1 || item.type == 2 || item.type == 3 || item.type == 5 || item.type == 6 || item.type == 8) {
                    if (item.type == 2) {
                        var id = item.id.substr(0, item.id.indexOf('@'));
                        orderItem.discount = this.findArticleById(id).discount;
                    } else {
                        orderItem.discount = this.findArticleById(item.id).discount;
                    }
                }
                orderForm.orderItems.push(orderItem);
            }
            orderForm.waitMoney = this.waitMoney;
            orderForm.waitId = this.waitId;
            if (this.servicePrice && orderForm.parentOrderId == null) {
                orderForm.servicePrice = this.servicePrice;
                if(this.memberActivityCustomerType){
                    orderForm.servicePrice = orderForm.servicePrice * this.memberActivityCustomer.discount;
                }
            } else {
                orderForm.servicePrice = 0;
            }
            if (allSetting.isMealFee == 1 && this.shop.isMealFee == 1 && this.distributionModeId != 1) {
                orderForm.mealFeePrice = this.mealFeePrice;
                orderForm.mealAllNumber = this.mealAllNumber;
                if(this.memberActivityCustomerType){
                    orderForm.mealFeePrice = orderForm.mealFeePrice * this.memberActivityCustomer.discount;
                }
            } else {
                orderForm.mealFeePrice = 0;
                orderForm.mealAllNumber = 0;
            }
            orderForm.beforeId = this.beforeId;
            orderForm.paymentAmount = this.finalAmount;
            orderForm.memberDiscountMoney = this.memberDiscountAmount;
            if(this.memberActivityCustomerType){
                orderForm.memberDiscount = this.memberActivityCustomer.discount;
            }
            orderForm.groupId = groupId;
            if (shopInfo.isChoiceMode) {
                orderForm.distributionModeId = this.distributionModeId;
            }

            if (orderForm.distributionModeId != 1) {
                orderForm.totalPrice += this.mealFeePrice;
                orderForm.customerCount = 0;
            }
            /*如果选择了默认地址取默认——cz*/
            if (orderForm.distributionModeId == 2) {
                orderForm.customerAddressId = this.myAddress.id;
            }
            //如果没有绑定手机号  且使用了余额买单，则弹出绑定手机号码页面
            $.ajax({
                url: baseUrl + "/wechat/customer/new/customer",
                type: "post",
                async: false,
                success: function (user) {
                    that.$dispatch("refresh-customer", user.data);
                    if (that.checkAccount == true && user.data.isBindPhone == false && user.data.account > 0 && state == "pay") {
                        console.log("提示注册");
                        that.groupCreateOrder = false;
                        that.isCreateOrder = false;
                        that.$dispatch("bind-phone");
                        return;
                    } else {
                        if (shopMode == 6 && state == "buy") {
                            if (that.customerCountNow > 0) {
                                orderForm.customerCount = that.customerCountNow;
                            } else {
                                orderForm.customerCount = $("#customerCount").val();
                            }
                            orderForm.payType = 1;
                        } else {
                            orderForm.payType = 0;
                        }
                        console.log("已注册");

                        var orderFlag = true;
                        if (orderForm.parentOrderId != null) {
                            getOrderInfoState(orderForm.parentOrderId, function (o) {
                                if (!o.allowContinueOrder) {
                                    that.$dispatch("save-order-fail", orderForm);
                                    orderFlag = false;
                                }
                            });
                        }
                        if (orderFlag) {
                            checkCustomerSubscribe(function (c) {
                                if (c.success) {
                                    if (c.subscribe == 1 || state == "buy" || !that.checkAccount || (that.checkAccount && user.remain == 0)) {
                                        if (that.finalAmount == 0) {
                                            if (that.createOrderBtn) {
                                                return;
                                            }
                                            that.createOrderBtn = true;
                                            setTimeout(function () {//10秒后才能再次点击
                                                that.createOrderBtn = false;
                                            }, 3000);
                                            if (shopMode == 5 || orderForm.payType == 1) {
                                                that.$dispatch("save-order-houfu", orderForm);
                                            } else {
                                                that.$dispatch("save-order", orderForm);
                                            }
                                        } else {
                                            console.log("需要支付金额大于0,打开微信支付弹窗");
                                            //this.$dispatch("show-wechat-pay", orderForm);
                                            //默认直接调用微信支付方法
                                            if (shopMode == 5 || orderForm.payType == 1) {
                                                that.$dispatch("save-order-houfu", orderForm);
                                            } else {
                                                if (shopMode == 6) {
                                                    that.payStates = true;
//                      	if(this.customerCountIndex > 0){
//                      		this.$dispatch("emptyMessage","买单后，加菜将会再次收取服务费哦", 2000);
//                      	}
                                                    that.$dispatch("show-wechat-pay", orderForm);
                                                } else {
                                                    if (allSetting.aliPay == 1 && shopInfo.aliPay == 1) {
//                              this.$dispatch("emptyMessage","买单后，加菜将会再次收取服务费哦", 2000);
                                                        that.payStates = true;
                                                        setTimeout(function () {
                                                            that.$dispatch("show-wechat-pay", orderForm);
                                                        }, 1000)
                                                    } else {
                                                        orderForm.payMode = 1;
                                                        that.payOrderByWeChat(orderForm);
                                                    }
                                                }
                                            }
                                        }
                                    } else if (c.subscribe == 0 && user.remain > 0 && that.checkAccount) {
                                        that.$dispatch("show-attention-page");
                                    }
                                }
                            });
                        } else {
                            return;
                        }
                    }
                }
            });
        },
        payBossOrder: function (order, money) {
            var that = this;
            if (this.payBossOrderBtn) {
                return;
            }
            this.payBossOrderBtn = true;
            setTimeout(function () {
                that.payBossOrderBtn = false;
            }, 3000);
            $.ajax({
                url: baseUrl + "/wechat/customer/new/customer",
                type: "post",
                async: false,
                success: function (user) {
                    that.$dispatch("refresh-customer", user.data);
                    if (that.checkAccount == true && user.data.isBindPhone == false && user.data.account > 0) {
                        that.openBossOrder = false;
                        that.$dispatch("bind-phone");
                        return;
                    } else {
                        if (money > 0) {
                            if (that.canUseCouponHoufu && that.couponListHoufu.length > 0 && that.couponId) {
                                order.useCoupon = that.couponId + "";
                            }
                            order.waitMoney = that.waitMoney;
                            order.waitId = that.waitId;
                            order.originalAmount = money;
                            that.$dispatch("show-wechat-pay", order);
                        } else {
                            checkCustomerSubscribe(function (c) {
                                if (c.success) {
                                    if (c.subscribe == 1) {
                                        var couponId = null;
                                        if (that.canUseCouponHoufu && that.couponListHoufu.length > 0 && that.couponId) {
                                            couponId = that.couponId + "";
                                        }
                                        var useRedMoney = 0;
                                        if (order.amountWithChildren > 0) {
                                            useRedMoney = order.amountWithChildren;
                                        } else {
                                            useRedMoney = order.paymentAmount;
                                        }
                                        afterPay(order.id, couponId, useRedMoney.toFixed(2), 0, that.waitMoney, 0, function (result) {
                                            if (result.success) {
                                                location.href = baseUrl + "/wechat/index?subpage=my&payMode=houfuSuccess&qiehuan=qiehuan&orderId=" + order.id + "&showRedMoney=true&articleBefore=1";
                                                //window.location.href = "/wechatNew/src/index.html?subpage=my&payMode=houfuSuccess&qiehuan=qiehuan&orderId=" + order.id + "&showRedMoney=true";
                                            } else {
                                                that.$dispatch("save-orderBoss-fail", order, result);
                                            }
                                        });
                                    } else if (c.subscribe == 0) {
                                        that.$dispatch("show-attention-page");
                                    }
                                }
                            });
                        }
                    }
                }
            });
        },
        payOrderByWeChat: function (order) {
            if (this.createOrderBtn) {
                return;
            }
            this.createOrderBtn = true;
            var that = this;
            setTimeout(function () {//10秒后才能再次点击
                that.createOrderBtn = false;
            }, 3000);
            if (order.id) {
                this.$dispatch("pay-order", "wechat", order);
            } else {
                console.log("订单为为保存的订单，保存订单先");
                var that = this;
                this.$dispatch("save-order", order, function (order) {
                    //orderForm=order;
                    that.createOrderBtn = false;
                    that.payOrderByWeChat(order);
                });
            }
        },
        repayOrderByWeChat: function (order) {
            if (order.id) {
                var that = this;
                this.$dispatch("save-order", order, function (order) {
                    this.$dispatch("repay-order", order);
                });
            } else {
                console.log("订单为为保存的订单，保存订单先");
                var that = this;
                this.$dispatch("save-order", order, function (order) {
                    this.$dispatch("pay-order", "wechat", order);
                });
            }
        },
        resetDomHeight: function () {
            var searchBar = $(".article-container");
            var content = $(".article-family-list");
            var articleContent = $(".article-list-wapper");
            content.height(searchBar.height() - 45);
            articleContent.height(searchBar.height() - 44);
        },
        refreshArticleList: function () {
            var dom = $(this.$el);
            this.resetDomHeight();
            this.artListIsc = new IScroll(dom.find(".article-list-wapper").get(0), {
                probeType: 2,
                click: iScrollClick(),
            });
            this.famListIsc = new IScroll(dom.find(".article-family-list").get(0), {
                click: iScrollClick(),
            });
            var that = this;
            var recommendId = null;
            var familyId = null;
            this.artListIsc.on("scroll", function () {
                dom.find(".article-family-group").each(function () {
                    var dom = $(this);
                    var position = dom.position();
                    if (position.top >= 0) {
                        return false;
                    }
                    familyId = dom.data("family-id");
                    recommendId = dom.data("recommend-id");
                });
                if (that.currentFamily.id == dom.data("family-id") && that.choiceList) {
                    that.choiceList = false;
                } else if (that.currentRecommend.id == dom.data("recommend-id") && !that.choiceList) {
                    that.choiceList = true;
                }
                that.currentFamily = {id: familyId};
                that.currentRecommend = {id: recommendId};
            });
        },
        reflushArticleList: function () {
            if (this.artListIsc) {
                this.artListIsc.refresh();
                this.famListIsc.refresh();
            } else {
                var dom = $(this.$el);
                this.resetDomHeight();
                this.artListIsc = new IScroll(dom.find(".article-list-wapper").get(0), {
                    probeType: 2,
                    click: iScrollClick(),
                });
                this.famListIsc = new IScroll(dom.find(".article-family-list").get(0), {
                    click: iScrollClick(),
                });
                var that = this;
                var recommendId = null;
                var familyId = null;
                this.artListIsc.on("scroll", function () {
                    dom.find(".article-family-group").each(function () {
                        var dom = $(this);
                        var position = dom.position();
                        if (position.top >= 0) {
                            return false;
                        }
                        familyId = dom.data("family-id");
                        recommendId = dom.data("recommend-id");
                    });
                    if (that.recommendTypeList.length > 0) {
                        if (that.currentFamily.id == dom.data("family-id") && that.choiceList) {
                            that.choiceList = false;
                        } else if (that.currentRecommend.id == dom.data("recommend-id") && !that.choiceList) {
                            that.choiceList = true;
                        }
                    } else {
                        that.currentFamily.id == dom.data("family-id");
                    }
                    that.currentFamily = {id: familyId};
                    that.currentRecommend = {id: recommendId};
                });
            }
        },
        reflushOrderList: function () {
        	var that = this;
            var shopCartItems = $(this.$el).find(".shop-cart-items");
            var wH = $(window).height();
            var opH = $(this.$el).find(".order-operator-div").height();
            var totalPrice = $(this.$el).find(".total-price");
            var pH = totalPrice.height();
            var maxH = wH - opH - 10 - pH;

            /**
             * 如果高度不够，则添加bottom
             */
            if (shopCartItems.children().height() < maxH) {
                totalPrice.css({
                    marginBottom: maxH - shopCartItems.children().height()
                });
            } else {
                shopCartItems.css({
                    maxHeight: maxH
                });
            }
            that.duorenShopCartIsc = new IScroll(".shop-cart-items", {
                click: iScrollClick(),
            });
        },
        useChecked: function (e) {
            useCheckedAccountLog(this.checkAccount, function (r) {
            });
            this.checkAccount = !this.checkAccount;
        },
        backToWaitPage: function (e) {
            var url = getParam("baseUrl");
            if (url.indexOf("https") > -1) {
                url.replace("https", "http");
            }
            window.location.href = url + "/geekqueuing/waitModel/getQRCodeJump?shopId=" + shopInfo.id + "&jump=1";
        },
        getPrice: function (article) {
            return article.price;
            //if(article.articlePrices.length==0){
            //
            //}else{
            //	var min = null;
            //	for(var i=0;i<article.articlePrices.length;i++){
            //		var up = article.articlePrices[i];
            //		if(min==null||min>up.price){
            //			min = up.price;
            //		}
            //	}
            //	return min;
            //}
        },
        sortUnitList: function (units, currentUnits, discountNow) {
            var unitList = [];
            var uid = null;
            if (!units) {
                return unitList;
            }
            for (var i = 0; i < units.length; i++) {
                //获取不同规格分类的类型（口味、分量）
                if (uid == null || uid.indexOf(units[i].id) == -1) {
                    uid = uid + units[i].id + ",";
                    var currentItem = [];
                    var details = [];
                    for (var j = 0; j < units.length; j++) {
                        //获取该分类类型下的所有规格
                        if (units[j].id == units[i].id) {
                            var flag = false;
                            //判断该规格是否被选中
                            for (var k = 0; k < currentUnits.length; k++) {
                                if (units[j].detailId == currentUnits[k].unitNewId) {
                                    flag = true;
                                }
                            }
                            details.push({
                                id: units[j].detailId,
                                name: units[j].detailName,
                                click: flag,
                                price: units[j].detailPrice * discountNow / 100
                            });
                            if (flag) {
                                currentItem.push({
                                    id: units[j].detailId,
                                    name: units[j].detailName,
                                    click: flag,
                                    price: units[j].detailPrice * discountNow / 100
                                });
                            }
                        }
                    }
                    unitList.push({
                        currentItem: currentItem,
                        name: units[i].name,
                        choiceType: units[i].choiceType,
                        sort: units[i].sort,
                        details: details,
                        show: true,
                        isEmpty: false
                    });
                }
            }
            return unitList;
        },
        penScan: function () {
            var that = this;
            /*扫码下单时提示先输入就餐人数*/
            if (that.customerCountNow == null && that.distributionModeId == 1 && allSetting.isUseServicePrice == 1 && shopInfo.isUseServicePrice == 1) {
                that.numberKeyboard.show = true;
                return;
            }
            ;
            scanTableNumber(function (data) {
                getShopInfo(function (shop) {
                    if (shop.isNewQrcode == 0) {
                        var reg_allNumber = /^[\d]+$/;
                        var reg_tableNumber = /tableNumber=[\d]+/;
                        if (reg_allNumber.test(data)) {
                            that.tableNumber = data;
                        } else if (reg_tableNumber.test(data)) {
                            var tbNumber = data.match(reg_tableNumber)[0].match(/[\d]+/)[0];
                            if (tbNumber.length >= 5) {
                                that.$dispatch("remindMessage", "扫码获取的桌号长度过长，请重新扫码", 4000);
                                return;
                            }
                            that.tableNumber = tbNumber;
                        }
                        var reg_shopId = /shopId=[a-zA-Z0-9]+/;
                        if (reg_shopId.test(data)) {
                            that.shopId = data.match(reg_shopId)[0].split("=")[1];
                            if (that.shopId == null || that.tableNumber == null) {
                                that.tableNumber = null;
                                that.$dispatch("remindMessage", "未识别改格式的数据:" + data, 4000);
                                return;
                            }
                            if (that.shopId != shop.id) {
                                that.tableNumber = null;
                                that.$dispatch("remindMessage", "二维码与门店信息不符！", 4000);
                                return;
                            }
                        }
                        if (that.shopId != null && that.tableNumber != null) {
                            that.showCreateOrder(false, function () {
                            }, true);
                        }
                        var reg_vv = /vv=[-.-_A-Za-z0-9]+/;
                        if (reg_vv.test(data)) {
                            getTable(data.match(reg_vv)[0].split("=")[1], function (res) {
                                if (res != null || res != "") {
                                    if (res.shopDetailId != shop.id) {
                                        that.$dispatch("remindMessage", "该二维码与门店信息不符！", 4000);
                                        return;
                                    }
                                    if (res.state == 0) {
                                        that.$dispatch("remindMessage", "该二维码无效！", 4000);
                                        return;
                                    }
                                    that.shopId = res.shopDetailId;
                                    that.tableNumber = res.tableNumber;
                                    if (that.tableNumber.length >= 5) {
                                        that.$dispatch("remindMessage", "扫码获取的桌号长度过长，请重新扫码", 4000);
                                        return;
                                    }
                                }
                                if (that.shopId == null || that.tableNumber == null) {
                                    that.$dispatch("remindMessage", "未识别改格式的数据:" + data, 4000);
                                    return;
                                }
                                penScanLog(customerInfo.id, data.match(reg_vv)[0].split("=")[1], function (r) {
                                });
                                that.showCreateOrder(false, function () {
                                }, true);
                            });
                        }
                    } else {
                        var reg_vv = /vv=[-.-_A-Za-z0-9]+/;
                        that.tableNumber = null;
                        that.shopId = null;
                        if (reg_vv.test(data)) {
                            getTable(data.match(reg_vv)[0].split("=")[1], function (res) {
                                if (res != null || res != "") {
                                    if (res.shopDetailId != shop.id) {
                                        that.$dispatch("remindMessage", "该二维码与门店信息不符！", 4000);
                                        return;
                                    }
                                    if (res.state == 0) {
                                        that.$dispatch("remindMessage", "该二维码无效！", 4000);
                                        return;
                                    }
                                    that.shopId = res.shopDetailId;
                                    that.tableNumber = res.tableNumber;
                                    if (that.tableNumber.length >= 5) {
                                        that.$dispatch("remindMessage", "扫码获取的桌号长度过长，请重新扫码", 4000);
                                        return;
                                    }
                                }
                                if (that.shopId == null || that.tableNumber == null) {
                                    that.$dispatch("remindMessage", "未识别改格式的数据:" + data, 4000);
                                    return;
                                }
                                penScanLog(customerInfo.id, data.match(reg_vv)[0].split("=")[1], function (r) {
                                });
                                that.showCreateOrder(false, function () {
                                }, true);
                            });
                        } else {
                            that.$dispatch("remindMessage", "该门店二维码已启用加密服务，请核实您的二维码！", 4000);
                            return;
                        }
                    }
                });
            });
        },

        loadShopCartGroup: function () {
            var that = this;
            loadShopCart(1, groupId, function (result) {
                if (!result.success) {
                    that.$dispatch("emptyMessage", result.message, 4000);
                    that.showGroup();
                } else {
                    for (var k = 0; k < that.articleList.length; k++) {
                        that.articleList[k].number = 0;
                        that.articleList[k].count = 0;
                        that.articleList[k].recommendList = [];
                        if (that.articleList[k].articlePrices.length > 0) {
                            for (var i = 0; i < that.articleList[k].articlePrices.length; i++) {
                                that.articleList[k].articlePrices[i].number = 0;
                            }
                        }
                    }
                    for (var k = 0; k < that.reArticleList.length; k++) {
                        that.reArticleList[k].number = 0;
                        that.reArticleList[k].count = 0;
                        that.reArticleList[k].recommendList = [];
                        if (that.reArticleList[k].articlePrices.length > 0) {
                            for (var i = 0; i < that.reArticleList[k].articlePrices.length; i++) {
                                that.reArticleList[k].articlePrices[i].number = 0;
                            }
                        }
                    }
                    that.unitArticleList = [];
                    that.weightPackageArticleList = [];
                    that.remmcondArticleList = [];
                    that.articleMealsMap = new HashMap();
                    var shopcart = result.data;
                    for (var i = 0; i < shopcart.length; i++) {
                        var c = shopcart[i];
                        var art_id = c.articleId;
                        var u_art;
                        var articlePrice = 0;
                        if (c.shopType == 1) {
                            u_art = that.findArticleById(art_id);
                            if (art_id.indexOf("@") > -1) {
                                var aid = art_id.substr(0, art_id.indexOf('@'));
                                var art = that.findArticleById(aid);
                                if (art) {
                                    u_art.mealFeeNumber = art.mealFeeNumber;
                                }
                                articlePrice = 1;
                            }
                            if (u_art) {
                                u_art.shopCartId = c.id;
                            }
                            if (u_art) {
                                if (u_art.customerList) {
                                    u_art.customerList.push(c.customerId);
                                } else {
                                    u_art.customerList = [];
                                    u_art.customerList.push(c.customerId);
                                }
                            }
                            that.customerArticleCount.put(c.customerId + art_id, c.number);
                        } else if (c.shopType == 2) {
                            var artMeal = that.findArticleById(art_id);
                            if (artMeal) {
                                artMeal.shopCartId = c.id;
                                artMeal.customerList.push(c.customerId);
                                //先清空套餐内所有属性下的选中项
                                for (var k = 0; k < artMeal.mealAttrs.length; k++) {
                                    artMeal.mealAttrs[k].currentItem = [];
                                }
                                that.customerArticleCount.put(c.customerId + art_id, c.number);
                            }
                        } else if (c.shopType == 4) {
                            var artRem = that.findArticleById(art_id);
                            artRem.customerList.push(c.customerId);
                            artRem.shopCartId = c.id;
                            that.customerArticleCount.put(c.customerId + art_id, c.number);
                        } else if (c.shopType == 6) {
                            var artUnit = that.findArticleById(art_id);
                            if (artUnit) {
                                artUnit.shopCartId = c.id;
                                that.customerArticleCount.put(c.customerId + art_id, c.number);
                            }
                        } else if (c.shopType == 8) {
                            var artUnit = that.findArticleById(art_id);
                            if (artUnit) {
                                artUnit.shopCartId = c.id;
                                that.customerArticleCount.put(c.customerId + art_id, c.number);
                            }
                        }
                        if(c.shopType == 1){
                            if (articlePrice == 0) {
                                if (u_art && u_art.articleType == 1) {
                                    u_art.number += c.number;
                                }
                            } else {
                                if (u_art && u_art.article.articleType == 1) {
                                    u_art.number += c.number;
                                }
                            }
                        }
                    }
                    for (var i = 0; i < shopcart.length; i++) {
                        var e = shopcart[i];
                        if (e.shopType == 2) {
                            var meal = that.findArticleById(e.articleId);
                            try {
                                meal.shopCartId = e.id;
                            } catch(e) {
                                console.log("出错了" + e);
                            }
                            if (meal) {
                                for (var k = 0; k < meal.mealAttrs.length; k++) {
                                    meal.mealAttrs[k].currentItem = [];
                                }
                                var currentItem = e.currentItem;
                                for (var k = 0; k < currentItem.length; k++) {
                                    for (var j = 0; j < meal.mealAttrs.length; j++) {
                                        if (meal.mealAttrs[j].id == currentItem[k].attrId) {
                                            var child = that.findMealItemById(e.articleId, meal.mealAttrs[j].id, currentItem[k].articleId);
                                            meal.mealAttrs[j].currentItem.push(child);
                                        }
                                    }
                                }
                                meal.realPrice = that.getMealsReadPrice(meal);
                                var mm = meal;
                                mm.customerList = [];
                                mm.customerList.push(e.customerId);
                                u_art = that.findMeals(mm);
                            }
                        } else if (e.shopType == 4) {
                            var meal = that.findArticleById(e.articleId);
                            meal.number = e.number;
                            meal.uuid = e.uuid;
                            meal.recommendList = [];
                            for (var k = 0; k < e.currentItem.length; k++) {
                                var art = that.findArticleById(e.currentItem[k].articleId);
                                if(art){
                                    var recomemnd = {
                                        articleId: art.id,
                                        price: art.realPrice,
                                        articleName: art.name,
                                        count: e.currentItem[k].number,
                                        mealFeeNumber: art.mealFeeNumber,
                                        maxCount: 0,
                                        currentWorkingStock: art.currentWorkingStock,
                                        show: true,
                                        isEmpty: false
                                    };
                                    meal.recommendList.push(recomemnd);
                                }
                            }
                            var u = {
                                name: meal.name,
                                id: meal.id,
                                shopCartId: e.id,
                                uuid: e.uuid,
                                articleId: meal.id,
                                realPrice: meal.realPrice,
                                orgPrice: meal.originalAmount,
                                originalAmount: meal.originalAmount,
                                price: meal.realPrice,
                                fansPrice: meal.fansPrice,
                                orgName: meal.name,
                                customerList: [],
                                hasUnit:[],
                                unitList: [],
                                count: e.number,
                                number: e.number,
                                articlePrices:[],
                                articleType: meal.articleType,
                                mealFeeNumber: meal.mealFeeNumber,
                                articleFamilyId: meal.articleFamilyId,
                                recommendList: meal.recommendList,
                                recommendId: meal.recommendId,
                                showBig: meal.showBig,
                                photoSmall: meal.photoSmall
                            };
                            u.customerList.push(e.customerId);
                            that.customerArticleCount.put(e.customerId + e.articleId, e.number);
                            if(meal.recommendId != null){
                                that.remmcondArticleList.push(u);
                            }else{
                                updateShopCartRecommend(e.id);
                            }
                        } else if (e.shopType == 6) {
                            var meal = that.findArticleById(e.articleId);
                            if (meal) {
                                meal.recommendList = [];
                                var name = meal.name;
                                var sum = meal.fansPrice ? meal.fansPrice : meal.price;
                                //规格
                                var discountNow = parseFloat(meal.discount) < 100 ? parseFloat(meal.discount) : 100;
                                for (var k = 0; k < e.unitList.length; k++) {
                                    var unit = that.findUnitDetailById(meal.id + e.unitList[k].unitNewId);
                                    if (unit) {
                                        name = name + "(" + unit.detailName + ")";
                                        sum = sum + unit.detailPrice * discountNow / 100;
                                    }

                                }
                                var units = that.findUnitByArticleId(meal.id);
                                var sortUnitList = that.sortUnitList(units, e.unitList, discountNow);
                                for (var m = 0; m < e.currentItem.length; m++) {
                                    var art = that.findArticleById(e.currentItem[m].articleId);
                                    //规格餐包
                                    var recomemnd = {
                                        articleId: art.id,
                                        price: art.realPrice * discountNow / 100,
                                        articleName: art.name,
                                        count: e.currentItem[m].number,
                                        maxCount: 0,
                                        mealFeeNumber: art.mealFeeNumber,
                                        currentWorkingStock: art.currentWorkingStock,
                                        show: true,
                                        isEmpty: false
                                    };
                                    meal.recommendList.push(recomemnd);
                                }
                                var u = {
                                    name: name,
                                    unitName: name,
                                    id: e.uuid,
                                    uuid: e.uuid,
                                    articleId: meal.id,
                                    realPrice: sum,
                                    orgPrice: meal.realPrice,
                                    originalAmount: meal.realPrice,
                                    orgName: meal.name,
                                    customerList: [],
                                    unitList: sortUnitList,
                                    count: e.number,
                                    mealFeeNumber: meal.mealFeeNumber,
                                    sum: sum,
                                    articleFamilyId: meal.articleFamilyId,
                                    recommendList: meal.recommendList,
                                    recommendId: meal.recommendId,
                                    showBig: meal.showBig,
                                    photoSmall: meal.photoSmall
                                };
                                u.customerList.push(e.customerId);
                                that.customerArticleCount.put(e.customerId + e.articleId, e.number);
                                that.unitArticleList.push(u);
                            }
                        } else if (e.shopType == 8) {
                            var meal = that.findArticleById(e.articleId);
                            if (meal) {
                                var name = meal.name;
                                var sum = meal.cattyMoney;
                                var weight = that.findWeightPackById(e.weightPackageId);
                                var a = {
                                    currentItem: [],
                                    details: [],
                                    name: weight.name
                                }
                                meal.recommendList = [];
                                for (var k = 0; k < weight.details.length; k++) {
                                    var w = weight.details[k];
                                    var b = {
                                        id: w.id,
                                        name: w.name,
                                        weight: w.weight,
                                        click: false
                                    }
                                    if (w.id == e.weightList[0].weightPackageId) {
                                        name = name + "(" + w.name + ")";
                                        sum = meal.cattyMoney * w.weight;
                                        b.click = true;
                                        a.currentItem.push(b);
                                    }
                                    a.details.push(b);
                                }
                                for (var m = 0; m < e.currentItem.length; m++) {
                                    var art = that.findArticleById(e.currentItem[m].articleId);
                                    //规格餐包
                                    var recomemnd = {
                                        articleId: art.id,
                                        price: art.realPrice,
                                        articleName: art.name,
                                        count: e.currentItem[m].number,
                                        maxCount: 0,
                                        mealFeeNumber: art.mealFeeNumber,
                                        currentWorkingStock: art.currentWorkingStock,
                                        show: true,
                                        isEmpty: false
                                    };
                                    meal.recommendList.push(recomemnd);
                                }
                                var u = {
                                    articleType: e.shopType,
                                    shopCartId: e.id,
                                    name: name,
                                    unitName: name,
                                    id: e.uuid,
                                    uuid: e.uuid,
                                    articleId: meal.id,
                                    realPrice: sum,
                                    orgPrice: sum,
                                    price: sum,
                                    originalAmount: sum,
                                    orgName: meal.name,
                                    customerList: [],
                                    unitList:[],
                                    count: e.number,
                                    mealFeeNumber: meal.mealFeeNumber,
                                    sum: sum,
                                    articleFamilyId: meal.articleFamilyId,
                                    recommendList: meal.recommendList,
                                    weightPackageList: a,
                                    weightPackageId: e.weightPackageId,
                                    recommendId: meal.recommendId,
                                    showBig: meal.showBig,
                                    photoSmall: meal.photoSmall
                                };
                                u.customerList.push(e.customerId);
                                that.customerArticleCount.put(e.customerId + e.uuid, e.number);
                                that.weightPackageArticleList.push(u);
                            }
                        }
                    }
                    for (var i = 0; i < that.articleList.length; i++) {
                        for (var j = 0; j < that.reArticleList.length; j++) {
                            if (that.articleList[i].id == that.reArticleList[j].id) {
                                that.reArticleList[j].count = that.articleList[i].count;
                                that.reArticleList[j].number = that.articleList[i].number;
                            }
                        }
                    }
                    that.groupArticleCount = result.totalArticleCount;
                    that.customerGroupList = result.customerGroup;
                    that.groupShopCart = result.data;
                }
                return result.success;
            });
        }
    },
    created: function () {
        var that = this;
        that.tableNumber = getParam("tableNumber");
        tableNumber = getParam("tableNumber");
        if(memberActivityCustomer!=null){
        	this.customerDiscount = memberActivityCustomer.discount*10;
        }       
        //--------------等位叫号判断-------------------------------
        if (getParam("tableNumber") != null && getParam("tableNumber") != "" && shopInfo.openManyCustomerOrder == 1 && turnIndex == 0) {
            showGroupList(customerInfo.id, getParam("tableNumber"), shopInfo.id, function (result) {
                if (result.success) {
                    groupId = result.groupId;
                    if (groupId != null && result.statusCode == 200) {
                        that.groupListInfo = result.data;
                        that.groupShow = true;
                        turnIndex = 1;
                    }
                }
            })
        }
        ;
        if (pageType == "waimai") {
            that.distributionModeId = 2;
        }
        // that.waitRedMoney = getParam("type") == "wait" ? true : false;
        //点击点好前判断是否还需要等待--
        $.ajax({
            url: baseUrl + "/wechat/customer/new/getWaitInfo",
            type: "post",
            async: false,
            success: function (result) {
                if (result.statusCode == "200") {
                    if (result.data.state == 1 || result.data.state == 3) {
                        that.waitRedMoney = false;
                    } else if (result.data.state == 0) {
                        that.waitRedMoney = true;
                    }
                } else {
                    that.waitRedMoney = false;
                }
            }
        });
        that.useWaitMoney = false;
        if (that.waitRedMoney || "jiaohao" == getParam("type")) {
            that.waitId = getParam("waitId");
        } else {
            $.ajax({
                url: baseUrl + "/wechat/customer/new/getWaitInfo",
                type: "post",
                success: function (result) {
                    if (result.statusCode == "200") {
                        if (result.data.state == 1 || result.data.state == 3) {
                            that.waitRedMoney = false;
                            that.useWaitMoney = true;
                            that.waitMoney = result.data.finalMoney;
                            that.waitId = result.data.id;
                        } else if (result.data.state == 0) {
                            that.waitId = result.data.id;
                            that.waitRedMoney = true;
                        }
                    } else {
                        that.useWaitMoney = false;
                        that.waitRedMoney = false;
                    }
                }
            });
        }
        //-----------等位叫号判断结束--------------
        if (getParam("orderBossId") != null) {
            $.ajax({
                url: baseUrl + "/wechat/order/new/getOrderDetail",
                type: "post",
                data: {id: getParam("orderBossId")},
                dataType: "json",
                success: function (result) {
                    if (result.data.amountWithChildren > 0) {
                        that.checkCouponHoufu(result.data.amountWithChildren);
                    } else {
                        that.checkCouponHoufu(result.data.paymentAmount);
                    }

                    if (result.data.allowContinueOrder || (result.data.payType == 1 && result.data.orderState == 1)) {
                        var orderItems = [];
                        var orderItemAll = [];
                        for (var i = 0; i < result.data.orderItems.length; i++) {
                            if (result.data.orderItems[i].type != 4 && result.data.orderItems[i].type != 6) {
                                orderItems.push(result.data.orderItems[i]);
                            }
                            if (result.data.orderItems[i].type != 4) {
                                orderItemAll.push(result.data.orderItems[i]);
                            }
                        }
                        that.orderBossCanhePrice = result.mealFeeNumber;
                        that.orderBoss = result.data;
                        that.orderBossItem = orderItems;
                        that.orderBossItemAll = orderItemAll;
                        that.openBossOrder = true;
                        that.customerCountNow = result.data.customerCount;
                        that.parentId = result.data.id;
                        setTimeout(function () {
                            that.reflushOrderList();
                        }, 500);
                    } else if (result.data.payType == 0 && result.data.orderState == 1 && result.data.productionStatus == 0 && result.data.payMode == 1) {
                        var orderItems = [];
                        for (var i = 0; i < result.data.orderItems.length; i++) {
                            if (result.data.orderItems[i].type != 4 && result.data.orderItems[i].type != 6) {
                                orderItems.push(result.data.orderItems[i]);
                            }
                        }
                        that.orderBossCanhePrice = result.mealFeeNumber;
                        that.orderBoss = result.data;
                        that.orderBossItem = orderItems;
                        that.openBossOrder = true;
                        that.customerCountNow = result.data.customerCount;
                        that.parentId = result.data.id;
                        setTimeout(function () {
                            that.reflushOrderList();
                        }, 500);
                    } else {
                        location.href = baseUrl + "/wechat/index?shopId=" + result.data.shopDetailId;
                    }
                }
            });
        }

        getUnitAll(function (result, map) {
            if(result != null){
                for (var i = 0; i < result.length; i++) {
                    var unit = result[i];
                    var id = unit.articleId + unit.detailId;
                    that.unitMap.put(id, unit);
                }
                for (var index in map) {
                    that.unitArticleMap.put(index, map[index]);
                }
            }
        });

        getWeightPacketList(function(result){
            if(result != null){
                for (var i = 0; i < result.data.length; i++) {
                    var weight = result.data[i];
                    var id = weight.id;
                    that.weightPackageMap.put(id, weight);
                }
            }
        });

        this.allSetting = allSetting;
        this.shopInfo = shopInfo;
        if (this.otherdata && this.otherdata.event == "continue-order") {
            that.showContinue = true;
        } else {
            that.showContinue = false;
        }

        this.$on("pay-success", function () {
            getArticleFamily(function (fam) {
                that.familyList = fam;
            }, {modeid: 1, attr: that.allAttr});
            that.closeCreateOrder();
        });

        this.$on("get-old-orderId", function (orderId) {
            that.oldOrderId = orderId;
        });

        this.$on("close-bossOrder", function () {
            that.openBossOrder.show = false;
        });

        this.$on("change-pay-state", function () {
            that.payStates = false;
        });

        this.$on("reflush-info", function () {
            getCouponList(1, function (coupon) {
                that.$dispatch("loaded");
                that.allCoupon = coupon;
                that.isCreateOrder = true;
                that.newOrder = false;
                Vue.nextTick(function () {
                    setTimeout(function () {
                        that.reflushOrderList();
                        if (that.canUseCoupon.length > 0 && !that.couponId) {
                            that.couponId = that.canUseCoupon[0].id;
                        }
                    }, 500);
                    afterShow && afterShow();
                });
            });
        });

        this.$on("refresh-customerInfo", function (customer) {
            that.customerInfo = customer;
            if (that.checkAccount) {
                that.checkAccount = false;
                that.checkAccount = true;
            } else {
                that.checkAccount = true;
            }
        });

        this.$on("reload-cart", function () {
            that.loadShopCartGroup(1, groupId, function () {});
			Vue.nextTick(function () {
				setTimeout(function(){
					that.duorenShopCartIsc.refresh();
				},2000)
            });
        });

        this.$on("change-pay-state", function () {
            that.payStates = false;
        });
        this.$on("refresh-orderBoss", function () {
            if (getParam("orderBossId") != null) {
                $.ajax({
                    url: baseUrl + "/wechat/order/new/getOrderDetail",
                    type: "post",
                    data: {id: getParam("orderBossId")},
                    dataType: "json",
                    success: function (result) {
                        if (result.data.allowContinueOrder || (result.data.payType == 1 && result.data.orderState == 1)) {
                            var orderItems = [];
                            var orderItemAll = [];
                            for (var i = 0; i < result.data.orderItems.length; i++) {
                                if (result.data.orderItems[i].type != 4 && result.data.orderItems[i].type != 6) {
                                    orderItems.push(result.data.orderItems[i]);
                                }
                                if (result.data.orderItems[i].type != 4) {
                                    orderItemAll.push(result.data.orderItems[i]);
                                }
                            }
                            that.orderBossCanhePrice = result.mealFeeNumber;
                            that.orderBoss = result.data;
                            that.orderBossItem = orderItems;
                            that.orderBossItemAll = orderItemAll;
                            that.openBossOrder = true;
                            setTimeout(function () {
                                that.reflushOrderList();
                            }, 500);
                        } else if (result.data.payType == 0 && result.data.orderState == 1 && result.data.productionStatus == 0 && result.data.payMode == 1) {
                            var orderItems = [];
                            for (var i = 0; i < result.data.orderItems.length; i++) {
                                if (result.data.orderItems[i].type != 4 && result.data.orderItems[i].type != 6) {
                                    orderItems.push(result.data.orderItems[i]);
                                }
                            }
                            that.orderBossCanhePrice = result.mealFeeNumber;
                            that.orderBoss = result.data;
                            that.orderBossItem = orderItems;
                            that.openBossOrder = true;
                            setTimeout(function () {
                                that.reflushOrderList();
                            }, 500);
                        } else {
                            location.href = baseUrl + "/wechat/index?shopId=" + result.data.shopDetailId;
                        }
                    }
                });
            }
        });
        this.$dispatch("loading");

        //加载所有规格
        getAllAttr(function (attr) {
            that.allAttr = attr;
            //加载新品推荐菜品
            getRecommendType(shopInfo.id, function (recommend) {
                that.recommendTypeList = recommend;
                that.currentRecommend = recommend[0];
            });
            //加载所有菜品
            getArticleFamily(function (fam) {
                that.familyList = fam;
                if (!that.currentRecommend) {
                    that.currentFamily = fam[0];
                    that.choiceList = true;
                }

                that.$dispatch("loaded");
                //加载购物车
                if (!that.groupShow) {
                    that.loadShopCartGroup();
                }
                setTimeout(function () {
                    that.reflushArticleList();
                }, 50);
            }, {modeid: 1, attr: attr});
        });

        getChargeList(function (chargeRules) {
            that.chargeList = chargeRules;
        });
    },
    attached: function () {
        var dom = $(this.$el);
        setTimeout(function () {
            var parentHeight = dom.parent().height();
            var logoHeight = dom.find(".menuLogo").height();
            $(".article-container").height(parentHeight - logoHeight);
        }, 50);
    },
    ready: function () {
        var that = this;
        history.pushState(null, null, document.URL);
        window.addEventListener("popstate", function (e) {
            that.isCreateOrder = false;
            history.pushState(null, null, document.URL);
        }, false);
    },
    events: {
        "show-attention-page": function () {
            this.attentionPage.show = true;
        },
        "choiceMode": function (mode) {
            this.choiceModeDialog.mode = mode;
            this.choiceModeDialog.show = false;
            this.distributionModeId = mode;
            this.showCreateOrder(false, function () {
            }, true);
        },
        "choice-remarks-order": function (remrak) {
            this.orderRemarksText = remrak;
            if (this.orderRemarksText == '') {
                this.remarks = false;
            } else {
                this.remarks = true;
            }
            this.orderRemarks.show = false;
        },
        "check-account": function () {
            this.checkAccount = false;
        },
        "add-one-more": function () {
            var that = this;
            that.checkRepartMap.put(that.nowRepeatArticle.id, true);
            that.repeatDialog.show = false;
            console.log(JSON.stringify(that.nowRepeatArticle));
            if (that.unitArr.length > 0) {
                that.currentArticle = that.nowRepeatArticle;
                that.addToNewShopCart();
            } else if (that.nowRepeatArticle.weightPackageId != null) {
                that.currentArticle = that.nowRepeatArticle;
                that.addToNewShopCart();
            }else {
                that.addToShopCart(that.nowRepeatArticle, "false");
            }

        },
        "show-add-address": function (id) {
            this.customerAddress.show = true;
            this.customerAddress.customerid = id;
            this.$broadcast("edit-address", this.customerAddress.customerid);
        },
        "show-address-list": function () {
            var that = this;
            that.$broadcast("open-address-dialog");
        },
        "accept-address": function (obj) {
            var that = this;
            this.myAddress = obj;
            getCustomerAddress(that.customerId, function (result) {
                if (result.success) {
                    that.addressList = result.data;
                }
            })
        },
        "show-orderList": function () {
            this.isCreateOrder = true;
        },
        "show-baidu-location": function () {
            this.getBaiduLocation.show = true;
        },
        "sent-address-infor": function (add) {
            this.getBaiduLocation.show = false;
            this.$broadcast("show-search-address", add);
        },
        "get-customer-count": function (count) {
            this.customerCountNow = count;
        },
        "get-table-number": function (number) {
            var that = this;
            that.tableNumber = number;
            if (turnIndex == 0 && shopInfo.openManyCustomerOrder == 1) {
                showGroupList(customerInfo.id, that.tableNumber, shopInfo.id, function (result) {
                    if (result.success) {
                        groupId = result.groupId;
                        if (groupId != null) {
                            that.groupListInfo = result.data;
                            that.groupShow = true;
                            turnIndex = 1;
                        }
                    }
                })
            }
            ;
        }
    },
    components: {
        "group-scan-page": {
            props: ["show"],
            template: '<div class="weui_dialog_confirm" v-if="show">' +
            '	<div class="weui_mask"></div>' +
            '	<div class="weui_dialog_attention" :class="{\'move\':show,\'out\':!attention}">' +
            '		<div class="full-height">' +
            '			<div class="remainText">提示</div>' +
            '			<div style="padding-top:20px;">' +
            '				<p>扫描桌号二维码即可下单</p>' +
//          '				<p>创建分组/加入分组后即可下单</p>' +
            '			</div>' +
            '			<div class="attentionBtn" style="padding:18px 0px;">' +
            '				<span class="balanceBtn" @click="close">关闭</span>' +
            '				<span class="scanBtn" @click="scanCreateOrder">扫码下单</span>' +
            '			</div>' +
            '		</div>' +
            '	</div>' +
            '</div>',
            data: function () {
                return {
                    attention: true,
                }
            },
            methods: {
                close: function () {
                    var that = this;
                    this.attention = false;
                    setTimeout(function () {
                        that.show = false;
                        that.attention = true;
                    }, 500)
                },
                scanCreateOrder: function () {
                    var that = this;
                    scanNumber(function (data) {
                        getShopInfo(function (shop) {
                            if (shop.isNewQrcode == 0) {
                                var reg_allNumber = /^[\d]+$/;
                                var reg_tableNumber = /tableNumber=[\d]+/;
                                if (reg_allNumber.test(data)) {
                                    that.$dispatch("get-table-number", data);
                                } else if (reg_tableNumber.test(data)) {
                                    var tbNumber = data.match(reg_tableNumber)[0].match(/[\d]+/)[0];
                                    if (tbNumber.length >= 5) {
                                        that.$dispatch("remindMessage", "扫码获取的桌号长度过长，请重新扫码", 4000);
                                        return;
                                    }
                                    that.$dispatch("get-table-number", tbNumber);
                                }
                                var reg_vv = /vv=[-.-_A-Za-z0-9]+/;
                                if (reg_vv.test(data)) {
                                    getTable(data.match(reg_vv)[0].split("=")[1], function (res) {
                                        if (res != null || res != "") {
                                            if (res.shopDetailId != shopInfo.id) {
                                                that.$dispatch("remindMessage", "该二维码与门店信息不符！", 4000);
                                                return;
                                            }
                                            if (res.state == 0) {
                                                that.$dispatch("remindMessage", "该二维码无效！", 4000);
                                                return;
                                            }
                                            if(res.tableNumber == null || res.tableNumber == ""){
                                                that.$dispatch("remindMessage", "该二维码无效！", 4000);
                                                return;
                                            }
                                            penScanLog(customerInfo.id, data.match(reg_vv)[0].split("=")[1], function (r) {
                                            });
                                            that.$dispatch("get-table-number", res.tableNumber);
                                        }else{
                                            return;
                                        }
                                    });
                                }
                            } else {
                                var reg_vv = /vv=[-.-_A-Za-z0-9]+/;
                                if (reg_vv.test(data)) {
                                    getTable(data.match(reg_vv)[0].split("=")[1], function (res) {
                                        if (res != null || res != "") {
                                            if (res.shopDetailId != shopInfo.id) {
                                                that.$dispatch("remindMessage", "该二维码与门店信息不符！", 4000);
                                                return;
                                            }
                                            if (res.state == 0) {
                                                that.$dispatch("remindMessage", "该二维码无效！", 4000);
                                                return;
                                            }
                                            if(res.tableNumber == null || res.tableNumber == ""){
                                                that.$dispatch("remindMessage", "该二维码无效！", 4000);
                                                return;
                                            }
                                            penScanLog(customerInfo.id, data.match(reg_vv)[0].split("=")[1], function (r) {
                                            });
                                            that.$dispatch("get-table-number", res.tableNumber);
                                        }else{
                                            return;
                                        }
                                    });
                                } else {
                                    that.$dispatch("remindMessage", "该门店二维码已启用加密服务，请核实您的二维码！", 4000);
                                    return;
                                }
                            }
                            that.show = false;
                        });
                    });
                }
            }
        },
        "repeat-dialog": {
            props: ["show", "count", "name", "price"],
            template: '<div class="weui_dialog_confirm" v-if="show">' +
            '<div class="weui_mask" style="z-index:21;"></div>' +
            '<div class="weui_dialog_repert" style="width:80vw;color: #999;z-index:21;">' +
            '<div class="repeatArticle">重复菜品小提示</div>' +
            '<div class="weui-cell" style="padding: 10px;">' +
            '<div class="weui_flex_cart" style="text-align: left;flex:1.3;-webkit-flex: 1.3;">' +
            '<span>{{name}}</span>' +
            '<span style="display:block;">￥{{price}}</span>' +
            '</div>' +
            '<div class="weui_flex_cart">' +
            '<span>!x{{count}}</span>' +
            '</div>' +
            '<div class="weui_flex_cart" style="text-align: right;">' +
            '<span>已经{{count}}份喽</span>' +
            '</div>' +
            '</div>' +
            '<div class="attentionBtn">' +
            '<span class="balanceBtn" @click="addOneMore" style="padding: 5px;">再来一份</span>' +
            '<span class="scanBtn" @click="closeRepeatDialog" style="padding: 5px;">不要了</span>' +
            '</div>' +
            '</div>' +
            '</div>',
            methods: {
                close: function () {
                    this.show = false;
                },
                addOneMore: function () {
                    this.$dispatch("add-one-more");
                },
                closeRepeatDialog: function () {
                    this.show = false;
                }
            }
        },
        "attention-page": {
            props: ["show"],
            template: '<div class="weui_dialog_confirm" v-if="show">' +
            '	<div class="weui_mask"></div>' +
            '	<div class="weui_dialog_repert">' +
            '		<img class="scanImg" src="assets/img/scanCode.png"/>' +
            '		<div class="brandCode">' +
            '			<p>关注品牌公众号</p>' +
            '			<p>即可使用余额支付</p>' +
            '		</div>' +
            '		<div class="attentionBtn">' +
            '			<span class="balanceBtn" @click="noUseBalance">不使用余额</span>' +
            '			<span class="scanBtn" @click="scanAttention" style="margin-top: initial;">使用余额</span>' +
            '		</div>' +
            '	</div>' +
            '</div>',
            methods: {
                close: function () {
                    this.show = false;
                },
                noUseBalance: function () {
                    this.$dispatch("check-account");
                    this.show = false;
                },
                scanAttention: function () {
                    this.show = false;
                    location.href = baseUrl + "/restowechat/src/subscribe.html?baseUrl=" + baseUrl + "&dialog=attentionPage";
                }
            }
        },
        "choice-mode-dialog": {
            props: ["mode", "show"],
            template: '<div class="weui_dialog_confirm" v-if="show">' +
            '	<div class="weui_mask" @click="close"></div>' +
            '	<div class="weui_dialog transparent choice-mode">' +
            '		<a class="weui_btn weui_btn_default" @click="choiceMode(3)" style="background-color: #868686;color: #fff;">外带</a>' +
            '		<a class="weui_btn weui_btn_primary" @click="choiceMode(1)">堂吃</a>' +
            '	</div>' +
            '</div>',
            data: function () {
                return {
                    shop: {},
                }
            },
            created: function () {
                var that = this;
                this.$watch("show", function () {
                    that.shop = shopInfo;
                });
            },
            methods: {
                choiceMode: function (mode) {
                    this.$dispatch("choiceMode", mode);
                },
                close: function () {
                    this.show = false;
                }
            }
        },
        "order-remarks": {
            props: ["content"],
            mixins: [dialogMix],
            template: '<div class="weui_dialog_confirm" v-if="show">' +
            '	<div class="weui_mask" @click="close"></div>' +
            '	<div class="weui_dialog" style="max-height: 120vw;">' +
            '		<div class="full-height" style="font-family: 微软雅黑;border-radius: 10px;">' +
            '			<h2>订单备注</h2>' +
            '			<div class="remark_content">' +
            '				<div class="remark_text" @click="choiceRemark(item)" :class="{\'active\':item.state == 0}" v-for="item in orderRemarks">' +
            '					<span class="inMiddle">{{item.remarkName}}</span>' +
            '				</div>' +
            '			</div>' +
            '			<textarea class="remark_textarea" placeholder="其他备注(可不填)" rows="4" v-model="text" maxlength="30"></textarea>' +
            '			<span class="surplusText">{{surplusText}}/30</span>' +
            '			<a class="weui_btn_remark" @click="addOrderRemark">添加备注</a>' +
            '	 	</div>' +
            '    	<div class="dialog-close" @click="close"><i class="icon-remove-sign"></i></div>' +
            '	</div>' +
            '</div>',
            data: function () {
                return {
                    text: '',
                    surplusText: 0,
                    orderRemarks: [],
                    myRemarks: "",
                }
            },
            watch: {
                'text': function (newVal, oldVal) {
                    this.surplusText = newVal.length;
                }
            },
            created: function () {
                var that = this;
                this.$watch("show", function () {
                    if (this.show) {
                        that.orderRemarks = shopInfo.orderRemarkList;
                    }
                });
            },
            methods: {
                choiceRemark: function (item) {
                    if (item.state == 0) {
                        item.state = 1;
                    } else {
                        item.state = 0;
                    }
                },
                addOrderRemark: function () {
                    var that = this;
                    that.myRemarks = "";
                    for (var i = 0; i < that.orderRemarks.length; i++) {
                        var item = that.orderRemarks[i];
                        if (item.state == 0) {
                            that.myRemarks = that.myRemarks + item.remarkName + ",";
                        }
                    }
                    if (that.text.length > 0) {
                        that.myRemarks = that.myRemarks + this.text;
                    } else {
                        that.myRemarks = that.myRemarks.substring(0, that.myRemarks.length - 1);
                    }
                    that.$dispatch("choice-remarks-order", that.myRemarks);
                }
            }
        },
        "delivery-address": {
            props: ["customerid", "show"],
            template: '<div class="weui_dialog_alert" v-if="show">' +
            '<div class="weui_dialog ex_dialog">' +
            '<div class="order_address_list">' +
            '<div>' +
            '<div style="text-align:center;margin-top: 38%;" v-if="addressListInfo.length==0">' +
            '<img style="width:5rem;height:5rem;" src="assets/img/noAddress.png"/>' +
            '<p style="font-size: 1.3rem;color: #949496;margin-top: 10px;">没有收货地址</p>' +
            '<p style="color: #c7c7c7;">点击下方按钮添加</p>' +
            '</div>' +
            '<div style="border-bottom: 8px solid #D9D9D9;">' +
            '<div class="weui-cell" v-for="f in inDistance" @click="choiceAddress(f.id)" ontouchend="click()">' +
            '<div class="weui-cell__bd">' +
            '<p class="order_addressInFor">{{f.address}} {{f.addressReality}}</p>' +
            '<p>' +
            '<span>{{f.name}}  <i v-if="f.sex == 0">先生</i><i v-if="f.sex == 1">女士</i></span>' +
            '<span style="margin-left:10px;">{{f.mobileNo}}</span>' +
            '</p>' +
            '</div>' +
            '<div class="weui-cell__ft" v-on:click.stop="editAddress(f.id)">' +
            '<img class="addressImg" src="assets/img/editAddress.png"/>' +
            '</div>' +
            '</div>' +
            '</div>' +

            '<div style="color:#333;padding:5px 15px;" v-if="outDistance.length>0">以下地址超出配送范围</div>' +
            '<div class="weui-cell" style="color:#b9b7b7;" v-for="f in outDistance" >' +
            '<div class="weui-cell__bd">' +
            '<p class="order_addressInFor">{{f.address}} {{f.addressReality}}</p>' +
            '<p>' +
            '<span>{{f.name}}  <i v-if="f.sex == 0">先生</i><i v-if="f.sex == 1">女士</i></span>' +
            '<span style="margin-left:10px;">{{f.mobileNo}}</span>' +
            '</p>' +
            '</div>' +
            '<div class="weui-cell__ft" v-on:click.stop="editAddress(f.id)">' +
            '<img class="addressImg" src="assets/img/editAddress.png"/>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<button type="button" class="weui-btn weui-btn_primary" id="addAddress" @click="addAddress()">添加地址</button>' +
            '</div>' +
            '</div>',
            data: function () {
                return {
                    addressListInfo: [],
                    inDistance: [],
                    outDistance: [],
                    map: null
                }
            },
            created: function () {
                var that = this;
                this.$on("open-address-dialog", function () {
                    that.show = true;
                    getCustomerAddress(that.customerid, function (result) {
                        if (result.success) {
                            that.addressListInfo = result.data;
                        }
                    })
                });
                this.$watch("show", function () {
                    if (that.show) {
                        that.map = new BMap.Map();
                        getCustomerAddress(that.customerid, function (result) {
                            if (result.success) {
                                that.addressListInfo = result.data;
                                for (var i = 0; i < that.addressListInfo.length; i++) {
                                    var item = that.addressListInfo[i];
                                    var pointA = new BMap.Point(item.longitude, item.latitude);
                                    var pointB = new BMap.Point(shopInfo.longitude, shopInfo.latitude);
                                    var distance = that.map.getDistance(pointA, pointB).toFixed(2);
                                    var myDistance = Math.round(parseInt(distance) / 100) / 10;
                                    if (myDistance > shopInfo.apart) {
                                        that.outDistance.push(item);
                                    } else if (myDistance < shopInfo.apart) {
                                        that.inDistance.push(item);
                                    }
                                }
                            }
                        });
                        that.resetHeight();
                        setTimeout(function () {
                            Vue.nextTick(function () {
                                that.scrollIsc = new IScroll(".order_address_list", {
                                    click: true
                                });
                            })
                        }, 1000);
                    } else {
                        that.inDistance = [];
                        that.outDistance = [];
                    }
                });
            },
            methods: {
                choiceAddress: function (id) {
                    var that = this;
                    choiceCustomerAddress(id, function (result) {
                        if (result.success) {
                            that.$dispatch("accept-address", result.data);
                        }
                    })
                    this.show = false;
                },
                editAddress: function (id) {
                    var that = this;
                    that.$dispatch("show-add-address", id);
                },
                addAddress: function () {
                    var that = this;
                    that.show = false;
                    that.$dispatch("show-add-address", null);
                },
                resetHeight: function () {
                    var main_menu = $("#addAddress")
                    var content = $(".order_address_list");
                    var height = $(window).height();
                    content.height(height - main_menu.height() - 20);
                    content.css({
                        overflow: "hidden",
                        position: "relative"
                    });
                }
            }
        },
        "add-address": {
            props: ["show", "customerid"],
            template: '<div class="weui_dialog_alert" v-if="show">' +
            '<div class="weui_dialog ex_dialog" style="background:#f1f1f1;">' +
            '<div class="order_address_list">' +
            '<div class="weui-cell weui-address">' +
            '<img class="arrorImg" src="assets/img/arror.png"/ @click="backToAddress">' +
            '<div class="weui-cell__hd" style="text-align:center;flex:1;">' +
            '<span>添加地址信息</span>' +
            '</div>' +
            '<div class="weui-cell__ft"></div>' +
            '</div>	' +
            '<div class="weui-cell weui-address">' +
            '<div class="weui-cell__hd">' +
            '<label class="weui_left">联系人</label>' +
            '</div>' +
            '<div class="weui-cell__bd">' +
            '<input class="weui-input" id="name-input" type="text" placeholder="姓名" v-model="name">' +
            '</div>' +
            '</div>	' +
            '<div class="weui-cell weui-address weui-cells_checkbox">' +
            '<label class="weui_left">性别</label>' +
            '<label class="weui-check__label" @click="sex=0" ontouchend="click()">' +
            '<span class="weui-cell__hd">' +
            '<input type="radio" class="weui-check" name="checkbox1" checked="checked" v-model="sex" value="0">' +
            '<i class="weui-icon-checked"></i>' +
            '</span>' +
            '<span>男士</span>' +
            '</label>' +
            '<label class="weui-check__label" @click="sex=1" ontouchend="click()">' +
            '<span class="weui-cell__hd">' +
            '<input type="radio" name="checkbox1" class="weui-check" v-model="sex" value="1">' +
            '<i class="weui-icon-checked"></i>' +
            '</span>' +
            '<span>女士</span>' +
            '</label>' +
            '</div>' +
            '<div class="weui-cell weui-address">' +
            '<div class="weui-cell__hd">' +
            '<label class="weui_left">电话</label>' +
            '</div>' +
            '<div class="weui-cell__bd">' +
            '<input class="weui-input" type="tel" id="phone-input" placeholder="请输入11位手机号码" v-model="phone" :value="customerInfo.telephone" maxlength="11">' +
            '</div>' +
            '</div>' +
            '<div class="weui-cell weui-address weui-cell_access" @click="showBaiduMap">' +
            '<div class="weui-cell__hd">' +
            '<label class="weui_left">地址</label>' +
            '</div>' +
            '<div class="weui-cell__hd">' +
            '<img style="width:1.3rem;height:1.3rem;vertical-align: middle;" src="assets/img/sign.png"/>' +
            '</div>' +
            '<div class="weui-cell__bd">' +
            '<span style="color: #a2a2a2;" v-if="!address">点击添加(如小区/大厦/学校等)</span>' +
            '<span style="color: #000;" v-if="address">{{address}}</span>' +
            //'<input class="weui-input noAddress" :class="{\'hasAddress\':address}" type="text" placeholder="点击添加(如小区/大厦/学校等)" disabled="disabled" v-model="address">'+
            '</div>' +
            '</div> ' +
            '<div class="weui-cell weui-address">' +
            '<div class="weui-cell__hd">' +
            '<label class="weui_left">地址</label>' +
            '</div>' +
            '<div class="weui-cell__bd">' +
            '<input class="weui-input" type="text" v-model="detailedAddress" placeholder="详细地址(如楼号/楼层/门牌号等)" >' +
            '</div>' +
            '</div>' +

            '<div class="weui_cell weui-address weui_cell_switch">' +
            '<div class="weui_cell_primary">' +
            '<p>设为默认</p>' +
            '</div>' +
            '<div class="weui_cell_ft">' +
            '<span class="weui_switch useaccount" :class="{\'checkedDefult\':checkAccount}" @click="useChecked"></span>' +
            '</div>' +
            '</div>' +

            '</div>' +
            '<button type="button" class="weui-btn weui-btn_primary" id="addAddress" @click="saveAddress">保存</button>' +
//				'<button type="button" class="weui-btn" id="addAddress" style="background: #d4d4d4;" v-else disabled>保存</button>'+
            '</div>' +
            '</div>',
            data: function () {
                return {
                    name: '',
                    sex: '',
                    phone: '',
                    address: null,
                    detailedAddress: '',
                    addressId: null,
                    checkAccount: 0,
                    Height: null,
                    customerInfo: customerInfo,
                    longitude: null,
                    latitude: null
                }
            },
            created: function () {
                var that = this;
                this.$on("edit-address", function (id) {
                    this.show = true;
                    choiceCustomerAddress(id, function (result) {
                        if (result.success) {
                            that.name = result.data.name;
                            that.sex = result.data.sex;
                            that.phone = result.data.mobileNo;
                            that.address = result.data.address;
                            that.detailedAddress = result.data.addressReality;
                        }
                    })
                });
                this.$on("show-search-address", function (add) {
                    this.show = true;
                    this.address = add.city + add.address + add.title;
                    this.longitude = add.point.lng;
                    this.latitude = add.point.lat;
                });
                this.$watch("show", function () {
                    if (this.show && !this.address) {
                        if ((/Android/i.test(navigator.userAgent) || /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) && !this.name) {
                            $("#name-input").focus();
                        }
                    }
                });
            },
            methods: {
                backToAddress: function () {
                    this.show = false;
                },
                useChecked: function () {
                    this.checkAccount = !this.checkAccount;
                },
                showBaiduMap: function () {
                    var that = this;
                    this.show = false;
                    that.$dispatch("show-baidu-location");
                },
                saveAddress: function () {
                    var that = this;
                    if (!that.name || !that.address || !that.detailedAddress) {
                        that.$dispatch("remindMessage", "请补充完整信息", 2000);
                        return;
                    }
                    if (that.customerid) {
                        if (that.checkAccount) {
                            editCustomerAddress(that.customerid, that.name, that.sex, that.phone, that.address, that.detailedAddress, 1, function (result) {
                                if (result.success) {
                                    that.show = false;
                                    that.$dispatch("show-address-list");
                                    that.$dispatch("successMessage", "设置默认地址成功", 2000);
                                } else {
                                    that.$dispatch("remindMessage", "设置默认地址失败", 2000);
                                }
                            })
                        } else {
                            editCustomerAddress(that.customerid, that.name, that.sex, that.phone, that.address, that.detailedAddress, 0, function (result) {
                                if (result.success) {
                                    that.show = false;
                                    that.$dispatch("show-address-list");
                                    that.$dispatch("successMessage", "修改地址成功", 2000);
                                } else {
                                    that.$dispatch("remindMessage", "修改地址失败", 2000);
                                }
                            })
                        }
                    } else {
                        addCustomerAddress(that.name, that.sex, that.phone, that.address.replace(/,/g, ' '), that.detailedAddress, that.longitude, that.latitude, 0, function (result) {
                            if (result.success) {
                                that.show = false;
                                that.$dispatch("show-address-list");
                                that.$dispatch("successMessage", "添加地址成功", 2000);
                            } else {
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
            ready: function () {
                var that = this;
                that.Height = $(window).height();
                window.onresize = function () {
                    $("#addAddress").css('display', 'none');
                    if (that.Height > window.innerHeight) {
                        $("#addAddress").css('display', 'none');
                    } else {
                        $("#addAddress").css('display', 'block');
                    }
                }
            }
        },
        /*调取百度地图接口获取地标*/
        "get-location": {
            props: ["show"],
            template: '<div class="weui_dialog_alert" v-if="show">' +
            '<div class="weui_dialog ex_dialog">' +
            '<input type="hidden" id="lng" :value="lngVal">' +
            '<input type="hidden" id="lat" :value="latVal">' +
            '<div class="searchBar">' +
            '<img class="backImg" @click="backToPage" src="assets/img/arror.png"/ >' +
            '<input type="text" class="form-control" id="suggestId" placeholder="请输入您的收货地址" v-model="searchName">' +
            '<img class="searchImg" src="assets/img/search.png"/ >' +
            '<img class="clearImg" @click="clearText" src="assets/img/clear.png"/ >' +
            '</div>' +
            '<div id="container"></div>' +
            '<div class="r_shadow" id="search-result">' +
            '<div class="r_searchlist positiolist" >' +
            '<div class="weui-cell" v-for="f in SearchResultList">' +
            '<div class="weui-cell_address" @click="zoomto(f)" ontouchend="click()">' +
            '<div class="page__title" style="text-align: left;">{{f.title}}</div>' +
            '<div class="weui-cells_result">{{f.city}}{{f.address}}</div>' +
            '</div>' +
            '</div>' +
            '</div> ' +
            '</div>' +
            '</div>' +
            '</div>',
            data: function () {
                return {
                    lngVal: null,
                    latVal: null,
                    SearchResultList: [],
//                 	searchResultInfor:null,
                    searchName: '',
                    distance: null
                }
            },
            watch: {
                'searchName': function (newVal, oldVal) {
                    var that = this;
                    if (newVal) {
                        Vue.nextTick(function () {
                            that.scrollIsc.refresh();
                        })
                    }
                }
            },
            created: function () {
                var that = this;
                this.$watch("show", function () {
                    that.SearchResultList = [];
                    if (this.show) {
                        var myGeo = new BMap.Geocoder();
                        var pt = new BMap.Point(longitude, latitude);
                        that.resetHeight();
                        translateCallback = function (point) {
                            that.createBaiduMap(point.lng, point.lat, 1);
                        };
                        setTimeout(function () {
                            BMap.Convertor.translate(pt, 2, translateCallback);     //火星经纬度转成百度坐标，2变成0时，则是默认的wgs84的gps坐标转换成百度坐标
                        }, 100);

                        translateCallbackTwo = function (point) {
                            myGeo.getLocation(point, function (rs) {
                                var addComp = rs.addressComponents;
                                var addr = addComp.city + addComp.district + addComp.street + addComp.streetNumber;
                                //alert(addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
                                that.searchMap(addr);
                            });
                        };
                        setTimeout(function () {
                            BMap.Convertor.translate(pt, 2, translateCallbackTwo);     //火星经纬度转成百度坐标
                        }, 100);
                        /*当用户未开启定位时提示*/
                        if (longitude == "121.47489949" && latitude == "31.24916171") {
                            that.$dispatch("remindMessage", "无法获取当前位置,请打开定位或手动搜索", 99999);
                        }
                    }
                });
            },
            methods: {
                createBaiduMap: function (longitude, latitude, type) {
                    var that = this;
                    if (map == null) {
                        map = new BMap.Map("container");
                    }
                    setMapEvent();
                    getSearch();
                    that.clear();
                    var pt = new BMap.Point(longitude, latitude);
                    /*初始化搜索*/
                    var ac = new BMap.Autocomplete({
                        "input": "suggestId",
                        "location": map
                    });

                    ac.addEventListener("onconfirm", function (e) {    //鼠标点击下拉列表后的事件
                        var _value = e.item.value;
                        that.searchName = _value.province + _value.city + _value.district + _value.street + _value.business;
                        that.setPlace();
                    });
                    translateCallback = function (point) {
                        var point = new BMap.Point(point.lng, point.lat);
                        map.setCenter(point);
                        map.centerAndZoom(point, 24);
                        // 添加带有定位的导航控件
                        var navigationControl = new BMap.NavigationControl({
                            // 靠左上角位置
                            anchor: BMAP_ANCHOR_TOP_LEFT,
                            // LARGE类型
                            type: BMAP_NAVIGATION_CONTROL_LARGE,
                            // 启用显示定位
                            enableGeolocation: true
                        });
                        map.addControl(navigationControl);
                        marker = new BMap.Marker(point); //标注
                        marker.enableDragging();
                        marker.addEventListener("dragend", getAttr);
                        function getAttr() {
                            var p = marker.getPosition();       //获取marker的位置
                            getAddressInfo(p.lng, p.lat);
                        }

                        map.clearOverlays();
                        map.addOverlay(marker);
                        map.addEventListener("click", function (e) {
                            var gc = new BMap.Geocoder();
                            var pt = new BMap.Point(e.point.lng, e.point.lat);
                            that.lngVal = e.point.lng;
                            that.latVal = e.point.lat;
                            window.map.removeOverlay(marker);
                            marker = new BMap.Marker(e.point);//创建一个覆盖物
                            map.addOverlay(marker);//增加一个标示到地图上
                            var dress = gc.getLocation(pt, function (rs) {
                                var addComp = rs.addressComponents;
                                var address = addComp.city + addComp.district + addComp.street + addComp.streetNumber;
                                that.searchMap(address);
                            });
                        });
                        // 添加定位控件
                        var geolocationControl = new BMap.GeolocationControl();
                        geolocationControl.addEventListener("locationSuccess", function (e) {
                            window.map.removeOverlay(marker);
                            marker = new BMap.Marker(e.point);//创建一个覆盖物
                            map.addOverlay(marker);//增加一个标示到地图上
                            map.panTo(e.point);
                            // 定位成功事件
                            var address = '';
                            address += e.addressComponent.city;
                            address += e.addressComponent.district;
                            address += e.addressComponent.street;
                            address += e.addressComponent.streetNumber;
                            that.searchMap(address);
                        });
                        geolocationControl.addEventListener("locationError", function (e) {
                            // 定位失败事件
                            alert(e.message);
                        });
                        //地图拖动事件
                        map.addEventListener("dragging", function (evt) {
                            var offsetPoint = new BMap.Pixel(evt.offsetX, evt.offsetY);
                        });
                        map.addControl(geolocationControl);
                    };
                    setTimeout(function () {
                        if (type == 1) {
                            translateCallback(pt);
                        } else {
                            BMap.Convertor.translate(pt, 0, translateCallback);     //真实经纬度转成百度坐标
                        }
                    }, 100);
                },
                setPlace: function () {
                    map.clearOverlays();    //清除地图上所有覆盖物
                    callback = function myFun() {
                        var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
                        map.centerAndZoom(pp, 24);
                        map.addOverlay(new BMap.Marker(pp));    //添加标注
                    }
                    var local = new BMap.LocalSearch(map, { //智能搜索
                        onSearchComplete: callback
                    });
                    local.search(this.searchName);
                    this.searchMap(this.searchName);
                },
                clear: function () {
                    window.map.removeOverlay(marker);
                    this.SearchResultList.length = 0;
                },
                clearTwo: function () {
                    this.SearchResultList.length = 0;
                },
                searchMap: function (area) {
                    var that = this;
                    if (map == null) {
                        map = new BMap.Map("container");
                    }
                    var ls = new BMap.LocalSearch(map);
                    ls.setSearchCompleteCallback(function (rs) {
                        that.clearTwo();
                        if (ls.getStatus() == BMAP_STATUS_SUCCESS) {
                            for (var index = 0; index < rs.getCurrentNumPois(); index++) {
                                var poi = rs.getPoi(index);
                                if (poi) {
                                    that.showSearchResult(poi);
                                }
                            }
                        }
                    });
                    ls.search(area);
                    setTimeout(function () {
                        Vue.nextTick(function () {
                            that.scrollIsc = new IScroll("#search-result", {
                                click: true
                            });
                        })
                    }, 500)
                },
                showSearchResult: function (poi) {
                    var that = this;
                    var marker = new BMap.Marker(poi.point);
                    that.SearchResultList.push(poi);
                },
                zoomto: function (f) {
                    var pointA = new BMap.Point(f.point.lng, f.point.lat);
                    var pointB = new BMap.Point(shopInfo.longitude, shopInfo.latitude);
                    var distance = window.map.getDistance(pointA, pointB).toFixed(2);
                    this.distance = Math.round(parseInt(distance) / 100) / 10;
                    if (this.distance > shopInfo.apart) {
                        this.$dispatch("remindMessage", "抱歉客官,您的地址不在本店配送范围", 3000);
                        return;
                    }
//					this.searchResultInfor = f.city+f.address+f.title;
                    this.show = false;
                    this.$dispatch("sent-address-infor", f);
                },
                resetHeight: function () {
                    var main_menu = $("#container");
                    var searchBar = $(".searchBar");
                    var content = $("#search-result");
                    var height = $(window).height();
                    content.height(height - main_menu.height() - searchBar.height());
                    content.css({
                        overflow: "hidden",
                        position: "relative"
                    });
                },
                backToPage: function () {
                    this.show = false;
                    this.$dispatch("sent-address-infor", null);
                },
                clearText: function () {
                    this.searchName = null;
                }
            }
        },
        "number-keyboard": {
            props: ['show', 'count'],
            template: '<div class="weui_loading_toast" v-if="show">' +
            '<div class="weui_toast_keyboard">' +
            '<div class="full-height">' +
            '<div class="choiceCount">请选择就餐人数</div>' +
            '<div class="keyContent">' +
            '<div class="keys">' +
            '<span v-for="number in 12" @click="getCustomerCount(number)"><i class="middle">{{number+1}}</i></span>' +
            '<span @click="close"><i class="middle"><</i></span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>',
            data: function () {
                return {
                    customerNumber: null,
                }
            },
            created: function () {
                this.customerNumber = null;
            },
            methods: {
                close: function () {
                    this.show = false;
                    this.customerNumber = null;
                },
                getCustomerCount: function (number) {
                    this.customerNumber = number + 1;
                    this.$dispatch("get-customer-count", this.customerNumber);
                    this.show = false;
                }
            }
        },

        /*购物车单品加减及飞入效果弹窗*/
        "article-operator": {
            props: ["article", "style"],
            template: '<span class="numberControl" :style="style" v-if="!article.isEmpty">' +
            '<span v-if="article.number || article.count" @click.stop="cutA" class="cut-span"><i class="icon iconfont minus">&#xe751;</i></span>' +
            '<span v-if="article.number " class="art-number">{{article.number}}</span>' +
            '<span v-if="article.count && !article.number " class="art-number">{{article.count}}</span>' +
            '<span class="plus-span" @click.stop="addArticle"><i class="icon iconfont plus">&#xe6cd;</i></span>' +
            '</span>' +
            '<span class="numberControl font-15" :style="style" v-else>已售罄</span>',
            created: function () {
                if (this.article && this.article.isEmpty) {
                    this.article.number = 0;
                }
            },
            methods: {
                cutA: function (e) {
                    this.$dispatch('cut', this.article);
                },
                addArticle: function (e) {
                    var that = this;

                    var clickAnt = $("<span>1</span>");
                    clickAnt.css({
                        fontSize: "18px",
                        padding: "0px 10px",
                        backgroundColor: "#CDCDCD",
                        color: "white",
                        borderRadius: "50%",
                        zIndex: 99999
                    });
                    var s = $(".art-count").offset();
                    var a = $(e.target).offset();
                    var speed = 2 + 2 / (s.top - a.top) * 20;
                    clickAnt.fly({
                        start: {
                            left: a.left,
                            top: a.top
                        },
                        end: {
                            left: s.left,
                            top: s.top,
                        },
                        autoPlay: true,
                        speed: speed,
                        vertex_Rtop: a.top - 50,
                        onEnd: function () {
                            clickAnt.remove();
                        }
                    });

                    this.$dispatch('add', that.article);
                }
            }
        },
        "article-operat": {
            props: ["article", "style"],
            template: '<span class="numberControl" :style="style" v-if="!article.isEmpty">' +
            '<span v-if="article.count" @click.stop="cutA" class="cut-span"><i class="icon iconfont minus">&#xe751;</i></span>' +
            '<span v-if="article.count " class="art-number">{{article.count}}</span>' +
            '<span class="plus-span" @click.stop="addArticle"><i class="icon iconfont plus">&#xe6cd;</i></span>' +
            '</span>' +
            '<span class="numberControl font-15" :style="style" v-else>已售罄</span>',
            created: function () {
                if (this.article && this.article.isEmpty) {
                    this.article.number = 0;
                }
                if(this.article && this.article.count == 0 && this.article.id.indexOf("@") == -1){
                	this.article.count = 1;
                }
            },
            methods: {
                cutA: function (e) {
                    this.$dispatch('cut', this.article);
                },
                addArticle: function (e) {
                    var clickAnt = $("<span>1</span>");
                    clickAnt.css({
                        fontSize: "18px",
                        padding: "0px 10px",
                        backgroundColor: "#CDCDCD",
                        color: "white",
                        borderRadius: "50%",
                        zIndex: 99999
                    });
                    var s = $(".art-count").offset();
                    var a = $(e.target).offset();
                    var speed = 2 + 2 / (s.top - a.top) * 20;
                    clickAnt.fly({
                        start: {
                            left: a.left,
                            top: a.top
                        },
                        end: {
                            left: s.left,
                            top: s.top,
                        },
                        autoPlay: true,
                        speed: speed,
                        vertex_Rtop: a.top - 50,
                        onEnd: function () {
                            clickAnt.remove();
                        }
                    });

                    this.$dispatch('add', this.article);
                }
            }
        },
    }
};



