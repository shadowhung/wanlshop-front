<template>
	<view class="wanl-order-list">
		<view class="navbar">
			<view class="nav-item text-df" v-for="(item, index) in navList" :key="item.state" :class="{ current: tabCurrentIndex === index }" @tap="tabClick(index)">
				{{ item.text }}
			</view>
		</view>
		<swiper :current="tabCurrentIndex" style="height: calc(100% - 60rpx)" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tag, key) in navList" :key="tag.state">
				<scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData">
					<!-- 空白頁 -->
					<wanl-empty text="クーポンが見つかりませんでした" src="ticket_default3x" v-if="tag.loaded === true && tag.cardList.length === 0"/>
					<!-- 訂單列表 -->
					<view class="wanl-coupon">
						<view v-for="(coupon, seat) in tag.cardList" :key="coupon.id" :class="[coupon.state == 1 ? coupon.type : 'wanl-gray']" class="item margin-bj radius-bock" @tap="onDetails(coupon)">
							<image :src="$wanlshop.appstc('/coupon/bg_coupon_3x.png')" class="coupon-bg "></image>
							<image v-if="coupon.state == 2" :src="$wanlshop.appstc('/coupon/img_coupon_beused_3x.png')" class="coupon-sign"></image>
							<image v-if="coupon.state == 3" :src="$wanlshop.appstc('/coupon/img_coupon_failure_3x.png')" class="coupon-sign"></image>
							<view class="item-left">
								<block v-if="coupon.type == 'reduction' || (coupon.type == 'vip' && coupon.usertype == 'reduction')">
									<view class="colour">
										<text class="text-price"></text>
										<text class="price">{{Number(coupon.price)}}</text>
									</view>
									<view class="cu-tag wanl-gray-dark radius text-sm">
										フル{{Number(coupon.limit)}}減{{Number(coupon.price)}}
									</view>
								</block>
								<block v-if="coupon.type == 'discount' || (coupon.type == 'vip' && coupon.usertype == 'discount')">
									<view class="colour">
										<text class="price">{{Number(coupon.discount)}}</text>
										<text class="discount">折りたたむ</text>
									</view>
									<view class="cu-tag wanl-gray-dark radius text-sm">
										フル{{Number(coupon.limit)}}ヒット{{Number(coupon.discount)}}折りたたむ
									</view>
								</block>
								<block v-if="coupon.type == 'shipping'">
									<view class="colour">
										<text class="price">送料無料</text>
									</view>
									<view class="cu-tag wanl-gray-dark radius text-sm">
										フル{{Number(coupon.limit)}}円送料無料
									</view>
								</block>
							</view>
							<view class="item-right padding-bj">
								<view v-if="coupon.shop_id!=0" class="shop" @tap="onShop(coupon.shop_id)">
									<view class="name">
										<text class="wlIcon-dianpu margin-right-xs"></text> {{coupon.shop.shopname}}
									</view>
									<view>
										<text class="wlIcon-fanhui2"></text>
									</view>
								</view>
								<view v-else class="shop" @tap="onShop(coupon.shop_id)">
								</view>
								<view class="title">
									<view class="cu-tag sm radius margin-right-xs tagstyle">
										{{coupon.type_text}}
									</view>
									<text class="text-cut wanl-gray text-min">{{coupon.name}}</text>
								</view>
								<view class="content text-min">
									<view class="wanl-gray">
										<view v-if="coupon.pretype == 'fixed'">
											<text class="wlIcon-dot"></text>{{coupon.enddate}} 以前に有効
										</view>
										<view v-else-if="coupon.pretype == 'appoint' && coupon.validity != 0">
											<text class="wlIcon-dot"></text>{{$wanlshop.timeFormat(coupon.createtime + coupon.validity * 86400)}} 以前に有効
										</view>
										<view v-else>
											<text class="wlIcon-dot"></text>使用前に 長期 効果的
										</view>
									</view>
									<view class="cu-btn sm round line-colour" v-if="coupon.state == 1" @tap.stop="onApply(coupon.id)">
										すぐに使用
									</view>
								</view>
							</view>
						</view>
					</view>
					<uni-load-more :status="tag.loadingType" :content-text="contentText"/>
					<view class="edgeInsetBottom"></view> 
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
export default {
	data() {
		return {
			tabCurrentIndex: 0,
			navList: [
				{
					state: 1,
					text: '未使用',
					loadingType: 'more',
					current_page: 1,
					cardList: []
				},
				{
					state: 2,
					text: '中古',
					loadingType: 'more',
					current_page: 1,
					cardList: []
				},
				{
					state: 3,
					text: '期限切れ',
					loadingType: 'more',
					current_page: 1,
					cardList: []
				}
			],
			contentText: {
				contentdown: ' ',
				contentrefresh: '読み込み中...',
				contentnomore: ''
			}
		};
	},
	onLoad(options) {
		this.loadData();
	},
	methods: {
		//swiper 切換
		changeTab(e) {
			this.tabCurrentIndex = e.target.current;
			this.loadData('tabChange');
		},
		//頂部tab點擊
		tabClick(index) {
			this.tabCurrentIndex = index;
		},
		//獲取訂單列表
		async loadData(source) {
			//這裏是將訂單掛載到tab列表下
			let index = this.tabCurrentIndex;
			let navItem = this.navList[index];
			let state = navItem.state;
			//判斷是否最後一頁
			if (navItem.loadingType == 'noMore') {
				return;
			}
			//tab切換只有第一次需要加載數據
			if (source === 'tabChange' && navItem.loaded === true) {
				return;
			}
			//防止重複加載
			if (navItem.loadingType === 'loading') {
				return;
			}
			navItem.loadingType = 'loading';
			// 獲取列表
			this.$api.get({
				url: '/wanlshop/coupon/getMyList',
				data: {
					state: state,
					page: navItem.current_page
				},
				success: res => {
					navItem.current_page = res.current_page; //當前頁碼
					if (res.last_page === res.current_page) {
						navItem.loadingType = 'noMore';
					} else {
						navItem.loadingType = 'more';
						navItem.current_page++;
					}
					let cardList = res.data.filter(item => {
						if (state === 0) {
							//0為全部訂單
							return item;
						}
						return Number(item.state) === state;
					});
					cardList.forEach(item => {
						navItem.cardList.push(item);
					});
					//loaded新字段用於表示數據加載完畢，如果為空可以顯示空白頁
					this.$set(navItem, 'loaded', true);
				}
			});
		},
		onApply(id){
			this.$wanlshop.to(`/pages/user/coupon/apply?id=${id}&state=true`);
		},
		onDetails(data){
			// this.$wanlshop.to(`/pages/user/coupon/details?data=${JSON.stringify(data)}`);
		}
	}
};
</script>

<style>
page {
	height: 100%;
}
</style>
