<template>
	<view>
		<view class="wanl-product">
			<!-- 普通布局 -->
			<view class="product_list" :class="dataStyle">
				<view class="item" v-for="(item, index) in dataList" :key="index" @tap="onShop1(item.id,1)">
					<view class="img-wrap"><image :src="$wanlshop.oss(item.avatar, 125, 125)"></image></view>
					<view class="content padding-sm">
						<!--<view class="">
							<view class="text-cut-2">
								<text>{{ item.shopname }}</text>
							</view>
						</view>-->
						<view class="flex align-center justify-between">
							<view class="text-red text-bold text-lg">
								<text class="">{{ item.shopname }}</text>
							</view>
							<view class="text-sm wanl-gray">
								<text class="margin-right"><p>{{item.goodsnum}}件商品</p><p>{{item.like}} 收藏喜欢</p></text>
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
	name: 'wanlProduct1',
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
