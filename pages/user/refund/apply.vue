<template>
	<view>
		<view class="edgeInsetTop"></view>
		<view class="bg-white padding-bj flex">
			<view class="cu-avatar xl margin-right-bj" :style="{backgroundImage: 'url('+$wanlshop.oss(goods.image, 70, 70)+')'}"> </view>
			<view class="text-sm" style="width: calc(100% - 128rpx);">
				<view class="margin-bottom-xs">
					<view class="text-cut-2">
						{{goods.title}}
					</view>
				</view>
				<view class="wanl-gray">
					仕様：{{goods.difference}}
				</view>
			</view>
		</view>
		
		<view class="margin-top-bj">
			<view class="cu-form-group">
				<view class="title">ロジスティクスステータス</view>
				<picker @change="expressChange" :value="refund.expressType" :range="expressList">
					<view class="picker">
						<text v-if="refund.expressType > -1">{{expressList[refund.expressType]}}</text>
						<text class="wanl-gray-light" v-else>商品を受け取るかどうか</text>
					</view>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="title">払い戻しの種類</view>
				<picker @change="typeChange" :value="refund.type" :range="typeList">
					<view class="picker">
						<text v-if="refund.type > -1">{{typeList[refund.type]}}</text>
						<text class="wanl-gray-light" v-else>払い戻しの種類を選択してください</text>
					</view>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="title">返却理由</view>
				<picker @change="reasonChange" :value="refund.reason" :range="reasonList">
					<view class="picker">
						<text v-if="refund.reason > -1">{{reasonList[refund.reason]}}</text>
						<text class="wanl-gray-light" v-else>返金の理由</text>
					</view>
				</picker>
			</view>
			<view class="cu-form-group margin-top-bj">
				<view class="title">返金金額<text class="text-price margin-left-xs"></text></view>
				<input type="digit" :placeholder="amount.placeholder" v-model="refund.money" @input="moneyInput" :disabled="amount.total == 0"></input>
			</view>
			<view class="bg-white margin-top-bj">
				<view class="cu-form-group">
					<view class="title">証明書をアップロードする</view>
				</view>
				<view class="grid col-4 grid-square flex-sub padding-lr">
					<view class="bg-img" v-for="(item, index) in refund.images" :key="index" @tap="viewImage(index)">
						<image :src="$wanlshop.oss(item, 90, 90)" mode="aspectFill"></image>
						<view class="cu-tag bg-red" @tap.stop="delImg(index)"><text class="wlIcon-31guanbi"></text></view>
					</view>
					<view class="dashed" @tap="chooseImage" v-if="refund.images.length < 4">
						<text class="wlIcon-31paishe"></text>
					</view>
				</view>
			</view>
			<view class="cu-form-group margin-top-bj">
				<view class="title">返金の理由</view>
				<input placeholder="オプション" v-model="refund.refund_content"></input>
			</view>
		</view>
		<view class="edgeInsetBottom"> </view>
		<view class="wanlian cu-bar tabbar foot flex flex-direction">
			<button class="cu-btn wanl-bg-orange lg" @tap="addData">確認</button>
		</view>
	</view>
</template>


<script>
export default {
	data() {
		return {
			// 运费策略
			freight_type: 0,
			goods: {},
			expressList: ['貨を受け取っていない','すでに貨を受け取った'],
			typeList: ['私が返金する(返品する必要はない)','返品して返金する'],
			reasonList: ['好きでない','いたずらにくるむ','ずっと配達していない','ですか？色/サイズはに一致しないで','品質の問題','少しの件が発を抜かす','ブランドを詐称する'],
			// 退款
			refund:{
				order_id: 0,
				expressType: -1,
				type: -1,
				reason: -1,
				goods: 0,
				money: 0,
				images: [],
				refund_content: ''
			},
			// 価格
			amount:{
				total: 0,
				placeholder: '',
				info: ''
			}
		};
	},
	onLoad(option) {
		let data = JSON.parse(option.data);
		this.goods = data.goods;
		this.refund.order_id = data.order_id;
		this.refund.goods = data.goods.id;
		this.freight_type = data.freight_type;
		this.goods_number = data.goods_number;
		//計算运费價格,当只有一個商品或 运费策略累加运费可全退
		if(this.goods_number == 1 || this.freight_type == 2){
			let price = this.$wanlshop.bcadd(this.$wanlshop.bcsub(this.$wanlshop.bcmul(data.goods.price, data.goods.number), data.discount_price), data.goods.freight_price);
			let info = `最も円 ${price}`;
			if(parseInt(data.discount_price) > 0){
				info += `，そのうち円 ${this.$wanlshop.bcmul(data.goods.price, data.goods.number)}，優惠円 ${data.discount_price}`;
			}
			if(parseInt(data.goods.freight_price) > 0){
				info += `，運送円 ${data.goods.freight_price}`;
			}
			this.amount.info = info;
			this.amount.placeholder = `払い戻しは超過できません${price} 円`;
			this.refund.money = price;
			
			this.amount.total = price;
		}else{
			let price = this.$wanlshop.bcsub(this.$wanlshop.bcmul(data.goods.price, data.goods.number), data.discount_price);
			let info = `最も円 ${price}`;
			if(parseInt(data.discount_price) > 0){
				info += `，そのうち円 ${this.$wanlshop.bcmul(data.goods.price, data.goods.number)}，優惠円 ${data.discount_price}`;
			}
			if(parseInt(data.goods.freight_price) > 0){
				info += `，戦略には含まれていません運送円 ${data.goods.freight_price}`;
			}
			this.amount.info = info;
			this.amount.placeholder = `払い戻しは超過できません ${price} 円`;
			this.refund.money = price;
			
			this.amount.total = price;
		}
	},
	methods: {
		async addData(){
			if (this.refund.money < 0) {
				this.$wanlshop.msg('返金額は以下にすることはできません 0円');
				return false;
			}
			if (this.refund.money > this.amount.total) {
				this.$wanlshop.msg(this.amount.info);
				return false;
			}
			// 提交
			this.$api.post({
				url: '/wanlshop/refund/addApply',
				data: this.refund,
				success: res => {
					this.$store.commit('statistics/order', {
						customer: this.$store.state.statistics.order.customer + 1
					});
					// 跳转到退款詳情頁
					this.$wanlshop.to(`/pages/user/refund/details?id=${res}`);
				}
			});
		},
		chooseImage(index) {
			uni.chooseImage({
				count: 4, //默認9
				sizeType: ['original', 'compressed'], //可以指定是原圖还是压缩圖，默認二者都有
				sourceType: ['album'], //从相冊选择
				success: res => {
					this.$api.get({
						url: '/wanlshop/common/uploadData',
						success: updata => {
							for (let i = 0; i < res.tempFilePaths.length; i++) {
								// 讀取圖片宽高
								uni.getImageInfo({
									src: res.tempFilePaths[i],
									success: image => {
										this.$api.upload({
											url: updata.uploadurl,
											filePath: image.path,
											name: 'file',
											formData: updata.storage == 'local' ? null : updata.multipart,
											success: data => {
												this.refund.images.push(data.fullurl);
											}
										});
									}
								});
							}
						}
					});
				}
			});
		},
		expressChange(e) {
			this.refund.expressType = e.detail.value
		},
		typeChange(e) {
			this.refund.type = e.detail.value
		},
		reasonChange(e) {
			this.refund.reason = e.detail.value
		},
		// 退款金额
		moneyInput(e) {
			let money = e.detail.value;
			if (money > this.amount.total) {
				this.$wanlshop.msg(this.amount.info);
			}
			// 判断是否超過訂單总额,超過提示
			this.refund.money = e.detail.value
		},
		viewImage(key) {
			uni.previewImage({
				urls: this.refund.images,
				current: this.refund.images[key]
			});
		},
		delImg(key) {
			this.refund.images.splice(key, 1);
		}
	}
};
</script>

<style>
	.dashed::after {
	    border: 1px dashed #666;
	}
	.cu-btn.lg{
		width: calc(100% - 50rpx);
	}
</style>
