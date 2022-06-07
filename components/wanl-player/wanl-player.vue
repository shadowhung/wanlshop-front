<template>
	<div class="prism-player" :id="playerId" :style="playStyle"></div>
</template>

<script>
/**
	 * WanlPlayer 網頁播放器 
	 * @description 網頁播放器 SHOP https://www.shop.com（除万联官方内嵌系統，未经授權严禁使用）
	 * @著作權：WanlShop 登記號：2020SR0255711 版本：V1.0.0
	 * 
	 */
export default {
	name: 'WanlPlayer',
	props: {
		source: {
			type: String,
			default: ''
		},
		//媒体转碼服務的媒体Id。
		vid: {
			type: String,
			default: ''
		},
		//播放權證
		playauth: {
			type: String,
			default: ''
		},
		//容器的大小
		height: {
			type: String,
			default: '320px'
		},
		//容器的大小
		width: {
			type: String,
			default: '100%'
		},
		//視频的高度大小
		videoWidth: {
			type: String,
			default: '100%'
		},
		//視频的宽度大小
		videoHeight: {
			type: String,
			default: '320px'
		},
		//播放器自動加載，目前僅h5可用
		preload: {
			type: Boolean,
			default: false
		},
		//播放器默認封面圖片，請填写正確的圖片url地址。需要autoplay為’false’时，才生效
		cover: {
			type: String,
			default: ''
		},
		//播放內容是否為直播，直播时會禁止用戶拖動进度條。
		isLive: {
			type: Boolean,
			default: false
		},
		//播放器是否自動播放，在移動端autoplay属性會失效。
		autoplay: {
			type: Boolean,
			default: false
		},
		//播放器自動循环播放。
		rePlay: {
			type: Boolean,
			default: false
		},
		//指定使用H5播放器。
		useH5Prism: {
			type: Boolean,
			default: false
		},
		//指定使用Flash播放器。
		useFlashPrism: {
			type: Boolean,
			default: false
		},
		//H5是否内置播放，有的Android瀏覽器不起作用。
		playsinline: {
			type: Boolean,
			default: false
		},
		//顯示播放时緩冲圖标，默認true。
		showBuffer: {
			type: Boolean,
			default: true
		},
		//URL 皮肤圖片，不建議随意修改该字段，如要修改，請參照皮肤定製。
		skinRes: {
			type: String,
			default: ''
		},

		skinLayout: {
			type: Array,
			default: function() {
				return [];
			}
		},
		//默認為‘hover’。可选的值為：‘click’、‘hover’、‘always’。
		controlBarVisibility: {
			type: String,
			default: 'hover'
		},
		//控製栏自動隐藏时間（ms）
		showBarTime: {
			type: String,
			default: ''
		},
		/***
       * JSON串用於定製性接口參數，目前支持：
       1.“fullTitle”：“测试頁面”
       全屏时顯示視频标题（僅flash支持）。
       2. “m3u8BufferLength”：“30”
       播放m3u8时加載緩存ts文件长度單位（秒）（僅flash支持）。
       3. “liveStartTime”：“2016/08/17 12:00:00”
       直播開始时間，用於提示直播未開始(僅flash支持)。
       4. “liveOverTime”：“2016/08/17 14:00:00”
       直播結束时間，用於提示直播結束（僅flash支持）。
       */
		extraInfo: {
			type: String,
			default: ''
		},

		/**
		 *是否允許系統右键菜單顯示，默認為false。
		 */
		enableSystemMenu: {
			type: Boolean,
			default: false
		},

		/***
       *
       *指定播放地址格式，只有使用vid的播放方式时支持
       可选值為’mp4’、’m3u8’、’flv’、’mp3’，默認為空，僅H5支持。
       * */
		format: {
			type: String,
			default: 'mp4'
		},
		/***
       *
       * 指定返回音频还是視频，只有使用vid的播放方式时支持。
       可选值為’video’和’audio’，默認為’video’
       ‘audio’主要是针對只包含音频的視频格式，比如音频的mp4，僅H5支持。
       * */
		mediaType: {
			type: String,
			default: 'video'
		},
		/***
       * 指定排序方式，只有使用vid + plauth播放方式时支持。
       ‘desc’表示按倒序排序（即：从大到小排序）
       ‘asc’表示按正序排序（即：从小到大排序）
       默認值：‘asc’，僅H5支持。
       * */
		qualitySort: {
			type: String,
			default: 'asc'
		},
		/***
       * 顯示視频清晰度，多個用逗號分隔，比如：’FD,LD’，此值是vid對应流清晰度的一個子集，
       取值范围：FD（流畅）LD（标清）SD（高清）HD（超清）OD（原画）2K（2K）4K（4K），僅H5支持。
       * */
		definition: {
			type: String,
			default: ''
		},
		/**
       * 默認視频清晰度，此值是vid對应流的一個清晰度，
       取值范围：FD（流畅）LD（标清）SD（高清）HD（超清）OD（原画）2K（2K）4K（4K），僅H5支持。
       * */
		defaultDefinition: {
			type: String,
			default: ''
		},
		/**
		 * 聲明啟用同层H5播放器，啟用时設置的值為‘h5’
		 * */
		x5_type: {
			type: String,
			default: 'h5'
		},
		/**
       * 聲明視频播放时是否进入到TBS的全屏模式，默認為false。
       当需要把視频做為背景时，設置為true
       * */
		x5_fullscreen: {
			type: Boolean,
			default: false
		},
		/**
       * 聲明視频播在界面上的位置，默認為“center”。
       可选值為：“top”，“center”
       * */
		x5_video_position: {
			type: String,
			default: 'center'
		},
		/**
       * 聲明 TBS 播放器支持的方向，可选值：
       landscape:橫屏）
       portraint:竖屏
       landscape
       * */
		x5_orientation: {
			type: String,
			default: 'portraint'
		},
		/**
		 * 聲明TBS全屏播放是否橫屏，默認值為true。
		 * */
		x5LandscapeAsFullScreen: {
			type: String,
			default: 'true'
		},
		/**
		 * 延迟播放时間，單位為秒。
		 * */
		autoPlayDelay: {
			type: Number,
			default: 0
		},
		/**
		 * 延迟播放提示文本
		 * */
		autoPlayDelayDisplayText: {
			type: String,
			default: '正在转碼，請稍後......'
		},
		/**
       * 国际化，默認為‘zh-cn’。
       如果未設置，则采用瀏覽器語言。
       可选值為‘zh-cn’、‘en-us’或其它值。
       * */
		language: {
			type: String,
			default: 'zh-cn'
		},
		/**
       * 自定义国际化文本json结构，key的值需要和language属性值對应起來。
       例子：{jp:{Play:”Play”}}
       * */
		languageTexts: {
			type: Object,
			default: function() {
				return {};
			}
		},
		/**
		 * flash啟用截圖功能
		 * */
		snapshot: {
			type: Boolean,
			default: false
		},
		/**
		 * H5設置截圖水印。
		 * */
		snapshotWatermark: {
			type: Object,
			default: function() {
				return {};
			}
		},
		/**
		 * Safari瀏覽器可以啟用Hls插件播放，Safari 11除外。
		 * */
		useHlsPluginForSafari: {
			type: Boolean,
			default: false
		},
		/**
		 * H5播放flv时，設置是否啟用播放緩存，只在直播下起作用。
		 * */
		enableStashBufferForFlv: {
			type: Boolean,
			default: false
		},
		/**
		 * H5播放flv时，初始緩存大小，只在直播下起作用。
		 * */
		stashInitialSizeForFlv: {
			type: Number,
			default: 10
		},
		/**
		 * 緩冲多长时間後，提示用戶切换低清晰度，默認：20秒。
		 * */
		loadDataTimeout: {
			type: Number,
			default: 20
		},
		/**
		 *最大緩冲超时时間，超過这個时間會有錯误提示，默認：60秒。
		 * */
		waitingTimeout: {
			type: Number,
			default: 60
		},
		/**
		 * 直播開始时間，直播时移功能使用，格式為：“2018/01/04 12:00:00”。
		 * */
		liveStartTime: {
			type: String,
			default: ''
		},
		/**
		 * 直播結束时間，直播时移功能使用，格式為：“2018/01/04 12:00:00”。
		 * */
		liveOverTime: {
			type: String,
			default: ''
		},
		/**
		 * 直播可用时移查询地址，詳情參见直播时移。
		 * https://help.aliyun.com/document_detail/65129.html?spm=a2c4g.11186623.2.28.3603bf80LR74sS
		 * */
		liveTimeShiftUrl: {
			type: String,
			default: ''
		},
		/**
		 * flv直播和hls时移切换是，重新创建播放器方法，詳情參见直播时移。
		 * https://help.aliyun.com/document_detail/65129.html?spm=a2c4g.11186623.2.28.3603bf80LR74sS
		 * */
		recreatePlayer: {
			type: Function,
			default: function() {}
		},
		/**
		 *是否顯示检测按钮，默認為true。
		 * */
		diagnosisButtonVisible: {
			type: Boolean,
			default: true
		},
		/**
		 * 禁用进度條的Seek，默認為false，僅Flash支持。
		 * */
		disableSeek: {
			type: Boolean,
			default: false
		},
		/**
		 * 加密類型，播放点播私有加密視频时，設置值為1，默認值為0。
		 * */
		encryptType: {
			type: Number,
			default: 0
		},
		/**
       * 进度條打点內容數組，詳情參见进度條打点。
       * [
       {offset:0,text:'阿里視频云端到云到端服務的重要一环'},
       {offset:10,text:'除了支持点播和直播的基础播放功能外'},
       {offset:20,text:'深度融合視频云业務'},
       {offset:30,text:'為用戶提供简單、快速、安全、稳定的視频播放服務'},
       {offset:40,text:'安装播放器Demo进行体驗'},
       {offset:50,text:'開發人员請点击SDK下載'}
       ]
       * https://yq.aliyun.com/articles/686043?spm=a2c4g.11186623.2.31.3603bf80LR74sS
       * */
		progressMarkers: {
			type: Array,
			default: function() {
				return [];
			}
		},
		/**
		 * 点播失败重试次數，默認3次
		 * */
		vodRetry: {
			type: Number,
			default: 3
		},
		/**
		 * 直播播放失败重试次數，默認5次
		 * */
		liveRetry: {
			type: Number,
			default: 5
		},

		playStyle: {
			type: String,
			default: ''
		},
		aliplayerSdkPath: {
			// Aliplayer 代碼的路径
			type: String,
			default: '//g.alicdn.com/de/prismplayer/2.8.2/aliplayer-min.js'
		}
	},
	data() {
		return {
			playerId:
				'aliplayer_' +
				Math.random()
					.toString(36)
					.substr(2),
			scriptTagStatus: 0,
			isReload: false,
			instance: null
		};
	},
	created() {
		if (window.Aliplayer !== undefined) {
			// 如果全局對象存在，说明編輯器代碼已经初始化完成，直接加載編輯器
			this.scriptTagStatus = 2;
			this.initAliplayer();
		} else {
			// 如果全局對象不存在，说明編輯器代碼还没有加載完成，需要加載編輯器代碼
			this.insertScriptTag();
		}
	},
	mounted() {
		if (window.Aliplayer !== undefined) {
			// 如果全局對象存在，说明編輯器代碼已经初始化完成，直接加載編輯器
			this.scriptTagStatus = 2;
			this.initAliplayer();
		} else {
			// 如果全局對象不存在，说明編輯器代碼还没有加載完成，需要加載編輯器代碼
			this.insertScriptTag();
		}
	},
	methods: {
		insertScriptTag() {
			const _this = this;
			let playerScriptTag = document.getElementById('playerScriptTag');
			// 如果这個tag不存在，则生成相關代碼tag以加載代碼
			if (playerScriptTag === null) {
				playerScriptTag = document.createElement('script');
				playerScriptTag.type = 'text/javascript';
				playerScriptTag.src = this.aliplayerSdkPath;
				playerScriptTag.id = 'playerScriptTag';
				let s = document.getElementsByTagName('head')[0];
				s.appendChild(playerScriptTag);
			}
			if (playerScriptTag.loaded) {
				_this.scriptTagStatus++;
			} else {
				playerScriptTag.addEventListener('load', () => {
					_this.scriptTagStatus++;
					playerScriptTag.loaded = true;
					_this.initAliplayer();
				});
			}
			_this.initAliplayer();
		},
		initAliplayer() {
			const _this = this;
			// scriptTagStatus 為 2 的时候，说明两個必需引入的 js 文件都已经被引入，且加載完成
			if (_this.scriptTagStatus === 2 && (_this.instance === null || _this.reloadPlayer)) {
				_this.instance && _this.instance.dispose();

				document.querySelector('#' + _this.playerId).innerHTML = '';

				// Vue 异步执行 DOM 更新，这样一來代碼执行到这里的时候可能 template 里面的 script 标簽还没真正创建
				// 所以，我们只能在 nextTick 里面初始化 Aliplayer
				_this.$nextTick(() => {
					_this.instance = window.Aliplayer({
						id: _this.playerId,
						source: _this.source,
						vid: _this.vid,
						playauth: _this.playauth,
						width: _this.width,
						height: _this.height,
						videoWidth: _this.videoWidth,
						videoHeight: _this.videoHeight,
						preload: _this.preload,
						cover: _this.cover,
						isLive: _this.isLive,
						autoplay: _this.autoplay,
						rePlay: _this.rePlay,
						useH5Prism: _this.useH5Prism,
						useFlashPrism: _this.useFlashPrism,
						playsinline: _this.playsinline,
						showBuffer: _this.showBuffer,
						skinRes: _this.skinRes,
						skinLayout: _this.skinLayout,
						controlBarVisibility: _this.controlBarVisibility,
						showBarTime: _this.showBarTime,
						extraInfo: _this.extraInfo,
						enableSystemMenu: _this.enableSystemMenu,
						format: _this.format,
						mediaType: _this.mediaType,
						qualitySort: _this.qualitySort,
						definition: _this.definition,
						defaultDefinition: _this.defaultDefinition,
						x5_type: _this.x5_type,
						x5_fullscreen: _this.x5_fullscreen,
						x5_video_position: _this.x5_video_position,
						x5_orientation: _this.x5_orientation,
						x5LandscapeAsFullScreen: _this.x5LandscapeAsFullScreen,
						autoPlayDelay: _this.autoPlayDelay,
						autoPlayDelayDisplayText: _this.autoPlayDelayDisplayText,
						language: _this.language,
						languageTexts: _this.languageTexts,
						snapshot: _this.snapshot,
						snapshotWatermark: _this.snapshotWatermark,
						useHlsPluginForSafari: _this.useHlsPluginForSafari,
						enableStashBufferForFlv: _this.enableStashBufferForFlv,
						stashInitialSizeForFlv: _this.stashInitialSizeForFlv,
						loadDataTimeout: _this.loadDataTimeout,
						waitingTimeout: _this.waitingTimeout,
						liveStartTime: _this.liveStartTime,
						liveTimeShiftUrl: _this.liveTimeShiftUrl,
						liveShiftSource: _this.liveShiftSource,
						recreatePlayer: _this.recreatePlayer,
						diagnosisButtonVisible: _this.diagnosisButtonVisible,
						disableSeek: _this.disableSeek,
						encryptType: _this.encryptType,
						progressMarkers: _this.progressMarkers,
						vodRetry: _this.vodRetry,
						liveRetry: _this.liveRetry
					});

					// 绑定事件，当 AliPlayer 初始化完成後，將編輯器实例通過自定义的 ready 事件交出去
					_this.instance.on('ready', () => {
						this.$emit('ready', _this.instance);
					});

					_this.instance.on('play', () => {
						this.$emit('play', _this.instance);
					});

					_this.instance.on('pause', () => {
						this.$emit('pause', _this.instance);
					});

					_this.instance.on('ended', () => {
						this.$emit('ended', _this.instance);
					});

					_this.instance.on('liveStreamStop', () => {
						this.$emit('liveStreamStop', _this.instance);
					});

					_this.instance.on('m3u8Retry', () => {
						this.$emit('m3u8Retry', _this.instance);
					});

					_this.instance.on('hideBar', () => {
						this.$emit('hideBar', _this.instance);
					});

					_this.instance.on('waiting', () => {
						this.$emit('waiting', _this.instance);
					});

					_this.instance.on('snapshoted', () => {
						this.$emit('snapshoted', _this.instance);
					});

					_this.instance.on('timeupdate', () => {
						this.$emit('timeupdate', _this.instance);
					});

					_this.instance.on('requestFullScreen', () => {
						this.$emit('requestFullScreen', _this.instance);
					});

					_this.instance.on('cancelFullScreen', () => {
						this.$emit('cancelFullScreen', _this.instance);
					});

					_this.instance.on('error', () => {
						this.$emit('error', _this.instance);
					});

					_this.instance.on('startSeek', () => {
						this.$emit('startSeek', _this.instance);
					});

					_this.instance.on('completeSeek', () => {
						this.$emit('completeSeek', _this.instance);
					});
				});
			}
		},
		/**
		 * 播放視频
		 */
		play: function() {
			this.instance.play();
		},
		/**
		 * 暂停視频
		 */
		pause: function() {
			this.instance.pause();
		},
		/**
		 * 重播視频
		 */
		replay: function() {
			this.instance.replay();
		},
		/**
		 * 跳转到某個时刻进行播放
		 * @argument time 的單位為秒
		 */
		seek: function(time) {
			this.instance.seek(time);
		},
		/**
		 * 獲取当前时間 單位秒
		 */
		getCurrentTime: function() {
			return this.instance.getCurrentTime();
		},
		/**
		 *獲取視频总时长，返回的單位為秒
		 * @returns 返回的單位為秒
		 */
		getDuration: function() {
			return this.instance.getDuration();
		},
		/**
       獲取当前的音量，返回值為0-1的实數ios和部分android會失效
       */
		getVolume: function() {
			return this.instance.getVolume();
		},
		/**
       設置音量，vol為0-1的实數，ios和部分android會失效
       */
		setVolume: function(vol) {
			this.instance.setVolume(vol);
		},
		/**
		 *直接播放視频url，time為可选值（單位秒）目前只支持同种格式（mp4/flv/m3u8）之間切换暂不支持直播rtmp流切换
		 *@argument url 視频地址
		 *@argument time 跳转到多少秒
		 */
		loadByUrl: function(url, time) {
			this.instance.loadByUrl(url, time);
		},
		/**
		 * 設置播放速度
		 *@argument speed 速度
		 */
		setSpeed: function(speed) {
			this.instance.setSpeed(speed);
		},
		/**
		 * 設置播放器大小w,h可分别為400px像素或60%百分比chrome瀏覽器下flash播放器分别不能小於397x297
		 *@argument w 播放器宽度
		 *@argument h 播放器高度
		 */
		setPlayerSize: function(w, h) {
			this.instance.setPlayerSize(w, h);
		},
		/**
       *目前只支持H5播放器。
       暂不支持不同格式視频間的之間切换。
       暂不支持直播rtmp流切换。
       */
		replayByVidAndPlayAuth: function(vid, accId, accSecret, stsToken, authInfo, domainRegion) {
			this.instance.replayByVidAndPlayAuth(vid, accId, accSecret, stsToken, authInfo, domainRegion);
		},

		/***
       * 重新設置vid和權限，目前只支持H5播放器。
       暂不支持不同格式視频間的之間切换。
       暂不支持直播rtmp流切换。
       * @param vid 視频ID
       * @param playauth 播放權限
       */
		replayByVidAndAuthInfo: function(vid, playauth) {
			this.instance.replayByVidAndAuthInfo(vid, playauth);
		},

		/**
		 * 目前只支持HTML5界面上的重載功能,暂不支持直播rtmp流切换m3u8）之間切换,暂不支持直播rtmp流切换
		 *@argument vid 視频id
		 *@argument playauth 播放凭證
		 */
		reloaduserPlayInfoAndVidRequestMts: function(vid, playauth) {
			this.instance.reloaduserPlayInfoAndVidRequestMts(vid, playauth);
		},

		/***
		 *設置截圖參數
		 * @param width 宽度
		 * @param height 高度
		 * @param rate 截圖质量
		 */
		setSanpshotProperties: function(width, height, rate) {
			this.instance.setSanpshotProperties(width, height, rate);
		},
		/**
		 * 設置封面地址
		 * @param cover 封面地址
		 */
		setCover: function(cover) {
			this.instance.setCover(cover);
		},

		reloadPlayer: function() {
			this.isReload = true;
			this.initAliplayer();
			this.isReload = false;
		}
	}
};
</script>

<style>
@import url(//g.alicdn.com/de/prismplayer/2.8.2/skins/default/aliplayer-min.css);
.prism-player{
	width: 100%;
	height: 100%;
}
</style>
