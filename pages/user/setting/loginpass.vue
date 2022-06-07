<template>
	<view>
		<view class="edgeInsetTop"></view>
		<form @submit="formSubmit">
			<view class="cu-form-group">
				<view class="title">現在のパスワード</view>
				<input placeholder="現在のパスワードを入力してください" name="oldpay" :value="user.oldpay"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">新しいパスワード</view>
				<input placeholder="新しいパスワードを入力してください" name="newpay" :value="user.newpay"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">新しいパスワード（確認）</view>
				<input placeholder="新しいパスワード（確認）" name="renewpay" :value="user.renewpay"></input>
			</view>
			<view class="padding-bj flex flex-direction">
				<button form-type="submit" class="cu-btn wanl-bg-redorange margin-tb lg">セーブ</button>
			</view>
		</form>

	</view>
</template>

<script>
	import graceChecker from '@/common/graceChecker';
	import { mapState } from 'vuex';
	export default {
		computed: {
			...mapState(['user'])
		},
		data() {
			return {
				gender: true,
				genderdata: 0,
				issetpass:0,
			}
		},
		onLoad() {
			//中央總線重新賦值Data
			this.gender = this.$store.state.user.gender == 0 ? true : false;
			this.genderdata = this.$store.state.user.gender;
		},
		methods: {
			logout() {
				this.$api.get({
					url: '/wanlshop/user/logout',
					data: {
						client_id: uni.getStorageSync("wanlshop:chat_client_id")?uni.getStorageSync("wanlshop:chat_client_id") : null
					},
					success: res => {
						this.$store.dispatch('user/logout');
						this.$wanlshop.msg('正常に終了します');
						this.$wanlshop.back(1);
					}
				});
			},
			DateChange(e) {
				this.$store.state.user.birthday = e.detail.value
			},
			Gender(e) {
				if(e.detail.value == true){
					this.gender = true;
					this.genderdata = 0;
				}else{
					this.gender = false;
					this.genderdata = 1;
				}
			},
			Avatar(){
				this.$wanlshop.to('/pages/user/portrait/portrait');
			},
			formSubmit: function(e) {
				//定義表單規則
				let rule = [
					{name: 'oldpay', checkType: 'string', checkRule: '6,32', errorMsg: '6〜32桁のログインパスワードを入力してください'},
					{name: 'newpay', checkType: 'string', checkRule: '6,32', errorMsg: '6〜32桁のログインパスワードを入力してください'},
					{name: 'renewpay', checkType: 'string', checkRule: '6,32', errorMsg: '6〜32桁のログインパスワードを入力してください'}
				];
				//進行表單檢查
				let formData = e.detail.value;
				let checkRes = graceChecker.check(formData, rule);
				console.log(formData)
				if(formData.newpay!=formData.renewpay){
					this.$wanlshop.msg('2つのパスワードエントリに一貫性がありません');
					return false;
				}
				// ..檢查是否註冊-沒註冊跳轉註冊
				if (checkRes) {
					this.$api.post({
						url: '/wanlshop/user/resetloginpass', 
						data: formData,
						success: res => {
							// 保存用戶信息
							//this.$store.commit('user/setUserInfo', formData);
							// 促す
							this.$wanlshop.msg('正常に変更されました');
						}
					});
				} else {
					this.$wanlshop.msg(graceChecker.error);
				}
			}
		}
	}
</script>

<style>
	.cu-form-group .title {
		min-width: calc(4em + 15px);
	}
</style>
