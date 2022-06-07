<template>
	<view class="wanl-order-list">
		<view class="navbar">
			<view class="nav-item text-df" v-for="(item, index) in navList" :key="item.state" :class="{ current: tabCurrentIndex === index }" @tap="tabClick(index)">
				{{ item.text }}
			</view>
		</view>
		<swiper :current="tabCurrentIndex" style="height: calc(100% - 80rpx)" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tag, key) in navList" :key="tag.state">
				<scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData">
					<!-- 空白頁 -->
					<wanl-empty text="注文が見つかりません"v-if="tag.loaded === true && tag.orderList.length === 0"/>
					<!-- 訂單列表 -->
					<view v-for="(order, okey) in tag.orderList" :key="order.id" class="order-item radius-bock">
						<view class="head">
							<view class="shop wanl-gray" @tap="onShop(order.shop_id)">
								<text class="wlIcon-dianpu1 wanl-black"></text>
								<text class="wanl-black margin-lr-xs text-30">{{ order.shop.shopname }}</text>
								<text class="wlIcon-fanhuigengduo text-sm"></text>
							</view>
							<view class="margin-right-bj text-sm">
								<text class="state" :style="{ color: order.stateTipColor }">{{ order.stateTip }}</text>
								<text v-if="order.state === 7" class="margin-left-sm wlIcon-lajitong" @tap="deleteOrder(order.id,okey)"></text>
							</view>
						</view>
						<!-- 商品 -->
						<view class="goods-box" v-for="(goods, gkey) in order.goods" :key="goods.id" @tap="orderDetails(order.id)">
							<view class="cu-avatar xl margin-right-bj radius" :style="{backgroundImage: 'url('+$wanlshop.oss(goods.image, 70, 70)+')'}"> </view>
							<view class="content margin-right-bj">
								<view class="describe">
									<view class="text-cut-2">
										{{goods.title}}
									</view>
									<view class="wanl_sku text-min">
										<text class="wanl-gray-dark">{{goods.difference}}</text>
									</view>
								</view>
								<view class="parameter">
									<view class="text-price text-sm text-black">
										{{ goods.price }}
									</view>
									<view class="text-min text-gray">
										x {{ goods.number }}
									</view>
									<!-- 退款状态:0=未退款,1=退款中,2=待退貨,3=退款完成 -->
									<view class="text-min text-yellow" v-if="goods.refund_status != 0">
										{{getRefund(goods.refund_status)}}
									</view>
								</view>
							</view>
						</view>
						<!-- 底部 -->
						<view class="price-box text-xs flex">
							<view class="margin-right-sm">ディスカウント：<text class="text-price">{{ order.pay.discount_price }}</text></view>
							<view class="margin-right-sm">速達便：<text class="text-price">{{ order.pay.freight_price }}</text></view>
							<view>合計金額：<text class="text-price text-df">{{ order.pay.price }}</text></view>
						</view>
						<view class="action-box padding-bottom-bj" v-if="order.state == 1">
							<button class="cu-btn round line-black margin-lr-bj" @tap="editAddress(order.id)">住所を変更する</button>
							<button class="cu-btn round line-black" @tap="cancelOrder(order)">注文をキャンセルする</button>
							<button class="cu-btn round margin-lr-bj wanl-bg-orange" @tap="paymentOrder(order.id)">すぐに支払う</button>
						</view>
						<view class="action-box padding-bottom-bj" v-if="order.state == 2">
							<button class="cu-btn round line-black" @tap="toChat(order.shop_id)">出品者に連絡する</button>
							<button class="cu-btn round margin-lr-bj wanl-bg-orange" @tap="editAddress(order.id)">住所を変更する</button>
						</view>
						<view class="action-box padding-bottom-bj" v-if="order.state == 3">
							<button class="cu-btn round line-black" @tap="onLogistics(order.id)">ロジスティクスを見る</button>
							<button class="cu-btn round margin-lr-bj wanl-bg-orange" @tap="cpaypass(order)">領収書の確認</button>
						</view>
						<view class="action-box padding-bottom-bj" v-if="order.state == 4">
							<button class="cu-btn round line-black" @tap="onLogistics(order.id)">ロジスティクスを見る</button>
							<button class="cu-btn round margin-lr-bj line-black" @tap="commentOrder(order.id)">コメント順</button>
						</view>
					</view>
					<uni-load-more :status="tag.loadingType" :content-text="contentText"/>
					<view class="edgeInsetBottom"></view> 
				</scroll-view>
			</swiper-item>
		</swiper>
		<uni-popup ref="popup" type="dialog">
		    <uni-popup-dialog mode="input" title="支払いパスワード" placeholder="支払いパスワードを入力してください" :duration="2000" :before-close="true" @close="popupclose" @confirm="confirm"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue'
import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
export default {
	components: {
		uniPopup,
		uniPopupMessage,
		uniPopupDialog
	},
	data() {
		return {
			tabCurrentIndex: 0,
			navList: [
				{
					state: 0,
					text: 'すべて',
					loadingType: 'more',
					current_page: 1,
					orderList: []
				},
				{
					state: 1,
					text: '未払い',
					loadingType: 'more',
					current_page: 1,
					orderList: []
				},
				{
					state: 2,
					text: '未発送',
					loadingType: 'more',
					current_page: 1,
					orderList: []
				},
				{
					state: 3,
					text: '到着予定',
					loadingType: 'more',
					current_page: 1,
					orderList: []
				},
				{
					state: 4,
					text: 'コメント',
					loadingType: 'more',
					current_page: 1,
					orderList: []
				}
				// ,{
				// 	state: 7,
				// 	text: '已關閉',
				// 	loadingType: 'more',
				// 	current_page: 1,
				// 	orderList: []
				// }
			],
			contentText: {
				contentdown: ' ',
				contentrefresh: '読み込み中...',
				contentnomore: ''
			},
			showPop:false,
			contentPop:'',
			corder:'',
		};
	},
	onLoad(options) {
		if (!options.state) {
			options.state = 0;
		}
		this.tabCurrentIndex = +options.state;
		// #ifndef MP
		this.loadData();
		// #endif
		// #ifdef MP
		if (options.state == 0) {
			this.loadData();
		}
		// #endif
	},
	methods: {
		//獲取訂單列表
		loadData(source) {
			//这里是將訂單挂載到tab列表下
			let index = this.tabCurrentIndex;
			let navItem = this.navList[index];
			let state = navItem.state;
			//判断是否最後一頁
			if (navItem.loadingType == 'noMore') {
				return;
			}
			//tab切换只有第一次需要加載數據
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
				url: '/wanlshop/order/getOrderList',
				data: {
					state: state,
					page: navItem.current_page
				},
				success: res => {
					navItem.current_page = res.current_page; //当前頁碼
					if (res.last_page === res.current_page) {
						navItem.loadingType = 'noMore';
					} else {
						navItem.loadingType = 'more';
						navItem.current_page++;
					}
					let orderList = res.data.filter(item => {
						//添加不同状态下訂單的表現形式
						item = Object.assign(item, this.orderStateExp(item.state));
						//演示數據所以自己进行状态篩選
						if (state === 0) {
							//0為全部訂單
							return item;
						}
						return item.state === state;
					});
					orderList.forEach(item => {
						navItem.orderList.push(item);
					});
					//loaded新字段用於表示數據加載完毕，如果為空可以顯示空白頁
					this.$set(navItem, 'loaded', true);
				}
			});
		},

		//swiper 切换
		changeTab(e) {
			this.tabCurrentIndex = e.target.current;
			this.loadData('tabChange');
		},
		//顶部tab点击
		tabClick(index) {
			this.tabCurrentIndex = index;
		},
		//刪除訂單
		deleteOrder(order_id, key) {
			uni.showLoading({
				title: 'お待ちください'
			});
			this.$api.post({
				url: '/wanlshop/order/delOrder',
				data: {
					id: order_id
				},
				success: res => {
					this.navList[this.tabCurrentIndex].orderList.splice(key, 1);
					uni.hideLoading();
				}
			});
		},
		//注文をキャンセルする- 設置為7 -全局
		cancelOrder(item) {
			uni.showLoading({
				title: 'お待ちください'
			});
			// 獲取列表
			this.$api.post({
				url: '/wanlshop/order/cancelOrder',
				data: {
					id: item.id
				},
				success: res => {
					let { stateTip, stateTipColor } = this.orderStateExp(7);
					item = Object.assign(item, {
						state: 7,
						stateTip,
						stateTipColor
					});
					this.$store.commit('statistics/order', {
						pay: this.$store.state.statistics.order.pay - 1
					});
					// 注文をキャンセルする後刪除待付款中该项，並修改全部中的状态 1.0.2升级
					let list = this.navList[1].orderList;
					let index = list.findIndex(val => val.id === item.id);
					index !== -1 && list.splice(index, 1);
					// 刪除後修改全部中的為7
					if (this.tabCurrentIndex == 1) {
						let list = this.navList[0].orderList;
						let index = list.findIndex(val => val.id === item.id);
						if (index !== -1) {
							list[index].state = 7;
						}
					}
					uni.hideLoading();
				}
			});
		},
		commentOrder(id){
			this.$wanlshop.to('/pages/user/order/comment?order_id=' + id);
		},
		//支付訂單
		paymentOrder(id){
			this.$wanlshop.to('/pages/user/money/pay?order_id=' + id);
		},
		/**
		 * 点击取消按钮触发
		 * @param {Object} done
		 */
		popupclose(done){
			// TODO 做一些其他的事情，before-close 为true的情况下，手动执行 done 才会關閉对话框
			// ...
			this.$refs.popup.close();
			//done()
		},
		/**
		 * 点击確認按钮触发
		 * @param {Object} done
		 * @param {Object} value
		 */
		confirm(done,value){
			// 输入框的值
			console.log(value)
			// TODO 做一些其他的事情，手动执行 done 才会關閉对话框
			// ...
			//done()
			this.$api.post({
				url: '/wanlshop/pay/getpaypass',
				data: {
					captcha: value,
				},
				success: res => {
					this.$refs.popup.close();
					this.confirmOrder(this.corder);
				}
			});
			
		},
		cpaypass(item){
			this.corder = item
			this.$refs.popup.open()
			return false;
		},
		//領収書の確認- 全局
		confirmOrder(item){
			uni.showLoading({
				title: 'お待ちください'
			});
			// 獲取列表
			this.$api.post({
				url: '/wanlshop/order/confirmOrder',
				data: {
					id: item.id
				},
				success: res => {
					let { stateTip, stateTipColor } = this.orderStateExp(4);
					item = Object.assign(item, {
						state: 4,
						stateTip,
						stateTipColor
					});
					this.$store.commit('statistics/order', {
						receiving: this.$store.state.statistics.order.receiving - 1,
						evaluate: this.$store.state.statistics.order.evaluate + 1
					});
					uni.hideLoading();
				}
			});
		},
		//訂單状态文字和颜色
		orderStateExp(state) {
			let stateTip = '',
				stateTipColor = '#ff5000';
			switch (+state) {
				case 1:
					stateTip = '支払いを待つ';
					break;
				case 2:
					stateTip = '売り手が出荷するのを待っています';
					break;
				case 3:
					stateTip = '売り手によって出荷された';
					break;
				case 4:
					stateTip = '成功したトランザクション';
					break;
				case 5:
					stateTip = '成功したトランザクション';
					break;
				case 6:
					stateTip = '完了';
					break;
				case 7:
					stateTip = '注文は締め切られました';
					stateTipColor = '#909399';
					break;
				//更多自定义
			}
			return {
				stateTip,
				stateTipColor
			};
		},
		getRefund(status) {
			return ["返金する","返金する中に","返品するのを待つ","返金する完成","返金して閉める","返金して拒まれる"][status];
		},
		// 修改地址
		editAddress(id) {
			this.$wanlshop.to('/pages/user/address/address?source=2&order_id=' + id);
		},
		//添加或修改成功之後回调
		async refreshList(address_id, order_id) {
			uni.showLoading({
				title: '新しいアドレスを送信する'
			});
			// 獲取列表
			this.$api.post({
				url: '/wanlshop/order/editOrderAddress',
				data: {
					id: order_id,
					address_id: address_id
				},
				success: res => {
					this.$wanlshop.msg('アドレスが正常に変更されました');
					uni.hideLoading();
				}
			});
		}
	}
};
</script>

<style>
page {
	height: 100%;
}
</style>
