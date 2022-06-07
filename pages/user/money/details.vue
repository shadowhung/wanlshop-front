<template>
	<view class="wanl-money-log">
		<view class="edgeInsetTop"> </view>
		<!-- 交易 -->
		<block v-if="moneyData.type == 'pay' && data">
			<view class="bg-white padding-xl margin-bottom-bj" v-for="(item, index) in data" :key="item.id">
				<view class="text-center solid-bottom title">
					<text>{{item.shop.shopname}}</text>
					<view class="wanl-black"> -{{item.pay.price}} </view>
				</view>
				<view class="goods">
					<view class="item solid-bottom" v-for="(goods, indexs) in item.goods" :key="indexs">
						<image :src="$wanlshop.oss(goods.image, 125, 125)"></image>
						<view class="info">
							<view>
								<text class="text-cut-2">{{goods.title}}</text>
							</view>
							<view class="wanl-gray">
								{{goods.difference}} x {{goods.number}}
							</view>
						</view>
						<view class="text-price">
							{{goods.price}}
						</view>
					</view>
				</view>
				<view class="list margin-top-xl text-sm">
					<view class="flex">
						<view class="type wanl-gray"> 注文番号 </view>
						<view class="info"> {{item.pay.order_no}} </view>
					</view>
					<view class="flex">
						<view class="type wanl-gray"> 取引番号 </view>
						<view class="info"> {{item.pay.pay_no}} </view>
					</view>
					<view class="flex">
						<view class="type wanl-gray"> 注文価格 </view>
						<view class="info text-price"> {{item.pay.order_price}} </view>
					</view>
					<view class="flex">
						<view class="type wanl-gray"> 支払方法 </view>
						<view class="info"> {{moneyData.memo}} </view>
					</view>
					<view class="flex">
						<view class="type wanl-gray"> 取引注文番号号 </view>
						<view class="info"> {{item.pay.trade_no}} </view>
					</view>
					<view class="flex">
						<view class="type wanl-gray"> 実際の支払い </view>
						<view class="info text-price"> {{item.pay.actual_payment}} </view>
					</view>
					<view class="flex">
						<view class="type wanl-gray"> 支払い時間 </view>
						<view class="info"> {{item.paymenttime_text}} </view>
					</view>
					
					<view class="flex">
						<view class="type wanl-gray"> 宅配料 </view>
						<view class="info text-price"> {{item.pay.freight_price}} </view>
					</view>
					<view class="flex">
						<view class="type wanl-gray"> 割引価格 </view>
						<view class="info text-price"> {{item.pay.discount_price}} </view>
					</view>
					<view class="flex">
						<view class="type wanl-gray"> 合計金額 </view>
						<view class="info text-price"> {{item.pay.total_amount}} </view>
					</view>
					<view class="flex">
						<view class="type wanl-gray"> 取引時間 </view>
						<view class="info"> {{item.createtime_text}} </view>
					</view>
					
				</view>
			</view>
		</block>
		
		<!-- 用戶充值 -->
		<block v-else-if="moneyData.type == 'recharge' && data">
			<view class="bg-white padding-xl margin-bottom-bj">
				<view class="text-center solid-bottom title">
					<text>{{moneyData.memo}}</text>
					<view class="wanl-black"> +{{moneyData.money}} </view>
				</view>
				<view class="list margin-top-xl text-sm">
					<view class="flex">
						<view class="type wanl-gray"> 狀態 </view>
						<view class="info"> 正常に再充電されました </view>
					</view>
					<view class="flex">
						<view class="type wanl-gray"> 注文番号 </view>
						<view class="info"> {{data.orderid}} </view>
					</view>
					<view class="flex">
						<view class="type wanl-gray"> 支払いタイプ </view>
						<view class="info"> {{bankList[data.paytype]}} </view>
					</view>
					<view class="flex">
						<view class="type wanl-gray"> 取引番号 </view>
						<view class="info"> {{data.memo}} </view>
					</view>
					<view class="flex">
						<view class="type wanl-gray"> 変更後 </view>
						<view class="info text-price"> {{moneyData.after}} </view>
					</view>
					<view class="flex">
						<view class="type wanl-gray"> 変更前 </view>
						<view class="info text-price"> {{moneyData.before}} </view>
					</view>
					<view class="flex">
						<view class="type wanl-gray"> 儲値時間 </view>
						<view class="info"> {{$wanlshop.timeFormat(moneyData.createtime,'yyyy-mm-dd hh:MM:ss')}} </view>
					</view>
				</view>
			</view>
		</block>
		
		<!-- 用戶提現 -->
		<block v-else-if="moneyData.type == 'withdraw' && data">
			<view class="bg-white padding-xl margin-bottom-bj">
				<view class="text-center solid-bottom title">
					<text>{{moneyData.memo}}</text>
					<view class="wanl-black"> {{moneyData.money}} </view>
				</view>
				<view class="list margin-top-xl text-sm">
					<view class="flex">
						<view class="type wanl-gray"> 狀態 </view>
						<view class="info"> お金を引き出す{{withdrawStatus[data.status]}} </view>
					</view>
					<view class="flex">
						<view class="type wanl-gray"> 引き出し額 </view>
						<view class="info text-price"> {{data.money}} </view>
					</view>
					<view class="flex">
						<view class="type wanl-gray"> サービス料 </view>
						<view class="info text-price"> {{data.handingfee}} </view>
					</view>
					<view class="flex" v-if="data.status == 'successed' && data.transfertime">
						<view class="type wanl-gray"> 転送時間 </view>
						<view class="info"> {{$wanlshop.timeFormat(data.transfertime,'yyyy-mm-dd hh:MM:ss')}} </view>
					</view>
					<view class="flex" v-if="data.status == 'rejected' && data.memo">
						<view class="type wanl-gray"> 拒否の理由 </view>
						<view class="info"> {{data.memo}} </view>
					</view>
					<view class="flex">
						<view class="type wanl-gray"> の種類 </view>
						<view class="info"> {{bankList[data.type]}} </view>
					</view>
					<view class="flex">
						<view class="type wanl-gray"> 口座番号 </view>
						<view class="info"> {{data.account}} </view>
					</view>
					<view class="flex">
						<view class="type wanl-gray"> 取引番号 </view>
						<view class="info"> {{data.orderid}} </view>
					</view>
					<view class="flex">
						<view class="type wanl-gray"> 変更後 </view>
						<view class="info text-price"> {{moneyData.after}} </view>
					</view>
					<view class="flex">
						<view class="type wanl-gray"> 変更前 </view>
						<view class="info text-price"> {{moneyData.before}} </view>
					</view>
					<view class="flex">
						<view class="type wanl-gray"> 提出時間 </view>
						<view class="info"> {{$wanlshop.timeFormat(moneyData.createtime,'yyyy-mm-dd hh:MM:ss')}} </view>
					</view>
				</view>
			</view>
		</block>
		<!-- 退款 -->
		<block v-else-if="moneyData.type == 'refund' && data">
			<view class="bg-white padding-xl margin-bottom-bj">
				<view class="text-center solid-bottom title">
					<text>{{moneyData.memo}}</text>
					<view class="wanl-black"> {{moneyData.money > 0 ? '+'+moneyData.money:moneyData.money}} </view>
					<view @tap="$wanlshop.to(`/pages/user/refund/details?id=${data.refund.id}`)">
						<button class="cu-btn sm radius-bock"> 払い戻しを確認する </button>
					</view>
				</view>
				<view class="list margin-top-xl text-sm">
					<view class="flex">
						<view class="type wanl-gray"> 商人 </view>
						<view class="info"> {{data.shop.shopname}} </view>
					</view>
					<view class="flex">
						<view class="type wanl-gray"> 注文番号 </view>
						<view class="info"> {{data.order_no}} </view>
					</view>
					<view class="flex">
						<view class="type wanl-gray"> 注文時間 </view>
						<view class="info"> {{data.createtime_text}} </view>
					</view>
					<view class="flex">
						<view class="type wanl-gray"> 支払い時間 </view>
						<view class="info"> {{data.paymenttime_text}} </view>
					</view>
					<view class="flex">
						<view class="type wanl-gray"> 返金金額 </view>
						<view class="info text-price"> {{data.refund.price}} </view>
					</view>
					<view class="flex">
						<view class="type wanl-gray"> 払い戻しの種類 </view>
						<view class="info"> {{getType(data.refund.type)}} </view>
					</view>
					<view class="flex">
						<view class="type wanl-gray"> 返金の理由 </view>
						<view class="info"> {{getReason(data.refund.reason)}} </view>
					</view>
					<view class="flex">
						<view class="type wanl-gray"> 払い戻し時間 </view>
						<view class="info"> {{$wanlshop.timeFormat(data.refund.createtime,'yyyy-mm-dd hh:MM:ss')}} </view>
					</view>
					<view class="flex">
						<view class="type wanl-gray"> 払い戻し時間 </view>
						<view class="info"> {{$wanlshop.timeFormat(data.refund.completetime,'yyyy-mm-dd hh:MM:ss')}} </view>
					</view>
				</view>
			</view>
		</block>
		<!-- 系統 -->
		<block v-else>
			<view class="bg-white padding-xl margin-bottom-bj">
				<view class="text-center solid-bottom title">
					<text>{{moneyData.memo}}</text>
					<view class="wanl-black"> {{moneyData.money > 0 ? '+'+moneyData.money:moneyData.money}} </view>
				</view>
				<view class="list margin-top-xl text-sm">
					<view class="flex">
						<view class="type wanl-gray"> 変更後 </view>
						<view class="info text-price"> {{moneyData.after}} </view>
					</view>
					<view class="flex">
						<view class="type wanl-gray"> 変更前 </view>
						<view class="info text-price"> {{moneyData.before}} </view>
					</view>
					<view class="flex">
						<view class="type wanl-gray"> 時間 </view>
						<view class="info"> {{$wanlshop.timeFormat(moneyData.createtime,'yyyy-mm-dd hh:MM:ss')}} </view>
					</view>
				</view>
			</view>
		</block>
		<view class="edgeInsetBottom"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				moneyData: {},
				data: null,
				bankList: {
					A001:"南銀行株式会社",
					A002:"三菱東京UFJ銀行",
					A003:"三井住友銀行",
					A004:"リカ銀行株式会社",
					A005:"埼玉理華銀行株式会社",
					A006:"北海道銀行",
					A007:"青森銀行株式会社",
					A008:"宮野銀行株式会社",
					A009:"秋田銀行株式会社",
					A010:"北東銀行株式会社",
					A011:"総内銀行",
					A012:"山形銀行株式会社",
					A013:"岩手銀行株式会社",
					A014:"東北銀行株式会社",
					A015:"セブン銀行株式会社",
					A016:"東邦銀行株式会社",
					A017:"群馬銀行株式会社",
					A018:"足利銀行株式会社",
					A019:"長陽銀行株式会社",
					A020:"つくば株式会社銀行",
					A021:"武蔵野銀行",
					A022:"千葉銀行",
					A023:"千葉興業銀行",
					A024:"東京メトロポリタン銀行株式会社",
					A025:"横浜銀行",
					A026:"株式会社フォースバンク",
					A027:"北ベトナム銀行株式会社",
					A028:"山梨中央銀行",
					A029:"株式会社82銀行",
					A030:"北陸銀行株式会社",
					A031:"富山銀行",
					A032:"ノースランド銀行株式会社",
					A033:"福井銀行株式会社",
					A034:"静岡銀行株式会社",
					A035:"サージバンク株式会社",
					A036:"清水銀行",
					A037:"大垣共立銀行株式会社",
					A038:"株式会社シックスティーンバンク",
					A039:"三重銀行株式会社",
					A040:"百五銀行株式会社",
					A041:"滋賀銀行株式会社",
					A042:"京東株式会社",
					A043:"近畿大阪銀行",
					A044:"池田泉州銀行",
					A045:"南都銀行株式会社",
					A046:"紀陽銀行株式会社",
					A047:"但馬銀行株式会社",
					A048:"鳥取銀行",
					A049:"三人契約銀行株式会社",
					A050:"中国銀行株式会社",
					A051:"広島銀行株式会社",
					A052:"山口銀行株式会社",
					A053:"阿波銀行株式会社",
					A054:"百十四銀行株式会社",
					A055:"伊予銀行",
					A056:"四国銀行",
					A057:"福岡銀行",
					A058:"筑波銀行株式会社",
					A059:"佐賀銀行株式会社",
					A060:"18銀行株式会社",
					A061:"アフィニティバンク株式会社",
					A062:"肥後銀行株式会社",
					A063:"大分銀行",
					A064:"宮崎銀行",
					A065:"鹿児島銀行",
					A066:"琉球銀行",
					A067:"沖縄銀行株式会社",
					A068:"西日本銀行株式会社",
					A069:"北九州銀行株式会社",
				},
				withdrawStatus: {
					created: '申請中',
					successed: '成功',
					rejected: '拒否されました',
				}
			};
		},
		onLoad(option) {
			this.moneyData = JSON.parse(option.data);
			this.loadData();
		},
		methods: {
			async loadData() {
				let moneyData = this.moneyData;
				this.$api.get({
					url: '/wanlshop/pay/details',
					data: {
						id: moneyData.service_ids,
						type: moneyData.type
					},
					success: res => {
						this.data = res;
					}
				});
			},
			getType(e){
				return ['返品する必要はなくて','返品する返金'][e];
			},
			getReason(e){
				return ['好きでない','いたずらにくるむ','ずっと配達していない','ですか？色/サイズはに一致しないで','品質の問題','少しの件が発を抜かす','ブランドを詐称する'][e];
			}
		}
	}
</script>

<style>
	.wanl-money-log .title{
		padding: 20rpx 0 50rpx 0;
	}
	.wanl-money-log .title>view{
		font-size: 70rpx;
		font-weight: 600;
		margin-top: 14rpx;
	}
	.wanl-money-log .list .flex {
		margin-bottom: 25rpx;
	}
	.wanl-money-log .list .flex .type{
		width: 150rpx;
	}
	.wanl-money-log .list .flex .info{
		flex-grow: 1;
	}
	
	.wanl-money-log .goods .item{
		display: flex;
		align-items: center;
		margin: 25rpx 0;
		padding-bottom: 25rpx;
	}
	
	.wanl-money-log .goods .item image{
		width: 100rpx;
		height: 100rpx;
		margin-right: 25rpx;
	}
	.wanl-money-log .goods .item .info{
		flex: 1;
	}
</style>