(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-user-money-recharge2"],{3525:function(e,t,n){"use strict";var a=n("d0ff"),i=n.n(a);i.a},4385:function(e,t,n){"use strict";n.r(t);var a=n("9388"),i=n.n(a);for(var s in a)"default"!==s&&function(e){n.d(t,e,(function(){return a[e]}))}(s);t["default"]=i.a},9388:function(e,t,n){"use strict";(function(e){var a=n("4ea4");n("99af"),n("d81d"),n("a434"),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var i=a(n("b85c"));n("96cf");var s=a(n("1da1")),o={data:function(){return{loading:!1,disabled:!1,money:null,payList:[],lineinfo:{lineimages:"",rechargeline:"",lineurl:""},bankinfo:{bank_kaihu:"",bank_add:"",bank_name:"",bank_num:""},sendDate:{money:0,content:"",images:[],contact:""}}},onLoad:function(t){var n=this;this.sendDate.money=t.money,this.$api.post({url:"/wanlshop/pay/getRecharge",success:function(t){n.bankinfo=t,n.lineinfo=t,e.log("======"),e.log(t)}});var a="wap";this.payList.push({name:"銀行帳號",describe:"推薦使用銀行帳號",Pay_zg:"2",method:a,state:!0,select:!0},{name:"超商繳費",describe:"",Pay_zg:"4",method:a,state:!0,select:!1})},methods:{copySharePath:function(){var e=this;e.showModal=!1,uni.setClipboardData({data:this.bankinfo.usdt_add,success:function(t){e.$wanlshop.msg("已复制到剪切板")},fail:function(e){},complete:function(e){}})},confirm1:function(){return window.location.href=this.lineinfo.lineurl,!1},confirm:function(){var e=this;this.disabled||(this.sendDate.money<=0?this.$wanlshop.msg("請輸入儲値金額"):this.$api.post({url:"/wanlshop/recharge/add",data:this.sendDate,success:function(t){e.$wanlshop.to("/pages/page/success?type=recharge")}}))},wanlPay:function(t){var n=arguments,a=this;return(0,s.default)(regeneratorRuntime.mark((function i(){var s;return regeneratorRuntime.wrap((function(i){while(1)switch(i.prev=i.next){case 0:s=n.length>1&&void 0!==n[1]?n[1]:null,a.$api.post({url:"/wanlshop/pay/recharge",data:{type:t.type,method:t.method,code:s,money:a.money,Pay_zg:t.Pay_zg},success:function(n){if("twpay"==t.type&&"wap"==t.method&&(window.location.href=n,a.loading=!1),"wechat"==t.type&&"wap"==t.method&&(a.loading=!1,uni.showModal({title:"微信支付",content:"是否已完成支付",success:function(t){t.confirm?a.paySuccess():t.cancel&&e.log("用戶點擊取消")}}),window.location.href=n),"wechat"==t.type&&"miniapp"==t.method&&uni.requestPayment({appId:n.appId,nonceStr:n.nonceStr,package:n.package,paySign:n.paySign,signType:n.signType,timeStamp:n.timeStamp,success:function(e){a.paySuccess()},fail:function(e){uni.showModal({content:"支付失敗,原因為: "+e.errMsg,showCancel:!1})},complete:function(){a.loading=!1,a.disabled=!1}}),"alipay"==t.type&&"wap"==t.method&&(a.loading=!1,document.write(n)),("alipay"==t.type||"wechat"==t.type)&&"app"==t.method){var i=t.type;"wechat"==t.type&&(i="wxpay"),uni.requestPayment({provider:i,orderInfo:n,success:function(t){e.log("success",t),a.paySuccess()},fail:function(e){uni.showModal({content:"支付失敗,原因為: "+e.errMsg,showCancel:!1})},complete:function(){a.loading=!1,a.disabled=!1}})}}});case 2:case"end":return i.stop()}}),i)})))()},onSelect:function(e){this.payList.map((function(t,n,a){t.select=n==e&&!t.select}))},emptyInput:function(){this.money=null},chooseImg:function(){var e=this;uni.chooseImage({sourceType:["camera","album"],sizeType:"compressed",count:8-this.sendDate.images.length,success:function(t){e.$api.get({url:"/wanlshop/common/uploadData",success:function(n){for(var a=0;a<t.tempFilePaths.length;a++)uni.getImageInfo({src:t.tempFilePaths[a],success:function(t){e.$api.upload({url:n.uploadurl,filePath:t.path,name:"file",formData:"local"==n.storage?null:n.multipart,success:function(t){e.sendDate.images.push(t.fullurl)}})}})}})}})},close:function(e){this.sendDate.images.splice(e,1)},paySuccess:function(){this.loading=!1,this.$store.commit("user/setUserInfo",{money:this.$wanlshop.bcadd(this.$store.state.user.money,this.money)}),this.$wanlshop.to("/pages/page/success?type=recharge")},previewImage:function(e,t){var n,a=[],s=(0,i.default)(e);try{for(s.s();!(n=s.n()).done;){var o=n.value;a=a.concat(this.$wanlshop.oss(o,500))}}catch(c){s.e(c)}finally{s.f()}uni.previewImage({urls:a,current:a[t],indicator:"number"})}}};t.default=o}).call(this,n("5a52")["default"])},b37c:function(e,t,n){"use strict";var a;n.d(t,"b",(function(){return i})),n.d(t,"c",(function(){return s})),n.d(t,"a",(function(){return a}));var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-uni-view",[n("v-uni-view",{staticClass:"edgeInsetTop"}),n("v-uni-view",{staticClass:"wanl-pay"},[n("v-uni-view",{staticClass:"money bg-white"},[n("v-uni-text",{staticClass:"title"},[e._v("儲値金額")]),n("v-uni-view",{staticClass:"margin-top price"},[n("v-uni-view",{staticClass:"symbol"},[n("v-uni-text",[e._v("円")])],1),n("v-uni-view",{staticClass:"symbol"},[n("v-uni-text",[e._v(e._s(e.sendDate.money))])],1)],1)],1),n("v-uni-view",{staticClass:"list-box",staticStyle:{"padding-left":"0px","text-align":"center"}},[n("br"),n("v-uni-text",{on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.copySharePath()}}},[e._v("取引銀行:"+e._s(e.bankinfo.bank_kaihu))]),n("br"),n("v-uni-text",{on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.copySharePath()}}},[e._v("銀行の住所:"+e._s(e.bankinfo.bank_add))]),n("br"),n("v-uni-text",{on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.copySharePath()}}},[e._v("口座番号:"+e._s(e.bankinfo.bank_num))]),n("br"),n("br")],1),n("v-uni-view",{staticClass:"feedback-title",staticStyle:{"text-align":"center"}},[n("v-uni-text",[e._v("支払証明書をアップロード")])],1),n("v-uni-view",{staticClass:"cu-bar bg-white"},[n("v-uni-view",{staticClass:"action"},[e._v("写真を閲覧")]),n("v-uni-view",{staticClass:"action"},[e._v(e._s(e.sendDate.images.length)+"/8")])],1),n("v-uni-view",{staticClass:"cu-form-group"},[n("v-uni-view",{staticClass:"grid col-4 grid-square flex-sub"},[e._l(e.sendDate.images,(function(t,a){return n("v-uni-view",{key:a,staticClass:"bg-img"},[n("v-uni-image",{attrs:{src:t,mode:"aspectFill"},on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.previewImage(e.sendDate.images,a)}}}),n("v-uni-view",{staticClass:"cu-tag bg-red",on:{click:function(t){t.stopPropagation(),arguments[0]=t=e.$handleEvent(t),e.close(a)}}},[n("v-uni-text",{staticClass:"wlIcon-shanchu2"})],1)],1)})),e.sendDate.images.length<8?n("v-uni-view",{staticClass:"solids",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.chooseImg.apply(void 0,arguments)}}},[n("v-uni-text",{staticClass:"wlIcon-31paishe"})],1):e._e()],2)],1),n("v-uni-button",{staticClass:"mix-btn wanl-bg-redorange",attrs:{loading:e.loading},on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.confirm()}}},[e._v("振替を確認")]),n("v-uni-view",{staticClass:"list-box",staticStyle:{color:"red"}},[n("p",[e._v("チップ：")]),n("p",[e._v("１、ご入金完了後、通常2時間以内に着金します。")]),n("p",[e._v("２、午後21時以降に入金する場合、翌日9時以降に着金することがあります。")]),n("p",[e._v("３、ご不明な点がございましたら、時間内にオンラインカスタマーサービスにご相談ください")]),n("p",[n("br")]),n("p",[n("br")]),n("p",[n("br")]),n("p",[n("br")])])],1)],1)},s=[]},b467:function(e,t,n){var a=n("24fb");t=a(!1),t.push([e.i,"uni-radio-group[data-v-b1567dcc]{display:block}.wanl-pay .money[data-v-b1567dcc]{padding:%?25?% %?40?% %?25?% %?60?%}.wanl-pay .money .symbol[data-v-b1567dcc]{font-size:%?60?%;margin-right:%?20?%}.wanl-pay .money .price[data-v-b1567dcc]{display:flex;align-items:center}.wanl-pay .money .price uni-input[data-v-b1567dcc]{\n\nwidth:100%;font-size:%?100?%}.my-mix-btn[data-v-b1567dcc]{width:%?450?%;font-size:%?28?%}",""]),e.exports=t},b85c:function(e,t,n){"use strict";n("a4d3"),n("e01a"),n("d28b"),n("d3b7"),n("3ca3"),n("ddb0"),Object.defineProperty(t,"__esModule",{value:!0}),t.default=s;var a=i(n("06c5"));function i(e){return e&&e.__esModule?e:{default:e}}function s(e,t){var n;if("undefined"===typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(n=(0,a.default)(e))||t&&e&&"number"===typeof e.length){n&&(e=n);var i=0,s=function(){};return{s:s,n:function(){return i>=e.length?{done:!0}:{done:!1,value:e[i++]}},e:function(e){throw e},f:s}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,c=!0,r=!1;return{s:function(){n=e[Symbol.iterator]()},n:function(){var e=n.next();return c=e.done,e},e:function(e){r=!0,o=e},f:function(){try{c||null==n["return"]||n["return"]()}finally{if(r)throw o}}}}},d0ff:function(e,t,n){var a=n("b467");"string"===typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);var i=n("4f06").default;i("43f1d395",a,!0,{sourceMap:!1,shadowMode:!1})},d7f0:function(e,t,n){"use strict";n.r(t);var a=n("b37c"),i=n("4385");for(var s in i)"default"!==s&&function(e){n.d(t,e,(function(){return i[e]}))}(s);n("3525");var o,c=n("f0c5"),r=Object(c["a"])(i["default"],a["b"],a["c"],!1,null,"b1567dcc",null,!1,a["a"],o);t["default"]=r.exports}}]);