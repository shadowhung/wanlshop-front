<template>
	<view>
		<!-- 導航條 -->
		<view class="cu-custom" :style="{height: wanlsys.height + 'px' }">
			<view class="cu-bar bg-bgcolor fixed" :style="{ height: wanlsys.height + 'px', paddingTop: wanlsys.top + 'px'}">
				<view class="action" @tap="$wanlshop.back(1)">
					<text class="wlIcon-fanhui1"></text>
				</view>
				<view class="content" :style="{top: wanlsys.top + 'px'}">
					申請入駐
				</view>
				<view class="action" @tap="$wanlshop.to('/pages/user/service')">
					<text class="wlIcon-kefu"></text>
				</view>
			</view>
		</view>
		<form @submit="formSubmit">
			<!--<view class="cu-form-group">
				<view class="title">店铺類型</view>
				<picker @change="PickerChange" :value="shopdata.state" :range="state_text">
					<view class="picker">
						{{state_text[shopdata.state]}}
					</view>
				</picker>
			</view>-->
			<view class="cu-form-group">
				<view class="title">{{name_text[shopdata.state]}}</view>
				<input name="name" v-model="shopdata.name" :placeholder="'請輸入'+name_text[shopdata.state]"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">{{number_text[shopdata.state]}}</view>
				<input name="number" v-model="shopdata.number" :placeholder="'請輸入'+number_text[shopdata.state]"></input>
			</view>
			<view class="cu-form-group margin-top-bj" :class="shopdata.state == 2 ? '':'margin-bottom-bj'">
				<view class="title">{{image_text[shopdata.state]}}</view>
				<input name="image" v-model="shopdata.image" :placeholder="'点击上傳'+image_text[shopdata.state]" disabled @tap="chooseImg('image')"></input>
				<view class="cu-avatar radius" v-if="shopdata.image" @tap="previewImage(0)">
					<image :src="$wanlshop.oss(shopdata.image, 32, 0, 1)" mode="widthFix"></image>
				</view>
			</view>
			<view class="cu-form-group margin-bottom-bj" v-if="shopdata.state == 2">
				<view class="title">商标證书</view>
				<input name="trademark" v-model="shopdata.trademark" placeholder="点击上傳商标證书" disabled @tap="chooseImg('trademark')"></input>
				<view class="cu-avatar radius" v-if="shopdata.trademark" @tap="previewImage(1)">
					<image :src="$wanlshop.oss(shopdata.trademark, 32, 0, 1)" mode="widthFix"></image>
				</view>
			</view>
			
			<view class="cu-form-group">
				<view class="title">line ID</view>
				<input name="wechat" v-model="shopdata.wechat" placeholder="請輸入Line"></input>
				<text class='wlIcon-WeChat text-green'></text>
			</view>
			
			<view class="cu-form-group">
				<view class="title">携帯電話</view>
				<input name="mobile" v-model="shopdata.mobile" maxlength="15" type="number" placeholder="携帯電話を入力してください"></input>
			</view>
			
			<view class="cu-form-group">
				<view class="title">邀請碼</view>
				<input name="invitation" v-model="shopdata.invitation" maxlength="15" type="number" placeholder="請輸入邀请碼"></input>
			</view>
			
			<view class="edgeInsetBottom"></view>
			<view class="wanlian cu-bar tabbar foot flex flex-direction">
				<button form-type="submit" :disabled="shopdata.verify == 3" class="cu-btn wanl-bg-orange lg">{{verify_text[shopdata.verify]}}</button>
			</view>
		</form>
	</view>
</template>

<script>
	import graceChecker from '@/common/graceChecker';
	export default {
		data() {
			return {
				wanlsys: this.$wanlshop.wanlsys(),
				state_text: ['個人', '企业', '旗舰店'],
				name_text: ['名前', '企业名称', '企业名称'],
				number_text: ['身份證字號', '統一信用代碼', '統一信用代碼'],
				image_text: ['手持身份證', '营业执照', '营业执照'],
				verify_text: ['今すぐ入居','已申請 変更する','レビュー中','已入駐不可操作','未承認','已修改成功'],
				shopdata:{
					state: 0,
					verify: 0,
					image: '',
					trademark: '',
					invitation:''
				}
			}
		},
		onLoad(option) {
			if(!option){
				var data = JSON.parse(option.data);
				if (data.id) {
					this.shopdata = data;
				}
			}else{
				this.$api.get({
					url: '/wanlshop/shop/apply',
					success: res => {
						if (res) {
							this.shopdata = res;
						}
					}
				});	
			}
		},
		methods: {
			PickerChange(e) {
				this.shopdata.state = e.detail.value
			},
			// 提交申請
			formSubmit(e) {
				// verify:0=提交资质,1=提交店铺,2=提交审核,3=通過,4=未通過
				if (this.shopdata.verify != 3) {
					this.wanlChecker(e);
				}else{
					this.$wanlshop.msg('已成功入駐，不可修改再修改申請信息');
				}
			},
			async wanlChecker(e){
				//定义表單规则
				let rule = [
					{name: 'name', checkType: 'notnull', errorMsg: '請輸入'+ this.name_text[this.shopdata.state]},
					{name: 'number', checkType: 'notnull', errorMsg: '請輸入'+ this.number_text[this.shopdata.state]},
					{name: 'image', checkType: 'notnull', errorMsg: '請上傳'+ this.image_text[this.shopdata.state]},
					// {name: 'trademark', checkType: 'notnull', errorMsg: '請上傳商标證书'},
					{name: 'wechat', checkType: 'notnull', errorMsg: '請輸入Line'},
					{name: 'mobile', checkType: 'phoneno', errorMsg: '請輸入正確的行動電話'}
				];
				//进行表單检查
				let formData = e.detail.value;
				let checkRes = graceChecker.check(formData, rule);
				if(checkRes){
					var shopdata = this.shopdata;
					this.$api.post({
						url: '/wanlshop/shop/apply',
						data: shopdata,
						success: res => {
							this.shopdata = res;
							if (shopdata.verify == 0) {
								shopdata.verify = 2;
								this.$wanlshop.msg('提交成功，平台將於7個工作日内与您聯系');
							}else{
								shopdata.verify = 5;
								this.$wanlshop.msg('修改成功！');
							}
						}
					});
				}else{
					this.$wanlshop.msg(graceChecker.error);
				}
			},
			// 选择圖片
			chooseImg(name) { 
			    uni.chooseImage({
			        sourceType: ["camera", "album"],
			        sizeType: "compressed",
			        count: 1,
			        success: res => {
						this.$api.get({
							url: '/wanlshop/common/uploadData',
							success: updata => {
								this.$api.upload({
									url: updata.uploadurl,
									filePath: res.tempFilePaths[0],
									name: 'file',
									formData: updata.storage == 'local' ? null : updata.multipart,
									success: data => {
										this.shopdata[name] = data.fullurl;
									}
								});
							}
						});
			        }
			    })
			},
			//預覽圖片
			previewImage(key) {
				let urls = [];
				let shopdata = this.shopdata;
				if (shopdata.state == 2) {
					urls = [this.$wanlshop.oss(shopdata.image, 320, 0, 1), this.$wanlshop.oss(shopdata.trademark, 320, 0, 1)];
				}else{
					urls = [this.$wanlshop.oss(shopdata.image, 320, 0, 1)];
				}
				uni.previewImage({
					urls: urls,
					current: urls[key],
					indicator: 'number'
				});
			}
		}
	}
</script>

<style>
	.cu-btn[disabled] {
	    opacity: 1;
	    color: #ffffff;
		background: #fe660059;
	}
	.wanlian.cu-bar.tabbar {
		background-color: transparent;
	}
	.wanlian.cu-bar.tabbar .cu-btn {
		width: calc(100% - 50rpx);
	}
	.wanlian.cu-bar.tabbar .cu-btn.lg {
		font-size: 32rpx;
		height: 86rpx;
	}
	.cu-form-group .title, .cu-form-group uni-input{
		font-size: 28rpx;
	}
	.cu-avatar image{
		width: 64rpx;
		height: 64rpx;
	}
	
</style>
