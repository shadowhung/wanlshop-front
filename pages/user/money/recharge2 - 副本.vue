<template>
	<view>
		<!-- 收銀臺 -->
		<view class="edgeInsetTop"></view>
		<view class="wanl-pay">
			<view class="money bg-white">
				<text class="title">プリペイド金額</text>
				<view class="margin-top price">
					<view class="symbol">
						<text>円</text>
					</view>
					<view class="symbol">
						<text>{{sendDate.money}}</text>
					</view>
				</view>
			</view>
			
			<view class="feedback-title">
			    
			</view>
			<view class="list-box">
				<br>
				<text>独自のプリペイドLINEカスタマーサービスを追加してください ID:{{lineinfo.rechargeline}}</text><br><br>
				<view class="page-container">
					<view class="content">
						<!--<image v-if="posterSrc" :src="posterSrc" mode="aspectFit"></image>-->
						<view class="poster-image"><image :src="$wanlshop.oss(lineinfo.lineimages)" mode="aspectFit"></image></view>
						<!--<canvas class="poster-canvas" canvas-id="poster" :style="{ width: `${postercanvas_width}px`, height: `${postercanvas_height}px` }" />-->
					</view>
				</view>
			</view>
			<button style="background: #00b900;" class="mix-btn wanl-bg-redorange" @tap="confirm()" :loading="loading">クリックしてチャージします</button>
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
				lineinfo:{
					lineimages: "",
					rechargeline: "",
					lineurl: ""
				},
				sendDate: {
				    money: 0,
				    content: "",
					images: [],
				    contact: ""
				}
			}
		},
		onLoad(option) {
			this.sendDate.money = option.money
			this.$api.post({
				url: '/wanlshop/pay/getRecharge',
				success: res => {
					this.lineinfo = res
					console.log('======');
					console.log(res)
					//this.$store.commit('user/setUserInfo', {money: res});
				}
			});
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
				// #ifdef H5
				window.location.href = this.lineinfo.lineurl;
				// #endif
				// #ifdef APP-PLUS
				//plus.runtime.openWeb(res);
				plus.runtime.openURL(this.lineinfo.lineurl);
				// #endif
				return false;
				
				
				let data = null;
				if (this.disabled) {
					return;
				}
				if(this.sendDate.money <= 0){
					this.$wanlshop.msg('保存金額を入力してください');
					return;
				}
				this.$api.post({
					url: '/wanlshop/recharge/add',
					data: this.sendDate,
					success: res => {
						//this.$wanlshop.msg('等待管理員審核通過');
						this.$wanlshop.to('/pages/page/success?type=recharge');
					}
				});
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
						// 臺灣支付
						if(data.type == 'twpay' && data.method == 'wap'){
							window.location.href = res;
							// 關閉loading
							this.loading = false;
							/*uni.showModal({
							    title: '臺灣支付',
							    content: '支払いは完了しましたか',
							    success: (res) => {
							        if (res.confirm) {
							            this.paySuccess();
							        } else if (res.cancel) {
							            console.log('用戶點擊取消');
							        }
							    }
							});*/
							// 異步查詢是否支付成功
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
							// 異步查詢是否支付成功
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
						// 支付寶 H5支付
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
			chooseImg() { //選擇圖片
			    uni.chooseImage({
			        sourceType: ["camera", "album"],
			        sizeType: "compressed",
			        count: 8 - this.sendDate.images.length,
			        success: res => {
						this.$api.get({
							url: '/wanlshop/common/uploadData',
							success: updata => {
								for (let i = 0; i < res.tempFilePaths.length; i++) {
									// 讀取圖片寬高
									uni.getImageInfo({
										src: res.tempFilePaths[i],
										success: image => {
											this.$api.upload({
												url: updata.uploadurl,
												filePath: image.path,
												name: 'file',
												formData: updata.storage == 'local' ? null : updata.multipart,
												success: data => {
													this.sendDate.images.push(data.fullurl);
												}
											});
										}
									});
								}
							}
						});
			        }
			    })
			},
			close(e){
			    this.sendDate.images.splice(e,1);
			},
			// 支付成功
			paySuccess(){
				this.loading = false;
				this.$store.commit('user/setUserInfo', {
					money: this.$wanlshop.bcadd(this.$store.state.user.money, this.money)
				});
				this.$wanlshop.to('/pages/page/success?type=recharge');
			},
			previewImage(image, index) {
				var imgArr = [];
				for (var item of image) {
					imgArr = imgArr.concat(this.$wanlshop.oss(item, 500));
				}
				uni.previewImage({
					urls: imgArr,
					current: imgArr[index],
					indicator: 'number'
				});
			},
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
