(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-twshop-no_network"],{"057a":function(t,n,e){"use strict";e.r(n);var o=e("4ed0"),a=e("ab37");for(var i in a)"default"!==i&&function(t){e.d(n,t,(function(){return a[t]}))}(i);e("bdfc");var r,c=e("f0c5"),u=Object(c["a"])(a["default"],o["b"],o["c"],!1,null,"cae52120",null,!1,o["a"],r);n["default"]=u.exports},"0a58":function(t,n,e){t.exports=e.p+"static/img/network_default3x.021d3141.png"},"306e":function(t,n,e){var o=e("24fb");n=o(!1),n.push([t.i,"uni-page-body[data-v-cae52120]{background-color:#fff}.no_network[data-v-cae52120]{display:flex;align-items:center;justify-content:center;flex-direction:column;position:fixed;left:0;top:0;right:0;bottom:0;margin-bottom:%?200?%}.no_network uni-image[data-v-cae52120]{width:%?360?%}.no_network .cu-btn.lg[data-v-cae52120]{padding:0 %?50?%;font-size:%?28?%;height:%?70?%}body.?%PAGE?%[data-v-cae52120]{background-color:#fff}",""]),t.exports=n},"4ed0":function(t,n,e){"use strict";var o;e.d(n,"b",(function(){return a})),e.d(n,"c",(function(){return i})),e.d(n,"a",(function(){return o}));var a=function(){var t=this,n=t.$createElement,o=t._self._c||n;return o("v-uni-view",[o("v-uni-view",{staticClass:"no_network"},[o("v-uni-image",{attrs:{src:e("0a58"),mode:"widthFix"}}),o("v-uni-view",{staticClass:"text-30 text-gray margin-bottom margin-top-lg"},[t._v("ネットワークがありません。3G、4G、またはWIFIをオンにしてください")]),o("v-uni-button",{staticClass:"cu-btn round lg line-gray",on:{click:function(n){arguments[0]=n=t.$handleEvent(n),t.refresh.apply(void 0,arguments)}}},[t._v("ページの更新")])],1)],1)},i=[]},a53e:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var o={data:function(){return{number:0}},methods:{refresh:function(){var t=this;this.number+=1,uni.getNetworkType({success:function(n){"none"==n.networkType?5==t.number?uni.showModal({title:"促す",content:"おっと、何度も再描画した後、まだインターネットがありません。システムに直接入りますか？",success:function(n){n.confirm?(t.$wanlshop.on("/pages/twshop/index"),t.$store.dispatch("common/init")):n.cancel&&(t.number=0)}}):t.$wanlshop.msg("ネットワークを確認して、お待ちください"):(t.$wanlshop.on("/pages/twshop/index"),t.$store.dispatch("common/init"))}})}}};n.default=o},ab37:function(t,n,e){"use strict";e.r(n);var o=e("a53e"),a=e.n(o);for(var i in o)"default"!==i&&function(t){e.d(n,t,(function(){return o[t]}))}(i);n["default"]=a.a},bdfc:function(t,n,e){"use strict";var o=e("fdce"),a=e.n(o);a.a},fdce:function(t,n,e){var o=e("306e");"string"===typeof o&&(o=[[t.i,o,""]]),o.locals&&(t.exports=o.locals);var a=e("4f06").default;a("dc381cb6",o,!0,{sourceMap:!1,shadowMode:!1})}}]);