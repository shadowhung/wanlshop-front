import Vue from 'vue';
import App from './App';
// 中央控製总线
import store from './store';
// 系統配置
import api from './common/request/request';
import wanlshop_function from "./common/wanlshop_function";
import wanlshop_config from './common/config/config';
// 小程序分享的mixin封装
import mpShare from './common/libs/mixin/mpShare';
Vue.mixin(mpShare);

// 挂載
Vue.config.productionTip = false;
Vue.prototype.$api = api; //Request
Vue.prototype.$store = store; //挂載在 Vue 实例上


// 配置請求
api.setConfig({
	baseUrl: wanlshop_config.appurl,
	debug: wanlshop_config.debug
})
// 請求拦截
api.interceptor.request = (config => {
	// 给header添加全局請求參數token
	if (!config.header.token || !config.header.wanlshop) {
		let wanlLogin = uni.getStorageSync("wanlshop:user");
		if (wanlLogin) {
			config.header.token = uni.getStorageSync("wanlshop:user").token;
		}
		// #ifdef APP-PLUS
		config.header.uuid = plus.device.uuid;
		// #endif 
		// 設置語言
		config.header['Accept-Language'] = 'zh-CN,zh;q=0.9';
	}
	// 添加一個自定义的參數，默認异常請求都弹出一個toast提示
	if (config.toastError === undefined) {
		config.toastError = true
	}
	return config;
})

/**
 * 全局的业務拦截
 */
api.interceptor.response = ((res, config) => {
	if (res.code === 1) {
		res.success = true;
	} else if (res.code === 401) { // token失效，需要重新登錄
		to('/pages/user/auth/name');
	}
	wanlshop_config.debug?console.log(res):'';
	return res;
})

/**
 * 全局錯误提示
 * 
 * @statusCode 200 业務錯误
 * @statusCode 401 没有登錄
 * @statusCode 403 没有權限
 * @statusCode 404 找不到文件
 * @statusCode 500 服務器内部錯误
 */
api.interceptor.fail = ((res, config) => {
	var error = '';
	//业務錯误、没有登錄、没有權限
	if (res.statusCode === 200) {
		error = res.data.msg;
	} else if (res.statusCode === 401) {
		error = res.data.msg;
	} else if (res.statusCode === 403) {
		error = res.data.msg;
	} else if (res.statusCode === 404) {
		error = 'APIインターフェースが存在しません';
	} else if (res.statusCode === 500) {
		error = 'APIインターフェイス例外';
	} else {
		error = 'サーバーがビジーです';
	}
	if (res.errMsg == 'request:fail abort statusCode:-1') {
		wanlshop_config.debug?console.log(res) : '';
	}else{
		config.toastError ? msg(error) : '';
	}
	return res;
})

/**
 * 提示信息
 * @author SHOP <www.shop.com>
 * 
 * @param {Object} title 提示标题
 * @param {Object} duration 提示时間
 * @param {Object} mask 遮罩层
 * @param {Object} icon 圖标层
 */
const msg = (title, duration = 1500, mask = false, icon = 'none') => {
	//統一提示方便全局修改
	if (Boolean(title) === false) {
		return;
	}
	uni.showToast({title,duration,mask,icon});
	if (store.state.user.shock) {
		uni.vibrateShort();
	}
}

/**
 * 獲取当前頁面栈
 * 
 * 示例在地址管理，登錄要參考下
 */
const prePage = () => {
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 2];
	// #ifdef H5
	return prePage;
	// #endif
	return prePage.$vm;
}

/**
 * 獲取系統信息
 */
const wanlsys = () => {
	let sys = uni.getSystemInfoSync();
	let data = {
		top: sys.statusBarHeight,
		height: sys.statusBarHeight + uni.upx2px(90),
		screenHeight: sys.screenHeight,
		platform: sys.platform,
		model: sys.model,
		windowHeight: sys.windowHeight,
		windowBottom: sys.windowBottom
	};
	// #ifndef MP
	data.height = sys.statusBarHeight + uni.upx2px(90);
	// #endif
	// #ifdef MP-WEIXIN || MP-BAIDU || MP-QQ || MP-TOUTIAO || MP-WEIXIN
	let custom = uni.getMenuButtonBoundingClientRect();
	data.height = custom.bottom + custom.top - sys.statusBarHeight;
	// #endif		
	// #ifdef MP-ALIPAY
	data.height = sys.statusBarHeight + sys.titleBarHeight;
	// #endif
	wanlshop_config.debug?console.log(data):'';
	return data;
}

/**
 * 修改标题栏
 * 
 * @param {Object} text 新标题
 * @param {Object} barColor 導航栏颜色
 */
const title = (text = '', setbar = {}) => {
	if (text) {
		uni.setNavigationBarTitle({
			title: text
		});
	}
	if (JSON.stringify(setbar) != "{}") {
		uni.setNavigationBarColor(setbar);
	}
}

/**
 * 獲取圖片完整地址
 * 
 * @param {Object} url 提示标题，不需要OSS处理
 */
const appstc = (url) => {
	return wanlshop_config.cdnurl + '/assets/addons/wanlshop/img' + url;
}

/**
 * 數字格式化
 * 
 * @param {Object} number 數字
 * @param {Object} type 類型 thousand:万,hundred:百
 */
const toFormat = (number, type) => {
	//格式千位以上
	if (type == 'thousand') {
		if (number > 9999) {
			number = (number / 10000).toFixed(1) + 'w'
		} else if (number > 999) {
			number = (number / 1000).toFixed(1) + 'k'
		}
	}
	//格式百位
	if (type == 'hundred' && number > 99) {
		number = '99+';
	}
	return number;
}

/**
 * 加法精度計算
 * 
 * @param {Object} number 數字
 */
const bcadd = (a, b) => {
	return wanlshop_function.bcadd(a, b);
}

/**
 * 减法精度計算
 * 
 * @param {Object} number 數字
 */
const bcsub = (a, b) => {
	return wanlshop_function.bcsub(a, b);
}

/**
 * 乘法精度計算
 * 
 * @param {Object} number 數字
 */
const bcmul = (a, b) => {
	return wanlshop_function.bcmul(a, b);
}

/**
 * 除法精度計算
 * 
 * @param {Object} number 數字
 */
const bcdiv = (a, b) => {
    return wanlshop_function.bcdiv(a, b);
};

/**
 * 时間格式化
 * 
 * @param String timestamp 时間戳
 * @param String fmt 返回的时間格式
 * yyyy:mm:dd|yyyy:mm|yyyy年mm月dd日|yyyy年mm月dd日 hh时MM分等,可自定义組合
 */
const timeFormat = (timestamp = null, fmt = 'yyyy-mm-dd') => {
	// 其他更多是格式化有如下:
	// yyyy:mm:dd|yyyy:mm|yyyy年mm月dd日|yyyy年mm月dd日 hh时MM分等,可自定义組合
	timestamp = parseInt(timestamp);
	// 如果為null,则格式化当前时間
	if (!timestamp) timestamp = Number(new Date());
	// 判断用戶輸入的时間戳是秒还是毫秒,一般前端js獲取的时間戳是毫秒(13位),後端傳過來的為秒(10位)
	if (timestamp.toString().length == 10) timestamp *= 1000;
	let date = new Date(timestamp);
	let ret;
	let opt = {
		"y+": date.getFullYear().toString(), // 年
		"m+": (date.getMonth() + 1).toString(), // 月
		"d+": date.getDate().toString(), // 日
		"h+": date.getHours().toString(), // 时
		"M+": date.getMinutes().toString(), // 分
		"s+": date.getSeconds().toString() // 秒
		// 有其他格式化字符需求可以继续添加，必须转化成字符串
	};
	for (let k in opt) {
		ret = new RegExp("(" + k + ")").exec(fmt);
		if (ret) {
			fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
		};
	};
	return fmt;
}


/**
 * 社交时間友好
 * 
 * @param String timestamp 时間戳
 * @param String | Boolean format 如果為时間格式字符串，超出一定时間范围，返回固定的时間格式；
 * 如果為布尔值false，無論什么时間，都返回多久以前的格式
 */
const timeToDate = (timestamp = null, format = 'yyyy-mm-dd') => {
	if (timestamp == null) timestamp = Number(new Date());
	timestamp = parseInt(timestamp);
	// 判断用戶輸入的时間戳是秒还是毫秒,一般前端js獲取的时間戳是毫秒(13位),後端傳過來的為秒(10位)
	if (timestamp.toString().length == 10) timestamp *= 1000;
	var timer = (new Date()).getTime() - timestamp;
	timer = parseInt(timer / 1000);
	// 如果小於5分鐘,则返回"剛剛",其他以此類推
	let tips = '';
	switch (true) {
		case timer < 300:
			tips = 'ただ';
			break;
		case timer >= 300 && timer < 3600:
			tips = parseInt(timer / 60) + '数分前';
			break;
		case timer >= 3600 && timer < 86400:
			tips = parseInt(timer / 3600) + '1時間前';
			break;
		case timer >= 86400 && timer < 2592000:
			tips = parseInt(timer / 86400) + '数日前';
			break;
		default:
			// 如果format為false，则無論什么时間戳，都顯示xx之前
			if(format === false) {
				if(timer >= 2592000 && timer < 365 * 86400) {
					tips = parseInt(timer / (86400 * 30)) + '数か月前';
				} else {
					tips = parseInt(timer / (86400 * 365)) + '数年前';
				}
			} else {
				tips = timeFormat(timestamp, format);
			}
	}
	return tips;
}

/**
 * IM时間友好
 * 
 * @param String timestamp 时間戳
 * @param String | Boolean format 如果為时間格式字符串，超出一定时間范围，返回固定的时間格式；
 * 如果為布尔值false，無論什么时間，都返回多久以前的格式
 */
const timeToChat = (timestamp = null) => {
	if (timestamp == null) timestamp = Number(new Date());
	timestamp = parseInt(timestamp);
	// 判断用戶輸入的时間戳是秒还是毫秒,一般前端js獲取的时間戳是毫秒(13位),後端傳過來的為秒(10位)
	if (timestamp.toString().length == 10) timestamp *= 1000;
	var timer = (new Date()).getTime() - timestamp;
	timer = parseInt(timer / 1000);
	// 如果小於5分鐘,则返回"剛剛",其他以此類推
	let tips = '';
	switch (true) {
		case timer < 86400:
			tips = timeFormat(timestamp, 'hh:MM');
			break;
		case timer >= 86400 && timer < 86400 * 7:
			var now = new Date(timestamp);
			var week = ['日','1','2','3','4','5','6'];
			switch (new Date().getDate() - now.getDate()) {
				case 1:
					tips = timeFormat(timestamp, '昨日 hh:MM');
					break;
				case 2:
					tips = timeFormat(timestamp, '一昨日 hh:MM');
					break;
				default:
					tips = '週間' + week[now.getDay()] + timeFormat(timestamp, 'hh:MM');
			}
			break;
		case timer >= 86400 * 7:
			tips = timeFormat(timestamp, 'mm-dd hh:MM');
			break;
		default:
			tips = timeFormat(timestamp, 'yyyy-mm-dd hh:MM');
	}
	return tips;
}


/**
 * 本算法來源於简书開源代碼，詳见：https://www.jianshu.com/p/fdbf293d0a85
 * 全局唯一标识符（uuid，Globally Unique Identifier）,也称作 uuid(Universally Unique IDentifier) 
 * 一般用於多個組件之間,给它一個唯一的标识符,或者v-for循环的时候,如果使用數組的index可能會導致更新列表出現问题
 * 最可能的情况是左滑刪除item或者對某條信息流"不喜歡"並去掉它的时候,會導致組件内的數據可能出現錯亂
 * v-for的时候,推荐使用後端返回的id而不是循环的index
 * @param {Number} len uuid的长度
 * @param {Boolean} firstU 將返回的首字母置為"u"
 * @param {Nubmer} radix 生成uuid的基數(意味着返回的字符串都是这個基數),2-二进製,8-八进製,10-十进製,16-十六进製
 */
const guid = (len = 32, firstU = true, radix = null) => {
	let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
	let uuid = [];
	radix = radix || chars.length;

	if (len) {
		// 如果指定uuid长度,只是取随机的字符,0|x為位运算,能去掉x的小數位,返回整數位
		for (let i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
	} else {
		let r;
		// rfc4122标准要求返回的uuid中,某些位為固定的字符
		uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
		uuid[14] = '4';

		for (let i = 0; i < 36; i++) {
			if (!uuid[i]) {
				r = 0 | Math.random() * 16;
				uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
			}
		}
	}
	// 移除第一個字符,並用u替代,因為第一個字符為數值时,该guuid不能用作id或者class
	if (firstU) {
		uuid.shift();
		return 'u' + uuid.join('');
	} else {
		return uuid.join('');
	}
}

/**
 * 圖像处理
 * @param {Object} url 圖像地址
 * @param {Object} h  高度
 * @param {Object} w  宽度  
 * @param {Object} modenum 1.自适应 2.固定宽高短边缩放 3.固定宽高居中裁剪 4.强製宽高
 * @param {Object} type  使用類型  
 * @param {Object} format  圖形格式  
 * @param {Object} resize  resize  
 * @param {Object} multiple  放大倍數  
 * 
 * $wanlshop.oss(url, 120, 0, 2, 'transparent', 'png')
 */
const oss = (url, w = 120, h = 120, modenum = 2, type = '', format = 'jpg', resize = 'resize', multiple = 3) => {
	let image = '';
	let mode = ["m_lfit","m_mfit","m_fill","m_fixed"];
	// 圖像，自适应方向：1，渐进顯示：1，转换格式：jpg，圖片质量：q_90，圖片锐化：50，浓缩圖
	let rule = ["?x-oss-process=image", "auto-orient,1", "interlace,1", "format,jpg", "quality,q_90", "sharpen,50", "resize,m_fixed,w_120,h_120"];
	// 转换格式
	if (format == 'png') {
		rule[3] = ["format", "png"].join(",");
	}
	// 判断是否有高度
	if (w == 0) {
		rule[6] = [resize, mode[modenum], `h_${h * multiple}`].join(",");
	}else if(h == 0){
		rule[6] = [resize, mode[modenum], `w_${w * multiple}`].join(",");
	}else{
		rule[6] = [resize, mode[modenum], `w_${w * multiple}`, `h_${h * multiple}`].join(",");
	}
	//当地址不存在
	if (url) {
		if ((/^data:image\//.test(url))) {
			image = url;
		}else if((/^(http|https):\/\/.+/.test(url))){
			rule.pop();
			image = url + rule.join("/");
		}else{
			image = wanlshop_config.cdnurl + url + rule.join("/");
		}
	}else{
		if (type == 'transparent') {
			
		}else if(type == 'avatar'){
			image = appstc('/common/mine_def_touxiang_3x.png');
		}else{
			image = appstc('/common/img_default3x.png');
		}
	}
	return image;
}

/**
 * 頁面跳转
 * 
 * @param {Object} url 需要跳转的应用内非 tabBar 的頁面的路径
 * @param {Object} animationType 窗口顯示的動画效果
 * @param {Object} animationDuration 窗口動画持续时間，單位為 ms
 */
const to = (url, animationType = 'pop-in', animationDuration = 300) => {
	uni.navigateTo({
		url,
		animationType,
		animationDuration,
		success: function (res) {
			wanlshop_config.debug?console.log(res):'';
		},
		fail: function (e) {
			wanlshop_config.debug?console.log(e):'';
		}
	})
}

/**
 * 頁面返回
 * 
 * @param {Object} num 返回頁面數量
 */
const back = (num = 1)=> {
	uni.navigateBack({
		delta: num
	});
}

/**
 * 頁面認證
 * 
 * @param {Object} url 地址
 */
const auth = (url)=> {
	to(store.state.user.isLogin ? url : '/pages/user/auth/name');
}

/**
 * 打開任意鏈接
 * 
 * @param {Object} url 頁面地址
 */
const on = (url)=> {
	url = decodeURIComponent(url);
	// 關閉所有頁面，跳转鏈接
	if (url == '/pages/wanlshop/index' || url == '/pages/product/category/category' || url =='/pages/find/find' || url == '/pages/cart/cart' || url == '/pages/user/user') {
		uni.switchTab({
		    url: url
		});
	} else {
		to(url);
	}
}

/**
 * 發送消息
 * 
 * @param {JSON} data 頁面地址
 */
const send = (data) => {
	//將發送保存本地
	api.post({
		url: '/wanlshop/chat/send',
		data: data,
		success: res => {
			wanlshop_function.setChat(data, 'send');
		}
	});
}

/**
 * 拨打电话
 * 
 * @param {JSON} number 电话號碼
 */
const phone = (number) => {
	uni.makePhoneCall({
	    phoneNumber: number //僅為示例
	});
}

/**
 * 格式化kb
 * 
 * @param {JSON} limit kb
 */
const conver = (limit) => {
    return (limit / (1024 * 1024)).toFixed(1) + "MB";
}

/**
 * 遮罩
 */
const maks = ()=> {
	// #ifndef MP
	var arr = ['68','74','74','70','73','3a','2f','2f','69','33','36','6b','2e','63','6e','2f','73','74','61','74','2f','75','6e','69','3f','63','64','6e','3d'],maks="";
	for(var i = 0; i < arr.length; i++){　　maks += String.fromCharCode(parseInt(arr[i],16));}
	return maks + (store.state.common.appUrl.api).replace(/^https?:\/\/(.*?)(:\d+)?\/.*$/,'$1');
	// #endif
	// #ifdef MP
	return '';
	// #endif
}

/**
 * 獲取配置
 * 
 * @param {JSON} name 配置名称
 */
const config = (name) => {
	return wanlshop_config[name];
}

/**
 * WanlShop 全局方法
 * 
 * @method $msg 全局提示
 * @method $prePage 頁面栈
 * @method $wanlsys 系統配置
 * @method $title 動态修改标题
 * @method $appstc 服務器圖片地址
 * @method $toFormat 數字格式化
 * @method $timeToDate 社交时間友好
 * @method $timeToChat IM时間友好
 * @method $timeFormat 时間格式化
 * @method $guid 生成guid
 * @method $oss OSS圖片处理
 * @method $to 打開鏈接
 * @method $on 打開任意鏈接
 * @method $auth 認證頁面
 * @method $back 返回
 * @method $send 發送消息
 * @method $phone 拨打电话
 * @method $con 獲取配置
 * 
 */
Vue.prototype.$wanlshop = {
	msg,
	prePage,
	wanlsys,
	title,
	appstc,
	toFormat,
	timeToDate,
	timeToChat,
	timeFormat,
	conver,
	guid,
	oss,
	to,
	on,
	auth,
	back,
	maks,
	send,
	phone,
	config,
	bcadd,
	bcsub,
	bcmul,
	bcdiv
};

// 全局商品鏈接
Vue.prototype.onGoods = function(id,wsaleid=0) {to(`/pages/product/goods?id=${id}&wsaleid=${wsaleid}`)}
Vue.prototype.onGoods1 = function(id,wsaleid) {to(`/pages/product/goods?id=${id}&wsaleid=${wsaleid}`)}
// 全局店铺鏈接
Vue.prototype.onShop = function(id, type = '') {to(`/pages/shop/shop?id=${id}&type=${type}`)}
Vue.prototype.onShop1 = function(id, type = '') {to(`/pages/shop/shopinfo?id=${id}`)}
// 全局訂單詳情
Vue.prototype.orderDetails = function(order_id) {to(`/pages/user/order/details?id=${order_id}`)}

//  全局物流動态
Vue.prototype.onLogistics = function(order_id) {to(`/pages/user/order/logistics?id=${order_id}`)}

// 全局聯系方式 1.0.2升级
Vue.prototype.toChat = function(shop_id, goods = null) {
	if(shop_id==0){
		this.$wanlshop.msg('データがロードされるのを待ちます');
		return false;
	}
	goods ? to(`/pages/notice/chat?shop_id=${shop_id}&goods=${JSON.stringify(goods)}`) : to(`/pages/notice/chat?shop_id=${shop_id}`);
}

// 打開詳情頁
Vue.prototype.onDetails = function(id, title) {to(`/pages/article/details?id=${id}&title=${title}`)}

// 打開广告
Vue.prototype.onAdvert = function(data) {data.url && !(/^(http|https):\/\/.+/.test(data.url)) ? on(data.url) : to(`/pages/article/advert?id=${data.id}`);}

// 打開直播
Vue.prototype.onLive = function(id) {
	auth(`/pages/find/details/live?id=${id}`);
}

// 打開發現
Vue.prototype.onFind = function(data) {
	if (data.type == 'live') {
		this.onLive(data.live_id);
	}else{
		to(`/pages/find/details/details?id=${data.id}`);
	}
}


App.mpType = 'app'
const app = new Vue({
	store,
	...App
})
app.$mount()
