<template>
	<view class="home">
		<uni-icons  class="back-btn  " size="25" type="arrowleft"
		 color="#000" @click="navBack"/>
		<view class="bcgImg">
		  <image class="bcgImg-image"  mode="aspectFill" src="https://s1.ax1x.com/2022/12/12/z4Gj1O.jpg"></image>
		</view>
		<view class="  card-list" :class="isClick ? 'active' : ''" >
		    <view class="card card-1 box-shadow">
				<view class="flex-card">
					<view class="text_bold font-16">意见箱</view>
				</view>
				<view class="card-order margin-t-15">
					<view class="order-div"  @click="toClick(0)">
						<uni-icons custom-prefix="iconfont" type="icon-opinion" size="30"></uni-icons>
						<view :class="current===0 ? 'color-2' : ''">发表意见</view>
					</view>
					<view class="order-div"  @click="toClick(1)">
						<uni-icons custom-prefix="iconfont" type="icon-complete" size="30"></uni-icons>
						<view :class="current===1 ? 'color-2' : ''">已送达</view>
					</view>
					<view class="order-div"  @click="toClick(2)">
						<uni-icons custom-prefix="iconfont" type="icon-kuaijiehuifuguanli" size="30"></uni-icons>
						<view :class="current===2 ? 'color-2' : ''">已回复</view>
					</view>
				</view>
			
			
			</view>
			<scroll-view :scroll-y="true" >
				<block v-if="current===0">
					<uni-card  spacing="0" :is-shadow="false" margin="5" padding="0" :border="false"
						@click.native="toClick(0)"   >
						<uni-easyinput :styles="styles"  type="textarea" v-model="value"  @input="input" placeholder="您有什么建议想对我们说吗？不论是小程序设计还是购物体验,我们非常高兴能倾听您的宝贵意见"></uni-easyinput>
						<view class="topay " @click="submit" >确认</view>
					</uni-card>
				</block>
				
				<block v-if="current===1">
					<uni-card  spacing="0" :is-shadow="false" margin="5" padding="0" :border="false"
					v-for="(item, index) in suggestList" :key="index"  
					:title="'编号：'+item.suggest_id"
					:sub-title="item.create_time"  extra="暂未回复">
						<view class="content">{{item.content}}</view>
					</uni-card>
				</block>
				
				<block v-if="current===2">
					<uni-card  spacing="0" :is-shadow="false" margin="5" padding="0" :border="false"
					v-for="(item, index) in suggestList" :key="index"  
					:title="'编号：'+item.suggest_id"
					:sub-title="item.create_time"  extra="已回复">
						<view class="content">{{item.content}}</view>
						<view class="replycontent">
							<view>{{item.reply_content}}</view>
							<view class="replytime flex-end">{{item.modified_time}}</view>
						</view>
					</uni-card>
				</block>
				
				<zero-back-top :scrollTop='scrollTop' bottom="200" iconType="arrow" color="#FFC300"></zero-back-top>
				<block v-if="current !== 0">
					<uni-load-more @clickLoadMore="clickLoadMore" :status="status" iconType="circle"   :content-text="contentText" />
				</block>
			
				
			</scroll-view>
		</view>

	</view>
</template>

<script>
	import http from '@/utils/request.js'
	export default {
		data() {
			return {
				customer: getApp().globalData.customer,
				value:"",
				scrollTop:1,
				isClick:false,
				status: 'more',
				contentText: {
					contentdown: '查看更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
				pageNo:1,
				limit:15,
				current:0,
				styles: {
					color: '#000000',
					borderColor: '#FFC300'
				},
				suggestList:[]
			}
		},
		onPageScroll(e) {
			var myApp = this
			myApp.scrollTop = e.scrollTop;
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
			toClick(type){
				var myApp = this
				myApp.isClick = true
				var pageNo = 1;
				myApp.status = "loading"
				myApp.pageNo = pageNo
				myApp.suggestList = []
				myApp.current = type
				if(type=== 0 ) return
				myApp.loadPage(pageNo,myApp.limit,myApp.current);
				
			},
			input(e) {
				var myApp = this
				myApp.value = e
			},
			submit(){
				var myApp = this
				http("comment/suggestion/add", {
					'customer_id': myApp.customer.id,
					'content': myApp.value
				}, {
					hideLoading: false, // 默认 false
					hideMsg: true, // 默认 false
				}).then(res => {
					myApp.showToast(res.msg)
					myApp.value = ""
					setTimeout(function() {
						myApp.toClick(1)
					},1000);
				}).catch(err => {
					console.error(err)
				})
			},
			clickLoadMore(e){
				var myApp = this;
				if(e.detail.status == "more"){
					var pageNo = parseInt(myApp.pageNo)+1;
					myApp.status = "loading";
					myApp.pageNo = pageNo;
					myApp.loadPage(pageNo,myApp.limit,myApp.current);
				}else if(e.detail.status == "loading"){
					myApp.showToast("正在加载，请等待");
				}else if(e.detail.status == "noMore"){
					myApp.showToast("暂无更新");
				}
			},
			loadPage(pageNo,limit,type){
				var myApp = this
				http('comment/getAll/suggestion', {
					'currNo': pageNo,
					'customer_id': myApp.customer.id,
					'limit': limit,
					'status': type,
				}, {
					hideLoading: false, // 默认 false
					hideMsg: true, // 默认 false
				}).then(res => {
					let len = res.data.length
					if(len == 0 ){
						myApp.status = "noMore"
						return
					}else{
						myApp.status = "more"
					}
					myApp.suggestList = res.data
				}).catch(err => {
					console.error(err)
				})
			},
			
			navBack() {
				var myApp = this
				let pages = getCurrentPages(); // 获取页面栈
				let nowPage = pages[pages.length - 1]; //当前页页面实例
				let prevPage = pages[pages.length - 2]; //上一页页面实例
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
   @import '../index/index.css';
   @import '../../order/index/order.css';
   page{
	   background-color: #fff;
   }
   .home{
	   background-color: #fff;
   }
   .topay{
	   width: auto;
	   margin-top: 50px;
   }
   .card-order{
	   justify-content: space-around;
   }
 
</style>
