<template>
	<view>
		<view class="edgeInsetTop"></view>
		<view class="cu-list menu sm-border">
			<view class="cu-item" style="min-height:200rpx;" @tap="$wanlshop.auth('user')">
				<view class="cu-avatar round lg margin-right"  :style="{backgroundImage: 'url('+ $wanlshop.oss(user.avatar, 52, 52, 2, 'avatar') +')'}"></view> 
				<view class="content" style="line-height: 1.5em;"> 
					<view class="text-lg">
						{{user.nickname || 'ログインしていない'}}
					</view>
					<view class="wanl-grey text-df">
						ユーザー名：{{user.username || 'ログインしていない'}}
					</view>
				</view>
				<view class="action">
					<text class="wlIcon-jifen"></text>
					<text class="margin-lr-xs">編集</text>
					<text class="wlIcon-fanhui2"></text>
				</view>
			</view>
			<view class="cu-item arrow" @tap="$wanlshop.auth('../address/address')" :style="{backgroundImage: 'url('+usermaks+')'}">
				<view class="content">
					<text>私の配送先住所</text>
				</view>
			</view>
		</view>
		
		<view class="cu-list menu sm-border margin-top">
			<view class="cu-item arrow" @tap="$wanlshop.auth('loginpass')">
				<view class="content">
					<text>ログインパスワードを変更する </text>
				</view>
			</view>
			<view class="cu-item arrow" @tap="$wanlshop.auth('paypass')">
				<view class="content">
					<text>支払いパスワードを変更する</text>
				</view>
			</view>
		</view>
		
		<!--<view class="cu-list menu sm-border margin-top">
			<view class="cu-item arrow" @tap="$wanlshop.auth('security')">
				<view class="content">
					<text>帳號與安全</text>
				</view>
			</view>
		</view>-->
		
		<view class="cu-list menu sm-border margin-top">
			<view class="cu-item arrow" @tap="$wanlshop.to('notice')">
				<view class="content">
					<text>新しいメッセージ通知</text>
				</view>
			</view>
			<!-- <view class="cu-item arrow" @tap="$wanlshop.to('privacy')">
				<view class="content">
					<text>
隱私</text>
				</view>
			</view> -->
			<view class="cu-item arrow" @tap="$wanlshop.to('currency')">
				<view class="content">
					<text>ユニバーサル</text>
				</view>
			</view>
		</view>
		
		<view class="cu-list menu sm-border margin-top">
			<view class="cu-item arrow" @tap="clearCache()">
				<view class="content">
					<text>キャッシュの消去</text>
				</view>
				<view class="action">
					<view class="cu-tag round">
						{{fileSizeString}}
					</view>
				</view>
			</view>
			<view class="cu-item arrow" @tap="$wanlshop.to('about','pop-in',200)">
				<view class="content">
					<text>オン</text>
				</view>
				<view class="action">
					<text class="wanl-gray">{{common.version}}</text>
				</view>
			</view>
		</view>
		
		
	</view>
</template>

<script>
	
	import {mapState} from 'vuex';
	export default {
		data() {
			return {
				fileSizeString: '0 B',
				usermaks: ''
			}
		},
		computed: {
			...mapState(['user','common'])
		},
		onLoad() {
			// #ifdef APP-PLUS
			this.formatSize();
			// #endif
			this.usermaks = this.$wanlshop.maks();
		},
		methods: {
			formatSize() {  
                plus.cache.calculate((size)=> {  
                    let sizeCache = parseInt(size);  
                    if (sizeCache == 0) {  
                        this.fileSizeString = "0 B";  
                    } else if (sizeCache < 1024) {  
                        this.fileSizeString = sizeCache + " B";  
                    } else if (sizeCache < 1048576) {  
                        this.fileSizeString = (sizeCache / 1024).toFixed(2) + " KB";  
                    } else if (sizeCache < 1073741824) {  
                        this.fileSizeString = (sizeCache / 1048576).toFixed(2) + " MB";  
                    } else {  
                        this.fileSizeString = (sizeCache / 1073741824).toFixed(2) + " GB";  
                    }  
                }); 
            },
			clearCache() {  
				// #ifndef APP-PLUS
				this.$wanlshop.msg('キャッシュが見つかりません');
				// #endif
				// #ifdef APP-PLUS
				uni.showModal({
				    title: '促す',
				    content: 'キャッシュをクリアしてもよろしいですか',
				    success: (res)=> {
				        if (res.confirm) {
				           if (plus.os.name == 'Android') {
				               let main = plus.android.runtimeMainActivity();  
				               let sdRoot = main.getCacheDir();  
				               let files = plus.android.invoke(sdRoot, "listFiles");  
				               let len = files.length;  
				               for (let i = 0; i < len; i++) {  
				                   let filePath = '' + files[i]; // 沒有找到合適的方法獲取路徑，這樣寫可以轉成文件路徑  
				                   plus.io.resolveLocalFileSystemURL(filePath, (entry)=> {  
				                       if (entry.isDirectory) {  
				                           entry.removeRecursively((entry)=> { //遞歸刪除其下的所有文件及子目錄  
				           					this.$wanlshop.msg('キャッシュのクリーニングが完了しました');
				                               this.formatSize(); // 重新計算緩存  
				                           }, (e)=> {  
				                               console.log(e.message)  
				                           });  
				                       } else {  
				                           entry.remove();  
				                       }  
				                   }, (e)=> {  
				                       console.log('ファイルパスの読み取りに失敗しました')  
				                   });  
				               }  
				           } else { // ios暫時未找到清理緩存的方法，以下是官方提供的方法，但是無效，會報錯  
				               plus.cache.clear(()=> {  
				                   this.$wanlshop.msg('キャッシュのクリーニングが完了しました');
				                   this.formatSize();  
				               });  
				           }  
				        }
				    }
				});
                
				// #endif
            }
		}
	}
</script>

<style>

</style>
