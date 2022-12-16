<template>
	<view class="home">
		<uni-icons  class="back-btn  " size="25" type="arrowleft"
		 color="#000" @click="navBack"/>
		<view class="bcgImg">
		  <image class="bcgImg-image"  mode="aspectFill" :src="currentGood.img_url"></image>
		</view>
		<uni-card  spacing="0" :is-shadow="false" margin="5" padding="0" :border="false" >
			<view class="font-18 text_bold color_black " > {{currentGood.title}}</view>
			<uni-forms ref="baseForm" :modelValue="commentObj" label-position="top">
					<uni-rate :max="5" allow-half   @change="onChange" name="rate" :value="commentObj.rate" />
					<uni-easyinput :styles="styles"  type="textarea"   name="content" v-model="commentObj.content" placeholder="请输入内容"></uni-easyinput>
			</uni-forms>
			<uni-file-picker @delete="deleteImg"	 fileMediatype="image"  ref="files" @select="onselect" :sizeType="sizeType"  :auto-upload="false" limit="3" title="最多选择3张图片"></uni-file-picker>
		</uni-card>
		<helang-compress ref="helangCompress"></helang-compress>
		<view class="topay "   @click="submitComment">确认</view>
	</view>
</template>

<script>
	import http from '@/utils/request.js'
    import { pathToBase64, base64ToPath } from 'image-tools'
	import helangCompress from '@/components/helang-compress/helang-compress';
	import {HashMap} from "@/utils/utils.js"
	export default {
		 components: {
				helangCompress
			},
		data() {
			return {
				sizeType:['compressed'], //设置图片压缩
				styles: {
					color: '#000000',
					borderColor: '#FFC300'
				},
				customer: getApp().globalData.customer,
				currentGood:{},
				commentObj:{
					rate:5,
					content:""
				},
				fileMap: new HashMap(),
				order_detail_id: -1,
				is_comment:0
			}
		},
		onLoad(option) {
			var myApp = this
			var id = option.id
			myApp.order_detail_id = parseInt(option.order_detail_id)
			myApp.is_comment = parseInt(option.is_comment)
			
			myApp.loadGoodDetail(id)
		},
		methods: {
			deleteImg(e){
				var myApp = this
				let file = e.tempFile
				let uuid = file.uuid
				myApp.fileMap.remove(uuid)
			},
			pathToBase64Tool(path,uuid){
				var myApp = this
				var json = {}
				json.uuid=uuid
				pathToBase64(path)
				  .then(base64 => {
					json.base64=base64
					myApp.fileMap.put(uuid,base64)
					// console.log(base64)
				  })
				  .catch(error => {
					console.error(error)
				  })
			},
			
			 toUpload(file){
			// 压缩图片
				var myApp = this
				let { size,path,uuid } = file
				console.info(path)
				//大于1M进行压缩，
				if(size< (1024*1024)){
					myApp.pathToBase64Tool(path,uuid)
					return
				}
				myApp.$refs.helangCompress.compress({
				    src:file.path,
				    maxSize:800,
				    fileType:'jpg',
				    quality:0.5,
				    minSize:640 //最小压缩尺寸，图片尺寸小于该时值不压缩，非H5平台有效。若需要忽略该设置，可设置为一个极小的值，比如负数。
				}).then((res)=>{
					myApp.pathToBase64Tool(res,uuid)
				    // 压缩成功回调
				}).catch((err)=>{
					console.info(err)
				    // 压缩失败回调
				})
			},
			onselect(e){
				var myApp = this
				// console.info(e.tempFiles[0].file)
				if(e.tempFilePaths&&e.tempFiles){
					myApp.file = e.tempFiles[0].file
					myApp.toUpload(myApp.file)
				}
			},
			loadGoodDetail(id){
				var myApp = this;
				http('goods/detail/single',{
					'id':id
				}, {
					hideLoading: false, // 默认 false
					hideMsg: true,      // 默认 false
					method: 'POST'       // 默认 POST
				}).then(res => {
					myApp.currentGood = res.data
				}).catch(err => {
					console.error(err)
				})
			},
			onChange(e){
				var myApp = this;
				myApp.commentObj.rate = e.value;
			},
			submitComment(){
				var myApp = this;
				var content = myApp.commentObj.content
				var rate = myApp.commentObj.rate
				var imgMap = myApp.fileMap.values()
				http('comment/add',{
					'customer_id':myApp.customer.id,
					'order_detail_id':myApp.order_detail_id,
					'good_id':myApp.currentGood.id,
					'rate':rate,
					'content':content,
					'imgMap':imgMap
				}, {
					hideLoading: false, // 默认 false
					hideMsg: true,      // 默认 false
					method: 'POST'       // 默认 POST
				}).then(res => {
					myApp.navBack();
				}).catch(err => {
					console.error(err)
				})
			},
			navBack() {
				var myApp = this
				let pages = getCurrentPages(); // 获取页面栈
				let nowPage = pages[pages.length - 1]; //当前页页面实例
				let prevPage = pages[pages.length - 2]; //上一页页面实例
				prevPage.$vm.current = 1; //修改上一页data里面 searchVal 的值
				if (pages.length > 1) {
				  uni.navigateBack({
					delta: 1,
				  })
				} else {
				  uni.switchTab({
					url: '/pages/index/index',
				  })
				}
				return true
			},
		}
	}
</script>

<style>
	page{
		background-color: white;
	}
	.cover-content{
		height: 80rpx;
		font-size: 20px;
	}
image{
	width: 100%;
	height: 200px;
}
	.topay {
		height: 80rpx;
		margin-left: 20rpx;
		margin-right: 20rpx;
		background: #000;
		color: #fff;
		border-radius: 0;
		display: flex;
		font-size: 30rpx;
		align-items: center;
		justify-content: center;
	}
</style>
