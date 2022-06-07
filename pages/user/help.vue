<template>
	<view>
		<view class="edgeInsetTop"></view>
		<view class="wanl-service bg-white padding-lr">
			<view @tap="$wanlshop.to('/pages/user/service')">
				<view class="cu-avatar lg round bg-white solid">
					<text class="wlIcon-unie737 text-cyan"></text>
				</view>
				<view class="margin-top-xs text-df">
					オンラインカスタマーサービス
				</view>
			</view>
			<!--<view @tap="$wanlshop.phone(common.appConfig.tel_phone)">
				<view class="cu-avatar lg round bg-white solid">
					<text class="wlIcon-31guanzhuxuanzhong text-blue"></text>
				</view>
				<view class="margin-top-xs text-df">
					買賣專線
				</view>
			</view>
			<view @tap="$wanlshop.phone(common.appConfig.tel_phone)">
				<view class="cu-avatar lg round bg-white solid">
					<text class="wlIcon-dianhua text-purple"></text>
				</view>
				<view class="margin-top-xs text-df">
					服務熱線
				</view>
			</view>-->
		</view>
		<view class="bg-white text-center padding-bottom-sm">
			<text class="text-gray text-sm">営業時間: {{common.appConfig.working_hours}}</text>
		</view>
		<view class="cu-bar bg-white solid-bottom margin-top" v-if="dataList.length != 0">
			<!--<view class="action">
				常見問題
			</view>-->
		</view>
		<wanl-empty v-else/>
		<view class="cu-list menu">
			<view class="cu-item arrow " v-for="(item, index) in dataList" :key="item.id" @tap="onDetails(item.id,item.title)">
				<view class="content text-cut">
					<text class="text-gray-2">{{item.title}}</text>
				</view>
			</view>
		</view>
		<uni-load-more :status="status" :content-text="contentText" />
	</view>
</template>

<script>
	import { mapState } from 'vuex';
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
		computed: {
			...mapState(['common'])
		},
		onLoad() {
			this.loadData();
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
				this.$api.post({
					url: '/wanlshop/article/getList',
					data: {
						page: this.current_page,
						type: 'help'
					},
					success: res => {
						uni.stopPullDownRefresh();
						this.dataList = this.reload ? res.data : this.dataList.concat(res.data); //數據 追加
						this.total = res.total; //數據量
						this.current_page = res.current_page; //当前頁碼
						this.last_page = res.last_page; //总頁碼
						this.status = res.total == 0 ? 'noMore':'more';
					}
				});
			},
		}
	}
</script>

<style>
.solid::after {
    border: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
