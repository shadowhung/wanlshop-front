(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-user-setting-notice"],{"09da":function(t,e,s){"use strict";s.r(e);var n=s("dedb"),a=s.n(n);for(var i in n)"default"!==i&&function(t){s.d(e,t,(function(){return n[t]}))}(i);e["default"]=a.a},"1c6e":function(t,e,s){"use strict";var n;s.d(e,"b",(function(){return a})),s.d(e,"c",(function(){return i})),s.d(e,"a",(function(){return n}));var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("v-uni-view",[s("v-uni-view",{staticClass:"edgeInsetTop"}),s("v-uni-view",{staticClass:"cu-form-group margin-top"},[s("v-uni-view",{staticClass:"title"},[t._v("バナーメッセージ通知")]),s("v-uni-switch",{class:t.user.pushs?"checked":"",attrs:{checked:!!t.user.pushs},on:{change:function(e){arguments[0]=e=t.$handleEvent(e),t.pushs.apply(void 0,arguments)}}})],1),s("v-uni-view",{staticClass:"cu-form-group margin-top"},[s("v-uni-view",{staticClass:"title"},[t._v("システムサウンド")]),s("v-uni-switch",{class:t.user.voice?"checked":"",attrs:{checked:!!t.user.voice},on:{change:function(e){arguments[0]=e=t.$handleEvent(e),t.voice.apply(void 0,arguments)}}})],1),s("v-uni-view",{staticClass:"cu-form-group "},[s("v-uni-view",{staticClass:"title"},[t._v("システムの振動")]),s("v-uni-switch",{class:t.user.shock?"checked":"",attrs:{checked:!!t.user.shock},on:{change:function(e){arguments[0]=e=t.$handleEvent(e),t.shock.apply(void 0,arguments)}}})],1)],1)},i=[]},3371:function(t,e,s){"use strict";s.r(e);var n=s("1c6e"),a=s("09da");for(var i in a)"default"!==i&&function(t){s.d(e,t,(function(){return a[t]}))}(i);var c,u=s("f0c5"),r=Object(u["a"])(a["default"],n["b"],n["c"],!1,null,"7c2c1641",null,!1,n["a"],c);e["default"]=r.exports},dedb:function(t,e,s){"use strict";(function(t){var n=s("4ea4");Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0,s("96cf");var a=n(s("1da1")),i=n(s("5530")),c=s("2f62"),u={computed:(0,i.default)({},(0,c.mapState)(["user"])),methods:{loadData:function(e){var s=this;return(0,a.default)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:t.log("Fastadminユーザーデータテーブルを変更する必要があります。ネイティブバージョンを一時的に同期することはできません。"),uni.setStorageSync("wanlshop:user",s.$store.state.user);case 2:case"end":return e.stop()}}),e)})))()},pushs:function(t){var e={pushs:t.target.value};this.$store.commit("user/setUserInfo",e),this.loadData(e)},voice:function(t){var e={voice:t.target.value};this.$store.commit("user/setUserInfo",e),this.loadData(e)},shock:function(t){var e={shock:t.target.value};this.$store.commit("user/setUserInfo",e),this.loadData(e)}}};e.default=u}).call(this,s("5a52")["default"])}}]);