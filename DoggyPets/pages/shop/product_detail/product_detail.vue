<template>
	<view class="container ">
		
		<view class="catalog_section">
			<uni-icons  class="back-btn  " size="25" type="arrowleft"  
			 color="#000" @click="navBack"/>
		</view>
		
		<uni-swiper-dot 
		 @clickItem=clickItem :info="currentGood.imageList"
		 :current="currentImage" mode="default"
			 >
			<swiper class="swiper-box" @change="change" :current="swiperDotIndex">
				<swiper-item  class="swiper-item"  v-for="(item, index) in  currentGood.imageList " :key="index">
					<image style="height: 100%;" mode="aspectFill" :src="item.img_url"></image>
				</swiper-item>
			</swiper>
		</uni-swiper-dot>	
			<view class="" style="padding: 10px;">
				<view class="flex-card attributes-head margin-b-5 margin-t-5">
					<text class="font-22">{{currentGood.title}}</text>
				</view>
				<view class=" margin-b-15 margin-t-15">
					<fast-price :size="40" :text="currentGood.original_price"  :miniDecimal="true"></fast-price>
				</view>
				<view class="choose">
					<view class="attributes-head margin-b-15 margin-t-15 text_bold">选择颜色</view>
					<image mode="aspectFill"  :src="currentGood.img_url"></image>
				</view>
				
				
				<view class="attributes-head margin-b-15 margin-t-15 text_bold">商品参数</view>
				<rich-text class="flex-card flex-wrap"  :nodes="currentGood.specification"></rich-text>
				<view class="divder margin-t-15"></view>
				<view class="attributes-head margin-b-15 margin-t-15 text_bold">商品详细说明</view>
				<rich-text  class="hh"  :nodes="currentGood.description"></rich-text>
			</view>
			<view class="" style="padding: 10px;">
				<view class="divder margin-t-15"></view>
				<view class="attributes-head margin-b-15 margin-t-15 text_bold">评价</view>
				<view class="tag">
					<view class="tag-1">				
						<uni-tag text="最新" @click="loadComments(1,-1)" size="normal"  type="warning" />		
					</view>
					<view class="tag-1">						
						<uni-tag text="好评" @click="loadComments(1,4)" size="normal"   type="error" />	
					</view>
					<view class="tag-1">
						<uni-tag text="中评" @click="loadComments(1,3)" size="normal"  :inverted="true"  type="primary" />	
					</view>
					<view class="tag-1">				
						<uni-tag text="差评" @click="loadComments(1,1)" size="normal"  :inverted="true"  />	
					</view>
				</view>
				
				<scroll-view class="" :scroll-y="true">
					<view class="comment"  v-for="(item, index) in  commentList " :key="index">
						<view class="comment-head">
							<view class="comment-avar">
								<image :src="item.customer_info.avatarUrl"></image>
							</view>
							<view class="comment-row">
								<view class="comment-user">
									<view>{{item.customer_info.username}}</view>
									<view class="comment-time">{{item.create_time}}</view>
								</view>
								<view  class="comment-rate">
									<uni-rate :readonly="true"  allowHalf :value="item.rate" />
								</view>
							</view>
				
							
						</view>
						<view class="comment-content">{{item.content}}</view>
						<view class="comment-img">
							<image  @click="previewImg(index,index2)"  v-for="(img, index2) in  item.commentImage " :key="index2" :src="img"></image>
						</view>
						<block v-if="item.reply_content !== null">
							<view class="replycontent"></view>
						</block>
						<view class="divder"></view>
					</view>
				
				<uni-load-more @clickLoadMore="clickLoadMore" :status="status" iconType="circle"   :content-text="contentText" />
				</scroll-view>
			</view>
			<view class="margin-b-100"></view>
			<view class="margin-b-100"></view>
			<view class="margin-b-100"></view>
			
			
			<view class="cart-bar"  >
			   <view class="l" >
				   <uni-icons  @click="toChat" color="#333333" type="chat" size="30"></uni-icons>
				   <text class="margin-l-10"></text>
				   <uni-badge :text="info" absolute="rightTop" :offset="[-3, -3]" size="normal">
					<view class="box ">
						<uni-icons custom-prefix="iconfont" type="icon-Bag" size="30"></uni-icons>
					</view>
				</uni-badge>
				</view>
			   <view class="r">
				   <view class="tocart" @click="addcart" >加入购物车</view>
					<view class="topay " @click="buyClick" >立即购买</view>
			   </view>
			 </view>
	
		      <zero-back-top :scrollTop='scrollTop' bottom="200" iconType="arrow" color="#FFC300"></zero-back-top>

	</view>
</template>

<script>
	import http from '@/utils/request.js'
	import {formatRichText} from "@/utils/utils.js"
	export default {
		data() {
			return {
				scrollTop:0,
				current:-1,
				currentImage:0,
				currentGood:{},
				commentList:[],
				customer: getApp().globalData.customer,
				good_id: -1,
				amount_price:0,
				swiperDotIndex: 0,
				min: 0,
				max: 10,
				status: 'more',
				contentText: {
					contentdown: '查看更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
				pageNo:1,
				limit:15,
				rate : -1,
				info : 0,
				hasLogin:getApp().globalData.hasLogin,
		
			}
		},
		onLoad(option) {
			var myApp = this
			myApp.good_id = option.id
			myApp.loadGoodDetail(option.id)
			myApp.loadComments(myApp.pageNo,-1)
			if(myApp.hasLogin){
				myApp.loadCartNumber();
			}

		},
		onPageScroll(e) {
			var myApp = this
			myApp.scrollTop = e.scrollTop;
		},
		onBackPress(options) {
			// var myApp = this
			// if (myApp.$refs.fab.isShow) {
			// 	myApp.$refs.fab.close()
			// }
			// let pages = getCurrentPages(); // 获取页面栈
			// let nowPage = pages[pages.length - 1]; //当前页页面实例
			// let prevPage = pages[pages.length - 2]; //上一页页面实例
			// if (pages.length > 1) {
			//   uni.navigateBack({
			// 	delta: 1,
			//   })
			// } else {
			//   uni.switchTab({
			// 	url: '/pages/index/index',
			//   })
			// }
		},
		
		methods: {
			// 返回上一页
			navBack() {
				var myApp = this
				// if (myApp.$refs.fab.isShow) {
				// 	myApp.$refs.fab.close()
				// }
				let pages = getCurrentPages(); // 获取页面栈
				let nowPage = pages[pages.length - 1]; //当前页页面实例
				let prevPage = pages[pages.length - 2]; //上一页页面实例
				if (pages.length > 1) {
				  uni.navigateBack({
					delta: 1,
				  })
				} else {
				  uni.switchTab({
					url: '/pages/index/index',
				  })
				}
			},
		
			
			toCart(){
				var myApp = this
				var url = "/pages/shop/cart/cart"
				myApp.jumpPage(url)
			},
			loadCartNumber(){
				var myApp = this
				http('order/getAll/cart/number', {
					'customer_id':myApp.customer.id
				}, {
					hideLoading: false, // 默认 false
					hideMsg: true, // 默认 false
					method: 'POST' // 默认 POST
				}).then(res => {
					myApp.info = res.data.size;
					// myApp.amount_price = res.data.amount_price;
				}).catch(err => {
					console.error(err)
				})
			},
			showToast(title,icon){
				if(typeof icon === "undefined" ){
					icon = 'none';
				}
				uni.showToast({
					title: title,
					icon: icon
				})	
			},
			clickLoadMore(e){
				var myApp = this;
				if(e.detail.status == "more"){
					var pageNo = parseInt(myApp.pageNo)+1
					myApp.status = "loading"
					myApp.pageNo = pageNo;
					myApp.loadComments(pageNo,myApp.rate)
				}else if(e.detail.status == "loading"){
					myApp.showToast("正在加载，请等待");
				}else if(e.detail.status == "noMore"){
					myApp.showToast("暂无更新");
				}
			},
			previewImg(index1,curr){
				var myApp = this
				var urls = myApp.commentList[index1].commentImage
				// console.info(urls)
				uni.previewImage({
					urls: urls,
					index:curr,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
			loadComments(pageNo,level){
				var myApp = this;
				myApp.rate = level
				http('comment/get/all',{
					'good_id':myApp.good_id,
					'rate':level,
					'currNo':pageNo,
				}, {
					hideLoading: false, // 默认 false
					hideMsg: true,      // 默认 false
					method: 'POST'       // 默认 POST
				}).then(res => {
					myApp.commentList = res.data
					if(myApp.commentList.length == 0 ){
						myApp.status = "noMore";
					}else{
						myApp.status = "more";
					}
				}).catch(err => {
					console.error(err)
				})
			},
			loadGoodDetail(id){
				var myApp = this;
				http('goods/detail',{
					'id':id,
				}, {
					hideLoading: false, // 默认 false
					hideMsg: true,      // 默认 false
					method: 'POST'       // 默认 POST
				}).then(res => {
					myApp.currentGood = res.data
					myApp.currentGood.description = formatRichText(myApp.currentGood.description);
					myApp.current = 0;
				// 	if(myApp.currentGood.amount===0){
				// 		myApp.amount_price = myApp.currentGood.original_price
				// 	}else{
				// 		myApp.amount_price = myApp.currentGood.original_price * myApp.currentGood.amount
				// 	}
				
				}).catch(err => {
					console.error(err)
				})
			},
			clickItem(e) {
				var myApp = this;
				myApp.swiperDotIndex = e
			},
			change(e) {
				var myApp = this;
				myApp.currentImage = e.detail.current
			},
			
			
			addcart() {
				var myApp = this;
				if(!myApp.hasLogin){
					myApp.showToast("您还未登陆，2s后跳转登陆")
					setTimeout(function(){
						let url = "/pages/user/index/index"
						uni.reLaunch({
							url: url,
						})
					}, 1500); 
					return
				}
				
				
				http('order/addCart',{
					'good_id':myApp.good_id,
					'good_amount':1,
					'price':myApp.currentGood.original_price,
					'customer_id':myApp.customer.id,
				}, {
					hideLoading: false, // 默认 false
					hideMsg: true,      // 默认 false
					method: 'POST'       // 默认 POST
				}).then(res => {
					if(res.data.num !== -1){
						myApp.info =  res.data.num
					}
					myApp.showToast( res.data.msg)
				}).catch(err => {
					console.error(err)
				})
				
				
			},
			
			buyClick(){
				var myApp = this;
				if(!myApp.hasLogin){
					myApp.showToast("您还未登陆，2s后跳转登陆")
					setTimeout(function(){
						let url = "/pages/user/index/index"
						uni.redirectTo({
							url: url,
						})
					}, 1500); 
					return
				}
				
				var myApp = this
				var str = myApp.good_id
				myApp.jumpPage('/pages/paymentIndex/paymentIndex?gid='+str)
			},
			
			// 跳转到付费页面
			jumpPage(url){
				uni.navigateTo({
					url: url,
					events: {
						acceptDataFromOpenedPage: function(data) {
						  console.log(data)
						},
						someEvent: function(data) {
						  console.log(data)
						}
					  },
					  success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'data from starter page' })
					  }
				});
			},
		}
	}
</script>

<style>
	page{
		background: white;
	}
	.catalog_section{
		padding-top : 0
	}
	
	
	
	.container{
		background-color: white;
	}
	.comment-img {
		display: flex;
		flex-wrap: wrap;
	}
	.comment-img image{
		margin-right: 15rpx;
		border-radius: 10px;
		height: 150rpx;
		width: 150rpx;
	}
	.tag{
		margin: 10px;
		display: flex;
		padding: 10px;
	}
	.tag .tag-1{ 
		margin-right: 15px;
	}
.comment	.comment-avar{
	border-radius: 50%;
}
.comment .comment-avar image{
	height: 100rpx;
	width: 100rpx;
	border-radius: inherit;
	
}
.choose image{
	height: 120px;
	width: 120px;
	border: 1px solid;
}
.comment{
	margin: 10rpx 20rpx;
	padding: 10rpx;
}
.comment .comment-head{
	display: flex;
}
.comment .comment-head .comment-user .comment-time{
	font-size: 25rpx;
}
.comment-row{
	width: 100%;
}
.comment .comment-head .comment-user{
	display: flex;
	margin: auto;
	font-size: 38rpx;
    margin-left: 10px;
	align-items: center;
	justify-content: space-between;
}
.comment .comment-content {
	margin: 10rpx;
	font-size: 35rpx;
	color: #8F7A76;
}
/* .flex-card text{
	font-size: 16px;
	color: #000;
} */
.hh { 
	word-break: break-all;
	white-space: pre-warp;
}
.swiper-box{
	height: 800rpx;
}
.swiper-item{
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 200px;
	color: #fff;
}
.font-22{
	font-family: benton-sans,sans-serif;
	
}


.l image{
	height: 25px;
	width: 25px;
}

</style>
