<template>
	<view class="home">
	  <view class="bcgImg">
		<!-- <view class="home-title">{{title}}</view> -->
	    <image class="bcgImg-image" mode="aspectFill" src="https://s1.ax1x.com/2022/12/12/z4Gj1O.jpg"></image>
	  </view>
	  <view class="card-list">
	    <view class="card card-1">
	      <block v-if="!hasLogin">
			  <button open-type="chooseAvatar" @chooseavatar="OnChooseAvatar"> 获取头像并登陆 </button>
	      </block>
	      <block v-else>
	        <image data-type="customer" @click="bindtap" class="userinfo-avatar" :src="customer.avatarUrl" mode="cover">
	        </image>
	        <view class="card-1-2">{{customer.username}}</view>
			<view class="card-1-4">No.{{customer.uuid}}</view>
			<view class="font-14 color-2">{{customer.create_time.substring(0,10)}} 成为手工作坊会员</view>
	        <view class="card-1-1">
				<uni-icons type="vip" color = "#FFC300"></uni-icons>
				<text>Level 10</text>
	        </view>
	        <view class="card-1-3">
				<progress :percent="customer.points"  backgroundColor="#EBEBEB" 
				activeColor="#FFC300" :show-info="false" stroke-width="6" />
	        </view>
			
			<view class="sideSection">
			  <view class="sideLeft">
				<view class="margin-b-15 font-14">积分</view>
				<view class="font-20 text_bold">{{customer.points}}</view>
				
			  </view>
			  <view class="sideCenter"></view>
			  <view class="sideRight"  data-type="coupon"  @click="bindtap">
				<view class="margin-b-15 font-14">优惠券</view>
				<view class="font-20 text_bold">{{couponNum}}</view>
			  </view>
			</view>
			
	      </block>

	    </view>
		<view class=" col">
			<view class="col-row  ">
			  <view class="card-title col-card" data-type="userOrder" @click="bindtap">
				<uni-icons type="list" size="35" ></uni-icons>
				<view class="card-title-text">我的订单</view>
			  </view>
			  <view class="card-title col-card" data-type="userAddress" @click="bindtap">
					<uni-icons type="compose" size="35" ></uni-icons>
					<view class="card-title-text">地址管理</view>
			  </view>
			</view>
			<view class="col-row ">
			  <view class="card-title col-card"  data-type="comment" @click="bindtap">
				<uni-icons type="chatboxes" size="35" ></uni-icons>
				<view class="card-title-text">我的评论</view>
			  </view>
			  <view class="card-title col-card"  data-type="customer" @click="bindtap">
				<uni-icons type="person" size="35" ></uni-icons>
				<view class="card-title-text">个人信息</view>
			  </view>
			</view>
			<view class="border-b-divied"></view>
		
			<view class="user-items  ">
				<view class="user-item"  data-type="onlineChat" @click="bindtap">
				  <text class="user-item_text">在线客服</text>
				  <view class="user-item_icon"><uni-icons size="26" type="staff"></uni-icons></view>
				</view> 
				<view class="user-item"  data-type="aboutUs"  @click="bindtap">
				  <text class="user-item_text">关于我们</text>
				  <view class="user-item_icon"><uni-icons size="26" type="info" ></uni-icons></view>
				</view> 
				<view class="user-item"  data-type="clearCache" @click="bindtap">
				  <text class="user-item_text">清除缓存</text>
				  <view class="user-item_icon"><uni-icons size="26" type="trash"></uni-icons></view>
				</view>
				<view class="user-item" data-type="suggestion" @click="bindtap">
				  <text class="user-item_text">意见建议</text>
				  <view class="user-item_icon"><uni-icons size="26" type="chatboxes"></uni-icons></view>
				</view>
					
			</view>
			
		</view>
	
		<uni-popup ref="kefu" type="center" :mask-click="false">
			<view class="popup">
				<view class="flex-end">
					<uni-icons type="close" size="30" @click="close" color="#fff">
					</uni-icons>
				</view>
				<image style="height: 200px; width: 200px;" src="https://s1.ax1x.com/2022/12/15/zoeYeP.jpg" mode="widthFix" class="QRcode"></image>
				<view class="topay  " @click="saveQRcode" >点击保存</view>
			
			</view>
		</uni-popup>
		
		<uni-popup ref="aboutus" type="center" >
			<view class="popup">
				<view class="aboutus-con">
				    <Xsuu-swiper :swiperItems="swiperItems"  :height="500"></Xsuu-swiper>
				</view>
			</view>
		</uni-popup>
		
	
	  </view>
	</view>
	
</template>

<script>
	import http from '@/utils/request.js'
	import XsuuSwiper from "@/components/Xss-swiper/Xsuu-swiper.vue"

	import { pathToBase64, base64ToPath } from 'image-tools'
	const unVerfiy = ["aboutUs","clearCache"];
	export default {
		  components: {XsuuSwiper},
		data() {
			return {
				customer: getApp().globalData.customer,
				Token:"",
				hasLogin:  getApp().globalData.hasLogin,
				title: '橘作坊',
				Token:'',
				coupon:null,
				value:"",
				swiperItems: [{
						'img': 'https://s1.ax1x.com/2022/12/16/zTIlW9.png',
						'title': '手工达人',
						'Subtitle':'ichbinvitaminb'
					},
					{
						'img': 'https://s1.ax1x.com/2022/12/15/zoeYeP.jpg',
						'title': 'UI设计',
						'Subtitle':'wxid_bp2oe72d39qm22'
					},
					{
						'img': 'https://s1.ax1x.com/2022/12/16/zT5654.png',
						'title': '个人开发者',
						'Subtitle':'Fiveisme001'
					}
				],
				couponNum:0,
				shouldUpdate:1
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
			if(!myApp.hasLogin) {
				return
			}
			if(typeof myApp.customer.id === "undefined" ){
				return
			}
		
			if(myApp.shouldUpdate===1){
				myApp.shouldUpdate = -1
				myApp.loadCouponNumber()
			}
		},
		methods: {
			loadCouponNumber(){
				var myApp = this
				http("coupon/get/coupon/number", {
					'customer_id': myApp.customer.id,
				}, {
					hideLoading: false, // 默认 false
					hideMsg: true, // 默认 false
				}).then(res => {
					myApp.couponNum = res.data
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
			
			pathToBase64Tool(path){
				var myApp = this
				console.info(path)
				pathToBase64(path)
				  .then(base64 => {
					myApp.customer.avatarUrl  = base64
					uni.setStorageSync('customer',myApp.customer);
					let url = '/pages/auth/login/login'
					myApp.jumpPage(url);
				  })
				  .catch(error => {
					console.error(error)
				  })
			},
			OnChooseAvatar(e){
				var myApp = this
				myApp.pathToBase64Tool(e.detail.avatarUrl);
				
			},
			
			
			 // 获取手机号 非企业号不可用
			 /**
			getPhoneNumber(e) {
				
				 this.getCode();
				 if(!this.decodePhoneParams.code || !e.detail.encryptedData){
						 return false;
				 }
				 this.decodePhoneParams.encryptedData = e.detail.encryptedData;
				 this.decodePhoneParams.iv = e.detail.iv;
				 this.$u.api
						 .postDecodeUserInfo(this.decodePhoneParams)
						 .then(res => {
								 console.log(res, '[地址管理-获取用户手机号]');
								 this.params.mobile = res.data.phoneNumber
						 })
						 .catch(err => {
								 console.log(err);
						 });
			 },
			 * **/
			close(){
				var myApp = this
				myApp.$refs.kefu.close()
			},
		
			saveQRcode(){
				uni.getSetting({
					success:(res)=>{
						if(res.authSetting['scope.writePhotosAlbum']){ //验证用户是否授权可以访问相册
							this.saveQRcodeToPhotosAlbum();
						}else{
							uni.authorize({
								scope:'scope.writePhotosAlbum',
								success:(res)=>{
									console.log('有授权的信息：',res);
									this.saveQRcodeToPhotosAlbum();
								},
								fail:(err)=>{ //取消授权后再获取授权，需手动设置
									uni.showModal({
										content:'检测到你没打开保存相册权限，是否去设置打开',
										confirmText:'确认',
										cancelText:'取消',
										success(res){
											if(res.confirm){
												uni.openSetting({
													success(res) {
														console.log('授权成功');
													}
												})
											}else{
												console.log('取消授权');
											}
										}
									})
								}
							})
						}
					}
				})
			},
			saveQRcodeToPhotosAlbum(){
				let that = this
				uni.saveImageToPhotosAlbum({
					filePath:'static/images/showModal/qrcode.png',
					success(res) {
						uni.showToast({
							title:'保存成功',
							icon:'success'
						})
						that.close()
					},
					fail(err){
						console.log(err);
					}
				})
			},
			bindtap(e){
				var myApp = this;
				var type = e.currentTarget.dataset.type;
				let url = "";
				
				if(type=="onlineChat"){
					myApp.$refs.kefu.open()
					return
				}else if(type=="clearCache"){
				  uni.showModal({
				  	title: '清除缓存',
				  	content: '是否确定清除所有缓存？',
				  	success: function (res) {
				  		if (res.confirm) {
				  			uni.clearStorage();
							myApp.showToast("清除成功","success")
							getApp().globalData.hasLogin = false
							myApp.hasLogin = false
				  		} else if (res.cancel) {
							myApp.showToast("已取消")
				  		}
				  	}
				  });
				  return
				}else if(type=="aboutUs"){
					myApp.$refs.aboutus.open()
					return
				}
				
				
				
				
				// console.info(getApp().globalData.hasLogin);
				if(!getApp().globalData.hasLogin && !unVerfiy.includes(type)) {
					myApp.showToast("您还未登陆，无法查看此功能")
					return;
				}
				if(type=="userOrder"){
				  url = "/pages/order/index/index";
				}else if(type=="coupon"){
				  url = "/pages/coupon/coupon/coupon";
				}else if(type=="customer"){
				  url = "/pages/user/mine/mine/mine";
				}else if(type=="userAddress"){
				  url = "/pages/address/address/address";
				}else if(type=="shop"){
				  url = "/pages/shop/shop/shop";
				}else if(type=="comment"){
				  url = "/pages/comment/comment/comment";
				}else if(type=="suggestion"){
					url = "/pages/user/suggestion/suggestion";
				}
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

<style lang="scss">	
   @import './index.css';
   $uni-bg-color:#FFC300;
	page .swiper-img {
	    width: 200px;
	    height: 70%;
	    margin-left: 113px;
	}
	.col {
		display: flex;
		display: -webkit-flex;
		flex-wrap: wrap;
	    background-color: white;
	    width: 90%;
	    justify-content: space-around;
		/* height: 200rpx; */
		align-items: center;
	}
	.col-card{
		text-align: center;
	}
	
	
	.col-row{
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
		height: 200rpx;
		align-items: center;
	}
	
	.box-shadow{
		border-radius: 16rpx; 
		box-shadow: 0 2px 4px rgba(0,0,0,.1);
	}
	
.user-items {
  // padding: 24rpx 40rpx;
  margin: 24rpx;
  width: 100%;
  background-color: #fff;
}

.user-item {
  position: relative;
  height: 120rpx;
  line-height: 120rpx;
  font-size: 36rpx;
  color: #3A3A3A;
  border-bottom: 1rpx solid #E8E8E8;
}

.user-item:last-child {
  border-bottom: none;
}

.user-item_text {
  position: relative;
  z-index: 10;
  font-size: 32rpx;
  pointer-events: none;
}

.user-item_icon {
  position: relative;
  z-index: 10;
  float: right;
  vertical-align: middle;
  width: 60rpx;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  pointer-events: none;
}
/* ranking sector */
.sideSection{
  display: flex;
}
.sideLeft{
  width: 50%;
text-align: center;
}
.sideCenter{
	height: 80rpx;
    width: 3px;
    background-color: #FFC300;
    margin: auto;
}
.sideRight{
  width: 50%;
  text-align: center;
}

.border-b-divied{
	border-bottom: 1rpx solid #E8E8E8;
	width: 90%;
}

.aboutus-con{
	width: 800rpx;
}
.aboutus-text{
	padding: 5px 0;
}

</style>
