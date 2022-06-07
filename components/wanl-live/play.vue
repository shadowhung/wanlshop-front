<!-- 
	版本聲明：
	* 由於 WanlLive、WanlChat、以下代碼開發难度较大，已將相關代碼獨立申請著作權，受法律保護！！！
	* 無論妳購买任何版本，均不允許複製到第三方直接、間接使用，且也不能以學習為目的參考和借鑒！！
	* 妳僅有在 WanlShop 中使用、二次開發權利，否则我们會追究法律责任 
	* SHOP @www.shop.com
-->
<!--  -->
<template>
	<view style="flex: 1;">
		<!-- #ifndef H5 -->
		<!-- 基本所有小程序都支持m3u8，但m3u8延迟较高，App使用rtmp -->
		<video
			:style="{ height: screenHeight + 'px',width: screenWidth + 'px'}"
			:src="source"
			:controls="false"
			object-fit="fill"
			loop
			autoplay
		></video>
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<!-- 因Flash业務调整，Flash播放已停止更新，很遗憾不能使用rtmp播放，可以选择m3u8、flv -->
		<wanl-player
			:autoplay="true"
			:source="source"
			:height="screenHeight + 'px'"
			:videoHeight="screenHeight + 'px'"
			:width="screenWidth + 'px'"
			videoWidth="auto"
			:isLive="true"
		></wanl-player>
		<!-- #endif -->
	</view>
</template>

<script>
export default {
	name: "wanlLivePlay",
	props: {
		screenHeight: {
			default: 0
		},
		screenWidth: {
			default: 0
		},
		source: {
			type: String,
			default: ''
		}
	}
};
</script>

<style></style>
