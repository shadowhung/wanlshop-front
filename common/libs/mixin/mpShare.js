module.exports = {
	onLoad() {
		// 設置默認的转發參數
		this.mpShare = {
			title: '', // 默認為小程序名称
			path: '', // 默認為当前頁面路径
			imageUrl: '' // 默認為当前頁面的截圖
		}
		// #ifdef MP-WEIXIN
		wx.showShareMenu({
			withShareTicket: true,
			menus: ['shareAppMessage', 'shareTimeline']
		});
		// #endif
		// #ifdef MP-QQ
		qq.showShareMenu({
			showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
		});
		// #endif
	},
	onShareAppMessage() {
		return this.mpShare
	},
	// #ifdef MP-WEIXIN
	onShareTimeline() {
		return this.mpShare
	}
	// #endif
}