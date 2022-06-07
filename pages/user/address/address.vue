<!-- 2020年2月15日14:57:57 実施する -->
<template>
	<view>
		<view class="edgeInsetTop"></view>
		<view class="margin-top-bj">
			<view class="cu-list menu-avatar">
				<view class="cu-item" :class="modalName == 'move-box-' + index ? 'move-cur' : ''" v-if="addressList" v-for="(item, index) in addressList" :key="item.id" @tap="checkAddress(item)" @touchstart="ListTouchStart" @touchmove="ListTouchMove" @touchend="ListTouchEnd" :data-target="'move-box-' + index" >
					<view class="cu-avatar round lg" style="background-color: #fe6600;">{{ item.name.substring(0, 1) }}</view>
					<view class="content">
						<view>
							<text class="wanl-pip margin-right-sm text-lg">{{ item.name }}</text>
							<text class="wanl-gray-light text-sm">{{ item.mobile }}</text>
						</view>
						<view class="text-sm wanl-pip text-cut-2" style="line-height: 1.3;">
							<text class="wlIcon-dizhi text-red margin-right-xs" v-if="item.default == 1"></text>
							{{ item.province }} {{ item.city }}  {{ item.district }}  {{ item.address }}
						</view>
					</view>
					<view class="action" @tap.stop="addAddress('edit', item)"><text class="wlIcon-xiugaioryijian text-xl"></text></view>
					<view class="move">
						<view class="bg-grey" @tap.stop="addAddress('edit', item)">編集</view>
						<view class="bg-red" @tap.stop="delAddress(item.id, index)">削除</view>
					</view>
				</view>
				<wanl-empty text="アドレスが見つかりません" src="address_default3x" v-else/>
			</view>
		</view>
		
		
		<view v-if="addressList.length == 0">
			<wanl-empty text="アドレスはまだ追加されていません"/>
		</view>
		
		<uni-load-more :status="status" :content-text="contentText" />
		<view class="edgeInsetBottom"></view>
		<view class="wanlian cu-bar tabbar foot flex flex-direction"><button @tap="addAddress('add')" class="cu-btn wanl-bg-orange lg">+ 配送先住所を追加する</button></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			source: 0,
			order_id: 0,
			addressList: [],
			modalName: null,
			listTouchStart: 0,
			listTouchDirection: null,
			//上拉下拉
			total: 0, //數據量
			current_page: 1, //当前頁碼
			last_page: 1 ,//总頁碼
			status: 'loading',
			contentText: {
				contentdown: ' ',
				contentrefresh: '読み込み中..',
				contentnomore: ''
			}
		};
	},
	// 监听下拉刷新
	onPullDownRefresh() {
		this.current_page = 1;
		this.reload = true;
		this.loadData();
	},
	// 监听上拉加載
	onReachBottom() {
		//判断是否最後一頁
		if(this.current_page >= this.last_page){
			this.status = 'noMore';
		}else{
			this.current_page = this.current_page + 1; //頁碼+1
			this.status = 'loading';
			this.loadData(true);
		}
	},
	onLoad(option) {
		this.source = option.source;
		this.order_id = option.order_id;
		this.loadData();
	},
	methods: {
		async loadData(reload, refresh) {
			this.$api.get({
				url: '/wanlshop/address/getaddress',
				loadingTip: refresh?'更新リスト...':'',
				data:{
					page: reload?(this.current_page):1
				},
				success: res => {
					if(reload){
						this.addressList = this.addressList.concat(res.data);
					}else{
						this.addressList = res.data;
						uni.stopPullDownRefresh();
					}
					this.total = res.total; //數據量
					this.current_page = res.current_page; //当前頁碼
					this.last_page = res.last_page; //总頁碼
					this.status = res.total == 0 ? 'noMore':'more';
				}
			});
		},
		// 削除
		async delAddress(id, key) {
			this.$delete(this.addressList, key); //vue方法
			this.$api.post({
				url: '/wanlshop/address/deladdress',
				data: { id: id }
			});
		},
		//添加或修改成功之後回调
		async refreshList(data, type) {
			this.$api.post({
				url: '/wanlshop/address/address',
				data: {data: data,type: type},
				success: (res) => {
					this.loadData(false,true);
				}
			});
		},
		//选择地址
		checkAddress(item) {
			if (this.source == 1) {
				this.$wanlshop.prePage().addressData = item;
				this.$wanlshop.back(1);
			}else if(this.source == 2){ //我的訂單修改地址  地址ID   返回訂單ID
				this.$wanlshop.prePage().refreshList(item.id, this.order_id);
				this.$wanlshop.back(1);
			}
		},
		// 新增地址
		addAddress(type, item) {
			this.$wanlshop.to(`/pages/user/address/addressManage?type=${type}&data=${JSON.stringify(item)}`);
		},
		// ListTouch触摸開始
		ListTouchStart(e) {
			this.listTouchStart = e.touches[0].pageX;
		},
		// ListTouch計算方向
		ListTouchMove(e) {
			this.listTouchDirection = e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left';
		},
		// ListTouch計算滚動
		ListTouchEnd(e) {
			if (this.listTouchDirection == 'left') {
				this.modalName = e.currentTarget.dataset.target;
			} else {
				this.modalName = null;
			}
			this.listTouchDirection = null;
		}
	}
};
</script>

<style>
.cu-avatar.lg {
	width: 90rpx;
	height: 90rpx;
	font-size: 1.5em;
}
.cu-list.menu-avatar>.cu-item{
	height: 160rpx;
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


</style>
