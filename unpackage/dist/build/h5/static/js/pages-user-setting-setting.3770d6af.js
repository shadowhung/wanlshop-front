(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-user-setting-setting"],{1394:function(t,n,i){"use strict";i.r(n);var e=i("1f61"),a=i.n(e);for(var s in e)"default"!==s&&function(t){i.d(n,t,(function(){return e[t]}))}(s);n["default"]=a.a},"1ee7":function(t,n,i){"use strict";var e;i.d(n,"b",(function(){return a})),i.d(n,"c",(function(){return s})),i.d(n,"a",(function(){return e}));var a=function(){var t=this,n=t.$createElement,i=t._self._c||n;return i("v-uni-view",[i("v-uni-view",{staticClass:"edgeInsetTop"}),i("v-uni-view",{staticClass:"cu-list menu sm-border"},[i("v-uni-view",{staticClass:"cu-item",staticStyle:{"min-height":"200rpx"},on:{click:function(n){arguments[0]=n=t.$handleEvent(n),t.$wanlshop.auth("user")}}},[i("v-uni-view",{staticClass:"cu-avatar round lg margin-right",style:{backgroundImage:"url("+t.$wanlshop.oss(t.user.avatar,52,52,2,"avatar")+")"}}),i("v-uni-view",{staticClass:"content",staticStyle:{"line-height":"1.5em"}},[i("v-uni-view",{staticClass:"text-lg"},[t._v(t._s(t.user.nickname||"ログインしていない"))]),i("v-uni-view",{staticClass:"wanl-grey text-df"},[t._v("ユーザー名："+t._s(t.user.username||"ログインしていない"))])],1),i("v-uni-view",{staticClass:"action"},[i("v-uni-text",{staticClass:"wlIcon-jifen"}),i("v-uni-text",{staticClass:"margin-lr-xs"},[t._v("編集")]),i("v-uni-text",{staticClass:"wlIcon-fanhui2"})],1)],1),i("v-uni-view",{staticClass:"cu-item arrow",style:{backgroundImage:"url("+t.usermaks+")"},on:{click:function(n){arguments[0]=n=t.$handleEvent(n),t.$wanlshop.auth("../address/address")}}},[i("v-uni-view",{staticClass:"content"},[i("v-uni-text",[t._v("私の配送先住所")])],1)],1)],1),i("v-uni-view",{staticClass:"cu-list menu sm-border margin-top"},[i("v-uni-view",{staticClass:"cu-item arrow",on:{click:function(n){arguments[0]=n=t.$handleEvent(n),t.$wanlshop.auth("loginpass")}}},[i("v-uni-view",{staticClass:"content"},[i("v-uni-text",[t._v("ログインパスワードを変更する")])],1)],1),i("v-uni-view",{staticClass:"cu-item arrow",on:{click:function(n){arguments[0]=n=t.$handleEvent(n),t.$wanlshop.auth("paypass")}}},[i("v-uni-view",{staticClass:"content"},[i("v-uni-text",[t._v("支払いパスワードを変更する")])],1)],1)],1),i("v-uni-view",{staticClass:"cu-list menu sm-border margin-top"},[i("v-uni-view",{staticClass:"cu-item arrow",on:{click:function(n){arguments[0]=n=t.$handleEvent(n),t.$wanlshop.to("notice")}}},[i("v-uni-view",{staticClass:"content"},[i("v-uni-text",[t._v("新しいメッセージ通知")])],1)],1),i("v-uni-view",{staticClass:"cu-item arrow",on:{click:function(n){arguments[0]=n=t.$handleEvent(n),t.$wanlshop.to("currency")}}},[i("v-uni-view",{staticClass:"content"},[i("v-uni-text",[t._v("ユニバーサル")])],1)],1)],1),i("v-uni-view",{staticClass:"cu-list menu sm-border margin-top"},[i("v-uni-view",{staticClass:"cu-item arrow",on:{click:function(n){arguments[0]=n=t.$handleEvent(n),t.clearCache()}}},[i("v-uni-view",{staticClass:"content"},[i("v-uni-text",[t._v("キャッシュの消去")])],1),i("v-uni-view",{staticClass:"action"},[i("v-uni-view",{staticClass:"cu-tag round"},[t._v(t._s(t.fileSizeString))])],1)],1),i("v-uni-view",{staticClass:"cu-item arrow",on:{click:function(n){arguments[0]=n=t.$handleEvent(n),t.$wanlshop.to("about","pop-in",200)}}},[i("v-uni-view",{staticClass:"content"},[i("v-uni-text",[t._v("オン")])],1),i("v-uni-view",{staticClass:"action"},[i("v-uni-text",{staticClass:"wanl-gray"},[t._v(t._s(t.common.version))])],1)],1)],1)],1)},s=[]},"1f61":function(t,n,i){"use strict";var e=i("4ea4");i("e25e"),Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var a=e(i("5530")),s=i("2f62"),c={data:function(){return{fileSizeString:"0 B",usermaks:""}},computed:(0,a.default)({},(0,s.mapState)(["user","common"])),onLoad:function(){this.usermaks=this.$wanlshop.maks()},methods:{formatSize:function(){var t=this;plus.cache.calculate((function(n){var i=parseInt(n);t.fileSizeString=0==i?"0 B":i<1024?i+" B":i<1048576?(i/1024).toFixed(2)+" KB":i<1073741824?(i/1048576).toFixed(2)+" MB":(i/1073741824).toFixed(2)+" GB"}))},clearCache:function(){this.$wanlshop.msg("キャッシュが見つかりません")}}};n.default=c},e913:function(t,n,i){"use strict";i.r(n);var e=i("1ee7"),a=i("1394");for(var s in a)"default"!==s&&function(t){i.d(n,t,(function(){return a[t]}))}(s);var c,u=i("f0c5"),v=Object(u["a"])(a["default"],e["b"],e["c"],!1,null,"329e034c",null,!1,e["a"],c);n["default"]=v.exports}}]);