 /**
  * A Request useing App network request design {@link http://www.shop.com}
  * @author SHOP <kefu@shop.com> < 多用户商城>
  * @2019年9月10日12:52:20
  * @version 1.0.1
  * 
  **/
class wanlfun {
	
	/**
	 * 保存聊天記錄
	 * @author SHOP <www.shop.com>
	 */
	setChat(data,send) {
		let uid = send == 'send' ? data.to_id : data.form.id;
		uni.getStorage({
		    key: 'wanlchat:message_' + uid,
		    success: function (res) {
				// 储存所有消息
				// let arr = res.data;
				// 優化,只储存 100條數據,超過100條,通過接口獲取曆史記錄
				let arr = res.data.slice(-96);
				arr.push(data);
				uni.setStorageSync('wanlchat:message_' + uid, arr);
		    },
			fail: function (res) {
				uni.setStorageSync('wanlchat:message_' + uid, [data]);
		    }
		});
		// 返回原始數據
		return data;
	}
	
	/**
	 * 加法精度計算
	 * @author SHOP <www.shop.com>
	 * 
	 * @param {Object} number 數字
	 */
	bcadd(a, b){
	    var c, d, e;
	    try {
	        c = a.toString().split(".")[1].length
	    } catch(f) {
	        c = 0
	    }
	    try {
	        d = b.toString().split(".")[1].length
	    } catch(f) {
	        d = 0
	    }
	    return e = Math.pow(10, Math.max(c, d)),(this.bcmul(a, e) + this.bcmul(b, e)) / e
	}
	
	/**
	 * 减法精度計算
	 * @author SHOP <www.shop.com>
	 * 
	 * @param {Object} number 數字
	 */
	bcsub(a, b){
	    var c, d, e;
	    try {
	        c = a.toString().split(".")[1].length
	    } catch(f) {
	        c = 0
	    }
	    try {
	        d = b.toString().split(".")[1].length
	    } catch(f) {
	        d = 0
	    }
	    return e = Math.pow(10, Math.max(c, d)),(this.bcmul(a, e) - this.bcmul(b, e)) / e
	}
	
	/**
	 * 乘法精度計算
	 * @author SHOP <www.shop.com>
	 * 
	 * @param {Object} number 數字
	 */
	bcmul(a, b){
	    var c = 0,
	    d = a.toString(),
	    e = b.toString();
	    try {
	        c += d.split(".")[1].length
	    } catch(f) {}
	    try {
	        c += e.split(".")[1].length
	    } catch(f) {}
	    return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c)
	}
	
	/**
	 * 除法精度計算
	 * @author SHOP <www.shop.com>
	 * 
	 * @param {Object} number 數字
	 */
	bcdiv(a, b){
	    var c, d, e = 0,
	    f = 0;
	    try {
	        e = a.toString().split(".")[1].length
	    } catch(g) {}
	    try {
	        f = b.toString().split(".")[1].length
	    } catch(g) {}
	    return c = Number(a.toString().replace(".", "")),d = Number(b.toString().replace(".", "")),this.bcmul(c / d, Math.pow(10, f - e))
	}
}
export default new wanlfun();
