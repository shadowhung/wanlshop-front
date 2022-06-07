<template>
	<view>
		<view class="edgeInsetTop"></view>
		<view class="wanl-logistics-list margin-top-bj" v-if="dataList.length != 0">
			<block v-for="(item,index) in dataList" :key="item.id">
			<view class="text-center wanl-gray">
				{{$wanlshop.timeToChat(item.createtime)}}
			</view>
			<view class="item margin-lr-bj margin-tb bg-white radius-bock padding-bj" @tap="$wanlshop.to(item.url)">
				<view class="title margin-bottom-bj">
					<text class="text-df">{{item.title}}</text>
					<text class="text-sm wanl-gray-light wlIcon-fanhui2"></text>
				</view>
				<view class="action">
					<image :src="$wanlshop.oss(item.image, 82, 82)"></image>
					<view class="padding-xs flex flex-wrap align-content-between">
						<view class="text-df margin-bottom-xs">{{item.content}}</view>
						<text class="text-sm wanl-gray">から {{item.come}}</text>
					</view>
				</view>
			</view>
			</block>
		</view>
		<wanl-empty src="notice_default3x" text="クーポンなし、生放送、新製品ニュース" v-else/>
		<view class="edgeInsetBottom"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataList: [],
				reload: false, //判断是否上拉
				total: 0, //數據量
				current_page: 1, //当前頁碼
				last_page: 1, //总頁碼
				status: 'more',
				contentText: {
					contentdown: ' ',
					contentrefresh: 'ロードの中',
					contentnomore: ''
				}
			}
		},
		onLoad() {
			this.loadData();
			// 清除本地角标
			this.$store.commit('statistics/noticec', {notice: 0});
		},
		onPullDownRefresh() {
			this.current_page = 1;
			this.reload = true;
			this.loadData();
		},
		onReachBottom() {
			//判断是否最後一頁
			if (this.current_page >= this.last_page) {
				this.status = 'noMore';
			} else {
				this.reload = false;
				this.current_page = this.current_page + 1; //頁碼+1
				this.status = 'loading';
				this.loadData();
			}
		},
		methods: {
			async loadData() {
				this.$api.get({
					url: '/wanlshop/notice/getNoticeList',
					data: {
						type: 'notice',
						page: this.current_page
					},
					success: res => {
						uni.stopPullDownRefresh();
						this.dataList = this.reload ? res.data : this.dataList.concat(res.data); //數據 追加
						this.total = res.total; //數據量
						this.current_page = res.current_page; //当前頁碼
						this.last_page = res.last_page; //总頁碼
						this.status = res.total == 0 ? 'noMore' : 'more';
					}
				});
			}
		}
	}
</script>

<style>

</style>
