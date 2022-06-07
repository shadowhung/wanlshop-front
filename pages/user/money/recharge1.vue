<template>
	<view>
		<!-- 收銀台 -->
		<view class="edgeInsetTop"></view>
		<view class="wanl-pay">
			<view class="money bg-white">
				<text class="title">プリペイド金額</text>
				<view class="margin-top price">
					<view class="symbol">
						<text>円</text>
					</view>
					<view class="symbol">
						<text>{{money}}</text>
					</view>
				</view>
			</view>
			<view class="list-box">
				<view class="item" v-for="(item, index) in payList" :key="index">
					<!--<text :class="'wlIcon-'+ item.type +'-pay'"></text>-->
					<view class="action">
						<text class="title wanl-pip">{{item.name}}</text>
						<view>{{item.describe}}</view>
					</view>
					<view class="radio text-xxl" v-if="item.state" @tap="onSelect(index)">
						<text v-if="item.select" class="wlIcon-xuanze-danxuan wanl-orange"></text>
						<text v-else class="wlIcon-xuanze wanl-gray-light"></text>
					</view>
					<view class="radio text-xxl" v-else>
						<text class="wlIcon-xuanze-danxuan wanl-gray-light"></text>
					</view>
				</view>
			</view>
			<button class="mix-btn wanl-bg-redorange" @tap="confirm()" :loading="loading"> プリペイド</button>
			<view class="list-box" style="color: red;">
				<p>チップ：</p>
				<p>１、ご入金完了後、通常2時間以内に着金します。</p>
				<p>２、午後21時以降の振込は、翌日9時以降に着金する場合があります。</p>
				<p>3、ご不明な点がございましたら、時間内にオンラインカスタマーサービスにご相談ください</p>
			</view>
			<view class="footer text-center">
				<view> © shopyjp支払い </view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loading: false,
				disabled: false,
				money: null,
				payList: [],
				payisok: 0,
			}
		},
		onLoad(option) {
			this.$api.post({
				url: '/wanlshop/pay/payisok',
				success: res => {
					this.payisok = res
				}
			});
			console.log(option.money)
			this.money = option.money
			// 支付列表
			let method = 'wap';
			// #ifdef APP-PLUS
			method = 'app';
			// #endif
			// #ifdef MP-BAIDU
			method = 'mini';
			// #endif
			// #ifdef MP-WEIXIN
			method = 'miniapp';
			// #endif
			// #ifdef MP-ALIPAY
			method = 'mini';
			// #endif
			// #ifdef MP-QQ
			method = 'mini';
			// #endif
			
			
			this.payList.push({
				name: 'スーパービジネス決済',
				describe: '支払いにはスーパーマーチャントを使用することをお勧めします',
				Pay_zg: '4',
				method: 'wap',
				state: true,
				select: true
			},{
				name: '銀行口座',
				describe: '',
				Pay_zg: '2',
				method: 'wap',
				state: true,
				select: false
			});
			
			/*uni.getProvider({
			    service: "payment",
			    success: (e) => {
			        e.provider.map((value) => {
						if (value == 'alipay') {
							this.payList.push({name: 'Alipay',describe: '',type: value,method: method,state: true,select: false});
						}else if(value == 'wxpay'){
							this.payList.push({name: 'WeChat Pay',describe: 'WeChatPayをお勧めします',type: 'wechat',method: method,state: true,select: false});
						}else if(value == 'baidu'){
							this.payList.push({name: 'Baiduレジ',describe: '',type: value,method: method,state: true,select: false});
						}
						else if(value == 'appleiap'){
							this.payList.push({name: 'ApplePay',describe: '',type: 'apple',method: method,state: true,select: false});
						}
			        })
			    }
			});*/
		},
		methods: {
			//確認支付
			confirm() {
				let data = null;
				if (this.disabled) {
					return;
				}
				if(this.money <= 0){
					this.$wanlshop.msg('保存金額を入力してください');
					return;
				}
				this.payList.map((value,index,array) => {
				　　if(value.select){
						data = value;
					}else{
						return;
					}
				});
				data = {
						name: '台湾での支払い',
						describe: '',
						Pay_zg: data.Pay_zg,
						type: 'twpay',
						method: 'wap',
						state: true,
						select: false
				}
				// 判断支付是否存在
				if (!data) {
					this.$wanlshop.msg('お支払い方法を選択してください');
					return;
				}else{
					console.log(this.payisok)
					if(this.payisok=='0'&&data.Pay_zg=='2'){
						this.$wanlshop.to('/pages/user/money/recharge2?money='+this.money);
						return;
					}
					
					this.loading = true;
					this.disabled = true;
					// 獲取小程序code
					// #ifdef MP
					uni.login({
					    success: (e) => {
							this.wanlPay(data, e.code);
					    },
					    fail: (e) => {
					        uni.showModal({
					            content: "WeChatコードを取得できません。理由は: " + e.errMsg,
					            showCancel: false
					        })
					    }
					})
					// #endif
					// #ifndef MP
					// #endif
					this.wanlPay(data);
				}
			},
			async wanlPay(data, code = null){
				this.$api.post({
					url: '/wanlshop/pay/recharge',
					data: {
						type: data.type,
						method: data.method,
						code: code,
						money: this.money,
						Pay_zg: data.Pay_zg,
					},
					success: (res) => {
						// 台湾での支払い
						if(data.type == 'twpay' && data.method == 'wap'){
							// #ifdef H5
							window.location.href = res;
							// #endif
							// #ifdef APP-PLUS
							//plus.runtime.openWeb(res);
							plus.runtime.openURL(res);
							// #endif
							
							// 關閉loading
							this.loading = false;
							this.disabled = false;
							/*let that = this;
							let url = `rechargeweb`;
							uni.setStorage({
							    key: 'pay_key',
							    data: res,
							    success: function () {
							        that.$wanlshop.to(url,'slide-in-bottom',200);
							    }
							})*/
							//
						}
					}
				});
			},
			onSelect(key){
				this.payList.map((value,index,array) => {
				　　if(index == key){
						value.select = !value.select;
					}else{
						value.select = false;
					}
				});
			},
			emptyInput(){
				this.money = null;
			},
			// 支付成功
			paySuccess(){
				this.loading = false;
				this.$store.commit('user/setUserInfo', {
					money: this.$wanlshop.bcadd(this.$store.state.user.money, this.money)
				});
				this.$wanlshop.to('/pages/page/success?type=recharge');
			}
		}
	}
</script>

<style>
	radio-group {
	    display: block;
	}
	.wanl-pay .money{
		padding: 25rpx 40rpx 25rpx 60rpx;
	}
	
	.wanl-pay .money .symbol{
		font-size: 60rpx;
		margin-right: 20rpx;
	}
	
	.wanl-pay .money .price{
		display: flex;
		align-items: center;
	}
	.wanl-pay .money .price input{
		/* #ifdef MP */
		height: 100rpx;
		min-height: 100rpx;
		/* #endif */
		width: 100%;
		font-size: 100rpx;
	}
</style>
