<template>
	<view class="home">
		<uni-icons  class="back-btn  " size="25" type="arrowleft"
		 color="#000" @click="navBack"/>
		<view class="bcgImg">
		  <image class="bcgImg-image"  mode="aspectFill" src="https://s1.ax1x.com/2022/12/12/z4Gj1O.jpg"></image>
		</view>
		<view class="  card-list" :class="isClick ? 'active' : ''" >
		    <view class="card card-1 box-shadow">
				<view class="flex-card">
					<view class="text_bold font-16">我的评论</view>
				</view>
				<view class="card-order margin-t-15">
					<view class="order-div"  @click="toClick(0)">
						<uni-icons custom-prefix="iconfont" type="icon-opinion" size="30"></uni-icons>
						<view :class="current===0 ? 'color-2' : ''">待评价</view>
					</view>
					<view class="order-div"  @click="toClick(1)">
						<uni-icons custom-prefix="iconfont" type="icon-complete" size="30"></uni-icons>
						<view :class="current===1 ? 'color-2' : ''">已评价</view>
					</view>
				</view>
			</view>
			<scroll-view :scroll-y="true" >
				<block v-if="current===0">
					
					<view class="cart-goods-list">
						<view class="main"   v-for="(item, index) in GoodsList" 
						:key="index" :data-index="index" 
						  @click="toCommentPage(item.id,item.order_detail_id)">
							<view class="left">
								<view class="check-con">
									<image :src="item.img_url"></image>
								</view>
							</view>
							<view class="center">
								<view class="title"> {{item.title}} </view>
								<view class="flex-card" style="position: absolute;top: 50px;">
									<view class="title font-14">订单编号【{{item.order_sn}}】</view>
									<!-- <uni-tag :inverted="true" text="待评价" /> -->
								 </view>
								<view class="price">
									<view class="flex-card" >
										<fast-price  :text="item.average_cost"  :miniDecimal="true"></fast-price>
										<view class="space1"></view>
										<fast-price :size="30"  :text="item.original_price" :strikeout="true" :miniDecimal="true"></fast-price>
									</view>
								</view>
							</view>
							
							<view class="right">
								<view class="close" > 
									<view class="font-12 color_gray8a">数量: {{item.good_amount}} </view>
								</view>
							</view>
						</view>
					</view>
				</block>
				
				<block v-if="current===1">
					<view class="cart-goods-list">
						<view class="main"   v-for="(item, index) in GoodsList" 
						:key="index" :data-index="index" 
						  @click="toCommentPage(item.id,item.order_detail_id)">
							<view class="left">
								<view class="check-con">
									<image :src="item.img_url"></image>
								</view>
							</view>
							<view class="center">
								<view class="title">订单编号{{item.order_sn}}</view>
								<view class="flex-card" style="position: absolute;top: 50px;">
									<view class="title font-14"> {{item.title}} </view>
								 </view>
								<view class="price">
									<view class="flex-card" >
										<uni-tag :inverted="true" text="已评价" />
									</view>
								</view>
							</view>
							<view class="right">
								<view class="close" > 
									<view class="font-12 color_gray8a">数量: {{item.good_amount}} </view>
								</view>
							</view>
						</view>
					</view>
				</block>
				
			
				<zero-back-top :scrollTop='scrollTop' bottom="200" iconType="arrow" color="#FFC300"></zero-back-top>
				<uni-load-more @clickLoadMore="clickLoadMore" :status="status" iconType="circle"   :content-text="contentText" />
			</scroll-view>
		</view>

	</view>
</template>

<script>
	import http from '@/utils/request.js'
	export default {
		data() {
			return {
				customer: getApp().globalData.customer,
				value:"",
				scrollTop:0,
				isClick:false,
				status: 'more',
				contentText: {
					contentdown: '查看更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
				pageNo:1,
				limit:15,
				current:0,
				styles: {
					color: '#000000',
					borderColor: '#FFC300'
				},
				GoodsList:[],
				count:0
			}
		},
		onPageScroll(e) {
			var myApp = this
			myApp.scrollTop = e.scrollTop;
		},
		onLoad() {
			var myApp = this
			// myApp.toClick(0)
		},
		onShow() {
			var myApp = this
			myApp.toClick(myApp.current)	
		},
		methods: {
			showToast(title,icon){
				if(typeof icon === "undefined" ){
					icon = 'none';
				}
				uni.showToast({
					title: title,
					icon: icon
				})	
			},
			toClick(type){
				var myApp = this
				myApp.isClick = true
				var pageNo = 1;
				myApp.status = "loading"
				myApp.pageNo = pageNo
				myApp.suggestList = []
				myApp.current = type
				myApp.loadPage(pageNo,myApp.limit,myApp.current);
				
			},
			input(e) {
				var myApp = this
				myApp.value = e
			},
			
			clickLoadMore(e){
				var myApp = this;
				if(e.detail.status == "more"){
					var pageNo = parseInt(myApp.pageNo)+1;
					myApp.status = "loading";
					myApp.pageNo = pageNo;
					myApp.loadPage(pageNo,myApp.limit,myApp.current);
				}else if(e.detail.status == "loading"){
					myApp.showToast("正在加载，请等待");
				}else if(e.detail.status == "noMore"){
					myApp.showToast("暂无更新");
				}
			},
			loadPage(pageNo,limit,type){
				var myApp = this
				// 加载完成订单的商品
				http('order/get/goods/comment',{
					'customer_id':myApp.customer.id,
					'currNo':pageNo,
					'limit':limit,
					'type':type
				}, {
					hideLoading: false, // 默认 false
					hideMsg: true,      // 默认 false
					method: 'POST'       // 默认 POST
				}).then(res => {
					myApp.count = res.data.length;
					if(myApp.count == 0 ){
						if(pageNo===1){
							myApp.title = "你有"+myApp.count +"条订单可以评价"
						}
						myApp.status = "noMore";
						return
					}else{
						myApp.status = "more";
					}
					if(type===0){
						myApp.title = "你有"+myApp.count +"条订单可以评价"
					}else{
						myApp.title = "你已经评价了"+myApp.count +"条订单"
					}
					myApp.GoodsList = res.data
				
				}).catch(err => {
					console.error(err)
				})
			},
			
			navBack() {
				var myApp = this
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
			toCommentPage(id,oid){
				var myApp = this;
				var url = "/pages/comment/commentAdd/commentAdd?id="+id+"&order_detail_id="+oid
				if(myApp.current === 1){
					url = "/pages/shop/product_detail/product_detail?id="+id
				}
				myApp.jumpPage(url)
			},
				
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
   @import '../../user/index/index.css';
   @import '../../order/index/order.css';
   page{
	   background-color: #fff;
   }
   .home{
	   background-color: #fff;
   }

   .card-order{
	   justify-content: space-around;
   }
 
</style>
