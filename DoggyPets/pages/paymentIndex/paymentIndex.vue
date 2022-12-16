<template>
		<view class="container" >
			<uni-card :margin="5" :padding="0">
				<uni-list  :border="false">
					<uni-list-item  :show-extra-icon="true" 
					 :extra-icon="extraIcon" 
					:title="address.username" 
					clickable @click.stop="changeAddress(address.customer_addr_id)"
					:note="address.province+address.city+address.district+address.address" 
					showArrow :rightText="address.phone" />
				</uni-list>
			</uni-card>
			<uni-card :margin="5" :padding="0">
				
				<uni-collapse ref="collapse"  v-model="value" >
					<uni-collapse-item title="商品信息" >
						<view class="main"  v-for="(item, index) in cartList" :key="index"
								  :data-id="item.cart_id" :data-index="index">
							<view class="left"> 
								<image :src="item.img_url" mode="aspectFill"></image>
							</view>
							<view class="right">
								<view class="r-title">{{item.title}}</view>
								<view class="r-card">
									<view class="r-desc">
										<!-- <rich-text :nodes="item.specification">
										</rich-text> -->
									</view>
									<view class="r-price">
										<view class="r-r-con">
											<fast-price  :text="item.price"  :miniDecimal="true"></fast-price>
											<view class="space1"></view>
											<fast-price :size="30"  :text="item.original_price" :strikeout="true" :miniDecimal="true"></fast-price>
										</view>
										<view class="r-r-con">
											<text class="font-12">x</text>{{item.good_amount}}
										</view>
									</view>
								</view>
								
							</view>
						</view>
					</uni-collapse-item>
				</uni-collapse>
					
					<uni-easyinput @input="input" maxlength="100" v-model="memo" :styles="styles" type="textarea" placeholder="订单备注(100字以内)" />
					<uni-list  :border="false">
						<block v-if="couponId === -2">
							<uni-list-item  :show-extra-icon="true"
							 :extra-icon="extraIconCoupon" 
							title="请选择可用优惠券" 
							clickable @click.stop="viewCoupon()"
							showArrow rightText="查看" />
						</block>
						<block v-else-if="couponId === -1">
							<uni-list-item  :show-extra-icon="true"
							 :extra-icon="extraIconCoupon" 
							title="请选择可用优惠券" 
							clickable @click.stop="viewCoupon()"
							showArrow rightText="查看" />
						</block>
						<block v-if=" Object.keys( coupon).length > 0">
							<block v-if="coupon.rule.type === 0">
								<block v-if="coupon.rule.use_range === 0">
									<uni-list-item  :show-extra-icon="true"
									 :extra-icon="extraIconCoupon" 
									:title="coupon.coupon_name" 
									clickable @click.stop="viewCoupon()"
									:note="'【全场 满减】¥ ' + coupon.rule.amount.toFixed(2)" 
									showArrow rightText="查看" />
								</block>
								<block v-if="coupon.rule.use_range === 1">
									<uni-list-item  :show-extra-icon="true"
									 :extra-icon="extraIconCoupon" 
									:title="coupon.coupon_name" 
									clickable @click.stop="viewCoupon()"
									:note="'【商品 满减】¥ ' + coupon.rule.amount.toFixed(2)" 
									showArrow rightText="查看" />
								</block>
							</block>
							<block v-if="coupon.rule.type === 1">
								<block v-if="coupon.rule.use_range === 0">
									<uni-list-item  :show-extra-icon="true"
									 :extra-icon="extraIconCoupon" 
									:title="coupon.coupon_name" 
									clickable @click.stop="viewCoupon()"
									:note="'【全场 折扣】折扣券 ' + coupon.rule.discount.toFixed(1)" 
									showArrow rightText="查看" />
								</block>
								<block v-if="coupon.rule.use_range === 1">
									<uni-list-item  :show-extra-icon="true"
									 :extra-icon="extraIconCoupon" 
									:title="coupon.coupon_name" 
									clickable @click.stop="viewCoupon()"
									:note="'【商品 折扣】折扣券 ' + coupon.rule.discount.toFixed(1)" 
									showArrow rightText="查看" />
								</block>
							</block>
							<block v-if="coupon.rule.type === 2">
								<block v-if="coupon.rule.use_range === 0">
									<uni-list-item  :show-extra-icon="true"
									 :extra-icon="extraIconCoupon" 
									:title="coupon.coupon_name" 
									clickable @click.stop="viewCoupon()"
									:note="'【全场 直减】¥ ' + coupon.rule.amount.toFixed(2)" 
									showArrow rightText="查看" />
								</block>
								<block v-if="coupon.rule.use_range === 1">
									<uni-list-item  :show-extra-icon="true"
									 :extra-icon="extraIconCoupon" 
									:title="coupon.coupon_name" 
									clickable @click.stop="viewCoupon()"
									:note="'【商品 直减】¥ ' + coupon.rule.amount.toFixed(2)" 
									showArrow rightText="查看" />
								</block>
							</block>
						</block>
						
					</uni-list>
					<view class=" flex-card padding-5">
						<view class="text_bold">配送服务</view>
						<view  >
							<view v-if="isFreeShipping">{{freeNum}}件 免邮</view>
							<view v-else>运费   
							 <fast-price  :text="shippingfee"  :miniDecimal="true"></fast-price>
							 <text class="font-12">({{freeNum}}件包邮)</text></view>
							<view>正常24小时内发货</view>
						</view>
					</view>
					<view class=" flex-card padding-5">
						<view class="text_bold">运费</view>
						<view >
							<view v-if="isFreeShipping">两件 免邮</view>
							<view v-else><fast-price :text="shippingfee"  :miniDecimal="true"></fast-price></view>
						</view>
					</view>
					<view class=" flex-card padding-5">
						<view class="text_bold">商品总价格</view>
							<fast-price :text="amount_price" :miniDecimal="true">{{amount_price}}</fast-price>
					</view>
					<view class=" flex-card padding-5" >
						<view class="text_bold">现价格</view>
							<fast-price :text="amount_price_discount" :miniDecimal="true"></fast-price>
					</view>
					<view class=" flex-card padding-5" >
						<view class="text_bold">优惠金额</view>
						<fast-price :text="discount" :miniDecimal="true"></fast-price>
					</view>
					
			</uni-card>
			<view class="margin-b-100"></view>
			<view class="margin-b-100"></view>
			<view class="cart-bar"  >
			   <view class="l" > </view>
			   <view class="r">
					<fast-price :size="58"  :text="amount_price_discount" :miniDecimal="true"></fast-price>
					<view  class="topay" @click="buyClick" >付款</view>
			   </view>
			 </view>
		</view>

</template>

<script>
	import http from '@/utils/request.js'
	import {HashMap} from "@/utils/utils.js"
	

	export default {
		data() {
			return {
				memo:'',
				value:['0'],
				styles: {
					color: '#000000',
					borderColor: '#FFC300'
				},
				cartList:[],
				amount_price:0,
				customer: getApp().globalData.customer,
				address:"",
				extraIcon: {
					color: '#FF5733',
					size: '22',
					type: 'location'
				},
				extraIconCoupon: {
					color: '#FF5733',
					size: '22',
					type: 'gift'
				},
				payment_method:0,
				shippingfee:7,
				addressId: -1,
				couponId: -1,
				coupon:{},
				isFreeShipping:false,
				amount_price_discount:0,
				priceList:[],
				cartMap: new HashMap(),
				discount:0,
				ids:"",
				type:"",
				freeNum:2
			}
		},
		onLoad(option) {
			var myApp = this
			if(option.ids){
				let ids = option.ids
				myApp.ids = ids
				myApp.type = "cart"
				myApp.loadCart("cart",ids)
			}
			if(option.gid){
				let gid = option.gid
				myApp.ids = gid
				myApp.type = "good"
				myApp.loadCart("good",gid)
			}
			myApp.loadUniqueAddress()
			
		},
		onShow() {
			var myApp = this;
			console.info(myApp.addressId)
			console.info(myApp.couponId)
			if(myApp.addressId != -1){
				myApp.loadUniqueAddress()
				return
			}
			if(myApp.couponId != -1  && myApp.couponId != -2){
				myApp.loadUniqueCouponAndCountPrice()
				return
			}
			
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
			viewCoupon(){
				var myApp = this;
				var url = "/pages/coupon/coupon_select/coupon_select?ids="+myApp.ids+"&type="+myApp.type
				myApp.jumpPage(url)
			},
			changeAddress(){
				var myApp = this;
				var url = "/pages/address/addressSelect/addressSelect"
				myApp.jumpPage(url)
			},
			goToAddAddress(){
				var myApp = this;
				var url = "/pages/address/addressSelect/addressSelect"
				// var url = "/pages/address/addressAdd/addressAdd"
				myApp.jumpPage(url)
			},
			loadUniqueCouponAndCountPrice(){
				var myApp = this;
				http('coupon/get/unique', {
					'customer_id': myApp.customer.id,
					'batch_id': myApp.couponId,
					'ids':myApp.ids,
					'type': myApp.type
				}, {
					hideLoading: false, 
					hideMsg: true, 
					method: 'POST' 
				}).then(res => {
					myApp.coupon = res.data.batch
					myApp.amount_price = res.data.amount_price
					myApp.discount = res.data.discount
					myApp.amount_price_discount = res.data.amount_price_discount
					myApp.priceList = res.data.priceList
					if( res.data.flag){
						myApp.showToast(res.data.flag)
						return
					}
					var tPriceList = myApp.priceList
					for(let i = 0; i< tPriceList.length;i++){
						var Obj = myApp.cartMap.get(tPriceList[i].good_id)
						Obj.price = tPriceList[i].price
					}
					var icartMap = myApp.cartMap.values()
					var size =  myApp.cartMap.size()
					myApp.cartList = []
					myApp.cartList.push(...icartMap)
					
				}).catch(err => {
					console.error(err)
				})
			},
			loadUniqueAddress(){
				var myApp = this;
				http('address/get/unique', {
					'customer_id': myApp.customer.id,
					'customer_addr_id': myApp.addressId
				}, {
					hideLoading: false, // 默认 false
					hideMsg: true, // 默认 false
					method: 'POST' // 默认 POST
				}).then(res => {
					myApp.addressId = -1
					if(res.data === null){
						myApp.showToast("您还没有添加地址")
						setTimeout(function() {
							myApp.goToAddAddress()
						}, 2000);
						return
					}
					myApp.address = res.data
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
			loadCart(type,ids){
				var myApp = this
				var url = "order/getAll/cart/payment"
				if(type==="good"){
					url = "order/getAll/good/payment"
				}
				console.info(url)
				http(url, {
					'customer_id':myApp.customer.id,
					'ids':ids
				}, {
					hideLoading: false, // 默认 false
					hideMsg: true, // 默认 false
					method: 'POST' // 默认 POST
				}).then(res => {
					myApp.cartList = res.data.cartList
					var tcartList = myApp.cartList
					if(tcartList.length >= myApp.freeNum){
						myApp.isFreeShipping=true
						myApp.shippingfee = 0
					}
					for(let i = 0; i< tcartList.length;i++){
						myApp.cartMap.put(tcartList[i].good_id,tcartList[i])
						if(!myApp.isFreeShipping){
							if(tcartList[i].good_amount>= myApp.freeNum){
								myApp.isFreeShipping=true
								myApp.shippingfee = 0
							}
						}
					}
					myApp.amount_price = res.data.amount_price
					myApp.amount_price_discount = myApp.amount_price
					
					
				}).catch(err => {
					console.error(err)
				})
			},
			input(e){
				var myApp = this;
				myApp.memo = e;
			},
			buyClick(){
				var myApp = this;
				// uni.showModal({
				// 	title: '支付成功',
				// 	content: '请和顾问联系执行订单即可!'
				// })
				// return
				var timestamp = Date.parse(new Date())
				myApp.uploadTocloud(timestamp)
				
				
				/**
				 * 
				 * 	myApp.amount_price = res.data.amount_price
					myApp.discount = res.data.discount
					myApp.amount_price_discount = res.data.amount_price_discount
				 */
				
				
				
				
				
				//  //2:获得微信openid
				//   uniCloud.callFunction({
				// 	 name: 'getOrderInfo',
				// 	 data: {
				// 	    openId: myApp.customer.openId,
				// 		mchId: '',//商户号
				// 		key: '',//商户平台key
				// 		orderId: myApp.orderId,
				// 		timestamp: myApp.timestamp,
				// 		 pric: 1, // 单位分
				// 	 }
				//   }).then(openid => {
				// 	 console.log('openid:', openid)
				// 	 //3:統一下單
				// 	 uniCloud.callFunction({
				// 		name: 'getOrderInfo',
				// 		data: {
				// 		   openid: openid.result.openid,
				// 		   name: that.order.name,
				// 		   out_trade: that.order.out_trade, // 订单号
				// 		   suiji: Math.floor(Math.random() * 100000000),
				// 		   pric: Number(that.order.AgencyPric) * 100
				// 		}
				// 	 }).then(odr => {
				// 		console.log('OrderInfo:', odr)
				// 		uni.hideLoading(); //隐藏loding...
				// 		uni.requestPayment({
				// 		   // #ifdef MP-WEIXIN
				// 		   ...odr.result.orderInfo,
				// 		   // #endif                                   
				// 		   success() {
				// 			  uni.showModal({
				// 				 title: '支付成功',
				// 				 content: '请和顾问联系执行订单即可!'
				// 			  })
				// 		   },
				// 		   fail() {},
				// 		   complete() {
				// 			  // 支付完成后重新加载该页面
				// 			  myApp.uploadTocloud()
				// 		   }
				// 		})
				// 	 })
				//   })
			},
			uploadTocloud(out_trade){
				var myApp = this;
				
				http('order/payment/cart', {
					'customer_id':myApp.customer.id,
					'memo': myApp.memo,
					'payment_method': myApp.payment_method,
					'address':myApp.address ,
					'cartList':JSON.stringify(myApp.cartList),
					'amount_price':myApp.amount_price,
					'amount_price_discount':myApp.amount_price_discount,
					'discount':myApp.discount,
					'batch_id':myApp.couponId,
					'out_trade':out_trade,
					'shipping_money':myApp.shippingfee,
					
				}, {
					hideLoading: false, // 默认 false
					hideMsg: true, // 默认 false
					method: 'POST' // 默认 POST
				}).then(res => {
					getApp().globalData.customer = res.data
					uni.setStorageSync('customer',res.data);
					myApp.showToast("支付成功，1s后自动跳转")
					setTimeout(function(){
						let url = "/pages/order/index/index"
						uni.reLaunch({
							url: url,
						})
					}, 1500); 
					
				}).catch(err => {
					console.error(err)
				})
				
				
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

	.container {
	  height: auto;
	}
	.main{
		display: flex;
		flex-direction: row;
		flex: 1;
		padding: 10px 0px;
		overflow: hidden;
	}
	.main .left{
		width: 30%;
	    margin: auto 20rpx auto 0;
	}
	.main .left image{
		width: 100%;
		height: 100px;
		border-radius: 5px;
	}
	.main .right{
		width: 70%;
	}
	.main .right .r-title{
		font-size: 18px;
		font-weight: 600;
	}
	.main .right.r-card{
		display: flex;
	}
	.main .right .r-card .r-r-con{
		display: flex;
		justify-content: flex-end;
	}
	.cart-bar .r .tocart {
		width: 200rpx;
		height: 70%;
		background: white;
		border-radius: 0;
		color: #000;
		display: flex;
		font-size: 30rpx;
		align-items: center;
		justify-content: center;
		border: 1px solid;
	}
</style>
