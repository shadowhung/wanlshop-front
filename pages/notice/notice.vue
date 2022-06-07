<template>
	<view class="notice">
		<!-- 導航條 -->
		<view class="cu-custom" :style="{height: wanlsys.height + 'px' }">
			<view class="cu-bar fixed bg-bgcolor" :style="{
				height: wanlsys.height + 'px', 
				paddingTop: wanlsys.top + 'px'
			}">
				<view class="action">
					<text class="wlIcon-fanhui1" style="margin-left: 0;" @tap="$wanlshop.back(1)"></text>
					<!-- #ifdef MP -->
					<text class="wlIcon-shezhi" @tap="$wanlshop.to('/pages/user/setting/notice')"></text>
					<!-- #endif -->
				</view>
				<view class="content" :style="{top: wanlsys.top + 'px'}">
					メッセージセンター
				</view>
				<!-- #ifndef MP -->
				<view class="action" >
					<text class="wlIcon-qingkong" @tap="empty()"></text>
					<text class="wlIcon-shezhi" @tap="$wanlshop.to('/pages/user/setting/notice')"></text>
				</view>
				<!-- #endif -->
			</view>
		</view>
		
		<view class="wanl-notice bg-bgcolor">
			<view class="tool">
				<view class="text-sm margin-right" v-if="statistics.notice.chat > 0">{{statistics.notice.chat}}論文 未読メッセージ</view>
				<view class="text-sm margin-right" v-else>未読メッセージはありません</view>
				<!-- #ifdef MP -->
				<view class="text-sm" @tap="empty()"><view class="cu-tag round sm margin-right-xs wlIcon-qingkong"></view>すべて読んだ</view>
				<!-- #endif -->
			</view>
			<view class="mode padding-bj">
				<view class="flex text-sm wanl-pip shadow-warp">
					<view class="logistics" @tap="$wanlshop.auth('/pages/notice/logistics/logistics')">
						<text class="wlIcon-wuliuqiache2"></text>
						ぶつりゅう
						<view class="cu-tag badge" v-if="statistics.notice.order != 0">{{statistics.notice.order}}</view>
					</view>
					<view class="notice" @tap="$wanlshop.auth('/pages/notice/notify/notify')">
						<text class="wlIcon-tongzhi"></text>
						通知する
						<view class="cu-tag badge" v-if="statistics.notice.notice != 0">{{statistics.notice.notice}}</view>
					</view>
					<view class="Interaction" @tap="$wanlshop.to('/pages/notice/system/system')">
						<text class="wlIcon-liuyan-fill"></text>
						システム
					</view>
				</view>
			</view>
		</view>

		<view class="wanl-msg" v-if="chat.list.length != 0">
			<view class="cu-list menu-avatar">
				<view class="cu-item" v-for="(item, index) in chat.list" :key="index" @tap="toChat(item.id)" :class="modalName=='move-box-'+ item.id?'move-cur':''" @touchstart="ListTouchStart" @touchmove="ListTouchMove" @touchend="ListTouchEnd" :data-target="'move-box-' + item.id">
					<view class="cu-avatar round lg" :style="{ backgroundImage: 'url(' + $wanlshop.oss(item.avatar, 100, 100) + ')' }"></view>
					<view class="content">
						<view class="wanl-black">{{item.name}}</view>
						<view class="wanl-gray text-sm flex">
							<view class="text-cut wanl-gray-light">
								{{item.content}}
							</view>
						</view> 
					</view>
					<view class="action">
						<view class="text-gray text-sm">{{$wanlshop.timeToChat(item.createtime)}}</view>
						<view class="cu-tag bg-red" v-if="item.count > 0">{{item.count}}</view>
					</view>
					<view class="move">
						<view class="bg-red" @tap.stop="del(index)">ローカルを削除</view>
					</view>
				</view>
			</view>
		</view>
		
		<wanl-empty src="notice_default3x" text="まだニュースはありません" v-else/>
		<view class="edgeInsetBottom"></view>
	</view>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
	data() {
		return {
			wanlsys: this.$wanlshop.wanlsys(),
			modalName: null,
			listTouchStart: 0,
			listTouchDirection: null
		};
	},
	computed: {
		...mapState(['chat','statistics'])
	},
	methods: {
		...mapActions({
			del: 'chat/del', // 刪除消息記錄
			empty: 'chat/empty', // 清空角标
		}),
		ListTouchStart(e) {
			this.listTouchStart = e.touches[0].pageX
		},
		ListTouchMove(e) {
			this.listTouchDirection = e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left'
		},
		ListTouchEnd(e) {
			if (this.listTouchDirection == 'left') {
				this.modalName = e.currentTarget.dataset.target
			} else {
				this.modalName = null
			}
			this.listTouchDirection = null
		}
	}
};
</script>

<style>
	.cu-bar .search-form{
		background-color: #f2f2f2;
	}
	/* #ifdef MP */
	.cu-bar .search-form{
		margin: 0 0 0 25rpx;
	}
	/* #endif */
</style>