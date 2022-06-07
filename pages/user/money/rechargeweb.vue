
<template>
	<!-- 導航條 <web-view :webview-styles="webviewStyles" :src="weburl"></web-view>-->
    <div style="overflow: auto;-webkit-overflow-scrolling:touch;width:100%;height:100%;">
	<iframe :src="weburl" frameborder="0" height="100%" scrolling='no' style="width: 1px; min-width: 100%; *width: 100%;"></iframe>
	</div>
</template>

<script>
	import { mapState } from 'vuex';
	export default {
		data() {
			return {
				wanlsys: this.$wanlshop.wanlsys(),
				weburl:'',
				 webviewStyles: {
					progress: {
						color: '#FF3333'
					}
				},
				shopdata:{verify: 0},
				verify_text: ['今すぐ入居','レビュー中','レビュー中','落ち着いた 見る','未承認 変更する']
			}
		},
		onNavigationBarButtonTap(e) {
			uni.reLaunch({
			  url: '/pages/twshop/index'
			})
			//this.$wanlshop.auth(`/pages/twshop/index`)
		},
		computed: {
			...mapState(['user'])
		},
		onLoad() {
			let that = this;
			uni.getStorage({
			    key: 'pay_key',
			    success: function (res) {
					//that.password = res.data;
					console.log(res.data);
					//that.weburl = res.data;
			    }
			})  
		},
		methods: {
			async loadData() {
				this.$api.get({
					url: '/wanlshop/shop/apply',
					success: res => {
						if (res) {
							this.shopdata = res;	
						}
					}
				});
			},
			onApply(){
				this.$wanlshop.auth(`/pages/shop/apply/apply?data=${JSON.stringify(this.shopdata)}`)
			}
		}
	}
</script>

<style>
	*{padding:0px;margin:0px;}
	html,body,iframe{width:100%;height:100%;}
	scrollbar {visibility:collapse !important;}
	body, uni-page-body {
	    background: #F7F7F7;
	    font-size: 15px;
	    color: #222222;
	    height: 100%;
	}
	.cu-bar{
		justify-content: center;
	}
	.wanlian.cu-bar.tabbar {
		background-color: #ffffff;
	}
	.wanlian.cu-bar.tabbar .cu-btn {
		width: calc(100% - 50rpx);
	}
	.wanlian.cu-bar.tabbar .cu-btn.lg {
		font-size: 32rpx;
		height: 86rpx;
	}
	.cu-form-group .title, .cu-form-group uni-input{
		font-size: 28rpx;
	}
	.wanl-apply .flow{
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}
	.wanl-apply .flow .item{
		width: 46%;
		height: 590rpx;
		position: relative;
	}
	
	.wanl-apply .flow .item:last-child{
		height: 400rpx;
	}
	
	.wanl-apply .flow .item .project {
		line-height: 2.2;
	}
	
	.wanl-apply .flow .item .point{
		display: flex;
	}
	.wanl-apply .flow .item .point .line{
		width: 120rpx;
		height: 4rpx;
		background-color: #ccc;
	}
	.wanl-apply .flow .item .point .arrow{
		border: 14rpx solid transparent;
		border-left: 30rpx solid #ccc;
	}
	
	/* 指向右 */
	.wanl-apply .flow .item .point.right{
		position: absolute;
		align-items: center;
		right: -110rpx;
		top: 76rpx;
	}
	/* 指向左 */
	.wanl-apply .flow .item .point.left{
		position: absolute;
		align-items: center;
		right: -96rpx;
		top: 76rpx;
	}
	.wanl-apply .flow .item .point.left .arrow{
		border: 14rpx solid transparent;
		border-right: 30rpx solid #ccc;
	}
	/* 指向下 */
	.wanl-apply .flow .item .point.bottom{
		position: absolute;
		justify-content: center;
		bottom: 0;
		right: 0;
		left: 0;
	}
	.wanl-apply .flow .item .point.bottom .line{
		width: 4rpx;
		height: 120rpx;
		margin-bottom: 45rpx;
	}
	.wanl-apply .flow .item .point.bottom .arrow{
		position: absolute;
		bottom: 0;
		border: 14rpx solid transparent;
		border-top: 30rpx solid #ccc;
	}
	.wanl-apply .details {
		background-color: #f1efec;
		margin: 50rpx 0;
	}
	.wanl-apply .details .details-item {
		display: flex;
		border-bottom: 2rpx solid #fff;
	}
	.wanl-apply .details .details-item .title{
		background-color: #e6e6e6;
		width: 40%;
		padding: 25rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.wanl-apply .details .details-item .center{
		width: 100%;
		color: #474747;
	}
	.wanl-apply .details .details-item .center>view{
		border-bottom: 2rpx solid #fff;
		padding: 25rpx;
		line-height: 1.5;
	}
	.wanl-apply .details .details-item .center>view:last-child{
		border: 0;
	}
	
</style>
