/**
 * WanlShop状态管理器 - 用戶管理
 * 
 * @ author SHOP <kefu@shop.com> 
 * < 程序僅用作FastAdmin付费插件API测试使用，未经版權所有權人书面許可，不能用於商业用途！>
 * @ link http://www.shop.com
 * @ 2020年9月29日19:00:46
 * @ version 1.0.0
 **/
export default {
	namespaced: true,
	state: {
		id: 0, //用戶ID
		isLogin: false, // 登錄状态
		username: '', // ユーザー名
		nickname: '', // 昵称
		mobile: '', // 携帯電話
		avatar: '', // 默認頭像
		level: 0, // 等级
		gender: 0, // 性别
		birthday: '', // 生日
		bio: '', // 簽名
		money: '0', // 余额
		score: 0, // 積分
		successions: '', // 連续登錄天數
		maxsuccessions: '', // 最大連续登錄天數
		prevtime: '', // 上次登錄时間
		logintime: '', // 登錄时間
		loginip: '', // 加入IP
		jointim: '', // 加入时間
		token: '', // 令牌
		session: '', // 登陸令牌
		pushs: true, // 推送
		shock: true, // 震動
		voice: true // 提示音
	},
	mutations: {
		setUserInfo(state, payload) {
			for (let i in payload) {
				for (let j in state) {
					if (i === j) {
						state[j] = payload[i];
					}
				}
			}
			uni.setStorageSync("wanlshop:user", state);
		}
	},
	actions: {
		async login({state, commit, dispatch, rootState}, data) {
			commit('setUserInfo', data.userinfo);
			state.isLogin = true; // 登錄状态强製 開啟
			// 根據notice.vue 而知，fastadmin没有此三项默認字段，手動添加，想同步修改该这两处即可
			state.pushs = true; // 推送
			state.voice = true; // 提示音
			state.shock = true; // 震動
			uni.setStorageSync("wanlshop:user", state);
			// 統計信息
			dispatch('statistics', data.statistics)
		},
		async logout({state, rootState}) {
			for (let j in state) {
				state[j] = ''
			}
			state.isLogin = false;
			let statistics = rootState.statistics;
			for (let j in statistics) {
				for (let i in statistics[j]) {
					statistics[j][i] = 0
				}
			}
			// 从本地緩存中异步移除指定key
			uni.removeStorageSync('wanlshop:user');
			uni.removeStorageSync('wanlshop:statis');
			// 關閉即时通讯
			uni.closeSocket();
		},
		async statistics({state, dispatch, rootState}, payload){
			let states = rootState.statistics;
			for (let i in payload) {
				for (let j in states) {
					if (i === j) {
						states[j] = payload[i];
					}
				}
			}
			uni.setStorageSync("wanlshop:statis", states);
		}
		
	}
};