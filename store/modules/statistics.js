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
	// 储存數據
	state: {
		// 訂單統計
		order: {
			pay: 0,
			delive: 0,
			receiving: 0,
			evaluate: 0,
			customer: 0 //售後
		},
		// 動态統計
		dynamic: {
			collection: 0,
			concern: 0,
			footprint: 0,
			coupon: 0, // 卡券
			accountbank: 0 // 銀行帳戶
		},
		// 消息統計
		notice: {
			order: 0,
			notice: 0,
			chat: 0
		},
		// 物流状态
		logistics: []
	},
	// 修改數據
	mutations: {
		// 修改所有
		edit(state, payload){
			for (let i in payload) {
				for (let j in state) {
					if (i === j) {
						state[j] = payload[i];
					}
				}
			}
			uni.setStorageSync("wanlshop:statis", state);
		},
		// 設置統計訂單數據 - 修改键
		order(state, payload) {
			for (let i in payload) {
				for (let j in state.order) {
					if (i === j) {
						state.order[j] = payload[i];
					}
				}
			}
			uni.setStorageSync("wanlshop:statis", state);
		},
		// 設置統計動态數據 - 修改键
		dynamic(state, payload) {
			for (let i in payload) {
				for (let j in state.dynamic) {
					if (i === j) {
						state.dynamic[j] = payload[i];
					}
				}
			}
			uni.setStorageSync("wanlshop:statis", state);
		},
		// 設置通知統計數據 - 修改键
		noticec(state, payload) {
			for (let i in payload) {
				for (let j in state.notice) {
					if (i === j) {
						state.notice[j] = payload[i];
					}
				}
			}
			uni.setStorageSync("wanlshop:statis", state);
		}
	},
	actions: {
		async get({commit, rootState}) {
			commit('edit', uni.getStorageSync('wanlshop:statis'));
		}
	}
};