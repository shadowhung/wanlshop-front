/**
 * WanlShop状态管理器 - 買い物かご
 * 
 * @ author SHOP <kefu@shop.com> 
 * < 程序僅用作FastAdmin付费插件API测试使用，未经版權所有權人书面許可，不能用於商业用途！>
 * < 購物車状态管理器，不得複製、二次開發到第三方项目，否则我们會追究其法律责任 >
 * @ link http://www.shop.com
 * @ 2020年9月29日19:00:46
 * @ version 1.0.0
 **/
import Vue from 'vue';
import api from '../../common/request/request'; 
import fun from '../../common/wanlshop_function'; 
export default {
	namespaced: true,
	state: {
		list: [], // 購物車數據
		cartnum: 0, // 商品數量
		allchoose: 0, //店铺选中個數
		allsum: 0, //总計價格
		allnum: 0, //总計數量
		status: false, //全选选中状态
		operate: false //管理購物車状态
	},
	actions: {
		async operate({state}) {
			state.operate = !state.operate;
		},
		async get({state, dispatch, rootState}){
			setTimeout(()=> {
				// 初始化購物車複用同步購物車
				if (rootState.user.isLogin) {
					// 如果登錄则同步
					dispatch('login');
				}else{
					// 否则 初始化客戶端，購物車用本地赋值，後续格式化購物車數據，整理
					uni.getStorageSync("wanlshop:cart") ? dispatch('format', uni.getStorageSync("wanlshop:cart")) : '';
				}
			}, 1000);
		},
		async login({state, dispatch}){
			let cart = uni.getStorageSync("wanlshop:cart");
			// 强製合並
			api.post({
				url: '/wanlshop/cart/synchro',
				data: {
					cart: cart ? cart: null
				},
				success: res => {
					dispatch('format', res);
				}
			});
		},
		// 操作商品 1.0.2升级 ---------------------------------------------------------------------------
		async choose({state, dispatch}, {index, keys}) {
			let cart = state.list[index];
			let goods = cart.products[keys];
			!goods.checked ? dispatch('choosetrue', {cart:cart, goods:goods}) : dispatch('choosefalse', {cart:cart, goods:goods});
		},
		async choosetrue({state}, {cart, goods}) {
			//將商品选中状态改為true
			goods.checked = true; 
			// 选中商品數量先+1
			cart.choose++;
			// 再与该店铺商品數量比较，如果相等就更改店铺选中状态為true
			if (cart.choose === cart.products.length) {
				cart.check = true;
			}
			//如果店铺选中状态改為true
			if (cart.check) {
				// 选中店铺，數量先+1
				state.allchoose++;
				// 再与店铺數量比较，如果相等就更改全选选中状态為true
				if (state.allchoose === state.list.length) {
					state.status = true;
				}else{
					state.status = false;
				}
			}
			state.allsum = fun.bcadd(state.allsum, goods.sum);
			state.allnum += goods.number;
		},
		async choosefalse({state}, {cart, goods}) {
			// 將商品选中状态改為false
			goods.checked = false; 
			// 选中商品數量-1
			cart.choose--;
			//如果店铺是被选中的，更改店铺选中状态
			if (cart.check) { 
				cart.check = false;
				//並且选中店铺數量-1
				state.allchoose--; 
			}
			state.status = false; //無論之前全选的状态，將其改為false就行
			state.allsum = fun.bcsub(state.allsum, goods.sum); //商品总計價格变動
			state.allnum -= goods.number;
		},
		// 操作店铺
		async shopchoose({dispatch}, cart) {
			!cart.check ? dispatch('shoptrue', cart) : dispatch('shopfalse', cart);
		},
		async shoptrue({dispatch}, cart) {
			//循环店铺中的商品，先篩選出目前没选中的商品，给它执行choosetrue
			cart.products.forEach((goods) => {
				goods.checked === false && dispatch('choosetrue', {cart:cart, goods:goods}); 
			})
		},
		async shopfalse({dispatch}, cart) {
			//循环店铺中的商品，先篩選出目前被选中的商品，给它执行choosefalse
			cart.products.forEach((goods) => {
				goods.checked === true && dispatch('choosefalse', {cart:cart, goods:goods});
			})
		},
		// 全选
		async cartchoose({state, dispatch}) {
			state.status = !state.status //取反改变状态
			//根據取反後的状态进行相应的店铺按钮操作   
			state.status ? state.list.forEach((cart) => dispatch('shoptrue', cart)) : state.list.forEach((cart) => dispatch('shopfalse', cart));
		},
		// 结算
		async settlement({state, dispatch, rootState}){
			let data = [];
			state.list.forEach((cart, index) => {
				cart.products.forEach((goods, key) => {
					if (goods.checked) {
						data.push({
							goods_id: goods.goods_id,
							number: goods.number,
							sku_id: goods.sku.id
						});
					}
				});
			});
			// 判断是否登錄
			rootState.user.isLogin ? uni.navigateTo({url: `/pages/user/order/addorder?type=cart&data=${JSON.stringify(data)}`}) : uni.navigateTo({url: `/pages/user/auth/name`});
		},
		// 整理本地數據、云端同步數據-------------------------------------------需要同步----------
		async format({state, dispatch}, data){
			let map = {},dest = [];
			for (let i = 0; i < data.length; i++) {
				let cart = data[i];
				// 1.0.2升级 讀取數據库暂时取消所有已选
				cart.checked = false;
				if (!map[cart.shop_id]) {
					dest.push({
						shop_id: cart.shop_id,
						shop_name: cart.shop_name,
						products: [cart],
						check: false,
						choose: 0
					});
					map[cart.shop_id] = cart;
				} else {
					for (let j = 0; j < dest.length; j++) {
						let dj = dest[j];
						if (dj.shop_id == cart.shop_id) {
							dj.products.push(cart);
							break;
						}
					}
				}
			}
			state.list = dest;
			state.cartnum = 0;
			state.allchoose = 0;
			state.allsum = 0;
			state.allnum = 0;
			state.status = false; // 全选选中状态
			state.operate = false; // 管理購物車状态
			dispatch('storage', {type: 'synchro'});
		},
		// 加
		async bcadd({state, dispatch}, goods) {
			goods.number++;
			goods.sum = fun.bcadd(goods.sum, goods.sku.price);
			if (goods.checked) {
				state.allnum++;
				state.allsum = fun.bcadd(state.allsum, goods.sku.price);
			}
			dispatch('storage', {type: 'bcadd', goods: goods});
		},
		// もっと少なく
		async bcsub({state, dispatch}, goods) {
			if (goods.number > 1){
				goods.number--;
				goods.sum = fun.bcsub(goods.sum, goods.sku.price);
				if (goods.checked) {
					state.allnum--;
					state.allsum = fun.bcsub(state.allsum, goods.sku.price);
				}
				dispatch('storage', {type: 'bcsub', goods: goods});
			}
		},
		// 添加購物車---------------------------------------------------------------------------
		async add({state, dispatch}, goods){
			let isshop = -1;
			let data = {goods_id: goods.goods_id,sku_id: goods.sku_id,title: goods.title,image: goods.image,sku: goods.sku,number: goods.number,sum: goods.sum,checked: false};
			state.list.find((item, index)=> { 
				if(item.shop_id == goods.shop_id){
					isshop = index;
				}
			});
			// 新店铺
			if (isshop == -1) {
				state.list.push({
					shop_id: goods.shop_id,
					shop_name: goods.shop_name,
					products: [data],
					check: false, //店铺选中状态
					choose: 0, //商品选中個數
				}); 
			}else{
				// 老店铺追加
				let products = state.list[isshop].products;
				let isgoods = -1;
				products.find((item, index)=> {
					if(item.goods_id === goods.goods_id && item.sku_id === goods.sku_id){
						isgoods = index;
					}
				});
				if (isgoods == -1) {
					// 有新，即不會全选，複用以上方法全取消
					dispatch('shopfalse', state.list[isshop]);
					products.push(data);
				}else{
					// 商品已存在，只添加數量
					let shop = products[isgoods];
					shop.number += goods.number;
					shop.sum = fun.bcmul(goods.sku.price, shop.number);
					// 如果店铺全选,必须取消店铺全选
					if (shop.checked) {
						state.allnum += goods.number;
						state.allsum = fun.bcadd(state.allsum, fun.bcmul(goods.sku.price, goods.number));
					}
				}
			}
			dispatch('storage', {type: 'add', goods: goods});
		},
		// 移動入關註
		async move({state, dispatch, rootState}){
			// 判断是否登錄
			rootState.user.isLogin ? dispatch('storage', {type: 'follow'}) : uni.navigateTo({url: `/pages/user/auth/name`});
		},
		// 刪除購物車
		async del({state, dispatch}){
			// 判断是否全选如果全选直接清空
			if (state.status) {
				dispatch('empty');
			}else{
				dispatch('storage', {type: 'del'});
			}
		},
		// 清空購物車
		async empty({state, dispatch}){
			state.list = [];
			state.cartnum = 0;
			state.allchoose = 0;
			state.allsum = 0;
			state.allnum = 0;
			state.status = false; // 全选选中状态
			state.operate = false; // 管理購物車状态
			dispatch('storage', {type: 'empty'});
		},
		// 數據操作 1.0.2升级
		async storage({state, dispatch, rootState}, {type, goods}){
			let cloud = null; // 云端更新條件
			let storage = []; // 本地更新條件
			// 削除，移動關註需要用到
			let select = []; // 选中數據
			let unchecked = []; // 未选中數據
			// 操作數據
			if(type == 'empty'){
				cloud = {type: type};
			}else{
				// 遍曆
				state.list.forEach((cart, index) => {
					cart.products.forEach((item, key) => {
						let data = {shop_id: cart.shop_id,shop_name: cart.shop_name,goods_id: item.goods_id,title: item.title,number: item.number,image: item.image,sku: item.sku,sku_id: item.sku_id,sum: item.sum,checked: item.checked};
						if (type == 'del' || type == 'follow') {
							if (item.checked) {
								select.push(data);
							}else{
								unchecked.push(data);
							}
						}else{
							storage.push(data);
						}
					});
				});
				// 統計數量
				state.cartnum = storage.length;
				// 整理數據
				if(type == 'bcsub' || type == 'bcadd'){
					cloud = {type: type, goods_id: goods.goods_id, sku_id: goods.sku_id, number: goods.number, sum: goods.sum};
				}else if(type == 'del' || type == 'follow'){
					dispatch('format', unchecked);
					storage = unchecked;
					cloud = {type: type, data: select};
					// 取消管理
					state.operate = false;
				}else if(type == 'add'){
					cloud = {type: type, data: goods};
					// 取消全选
					state.status = false;
				}
			}
			// 操作云端
			if (cloud != null && rootState.user.isLogin) {
				api.post({
					url: '/wanlshop/cart/storage',
					data: cloud,
					success: res => {
						if (type == 'follow') {
							rootState.statistics.dynamic.collection = rootState.statistics.dynamic.collection + res;
						}
					}
				});
			}
			// 保存本地
			uni.setStorageSync("wanlshop:cart", storage);
		}
	}
};
