<template>
	<view>
		<view class="edgeInsetTop"></view>
		<view class="page-background"></view>
		<view><a>クリックしてダウンロードAPP</a></view>
		<canvas class="qrcode-canvas" canvas-id="qrcode" style="width: 200px;height: 200px;" />
		<view class="page-container">
			<view class="content">
				<!--<image v-if="posterSrc" :src="posterSrc" mode="aspectFit"></image>-->
				<view class="poster-image"><image :src="$wanlshop.oss(posterTemplates[0].thumbnail_url, 0, 88)" mode="aspectFit"></image></view>
				<!--<canvas class="poster-canvas" canvas-id="poster" :style="{ width: `${postercanvas_width}px`, height: `${postercanvas_height}px` }" />-->
			</view>
		</view>
		<view class="page-foot">
			<view class="template-list">
				<view class="template-item" @tap="download()">
					<button>クリックしてダウンロードAPP</button>
				</view>
				<!--<view class="template-item" v-for="(x, xi) in posterTemplates" :key="xi" @tap="create(x)" :class="{ checked: x.checked }" :style="{ width: x.thumbnail_width+'px' }">
					<image :src="$wanlshop.oss(x.thumbnail_url, 0, 88)" />
				</view>-->
				<!-- #ifdef H5 -->
					<view class="tips text-sm wanl-gray">
						<text class="wlIcon-31tishi"></text> 写真を長押しして保存します
					</view>
				<!-- #endif -->
				<!-- #ifndef H5 -->
					<view class="tips text-sm wanl-orange" @tap="save()">
						<text class="wlIcon-image margin-right-xs"></text>アルバムに保存
					</view>
				<!-- #endif -->
			</view>
		</view>
	</view>
</template>

<script>
import uQRCode from '@/common/uqrcode.js';
export default {
	data() {
		return {
			QRCodeText: '公共料金',
			QRCodeSrc: '',
			posterSrc: '',
			postercanvas_width: 0, // 画布宽度
			postercanvas_height: 0, // 画布高度
			posterTemplates: []
		};
	},
	onLoad(option) {
		// 促す
		/*uni.showLoading({
			title: '二維碼生成中',
			mask: true
		});*/
		if(option.url){
			this.QRCodeText = option.url
		}else{
			this.QRCodeText = this.$store.state.common.appConfig.domain +'/pages/user/info?id='+ this.$store.state.user.id +'&QRtype=user';
		}
		this.loadData();
	},
	methods: {
		// 二维碼配置
		async loadData(option) {
			this.$api.post({
				url: '/wanlshop/common/qrcode',
				success: res => {
					// 下載到本地
					res.forEach((item, index, arr) => {
						if (item.template != 'wanlshopqr') {
							// 远程下載背景
							uni.downloadFile({
								url: this.$wanlshop.oss(item.background_url, 350, 0),
								success: e => {
									item.background_url = e.tempFilePath;
								}
							});
							// 远程下載圖标
							uni.downloadFile({
								url: this.$wanlshop.oss(item.logo_src, 40, 40),
								success: e => {
									item.logo_src = e.tempFilePath;
								}
							});
						}
					});
					// 赋值
					this.posterTemplates = res;
					if(res.length == 0){
						uni.showModal({
						    title: '重要なヒント',
						    content: 'プラットフォームがQRコードで構成されていません。バックグラウンドシステム管理に移動してください[QRコードの構成]',
						    success: (r)=> {
								this.$wanlshop.back(1);
						    }
						});
					}else{
						/*uni.showLoading({
							title: '加載配寘中',
							mask: true
						});*/
					}
					// 生成二维碼
					/*uQRCode.make({
						canvasId: 'qrcode',
						text: this.QRCodeText,
						size: 200,
						success: res => {
							this.QRCodeSrc = res;
							// 默認生成第一张海報
							this.create(this.posterTemplates[0]);
						}
					});*/
				}
			});
		},
		create(posterTemplate) {
			if (posterTemplate.checked) {
				return;
			}
			uni.showLoading({
				title: 'ポスター世代',
				mask: true
			});
			this.posterTemplates.forEach(x => {
				x.checked = false;
			});
			posterTemplate.checked = true;

			this.postercanvas_width = posterTemplate.canvas_width;
			this.postercanvas_height = posterTemplate.canvas_height;

			this.posterSrc = '';
			setTimeout(() => {
				switch (posterTemplate.template) {
					case 'wanlshopqrlist001':
						this.wanlshopqrlist001({
							canvasId: 'poster',
							canvas_width: posterTemplate.canvas_width,
							canvas_height: posterTemplate.canvas_height,
							backgroundSrc: posterTemplate.background_url,
							logoSrc: posterTemplate.logo_src,
							name: this.$store.state.user.username,
							text: '長押ししてQRコードをスキャンします~',
							QRCodeSrc: this.QRCodeSrc,
							success: res => {
								this.posterSrc = res;
								uni.hideLoading();
							}
						});
						break;
					case 'wanlshopqr':
						this.wanlshopqr({
							canvasId: 'poster',
							canvas_width: posterTemplate.canvas_width,
							canvas_height: posterTemplate.canvas_height,
							QRCodeSrc: this.QRCodeSrc,
							success: res => {
								this.posterSrc = res;
								uni.hideLoading();
							}
						});
						break;
				}
			}, 100);
		},
		save() {
			uni.saveImageToPhotosAlbum({
				filePath: this.posterSrc,
				success: () => {
					this.$wanlshop.msg('正常に保存');
				}
			});
		},
		download (){
			// #ifdef H5
			window.location.href = this.posterTemplates[0].luodiurl;
			// #endif
			// #ifdef APP-PLUS
			plus.runtime.openURL(this.posterTemplates[0].luodiurl);
			// #endif
		},
		wanlshopqrlist001(options) {
			let { canvas_width, canvas_height, backgroundSrc, logoSrc, name, text, QRCodeSrc } = options;
			// 绑定画布
			var ctx = uni.createCanvasContext(options.canvasId);
			// 清除画布
			ctx.clearRect(0, 0, canvas_width, canvas_height);

			// 獲取背景圖片信息
			let backgroundImageInfo = {
				width: '500',
				height: '667'
			};
			// 設置背景圖片宽高
			let backgroundWidth = canvas_width;
			let backgroundHeight = (backgroundImageInfo.height * canvas_width) / backgroundImageInfo.width;
			// 填充背景圖片
			ctx.drawImage(backgroundSrc, 0, 0, backgroundWidth, backgroundHeight);
			// 設置标志圖片宽高坐标
			let logoWidth = 80;
			let logoHeight = 80;
			let logoX = 36;
			let logoY = backgroundHeight + (canvas_height - backgroundHeight) / 2 - logoHeight / 2;
			// 绘製為圆形标志
			ctx.save();
			ctx.beginPath();
			// 先画個圆  前两個參數確定了圆心 （x,y） 坐标  第三個參數是圆的半径  四參數是绘圖方向  默認是false，即顺时针
			ctx.arc(logoWidth / 2 + logoX, logoHeight / 2 + logoY, logoWidth / 2, 0, Math.PI * 2, false);
			ctx.closePath();
			// 画好了圆 剪切  原始画布中剪切任意形状和尺寸。一旦剪切了某個区域，则所有之後的绘圖都會被限製在被剪切的区域内 这也是我们要save上下文的原因
			ctx.clip();
			// 填充标志圖片
			ctx.drawImage(logoSrc, logoX, logoY, logoWidth, logoHeight);
			// 恢複之前保存的绘圖上下文 恢複之前保存的绘圖上下午即状态 还可以继续绘製
			ctx.restore();

			// 名称最大长度限製 10，超出為省略號
			if (name.length > 10) {
				name = name.substring(0, 10) + '...';
			}
			// 計算文字定位距离
			let nameX = logoX + logoWidth + 10;
			let nameY = logoY + 32;
			let nameFontSize = 20;
			// 設置名称文字样式
			ctx.setFillStyle('#000000');
			ctx.setFontSize(nameFontSize);
			// 填充名称到画布
			ctx.fillText(name, nameX, nameY);

			// 計算文字定位距离
			let textX = nameX;
			let textY = nameY + 32;
			let textFontSize = 16;
			// 設置分享文案文字样式
			ctx.setFillStyle('#999999');
			ctx.setFontSize(textFontSize);
			// 填充分享文案到画布
			ctx.fillText(text, textX, textY);

			// 設置二维碼圖片宽高
			let QRCodeWidth = 100;
			let QRCodeHeight = 100;
			// 計算二维碼圖片定位距离
			let QRCodeX = canvas_width - QRCodeWidth - 36;
			let QRCodeY = backgroundHeight + (canvas_height - backgroundHeight) / 2 - QRCodeHeight / 2;
			// 填充二维碼圖片
			ctx.drawImage(QRCodeSrc, QRCodeX, QRCodeY, QRCodeWidth, QRCodeHeight);

			// 輸出到画布中
			ctx.draw(false, () => {
				// 绘圖全部完成後生成文件路径
				uni.canvasToTempFilePath({
					canvasId: options.canvasId,
					fileType: 'jpg',
					success: res => {
						options.success && options.success(res.tempFilePath);
					}
				});
			});
		},
		wanlshopqr(options) {
			let { canvas_width, canvas_height, QRCodeSrc } = options;
			// 绑定画布
			var ctx = uni.createCanvasContext(options.canvasId);
			// 清除画布
			ctx.clearRect(0, 0, canvas_width, canvas_height);
			// 填充二维碼圖片，並設置边距
			ctx.drawImage(QRCodeSrc, 15, 15, canvas_width - 30, canvas_height - 30);
			// 輸出到画布中
			ctx.draw(false, () => {
				// 绘圖全部完成後生成文件路径
				uni.canvasToTempFilePath({
					canvasId: options.canvasId,
					fileType: 'jpg',
					success: res => {
						options.success && options.success(res.tempFilePath);
					}
				});
			});
		}
	}
};
</script>

<style>
.page-background {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 10;
	background-color: #f1f1f1;
}

.page-container {
	position: relative;
	z-index: 20;
}

.qrcode-canvas {
	position: fixed;
	right: 100vw;
	bottom: 100vh;
	z-index: -999;
}

.content {
	width: 100%;
	height: calc(100vh - 44px - 150px);
	overflow-y: scroll;
}

.poster-image {
	width: 100%;
	height: 100%;
	min-height: 500rpx;
	padding: 80rpx;
	box-sizing: border-box;
}

.poster-image image {
	width: 100%;
	height: 100%;
}

.poster-canvas {
	position: fixed;
	right: 100vw;
	bottom: 100vh;
}

.page-foot {
	position: fixed;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 30;
	background-color: #e5e5e5;
	padding-bottom: env(safe-area-inset-bottom);
}

.template-list {
	display: flex;
	position: relative;
	height: 100px;
}
.template-list .tips {
	position: absolute;
	display: flex;
	align-items: center;
	justify-items: center;
	justify-content: center;
	top: -60rpx;
	width: 100%;
}
.template-list .tips .wlIcon-31tishi{
	font-size: 32rpx;
}
.template-item {
	position: relative;
	width: 100%;
	margin: 20px;
	text-align: center;
}

.template-item::before {
	content: '';
	position: absolute;
	z-index: 10;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
}

.template-item.checked::before {
	border: 2px solid #44aa33;
}

.template-item image {
	display: block;
	width: 100%;
	height: 100%;
}
</style>
