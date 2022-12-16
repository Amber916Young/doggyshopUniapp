<template>
	<view  class="container">
		<uni-card  spacing="0" :is-shadow="false" margin="5" padding="0" :border="false" >
			<uni-list  :border="false">
				<uni-list-item  :show-extra-icon="true" 
				 :extra-icon="extraIcon" 
				title="查询物流信息" 
				clickable @click.stop="checkDelivery(order_info.order_sn)"
				:note="order_info.order_sn +  order_info.shipping_comp_name" 
				showArrow rightText="查看" />
			</uni-list>
				
				<uni-collapse ref="collapse"  v-model="value" >
					<uni-collapse-item :title="'订单号：'+order_info.order_sn"  >
						<view class="main"  v-for="(good, index2) in  orderDetailList" >
							<view class="left"> 
								<image :src="good.goodMap.img_url" ></image>
							</view>
							<view class="right">
								<view class="r-title">{{good.goodMap.title}}</view>
								<view class="r-card">
									<view class="r-desc">{{item.specification}}</view>
									<view class="r-price">
										<view class="r-r-con">
											<fast-price  :text="good.average_cost"  :miniDecimal="true"></fast-price>
											<view class="space1"></view>
											<fast-price :size="30"  :text="good.good_price" :strikeout="true" :miniDecimal="true"></fast-price>
										</view>
										<view class="r-r-con">
											<text class="font-12">x</text>{{good.good_amount}}
										</view>
										<view class=" flex-card ">
											<view class="text_bold">备注</view>
											<view class="">{{order_info.memo}}</view>					
										</view>
									</view>
								</view>
								
							</view>
						</view>
					</uni-collapse-item>
				</uni-collapse>
				
				<!-- // 1现金，2网银，3支付宝，4微信 -->
	
			<view class=" flex-card padding-5">
				<view class="text_bold" style="width: 100px;">收货信息</view>
				<view class=""> 
				{{order_info.username}},{{order_info.phone}}, 
				{{order_info.province}} {{order_info.city}} 
				{{order_info.district}} {{order_info.address}}
				</view>
			</view>
			<view class="divder"></view>
			<view class=" flex-card padding-5">
				<view class="text_bold">支付方式</view>
				<view class=""> 微信</view>
			</view>
			
			<view class=" flex-card padding-5">
				<view class="text_bold">支付时间</view>
				<view class=""> {{order_info.pay_time}}</view>
			</view>
			<view class=" flex-card padding-5">
				<view class="text_bold">运费金额</view>
				<view class=""> ¥ {{order_info.shipping_money}}</view>
			</view>
			<view class=" flex-card padding-5">
				<view class="text_bold">优惠金额</view>
				<view class=""> ¥ {{order_info.district_money}}</view>
			</view>
			<view class=" flex-card padding-5">
				<view class="text_bold">订单金额</view>
				<view class=""> ¥ {{order_info.order_money}}</view>
			</view>
			<view class=" flex-card padding-5">
				<view class="text_bold">实际付款</view>
				<view class=""> ¥ {{order_info.payment_money}}</view>
			</view>
			<view class="divder"></view>
			<view class=" flex-card padding-5">
				<view class="text_bold">快递单号</view>
				<view class=""> {{order_info.shipping_sn}}</view>
			</view>
			
			<view class=" flex-card padding-5">
				<view class="text_bold">快递公司</view>
				<view class=""> {{order_info.shipping_comp_name}}</view>
			</view>
			<view class=" flex-card padding-5">
				<view class="text_bold">获得积分</view>
				<view class=""> {{order_info.order_point}}</view>
			</view>
		</uni-card>
		<view class="margin-b-100"></view>
	</view>
</template>

<script>
	import http from '@/utils/request.js'
	export default {
		data() {
			return {
				value:['0'],
				extraIcon: {
					color: '#FF5733',
					size: '22',
					type: 'location'
				},
				// active: 1,
				order_info:{},
				orderDetailList:[],
			
				order_id:-1,
				customer: getApp().globalData.customer,
			}
		},
		onLoad(option) {
			var myApp = this;
			// myApp.loadOrderDetail(4);
			if(option.id){
				myApp.order_id = option.id;
				myApp.loadOrderDetail(myApp.order_id);	
			}
			return;
		
		},
		methods: {
			checkDelivery(){
				var num='YT1661209880366'  //物流单号
				var appName='橘作坊' //调用插件的小程序的名称	
				uni.navigateTo({
				  url: "plugin://kdPlugin/index?num="+num+"&appName="+appName,
				})
			},
			loadOrderDetail(id){
				var myApp = this;
				var flag = "current";
				http('order/get/orderbyId', {
					'order_id': id,
					'customer_id':myApp.customer.id,
				}, {
					hideLoading: false, // 默认 false
					hideMsg: true, // 默认 false
				}).then(res => {
					myApp.order_info = res.data.orderMaster;
					myApp.orderDetailList = res.data.orderDetailList;
					//0未发货 1 已发货 2已完成
					let status = myApp.order_info.order_status;
					
					
				}).catch(err => {
					console.error(err)
				})
			},
			
		}
	}
</script>

<style>
.main .left{
		width: 30%;
	    margin: auto 20rpx auto 0;
	}
	.main .left image{
		width: 100%;
		height: 100px;
		border-radius: 5px;
	}
	.main .right{
		width: 70%;
	}
	.main .right .r-title{
		font-size: 18px;
		font-weight: 600;
	}
	.main .right.r-card{
		display: flex;
	}
	.main .right .r-card .r-r-con{
		display: flex;
		justify-content: flex-end;
	}
</style>
