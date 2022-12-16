<template>
	<view class="container">
		<view class="catalog_section"><view class="font-16 " > 购物袋</view></view>
		<view class="margin-t-20"></view>
		<view class="catalog" :style=" {height:screenHeight+'px'}" >
			<scroll-view  :scroll-y="true"  >
				<view class="empty-cart margin-t-300r" v-if="cartList.length===0">
					<image src="https://s1.ax1x.com/2022/12/13/z5WFb9.png"></image>
					
					
					<button  v-if="hasLogin === true" class="btn-round"   :plain="true"  @click="ToClick(1)">
						<view class="detailtxt ">
							<view v-if="hasLogin === true">您的购物袋为空</view>
						</view>
					</button>
					<button  v-else-if="hasLogin !== true"class="btn-round"   :plain="true"  @click="ToClick(2)">
						<view class="detailtxt ">
							<view >您还没有登陆</view>
						</view>
					</button>
				</view>
				<block v-else>
					<view class="cart-goods-list">
						<view class="main"   v-for="(item, index) in cartList" 
						:key="index" :data-id="item.cart_id" :data-index="index" >
							<view class="left">
								<view class="check-con">
									<view class="check-box">
										<checkbox-group @change="selected(item)">
											<checkbox  color="#FFCC33" :checked="item.flag" />
										</checkbox-group>
									</view>
									<image :src="item.img_url"></image>
								</view>
							</view>
							<view class="center">
								<view class="title"> {{item.title}} </view>
								<view class="price">¥ {{item.original_price}}  </view>
							</view>
							<view class="right">
								<view class="close" > 
									<uni-icons @click="numberChange('good_cart',item,0)" type="closeempty" size="25"></uni-icons>
								</view>
								<view class="number">
									<uni-number-box  :min="min" :max="max" v-model:value="item.good_amount" 
									@change.stop="numberChange('good_cart',item,$event)" />
								</view>
							</view>
						</view>
					</view>
							
					<view class="cart-bar" >
					   <view class="l" >
						   <checkbox-group  @change="allChoose">
								<checkbox color="#FFCC33"  :checked="allchecked"  />
						   </checkbox-group>
					   </view>
					   <view class="r">
							<fast-price :size="58"  :text="amount_price" :miniDecimal="true"></fast-price>
						 <view v-if="shopIsOpened" class="topay" @click="buyClick" >选好了</view>
					   </view>
					 </view>
				</block>
				
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import http from '@/utils/request.js'
	export default {
		data() {
			return {
				cartList:[],
				screenHeight: 500,
				customer: getApp().globalData.customer,
				shopIsOpened:true,
				amount_price:0,
				number:1,
				min: 0,
				max: 10,
				allchecked:true,
				hasLogin:getApp().globalData.hasLogin,
			}
		},
		onShow(option) {
			var myApp = this;
			// 获取窗口信息
			let getWindowInfo = uni.getWindowInfo()
			myApp.screenHeight = getWindowInfo.windowHeight- getWindowInfo.statusBarHeight - 80
			myApp.hasLogin = getApp().globalData.hasLogin
			if(myApp.hasLogin){
				myApp.loadCart()
			}
		},
		onLoad() {
			var myApp = this
			
		},
		
		computed: {
				 //监控数据变化
				 
			 //当数量变化时，下面的价格总数也跟着变化
			 // amount_price(){
				//  var myApp = this
				//  let amount_price=0;
				//  myApp.cartList.map(item=>{
				// 	 item.flag?amount_price+= item.good_amount * item.original_price : amount_price+=0;
				//  })
				//  return amount_price;
			 // }
		},
		methods: {
			ToClick(type){
				console.info(type)
				var myApp = this
				if(type === 1){
					myApp.showToast("2s后跳转到商品列表")
					setTimeout(function(){
						let url = "/pages/shop/shop/shop"
						uni.reLaunch({
							url: url,
						})
					}, 1500); 
					return
				}else{
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
				}
				
			},
		
		 //单个商品勾选
			 selected:function(item){
				 var myApp = this
				 item.flag=!item.flag;
				 if(!item.flag){
					 myApp.allchecked=false;
					 
				 }else{
					 const test=myApp.cartList.every(item=>{
						 return item.flag===true;
					 });
					 if(test){
						 myApp.allchecked=true;
					 }else{
						 myApp.allchecked=false;
					 }
				 }
				 myApp.reCountPrice()
			 },
			// 全选事件
			allChoose(e){
				var myApp = this
				 myApp.allchecked=!myApp.allchecked
				 if(myApp.allchecked){
					 myApp.cartList.map(item=>{
						 item.flag=true
					 })
				 }else{
					 myApp.cartList.map(item=>{
						 item.flag=false
					 })
				 }
				myApp.reCountPrice()
			
			},
			reCountPrice(){
				var myApp = this
				var total = 0
				myApp.allchecked = true
				myApp.cartList.map(item=>{
					item.flag? total += item.good_amount * item.original_price : total+=0;
					if(!item.flag){
						myApp.allchecked = false
					}
				})
				let tempVal = parseFloat(total).toFixed(3)
				let realVal = tempVal.substring(0, tempVal.length - 1)
				myApp.amount_price = realVal
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
			clearCart(){
				var myApp = this;
				
				http('order/clear/cart', {
					'customer_id':myApp.customer.id
				}, {
					hideLoading: false, // 默认 false
					hideMsg: true, // 默认 false
					method: 'POST' // 默认 POST
				}).then(res => {
					myApp.cartList = [];
					myApp.amount_price = 0
					myApp.showToast("购物车里啥也没有呢")
				}).catch(err => {
					console.error(err)
				})
			},
			loadCart(){
				var myApp = this;
				http('order/getAll/cart', {
					'customer_id':myApp.customer.id
				}, {
					hideLoading: false, // 默认 false
					hideMsg: true, // 默认 false
					method: 'POST' // 默认 POST
				}).then(res => {
					myApp.cartList = res.data.cartList;
					myApp.amount_price = res.data.amount_price;
				}).catch(err => {
					console.error(err)
				})
			},// 监听数量更改
			numberChange(type, obj,event) {
				// console.info(obj)
				var myApp = this;
				let sum_price = 0;
				if(type === "good_cart"){
					http('order/change/number/return/cartList',{
						'good_id':obj.good_id,
						'good_amount':event,
						'price':obj.original_price,
						'customer_id':myApp.customer.id,
						'flag':obj.flag
					}, {
						hideLoading: false, // 默认 false
						hideMsg: true,      // 默认 false
						method: 'POST'       // 默认 POST
					}).then(res => {
						myApp.cartList =  res.data.cartList
						myApp.reCountPrice()
						if( myApp.cartList.length === 0 ){
							myApp.showToast("购物车里啥也没有呢")
						}
						
					}).catch(err => {
						console.error(err)
					})
				}
			},
			buyClick(){
				var myApp = this;
				var str = ""
				myApp.cartList.map(item=>{
					if(item.flag){
						str += item.cart_id + ","
					}
				})
				myApp.jumpPage('/pages/paymentIndex/paymentIndex?ids='+str)
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
	page {
		background: #ffffff;
	}
	.container{
	  background: #ffffff;
	}
	.empty-cart{
		width: 100%;
		text-align: center;
	}
	.empty-cart image{
	    height: 40px;
	    width: 40px;
	}
	

</style>
