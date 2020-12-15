<template>
  <div class="look-container">
    <template v-if="!pageLoad">
      <van-loading size="24px" vertical class="center_loading"
        >加载中...</van-loading
      >
    </template>
    <template v-else>
      <div class="card_header column" :style="headerStyle">
        <div class="card_info">
          <div class="card_name">{{ detailInfo.productName }}</div>
          <div class="card_tips">{{ detailInfo.productType }}</div>
        </div>
        <div class="card_park_address row">
          <van-icon name="location" />
          <span class="address_text">{{ detailInfo.parkinglotName }}</span>
        </div>
      </div>

      <div class="section_wrap_look column">
        <div class="section_content_look">
          <div class="vehicle_type">
            <div class="content_title">车位类型</div>
            <div class="type_info">{{ detailInfo.spaceType }}</div>
          </div>
          <div class="vehicle_time">
            <div class="content_title">生效时段</div>
            <div class="time_info">{{ detailInfo.productType }}</div>
          </div>
          <div class="vehicle_num">
            <div class="content_title">车牌号码</div>
            <div class="veh_num_tips" v-if="detailInfo.displacementType">
              仅限认证为{{ detailInfo.displacementType }}
            </div>

            <div class="veh_pai_list row">
              <div class="veh_pai_list row">
                <!-- 用户添加的车牌 -->
                <template v-if="vehPaiList.length > 0">
                  <div
                    class="user_add_item"
                    v-for="(item, index) in vehPaiList"
                    :key="index"
                  >
                    <div class="item_text">{{ item }}</div>
                    <!-- <van-icon name="clear" class="close_car_pai" @click="remoreCarPai(index)" v-if="!statusArr[index]"/> -->
                  </div>
                </template>
              </div>
              <!-- 添加车牌 -->
              <template v-if="cardNumber - vehPaiList.length > 0">
                <div
                  v-for="index in cardNumber - vehPaiList.length"
                  :key="index"
                  class="veh_add_btn"
                  @click="showRenewDialogs(10)"
                >
                  + 选择车牌
                </div>
              </template>
            </div>
          </div>
          <div class="vehicle_validity">
            <div class="content_title">有效期</div>
            <div class="validity_info">
              {{ detailInfo.effectiveStartDate }} 至
              {{ detailInfo.effectiveEndDate }}
            </div>
          </div>
          <div class="vehicle_explain">
            <div class="content_title">月卡说明</div>
            <div class="ins_list">
              <div
                class="ins_item row"
                v-for="(item, index) in explainList"
                :key="index"
              >
                <span class="ins_item_num">{{ index + 1 }}.</span>
                <div class="ins_item_con">{{ item }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="footer">
        <div class="agreement row">
          <span class="agree_gray">若有疑议请联系客服或查看</span>
          <router-link :to="{ path: '/agreeMent' }" class="look_agree"
            >《车位租赁协议》</router-link
          >
        </div>
        <div class="renew_info row">
          <div class="money_left">
            <span class="money_symbol">￥</span>
            <span class="big_money">{{ detailInfo.monthAmount }}</span>
            <span class="money_decimal">/月</span>
          </div>
          <div class="renew_btn" @click="showRenewDialogs(15)">立即续费</div>
        </div>
      </div>

      <!-- <van-action-sheet :round="false" v-model="showSelect" :close-on-click-overlay="false">
      <div class="handleBtn clearfix">
        <span class="fl" @click="showSelect = false">取消</span>
        <span class="fr" @click="selectCarNumber">确认</span>
      </div>
      <ul class="selectList">
        <li
          v-for="(item,index) in option"
          :key="index"
          @click="onSelect(item.name,index)"
          :class="item.className"
          :style="{backgroundImage: 'url(' + (item.className ? selected : '') + ')'}"
        >{{item.name}}</li>
      </ul>
      </van-action-sheet>-->
      <van-action-sheet
        :round="false"
        v-model="showSelect"
        cancel-text="取消"
        close-on-click-action
      >
        <ul class="selectList">
          <li
            v-for="(item, index) in option"
            :key="index"
            @click="onSelect(item.name)"
            :class="item.className"
            :style="{
              backgroundImage: 'url(' + (item.className ? selected : '') + ')'
            }"
          >
            {{ item.name }}
          </li>
        </ul>
      </van-action-sheet>
      <dialogs
        :show="show"
        :obj="obj"
        :payradio="payradio"
        @choosepop="chootype"
        @closepop="closeTc"
        @affirmBtn="affirms"
        v-if="show"
      />
    </template>
  </div>
</template>
<script>
import dialogs from "components/dialog.vue";
import {
  myNewProductDetails,
  renewProduct,
  userPay,
  selectCard,
  addCarLicenseInProduct,
  unbindCarLicenseInProduct,
  getPayList,
  getClientIp,
  getxPay
} from "network/index";
import { Icon, ActionSheet, Loading } from "vant";
// import { delete } from 'vue/types/umd';
export default {
  data() {
    return {
      recordId: -1, //月卡id
      vehPaiList: [], //车牌列表
      detailInfo: {}, //详情信息
      explainList: [
        "包月卡购买时所选车辆需车主认证通过，提交身份证，驾驶证，行驶证等信息，未认证通过车辆不可购买月卡。若证件有更新，需及时提交更新，若未及时提供，甲方有权拒绝继续为其提供月租服务；",
        "月卡统一为自然月时长。例：本月15日0时生效，次月14日23:59:59秒后失效。",
        "月卡若为分时包月，购买时请确认单日中停车费用减免时间。在月卡生效时段内停车费减免，超出时段停车按车场标准计费。",
        "若以优惠价格购买的季卡、半年卡、年卡等产品，退费时均以最后月份计算并抵扣对应优惠金额，除抵扣月外，均按月单价计价。",
        "购买月卡成功并生效后，所添加车辆即获得场内停车权限，解绑号牌后月卡权益依然有效，更换号牌请联系客服。",
        "车位租赁协议为纸质版，若线上购买即表示已接受纸质版车位租赁协议，如需办理可致电客服联系纸质版协议签署。"
      ], //月卡说明
      // 弹框组件
      show: false,
      obj: {
        btn: "确认支付", //单个按钮名称
        btn1: "取消", //双按钮第一个
        btn2: "继续", //双按钮第二个
        type: 1, //控制按钮, 1 单按钮 2 双按钮
        flag: 15 //控制弹窗显示内容
      },
      userId: localStorage.getItem("userId"), //"355f51a76a584db181cc669c9d3b4db1",
      userInfo: JSON.parse(localStorage.getItem("userInfo")),
      // openId:'ow7iCwjEOTrEBoW2KkWxThss8nAE',

      // 选择车牌
      showSelect: false, //控制选择车牌底部弹出层
      selected: require("assets/img/carjiantou.png"),
      option: [],
      selectCarArr: [],
      cardNumber: -1, //
      pageLoad: false,
      // statusArr:[],
      payStatus: true,
      headerStyle: {
        background: "",
        boxShadow: ""
      },

      zghS: localStorage.getItem("zghS"),
      paywayList: [],
      zghSceneType: "G7002",
      payradio: "102",
      $appSceneType: "",
      clientip: ""
    };
  },
  components: {
    [Icon.name]: Icon,
    [ActionSheet.name]: ActionSheet,
    [Loading.name]: Loading,
    dialogs
  },
  created() {},

  mounted() {
    let { recordId, bgColor, bgShadow } = this.$route.query;

    this.recordId = recordId;
    this.headerStyle.background = bgColor;
    this.headerStyle.boxShadow = bgShadow;
    // if(this.common.userAuthorStatus()){
    this.init();
    // }
    console.log(this.$route.query);
  },
  methods: {
    init() {
      // 获取新月卡详情
      this.getCardDetails();
      /**
       * 智谷汇App
       */
    },
    getCardDetails() {
      myNewProductDetails({ recordId: this.recordId })
        .then(ret => {
          try {
            let detailInfo = ret.data.myNewProductDetailsList[0];
            this.vehPaiList = ret.data.carLicense; //已选中车牌
            if (this.zghS == "M") {
              this.getPayLists(detailInfo.parkinglotId); //获取支付方式
              this.get_client_ip();
            }
            // 已购月卡车牌不能删除
            // for(let j in this.vehPaiList ){
            //   this.statusArr.push(true)
            // }
            if (detailInfo.productType == "ORDINARY_MONTH") {
              detailInfo.productType = "普通包月";
            } else if (detailInfo.productType == "TIME_SHARING_MONTH") {
              detailInfo.productType = "分时包月";
            }

            if (detailInfo.spaceType == "FIXED_SPACE") {
              detailInfo.spaceType = "固定车位";
            } else if (detailInfo.spaceType == "NO_FIXED_SPACE") {
              detailInfo.spaceType = "非固定车位";
            }

            if (detailInfo.displacementType == "ABOVE_AND_2200") {
              detailInfo.displacementType = "2.2L及以上排量";
            } else if (detailInfo.displacementType == "BELOW_OR_2200") {
              detailInfo.displacementType = "2.2L以下排量";
            }
            // 有效期 开始日期
            detailInfo.effectiveStartDate = detailInfo.effectiveStartDate.split(
              " "
            )[0];
            // 结束日期
            detailInfo.effectiveEndDate = detailInfo.effectiveEndDate.split(
              " "
            )[0];
            detailInfo.effectiveEndDateAddOne = detailInfo.effectiveEndDateAddOne.split(
              " "
            )[0];
            this.detailInfo = detailInfo;
            this.pageLoad = true;
            this.cardNumber = parseInt(detailInfo.carNum);
            console.log(detailInfo);
            return ret.data.carLicense;
          } catch (err) {
            this.$toast(`${err.name}：${err.message}`);
          }
        })
        .then(ret => {
          let vehList = ret; //用户已选的车牌

          // 获取用户可添加车牌列表
          selectCard({ userId: this.userId }).then(ret => {
            let data = ret.data; //所有已添加的车牌
            let arr = [];
            for (let j in data) {
              arr.push(data[j].carLicense);
            }
            // arr 与 vehList 匹配  不相等的拿出来
            let ppArr = this.common.getArrDifference(arr, vehList);
            for (let i = 0; i < ppArr.length; i++) {
              this.option.push({ name: ppArr[i], className: "" });
            }
          });
        });
    },
    // 显示续费弹框
    showRenewDialogs(flag) {
      console.log(flag);
      this.obj.flag = flag;
      if (flag == 15) {
        this.obj.btn = "确认支付";
        this.obj.dateFlag = "CONTINUE";
        this.obj.payInfo = this.detailInfo;
        this.obj.payInfo.sxDate = this.detailInfo.effectiveEndDateAddOne;
        this.obj.payInfo.sceneType = "102H7002"; //续费请求接口参数
        this.obj.payInfo.carLicense = this.vehPaiList;
        this.show = true;
        if (this.zghS == "M") {
          this.obj.payInfo.zghS = this.zghS;
          this.obj.payInfo.paywayList = this.paywayList;
          this.obj.payInfo.payradio = this.payradio;
        }
      }
      if (flag == 10) {
        this.obj.btn = "立即绑定爱车";
        this.showSelectFun();
      }
    },
    // 弹框操作
    closeTc() {
      this.show = false;
    },
    affirms(e) {
      let { obj } = this,
        type = obj.flag, //15支付
        payInfo = obj.payInfo,
        that = this;

      if (type == 15) {
        console.log(obj, "284284284284");
        let payStatus = this.payStatus;
        try {
          if (payStatus) {
            this.payStatus = false;
            if (this.zghS == "M") {
              // 智谷汇App
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
                startDateType: payInfo.dateFlag == "N" ? obj.dateFlag : ""
              };
              renewProduct(params).then(ret => {
                console.log(ret);
                if (ret.status == "200") {
                  that.dataId = ret.data.dataId;
                  that.zghAffirms(e);
                } else {
                  this.payStatus = true;
                  this.$toast(`${ret.message}`);
                }
              });
            } else {
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
                startDateType: payInfo.dateFlag == "N" ? obj.dateFlag : ""
              };
              renewProduct(params).then(ret => {
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
                } else {
                  this.payStatus = true;
                  this.$toast(`${ret.message}`);
                }
              });
            }
          }
        } catch (err) {
          this.payStatus = true;
          this.$toast(`${err.name}：${err.message}`);
        }
      } else if (type == 10) {
        this.$router.push({ path: "/myCar" });
      }
      console.log(obj);
      console.log(e);
      // this.show = false;
    },
    /**
     *智谷汇App 获取手机ip
     */
    get_client_ip() {
      var that = this;
      getClientIp()
        .then(result => {
          that.clientip = result;
        })
        .catch(err => {
          window.console.log(err);
        });
    },
    /**
     *智谷汇App 获取支付方式
     */ getPayLists($parkinglotId) {
      let that = this;
      var param = {
        token: "qrcodezyriuhnAEHz48n",
        parkingLotId: $parkinglotId,
        client: "G"
      };
      getPayList(param).then(result => {
        if (result.status == 200) {
          that.paywayList = result.data;
          if (result.data.length == 0) {
            //没有配置支付渠道
            that.$toast("未配置支付渠道，请联系管理员！");
          } else if (result.data.length == 1) {
            //只有一个支付渠道，直接下单支付
            //this.obj.payInfo.sceneType
            this.payradio = result.data[0].preCode;
            this.$appSceneType = result.data[0].preCode + this.zghSceneType;
          } else {
            //多个支付渠道，弹出选择列表，默认选择第一个
            //this.obj.payInfo.sceneType
            this.payradio = result.data[0].preCode;
            this.$appSceneType = result.data[0].preCode + this.zghSceneType;
          }
        } else {
          this.$toast(result.message);
        }
      });
    },
    chootype(val) {
      this.payradio = val;
      this.$appSceneType = val + this.zghSceneType;
    },
    /**
     * 智谷汇调用支付
     */
    zghAffirms(e) {
      let { obj } = this,
        flag = obj.flag,
        payInfo = obj.payInfo,
        that = this;
      let params = {
        token: "",
        sceneType: this.$appSceneType,
        parkinglotId: this.detailInfo.parkinglotId,
        amountTotal: e.payMoney,
        amountDiscount: 0,
        amountCurrentPay: e.payMoney,
        brandId: "",
        estateId: "",
        agentId: "",
        dataId: this.dataId,
        incomeName: this.detailInfo.productName,
        carLicense: this.vehPaiList.length > 0 ? this.vehPaiList.join(",") : "",
        userIp: "",
        webUrl: "",
        registrationId: this.userId, //localStorage.getItem("userId"),
        monthlySpace: e.month,
        productName: this.detailInfo.productName,
        productId: payInfo.informationId
      };

      if (this.clientip) {
        params.userIp = this.clientip;
        params.webUrl = window.location.href;
      }


      getxPay(params).then(ret => {
        console.log(ret);
        that.payStatus = true;
        if (ret.status == "200" || ret.status == 200) {
          if (that.payradio.indexOf("102") != -1) {
            const paySucUrl = window.location.origin + "/monthPay/#/buySuccess";
            window.location.href =
              ret.data.h5PayBody + "&redirect_url=" + encodeURIComponent(paySucUrl);
          } else if (that.payradio.indexOf("103") != -1) {
            //支付宝
            that.alipayStip(ret.data.h5PayBody);
          }
        } else {
          this.$toast(`${ret.message}`);
        }
      });
    },
    //智谷汇支付宝调用支付
    alipayStip(formPage) {
      var aliH5PayBody = decodeURI(formPage);
      var doc = document.open("text/html", "replace");
      doc.write(aliH5PayBody);
      doc.close();
      this.payStatus = true;
    },
    // 显示底部选择车牌弹框并渲染高亮
    showSelectFun() {
      if (this.option.length == 0) {
        //添加车牌
        this.show = true;
      } else {
        for (let j in this.option) {
          if (this.vehPaiList.indexOf(this.option[j].name) != -1) {
            this.option.splice(j, 1);
          } else {
            this.option[j].className = "";
          }
        }
        this.showSelect = true;
      }
    },

    // 单个添加车牌
    onSelect(item) {
      let option = this.option;
      this.showSelect = false;
      let data = {
        carLicense: item,
        recordId: this.recordId,
        userId: this.userId
      };

      addCarLicenseInProduct(data).then(ret => {
        if (ret.status == "200") {
          this.vehPaiList.push(item);
          // 删除底部弹出层的 车牌选项  选中哪个 移除哪个
          for (let i = 0; i < option.length; i++) {
            if (option[i].name == item) {
              this.option.splice(i, 1);
              break;
            }
          }
          this.$toast("车牌添加成功，次日00:00生效。");
        } else {
          this.$toast(`${ret.message}`);
        }
        console.log(ret);
      });
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
            paySign: jsApiObject.paySign //微信签名
          },
          res => {
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
        this.$toast(`${err.name}：${err.message}`);
      }
    }
  }
};
</script>
<style scoped>
.bind_new_carpai {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: blue;
  font-size: 24px;
  color: #fff;
  position: fixed;
  bottom: 80px;
  right: 40px;
}
.card_header {
  padding: 48px 48px 64px;
  width: 654px;
  height: 340px;
  box-sizing: border-box;
  background-color: #5175ff;
  border-radius: 24px;
  opacity: 0.95;
  margin: 34px auto 60px;
  justify-content: space-between;
  align-items: flex-start;
}
.card_name {
  font-size: 40px;
  color: #fff;
  margin-bottom: 24px;
}
.card_tips,
.card_park_address {
  font-size: 24px;
  color: #fff;
  opacity: 0.85;
}
.address_text {
  margin-left: 12px;
}
.section_content_look {
  width: 660px;
  margin-bottom: 46px;
}
.vehicle_type,
.vehicle_time,
.vehicle_validity {
  margin-bottom: 48px;
}
.vehicle_num {
  margin-bottom: 28px;
}
.content_title {
  font-size: 36px;
  color: #333;
}
.type_info,
.time_info {
  font-size: 28px;
  color: #333;
  margin-top: 16px;
}

/* 选择车牌 */
.veh_num_tips {
  font-size: 24px;
  color: #999;
  margin: 8px 0 16px;
}
.veh_pai_list {
  flex-wrap: wrap;
}
.veh_add_btn {
  width: 192px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  border: 2px dashed #e1e1e1;
  border-radius: 8px;
  font-size: 28px;
  color: #008cff;
  margin: 16px 20px 0 0;
}
.user_add_item {
  width: 196px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  background-color: rgba(217, 151, 78, 0.05);
  border-radius: 8px;
  border: 2px solid rgba(217, 151, 78, 0.45);
  margin: 16px 16px 0 0;
  position: relative;
}
.item_text {
  font-size: 28px;
  color: #d9974e;
}
.close_car_pai {
  position: absolute;
  right: -18px;
  top: -18px;
  font-size: 36px;
  color: #d9974e;
}
.validity_info {
  font-size: 28px;
  color: #333;
  margin: 16px 0 8px;
}

/* 月卡说明 */
.ins_list {
  margin-top: 24px;
}
.ins_item {
  align-items: flex-start;
  margin-bottom: 16px;
}
.ins_item_num,
.ins_item_con {
  font-size: 28px;
  color: #333;
}
/* 底部信息 */
.agreement {
  width: 750px;
  height: 68px;
  line-height: 68px;
  padding-left: 48px;
  box-sizing: border-box;
  border-top: 1px solid #e1e1e1;
  border-bottom: 1px solid #e1e1e1;
}
.agree_gray {
  font-size: 24px;
  color: #999;
}
.look_agree {
  font-size: 24px;
  color: #008cff;
}

.renew_info {
  width: 750px;
  padding: 24px 48px;
  box-sizing: border-box;
  justify-content: space-between;
}
.money_symbol,
.money_decimal {
  font-size: 28px;
  color: #ff5765;
  font-weight: bold;
}
.big_money {
  font-size: 48px;
  color: #ff5765;
}
.renew_btn {
  width: 288px;
  height: 88px;
  line-height: 88px;
  font-size: 32px;
  color: #fff;
  text-align: center;
  border-radius: 44px;
  background-color: #008cff;
}

.selectList li,
.van-action-sheet__cancel {
  line-height: 60px;
  border-bottom: 1px solid rgba(225, 225, 225, 0.45);
  font-size: 26px;
  color: #333333;
  text-align: center;
}
.selectList li {
  line-height: 104px;
  font-size: 26px;
}
.selectList li.selected {
  color: #008cff;
  background-repeat: no-repeat;
  background-size: 20px 10px;
  background-position: 65% 47px;
}
.handleBtn {
  width: 100%;
  height: 104px;
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  line-height: 104px;
  font-size: 28px;
  padding: 0 32px;
  box-sizing: border-box;
  border-bottom: 2px solid rgba(225, 225, 225, 0.45);
}
.handleBtn span:nth-of-type(1) {
  color: #999999;
}
.handleBtn span:nth-of-type(2) {
  color: #333333;
}
.center_loading {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>