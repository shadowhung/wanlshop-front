<template>
	<view>
		<!-- 收銀臺 -->
		<view class="edgeInsetTop"></view>
		<view class="wanl-pay">
			<view class="price-box">
				<text class="text-df">{{order_no}}</text>
				<text class="wanl-pip text-price margin-top-sm">{{price}}</text>
			</view>
			<view class="list-box">
				<view class="item" v-for="(item, index) in payList" :key="index">
					<text :class="'wlIcon-'+ item.type +'-pay'"></text>
					<view class="action">
						<text class="title wanl-pip">{{item.name}}</text>
						<view v-if="item.type == 'balance'">
							<text v-if="isbalance">利用可能残高 円{{user.money}}</text>
							<text v-else>残高不足です，利用可能残高 円{{user.money}}  <span @tap="$wanlshop.to('/pages/user/money/money')" style="color: red;"> 充電するには</span></text>
						</view>
						<view v-else>{{item.describe}}</view>
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
			<view class="list-box">
				<text>支払いパスワード<span @tap="$wanlshop.to('/pages/user/setting/paypass')" style="color: red;">(セットに移動)</span></text>
				<view class="codes">
					<view v-for="item in config.count" :key="item.key">
						<view class="input" @tap="hanldeOpenKeyboard" :class="{ active: currentFocus == item.index }">
							<template v-if="code[item.index - 1] != undefined">
								{{ code[item.index - 1] }}
							</template>
							<template v-else>
								<view v-if="currentFocus == item.index" class="shining"></view>
							</template>
						</view>
					</view>
				</view>
			</view>
			<button class="mix-btn wanl-bg-redorange" @tap="confirm()" :loading="loading" v-if="payNum == 1"> 支払いを確認する</button>
			<button class="mix-btn wanl-bg-redorange" @tap="confirm()" :loading="loading" v-else> 一括払い</button>
			<view class="footer text-center">
				<view class="text-sm" v-if="order_pay_no">取引番号：{{order_pay_no}}</view>
				<view> © shopyjp支払い </view>
			</view>
			<wanl-keyboard :open="keyboardVisible" @number="inputCode" @delete="deleteCode" @empty="emptyCode" @close="keyboardVisible = false" />
		</view>
		
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	export default {
		data() {
			return {
				loading: false,
				disabled: false,
				price:'0',
				isbalance: false,
				order_no: '',
				order_pay_no: '',
				payNum: 1, // 支払方法 獨立支付-合並支付
				payList: [],
				config: {
					count: [
						{
							index: 1,
							key: 'valid-code-input-1'
						},
						{
							index: 2,
							key: 'valid-code-input-2'
						},
						{
							index: 3,
							key: 'valid-code-input-3'
						},
						{
							index: 4,
							key: 'valid-code-input-4'
						},
						{
							index: 5,
							key: 'valid-code-input-5'
						},
						{
							index: 6,
							key: 'valid-code-input-6'
						}
					]
				},
				keyboardVisible: false,
				currentFocus: 1,
				mobile: '',
				code: [],
				style: {
					inputWidth: '40upx',
					inputHeight: '100upx'
				},
				countdown: 60,
				cTimer: null,
				event: '',
				pageroute: ''
			}
		},
		computed: {
			...mapState(['user'])
		},
		watch: {
			price(val, newval) {
				if(val <= parseFloat(this.$store.state.user.money)){
					this.isbalance = true;
					this.getPayment();
				}
			}
		},
		onLoad(option) {
			this.$api.post({
				url: '/wanlshop/pay/getBalance',
				success: res => {
					res = parseFloat(res).toFixed(0);
					this.$store.commit('user/setUserInfo', {money: res});
					// 獲取支付列表
					this.getPayment();
				}
			});
			if (option.data) {
				var sum = 0, data = JSON.parse(option.data), order_ids = [];
				if (data.length <= 1) {
					this.price = data[0].price;
					this.order_no = '注文番号：' + data[0].order_no;
					this.order_pay_no = data[0].pay_no;
					this.order_id = data[0].order_id;
				}else{
					data.forEach(item => {
						sum = this.$wanlshop.bcadd(sum, item.price);
						order_ids.push(item.order_id);
					});
					this.price = sum;
					this.order_id = order_ids;
					this.payNum = data.length;
					this.order_no = '一括払い ' + data.length + '注文';
				}
			}else if(option.order_id){
				uni.showLoading({
				    title: '結算中...'
				});
				this.$api.post({
					url: '/wanlshop/pay/getPay',
					data: {
						order_id: option.order_id
					},
					success: res => {
						uni.hideLoading();
						this.price = res.price;
						this.order_no = '注文番号：' + res.order_no;
						this.order_pay_no = res.pay_no;
						this.order_id = res.order_id;
					}
				});
			}else{
				console.log('不正アクセス');
			}
			
		},
		methods: {
			getPayment(){
				if(this.price <= parseFloat(this.$store.state.user.money)){
					this.isbalance = true;
				}
				
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
				this.payList = [{
					name: '残額払い',
					describe: '',
					type: 'balance',
					method: 'balance',
					state: this.isbalance ? true: false, // 是否可用
					select: this.isbalance ? true: false // 是否選中
				}];
				// #ifdef H5
				this.payList.push();
				/*{
					name: '支付寶',
					describe: '',
					type: 'alipay',
					method: method,
					state: true,
					select: false
				}, {
					name: 'WeChat Pay',
					describe: '推薦使用微信支付',
					type: 'wechat',
					method: method,
					state: true,
					select: this.isbalance ? false : true
				}*/
				// #endif
				// #ifndef H5
				/*uni.getProvider({
				    service: "payment",
				    success: (e) => {
				        e.provider.map((value) => {
							if (value == 'alipay') {
								this.payList.push({name: '支付寶',describe: '',type: value,method: method,state: true,select: false});
							}else if(value == 'wxpay'){
								this.payList.push({name: 'WeChat Pay',describe: '推薦使用微信支付',type: 'wechat',method: method,state: true,select: this.isbalance ? false : true});
							}else if(value == 'baidu'){
								this.payList.push({name: '百度收銀臺',describe: '',type: value,method: method,state: true,select: false});
							}
							else if(value == 'appleiap'){
								this.payList.push({name: 'ApplePay',describe: '',type: 'apple',method: method,state: true,select: false});
							}
				        })
				    }
				});*/
				// #endif
			},
			//確認支付
			confirm() {
				if (this.currentFocus <6) {
					this.$wanlshop.msg('支払いパスワードを入力してください');
					this.keyboardVisible = true;
					return false;
				}
				let data = null;
				if (this.disabled) {
					return;
				}
				this.payList.map((value,index,array) => {
				　　if(value.select){
						data = value;
					}else{
						return;
					}
				});
				// 判斷支付是否存在
				if (!data) {
					uni.showModal({
					    content: "お支払い方法を選択してください",
					    showCancel: false
					});
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
					url: '/wanlshop/pay/payment',
					data: {
						type: data.type,
						method: data.method,
						captcha: this.code.join(""),
						code: code,
						order_id: this.order_id
					},
					success: (res) => {
						// 余額支付/小程序支付
						if(data.type == 'balance'){
							this.loading = false;
							this.$store.commit('user/setUserInfo', {
								money: this.$wanlshop.bcsub(this.$store.state.user.money, this.price)
							});
							this.paySuccess();
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
							// 異步查詢是否支付成功
							window.location.href = res;
						}
						// 支付寶 H5支付
						if(data.type == 'alipay' && data.method == 'wap'){
							this.loading = false;
							this.$store.commit('statistics/order', {
								pay: this.$wanlshop.bcsub(this.$store.state.statistics.order.pay, this.payNum),
								delive: this.$wanlshop.bcadd(this.$store.state.statistics.order.delive, this.payNum)
							});
							document.write(res);
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
							    }
							})
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
			inputCode(e) {
				this.code[this.currentFocus - 1] = e;
				if (this.currentFocus == 6) {
					this.$api.post({
						url: '/wanlshop/pay/getpaypass',
						data: {
							captcha: this.code.join(""),
						},
						success: res => {
							this.confirm();
						}
					});
				}
				if (this.currentFocus <= 6) {
					this.currentFocus++;
				}
			},
			deleteCode() {
				this.currentFocus--;
				this.code.splice(-1, 1);
			},
			emptyCode(){
				this.code = [];
				this.currentFocus = 0;
			},
			hanldeOpenKeyboard() {
				this.keyboardVisible = true;
			},
			// 支付成功
			paySuccess(){
				this.loading = false;
				this.$store.commit('statistics/order', {
					pay: this.$wanlshop.bcsub(this.$store.state.statistics.order.pay, this.payNum),
					delive: this.$wanlshop.bcadd(this.$store.state.statistics.order.delive, this.payNum)
				});
				this.$wanlshop.to('/pages/page/success?type=pay');
			}
		}
	}
</script>

<style>
	@import url("auth.css");
	page{
		background-color: white;
	}
	radio-group {
	    display: block;
	}
	
	.numberkeyboard {
	     z-index: 999;
	}
	.keys .key{
	    background-color: white;
	}
</style>
