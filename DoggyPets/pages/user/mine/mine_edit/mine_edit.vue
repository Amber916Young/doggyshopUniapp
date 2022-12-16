<template>
	<view class="container" >
		<uni-card >
			<view :style="[{ height: height, wdith: wdith }]"  >
				<uni-forms ref="customForm" :rules="customRules"  :modelValue="customer" label-position="left">
					<uni-forms-item label="用户名" required  name="username">
						<uni-easyinput :styles="styles"   trim="all" :value="customer.username" placeholder="请输入姓名" />
					</uni-forms-item>
					<uni-forms-item label="手机号" required  name="phone"> 
						<uni-easyinput  :styles="styles"  type="number" :value="customer.phone" placeholder="请输入手机号" />
					</uni-forms-item>
					<uni-forms-item label="性别" required name="gender">
						<uni-data-select :value="customer.gender" :localdata="range"  @change="changeSex"></uni-data-select>
						</uni-section>
					</uni-forms-item>
				</uni-forms>
			</view>
		</uni-card>
		<view class="flex-card">
			<button class="btn-round "  :plain="true" @click="editMine">
			  <view class="detailtxt ">
					<view>确认</view>
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
				styles: {
					color: '#000000',
					borderColor: '#FFC300'
				},
				customer: getApp().globalData.customer,
				customRules: {
					username: {
						rules: [{
							required: true,
							errorMessage: '姓名不能为空'
						}]
					},
					phone: {
						rules: [{
							required: true,
							errorMessage: '联系电话不能为空'
						}]
					}
				},
				range: [{
					text: '女',
					value: '0'
				}, {
					text: '男',
					value: '1'
				}, {
					text: '保密',
					value: '2'
				}],
				height: '100%',
				wdith: '100%',
				tmpSex:0

			}
		},
		onShow() {
			var myApp = this
			myApp.getFullData()
		},
		onLoad() {
			var myApp = this
			myApp.customer= getApp().globalData.customer
			// console.info(this.customer)
		},
		onBackPress() {
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
		onReady() {
			var myApp = this
			myApp.$refs.customForm.setRules(myApp.customRules)	
		},
		methods: {
			changeSex(e) {
				var myApp = this
				myApp.tmpSex = e
				console.log("e:", e);
			},
			getFullData() {
				var myApp = this
				uni.getSystemInfo({
					success: function(res) {
						//获取屏幕的高度
						myApp.height = res.windowHeight / 2 + 'px';
						//获取屏幕的宽度
						myApp.wdith = res.windowWidth + 'px';
					}
				})
			},
			editMine(){
				var myApp = this;
				myApp.$refs.customForm.validate().then(res => {
				
					// res.uuid = myApp.customer.uuid
					// res.avatarUrl = myApp.customer.avatarUrl
					// console.log('success', res);
					uni.showToast({
						title: `校验通过`
					})
					res.id = myApp.customer.id
					res.openid = myApp.customer.openid
					res.gender = myApp.tmpSex
					http('userInfo/update', {
						'customer':res
					}, {
						hideLoading: false, // 默认 false
						hideMsg: true, // 默认 false
						method: 'POST' // 默认 POST
					}).then(res => {
						getApp().globalData.customer = res.data
						uni.setStorageSync('customer',res.data);
						myApp.back();
					}).catch(err => {
						console.error(err)
					})
				}).catch(err => {
					console.log('err', err);
				})
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
			
			
		}
	}
</script>

<style>
.uni-data-select{
	z-index: 999999;
}
.uni-card{
	/* height: 500px; */
}
</style>
