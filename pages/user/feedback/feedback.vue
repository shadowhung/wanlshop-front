<template>
    <view class="wanl-feedback">
		<view class="edgeInsetTop"></view>
        <view class="feedback-title">
            <view>質問と意見</view>
            <!--<view class="feedback-quick text-red" @tap="chooseMsg">
				<text class="margin-right-xs">快速鍵入</text>
				<text class="wlIcon-fanhui4"></text>
			</view>-->
        </view>
		<view class="cu-form-group">
			<textarea maxlength="-1" v-model="sendDate.content" placeholder-class="placeholder" placeholder="質問やコメントを詳しく説明してください..."></textarea>
		</view>
        <view class="feedback-title">
            <text>質問のスクリーンショット</text>
        </view>
		<view class="cu-bar bg-white">
			<view class="action">
				写真をプレビューするにはクリックしてください
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
		<view class='feedback-title'>
		    <text>LINE/電話番号</text>
		</view>
		<view class="cu-form-group">
			<input placeholder="私たちがあなたに連絡するためのオプション" placeholder-class="placeholder" v-model="sendDate.contact"></input>
		</view>
        <view class='feedback-title feedback-star-view'>
            <text>アプリの評価</text>
            <view class="feedback-star-view">
				<wanl-rate :quantity="5" :size="24" normal="#dadada" :current="sendDate.score"  @change="chooseStar"/>
            </view>
        </view>
		<view class="wanlian cu-bar tabbar foot flex flex-direction">
			<button class="cu-btn wanl-bg-redorange lg" @tap="send">参加する</button>
		</view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                msgContents: ["インターフェイスの表示が乱雑です", "スロースタート，カードアウト", "UI直接見ることはできません，醜い泣き", "散発的な内訳"],
                sendDate: {
                    score: 0,
                    content: "",
					images: [],
                    contact: ""
                }
            }
        },
        onLoad() {
			// 獲取系統信息
			let sysinfo = uni.getSystemInfoSync();
            this.sendDate = Object.assign({
				device: {
					language: sysinfo.language,
					brand: sysinfo.brand,
					model: sysinfo.model,
					system: sysinfo.system,
					// #ifdef MP-ALIPAY
					platform: '支付寶小程式',
					// #endif
					// #ifdef MP-BAIDU
					platform: '百度小程式',
					// #endif
					// #ifdef MP-QQ
					platform: 'QQ小程序',
					// #endif
					// #ifdef MP-TOUTIAO
					platform: '頭條小程序',
					// #endif
					// #ifdef MP-WEIXIN
					platform: '微信小程序',
					// #endif
					// #ifdef H5
					platform: 'H5',
					// #endif
					// #ifdef APP-PLUS
					platform: sysinfo.platform,
					startupTime: plus.runtime.startupTime, //獲取当前应用的啟動时間戳
					launchLoadedTime: plus.runtime.launchLoadedTime, //獲取当前应用首頁加載的时間
					uniVersion: plus.runtime.uniVersion, //客戶端uni-app运行环境的版本號
					innerVersion: plus.runtime.innerVersion, //客戶端5+运行环境的内部版本號
					versionCode: plus.runtime.versionCode, //客戶端的版本號
					version: plus.runtime.version, //客戶端的版本名称
					origin: plus.runtime.origin //应用安装來源
					// #endif
				}
			}, this.sendDate);
        },
        methods: {
            chooseMsg() { //快速輸入
                uni.showActionSheet({
                    itemList: this.msgContents,
                    success: (res) => {
                        this.sendDate.content = this.msgContents[res.tapIndex];
                    }
                })
            },
            chooseStar(e) { //点击評星
                this.sendDate.score = e.index;
            },
			chooseImg() { //选择圖片
			    uni.chooseImage({
			        sourceType: ["camera", "album"],
			        sizeType: "compressed",
			        count: 8 - this.sendDate.images.length,
			        success: res => {
						this.$api.get({
							url: '/wanlshop/common/uploadData',
							success: updata => {
								for (let i = 0; i < res.tempFilePaths.length; i++) {
									// 讀取圖片宽高
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
            send() { //發送反饋
                this.$api.post({
                	url: '/wanlshop/feedback/add',
					data: this.sendDate,
                	success: res => {
                		this.$wanlshop.to('/pages/page/success?type=feedback');
                	}
                });
            }
        }
    }
</script>

<style>
	/*问题反饋*/
	.feedback-title {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 25rpx;
		color: #666;
	}
	.feedback-star-view.feedback-title {
		justify-content: flex-start;
		margin: 0;
	}
	.feedback-quick {
		position: relative;
	}
	.feedback-star-view {
		margin-left: 20upx;
	}
	.cu-bar .action:first-child {
	    font-size: 26rpx;
	}
	.solids::after {
	    border: 2px dashed #c5c5c5;
	}
	.wanlian.cu-bar.tabbar {
		background-color: transparent;
	}
	.wanlian.cu-bar.tabbar .cu-btn {
		width: calc(100% - 50rpx);
	}
	.wanlian.cu-bar.tabbar .cu-btn.lg {
		font-size: 32rpx;
		height: 86rpx;
	}
</style>
