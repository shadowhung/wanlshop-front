<template>
	<view>
		<view class="edgeInsetTop"></view>
		<view class="cu-form-group">
			<view class="title">銀行を選択</view>
			<picker @change="bankChange" :value="index" :range="bankList" range-key="bankName">
				<view class="picker">
					<view class="flex justify-end align-center" v-if="index > -1">
						<image :src="`/static/images/bank/${bankList[index].bankCode}.png`"></image>
						<view class="margin-left-xs">{{bankList[index].bankName}}</view>
					</view>
					<view v-else>
						選択
					</view>
				</view>
			</picker>
		</view>
		<view class="cu-form-group">
			<view class="title">銀行口座</view>
			<input type="text" placeholder="銀行口座番号を入力してください" v-model="bankData.cardCode"/>
		</view>
		<view class="cu-form-group">
			<view class="title">銀行支店</view>
			<input type="text" placeholder="銀行の支店名を入力してください" v-model="bankData.bankName2"/>
		</view>
		<view class="cu-form-group">
			<view class="title">アカウント名</view>
			<input type="text" maxlength="20" placeholder="口座名義" v-model="bankData.username"/>
		</view>
		<view class="cu-form-group">
			<view class="title">電話番号</view>
			<input type="number" maxlength="10" placeholder="口座名義人の携帯電話番号" v-model="bankData.mobile"/>
		</view>
		<view class="padding-bj flex flex-direction margin-top">
			<button @tap="confirm" class="cu-btn wanl-bg-orange lg">実施する</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bankData: {
					username: '',
					mobile: '',
					bankCode: '',
					bankName: '',
					bankName2:'',
					cardCode: ''
				},
				index: -1,
				bankList: [
					{bankCode:"A001", bankName:"南銀行株式会社"},
					{bankCode:"A002", bankName:"三菱東京UFJ銀行"},
					{bankCode:"A003", bankName:"三井住友銀行"},
					{bankCode:"A004", bankName:"リカ銀行株式会社"},
					{bankCode:"A005", bankName:"埼玉理華銀行株式会社"},
					{bankCode:"A006", bankName:"北海道銀行"},
					{bankCode:"A007", bankName:"青森銀行株式会社"},
					{bankCode:"A008", bankName:"宮野銀行株式会社"},
					{bankCode:"A009", bankName:"秋田銀行株式会社"},
					{bankCode:"A010", bankName:"北東銀行株式会社"},
					{bankCode:"A011", bankName:"総内銀行"},
					{bankCode:"A012", bankName:"山形銀行株式会社"},
					{bankCode:"A013", bankName:"岩手銀行株式会社"},
					{bankCode:"A014", bankName:"東北銀行株式会社"},
					{bankCode:"A015", bankName:"セブン銀行株式会社"},
					{bankCode:"A016", bankName:"東邦銀行株式会社"},
					{bankCode:"A017", bankName:"群馬銀行株式会社"},
					{bankCode:"A018", bankName:"足利銀行株式会社"},
					{bankCode:"A019", bankName:"長陽銀行株式会社"},
					{bankCode:"A020", bankName:"つくば株式会社銀行"},
					{bankCode:"A021", bankName:"武蔵野銀行"},
					{bankCode:"A022", bankName:"千葉銀行"},
					{bankCode:"A023", bankName:"千葉興業銀行"},
					{bankCode:"A024", bankName:"東京メトロポリタン銀行株式会社"},
					{bankCode:"A025", bankName:"横浜銀行"},
					{bankCode:"A026", bankName:"株式会社フォースバンク"},
					{bankCode:"A027", bankName:"北ベトナム銀行株式会社"},
					{bankCode:"A028", bankName:"山梨中央銀行"},
					{bankCode:"A029", bankName:"株式会社82銀行"},
					{bankCode:"A030", bankName:"北陸銀行株式会社"},
					{bankCode:"A031", bankName:"富山銀行"},
					{bankCode:"A032", bankName:"ノースランド銀行株式会社"},
					{bankCode:"A033", bankName:"福井銀行株式会社"},
					{bankCode:"A034", bankName:"静岡銀行株式会社"},
					{bankCode:"A035", bankName:"サージバンク株式会社"},
					{bankCode:"A036", bankName:"清水銀行"},
					{bankCode:"A037", bankName:"大垣共立銀行株式会社"},
					{bankCode:"A038", bankName:"株式会社シックスティーンバンク"},
					{bankCode:"A039", bankName:"三重銀行株式会社"},
					{bankCode:"A040", bankName:"百五銀行株式会社"},
					{bankCode:"A041", bankName:"滋賀銀行株式会社"},
					{bankCode:"A042", bankName:"京東株式会社"},
					{bankCode:"A043", bankName:"近畿大阪銀行"},
					{bankCode:"A044", bankName:"池田泉州銀行"},
					{bankCode:"A045", bankName:"南都銀行株式会社"},
					{bankCode:"A046", bankName:"紀陽銀行株式会社"},
					{bankCode:"A047", bankName:"但馬銀行株式会社"},
					{bankCode:"A048", bankName:"鳥取銀行"},
					{bankCode:"A049", bankName:"三人契約銀行株式会社"},
					{bankCode:"A050", bankName:"中国銀行株式会社"},
					{bankCode:"A051", bankName:"広島銀行株式会社"},
					{bankCode:"A052", bankName:"山口銀行株式会社"},
					{bankCode:"A053", bankName:"阿波銀行株式会社"},
					{bankCode:"A054", bankName:"百十四銀行株式会社"},
					{bankCode:"A055", bankName:"伊予銀行"},
					{bankCode:"A056", bankName:"四国銀行"},
					{bankCode:"A057", bankName:"福岡銀行"},
					{bankCode:"A058", bankName:"筑波銀行株式会社"},
					{bankCode:"A059", bankName:"佐賀銀行株式会社"},
					{bankCode:"A060", bankName:"18銀行株式会社"},
					{bankCode:"A061", bankName:"アフィニティバンク株式会社"},
					{bankCode:"A062", bankName:"肥後銀行株式会社"},
					{bankCode:"A063", bankName:"大分銀行"},
					{bankCode:"A064", bankName:"宮崎銀行"},
					{bankCode:"A065", bankName:"鹿児島銀行"},
					{bankCode:"A066", bankName:"琉球銀行"},
					{bankCode:"A067", bankName:"沖縄銀行株式会社"},
					{bankCode:"A068", bankName:"西日本銀行株式会社"},
					{bankCode:"A069", bankName:"北九州銀行株式会社"},
				]
			}
		},
		methods: {
			// 後續版本添加第三方API接口，自動獲取銀行，驗證銀行帳戶三要素
			confirm(){
				let data = this.bankData;
				if(!data.bankCode){
					this.$wanlshop.msg('銀行口座を選択してください');
					return;
				}
				if(!data.cardCode){
					this.$wanlshop.msg('アカウントを選択してください');
					return;
				}
				if(!data.username){
					this.$wanlshop.msg('本名を入力してください');
					return;
				}
				var myreg = /^[0-9]{8,15}$/;
				if(!data.mobile || !myreg.test(data.mobile)){
					this.$wanlshop.msg('正しい携帯電話番号を入力してください');
					return;
				}
				this.$wanlshop.prePage().refreshList(data);
				this.$wanlshop.back(1);
			},
			bankChange(e) {
				this.index = e.detail.value;
				this.bankData.bankCode = this.bankList[e.detail.value].bankCode;
				this.bankData.bankName = this.bankList[e.detail.value].bankName;
			}
		}
	}
</script>

<style>
	.picker .flex image{
		width: 40rpx;
		height: 40rpx;
	}

</style>