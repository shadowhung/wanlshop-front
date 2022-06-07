<template>
	<view class="uni-popup-dialog">
		<view class="uni-dialog-title">
			<text class="uni-dialog-title-text" :class="['uni-popup__'+dialogType]">{{title}}</text>
		</view>
		<view class="uni-dialog-content">
			<text class="uni-dialog-content-text" v-if="mode === 'base'">{{content}}</text>
			<input v-else class="uni-dialog-input" v-model="val" type="number" maxlength="6" :placeholder="placeholder" :focus="focus" >
		</view>
		<view class="uni-dialog-button-group">
			<view class="uni-dialog-button" @click="close">
				<text class="uni-dialog-button-text">キャンセル</text>
			</view>
			<view class="uni-dialog-button uni-border-left" @click="onOk">
				<text class="uni-dialog-button-text uni-button-color">決定する</text>
			</view>
		</view>

	</view>
</template>

<script>
	/**
	 * PopUp 彈出層-對話框樣式
	 * @description 彈出層-對話框樣式
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=329
	 * @property {String} value input 模式下的默認值
	 * @property {String} placeholder input 模式下輸入提示
	 * @property {String} type = [success|warning|info|error] 主題樣式
	 *  @value success 成功
	 * 	@value warning 促す
	 * 	@value info 消息
	 * 	@value error 錯誤
	 * @property {String} mode = [base|input] 模式、
	 * 	@value base 基礎對話框
	 * 	@value input 可輸入對話框
	 * @property {String} content 對話框內容
	 * @property {Boolean} beforeClose 是否攔截取消事件
	 * @event {Function} confirm 點擊確認按鈕觸發
	 * @event {Function} close 點擊取消按鈕觸發
	 */

	export default {
		name: "uniPopupDialog",
		props: {
			value: {
				type: [String, Number],
				default: ''
			},
			placeholder: {
				type: [String, Number],
				default: 'コンテンツを入力してください'
			},
			/**
			 * 對話框主題 success/warning/info/error	  默認 success
			 */
			type: {
				type: String,
				default: 'error'
			},
			/**
			 * 對話框模式 base/input
			 */
			mode: {
				type: String,
				default: 'base'
			},
			/**
			 * 對話框標題
			 */
			title: {
				type: String,
				default: '促す'
			},
			/**
			 * 對話框內容
			 */
			content: {
				type: String,
				default: ''
			},
			/**
			 * 攔截取消事件 ，如果攔截取消事件，必須監聽close事件，執行 done()
			 */
			beforeClose: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				dialogType: 'error',
				focus: false,
				val: ""
			}
		},
		inject: ['popup'],
		watch: {
			type(val) {
				this.dialogType = val
			},
			mode(val) {
				if (val === 'input') {
					this.dialogType = 'info'
				}
			},
			value(val) {
				this.val = val
			}
		},
		created() {
			// 對話框遮罩不可點擊
			this.popup.mkclick = false
			if (this.mode === 'input') {
				this.dialogType = 'info'
				this.val = this.value
			} else {
				this.dialogType = this.type
			}
		},
		mounted() {
			this.focus = true
		},
		methods: {
			/**
			 * 點擊確認按鈕
			 */
			onOk() {
				this.$emit('confirm', () => {
					this.popup.close()
					if (this.mode === 'input') this.val = this.value
				}, this.mode === 'input' ? this.val : '')
			},
			/**
			 * 點擊取消按鈕
			 */
			close() {
				if (this.beforeClose) {
					this.$emit('close', () => {
						this.popup.close()
					})
					return
				}
				this.popup.close()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.uni-popup-dialog {
		width: 300px;
		border-radius: 15px;
		background-color: #fff;
	}

	.uni-dialog-title {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		padding-top: 15px;
		padding-bottom: 5px;
	}

	.uni-dialog-title-text {
		font-size: 16px;
		font-weight: 500;
	}

	.uni-dialog-content {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 5px 15px 15px 15px;
	}

	.uni-dialog-content-text {
		font-size: 14px;
		color: #6e6e6e;
	}

	.uni-dialog-button-group {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		border-top-color: #f5f5f5;
		border-top-style: solid;
		border-top-width: 1px;
	}

	.uni-dialog-button {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */

		flex: 1;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		height: 45px;
	}

	.uni-border-left {
		border-left-color: #f0f0f0;
		border-left-style: solid;
		border-left-width: 1px;
	}

	.uni-dialog-button-text {
		font-size: 14px;
	}

	.uni-button-color {
		color: $uni-color-primary;
	}

	.uni-dialog-input {
		flex: 1;
		font-size: 14px;
	}

	.uni-popup__success {
		color: $uni-color-success;
	}

	.uni-popup__warn {
		color: $uni-color-warning;
	}

	.uni-popup__error {
		color: $uni-color-error;
	}

	.uni-popup__info {
		color: #909399;
	}
</style>
