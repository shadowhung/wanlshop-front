<template>
	<view>
		<view class="edgeInsetTop"></view>
		<view class="wanl-refund"> 
			<!-- 頭部 -->
			<view class="header">
				<image :src="$wanlshop.appstc('/order/img_detail_bg.png')" class="img-bg"></image>
				<view class="content">
					<view>
						<view class="status-text">{{getStateText(refundData.state)}}</view>
						<view class="reason">
							<text class="reason-text">{{refundData.statetime}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="bg-white padding-bj" v-if="refundData.state != 4">
				{{getStateInfo(refundData.state)}}
			</view>
			<!-- 退款状态:0=申請退款,1=卖家同意,2=卖家拒绝,3=申請平台介入,4=成功退款,5=退款已關閉,6=已提交退貨 -->
			<view class="bg-white solid-top padding-bj current" v-if="refundData.state == 0">
				<view class="wanl-gray text-sm">
					<view>
						<text class="wlIcon-dot margin-right-sm"></text>売り手が同意するか、タイムアウトが処理されない場合、システムは自動的に確認します
					</view>
					<view class="margin-top-xs">
						<text class="wlIcon-dot margin-right-sm"></text>払い戻しが拒否された場合は、アプリケーションを変更して再開できます
					</view>
				</view>
				<view class="flex justify-end margin-top">
					<button class="cu-btn line-black margin-lr-xs" @tap="closeRefund(refundData.id)">払い戻しをキャンセルする</button>
					<button class="cu-btn line-orange" @tap="editRefund(refundData.id)">アプリケーションを変更する</button>
				</view>
			</view>
			
			<view v-if="refundData.state == 1">
				<view class="bg-white solid-top padding-bj receipt">
					<view class="icon">
						<text class="wlIcon-guanzhu1"></text>
					</view>
					<view class="content">
						<view class="flex justify-between">
							<text>受信者：{{refundData.shopConfig.returnName}}</text><text>{{refundData.shopConfig.returnPhoneNum}}</text>
						</view>
						<view class="margin-top-xs">
							<view class="text-cut-2">
								{{refundData.shopConfig.returnAddr}}
							</view>
						</view>
					</view>
				</view>
				<view class="bg-white padding-bj solid-top">
					<view class="wanl-gray text-sm">
						<view>
							<text class="wlIcon-dot margin-right-sm"></text>販売者からの返品を受け取らないように、船便を使用したり、支払いを回収したりしないでください。
						</view>
						<view class="margin-top-xs">
							<text class="wlIcon-dot margin-right-sm"></text>実際の宅配便情報を入力してください。有効期限が切れると、払い戻しはキャンセルされます。
						</view>
					</view>
				</view>
				<view class="cu-form-group margin-top-bj">
					<view class="title">追跡番号：</view>
					<input placeholder="宅配便番号をご記入ください" name="input" v-model="returnData.express_no"></input>
				</view>
				<view class="cu-form-group">
					<view class="title">宅配会社：</view>
					<picker @change="kuaidiChange" :range="refundData.kuaidi" range-key="name">
						<view class="picker">
							{{kuaidiKey>-1?refundData.kuaidi[kuaidiKey].name:'選択'}}
						</view>
					</picker>
				</view>
				<view class="bg-white padding-bj current">
					<view class="flex justify-end">
						<button class="cu-btn line-orange margin-lr-xs" @tap="toExpress(refundData.id)">返品の確認</button>
					</view>
				</view>
			</view>
			<view class="bg-white current" v-if="refundData.state == 6">
				<view class="bg-white solid-top padding-bj">
					リターンフロー：<text class="wanl-gray">{{refundData.express_name}}({{refundData.express_no}})</text>
				</view>
				<view class="bg-white solid-top padding-bj current">
					<view class="wanl-gray text-sm">
						<view>
							<text class="wlIcon-dot margin-right-sm"></text>払い戻しが拒否された場合は、アプリケーションを変更して再開できます
						</view>
						<view class="margin-top-xs">
							<text class="wlIcon-dot margin-right-sm"></text>売り手はタイムアウトを処理していません、システムは自動的に確認します
						</view>
					</view>
				</view>
			</view>
			<view class="bg-white solid-top padding-bj current " v-if="refundData.state == 2">
				<view class="text-sm">
					拒否の理由：<text class="wanl-gray">{{refundData.refuse_content}}</text>
				</view>
				<view class="flex justify-end margin-top">
					<button class="cu-btn line-black" @tap="arbitrationRefund(refundData.id)">プラットフォームの介入</button>
					<button class="cu-btn line-orange margin-left-xs" @tap="editRefund(refundData.id)">アプリケーションを変更する</button>
				</view>
			</view>
			<view class="bg-white solid-top padding-bj current" v-if="refundData.state == 3">
				<view class="wanl-gray text-sm">
					<view>
						<text class="wlIcon-dot margin-right-sm"></text>カスタマーサービスが払い戻しの詳細と払い戻し履歴を確認しています
					</view>
					<view class="margin-top-xs">
						<text class="wlIcon-dot margin-right-sm"></text>返信には1〜3営業日かかりますので、しばらくお待ちください。
					</view>
				</view>
			</view>
			<view class="bg-white padding-bj flex justify-between align-center" v-if="refundData.state == 4">
				<text>返金総額</text><text class="text-price wanl-orange">{{refundData.price}}</text>
			</view>
			<view class="bg-white padding-bj margin-top-bj flex justify-between align-center" @tap="refundLog(refundData.id)">
				<text>払い戻し履歴</text><text class="wlIcon-fanhui2"></text>
			</view>
			<view class="bg-white padding-bj margin-top-bj">
				払い戻しの詳細
			</view>
			<view class="padding-bj flex">
				<view class="cu-avatar xl margin-right-bj" :style="{backgroundImage: 'url('+$wanlshop.oss(refundData.goods.image, 70, 70)+')'}"> </view>
				<view class="text-sm" style="width: calc(100% - 128rpx);">
					<view class="margin-bottom-xs">
						<view class="text-cut-2">
							{{refundData.goods.title}}
						</view>
					</view>
					<view class="wanl-gray">
						仕様：{{refundData.goods.difference}}
					</view>
				</view>
			</view>
			<view class="bg-white padding-bj text-sm">
				<view class="item flex">
					<text class="wanl-gray"> 払い戻しの種類： </text> <text> {{refundData.type_text}} </text>
				</view>
				<view class="item flex margin-top-bj">
					<text class="wanl-gray"> 返却理由： </text> <text> {{refundData.reason_text}} </text>
				</view>
				<view class="item flex margin-top-bj">
					<text class="wanl-gray"> 返金金額： </text> <text class="text-price"> {{refundData.price}} </text>
				</view>
				<view class="item flex margin-top-bj">
					<text class="wanl-gray"> ロジスティクスステータス： </text> <text> {{refundData.expressType_text}} </text>
				</view>
				<view class="item flex margin-top-bj">
					<text class="wanl-gray"> 払い戻し時間： </text> <text> {{refundData.createtime_text}} </text>
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
			refundData: {
				statetime: '',
				goods:{
					
				}
			},
			returnData:{
				id: 0,
				express_no: '',
				express_name: ''
			},
			kuaidiKey: -1
		};
	},
	onLoad(option) {
		this.loadData({id:option.id});
	},
	methods: {
		async loadData(data) {
			this.$api.get({
				url: '/wanlshop/refund/getRefundInfo',
				data: data,
				success: res => {
					this.refundData = res;
					this.returnData.id = res.id;
					// 时間差的毫秒數 
					if(res.state == 0){
						var diff = (res.createtime + res.config.autoagree * 86400) - Date.parse(new Date()) / 1000;
						var days = Math.floor(diff / 86400);
						var hours = Math.floor(diff % 86400 / 3600); 
						var minutes = Math.floor(diff % 86400 % 3600 / 60);
						if (minutes > 0) {
							this.refundData.statetime = '残り物' +minutes+ '分';
						}
						if (hours > 0) {
							this.refundData.statetime = '残り物' +hours+ '日' +minutes+ '分';
						}
						if (days > 0) {
							this.refundData.statetime = '残り物' +days+ '日' +hours+ '時間' +minutes+ '分';
						}
					}else if(res.state == 1){
						var diff = (res.agreetime + res.config.returntime * 86400) - Date.parse(new Date()) / 1000;
						var days = Math.floor(diff / 86400);
						var hours = Math.floor(diff % 86400 / 3600); 
						var minutes = Math.floor(diff % 86400 % 3600 / 60);
						if (minutes > 0) {
							this.refundData.statetime = '残り物' +minutes+ '分';
						}
						if (hours > 0) {
							this.refundData.statetime = '残り物' +hours+ '日' +minutes+ '分';
						}
						if (days > 0) {
							this.refundData.statetime = '残り物' +days+ '日' +hours+ '時間' +minutes+ '分';
						}
					}else if(res.state == 2){
						this.refundData.statetime = res.rejecttime_text;
					}else if(res.state == 6){
						var diff = (res.returntime + res.config.receivingtime * 86400) - Date.parse(new Date()) / 1000;
						var days = Math.floor(diff / 86400);
						var hours = Math.floor(diff % 86400 / 3600); 
						var minutes = Math.floor(diff % 86400 % 3600 / 60);
						if (minutes > 0) {
							this.refundData.statetime = '残り物' +minutes+ '分';
						}
						if (hours > 0) {
							this.refundData.statetime = '残り物' +hours+ '日' +minutes+ '分';
						}
						if (days > 0) {
							this.refundData.statetime = '残り物' +days+ '日' +hours+ '時間' +minutes+ '分';
						}
					}else if(res.state == 3){
						this.refundData.statetime = 'プラットフォームが処理するのを待っています';
					}else if(res.state == 4){
						this.refundData.statetime = res.completetime_text;
					}else if(res.state == 5){	
						this.refundData.statetime = res.closingtime_text;
					}
				}
			});
		},
		getStateText(state){
			return ["売り手がに賛成するのを待って","買い手が返品するのを待つ","売り手が返金するのを拒絶する","プラットフォームが介入する","返金が完成する","返金が閉める","は売り手が返品を受け取りを待ちます"][state];
		},
		getStateInfo(state){
			return ["はあなたはすでにみごとに返金を始めて、売り手がに賛成するのを待って","あなたの始めた返金の売り手はすでに賛成して、返品してください","あなたが返品を改正して再度始めるのを申請することができる","はあなたはすでにプラットフォームが介入するのを申請して、プラットフォームがこれに対してを判定するのを待ってください","返金が完成する","すでに今回の返金を閉めて申請する","はもしも商店は品物を受け取りを確認して、そして綿密に調査して問題がなくて、返金するのをあなたのに"][state];
		},
		kuaidiChange(e) {
			this.kuaidiKey = e.detail.value;
			this.returnData.express_name = this.refundData.kuaidi[e.detail.value].code;
		},
		// 退款曆史
		refundLog(id){
			this.$wanlshop.to(`/pages/user/refund/log?id=${id}`);
		},
		// 平台介入
		async arbitrationRefund(id){
			this.$api.get({
				url: '/wanlshop/refund/arbitrationRefund',
				data: {id:id},
				success: res => {
					this.loadData({id:id});
				}
			});
		},
		// 取消退款
		async closeRefund(id){
			this.$api.get({
				url: '/wanlshop/refund/closeRefund',
				data: {id:id},
				success: res => {
					this.$store.commit('statistics/order', {
						customer: this.$store.state.statistics.order.customer - 1
					});
					this.loadData({id:id});
				}
			});
		},
		// 提交物流
		async toExpress(){
			if (!this.returnData.express_no) {
				this.$wanlshop.msg('運送状番号を空にすることはできません');
				return false;
			}
			if (!this.returnData.express_name) {
				this.$wanlshop.msg('宅配会社をお選びください');
				return false;
			}
			this.$api.post({
				url: '/wanlshop/refund/toExpress',
				data: this.returnData,
				success: res => {
					this.loadData({id:res});
				}
			});
		},
		// 修改退款
		editRefund(id){
			this.$wanlshop.to(`/pages/user/refund/edit?id=${id}`);
		}
		
	}
};
</script>

<style>
	.wanl-refund .header {
		width: 100%;
		height: 180rpx;
		position: relative;
		background-color: #f72b36;
	}
	
	.wanl-refund .header .img-bg {
		width: 100%;
		height: 180rpx;
	}
	
	.wanl-refund .header .content {
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
	
	.wanl-refund .header .status-text {
		font-size: 34rpx;
		line-height: 34rpx;
		color: #FEFEFE;
	}
	
	.wanl-refund .header .reason {
		font-size: 24rpx;
		line-height: 24rpx;
		color: rgba(254, 254, 254, 0.75);
		padding-top: 15rpx;
		display: flex;
		align-items: center;
	}
	
	.wanl-refund .header .reason-text {
		padding-right: 12rpx;
	}
	
	.wanl-refund .header .status-img {
		width: 100rpx;
		height: 100rpx;
		display: block;
	}
	
	.wanl-refund .current .cu-btn{
		width: 140rpx;
		font-size: 26rpx;
		padding: 0 12rpx;
	}
	.wanl-refund .receipt{
		display: flex;
		align-items: center;
	}
	
	.wanl-refund .receipt .icon{
		margin-right: 25rpx;
		font-weight: bold;
	}
	.wanl-refund .receipt .content{
		flex: 1;
	}
	
	.wanl-refund .cu-form-group .title{
		padding-right: 25rpx;
		font-size: 28rpx;
		height: 55rpx;
		line-height: 55rpx;
	}
	.wanl-refund .cu-form-group input{
		font-size: 28rpx;
		color: #555;
		padding-right: 10rpx;
	}
	
	
</style>
