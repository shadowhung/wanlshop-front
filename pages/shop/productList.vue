<template>
	<view class="wanl-list">
		
		<!-- 導航條 -->
		<view class="cu-custom" :style="{height: wanlsys.height + 'px' }">
			<view class="cu-bar bg-bgcolor fixed" :style="{ height: wanlsys.height + 'px', paddingTop: wanlsys.top + 'px'}">
				<view class="action" @tap="$wanlshop.back(1)">
					<text class="wlIcon-fanhui1"></text>
				</view>
				<view class="search-form round">
					<text class="wlIcon-sousuo1 text-bold"></text> 
					<input @confirm="confirm" :adjust-position="false" type="text" :placeholder="category" confirm-type="search"></input>
				</view>
				<view class="action" @tap="editListstyle()">
					<text class="wlIcon-listing-jf" v-if="liststyle == 'col-2-10'"></text>
					<text class="wlIcon-liebiao" v-else></text>
				</view>
			</view>
		</view>
		
		<view class="head" :class="{ headtop: scrollStype }">
			<view class="cue">
				<view class="bar">
					<view class="item" :class="{ current: filterIndex === 0 }" @tap="tabClick(0)">包括的</view>
					<view class="item" :class="{ current: filterIndex === 1 }" @tap="tabClick(1)">販売</view>
					<view class="item" :class="{ current: filterIndex === 2 }" @tap="tabClick(2)">新しい棚</view>
					<view class="item" :class="{ current: filterIndex === 3 }" @tap="tabClick(3)">
						<text>価格</text>
						<view class="box">
							<text :class="{ active: priceOrder === 1 && filterIndex === 3 }" class="wlIcon-sheng"></text>
							<text :class="{ active: priceOrder === 2 && filterIndex === 3 }" class="wlIcon-jiang"></text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 主体 -->
		<block v-if="goodsData.length == 0 && status == 'more'">
			<wanl-empty :text="empty"/>
		</block>
		<block v-else>
			<wanl-product :dataList="goodsData" :dataStyle="liststyle"/>
		</block>
		
		
		
		
		<uni-load-more :status="status" :content-text="contentText" />
		<view class="edgeInsetBottom"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				shop_id: 0,
				wanlsys: this.$wanlshop.wanlsys(),
				empty: '',
				WanlScroll: 0, //記錄頁面滚動
				scrollStype: false, //滚動状态
				filterIndex: 0, //
				priceOrder: 0, //1 價格从低到高 2價格从高到低
				liststyle: 'col-2-10', //列表样式
				goodsData: [], //商品列表數據
				category: '',
				params: {
					search: '',
					sort: 'weigh',
					order: 'asc',
					page: 1,
					filter: {},
					op: {}
				},
				reload: false, //判断是否上拉
				last_page: 0,
				status: 'loading',
				contentText: {
					contentdown: '',
					contentrefresh: '読み込み中..',
					contentnomore: ''
				}
			};
		},
		onLoad(option) {
			this.shop_id = option.shop_id;
			if(option.category_id){
				this.params.filter.shop_category_id = option.category_id;
				this.params.op.shop_category_id = 'FIND_IN_SET'; //1.0.2升级
				if(option.category_name){
					this.category = '当前店铺類目:' + option.category_name;
				}else{
					this.category = '搜索店铺商品';
				}
				this.loadData();
				if (this.goodsData.length == 0) {
					this.empty = '沒有査詢到“'+this.category+'”的相關商品，以下為您推薦猜妳喜歡的商品~';
				}
			}else{
				this.params.filter.shop_id = option.shop_id;
				this.params.op.shop_id = 'in';
				this.category = '搜尋店鋪商品';
				this.status = 'more';
				this.loadData();
				if (this.goodsData.length == 0) {
					this.empty = '暫時沒有在店鋪內找到任何產品，請搜尋査詢~';
				}
			}
		},
		// 监听上拉
		onPullDownRefresh() {
			this.params.page  = 1;
			this.reload = true;
			this.loadData();
		},
		// 下拉刷新
		onReachBottom() {
			if (this.params.page >= this.last_page) {
				this.status = 'noMore';
			} else {
				this.reload = false;
				this.contentText.contentdown = '引き上げて詳細を表示';
				this.params.page = this.params.page + 1; //頁碼+1
				this.status = 'loading';
				this.loadData();
			}
		},
		// 监听滚動
		onPageScroll(object) {
			if (object.scrollTop > this.WanlScroll) {
				this.scrollStype = false;
			} else {
				this.scrollStype = true;
			}
			if (object.scrollTop < 0) {
				this.scrollStype = false;
			}
			this.WanlScroll = object.scrollTop;
		},
		methods: {
			//异步加載商品列表
			async loadData() {
				this.$api.get({
					url: '/wanlshop/product/lists',
					data: this.params,
					success: res => {
						uni.stopPullDownRefresh(); // 後來統一补充，尚不知道是否有效在此处
						this.status = res.total == 0 ? 'noMore':'more';
						this.goodsData = this.reload ? res.data : this.goodsData.concat(res.data); //數據 追加
						this.params.page = res.current_page; //当前頁碼
						this.last_page = res.last_page; //总頁碼
					}
				});
			},
			//篩選点击
			tabClick(index) {
				if (this.filterIndex === index && index !== 3) {
					return;
				}
				this.filterIndex = index;
				if (index === 3) {
					this.priceOrder = this.priceOrder === 1 ? 2 : 1;
				} else {
					this.priceOrder = 0;
				}
	
				// 排序方式
				if (index === 0) {
					this.params.sort = 'weigh';
					this.params.order = 'asc';
				}
				if (index === 1) {
					this.params.sort = 'sales';
					this.params.order = 'asc';
				}
				if (index === 2) {
					this.params.sort = 'createtime';
					this.params.order = 'asc';
				}
				if (index === 3 && this.priceOrder === 1) {
					this.params.sort = 'price';
					this.params.order = 'asc';
				}
				if (index === 3 && this.priceOrder === 2) {
					this.params.sort = 'price';
					this.params.order = 'desc';
				}
				this.status = 'loading';
				this.params.page = 1;
				this.reload = true;
				this.loadData();
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				});
			},
			editListstyle() {
				if (this.liststyle == 'col-1-10') {
					this.liststyle = 'col-2-10';
				} else {
					this.liststyle = 'col-1-10';
				}
			},
			confirm(event){
				this.category = event.detail.value;
				this.params.search = event.detail.value;
				this.params.filter = { shop_id: this.shop_id };
				this.params.op = { shop_id: '='};
				this.reload = true;
				this.loadData();
				
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				});
			}
		}
	};
</script>

<style>
	.cu-bar .search-form{
		background-color: #ebebeb;
	}
</style>
