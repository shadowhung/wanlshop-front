<template>
	<view class="wanl-money">
		<view class="edgeInsetTop"></view>
		<view class="cu-list menu-avatar" v-if="dataList">
			<view class="cu-item" v-for="(item, index) in dataList" :key="item.id">
				<!--<image class="cu-avatar" :src="`/static/images/bank/${item.type}.png`"></image>-->
				<view class="content"  style="left: 35px;">
					<view class="text-sm flex">
						<view class="text-cut">
							に撤退する{{bankList[item.type]}}***{{getCode(item.account)}}アカウント
						</view> 
					</view>
					<view>
						<text class="wanl-orange text-price">{{$wanlshop.bcadd(Number(item.money), Number(item.handingfee))}}</text>
					</view>
					<view class="wanl-gray text-sm">
						{{ $wanlshop.timeToDate(item.createtime) }}
					</view>
				</view>
				<view class="action">
					<view class="wanl-red" v-if="item.status == 'rejected'">
						ごみ <text v-if="item.memo">{{item.memo}}</text>
					</view>
					<view class="cu-tag radius" :class="item.status == 'successed'?'bg-green':'bg-orange'" v-else>{{statusList[item.status]}}</view>
				</view>
			</view>
		</view>
		
		<!-- 空 -->
		<view v-if="dataList.length == 0">
			<wanl-empty src="ticket_default3x" text="引き出し記録が見つかりませんでした"/>
		</view>
		<view class="edgeInsetBottom"></view>
		<uni-load-more :status="status" :content-text="contentText" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			dataList: [],
			statusList: {
				created: '申請中',
				successed: '成功',
				rejected: '拒否されました'
			},
			bankList: {
				//alipay: '支付宝帳戶',
				//ALIPAY: '支付宝帳戶',
				//WECHAT: '微信帳戶',
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
		};
	},
	onLoad() {
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
		async loadData() {
			this.$api.post({
				url: '/wanlshop/pay/withdrawLog',
				data: {
					page: this.current_page
				},
				success: res => {
					uni.stopPullDownRefresh();
					this.dataList = this.reload ? res.data : this.dataList.concat(res.data); //數據 追加
					this.total = res.total; //數據量
					this.current_page = res.current_page; //当前頁碼
					this.last_page = res.last_page; //总頁碼
					this.status = res.total == 0 ? 'noMore' : 'more';
				}
			});
		},
		getCode(str){
			str = str.replace(/\s+/g,"");
			return str.substring(str.length-4);
		}
	}
};
</script>

<style>
.wanl-money .balance {
	/* background-color: #f1f1f1; */
	margin: 10rpx 25rpx 25rpx 25rpx;
}

.wanl-money .balance .details {
	padding: 50rpx 0;
}

.wanl-money .balance .operate {
	display: flex;
	align-items: center;
	justify-content: space-around;
	background: rgba(0, 0, 0, 0.1);
	height: 80rpx;
	color: #fff;
}

.wanl-money .cu-list.menu-avatar>.cu-item{
	height: 180rpx;
	align-items: flex-start;
	padding: 25rpx 0;
}

.wanl-money .cu-list.menu-avatar>.cu-item .cu-avatar {
    width: 75rpx;
    height: 75rpx;
	left: 25rpx;
	margin-top: 6rpx;
}

.wanl-money .cu-list.menu-avatar>.cu-item .content {
    left: 120rpx;
    width: calc(100% - 75rpx - 25rpx -150rpx);
    line-height: 1.5em;
}

.wanl-money .cu-list.menu-avatar>.cu-item .action{
	width: 150rpx;
    text-align: right;
	padding-right: 25rpx;
}

</style>
