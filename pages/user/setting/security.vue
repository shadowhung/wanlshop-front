<template>
	<view>
		<view class="edgeInsetTop"></view>
		<view class="cu-list menu sm-border">
			<view class="cu-item arrow" @tap="$wanlshop.auth(`/pages/user/auth/validcode?event=resetpwd&mobile=${user.mobile}`)">
				<view class="content">
					<text>ログインパスワードを変更する</text>
				</view>
			</view>
			<view class="cu-item arrow" @tap="noMobile">
				<view class="content">
					<text>携帯電話番号を変更する</text>
				</view>
			</view>
			<view class="cu-item arrow" @tap="noPay">
				<view class="content">
					<text>支払いパスワードを変更する</text>
				</view>
			</view>
		</view>
		
		<!-- <view class="cu-list menu sm-border">
			<view class="cu-item arrow">
				<view class="content">
					<text>安全中心</text>
				</view>
			</view>
		</view> -->
		
		<view class="cu-list menu sm-border" @tap="noUser">
			<view class="cu-item arrow">
				<view class="content">
					<text>ログアウトアカウント</text>
				</view>
			</view>
		</view>
		
		
	</view>
</template>

<script>
	import { mapState} from 'vuex';
	export default {
		data() {
			return {

			}
		},
		computed: {
			...mapState(['user'])
		},
		methods: {
			noPay(){
				this.$wanlshop.msg('支払いパスワードなし')
			},
			noUser(){
				this.$wanlshop.msg('現在、アカウントのキャンセルはサポートされていません')
			},
			noMobile(){
				this.$wanlshop.msg('現在、携帯電話コードの変更はサポートされていません')
			}
		}
	}
</script>

<style>
	
</style>
