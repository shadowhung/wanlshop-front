<template>
	<view class="wanl-list">
		<!-- 導航條 -->
		<view class="cu-custom" :style="{height: wanlsys.height + 'px' }">
			<view class="cu-bar bg-bgcolor fixed" :style="{ height: wanlsys.height + 'px', paddingTop: wanlsys.top + 'px'}">
				<view class="action" @tap="$wanlshop.back(1)">
					<text class="wlIcon-fanhui1"></text>
				</view>
				<view class="search-form round" @tap="search()">
					<text class="wlIcon-sousuo1 text-bold"></text> 
					<view class="searchinfo cu-tag round" v-if="category">
						<text>カテゴリー:{{ category }}</text>
						<text class="wlIcon-shanchu2"></text>
					</view>
					<view class="searchinfo cu-tag round text-df" v-else-if="params.search">
						<text>{{ params.search }}</text>
						<text class="wlIcon-shanchu2"></text>
					</view>
					<view v-else>探す</view>
				</view>
				<view class="action" @tap="editListstyle()">
					<text class="wlIcon-listing-jf" v-if="liststyle == 'col-2-20'"></text>
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
					<view class="item" @tap="showDrawer()">
						フィルタ
						<text class="wlIcon-shaixuan margin-left-xs "></text>
					</view>
				</view>
			</view>
		</view>
		<!-- 主体 -->
		<block v-if="goodsData.length == 0">
			<wanl-empty :text="empty"/>
			<wanl-divider width="60%">あなたはそれが好きだと思います</wanl-divider>
			<wanl-product :dataList="likeData"/>
		</block>
		<block v-else>
			<wanl-product :dataList="goodsData" :dataStyle="liststyle" />
		</block>
		<uni-drawer :visible="showRight" mode="right" @close="closeDrawer">
			<view class="drawer">
				<scroll-view scroll-y="true" class="scroll" :style="{ height: height + 'px' }">
					<view class="item solid-bottom" v-if="drawerData.brand.length > 0">
						<view class="title">ブランド</view>
						<view class="list">
							<text v-for="(bd, index) in drawerData.brand" :key="bd.id" :class="{ active: bd.choice }" data-key="brand" :data-attribute="index" @tap="onDraver">
								{{ bd.name }}
							</text>
						</view>
					</view>
					<view class="item solid-bottom">
						<view class="title">価格帯</view>
						<view class="from">
							<input type="number" placeholder="最低価格" v-model="drawerData.price.low" value="" />
							<text class="">—</text>
							<input type="number" placeholder="最高価格" v-model="drawerData.price.high" value="" />
						</view>
					</view>
					<view class="item solid-bottom">
						<view class="title" data-key="city" @tap="onDraverTitle">
							<text>納入場所</text>
							<text :class="[drawerType.city ? 'wlIcon-fanhui3' : 'wlIcon-fanhui4']"></text>
						</view>
						<view class="list">
							<text class="wlIcon-weizhi" data-key="sameCity" :class="{ active: drawerData.sameCity.choice }" :data-data="drawerData.sameCity.name" @tap="onDraver">
								{{ drawerData.sameCity.name }}
							</text>
						</view>
						<view class="title" v-if="drawerType.city"><text>市</text></view>
						<view class="list" v-if="drawerType.city">
							<text v-for="(cy, index) in drawerData.city" :key="cy.name" :class="{ active: cy.choice }" data-key="city" :data-attribute="index" @tap="onDraver">
								{{ cy.name }}
							</text>
						</view>
					</view>
					<block v-if="drawerData.attribute.length > 0" v-for="(att, index) in drawerData.attribute" :key="att.name">
						<view class="item solid-bottom">
							<view class="title" :data-key="index" @tap="onDraverTitle">
								<text>{{ att.name }}</text>
								<text :class="[drawerData.attribute[index].fold ? 'wlIcon-fanhui3' : 'wlIcon-fanhui4']"></text>
							</view>
							<view class="list" v-if="drawerData.attribute[index].fold">
								<text v-for="(val, key) in att.value" :key="val.name" :data-key="key" :data-attribute="index" :class="{ active: val.choice }" @tap="onDraver">
									{{ val.name }}
								</text>
							</view>
						</view>
					</block>
				</scroll-view>
				<view class="footer">
					<view>
						<button class="cu-btn bg-gradual-yellow round-left" @tap="onDrawerReset">リセット</button>
						<button class="cu-btn bg-gradual-orange round-right" @tap="onDrawerTo">決定する</button>
					</view>
				</view>
			</view>
		</uni-drawer>
		<uni-load-more :status="status" :content-text="contentText" />
		<view class="edgeInsetBottom"></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			wanlsys: this.$wanlshop.wanlsys(),
			height: this.$wanlshop.wanlsys().windowHeight,
			WanlScroll: 0, //記錄頁面滚動
			scrollStype: false, //滚動状态
			filterIndex: 0, //
			priceOrder: 0, //1 價格从低到高 2價格从高到低
			liststyle: 'col-2-20', //列表样式
			goodsData: [], //商品列表數據
			showRight: false,
			category: '',
			empty: '製品が見つかりませんでした',
			params: {
				search: '',
				sort: 'weigh',
				order: 'asc',
				page: 1,
				filter: {},
				op: {}
			},
			likeData: [],
			drawerType: {
				attribute: false,
				first: false,
				city: false
			},
			drawerData: {
				price: {
					low: '',
					high: ''
				},
				brand: [],
				attribute: [],
				sameCity: {
					name: ' ポジショニング..',
					choice: false
				},
				city: [
					{ name:"北海道", choice: false },
					{ name:"青森県", choice: false },
					{ name:"岩手県", choice: false },
					{ name:"宮城県", choice: false },
					{ name:"秋田県", choice: false },
					{ name:"山形県", choice: false },
					{ name:"福島県", choice: false },
					{ name:"茨城県", choice: false },
					{ name:"栃木県", choice: false },
					{ name:"群馬県", choice: false },
					{ name:"埼玉県", choice: false },
					{ name:"千葉県", choice: false },
					{ name:"東京都", choice: false },
					{ name:"神奈川県", choice: false },
					{ name:"新潟県", choice: false },
					{ name:"富山県", choice: false },
					{ name:"石川県", choice: false },
					{ name:"福井県", choice: false },
					{ name:"山梨県", choice: false },
					{ name:"長野県", choice: false },
					{ name:"岐阜県", choice: false },
					{ name:"静岡県", choice: false },
					{ name:"愛知県", choice: false },
					{ name:"三重県", choice: false },
					{ name:"滋賀県", choice: false },
					{ name:"京都府", choice: false },
					{ name:"大阪府", choice: false },
					{ name:"兵庫県", choice: false },
					{ name:"奈良県", choice: false },
					{ name:"和歌山県", choice: false },
					{ name:"鳥取県", choice: false },
					{ name:"島根県", choice: false },
					{ name:"岡山県", choice: false },
					{ name:"広島県", choice: false },
					{ name:"山口県", choice: false },
					{ name:"徳島県", choice: false },
					{ name:"香川県", choice: false },
					{ name:"愛媛県", choice: false },
					{ name:"高知県", choice: false },
					{ name:"福岡県", choice: false },
					{ name:"佐賀県", choice: false },
					{ name:"長崎県", choice: false },
					{ name:"熊本県", choice: false },
					{ name:"大分県", choice: false },
					{ name:"宮崎県", choice: false },
					{ name:"鹿児島県", choice: false },
					{ name:"沖縄県", choice: false },
					{ name: "海外", choice: false }
				]
			},
			drawerParams: {},
			reload: false, //判断是否上拉
			last_page: 0,
			status: 'loading',
			contentText: {
				contentdown: '',
				contentrefresh: '読み込み中..',
				contentnomore: 'これ以上のデータはありません'
			}
		};
	},
	onLoad(option) {
		if (option.search) {
			//如果搜索存在
			this.params.search = option.search;
			this.drawerParams.search = option.search;
		} else if (option.data) {
			var data = JSON.parse(option.data);
			this.drawerParams.category_id = data.category_id;
			this.category = data.category_name;
			this.params.filter.category_id = data.category_id;
			this.params.op.category_id = 'in';
		} else {
			console.log('デバッグモード');
		}
		// 加載位置，後续版本開啟加載写入全局
		uni.getLocation({
			type: 'wgs84',
			geocode: true,
			success: mres=> {
				uni.request({
				    url: 'https://restapi.amap.com/v3/geocode/regeo',
				    data: {
						key: this.$wanlshop.config('amapkey'),
						location: mres.longitude+','+mres.latitude
				    },
				    success: res=> {
						if(res.statusCode == 200){
							// console.log(res);
							let address = res.data.regeocode.addressComponent;
							this.drawerData.sameCity.name = address.province;
						}
				    }
				});
			}
		});
		this.loadData();
		if (this.goodsData.length == 0) {
			this.loadlikeData();
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
	// 监听返回
	onUnload() {
		if (this.showRight) {
			this.closeDrawer();
			return true;
		}
	},
	methods: {
		//异步加載商品列表
		async loadData() {
			this.$api.get({
				url: '/wanlshop/product/lists',
				data: this.params,
				success: res => {
					uni.stopPullDownRefresh();
					this.status = 'more';
					this.goodsData = this.reload ? res.data : this.goodsData.concat(res.data); //數據 追加
					if(res.data.length == 0){
						this.empty = `で見つかりません“${this.category}${this.params.search}"関連製品`;
					}
					this.params.page = res.current_page; //当前頁碼
					this.last_page = res.last_page; //总頁碼
				}
			});
		},
		// 滚動底部加載猜妳喜歡
		async loadlikeData() {
			this.$api.get({
				url: '/wanlshop/product/likes?pages=cart',
				success: res => {
					this.likeData = res.data; //評論數據 追加
				}
			});
		},
		// 加載侧边栏數據
		loadDrawer() {
			this.$api.get({
				url: '/wanlshop/product/drawer',
				data: this.drawerParams,
				success: res => {
					var brand = [],
						attribute = [];
					res.brand.forEach(item => {
						var brandData = {
							id: item.id,
							name: item.name,
							fold: false, // 展開
							choice: false
						};
						brand.push(brandData);
					});
					res.attribute.forEach(item => {
						var value = [];
						item.value.forEach(vo => {
							var valueData = {
								name: vo.name,
								choice: false
							};
							value.push(valueData);
						});
						var attributeData = {
							name: item.name,
							value: value,
							fold: false
						};
						attribute.push(attributeData);
					});
					this.drawerData.brand = brand;
					this.drawerData.attribute = attribute;
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
				this.params.order = 'desc';
			}
			if (index === 1) {
				this.params.sort = 'sales';
				this.params.order = 'desc';
			}
			if (index === 2) {
				this.params.sort = 'createtime';
				this.params.order = 'desc';
			}
			if (index === 3 && this.priceOrder === 1) {
				this.params.sort = 'price';
				this.params.order = 'desc';
			}
			if (index === 3 && this.priceOrder === 2) {
				this.params.sort = 'price';
				this.params.order = 'asc';
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
		// 打開抽屉，並且加載品牌和類目属性
		showDrawer() {
			this.showRight = true;
			if (!this.drawerType.first) {
				this.loadDrawer();
				this.drawerType.first = true;
			}
		},
		// 点击抽屉
		onDraver(e) {
			var index = e.currentTarget.dataset.attribute,
				key = e.currentTarget.dataset.key;
			if (key == 'brand' || key == 'city') {
				// 取消所有选项,选中下面
				this.drawerData[key].forEach((item, keys) => {
					keys != index ? (item.choice = false) : '';
				});
				// 取消同城
				this.drawerData.sameCity.choice = false;
				this.drawerData[key][index].choice = !this.drawerData[key][index].choice;
			} else if (key == 'sameCity') {
				// 取消所有城市选项
				this.drawerData.city.forEach(item => {
					item.choice = false;
				});
				this.drawerData.sameCity.choice = !this.drawerData.sameCity.choice;
			} else {
				// 取消所有选项,选中下面
				this.drawerData.attribute[index].value.forEach((item, keys) => {
					keys != key ? (item.choice = false) : '';
				});
				this.drawerData.attribute[index].value[key].choice = !this.drawerData.attribute[index].value[key].choice;
			}
		},
		// 提交抽屉
		onDrawerTo() {
			// 查询價格
			if (this.drawerData.price.low != '' && this.drawerData.price.high != '') {
				this.params.filter.price = this.drawerData.price.low + ',' + this.drawerData.price.high;
				this.params.op.price = 'BETWEEN';
			} else {
				delete this.params.filter.price;
				delete this.params.op.price;
			}
			// 查询地址
			var cityData = '';
			this.drawerData.city.forEach(item => {
				if (item.choice) {
					cityData = item.name;
				}
			});
			if (cityData) {
				this.params.filter['shop.city'] = '%' + cityData + '%';
				this.params.op['shop.city'] = 'LIKE';
			} else if (this.drawerData.sameCity.choice) {
				this.params.filter['shop.city'] = this.drawerData.sameCity.name;
				this.params.op['shop.city'] = 'LIKE';
			} else {
				delete this.params.filter['shop.city'];
				delete this.params.op['shop.city'];
			}
			// 查询品牌
			var brandData = '';
			this.drawerData.brand.forEach(item => {
				if (item.choice) {
					brandData = item.id;
				}
			});
			if (brandData) {
				this.params.filter.brand_id = brandData;
				this.params.op.brand_id = '=';
			} else {
				delete this.params.filter.brand_id;
				delete this.params.op.brand_id;
			}
			// 查询属性
			var attributeData = [];
			this.drawerData.attribute.forEach((item, index) => {
				// item.name
				item.value.forEach((vo, index) => {
					if (vo.choice) {
						attributeData.push('%' + vo.name + '%');
					}
				});
			});
			if (attributeData) {
				this.params.filter.category_attribute = attributeData.join(',');
				this.params.op.category_attribute = 'LIKE';
			} else {
				delete this.params.filter.category_attribute;
				delete this.params.op.category_attribute;
			}
			this.status = 'loading';
			this.loadData();
			this.closeDrawer();
		},
		// 重置抽屉
		onDrawerReset() {
			this.drawerData.city.forEach(item => {
				item.choice = false;
			});
			this.drawerData.sameCity.choice = false;
			this.loadDrawer();
		},
		// 点击抽屉标题
		onDraverTitle(e) {
			var stype = e.currentTarget.dataset.key;
			if (stype === 'city') {
				this.drawerType[stype] = !this.drawerType[stype];
			} else {
				this.drawerData.attribute[stype].fold = !this.drawerData.attribute[stype].fold;
			}
		},
		// 關閉抽屉
		closeDrawer() {
			this.showRight = false;
		},
		search() {
			this.$wanlshop.to('/pages/product/search','fade-in',100);
		},
		editListstyle() {
			this.liststyle = this.liststyle == 'col-1-10'?'col-2-20':'col-1-10';
		}
	}
};
</script>

<style>
	.cu-custom .search-form{
		border: 3rpx solid #fe6600;
		background-color: #fff;
	}
	.cu-bar .action:first-child>text[class*="wlIcon-"] {
	    margin-left: 0em;
	    margin-right: -0.1em;
	}
	.cu-tag:not([class*="bg"]):not([class*="line"]){
		background-color: #f7f7f7;
	}
</style>
