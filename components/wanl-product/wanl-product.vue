<template>
	<view>
		<view class="wanl-product">
			<view
				class="product_warter"
				:class="dataStyle"
				v-if="dataStyle == 'col-2-10' || dataStyle == 'col-2-15' || dataStyle == 'col-2-20' || dataStyle == 'col-2-25' || dataStyle == 'col-2-30'"
			>
				<wanl-waterfall :flowList="dataList">
					<template v-slot:left="{ leftList }">
						<view class="warter left" v-for="(item, index) in leftList" :key="index" @tap="onGoods(item.id,item.wholesale_id)">
							<view class="img-wrap"><image class="image" :src="item.image" mode="widthFix"></image></view>
							<view class="content padding-bj">
								<view class="text-cut-2">
									<block v-if="item.shop.isself == 1">
										<view class="cu-tag radius margin-right-xs sm bg-red">自营</view>
									</block>
									<!--<block v-else>
										<view class="cu-tag radius sm margin-right-xs bg-gray" v-if="item.shop.state == 0">個人</view>
										<view class="cu-tag radius sm margin-right-xs wanl-bg-blue" v-else-if="item.shop.state == 1">企业</view>
										<view class="cu-tag radius sm margin-right-xs wanl-bg-orange" v-else-if="item.shop.state == 2">旗舰</view>
									</block>-->
									<text>{{ item.title }}</text>
								</view>
								<view class="goods-tag">
									<view class="cu-tag radius sm line-red"  v-if="item.shop.isself == 1">官方放心購</view>
									<view class="cu-tag radius sm line-gray" v-if="item.isLive" @tap="onLive(item.isLive)">LIVE</view>
								</view>
								<view class="flex align-center justify-between">
									<view class="text-red text-bold text-lg">
										<text class="text-price">{{ item.price }}</text>
									</view>
									<view class="text-sm wanl-gray">
										<text>{{item.sales > 9999 ? '9999+':item.sales}} 販売</text>
									</view>
								</view>
							</view>
						</view>
					</template>
					<template v-slot:right="{ rightList }">
						<view class="warter right" v-for="(item, index) in rightList" :key="index" @tap="onGoods(item.id,item.wholesale_id)">
							<view class="img-wrap"><image class="image" :src="item.image" mode="widthFix"></image></view>
							<view class="content padding-bj">
								<view class="text-cut-2">
									<block v-if="item.shop.isself == 1">
										<view class="cu-tag radius margin-right-xs sm bg-red">自营</view>
									</block>
									<!--<block v-else>
										<view class="cu-tag radius sm margin-right-xs bg-gray" v-if="item.shop.state == 0">個人</view>
										<view class="cu-tag radius sm margin-right-xs wanl-bg-blue" v-else-if="item.shop.state == 1">企业</view>
										<view class="cu-tag radius sm margin-right-xs wanl-bg-orange" v-else-if="item.shop.state == 2">旗舰</view>
									</block>-->
									<text>{{ item.title }}</text>
								</view>
								<view class="goods-tag">
									<view class="cu-tag radius sm line-red"  v-if="item.shop.isself == 1">官方放心購</view>
									<view class="cu-tag radius sm line-gray" v-if="item.isLive" @tap="onLive(item.isLive)">LIVE</view>
								</view>
								<view class="flex align-center justify-between">
									<view class="text-red text-bold text-lg">
										<text class="text-price">{{ item.price }}</text>
									</view>
									<view class="text-sm wanl-gray">
										<text>{{item.sales > 9999 ? '9999+':item.sales}} 販売</text>
									</view>
								</view>
							</view>
						</view>
					</template>
				</wanl-waterfall>
			</view>
			<!-- 普通布局 -->
			<view class="product_list" :class="dataStyle" v-else>
				<view class="item" v-for="(item, index) in dataList" :key="index" @tap="onGoods(item.id,item.wholesale_id)">
					<view class="img-wrap"><image :src="$wanlshop.oss(item.image, 125, 125)"></image></view>
					<view class="content padding-sm">
						<view class="">
							<view class="text-cut-2">
								<block v-if="item.shop.isself == 1">
									<view class="cu-tag radius margin-right-xs sm bg-red">自营</view>
								</block>
								<!--<block v-else>
									<view class="cu-tag radius sm margin-right-xs bg-gray" v-if="item.shop.state == 0">個人</view>
									<view class="cu-tag radius sm margin-right-xs wanl-bg-blue" v-else-if="item.shop.state == 1">企业</view>
									<view class="cu-tag radius sm margin-right-xs wanl-bg-orange" v-else-if="item.shop.state == 2">旗舰</view>
								</block>-->
								<text>{{ item.title }}</text>
							</view>
							<view class="goods-tag">
								<view class="cu-tag radius sm line-red"  v-if="item.shop.isself == 1">官方放心購</view>
								<view class="cu-tag radius sm line-gray" v-if="item.isLive" @tap="onLive(item.isLive)">LIVE</view>
							</view>
						</view>
						<view class="flex align-center justify-between">
							<view class="text-red text-bold text-lg">
								<text class="text-price">{{ item.price }}</text>
							</view>
							<view class="text-sm wanl-gray">
								<text class="margin-right">{{item.sales > 9999 ? '9999+':item.sales}} 販売</text>
								<text>{{ item.comment > 0 ? parseInt((item.praise / item.comment) * 100) : 0 }}% 賞賛</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
/**
 * wanlProduct 商品
 * @description 商品組件 SHOP https://www.shop.com（除万联官方内嵌系統，未经授權严禁使用）
 * @著作權：WanlShop 登記號：2020SR0255711 版本：V1.0.0
 * @property {Array} dataList 列表數據
 * @property {String} dataStyle 列表样式
 * @example <wanl-product />
 */
export default {
	name: 'wanlProduct',
	props: {
		dataList: {
			type: Array,
			required: true,
			default: function() {
				return [];
			}
		},
		dataStyle: {
			type: String,
			default: 'col-2-20'
		}
	}
};
</script>
<style>

</style>
