<template>
	<view>
		<view class="auth">
			<view class="wanl-title">ログインアカウントへようこそ</view>
			<form @submit="formSubmit">
				<view class="auth-group radius-bock bg-gray wlian-grey-light">
					<input 
						type="text"
						placeholder="ユーザー名を入力してください" 
						confirm-type="next" 
						maxlength="16"
						placeholder-class="placeholder" 
						name="account"
						:value="account"
					></input>
				</view>
				<view class="auth-group radius-bock bg-gray wlian-grey-light">
					<input 
						type="text"
						placeholder="パスワードを入力してください" 
						password="true" 
						confirm-type="done"
						maxlength="16"
						placeholder-class="placeholder" 
						name="password"
						@input="onKeyInput"
					></input>
				</view>
				<view class="text-right" @tap="retrieve">
					パスワードをお忘れですか
				</view>
				<view class="auth-button flex flex-direction">
					<button class="cu-btn bg-orange sl radius-bock" form-type="submit" :disabled="submitDisabled">ログイン</button>
				</view>
				<!--<view class="text-center" @tap="phone">
					短信驗證碼登錄
				</view>-->
			</form>
		</view>
		<view class="auth-foot">
			<view class="menu text-grey">
				<text @tap="register">登録</text>
				<text @tap="help">助けて</text>
			</view>
		</view>
	</view>
</template>
<script>
import graceChecker from '@/common/graceChecker';//來自 graceUI 的表單驗證， 使用说明见手冊 http://grace.hcoder.net/doc/info/73-3.html
export default {
	data() {
		return {
			submitDisabled: true,
			account: '',
			pageroute: '/pages/user/user'
		};
	},
	onLoad(option){
		// ユーザー名
		this.account = option.name;
		this.pageroute = option.url?option.url:'/pages/user/user';
	},
	methods: {
		onKeyInput: function(e) {
			this.submitDisabled = false
		},
		formSubmit: function(e) {
			//定义表單规则
			var rule = [
				{ name: 'account', checkType: 'notnull', errorMsg: 'ユーザー名を入力してください' },
				{ name: 'password', checkType: 'string', checkRule: '6,16', errorMsg: '6桁以上のパスワード' }
			];
			//进行表單检查
			var formData = e.detail.value;
			var checkRes = graceChecker.check(formData, rule);
			if (checkRes) {
				this.$api.post({
					url: '/wanlshop/user/login', 
					data: {
						account: formData.account,
						password: formData.password,
						client_id: uni.getStorageSync("wanlshop:chat_client_id")?uni.getStorageSync("wanlshop:chat_client_id") : null
					},
					success: res => {
						res.userinfo.money = parseFloat(res.userinfo.money).toFixed(0);
						this.$store.dispatch('user/login', res);
						this.$store.dispatch('cart/login');
						this.$store.dispatch('chat/get');
						console.log('ll'+this.pageroute)
						uni.reLaunch({url: decodeURIComponent(this.pageroute)});
					}
				});
			} else {
				this.$wanlshop.msg(graceChecker.error);
			}
		},
		retrieve(){
			this.$wanlshop.to(`retrieve?url=${this.pageroute}`);
		},
		phone() {
			this.$wanlshop.to(`phone?url=${this.pageroute}`);
		},
		register() {
			this.$wanlshop.to(`register?url=${this.pageroute}`);
		},
		help() {
			this.$wanlshop.to(`/pages/user/help?url=${this.pageroute}`);
		}
	}
};
</script>

<style>
	@import url("auth.css");
</style>
