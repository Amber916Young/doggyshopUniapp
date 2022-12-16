<template>
	<view class="container">
		<uni-card >
			<view class="order-card" >
				<view class="order-section">
					<view class=" flex-card">
						<view class="margin_auto">头像</view>
						<!-- <button open-type="chooseAvatar" @chooseavatar="OnChooseAvatar"> 重新获取头像 </button> -->
						<block v-if="customer.avatarUrl === null">
							<button open-type="chooseAvatar" @chooseavatar="OnChooseAvatar"> 重新获取头像 </button>
						</block>
						<block v-else>
							<image :src="customer.avatarUrl"></image>
						</block>
					</view>
				</view>
			</view> 
		</uni-card>
		<uni-card >
			<uni-list>
				<uni-list-item title="姓名" :rightText="customer.username" />
				<uni-list-item title="手机号" :rightText="customer.phone" />
				<block v-if="customer.gender === '0'">
					<uni-list-item title="性别" rightText="女" />
				</block>
				<block v-else-if="customer.gender === '1'">
					<uni-list-item title="性别" rightText="男" />
				</block>
				<block v-else-if="customer.gender === '2'">
					<uni-list-item title="性别" rightText="保密" />
				</block>
				<uni-list-item title="注册日期" :rightText="customer.create_time" />
				<uni-list-item title="会员ID" :rightText="customer.uuid" />
				<uni-list-item title="积分" :rightText="customer.points" />
			</uni-list>
		</uni-card>
		<view class="flex-card">
			<button class="btn-round"  :plain="true" @click="editMinePage">
			  <view class="detailtxt ">
				<view >修改</view>
			  </view>
			</button>
		</view>

	</view>
</template>

<script>
	import http from '@/utils/request.js'
	import { pathToBase64, base64ToPath } from 'image-tools'
	export default {
		
		data() {
			return {
				styles: {
					color: '#000000',
					borderColor: '#FFC300'
				},
				customer: getApp().globalData.customer,
				UserData:{},
				// 单选数据源
				range: [{
					text: '女',
					value: 0
				}, {
					text: '男',
					value: 1
				}, {
					text: '保密',
					value: 2
				}],
			}
		},
		onLoad() {
			
		},
		onShow() {
			var myApp = this
			myApp.customer= getApp().globalData.customer
		},
		methods: {
			changeSex(e) {
				console.log("e:", e);
			},
			pathToBase64Tool(path){
				var myApp = this
				pathToBase64(path)
				  .then(base64 => {
					myApp.customer.avatarUrl  = base64
					uni.setStorageSync('customer',myApp.customer);
				  })
				  .catch(error => {
					console.error(error)
				  })
			},
			OnChooseAvatar(e){
				var myApp = this
				myApp.pathToBase64Tool(e.detail.avatarUrl);
			},
			editMinePage(){
				var myApp = this
				let url = "/pages/user/mine/mine_edit/mine_edit"
				myApp.jumpPage(url)
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
image{
	width: 100px;
	height: 100px;
	border-radius: 50%;
}
.order-card .order-section {
	width: 100%;
}
.margin_auto{
	margin: auto 0;
}
</style>
