(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-user-auth-thirdreg"],{"0a28":function(e,t,a){var n=a("6fcd");"string"===typeof n&&(n=[[e.i,n,""]]),n.locals&&(e.exports=n.locals);var r=a("4f06").default;r("52fcb858",n,!0,{sourceMap:!1,shadowMode:!1})},"39c7":function(e,t,a){"use strict";a.r(t);var n=a("8017"),r=a.n(n);for(var i in n)"default"!==i&&function(e){a.d(t,e,(function(){return n[e]}))}(i);t["default"]=r.a},6595:function(e,t,a){"use strict";a.r(t);var n=a("b91f"),r=a("39c7");for(var i in r)"default"!==i&&function(e){a.d(t,e,(function(){return r[e]}))}(i);a("ca7b");var o,s=a("f0c5"),u=Object(s["a"])(r["default"],n["b"],n["c"],!1,null,"3b32efe0",null,!1,n["a"],o);t["default"]=u.exports},"6fcd":function(e,t,a){var n=a("24fb");t=n(!1),t.push([e.i,"uni-page-body[data-v-3b32efe0]{background-color:#fff}.wanl-title[data-v-3b32efe0]{padding-bottom:%?130?%;padding-top:%?170?%;font-size:%?68?%}.wanl-title .titleInfo[data-v-3b32efe0]{font-size:%?56?%}.wanl-weixin-btn-info[data-v-3b32efe0]{color:#b8b8b8!important}.auth[data-v-3b32efe0]{margin:0 %?60?%}.auth-group[data-v-3b32efe0]{padding:%?1?% %?30?%;display:flex;align-items:center;min-height:%?90?%;justify-content:space-between;margin-bottom:%?25?%}.auth-group uni-input[data-v-3b32efe0]{flex:1;font-size:%?33?%;color:#250f00;padding-right:%?20?%}.auth-group .placeholder[data-v-3b32efe0]{color:#b3b3b3}.auth-button[data-v-3b32efe0]{padding:%?25?% 0 %?50?% 0}.auth-button .cu-btn[data-v-3b32efe0]{height:%?90?%}.text-center[data-v-3b32efe0]{color:#3f2f21\n}.auth-clause[data-v-3b32efe0]{font-size:%?25?%;color:#909090}.auth-clause uni-text[data-v-3b32efe0]{margin:0 %?10?%;color:#ed6d0f}.auth-foot[data-v-3b32efe0]{position:fixed;width:100%;bottom:0;z-index:1024;padding:0 %?60?%;padding-bottom:calc(env(safe-area-inset-bottom) / 2)}.auth-foot .oauth[data-v-3b32efe0]{display:flex;flex-wrap:wrap;align-items:center;min-height:%?160?%;justify-content:space-around}.auth-foot .oauth uni-view[data-v-3b32efe0]{border:%?2?% solid #fcf7e9}.auth-foot .menu[data-v-3b32efe0]{display:flex;align-items:center;justify-content:center;margin-bottom:%?100?%;color:#3f2f21;line-height:%?28?%;font-size:%?28?%}.auth-foot uni-text[data-v-3b32efe0]{width:%?180?%;text-align:center}.auth-foot uni-text[data-v-3b32efe0]:nth-child(2){border-left:1px solid #ececec}\r\n\r\n/* 驗證碼 */.auth-title[data-v-3b32efe0]{padding-bottom:%?30?%;padding-top:%?170?%;font-size:%?60?%}.auth-mobile[data-v-3b32efe0]{color:#9a9a9a;padding-bottom:%?80?%}.auth-mobile uni-text[data-v-3b32efe0]{margin-left:%?10?%}.codes[data-v-3b32efe0]{display:flex;justify-content:space-around;flex-direction:row}.codes uni-input[data-v-3b32efe0]{background:#fff;border-bottom:1px solid #c3c3c3;width:%?90?%;height:%?90?%;text-align:center}.codes .input[data-v-3b32efe0]{display:flex;justify-content:center;align-items:center;background:#fff;border-bottom:1px solid #c3c3c3;width:%?90?%;height:%?90?%;font-size:%?40?%;font-weight:500;color:#333}.codes .input .shining[data-v-3b32efe0]{border:1px solid #ed6d0f;height:%?50?%;animation:shining-data-v-3b32efe0 1s linear infinite;\r\n\t/* 其它瀏覽器兼容性前缀 */-webkit-animation:shining-data-v-3b32efe0 1s linear infinite;-moz-animation:shining-data-v-3b32efe0 1s linear infinite;-ms-animation:shining-data-v-3b32efe0 1s linear infinite;-o-animation:shining-data-v-3b32efe0 1s linear infinite}.codes .active[data-v-3b32efe0]{border-bottom:1px solid #ed6d0f;caret-color:#ed6d0f}.oneline-codes uni-input[data-v-3b32efe0]{text-align:center}.auth-again[data-v-3b32efe0]{padding-top:%?50?%}.auth-again uni-text[data-v-3b32efe0]{color:#ed6d0f;margin-right:%?40?%}.auth-again .time[data-v-3b32efe0]{color:#9a9a9a}@-webkit-keyframes shining-data-v-3b32efe0{0%{opacity:1}50%{opacity:1}50.01%{opacity:0}100%{opacity:0}}.wlIcon-QQ[data-v-3b32efe0]{color:#12b8f6}.wlIcon-WeChat[data-v-3b32efe0]{color:#02dc6b}.wlIcon-WeiBo[data-v-3b32efe0]{color:#d32820}.wlIcon-Xiaomi[data-v-3b32efe0]{color:#ff6b00}body.?%PAGE?%[data-v-3b32efe0]{background-color:#fff}",""]),e.exports=t},8017:function(e,t,a){"use strict";var n=a("4ea4");a("99af"),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=n(a("ccbb")),i={data:function(){return{userInfo:[],submitDisabled:!0,pageroute:""}},onLoad:function(e){this.userInfo=e,this.pageroute=e.url},methods:{onKeyInput:function(e){this.submitDisabled=!1},formSubmit:function(e){var t=[{name:"mobile",checkType:"phoneno",errorMsg:"正しい携帯電話番号を入力してください"}],a=e.detail.value,n=r.default.check(a,t);n?this.$wanlshop.to("validcode?event=binding&mobile=".concat(e.detail.value.mobile,"&url=").concat(this.pageroute)):this.$wanlshop.msg(r.default.error)},register:function(){this.$wanlshop.to("register?url=".concat(this.pageroute))},help:function(){this.$wanlshop.to("/pages/user/help?url=".concat(this.pageroute))}}};t.default=i},b91f:function(e,t,a){"use strict";var n;a.d(t,"b",(function(){return r})),a.d(t,"c",(function(){return i})),a.d(t,"a",(function(){return n}));var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-uni-view",[a("v-uni-view",{staticClass:"auth"},[a("v-uni-view",{staticClass:"wanl-title"},[a("v-uni-view",[e._v(e._s(e.userInfo.nickName)+"，こんにちは")]),a("v-uni-view",{staticClass:"titleInfo"},[e._v("携帯電話番号をバインドしてください...")])],1),a("v-uni-form",{on:{submit:function(t){arguments[0]=t=e.$handleEvent(t),e.formSubmit.apply(void 0,arguments)}}},[a("v-uni-view",{staticClass:"auth-group radius-bock bg-gray wlian-grey-light"},[a("v-uni-input",{attrs:{placeholder:"携帯電話番号を入力してください",type:"number",maxlength:"15","confirm-type":"next","placeholder-class":"placeholder",name:"mobile"},on:{input:function(t){arguments[0]=t=e.$handleEvent(t),e.onKeyInput.apply(void 0,arguments)}}})],1),a("v-uni-view",{staticClass:"auth-button flex flex-direction"},[a("v-uni-button",{staticClass:"cu-btn bg-orange sl radius-bock",attrs:{"form-type":"submit",disabled:e.submitDisabled}},[e._v("確認コードを取得する")])],1)],1)],1),a("v-uni-view",{staticClass:"auth-foot"},[a("v-uni-view",{staticClass:"menu text-grey"},[a("v-uni-text",{on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.register.apply(void 0,arguments)}}},[e._v("登録")]),a("v-uni-text",{on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.help.apply(void 0,arguments)}}},[e._v("助けて")])],1)],1)],1)},i=[]},ca7b:function(e,t,a){"use strict";var n=a("0a28"),r=a.n(n);r.a},ccbb:function(e,t,a){a("c975"),a("a9e3"),a("4d63"),a("ac1f"),a("25f0"),a("1276"),e.exports={error:"",check:function(e,t){for(var a=0;a<t.length;a++){if(!t[a].checkType)return!0;if(!t[a].name)return!0;if(!t[a].errorMsg)return!0;if(!e[t[a].name])return this.error=t[a].errorMsg,!1;switch(t[a].checkType){case"string":var n=new RegExp("^.{"+t[a].checkRule+"}$");if(!n.test(e[t[a].name]))return this.error=t[a].errorMsg,!1;break;case"int":n=new RegExp("^(-[1-9]|[1-9])[0-9]{"+t[a].checkRule+"}$");if(!n.test(e[t[a].name]))return this.error=t[a].errorMsg,!1;break;case"between":if(!this.isNumber(e[t[a].name]))return this.error=t[a].errorMsg,!1;var r=t[a].checkRule.split(",");if(r[0]=Number(r[0]),r[1]=Number(r[1]),e[t[a].name]>r[1]||e[t[a].name]<r[0])return this.error=t[a].errorMsg,!1;break;case"betweenD":n=/^-?[1-9][0-9]?$/;if(!n.test(e[t[a].name]))return this.error=t[a].errorMsg,!1;r=t[a].checkRule.split(",");if(r[0]=Number(r[0]),r[1]=Number(r[1]),e[t[a].name]>r[1]||e[t[a].name]<r[0])return this.error=t[a].errorMsg,!1;break;case"betweenF":n=/^-?[0-9][0-9]?.+[0-9]+$/;if(!n.test(e[t[a].name]))return this.error=t[a].errorMsg,!1;r=t[a].checkRule.split(",");if(r[0]=Number(r[0]),r[1]=Number(r[1]),e[t[a].name]>r[1]||e[t[a].name]<r[0])return this.error=t[a].errorMsg,!1;break;case"same":if(e[t[a].name]!=t[a].checkRule)return this.error=t[a].errorMsg,!1;break;case"notsame":if(e[t[a].name]==t[a].checkRule)return this.error=t[a].errorMsg,!1;break;case"email":n=/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;if(!n.test(e[t[a].name]))return this.error=t[a].errorMsg,!1;break;case"phoneno":n=/^[0-9]{8,15}$/;if(!n.test(e[t[a].name]))return this.error=t[a].errorMsg,!1;break;case"zipcode":n=/^[0-9]{6}$/;if(!n.test(e[t[a].name]))return this.error=t[a].errorMsg,!1;break;case"reg":n=new RegExp(t[a].checkRule);if(!n.test(e[t[a].name]))return this.error=t[a].errorMsg,!1;break;case"in":if(-1==t[a].checkRule.indexOf(e[t[a].name]))return this.error=t[a].errorMsg,!1;break;case"notnull":if(null==e[t[a].name]||e[t[a].name].length<1)return this.error=t[a].errorMsg,!1;break}}return!0},isNumber:function(e){var t=/^-?[1-9][0-9]?.?[0-9]*$/;return t.test(e)}}}}]);