(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-user-complaint-complaint"],{3531:function(t,a,n){var e=n("24fb");a=e(!1),a.push([t.i,".complaint-title[data-v-14cad246]{display:flex;flex-direction:row;justify-content:space-between;align-items:center;padding:%?20?% %?25?%;color:#666}.complaint-star-view.complaint-title[data-v-14cad246]{justify-content:flex-start;margin:0}.cu-form-group uni-picker .picker[data-v-14cad246]{text-align:left}.solids[data-v-14cad246]::after{border:2px dashed #c5c5c5}.wanlian.cu-bar.tabbar[data-v-14cad246]{background-color:initial}.wanlian.cu-bar.tabbar .cu-btn[data-v-14cad246]{width:calc(100% - %?50?%)}.wanlian.cu-bar.tabbar .cu-btn.lg[data-v-14cad246]{font-size:%?32?%;height:%?86?%}",""]),t.exports=a},"3c23":function(t,a,n){"use strict";var e;n.d(a,"b",(function(){return i})),n.d(a,"c",(function(){return c})),n.d(a,"a",(function(){return e}));var i=function(){var t=this,a=t.$createElement,n=t._self._c||a;return n("v-uni-view",[n("v-uni-view",{staticClass:"edgeInsetTop"}),n("v-uni-view",{staticClass:"complaint-title"},[n("v-uni-view",[t._v("報告書"+t._s(t.typeName)+"理由")]),n("v-uni-view",{staticClass:"complaint-quick text-red"},[n("v-uni-text",{staticClass:"margin-right-xs"},[t._v(t._s(t.typeName)+"ID:"+t._s(t.complaintId))])],1)],1),n("v-uni-view",{staticClass:"cu-form-group"},[n("v-uni-picker",{attrs:{value:t.complaint.reason,range:t.picker},on:{change:function(a){arguments[0]=a=t.$handleEvent(a),t.pickerChange.apply(void 0,arguments)}}},[n("v-uni-view",{staticClass:"picker"},[t._v(t._s(t.complaint.reason>-1?t.picker[t.complaint.reason]:"報告する理由を選択してください"))])],1)],1),n("v-uni-view",{staticClass:"complaint-title"},[n("v-uni-text",[t._v(t._s(t.typeName)+"レポートのスクリーンショット")])],1),n("v-uni-view",{staticClass:"cu-bar bg-white"},[n("v-uni-view",{staticClass:"action"},[t._v("写真をプレビューするにはクリックしてください")]),n("v-uni-view",{staticClass:"action"},[t._v(t._s(t.complaint.images.length)+"/8")])],1),n("v-uni-view",{staticClass:"cu-form-group"},[n("v-uni-view",{staticClass:"grid col-4 grid-square flex-sub"},[t._l(t.complaint.images,(function(a,e){return n("v-uni-view",{key:e,staticClass:"bg-img"},[n("v-uni-image",{attrs:{src:a,mode:"aspectFill"},on:{click:function(a){arguments[0]=a=t.$handleEvent(a),t.previewImage(t.complaint.images,e)}}}),n("v-uni-view",{staticClass:"cu-tag bg-red",on:{click:function(a){a.stopPropagation(),arguments[0]=a=t.$handleEvent(a),t.close(e)}}},[n("v-uni-text",{staticClass:"wlIcon-shanchu2"})],1)],1)})),t.complaint.images.length<8?n("v-uni-view",{staticClass:"solids",on:{click:function(a){arguments[0]=a=t.$handleEvent(a),t.chooseImg.apply(void 0,arguments)}}},[n("v-uni-text",{staticClass:"wlIcon-31paishe"})],1):t._e()],2)],1),n("v-uni-view",{staticClass:"complaint-title"},[n("v-uni-view",[t._v(t._s(t.typeName)+"レポートの詳細")])],1),n("v-uni-view",{staticClass:"cu-form-group"},[n("v-uni-textarea",{attrs:{maxlength:"-1","placeholder-class":"placeholder",placeholder:"レポートについて詳しく説明してください..."},model:{value:t.complaint.content,callback:function(a){t.$set(t.complaint,"content",a)},expression:"complaint.content"}})],1),n("v-uni-view",{staticClass:"wanlian cu-bar tabbar foot flex flex-direction"},[n("v-uni-button",{staticClass:"cu-btn wanl-bg-redorange lg",on:{click:function(a){arguments[0]=a=t.$handleEvent(a),t.submit.apply(void 0,arguments)}}},[t._v("レポートを開始する")])],1)],1)},c=[]},"5aa5":function(t,a,n){"use strict";var e=n("a03e"),i=n.n(e);i.a},"8d94":function(t,a,n){"use strict";n.r(a);var e=n("cb62"),i=n.n(e);for(var c in e)"default"!==c&&function(t){n.d(a,t,(function(){return e[t]}))}(c);a["default"]=i.a},a03e:function(t,a,n){var e=n("3531");"string"===typeof e&&(e=[[t.i,e,""]]),e.locals&&(t.exports=e.locals);var i=n("4f06").default;i("92fc7568",e,!0,{sourceMap:!1,shadowMode:!1})},b85c:function(t,a,n){"use strict";n("a4d3"),n("e01a"),n("d28b"),n("d3b7"),n("3ca3"),n("ddb0"),Object.defineProperty(a,"__esModule",{value:!0}),a.default=c;var e=i(n("06c5"));function i(t){return t&&t.__esModule?t:{default:t}}function c(t,a){var n;if("undefined"===typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(n=(0,e.default)(t))||a&&t&&"number"===typeof t.length){n&&(t=n);var i=0,c=function(){};return{s:c,n:function(){return i>=t.length?{done:!0}:{done:!1,value:t[i++]}},e:function(t){throw t},f:c}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,s=!0,l=!1;return{s:function(){n=t[Symbol.iterator]()},n:function(){var t=n.next();return s=t.done,t},e:function(t){l=!0,o=t},f:function(){try{s||null==n["return"]||n["return"]()}finally{if(l)throw o}}}}},cb62:function(t,a,n){"use strict";var e=n("4ea4");n("99af"),n("a434"),Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var i=e(n("b85c")),c={data:function(){return{index:-1,picker:["馴れ合い売買","詐欺","空のパッケージを受け取りました","偽造と著作権侵害","リーク情報","禁止事項","取引価格で取引されていません","未按約定時間發貨","ジャンクマーケティング","ポルノ情報","虚偽の情報","個人攻撃","違法な情報","詐欺情報"],complaintId:0,typeName:"",complaint:{type:0,complaint_user_id:0,complaint_shop_id:0,complaint_goods_id:0,images:[],content:"",reason:-1}}},onLoad:function(t){this.complaint.type=t.type,this.complaintId=t.id,0==t.type?(this.typeName="ユーザー",this.complaint.complaint_user_id=t.id):1==t.type?(this.typeName="商品",this.complaint.complaint_goods_id=t.id):2==t.type&&(this.typeName="ショップ",this.complaint.complaint_shop_id=t.id)},methods:{pickerChange:function(t){-1==t.detail.value?this.complaint.reason=0:this.complaint.reason=t.detail.value},chooseImg:function(){var t=this;uni.chooseImage({sourceType:["camera","album"],sizeType:"compressed",count:8-this.complaint.images.length,success:function(a){t.$api.get({url:"/wanlshop/common/uploadData",success:function(n){for(var e=0;e<a.tempFilePaths.length;e++)uni.getImageInfo({src:a.tempFilePaths[e],success:function(a){t.$api.upload({url:n.uploadurl,filePath:a.path,name:"file",formData:"local"==n.storage?null:n.multipart,success:function(a){t.complaint.images.push(a.fullurl)}})}})}})}})},close:function(t){this.complaint.images.splice(t,1)},previewImage:function(t,a){var n,e=[],c=(0,i.default)(t);try{for(c.s();!(n=c.n()).done;){var o=n.value;e=e.concat(this.$wanlshop.oss(o,500))}}catch(s){c.e(s)}finally{c.f()}uni.previewImage({urls:e,current:e[a],indicator:"number"})},submit:function(){var t=this;return-1==this.complaint.reason?(this.$wanlshop.msg("報告する理由を選択してください"),!1):this.complaint.content?void this.$api.post({url:"/wanlshop/complaint/add",data:this.complaint,success:function(a){t.$wanlshop.to("/pages/page/success?type=complaint")}}):(this.$wanlshop.msg("レポートの内容を記入してください"),!1)}}};a.default=c},d667:function(t,a,n){"use strict";n.r(a);var e=n("3c23"),i=n("8d94");for(var c in i)"default"!==c&&function(t){n.d(a,t,(function(){return i[t]}))}(c);n("5aa5");var o,s=n("f0c5"),l=Object(s["a"])(i["default"],e["b"],e["c"],!1,null,"14cad246",null,!1,e["a"],o);a["default"]=l.exports}}]);