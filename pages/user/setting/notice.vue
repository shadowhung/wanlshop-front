<template>
	<view>
		<view class="edgeInsetTop"></view>
		<view class="cu-form-group margin-top">
			<view class="title">バナーメッセージ通知</view>
			<switch @change="pushs" :class="user.pushs?'checked':''" :checked="user.pushs?true:false"/>
		</view>
		<view class="cu-form-group margin-top">
			<view class="title">システムサウンド</view>
			<switch @change="voice" :class="user.voice?'checked':''" :checked="user.voice?true:false"/>
		</view>
		<view class="cu-form-group ">
			<view class="title">システムの振動</view>
			<switch @change="shock" :class="user.shock?'checked':''" :checked="user.shock?true:false"/>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	export default {
		computed: {
			...mapState(['user'])
		},
		methods: {
			async loadData(data) {
				// this.$api.post({
				// 	url: '/wanlshop/user/profile', 
				// 	data: data
				// });
				console.log('Fastadminユーザーデータテーブルを変更する必要があります。ネイティブバージョンを一時的に同期することはできません。');
				uni.setStorageSync("wanlshop:user", this.$store.state.user);
			},
			pushs(e) {
				let data = {
					pushs: e.target.value
				};
				this.$store.commit('user/setUserInfo', data);
				this.loadData(data); // 提交服務器
			},
			voice(e) {
				let data = {
					voice: e.target.value
				};
				this.$store.commit('user/setUserInfo', data);
				this.loadData(data);
			},
			shock(e) {
				let data = {
					shock: e.target.value
				};
				this.$store.commit('user/setUserInfo', data);
				this.loadData(data);
			}
		}
	}
</script>

<style>
</style>
