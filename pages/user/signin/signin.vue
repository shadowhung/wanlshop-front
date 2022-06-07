<template>
	<view class="wanl-signin">
		<view class="edgeInsetTop"> </view>
		<view class="header wanl-bg-redorange">
			<view class="user margin-left">
				<view class="cu-avatar lg round" :style="{ backgroundImage: 'url(' + $wanlshop.oss(user.avatar, 52, 52, 2, 'avatar') + ')' }"></view>
				<view class="margin-left-bj">
					<view class="text-xl">
						{{user.nickname}} 
					</view>
					<view class="text-sm">
						<text class="margin-right">Lv{{user.level}}</text> 
						<text class="margin-right-xs wlIcon-jifen2"></text> 積分：{{user.score}}
					</view>
				</view>
			</view>
			<view class="tag text-orange text-sm" @tap="onScore">
				<text class="wlIcon-liwuhuodong" style="margin-right: 5rpx;"></text>ポイント記録
			</view>
		</view>
		<view class="content bg-white padding-tb-bj radius-bock shadow-warp">
			<view class="text-df margin-tb-xs margin-lr-bj text-bold" style="color: #5A5B5C;">
				<view v-if="signinData.signin">
					連続してチェックインされました
					<text>{{ signinData.successions }}</text>
					日，引き続きご利用いただけます
					<text>{{ signinData.score }}</text>
					積分
				</view>
				<view v-else>
					今すぐサインインして
					<text>{{ signinData.score }}</text>
					積分
				</view>
			</view>
			<wanl-steps :active="signinData.successions" activeColor="#ffbc00" :options="stepsOption" />
			<view class="text-center">
				<view v-if="signinData.signin"><button class="cu-btn bg-gray round lg text-sm text-gray">チェックインした</button></view>
				<view v-else><button class="cu-btn wanl-bg-redorange round lg text-sm" @tap="attendance">サインイン</button></view>
			</view>
		</view>
		<view class="margin-bj radius-bock shadow-warp"><uni-calendar :selected="selected" :showReturn="false" @change="change" /></view>
		<view class="edgeInsetBottom"></view> 
		<wanl-modal custom :show="attendanceModalVisible">
			<view class="attendance-modal">
				<view class="modal-header">
					<image :src="$wanlshop.appstc('/common/cup.png')" mode="widthFix"></image>
				</view>
				<view class="modal-content text-sm wanl-gray" >
					<view>{{ signinInfo }}</view>
				</view>
				<view class="modal-btn"><button class="cu-btn wanl-bg-redorange round lg text-sm" @tap="attendanceModalVisible = false">知っている</button></view>
			</view>
		</wanl-modal>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	data() {
		return {
			signinData: {},
			selected: [],
			signinInfo: '',
			attendanceModalVisible: false,
			stepsOption: [
				{ title: '1日', desc: '+1' },
				{ title: '2日', desc: '+2' },
				{ title: '3日', desc: '+3' },
				{ title: '4日', desc: '+4' },
				{ title: '5日', desc: '+5' },
				{ title: '6日', desc: '+6' },
				{ title: '7日', desc: '+7' },
				{ title: '7日+', desc: '+7', circle: '/static/images/integrals/goal.png', circleStyle: 'width: 47rpx; height: 39rpx;' }
			]
		};
	},
	onLoad(option) {
		this.loadData();
	},
	computed: {
		...mapState(['user'])
	},
	methods: {
		async loadData() {
			this.$api.get({
				url: '/wanlshop/signin/getSignin',
				success: res => {
					this.signinData = res;
					// 进程
					this.stepsOption[0].desc = '+' + res.signinscore.s1;
					this.stepsOption[1].desc = '+' + res.signinscore.s2;
					this.stepsOption[2].desc = '+' + res.signinscore.s3;
					this.stepsOption[3].desc = '+' + res.signinscore.s4;
					this.stepsOption[4].desc = '+' + res.signinscore.s5;
					this.stepsOption[5].desc = '+' + res.signinscore.s6;
					this.stepsOption[6].desc = '+' + res.signinscore.s7;
					this.stepsOption[7].desc = '+' + res.signinscore.sn;
					// 打标
					res.list.forEach(item => {
						this.selected.push({ date: this.timestampToTime(item.createtime), info: '已簽' });
					});
					this.$store.commit('user/setUserInfo', {score:res.user_score});
				}
			});
		},
		// 点击簽到
		attendance() {
			this.$api.post({
				url: '/wanlshop/signin/dosign',
				success: res => {
					this.loadData();
					if (this.signinData.signin) {
						this.signinInfo = '連続してチェックインされました'+this.signinData.successions+'日/n取得するには、明日もサインインを続けてください'+this.signinData.score+'積分';
					}else{
						this.signinInfo = '贈り物'+this.signinData.score+'ポイントがあなたのアカウントに送られました';
					}
					this.attendanceModalVisible = true;
				}
			});
		},
		// 补簽
		change(data) {
			// 正常簽到
			if (this.signinData.date == data.fulldate) {
				this.attendance();
			} else {
				// 补簽
				if (this.signinData.isfillup == 1) {
					uni.showModal({
						title: '必ず再署名してください',
						content: '再発行日を確認してください：' + data.fulldate + '？ビザの更新は消費します' + this.signinData.fillupscore + '積分',
						success: res => {
							if (res.confirm) {
								this.$api.get({
									url: '/wanlshop/signin/fillup',
									data: {
										date: data.fulldate
									},
									success: res => {
										this.signinInfo = '再発行'+ data.fulldate +'日成功，この控除'+this.signinData.fillupscore+'積分';
										this.attendanceModalVisible = true;
										this.loadData();
									}
								});
							}
						}
					});
				} else {
					this.$wanlshop.msg('システムは再発行を許可していません');
				}
			}
		},
		timestampToTime(timestamp) {
			var date = new Date(timestamp * 1000); //时間戳為10位需*1000，时間戳為13位的话不需乘1000
			var Y = date.getFullYear() + '-';
			var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
			var D = date.getDate();
			return Y + M + D;
		},
		onScore(){
			this.$wanlshop.to('/pages/user/signin/log');
		}
	}
};
</script>

<style>
.wanl-signin .header {
	display: flex;
	height: 320rpx;
	align-items: center;
	justify-content: space-between;
}

.wanl-signin .header .user {
	display: flex;
	align-items: center;
}

.wanl-signin .header .tag {
	background-color: #fff;
	padding: 10rpx 10rpx;
	border-radius: 100rpx 0 0 100rpx;
}

.wanl-signin .content {
	margin: 25rpx;
	margin-top: -80rpx;
}

.wanl-signin .content .cu-btn {
	width: 50%;
}

.wanl-signin .attendance-modal .modal-header {
	width: 100%;
	height: 260rpx;
	margin-top: -180rpx;
	position: relative;
}
.wanl-signin .attendance-modal .modal-header image {
	width: 100%;
	height: 100%;
}
.wanl-signin .attendance-modal .modal-content {
	height: 200rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}
.wanl-signin .attendance-modal .modal-btn{
	display: flex;
	align-items: center;
	justify-content: center;
}
.wanl-signin .attendance-modal .btn {
	width: 100%;
	border-radius: 50rem;
	font-size: $font-size-lg;
}
</style>
