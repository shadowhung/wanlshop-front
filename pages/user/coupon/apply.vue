<template>
	<view class="wanl-coupon">
		<view class="edgeInsetTop"></view>
		<view class="padding-bj bg-red text-black">
			 <!--@tap="onDetails(coupon)"-->
			<view :class="coupon.type" class="item radius-bock" v-if="coupon">
				<image :src="$wanlshop.appstc('/coupon/bg_coupon_3x.png')" class="coupon-bg"></image>
				<image :src="$wanlshop.appstc('/coupon/img_couponcentre_received_3x.png')" class="coupon-sign" v-if="coupon_state"></image>
				<view class="item-left">
					<block v-if="coupon.type == 'reduction' || (coupon.type == 'vip' && coupon.usertype == 'reduction')">
						<view class="colour">
							<text class="text-price"></text>
							<text class="price">{{Number(coupon.price)}}</text>
						</view>
						<view class="cu-tag wanl-gray-dark radius text-sm">
							フル{{Number(coupon.limit)}}もっと少なく{{Number(coupon.price)}}
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
					<view class="title">
						<view class="cu-tag sm radius margin-right-xs tagstyle">
							{{coupon.type_text}}
						</view>
						<text class="text-cut wanl-gray text-min">{{coupon.name}}</text>
					</view>
					<view class="content text-min">
						<view class="wanl-gray">
							<view>
								<text class="wlIcon-dot"></text>現在のページで利用可能なすべての製品
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
						<view class="cu-btn sm round" @tap.stop="onReceive(coupon.id)" v-if="!coupon_state">
							今すぐ入手
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="">
			<wanl-product :dataList="dataList"/>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				coupon_id: 0,
				coupon_state: false,
				coupon: null,
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
		onLoad(option) {
			this.coupon_id = option.id;
			this.coupon_state = option.state ? true : false;
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
			//獲取優惠券和商品列表
			async loadData() {
				this.$api.get({
					url: '/wanlshop/coupon/apply',
					data: {
						id: this.coupon_id,
						page: this.current_page
					},
					success: res => {
						uni.stopPullDownRefresh();
						this.coupon = res.coupon;
						this.dataList = this.reload ? res.goods.data : this.dataList.concat(res.goods.data); //數據 追加
						this.total = res.goods.total; //數據量
						this.current_page = res.goods.current_page; //当前頁碼
						this.last_page = res.goods.last_page; //总頁碼
						this.status = res.goods.total == 0 ? 'noMore' : 'more';
					}
				});
			},
			// クーポンを受け取る
			async onReceive(coupon_id) {
				this.$api.post({
					url: '/wanlshop/coupon/receive',
					loadingTip: '受信',
					data: {
						id: coupon_id
					},
					success: res => {
						this.coupon_state = true;
						this.$wanlshop.msg(res);
						this.$store.commit('statistics/dynamic', {
							coupon: this.$store.state.statistics.dynamic.coupon + 1
						});
					}
				});
			}
		}
	}
</script>

<style>

</style>
