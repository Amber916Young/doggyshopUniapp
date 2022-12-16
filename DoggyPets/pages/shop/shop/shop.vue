<template>
<view class="container container-head">
	
	  <view class="catalog_section">
		  <view class="font-16 " > 分类</view>
			<uni-search-bar placeholder="搜索商品" bgColor="#f3f3f3" v-model="searchValue" @confirm="searchValue" />
	  </view>

<!-- :style=" {height:screenHeight+'px'}" -->
	<view class="catalog"  >
		<view class="nav"   :style=" {height:screenHeight+'px'}"  >
		  <view :class=" currentCategory.id == item.id ? 'active item' : ' item' " 
		  v-for="(item, index) in categoryList" :key="index"
			 @click="switchCate"  :data-id="item.id" :data-index="index" >
			<!-- <block v-if="item.img_url != '' ||item.img_url != null || item.img_url.length != 0 ">
				 <view class="itemimg">
				   <image mode="aspectFill" :src="item.img_url"></image>
				 </view>
			 </block> -->
			 {{item.title}}
		  </view>
		</view>
		<!-- scroll-top="0" -->
		<scroll-view  :style=" {height:screenHeight+'px'}" class="cate " :scroll-y="true"  >
			
		<view class="three"  @click="onClickDetail"  v-for="(item, index) in currentCategorySub" :id="item.id"  :data-id="item.category_id"   :key="item.id">
			<uni-card spacing="0" :is-shadow="false" margin="5" padding="0" :border="false" :cover="item.img_url"   > 
				<text class="font-16">{{item.title}}</text>
				<view class=" flex-card">
					<!-- <view class="tag-bg text-w">可领取优惠券 </view> -->
					
					<!-- <view class=" text-w" v-if=""> </view> -->
					<fast-price  :text="item.original_price"  :miniDecimal="true"></fast-price>
				</view>
			<!-- 	<view slot="actions" class="card-actions" @tap.stop.prevent >
					<fast-price  :text="item.original_price"  :miniDecimal="true"></fast-price>
					<uni-number-box :min="min" :max="max"  v-model:value="item.amount"  @change.stop="numberChange('good_main',item,$event)" />
				</view> -->
			</uni-card>
			<view class="divder margin-b-5"></view>
		</view>
		
		
    </scroll-view>

  </view>

   <view class="cart-bar"   v-if="info >0 ">
      <view class="l" @click="openCart">
		  <uni-badge class="uni-badge-left-margin":text="info" absolute="rightTop" :offset="[-3, -3]" size="normal">
			<view class="box">
				<uni-icons color="#FFC300" type="cart-filled" size="30"></uni-icons>
				</view>
		  </uni-badge>
      </view>
      <view class="r">
		<fast-price :size="58"  :text="amount_price" :miniDecimal="true"></fast-price>
        <view v-if="shopIsOpened" class="topay" @click="buyClick" >选好了</view>
        <view v-else class="topay noopen">未营业</view>
      </view>
    </view>
	

 
	
	
	<!-- cart popup -->
	<uni-popup ref="popupCart" background-color="#fff"  type="bottom"> 
	
	    <view class="empty-box"  >
	      <!-- <view class="empty-1">已点商品：{{info}} 份</view> -->
	      <view class="empty-1"></view>
		  <uni-icons @click="clearCart" type="trash" size="30"  color="#c7c7c7"></uni-icons>
	    </view>
		<scroll-view :scroll-y="true" style="max-height: 60%;">
			<block v-if="info >0 " v-for="(item, index) in cartList" :key="index" :data-id="item.cart_id" :data-index="index" >
				<view  class="cart-goods-list">
				  <view class="l">
					<view class="title">{{item.title}}</view>
					<view class="content">
					  {{item.specification}}
					</view>
				  </view>
				  <view class="r">
					<view class="price">¥{{ item.original_price }}</view>
					<uni-number-box  :min="min" :max="max" v-model:value="item.good_amount"  @change.stop="numberChange('good_cart',item,$event)" />
				  </view>
				</view>
			</block>
			<block v-if="info >0 ">
				<view style=" margin-bottom: 120rpx;"></view>
			</block>
		</scroll-view>
	</uni-popup>

</view>



</template>

<script>
	import http from '@/utils/request.js'
	import share from '@/utils/share.js'

	export default {
		data() {
			return {
				shopIsOpened:true,
				amount_price:0,
				info:0,
				searchValue: "",
				sumPrice:0,
				categoryList: [],
				currentCategory: {},   // 当前产品大类
				currentCategorySub:[], // 当前产品大类的 商品列表
				currentGood: {},
				number:1,
				min: 0,
				max: 10,
				color: 'bg-orange',
				shape: 'circle',
				step: 1,
				
				cartList: [], // 购物车
				customer: getApp().globalData.customer,
				index:0,
				category_id:-1,
				extraIcon: {
					color: '#ff5733',
					size: '26',
					type: 'medal'
				},
				screenHeight: 500 ,
				hasLogin:getApp().globalData.hasLogin,
			}
		},
		onShow(option) {
			var myApp = this;
	
			  // myApp.getScrollHeight();
			// 获取窗口信息
			let getWindowInfo = uni.getWindowInfo()
			// console.log(getWindowInfo.screenHeight);//屏幕高度
			// console.log(getWindowInfo.screenWidth);//屏幕宽度
			// console.log(getWindowInfo.windowHeight);//可操作页面高度
			// console.log(getWindowInfo.windowWidth);//可操作页面宽度
			// console.log(getWindowInfo);
			// console.log('获取窗口信息');
			myApp.screenHeight = getWindowInfo.windowHeight- getWindowInfo.statusBarHeight - 90

			
		},
		
	
		 
		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function () {
		  //获取scroll-view高度
		  var myApp = this;
		  // myApp.getScrollHeight();
		},
		
		onLoad() {
			var myApp = this;	
			myApp.loadAllGoods();
			// myApp.loadCartNumber();
			myApp.currentCategorySub = []
			myApp.currentCategory = {}
		},
		watch:{
			
		},
		// 自定义此页面的转发给好友(已经有全局的分享方法，此处会覆盖全局)
		onShareAppMessage(res) {
			console.info(res)
			return {
			  title: '页面分享的标题',
			  path: '/pages/shop/shop',
			  imageUrl: '/static/imgs/mylogo.png'
			}
		  },
		  // 自定义页面的分享到朋友圈
		onShareTimeline(res) {
				console.info(res)
			return {
				title: '页面分享的标题',
				path: '/pages/my/my',
				imageUrl: '/static/imgs/mylogo.png'
			}
		},
		
		methods: {
			actionsClick(action){
				return {
				  title: '页面分享的标题',
				  path: '/pages/shop/shop',
				  imageUrl: '/static/imgs/mylogo.png'
				}
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
			
			buyClick(){
				var myApp = this;
				myApp.$refs.popupCart.close();
				myApp.jumpPage('/pages/paymentIndex/paymentIndex');
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
					myApp.$refs.popupCart.close()
					myApp.amount_price = 0
					myApp.info = 0
					myApp.showToast("购物车里啥也没有呢")
					
					myApp.currentCategorySub = myApp.currentCategory.goodsList
					for(let i =0 ;i<myApp.currentCategorySub.length;i++){
						myApp.$set( myApp.currentCategorySub[i],"amount", 0)   
					}
					myApp.$forceUpdate(); 	
					// console.info("===========")
					
				}).catch(err => {
					console.error(err)
				})
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
					if( myApp.cartList.length === 0 ){
						myApp.$refs.popupCart.close()
						myApp.info = 0
						myApp.showToast("购物车里啥也没有呢")
					}else{
						myApp.$refs.popupCart.open()
						myApp.amount_price = res.data.amount_price;
					}
				}).catch(err => {
					console.error(err)
				})
			},
			loadCartNumber(){
				var myApp = this;
				http('order/getAll/cart/number', {
					'customer_id':myApp.customer.id
				}, {
					hideLoading: false, // 默认 false
					hideMsg: true, // 默认 false
					method: 'POST' // 默认 POST
				}).then(res => {
					myApp.info = res.data.size;
					myApp.amount_price = res.data.amount_price;
				}).catch(err => {
					console.error(err)
				})
			},
			loadAllGoods(){
				var myApp = this;
				http('goods/get/all', {
					'index':myApp.index
				}, {
					hideLoading: false, // 默认 false
					hideMsg: true, // 默认 false
					method: 'POST' // 默认 POST
				}).then(res => {
					myApp.categoryList = res.data;
					myApp.currentCategory = myApp.categoryList[myApp.index];
					myApp.currentCategorySub = myApp.currentCategory.goodsList
				}).catch(err => {
					console.error(err)
				})
			},
			search(res) {
				var myApp = this;
				myApp.showToast('搜索关键字：' + res.value,"search")
				// myApp.jumpSearchPage(res.value);
				
			},
			
			openCart(){
				var myApp = this;	
				// myApp.cartList = []
				myApp.loadCart();
			},
			switchCate(event) {
				var myApp = this;
				var cid = event.currentTarget.dataset.index;
				var id =  event.currentTarget.dataset.id;
				myApp.index = cid
				myApp.category_id = id
				if (myApp.currentCategory.id === id) {
					return false;
				} else {
					myApp.getCurrentCategory(id);
			  }
			  return false;
			},
			getCurrentCategory(category_id){
				var myApp = this;
				
				http('goods/get/current/category',{
					'category_id':category_id,
					// 'customer_id':myApp.customer.id
				}, {
					hideLoading: false, // 默认 false
					hideMsg: true,      // 默认 false
					method: 'POST'       // 默认 POST
				}).then(res => {
					
					myApp.currentCategory = res.data.currentCategory;
					myApp.currentCategorySub = res.data.currentCategorySub
				}).catch(err => {
					console.error(err)
				})
			},
			
		
			onClickDetail(event){
				var myApp = this;
				var cid = event.currentTarget.id;
				let url = "/pages/shop/product_detail/product_detail?id="+cid;
				myApp.jumpPage(url);
			},
			
			
			
			// 监听数量更改
			numberChange(type, obj,event) {
				// console.info(obj)
				var myApp = this;
				let sum_price = 0;
				if(type === "good_main"){
					http('order/change/number',{
						'good_id':obj.id,
						'good_amount':event,
						'price':obj.original_price,
						'customer_id':myApp.customer.id
					}, {
						hideLoading: false, // 默认 false
						hideMsg: true,      // 默认 false
						method: 'POST'       // 默认 POST
					}).then(res => {
						myApp.info = res.data.size
						myApp.amount_price = res.data.amount_price
					}).catch(err => {
						console.error(err)
					})
				}else if(type === "good_cart"){
					for(let i =0 ;i<myApp.currentCategorySub.length;i++){
						if(obj.good_id === myApp.currentCategorySub[i].id){
							myApp.$set( myApp.currentCategorySub[i],"amount", event)
						}
					}
					myApp.$forceUpdate(); 
					
					http('order/change/number/return/cartList',{
						'good_id':obj.good_id,
						'good_amount':event,
						'price':obj.original_price,
						'customer_id':myApp.customer.id
					}, {
						hideLoading: false, // 默认 false
						hideMsg: true,      // 默认 false
						method: 'POST'       // 默认 POST
					}).then(res => {
						var tmp = res.data.cartList
						if(event === 0){
							// for(var i =0 ;i <)
						}
						myApp.info = tmp.length
						myApp.cartList = tmp
						console.info("dddd")
						
						myApp.amount_price = res.data.amount_price;
						if( tmp.length === 0 ){
							myApp.$refs.popupCart.close()
							myApp.showToast("购物车里啥也没有呢")
						}
						
					}).catch(err => {
						console.error(err)
					})
				}
					
			},
			
			//减少请求次数
			reloadCategory(){
				var myApp = this;
				if(myApp.category_id === -1){
					myApp.loadAllGoods(myApp.index)
				}else{
					myApp.getCurrentCategory(myApp.category_id)
				}
			}
			
		
		},
	
	}
</script>

<style>

	@import './shop.css';
	/* image{
		width: 100%;
		height: 200px;
	}
	 */
/* 	.container{
	  height: 100vh;
	  overflow: hidden;
	} */

	.uni-card__cover{
		height: 200px;
	}
	.content {
		padding: 15px;
	}


	
.comm__box{
	width: 100%;
  height: calc((100vw - 40px) * 250 / 690);
  background: #fff;
  position: relative;
  overflow: hidden;
  padding: 5px;
}
.comm__img {
   /* height: 150px;
    width: 120px; */
}

</style>
