/**
 * WanlShop状态管理器 - 系統更新 - 後续版本更新
 * 
 * @ author SHOP <kefu@shop.com> 
 * < 程序僅用作FastAdmin付费插件API测试使用，未经版權所有權人书面許可，不能用於商业用途！>
 * @ link http://www.shop.com
 * @ 2020年9月29日19:00:46
 * @ version 1.0.0
 **/
import Vue from 'vue';
import api from '../../common/request/request';
import config from '../../common/config/config';

export default {
	namespaced: true,
	// 储存數據
	state: {
		update: false,
		data: {},
		link: {},
		download: {
			path: null,
			start: false,
			install: false,
			progress: 0,
			totalBytesWritten: 0,
			totalBytesExpectedToWrite: 0,
		},
		task: null
	},
	// 修改數據
	mutations: {
		edit(state, {data, index}){
			state[index] = data;
		}
	},
	actions: {
		async update({commit, dispatch}) {
			// #ifdef MP
			const mp = uni.getUpdateManager();
			// 請求完新版本信息的回调
			mp.onCheckForUpdate((res) => {
				console.log(res.hasUpdate);
			});
			mp.onUpdateReady((res) => {
				// 新的版本已经下載好，调用 applyUpdate 应用新版本並重啟
				uni.showModal({
					title: 'リマインダーを更新',
					content: '新しいバージョンの準備ができました。アプリケーションを再起動しますか？？',
					success(show) {
						if (show.confirm) {
							mp.applyUpdate();
						}
					}
				});
			});
			mp.onUpdateFailed((res) => {
				console.log('新しいバージョンのダウンロードに失敗しました');
			});
			// #endif
			
			// #ifdef APP-PLUS
			let storage = uni.getStorageSync('wanlshop:update');
			if (!storage.ignore) {
				api.get({
					url: '/wanlshop/common/update',
					success: (res) => {
						if (res !== null) {
							// 獲取本地緩存
							if (Number(config.versionCode) !== Number(res.versionCode)) {
								let link = false;
								// 写入全局數據
								res.content = res.content.replace(/(\r\n)|(\n)/g, '<br>');
								commit('edit', {data: res, index: 'data'});
								// 下載鏈接
								if (plus.os.name.toLowerCase() === 'ios') {
									if (res.iosLink && res.iosLink !== '') {
										commit('edit', {data: {url: config.cdnurl + res.iosLink, type: res.iosLink.match(RegExp(/.wgt/)) ? 'wgt' : 'url'}, index: 'link'});
										link = true;
									}
								} else {
									if (res.iosLink && res.iosLink !== '') {
										commit('edit', {data: {url: config.cdnurl + res.iosLink, type: res.iosLink.match(RegExp(/.wgt/)) ? 'wgt' : 'url'}, index: 'link'});
										link = true;
									}
								}
								// 更新方式
								res.enforce === 1 ? (link && dispatch('download')) : (link && commit('edit', {data: true, index: 'update'}));
							}else{
								// 如果有緩存刪除
								if (storage.path) {
									uni.removeSavedFile({
										filePath: storage.path,
										success: (res) => {
											uni.removeStorageSync('wanlshop:update');
										}
									});
								}
							}
						}else{
							console.log('更新されたバージョンはまだ見つかりません');
						}
					}
				});
			}
			// #endif
		},
		async download({state, commit, dispatch}) {
			// #ifdef APP-PLUS
			let storage = uni.getStorageSync('wanlshop:update');
			let link = state.link;
			let download = state.download;
			// 判断是否下載過，下載過安装
			if (storage.path) {
				console.log('ダウンロードされましたが、インストールされていません');
				commit('edit', {data: false, index: 'update'});
				if (link.type == 'wgt') {
					download.path = storage.path;
					if (state.data.enforce === 1) {
						dispatch('install');
					}else{
						uni.showModal({
							title: '更新はまだ完了していません',
							content: 'インストールが完了していないか、インストールされているバージョン番号が最新ではありません。 アップデートパッケージのインストールを続行しますか？？',
							success: (res) => {
								if (res.confirm) {
									dispatch('install');
								}
							}
						});
					}
				}else if(link.type == 'url'){
					plus.runtime.openURL(link.url);
				}
			}else{
				// 判断下載類型
				if (link.type == 'wgt') {
					download.start = true;
					// 创建下載任務對象
					state.task = uni.downloadFile({
						url: link.url,
						success: (res) => {
							if (res.statusCode === 200) {
								// 保存下載的安装包
								uni.saveFile({
									tempFilePath: res.tempFilePath,
									success: (file) => {
										// 本地緩存
										uni.setStorage({
											key: 'wanlshop:update',
											data: {
												path: file.savedFilePath,
												ignore: false
											}
										});
										// 保存地址
										download.path = file.savedFilePath;
										// 任務完成，關閉下載任務
										state.task.abort();
										state.task = null;
										download.start = false;
										// 进行安装
										dispatch('install');
									}
								});
							}else{
								uni.showToast({
								    title: `アップデートはありますが、アップデートファイルが異常です：${link.url}`,
									icon: 'none',
								    duration: 5000
								});
							}
						}
					});
					// 进度條更新
					state.task.onProgressUpdate((res) => {
						// 下載进度百分比
						download.progress = res.progress;
						// 已经下載的數據长度，單位 Bytes
						download.totalBytesWritten = res.totalBytesWritten;
						// 預期需要下載的數據总长度，單位 Bytes
						download.totalBytesExpectedToWrite = res.totalBytesExpectedToWrite;
					});
				}else if(link.type == 'url'){
					// 弹出更新
					console.log('ポップアップの更新');
					plus.runtime.openURL(link.url);
				}
			}
			// #endif
		},
		async install({state, commit}) {
			console.log('開始安装');
			// #ifdef APP-PLUS
			let download = state.download;
			let force = state.update ? {} : {force: true};
			// 更新状态
			download.install = true;
			// 安装更新
			plus.runtime.install(download.path, force, function() {
				// 更新状态
				commit('edit', {data: false, index: 'update'});
				download.install = false;
				// 更新提示
				uni.showModal({
					title: '更新に成功しました',
					content: 'アプリが再起動して更新が完了します',
					showCancel: false,
					complete: () => {
						plus.runtime.restart();
					}
				});
			}, function(e) {
				// 更新状态
				download.install = false;
			    uni.showToast({
			        title: `インストールに失敗しました：${e.message}`,
					icon: 'none',
			        duration: 8000
			    });
			});
			// #endif
		},
		// 忽略升级
		async ignore({state, commit}) {
			// 本地緩存
			uni.setStorage({
				key: 'wanlshop:update',
				data: {
					path: null,
					ignore: true
				}
			});
			commit('edit', {data: false, index: 'update'});
		}
	}
};
