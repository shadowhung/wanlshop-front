<template>
	<view>
		<view class="auth">
			<view class="wanl-title">情報を改善し続ける</view>
			<form @submit="formSubmit">
				<view class="avatar">
					<image :src="$wanlshop.oss(userInfo.avatarUrl, 50, 50)" mode="aspectFit"></image>
				</view>
				<view class="auth-group radius-bock bg-gray wlian-grey-light">
					<input placeholder="ユーザー名を入力してください" confirm-type="next" placeholder-class="placeholder" name="nickName" v-model="userInfo.nickName"></input>
				</view>
				<view class="auth-button flex flex-direction">
					<button class="cu-btn bg-orange sl radius-bock" formType="submit">完全な登録</button>
				</view>
			</form>
		</view>
		<uni-popup ref="authPopup"> 
			<view class="wanl-auth-popup bg-white radius-bock text-center">
				<view class="avatar">
					<image :src="$wanlshop.appstc('/common/logo.png')" mode="aspectFill"></image>
				</view>
				<view class="margin-tb-lg text-sm wanl-gray">
					親愛なる、初めてシステムにログインします。情報をさらに改善するには、ニックネームとプロフィール写真を取得する必要があります。
				</view>
				<button type="primary" class="cu-btn sl radius-bock bg-no margin-bottom" open-type="getUserInfo" @tap="getUserInfo">承認を確認する</button>
				<button class="cu-btn sl radius-bock" @tap="refuseUserInfo">ごみ</button>
			</view>
		</uni-popup>
		
	</view>
</template>
<script>
import graceChecker from '@/common/graceChecker';
export default {
	data() {
		return {
			userInfo: {
				avatarUrl: '',
				nickName: null,
				gender: 0
			},
			pageroute: '',
			provider: null,
			timer: null,
			third_id: 0
		};
	},
	onLoad(option) {
		this.pageroute = option.url;
		this.third_id = option.third_id;
		if (option.platform == 'mp_weixin' || option.platform == 'app_weixin') {
			this.provider = 'weixin'
		}else if(option.platform == 'mp_qq' || option.platform == 'app_qq'){
			this.provider = 'qq'
		}else if(option.platform == 'app_weibo'){
			this.provider = 'sinaweibo'
		}else if(option.platform == 'app_xiaomi'){
			this.provider = 'xiaomi'
		}else if(option.platform == 'apple'){
			this.provider = 'apple'
		}
		// 獲取用戶信息
		this.setUserInfo();
		// #ifdef MP-WEIXIN || MP-QQ
		setTimeout(() => {
			// 獲取用戶信息
			if (!this.userInfo.nickName) {
				this.$refs.authPopup.open();
			}else{
				// 獲取行動電話avatarUrl  gender nickName
				// 後续版本升级
			}
		}, 100);
		// #endif
	},
	onUnload(){  
	    if(this.timer) {  
	        clearInterval(this.timer);  
	        this.timer = null;  
	    }  
	},
	methods: {
		getUserInfo() {
			uni.showLoading({
			    title: '承認の取得..'
			});
			this.$refs.authPopup.close();
			if (this.timer) {
				clearInterval(this.timer) ;
			}else{
				this.timer = setInterval(() => {
					this.setUserInfo();
				}, 1000);
			}
		},
		refuseUserInfo(){
			this.$wanlshop.back(1);
		},
		// 獲取用戶信息
		setUserInfo(){
			uni.getUserInfo({
				provider: this.provider,
				success: (infoRes) => {
					this.userInfo = infoRes.userInfo;
					uni.hideLoading();
				}
			});
			// 如果存在，终止进程
			if(this.userInfo.nickName){
				if(this.timer) {
				    clearInterval(this.timer);  
				    this.timer = null;  
				} 
			}
		},
		formSubmit(e) {
			//定义表單规则
			let rule = [{
				name: 'nickName',
				checkType: 'string',
				checkRule: "1,20",
				errorMsg: 'ユーザー名は1〜10文字である必要があります'
			}];
			//进行表單检查
			var formData = e.detail.value;
			var checkRes = graceChecker.check(formData, rule);
			if (checkRes) {
				this.$api.post({
					url: '/wanlshop/user/perfect',
					data: {
						third_id: this.third_id,
						avatarUrl: this.userInfo.avatarUrl,
						nickName: this.userInfo.nickName,
						gender: this.userInfo.gender
					},
					success: res => {
						this.$store.dispatch('user/login', res);
						this.$store.dispatch('cart/login');
						this.$store.dispatch('chat/get');
						uni.reLaunch({url: decodeURIComponent(this.pageroute)});
					}
				});
			} else {
				this.$wanlshop.msg('ユーザー名を入力してください');
			}
		}
	}
};
</script>

<style>
	@import url("auth.css");
	.avatar{
		display: flex;
		justify-content: center;
		flex: 1;
		margin-bottom: 80rpx;
	}
	.avatar image{
		border-radius: 9999px;
		overflow: hidden;
		height: 200rpx;
		width: 200rpx;
	}
	.wanl-auth-popup{
		position: fixed;
		right: 60rpx;
		left: 60rpx;
		top: 100rpx;
		bottom: 200rpx;
		padding: 50rpx;
	}
	.wanl-auth-popup .avatar{
		margin-top: 80rpx;
		margin-bottom: 100rpx;
	}
	
	.wanl-auth-popup .cu-btn {
		height: 90rpx;
		width: 100%;
	}

	
	
</style>
