<template>
	<view class="wanl-chat">
		<view @touchstart="hideDrawer">
			<scroll-view
				class="cu-chat"
				scroll-y="true"
				:scroll-with-animation="scrollAnimation"
				:scroll-top="scrollTop"
				:scroll-into-view="scrollToView"
				upper-threshold="50"
			>
				<view v-for="(row, index) in msgList" :key="index" :id="'msg' + row.id">
					<view class="cu-item self" v-if="row.form.id == user_id">
						<view class="main" v-if="row.message.type == 'text'">
							<view class="content bg-green"><rich-text :nodes="row.message.content.text"></rich-text></view>
						</view>
						<!-- 圖片消息 -->
						<view class="main" v-if="row.message.type == 'img'">
							<image
								:src="row.message.content.url"
								@tap="showPic(row.message)"
								:style="{ width: row.message.content.w + 'px', height: row.message.content.h + 'px' }"
							></image>
						</view>
						<!-- 語音消息 -->
						<view class="main" v-if="row.message.type == 'voice'" @tap="playVoice(row.message)" :class="playMsgid == row.message.id ? 'play' : ''">
							<view class="action text-bold text-grey" style="padding-right: 2rpx;">
								{{ row.message.content.length }}
								<text class="wlIcon-miao"></text>
							</view>
							<view class="content bg-green">
								<text :style="{ width: row.message.content.length * 6 + 'rpx' }"></text>
								<text class="wlIcon-yuyinyou text-xxl padding-left-xl"></text>
							</view>
						</view>
						<view class="cu-avatar round" :style="{ backgroundImage: 'url(' + $wanlshop.oss(row.form.avatar, 44, 44, 2, 'avatar') + ')' }"></view>
					</view>

					<view class="cu-item" v-else>
						<view class="cu-avatar round" :style="{backgroundImage: 'url('+ $wanlshop.oss(row.form.avatar) +')'}" v-if="row.form.avatar"></view>
						<view class="cu-avatar round" :style="{backgroundImage: 'url('+ $wanlshop.appstc('/common/logo.png') +')'}" v-else></view>
						<!-- 文字消息 -->
						<view class="main" v-if="row.message.type == 'text'">
							<view class="content"><rich-text :nodes="row.message.content.text"></rich-text></view>
						</view>
						<!-- 列表消息 -->
						<view class="main" v-if="row.message.type == 'list'">
							<view class="content">
								<view class="list">
									<view v-if="row.message.content.length > 0">
										<view>
											聞きたいですか？
											<view class="ai solid-top solid-bottom">
												<view v-for="(item, index) in row.message.content" :key="item.id" @tap="aiSend(item.keywords?item.keywords:'キーワードが設定されていません')" class="text-cut"><text>{{item.title}}</text></view>
											</view>
										</view>
										<view>
											どちらでもない？ あなたはできる <text @tap="aiSend('手動カスタマーサービス')">ここをクリック</text> ，または返信人工的な
										</view>
									</view>
									<view v-else>
										関連するヘルプコンテンツはありません，<text @tap="aiSend('手動カスタマーサービス')">ここをクリック</text> または返信人工的な
									</view>
								</view>
							</view>
						</view>
						<!-- 文章消息 -->
						<view class="main" v-if="row.message.type == 'article'" @tap="onDetails(row.message.content.id, row.message.content.title)">
							<view class="content">
								<view style="width: 100%;">
									<view>
										{{row.message.content.title}}
									</view>
									<view class="article solid-top">
										<rich-text :nodes="row.message.content.content"></rich-text>
									</view>
								</view>
							</view>
						</view>
						<!-- 圖片消息 -->
						<view class="main" v-if="row.message.type == 'img'">
							<image
								:src="row.message.content.url"
								@tap="showPic(row.message)"
								:style="{ width: row.message.content.w + 'px', height: row.message.content.h + 'px' }"
							></image>
						</view>
						<view class="date">{{$wanlshop.timeToChat(row.createtime)}} </view>
					</view>
				</view>
			</scroll-view>
		</view>
		<!-- 抽屜欄 -->
		<view class="popup-layer" :class="{showLayer: popupLayerClass}" @touchmove.stop.prevent="discard">
			<!-- 表情 -->
			<view :class="{ hidden: hideEmoji }">
				<view class="emoji">
					<scroll-view class="emojinav" scroll-x scroll-with-animation>
						<view class="item">
							<view
								:class="item == TabCur ? 'emojibg' : ''"
								v-for="(item, index) in emojiList.categories"
								:key="index"
								@tap="tabSelect"
								:data-id="item"
								:style="{ backgroundImage: 'url(' + emojiList.groups[item][0].url + ')' }"
							></view>
						</view>
					</scroll-view>
					<!-- 列表 -->
					<scroll-view v-for="(emoji, groups) in emojiList.groups" :key="groups" v-if="TabCur == groups" class="subject" scroll-y scroll-with-animation>
						<view class="item grid margin-bottom text-center col-5">
							<view v-for="(item, index) in emoji" :key="index" @tap="addEmoji(item.value)" :style="{ backgroundImage: 'url(' + item.url + ')' }"></view>
						</view>
					</scroll-view>
				</view>
			</view>
			<!-- 更多功能-->
			<view class="solid-top" :class="{ hidden: hideMore }">
				<view class="opmenu solid-top">
					<view class="box" @tap="chooseImage">
						<view class="icon"><text class="wlIcon-tupian1"></text></view>
						<text class="text-sm">写真</text>
					</view>
					<!-- #ifndef H5 -->
					<view class="box" @tap="camera">
						<view class="icon"><text class="wlIcon-31paishexuanzhong"></text></view>
						<text class="text-sm">シュート</text>
					</view>
					<!-- #endif -->
				</view>
			</view>
		</view>
		<!-- 底部輸入欄 -->
		<view class="input-box" :class="{ emptybottom: emptybottom, showLayer: popupLayerClass}" @touchmove.stop.prevent="discard">
			<!-- H5下不能錄音，輸入欄布局改動一下 -->
			<!-- #ifndef H5 -->
			<view class="voice"><view :class="isVoice ? 'wlIcon-jianpanqiehuan' : 'wlIcon-yuyin'" @tap="switchVoice"></view></view>
			<!-- #endif -->

			<!-- #ifdef H5 -->
			<view class="more" @tap="showMore"><view class="wlIcon-yuanquanjiahao"></view></view>
			<!-- #endif -->
			<view class="textbox">
				<view
					class="voice-mode"
					:class="[isVoice ? '' : 'hidden', recording ? 'recording' : '']"
					@touchstart="voiceBegin"
					@touchmove.stop.prevent="voiceIng"
					@touchend="voiceEnd"
					@touchcancel="voiceCancel"
				>
					{{ voiceTis }}
				</view>
				<view class="text-mode" :class="isVoice ? 'hidden' : ''">
					<view class="box">
						<textarea auto-height="true" maxlength="300" :show-confirm-bar="false" cursor-spacing="90" v-model="textMsg" @focus="textareaFocus" @blur="textareaBlur" @confirm="sendText" />
					</view>
					<view class="em" @tap="chooseEmoji"><view class="wlIcon-biaoqing2"></view></view>
				</view>
			</view>
			<!-- #ifndef H5 -->
			<view class="more" @tap="showMore" style="margin-right: -12rpx;"><view class="wlIcon-yuanquanjiahao"></view></view>
			<!-- #endif -->
			<view class="send" :class="isVoice ? 'hidden' : ''" @tap="sendText">
				<text class="wlIcon-zhifeiji" v-if="textMsg"></text>
				<text class="wlIcon-fasong" v-else></text>
			</view>
		</view>
		<!-- 錄音UI效果 -->
		<view class="record" :class="recording ? '' : 'hidden'">
			<view class="ing" :class="willStop ? 'hidden' : ''"><view class="wlIcon-huatong01"></view></view>
			<view class="cancel" :class="willStop ? '' : 'hidden'"><view class="wlIcon-shanchu2"></view></view>
			<view class="tis" :class="willStop ? 'change' : ''">{{ recordTis }}</view>
		</view>
	</view>
</template>
<script>
const emotions = require('@/static/json/emotions.json');
export default {
	data() {
		return {
			user_id: this.$store.state.user.id,
			avatar: this.$store.state.user.avatar,
			nickname: this.$store.state.user.nickname,
			to_id: 0,
			textMsg: '', //文字消息
			scrollAnimation: false,
			scrollTop: 0,
			scrollToView: '',
			msgList: [],
			msgImgList: [],
			// 取消底部
			emptybottom: false,
			//錄音相關參數
			// #ifndef H5
			//H5不能錄音
			RECORDER: uni.getRecorderManager(),
			// #endif
			isVoice: false,
			voiceTis: '話し続ける',
			recordTis: '上にスワイプして送信をキャンセルします',
			recording: false,
			willStop: false,
			initPoint: { identifier: 0, Y: 0 },
			recordTimer: null,
			recordLength: 0,
			//播放語音相關參數
			AUDIO: uni.createInnerAudioContext(),
			playMsgid: null,
			VoiceTimer: null,
			// 抽屜參數
			popupLayerClass: false,
			// more參數
			hideMore: true,
			//表情定義
			//表情
			TabCur: 'デフォルト',
			hideEmoji: true,
			emojiList: this.emojiData(),
			QnUrl: ''
		};
	},
	onLoad(option) {
		let wanlLogin = uni.getStorageSync("wanlshop:user");
		
		this.user_id  = wanlLogin.id;
		this.avatar   = wanlLogin.avatar;
		this.username = wanlLogin.username;
		this.nickname = wanlLogin.nickname;
		
		
		this.loadData();
		//語音自然播放結束
		this.AUDIO.onEnded(res => {
			this.playMsgid = null;
		});
		// #ifndef H5
		//錄音開始事件
		this.RECORDER.onStart(e => {
			this.recordBegin(e);
		});
		//録音終了事件
		this.RECORDER.onStop(e => {
			this.recordEnd(e);
		});
		// #endif
		// 監聽服務消息
		uni.$on('onService', this.onChat);
	},
	onShow() {
		this.scrollTop = 9999999;
	},
	methods: {
		// 自動回復
		async loadData() {
			this.$api.post({
				url: '/wanlshop/chat/hello',
				data: {
					id: 1,
					type: 'service',
					form_id: this.user_id
				}
			});
		},
		// 發送消息
		sendMsg(content, type) {
			let lastid = 2;
			if (this.msgList.length) {
				lastid = this.msgList[this.msgList.length - 1].id;
				lastid++;
			}
			let data = {
				id: lastid,
				type: 'service',
				to_id: this.to_id,
				form: {
					id: this.user_id, //本人
					avatar: this.avatar,
					name: this.nickname
				},
				message: {
					type: type,
					content: content
				},
				createtime: parseInt(new Date().getTime() / 1000)
			};
			// 深拷貝移除數據綁定
			this.onChat(JSON.parse(JSON.stringify(data)), true);
			// 發送給服務器
			this.$api.post({
				url: '/wanlshop/chat/service',
				data: data
			});
		},

		// 接收服務器和本地消息
		onChat(msg, type) {
			if (!type) {
				this.to_id = msg.form.id;
				msg.form.hasOwnProperty('name')?this.$wanlshop.title(msg.form.name):'';
			}
			if (msg.message.type == 'list') {
				this.addListMsg(msg);
			}
			if (msg.message.type == 'article') {
				this.addArticleMsg(msg);
			}
			if (msg.message.type == 'text') {
				this.addTextMsg(msg);
			}
			if (msg.message.type == 'voice') {
				this.addVoiceMsg(msg);
			}
			if (msg.message.type == 'img') {
				this.addImgMsg(msg);
			}
			if (msg.message.type == 'end') {
				this.$wanlshop.msg(msg.message.content);
			}
			// 滾動到底
			this.$nextTick(() => {
				this.scrollToView = 'msg' + msg.id;
			});
		},
		
		// 添加語音消息到列表
		addListMsg(msg) {
			this.msgList.push(msg);
		},
		// 添加語音消息到列表
		addArticleMsg(msg) {
			this.msgList.push(msg);
		},
		// 添加文字消息到列表
		addTextMsg(msg) {
			msg.message.content.text = this.replaceEmoji(msg.message.content.text);
			this.msgList.push(msg);
		},
		// 添加語音消息到列表
		addVoiceMsg(msg) {
			this.msgList.push(msg);
		},
		// 添加圖片消息到列表
		addImgMsg(msg) {
			msg.message.content = this.setPicSize(msg.message.content);
			this.msgImgList.push(msg.message.content.url);
			this.msgList.push(msg);
		},

		// 選擇圖片發送
		chooseImage() {
			this.getImage('album');
		},
		//拍照發送
		camera() {
			this.getImage('camera');
		},
		//選照片 or 拍照
		getImage(type) {
			this.hideDrawer();
			uni.chooseImage({
				sourceType: [type],
				sizeType: ['original', 'compressed'], //可以指定是原圖還是壓縮圖，デフォルト二者都有
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
												this.sendMsg({ url: data.fullurl, w: image.width, h: image.height }, 'img');
											}
										});
									}
								});
							}
						}
					});
				}
			});
		},
		// 發送文字消息
		sendText() {
			this.hideDrawer(); //隱藏抽屜
			if (!this.textMsg) {
				return;
			}
			let msg = { text: this.textMsg };
			this.sendMsg(msg, 'text');
			this.textMsg = ''; //清空輸入框
		},
		// AI發送
		aiSend(text) {
			this.sendMsg({ text: text }, 'text');
		},
		// 預覽圖片
		showPic(message) {
			uni.previewImage({
				indicator: 'none',
				current: message.content.url,
				urls: this.msgImgList
			});
		},
		// 播放語音
		playVoice(message) {
			this.playMsgid = message.id;
			this.AUDIO.src = message.content.url;
			this.$nextTick(() => {
				this.AUDIO.play();
			});
		},
		// 錄音開始
		voiceBegin(e) {
			if (e.touches.length > 1) {
				return;
			}
			this.initPoint.Y = e.touches[0].clientY;
			this.initPoint.identifier = e.touches[0].identifier;
			this.RECORDER.start({ format: 'mp3' }); //錄音開始,
		},
		//錄音開始UI效果
		recordBegin(e) {
			this.recording = true;
			this.voiceTis = '松開 終わり';
			this.recordLength = 0;
			this.recordTimer = setInterval(() => {
				this.recordLength++;
			}, 1000);
		},
		// 錄音被打斷
		voiceCancel() {
			this.recording = false;
			this.voiceTis = '話し続ける';
			this.recordTis = '上にスワイプして送信をキャンセルします';
			this.willStop = true; //不發送錄音
			this.RECORDER.stop(); //録音終了
		},
		// 錄音中(判斷是否觸發上滑取消發送)
		voiceIng(e) {
			if (!this.recording) {
				return;
			}
			let touche = e.touches[0];
			//上滑一個導航欄的高度觸發上滑取消發送
			if (this.initPoint.Y - touche.clientY >= uni.upx2px(200)) {
				this.willStop = true;
				this.recordTis = '指を離して送信をキャンセルします';
			} else {
				this.willStop = false;
				this.recordTis = '上にスワイプして送信をキャンセルします';
			}
		},
		// 結束錄音
		voiceEnd(e) {
			if (!this.recording) {
				return;
			}
			this.recording = false;
			this.voiceTis = '話し続ける';
			this.recordTis = '上にスワイプして送信をキャンセルします';
			this.RECORDER.stop(); //録音終了
		},
		//録音終了(回調文件)
		recordEnd(e) {
			clearInterval(this.recordTimer);
			if (!this.willStop) {
				this.$api.get({
					url: '/wanlshop/common/uploadData',
					success: updata => {
						this.$api.upload({
							url: updata.uploadurl,
							filePath: e.tempFilePath,
							name: 'file',
							formData: updata.storage == 'local' ? null : updata.multipart,
							success: data => {
								let msg = {length: 0, url: data.fullurl};
								msg.length = this.recordLength % 60;
								if (msg.length > 0) {
									this.sendMsg(msg, 'voice');
								}
							}
						});
					}
				});
				console.log('録音終了');
			} else {
				console.log('録音の送信をキャンセルする');
			}
			this.willStop = false;
		},
		// 切換語音/文字輸入
		switchVoice() {
			this.hideDrawer();
			this.isVoice = this.isVoice ? false : true;
		},

		// 表情數據
		emojiData() {
			var groups = {},
				categories = [],
				map = {};
			emotions.forEach(emotion => {
				var cate = emotion.category.length > 0 ? emotion.category : 'デフォルト';
				if (!groups[cate]) {
					groups[cate] = [];
					categories.push(cate);
				}
				groups[cate].push(emotion);
				map[emotion.phrase] = emotion.icon;
			});
			return { groups, categories, map };
		},
		//替換表情符號為圖片
		replaceEmoji(str) {
			// 這裏處理 鏈接   換行符
			let replacedStr = str.replace(/\[([^(\]|\[)]*)\]/g, (item, index) => {
				return '<img src="' + this.emojiList.map[item] + '" width="18rpx">';
			});
			return replacedStr.replace(/(\r\n)|(\n)/g, '<br>');
		},
		// 表情tab
		tabSelect(e) {
			this.TabCur = e.currentTarget.dataset.id;
		},
		//處理圖片尺寸，如果不處理寬高，新進入頁面加載圖片時候會閃
		setPicSize(content) {
			// 讓圖片最長邊等於設置的最大長度，短邊等比例縮小，圖片控件真實改變，區別於aspectFit方式。
			let maxW = uni.upx2px(350); //350是定義消息圖片最大寬度
			let maxH = uni.upx2px(350); //350是定義消息圖片最大高度
			if (content.w > maxW || content.h > maxH) {
				let scale = content.w / content.h;
				content.w = scale > 1 ? maxW : maxH * scale;
				content.h = scale > 1 ? maxW / scale : maxH;
			}
			return content;
		},
		//更多功能(點擊+彈出)
		showMore() {
			this.isVoice = false;
			this.hideEmoji = true;
			if (this.hideMore) {
				this.hideMore = false;
				this.openDrawer();
			} else {
				this.hideDrawer();
			}
		},
		// 打開抽屜
		openDrawer() {
			this.emptybottom = true;
			this.popupLayerClass = true;
		},
		// 隱藏抽屜
		hideDrawer() {
			this.emptybottom = false;
			this.popupLayerClass = false;
			setTimeout(() => {
				this.hideMore = true;
				this.hideEmoji = true;
			}, 150);
		},
		// 選擇表情
		chooseEmoji() {
			this.hideMore = true;
			if (this.hideEmoji) {
				this.hideEmoji = false;
				this.openDrawer();
			} else {
				this.hideDrawer();
			}
		},
		//添加表情
		addEmoji(em) {
			this.textMsg += em;
		},

		//獲取焦點，如果不是選表情ing,則關閉抽屜
		textareaFocus() {
			this.emptybottom = true;
			if (this.popupLayerClass && this.hideMore == false) {
				this.hideDrawer();
			}
		},
		// 失去焦點
		textareaBlur() {
			this.emptybottom = false;
		},
		// 禁止滾動
		discard() {
			return;
		}
	}
};
</script>
<style>
.cu-chat .cu-item>.main{
	margin: 0 20rpx;
}
.cu-chat .cu-item > .main .content:after {
	width: 0;
	height: 0;
}
.cu-chat .cu-item > .main .content {
	font-size: 30rpx;
	border-radius: 10rpx 30rpx 30rpx 30rpx;
}
.cu-chat .cu-item.self > .main .content {
	border-radius: 30rpx 10rpx 30rpx 30rpx;
}

.cu-chat .cu-item > .main .content .article{
	margin-top: 10rpx;
	padding-top: 10rpx;
	width: 100%;
    overflow: hidden;
}

.cu-chat .cu-item > .main .content .list{
	width: 100%;
	font-size: 28rpx;
}
.cu-chat .cu-item > .main .content .list text{
	color: #FF6A00;
}
.cu-chat .cu-item > .main .content .list .ai{
	padding: 16rpx 0;
	margin: 16rpx 0;
	line-height: 1.5;
}




.cu-chat .cu-item [class*='wlIcon-'] {
	font-size: 34rpx;
}
	
	
.opmenu {
	display: flex;
	margin-top: 2rpx;
	color: #4c4c4c;
}
.opmenu .box {
	padding-top: 35rpx;
	padding-left: 50rpx;
	text-align: center;
}
.opmenu .box .icon {
	height: 130rpx;
	width: 130rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	justify-items: center;
	background-color: #ffffff;
	border-radius: 20rpx;
	font-size: 70rpx;
	margin-bottom: 10rpx;
}

.hidden {
	display: none !important;
}


.popup-layer {
	transition: all 0.15s linear;
	width: 100%;
	height: 480rpx;
	background-color: #f7f7fa;
	position: fixed;
	z-index: 2000;
	top: 100%;
}
.popup-layer.showLayer {
	transform: translate3d(0, -480rpx, 0);
}
.popup-layer .emoji .emojinav {
	background-color: #f8f8f8;
}
.popup-layer .emoji .emojinav .item {
	display: flex;
	align-items: center;
	height: 100rpx;
	padding-left: 10rpx;
}
.popup-layer .emoji .emojinav .item .emojibg {
	background-color: #dedede;
}
.popup-layer .emoji .emojinav .item > view {
	margin: 0 25rpx;
	width: 60rpx;
	height: 60rpx;
	border-radius: 18rpx;
	background-repeat: no-repeat;
	background-size: 80%;
	background-position: center;
}

.popup-layer .emoji .subject {
	height: 380rpx;
	background-color: #f1f1f1;
}
.popup-layer .emoji .subject .item {
	padding: 25rpx;
}

.popup-layer .emoji .subject .item > view {
	background-repeat: no-repeat;
	background-size: 56%;
	background-position: center;
	width: 12.5%;
	height: 100rpx;
}

.input-box {
	width: 100%;
	min-height: 100rpx;
	padding-bottom: env(safe-area-inset-bottom);
	background-color: #f7f7fa;
	display: flex;
	align-items: flex-end;
	position: fixed;
	z-index: 2000;
	bottom: -2rpx;
	transition: all 0.15s linear;
}
.input-box [class*='wlIcon-'] {
	font-size: 50rpx;
	color: #4c4c4c;
}

.input-box .wlIcon-zhifeiji {
	color: #fe6600;
}

.input-box.showLayer {
	transform: translate3d(0, -480rpx, 0);
}
.input-box .voice,
.input-box .more {
	flex-shrink: 0;
	width: 90rpx;
	height: 100rpx;
	display: flex;
	justify-content: center;
	align-items: center;
}
.input-box .send {
	flex-shrink: 0;
	width: 90rpx;
	height: 100rpx;
	display: flex;
	justify-content: center;
	align-items: center;
}
.input-box .send .btn {
	width: 110rpx;
	height: 70rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 16rpx;
	font-size: 32rpx;
}
.input-box .textbox {
	width: 100%;
}
.input-box .textbox .voice-mode {
	width: calc(100% - 2upx);
	height: 80rpx;
	margin: 10rpx 0;
	border-radius: 16rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 28rpx;
	background-color: #fff;
	color: #555;
}
.input-box .textbox .voice-mode.recording {
	background-color: #e5e5e5;
}
.input-box .textbox .text-mode {
	width: 100%;
	min-height: 80rpx;
	margin: 10rpx 0;
	display: flex;
	background-color: #ffffff;
	border-radius: 16rpx;
}
.input-box .textbox .text-mode .box {
	width: 100%;
	padding-left: 30rpx;
	min-height: 80rpx;
	display: flex;
	align-items: center;
}
.input-box .textbox .text-mode .box textarea {
	width: 100%;
}
.input-box .textbox .text-mode .em {
	flex-shrink: 0;
	width: 80rpx;
	padding-left: 10rpx;
	height: 80rpx;
	display: flex;
	justify-content: center;
	align-items: center;
}

.record {
	width: 39vw;
	height: 39vw;
	position: fixed;
	top: 35%;
	left: 30%;
	background-color: rgba(0, 0, 0, 0.8);
	border-radius: 40rpx;
}
.record .ing {
	width: 100%;
	height: 30vw;
	display: flex;
	justify-content: center;
	align-items: center;
}
@keyframes volatility {
	0% {
		background-position: 0% 130%;
	}
	20% {
		background-position: 0% 150%;
	}
	30% {
		background-position: 0% 155%;
	}
	40% {
		background-position: 0% 160%;
	}
	50% {
		background-position: 0% 145%;
	}
	70% {
		background-position: 0% 150%;
	}
	80% {
		background-position: 0% 170%;
	}
	90% {
		background-position: 0% 160%;
	}
	100% {
		background-position: 0% 135%;
	}
}
.record .ing [class*='wlIcon'] {
	background-image: linear-gradient(to bottom, #ffffff, #565656 50%);
	background-size: 100% 200%;
	animation: volatility 1.5s ease-in-out -1.5s infinite alternate;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	font-size: 140rpx;
	padding-top: 40rpx;
	color: #f09b37;
}
.record .cancel {
	width: 100%;
	height: 30vw;
	display: flex;
	justify-content: center;
	align-items: center;
}
.record .cancel [class*='wlIcon'] {
	color: #fff;
	font-size: 150rpx;
}
.record .tis {
	width: 100%;
	height: 10vw;
	display: flex;
	justify-content: center;
	font-size: 24rpx;
	color: #fff;
}
.record .tis.change {
	color: #f09b37;
}

.content {
	width: 100%;
}
.content .msg-list,
.cu-chat {
	position: absolute;
	top: 0;
	bottom: 100rpx;
	bottom: calc(env(safe-area-inset-bottom) + 100rpx);
}

.loading {
	display: flex;
	justify-content: center;
}
@keyframes stretchdelay {
	0%,
	40%,
	100% {
		transform: scaleY(0.6);
	}
	20% {
		transform: scaleY(1);
	}
}
.loading .spinner {
	margin: 20upx 0;
	width: 60upx;
	height: 100upx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.loading .spinner view {
	background-color: #dadada;
	height: 50upx;
	width: 6upx;
	border-radius: 6upx;
	animation: stretchdelay 1.2s infinite ease-in-out;
}
.loading .spinner .rect2 {
	animation-delay: -1.1s;
}
.loading .spinner .rect3 {
	animation-delay: -1s;
}
.loading .spinner .rect4 {
	animation-delay: -0.9s;
}
.loading .spinner .rect5 {
	animation-delay: -0.8s;
}

.emptybottom{
	padding-bottom: 0 !important;
}

</style>
