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
					<view class="text_bold font-16">我的优惠券</view>
				</view>
				<view class="card-order margin-t-15">
					<view class="order-div"  @click="toClick(0)">
						<uni-icons custom-prefix="iconfont" type="icon-yilingqu" size="30"></uni-icons>
						<view :class="current===0 ? 'color-2' : ''">已领取</view>
					</view>
					<view class="order-div"  @click="toClick(1)">
						<uni-icons custom-prefix="iconfont" type="icon-youhuiquan" size="30"></uni-icons>
						<view :class="current===1 ? 'color-2' : ''">可领取</view>
					</view>
				</view>
			</view>
			<scroll-view :scroll-y="true" >
				
				<block v-if="current === 0">
					<block v-if="couponList.length > 0">
							<view  v-for="(item, index) in couponList" :key="index"
						  :data-id="item.batch_id"
						 :data-index="index" class="coupon coupon-wave-left coupon-wave-right coupon-yellow-gradient">
								<view class="coupon-info coupon-hole coupon-info-right-dashed">
									 <!-- 使用范围，0—全场，1—商品
									 优惠卷类型, 0-满减, 1-折扣 2—直减-->
									 <block v-if="item.rule.type === 0">
										<block v-if="item.rule.use_range === 0">
											<view class="coupon-price"> <text class="font-14">¥</text>{{item.rule.amount.toFixed(2)}}</view>
											<view class="coupon-desc">【全场 满减】{{item.coupon_batch.coupon_name}}</view>
											<view class="coupon-expiry-date">有效期：{{item.rule.use_started_at}}至{{item.rule.use_ended_at}}</view>
										</block>
										<block v-if="item.rule.use_range === 1">
											<view class="coupon-price"> <text class="font-14">¥</text>{{item.rule.amount.toFixed(2)}}</view>
											<view class="coupon-desc">【商品 满减】{{item.coupon_batch.coupon_name}}</view>
											<view class="coupon-expiry-date">有效期：{{item.rule.use_started_at}}至{{item.rule.use_ended_at}}</view>
										</block>
									 </block>
									 <block v-if="item.rule.type === 1">
										<block v-if="item.rule.use_range === 0">
											<view class="coupon-price">{{item.rule.discount.toFixed(1)}}<text class="font-14">折扣券</text></view>
											<view class="coupon-desc">【全场 折扣】{{item.coupon_batch.coupon_name}}</view>
											<view class="coupon-expiry-date">有效期：{{item.rule.use_started_at}}至{{item.rule.use_ended_at}}</view>
										</block>
										<block v-if="item.rule.use_range === 1">
											<view class="coupon-price">{{item.rule.discount.toFixed(1)}}<text class="font-14">折扣券</text></view>
											<view class="coupon-desc">【商品 折扣】{{item.coupon_batch.coupon_name}}</view>
											<view class="coupon-expiry-date">有效期：{{item.rule.use_started_at}}至{{item.rule.use_ended_at}}</view>
										</block>
									 </block>
									 <block v-if="item.rule.type === 2">
										<block v-if="item.rule.use_range === 0">
											<view class="coupon-price"> <text class="font-14">¥</text>{{item.rule.amount.toFixed(2)}}</view>
											<view class="coupon-desc">【全场 直减 无规则】{{item.coupon_batch.coupon_name}}</view>
											<view class="coupon-expiry-date">有效期：{{item.rule.use_started_at}}至{{item.rule.use_ended_at}}</view>
													
										</block>
										<block v-if="item.rule.use_range === 1">
											<view class="coupon-price"> <text class="font-14">¥</text>{{item.rule.amount.toFixed(2)}}</view>
											<view class="coupon-desc">【商品 直减 无规则】{{item.coupon_batch.coupon_name}}</view>
											<view class="coupon-expiry-date">有效期：{{item.rule.use_started_at}}至{{item.rule.use_ended_at}}</view>
										</block>
									 </block>
								</view>
								<view class="coupon-get coupon-get-already">已领取</view>
							</view>
					</block>
				</block>
				<block v-if="current === 1">
					<block v-if="couponList.length > 0">
							<view  v-for="(item, index) in couponList" :key="index"
							  :data-id="item.batch_id"
							 :data-index="index" class="coupon coupon-wave-left coupon-wave-right coupon-yellow-gradient">
								<view class="coupon-info coupon-hole coupon-info-right-dashed">
									<!-- 使用范围，0—全场，1—商品  
									优惠卷类型, 0-满减, 1-折扣 2—直减-->
									<block v-if="item.rule.type === 0">
										<block v-if="item.rule.use_range === 0">
											<view class="coupon-price"> <text class="font-14">¥</text> {{item.rule.amount.toFixed(2)}}</view>
											<view class="coupon-desc">【全场 满减】{{item.coupon_name}}</view>
										</block>
										<block v-if="item.rule.use_range === 1">
											<view class="coupon-price"> <text class="font-14">¥</text>{{item.rule.amount.toFixed(2)}}</view>
											<view class="coupon-desc">【商品 满减】{{item.coupon_name}}</view>
										</block>
									</block>
									<block v-if="item.rule.type === 1">
										<block v-if="item.rule.use_range === 0">
											<view class="coupon-price">{{item.rule.discount.toFixed(1)}} <text class="font-14">折扣券</text></view>
											<view class="coupon-desc">【全场 折扣】{{item.coupon_name}} </view>
										</block>
										<block v-if="item.rule.use_range === 1">
											<view class="coupon-price">{{item.rule.discount.toFixed(1)}}  <text class="font-14">折扣券</text></view>
											<view class="coupon-desc">【商品 折扣】{{item.coupon_name}}</view>
										</block>
									</block>
									
									<block v-if="item.rule.type === 2">
										<block v-if="item.rule.use_range === 0">
											<view class="coupon-price"> <text class="font-14">¥</text>{{item.rule.amount.toFixed(2)}}</view>
											<view class="coupon-desc">【全场 直减 无规则】{{item.coupon_name}}</view>
										</block>
										<block v-if="item.rule.use_range === 1">
											<view class="coupon-price"> <text class="font-14">¥</text>{{item.rule.amount.toFixed(2)}}</view>
											<view class="coupon-desc">【商品 直减 无规则】{{item.coupon_name}}</view>
										</block>
									</block>
									<view class="coupon-expiry-date">有效期：{{item.rule.use_started_at}}至{{item.rule.use_ended_at}}</view>
								</view>
								<view class="coupon-get " @click.native="collectCoupon(item.batch_id)">立即领取</view>
								
							</view>
							
					</block>
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
				current:0,
				pageNo:0,
				customer: getApp().globalData.customer,
				status: 'more',
				contentText: {
					contentdown: '查看更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
				limit:10,
				couponList:[],
				isClick:false,
				isChange:false,
				scrollTop:0
			}
		},
		onLoad() {
			var myApp = this
			myApp.toClick(myApp.current);
		},
		onPageScroll(e) {
			var myApp = this
			myApp.scrollTop = e.scrollTop;
		},
		methods: {
			toClick(type){
				var myApp = this
				myApp.isClick = true
				var pageNo = 1
				myApp.status = "loading"
				myApp.pageNo = pageNo
				myApp.couponList = [];
				myApp.current = type
				myApp.loadPage(pageNo,myApp.limit,myApp.current);
				
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
			collectCoupon(batch_id){
				var myApp = this
				http("coupon/collect", {
					'batch_id': batch_id,
					'customer_id': myApp.customer.id,
				}, {
					hideLoading: false, // 默认 false
					hideMsg: true, // 默认 false
				}).then(res => {
					var pageNo = 1;
					myApp.current = 1;
					myApp.couponList = [];
					myApp.status = "loading";
					myApp.pageNo = pageNo;
					myApp.isChange = true
					myApp.loadPage(pageNo,myApp.limit,myApp.current);
				}).catch(err => {
					console.error(err)
				})
				
			},
			clickLoadMore(e){
				var myApp = this;
				if(e.detail.status == "more"){
					var pageNo = parseInt(myApp.pageNo)+1;
					myApp.status = "loading";
					myApp.pageNo = pageNo;
					myApp.loadPage(pageNo,myApp.limit,myApp.current)
				}else if(e.detail.status == "loading"){
					myApp.showToast("正在加载，请等待");
				}else if(e.detail.status == "noMore"){
					myApp.showToast("暂无更新");
				}
			},
			loadPage(pageNo,limit,type){
				var myApp = this
				var api = "coupon/getAll/customer/collection"
				if(type === 1){
					api = "coupon/getAll/collection"
				}
				http(api, {
					'currNo': pageNo,
					'customer_id': myApp.customer.id,
					'limit': limit,
				}, {
					hideLoading: false, // 默认 false
					hideMsg: true, // 默认 false
				}).then(res => {
					let len = res.data.length;
					if(len == 0 ){
						myApp.status = "noMore";
						return;
					}else{
						myApp.status = "more";
					}
					myApp.couponList = res.data;
				}).catch(err => {
					console.error(err)
				})
			},
			navBack() {
				var myApp = this
				let pages = getCurrentPages(); // 获取页面栈
				let nowPage = pages[pages.length - 1]; //当前页页面实例
				let prevPage = pages[pages.length - 2]; //上一页页面实例
				if(myApp.isChange){
					prevPage.$vm.shouldUpdate = 1; //修改上一页data里面 searchVal 的值
				}else{
					prevPage.$vm.shouldUpdate = -1; //修改上一页data里面 searchVal 的值
				}
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
