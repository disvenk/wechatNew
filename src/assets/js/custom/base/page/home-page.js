var homeBaseMix = {
	template:$("#home-temp").html(),
		mixins:[subpageMix,noticeMix],
		data:function(){
			return {
				notices:[],
				advert:{},
				appraiseCount:{},
				countList:[],
				appraiseList:[],
				pictureList:[],				
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
				allSetting:allSetting,
				newLevel:1
			}
		},
		methods:{					
			openshoplocation:function(){
				var that = this;
				qq.maps.convertor.translate(new qq.maps.LatLng(this.shop.latitude, this.shop.longitude), 3, function(res) {
					console.log(JSON.stringify(res));
		         	wxOpenLocation(parseFloat(res[0].lat), parseFloat(res[0].lng),that.shop.name, that.shop.address);
		        });
			},
			showBigPhoto:function(appraise,picindex){
				this.iframeDialogPhoto.picindex = picindex;
				this.iframeDialogPhoto.appraise = appraise;
				this.iframeDialogPhoto.show = true;
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
			reloadAppraiseNew:function(state){
				debugger;
				this.isLoad=false;
				this.isOver=false;
				this.currentPage=0;
				this.newLevel=state;
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
					var optionNew = {
						currentPage:that.currentPage,
						level:that.newLevel,
						showCount:that.showCount
					};
					if(this.allSetting.appraiseEdition == 0){
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
					}else{
						getNewAppraiseList(function(appraiseList){
							for(var i in appraiseList){
								var appraise = appraiseList[i];
								appraise.feedbackList = [];
								if(!appraise.appraiseComments){
									appraise.appraiseComments = [];
								}
								if(!appraise.appraisePraises){
									appraise.appraisePraises = [];
								}
								appraise.feedbackList = appraise.feedback.split(",");
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
						},optionNew);
					}
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
				var appraiseId = null;
				
				if(allSetting.appraiseEdition == 0){
					appraiseId = appraise.id;
				}else{
					appraiseId = appraise.appraiseId;
				}
				if(that.praiseFlag){
					if(isParse == true){
						that.praiseFlag = false;
						praise(appraiseId,function(result){
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
								$("#"+appraiseId+"src").attr("src","assets/img/heart.png");
								$("."+appraiseId).html("取消");
								that.praiseFlag = true;
								that.$dispatch("successMessage", "点赞成功");
							}
						});
					}else{
						that.praiseFlag = false;
						canelPraise(appraiseId,function(result){
							if(result.success){
								var res = {};
								res.headPhoto = that.customer.headPhoto;
								for(var i=0;i<appraise.appraisePraises.length;i++){
									if(that.customer.headPhoto == appraise.appraisePraises[i].headPhoto){
										appraise.appraisePraises.splice(i,1);
									}
								}
								appraise.isParse = true;
								$("#"+appraiseId+"src").attr("src","assets/img/likes.png");
								$("."+appraiseId).html("点赞");
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
		
		computed:{
			monthStar:function(){
				var monthStar= 5;
				if(this.countList.length>0){
					monthStar = this.countList[0].AVG_SCORE/100*5;
				}
				return Math.ceil(monthStar);
			},
			monthScore:function(){
				var monthScore = 100;
				if(this.countList.length>0){
					monthScore = this.countList[0].AVG_SCORE.toFixed(2);
				}
				return monthScore;
			},
		},
		ready:function(){
			var that = this;
			this.loadNextPage();					
			getShopAdvert(function(advert){
				that.advert = advert;
				Vue.nextTick(function(){
					that.reflushIsc();
				});
			});						
			if(allSetting.appraiseEdition == 0){
				getAppraiseCount(function(appraiseCount,countList){
					that.appraiseCount = appraiseCount;
					that.countList = countList;
					Vue.nextTick(function(){
						setTimeout(function(){
							that.reflushIsc();
						},50);
					});
				});
			}else{
				getAppraiseCountNew(function(appraiseCount,countList){
					that.appraiseCount = appraiseCount;
					that.countList = countList;
					Vue.nextTick(function(){
						setTimeout(function(){
							that.reflushIsc();
						},50);
					});
				});
			}									
			
			getHomePicture(function(list){
				that.pictureList = list;
				if(list.length>1){
					Vue.nextTick(function () {
						new Swiper('.swiper-container', {
							direction : 'horizontal',
							loop : true,
							autoplay : 5000,
						});
					});
				}
			});	
			this.$watch("appraiseList",function(){
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
				'<div class="weui_dialog_alert" v-if="show">'+
				    '<div class="weui_mask" @click="close"></div>'+
				    '<div class="weui_dialog_comment">'+
				      '<div class="full-height">'+
				        '<div class="weui_cell" style="padding: 15px;border-bottom: 1px solid #bdbdbd;">'+
				          	'<div class="weui-cell_comment">'+
					            '<textarea class="weui_textarea" placeholder="亲,请留下您的评论吧!" style="background-color: #eee;" rows="4" maxlength="120" v-model="remainWords"></textarea>'+
					            '<div class="weui-textarea-counter">剩余可输入{{remainWord}}字</div>'+
				          	'</div>'+
				        '</div>'+
				        '<div class="flex-container_comment">'+
				          	'<span class="comment_btn" @click="close">取消</span>'+
				          	'<span class="comment_btn" style="background-color: #d8433d;color:#fff;" @click="confirmComment(appraise,customer,comment)">确定</span>'+
				        '</div>'+
				      '</div>'+
			     	'</div>'+
			  	'</div>',
				data:function(){
	            	return {
	            		remainWords:'',
        				remainWord:120
	            	}
	            },
	            watch: {
			      	'remainWords': function (newVal, oldVal) {
		          		this.remainWord = 120 - newVal.length;
			      	}
			    },
				methods: {
					close: function () {
						this.show = false;
					},					
					confirmComment:function(appraise,customer,comment){
						var that = this;
						var content = this.remainWords;
						if(allSetting.appraiseEdition == 0){
							var appraiseId = appraise.id;
						}else if(allSetting.appraiseEdition == 1){
							var appraiseId = appraise.appraiseId;
						}						
						var customerId = customer.id;
						var pid = null;						
						if (content == ''){
							that.$dispatch("remindMessage", "亲,评论不能为空哦",1000);
							return false;
						}
						if(comment != null ){
							pid = comment.customerId;
						}
						/*评论中提示*/
            			this.$dispatch("loadingUnit", "评论发送中……,请稍候", 99999);
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
								console.log(JSON.stringify(res));
								console.log(JSON.stringify(appraise.appraiseComments));
								appraise.appraiseComments.push(res);
								that.$dispatch("successMessage", "评论成功");
								that.remainWords = ''; //评论之后清空内容
								that.show = false;
							}
						})
					}
				},				
				created: function () {
					var that = this;
					this.$watch("show", function (newVal,oldVal) {
						if(newVal){
							$("body").unbind("touchmove"); //解除浏览器的默认行为
							if (this.comment!=null) {
								$(".weui_textarea").attr("placeholder","回复"+this.comment.nickName+":");
							}else if(this.comment==null){
								$(".weui_textarea").attr("placeholder","亲,请留下您的评论吧!");
							}							
							$(".weui_textarea").focus(); //自动打开软键盘，搜索框获取焦点
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
					'<div class="swiper-container"  @click="showSmallPhoto">'+
	                    '<div class="swiper-wrapper">'+
	                        '<div class="swiper-slide" data-swiper-slide-index="{{$index}}" v-for="abp in appraiseBigPhoto" >'+
	                            '<div class="imgShowBox" style="background:url({{abp.fileUrl ? abp.fileUrl : abp.pictureUrl}}) no-repeat;background-size: 100% 100%;width:100%;height:32%;"></div>'+
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
					this.$watch("show", function () {
						if(this.show){
							that.appraiseBigPhoto = [];
							if(allSetting.appraiseEdition == 0){
								that.appraiseBigPhoto = that.appraise.appraiseFiles;
							}else if(allSetting.appraiseEdition == 1){
								that.appraiseBigPhoto = that.appraise.appraiseSteps;
							}
							
							Vue.nextTick(function () {
								var mySwiper = new Swiper('.swiper-container',{
									pagination : '.swiper-pagination',
								})
								mySwiper.slideTo(that.picindex,false);								
							});													
						}
					});					
				},
				methods:{
					close:function(){
						this.show=false;
					},
					showSmallPhoto:function(){
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
					'		 <div class="weui_dialog_ft" v-if="allSetting.appraiseEdition == 0">'+
					'			<a class="weui_btn_dialog primary" @click="filter(5,5)">全部评价</a>'+
					'			<a class="weui_btn_dialog primary" @click="filter(4,4)">需要改进</a>'+
					'			<a class="weui_btn_dialog primary" @click="filter(0,3)">差评投诉</a>'+
					'		 </div>'+	
					'		 <div class="weui_dialog_ft" v-if="allSetting.appraiseEdition == 1">'+
					'			<a class="weui_btn_dialog primary" @click="filterNew(1)">全部评价</a>'+
					'			<a class="weui_btn_dialog primary" @click="filterNew(2)">需要改进</a>'+
					'			<a class="weui_btn_dialog primary" @click="filterNew(3)">差评投诉</a>'+
					'		 </div>'+
					'	</div>'+
					'</div>',
				data:function(){
					return {
						allSetting:allSetting
					}
				},	
				created:function(){
				},
				methods:{
					close:function(){
						this.show=false;
					},
					filter:function(min,max){
						this.$dispatch("filter",min,max);
						this.show=false;
					},
					filterNew:function(state){
						this.$dispatch("filternew",state);
						this.show=false;
					},
				}			
			}
		}
		
	};

