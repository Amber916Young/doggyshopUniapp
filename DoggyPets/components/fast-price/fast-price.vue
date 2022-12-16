<template>
  <view class="fast-price" :style="{color:color,fontSize:size+'rpx',fontWeight:bold ? 'bold' : 400, textDecoration:strikeout ? 'line-through' : 'none'}">
		<text class="sign" :style="{fontSize:!fit ? (size-signSize)+'rpx' : size+'rpx',marginRight:'5rpx'}">{{sign}}</text>
		<text class="text">
			<text class="integer">{{text.split('.')[0]}}</text>
			<text class="decimal" v-if="text.split('.')[1]" :style="{fontSize:miniDecimal ? (size-12)+'rpx' : size+'rpx'}">.{{text.split('.')[1]}}</text>
		</text>
  </view>
</template>

<script>
  export default {
    name: 'fast-price',
    components:{},
    props:{
			/** 符号 **/
			sign:{
				default:"¥",
				type:String
			},
			/** 设置符号字号和文字字号一致 **/
			fit:Boolean,
			/** 设置符号的缩减字号 **/
			signSize:{
				type:Number,
				default:9
			},
			/** 设置小数点后面数字小字号 **/
			miniDecimal:Boolean,
			/** 文字 **/
			text:{
				default:"0.00",
				type:String
			},
			/** 颜色 **/
			color:{
				default:"#ff5733",
				type:String
			},
			/** 字号 **/
			size:{
				type:Number,
				default:32
			},
			/** 是否需要加粗处理 **/
			bold:Boolean,
			/** 是否需要删除线处理 **/
			strikeout:Boolean
    },
    data () {
      return {

      }
    },
    methods:{

    },
    computed:{

    },
    filters:{
    
    },
    watch:{
    
    },
    created(){
    
    },
    mounted(){
    
    },
    activated(){
    
    }
  }
</script>

<style scoped lang="scss">
  .fast-price{
		display: inline-block;
  }
</style>
