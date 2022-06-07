<template>
	<view>
		<view class="auth">
			<view class="wanl-title">変更する{{username}}密碼</view> 
			<form @submit="formSubmit">
				<view class="auth-group radius-bock bg-gray wlian-grey-light">
					<input confirm-type="done" placeholder="新しいパスワードを入力してください" password type="text" placeholder-class="placeholder" name="newpassword" @input="onKeyInput" ></input>
					<input name="mobile" disabled :value="mobile" style="display: none;" ></input>
					<input name="captcha" disabled :value="captcha" style="display: none;" ></input>
				</view>
				<view class="auth-button flex flex-direction">
					<button class="cu-btn bg-orange sl radius-bock" formType="submit" :disabled="submitDisabled">パスワードを変更する</button>
				</view>
			</form>
		</view>
	</view>
</template>
<script>
import graceChecker from '@/common/graceChecker';//來自 graceUI 的表單驗證， 使用说明见手冊 http://grace.hcoder.net/doc/info/73-3.html
export default {
	data() {
		return {
			username: this.$store.state.user.username,
			mobile: '',
			captcha: '',
			submitDisabled: true
		};
	},
	onLoad(options) {
		this.mobile = options.mobile;
		this.captcha = options.captcha;
	},
	methods: {
		onKeyInput(e) {
			this.submitDisabled = false
		},
		formSubmit(e) {
			//將下列代碼加入到對应的检查位置
			//定义表單规则
			var rule = [
				{ name: 'mobile', checkType: 'phoneno', errorMsg: '正しい携帯電話番号を入力してください' },
				{ name: "captcha", checkType: "zipcode", errorMsg: "確認コードは6桁以上です" },
				{ name: "newpassword", checkType: "zipcode", errorMsg: "6桁以上のパスワード" }
			];
			//进行表單检查
			var formData = e.detail.value;
			var checkRes = graceChecker.check(formData, rule);
			if (checkRes) {
				this.$api.post({
				    url: '/wanlshop/user/resetpwd', 
					data:{
						mobile: formData.mobile,  
						captcha: formData.captcha,
						newpassword: formData.newpassword
					},
				     success: res => {
				        // 促す
						this.$wanlshop.msg('パスワードが正常にリセットされました');
				        // 返回
				        uni.switchTab({
				        	url: '/pages/user/user'
				        });
				    }
				});
			} else {
				this.$wanlshop.msg(graceChecker.error);
			}
		}
	}
};
</script>

<style>
	@import url("auth.css");
</style>
