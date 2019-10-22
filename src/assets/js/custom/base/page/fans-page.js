var fansBaseMix = {
	template:$("#fans-temp").html(),
	mixins: [subpageMix,noticeMix],
	data:function(){
		return {
			appraiseCount:{},
			countList:[],
			appraiseList:[],
			maxLevel:5,
			minLevel:5,
			praiseFlag:true,
			currentPage:0,
			displayAllShow:false,
			showCount:3,
			isLoad:false,
			isOver:false,
			appraiseFilterDialog:{show:false},
			iframeDialogComment:{show:false, appraise:null, customer:null, comment:null},
			iframeDialogPhoto:{show:false,appraise:null,picindex:0},
		};
	},
	methods:{
		showBigPhoto:function(appraise,picindex){
			this.iframeDialogPhoto.picindex = picindex;
			this.iframeDialogPhoto.appraise = appraise;
			this.iframeDialogPhoto.show = true;
//				var count = appraise.appraiseFiles.length;
		},
		showSmallPhoto:function(){
			this.showBig = false;
			this.appraiseBigPhoto = [];
		},
		showFilter:function(){
			this.appraiseFilterDialog.show=true;
			var that = this;
			Vue.nextTick(function () {
                that.scrollDialog = new IScroll(".weui_dialog_bd", {
                    probeType: 2,
                    click: iScrollClick(),
                });                   
            });					
		},			
		reloadAppraise:function(min,max){
			this.isLoad=false;
			this.isOver=false;
			this.currentPage=0;
			this.minLevel=min;
			this.maxLevel=max;
			this.appraiseList=[];
			this.loadNextPage();
		},
		reflushIsc:function(){
			if(!this.isc){
				var that = this;
				this.isc = new IScroll(".stopIscroll",{
					probeType : 2,
					click:iScrollClick(),
				});
				this.isc.on("scrollEnd",function(){
					if (this.y <= this.maxScrollY) {
						that.loadNextPage();
						this.refresh();
					}
				});					
			}
			this.isc.refresh();
		},
		loadNextPage:function(){
			var that = this;
			if(!that.isLoad&&!that.isOver){
				that.isLoad = true;
				var option = {
					currentPage:that.currentPage,
					minLevel:that.minLevel,
					maxLevel:that.maxLevel,
					showCount:that.showCount
				};
				getAppraiseList(function(appraiseList){
					for(var i in appraiseList){
						that.appraiseList.push(appraiseList[i]);
						appraiseList[i].isParse = true;
						for(var j in appraiseList[i].appraisePraises){
							var ap = appraiseList[i].appraisePraises[j];
							if(ap.customerId == that.customer.id){
								appraiseList[i].isParse = false;
							}
						}
						for(var k in appraiseList[i].appraiseFiles){
							var af = appraiseList[i].appraiseFiles[k];
							af.fileUrl = getPicUrl(af.fileUrl);
							af.photoSquare = getPicUrlSquare(af.photoSquare);
						}
						if(appraiseList[i].content.length > 50){
							appraiseList[i].contentCopy = appraiseList[i].content.substring(0,50);
						}else{
							appraiseList[i].contentCopy = appraiseList[i].content;
						}
						var appraiseArticle = appraiseList[i].articleId;
					}
					if(appraiseList.length<that.showCount){
						that.isOver=true;
					}
					that.isLoad = false;
				},option);
				that.currentPage = that.currentPage+that.showCount;
			}
		},
		showAllContent:function(appraise){
			if($("#"+appraise.id+"content").text() == "展开"){
				$("#"+appraise.id+"content").html("收起");
				$(".js"+appraise.id).html(appraise.content);
			}else if($("#"+appraise.id+"content").text() == "收起"){
				$("#"+appraise.id+"content").html("展开");
				$(".js"+appraise.id).html(appraise.contentCopy);
			}				
		},
		showLike:function(appraise,isParse){
			var that = this;
			if(that.praiseFlag){
				if(isParse == true){
					that.praiseFlag = false;
					praise(appraise.id,function(result){
						if(result.success){
							var res = {};
							res.headPhoto = that.customer.headPhoto;
							var flag = true;
							for(var i=0;i<appraise.appraisePraises.length;i++){
								if(that.customer.headPhoto == appraise.appraisePraises[i].headPhoto){
									flag = false;
								}
							}
							if(flag){
								appraise.appraisePraises.push(res);
							}
							appraise.isParse = false;
							$("#"+appraise.id+"src").attr("src","assets/img/heart.png");
							$("."+appraise.id).html("取消");
							that.praiseFlag = true;
							that.$dispatch("successMessage", "点赞成功");
						}
					});
				}else{
					that.praiseFlag = false;
					canelPraise(appraise.id,function(result){
						if(result.success){
							var res = {};
							res.headPhoto = that.customer.headPhoto;
							for(var i=0;i<appraise.appraisePraises.length;i++){
								if(that.customer.headPhoto == appraise.appraisePraises[i].headPhoto){
									appraise.appraisePraises.splice(i,1);
								}
							}
							appraise.isParse = true;
							$("#"+appraise.id+"src").attr("src","assets/img/likes.png");
							$("."+appraise.id).html("点赞");
							that.praiseFlag = true;
							that.$dispatch("successMessage", "您取消了点赞");
						}
					});
				}
			}
		},
		showComment:function(appraise){
			this.iframeDialogComment.show = true;
			this.iframeDialogComment.appraise = appraise;
			this.iframeDialogComment.customer = this.customer;
			this.iframeDialogComment.comment = null;
			
		},
		showCommentReply:function(appraise,comment){
			this.iframeDialogComment.show = true;
			this.iframeDialogComment.appraise = appraise;
			this.iframeDialogComment.customer = this.customer;
			this.iframeDialogComment.comment = comment;
		},
		displayAllComment:function(appraise){
			if($("#"+appraise.id+"span").css("display") == "none"){
				$("#"+appraise.id+"span").show();
				$("#"+appraise.id+"info").html("收起");
			}else if($("#"+appraise.id+"span").css("display") == "inline"){
				$("#"+appraise.id+"span").hide();
				$("#"+appraise.id+"info").html("查看全部"+appraise.appraiseComments.length+"条回复");
			}
		}
	},
	ready:function(){
		var that = this;	
		this.loadNextPage();			
		this.$watch("appraiseList",function(){
			Vue.nextTick(function(){
				setTimeout(function(){
					that.reflushIsc();
				},50);
			});
		});
		getAppraiseCount(function(appraiseCount,countList){
			that.appraiseCount = appraiseCount;
			that.countList = countList;
			Vue.nextTick(function(){
				setTimeout(function(){
					that.reflushIsc();
				},50);
			});
		});								
	},
	components:{
		"iframe-dialog-comment":{
			props: ["show", "appraise", "customer", "comment"],				
			template:				
			'<div class="weui_dialog_alert" v-if="show">' +
				'<div class="weui_mask" @click="close"></div>' +
				'<div class="weui_dialog" style="background-color: #e7e7e7;height:13rem;top:12%;">' +
					'<div style="height:9rem">'+
						'<textarea class="form-control" id="contentInput" name="content" rows="7" cols="10" maxlength="140" v-model="remainWords"></textarea>' +
						'<span class="remainWord">{{remainWord}}</span>' +
					'</div>'+ 						
					'<div class="submitBtn">' +
						'<p class="cancleSendOut inMiddle" @click="close">取消</p>'+
						'<p class="sendOutAppraise inMiddle" @click="contentSubmit(appraise,customer,comment)">发送</p>'+
					'</div>'+					
				'</div>'+				
			'</div>',
			data:function(){
            	return {
            		remainWord:140,
            	}
            },
            watch: {
				'remainWords': function (newVal, oldVal) {
					this.remainWord = 140 - newVal.length;						
				}
			},
			methods: {
				close: function () {
					this.show = false;
				},					
				contentSubmit:function(appraise,customer,comment){
					var that = this;
					var content = $('#contentInput').val();
					var appraiseId = appraise.id;
					var customerId = customer.id;
					var pid = null;						
					if (!content){
						that.$dispatch("remindMessage", "亲,评论不能为空哦",1000);
						return false;
					}
					if(comment != null ){
						pid = comment.customerId;
					}
					commentSubmit(content,appraiseId,customerId,pid,function (result){
						if(result.success){
							var res = {};
							res.nickName = customer.nickname;
							res.content = content;
							if(comment != null){
								res.pid = comment.customerId;
								res.replyName = comment.nickName;
							}else{
								res.pid = "";
							}
							appraise.appraiseComments.push(res);
							that.$dispatch("successMessage", "评论成功");
							that.remainWords = ''; //评论之后清空内容
							that.show = false;
						}
					})
				},					
			},				
			created: function () {
				var that = this;
				this.$watch("show", function (newVal,oldVal) {
					if(newVal){
						$("body").unbind("touchmove"); //解除浏览器的默认行为
						if (this.comment!=null) {
							$("#contentInput").attr("placeholder","回复"+this.comment.nickName+":");
						}else if(this.comment==null){
							$("#contentInput").attr("placeholder","尽情评论吧!");
						}							
						$("#contentInput").focus(); //自动打开软键盘，搜索框获取焦点  
					}else{
						$("body").bind("touchmove",function(e){
					    	e.preventDefault();
					    });
					}					
				});				
			},
		},			
		"iframe-dialog-photo":{
			props:["show","appraise","picindex"],
			template:
			'<div class="weui_dialog_confirm" v-if="show">'+
				'<div class="weui_mask" @click="close" style="background-color: #1b1a1f"></div>'+
				'<div class="weui_dialog_photo" >'+					
				'<div class="swiper-container"  @click="showSmallPhoto(appraise)">'+
                    '<div class="swiper-wrapper">'+
                        '<div class="swiper-slide" data-swiper-slide-index="{{$index}}" v-for="abp in appraiseBigPhoto">'+
                            '<img class="imgShowBox" :src="abp.fileUrl" />'+
                        '</div>'+
                    '</div>'+
                    '<div class="swiper-pagination"></div>'+
                '</div>'+                       
                '</div>'+
                '</div>',
            data:function(){
            	return {
            		appraiseBigPhoto:[],
            	}
            },
			created:function(){
				var that = this;
				this.$watch("show", function (newval,oldval) {
					if(newval){
						that.appraiseBigPhoto = [];
						that.appraiseBigPhoto = that.appraise.appraiseFiles;
						var picSwiper = new Swiper('.swiper-container',{
							pagination : '.swiper-pagination',
						})
						picSwiper.slideTo(that.picindex,false);//切换到当前slide
					}
				});					
			},
			methods:{
				close:function(){
					this.show=false;
				},
				showSmallPhoto:function(min,max){
					this.show=false;
				}
			}
		},			
		"appraise-filter-dialog":{
			props:["show","countlist"],
			template:
				'<div class="weui_dialog_confirm" v-if="show">'+
				'	<div class="weui_mask pop_up_change" @click="close"></div>'+
				'	<div class="weui_dialog" style="max-height:120vw;">'+
				'		 <div class="weui_dialog_hd"><strong class="weui_dialog_title">评分列表</strong></div>'+
				'		 <div class="weui_dialog_bd appraise-count-bd" style="max-height:90vw;">'+
				'		 <div class="full-height">'+	
				'			<p v-for="count in countlist">'+
				'				{{count.YEARMONTH}} 评论( {{count.COUNT}}条 {{count.AVG_SCORE.toFixed(2)}}分 )'+
				'			</p>'+
				'		 </div>'+							 
				'		 </div>'+
				'		 <div class="weui_dialog_ft">'+
				'			<a class="weui_btn_dialog primary" @click="filter(5,5)">全部评价</a>'+
				'			<a class="weui_btn_dialog primary" @click="filter(4,4)">需要改进</a>'+
				'			<a class="weui_btn_dialog primary" @click="filter(0,3)">差评投诉</a>'+
				'		 </div>'+					
				'	</div>'+
				'</div>',
			created:function(){
			},
			methods:{
				close:function(){
					this.show=false;
				},
				filter:function(min,max){
					this.$dispatch("filter",min,max);
					this.show=false;
				}
			}			
		}
	}
}	