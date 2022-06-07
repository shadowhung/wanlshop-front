<template>
	<view class="wanl-money">
		<view class="bg-orange padding-bj">
			<text class="title">残高（円）</text>
			<view class="margin-top margin-bottom-xs">
				<text class="text-sl">{{user.money}}</text>
			</view>
		</view>
		<!-- 功能 -->
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
					<text>お金を引き出す</text>
				</view>
			</view>
		</view>
		<view class="cu-list menu sm-border">
			<view class="cu-item arrow" @tap="$wanlshop.to('/pages/user/bank/bank')">
				<view class="content">
					<text class="wlIcon-yinhangka text-blue"></text>
					<text>銀行口座</text>
				</view>
				<view class="action">
					<text class="text-sm wanl-gray">第三者のアカウントに引き出す</text>
				</view>
			</view>
			<view class="cu-item arrow" @tap="$wanlshop.to('/pages/user/money/list')">
				<view class="content">
					<text class="wlIcon-yue1 text-orange"></text>
					<text>支払明細</text>
				</view>
			</view>
			<view class="cu-item arrow" @tap="$wanlshop.to('/pages/user/money/witlist')">
				<view class="content">
					<text class="wlIcon-jinbitixian text-orange"></text>
					<text>引き出し履歴</text>
				</view>
			</view>
			<view class="cu-item arrow" @tap="$wanlshop.to('/pages/user/money/reclist')">
				<view class="content">
					<text class="wlIcon-jinbitixian text-orange"></text>
					<text>プリペイド履歴</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	data() {
		return {
			
		};
	},
	computed: {
		...mapState(['user'])
	},
	onLoad() {
		this.loadData();
	},
	methods: {
		async loadData() {
			this.$api.post({
				url: '/wanlshop/pay/getBalance',
				success: res => {
					res = parseFloat(res).toFixed(0);
					this.$store.commit('user/setUserInfo', {money: res});
				}
			});
		}
	}
};
</script>

<style>
.wanl-money .title{
	color: rgba(255, 255, 255, .7);
}
</style>
