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
					<view class="text_bold font-16">我的订单</view>
					<!-- <uni-icons type="right" size="right" @click="toOrder(1)"></uni-icons> -->
				</view>
				<view class="card-order margin-t-15">
					<view class="order-div"  @click="toOrder(0)">
						<uni-icons custom-prefix="iconfont" type="icon-ziyuan" size="30"></uni-icons>
						<view :class="current===0 ? 'color-2' : ''">待发货</view>
					</view>
					<view class="order-div"  @click="toOrder(1)">
						<uni-icons custom-prefix="iconfont" type="icon-daifahuo" size="30"></uni-icons>
						<view :class="current===1 ? 'color-2' : ''">已发货</view>
					</view>
					<view class="order-div"  @click="toOrder(4)">
						<uni-icons custom-prefix="iconfont" type="icon-a-shouhou3x" size="30"></uni-icons>
						<view :class="current===4 ? 'color-2' : ''">退货</view>
					</view>
					<view class="order-div"  @click="toOrder(2)">
						<uni-icons custom-prefix="iconfont" type="icon-complete" size="30"></uni-icons>
						<view :class="current===2 ? 'color-2' : ''">已完成</view>
					</view>
				</view>
			
			
			</view>
			<scroll-view :scroll-y="true" >
				<uni-card  spacing="0" :is-shadow="false" margin="5" padding="0" :border="false" 
				  v-for="(item, index) in orderList" :key="index"  :title="'订单编号：'+item.order_sn"
				  :sub-title="item.create_time"  :extra="'共 '+item.size+' 件商品'"
					@click.native="orderDetail"  :id="item.order_id"  :data-id="item.order_id"
					 :data-index="index" >
					<view class="order-card" >
							<view class="flex-card margin-r-5">
								<image :src="item.orderDetailList.img_url"></image>
							</view>
							<view class="order-section">
								<view class=" flex-card">
									<view class="text_bold">{{item.orderDetailList.title}}</view>
									<!-- <uni-icons type="right" size="25" ></uni-icons> -->
								</view>
								<view class="flex-end margin-t-5 margin-r-5">数量： {{item.orderDetailList.good_amount}}</view>
								<view class="flex-card margin-t-5">备注： {{item.memo}}</view>
								<view class="flex-end margin-t-5 font-16 margin-r-5">总计：¥{{item.payment_money}}</view>
							</view>
					</view> 
					<view class="flex-end   ">
						<view v-if="item.order_status === 2">
							<view class="tocart margin-r-5 "  @click.stop="WriteComment(item.order_id)">评价</view>
						</view>
						<view class="topay  " @click="orderDetail" >查看详细</view>
					</view>
				</uni-card>
				
			
				<uni-load-more @clickLoadMore="clickLoadMore" :status="status" iconType="circle"   :content-text="contentText" />
				
			</scroll-view>
			<zero-back-top :scrollTop='scrollTop' bottom="200" iconType="arrow" color="#FFC300"></zero-back-top>
				
		</view>
	
	</view>
</template>

<script>
	import http from '@/utils/request.js'
	export default {
		data() {
			return {
				isClick:false,
				orderList:[],
				status: 'more',
				contentText: {
					contentdown: '查看更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
				pageNo:1,
				limit:15,
				customer: getApp().globalData.customer,
				scrollTop:0,
				current:0
			}
		},
		onLoad() {
			var myApp = this
			myApp.toOrder(myApp.current)
		},
		onPageScroll(e) {
			var myApp = this
			myApp.scrollTop = e.scrollTop;
		},
		methods: {
			toOrder(type){
				var myApp = this
				myApp.isClick = true
				var pageNo = 1;
				myApp.status = "loading"
				myApp.pageNo = pageNo
				myApp.orderList = []
				myApp.current = type
				myApp.loadOrder(pageNo,myApp.limit,myApp.current);
				
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
					let len = res.data.length
					if(len == 0 ){
						myApp.status = "noMore"
						return
					}else{
						myApp.status = "more"
					}
					myApp.orderList = res.data
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
		
		}
	}
</script>

<style>

   @import './order.css';
</style>
