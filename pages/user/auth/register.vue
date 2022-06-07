<template>
	<view>
		<view class="auth">
			<view class="wanl-title">アカウントの登録へようこそ</view>
			<form @submit="formSubmit">
				<view class="auth-group radius-bock bg-gray wlian-grey-light">
					<input 
						placeholder="携帯電話番号を入力してください" 
						type="number" maxlength="15" 
						confirm-type="next" 
						placeholder-class="placeholder" 
						name="mobile"
						v-model="mobile"
						@input="onKeyInput"
					></input>
				</view>
				
				<view class="auth-group radius-bock bg-gray wlian-grey-light">
					<input 
						placeholder="パスワードを入力してください" 
						confirm-type="next" 
						placeholder-class="placeholder" 
						name="password"
						v-model="password"
						@input="onKeyInput"
					></input>
				</view>
				
				
				<view class="auth-group radius-bock bg-gray wlian-grey-light">
					<input type="number"  maxlength="6"
						placeholder="6桁の支払いパスワード" 
						confirm-type="next" 
						placeholder-class="placeholder" 
						name="password2"
						v-model="password2"
						@input="onKeyInput"
					></input>
				</view>
				
				<view class="auth-button flex flex-direction">
					<button class="cu-btn bg-orange sl radius-bock" formType="submit" :disabled="submitDisabled">登録</button>
				</view>
				<view class="auth-clause">
確認コードを取得するということは、読んで同意することを意味します<text @tap="onDetails($store.state.common.appConfig.privacy_protection, '個人情報保護ポリシー')">
個人情報保護ポリシー</text>
<!--確認コードを取得するということは、読んで同意することを意味します<text @tap="onDetails($store.state.common.appConfig.user_agreement, '用戶協議')">用戶協議</text>及<text @tap="onDetails($store.state.common.appConfig.privacy_protection, '隱私保護')">
隱私權保護聲明</text>-->
				</view>
			</form>
		</view>
		<view class="auth-foot">
			<view class="menu text-grey">
				<text @tap="auth">ログイン</text>
				<text @tap="help">助けて</text>
			</view>
		</view>
	</view>
</template>
<script>
import graceChecker from '@/common/graceChecker';//來自 graceUI 的表單驗證， 使用说明见手冊 http://grace.hcoder.net/doc/info/73-3.html
import { mapState } from 'vuex';
export default {
	data() {
		return {
			submitDisabled: true,
			title: 'フォームの検証',
			pageroute: '',
			mobile: '',
			password:'',
			password2:''
		};
	},
	onLoad(options) {
		this.pageroute = options.url;
		if (options.mobile) {
			this.mobile = options.mobile;
			this.submitDisabled = false;
		}
		
	},
	methods: {
		onKeyInput: function(e) {
			this.submitDisabled = false
		},
		formSubmit: function(e) {
			// 检查行動電話是否被註冊
			
			//定义表單规则
			var rule = [
				{ name: 'mobile', checkType: 'phoneno', errorMsg: '正しい携帯電話番号を入力してください' },
				{ name: 'password', checkType: 'string', checkRule: '6,16', errorMsg: '6桁以上のパスワード' },
				{ name: 'password2', checkType: 'string', checkRule: '6', errorMsg: '6桁のパスワード' }
			];
			//进行表單检查
			var formData = e.detail.value;
			var checkRes = graceChecker.check(formData, rule);
			if (checkRes) {
				this.$api.get({
					url: '/wanlshop/validate/check_mobile_available',
					data: {
						mobile: this.mobile
					},
					success: res => {
						//this.$store.dispatch('user/login', res);
						let that = this;
						this.$api.post({
						    url: '/wanlshop/user/register', 
							data:{
								mobile: `${e.detail.value.mobile}`,
								password: `${e.detail.value.password}`,
								password2: `${e.detail.value.password2}`,
								client_id: uni.getStorageSync("wanlshop:chat_client_id")?uni.getStorageSync("wanlshop:chat_client_id") : null
							},
						    success: res => {
								uni.hideLoading();
								// 中央控製总线
								this.$store.dispatch('user/login', res);
								this.$store.dispatch('cart/login');
								this.$store.dispatch('chat/get');
								//this.$wanlshop.to(`/pages/user/setting/user`);
								///pages/user/setting/user
						        uni.reLaunch({url: decodeURIComponent(this.pageroute)});
						    }
						});
						/*let url = `validcode?event=register&password=${e.detail.value.password}&mobile=${e.detail.value.mobile}&url=${this.pageroute}`;
						uni.setStorage({
						    key: 'url_key',
						    data: `${e.detail.value.password}`,
						    success: function () {
						        that.$wanlshop.to(url,'slide-in-bottom',200);
						    }
						})   */
						//this.$wanlshop.to(url,'slide-in-bottom',200);
					},
					fail: res => {
						uni.showModal({
						    title: '携帯電話番号が登録されました',
						    content: '[OK]をクリックして、携帯電話番号でログインします',
						    success: (msg)=> {
						        if (msg.confirm) {
						           this.$wanlshop.to(`phone?password=${e.detail.value.password}&mobile=${e.detail.value.mobile}&url=${this.pageroute}`,'slide-in-bottom',200);
						        } else if (msg.cancel) {
						            console.log('ユーザーがクリックしてキャンセル');
						        }
						    }
						});
					}
				});
				
			} else {
				this.$wanlshop.msg(graceChecker.error);
			}
		},
		auth() {
			this.$wanlshop.to(`/pages/user/auth/name`);
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
