<template>
	<view class="container">
		<block v-if="couponList.length === 0">
			<div class="text_bold" @click="selectCoupon(-1)" >暂无可用优惠券</div>
		</block>
		<block v-if="couponList.length > 0">
			<scroll-view :scroll-y="true"   class="scroll-Y">
				<div class="text_bold" @click="selectCoupon(-1)">不选择使用优惠券</div>
				<view  v-for="(item, index) in couponList" :key="index"
			 :data-index="index" class="coupon coupon-wave-left coupon-wave-right coupon-yellow-gradient">
					<view class="coupon-info coupon-hole coupon-info-right-dashed" @click="selectCoupon(item.batch_id)">
						 <!-- 使用范围，0—全场，1—商品
						 优惠卷类型, 0-满减, 1-折扣 2—直减-->
						 <block v-if="item.rule.type === 0">
							<block v-if="item.rule.use_range === 0">
								<div class="coupon-price"><text class="font-14">¥</text>{{item.rule.amount.toFixed(1)}}<span>优惠券</span></div>
								<div class="coupon-description">【全场 满减】{{item.coupon_batch.coupon_name}}</div>
							</block>
							<block v-if="item.rule.use_range === 1">
								<div class="coupon-price"><text class="font-14">¥</text>{{item.rule.amount.toFixed(1)}}<span>优惠券</span></div>
								<div class="coupon-description">【商品 满减】{{item.coupon_batch.coupon_name}}</div>
							</block>
						 </block>
						 <block v-if="item.rule.type === 1">
							<block v-if="item.rule.use_range === 0">
								<div class="coupon-price">{{item.rule.discount.toFixed(1)}}<span>优惠券</span></div>
								<div class="coupon-description">【全场 折扣】{{item.coupon_batch.coupon_name}}</div>
							</block>
							<block v-if="item.rule.use_range === 1">
								<div class="coupon-price">{{item.rule.discount.toFixed(1)}}<span>优惠券</span></div>
								<div class="coupon-description">【商品 折扣】{{item.coupon_batch.coupon_name}}</div>
							</block>
						 </block>
						 <block v-if="item.rule.type === 2">
							<block v-if="item.rule.use_range === 0">
								<div class="coupon-price"><text class="font-14">¥</text>{{item.rule.amount.toFixed(2)}}<span>优惠券</span></div>
								<div class="coupon-description">【全场 直减 无规则】{{item.coupon_batch.coupon_name}}</div>
							</block>
							<block v-if="item.rule.use_range === 1">
								<div class="coupon-price"><text class="font-14">¥</text>{{item.rule.amount.toFixed(2)}}<span>优惠券</span></div>
								<div class="coupon-description">【商品 直减 无规则】{{item.coupon_batch.coupon_name}}</div>
							</block>
						 </block>
						 <div class="coupon-expiry-date">{{item.rule.use_started_at}}<br/>{{item.rule.use_ended_at}}</div>
					</view>
					<view class="coupon-get coupon-get-already">已领取</view>
				</view>
			</scroll-view>
		</block>
	</view>
</template>

<script>
	import http from '@/utils/request.js'
	export default {
		data() {
			return {
				customer: getApp().globalData.customer,
				couponList:[],
				type:"",
				ids:""
			}
		},
		onLoad(option) {
			var myApp = this
			myApp.ids = option.ids
			myApp.type = option.type
			uni.startPullDownRefresh();
		},
		onPullDownRefresh() {
			var myApp = this
			var pageNo = 1;
			myApp.loadCoupon();
		},
		onBackPress() {
			let pages = getCurrentPages(); //获取所有页面栈实例列表
			let nowPage = pages[pages.length - 1]; //当前页页面实例
			let prevPage = pages[pages.length - 2]; //上一页页面实例
			prevPage.$vm.couponId = -1; //修改上一页data里面 searchVal 的值
			prevPage.$vm.addressId = -1; //修改上一页data里面 searchVal 的值
			//uni.navigateTo跳转的返回，默认1为返回上一级
			uni.navigateBack({
				delta: 1
			});
			return true; // 此处必须 return
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
			
			selectCoupon(id){
				let pages = getCurrentPages(); //获取所有页面栈实例列表
				let nowPage = pages[pages.length - 1]; //当前页页面实例
				let prevPage = pages[pages.length - 2]; //上一页页面实例
				prevPage.$vm.couponId = id; //修改上一页data里面 searchVal 的值
				prevPage.$vm.addressId = -1; //修改上一页data里面 searchVal 的值
				//uni.navigateTo跳转的返回，默认1为返回上一级
				uni.navigateBack({
					delta: 1
				});
				return true; // 此处必须 return 
			},
			loadCoupon(pageNo,limit,type){
				var myApp = this
				http("coupon/getAll/collection/canuse", {
					'customer_id': myApp.customer.id,
					'ids':myApp.ids,
					'type': myApp.type
				}, {
					hideLoading: false, // 默认 false
					hideMsg: true, // 默认 false
				}).then(res => {
					uni.stopPullDownRefresh() 
					if(res.data === null){
						myApp.showToast("暂无可用优惠券")
					}
					myApp.couponList = res.data
				}).catch(err => {
					console.error(err)
				})
			},
			
		}
	}
</script>

<style>

</style>
