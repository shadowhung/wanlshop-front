<template>
	<view>
		<view class="edgeInsetTop"></view>
		<view class="wanl-order"> 
			<view class="address cu-list menu-avatar margin-bj radius-bock">
				<view class="cu-item">
					<view class="cu-avatar round wanl-bg-orange"><text class="wlIcon-weizhi1"></text></view>
					<view class="content" v-if="addressData.address" @tap="userAddress()">
						<view>
							<text class="wanl-pip margin-right-sm">{{ addressData.name }}</text>
							<text class="wanl-gray-light text-sm">{{ addressData.mobile }}</text>
						</view>
						<view class="text-sm wanl-pip text-cut">{{ addressData.province}} {{ addressData.city }} {{ addressData.district }} {{ addressData.address }}</view>
					</view>
					<view class="content" @tap="addAddress('newadd')" v-else><view class="text-sm wanl-pip text-cut">配送先住所を入力するには、ここをクリックしてください</view></view>
					<view class="action"><text class="wlIcon-fanhui2 text-lg"></text></view>
				</view>
			</view>
			<view v-for="(shop, index) in orderData.lists" :key="index" class="lists bg-white margin-bj radius-bock">
				<view class="shopname">
					<text class="wlIcon-dianpu2 text-orange margin-right-sm"></text>
					<text class="wanl-pip text-df">{{ shop.shop_name }}</text>
				</view>
				<view class="cu-list menu-avatar">
					<view class="cu-item margin-bottom" v-for="(goods, key) in shop.products" :key="key">
						<view class="cu-avatar radius-bock" :style="{ backgroundImage: 'url(' + $wanlshop.oss(goods.image, 77, 77) + ')' }"></view>
						<view class="content">
							<view class="text-sm text-cut-2">{{ goods.title }}</view>
							<view class="wanl_sku text-sm">
								<text v-for="(item, skey) in goods.sku.difference" :key="skey">
								<block v-if="skey != 0">-</block>{{ item }}
								</text>
							</view>
						</view>
						<view class="action">
							<view class="wanl-pip text-sm text-price">{{ goods.sku.price }}</view>
							<view class="wanl-gray-light text-sm">x{{ goods.number }}</view>
						</view>
					</view>
				</view>
				<form>
					<!-- <view class="cu-form-group" v-if="cartType">
						<view class="wanl-gray-light title">購入数量</view>
						<uni-number-box :min="1" :max="orderData.lists[0].products[0].sku.stock" :value="shop.number" @change="changeNum"></uni-number-box>
					</view> -->
					<view class="cu-form-group">
						<view class="wanl-gray-light title">エクスプレス貨物</view>
						<view class="picker">{{shop.freight.name}} <text class="text-price margin-left-xs">{{shop.freight.price}}</text></view>
					</view>
					<view class="cu-form-group" @tap="queryCoupon(index)">
						<view class="wanl-gray-light title">ディスカウント</view>
						<view class="picker"> 
							<block v-if="couponData[index]">
								<text class="wlIcon-youhuiquantuangou text-red margin-right-xs"></text>
								<block v-if="couponData[index].type == 'reduction' || (couponData[index].type == 'vip' && couponData[index].usertype == 'reduction')">
									<text>フル{{Number(couponData[index].limit)}}もっと少なく</text> 円{{Number(couponData[index].price)}}
								</block>
								<block v-if="couponData[index].type == 'discount' || (couponData[index].type == 'vip' && couponData[index].usertype == 'discount')">
									<text>フル{{Number(couponData[index].limit)}}ヒット</text> {{Number(couponData[index].discount)}} 折りたたむ
								</block>
								<block v-if="couponData[index].type == 'shipping'">
									<text>フル{{Number(couponData[index].limit)}}</text>送料無料
								</block>
							</block>
							<block v-else>
								<text class="text-gray">選択</text>
							</block>
							<text class="wlIcon-fanhui2 margin-left"></text>
						</view>
					</view>
					<view class="cu-form-group align-start">
						<view class="wanl-gray-light title">備考</view>
						<textarea maxlength="-1" v-model="shop.remarks" placeholder="オプションの注文備考"></textarea>
					</view>
				</form>
				<view class="text-right margin-bj text-sm">
					<text class="wanl-gray">合計{{ shop.number }}点，</text>
					小計：
					<text class="text-price text-orange">{{ shop.sub_price }}</text>
				</view>
			</view>
			<view class="safeAreaBottom"> </view>
			<!-- 弹出层 -->
			<view class="WANL-MODAL text-sm" @touchmove.stop.prevent="moveHandle">
				<!-- 優惠券 -->
				<view class="cu-modal bottom-modal" :class="modalName == 'coupon' ? 'show' : ''" @tap="hideModal">
					<view class="cu-dialog bg-bgcolor" @tap.stop="">
						<view class="wanl-modal">
							<view class="head padding-bj">
								<view class="content"><view class="text-lg">クーポン</view></view>
								<view class="close wlIcon-31guanbi" @tap="hideModal"></view>
							</view>
							<scroll-view class="wanl-coupon scroll-y" scroll-y="true" v-if="couponIndex != null">
								<view v-for="(coupon, index) in orderData.lists[couponIndex].coupon" :key="index" :class="coupon.type" class="item margin-bottom-bj radius-bock">
									<image :src="$wanlshop.appstc('/coupon/bg_coupon_3x.png')" class="coupon-bg"></image>
									<image :src="$wanlshop.appstc('/coupon/img_couponcentre_received_3x.png')" class="coupon-sign" v-if="coupon.state"></image>
									<view class="item-left">
										<block v-if="coupon.type == 'reduction' || (coupon.type == 'vip' && coupon.usertype == 'reduction')">
											<view class="colour">
												<text class="text-price"></text>
												<text class="prices">{{Number(coupon.price)}}</text>
											</view>
											<view class="cu-tag wanl-gray-dark radius text-sm bg-white">
												フル{{Number(coupon.limit)}}もっと少なく{{Number(coupon.price)}}
											</view>
										</block>
										<block v-if="coupon.type == 'discount' || (coupon.type == 'vip' && coupon.usertype == 'discount')">
											<view class="colour">
												<text class="prices">{{Number(coupon.discount)}}</text>
												<text class="discount">折りたたむ</text>
											</view>
											<view class="cu-tag wanl-gray-dark radius text-sm bg-white">
												フル{{Number(coupon.limit)}}ヒット{{Number(coupon.discount)}}折りたたむ
											</view>
										</block>
										<block v-if="coupon.type == 'shipping'">
											<view class="colour">
												<text class="prices">送料無料</text>
											</view>
											<view class="cu-tag wanl-gray-dark radius text-sm bg-white">
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
												
												<view v-if="coupon.grant != '-1'">
													<text class="wlIcon-dot"></text>残っているだけ {{coupon.surplus}} 張
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
											<view class="cu-btn sm round line-colour" @tap="onCoupons(index)" v-if="coupon.state" >
												<text v-if="coupon.choice"> 選ばれた </text>
												<text v-else> すぐに使用 </text>
											</view>
											<view class="cu-btn sm round" @tap="onReceive(index)" v-else>
												今すぐ入手
											</view>
										</view>
									</view>
								</view>
							</scroll-view>
							<view class="foot padding-lr-bj"><button class="cu-btn bg-gradual-orange round text-bold complete" @tap="hideModal">実施する</button></view>
						</view>
					</view>
				</view>
			</view>
			<view class="wanlian cu-bar tabbar solid-top foot text-df">
				<view>
					<text class="wanl-gray">合計{{ orderData.statis.allnum }}点，</text>
					合計：
					<text class="text-price text-orange">{{ orderData.statis.allsub }}</text>
				</view>
				<button @tap="addOrder" class="cu-btn round lg bg-gradual-orange margin-lr-bj">注文を送信する</button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			addressData: {},
			modalName: null, // 弹出层
			cartType: null,
			couponData: {},
			couponIndex: null,
			orderData: {
				lists: [],
				statis: {
					allnum: 1,
					allsub: 0
				}
			}
		};
	},
	onLoad(option) {
		this.loadData(option.data);
		this.cartType = option.type;
	},
	methods: {
		async loadData(data) {
			this.$api.post({
				url: '/wanlshop/order/getOrderGoodsList',
				loadingTip: 'ロードの中',
				data: data,
				success: res => {
					this.orderData = res.orderData;
					if (res.addressData) {
						this.addressData = res.addressData;
					} else {
						this.addAddress('newadd');
					}
				}
			});
		},
		// 提交訂單
		async addOrder() {
			if(this.orderData.statis.allnum === 0){
				this.$wanlshop.msg('注文の例外')
				return;
			}
			let address_id = this.addressData.id;
			if(address_id === 0){
				this.$wanlshop.msg('住所をご記入ください')
				return;
			}
			let data = {lists: [], address_id: address_id},
				cart = [];
			this.orderData.lists.forEach((item, index)=> {
				data.lists.push({
					shop_id: item.shop_id,
					wholesale_id: item.wholesale_id,
					remarks: item.remarks,
					products: [],
					//店铺優惠券和其他 在下追加
					coupon_id: this.couponData[index] ? this.couponData[index].id : 0
				});
				item.products.forEach(goods => {
					// 購物車數據
					cart.push({
						goods_id: goods.id,
						sku_id: goods.sku.id
					});
					// 商品數據
					data.lists[index].products.push({
						goods_id: goods.id,
						number: goods.number,
						sku_id: goods.sku.id,
						freight_id: goods.freight_id
					});
				});
			});
			// 提交訂單數據data
			this.$api.post({
				url: '/wanlshop/order/addOrder',
				data: {order:data},
				loadingTip: '注文の送信...',
				success: res => {
					this.$store.commit('statistics/order', {
						pay: this.$store.state.statistics.order.pay + cart.length
					});
					// 如果使用優惠券全局减去
					let coupon =  Object.keys(this.couponData).length;
					if (coupon != 0) {
						this.$store.commit('statistics/dynamic', {
							coupon: this.$store.state.statistics.dynamic.coupon - coupon
						});
					}
					// 大厂软件，就是这么迷幻
					if (this.cartType == 'cart') {
						this.$store.dispatch('cart/del');
					}
					this.$wanlshop.to(`/pages/user/money/pay?data=${JSON.stringify(res)}`);
				}
			});
		},
		//添加或修改成功之後回调
		async refreshList(data, type) {
			this.$api.post({
				url: '/wanlshop/address/address',
				data: {
					data: data,
					type: 'add'
				},
				success: res => {
					this.addressData = res;
				}
			});
		},
		// 查询優惠券，减緩服務器压力，單獨查询（僅查询首次）
		async queryCoupon(index) {
			let data = this.orderData.lists[index];
			if(data.coupon.length == 0){
				let goods_id = [];
				let shop_category_id = [];
				for(var i = 0; i < data.products.length; i++) {
					goods_id.push(data.products[i]['id']);
					shop_category_id.push(data.products[i]['shop_category_id']);
				};
				this.$api.post({
					url: '/wanlshop/coupon/query',
					data: {
						shop_id: data.shop_id,
						goods_id: this.unique(goods_id),
						shop_category_id: this.unique(shop_category_id),
						price: data.order_price
					},
					success: res => {
						data.coupon = res;
					}
				});
			}
			this.couponIndex = index;
			this.modalName = 'coupon';
		},
		// クーポンを受け取る
		async onReceive(index) {
			let coupon = this.orderData.lists[this.couponIndex].coupon[index];
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
		// 选中優惠券, 將優惠券放进數組中
		onCoupons(index){
			let order = this.orderData.lists[this.couponIndex];
			let data = this.orderData.lists[this.couponIndex].coupon;
			data[index].choice = !data[index].choice;
			if(data[index].choice){
				// 遍曆取消掉其他选择的状态，for性能高於其他曆遍
				for(var i = 0; i < data.length; i++) {
					if(i != index){
						data[i].choice = false;
					}
				};
				// 更新选择
				this.couponData[this.couponIndex] = data[index];
				// @ 精度計算 this.$wanlshop.bcadd('0.132123',0.132123)
				// 滿减計算
				if (data[index].type == 'reduction' || (data[index].type == 'vip' && data[index].usertype == 'reduction')) {
					order.freight.price = order.freight_price_bak;
					order.sub_price = this.$wanlshop.bcsub(this.$wanlshop.bcadd(order.order_price, order.freight.price),data[index].price);
					if (order.sub_price < 0) {
						order.sub_price = 0.01;
					}
				}
				// 折扣計算  前端出问题
				if (data[index].type == 'discount' || (data[index].type == 'vip' && data[index].usertype == 'discount')) {
					let discount = data[index].discount > 10 ? this.$wanlshop.bcdiv(data[index].discount, 100) : this.$wanlshop.bcdiv(data[index].discount, 10);
					order.freight.price = order.freight_price_bak;
					order.sub_price = this.$wanlshop.bcadd(this.$wanlshop.bcmul(order.order_price, discount), order.freight.price);
				}
				// 包邮計算
				if (data[index].type == 'shipping') {
					order.freight.price = 0;
					order.sub_price = order.order_price;
				}
			}else{
				// 恢複原价 1.0.2升级
				this.couponData = {};
				if (data[index].type == 'shipping') {
					order.freight.price = order.freight_price_bak;
				}
				order.sub_price = this.$wanlshop.bcadd(order.order_price,order.freight.price);
			}
			// 精度計算合計
			this.orderData.statis.allsub = 0;
			for(var i = 0; i < this.orderData.lists.length; i++) {
				this.orderData.statis.allsub = this.$wanlshop.bcadd(this.orderData.statis.allsub, this.orderData.lists[i].sub_price);
			};
			this.modalName = null;
		},
		// 修改數量
		changeNum(num){
			num = num == 0 ? 1 : num;
			this.orderData.lists[0].number = num;
			this.orderData.lists[0].products[0].number = num;
			this.orderData.statis.allnum = num;
			// 計算價格
			this.orderData.lists[0].sub_price = this.$wanlshop.bcmul(this.orderData.lists[0].products[0].sku.price, num);
			this.orderData.statis.allsub = this.$wanlshop.bcmul(this.orderData.lists[0].products[0].sku.price, num);
		},
		addAddress(type) {
			this.$wanlshop.to(`/pages/user/address/addressManage?type=${type}`);
		},
		userAddress() {
			this.$wanlshop.to('/pages/user/address/address?source=1');
		},
		// 弹出层，暂时不需要但後续版本可能需要
		showModal(name) {
			this.modalName = name;
		},
		// 關閉弹出层
		hideModal() {
			this.modalName = null;
		},
		// 數組去重並字符串
		unique(arr) {
			return Array.from(new Set(arr)).join(',');
		},
		//禁止父元素滑動
		moveHandle() {}
	}
};
</script>

<style></style>
