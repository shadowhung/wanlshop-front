<template>
	<view class="wanl-withdraw">
		<view class="edgeInsetTop"> </view>
		<view class="padding-tb-bj" @tap="$wanlshop.to('/pages/user/bank/bank?choice=1')">
			<view class="bank" v-if="bankData">
				<image :src="`/static/images/bank/${bankData.bankCode}.png`"></image>
				<view class="content">
					<text>{{bankData.bankName}}</text>
					<view class="wanl-gray">
						<text>テールナンバー {{getCode(bankData.cardCode)}} {{getType(bankData.cardType)}}</text>
					</view>
				</view>
				<view class="action">
					<text class="wlIcon-fanhui2"></text>
				</view>
			</view>
			<view class="bank" v-else>
				<view class="content" style="height: 80rpx; line-height: 80rpx;">
					<text>引き出し口座を選択してください</text>
				</view>
				<view class="action">
					<text class="wlIcon-fanhui2"></text>
				</view>
			</view>
		</view>
		
		<view class="padding-bj bg-white money">
			<view class="text-lg">
				<text>引き出し額</text>
				<!--<text class="text-sm wanl-gray" v-if="servicefee > 0">（費率 {{servicefee/10}}%）</text>-->
				<text class="text-sm wanl-gray">（サービス率 {{servicefee/10}}%）</text>
			</view>
			<view class="margin-tb-bj price">
				<view class="symbol">
					<text>円</text>
				</view>
				<input type="digit" maxlength="8" v-model="money" focus @input="replaceInput"/>
				<view class="text-lg wanl-gray-light" @tap="emptyInput" v-if="money">
					<text class="wlIcon-shibai"></text>
				</view>
			</view>
			<view class="solid-top padding-top-bj">
				<!--<block v-if="servicefee > 0">
					<text class="wanl-gray-light">服務費</text>
					<text class="text-price text-orange margin-left-xs">{{servicemoney>0?servicemoney:'0'}}</text>
					<text style="color:green;" @tap="tips">（活動）</text>
					<text class="wanl-gray-light">，</text>
				</block>-->
				<block>
					<text class="wanl-gray-light">サービス料</text>
					<text class="text-price text-orange margin-left-xs">{{servicemoney>0?servicemoney:'0'}}</text>
					<!--<text style="color:green;" @tap="tips">（活動）</text>-->
					<text class="wanl-gray-light">，</text>
				</block>
				<text class="wanl-gray-light">利用可能残高</text>
				<text class="wanl-gray-light margin-lr-xs text-price">{{usermoney}}</text>
				<text class="text-orange" v-if="usermoney > 0" @tap="moneyAll">すべて</text>
			</view>
		</view>
		<view class="list-box">
			<text>支払いパスワード<span @tap="$wanlshop.to('/pages/user/setting/paypass')" style="color: red;">(セットに移動)</span></text>
			<view class="codes">
				<view v-for="item in config.count" :key="item.key">
					<view class="input" @tap="hanldeOpenKeyboard" :class="{ active: currentFocus == item.index }">
						<template v-if="code[item.index - 1] != undefined">
							{{ code[item.index - 1] }}
						</template>
						<template v-else>
							<view v-if="currentFocus == item.index" class="shining"></view>
						</template>
					</view>
				</view>
			</view>
		</view>
		<view class="padding-bj margin-top">
			<button class="mix-btn wanl-bg-redorange" @tap="withdraw">お金を引き出す</button>
		</view>
		<view class="padding-bj bg-white money" style="color: red;">
			<p>チップ：</p>
			<p>SHOPJPまたはそのパートナーのキャッシュフローサービスプロバイダーは、営業日の引き出しリクエストは対応できます。また、お引き出しは２～5営業日となります。</p>
		</view>
		<wanl-keyboard :open="keyboardVisible" @number="inputCode" @delete="deleteCode" @empty="emptyCode" @close="keyboardVisible = false" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bankData: null,
				usermoney: 0,
				money: null,
				servicemoney: 0,
				servicefee: 0,
				config: {
					count: [
						{
							index: 1,
							key: 'valid-code-input-1'
						},
						{
							index: 2,
							key: 'valid-code-input-2'
						},
						{
							index: 3,
							key: 'valid-code-input-3'
						},
						{
							index: 4,
							key: 'valid-code-input-4'
						},
						{
							index: 5,
							key: 'valid-code-input-5'
						},
						{
							index: 6,
							key: 'valid-code-input-6'
						}
					]
				},
				keyboardVisible: false,
				currentFocus: 1,
				mobile: '',
				code: [],
				style: {
					inputWidth: '40upx',
					inputHeight: '100upx'
				},
				countdown: 60,
				cTimer: null,
				event: '',
				pageroute: ''
			};
		},
		onLoad() {
			this.loadData();
		},
		methods: {
			async loadData() {
				this.$api.post({
					url: '/wanlshop/pay/initialWithdraw',
					success: res => {
						//更新全局金额
						this.setMoney(res.money);
						//獲取提現帳戶
						this.bankData = res.bank;
						// 服務费
						this.servicefee = res.servicefee;
					}
				});
			},
			tips(){
				uni.showModal({ title: '促す', content: '活動時間：2021.01.01--2021.12.31' });
				return;
				
				uni.showModal({
				    content: '活動時間：2021.01.01--2021.12.31',
				    success: res=> {
				        if (res.confirm) {
							
				        } else if (res.cancel) {
							
				        }
				    }
				});
			},
			withdraw(){
				if(!this.bankData){
					this.$wanlshop.msg('アカウントを選択してください');
					return;
				}
				if(this.money <= 0){
					this.$wanlshop.msg('正しい金額を入力してください');
					return;
				}
				if(parseFloat(this.money) > parseFloat(this.usermoney)){
					this.$wanlshop.msg('引き出し額は超えてはいけません ' +this.usermoney+ ' 円');
					return;
				}
				this.$api.post({
					url: '/wanlshop/pay/withdraw',
					data: {
						money: this.money,
						account_id: this.bankData.id,
						captcha: this.code.join(""),
					},
					success: res => {
						this.setMoney(res);
						// 跳转成功
						this.$wanlshop.to('/pages/page/success?type=withdraw');
					}
				});
			},
			setMoney(money){
				money = parseFloat(money).toFixed(0);
				this.usermoney = money;
				this.$store.commit('user/setUserInfo', {money: money});
			},
			replaceInput(e){
				this.money = e.target.value;
				this.servicemoney = e.target.value > 0 ? (e.target.value*this.servicefee/1000).toFixed(2) : 0;
			},
			emptyInput(){
				this.money = null;
			},
			moneyAll(){
				this.money = this.usermoney;
			},
			getCode(str){
				str = str.replace(/\s+/g,"");
				return str.substring(str.length-4);
			},
			getType(key){
				return ['デビットカード', 'クレジットカード'][key];
			},
			inputCode(e) {
				this.code[this.currentFocus - 1] = e;
				if (this.currentFocus == 6) {
					this.$api.post({
						url: '/wanlshop/pay/getpaypass',
						data: {
							captcha: this.code.join(""),
						},
						success: res => {
							this.withdraw();
						}
					});
				}
				if (this.currentFocus <= 6) {
					this.currentFocus++;
				}
			},
			deleteCode() {
				this.currentFocus--;
				this.code.splice(-1, 1);
			},
			emptyCode(){
				this.code = [];
				this.currentFocus = 0;
			},
			hanldeOpenKeyboard() {
				this.keyboardVisible = true;
			},
		}
	}
</script>

<style>
	@import url("auth.css");
	.wanl-withdraw .money .symbol{
		font-size: 60rpx;
		margin-right: 10rpx;
	}
	
	.wanl-withdraw .money .price{
		display: flex;
		align-items: center;
	}
	.wanl-withdraw .money .price input{
		/* #ifdef MP */
		height: 100rpx;
		min-height: 100rpx;
		/* #endif */
		width: 100%;
		font-size: 100rpx;
	}
	
	.wanl-withdraw .bank{
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #ffffff;
		padding: 20rpx 25rpx;
	}
	.wanl-withdraw .bank image{
		width: 100rpx;
		height: 100rpx;
		margin-right: 25rpx;
	}
	.wanl-withdraw .bank .content{
		flex: 1;
	}
	.wanl-withdraw .bank .action{
		
	}
</style>
