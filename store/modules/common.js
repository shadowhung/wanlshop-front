/**
 * WanlShop状态管理器 - 系統初始化
 * 
 * @ author SHOP <kefu@shop.com> 
 * < 程序僅用作FastAdmin付费插件API测试使用，未经版權所有權人书面許可，不能用於商业用途！>
 * @ link http://www.shop.com
 * @ 2020年9月29日19:00:46
 * @ version 1.0.0
 **/
import api from '../../common/request/request';
import config from '../../common/config/config';
 
export default {
	namespaced: true,
	// 储存數據
	state: {
		appStyle: {}, // APP整体样式
		appConfig: {}, // APP整体配置
		// APP鏈接
		appUrl: {
			api: config.appurl,
			oss: config.cdnurl
		},
		// APP整体數據
		appInfo: {
			adVersion: '0', // 广告數據版本號	拉取大版本號數據
			serviceVersion: '0' // Api數據版本號  拉取大版本號數據  用於尚未更新用戶正常使用
		},
		// 广告數據
		adData: {
			openAdverts: {},
			pageAdverts: [],
			categoryAdverts: [],
			firstAdverts: [],
			otherAdverts: []
		},
		// 模块數據
		modulesData: {
			homeModules: {}, //首頁模块
			categoryModules: [], //類目模块
			searchModules: [] //搜索模块
		},
		config: {
			screenshot: false,
			position: true,
			map: true
		},
		version: config.versionName,
		versionCode: config.versionCode
	},
	mutations: {
		setConfig(state, payload) {
			for (let i in payload) {
				for (let j in state.config) {
					if (i === j) {
						state.config[j] = payload[i];
					}
				}
			}
		}
	},
	// 操作數據
	actions: {
		// WanlShop 初始化，检测
		async init({state, dispatch, rootState}) {
			let userStorage = uni.getStorageSync('wanlshop:user');
			uni.request({
			    url: config.appurl + '/wanlshop/token/check',
			    header: {
			        'token': userStorage ? userStorage.token : 'wanlshop'
			    },
			    success: (res) => {
					if (res.statusCode === 200) {
						// 已经登錄，刷新一個token，將原有帳戶赋值给状态管理器
						if (userStorage) {
							rootState.user = userStorage;
						}
						rootState.user.isLogin = true;
					}else if(res.statusCode === '0000'){
						// 清除登錄信息
						let user = rootState.user;
						for (let j in user) {
							user[j] = ''
						}
						rootState.user.isLogin = false;
						// 清除統計信息
						let statistics = rootState.statistics;
						for (let j in statistics) {
							for (let i in statistics[j]) {
								statistics[j][i] = 0
							}
						}
						// 从本地緩存中异步移除
						if (userStorage) {
							uni.removeStorageSync('wanlshop:user');
							uni.removeStorageSync('wanlshop:statis');
						}
					}
					dispatch('getAds');
			    	dispatch('getServices');
			    },
			    fail: (e) => {
			    	// #ifdef APP-PLUS
			    	plus.navigator.closeSplashscreen(); //主動關閉啟動圖
			    	// #endif
			    }
			});
		},
		async getServices({state}){
			api.get({
				url: '/wanlshop/common/init',
				data: {
					version: state.version
				},
				success: res => {
					// px转rpx正则表達
					for (var i = 0; i < res.modulesData.homeModules.item.length; i++) {
						for (var item in res.modulesData.homeModules.item[i].style) {
							res.modulesData.homeModules.item[i].style[item] = res.modulesData.homeModules.item[i].style[item].replace(/\d*\.?\d+px/, function(
								match) {
								return match.replace('px', '') * 2 + 'rpx'
							})
						};
						for (var item in res.modulesData.homeModules.item[i].params) {
							res.modulesData.homeModules.item[i].params[item] = res.modulesData.homeModules.item[i].params[item].replace(/\d*\.?\d+px/, function(
								match) {
								return match.replace('px', '') * 2 + 'rpx'
							})
						};
					};
					// 写入全局配置
					state.appConfig = res.appConfig;
					// 写入全局样式
					state.appStyle = res.appStyle;
					// 写入模块數據
					state.modulesData = res.modulesData;
				}
			});
		},
		async getAds({state}){
			api.get({
				url: '/wanlshop/common/adverts',
				data: {
					version: state.version
				},
				success: res=> {
					// 關閉啟動圖进入APP
					// #ifdef APP-PLUS
					setTimeout(() => {
						plus.navigator.closeSplashscreen(); //主動關閉啟動圖
					}, 100)
					// #endif
					state.adData = res.data;
				}
			});
		}
	}
};