<template>
	<!-- ok -->
	<view class="wanlpage-likes wanl-product col-2-20" :style="[pageData.style]">
		<wanl-product :dataList="data"/>
		<uni-load-more :status="status" :content-text="contentText" />
	</view>
</template>
<script>
	export default {
		name: "WanlPageLikes",
		props: {
			pageData: {
				type: Object,
				default: function() {
					return {
						name: 'あなたはそれが好きだと思います',
						type: 'likes',
						params: [],
						style: [],
						data: []
					}
				}
			}
		},
		data() {
			return {
				data: [],
				headerOpacity: 0,
				// 上拉刷新
				reload: true,
				likeData: [],
				current_page: 1, //当前頁碼
				last_page: 1, //总頁碼
				status: 'loading',
				contentText: {
					contentdown: ' ',
					contentrefresh: '読み込み中...',
					contentnomore: 'これ以上のデータはありません'
				}
			};
		},
		created() {
			this.loadData()
		},
		mounted() {
		        var that=this;
		        uni.$on('onReachBottom', function(data) {
		            console.log('onReachBottom');
		            //判断是否最後一頁
		            if (that.current_page >= that.last_page) {
		            	that.status = 'noMore';
		            } else {
		            	that.reload = false;
		            	that.current_page = that.current_page + 1; //頁碼+1
		            	that.status = 'loading';
		            	that.loadData();
		            }
		        });
		},
		onReachBottom() {
			
		},
		methods: {
			async loadData() {
				this.$api.get({
					url: '/wanlshop/product/likes?pages=index',
					data: {
						page: this.current_page
					},
					success: res => {
						//this.data = res;
						this.data = this.reload ? res.data : this.data.concat(res.data); //評論數據 追加
						this.current_page = res.current_page; //当前頁碼
						this.last_page = res.last_page; //总頁碼
						this.status = 'more';
					}
				});
			}
		}
	}
</script>
<style>
</style>
