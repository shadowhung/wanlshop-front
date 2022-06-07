<template>
	<view class="wanl-order-list">
		<view class="edgeInsetTop"> </view>
		<view class="order-item radius-bock" v-for="(item, index) in dataList" :key="item.id">
			<view class="head">
				<view class="shop wanl-gray" @tap="onShop(item.shop.id)">
					<text class="wlIcon-dianpu1 wanl-black"></text>
					<text class="wanl-black margin-lr-xs text-30">{{item.shop.shopname}}</text>
					<text class="wlIcon-fanhuigengduo text-sm"></text>
				</view>
				<view class="margin-right-bj text-lg">
					<text class="wanl-orange wlIcon-tuikuan margin-right-xs text-bold"></text>
					<text class="text-sm">{{item.type_text}}</text>
				</view>
			</view>
			<!-- 商品 -->
			<view class="goods-box" @tap="onRefund(item.id)">
				<view class="cu-avatar xl margin-right-bj radius" :style="{backgroundImage: 'url('+$wanlshop.oss(item.goods.image, 70, 70)+')'}"> </view>
				<view class="content margin-right-bj">
					<view class="describe">
						<view class="text-cut-2 wanl-black">
							{{item.goods.title}}
						</view>
						<view class="text-sm margin-top-xs wanl-gray-light">
							{{item.goods.difference}}
						</view>
						<view class="text-sm margin-top-xs wanl-black">
							退款：<text class="text-price">{{item.price}}</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 底部 -->
			<view class="bg-bgcolor padding-bj margin-tb-bj margin-right-bj radius text-cente wanl-gray-light">
				<text class="margin-lr-bj wanl-black">{{getStateText(item.state)}}</text> {{getStateInfo(item.state)}}
			</view>
			<!-- 1.0.2升级 售後列表完成退款项目顯示關閉按钮 -->
			<view class="action-box padding-bottom-bj">
				<button class="cu-btn round line-black" v-if="item.state == 0 || item.state == 1 || item.state == 2 || item.state == 3 || item.state == 6" @tap="closeRefund(index)">払い戻しをキャンセルする</button>
				<button class="cu-btn round margin-lr-bj line-orange" @tap="onRefund(item.id)">詳細を見る</button>
			</view>
		</view>
		
		<view v-if="dataList.length == 0">
			<wanl-empty text="販売後の返金はありません"/>
		</view>
		<view class="edgeInsetBottom"></view> 
		<uni-load-more :status="status" :content-text="contentText" />
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
		};
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
				url: '/wanlshop/refund/refundList',
				data: {
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
		},
		// 取消退款
		async closeRefund(index){
			let refund = this.dataList[index];
			this.$api.get({
				url: '/wanlshop/refund/closeRefund',
				data: {
					id: refund.id
				},
				success: res => {
					this.$store.commit('statistics/order', {
						customer: this.$store.state.statistics.order.customer - 1
					});
					refund.state = 5;
					this.$wanlshop.msg('払い戻しは締め切らせていただきました');
				}
			});
		},
		getStateText(state){
			return ["売り手がに賛成するのを待って","買い手が返品するのを待つ","売り手が返金するのを拒絶する","プラットフォームが介入する","返金が完成する","返金が閉める","は売り手が返品を署名して受け取りを待ちます"][state];
		},
		getStateInfo(state){
			return ["成功する發が返金が起きて賣家がに賛成するのを待って","賣家はすでに賛成して、請は貨を退いて","あなたが貨を退いて請を述べて再度發が起きるのを改正することができる","はすでに請の平らな臺を述べて介入して、請は平らな臺がを判定するのを待って","返金が完成する","あなたがすでに返金をキャンセルして請を述べる","は商店があなたに貨物の並の返金を受け取りを待ちます"][state];
		},
		onRefund(id){
			this.$wanlshop.to(`/pages/user/refund/details?id=${id}`);
		}
	}
};
</script>

<style>
</style>
