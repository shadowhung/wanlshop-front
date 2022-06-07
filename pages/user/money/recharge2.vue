<template>
	<view>
		<!-- 收銀臺 -->
		<view class="edgeInsetTop"></view>
		<view class="wanl-pay">
			<view class="money bg-white">
				<text class="title">儲値金額</text>
				<view class="margin-top price">
					<view class="symbol">
						<text>円</text>
					</view>
					<view class="symbol">
						<text>{{sendDate.money}}</text>
					</view>
				</view>
			</view>
			<view class="list-box" style="padding-left: 0px;text-align: center;">
				<br>
				<text @tap="copySharePath()">取引銀行:{{bankinfo.bank_kaihu}}</text><br>
				<text @tap="copySharePath()">銀行の住所:{{bankinfo.bank_add}}</text><br>
				<text @tap="copySharePath()">口座番号:{{bankinfo.bank_num}}</text><br><br>
			</view>
			
			
			<view style="text-align: center;" class="feedback-title">
			    <text>支払証明書をアップロード</text>
			</view>
			<view class="cu-bar bg-white">
				<view class="action">
					写真を閲覧
				</view>
				<view class="action">
					{{sendDate.images.length}}/8
				</view>
			</view>
			<view class="cu-form-group">
				<view class="grid col-4 grid-square flex-sub">
					<view class="bg-img" v-for="(image,index) in sendDate.images" :key="index">
					 <image :src="image" @tap="previewImage(sendDate.images, index)" mode="aspectFill"></image>
						<view class="cu-tag bg-red" @tap.stop="close(index)">
							<text class='wlIcon-shanchu2'></text>
						</view>
					</view>
					<view class="solids" @tap="chooseImg" v-if="sendDate.images.length<8">
						<text class="wlIcon-31paishe"></text>
					</view>
				</view>
			</view>
			
			<button class="mix-btn wanl-bg-redorange" @tap="confirm()" :loading="loading">振替を確認</button>
			<view class="list-box" style="color: red;">
				<p>チップ：</p>
				<p>１、ご入金完了後、通常2時間以内に着金します。</p>
				<p>２、午後21時以降に入金する場合、翌日9時以降に着金することがあります。</p>
				<p>３、ご不明な点がございましたら、時間内にオンラインカスタマーサービスにご相談ください</p>
				<p><br></p>
				<p><br></p>
				<p><br></p>
				<p><br></p>
			</view>
			
			<!--<view class="footer text-center">
				<view> © SHOPBTE支付 </view>
			</view>-->
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
				bankinfo:{
					bank_kaihu: "",
					bank_add: "",
					bank_name: "",
					bank_num: ""
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
					this.bankinfo = res
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
				name: '銀行帳號',
				describe: '推薦使用銀行帳號',
				Pay_zg: '2',
				method: method,
				state: true,
				select: true
			}, {
				name: '超商繳費',
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
							this.payList.push({name: '支付寶',describe: '',type: value,method: method,state: true,select: false});
						}else if(value == 'wxpay'){
							this.payList.push({name: '微信支付',describe: '推薦使用微信支付',type: 'wechat',method: method,state: true,select: false});
						}else if(value == 'baidu'){
							this.payList.push({name: '百度收銀臺',describe: '',type: value,method: method,state: true,select: false});
						}else if(value == 'appleiap'){
							this.payList.push({name: 'Apple支付',describe: '',type: 'apple',method: method,state: true,select: false});
						}
			        })
			    }
			});
			// #endif
		},
		methods: {
			copySharePath() {
				let that = this;
				that.showModal = false;
				uni.setClipboardData({
					data: this.bankinfo.usdt_add,
					success: function(data) {
						that.$wanlshop.msg('已复制到剪切板');
					},
					fail: function(err) {},
					complete: function(res) {}
				});
			},
			confirm1() {
				// #ifdef H5
				window.location.href = this.lineinfo.lineurl;
				// #endif
				// #ifdef APP-PLUS
				//plus.runtime.openWeb(res);
				plus.runtime.openURL(this.lineinfo.lineurl);
				// #endif
				return false;
			},
			//確認支付
			confirm() {
				let data = null;
				if (this.disabled) {
					return;
				}
				if(this.sendDate.money <= 0){
					this.$wanlshop.msg('請輸入儲値金額');
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
							    content: '是否已完成支付',
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
							    title: '微信支付',
							    content: '是否已完成支付',
							    success: (res) => {
							        if (res.confirm) {
							            this.paySuccess();
							        } else if (res.cancel) {
							            console.log('用戶點擊取消');
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
							            content: "支付失敗,原因為: " + e.errMsg,
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
							            content: "支付失敗,原因為: " + e.errMsg,
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
	.my-mix-btn{
		width: 450rpx;
		font-size: 28rpx;
	}
</style>
