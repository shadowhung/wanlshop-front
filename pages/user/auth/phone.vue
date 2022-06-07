<template>
	<view>
		<view class="auth">
			<view class="wanl-title">ログインアカウントへようこそ</view>
			<form @submit="formSubmit">
				<view class="auth-group radius-bock bg-gray wlian-grey-light">
					<input 
						placeholder="携帯電話番号を入力してください" 
						type="number" 
						maxlength="15" 
						confirm-type="next" 
						placeholder-class="placeholder" 
						name="mobile"  
						:value="mobile"
					></input>
				</view>
				
				<view class="auth-button flex flex-direction">
					<button class="cu-btn bg-orange sl radius-bock" form-type="submit">確認コードを取得する</button><!-- disabled="true" -->
				</view>
				<view class="text-center" @tap="name">
					アカウントパスワードログイン
				</view>
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
			mobile: '',
			pageroute: ''
		};
	},
	onLoad(options) {
		this.mobile = options.mobile;
		this.pageroute = options.url;
	},
	methods: {
		formSubmit: function(e) {
			//將下列代碼加入到對应的检查位置
			//定义表單规则
			var rule = [
				{ name: 'mobile', checkType: 'phoneno', errorMsg: '正しい携帯電話番号を入力してください' }
			];
			//进行表單检查
			var formData = e.detail.value;
			var checkRes = graceChecker.check(formData, rule);
			if (checkRes) {
				this.$wanlshop.to(`validcode?event=mobilelogin&mobile=${e.detail.value.mobile}&url=${this.pageroute}`,'slide-in-bottom',200);
			} else {
				this.$wanlshop.msg(graceChecker.error);
			}
		},
		phoneKey: function (e) {
		    var phoneNum = this.value.trim();
			//如果是刪除按键，则什么都不做
			if (e.keyCode === 8) {
				this.value = phoneNum;
				return;
			}
			var len = phoneNum.length;
			if (len === 3 || len === 8) {
				phoneNum += ' ';
				this.value = phoneNum;
			}
		},
		name() {
			this.$wanlshop.to(`name?name=${this.mobile}&url=${this.pageroute}`);
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
