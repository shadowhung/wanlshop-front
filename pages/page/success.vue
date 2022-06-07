<template>
	<view class="wanl-success">
		<!-- 導航條 -->
		<view class="cu-custom" :style="{height: wanlsys.height + 'px' }">
			<view class="cu-bar bg-bgcolor fixed" :style="{ height: wanlsys.height + 'px', paddingTop: wanlsys.top + 'px'}">
				<view class="action" @tap="onBackUser">
					<text class="wlIcon-fanhui1"></text>
				</view>
				<view class="content" :style="{top: wanlsys.top + 'px'}">
					<text>{{title}}実施する</text>
				</view>
			</view>
		</view>
		
		<view class="content">
			<text class="icon wlIcon-pintuantuangouchenggong"></text>
			<text class="text-lg margin-tb">{{ title }}成功しました</text>
			<view class="button padding-xl margin-top-lg">
				<button class="cu-btn block wanl-bg-orange margin-tb-sm lg" v-if="type == 'comment'" @tap="$wanlshop.to('/pages/user/comment/comment')">コメントを見る</button>
				<button class="cu-btn block wanl-bg-orange margin-tb-sm lg" v-if="type == 'pay'" @tap="$wanlshop.to('/pages/user/order/order')">注文を確認する</button>
				<button class="cu-btn block wanl-bg-orange margin-tb-sm lg" v-if="type == 'feedback'" @tap="$wanlshop.to('/pages/user/feedback/lists')">フィードバックを見る</button>
				<button class="cu-btn block wanl-bg-orange margin-tb-sm lg" v-if="type == 'complaint'" @tap="$wanlshop.to('/pages/user/complaint/lists')">レポートを見る</button>
				<button class="cu-btn block wanl-bg-orange margin-tb-sm lg" v-if="type == 'withdraw'" @tap="$wanlshop.to('/pages/user/money/witlist')">引き出しリストを見る</button>
				<button class="cu-btn block wanl-bg-orange margin-tb-sm lg" v-if="type == 'recharge'" @tap="$wanlshop.to('/pages/user/money/money')">ウォレットを見る</button>
				<button class="cu-btn block line-gray margin-tb-sm lg" @tap="onIndex">ホームページに戻ります</button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			wanlsys: this.$wanlshop.wanlsys(),
			type: '',
			title: ''
		};
	},
	onLoad(options) {
		if (options.type == 'pay') {
			this.title = '支払うには';
		} else if (options.type == 'comment') {
			this.title = 'コメント';
		} else if (options.type == 'feedback') {
			this.title = 'フィードバック';
		} else if (options.type == 'withdraw') {
			this.title = 'バックグラウンドレビューを待って送信してください';
		} else if (options.type == 'recharge') {
			this.title = 'バックグラウンドレビューを待って送信してください';
		} else if (options.type == 'complaint') {
			this.title = '報告書';
		}
		this.type = options.type;
	},
	methods: {
		onIndex() {
			uni.switchTab({
				url: '/pages/twshop/index'
			});
		},
		onBackUser(){
			uni.switchTab({
			    url: '/pages/user/user'
			});
		}
	}
};
</script>

<style>
.wanl-success .content {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.wanl-success .content .icon {
	font-size: 180rpx;
	color: #3aa112;
	margin-top: 150rpx;
}
.wanl-success .content .button {
	width: 100%;
}
</style>
