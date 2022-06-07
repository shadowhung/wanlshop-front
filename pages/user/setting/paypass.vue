<template>
	<view>
		<view class="edgeInsetTop"></view>
		<form @submit="formSubmit">
			<view class="cu-form-group" v-if="issetpass==1">
				<view class="title">現在のパスワード</view>
				<input placeholder="現在の６桁のパスワードを入力してください" type="number" maxlength="6" name="oldpay" :value="user.oldpay"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">新しいパスワード</view>
				<input placeholder="6桁の新しいパスワードを入力してください" type="number" maxlength="6" name="newpay" :value="user.newpay"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">新しいパスワード（確認）</view>
				<input placeholder="新しいパスワード（確認）" type="number" maxlength="6" name="renewpay" :value="user.renewpay"></input>
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
			this.$api.post({
				url: '/wanlshop/user/getpaypass',
				success: res => {
					this.issetpass = res
				}
			});
			
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
					{name: 'newpay', checkType: 'string', checkRule: '6,6', errorMsg: '6桁の支払いパスワードを入力してください'},
					{name: 'renewpay', checkType: 'string', checkRule: '6,6', errorMsg: '6桁の支払いパスワードを入力してください'}
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
						url: '/wanlshop/user/resetpass', 
						data: formData,
						success: res => {
							// 保存用戶信息
							//this.$store.commit('user/setUserInfo', formData);
							// 促す
							if(this.issetpass==1){
								this.$wanlshop.msg('正常に変更されました');
							}else{
								this.$wanlshop.msg('正常に追加されました');
							}
							
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
