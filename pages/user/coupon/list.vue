<template>
	<view class="wanl-order-list">
		<view class="navbar">
			<view class="nav-item text-df" v-for="(item, index) in navList" :key="index" :class="{ current: tabCurrentIndex === index }" @tap="tabClick(index)"> {{ item.text }} </view>
		</view>
		<swiper :current="tabCurrentIndex" style="height: calc(100% - 60rpx)" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tag, key) in navList" :key="key">
				<scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData">
					<!-- 空白頁 -->
					<wanl-empty text="クーポンが見つかりませんでした" src="ticket_default3x" v-if="tag.loaded === true && tag.cardList.length === 0"/>
					<!-- 訂單列表 -->
					<view class="wanl-coupon">
						<view v-for="(coupon, seat) in tag.cardList" :key="seat" :class="coupon.type" class="item margin-bj radius-bock"  @tap="onDetails(coupon)">
							<image :src="$wanlshop.appstc('/coupon/bg_coupon_3x.png')" class="coupon-bg"></image>
							<image :src="$wanlshop.appstc('/coupon/img_couponcentre_received_3x.png')" class="coupon-sign" v-if="coupon.state"></image>
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
										
										<view v-if="coupon.grant != '-1'">
											<text class="wlIcon-dot"></text>現在残っているのは {{coupon.surplus}} 張
										</view>
										
										<view v-if="coupon.drawlimit != 0">
											<text class="wlIcon-dot"></text>お一人様のみ領収書 {{coupon.drawlimit}} 張
										</view>
										<block v-if="coupon.pretype == 'fixed'">
											<view>
												<text class="wlIcon-dot"></text>有効にする {{coupon.startdate}}
											</view>
											<view>
												<text class="wlIcon-dot"></text>終わり {{coupon.enddate}}
											</view>
										</block>
										<block v-if="coupon.pretype == 'appoint'">
											<view v-if="coupon.validity == 0">
												<text class="wlIcon-dot"></text>使用前に パーマネント 効果的
											</view>
											<view v-else>
												<text class="wlIcon-dot"></text>受け取ってから {{coupon.validity}} 日効果的
											</view>
										</block>
									</view>
									<view class="cu-btn sm round line-colour" @tap.stop="onApply(coupon.id)" v-if="coupon.state">
										すぐに使用
									</view>
									<view class="cu-btn sm round" @tap.stop="onReceive(key,seat)" v-else>
										今すぐ入手
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
					type: 'reduction',
					text: '完全割引',
					loadingType: 'more',
					current_page: 1,
					cardList: []
				},
				{
					type: 'discount',
					text: '割引クーポン',
					loadingType: 'more',
					current_page: 1,
					cardList: []
				},
				{
					type: 'shipping',
					text: '送料無料クーポン',
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
			let type = navItem.type;
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
				url: '/wanlshop/coupon/getList',
				data: {
					type: type,
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
						item = Object.assign(item, {
							state: false
						});
						return item.type === type;
					});
					cardList.forEach(item => {
						navItem.cardList.push(item);
					});
					//loaded新字段用於表示數據加載完畢，如果為空可以顯示空白頁
					this.$set(navItem, 'loaded', true);
				}
			});
		},
		// クーポンを受け取る
		async onReceive(key,seat) {
			let coupon = this.navList[key].cardList[seat];
			this.$api.post({
				url: '/wanlshop/coupon/receive',
				loadingTip: '受信',
				data: {
					id: coupon.id
				},
				success: res => {
					coupon.id = res.id;
					coupon.state = true;
					this.$wanlshop.msg(res.msg);
					this.$store.commit('statistics/dynamic', {
						coupon: this.$store.state.statistics.dynamic.coupon + 1
					});
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
