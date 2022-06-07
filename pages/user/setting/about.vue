<template>
	<view>
		<view class="edgeInsetTop"></view>
		<view class="wanlian">
			<image :src="$wanlshop.oss(iniData.logo)" mode="aspectFill"></image>
			<view class="text-bold text-xxl margin-top-lg">{{iniData.name}}</view>
			<view class="text-lg margin-top-xs wanl-gray">V{{common.version}}_{{common.versionCode}}</view>
		</view>

		<view class="cu-list menu margin-xl">
			<view class="cu-item arrow" @tap="$wanlshop.to('/pages/user/feedback/feedback')">
				<view class="content">
					<text>意見と回答</text>
				</view>
			</view>
			<!-- 版本更新&評分 後續版本更新 -->
			<view class="cu-item arrow">
				<view class="content"  @tap="scoring">
					<text>評価</text>
				</view>
			</view>
			<view class="cu-item arrow" @tap="update">
				<view class="content" >
					<text>新しいバージョンの更新</text>
				</view>
			</view>
		</view>
		<view class="footer">
			<view class="margin-bottom text-orange">
				<text @tap="onDetails(common.appConfig.user_agreement, 'ユーザー規約')">《ユーザー規約》</text>
				<text class="text-black">和</text><text @tap="onDetails(common.appConfig.privacy_protection, 'プライバシー保護')">《プライバシー保護声明》</text>
			</view>
			<view class="text-gray">{{iniData.name}} すべての作品</view>
			<view class="text-gray">Copyright © {{iniData.copyright}}</view>
		</view>
	</view>
</template>

<script>
import {mapState} from 'vuex';
export default {
	data() {
		return {
			iniData:{
				name: 'ロードの中...',
				logo: '',
				copyright: ''
			}
		};
	},
	onLoad() {
		this.loadData();
	},
	computed: {
		...mapState(['common'])
	},
	methods: {
		async loadData() {
			this.$api.get({
				url: '/wanlshop/common/about',
				success: res => {
					this.iniData = res;
				}
			});
		},
		// 評分
		scoring(){
			this.$wanlshop.msg('現在、アプリストアではご利用いただけません');
		},
		// 更新
		update(){
			if (this.$store.state.update.update) {
				
			}else{
				this.$wanlshop.msg(`現在 ${this.$store.state.common.version} 最新、新しいバージョンの更新なし！`);
			}
		}
	}
};
</script>

<style>
page {
	background-color: #ffffff;
}
.wanlian {
	display: flex;
	align-items: center; /* 垂直居中 */
	justify-content: center; /* 水平居中 */
	flex-direction: column;
	padding-top: 80rpx;
	padding-bottom: 60rpx;
}

.wanlian > image {
	height: 130rpx;
	width: 130rpx;
}

.footer {
	display: flex;
	align-items: center; /* 垂直居中 */
	justify-content: center; /* 水平居中 */
	flex-direction: column;
	position: fixed;
	bottom: 100rpx;
	font-size: 24rpx;
	width: 100%;
}
</style>
