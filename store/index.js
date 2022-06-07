/**
 * WanlShop状态管理器
 * 
 * @ author SHOP <kefu@shop.com> 
 * < 程序僅用作FastAdmin付费插件API测试使用，未经版權所有權人书面許可，不能用於商业用途！>
 * @ link http://www.shop.com
 * @ 2019年9月10日12:52:20
 * @ 2020年9月29日19:00:46
 * @ version 1.0.0
 **/
import Vue from 'vue';
import Vuex	from 'vuex';
// 模块
import common from './modules/common';
import user	from './modules/user';
import chat	from './modules/chat';
import cart from './modules/cart';
import statistics from './modules/statistics';
import update from './modules/update';

Vue.use(Vuex);

const store = new Vuex.Store({
	modules: {
		chat, // 即时通讯
		common, // 系統初始化
		user, // 用戶中心
		cart, // 買い物かご
		statistics, // 系統更新
		update // 系統更新
	}
});

export default store;
