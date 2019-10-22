
//baseUrl = "http://tdb.restoplus.cn/bigData/rest/";
//baseUrl = "http://test.tt.com:8083";

/*根据用户id查询发票抬头列表*/
function getInvoiceList(customer_id,sbk) {
	$.ajax({
		url : baseUrl+"/wechat/receipt/receiptTitleList",
		type:"post",
		data : {
			customer_id : customer_id
		},
		success:function(result){
			sbk&&sbk(result);
		}
	});
}

/*根据用户id和类型查询发票抬头列表*/
function getTypeList(customer_id,type,sbk) {
	$.ajax({
		url : baseUrl+"/wechat/receipt/receiptTitleTypeList",
		type:"post",
		data : {
			customer_id : customer_id,
			type:type
		},
		success:function(result){
			sbk&&sbk(result);
		}
	});
}

/*查询默认发票抬头*/
function getDefault(customer_id,sbk) {
	$.ajax({
		url : baseUrl+"/wechat/receipt/receiptTitleDefaultList",
		type:"post",
		data : {
			customer_id : customer_id
		},
		success:function(result){
			sbk&&sbk(result);
		}
	});
}

/*增加单位发票抬头*/
function addInvoice(state,customerId,type,name,dutyParagraph,companyAddress,mobileNo,bankOfDeposit,bankNumber,sbk) {
	$.ajax({
		url : baseUrl+"/wechat/receipt/insertReceiptTitle",
		type:"post",
		data : {
			state:state,
			customerId : customerId,
			type : type,
			name : name,
			dutyParagraph : dutyParagraph,
			companyAddress : companyAddress,
			mobileNo : mobileNo,
			bankOfDeposit : bankOfDeposit,
			bankNumber : bankNumber
		},
		success : function(result) {
			sbk && sbk(result);
		}
	});
}

/*增加个人发票抬头*/
function addInvoicePerson(state,customerId,type,name,sbk) {
	$.ajax({
		url : baseUrl+"/wechat/receipt/insertReceiptTitle",
		type:"post",
		data : {
			state:state,
			customerId : customerId,
			type : type,
			name : name,
		},
		success : function(result) {
			sbk && sbk(result);
		}
	});
}

/*更新发票抬头*/
function updateInvoice(customerId,id,type,name,dutyParagraph,companyAddress,mobileNo,bankOfDeposit,bankNumber,state,sbk) {
	$.ajax({
		url : baseUrl+"/wechat/receipt/updateReceiptTitle",
		type:"post",
		data : {
			customerId:customerId,
			id : id,
			type : type,
			name : name,
			dutyParagraph : dutyParagraph,
			companyAddress : companyAddress,
			mobileNo : mobileNo,
			bankOfDeposit : bankOfDeposit,
			bankNumber : bankNumber,
			state:state
		},
		success : function(result) {
			sbk && sbk(result);
		}
	});
}

/*根据用户id、发票状态查询订单列表*/
function searchInvoiceOrderList(customer_id,shopId,sbk) {
	$.ajax({
		url : baseUrl+"/wechat/receipt/receiptOrderList",
		type:"post",
		data : {
			customer_id : customer_id,
			shopId:shopId
		},
		success : function(result) {
			sbk && sbk(result);
		}
	});
}

/*历史记录*/
function searchInvoiceOrder(shopId,customer_id,state,sbk) {
	$.ajax({
		url : baseUrl+"/wechat/receipt/receiptOrderList",
		type:"post",
		data : {
			shopId:shopId,
			customer_id : customer_id,
			state : state
		},
		success : function(result) {
			sbk && sbk(result);
		}
	});
}
/*增加发票信息*/
function insertVoices(orderNumber,payTime,orderMoney,receiptMoney,receiptTitleId,shopId,state,sbk) {
	$.ajax({
		url : baseUrl+"/wechat/receipt/insertReceipt",
		type:"post",
		data : {
			orderNumber : orderNumber,
			payTime:payTime,
			orderMoney : orderMoney,
			receiptMoney : receiptMoney,
			receiptTitleId : receiptTitleId,
			shopId:shopId,
			state : state
		},
		success : function(result) {
			sbk && sbk(result);
		}
	});
}

/*获取电子发票*/
//function applyEleTicket(shopId,customer_id,sbk) {
//	$.ajax({
//		url : baseUrl+"/wechat/ticket/selectEnableTicketOrder",
//		type:"post",
//		data : {
//			shopId:shopId,
//			customer_id : customer_id,
//		},
//		success : function(result) {
//			sbk && sbk(result);
//		}
//	});
//}

/*申请电子发票*/
function applyEleTicket(obj,sbk) {
	$.ajax({
		url : baseUrl+"/wechat/receipt/TicketToMany",
		type:"post",
		contentType:'application/json',
		data:JSON.stringify(obj),
		success : function(result) {
			sbk && sbk(result);
		}
	});
}

/*电子发票历史记录*/
function historyEleTicket(customerId,shopId,sbk) {
	$.ajax({
		url : baseUrl+"/wechat/receipt/selectElectronicTicket",
		type:"post",
		data:{
			customerId:customerId,
			shopId:shopId
		},
		success : function(result) {
			sbk && sbk(result);
		}
	});
}

/*电子发票历史记录*/
function sendEmail(emailStr,ticketId,sbk) {
	$.ajax({
		url : baseUrl+"/wechat/receipt/sendEmail",
		type:"post",
		data:{
			emailStr:emailStr,
			ticketId:ticketId
		},
		success : function(result) {
			sbk && sbk(result);
		}
	});
}