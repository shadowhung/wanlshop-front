(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-user-service"],{"0229":function(t,i,e){var a=e("8ae1");"string"===typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);var n=e("4f06").default;n("1eff7a71",a,!0,{sourceMap:!1,shadowMode:!1})},"02d3":function(t,i,e){"use strict";var a=e("0229"),n=e.n(a);n.a},"4c86":function(t,i,e){"use strict";e.r(i);var a=e("d765"),n=e("8b3c");for(var s in n)"default"!==s&&function(t){e.d(i,t,(function(){return n[t]}))}(s);e("02d3");var o,c=e("f0c5"),r=Object(c["a"])(n["default"],a["b"],a["c"],!1,null,"abf10f8c",null,!1,a["a"],o);i["default"]=r.exports},"600d":function(t,i,e){"use strict";(function(t){var a=e("4ea4");e("4160"),e("d81d"),e("e25e"),e("ac1f"),e("5319"),e("159b"),Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0,e("96cf");var n=a(e("1da1")),s=e("27dc"),o={data:function(){return{user_id:this.$store.state.user.id,avatar:this.$store.state.user.avatar,nickname:this.$store.state.user.nickname,to_id:0,textMsg:"",scrollAnimation:!1,scrollTop:0,scrollToView:"",msgList:[],msgImgList:[],emptybottom:!1,isVoice:!1,voiceTis:"話し続ける",recordTis:"上にスワイプして送信をキャンセルします",recording:!1,willStop:!1,initPoint:{identifier:0,Y:0},recordTimer:null,recordLength:0,AUDIO:uni.createInnerAudioContext(),playMsgid:null,VoiceTimer:null,popupLayerClass:!1,hideMore:!0,TabCur:"デフォルト",hideEmoji:!0,emojiList:this.emojiData(),QnUrl:""}},onLoad:function(t){var i=this,e=uni.getStorageSync("wanlshop:user");this.user_id=e.id,this.avatar=e.avatar,this.username=e.username,this.nickname=e.nickname,this.loadData(),this.AUDIO.onEnded((function(t){i.playMsgid=null})),uni.$on("onService",this.onChat)},onShow:function(){this.scrollTop=9999999},methods:{loadData:function(){var t=this;return(0,n.default)(regeneratorRuntime.mark((function i(){return regeneratorRuntime.wrap((function(i){while(1)switch(i.prev=i.next){case 0:t.$api.post({url:"/wanlshop/chat/hello",data:{id:1,type:"service",form_id:t.user_id}});case 1:case"end":return i.stop()}}),i)})))()},sendMsg:function(t,i){var e=2;this.msgList.length&&(e=this.msgList[this.msgList.length-1].id,e++);var a={id:e,type:"service",to_id:this.to_id,form:{id:this.user_id,avatar:this.avatar,name:this.nickname},message:{type:i,content:t},createtime:parseInt((new Date).getTime()/1e3)};this.onChat(JSON.parse(JSON.stringify(a)),!0),this.$api.post({url:"/wanlshop/chat/service",data:a})},onChat:function(t,i){var e=this;i||(this.to_id=t.form.id,t.form.hasOwnProperty("name")&&this.$wanlshop.title(t.form.name)),"list"==t.message.type&&this.addListMsg(t),"article"==t.message.type&&this.addArticleMsg(t),"text"==t.message.type&&this.addTextMsg(t),"voice"==t.message.type&&this.addVoiceMsg(t),"img"==t.message.type&&this.addImgMsg(t),"end"==t.message.type&&this.$wanlshop.msg(t.message.content),this.$nextTick((function(){e.scrollToView="msg"+t.id}))},addListMsg:function(t){this.msgList.push(t)},addArticleMsg:function(t){this.msgList.push(t)},addTextMsg:function(t){t.message.content.text=this.replaceEmoji(t.message.content.text),this.msgList.push(t)},addVoiceMsg:function(t){this.msgList.push(t)},addImgMsg:function(t){t.message.content=this.setPicSize(t.message.content),this.msgImgList.push(t.message.content.url),this.msgList.push(t)},chooseImage:function(){this.getImage("album")},camera:function(){this.getImage("camera")},getImage:function(t){var i=this;this.hideDrawer(),uni.chooseImage({sourceType:[t],sizeType:["original","compressed"],success:function(t){i.$api.get({url:"/wanlshop/common/uploadData",success:function(e){for(var a=0;a<t.tempFilePaths.length;a++)uni.getImageInfo({src:t.tempFilePaths[a],success:function(t){i.$api.upload({url:e.uploadurl,filePath:t.path,name:"file",formData:"local"==e.storage?null:e.multipart,success:function(e){i.sendMsg({url:e.fullurl,w:t.width,h:t.height},"img")}})}})}})}})},sendText:function(){if(this.hideDrawer(),this.textMsg){var t={text:this.textMsg};this.sendMsg(t,"text"),this.textMsg=""}},aiSend:function(t){this.sendMsg({text:t},"text")},showPic:function(t){uni.previewImage({indicator:"none",current:t.content.url,urls:this.msgImgList})},playVoice:function(t){var i=this;this.playMsgid=t.id,this.AUDIO.src=t.content.url,this.$nextTick((function(){i.AUDIO.play()}))},voiceBegin:function(t){t.touches.length>1||(this.initPoint.Y=t.touches[0].clientY,this.initPoint.identifier=t.touches[0].identifier,this.RECORDER.start({format:"mp3"}))},recordBegin:function(t){var i=this;this.recording=!0,this.voiceTis="松開 終わり",this.recordLength=0,this.recordTimer=setInterval((function(){i.recordLength++}),1e3)},voiceCancel:function(){this.recording=!1,this.voiceTis="話し続ける",this.recordTis="上にスワイプして送信をキャンセルします",this.willStop=!0,this.RECORDER.stop()},voiceIng:function(t){if(this.recording){var i=t.touches[0];this.initPoint.Y-i.clientY>=uni.upx2px(200)?(this.willStop=!0,this.recordTis="指を離して送信をキャンセルします"):(this.willStop=!1,this.recordTis="上にスワイプして送信をキャンセルします")}},voiceEnd:function(t){this.recording&&(this.recording=!1,this.voiceTis="話し続ける",this.recordTis="上にスワイプして送信をキャンセルします",this.RECORDER.stop())},recordEnd:function(i){var e=this;clearInterval(this.recordTimer),this.willStop?t.log("録音の送信をキャンセルする"):(this.$api.get({url:"/wanlshop/common/uploadData",success:function(t){e.$api.upload({url:t.uploadurl,filePath:i.tempFilePath,name:"file",formData:"local"==t.storage?null:t.multipart,success:function(t){var i={length:0,url:t.fullurl};i.length=e.recordLength%60,i.length>0&&e.sendMsg(i,"voice")}})}}),t.log("録音終了")),this.willStop=!1},switchVoice:function(){this.hideDrawer(),this.isVoice=!this.isVoice},emojiData:function(){var t={},i=[],e={};return s.forEach((function(a){var n=a.category.length>0?a.category:"デフォルト";t[n]||(t[n]=[],i.push(n)),t[n].push(a),e[a.phrase]=a.icon})),{groups:t,categories:i,map:e}},replaceEmoji:function(t){var i=this,e=t.replace(/\[([^(\]|\[)]*)\]/g,(function(t,e){return'<img src="'+i.emojiList.map[t]+'" width="18rpx">'}));return e.replace(/(\r\n)|(\n)/g,"<br>")},tabSelect:function(t){this.TabCur=t.currentTarget.dataset.id},setPicSize:function(t){var i=uni.upx2px(350),e=uni.upx2px(350);if(t.w>i||t.h>e){var a=t.w/t.h;t.w=a>1?i:e*a,t.h=a>1?i/a:e}return t},showMore:function(){this.isVoice=!1,this.hideEmoji=!0,this.hideMore?(this.hideMore=!1,this.openDrawer()):this.hideDrawer()},openDrawer:function(){this.emptybottom=!0,this.popupLayerClass=!0},hideDrawer:function(){var t=this;this.emptybottom=!1,this.popupLayerClass=!1,setTimeout((function(){t.hideMore=!0,t.hideEmoji=!0}),150)},chooseEmoji:function(){this.hideMore=!0,this.hideEmoji?(this.hideEmoji=!1,this.openDrawer()):this.hideDrawer()},addEmoji:function(t){this.textMsg+=t},textareaFocus:function(){this.emptybottom=!0,this.popupLayerClass&&0==this.hideMore&&this.hideDrawer()},textareaBlur:function(){this.emptybottom=!1},discard:function(){}}};i.default=o}).call(this,e("5a52")["default"])},"8ae1":function(t,i,e){var a=e("24fb");i=a(!1),i.push([t.i,'.cu-chat .cu-item>.main[data-v-abf10f8c]{margin:0 %?20?%}.cu-chat .cu-item > .main .content[data-v-abf10f8c]:after{width:0;height:0}.cu-chat .cu-item > .main .content[data-v-abf10f8c]{font-size:%?30?%;border-radius:%?10?% %?30?% %?30?% %?30?%}.cu-chat .cu-item.self > .main .content[data-v-abf10f8c]{border-radius:%?30?% %?10?% %?30?% %?30?%}.cu-chat .cu-item > .main .content .article[data-v-abf10f8c]{margin-top:%?10?%;padding-top:%?10?%;width:100%;overflow:hidden}.cu-chat .cu-item > .main .content .list[data-v-abf10f8c]{width:100%;font-size:%?28?%}.cu-chat .cu-item > .main .content .list uni-text[data-v-abf10f8c]{color:#ff6a00}.cu-chat .cu-item > .main .content .list .ai[data-v-abf10f8c]{padding:%?16?% 0;margin:%?16?% 0;line-height:1.5}.cu-chat .cu-item [class*="wlIcon-"][data-v-abf10f8c]{font-size:%?34?%}.opmenu[data-v-abf10f8c]{display:flex;margin-top:%?2?%;color:#4c4c4c}.opmenu .box[data-v-abf10f8c]{padding-top:%?35?%;padding-left:%?50?%;text-align:center}.opmenu .box .icon[data-v-abf10f8c]{height:%?130?%;width:%?130?%;display:flex;align-items:center;justify-content:center;justify-items:center;background-color:#fff;border-radius:%?20?%;font-size:%?70?%;margin-bottom:%?10?%}.hidden[data-v-abf10f8c]{display:none!important}.popup-layer[data-v-abf10f8c]{transition:all .15s linear;width:100%;height:%?480?%;background-color:#f7f7fa;position:fixed;z-index:2000;top:100%}.popup-layer.showLayer[data-v-abf10f8c]{-webkit-transform:translate3d(0,%?-480?%,0);transform:translate3d(0,%?-480?%,0)}.popup-layer .emoji .emojinav[data-v-abf10f8c]{background-color:#f8f8f8}.popup-layer .emoji .emojinav .item[data-v-abf10f8c]{display:flex;align-items:center;height:%?100?%;padding-left:%?10?%}.popup-layer .emoji .emojinav .item .emojibg[data-v-abf10f8c]{background-color:#dedede}.popup-layer .emoji .emojinav .item > uni-view[data-v-abf10f8c]{margin:0 %?25?%;width:%?60?%;height:%?60?%;border-radius:%?18?%;background-repeat:no-repeat;background-size:80%;background-position:50%}.popup-layer .emoji .subject[data-v-abf10f8c]{height:%?380?%;background-color:#f1f1f1}.popup-layer .emoji .subject .item[data-v-abf10f8c]{padding:%?25?%}.popup-layer .emoji .subject .item > uni-view[data-v-abf10f8c]{background-repeat:no-repeat;background-size:56%;background-position:50%;width:12.5%;height:%?100?%}.input-box[data-v-abf10f8c]{width:100%;min-height:%?100?%;padding-bottom:env(safe-area-inset-bottom);background-color:#f7f7fa;display:flex;align-items:flex-end;position:fixed;z-index:2000;bottom:%?-2?%;transition:all .15s linear}.input-box [class*="wlIcon-"][data-v-abf10f8c]{font-size:%?50?%;color:#4c4c4c}.input-box .wlIcon-zhifeiji[data-v-abf10f8c]{color:#fe6600}.input-box.showLayer[data-v-abf10f8c]{-webkit-transform:translate3d(0,%?-480?%,0);transform:translate3d(0,%?-480?%,0)}.input-box .voice[data-v-abf10f8c],\n.input-box .more[data-v-abf10f8c]{flex-shrink:0;width:%?90?%;height:%?100?%;display:flex;justify-content:center;align-items:center}.input-box .send[data-v-abf10f8c]{flex-shrink:0;width:%?90?%;height:%?100?%;display:flex;justify-content:center;align-items:center}.input-box .send .btn[data-v-abf10f8c]{width:%?110?%;height:%?70?%;display:flex;justify-content:center;align-items:center;border-radius:%?16?%;font-size:%?32?%}.input-box .textbox[data-v-abf10f8c]{width:100%}.input-box .textbox .voice-mode[data-v-abf10f8c]{width:calc(100% - %?2?%);height:%?80?%;margin:%?10?% 0;border-radius:%?16?%;display:flex;justify-content:center;align-items:center;font-size:%?28?%;background-color:#fff;color:#555}.input-box .textbox .voice-mode.recording[data-v-abf10f8c]{background-color:#e5e5e5}.input-box .textbox .text-mode[data-v-abf10f8c]{width:100%;min-height:%?80?%;margin:%?10?% 0;display:flex;background-color:#fff;border-radius:%?16?%}.input-box .textbox .text-mode .box[data-v-abf10f8c]{width:100%;padding-left:%?30?%;min-height:%?80?%;display:flex;align-items:center}.input-box .textbox .text-mode .box uni-textarea[data-v-abf10f8c]{width:100%}.input-box .textbox .text-mode .em[data-v-abf10f8c]{flex-shrink:0;width:%?80?%;padding-left:%?10?%;height:%?80?%;display:flex;justify-content:center;align-items:center}.record[data-v-abf10f8c]{width:39vw;height:39vw;position:fixed;top:35%;left:30%;background-color:rgba(0,0,0,.8);border-radius:%?40?%}.record .ing[data-v-abf10f8c]{width:100%;height:30vw;display:flex;justify-content:center;align-items:center}@-webkit-keyframes volatility-data-v-abf10f8c{0%{background-position:0 130%}20%{background-position:0 150%}30%{background-position:0 155%}40%{background-position:0 160%}50%{background-position:0 145%}70%{background-position:0 150%}80%{background-position:0 170%}90%{background-position:0 160%}100%{background-position:0 135%}}@keyframes volatility-data-v-abf10f8c{0%{background-position:0 130%}20%{background-position:0 150%}30%{background-position:0 155%}40%{background-position:0 160%}50%{background-position:0 145%}70%{background-position:0 150%}80%{background-position:0 170%}90%{background-position:0 160%}100%{background-position:0 135%}}.record .ing [class*="wlIcon"][data-v-abf10f8c]{background-image:linear-gradient(180deg,#fff,#565656 50%);background-size:100% 200%;-webkit-animation:volatility-data-v-abf10f8c 1.5s ease-in-out -1.5s infinite alternate;animation:volatility-data-v-abf10f8c 1.5s ease-in-out -1.5s infinite alternate;-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:%?140?%;padding-top:%?40?%;color:#f09b37}.record .cancel[data-v-abf10f8c]{width:100%;height:30vw;display:flex;justify-content:center;align-items:center}.record .cancel [class*="wlIcon"][data-v-abf10f8c]{color:#fff;font-size:%?150?%}.record .tis[data-v-abf10f8c]{width:100%;height:10vw;display:flex;justify-content:center;font-size:%?24?%;color:#fff}.record .tis.change[data-v-abf10f8c]{color:#f09b37}.content[data-v-abf10f8c]{width:100%}.content .msg-list[data-v-abf10f8c],\n.cu-chat[data-v-abf10f8c]{position:absolute;top:0;bottom:%?100?%;bottom:calc(env(safe-area-inset-bottom) + %?100?%)}.loading[data-v-abf10f8c]{display:flex;justify-content:center}@-webkit-keyframes stretchdelay-data-v-abf10f8c{0%,\n\t40%,\n\t100%{-webkit-transform:scaleY(.6);transform:scaleY(.6)}20%{-webkit-transform:scaleY(1);transform:scaleY(1)}}@keyframes stretchdelay-data-v-abf10f8c{0%,\n\t40%,\n\t100%{-webkit-transform:scaleY(.6);transform:scaleY(.6)}20%{-webkit-transform:scaleY(1);transform:scaleY(1)}}.loading .spinner[data-v-abf10f8c]{margin:%?20?% 0;width:%?60?%;height:%?100?%;display:flex;align-items:center;justify-content:space-between}.loading .spinner uni-view[data-v-abf10f8c]{background-color:#dadada;height:%?50?%;width:%?6?%;border-radius:%?6?%;-webkit-animation:stretchdelay-data-v-abf10f8c 1.2s infinite ease-in-out;animation:stretchdelay-data-v-abf10f8c 1.2s infinite ease-in-out}.loading .spinner .rect2[data-v-abf10f8c]{-webkit-animation-delay:-1.1s;animation-delay:-1.1s}.loading .spinner .rect3[data-v-abf10f8c]{-webkit-animation-delay:-1s;animation-delay:-1s}.loading .spinner .rect4[data-v-abf10f8c]{-webkit-animation-delay:-.9s;animation-delay:-.9s}.loading .spinner .rect5[data-v-abf10f8c]{-webkit-animation-delay:-.8s;animation-delay:-.8s}.emptybottom[data-v-abf10f8c]{padding-bottom:0!important}',""]),t.exports=i},"8b3c":function(t,i,e){"use strict";e.r(i);var a=e("600d"),n=e.n(a);for(var s in a)"default"!==s&&function(t){e.d(i,t,(function(){return a[t]}))}(s);i["default"]=n.a},d765:function(t,i,e){"use strict";var a;e.d(i,"b",(function(){return n})),e.d(i,"c",(function(){return s})),e.d(i,"a",(function(){return a}));var n=function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("v-uni-view",{staticClass:"wanl-chat"},[e("v-uni-view",{on:{touchstart:function(i){arguments[0]=i=t.$handleEvent(i),t.hideDrawer.apply(void 0,arguments)}}},[e("v-uni-scroll-view",{staticClass:"cu-chat",attrs:{"scroll-y":"true","scroll-with-animation":t.scrollAnimation,"scroll-top":t.scrollTop,"scroll-into-view":t.scrollToView,"upper-threshold":"50"}},t._l(t.msgList,(function(i,a){return e("v-uni-view",{key:a,attrs:{id:"msg"+i.id}},[i.form.id==t.user_id?e("v-uni-view",{staticClass:"cu-item self"},["text"==i.message.type?e("v-uni-view",{staticClass:"main"},[e("v-uni-view",{staticClass:"content bg-green"},[e("v-uni-rich-text",{attrs:{nodes:i.message.content.text}})],1)],1):t._e(),"img"==i.message.type?e("v-uni-view",{staticClass:"main"},[e("v-uni-image",{style:{width:i.message.content.w+"px",height:i.message.content.h+"px"},attrs:{src:i.message.content.url},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.showPic(i.message)}}})],1):t._e(),"voice"==i.message.type?e("v-uni-view",{staticClass:"main",class:t.playMsgid==i.message.id?"play":"",on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.playVoice(i.message)}}},[e("v-uni-view",{staticClass:"action text-bold text-grey",staticStyle:{"padding-right":"2rpx"}},[t._v(t._s(i.message.content.length)),e("v-uni-text",{staticClass:"wlIcon-miao"})],1),e("v-uni-view",{staticClass:"content bg-green"},[e("v-uni-text",{style:{width:6*i.message.content.length+"rpx"}}),e("v-uni-text",{staticClass:"wlIcon-yuyinyou text-xxl padding-left-xl"})],1)],1):t._e(),e("v-uni-view",{staticClass:"cu-avatar round",style:{backgroundImage:"url("+t.$wanlshop.oss(i.form.avatar,44,44,2,"avatar")+")"}})],1):e("v-uni-view",{staticClass:"cu-item"},[i.form.avatar?e("v-uni-view",{staticClass:"cu-avatar round",style:{backgroundImage:"url("+t.$wanlshop.oss(i.form.avatar)+")"}}):e("v-uni-view",{staticClass:"cu-avatar round",style:{backgroundImage:"url("+t.$wanlshop.appstc("/common/logo.png")+")"}}),"text"==i.message.type?e("v-uni-view",{staticClass:"main"},[e("v-uni-view",{staticClass:"content"},[e("v-uni-rich-text",{attrs:{nodes:i.message.content.text}})],1)],1):t._e(),"list"==i.message.type?e("v-uni-view",{staticClass:"main"},[e("v-uni-view",{staticClass:"content"},[e("v-uni-view",{staticClass:"list"},[i.message.content.length>0?e("v-uni-view",[e("v-uni-view",[t._v("聞きたいですか？"),e("v-uni-view",{staticClass:"ai solid-top solid-bottom"},t._l(i.message.content,(function(i,a){return e("v-uni-view",{key:i.id,staticClass:"text-cut",on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.aiSend(i.keywords?i.keywords:"キーワードが設定されていません")}}},[e("v-uni-text",[t._v(t._s(i.title))])],1)})),1)],1),e("v-uni-view",[t._v("どちらでもない？ あなたはできる"),e("v-uni-text",{on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.aiSend("手動カスタマーサービス")}}},[t._v("ここをクリック")]),t._v("，または返信人工的な")],1)],1):e("v-uni-view",[t._v("関連するヘルプコンテンツはありません，"),e("v-uni-text",{on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.aiSend("手動カスタマーサービス")}}},[t._v("ここをクリック")]),t._v("または返信人工的な")],1)],1)],1)],1):t._e(),"article"==i.message.type?e("v-uni-view",{staticClass:"main",on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.onDetails(i.message.content.id,i.message.content.title)}}},[e("v-uni-view",{staticClass:"content"},[e("v-uni-view",{staticStyle:{width:"100%"}},[e("v-uni-view",[t._v(t._s(i.message.content.title))]),e("v-uni-view",{staticClass:"article solid-top"},[e("v-uni-rich-text",{attrs:{nodes:i.message.content.content}})],1)],1)],1)],1):t._e(),"img"==i.message.type?e("v-uni-view",{staticClass:"main"},[e("v-uni-image",{style:{width:i.message.content.w+"px",height:i.message.content.h+"px"},attrs:{src:i.message.content.url},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.showPic(i.message)}}})],1):t._e(),e("v-uni-view",{staticClass:"date"},[t._v(t._s(t.$wanlshop.timeToChat(i.createtime)))])],1)],1)})),1)],1),e("v-uni-view",{staticClass:"popup-layer",class:{showLayer:t.popupLayerClass},on:{touchmove:function(i){i.stopPropagation(),i.preventDefault(),arguments[0]=i=t.$handleEvent(i),t.discard.apply(void 0,arguments)}}},[e("v-uni-view",{class:{hidden:t.hideEmoji}},[e("v-uni-view",{staticClass:"emoji"},[e("v-uni-scroll-view",{staticClass:"emojinav",attrs:{"scroll-x":!0,"scroll-with-animation":!0}},[e("v-uni-view",{staticClass:"item"},t._l(t.emojiList.categories,(function(i,a){return e("v-uni-view",{key:a,class:i==t.TabCur?"emojibg":"",style:{backgroundImage:"url("+t.emojiList.groups[i][0].url+")"},attrs:{"data-id":i},on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.tabSelect.apply(void 0,arguments)}}})})),1)],1),t._l(t.emojiList.groups,(function(i,a){return t.TabCur==a?e("v-uni-scroll-view",{key:a,staticClass:"subject",attrs:{"scroll-y":!0,"scroll-with-animation":!0}},[e("v-uni-view",{staticClass:"item grid margin-bottom text-center col-5"},t._l(i,(function(i,a){return e("v-uni-view",{key:a,style:{backgroundImage:"url("+i.url+")"},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.addEmoji(i.value)}}})})),1)],1):t._e()}))],2)],1),e("v-uni-view",{staticClass:"solid-top",class:{hidden:t.hideMore}},[e("v-uni-view",{staticClass:"opmenu solid-top"},[e("v-uni-view",{staticClass:"box",on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.chooseImage.apply(void 0,arguments)}}},[e("v-uni-view",{staticClass:"icon"},[e("v-uni-text",{staticClass:"wlIcon-tupian1"})],1),e("v-uni-text",{staticClass:"text-sm"},[t._v("写真")])],1)],1)],1)],1),e("v-uni-view",{staticClass:"input-box",class:{emptybottom:t.emptybottom,showLayer:t.popupLayerClass},on:{touchmove:function(i){i.stopPropagation(),i.preventDefault(),arguments[0]=i=t.$handleEvent(i),t.discard.apply(void 0,arguments)}}},[e("v-uni-view",{staticClass:"more",on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.showMore.apply(void 0,arguments)}}},[e("v-uni-view",{staticClass:"wlIcon-yuanquanjiahao"})],1),e("v-uni-view",{staticClass:"textbox"},[e("v-uni-view",{staticClass:"voice-mode",class:[t.isVoice?"":"hidden",t.recording?"recording":""],on:{touchstart:function(i){arguments[0]=i=t.$handleEvent(i),t.voiceBegin.apply(void 0,arguments)},touchmove:function(i){i.stopPropagation(),i.preventDefault(),arguments[0]=i=t.$handleEvent(i),t.voiceIng.apply(void 0,arguments)},touchend:function(i){arguments[0]=i=t.$handleEvent(i),t.voiceEnd.apply(void 0,arguments)},touchcancel:function(i){arguments[0]=i=t.$handleEvent(i),t.voiceCancel.apply(void 0,arguments)}}},[t._v(t._s(t.voiceTis))]),e("v-uni-view",{staticClass:"text-mode",class:t.isVoice?"hidden":""},[e("v-uni-view",{staticClass:"box"},[e("v-uni-textarea",{attrs:{"auto-height":"true",maxlength:"300","show-confirm-bar":!1,"cursor-spacing":"90"},on:{focus:function(i){arguments[0]=i=t.$handleEvent(i),t.textareaFocus.apply(void 0,arguments)},blur:function(i){arguments[0]=i=t.$handleEvent(i),t.textareaBlur.apply(void 0,arguments)},confirm:function(i){arguments[0]=i=t.$handleEvent(i),t.sendText.apply(void 0,arguments)}},model:{value:t.textMsg,callback:function(i){t.textMsg=i},expression:"textMsg"}})],1),e("v-uni-view",{staticClass:"em",on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.chooseEmoji.apply(void 0,arguments)}}},[e("v-uni-view",{staticClass:"wlIcon-biaoqing2"})],1)],1)],1),e("v-uni-view",{staticClass:"send",class:t.isVoice?"hidden":"",on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.sendText.apply(void 0,arguments)}}},[t.textMsg?e("v-uni-text",{staticClass:"wlIcon-zhifeiji"}):e("v-uni-text",{staticClass:"wlIcon-fasong"})],1)],1),e("v-uni-view",{staticClass:"record",class:t.recording?"":"hidden"},[e("v-uni-view",{staticClass:"ing",class:t.willStop?"hidden":""},[e("v-uni-view",{staticClass:"wlIcon-huatong01"})],1),e("v-uni-view",{staticClass:"cancel",class:t.willStop?"":"hidden"},[e("v-uni-view",{staticClass:"wlIcon-shanchu2"})],1),e("v-uni-view",{staticClass:"tis",class:t.willStop?"change":""},[t._v(t._s(t.recordTis))])],1)],1)},s=[]}}]);