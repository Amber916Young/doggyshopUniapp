<template>
	<view class="home">
		<uni-icons  class="back-btn  " size="25" type="arrowleft"  
		 color="#000" @click="navBack"/>
		<view class="bcgImg">
		  <image class="bcgImg-image"  mode="aspectFill" src="https://s1.ax1x.com/2022/12/12/z4Gj1O.jpg"></image>
		</view>
		<view class="searchBar">
			<uni-search-bar @confirm="search" bgColor="#fff" placeholder="请输入您要搜索商品的关键词" v-model="searchValue" @input="input" ></uni-search-bar>
		</view>
		<scroll-view :scroll-y="true" style="height: 100%;">
			
			<view class="card-good ">
				<view class="card-good-1">
					<image src="https://www.prada.com/content/dam/pradabkg_products/1/1BA/1BA274/NZVF0480/1BA274_NZV_F0480_V_EOO_MDL.jpg/_jcr_content/renditions/cq5dam.web.hebebed.800.1000.webp"></image>
				</view>
				<view class="card-good-1">
					<image src="https://www.prada.com/content/dam/pradabkg_products/1/1BA/1BA274/NZVF0002/1BA274_NZV_F0002_V_EOO_MDL.jpg/_jcr_content/renditions/cq5dam.web.hebebed.800.1000.webp"></image>
				</view>
				<view class="card-good-1">
					<image src="https://www.prada.com/content/dam/pradabkg_products/1/1BA/1BA863/NZVF0009/1BA863_NZV_F0009_V_OOO_MDL.jpg/_jcr_content/renditions/cq5dam.web.hebebed.800.1000.webp"></image>
				</view>
				<view class="card-good-1">
					<image src="https://www.prada.com/content/dam/pradabkg_products/1/1BA/1BA863/MNZVF0934/1BA863_MNZV_F0934_V_EOO_MDL.jpg/_jcr_content/renditions/cq5dam.web.hebebed.800.1000.webp"></image>
				</view>
				<view class="card-good-1">
					<image src="https://www.prada.com/content/dam/pradabkg_products/1/1BA/1BA863/NZVF0076/1BA863_NZV_F0076_V_OOO_MDL.jpg/_jcr_content/renditions/cq5dam.web.hebebed.800.1000.webp"></image>
				</view>
				<view class="card-good-1">
					<image src="https://www.prada.com/content/dam/pradabkg_products/1/1BA/1BA863/NZVF0002/1BA863_NZV_F0002_V_EOO_MDL.jpg/_jcr_content/renditions/cq5dam.web.hebebed.800.1000.webp"></image>
				</view>
			</view>
			
			<view class="margin-b-100"></view>
		
			<zero-back-top :scrollTop='scrollTop' bottom="200" iconType="arrow" color="#FFC300"></zero-back-top>
		</scroll-view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				customer: getApp().globalData.customer,
				scrollTop:0,
				searchValue: ''

			}
		},
		onPageScroll(e) {
			var myApp = this
			myApp.scrollTop = e.scrollTop;
		},
		onLoad() {
			
		},
		methods: {
			search(res) {
				
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
	@import '../../user/index/index.css';
	@import '../../order/index/order.css';
	page{
		   background-color: #fff;
	}
	.home{
		   background-color: #fff;
	}
	
	.card-order{
		   justify-content: space-around;
	}
	.card-good{
		display:flex;
		justify-content: space-evenly;
		margin: auto;
		/* background: white; */
		margin: 0 10px;
		flex-wrap: wrap;
	}
	.card-good image{
		height: 150px;
		width: 150px;
	}
	.card-good-1{
		margin: 2px;
		/* background: white; */
	}
	.searchBar{
		position: absolute;
		top: 15%;
		width: 100%;
	}
</style>
