<template>
	<view>
		<view class="edgeInsetTop"></view>
		<view class="wanl-order"> 
			<!-- 頭部 -->
			<view class="header">
				<image :src="$wanlshop.appstc('/order/img_detail_bg.png')" class="img-bg"></image>
				<view class="content">
					<view>
						<view class="status-text">{{getStatusText(orderData.state)}}</view>
						<view class="reason"><text class="reason-text">{{orderData.statetime}}</text></view>
					</view>
					<image :src="$wanlshop.appstc('/order/'+getImg(orderData.state))" class="status-img" mode="widthFix"></image>
				</view>
			</view>
			<!-- 詳情 -->
			<view class="address cu-list menu-avatar">
				<!-- 物流状态 -->
				<view class="cu-item" @tap="onLogistics(orderData.id)" v-if="orderData.state != 7 && orderData.state != 1 && orderData.state != 2 && logisticsType">
					<view class="cu-avatar round wanl-bg-blue"><text class="wlIcon-yunshuzhong"></text></view>
					<view class="content">
						<view>
							<text class="text-cut-2 text-sm wanl-pip">{{orderData.logistics.status}} - {{orderData.logistics.context}}</text>
						</view>
						<view class="wanl-gray">
							<text class="text-sm">{{orderData.logistics.time}}</text>
						</view>
					</view>
					<view class="action">
						<text class="wlIcon-fanhui2 wanl-gray"></text>
					</view>
				</view>
				<!-- 地址 -->
				<view class="cu-item">
					<view class="cu-avatar round wanl-bg-orange"><text class="wlIcon-weizhi1"></text></view>
					<view class="content">
						<view>
							<text class="wanl-pip margin-right-sm">{{orderData.address.name}}</text>
							<text class="wanl-gray text-sm">{{orderData.address.mobile}}</text>
						</view>
						<view class="wanl-pip text-cut-2 text-sm">
							{{orderData.address.address.replace(/\//g,' ')}}
							<text class="margin-left-xs" v-if="orderData.address.address_name">（{{orderData.address.address_name}}）近所の</text>
						</view>
					</view>
				</view>
			</view>
			<view class="lists bg-white"  v-if="orderData.order_no">
				<view class="shopname text-sm padding-top-bj" @tap="onShop(orderData.shop_id)">
					<text class="wlIcon-dianpu1 margin-right-sm"></text>
					<text class="padding-right-xs wanl-black">{{orderData.shop.shopname}}</text>
					<text class="wlIcon-fanhuigengduo"></text>
				</view>
				<view class="cu-list menu-avatar">
					<block v-for="(item, index) in orderData.goods" :key="item.id">
						<view class="cu-item">
							<view class="cu-avatar radius" :style="{ backgroundImage: 'url(' + $wanlshop.oss(item.image, 77, 77) + ')' }" @tap="onGoods(item.goods_id)"></view>
							<view class="content" @tap="onGoods(item.goods_id)">
								<view class="text-cut-2">{{item.title}}</view>
								<view class="wanl_sku text-min">
									<text class="wanl-gray-dark">{{item.difference}}</text>
								</view>
							</view>
							<view class="action">
								<view class="text-orange text-price">{{item.price}}</view>
								<view class="wanl-gray text-min">x {{item.number}}</view>
							</view>
						</view>
						<view class="flex justify-end padding-lr-bj padding-bottom-sm">
							<!-- 1.0.2升级 取消訂單後去掉退款按钮 -->
							<button class="cu-btn line-black sm" @tap="onRefund(orderData.id, item.refund_status, item.refund_id, index)" v-if="orderData.state == 2 || orderData.state == 3 || orderData.state == 4 || orderData.state == 6 "> {{getRefund(item.refund_status)}}</button>
						</view>
					</block>
				</view>
				<!-- 價格信息 -->
				<view class="price padding-lr-bj padding-bottom-bj text-min">
					<view> <text> 商品の合計価格 </text> <text class="text-price"> {{orderData.pay.order_price}} </text> </view>
					<view> <text> 運送 </text> <text class="text-price"> {{orderData.pay.freight_price}} </text> </view>
					<view> <text> ディスカウント </text> <text class="text-price"> {{orderData.pay.discount_price}} </text> </view>
					<view> <text> 合計金額 </text> <text class="text-price"> {{orderData.pay.price}} </text> </view>
					<view class="text-sm" v-if="orderData.pay.actual_payment != 0"> <text> 実際の支払い </text> <text class="text-price wanl-orange"> {{orderData.pay.actual_payment}} </text> </view>
				</view>
			</view>
			<view class="order bg-white margin-top-bj padding-bj" v-if="orderData.order_no">
				<view class="title" @tap="toMore">
					<view class="text-sm">注文詳細</view>
					<view>
						<text class="wlIcon-fanhui3" v-if="infoMore"></text>
						<text class="wlIcon-fanhui4" v-else></text>
					</view>
				</view>
				<view class="text-sm">
					<view class="item">
						<text class="wanl-gray" style="width: 160rpx">注文番号：</text>
						<text> {{orderData.order_no}} </text>
					</view>
					<view class="item">
						<text class="wanl-gray" style="width: 160rpx">支払い取引番号：</text>
						<text> {{orderData.pay.pay_no}} </text>
					</view>
					<view class="item">
						<text class="wanl-gray" style="width: 160rpx">作成時間：</text>
						<text> {{orderData.createtime_text}} </text>
					</view>
					<block v-if="infoMore">
						<view class="item" v-if="orderData.paymenttime">
							<text class="wanl-gray-dark" style="width: 160rpx">支払い時間：</text>
							<text> {{orderData.paymenttime_text}} </text>
						</view>
						<view class="item" v-if="orderData.delivertime">
							<text class="wanl-gray-dark" style="width: 160rpx">納期：</text>
							<text> {{orderData.delivertime_text}} </text>
						</view>
						<view class="item" v-if="orderData.taketime">
							<text class="wanl-gray-dark" style="width: 160rpx">受領時間：</text>
							<text> {{orderData.taketime_text}} </text>
						</view>
					</block>
				</view>
				<view class="foot solid-top" >
					<view @tap="toChat(orderData.shop_id)">
						<text class="wlIcon-xiaoxizhongxin text-min"></text>出品者に連絡する
					</view>
				</view>
			</view>
			<view class="edgeInsetBottom"> </view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			orderData: {
				order_no: '',
				address: {
					name: 'ロードの中...',
					mobile: '',
					address: '',
					address_name: ''
				},
				logistics: {
					context: '',
					status: '',
					time: ''
				},
				statetime: ''
			},
			logisticsType: false,
			infoMore: false
		};
	},
	onLoad(option) {
		this.loadData({id:option.id});
	},
	methods: {
		// 獲取訂單
		async loadData(data) {
			this.$api.get({
				url: '/wanlshop/order/getOrderInfo',
				data: data,
				success: res => {
					this.orderData = res;
					this.logisticsType = true;
					if(res.state == 0){
						this.orderData.statetime = '残り時間0';
					}else if(res.state == 1){
						var diff = (res.createtime + res.config.cancel * 86400) - Date.parse(new Date()) / 1000;
						var days = Math.floor(diff / 86400);
						var hours = Math.floor(diff % 86400 / 3600); 
						var minutes = Math.floor(diff % 86400 % 3600 / 60);
						if (minutes > 0) {
							this.orderData.statetime = '残り' +minutes+ '注文を自動的に閉じる';
						}
						if (hours > 0) {
							this.orderData.statetime = '残り' +hours+ '日' +minutes+ '注文を自動的に閉じる';
						}
						if (days > 0) {
							this.orderData.statetime = '残り' +days+ '日' +hours+ '時間' +minutes+ '注文を自動的に閉じる';
						}
					}else if(res.state == 2){
						this.orderData.statetime = '売り手が出荷するのを待っています';
					}else if(res.state == 3){
						var diff = (res.delivertime + res.config.receiving * 86400) - Date.parse(new Date()) / 1000;
						var days = Math.floor(diff / 86400);
						var hours = Math.floor(diff % 86400 / 3600); 
						var minutes = Math.floor(diff % 86400 % 3600 / 60);
						if (minutes > 0) {
							this.orderData.statetime = '残り' +minutes+ '領収書を自動的に確認する';
						}
						if (hours > 0) {
							this.orderData.statetime = '残り' +hours+ '日' +minutes+ '領収書を自動的に確認する';
						}
						if (days > 0) {
							this.orderData.statetime = '残り' +days+ '日' +hours+ '時間' +minutes+ '領収書を自動的に確認する';
						}
					}else if(res.state == 4){
						var diff = (res.taketime + res.config.comment * 86400) - Date.parse(new Date()) / 1000;
						var days = Math.floor(diff / 86400);
						var hours = Math.floor(diff % 86400 / 3600); 
						var minutes = Math.floor(diff % 86400 % 3600 / 60);
						if (minutes > 0) {
							this.orderData.statetime = '残り' +minutes+ '自動コメント';
						}
						if (hours > 0) {
							this.orderData.statetime = '残り' +hours+ '日' +minutes+ '自動コメント';
						}
						if (days > 0) {
							this.orderData.statetime = '残り' +days+ '日' +hours+ '時間' +minutes+ '自動コメント';
						}
					}else if(res.state == 6){	
						this.orderData.statetime = res.dealtime_text;
					}else if(res.state == 7){	
						this.orderData.statetime = '注文がキャンセルされました';
					}
				}
			});
		},
		getImg(status) {
			return ["img_order_payment3x.png", "img_order_send3x.png", "img_order_received3x.png", "img_order_signed3x.png", "img_order_closed3x.png", "img_order_signed3x.png", "img_order_closed3x.png"][status - 1];
		},
		getStatusText(status) {
			return ["あなたがお金を支払いを待つ","お金を支払うことに成功する","入庫予定の貨","評の論を待つ","返金する訂の單","訂の單はすでに完成だ","取引の關の閉"][status - 1];
		},
		getRefund(status) {
			return ["返金する","返金する中に","返品するのを待つ","返金する完成","返金して閉める","返金して拒まれる"][status];
		},
		/**
		 * 进入退款
		 * @param {Object} order_id 訂單ID 
		 * @param {Object} status 售後状态:0=未退款,1=退款中,2=待退貨,3=退款完成
		 */
		onRefund(order_id, refund_status, refund_id, index){
			if (refund_status == 0) { //申請退款
				this.$wanlshop.to(`/pages/user/refund/apply?data=${JSON.stringify({
						order_id: this.orderData.id,
						goods: this.orderData.goods[index],
						freight_type: this.orderData.freight_type,
						discount_price: this.orderData.pay.discount_price,
						goods_number: this.orderData.goods.length
					})}`);
			}else{ // 查看詳情
				this.$wanlshop.to(`/pages/user/refund/details?id=${refund_id}`);
			}
		},
		// 折叠项
		toMore(){
			this.infoMore = !this.infoMore;
		}
	}
};
</script>

<style>
	.wanl-order .header {
		width: 100%;
		height: 180rpx;
		position: relative;
		background-color: #f72b36;
	}
	
	.wanl-order .header .img-bg {
		width: 100%;
		height: 180rpx;
	}
	
	.wanl-order .header .content {
		width: 100%;
		height: 180rpx;
		position: absolute;
		z-index: 10;
		left: 0;
		top: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 60rpx;
		box-sizing: border-box;
	}
	
	.wanl-order .header .status-text {
		font-size: 34rpx;
		line-height: 34rpx;
		color: #FEFEFE;
	}
	
	.wanl-order .header .reason {
		font-size: 24rpx;
		line-height: 24rpx;
		color: rgba(254, 254, 254, 0.75);
		padding-top: 15rpx;
		display: flex;
		align-items: center;
	}
	
	.wanl-order .header .reason-text {
		padding-right: 12rpx;
	}
	
	.wanl-order .header .status-img {
		width: 100rpx;
		height: 100rpx;
		display: block;
	}
	
	
	
	
	.wanl-order .lists .shopname {
	    margin: 25rpx 25rpx 30rpx 25rpx;
	}
	.wanl-order .lists .price>view{
		display: flex;
		align-items: center;
		justify-content:space-between;
		height: 40rpx;
	}
	
	.wanl-order .lists .cu-btn{
		font-size: 22rpx;
		padding: 0 14rpx;
	}
	
	
	
	
	.cu-list.menu-avatar>.cu-item{
		height: 160rpx;
	}
	.cu-list.menu-avatar>.cu-item .content{
		line-height: 1.4;
	}
	
	.wanl-order .order .title{
		display: flex;
		align-items: center;
		justify-items: center;
		justify-content: space-between;
	}
	.wanl-order .order .item{
		display: flex;
		padding-top: 30rpx;
	}
	.wanl-order .order .foot{
		display: flex;
		justify-content: space-around;
		justify-items: center;
		align-items: center;
		padding-top: 25rpx;
		margin-top: 20rpx;
	}
	.wanl-order .order .foot text[class*="wlIcon-"]{
		color: #0081FF;
		margin-right: 10rpx;
		font-size: 32rpx;
	}
	
	
</style>
