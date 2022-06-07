<script>
	import Vue from 'vue';
	export default {
		onLaunch() {
			// 检测客戶端更新
			this.$store.dispatch('update/update');
			// 僅首次打開一次性加載數據
			this.$store.dispatch('common/init');
			// 同步購物車 本地 & 網络
			this.$store.dispatch('cart/get');
			// 同步 動态數據
			this.$store.dispatch('statistics/get');
		},
		onShow() {
			// 啟動或重啟即时通讯
			this.$store.dispatch('chat/start');
		},
		onHide() {
			// 断開即时通讯
			this.$store.dispatch('chat/close');
		}
	};
</script>

<style>
	/* #ifndef APP-NVUE */
	@import 'static/style/colorui.css';
	@import 'static/style/wanlshop.css';
	@import 'static/style/iconfont.css';
	/* #endif */
</style>
