//var baseUrl = "http://test.tt.com:8083";
/*设置域名*/
var articleMapAll =  new HashMap();

$.ajax({
    url:baseUrl+"/wechat/ipconfig",
    type:"post",
    async:false,
    success : function(result) {
        IMAGE_SERVICE = result.ipconfig;
    },
    error : function(){
        var search = window.location.search;
        if(search.indexOf("qiehuan") == -1){
            search = search + "&qiehuan=qiehuan";
        }
        window.location.href = getParam("baseUrl")+"/wechat/index"+search;
    }
});

function getBoPic(pic){
    if(pic){
        if(pic.substring(0,4)=="http"){
            return pic;
        }else{
            return "http://bo.restoplus.cn/" +pic;
        }
    }else{
        return baseUrl+'/wechat/assets/img/restowechat.png';
    }
}

function getPicUrl(pic){
    if(pic){
        if(pic.substring(0,4)=="http"){
            return pic;
        }else{
            return IMAGE_SERVICE +pic;
        }
    }else{
        return 'assets/img/articleWhtie.jpg';
    }
}

function getPicUrlSquare(pic){
    if(pic){
        if(pic.substring(0,4)=="http"){
            return pic;
        }else{
            return IMAGE_SERVICE +pic;
        }
    }else{
        return baseUrl+'/wechat/assets/img/restowechat.png';
    }
}

function getTableNumber(){
    $.ajax({
        url:baseUrl+"/wechat/tableNumber",
        type:"post",
        success:function(result){
            if(result.success){
                s&&s(result.data);
            }else{
                s&&s(null);
            }
        }
    });
}

function getOrderList(option,s){
    $.ajax({
        url:baseUrl+"/wechat/order/new/listOrder",
        data:option,
        type:"post",
        success:function(result){
            s&&s(result.data);
        }
    });
}

function getOrderById(id,s){
    $.post(baseUrl+"/wechat/order/new/findOrderById",{id:id},function(result){
        s&&s(result.data);
    });
}

/**
 * 获得用户最新订单 或者 指定ID的订单
 */
function getCustomerNewOrder(oid,sbk){
    $.ajax({
        url : baseUrl+"/wechat/order/new/customerNewOrder",
        type:"post",
        async: false,
        data : {orderId:oid},
        success : function(result) {
            sbk&&sbk(result.data);
        }
    });
}

/**
 * 我的页面弹窗订单最新优化
 * 首先查询是否在12个小时内存在未支付的订单  如果存在则显示   如果不存在 查询是否存在领取红包订单    ------- wyj
 */
function customerByOrderForMyPage(sbk){
    $.post(baseUrl+"/wechat/order/new/customerByOrderForMyPage",null,function(result){
        sbk&&sbk(result.data);
    });
}

/*用户消费获得红包*/
function getCustomerNewPackage(sbk){
    $.post(baseUrl+"/wechat/order/new/customerNewPackage",null,function(result){
        sbk&&sbk(result.data);
    });
}

function findReadyOrderList(oid,sbk){
    $.post(baseUrl+"/wechat/order/new/readylistOrder",{orderId:(oid||'')},function(result){
        sbk&&sbk(result.data);
    });
}

/*获取商家店铺信息列表*/
function getShopList(sbk){
    $.ajax({
        url:baseUrl+"/wechat/shop/new/list",
        type:"post",
        success:function(result){
            sbk&&sbk(result.data);
        }
    })
}

/**
 * 获取当前店铺信息`
 */
function getShopInfo(successBck) {
    $.ajax({
        url : baseUrl+"/wechat/shop/new/currentshop",
        type:"post",
        success : function(result) {
            successBck && successBck(result.data);
        }
    });
}

/**
 * 通过就餐模式获取购物车列表 获得当前店铺，当前用户的购物车信息
 */
function loadShopCart(distributionModeId,groupId, successbck) {
    $.ajax({
        url : baseUrl+"/wechat/shop/new/listShopcart",
        type:"post",
        //async:"false",
        data : {
            distributionModeId: distributionModeId,
            groupId:groupId
        },
        success : function(result) {
//			var customerGroup = result.customerGroup;
//			var shopCartList = result.data;
//			var typeThird = result.typeThird;
            successbck && successbck(result);
        }
    });
}

/**
 * 获取店铺的照片展示图片列表
 */
function getShowPhoto(sbk){
    $.ajax({
        url : baseUrl+"/wechat/shop/new/listShowPhoto",
        type:"post",
        data:null,
        success : function(result) {
            sbk&&sbk(result);
        }
    });
}

/**
 * 查询店铺的广告信息
 */
function getShopAdvert(successBck) {
    $.ajax({
        url : baseUrl+"/wechat/shop/new/shopAdvert",
        type:"post",
        success : function(result) {
            var advert = result.data[0];
            if(advert){
                advert.description = advert.description.replace(/\.\.\/upload/g,IMAGE_SERVICE+"upload");
            }
            successBck && successBck(advert||{});
        }
    });
}

/*
 * 查询店铺通知列表 
 */
function getNoticeList(type,successBck) {
    $.ajax({
        url : baseUrl+"/wechat/shop/new/noticeList",
        type:"post",
        data:{noticeType:type},
        success : function(result) {
            var list = result.data;
            for(var i=0;i<list.length;i++){
                var notice = list[i];
                notice.noticeImage = getPicUrl( notice.noticeImage);
            }
            successBck && successBck(result.data);
        }
    })
}

/*店铺公告*/
function addNoticeHistory(id,sbk){
    $.post(baseUrl+"/wechat/shop/new/addNoticeHistory",{noticeId:id},function(result){
        sbk&&sbk(result);
    })
}

/*切换店铺调取地图API*/
function switchShopApi(sid,sbk){
    var rand = "";
    for(var i = 0; i < 3; i++){
        var r = Math.floor(Math.random() * 10);
        rand += r;
    }
    $.post(baseUrl+"/wechat/shop/new/switch/"+sid,{"random":rand},function(result){
        sbk&&sbk(result);
    });
}

function delMealArticle(id,sbk) {
    $.ajax({
        url : baseUrl+"/wechat/shop/new/delMealArticle",
        type:"post",
        data : {
            id : id
        },
        success:function(result){
            sbk&&sbk(result);
        }
    });
}

/**
 * 更新购物车接口
 */

/*非套餐及套餐单品*/
function updateShopCart(ARTICLE_ID, DISTRIBUTION_MODE_ID, NUMBER, GROUPID, sbk) {
    $.ajax({
        url : baseUrl+"/wechat/shop/new/updateToShopcart",
        type:"post",
        data : {
            articleId : ARTICLE_ID,
            distributionModeId: DISTRIBUTION_MODE_ID,
            number: NUMBER,
            groupId: GROUPID
        },
        success:function(result){
            sbk&&sbk(result);
        }
    });
}
function updateShopCartDanpin(ID,ARTICLE_ID, UUID, DISTRIBUTION_MODE_ID, NUMBER, GROUP_ID,shopType, sbk) {
    $.ajax({
        url : baseUrl+"/wechat/shop/new/updateToShopcart",
        type:"post",
        data : {
            id : ID,
            articleId : ARTICLE_ID,
            uuid : UUID,
            distributionModeId: DISTRIBUTION_MODE_ID,
            number: NUMBER,
            groupId: GROUP_ID,
            shopType:shopType
        },
        success:function(result){
            sbk&&sbk(result);
        }
    });
}

/*更新套餐*/
function updateShopCartOne(shopcart,groupId,sbk) {
    $.ajax({
        url : baseUrl+"/wechat/shop/new/updateToShopcartOne",
        type:"post",
        data : {
            shopcart : JSON.stringify(shopcart),
            groupId: groupId
        },
        success:function(result){
            sbk&&sbk(result);
        }
    });
}

/*新规格  在购物车中*/
function updateShopCartThree(shopcart,groupId,sbk) {
    $.ajax({
        url : baseUrl+"/wechat/shop/new/updateToShopcartThree",
        type:"post",
        data : {
            shopcart : JSON.stringify(shopcart),
            groupId: groupId
        },
        success:function(result){
            sbk&&sbk(result);
        }
    });
}

/*推荐餐包*/
function updateShopCartTwo(shopcart,groupId,sbk) {
    $.ajax({
        url : baseUrl+"/wechat/shop/new/updateToShopcartTwo",
        type:"post",
        data : {
            shopcart : JSON.stringify(shopcart),
            groupId: groupId
        },
        success:function(result){
            sbk&&sbk(result);
        }
    });
}

/*重量包*/
function updateShopCartFour(shopcart,groupId,sbk) {
    $.ajax({
        url : baseUrl+"/wechat/shop/new/updateToShopcartFour",
        type:"post",
        data : {
            shopcart : JSON.stringify(shopcart),
            groupId: groupId
        },
        success:function(result){
            sbk&&sbk(result);
        }
    });
}

/*更新推荐菜为单品*/
function updateShopCartRecommend(id,sbk) {
    $.ajax({
        url : baseUrl+"/wechat/shop/new/updateShopCartRecommend",
        type:"post",
        data : {
            id : id
        },
        success:function(result){
            sbk&&sbk(result);
        }
    });
}

/**
 * 清空购物车接口
 */
function clearShopcartApi(sbk){
    $.post(baseUrl+"/wechat/shop/new/emptyShopCart",null,function(result){
        sbk&&sbk(result);
    });
}

/**
 * 获取订单状态
 */
function getOrderStates(oid,sbk){
    $.ajax({
        url : baseUrl+"/wechat/order/new/getOrderStates",
        type:"post",
        async: false,
        data : {orderId:oid},
        success : function(result) {
            var order = result.data;
            sbk&&sbk(order);
        }
    });
}

/**
 * 此处必须同步
 * 如果需要async true的话  可能会出现bug  ------wyj
 * @param oid
 * @param sbk
 */
function getOrderInfoState(oid,sbk){
    $.ajax({
        url : baseUrl+"/wechat/order/new/getOrderStates",
        type:"post",
        data:{orderId:oid},
        async:false,
        success : function(result) {
            var order = result.data;
            sbk&&sbk(order);
        }
    })
}

/**
 * 查询 店铺评论总数
 */
function getAppraiseCount(scbk) {
    $.ajax({
        url : baseUrl+"/wechat/appraise/new/appraiseCount",
        type:"post",
        success : function(result) {
            scbk && scbk(result.data.appraiseCount, result.data.appraiseMonthCount);
        }
    })
}

function getAppraiseCountNew(scbk) {
    $.ajax({
        url : baseUrl+"/wechat/newAppraise/appraiseCount",
        type:"post",
        success : function(result) {
            scbk && scbk(result.data.appraiseCount, result.data.appraiseMonthCount);
        }
    })
}
/*
 * 获取客户所有的优惠卷，通过状态和模式
 */
function getCouponList(modeId, sbc) {
    $.ajax({
        url : baseUrl+"/wechat/customer/new/listCoupon",
        type:"post",
        data : {
            isUsed : 0,
            distributionModeId : modeId
        },
        success : function(result) {
            var couponList = result.data;
            sbc && sbc(couponList);
        }
    })
}

/**
 * 获取所有的菜品属性
 */
function getAllAttr(cbk) {
    $.ajax({
        url : baseUrl+"/wechat/article/new/articleAttrList",
        type:"post",
        success : function(result) {
            cbk && cbk(result.data);
        }
    });
}


/**
 * 查询首页图片列表
 */
function getHomePicture(scbk) {
    $.ajax({
        url : baseUrl+"/wechat/shop/new/pictureslider",
        type:"post",
        success : function(result) {
            for ( var i in result.data) {
                var pic = result.data[i];
                pic.pictureUrl = getPicUrl(pic.pictureUrl);

            }
            scbk && scbk(result.data);
        }
    });
}

/**
 * 查询店铺图片展示列表
 */
/*function getMapPicture(scbk) {
 $.ajax({
 url : "shop/pictureMap",
 type:"post",
 success : function(result) {
 for ( var i in result.data) {
 var pic = result.data[i];
 Map.pictureUrl = getPicUrl(Map.pictureUrl);
 }
 scbk && scbk(result.data);
 }
 });
 }*/

/**
 * 查询评论列表 通过基本参数查询
 */
function getAppraiseList(successCbk, options) {
    var defaultOptions = {
        maxLevel : 5,
        minLevel : 5,
        currentPage : 1,
        showCount : 3,
    };
    options = $.extend(defaultOptions, options);
    $.ajax({
        url : baseUrl+"/wechat/appraise/new/listAppraise",
        type:"post",
        data : options,
        success : function(result) {
            for ( var i in result.data) {
                var app = result.data[i];
                app.pictureUrl = getPicUrl(app.pictureUrl);
                app.createTime = new Date(app.createTime.time)
                    .format("MM-dd hh:mm");
            }
            successCbk && successCbk(result.data);
        }
    });
}

/**
 * 查询餐品列表
 */
function getArticleFamily(scbk, option) {
    $.ajax({
        url : baseUrl+"/wechat/article/new/articleFamilyList",
        type:"post",
        data : {
            distributionModeId: option.modeid
        },
        success : function(result) {
            var allFamilyList = result.data;
            var emptyFamily = {
                id:"-99999999",
                name:"已售罄",
                peference:9999
            };
            allFamilyList.push(emptyFamily);
            var familyMap = {};
            for ( var i in allFamilyList) {
                var f = allFamilyList[i];
                f.articles = [];
                f.currentCount = 0 ;
                familyMap[f.id] = f;
            }

            $.ajax({
                url : baseUrl+"/wechat/article/new/articleList",
                type:"post",
                data : {
                    distributionModeId: option.modeid
                },
                success : function(result) {

                    var allAttr = option.attr;
                    var articleList = result.data;
                    for ( var i in articleList) {
                        var a = articleList[i];
                        a.customerList=[];
                        a.photoSmall = getPicUrl(a.photoSmall);
                        a.originalAmount = a.price;
                        a.description&&(a.description = a.description.replace(/\n/g,"<br/>"));
                        if(a.fansPrice && a.discount && a.discount != 100){//如果存在粉丝价，则不对原价进行折扣计算（看起来原价会比较高，单纯的显示效果 By lmx）
                            //update ： 如果有折扣，则 粉丝价 = 原价 * 折扣   2017年4月18日 15:11:15   --- lmx
                            a.fansPrice = discount(a.price ,a.discount);
                        }else if(a.discount && a.discount != 100){
                            a.fansPrice = discount(a.price ,a.discount);
                        }else{
                            a.price = discount(a.price,a.discount);
                        }

                        a.realPrice = a.fansPrice || a.price;
                        a.count = 0;
                        a.number = 0;
                        a.unitName = null;
                        a.recommendList=[];
                        a.weightPackageList={};
                        a.weightPackageList.currentItem=[];
                        a.weightPackageList.details=[];
                        a.weightPackageList.name=null;
                        a.unitList=[];
                        a.shopCartId=null;
                        if(a.isEmpty){
                            emptyFamily.articles.push(a);
                            a.articlePrices=[];
                            continue;
                        }
                        if(a.articleType==1){
                            a.type = 1;
                            a.showAction=false;
                            a.hasUnit = [];
                            a.uuid = null;
                            if (a.articlePrices.length > 0) {
                                for ( var n in a.articlePrices) {
                                    var unit = a.articlePrices[n];
                                    // console.log(unit);
                                    unit.articleFamilyId = a.articleFamilyId;
                                    unit.recommendList = [];
                                    unit.customerList = [];
                                    unit.unitList = [];
                                    unit.count = 0;
                                    unit.number = 0;
                                    unit.showAction = false;
                                    unit.article = a;
                                    unit.type = 2;
                                    unit.originalAmount = unit.price;
                                    if(unit.fansPrice ){//如果存在粉丝价，则仍然对原价进行折扣计算（看起来原价会比较高，单纯的显示效果 By lmx）
                                        if(a.discount != 100){
                                            unit.fansPrice = discount(unit.price,a.discount);
                                        }
                                    }else{
                                        unit.price = discount(unit.price,a.discount);
                                    }
                                    unit.realPrice = unit.fansPrice
                                        || unit.price;
                                    unit.ids = [];
                                    var ids = unit.unitIds;
                                    if (ids.indexOf(",") > -1) {
                                        ids = ids.split(",");
                                        for ( var d in ids) {
                                            a.hasUnit.push(ids[d]);
                                        }
                                        unit.ids = ids;
                                    } else {
                                        unit.ids.push(ids);
                                        a.hasUnit.push(ids);
                                    }

                                }
                            }
                        }else if(a.articleType==2){
                            for(var j in a.mealAttrs){
                                var attr = a.mealAttrs[j];
                                attr.currentItem = [];
                                var hasDefault = false;
                                for(var n in attr.mealItems){
                                    var item = attr.mealItems[n];
                                    item.photoSmall = getPicUrl(item.photoSmall);
                                    if(item.isDefault && attr.choiceType == 0){ //必选 并且有默认值
                                        //attr.currentItem=[];
                                        //attr.currentItem[0] = item;
                                        //hasDefault=true;
                                        attr.currentItem.push(item);
                                        item.click =true;
                                    }else{
                                        item.click = false;
                                    }

                                }
                                if(attr.currentItem.length == 0 && attr.choiceType == 0){
                                    attr.currentItem = [];
                                    if(attr.mealItems){
                                        attr.currentItem[0] = attr.mealItems[0];
                                        attr.mealItems[0].click = true;
                                    }
                                }

                                //if(!hasDefault){
                                //	if(attr.mealItems != null && attr.mealItems.length > 0 ){
                                //		attr.currentItem = [];
                                //		attr.currentItem[0] = attr.mealItems[0];
                                //		attr.mealItems[0].click = true;
                                //	}
                                //
                                //}
                            }
                        }
                        var f = familyMap[a.articleFamilyId];
                        if (f) {
                            f.articles.push(a);
                        }
                    }

                    scbk && scbk(allFamilyList);
                }
            })

        },
    })
}

/**
 * 计算折扣后的价格
 * @param price
 * @param discount
 */
function discount (price,discount){
    if(price && discount){
        return parseFloat((price * discount / 100).toFixed(2));
    }else{
        return price;
    }
}

/**
 * 从数据库获取当前用户信息
 */
function getCustomer(sbc) {
    $.ajax({
        url : baseUrl+"/wechat/customer/new/customer",
        type:"post",
        async:false,
        success : function(user) {
            sbc && sbc(user.data);
        }
    });
}

/**
 * 查询某个订单的评论信息
 */
function getAppraiseByOrderId(orderId,sbk) {
    $.ajax({
        url : baseUrl+"/wechat/appraise/new/getAppraiseByOrderId",
        data:{orderId:orderId},
        type:"post",
        success : function(result) {
            sbk && sbk(result.data);
        }
    });
}

/**
 * 保存评论
 */
function saveOrderAppraise(appraise,sbk){
    $.post(baseUrl+"/wechat/appraise/new/saveAppraise",appraise,function(result){
        sbk&&sbk(result);
    });
}

/**
 * 根据优惠券类型查询对应的优惠券
 */
function showCouponList(couponType,sbk){
    $.post(baseUrl+"/wechat/customer/new/showCoupon",couponType,function(result){
        sbk&&sbk(result);
    });
}

/**
 * 发送手机验证码
 */
function sendCode(phone, successCbk) {
    $.ajax({
        url : baseUrl+"/wechat/customer/new/sendCodeMsg",
        type:"post",
        data : {
            phone : phone
        },
        success : function(result) {
            successCbk && successCbk(result);
        }
    });
}
function sendAliCode(phone, successCbk) {
    $.ajax({
        url : baseUrl+"/wechat/customer/new/sendAliCodeMsgNew",
        type:"post",
        data : {
            phone : phone
        },
        success : function(result) {
            successCbk && successCbk(result);
        }
    });
}

/**
 * 绑定用户手机信息
 */
function editPhone(phone, code, rcode, couponType, shareCustomer,shareOrderId, successCbk) {
    $.ajax({
        url : baseUrl+"/wechat/customer/new/editPhone",
        type:"post",
        data : {
            code : code,
            phone : phone,
            rcode : rcode,
            couponType : couponType,
            shareCustomer : shareCustomer,
            shareOrderId:shareOrderId
        },
        success : function(result) {
            successCbk && successCbk(result);
        }
    })
}

function saveOrderForm(orderForm, sbk,error) {
    console.log(orderForm);
    $.ajax({
        url : baseUrl+"/wechat/order/new/saveOrder",
        //contentType:"application/json",
        type : "post",
        data: {orderArray:JSON.stringify(orderForm)},
        success : function(result) {
            sbk && sbk(result);
        },
        error:function(a,b,c,d){
            error&&error(a,b,c,d);
        }
    });
}

function repayOrder(orderForm, sbk,error) {
    console.log(orderForm);
    $.ajax({
        url : baseUrl+"/wechat/order/new/repayOrder",
        //contentType:"application/json",
        type : "post",
        data: {orderArray:JSON.stringify(orderForm)},
        success : function(result) {
            sbk && sbk(result);
        },
        error:function(a,b,c,d){
            error&&error(a,b,c,d);
        }
    });
}


function resaveOrderForm(orderForm, sbk,error) {
    console.log(orderForm);
    $.ajax({
        url : baseUrl+"/wechat/order/new/resaveOrder",
        //contentType:"application/json",
        type : "post",
        data: {orderArray:JSON.stringify(orderForm)},
        success : function(result) {
            sbk && sbk(result);
        },
        error:function(a,b,c,d){
            error&&error(a,b,c,d);
        }
    });
}


function refundPaymentByUnfinishedOrder(orderId, sbk,error) {
    $.ajax({
        url : baseUrl+"/wechat/order/new/refundPaymentByUnfinishedOrder",
        //contentType:"application/json",
        type : "post",
        async: false,
        data: {orderId:orderId},
        success : function(result) {
            sbk && sbk(result);
        },
        error:function(a,b,c,d){
            error&&error(a,b,c,d);
        }
    });
}


function openWechatPay(orderid, successCbk, errorCbk,cancelCbk) {
    $.ajax({
        url: baseUrl + "/wechat/jsWxPayconfig",
        type: "post",
        data: {"query": getUrlParam(window.location.href)},
        async: false,
        dataType: "json",
        success: function (f) {
            console.log(getUrlParam(window.location.href));
            console.log(JSON.stringify(f));
            var wxPayAPIInfo = f;
            wx.config(wxPayAPIInfo.data);
            $.ajax({
                url : baseUrl+"/wechat/order/new/payOrderWx",
                type:"post",
                data : {
                    orderId : orderid
                },
                success : function(result) {
                    if(result.success){
                        var js_api_params = result.data;
                        console.log(js_api_params);
                        wx.chooseWXPay({
                            timestamp : js_api_params.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                            nonceStr : js_api_params.nonceStr, // 支付签名随机串，不长于 32 位
                            "package" : js_api_params["package"], // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                            signType : js_api_params.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                            paySign : js_api_params.paySign, // 支付签名
                            success : function(res) {
                                successCbk && successCbk();
                            },
                            cancel:function(res){
                                cancelCbk&&cancelCbk();
                            },
                            fail:function(res){
                                alert("fail:"+res.errMsg);
                            },
                            error:function(res){
                                alert("error"+res);
                            }
                        });
                    }else{
                        errorCbk && errorCbk(result.message);
                    }

                }
            });
        }
    });
}

function openWechatPayNew(orderid,factMoney, successCbk, errorCbk,cancelCbk) {
    wx.config(wxPayAPIList.data);
    $.ajax({
        url : baseUrl+"/wechat/order/new/payOrderWxNew",
        type:"post",
        data : {
            orderId : orderid,
            factMoney:factMoney.toString()
        },
        success : function(result) {
            if(result.success){
                var js_api_params = result.data;
                console.log(js_api_params);
                wx.chooseWXPay({
                    timestamp : js_api_params.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                    nonceStr : js_api_params.nonceStr, // 支付签名随机串，不长于 32 位
                    "package" : js_api_params["package"], // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                    signType : js_api_params.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                    paySign : js_api_params.paySign, // 支付签名
                    success : function(res) {
                        successCbk && successCbk();
                    },
                    cancel:function(res){
                        cancelCbk&&cancelCbk();
                    },
                    fail:function(res){
                        alert("fail:"+res.errMsg);
                    },
                    error:function(res){
                        alert("error"+res);
                    }
                });
            }else{
                errorCbk && errorCbk(result.message);
            }

        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
        }
    });
}

/**
 * 取消订单
 */
function cancelOrderRequest(oid,sbk){
    $.ajax({
        url:baseUrl+"/wechat/order/new/cancelOrder",
        type:"post",
        data:{orderId : oid},
        success:function(result){
            sbk&&sbk(result);
        }
    });
}

/**
 * 确认下单
 */
function pushOrderRequest(oid,sbk){
    $.ajax({
        url:baseUrl+"/wechat/order/new/pushOrder",
        type:"post",
        data:{orderId : oid},
        success:function(result){
            sbk&&sbk(result);
        }
    });
}

/**
 * 获得店铺的配置
 */
function getShopSetting(sbk){
    $.ajax({
        url:baseUrl+"/wechat/shop/currentshop",
        type:"post",
        success:function(result){
            sbk&&sbk(result.data);
        }
    });
}


/**
 * 获取充值列表
 */
/*function getChargeList(sbk){
 $.post("data/rulesList.json",null,function(result){
 var rules = result.data;
 sbk&&sbk(rules);
 });
 }*/

function getChargeList(sbk){
    $.ajax({
        url:baseUrl+"/wechat/charge/new/rulesList",
        type:"post",
        success:function(result){
            var rules = result.data;
            sbk && sbk(rules);
        }
    })
}
/**
 * 生成微信充值支付请求
 */
function chargeWxRequest(charge_id,customer_id,successCallback,cancelCbk){
    wx.config(wxPayAPIList.data);
    $.post(baseUrl+"/wechat/charge/new/chargeWx",{settingId:charge_id,customerId:customer_id},function(result){
        if(result.success){
            var js_api_params = result.data;
            wx.chooseWXPay({
                timestamp : js_api_params.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                nonceStr : js_api_params.nonceStr, // 支付签名随机串，不长于 32 位
                "package" : js_api_params["package"], // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                signType : js_api_params.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                paySign : js_api_params.paySign, // 支付签名
                success : function(res) {
                    successCallback&&successCallback();
                },
                cancel:function(){
                    cancelCbk&&cancelCbk();
                },
                fail:function(res){
                    alert("失败"+res.errMsg);
                }
            });
        }else{
            alert(result.message);
        }
    });
}

function setTableNumber(oid,tnumber,cbk){
    $.post(baseUrl+"/wechat/order/new/settable",{orderId:oid,tableNumber:tnumber},function(result){
        cbk&&cbk(result);
    });
}

function scanSoupNumber(sbk){
    wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: function (res) {
            var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
            sbk&&sbk(result);
        },
        error:function(res){
            if(res.errMsg.indexOf('function_not_exist') > 0){
                alert('版本过低请升级')
            }
        }
    });
}

function scanTableNumber(sbk){
    wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: function (res) {
            var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
            sbk&&sbk(result);
        },
        error:function(res){
            if(res.errMsg.indexOf('function_not_exist') > 0){
                alert('版本过低请升级')
            }
        }
    });
}

function scanNumber(sbk){
    wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: function (res) {
            var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
            sbk&&sbk(result);
        },
        error:function(res){
            if(res.errMsg.indexOf('function_not_exist') > 0){
                alert('版本过低请升级')
            }
        }
    });
}

/*测试清空购物车*/
function clearAllShopCart(sbk){
    $.post(baseUrl+"/wechat/shop/new/emptyShopCart",function(result){
        cbk&&cbk(result);
    });
}

/**
 * 测试解绑手机号码
 */
function unbindPhone(sbk){
    $.post("customer/unBindPhone",function(result){
        cbk&&cbk(result);
    });
}

function updateNewNoticeTime(cbk){
    $.post("customer/updateNewNoticeTime",function(result){
        cbk&&cbk(result);
    });
}

function getAppraiseInfo(aid,cbk){
    $.post(baseUrl+"/wechat/appraise/new/getAppraiseInfo",{appraiseId:aid},function(result){
        var data = result.data;
        if(data.appraiseFiles){
            for(var i=0;i<data.appraiseFiles.length;i++){
                if(data.appraiseFiles[i].fileUrl){
                    data.appraiseFiles[i].fileUrl = getPicUrl(data.appraiseFiles[i].fileUrl);
                }
                if(data.appraiseFiles[i].photoSquare){
                    data.appraiseFiles[i].photoSquare = getPicUrlSquare(data.appraiseFiles[i].photoSquare);
                }
            }
        }
        cbk&&cbk(data);
    });
}

function getShareDetailed(aid,cbk){
    $.post(baseUrl+"/wechat/appraise/new/getShareDetailed",{appraiseId:aid},function(result){
        var data = result.data;
        var appraise = data.appraise;
        var setting = data.setting;
        if(appraise){
            appraise.pictureUrl = getPicUrl(appraise.pictureUrl);
        }
        if(setting){
            setting.shareIcon = getPicUrl(setting.shareIcon);
        }
        cbk&&cbk(data);
    });
}

function getRewardDetailed(sbk){
    $.post(baseUrl+"/wechat/appraise/new/getRewardDetailed",null,function(result){
        sbk&&sbk(result.data);
    })
}

/*获取用户消费记录*/



/*模糊查询品牌下的城市*/
function selectByShopCity(sbk){
    $.ajax({
        url:baseUrl+"/wechat/shop/new/selectByShopCity",
        type:"post",
        success:function(result){
            var result = result.data;
            sbk && sbk(result);
        }
    })
}

/*模糊查询店铺*/
function selectByCityOrName(name,sbk){
    $.ajax({
        url:baseUrl+"/wechat/shop/new/selectByCityOrName",
        type:"post",
        data:{name:name},
        success:function(result){
            var result = result.data;
            sbk && sbk(result);
        }
    })
}

function orderByIndex(sbk){
    $.ajax({
        url:baseUrl+"/wechat/shop/new/orderByIndex",
        type:"post",
        success:function(result){
            var result = result.data;
            sbk && sbk(result);
        }
    })
}

function wxgetLocation(sbk){
    wx.getLocation({
        type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: function (res) {
            sbk && sbk(res);
        },
        cancel: function(res){
            sbk && sbk(res)
        },
        fail:function(res){
            sbk && sbk(res)
        },
        error:function(res){
            sbk && sbk(res)
        }
    });
}

//点赞
function praise(appraiseId,sbk){
    $.ajax({
        url:baseUrl+"/wechat/appraiseNew/save/praise",
        data:{appraiseId:appraiseId},
        type:"post",
        success:function(result){
            sbk && sbk(result);
        }
    })
}

//取消赞
function canelPraise(appraiseId,sbk){
    $.ajax({
        url:baseUrl+"/wechat/appraiseNew/del/praise",
        data:{appraiseId:appraiseId},
        type:"post",
        success:function(result){
            sbk && sbk(result);
        }
    })
}

//评论
function commentSubmit(content,appraiseId,customerId,pid,sbk){
    $.ajax({
        url:baseUrl+"/wechat/appraiseNew/save/comment",
        data:{content:content,appraiseId:appraiseId,customerId:customerId,pid:pid},
        type:"post",
        success:function(result){
            sbk && sbk(result);
        }
    })
}

//用户的评论点赞回复数
function appraiseCount(sbk){
    $.ajax({
        url:baseUrl+"/wechat/appraiseNew/my/appraiseCount",
        type:"post",
        success:function(result){
            sbk && sbk(result.data);
        }
    })
}

function appraiseAll(options,sbk){
    var defaultOptions = {
        currentPage : 1,
        showCount : 3,
    };
    options = $.extend(defaultOptions, options);
    $.ajax({
        url:baseUrl+"/wechat/appraiseNew/my/appraise",
        data : options,
        type:"post",
        success:function(result){
            sbk && sbk(result.data);
        }
    })
}

function getUnitAll(sbk) {
    $.ajax({
        url : baseUrl+"/wechat/order/new/getUnitAll",
        type:"post",
        success : function(result) {
            sbk && sbk(result.data,result.map);
        }
    });
}

function appraiseCustomer(appraiseId, sbk) {
    $.ajax({
        url : baseUrl+"/wechat/appraiseNew/new/appraiseCustomer",
        data:{appraiseId:appraiseId},
        type:"post",
        success : function(result) {
            sbk && sbk(result.data);
        }
    });
}

/*获取加密的二维码*/
function getTable(vv, cbk){
    $.post(baseUrl+"/wechat/order/getTable",{id:vv},function(result){
        cbk&&cbk(result.data);
    });
}

/*获取职业信息*/
function getVocation(){
    $.ajax({
        url:baseUrl+"/wechat/other/vocationlist",
        type:"post",
        success:function(result){
            if(result.success){
                s&&s(result.data);
            }else{
                s&&s(null);
            }
        }
    });
}

function getModuleSetting(cbk){
    $.post(baseUrl+"/wechat/shop/new/moduleSetting",null,function(result){
        cbk&&cbk(result.data);
    });
}

function shareCustomerCount(customerId,cbk){
    $.post(baseUrl+"/wechat/customer/new/shareCustomerCount",{customerId:customerId},function(result){
        cbk&&cbk(result);
    });
}

function afterPay(orderId,couponId,price,pay,waitMoney,payMode,s){
    $.ajax({
        url:baseUrl+"/wechat/order/new/afterPay",
        data:{orderId:orderId,couponId:couponId,price:price,pay:pay,waitMoney:waitMoney,payMode:payMode},
        type:"post",
        async:false,
        success:function(result){
            s&&s(result);
        }
    });
}

function modifyBirthDate(customerId,birthDate,age,constellation,cbk){
    $.ajax({
        url:baseUrl+"/wechat/customer/new/modifyBirthDate",
        data:{customerId:customerId,birthDate:birthDate,age:age,constellation:constellation},
        dataType:'json',
        type:"post",
        success:function(result){
            cbk&&cbk(result);
        }
    });
}

function updateIsPay(orderId,sbk){
    $.ajax({
        url:baseUrl+"/wechat/order/new/updateIsPay",
        data:{orderId:orderId},
        type:"post",
        success:function(result){
            sbk&&sbk(result);
        }
    });
}

function customerShare(object,cbk) {
    $.ajax({
        url:baseUrl+"/wechat/customer/new/customerShare",
        data: object,
        dataType:'json',
        type:"post",
        success:function(result){
            cbk&&cbk(result);
        }
    });
}

function updateOrderPayMode(orderId, payMode, sbk){
    $.ajax({
        url:baseUrl+"/wechat/order/new/updateOrderPayMode",
        data:{orderId:orderId,payMode:payMode},
        type:"post",
        success:function(result){
            sbk&&sbk(result);
        }
    });
}

/*获取用户所有配送地址,以及默认送货地址*/
function getCustomerAddress(customer_id,sbc) {
    $.ajax({
        url: baseUrl+"/wechat/address/list",
        data:{
            customer_id:customer_id
        },
        type:"post",
        success:function(user){
            sbc && sbc(user);
        }
    });
}

/*添加用户地址*/
function addCustomerAddress(name,sex,mobileNo,address,addressReality,longitude,latitude,state,sbc) {
    $.ajax({
        url:baseUrl+"/wechat/address/insert",
        data:{
            name:name,
            sex:sex,
            mobileNo:mobileNo,
            address:address,
            addressReality:addressReality,
            longitude:longitude,
            latitude:latitude,
            state:state
        },
        type:"post",
        success:function(user){
            sbc && sbc(user);
        }
    });
}
/*根据id查询用户地址*/
function choiceCustomerAddress(id,sbc) {
    $.ajax({
        url: baseUrl+"/wechat/address/show",
        data:{
            id:id
        },
        type:"post",
        success:function(user){
            sbc && sbc(user)
        }
    });
}
/*编辑用户地址*/
function editCustomerAddress(id,name,sex,mobileNo,address,addressReality,state,sbc) {
    $.ajax({
        url: baseUrl+"/wechat/address/update",
        data:{
            id:id,
            name:name,
            sex:sex,
            mobileNo:mobileNo,
            address:address,
            addressReality:addressReality,
            state:state
        },
        type:"post",
        success:function(user){
            sbc && sbc(user)
        }
    });
}
/*获取新品推荐类型*/
function getRecommendType(shopId,scbk){
    $.ajax({
        url:baseUrl+"/wechat/article/recommendCategoryList",
        type:"post",
        data:{
            shopId:shopId
        },
        async: false,
        success:function(result){
            var that = this;
            var allFamilyList = result.data;
            var familyMap = {};
            var recommendId;
            for ( var i in allFamilyList) {
                var f = allFamilyList[i];
                f.curCount = 0;
                f.articles = [];
                f.currentCount = 0;
                familyMap[f.id] = f;
                recommendId = f.id;
                $.ajax({
                    url : baseUrl+"/wechat/article/articleRecommendCategoryList",
                    type: "post",
                    data : {
                        recommendCcategoryId: recommendId
                    },
                    success : function(result) {
                        var articleList = result.data;
                        for ( var i in articleList) {
                            var a = articleList[i];
                            a.data = null;
                            a.photoSmall = getPicUrl(a.photoSmall);
                            a.originalAmount = a.price;
                            a.description&&(a.description = a.description.replace(/\n/g,"<br/>"));
                            if(a.fansPrice && a.discount && a.discount != 100){//如果存在粉丝价，则不对原价进行折扣计算（看起来原价会比较高，单纯的显示效果 By lmx）
                                //update ： 如果有折扣，则 粉丝价 = 原价 * 折扣   2017年4月18日 15:11:15   --- lmx
                                a.fansPrice = discount(a.price ,a.discount);
                            }else if(a.discount && a.discount != 100){
                                a.fansPrice = discount(a.price ,a.discount);
                            }else{
                                a.price = discount(a.price,a.discount);
                            }

                            a.realPrice = a.fansPrice || a.price;
                            a.count = 0;
                            a.number = 0;
                            a.unitName = null;
                            a.recommendList=[];
                            a.weightPackageList={};
                            a.weightPackageList.currentItem=[];
                            a.weightPackageList.details=[];
                            a.weightPackageList.name=null;
                            a.unitList=[];
                            a.shopCartId=null;
                            if(a.articleType==1){
                                a.type = 1;
                                a.showAction=false;
                                a.hasUnit = [];
                                if (a.articlePrices.length > 0) {
                                    for ( var n in a.articlePrices) {
                                        var unit = a.articlePrices[n];
                                        // console.log(unit);
                                        unit.articleFamilyId = a.articleFamilyId;
                                        unit.recommendList = [];
                                        unit.unitList = [];
                                        unit.count = 0;
                                        unit.number = 0;
                                        unit.showAction = false;
                                        unit.article = a;
                                        unit.type = 2;
                                        unit.originalAmount = unit.price;
                                        if(unit.fansPrice ){//如果存在粉丝价，则不对原价进行折扣计算（看起来原价会比较高，单纯的显示效果 By lmx）
                                            unit.fansPrice = discount(unit.fansPrice,a.discount);
                                        }else{
                                            unit.price = discount(unit.price,a.discount);
                                        }
                                        unit.realPrice = unit.fansPrice
                                            || unit.price;
                                        unit.ids = [];
                                        var ids = unit.unitIds;
                                        if (ids.indexOf(",") > -1) {
                                            ids = ids.split(",");
                                            for ( var d in ids) {
                                                a.hasUnit.push(ids[d]);
                                            }
                                            unit.ids = ids;
                                        } else {
                                            unit.ids.push(ids);
                                            a.hasUnit.push(ids);
                                        }

                                    }
                                }
                            }else if(a.articleType==2){
                                for(var j in a.mealAttrs){
                                    var attr = a.mealAttrs[j];
                                    attr.currentItem = [];
                                    var hasDefault = false;
                                    for(var n in attr.mealItems){
                                        var item = attr.mealItems[n];
                                        item.photoSmall = getPicUrl(item.photoSmall);
                                        if(item.isDefault && attr.choiceType == 0){ //必选 并且有默认值
                                            attr.currentItem.push(item);
                                            item.click =true;
                                        }else{
                                            item.click = false;
                                        }

                                    }
                                    if(attr.currentItem.length == 0 && attr.choiceType == 0){
                                        attr.currentItem = [];
                                        if(attr.mealItems){
                                            attr.currentItem[0] = attr.mealItems[0];
                                            attr.mealItems[0].click = true;
                                        }
                                    }
                                }
                            }
//							console.log(a.recommendCategoryId);
                            var f = familyMap[a.recommendCategoryId];

                            if (f) {
                                f.articles.push(a);
                            }
                        }
                    }
                })
            }
            scbk && scbk(allFamilyList);
        }

    });
}

/**
 * 修改用户点过的分享链接地址
 * @param object
 * @param cbk
 */
function updateCustomerShareLink(shareLinkJson,cbk) {
    $.ajax({
        url:baseUrl+"/wechat/customer/new/updateCustomerShareLink",
        data: {shareLinkJson : shareLinkJson},
        dataType:'json',
        type:"post",
        success:function(result){
            cbk&&cbk(result.customer);
        }
    });
}

/*返利的金额*/
function getShareMoney(customerId,currentPage,showCount,cbk) {
    $.ajax({
        url:baseUrl+"/wechat/customer/new/getShareMoneyList",
        data:{
            customerId:customerId,
            currentPage:currentPage,
            showCount:showCount
        },
        dataType:'json',
        type:"post",
        success:function(result){
            cbk&&cbk(result.data);
        }
    });
}

/*邀请的用户*/
function getShareCustomer(customerId,currentPage,showCount,cbk) {
    $.ajax({
        url:baseUrl+"/wechat/customer/new/getShareCustomerList",
        data:{
            customerId:customerId,
            currentPage:currentPage,
            showCount:showCount
        },
        dataType:'json',
        type:"post",
        success:function(result){
            cbk&&cbk(result.data);
        }
    });
}

/**
 * 记录用户扫码新版二维码的行为日志
 * @param cbk
 */
function penScanLog(customerId,vv,cbk) {
    $.ajax({
        url:baseUrl+"/wechat/customer/new/penScan",
        data:{
            customerId: customerId,
            vv:vv
        },
        type:"post",
        success:function(result){
            cbk&&cbk(result);
        }
    });
}

/**
 * 记录用户是否使用余额的开关日志
 */
function useCheckedAccountLog(type, cbk){
    $.ajax({
        url:baseUrl+"/wechat/customer/useCheckedAccountLog",
        data:{type: type},
        type:"post",
        success:function(result){
            cbk&&cbk(result);
        }
    });
}

/**
 * 判断用户是否已经关注
 */
function checkCustomerSubscribe(cbk){
    $.ajax({
        url:baseUrl+"/wechat/customer/checkCustomerSubscribe",
        type:"post",
        success:function(result){
            cbk&&cbk(result);
        }
    });
}

/**
 * 创建新组
 */
function createNewGroup(customerId,shopDetailId,tableNumber,cbk){
    $.ajax({
        url:baseUrl+"/wechat/duoren/groupNew",
        data:{
            customerId:customerId,
            shopDetailId:shopDetailId,
            tableNumber:tableNumber
        },
        type:"post",
        success:function(result){
            cbk&&cbk(result);
        }
    });
}

/**
 * 查询桌号下所有群组
 */
function showGroupList(customerId,tableNumber,shopDetailId,cbk){
    $.ajax({
        url:baseUrl+"/wechat/duoren/shopGroupList",
        async:false,
        data:{
            customerId:customerId,
            tableNumber:tableNumber,
            shopDetailId:shopDetailId
        },
        type:"post",
        success:function(result){
            cbk&&cbk(result);
        },
        error:function(res){
            console.log(res);
        }
    });
}

/**
 * 加入当前群组
 */
function addNowGroup(shopDetailId,tableNumber,customerId,groupId,cbk){
    $.ajax({
        url:baseUrl+"/wechat/duoren/addGroup",
        data:{
            shopDetailId:shopDetailId,
            tableNumber:tableNumber,
            customerId:customerId,
            groupId:groupId
        },
        type:"post",
        success:function(result){
            cbk&&cbk(result);
        }
    });
}

/**
 * 多人点餐判断菜品是否重复
 */
function checkRepeatArticle(articleId,groupId,customerId,cbk){
    $.ajax({
        url:baseUrl+"/wechat/duoren/checkRepeat",
        data:{
            articleId:articleId,
            groupId:groupId,
            customerId:customerId
        },
        async:false,
        type:"post",
        success:function(result){
            cbk&&cbk(result);
        }
    });
}

/**
 * 多人点餐群主踢人
 */
function getOutOffGroup(customerId,shopDetailId,tableNumber,cbk){
    $.ajax({
        url:baseUrl+"/wechat/duoren/removeCustomer",
        data:{
            customerId:customerId,
            shopDetailId:shopDetailId,
            tableNumber:tableNumber
        },
        type:"post",
        success:function(result){
            cbk&&cbk(result);
        }
    });
}

/**
 * 是否有火锅锅底
 */
function getPortSoup(shopId,tableNumber,customerId,cbk){
    $.ajax({
        url:baseUrl+"/wechat/duoren/getArticleBefore",
        data:{
            shopId:shopId,
            tableNumber:tableNumber,
            customerId:customerId
        },
        type:"post",
        success:function(result){
            cbk&&cbk(result);
        }
    });
}


/**
 * 创建锅底
 * @param shopId
 * @param tableNumber
 * @param customerId
 * @param cbk
 */
function saveArticleBefore(order,item,cbk){
    $.ajax({
        url:baseUrl+"/wechat/duoren/saveArticleBefore",
        data:{
            customerId:order.customerId,
            shopDetailId:order.shopDetailId,
            tableNumber:order.tableNumber,
            brandId:order.brandId,
            orderItem:item
        },
        type:"post",
        success:function(result){
            cbk&&cbk(result);
        }
    });
}

/**
 * 查询锅底下的菜品
 */
function getSoupOrder(tableNumber,shopId,customerId,cbk){
    $.ajax({
        url:baseUrl+"/wechat/duoren/getOrderBefore",
        data:{
            tableNumber:tableNumber,
            shopId:shopId,
            customerId:customerId
        },
        type:"post",
        success:function(result){
            cbk&&cbk(result);
        }
    });
}

/**
 * 重量包
 */
function getWeightPacketInfo(weightPackageId,cbk){
    $.ajax({
        url:baseUrl+"/wechat/article/articleWeightPackage",
        data:{
            weightPackageId:weightPackageId
        },
        type:"post",
        success:function(result){
            cbk&&cbk(result);
        }
    });
}

/**
 * 店铺下所有的重量包
 */
function getWeightPacketList(cbk){
    $.ajax({
        url:baseUrl+"/wechat/article/weightPackageList",
        type:"post",
        success:function(result){
            cbk&&cbk(result);
        }
    });
}

/**
 * 新的评价权重
 */
function getNewAppraiseScore(cbk){
    $.ajax({
        url:baseUrl+"/wechat/newAppraise/appraiseType",
        type:"post",
        success:function(result){
            cbk&&cbk(result);
        }
    });
}

/**
 * 根据orderId查询订单菜品
 */
function getAppraiseActicle(oid,sbk){
    $.ajax({
        url : baseUrl+"/wechat/newAppraise/customerOrderArticle",
        type:"post",
        async: false,
        data : {orderId:oid},
        success : function(result) {
            sbk&&sbk(result.data);
        }
    });
}

/**
 * 插入新评论
 */
function saveNewAppraise(options,cbk){
    $.ajax({
        url:baseUrl+"/wechat/newAppraise/addAppraise",
        contentType: 'application/json',
		data:JSON.stringify(options),		
		type:"post",
        success:function(result){
            cbk&&cbk(result);
        }
    });
}

/**
 * 查询new评论列表
 */
function getNewAppraiseList(successCbk, options) {
    var defaultOptions = {
        currentPage : 1,
        showCount : 3,
    };
    options = $.extend(defaultOptions, options);
    $.ajax({
        url : baseUrl+"/wechat/newAppraise/appraiseCustomer",
        type:"post",
        data : options,
        success : function(result) {
//          for ( var i in result.data) {
//              var app = result.data[i];
//              app.pictureUrl = getPicUrl(app.pictureUrl);
//              app.createTime = new Date(app.createTime.time)
//                  .format("MM-dd hh:mm");
//          }
            successCbk && successCbk(result.data);
        }
    });
}

/*查询个人的所有新评论*/
function customerAppraiseAll(options,sbk){
    var defaultOptions = {
        currentPage : 1,
        showCount : 3,
    };
    options = $.extend(defaultOptions, options);
    $.ajax({
        url:baseUrl+"/wechat/newAppraise/myAppraiseCustomer",
        data : options,
        type:"post",
        success:function(result){
            sbk && sbk(result.data);
        }
    })
}

function getCustomerAppraiseCount(cbk){
    $.ajax({
        url:baseUrl+"/wechat/newAppraise/my/appraiseCount",
        contentType: 'application/json',	
		type:"post",
        success:function(result){
            cbk&&cbk(result);
        }
    });
}

function getCustomerAppraiseNew(appraiseId,cbk){
    $.ajax({
        url:baseUrl+"/wechat/newAppraise/getAppraiseInfo",
        data : {
        	appraiseId:appraiseId
        },
		type:"post",
        success:function(result){
            cbk&&cbk(result);
        }
    });
}

function checkShopOpenNewPosNow(shopId, cbk){
    $.ajax({
        url:baseUrl+"/wechat/shop/checkShopOpenNewPosNow",
        data : {
            shopId:shopId
        },
        type:"post",
        success:function(result){
            cbk&&cbk(result);
        }
    });
}
