<template>
	<view class="container"> 

		<view class="addressForm">
			<uni-forms ref="customForm" :rules="customRules"  :modelValue="addressData" label-position="left">
				<uni-forms-item label="姓名" required  name="username">
					<uni-easyinput :styles="styles"   trim="all" v-model="addressData.username" placeholder="请输入姓名" />
				</uni-forms-item>
				<uni-forms-item label="手机号" required  name="phone"> 
					<uni-easyinput  :styles="styles"  type="number" v-model="addressData.phone" placeholder="请输入手机号" />
				</uni-forms-item>
				<uni-forms-item label="省份" required  name="fullAddress"> 
					<uni-easyinput :styles="styles"  trim="all" v-model="addressData.fullAddress" placeholder="选择地址" />
			        <pickerAddress @change="changeAddress">点击选择</pickerAddress>
				</uni-forms-item>
				<uni-forms-item label="详细地址" required  name="address">
					<uni-easyinput :styles="styles" type="textarea" v-model="addressData.address" placeholder="楼 门牌号" />
				</uni-forms-item>
				<uni-forms-item label="默认" required name="is_default">
					<uni-data-checkbox  v-model="addressData.is_default" :localdata="is_defaultList" />
				</uni-forms-item>
			</uni-forms>
		</view>
		<button class="btn-round"  :plain="true" @click="saveorupadteAddress">
		  <view class="detailtxt">
			  <view>确认</view>
		  </view>
		</button>
	
	</view>
</template>
<script>
	import http from '@/utils/request.js'
    import pickerAddress from '@/components/pickerAddress/pickerAddress.vue'
	export default {
		components:{
			pickerAddress
		},
		data() {
			return {
				styles: {
					color: '#000000',
					borderColor: '#FFC300'
				},
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
					},
					fullAddress: {
						rules: [{
							required: true,
							errorMessage: '详细地址不能为空'
						}]
					},
					address: {
						rules: [{
							required: true,
							errorMessage: '地址不能为空'
						}]
					},
				},
				customer_addr_id: -1,
				// 基础表单数据
				addressData: {
					username: '',
					phone: '',
					fullAddress: '',
					address: '',
					is_default: 1
				},
				// 单选数据源
				is_defaultList: [{
					text: '默认地址',
					value: 0
				}, {
					text: '否',
					value: 1
				}],
				province:"",
				city:"",
				district:"",
				addressValue: '选择地址',
				customer: getApp().globalData.customer,
			}
		},
		onLoad(option){
			var myApp = this;
			if(option.id){
				console.info(option.id);
				myApp.customer_addr_id = option.id
				myApp.loadAddress(option.id);
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
		onReady() {
			// 设置自定义表单校验规则，必须在节点渲染完毕后执行
			this.$refs.customForm.setRules(this.customRules)
		},
		methods: {
			loadAddress(id){
				var myApp = this;
				http('address/get/id', {
					'customer_addr_id':id
				}, {
					hideLoading: false, // 默认 false
					hideMsg: true, // 默认 false
					method: 'POST' // 默认 POST
				}).then(res => {
					let data = res.data;
					myApp.addressData.username = data.username
					myApp.addressData.phone = data.phone
					myApp.province =  data.province 
					myApp.city = data.city;
					myApp.district =data.district ;
					myApp.addressData.fullAddress = data.province + data.city + data.district
					myApp.addressData.address = data.address
					myApp.addressData.is_default = data.is_default
				}).catch(err => {
					console.error(err)
				})
			},
			changeAddress(data) {
				var myApp = this;
				// console.log(data.data)
				myApp.province =data.data[0];
				myApp.city =data.data[1];
				myApp.district =data.data[2];
				myApp.addressValue = data.data.join('')
				myApp.addressData.fullAddress = myApp.addressValue
			},
			addAddressToCloud(obj){
				var myApp = this;
				obj.province = myApp.province;
				obj.city = myApp.city;
				obj.customer_id = myApp.customer.id;
				obj.district = myApp.district;
				http('address/add', {
					'addressObj':obj
				}, {
					hideLoading: false, // 默认 false
					hideMsg: true, // 默认 false
					method: 'POST' // 默认 POST
				}).then(res => {
					myApp.back();
				}).catch(err => {
					console.error(err)
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
			updateAddressToCloud(obj){
				var myApp = this;
				obj.province = myApp.province;
				obj.city = myApp.city;
				obj.customer_id = myApp.customer.id;
				obj.district = myApp.district;
				obj.customer_addr_id = myApp.customer_addr_id;
				http('address/update', {
					'addressObj':obj
				}, {
					hideLoading: false, // 默认 false
					hideMsg: true, // 默认 false
					method: 'POST' // 默认 POST
				}).then(res => {
					myApp.back();
				}).catch(err => {
					console.error(err)
				})
			},
			saveorupadteAddress(){
				var myApp = this;
				myApp.$refs.customForm.validate().then(res => {
					uni.showToast({
						title: `校验通过`
					})
					if(myApp.customer_addr_id != -1){
						myApp.updateAddressToCloud(res);
					}else{
						myApp.addAddressToCloud(res);
					}
				}).catch(err => {
					console.log('err', err);
				})
			},
			// 跳转到页面
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
.addressForm {
	padding: 15px;
	background-color: #fff;
}
view .uni-forms-item__content{
	margin: auto;
}
view .uni-forms-item__content[data-v-61dfc0d0]{
	margin: auto;
}
</style>
