<template>
	<view  class="container">
	
	
		<!-- <uni-search-bar  placeholder="随便说点啥吧"  bgColor="#EEEEEE" @confirm="search" /> -->
		
		<view class="uni-padding-wrap uni-common-mt">
			<uni-segmented-control :current="current" :values="items" style-type="text" :active-color="activeColor" @clickItem="onClickItem" />
		</view>
		<scroll-view scroll-y="true">
			<uni-card :is-shadow="false" 
			  v-for="(item, index) in orderList" :key="index"
				@click.native="orderDetail"  :id="item.order_id"  :data-id="item.order_id"
				 :data-index="index">
				<view class="order-card" >
					<block v-if="item.orderDetailList.length == 1">
						<image :src="item.orderDetailList[0].goodObj.img_url"></image>
						<view class="order-section">
							<view class=" flex-card">
								<view class="text_bold">{{item.orderDetailList[0].goodObj.title}}</view>
								<view class="text_bold"> ¥ {{item.payment_money}}</view>
							</view>
							<view class=" flex-card">
								<view class="">{{item.memo}}</view>
								<view class="">x {{item.orderDetailList[0].good_amount}}</view>	
							</view>
						</view>
					</block>
					<block v-else>
						<block  v-for="(good, index2) in  item.orderDetailList">
							<image :src="good.goodObj.img_url"></image>
							 <view class=" margin-r-5">
								 <view class="text_bold"> ¥ {{good.good_price}}</view>
								 <view class="">x{{good.good_amount}}</view>
							 </view>
						</block>
						<view class="">{{item.memo}}</view>
					</block>
				</view> 
				<br>
				<view class="flex-center round backColor padding-5">
					<uni-icons color="#FF5733" type="notification" size="24"></uni-icons>
					<block v-if="item.order_status === 0">
						<view class="margin-r-5">暂未发货</view>
					</block>
					<block v-if="item.order_status === 1">
						<view class="margin-r-5">已发货</view>
						<view>您的宝贝由{{item.shipping_comp_name}}护送</view>
					</block>
					<block v-if="item.order_status === 2">
						<view class="margin-r-5">已送达</view>
					</block>
					<block v-if="item.order_status === 3">
						<view class="margin-r-5">已签收</view>
					</block>
				</view>
				
				<view class=" flex-end color_warn">实际付款金额 {{item.payment_money}}</view>
				<!-- <view class="flex-end" @tap.stop.prevent v-if="item.order_status === 0" >
					<button class="fixed_btn" @click.stop="WriteComment(item.order_id)">
					  <view class="detailtxt">评价</view>
					</button>
				</view> -->
			</uni-card>
			<uni-load-more @clickLoadMore="clickLoadMore" :status="status" iconType="circle"   :content-text="contentText" />
		</scroll-view>
	
	</view>
</template>

<script>
	import http from '@/utils/request.js'
	export default {
		data() {
			return {
				orderList:[],
				items: ['未发货','已发货', '历史订单'],
				activeColor: '#FF5733',
				current:0,
				search:'',
				status: 'more',
				contentText: {
					contentdown: '查看更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
				pageNo:1,
				limit:15,
				// count:0,
				customer: getApp().globalData.customer,
			}
		},
		
		onShow() {
			var myApp = this;
			// uni.startPullDownRefresh();	
		},
		onLoad(option) {
			var myApp = this;
			// console.info("触发")
			uni.startPullDownRefresh();	
		},
		onPullDownRefresh(){
			var myApp = this;	
			var pageNo = 1;
			myApp.status = "loading";
			myApp.pageNo = pageNo;
			myApp.loadOrder(pageNo,myApp.limit,myApp.current);
		},
		
		onBackPress(options) {
			let pages = getCurrentPages(); // 获取页面栈
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
			WriteComment(e){
				var myApp = this;
				console.info(e.currentTarget)
				// var id = e.currentTarget.dataset.id;
				var url = "/pages/comment/comment/comment?id="+e;
				myApp.jumpPage(url);
			},
			clickLoadMore(e){
				var myApp = this;
				if(e.detail.status == "more"){
					var pageNo = parseInt(myApp.pageNo)+1;
					myApp.status = "loading";
					myApp.pageNo = pageNo;
					myApp.loadOrder(pageNo,myApp.limit,myApp.current);
				}else if(e.detail.status == "loading"){
					myApp.showToast("正在加载，请等待");
				}else if(e.detail.status == "noMore"){
					myApp.showToast("暂无更新");
				}
			},
			back(){
				let pages = getCurrentPages(); // 获取页面栈
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
			orderDetail(e){
				var myApp = this;
				console.info(e)
				var id = e.currentTarget.id;
				var url = "/pages/order/order_detail/order_detail?id="+id;
				myApp.jumpPage(url);
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
		
			loadOrder(pageNo,limit,type){
				var myApp = this
				http('order/getAll/order', {
					'currNo': pageNo,
					'customer_id': myApp.customer.id,
					'limit': limit,
					'order_status': type,
				}, {
					hideLoading: false, // 默认 false
					hideMsg: true, // 默认 false
				}).then(res => {
					uni.stopPullDownRefresh() 
					let len = res.data.orderList.length;
					if(len == 0 ){
						myApp.status = "noMore";
						return;
					}else{
						myApp.status = "more";
					}
					myApp.orderList = res.data.orderList;
					// myApp.count = res.data.count;
					// var toview = parseInt(myApp.current) -3 <= 0 ? 0 :parseInt(myApp.current) -3;
					// setTimeout(function() {
					// 	myApp.toView = "cate"+ toview
					// }, 200);
				}).catch(err => {
					console.error(err)
				})
			},
			
			onClickItem(e) {
				var myApp = this;
				if (myApp.current !== e.currentIndex) {
					myApp.current = e.currentIndex;
					myApp.orderList = [];
					// myApp.count = 0;
					var pageNo = 1;
					myApp.status = "loading";
					myApp.pageNo = pageNo;
					myApp.loadOrder(pageNo,myApp.limit,myApp.current);
				}
			},
			
		}
	}
</script>

<style>
image{
	height: 4rem;
	width: 4rem;
	margin-right: 5px;
	border-radius: 5px;
}

</style>
