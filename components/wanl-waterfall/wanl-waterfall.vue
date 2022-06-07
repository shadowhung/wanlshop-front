
<template>
	<view class="wanl-waterfall">
		<view id="wanl-left-cloumn" class="wanl-cloumn">
			<slot name="left" :leftList="leftList"></slot>
		</view>
		<view id="wanl-right-cloumn" class="wanl-cloumn">
			<slot name="right" :rightList="rightList"></slot>
		</view>
	</view>
</template>

<script>
	/**
	 * waterfall 瀑布流
	 * @description 这是一個瀑布流形式的組件，內容分為左右两列，结合uView的懒加載組件效果更佳。相较於某些只是奇偶數左右分别，或者没有利用vue作用域插槽的做法，uView的瀑布流实現了真正的 組件化，搭配LazyLoad 懒加載和loadMore 加載更多組件，让您開箱即用，眼前一亮。
	 * @by https://www.uviewui.com/components/waterfall.html
	 * @property {Array} flow-list 用於渲染的數據
	 * @property {String Number} add-time 單條數據添加到队列的时間間隔，單位ms，见上方註意事项说明（默認200）
	 * @example <wanl-waterfall :flowList="flowList"></wanl-waterfall>
	 */
	export default {
		name: "wanlWaterfall",
		props: {
			flowList: {
				// 瀑布流數據
				type: Array,
				required: true,
				default: function() {
					return [];
				}
			},
			// 每次向结构插入數據的时間間隔，間隔越长，越能保證两列高度相近，但是對用戶体驗越不好
			// 單位ms
			addTime: {
				type: [Number, String],
				default: 20
			}
		},
		
		data() {
			return {
				leftList: [],
				rightList: [],
				tempList: [],
				children: []
			}
		},
		watch: {
			copyFlowList(nVal, oVal) {
				// 取差值，即这一次數組变化新增的部分
				let startIndex = Array.isArray(oVal) && oVal.length > 0 ? oVal.length : 0;
				if (nVal.slice(startIndex).length == 0) {
					this.leftList = [];
					this.rightList = [];
					this.tempList = this.cloneData(this.copyFlowList);
				}else{
					this.tempList = this.tempList.concat(this.cloneData(nVal.slice(startIndex)));
				}
				this.splitData();
			},
		},
		mounted() {
			this.tempList = this.cloneData(this.copyFlowList);
			this.splitData();
		},
		computed: {
			// 破坏flowList变量的引用，否则watch的结果新旧值是一样的
			copyFlowList() {
				return this.cloneData(this.flowList);
			}
		},
		methods: {
			async splitData() {
				if (!this.tempList.length) return;
				let rightRect = await this.getRect('#wanl-right-cloumn');
				let leftRect = await this.getRect('#wanl-left-cloumn');
				// 如果左边小於或等於右边，就添加到左边，否则添加到右边
				let item = this.tempList[0];
				if(!item) return ;
				item.image = this.$wanlshop.oss(item.image, 172, 0, 1);
				item.comment = this.$wanlshop.toFormat(item.comment, 'hundred');
				item.praise = item.comment > 0 ? parseInt((item.praise / item.comment) * 100) : 0;
				if (leftRect.height < rightRect.height) {
					this.leftList.push(item);
				} else if (leftRect.height > rightRect.height) {
					this.rightList.push(item);
				} else {
					// 这里是為了保證第一和第二张添加时，左右都能有內容
					// 因為添加第一张，实际队列的高度可能还是0，这时需要根據队列元素长度判断下一個该放哪边
					if (this.leftList.length <= this.rightList.length) {
						this.leftList.push(item);
					} else {
						this.rightList.push(item);
					}
				}
				// 移除临时列表的第一项
				this.tempList.splice(0, 1);
				// 如果临时數組还有數據，继续循环
				if (this.tempList.length) {
					setTimeout(() => {
						this.splitData();
					}, this.addTime)
				}
			},
			// 複製而不是引用對象和數組
			cloneData(data) {
				return JSON.parse(JSON.stringify(data));
			},
			getRect(selector, all) {
				return new Promise(resolve => {
					let query = null;
					// 支付宝小程序不能加後面的.in(this)，是它自身的限製
					// #ifndef MP-ALIPAY
					query = uni.createSelectorQuery().in(this)
					// #endif
					// #ifdef MP-ALIPAY
					query = uni.createSelectorQuery()
					// #endif
					query[all ? 'selectAll' : 'select'](selector)
						.boundingClientRect(rect => {
							if (all && Array.isArray(rect) && rect.length) {
								resolve(rect)
							}
							if (!all && rect) {
								resolve(rect)
							}
						})
						.exec()
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.wanl-waterfall {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
	}
	.wanl-cloumn {
		display: flex;
		flex: 1;
		flex-direction: column;
		height: auto;
		width: 50%;
	}
	.wanl-image {
		width: 100%;
	}
</style>
