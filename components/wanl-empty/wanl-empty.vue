<template>
	<view class="empty-content">
		<view class="wanl-gray text-center">
			<image class="animation-scale-down" :src="src ? $wanlshop.appstc('/default/' + src + '.png') : $wanlshop.appstc('/default/default3x.png')"></image>
			<view class="text-30">{{ text }}</view>
		</view>
	</view>
</template>

<script>
/**
 * WanlEmpty 缺省頁
 * @description 缺省頁組件 SHOP https://www.shop.com（除万联官方内嵌系統，未经授權严禁使用）
 * @著作權：WanlShop 登記號：2020SR0255711 版本：V1.0.0
 *
 * @property {String} src 圖片地址名
 * @property {String} text 提示文字
 * @example <wanl-empty src="" text=""/>
 */
export default {
	name: 'WanlEmpty',
	props: {
		src: {
			type: String,
			default: ''
		},
		text: {
			type: String,
			default: '沒有找到任何內容'
		}
	}
};
</script>

<style>
	.empty-content {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		padding: 300rpx 130rpx;
	}
	.empty-content image{
		width: 320rpx;
		height: 320rpx;
	}
</style>
