<template>
<view class="container">

	<view class="logo">
	  <view class="imgsub">
		<image src="https://s1.ax1x.com/2022/12/06/z6VYBq.png"></image>
		<view class="title">
		  橘作坊
		</view>
	  </view>

	</view>
	<view class="login-box">
		<button class="btn-round" :plain="true" @click="getUserProfile"> 
			<view class="detailtxt ">
				<view>点击登陆</view>
			</view>
		</button>
	</view>
</view>
</template>

<script>
	import http from '@/utils/request.js'
	export default {
		data() {
			return {
				avatarUrl:"",
				customer: getApp().globalData.customer,
			}
		},
		onLoad(option) {
			var myApp = this;
			myApp.avatarUrl =myApp.customer.avatarUrl;
			
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
			
			getUserProfile() {
				var myApp = this;
				uni.showModal({
					title: '用户信息授权',
					content: '授权微信登录后才能正常使用小程序功能',
					success: function (res) {
						if (res.confirm) {
							uni.getUserProfile({
								lang: 'zh_CN',
								desc: '用户登录', 
								success: (res) => {
									let userTemp = res.userInfo;
									uni.setStorageSync('loginInfo',res.userInfo);
									var customer = myApp.customer;
									if(customer.openid){
										myApp.usualLogin(customer);
									}else{
										myApp.weixinLogin(res);
									}
									
								},
								fail: (err) => {
								}
							})
						} else if (res.cancel) {
						   uni.showToast({
								title: '您拒绝了请求',
								icon: 'error',
								duration: 2000
							  });
						}
					}
				});
			},
			usualLogin(customer){
				var myApp = this;
				http('wx/usual/login', {
					'customer': customer,
				}, {
					hideLoading: false, // 默认 false
					hideMsg: true, // 默认 false
					method: 'POST' // 默认 POST
				}).then(res => {
					uni.setStorageSync('Token',res.data.token);
					uni.setStorageSync('customer',res.data);
					getApp().globalData.hasLogin = true;
					getApp().globalData.customer = res.data;
					myApp.back();
				}).catch(err => {
					console.error(err)
				})
			},
			weixinLogin(entUser) {
				var myApp = this;
				uni.login({
					provider: 'weixin',
					success: function(res) {
						http('wx/login', {
							'code': res.code,
							'encryptedData':entUser.encryptedData,
							'iv':entUser.iv,
							'signature':entUser.signature,
							'avatarUrl':myApp.avatarUrl ,
							'appid':getApp().globalData.appid
						}, {
							hideLoading: false, // 默认 false
							hideMsg: true, // 默认 false
							method: 'POST' // 默认 POST
						}).then(res => {
							uni.setStorageSync('Token',res.data.token);
							uni.setStorageSync('customer',res.data);
							getApp().globalData.hasLogin = true;
							getApp().globalData.customer = res.data;
							myApp.back();
						}).catch(err => {
							console.error(err)
						})
					}	
					,fail(e) {
						console.log(e);
					}
					,complete(e) {
						console.log(e);
					}
				});
					
			},
			
			
		}
	}
</script>

<style>


page{
	background-color: white;
}
.logo{
  height: 500rpx;
  display: flex;
  align-items: center; /*垂直居中*/
  justify-content: center; /*水平居中*/
}

.imgsub{
  background: #f3f3f3;
  width: 250rpx;
  height: 250rpx;
  vertical-align: middle;
  text-align: center;
}
image{
	height: 250rpx;
	width: 250rpx;
	
}
.title{
  padding: 16rpx;
  font-size: large;
}


</style>
