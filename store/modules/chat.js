/**
 * WanlShop狀態管理器 - 即時通訊
 * 
 * @ author SHOP <kefu@shop.com> 
 * < 程序僅用作FastAdmin付費插件API測試使用，未經版權所有權人書面許可，不能用於商業用途！>
 * @ link http://www.shop.com
 * @ 2020年9月29日19:00:46
 * @ version 1.0.0
 **/
 import Vue from 'vue';
 import api from '../../common/request/request'; 
 import fun from '../../common/wanlshop_function'; 
 import config from '../../common/config/config';
 export default {
 	namespaced: true,
 	state: {
		ischat: {
			notice: true,
			number: 0
		},
		close: false,
		list: [],
		reconnections: 0
 	},
 	mutations: {
		setIschat(state, payload) {
			for (let i in payload) {
				for (let j in state.ischat) {
					if (i === j) {
						state.ischat[j] = payload[i];
					}
				}
			}
		}
 	},
 	actions: {
		// 開始或重啟即時通訊，全局監聽，主要用於系統消息提示
		async start({state, dispatch, rootState}){
			// 如果已連接，關閉重新連接
			uni.onSocketOpen(()=> {
				state.isclose = true;
			});
			if (state.isclose) {
				uni.closeSocket();
				uni.onSocketClose((res)=> {
					config.debug ? console.log('Chat 閉まっている！') : '';
				});
			}
			// 創建一個 WebSocket 連接
			uni.connectSocket({url: config.socketurl});
			// 監聽 WebSocket 連接打開事件
			uni.onSocketOpen((res)=> {
				config.debug ? console.log('Chat 接続が開かれました！') : '';
			});
			// 監聽WebSocket錯誤。
			uni.onSocketError((res)=> {
				api.get({
					url: '/wanlshop/chat/state',
					success: res => {
						state.reconnections += 1;
						if (state.reconnections <= 3) {
							uni.showToast({
							    title: `ネットワーク接続に失敗しました，しようとしています${state.reconnections}二次接続`,
							    icon: 'loading'
							});
							dispatch('start');
						}else{
							console.error('IMサーバーが正常に起動し、クライアントが3回再接続を試みました。wsとwssに正常にアクセスできるかどうかを確認してください');
						}
					},
					fail: err=> {
						uni.showModal({
						    content: err.data.msg,
						});
					}
				});
			});
			uni.onSocketMessage((res)=> {
				let data = JSON.parse(res.data);
				// 初始化
				if (data.type == 'init') {
					// 綁定 client_id 到 uid
					api.post({
						url: '/wanlshop/chat/shake',
						data: {'client_id': data.client_id},
						success: res => {
							uni.setStorageSync("wanlshop:chat_client_id", res);
						}
					});
				// 心跳回執
				}else if(data.type == 'ping'){
					// 通過 WebSocket 連接發送數據
					uni.sendSocketMessage({data: '{"type":"pong"}'});
				// 客服消息
				}else if(data.type == 'service') {
					// 全局通知
					uni.$emit('onService', data);
					// 消息提示
					dispatch('notice', {type: data.type, data: null});
				// 即時通訊消息
				}else if(data.type == 'chat'){
					// 全局通知
					uni.$emit('onChat', fun.setChat(data));
					// 更新數量
					dispatch('update', {type: data.type, data:data, shop: {id: data.form.shop_id, user_id: data.form.id, name: data.form.name,avatar: data.form.avatar,}});
					let tipsContent = '';
					if (data.message.type == 'text') {
						tipsContent = data.message.content.text
					}else if(data.message.type == 'img') {
						tipsContent = '[画像メッセージ]';
					}else if(data.message.type == 'voice') {
						tipsContent = '[ボイスメッセージ]';
					}
					if (state.ischat.notice) {
						dispatch('notice', {
							type: data.type, 
							data: {
								title: data.form.name,
								subtitle: 'メッセージを送信しました',
								content: tipsContent,
								jsondata: JSON.stringify({
									id: 0
								})
							}
						});
					}else{
						state.ischat.number++;
					}
				// 訂單消息
				}else if(data.type == 'order'){
					// 全局更新,分析訂單類型: 待收貨（已發貨）交易物流+1
					// 接受其他 簽收，退款申請同意，拒絕
					dispatch('storage', {type: data.type});
					// 消息提示
					dispatch('notice', {
						type: 'order',
						data: {
							title: data.title,
							subtitle: '',
							content: data.content,
							jsondata: JSON.stringify({
								modules: data.modules,
								modules_id: data.modules_id
							})
						}
					});
				// 通知消息

				}else if(data.type == 'notice'){
					dispatch('storage', {type: data.type});
					// 消息提示
					dispatch('notice', {
						type: data.type,
						data: {
							title: '題名',
							subtitle: '字幕',
							content: 'コンテンツ',
							jsondata: JSON.stringify({
								id: 0
							})
						}
					});
				}else if(data.type == 'live'){
					// 全局通知
					uni.$emit('onLive', data);
				}else{
					config.debug ? console.log('不明なメッセージ') : '';
				}
			});
			// 獲取一次聊天列表
			setTimeout(()=> {
				if (rootState.user.isLogin) {
					dispatch('get');
				}
			},300);
		},
		// 全局消息提示
		async notice({state, dispatch, rootState}, {type, data}){
			// 聲音提示
			if (rootState.user.voice) {
				let audio = uni.createInnerAudioContext();
				let cdn = rootState.common.appUrl.oss;
				let src = {
					service: cdn + '/assets/addons/wanlshop/voice/service.mp3',
					order: cdn + '/assets/addons/wanlshop/voice/order.mp3',
					notice: cdn + '/assets/addons/wanlshop/voice/notice.mp3',
					chat: cdn + '/assets/addons/wanlshop/voice/chat.mp3'
				};
				audio.autoplay = true;
				audio.src = src[type];
				audio.onPlay(() => {
					config.debug ? console.log('再生を開始します') : '';
				});
				audio.onError((res) => {
					config.debug ? console.log(res) : '';
				});
			}
			// 震動
			// #ifndef H5
				if (rootState.user.shock) {
					uni.vibrateShort();
				}
			// #endif
			//推送
			// #ifdef APP-PLUS
				// if (rootState.user.pushs) {
				// 	if (data) {
				// 		plus.push.createMessage(data.content, data.jsondata, {
				// 			cover: false,
				// 			title: data.title,
				// 			subtitle: data.subtitle
				// 		});
				// 	}else{
				// 		config.debug ? console.log('推送數據不存在無法推送') : '';
				// 	}
				// }
			// #endif
		},
		// 讀取消息列表
		async get({state, dispatch, rootState}) {
			api.get({
				url: '/wanlshop/chat/lists',
				success: res => {
					state.list = res;
					let count = 0;
					res.forEach(item => {count += item.count;});
					dispatch('storage', {type: 'statis', number: count});
				}
			});
		},
		// 刪除指定消息
		async del({state, dispatch, rootState}, index){
			let list = state.list;
			// 修改消息總數量
			dispatch('storage', {type: 'del', number: list[index].count});
			// 清空本地儲存
			uni.removeStorage({
			    key: 'wanlchat:message_' + list[index].user_id,
			    success: (res) => {
					config.debug ? console.log('メッセージを正常に削除する'):'';
			    }
			});
			// 操作雲
			api.post({url: '/wanlshop/chat/del',data: {id: list[index].user_id}});
			// 刪除狀態管理器
			Vue.delete(state.list, index);
		},
		// 全部已讀
		async empty({state, dispatch, rootState}){
			uni.showModal({
			    content: 'すべてのデータを既読としてマークするかどうか？',
			    success: res=> {
			        if (res.confirm) {
						// 已讀狀態管理器
			            state.list.forEach(item => {item.count = 0});
						// 全局清零
						dispatch('storage', {type: 'empty'});
			            // 操作雲
			            api.post({
			            	url: '/wanlshop/chat/read',
			            	success: res => {
			            		uni.showToast({title: 'すべて読んだ',icon: 'none'});
			            	}
			            });
			        } else if (res.cancel) {
						config.debug ? console.log('ユーザーがクリックしてキャンセル') : '';
			        }
			    }
			});
		},
		// 通用更新，接受消息更新，發送消息更新，返回清空角標
		async update({state, dispatch}, {type, data, id, shop}){
			if (type == 'del') {
				let counts = 0;
				state.list.some(chat => {if (chat.user_id == id) {
					counts = chat.count;
					chat.count = 0;
					return true
				}});
				// 操作統計
				dispatch('storage', {type: 'del', number: counts});
				// 操作雲
				api.post({url: '/wanlshop/chat/clear',data: {id: id}});
			}else if(type == 'chat' || type == 'send'){
				let content = '';
				let createtime = data.createtime;
				let chat_id = 0;
				let chat_name = null;
				let chat_avatar = null;
				if (data.message.type == 'text') {
					content = data.message.content.text;
				}else if(data.message.type == 'img') {
					content = '[画像メッセージ]';
				}else if(data.message.type == 'voice') {
					content = '[ボイスメッセージ]';
				}else if(data.message.type == 'goods') {
					content = '[商品ニュース]';
				}else{
					content = '[不明なタイプのメッセージ]';
				}
				if(type == 'chat'){
					chat_id = data.form.id;
					dispatch('storage', {type: 'chat'});
				}else if (type == 'send') {
					chat_id = data.to_id;
				}
				let result = state.list.some(chat => {
					if (chat.user_id == chat_id) {
						if(type == 'chat'){
							chat.count += 1;
						}
						chat.createtime = createtime;
						chat.content = content;
						return true
					}
				});
				// 如果沒有新增一個，chat 數量初始1
				if (!result) {
					Vue.set(state.list, 0, {
						id: shop.id,
						user_id: shop.user_id,
						name: shop.name,
						avatar: shop.avatar,
						content: content,
						count: 1,
						createtime: createtime,
					});
				}
			}
		},
		// 操作儲存
		async storage({state, rootState}, {type, number}) {
			if(type == 'statis'){
				rootState.statistics.notice.chat = number; 
			}else if(type == 'order'){
				rootState.statistics.notice.order += 1;
			}else if(type == 'notice'){
				rootState.statistics.notice.notice += 1;
			}else if(type == 'chat'){
				rootState.statistics.notice.chat += 1;
			}else if(type == 'del'){
				rootState.statistics.notice.chat -= number;
			}else if(type == 'empty'){
				rootState.statistics.notice.chat = 0; 
				rootState.statistics.notice.order = 0; 
				rootState.statistics.notice.notice = 0; 
			}
			uni.setStorageSync("wanlshop:statis", rootState.statistics);
		},
		// 關閉即時通訊
		async close(){
			uni.onSocketOpen(()=> {
				uni.closeSocket();
			});
			uni.onSocketClose((res)=> {
				console.log('Chat 閉まっている！');
			});
		}
 	}
 };

