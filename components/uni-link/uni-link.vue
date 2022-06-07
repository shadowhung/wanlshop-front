<template>
	<text class="uni-link" :class="{'uni-link--withline':showUnderLine===true||showUnderLine==='true'}" :style="{color,fontSize:fontSize+'px'}" @tap="openURL">{{text}}</text>
</template>

<script>
	/**
	 * Link 外部網頁超鏈接組件
	 * @description uni-link是一個外部網頁超鏈接組件，在小程序内複製url，在app内打開外部瀏覽器，在h5端打開新網頁
	 * @property {String} href 点击後打開的外部網頁url
	 * @property {String} text 顯示的文字
	 * @property {Boolean} showUnderLine 是否顯示下划线
	 * @property {String} copyTips 在小程序端複製鏈接时顯示的提示語
	 * @property {String} color 鏈接文字颜色
	 * @property {String} fontSize 鏈接文字大小
	 * @example * <uni-link href="https://ext.dcloud.net.cn" text="https://ext.dcloud.net.cn"></uni-link>
	 */
	export default {
		name: 'uniLink',
		props: {
			href: {
				type: String,
				default: ''
			},
			text: {
				type: String,
				default: ''
			},
			showUnderLine: {
				type: [Boolean, String],
				default: true
			},
			copyTips: {
				type: String,
				default: '已自動複製網址，請在手机瀏覽器里粘贴该網址'
			},
			color: {
				type: String,
				default: '#999999'
			},
			fontSize: {
				type: [Number, String],
				default: 14
			}
		},
		methods: {
			openURL() {
				// #ifdef APP-PLUS
				plus.runtime.openURL(this.href)
				// #endif
				// #ifdef H5
				window.open(this.href)
				// #endif
				// #ifdef MP
				uni.setClipboardData({
					data: this.href
				});
				uni.showModal({
					content: this.copyTips,
					showCancel: false
				});
				// #endif
			}
		}
	}
</script>

<style scoped>
	.uni-link--withline {
		text-decoration: underline;
	}
</style>