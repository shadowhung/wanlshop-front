(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-user-money-pay"],{"1bb3":function(t,e,a){"use strict";var n;a.d(e,"b",(function(){return i})),a.d(e,"c",(function(){return o})),a.d(e,"a",(function(){return n}));var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-uni-view",{directives:[{name:"show",rawName:"v-show",value:t.numberKeyboardPopupVisible,expression:"numberKeyboardPopupVisible"}],staticClass:"numberkeyboard",attrs:{id:"number-keyboard-component"}},[a("v-uni-view",{staticClass:"title",on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.close.apply(void 0,arguments)}}},[a("v-uni-image",{staticStyle:{width:"30upx",height:"30upx"},attrs:{src:t.$wanlshop.appstc("/common/img_down3x.png")}})],1),a("v-uni-view",{staticClass:"keys"},[t._l(t.config.loop,(function(e){return a("v-uni-view",{key:e.key,staticClass:"key button",on:{click:function(a){arguments[0]=a=t.$handleEvent(a),t.number(e.number)}}},[t._v(t._s(e.number))])})),a("v-uni-view",{staticClass:"key button",staticStyle:{background:"#f5f5f5"},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.empty.apply(void 0,arguments)}}},[a("v-uni-image",{staticStyle:{width:"50upx",height:"50upx"},attrs:{src:t.$wanlshop.appstc("/common/img_empty3x.png")}})],1),a("v-uni-view",{staticClass:"key button",on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.number(0)}}},[t._v("0")]),a("v-uni-view",{staticClass:"key button",staticStyle:{background:"#f5f5f5"},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.del.apply(void 0,arguments)}}},[a("v-uni-image",{staticStyle:{width:"50upx",height:"50upx"},attrs:{src:t.$wanlshop.appstc("/common/img_delete3x.png")}})],1)],2),a("v-uni-view",{staticClass:"iPhonex"})],1)},o=[]},"224d":function(t,e,a){var n=a("24fb");e=n(!1),e.push([t.i,".numberkeyboard[data-v-b9df1566]{position:fixed;width:100%;bottom:0}.numberkeyboard .title[data-v-b9df1566]{display:flex;justify-content:center;align-items:center;height:%?50?%;background:#f9f9f9}.numberkeyboard .keys[data-v-b9df1566]{display:flex;flex-direction:row;flex-wrap:wrap}.numberkeyboard .keys .key[data-v-b9df1566]{width:%?250?%;height:%?80?%;display:flex;justify-content:center;align-items:center;border-right:1px solid #f5f5f5;box-sizing:border-box;font-size:%?40?%}.numberkeyboard .keys .key[data-v-b9df1566]:nth-child(n + 4){border-top:1px solid #f5f5f5;box-sizing:border-box}.numberkeyboard .keys .key[data-v-b9df1566]:active{background:#ddd}.iPhonex[data-v-b9df1566]{padding-bottom:calc(env(safe-area-inset-bottom) * 1.5);background-color:#f5f5f5}.keys .key[data-v-b9df1566]{background-color:#fff}",""]),t.exports=e},"2e4f":function(t,e,a){"use strict";a.r(e);var n=a("1bb3"),i=a("2f77");for(var o in i)"default"!==o&&function(t){a.d(e,t,(function(){return i[t]}))}(o);a("94a3");var s,c=a("f0c5"),d=Object(c["a"])(i["default"],n["b"],n["c"],!1,null,"b9df1566",null,!1,n["a"],s);e["default"]=d.exports},"2f77":function(t,e,a){"use strict";a.r(e);var n=a("7a8b"),i=a.n(n);for(var o in n)"default"!==o&&function(t){a.d(e,t,(function(){return n[t]}))}(o);e["default"]=i.a},6447:function(t,e,a){"use strict";var n=a("7367"),i=a.n(n);i.a},"6ffa":function(t,e,a){"use strict";a.r(e);var n=a("b4dd"),i=a.n(n);for(var o in n)"default"!==o&&function(t){a.d(e,t,(function(){return n[t]}))}(o);e["default"]=i.a},7367:function(t,e,a){var n=a("ee5f");"string"===typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);var i=a("4f06").default;i("8e95453a",n,!0,{sourceMap:!1,shadowMode:!1})},"7a8b":function(t,e,a){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a={name:"WanlKeyboard",props:{open:{type:Boolean,default:!1},color:{type:String,default:"#04BE02"}},data:function(){return{config:{loop:[{number:1,key:"number-1"},{number:2,key:"number-2"},{number:3,key:"number-3"},{number:4,key:"number-4"},{number:5,key:"number-5"},{number:6,key:"number-6"},{number:7,key:"number-7"},{number:8,key:"number-8"},{number:9,key:"number-9"}]},numberKeyboardPopupVisible:this.open}},watch:{numberKeyboardPopupVisible:function(t,e){0==t&&this.$emit("close")},open:function(e,a){t.log(e),this.numberKeyboardPopupVisible=e}},methods:{close:function(){this.numberKeyboardPopupVisible=!1,this.$emit("close")},del:function(){this.$emit("delete")},empty:function(){this.$emit("empty")},number:function(t){this.$emit("number",t)}}};e.default=a}).call(this,a("5a52")["default"])},"94a3":function(t,e,a){"use strict";var n=a("e0aa"),i=a.n(n);i.a},b4dd:function(t,e,a){"use strict";(function(t){var n=a("4ea4");a("4160"),a("d81d"),a("a434"),a("acd8"),a("159b"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0,a("96cf");var i=n(a("1da1")),o=n(a("5530")),s=a("2f62"),c={data:function(){return{loading:!1,disabled:!1,price:"0",isbalance:!1,order_no:"",order_pay_no:"",payNum:1,payList:[],config:{count:[{index:1,key:"valid-code-input-1"},{index:2,key:"valid-code-input-2"},{index:3,key:"valid-code-input-3"},{index:4,key:"valid-code-input-4"},{index:5,key:"valid-code-input-5"},{index:6,key:"valid-code-input-6"}]},keyboardVisible:!1,currentFocus:1,mobile:"",code:[],style:{inputWidth:"40upx",inputHeight:"100upx"},countdown:60,cTimer:null,event:"",pageroute:""}},computed:(0,o.default)({},(0,s.mapState)(["user"])),watch:{price:function(t,e){t<=parseFloat(this.$store.state.user.money)&&(this.isbalance=!0,this.getPayment())}},onLoad:function(e){var a=this;if(this.$api.post({url:"/wanlshop/pay/getBalance",success:function(t){t=parseFloat(t).toFixed(0),a.$store.commit("user/setUserInfo",{money:t}),a.getPayment()}}),e.data){var n=0,i=JSON.parse(e.data),o=[];i.length<=1?(this.price=i[0].price,this.order_no="注文番号："+i[0].order_no,this.order_pay_no=i[0].pay_no,this.order_id=i[0].order_id):(i.forEach((function(t){n=a.$wanlshop.bcadd(n,t.price),o.push(t.order_id)})),this.price=n,this.order_id=o,this.payNum=i.length,this.order_no="一括払い "+i.length+"注文")}else e.order_id?(uni.showLoading({title:"結算中..."}),this.$api.post({url:"/wanlshop/pay/getPay",data:{order_id:e.order_id},success:function(t){uni.hideLoading(),a.price=t.price,a.order_no="注文番号："+t.order_no,a.order_pay_no=t.pay_no,a.order_id=t.order_id}})):t.log("不正アクセス")},methods:{getPayment:function(){this.price<=parseFloat(this.$store.state.user.money)&&(this.isbalance=!0);this.payList=[{name:"残額払い",describe:"",type:"balance",method:"balance",state:!!this.isbalance,select:!!this.isbalance}],this.payList.push()},confirm:function(){if(this.currentFocus<6)return this.$wanlshop.msg("支払いパスワードを入力してください"),this.keyboardVisible=!0,!1;var t=null;this.disabled||(this.payList.map((function(e,a,n){e.select&&(t=e)})),t?(this.loading=!0,this.disabled=!0,this.wanlPay(t)):uni.showModal({content:"お支払い方法を選択してください",showCancel:!1}))},wanlPay:function(e){var a=arguments,n=this;return(0,i.default)(regeneratorRuntime.mark((function i(){var o;return regeneratorRuntime.wrap((function(i){while(1)switch(i.prev=i.next){case 0:o=a.length>1&&void 0!==a[1]?a[1]:null,n.$api.post({url:"/wanlshop/pay/payment",data:{type:e.type,method:e.method,captcha:n.code.join(""),code:o,order_id:n.order_id},success:function(a){if("balance"==e.type&&(n.loading=!1,n.$store.commit("user/setUserInfo",{money:n.$wanlshop.bcsub(n.$store.state.user.money,n.price)}),n.paySuccess()),"wechat"==e.type&&"wap"==e.method&&(n.loading=!1,uni.showModal({title:"WeChat Pay",content:"支払いは完了しましたか",success:function(e){e.confirm?n.paySuccess():e.cancel&&t.log("ユーザーがクリックしてキャンセル")}}),window.location.href=a),"alipay"==e.type&&"wap"==e.method&&(n.loading=!1,n.$store.commit("statistics/order",{pay:n.$wanlshop.bcsub(n.$store.state.statistics.order.pay,n.payNum),delive:n.$wanlshop.bcadd(n.$store.state.statistics.order.delive,n.payNum)}),document.write(a)),"wechat"==e.type&&"miniapp"==e.method&&uni.requestPayment({appId:a.appId,nonceStr:a.nonceStr,package:a.package,paySign:a.paySign,signType:a.signType,timeStamp:a.timeStamp,success:function(t){n.paySuccess()},fail:function(t){uni.showModal({content:"支払いに失敗しました: "+t.errMsg,showCancel:!1})}}),("alipay"==e.type||"wechat"==e.type)&&"app"==e.method){var i=e.type;"wechat"==e.type&&(i="wxpay"),uni.requestPayment({provider:i,orderInfo:a,success:function(e){t.log("success",e),n.paySuccess()},fail:function(t){uni.showModal({content:"支払いに失敗しました: "+t.errMsg,showCancel:!1})},complete:function(){n.loading=!1,n.disabled=!1}})}}});case 2:case"end":return i.stop()}}),i)})))()},onSelect:function(t){this.payList.map((function(e,a,n){e.select=a==t&&!e.select}))},inputCode:function(t){var e=this;this.code[this.currentFocus-1]=t,6==this.currentFocus&&this.$api.post({url:"/wanlshop/pay/getpaypass",data:{captcha:this.code.join("")},success:function(t){e.confirm()}}),this.currentFocus<=6&&this.currentFocus++},deleteCode:function(){this.currentFocus--,this.code.splice(-1,1)},emptyCode:function(){this.code=[],this.currentFocus=0},hanldeOpenKeyboard:function(){this.keyboardVisible=!0},paySuccess:function(){this.loading=!1,this.$store.commit("statistics/order",{pay:this.$wanlshop.bcsub(this.$store.state.statistics.order.pay,this.payNum),delive:this.$wanlshop.bcadd(this.$store.state.statistics.order.delive,this.payNum)}),this.$wanlshop.to("/pages/page/success?type=pay")}}};e.default=c}).call(this,a("5a52")["default"])},dbc3:function(t,e,a){"use strict";a.r(e);var n=a("dc49"),i=a("6ffa");for(var o in i)"default"!==o&&function(t){a.d(e,t,(function(){return i[t]}))}(o);a("6447");var s,c=a("f0c5"),d=Object(c["a"])(i["default"],n["b"],n["c"],!1,null,"dc6098a2",null,!1,n["a"],s);e["default"]=d.exports},dc49:function(t,e,a){"use strict";a.d(e,"b",(function(){return i})),a.d(e,"c",(function(){return o})),a.d(e,"a",(function(){return n}));var n={wanlKeyboard:a("2e4f").default},i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-uni-view",[a("v-uni-view",{staticClass:"edgeInsetTop"}),a("v-uni-view",{staticClass:"wanl-pay"},[a("v-uni-view",{staticClass:"price-box"},[a("v-uni-text",{staticClass:"text-df"},[t._v(t._s(t.order_no))]),a("v-uni-text",{staticClass:"wanl-pip text-price margin-top-sm"},[t._v(t._s(t.price))])],1),a("v-uni-view",{staticClass:"list-box"},t._l(t.payList,(function(e,n){return a("v-uni-view",{key:n,staticClass:"item"},[a("v-uni-text",{class:"wlIcon-"+e.type+"-pay"}),a("v-uni-view",{staticClass:"action"},[a("v-uni-text",{staticClass:"title wanl-pip"},[t._v(t._s(e.name))]),"balance"==e.type?a("v-uni-view",[t.isbalance?a("v-uni-text",[t._v("利用可能残高 円"+t._s(t.user.money))]):a("v-uni-text",[t._v("残高不足です，利用可能残高 円"+t._s(t.user.money)),a("span",{staticStyle:{color:"red"},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.$wanlshop.to("/pages/user/money/money")}}},[t._v("充電するには")])])],1):a("v-uni-view",[t._v(t._s(e.describe))])],1),e.state?a("v-uni-view",{staticClass:"radio text-xxl",on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.onSelect(n)}}},[e.select?a("v-uni-text",{staticClass:"wlIcon-xuanze-danxuan wanl-orange"}):a("v-uni-text",{staticClass:"wlIcon-xuanze wanl-gray-light"})],1):a("v-uni-view",{staticClass:"radio text-xxl"},[a("v-uni-text",{staticClass:"wlIcon-xuanze-danxuan wanl-gray-light"})],1)],1)})),1),a("v-uni-view",{staticClass:"list-box"},[a("v-uni-text",[t._v("支払いパスワード"),a("span",{staticStyle:{color:"red"},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.$wanlshop.to("/pages/user/setting/paypass")}}},[t._v("(セットに移動)")])]),a("v-uni-view",{staticClass:"codes"},t._l(t.config.count,(function(e){return a("v-uni-view",{key:e.key},[a("v-uni-view",{staticClass:"input",class:{active:t.currentFocus==e.index},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.hanldeOpenKeyboard.apply(void 0,arguments)}}},[void 0!=t.code[e.index-1]?[t._v(t._s(t.code[e.index-1]))]:[t.currentFocus==e.index?a("v-uni-view",{staticClass:"shining"}):t._e()]],2)],1)})),1)],1),1==t.payNum?a("v-uni-button",{staticClass:"mix-btn wanl-bg-redorange",attrs:{loading:t.loading},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.confirm()}}},[t._v("支払いを確認する")]):a("v-uni-button",{staticClass:"mix-btn wanl-bg-redorange",attrs:{loading:t.loading},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.confirm()}}},[t._v("一括払い")]),a("v-uni-view",{staticClass:"footer text-center"},[t.order_pay_no?a("v-uni-view",{staticClass:"text-sm"},[t._v("取引番号："+t._s(t.order_pay_no))]):t._e(),a("v-uni-view",[t._v("© shopyjp支払い")])],1),a("wanl-keyboard",{attrs:{open:t.keyboardVisible},on:{number:function(e){arguments[0]=e=t.$handleEvent(e),t.inputCode.apply(void 0,arguments)},delete:function(e){arguments[0]=e=t.$handleEvent(e),t.deleteCode.apply(void 0,arguments)},empty:function(e){arguments[0]=e=t.$handleEvent(e),t.emptyCode.apply(void 0,arguments)},close:function(e){arguments[0]=e=t.$handleEvent(e),t.keyboardVisible=!1}}})],1)],1)},o=[]},e0aa:function(t,e,a){var n=a("224d");"string"===typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);var i=a("4f06").default;i("57a48bcc",n,!0,{sourceMap:!1,shadowMode:!1})},ee5f:function(t,e,a){var n=a("24fb");e=n(!1),e.push([t.i,"uni-page-body[data-v-dc6098a2]{background-color:#fff}.wanl-title[data-v-dc6098a2]{padding-bottom:%?130?%;padding-top:%?170?%;font-size:%?68?%}.wanl-title .titleInfo[data-v-dc6098a2]{font-size:%?56?%}.wanl-weixin-btn-info[data-v-dc6098a2]{color:#b8b8b8!important}.auth[data-v-dc6098a2]{margin:0 %?60?%}.auth-group[data-v-dc6098a2]{padding:%?1?% %?30?%;display:flex;align-items:center;min-height:%?90?%;justify-content:space-between;margin-bottom:%?25?%}.auth-group uni-input[data-v-dc6098a2]{flex:1;font-size:%?33?%;color:#250f00;padding-right:%?20?%}.auth-group .placeholder[data-v-dc6098a2]{color:#b3b3b3}.auth-button[data-v-dc6098a2]{padding:%?25?% 0 %?50?% 0}.auth-button .cu-btn[data-v-dc6098a2]{height:%?90?%}.text-center[data-v-dc6098a2]{color:#3f2f21\n}.auth-clause[data-v-dc6098a2]{font-size:%?25?%;color:#909090}.auth-clause uni-text[data-v-dc6098a2]{margin:0 %?10?%;color:#ed6d0f}.auth-foot[data-v-dc6098a2]{position:fixed;width:100%;bottom:0;z-index:1024;padding:0 %?60?%;padding-bottom:calc(env(safe-area-inset-bottom) / 2)}.auth-foot .oauth[data-v-dc6098a2]{display:flex;flex-wrap:wrap;align-items:center;min-height:%?160?%;justify-content:space-around}.auth-foot .oauth uni-view[data-v-dc6098a2]{border:%?2?% solid #fcf7e9}.auth-foot .menu[data-v-dc6098a2]{display:flex;align-items:center;justify-content:center;margin-bottom:%?100?%;color:#3f2f21;line-height:%?28?%;font-size:%?28?%}.auth-foot uni-text[data-v-dc6098a2]{width:%?180?%;text-align:center}.auth-foot uni-text[data-v-dc6098a2]:nth-child(2){border-left:1px solid #ececec}\r\n\r\n/* 驗證碼 */.auth-title[data-v-dc6098a2]{padding-bottom:%?30?%;padding-top:%?170?%;font-size:%?60?%}.auth-mobile[data-v-dc6098a2]{color:#9a9a9a;padding-bottom:%?80?%}.auth-mobile uni-text[data-v-dc6098a2]{margin-left:%?10?%}.codes[data-v-dc6098a2]{display:flex;justify-content:space-around;flex-direction:row}.codes uni-input[data-v-dc6098a2]{background:#fff;border-bottom:1px solid #c3c3c3;width:%?90?%;height:%?90?%;text-align:center}.codes .input[data-v-dc6098a2]{display:flex;justify-content:center;align-items:center;background:#fff;border-bottom:1px solid #c3c3c3;width:%?90?%;height:%?90?%;font-size:%?40?%;font-weight:500;color:#333}.codes .input .shining[data-v-dc6098a2]{border:1px solid #ed6d0f;height:%?50?%;animation:shining-data-v-dc6098a2 1s linear infinite;\r\n\t/* 其它瀏覽器兼容性前缀 */-webkit-animation:shining-data-v-dc6098a2 1s linear infinite;-moz-animation:shining-data-v-dc6098a2 1s linear infinite;-ms-animation:shining-data-v-dc6098a2 1s linear infinite;-o-animation:shining-data-v-dc6098a2 1s linear infinite}.codes .active[data-v-dc6098a2]{border-bottom:1px solid #ed6d0f;caret-color:#ed6d0f}.oneline-codes uni-input[data-v-dc6098a2]{text-align:center}.auth-again[data-v-dc6098a2]{padding-top:%?50?%}.auth-again uni-text[data-v-dc6098a2]{color:#ed6d0f;margin-right:%?40?%}.auth-again .time[data-v-dc6098a2]{color:#9a9a9a}@-webkit-keyframes shining-data-v-dc6098a2{0%{opacity:1}50%{opacity:1}50.01%{opacity:0}100%{opacity:0}}.wlIcon-QQ[data-v-dc6098a2]{color:#12b8f6}.wlIcon-WeChat[data-v-dc6098a2]{color:#02dc6b}.wlIcon-WeiBo[data-v-dc6098a2]{color:#d32820}.wlIcon-Xiaomi[data-v-dc6098a2]{color:#ff6b00}uni-page-body[data-v-dc6098a2]{background-color:#fff}uni-radio-group[data-v-dc6098a2]{display:block}.numberkeyboard[data-v-dc6098a2]{z-index:999}.keys .key[data-v-dc6098a2]{background-color:#fff}body.?%PAGE?%[data-v-dc6098a2]{background-color:#fff;background-color:#fff}",""]),t.exports=e}}]);