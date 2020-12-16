<template>
  <div class="detail-container">
    <!-- <div v-wechat-title="$route.meta.title"></div> -->
    <template v-if="!pageLoad">
      <van-loading size="24px" vertical class="center_loading">加载中...</van-loading>
    </template>
    <template v-else>
      <div class="header_swiper row">
          <div class="header-silder" 
              v-for="(item,index) in swiperList"
              :key="index"
              :style="{'background':cardDetails.style.bgColor,'boxShadow':cardDetails.style.bgShadow}">
            <div class="swiper_item_info column">
              <div class="top_info">
                <div class="my_card_title">我的月卡</div>
                <div class="act_info">有效期至{{cardDetails.effectiveEndDate}}</div>
              </div>
              <div class="bottom_info row">
                <van-icon name="location" />
                <span class="parking_address">{{cardDetails.parkinglotName}}</span>
              </div>
            </div>
            <div
              class="right_date"
              :style="{backgroundImage:'url(' + (rightBg) + ')'}"
            >有效期至{{absDate}}</div>
          </div>
      </div>
      <div class="card_content">
        <div class="con_list column">
          <div class="list_item row">
            <div class="left_title">联系电话</div>
            <div class="right_info">{{cardDetails.phone}}</div>
          </div>
          <!-- <div class="list_item row">
            <div class="left_title">有效车牌</div>
            <div class="right_info">右侧信息</div>
          </div>-->
          <div class="list_item row">
            <div class="left_title">包月类型</div>
            <div class="right_info">{{cardDetails.productType}}</div>
          </div>
          <div class="list_item row">
            <div class="left_title">包月金额</div>
            <div class="right_info">{{cardDetails.productUnitPrice}}</div>
          </div>
          <div class="list_item row">
            <div class="left_title">车位信息</div>
            <div class="right_info">{{cardDetails.spaceType}}</div>
          </div>
          <div class="list_item row">
            <div class="left_title">车位数量</div>
            <div class="right_info">{{cardDetails.spaceNum}}</div>
          </div>
          <div class="list_item row">
            <div class="left_title">到期时间</div>
            <div class="right_info">{{cardDetails.effectiveEndDate}}</div>
          </div>
          <div class="list_item row" style="align-items:flex-start;height:auto;">
            <div class="left_title">关联有效车牌</div>
            <div class="right_info column">
              <div class="right_card_item" v-for="(item,index) in vehPaiList" :key="index">{{item}}</div>
            </div>
          </div>
          <div class="list_tips">更换车牌请携行驶证到车场办公室修改</div>
        </div>
      </div>
      <div class="footer column">
        <div class="renew_btn" @click="showRenewDialogs(15)">我要续费</div>
        <div class="footer_tips row">
          <span class="not_my_card">不是我的月卡，</span>
          <span class="immed_unbundling" @click="showRenewDialogs(13)">立即解绑</span>
        </div>
      </div>

      <dialogs :show="show" :obj="obj" @closepop="closeTc" @affirmBtn="affirms" v-if="show" />
    </template>
  </div>
</template>
<script>
import {
  myOldProductDetails,
  renewProduct,
  userPay,
  unbindProductMonthly,
} from "network/index";
import dialogs from "components/dialog.vue";
import { Icon, Loading } from "vant";
export default {
  data() {
    return {
      swiperOption: {
        // 分页器配置
        pagination: ".swiper-pagination",
      },
      swiperList: [
        {
          bg: "rgba(81,117,255,1)",
        },
      ],
      pageLoad: false,
      vehPaiList: [], //月卡关联的车牌
      cardDetails: [], //月卡详情
      absDate: "", //右上角日期
      // 弹框组件
      show: false,
      obj: {
        btn: "确认支付", //单个按钮名称
        btn1: "取消", //双按钮第一个
        btn2: "继续", //双按钮第二个
        type: 1, //控制按钮, 1 单按钮 2 双按钮
        flag: -1, //控制弹窗显示内容
      },
      recordId: "",
      rightBg: require("assets/img/yuekabg2@2x.png"),
      userId: localStorage.getItem("userId"), //'355f51a76a584db181cc669c9d3b4db1',
      userInfo: JSON.parse(localStorage.getItem("userInfo")),
      // openId:"ow7iCwjEOTrEBoW2KkWxThss8nAE",
      payStatus: true,
    };
  },
  components: {
    [Icon.name]: Icon,
    [Loading.name]: Loading,
    dialogs,
  },
  created() {
    this.$nextTick(() => {
      this.init();
    });
  },

  mounted() {},
  methods: {
    init() {
      this.getOldCardInfo();
    },
    getOldCardInfo() {
      console.log(this.$route.query);
      let { recordId } = this.$route.query;
      this.recordId = recordId;
      // recordId 月卡id
      myOldProductDetails({ recordId }).then((ret) => {
        let cardDetails = ret.data.myOldProductDetailsList[0];
        // 判断后台返回车位类别
        if (cardDetails.spaceType == "FIXED_SPACE") {
          cardDetails.spaceType = "固定车位";
        } else if (cardDetails.spaceType == "NO_FIXED_SPACE") {
          cardDetails.spaceType = "非固定车位";
        }

        if (cardDetails.productType == "ORDINARY_MONTH") {
          cardDetails.productType = "普通包月";
        } else if (cardDetails.productType == "TIME_SHARING_MONTH") {
          cardDetails.productType = "分时包月";
        }
        cardDetails.effectiveEndDateAddOne = cardDetails.effectiveEndDateAddOne.split(
          " "
        )[0];
        let { bgColor, bgShadow } = this.$route.query,
          carStyle = { bgColor, bgShadow };
        cardDetails.style = carStyle; //卡片样式
        this.vehPaiList = ret.data.carLicense;
        this.cardDetails = cardDetails;
        this.pageLoad = true;
        this.absDate = cardDetails.effectiveEndDate.split(" ")[0];
      });
    },

    // 显示续费弹框
    showRenewDialogs(flag) {
      console.log(flag);
      this.obj.flag = flag;
      if (flag == 15) {
        this.obj.btn = "确认支付";
        this.obj.dateFlag = "CONTINUE";
        this.obj.payInfo = this.cardDetails;
        this.obj.payInfo.sxDate = this.cardDetails.effectiveEndDateAddOne;
        this.obj.payInfo.sceneType = "102H7002"; //续费请求接口参数
        this.obj.payInfo.carLicense = this.vehPaiList;
      }
      if (flag == 13) {
        this.obj.btn = "确认解绑";
      }
      this.show = true;
    },
    // 弹框操作
    closeTc() {
      this.show = false;
    },
    affirms(e) {
      let { obj } = this,
        type = obj.flag, //15支付 13解绑
        payInfo = obj.payInfo,
        that = this;

      if (type == 15) {
        console.log(obj, "198198198");
        let payStatus = this.payStatus;
        try {
          // 避免用户点击多次确认支付
          if (payStatus) {
            this.payStatus = false;
            // 调起支付
            let params = {
              amountPayed: e.payMoney,
              carLicenses:
                this.vehPaiList.length > 0 ? this.vehPaiList.join(",") : "",
              parkinglotId: payInfo.parkinglotId,
              priceId: payInfo.priceId,
              productId: payInfo.informationId,
              purchasingMonth: e.month,
              recordId: this.recordId,
              userId: this.userId,
              openId: this.userInfo.openId,
              sceneType: payInfo.sceneType,
              startDateType: payInfo.dateFlag == "N" ? obj.dateFlag : "",
            };
            renewProduct(params).then((ret) => {
              console.log(ret);
              if (ret.status == "200") {
                let jsApiObject = ret.data.jsApiObject;
                if (typeof WeixinJSBridge == "undefined") {
                  if (document.addEventListener) {
                    document.addEventListener(
                      "WeixinJSBridgeReady",
                      that.onBridgeReady(jsApiObject),
                      false
                    );
                  } else if (document.attachEvent) {
                    document.attachEvent(
                      "WeixinJSBridgeReady",
                      that.onBridgeReady(jsApiObject)
                    );
                    document.attachEvent(
                      "onWeixinJSBridgeReady",
                      that.onBridgeReady(jsApiObject)
                    );
                  }
                } else {
                  that.onBridgeReady(jsApiObject);
                }
              }else{
                this.payStatus = true;
                this.$toast(`${ret.message}`);
              }
            });
          }
        } catch (err) {
          that.payStatus = true;
          that.$toast(`${err.name}：${err.message}`);
        }
      }

      if (type == 13) {
        let data = {
          userId: this.userId,
          recordId: this.recordId,
        };
        // 解绑
        unbindProductMonthly(data).then((ret) => {
          if (ret.status == "200") {
            this.$toast("解绑成功!");
            setTimeout(() => {
              this.$router.push("cardIndex");
            }, 2000);
          } else {
            this.$toast(`${ret.message}`);
          }
        });
      }
      console.log(obj);
      console.log(e);
      // this.show = false;
    },
    onBridgeReady(jsApiObject) {
      try {
        console.log(jsApiObject);
        WeixinJSBridge.invoke(
          "getBrandWCPayRequest",
          {
            appId: jsApiObject.appId, //公众号名称，由商户传入
            timeStamp: jsApiObject.timeStamp, //时间戳，自1970年以来的秒数
            nonceStr: jsApiObject.nonceStr, //随机串
            package: jsApiObject.package,
            signType: jsApiObject.signType, //微信签名方式：
            paySign: jsApiObject.paySign, //微信签名
          },
          (res) => {
            console.log(res);
            this.payStatus = true;
            if (res.err_msg == "get_brand_wcpay_request:ok") {
              this.$router.push("cardIndex");
            } else {
              this.$toast("支付失败!");
            }
          }
        );
      } catch (err) {
        this.$toast(`微信支付功能调取失败!`);
        // this.$toast(`${err.name}：${err.message}`);
      }
    },
  },
};
</script>
<style scoped>
.header_swiper {
  width: 654px;
  height: 328px;
  margin: 34px auto 46px;
}
.swiper-container {
  width: 654px;
  height: 328px;
}
.header-silder{
  width: 654px;
  height: 100%;
  padding: 78px 0 32px 40px;
  box-sizing: border-box;
  border-radius: 16px;
  opacity: 0.95;
  position: relative;
}
.swiper_item_info {
  height: 100%;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
}
.my_card_title {
  font-size: 40px;
  color: #fff;
  margin-bottom: 8px;
}
.act_info,
.bottom_info {
  font-size: 24px;
  color: #fff;
  opacity: 0.85;
}
.parking_address {
  margin-left: 6px;
}

/* 月卡详情列表 */
.card_content {
  margin-bottom: 80px;
}
.con_list {
  padding: 24px 0 38px;
  position: relative;
}
.con_list::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 0;
  width: 606px;
  height: 2px;
  background-color: #ddd;
  transform: translateX(-50%);
}
.con_list::before {
  content: "";
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 606px;
  height: 2px;
  background-color: #ddd;
  transform: translateX(-50%);
}

.list_item {
  width: 606px;
  justify-content: space-between;
  height: 64px;
  line-height: 64px;
}
.list_item:last-child {
  align-items: flex-start;
  height: auto;
}
.left_title {
  font-size: 28px;
  color: #999;
}
.right_info {
  font-size: 28px;
  color: #333;
}
.list_tips {
  width: 606px;
  text-align: right;
  font-size: 24px;
  color: #999;
}
/* 底部按钮 */
.footer {
  padding-bottom: 62px;
}
.renew_btn {
  width: 606px;
  height: 88px;
  line-height: 88px;
  font-size: 32px;
  color: #fff;
  text-align: center;
  border-radius: 44px;
  background-color: #008cff;
  margin-bottom: 40px;
}
.not_my_card {
  font-size: 28px;
  color: #999;
}
.immed_unbundling {
  font-size: 28px;
  color: #008cff;
}
.right_date {
  width: 278px;
  height: 74px;
  font-size: 24px;
  color: rgba(137, 83, 35, 1);
  opacity: 0.85;
  /* background: url("../../assets/img/yuekabg2@2x.png") no-repeat; */
  background-size: 100% 100%;
  position: absolute;
  right: -2px;
  top: 0;
  padding: 16px 0 0 20px;
  box-sizing: border-box;
  text-align: center;
  white-space: nowrap;
}
.center_loading {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>