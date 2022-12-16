<template>
	<view class="container">
		<scroll-view scroll-y="true" style="height: 70%;">
				<view  v-for="(item, index) in addressList" :key="index" >
					<uni-list  :border="false">
						<uni-swipe-action >
							<uni-swipe-action-item :right-options="options"  @click="onClickDelete(item.customer_addr_id)"  >
									<view class="padding-5 margin-b-5">
										<uni-list-item  
										 :show-extra-icon="true"
										  :extra-icon="extraIcon"
										  :title="item.username" 
										  :note="item.province+item.city+item.district+item.address"
										 showArrow :rightText="item.phone" 
										 clickable @click.stop="updateAddress(item.customer_addr_id)">
											<template  v-slot:footer>
												<block v-if="item.is_default === 0">
													<uni-icons type="star-filled" color="#FF5733" size="18"></uni-icons>
												</block>
												<block v-if="item.is_default === 1">
													<uni-icons type="star-filled" color="#999" size="18"></uni-icons>
												</block>
											</template>
										</uni-list-item>
									</view>

							</uni-swipe-action-item>
						</uni-swipe-action>
					</uni-list>
				</view>
		</scroll-view>
	
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
				options:[{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
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
			console.info("触发")
			uni.startPullDownRefresh();
		},
		
		onPullDownRefresh(){
			var myApp = this;			
			myApp.loadAllAddress();
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
			onClickDelete(id){
			  var myApp = this;
			  uni.showModal({
			  	title: '删除地址信息',
			  	content: '您确定删除当前地址？',
			  	success: function (res) {
			  		if (res.confirm) {
			  			http('address/delete', {
			  				'customer_addr_id': id,
			  				'customer_id': myApp.customer.id,
			  			}, {
			  				hideLoading: false, // 默认 false
			  				hideMsg: true, // 默认 false
			  				method: 'POST' // 默认 POST
			  			}).then(res => {
			  				myApp.addressList = res.data;
							myApp.showToast("删除成功")
			  			}).catch(err => {
			  				console.error(err)
			  			})
			  		} else if (res.cancel) {
						myApp.showToast("您取消了操作","error")
			  		}
			  	}
			  });

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
					uni.stopPullDownRefresh() 
				}).catch(err => {
					console.error(err)
				})
			},
			addNewAddress(){
				var myApp = this;
				if(myApp.addressList.length < 5){
					let url = "/pages/address/addressAdd/addressAdd";
					myApp.jumpPage(url);
				}else{
					myApp.showToast("您最多添加五个地址信息","error")
				}
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
