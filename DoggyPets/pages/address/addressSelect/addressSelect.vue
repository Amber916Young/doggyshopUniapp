<template>
	<view class="container">
		<view  v-for="(item, index) in addressList" :key="index" >
			<uni-list  :border="false">
				<view class="padding-5 margin-b-5">
					<uni-list-item  
					 :show-extra-icon="true"
					  :extra-icon="extraIcon"
					  :title="item.username" 
					  :note="item.province+item.city+item.district+item.address"
					  :rightText="item.phone" 
					 clickable @click.stop="selectAddress(item.customer_addr_id)" @tap.stop.prevent >
					 
						<template  v-slot:header>
							<block v-if="item.is_default === 0">
								<uni-icons type="star-filled" color="#FF5733" size="18"></uni-icons>
							</block>
							<block v-if="item.is_default === 1">
								<uni-icons type="star-filled" color="#999" size="18"></uni-icons>
							</block>
						</template>
						<template  v-slot:footer>
							<view @tap.stop.prevent >
								<uni-icons type="compose"   @click.stop="updateAddress(item.customer_addr_id)" color="#FF5733" size="30"></uni-icons>
							</view>
						</template>
					</uni-list-item>
				</view>
			</uni-list>
		</view>

		<button class="fixed_btn rand-cic"   :plain="true" @click="addNewAddress">
			<uni-icons type="plusempty" size="30"></uni-icons>
		</button>
	</view>
</template>

<script>
	import http from '@/utils/request.js'
	export default {
		data() {
			return {
			
				addressList:[],
				customer: getApp().globalData.customer,
				extraIcon: {
					color: '#FF5733',
					size: '30',
					type: 'location'
				},
			}
		},
		onLoad() {
			var myApp = this;
		
		},
		onShow() {
			var myApp = this;
			myApp.loadAllAddress();
			// uni.startPullDownRefresh();
		},
		
		onPullDownRefresh(){
			var myApp = this;			
			
		},
		onBackPress() {
			let pages = getCurrentPages(); //获取所有页面栈实例列表
			let nowPage = pages[pages.length - 1]; //当前页页面实例
			let prevPage = pages[pages.length - 2]; //上一页页面实例
			prevPage.$vm.addressId = -1; //修改上一页data里面 searchVal 的值
			prevPage.$vm.couponId = -2; //修改上一页data里面 searchVal 的值
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
			selectAddress(id){
				let pages = getCurrentPages(); //获取所有页面栈实例列表
				let nowPage = pages[pages.length - 1]; //当前页页面实例
				let prevPage = pages[pages.length - 2]; //上一页页面实例
				prevPage.$vm.addressId = id; //修改上一页data里面 searchVal 的值
				prevPage.$vm.couponId = -2; //修改上一页data里面 searchVal 的值
				//uni.navigateTo跳转的返回，默认1为返回上一级
				uni.navigateBack({
					delta: 1
				});
				return true; // 此处必须 return 
			},
		
			updateAddress(id){
				var myApp = this;
				let url = "/pages/address/addressAdd/addressAdd?id="+id;
				myApp.jumpPage(url);				
				
			},
			loadAllAddress(){
				var myApp = this;
				http('address/get/all', {
					'customer_id': myApp.customer.id
				}, {
					hideLoading: false, // 默认 false
					hideMsg: true, // 默认 false
					method: 'POST' // 默认 POST
				}).then(res => {
					myApp.addressList = res.data;
					// uni.stopPullDownRefresh() 
				}).catch(err => {
					console.error(err)
				})
			},
			addNewAddress(){
				var myApp = this;
				let url = "/pages/address/addressAdd/addressAdd";
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

</style>
