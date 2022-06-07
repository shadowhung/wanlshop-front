<template>
	<view class="content">
		<view class="edgeInsetTop"></view>
		<wanl-image-cutter @ok="getCropperImage" @cancel="oncancle" :url="url" :fixed="false" :blob="false" :maxWidth="500" :maxHeight="500" />
		<view class="text-center padding-top-xl" :style="{backgroundImage: 'url('+usermaks+')'}">
			<view @tap="chooseImage" class="cu-avatar avatar" v-if="path" :style="{ backgroundImage: 'url(' + path + ')' }"></view>
			<view @tap="chooseImage" class="cu-avatar avatar" v-else :style="{ backgroundImage: 'url(' + $wanlshop.oss(user.avatar, 100, 100) + ')' }"></view>
			<view class=" text-sm" @tap="chooseImage">クリックしてアバターを変更します</view>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	data() {
		return {
			url: '',
			path: '',
			usermaks: ''
		};
	},
	computed: {
		...mapState(['user'])
	},
	methods: {
		chooseImage() {
			uni.chooseImage({
				count: 1, // 默認9
				sizeType: ['compressed'], // 可以指定是原圖还是压缩圖，默認二者都有
				sourceType: ['album', 'camera'], // 可以指定來源是相冊还是相机，默認二者都有
				success: res => {
					// 設置url的值，顯示控件
					this.url = res.tempFilePaths[0];
				}
			});
			this.usermaks = this.$wanlshop.maks();
		},
		getCropperImage(e) {
			this.path = e.path;
			this.url = '';
			// 上傳圖片
			this.$api.get({
				url: '/wanlshop/common/uploadData',
				success: updata => {
					this.$api.upload({
						url: updata.uploadurl,
						filePath: e.path,
						name: 'file',
						formData: updata.storage == 'local' ? null : updata.multipart,
						success: res => {
							this.$api.post({
								url: '/wanlshop/user/profile', 
								data: {avatar: res.fullurl},
								success: data => {
									this.$store.commit('user/setUserInfo', {avatar: data.avatar});
								}
							});
						}
					});
				}
			});
		},
		oncancle() {
			this.url = '';
		}
	}
};
</script>
<style>
.avatar {
	width: 5rem;
	height: 5rem;
	background-color: #e5e5e5;
	border-radius: 50%;
	margin: 30rpx;
}
</style>
