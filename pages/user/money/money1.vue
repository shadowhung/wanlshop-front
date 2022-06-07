<template>
	<view class="wanl-money">
		<view class="bg-orange padding-bj">
			<text class="title">残高（円）</text>
			<view class="margin-top margin-bottom-xs">
				<text class="text-sl">{{user.money}}</text>
			</view>
		</view>
		<view class="cu-list menu sm-border" style="font-size: 16px;padding-top: 32px;padding-left: 24px;">
			<p>【プリペイド/引き出し】</p>
			<p>[モールホームページ] >> [財布]</p>
		</view>
		<!-- 功能
		<view class="cu-list menu sm-border">
			<view class="cu-item arrow" @tap="$wanlshop.to('/pages/user/money/recharge')">
				<view class="content">
					<text class="wlIcon-chongzhichenggong text-blue"></text>
					<text>プリペイド</text>
				</view>
			</view>
			<view class="cu-item arrow" @tap="$wanlshop.to('/pages/user/money/withdraw')">
				<view class="content">
					<text class="wlIcon-tixianjilu text-orange"></text>
					<text>提現</text>
				</view>
			</view>
		</view> -->
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	data() {
		return {
			userid: 0
		};
	},
	computed: {
		...mapState(['user'])
	},
	onLoad(option) {
		this.userid = option.userid
		this.loadData();
	},
	onPullDownRefresh() {
		this.loadData();
	},
	methods: {
		async loadData() {
			this.$api.post({
				url: '/wanlshop/pay/getBalance1',
				data: {
					userid: this.userid,
				},
				success: res => {
					res = parseFloat(res).toFixed(0);
					this.$store.commit('user/setUserInfo', {money: res});
				}
			});
			uni.stopPullDownRefresh();
		}
	}
};
</script>

<style>
.wanl-money .title{
	color: rgba(255, 255, 255, .7);
}
</style>
