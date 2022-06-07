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
					<input type="digit" maxlength="8" focus v-model="money"/>
					<view class="text-lg wanl-gray-light" @tap="emptyInput" v-if="money">
						<text class="wlIcon-shibai"></text>
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
			<view class="list-box" style="padding-left: 0px;text-align: center;">
				<br>
				<view class="page-container">
					<button class="my-mix-btn" @tap="onDetails(12, 'チャージとポイントに関して')" :loading="loading">チャージとポイントに関して </button><br>
				</view>
			</view>
			<button class="mix-btn wanl-bg-redorange" @tap="confirm()" :loading="loading"> プリペイド</button>
			<view class="list-box" style="color: red;">
				<p>チップ：</p>
				<p>１、ご入金完了後、通常2時間以内に着金します。</p>
				<p>２、午後21時以降の振込は、翌日9時以降に着金する場合があります。</p>
				<p>3、ご不明な点がございましたら、時間内にオンラインカスタマーサービスにご相談ください</p>
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
				rechargemoney: 0,
				sendDate: {
				    money: 0,
				    content: "",
					images: [],
				    contact: ""
				}
			}
		},
		onLoad() {
			/*this.$api.post({
				url: '/wanlshop/pay/getRechargemoney',
				success: res => {
					this.rechargemoney = res
				}
			});*/
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
			
			// #ifdef H5
			this.payList.push({
				name: '銀行口座',
				describe: '銀行口座の使用をお勧めします',
				Pay_zg: '2',
				method: method,
				state: true,
				select: true
			}, {
				name: 'スーパービジネス決済',
				describe: '',
				Pay_zg: '4',
				method: method,
				state: true,
				select: false
			});
			// #endif
			// #ifndef H5
			uni.getProvider({
			    service: "payment",
			    success: (e) => {
			        e.provider.map((value) => {
						if (value == 'alipay') {
							this.payList.push({name: 'Alipay',describe: '',type: value,method: method,state: true,select: false});
						}else if(value == 'wxpay'){
							this.payList.push({name: 'WeChat Pay',describe: 'WeChatPayをお勧めします',type: 'wechat',method: method,state: true,select: false});
						}else if(value == 'baidu'){
							this.payList.push({name: 'Baiduレジ',describe: '',type: value,method: method,state: true,select: false});
						}else if(value == 'appleiap'){
							this.payList.push({name: 'ApplePay',describe: '',type: 'apple',method: method,state: true,select: false});
						}
			        })
			    }
			});
			// #endif
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
				
				this.sendDate.money = this.money
				this.$wanlshop.to('/pages/user/money/recharge2?money='+this.money);
				/*this.$api.post({
					url: '/wanlshop/recharge/add',
					data: this.sendDate,
					success: res => {
						//this.$wanlshop.msg('等待管理員審核通過');
						this.$wanlshop.to('/pages/user/money/recharge2?money='+this.money);
					}
				});*/
				return;
				
				/*if(parseFloat(this.money) > parseFloat(this.rechargemoney)){
					this.$wanlshop.to('/pages/user/money/recharge2?money='+this.money);
					return;
				}else{
					this.$wanlshop.to('/pages/user/money/recharge1?money='+this.money);
					return;
				}*/
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
					this.wanlPay(data);
					// #endif
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
							window.location.href = res;
							// 關閉loading
							this.loading = false;
							/*uni.showModal({
							    title: '台湾での支払い',
							    content: '支払いは完了しましたか',
							    success: (res) => {
							        if (res.confirm) {
							            this.paySuccess();
							        } else if (res.cancel) {
							            console.log('ユーザーがクリックしてキャンセル');
							        }
							    }
							});*/
							// 异步查询是否支付成功
							//location.href="";
						}
						
						// 微信 H5支付
						if(data.type == 'wechat' && data.method == 'wap'){
							// 關閉loading
							this.loading = false;
							uni.showModal({
							    title: 'WeChat Pay',
							    content: '支払いは完了しましたか',
							    success: (res) => {
							        if (res.confirm) {
							            this.paySuccess();
							        } else if (res.cancel) {
							            console.log('ユーザーがクリックしてキャンセル');
							        }
							    }
							});
							// 异步查询是否支付成功
							window.location.href = res;
						}
						
						// 微信小程序支付
						if(data.type == 'wechat' && data.method == 'miniapp'){
							uni.requestPayment({
							    appId: res.appId,
							    nonceStr: res.nonceStr,
							    package: res.package,
							    paySign: res.paySign,
								signType: res.signType,
								timeStamp: res.timeStamp,
							    success: (e) => {
							        this.paySuccess();
							    },
							    fail: (e) => {
							        uni.showModal({
							            content: "支払いに失敗しました: " + e.errMsg,
							            showCancel: false
							        })
							    },
								complete: () => {
									this.loading = false;
									this.disabled = false;
								}
							})
						}
						// Alipay H5支付
						if(data.type == 'alipay' && data.method == 'wap'){
							// 關閉loading
							this.loading = false;
							document.write(res);
						}
						// APP支付
						if((data.type == 'alipay' || data.type == 'wechat') && data.method == 'app'){
							let provider = data.type;
							if(data.type == 'wechat'){
								provider = 'wxpay';
							}
							uni.requestPayment({
							    provider: provider,
							    orderInfo: res,
							    success: (e) => {
							        console.log("success", e);
							        this.paySuccess();
							    },
							    fail: (e) => {
							        uni.showModal({
							            content: "支払いに失敗しました: " + e.errMsg,
							            showCancel: false
							        })
							    },
							    complete: () => {
									this.loading = false;
									this.disabled = false;
							    }
							})
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
	.my-mix-btn{
		width: 450rpx;
		font-size: 28rpx;
	}
</style>
