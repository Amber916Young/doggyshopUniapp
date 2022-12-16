<template>
	<view class="home">
	  <view class="bcgImg">
	    <image mode="aspectFill" src="https://s1.ax1x.com/2022/12/13/z44Awd.jpg"></image>
	  </view>
	 <!-- <view class="abs-center">
		  <view class="abs-text box-shadow " >
			  <image  mode="aspectFill" src="https://s1.ax1x.com/2022/12/13/z56QzQ.jpg"></image>
			  </view>
		  <view class="abs-text box-shadow">
			  <image  mode="aspectFill" src="https://s1.ax1x.com/2022/12/13/z56QzQ.jpg"></image>
		  </view>
		  <view class="abs-text box-shadow">
		  			  <image  mode="aspectFill" src="https://s1.ax1x.com/2022/12/13/z56QzQ.jpg"></image>
		  </view>
	  </view> -->
	  <view class="title-area ">
		  <image   mode="aspectFill" src="https://s1.ax1x.com/2022/12/13/z52mIx.png"></image>
	  </view>
		<view class="bcgImg2">
		  <image  mode="aspectFill" src="https://s1.ax1x.com/2022/12/12/z4Gj1O.jpg"></image>
		  <view class="abs-tag " @click="toTheTheme">
			  <text>即可选购</text>
		  </view>
		</view>
		<view class="card-good ">
			<uni-swiper-dot
			 @clickItem=clickItem :info="recommendList"
			 :current="currentImage" mode="default"
				 >
				<swiper style="height: 800rpx;" class="swiper-box" @change="change" current="0">
						<swiper-item  class="swiper-item"   v-for="(item, index) in  recommendList " :key="index">
							<view class="card-good-1 box-shadow">
								<image mode="scaleToFill" :src="item.img"></image>
								<view class="font-16 text_bold"> {{item.title}}</view>
								<view class="font-16 ">¥ {{item.original_price}}</view>
								<view class=" margin-t-15 topay " >查看详情</view>
							</view>
						</swiper-item>
				</swiper>
			</uni-swiper-dot>	
		</view>
		
		
	  <!-- <view class="footer">2022  yejiaYang</view> -->
	</view>
	
</template>

<script>
	import http from '@/utils/request.js'
	// import showToast from '@/utils/request.js'
	import { pathToBase64, base64ToPath } from 'image-tools'
	const unVerfiy = ["aboutUs","clearCache"];
	export default {
		data() {
			return {
				customer: getApp().globalData.customer,
				Token:"",
				hasLogin:  getApp().globalData.hasLogin,
				title: '橘作坊',
				Token:'',
				coupon:null,
				currentImage:0,
				recommendList:[
					{ 'img':"https://www.prada.com/content/dam/pradabkg_products/1/1BA/1BA274/NZVF0480/1BA274_NZV_F0480_V_EOO_MDL.jpg/_jcr_content/renditions/cq5dam.web.hebebed.800.1000.webp",
					'title':"Saffiano 皮革迷你手袋",
					'original_price':"30.5"
					
					},
					{ 'img':"https://www.prada.com/content/dam/pradabkg_products/1/1BA/1BA274/NZVF0002/1BA274_NZV_F0002_V_EOO_MDL.jpg/_jcr_content/renditions/cq5dam.web.hebebed.800.1000.webp",
					'title':"Saffiano 皮革迷你手袋",
					'original_price':"30.5"
					},
					{ 'img':"https://www.prada.com/content/dam/pradabkg_products/1/1BA/1BA863/NZVF0009/1BA863_NZV_F0009_V_OOO_MDL.jpg/_jcr_content/renditions/cq5dam.web.hebebed.800.1000.webp",
					'title':"Prada Re-Edition 1995 亮面皮革迷你手提包",
					'original_price':"30.5"
					},
					{ 'img':"https://www.prada.com/content/dam/pradabkg_products/1/1BA/1BA863/NZVF0076/1BA863_NZV_F0076_V_OOO_MDL.jpg/_jcr_content/renditions/cq5dam.web.hebebed.800.1000.webp",
					'title':"Prada Saffiano 皮革迷你手袋",
					'original_price':"30.5"
					},
					{ 'img':"https://www.prada.com/content/dam/pradabkg_products/1/1BA/1BA863/NZVF0002/1BA863_NZV_F0002_V_EOO_MDL.jpg/_jcr_content/renditions/cq5dam.web.hebebed.800.1000.webp",
					'title':"Prada Galleria刺绣提花织物迷你手袋",
					'original_price':"30.5"
					},
					
					
				]
			}
		},
		onLoad() {
			let myApp = this;
		},
		onShow() {
			var myApp = this;
			
			myApp.hasLogin = getApp().globalData.hasLogin
			// myApp.hasLogin = true
			myApp.customer = getApp().globalData.customer
			if(typeof myApp.customer.id === "undefined" ){
				return
			}
			// myApp.loadCoupon()
		},
		methods: {
			clickItem(e) {
				var myApp = this;
				myApp.swiperDotIndex = e
			},
			change(e) {
				var myApp = this;
				myApp.currentImage = e.detail.current
			},
			loadCoupon(){
				var myApp = this
				http("coupon/getOne", {
					'customer_id': myApp.customer.id,
				}, {
					hideLoading: false, // 默认 false
					hideMsg: true, // 默认 false
				}).then(res => {
					
					myApp.coupon = res.data
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
			
			
			
			

			toTheTheme(){
				var myApp = this
				let url = "/pages/shop/theme/theme"
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

	@import '../order/index/order.css';

	.bcgImg{
		height: 700rpx;
	}
	.bcgImg2{
		height: 200px;
		position:relative;
	}
	image {
		width: 100%;
		height: 100%;
	}
	.abs-center{
		display: flex;
		position: absolute;
		justify-content: space-evenly;
		top: 37%;
		width: 100%;
		text-align: center;
		height: 40px;
	}
	.abs-text{
		width: 30%;
		/* margin: auto; */
		height: 100px;
		border-radius: 5px;
		background: white;
		line-height: 40px;
	}
	.title-text-cn{
		text-align: center;
		height: 40px;
		line-height: 40px;
		font-family: fantasy;
	}
	.title-text-en{
		text-align: center;
		font-family: cursive;
	}
	.abs-tag{
		position:absolute;
		top:50%;
		left: 0;
		right: 0;
		text-align: center;
	}
	.abs-tag text{
		padding: 5px 20px;
		border: 1px solid white;
		color: white;

	}
	.card-good{
		width: 90%;
		margin: auto;
		height: 900rpx
	}
	.card-good image{
		/* height: 600rpx;
		width: 600rpx; */
		height: 536rpx;
		width: 85%;
	}
	.card-good-1{
		margin: 4rpx;
		text-align: center;
	}
	.bg-img{
		/* background-image: url('https://s1.ax1x.com/2022/12/13/z56QzQ.jpg'); */
	}
	.abs-text image{
		width: 73px;
	}
	.box-shadow{
		box-shadow: 2px 2px 4px rgba(0,0,0,.1);
		padding: 10px;
	}

	
	.title-area{
		height: 61px;
		line-height: 61px;
		margin-top: 2rem;
	}
	.title-area image{
		width: 95%;
	}
	

	.topay{
		margin: auto;
	}
</style>
