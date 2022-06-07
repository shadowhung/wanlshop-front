<template>
	<view class="wanl-goods">
		<!-- 導航條 -->
		<view class="cu-custom" :style="{ height: wanlsys.height + 'px' }">
			<view class="cu-bar fixed" :style="{ height: wanlsys.height + 'px', paddingTop: wanlsys.top + 'px' }">
				<view class="action" @tap="$wanlshop.back(1)"><text class="wlIcon-fanhui1"></text></view>
				<view class="search-form round">
					<text class="wlIcon-sousuo1 text-bold"></text>
					<swiper class="search-swiper placeholder" vertical autoplay circular interval="3000">
						<swiper-item @tap="productSearch('')">製品を検索する、カテゴリー</swiper-item>
					</swiper>
				</view>
				<view class="action">
					<!-- #ifndef MP -->
					<!--<text class="wlIcon-fenxiangcopy" @tap="showModal('share')"></text>-->
					<text class="wlIcon-liebiaomoshi" @tap="showModal('menu')"></text>
					<text class="wlIcon-31gouwuche" @tap="toCart"></text>
					<!-- #endif -->
				</view>
				
				<view class="bar-bg solid-bottom" :style="{ top: wanlsys.height + 'px', opacity: headerOpacity }">
					<scroll-view scroll-x class="nav">
						<view class="flex justify-around text-center">
							<view class="cu-item " :class="selectAnchor==index?'text-orange cur':''" v-for="(anchor, index) in anchorlist" :key="anchor.name" @tap="toAnchor(index)">
								{{ anchor.name }}
							</view>
						</view>
					</scroll-view>
				</view>
				<!-- 直播 -->
				<view class="wan-live" v-if="goodsData.isLive" @tap="onLive(goodsData.isLive.id)">
					<view class="tag shadow-blur" :style="{top:wanlsys.height + 47 + 'px' }">
						<view class="text-center">
							<view class="live">
								<view class="wanLive-icon"> </view>
							</view>
							<text class="text-white margin-lr-xs"> 住む </text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 商品主圖轮播 -->
		<view class="swiper-box" id="swiper">
			<swiper circular="true" autoplay="true" @change="swiperChange">
				<swiper-item v-for="(swiper, index) in goodsData.images" :key="index">
					<image :src="$wanlshop.oss(swiper, 400, 0)" @tap="preview2($wanlshop.oss(swiper, 400, 0))" mode="aspectFill"/>
				</swiper-item>
			</swiper>
			<view class="indicator">{{ currentSwiper + 1 }}/{{ goodsData.images.length }}</view>
		</view>
		<!-- 产品 -->
		<view class="bg-white">
			<!-- 普通 -->
			<view class="price margin-bottom-sm padding-lr-bj padding-top-bj align-start">
				<view>
					<view class="text-price wanl-orange text-xxl margin-right-xs">{{ goodsData.interval_price || '0' }}</view>
					<view class="text-sm wanl-gray text-dec">
						市場価格
						<text class="text-price margin-left-xs ">{{ goodsData.market_price || 0.0 }}</text>
					</view>
				</view>
				<view class="follow wanl-black" v-if="goodsData.follow" @tap="follow">
					<text class="wlIcon-yiguanzhu1 text-red"></text>
					<text class="text-xs">関所を取る</text>
				</view>
				<view class="follow wanl-black" v-else @tap="follow">
					<text class="wlIcon-gerenguanzhu"></text>
					<text class="text-xs">お気に入り</text>
				</view>
			</view>
			<view class="title padding-lr-bj padding-bottom-bj">
				<view class="name wanl-black text-lg">
					<view v-if="goodsData.shop.isself == 1" class="cu-tag radius margin-right-xs sm bg-red">自営業</view>
					{{ goodsData.title || 'ロードの中...' }}
				</view>
				<!--<view class="share" @tap="showModal('share')">
					<view class="button wanl-gray-light margin-bottom">
						<text class="wlIcon-fenxiangcopy margin-right-xs"></text>
						<text class="text-sm">分享</text>
					</view>
				</view>-->
			</view>

			<view class="block text-min padding-lr padding-bottom-bj">
				<view class="wanl-gray">
					<text class="wlIcon-weizhi margin-right-xs"></text>
					{{ goodsData.shop.city ? goodsData.shop.city.split('/')[1] : 'Japan' }}
				</view>
				<view class="wanl-gray">
					宅配料：
					<text class="text-price">{{ goodsData.freight.price }}</text>
				</view>
				<view class="wanl-gray">
					月間売上高
					<text class="margin-left-xs">{{ goodsData.sales }}</text>
				</view>
			</view>
		</view>
		<!-- 营销 -->
		<view class="promotion text-sm">
			<!-- <view class="item" @tap="showModal('promotion')">
				<view class="label wanl-gray">促销</view>
				<view class="conten">
					<view class="promotion-header">
						<text class="wlIcon-31daifahuo wanl-red margin-right-xs"></text>
						參加一下活動，預計可省 <text class="wanl-red text-price margin-lr-xs">10</text> 元
					</view>
					<view class="promotion-header">
						<view class="cu-tag sm line-orange round margin-right-xs">
							滿80包邮
						</view>
						購物滿80元包邮
					</view>
					<view class="promotion-header">
						<view class="cu-tag sm line-orange round margin-right-xs">
							滿二送一
						</view>买滿二個送一，买滿五送三
					</view>
				</view>
				<view class="bnt-quan wanl-gray">
					更多<text class="wlIcon-fanhui2 margin-left-xs"></text>
				</view>
			</view> -->
			<view class="item" @tap="showModal('coupon')" v-if="goodsData.coupon.length != 0">
				<view class="label wanl-gray">クーポンを取得する</view>
				<view class="conten flex ">
					<view class="wanl-ticket text-sm" v-for="(item, index) in goodsData.coupon" :key="index" v-if="index < 2">
						<block v-if="item.type == 'reduction' || (item.type == 'vip' && item.usertype == 'reduction')">
							<view class="ticket-price"> 円{{Number(item.price)}} </view>
							<view class="ticket-title"> <text>フル{{Number(item.limit)}}もっと少なく{{Number(item.price)}}</text> </view>
						</block>
						<block v-if="item.type == 'discount' || (item.type == 'vip' && item.usertype == 'discount')">
							<view class="ticket-price"> {{Number(item.discount)}}折りたたむ </view>
							<view class="ticket-title"> <text>フル{{Number(item.limit)}}ヒット{{Number(item.discount)}}折りたたむ</text> </view>
						</block>
						<block v-if="item.type == 'shipping'">
							<view class="ticket-price"> 送料無料 </view>
							<view class="ticket-title"> <text>フル{{Number(item.limit)}}円送料無料</text> </view>
						</block>
					</view>
				</view>
				<view class="bnt-quan wanl-gray">
					更多<text class="wlIcon-fanhui2 margin-left-xs"></text>
				</view>
			</view>
		</view>
		<!-- 选择商品 -->
		<view class="choice margin-bottom-bj padding-bj text-sm bg-white">
			<view class="commodity  margin-bottom-bj" @tap="showModal('option')">
				<view class="opt">
					<view class="title wanl-gray">選択する</view>
					<view class="option">
						<view class="selected">
							<view v-if="canCount">
								選択する
								<text class="margin-lr-xs" v-for="(item, index) in goodsData.spu" :key="item.id">{{ item.name }}</text>
							</view>
							<view v-else>
								選択済み
								<text>{{ selectArr.join(' / ') }}</text>
							</view>
						</view>
						<view class="option-list">
							<view v-for="(item, index) in goodsData.spu" :key="item.id">
								<text class="cu-tag" v-if="index == 0" v-for="tag in item.item" :key="tag.name">{{ tag.name }}</text>
								<text class="cu-tag" v-if="index == 0">利用可能なより多くの仕様</text>
							</view>
						</view>
					</view>
				</view>
				<view class="text-sm wanl-gray"><text class="wlIcon-fanhui2"></text></view>
			</view>
			<view class="commodity" @tap="showModal('service')">
				<view class="opt">
					<view class="title wanl-gray text-sm">サービス</view>
					<view class="option">
						<view class="selected">
							<block v-for="(item, index) in goodsData.shop.service_ids" :key="item.id" v-if="index <= 2">
								<text class="margin-lr-xs" v-if="index != 0">·</text>
								{{ item.name }}
							</block>
						</view>
					</view>
				</view>
				<view class="text-min wanl-gray"><text class="wlIcon-fanhui2"></text></view>
			</view>
		</view>
		<!-- 製品パラメータ -->
		<view class="choice margin-bottom-bj padding-bj text-sm bg-white">
			<view class="commodity" @tap="showModal('attribute')">
				<view class="opt">
					<view class="title wanl-gray text-sm">パラメータ</view>
					<view class="option">
						<view class="selected"><text>ブランド、仕様待つ...</text></view>
					</view>
				</view>
				<view class="text-min wanl-gray"><text class="wlIcon-fanhui2"></text></view>
			</view>
		</view>
		<!-- 評論 -->
		<view class="comment margin-bottom-bj padding-bj bg-white" id="evaluate">
			<view class="head" @tap="onTag('')">
				<view>製品レビュー({{ goodsData.comment }})</view>
				<view class="wanl-gray wanl-orange">
					{{ goodsData.comment > 0 ? parseInt((goodsData.praise / goodsData.comment) * 100) : 0 }}%有利なレート
					<text class="wlIcon-fanhui2 margin-left-xs"></text>
				</view>
			</view>
			<!-- 标簽 -->
			<view class="label margin-bottom padding-bottom solid-bottom">
				<view @tap="onTag('good')" class="cu-tag round">賞賛 ({{ goodsData.praise }})</view>
				<view @tap="onTag('pertinent')" class="cu-tag round">平均 ({{ goodsData.moderate }})</view>
				<view @tap="onTag('poor')" class="cu-tag round">悪いレビュー ({{ goodsData.negative }})</view>
				<view @tap="onTag('figure')" class="cu-tag round">写真があります ({{ goodsData.comment_list.figure }})</view>
				<view @tap="onTag(index)" v-for="(item, index) in goodsData.comment_list.tag" :key="index" class="cu-tag round">{{ index }} ({{ item }})</view>
			</view>
			<!-- 獲取一個評論 -->
			<view class="user" v-for="(item, index) in goodsData.comment_list.data" :key="item.id"  @tap="onTag('')">
				<view class="userinfo">
					<view class="avatar">
						<view class="cu-avatar sm round margin-right-xs" :style="{ backgroundImage: 'url(' + $wanlshop.oss(item.user.avatar, 26, 26, 2, 'avatar') + ')' }"></view>
						<view class="text-sm wanl-gray">{{ item.user.nickname }}</view>
					</view>
					<wanl-rate :current="item.score" :disabled="true"></wanl-rate>
				</view>
			
				<view class="details text-min">
					<view class="margin-bottom-sm">{{ item.content }}</view>
					<view class="wanl-gray">仕様：{{ item.suk }}</view>
				</view>
				<view class="grid flex-sub grid-square" :class="[item.images.length > 3 ? 'col-3' : 'col-' + item.images.length]" v-if="item.images.length != 0">
					<view
						class="bg-img"
						v-for="(image, index) in item.images"
						:key="index"
						v-if="index <= 3"
						:style="{ backgroundImage: 'url(' + $wanlshop.oss(image, 88, 88) + ')' }"
					></view>
				</view>
			</view>
			<!-- 查看更多 -->
			<view class="more" @tap="onTag('')"><text class="wanl-gray text-sm">すべて表示</text><text class="wlIcon-fanhui4 margin-left-xs"></text></view>
		</view>
		<!-- 店铺 -->
		<view class="shop padding-bj solid-bottom bg-white">
			<view class="shopinfo margin-bottom">
				<view class="cu-avatar lg radius-bock" :style="{ backgroundImage: 'url(' + $wanlshop.oss(goodsData.shop.avatar, 52, 52, 2, 'avatar') + ')' }"></view>
				<view class="shopname">
					<view class="text-df">{{ goodsData.shop.shopname }}</view>
					<view class="wanl-gray text-min">{{ $wanlshop.toFormat(goodsData.shop.like, 'thousand') }} 焦点を合わせる</view>
				</view>
				<view class="bnt">
					<button class="cu-btn round line-orange margin-right-sm" @tap="onShop(goodsData.shop_id, 3)">すべての製品</button>
					<button class="cu-btn round bg-gradual-orange" @tap="onShop(goodsData.shop_id)">店に</button>
				</view>
			</view>

			<view class="quality wanl-gray text-min">
				<view>
					説明
					<text class="">{{ goodsData.shop.score_describe }}</text>
					<view v-if="goodsData.shop.score_describe < 4.7" class="cu-tag round di">低</view>
					<view v-else class="cu-tag round gao">高い</view>
				</view>
				<view>
					売り手
					<text class="wanl-orange">{{ goodsData.shop.score_service }}</text>
					<view v-if="goodsData.shop.score_service < 4.7" class="cu-tag round di">低</view>
					<view v-else class="cu-tag round gao">高い</view>
				</view>
				<view>
					速達便
					<text class="wanl-orange">{{ goodsData.shop.score_logistics }}</text>
					<view v-if="goodsData.shop.score_logistics < 4.7" class="cu-tag round di">低</view>
					<view v-else class="cu-tag round gao">高い</view>
				</view>
			</view>
		</view>
		<!-- 店铺推荐 -->
		<view class="shop-recom padding-bj bg-white">
			<view class="head">
				<view class="">お店のおすすめ</view>
				<view class="text-sm wanl-orange" @tap="onShop(goodsData.shop_id, 1)">
					すべて表示
					<text class="wlIcon-fanhui2 margin-left-xs"></text>
				</view>
			</view>
			<view class="recommend margin-bottom-xs">
				<view class="item" v-for="(item, index) in goodsData.shop_recommend" :key="item.id" @tap="onGoods(item.id)">
					<image :src="$wanlshop.oss(item.image, 125, 120)" mode="aspectFill"></image>
					<view class="text-sm margin-tb-xs text-cut">{{ item.title }}</view>
					<view class="text-price wanl-orange text-df">{{ item.price }}</view>
				</view>
			</view>
		</view>
		<!-- 分隔符 -->
		<wanl-divider width="60%">製品詳細</wanl-divider>
		<!-- 产品詳情 -->
		<view class="wanl-goods-content bg-white" id="details"><rich-text :nodes="goodsData.content| formatRichText"></rich-text></view>
		<!-- 分隔符 -->
		<wanl-divider width="60%">おすすめ商品</wanl-divider>
		<!-- あなたはそれが好きだと思います -->
		<view id="recommend">
			<wanl-product :dataList="likeData"/>
		</view>
		<uni-load-more :status="status" :content-text="contentText" />
		<view class="safeAreaBottom"></view>
		<view class="WANL-MODAL text-sm" @touchmove.stop.prevent="moveHandle">
			<!-- 顶部 -->
			<view class="cu-modal top-modal" :class="modalName == 'menu' ? 'show' : ''" @tap="hideModal">
				<view class="wanl-modal-menu cu-dialog" @tap.stop=""><wanl-direct @change="hideModal" /></view>
			</view>
			<!-- 促销 -->
			<view class="cu-modal bottom-modal" :class="modalName == 'promotion' ? 'show' : ''" @tap="hideModal">
				<view class="cu-dialog" @tap.stop="">
					<view class="wanl-modal">
						<view class="head padding-bj">
							<view class="content"><view class="text-lg">プロモーション</view></view>
							<view class="close wlIcon-31guanbi" @tap="hideModal"></view>
						</view>
					</view>
				</view>
			</view>
			<!-- 優惠券 -->
			<view class="cu-modal bottom-modal" :class="modalName == 'coupon' ? 'show' : ''" @tap="hideModal">
				<view class="cu-dialog bg-bgcolor" @tap.stop="">
					<view class="wanl-modal">
						<view class="head padding-bj">
							<view class="content"><view class="text-lg">クーポン</view></view>
							<view class="close wlIcon-31guanbi" @tap="hideModal"></view>
						</view>
						<scroll-view class="wanl-coupon scroll-y" scroll-y="true">
							<view v-for="(coupon, index) in goodsData.coupon" :key="index" :class="coupon.type" class="item margin-bottom-bj radius-bock">
								<image :src="$wanlshop.appstc('/coupon/bg_coupon_3x.png')" class="coupon-bg"></image>
								<image :src="$wanlshop.appstc('/coupon/img_couponcentre_received_3x.png')" class="coupon-sign" v-if="coupon.state"></image>
								<view class="item-left">
									<block v-if="coupon.type == 'reduction' || (coupon.type == 'vip' && coupon.usertype == 'reduction')">
										<view class="colour">
											<text class="text-price"></text>
											<text class="prices">{{Number(coupon.price)}}</text>
										</view>
										<view class="cu-tag wanl-gray-dark radius text-sm bg-white">
											フル{{Number(coupon.limit)}}もっと少なく{{Number(coupon.price)}}
										</view>
									</block>
									<block v-if="coupon.type == 'discount' || (coupon.type == 'vip' && coupon.usertype == 'discount')">
										<view class="colour">
											<text class="prices">{{Number(coupon.discount)}}</text>
											<text class="discount">折りたたむ</text>
										</view>
										<view class="cu-tag wanl-gray-dark radius text-sm bg-white">
											フル{{Number(coupon.limit)}}ヒット{{Number(coupon.discount)}}折りたたむ
										</view>
									</block>
									<block v-if="coupon.type == 'shipping'">
										<view class="colour">
											<text class="prices">送料無料</text>
										</view>
										<view class="cu-tag wanl-gray-dark radius text-sm bg-white">
											フル{{Number(coupon.limit)}}円送料無料
										</view>
									</block>
								</view>
								<view class="item-right padding-bj">
									<view class="title">
										<view class="cu-tag sm radius margin-right-xs tagstyle">
											{{coupon.type_text}}
										</view>
										<text class="text-cut wanl-gray text-min">{{coupon.name}}</text>
									</view>
									<view class="content text-min">
										<view class="wanl-gray">
											
											<view v-if="coupon.grant != '-1'">
												<text class="wlIcon-dot"></text>現在残っているのは {{coupon.surplus}} 張
											</view>
											
											<view v-if="coupon.drawlimit != 0">
												<text class="wlIcon-dot"></text>お一人様のみ領収書 {{coupon.drawlimit}} 張
											</view>
											<block v-if="coupon.pretype == 'fixed'">
												<view>
													<text class="wlIcon-dot"></text>有効にする {{coupon.startdate}}
												</view>
												<view>
													<text class="wlIcon-dot"></text>終わり {{coupon.enddate}}
												</view>
											</block>
											<block v-if="coupon.pretype == 'appoint'">
												<view v-if="coupon.validity == 0">
													<text class="wlIcon-dot"></text>使用前に パーマネント 効果的
												</view>
												<view v-else>
													<text class="wlIcon-dot"></text>受け取ってから {{coupon.validity}} 日効果的
												</view>
											</block>
										</view>
										<view class="cu-btn sm round" @tap="onReceive(index)"  v-if="!coupon.state">
											<text>今すぐ入手</text>
										</view>
									</view>
								</view>
							</view>
						</scroll-view>
						<view class="foot padding-lr-bj"><button class="cu-btn bg-gradual-orange round text-bold complete" @tap="hideModal">実施する</button></view>
					</view>
				</view>
			</view>
			<!-- 製品パラメータ -->
			<view class="cu-modal bottom-modal" :class="modalName == 'attribute' ? 'show' : ''" @tap="hideModal">
				<view class="cu-dialog" @tap.stop="">
					<view class="wanl-modal">
						<view class="head padding-bj">
							<view class="content"><view class="text-lg">製品パラメータ</view></view>
						</view>
						<scroll-view class="scroll-y" scroll-y="true">
							<view class="table solid-bottom">
								<view class="name wanl-gray">ブランド</view>
								<view class="value">{{ goodsData.brand.name }}</view>
							</view>
							<view class="table solid-bottom" v-for="(item, index) in goodsData.category_attribute" :key="index">
								<view class="name wanl-gray">{{ index }}</view>
								<view class="value">{{ item }}</view>
							</view>
						</scroll-view>
						<view class="foot padding-lr-bj"><button class="cu-btn bg-gradual-orange round text-bold complete" @tap="hideModal">実施する</button></view>
					</view>
				</view>
			</view>
			<!-- 分享
			<view class="cu-modal bottom-modal" :class="modalName == 'share' ? 'show' : ''" @tap="hideModal">
				<view class="cu-dialog" @tap.stop="">
					<wanl-share 
						:scrollAnimation="scrollAnimation" 
						:shareTitle="goodsData.title" 
						:shareText="goodsData.description" 
						:image="$wanlshop.oss(goodsData.image,50, 50)" 
						:href="common.appConfig.domain + '/pages/product/goods?id='+ goodsData.id +'&QRtype=goods'"
					isReport @change="wanlShare"/>
				</view>
			</view> -->
			<!-- 服務 -->
			<view class="cu-modal bottom-modal" :class="modalName == 'service' ? 'show' : ''" @tap="hideModal">
				<view class="cu-dialog" @tap.stop="">
					<view class="wanl-modal">
						<view class="head padding-bj">
							<view class="content"><view class="text-lg">基本サービス保証</view></view>
						</view>
						<view class="listbox padding-bj">
							<view v-for="(item, index) in goodsData.shop.service_ids" :key="item.id">
								<view class="name">
									{{ item.name }}
									<text class="wlIcon-fuwuxing"></text>
								</view>
								<view class="description wanl-gray text-min">{{ item.description }}</view>
							</view>
						</view>
						<view class="foot padding-lr-bj"><button class="cu-btn bg-gradual-orange round text-bold complete" @tap="hideModal">実施する</button></view>
					</view>
				</view>
			</view>
			<!-- 规格 -->
			<view class="cu-modal bottom-modal" :class="modalName == 'option' ? 'show' : ''" @tap="hideModal">
				<view class="cu-dialog" @tap.stop="">
					<view class="option wanl-modal">
						<view class="head text-left padding-bj solid-bottom">
							<view
								class="cu-avatar radius-bock margin-right" @tap="preview2($wanlshop.oss(goodsData.image, 100, 100))"
								:style="{ backgroundImage: 'url(' + $wanlshop.oss(goodsData.image, 100, 100) + ')' }"
							></view>
							<view class="">
								<view class="text-price wanl-orange text-xl">{{ selectshop.price || goodsData.interval_price }}</view>
								<view class="wanl-gray">
									在庫あり
									<text class="margin-lr-xs">{{ selectshop.stock || 0 }}</text>
									ピース
								</view>
								<view class="text-sm">
									<view v-if="selectArr.join('')">選ばれた：{{ selectArr.join(' ') }}</view>
									<view v-else>
										選択：
										<text class="wanl-gray-light" v-for="(item, index) in goodsData.spu" :key="item.id">
											<block v-if="index != 0">-</block>
											{{ item.name }}
										</text>
									</view>
								</view>
							</view>
							<view class="close wlIcon-31guanbi" @tap="hideModal"></view>
						</view>
						<scroll-view style="max-height: 335px;" scroll-y="true">
							<view class="opt text-left padding-bj solid-bottom" v-for="(value, spukey) in goodsData.spu" :key="value.id">
								<view class="text-df">{{ value.name }}</view>
								<view class="tag">
									<view
										class="cu-tag text-sm"
										v-for="(item, index) in value.item"
										:key="index"
										:class="[item.ishow ? '' : 'noactive', subIndex[spukey] == index ? 'active' : '']"
										@tap="skuClick(item, spukey, $event, index)"
									>
										{{ item.name }}
									</view>
								</view>
							</view>
							<view class="number padding-bj">
								<view class="text-df">購入数量</view>
								<uni-number-box :min="1" :max="selectshop.stock" :value="selectNum" :disabled="canCount" @change="changeNum"></uni-number-box>
							</view>
						</scroll-view>

						<view class="foot padding-lr-bj">
							<button v-if="isChoice" class="cu-btn bg-gradual-orange round text-bold complete" @tap="completeSelection">実施する</button>
							<block v-else>
								<button class="cu-btn bg-gradual-yellow round-left text-bold" @tap="SubmitData('addToCart', 1)">ショッピングカートに追加</button>
								<button class="cu-btn bg-gradual-orange round-right text-bold" @tap="SubmitData('placeOrder', 1)">今すぐ注文</button>
							</block>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部 -->
		<view class="wanlian cu-bar tabbar shop solid-top foot">
			<view class="action" @tap="onShop(goodsData.shop_id)">
				<view class="wlIcon-dianpu1 wanl-orange"></view>
				ショップ
			</view>
			<view class="action" @tap="toCart">
				<view class="wlIcon-gouwuche">
					<view class="cu-tag badge" v-if="cart.cartnum > 0">{{ cart.cartnum }}</view>
				</view>
				買い物かご
			</view>
			<!-- 1.0.2升级 -->
			<view class="action" @tap="toChat(goodsData.shop_id, { id: goodsData.id, title: goodsData.title, image: goodsData.image, price: goodsData.price })">
				<view class="wlIcon-kefu"><view class="cu-tag badge"></view></view>
				顧客サービス
			</view>
			<view class="btn-group">
				<button class="cu-btn bg-gradual-yellow round-left" @tap="SubmitData('addToCart')">ショッピングカートに追加</button>
				<button class="cu-btn bg-gradual-orange round-right" @tap="SubmitData('placeOrder')">今買う</button>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	data() {
		return {
			TabCur: 0,
			wanlsys: this.$wanlshop.wanlsys(),
			modalName: null, // 弹出层
			durect: 0, // 角标
			headerOpacity: 0, //不透明度
			currentSwiper: 0, // 轮播圖右下角數字
			anchorlist: [{ name: 'メイン画像', top: 0 }, { name: '評価', top: 0 }, { name: '詳細', top: 0 }, { name: 'おすすめ', top: 0 }], //導航條锚点
			selectAnchor: 0,
			//产品數據
			goodsData: {
				id: 0,
				category_id: 0,
				shop_id: 0,
				brand_id: 0,
				freight_id: 0,
				title: '',
				image: '',
				images: '',
				flag: '',
				content: '',
				category_attribute: [],
				activity: false,
				price: null,
				interval_price: null,
				market_price: null,
				sales: 0,
				brand: {},
				freight: {
					name: '',
					isdelivery: 1
				},
				payment: 0,
				comment: 0,
				praise: 0,
				moderate: 0,
				negative: 0,
				like: 0,
				views: 0,
				status: '',
				category: {},
				follow: true,
				sku: [],
				spu: [],
				promotion: [],
				coupon: [],
				comment_list: {
					data: [],
					figure: 0,
					tag: []
				},
				shop: {
					city: ''
				},
				shop_recommend: {}
			},
			// あなたはそれが好きだと思います
			reload: true,
			likeData: [],
			current_page: 1, //当前頁碼
			last_page: 1, //总頁碼
			status: 'loading',
			contentText: {
				contentdown: ' ',
				contentrefresh: '読み込み中...',
				contentnomore: 'これ以上のデータはありません'
			},
			// 商品规格組合
			shopItemInfo: {}, //存放要和选中的值进行匹配的數據
			selectArr: [], //存放被选中的值
			subIndex: [], //是否选中 因為不確定是多规格还是但规格，所以这里定义數組來判断
			selectshop: {}, //存放最後选中的商品
			selectNum: 1, //选中數量
			isChoice: '', // 是否从选择进入
			scrollAnimation: 0 //分享滚動
		};
	},
	onLoad(option) {
		this.loadData(option);
		this.loadlikeData();
		// #ifdef MP-WEIXIN
		/*wx.showShareMenu({
			withShareTicket: true,
			menus: ['shareAppMessage', 'shareTimeline']
		});*/
		// #endif
		this.durect =
			this.$store.state.statistics.notice.notice +
			this.$store.state.statistics.notice.order +
			this.$store.state.statistics.notice.chat +
			this.$store.state.statistics.order.pay +
			this.$store.state.statistics.order.delive +
			this.$store.state.statistics.order.receiving +
			this.$store.state.statistics.order.evaluate;
	},
	onPageScroll(e) {
		//導航栏渐变
		let tmpY = 150;
		e.scrollTop = e.scrollTop > tmpY ? 150 : e.scrollTop; //如果当前高度大於250则250否则当前高度
		this.headerOpacity = e.scrollTop * (1 / tmpY); //$headerOpacity 赋值当前高度x（1÷250）
	},
	onReachBottom() {
		//判断是否最後一頁
		if (this.current_page >= this.last_page) {
			this.status = 'noMore';
		} else {
			this.reload = false;
			this.current_page = this.current_page + 1; //頁碼+1
			this.status = 'loading';
			this.loadlikeData();
		}
	},
	watch: {
	    selectshop(n, o) {
			if(n.price != o.price){
				// 更新一次優惠券
				this.queryCoupon(n.price);
			}
	    }
	},
	filters: {
		formatRichText(html) { //控制小程序中图片大小
			let newContent = html.replace(/<img[^>]*>/gi, function(match, capture) {
				match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
				match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
				match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
				return match;
			});
			newContent = newContent.replace(/style="[^"]+"/gi, function(match, capture) {
				match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi, 'max-width:100%;');
				return match;
			});
			newContent = newContent.replace(/<br[^>]*\/>/gi, '');
			newContent = newContent.replace(/\<img/gi,
				'<img style="max-width:100%;height:auto;display:inline-block;margin:10rpx auto;"');
			return newContent;
		}
	},
	computed: {
		canCount() {
			return this.subIndex.some(item => item === -1);
		},
		...mapState(['cart', 'common'])
	},
	methods: {
		async loadData(option) {
			//加載商品
			this.$api.get({
				url: '/wanlshop/product/goods',
				data: option,
				success: res => {
					//詳情正则
					res.content = res.content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, (match, capture) => {
						var img = `<img style="display: block; max-width: 100%;" src="${this.$wanlshop.oss(capture, 500, 0)}">`;
						return img;
					});
					// 価格帯
					if (res.sku.length == 0) {
						res.interval_price = res.price;
						res.market_price = res.price;
					}else{
						let price = [],
							market_price = [];
						for (let value of res.sku) {
							price.push(value.price);
							market_price.push(value.market_price);
						}
						let minPrice = Math.min.apply(null, price),
							maxPrice = Math.max.apply(null, price),
							maxMarketPrice = Math.max.apply(null, market_price);
						res.interval_price = minPrice == maxPrice ? minPrice : minPrice + '-' + maxPrice; //区間價格
						res.market_price = Number(maxMarketPrice).toFixed(2); //最大市场价
					}
					this.goodsData = res;
					// 商品规格組合
					this.goodsData.spu.map(item => {
						this.selectArr.push('');
						this.subIndex.push(-1);
					});
					this.checkItem(); //計算sku里面规格形成路径
					this.checkInpath(-1); //傳-1是為了不跳過循环
					// 計算锚点高度
					setTimeout(() => {
						this.calcAnchor();
					}, 1000);
				}
			});
		},
		// 滚動底部加載猜妳喜歡
		async loadlikeData() {
			this.$api.get({
				url: '/wanlshop/product/likes?pages=goods',
				data: {
					page: this.current_page
				},
				success: res => {
					this.likeData = this.reload ? res.data : this.likeData.concat(res.data); //評論數據 追加
					this.current_page = res.current_page; //当前頁碼
					this.last_page = res.last_page; //总頁碼
					this.status = 'more';
				}
			});
		},
		// 查询優惠券，减緩服務器压力，單獨查询
		async queryCoupon(price) {
			this.$api.post({
				url: '/wanlshop/coupon/query',
				data: {
					shop_id: this.goodsData.shop_id,
					goods_id: this.goodsData.id,
					shop_category_id: this.goodsData.shop_category_id,
					price: price
				},
				success: res => {
					this.goodsData.coupon = res;
				}
			});
		},
		// クーポンを受け取る
		async onReceive(index) {
			let coupon = this.goodsData.coupon[index];
			this.$api.post({
				url: '/wanlshop/coupon/receive',
				loadingTip: '受信',
				data: {
					id: coupon.id
				},
				success: res => {
					coupon.id = res.id;
					coupon.state = true;
					this.$wanlshop.msg(res.msg);
					// 更新状态管理器
					this.$store.commit('statistics/dynamic', {
						coupon: this.$store.state.statistics.dynamic.coupon + 1
					});
				}
			});
		},
		// 商品规格組合 选择
		skuClick(value, spukey, event, index) {
			if (value.ishow) {
				if (this.selectArr[spukey] != value.name) {
					this.$set(this.selectArr, spukey, value.name);
					this.$set(this.subIndex, spukey, index);
				} else {
					this.$set(this.selectArr, spukey, '');
					this.$set(this.subIndex, spukey, -1);
				}
				this.checkInpath(spukey);
				//如果全部选完
				if (this.selectArr.every(item => item != '')) {
					this.selectshop = this.shopItemInfo[this.selectArr];
					this.selectNum = 1;
				}
			}
		},
		//循环所有属性判断哪些属性可选
		checkInpath(clickIndex) {
			
			//当前选中的兄弟节点和已选中属性不需要循环
			for (let i = 0, len = this.goodsData.spu.length; i < len; i++) {
				if (i == clickIndex) {
					continue;
				}
				let len2 = this.goodsData.spu[i].item.length;
				for (let j = 0; j < len2; j++) {
					if (this.subIndex[i] != -1 && j == this.subIndex[i]) {
						continue;
					}
					let choosed_copy = [...this.selectArr];
					this.$set(choosed_copy, i, this.goodsData.spu[i].item[j].name);
					let choosed_copy2 = choosed_copy.filter(item => item !== '' && typeof item !== 'undefined');
					if (this.shopItemInfo.hasOwnProperty(choosed_copy2)) {
						this.$set(this.goodsData.spu[i].item[j], 'ishow', true);
					} else {
						this.$set(this.goodsData.spu[i].item[j], 'ishow', false);
					}
				}
			}
			// console.log(this.goodsData.spu)
		},
		//計算有多小种可选路径
		checkItem() {
			let result = this.goodsData.sku.reduce(
				(arrs, items) => {
					return arrs.concat(
						items.difference.reduce(
							(arr, item) => {
								return arr.concat(
									arr.map(item2 => {
										//利用對象属性的唯一性实現二维數組去重
										if (!this.shopItemInfo.hasOwnProperty([...item2, item])) {
											this.shopItemInfo[[...item2, item]] = items;
										}
										return [...item2, item];
									})
								);
							},
							[[]]
						)
					);
				},
				[[]]
			);
		},
		//商品规格修改數量
		changeNum(val) {
			this.selectNum = parseInt(val);
		},
		preview(imgs){
			// imgs=imgs.split(',')
			uni.previewImage({
				urls: imgs,
				longPressActions: {
					itemList: ['画像を保存する'],
					success: function(data) {
					//data.tapIndex按钮下标 ，data.index图片下标
						if(data.tapIndex==0){
							uni.saveImageToPhotosAlbum({
								filePath: imgs[data.index],
								success: function () {
									uni.showToast({
										title:'正常に保存'
									})
								}
							});
						}
					},
					fail: function(err) {
						console.log(err.errMsg);
					}
				}
			});
		},
		preview2(imgs){
			console.log(imgs);
			var imgArr = [];
			imgArr.push(imgs);
			//预览图片
			uni.previewImage({
				urls: imgArr,
				current: imgArr[0]
			});

		},
		//轮播圖指示器
		swiperChange(e) {
			this.currentSwiper = e.detail.current;
		},
		// 弹出层
		showModal(name) {
			this.isChoice = '';
			// 滚動下分享
			/*if (name == 'share' && this.modalName != 'share') {
				setTimeout(() => {
					this.scrollAnimation = 0;
				}, 300);
			}*/
			this.modalName = name;
		},
		// 關閉弹出层
		hideModal(name) {
			console.log('6666666');
			console.log(name);
			if (name) {
				this.showModal(name);
			} else {
				this.modalName = null;
			}
		},
		// 分享回调
		/*wanlShare(e){
			if(e){
				this.$wanlshop.auth(`/pages/user/complaint/complaint?id=${this.goodsData.id}&type=1`);
			}else{
				this.modalName = null;
			}
		},*/
		//禁止父元素滑動
		moveHandle() {},
		// お気に入り & キャンセル
		follow() {
			this.goodsData.follow = !this.goodsData.follow;
			// 全局控製中心
			if (this.goodsData.follow) {
				this.$store.commit('statistics/dynamic', {
					collection: this.$store.state.statistics.dynamic.collection + 1
				});
			} else {
				this.$store.commit('statistics/dynamic', {
					collection: this.$store.state.statistics.dynamic.collection - 1
				});
			}
			this.$api.post({
				url: '/wanlshop/product/follow',
				data: {
					id: this.goodsData.id
				},
				success: res => {
					this.goodsData.follow = res;
				}
			});
		},
		//跳转锚点
		toAnchor(index) {
			this.selectAnchor = index;
			uni.pageScrollTo({
				scrollTop: this.anchorlist[index].top,
				duration: 200
			});
		},
		//計算锚点高度
		calcAnchor() {
			let query = null;
			// 支付宝小程序不能加後面的.in(this)，是它自身的限製
			// #ifndef MP-ALIPAY
			query = uni.createSelectorQuery().in(this)
			// #endif
			// #ifdef MP-ALIPAY
			query = uni.createSelectorQuery()
			// #endif
			query.select('#evaluate').boundingClientRect(rec => {
				this.anchorlist[1].top = rec.top - this.wanlsys.height - 45;
			}).exec();
			query.select('#details').boundingClientRect(rec => {
				this.anchorlist[2].top = rec.top - this.wanlsys.height - 45;
			}).exec();
			query.select('#recommend').boundingClientRect(rec => {
				this.anchorlist[3].top = rec.top - this.wanlsys.height - 45;
			}).exec();
		},
		// 評論頁
		onTag(tag) {
			this.$wanlshop.to('/pages/product/comment?id=' + this.goodsData.id + '&praise=' + this.goodsData.praise + '&tag=' + tag);
		},
		// 打開購物車
		toCart() {
			uni.switchTab({ url: '/pages/cart/cart' });
		},
		// 完成选择
		completeSelection() {
			if (this.canCount) {
				this.$wanlshop.msg('仕様を完了するために選択してください');
			} else {
				this.ProcessingData();
			}
		},
		// 提交數據
		SubmitData(name, type) {
			// if (!this.subIndex[0]) {
				// this.$wanlshop.msg('客官先别急，系統还在加載');
			// } else {
				
			// }
			if(type == 1){
				if (this.canCount) {
					this.$wanlshop.msg('仕様を完了するために選択してください');
				}else{
					this.isChoice = name;
					this.ProcessingData();
				}
			}else{
				this.modalName = 'option';
				this.isChoice = name;
			}
		},
		ProcessingData() {
			if (this.isChoice == 'addToCart') {
				this.$store.dispatch('cart/add', {
					shop_id: this.goodsData.shop_id,
					shop_name: this.goodsData.shop.shopname,
					goods_id: this.goodsData.id,
					title: this.goodsData.title,
					number: this.selectNum,
					image: this.goodsData.image,
					sku: this.selectshop,
					sku_id: this.selectshop.id,
					sum: this.$wanlshop.bcmul(this.selectshop.price, this.selectNum)
				});
				this.$wanlshop.msg('ショッピングカートが追加されました');
			} else if (this.isChoice == 'placeOrder') {
				let goodsData = [
					{
						goods_id: this.goodsData.id,
						number: this.selectNum,
						sku_id: this.selectshop.id
					}
				];
				// 提交訂單
				if (this.$store.state.user.isLogin) {
					uni.redirectTo({
						url: `/pages/user/order/addorder?type=goods&data=${JSON.stringify(goodsData)}`
					});
				}else{
					this.$wanlshop.to('/pages/user/auth/name');
				}
				
			} else {
				this.$wanlshop.msg('異常なデータ');
			}
			this.hideModal();
		},
		productSearch(text) {
			this.$wanlshop.to(`/pages/product/search?keywords=${text}`, 'fade-in', 100);
		}
	}
};
</script>

<style>
toast,
uni-toast {
	z-index: 9999;
}
.cu-custom .cu-bar .search-form {
	background-color: #fff;
}

.cu-custom .cu-bar {
	background-color: #f3f3f3;
}

.cu-custom .bar-bg {
	background-color: rgba(243, 243, 243, 0.96);
}
.cu-custom .cu-bar {
	z-index: 99;
}
/* #ifdef MP */
.cu-custom .cu-bar .search-form {
	margin: 0 0 0 25rpx;
}
/* #endif */

.cu-custom .cu-bar .nav .cu-item{
	line-height: 70rpx;
	height: 70rpx;
}
.swiper-box {
	position: relative;
	width: 100%;
	height: 100vw;
}

.swiper-box swiper {
	width: 100%;
	height: 100vw;
}

.swiper-box swiper swiper-item image {
	width: 100%;
	height: 100vw;
}

.swiper-box .indicator {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0 25upx;
	height: 40upx;
	border-radius: 40upx;
	font-size: 22upx;
	position: absolute;
	bottom: 20upx;
	right: 20upx;
	color: #fff;
	background-color: rgba(0, 0, 0, 0.2);
}
</style>
