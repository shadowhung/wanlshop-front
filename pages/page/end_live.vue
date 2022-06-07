<!-- 
	版本聲明：
	* 由於 WanlLive、WanlChat、以下代碼開發难度较大，已將相關代碼獨立申請著作權，受法律保護！！！
	* 無論妳購买任何版本，均不允許複製到第三方直接、間接使用，且也不能以學習為目的參考借鑒
	* 妳僅有在 WanlShop 中使用、二次開發權利，否则我们會追究法律责任 
	* SHOP @www.shop.com
-->
<template>
	<view>
		<view class="wanl-image">
			<image
				class="wanl-image-image"
				:lazy-load="true" 
				:fade-show="false" 
				:style="{ height: screenHeight + 'px', width: screenWidth + 'px'}"
				:src="$wanlshop.oss(live.image, 0, 50, 1, 'transparent', 'png')"
				mode="aspectFill" 
			></image>
		</view>
		<view class="wanl-image-bg"> </view>
		<view class="wanl-end-main" :style="{top: statusBarHeight + 80 + 'px', bottom: statusFootHeight + 50 + 'px'}">
			<view class="wanl-end-main-info text-white">
				<view class="text-center">
					<view class="text-xxl margin-bottom-xs">
						生放送終了しました
					</view>
					<view class="text-min wanl-gray-light">
						ライブ放送は後で生成されます
					</view>
				</view>
				<view class="text-center">
					<image class="wanl-end-main-info-image" :src="$wanlshop.oss(live.shop.avatar, 100, 100)"></image>
					<view class="text-xl">
						{{live.shop.shopname}}
					</view>
				</view>
				<view class="flex justify-around statistics">
					<view class="text-center">
						<view class="text-xl">
							{{live.like}}
						</view>
						<text class="text-min">お気に入り</text>
					</view>
					<view class="text-center solid-left solid-right">
						<view class="text-xl">
							{{live.views}}
						</view>
						<text class="text-min">ビュー</text>
					</view>
					<view class="text-center">
						<view class="text-xl">
							{{live.goodsnum}}
						</view>
						<text class="text-min">ライブグッズ</text>
					</view>
				</view>
			</view>
			
			<view class="wanl-end-main-btn" @tap="$wanlshop.on('/pages/find/find')">
				<button class="cu-btn block round line-white lg">発見に戻る</button>
			</view>
		</view>
		
	</view>
</template>

<script>
var system = uni.getSystemInfoSync();
export default {
	data() {
		return {
			statusBarHeight: system.safeAreaInsets.top,
			statusFootHeight: system.safeAreaInsets.bottom,
			screenHeight: system.screenHeight,
			screenWidth: system.screenWidth,
			live: {}
		};
	},
	onLoad(option) {
		this.loadData(option.id);
	},
	methods: {
		async loadData(id) {
			this.$api.get({
				url: '/wanlshop/live/endLive',
				data: {
					id: id
				},
				success: res => {
					this.live = res;
				}
			});
		}
	}
};
</script>

<style>
	.wanl-image {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background-color: #000000;
		z-index: 1;
	}
	.wanl-image-bg{
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background-color: rgba(0,0,0,.3);
		z-index: 2;
	}
	.wanl-image-image{
		filter: blur(20px);
	}
	.wanl-end-main{
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		z-index: 3;
	}
	.wanl-end-main-info{
		position: absolute;
		left: 25rpx;
		right: 25rpx;
		top: 0;
	}
	.wanl-end-main-btn{
		position: absolute;
		left: 10%;
		right: 10%;
		bottom: 0;
	}
	.wanl-end-main-info-image{
		width: 200rpx;
		height: 200rpx;
		border-radius: 999px;
		margin-top: 80rpx;
		margin-bottom: 20rpx;
	}
	.statistics{
		color: rgba(255,255,255,.8);
		margin-top: 40rpx;
	}
	.statistics>view{
		flex: 1;
	}
</style>