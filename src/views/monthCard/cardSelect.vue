<template>
  <div class="select-container">
    <div class="card_header column">
      <div class="card_info_header">
        <div class="card_name_header">{{ swiperList.productName }}</div>
        <div class="card_tips">{{ swiperList.productType }}</div>
      </div>
      <div class="card_park_address row">
        <van-icon name="location" />
        <span class="address_text">{{ carInfo.parkinglotName }}</span>
      </div>
      <div class="card_bottom">
        {{ swiperList.spaceType
        }}{{
          swiperList.displacementType ? "·" + swiperList.displacementType : ""
        }}
      </div>
    </div>

    <div class="section_wrap_select column">
      <div class="section_content_select">
        <div class="section_top_tips">
          月卡均按月数计费，您可以在下方增加购买月
        </div>
        <div class="vehicle_type">
          <div class="content_title">车位类型</div>
          <div class="type_info">{{ swiperList.spaceType }}</div>
        </div>
        <div class="vehicle_num">
          <div class="content_title">车位数</div>
          <div class="veh_num_tips">
            您购买{{ selectedInfo.spaceNumber }}个车位，最多支持添加{{
              selectedInfo.carNumber
            }}个车牌
          </div>
          <div class="parking_lot_select row">
            <div
              class="par_log_select_item"
              v-for="(item, index) in parkLotList"
              :key="index"
              @click="selectParkLot(index)"
              :class="{ active: parLotIndex == index }"
            >
              {{ item.spaceNumber }}个车位
              <img
                src="@/assets/img/yixuan@2x.png"
                v-if="parLotIndex == index"
                class="selected_icon"
              />
            </div>
          </div>
          <div class="veh_add">
            <div class="veh_add_title" v-if="displacement == -1">
              请添加您的号牌
            </div>
            <div class="veh_add_title" v-else>
              请添加{{ displacement }}车辆号牌
            </div>
            <div class="veh_pai_list row">
              <div class="veh_pai_list row">
                <!-- 用户添加的车牌 -->
                <template v-if="vehPaiList.length > 0">
                  <div
                    class="user_add_item"
                    v-for="(item, index) in vehPaiList"
                    :key="index"
                    @click="showRenewDialogs(10)"
                  >
                    {{ item }}
                  </div>
                </template>
              </div>
              <template v-if="carNum - vehPaiList.length > 0">
                <!-- 添加车牌 -->
                <div
                  v-for="index in carNum - vehPaiList.length"
                  :key="index"
                  class="veh_add_btn"
                  @click="showRenewDialogs(10)"
                >
                  + 选择车牌
                </div>
              </template>
            </div>
            <!-- <div class="veh_add_tips">请如实提交车辆信息，认证通过后月卡权限即</div> -->
          </div>
        </div>
        <div class="pur_ins">
          <div class="content_title">购买须知</div>
          <div class="ins_list">
            <div
              class="ins_item row"
              v-for="(item, index) in purInsList"
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
      <div class="footer_money_oper row">
        <div class="money_left">
          <span class="left_gj">共计:</span>
          <span class="money_symbol">￥</span>
          <span class="big_money">{{
            payMoney != 0 ? payMoney : selectedInfo.monthAmount
          }}</span>
          <!-- <span class="money_decimal">.00</span> -->
          <span :class="discountStatus ? 'yes_dis' : 'discount'">{{
            discountStatus ? "有优惠" : "无优惠"
          }}</span>
        </div>
        <div class="oper_right row">
          <img
            src="@/assets/img/-@2x.png"
            class="oper_money_img"
            @click="operMonth('reduce')"
          />
          <div class="add_month">{{ month }}个月</div>
          <img
            src="@/assets/img/+@2x.png"
            class="oper_money_img"
            @click="operMonth('add')"
          />
        </div>
      </div>

      <ul class="paylist">
        <li
          class="payitem"
          v-for="payItem in paywayList"
          v-bind:key="payItem.preCode"
        >
          <img
            class="payitemimg"
            :src="'http://image.sz-investment.com' + payItem.payIcon"
            alt
          />
          <div class="textwrap">
            <div class="paytitle">{{ payItem.payName }}</div>
            <div class="paydesc">{{ payItem.remark }}</div>
          </div>
          <div class="chooseImg">
            <img
              class="footer_tips_icon"
              :src="payradio == payItem.preCode ? radioChecked : radioNot"
              @click="choosetype(payItem.preCode)"
            />
          </div>
        </li>
      </ul>

      <div class="footer_btn" @click="showRenewDialogs(15)">立即购买</div>
      <div class="footer_tips row">
        <img
          class="footer_tips_icon"
          :src="radioStatus ? radioChecked : radioNot"
          @click="radioStatus = !radioStatus"
        />
        <span class="ips_info">购买即表示同意</span>
        <router-link :to="{ path: '/agreeMent' }" class="look_agr"
          >《车位租赁协议》</router-link
        >
      </div>
    </div>

    <van-action-sheet
      :round="false"
      v-model="showSelect"
      :close-on-click-overlay="false"
    >
      <div class="handleBtn clearfix">
        <span class="fl" @click="showSelect = false">取消</span>
        <span class="fr" @click="selectCarNumber">确认</span>
      </div>
      <ul class="selectList">
        <li
          v-for="(item, index) in option"
          :key="index"
          @click="onSelect(item.name, index)"
          :class="[item.className, item.notCheck ? 'not_check' : '']"
          :style="{
            backgroundImage: 'url(' + (item.className ? selected : '') + ')'
          }"
        >
          {{ item.name }}
        </li>
      </ul>
    </van-action-sheet>
    <dialogs
      :show="showToast"
      :obj="obj"
      @closepop="closeTc"
      @affirmBtn="affirms"
      @changePayInfo="changePayInfo"
      v-if="showToast"
    />
  </div>
</template>
<script>
import {
  getProduct,
  chooseCard,
  selectCard,
  buyProduct,
  userPay,
  getPayList,
  getClientIp,
  getxPay
} from "network/index";
import { Icon, ActionSheet, Toast } from "vant";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import dialogs from "components/dialog.vue";

export default {
  data() {
    return {
      parLotIndex: 0, //车位选中下标  默认为1
      parkLotList: [], //后台返回选择车位列表
      spaceNum: 0, //车位数
      carNum: 0, //车辆数
      displacement: -1, //排量
      vehPaiList: [],
      purInsList: [
        "包月卡购买时所选车辆需车主认证通过，提交身份证，驾驶证，行驶证等信息，未认证通过车辆不可购买月卡。若证件有更新，需及时提交更新，若未及时提供，甲方有权拒绝继续为其提供月租服务；",
        "月卡统一为自然月时长。例：本月15日0时生效，次月14日23:59:59秒后失效。",
        "月卡若为分时包月，购买时请确认单日中停车费用减免时间。在月卡生效时段内停车费减免，超出时段停车按车场标准计费。",
        "若以优惠价格购买的季卡、半年卡、年卡等产品，退费时均以最后月份计算并抵扣对应优惠金额，除抵扣月外，均按月单价计价。",
        "购买月卡成功并生效后，所添加车辆即获得场内停车权限，解绑号牌后月卡权益依然有效，更换号牌请联系客服。",
        "车位租赁协议为纸质版，若线上购买即表示已接受纸质版车位租赁协议，如需办理可致电客服联系纸质版协议签署。"
      ], //购买须知
      month: 1,
      swiperList: {},
      informationId: "", //当前渲染的月卡id
      informationName: "", //当前渲染的月卡Name
      selectedInfo: {}, //切换选中项
      payMoney: 0,
      showSelect: false, //控制选择车牌底部弹出层
      selected: require("@/assets/img/carjiantou.png"),
      option: [],
      userId: localStorage.getItem("userId"), //"355f51a76a584db181cc669c9d3b4db1",
      selectCarArr: [],
      showToast: false,
      obj: {
        btn: "立即绑定爱车", //单个按钮名称
        btn1: "取消", //双按钮第一个
        btn2: "继续", //双按钮第二个
        type: 1, //控制按钮, 1 单按钮 2 双按钮
        flag: 10 //控制弹窗显示内容
      },
      carInfo: {},
      radioStatus: false,
      radioChecked: require("@/assets/img/tongyi@2x.png"),
      radioNot: require("@/assets/img/butongyi@2x.png"),
      discountStatus: false, //当前购买有无优惠
      userInfo: JSON.parse(localStorage.getItem("userInfo")),
      payStatus: true,
      zghS: localStorage.getItem("zghS"),
      paywayList: [],
      zghSceneType: "G7001",
      payradio: "102",
      $appSceneType: "",
      clientip: "",
      dataId:""
    };
  },
  components: {
    [Icon.name]: Icon,
    [ActionSheet.name]: ActionSheet,
    dialogs
  },
  created() {
    console.log(this.$route.query);
  },
  mounted() {
    this.carInfo = this.$route.query;
    this.init();
    console.log(this.$data);
  },
  watch: {},
  methods: {
    init() {
      // 获取页面顶部轮播月卡
      this.getSwiperList();
      /**
       * 智谷汇App
       */
      if (this.zghS === "M") {
        this.getPayLists(); //获取支付方式
        this.get_client_ip();
      }
    },
    getSwiperList() {
      try {
        let { parkinglotId, parkinglotName, index } = this.$route.query,
          swiperList = [];
        getProduct({ parkinglotId }).then(res => {
          swiperList = res.data;
          swiperList.forEach((item, index) => {
            item.parkingName = parkinglotName;
            if (item.productType == "ORDINARY_MONTH") {
              item.productType = "普通包月";
            } else if (item.productType == "TIME_SHARING_MONTH") {
              item.productType = "分时包月";
            }

            if (item.spaceType == "FIXED_SPACE") {
              item.spaceType = "固定车位";
            } else if (item.spaceType == "NO_FIXED_SPACE") {
              item.spaceType = "非固定车位";
            }

            if (item.displacementType == "ABOVE_AND_2200") {
              item.displacementType = "2.2L及以上排量";
            } else if (item.displacementType == "BELOW_OR_2200") {
              item.displacementType = "2.2L以下排量";
            }
          });
          this.informationId = swiperList[index].informationId;

          this.swiperList = swiperList[index];
          this.getBgColor();

          // 获取用户可添加车牌列表
          selectCard({ userId: this.userId }).then(ret => {
            let data = ret.data;
            if (data.length > 0) {
              for (let i in data) {
                if (data[i].displacementType == "ABOVE_AND_2200") {
                  data[i].displacementType = "2.2L及以上排量";
                }
                if (data[i].displacementType == "BELOW_OR_2200") {
                  data[i].displacementType = "2.2L以下排量";
                }
                console.log(
                  swiperList[index].displacementType,
                  data[i].displacementType
                );
                // 获取用户已添加车牌的排量 符合月卡排量标准才可选择
                if (
                  swiperList[index].displacementType ==
                    data[i].displacementType ||
                  !swiperList[index].displacementType
                ) {
                  this.option.push({ name: data[i].carLicense, className: "" });
                } else {
                  // 否则禁止用户点击
                  this.option.push({
                    name: data[i].carLicense,
                    className: "",
                    notCheck: true
                  });
                }
              }
            }
          });

          return this.getMonthCardInfo(this.informationId);
        });
      } catch (err) {
        this.$toast(`${err.name}：${err.message}`);
      }
    },
    // 获取月卡信息
    getMonthCardInfo(informationId) {
      chooseCard({ informationId }).then(ret => {
        let selectedInfo = ret.data[0];

        this.spaceNum = selectedInfo.spaceNumber;
        this.carNum = parseInt(selectedInfo.carNumber); //车牌数
        if (selectedInfo.displacementType == "BELOW_OR_2200") {
          this.displacement = "2.2L以下排量";
        } else if (selectedInfo.displacementType == "ABOVE_AND_2200") {
          this.displacement = "2.2L及以上排量";
        }
        if (selectedInfo.spaceType == "FIXED_SPACE") {
          selectedInfo.spaceType = "固定车位";
        } else if (selectedInfo.spaceType == "NO_FIXED_SPACE") {
          selectedInfo.spaceType = "非固定车位";
        }
        // 初始化选中项 默认第一个
        this.selectedInfo = selectedInfo;
        this.parkLotList = ret.data;
      });
    },

    // 显示购买弹框
    showRenewDialogs(flag) {
      console.log(flag);
      this.obj.flag = flag;
      if (flag == 15) {
        if (!this.radioStatus) {
          this.$toast("请同意租赁协议!");
          return;
        }
        this.obj.payInfo = this.selectedInfo;
        this.obj.btn = "立即购买";
        this.obj.payInfo.sceneType = "102H7001"; //续费请求接口参数
        this.obj.payInfo.parkinglotName = this.carInfo.parkinglotName;
        this.obj.payInfo.payMoney = this.payMoney;
        this.obj.payInfo.month = this.month;
        console.log(this.obj.payInfo);
        this.showToast = true;
      }
      if (flag == 10) {
        this.showSelectFun();
      }
    },
    /**
     *智谷汇App 获取支付方式
     */
    getPayLists() {
      var that = this;
      let { parkinglotId, parkinglotName, index } = this.$route.query;
      var param = {
        token: "qrcodezyriuhnAEHz48n",
        parkingLotId: parkinglotId,
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
    choosetype(val) {
      this.payradio = val;
      this.$appSceneType = val + this.zghSceneType;
    },
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
    // 选择车位
    selectParkLot(index) {
      this.payMoney = 0;
      this.month = 1;
      let { parkLotList } = this,
        selected = parkLotList[index]; //选中项

      this.carNum = parseInt(selected.carNumber); //车牌数
      if (selected.displacementType == "BELOW_OR_2200") {
        this.displacement = "2.2L以下排量";
      } else if (selected.displacementType == "ABOVE_AND_2200") {
        this.displacement = "2.2L及以上排量";
      }
      if (selected.spaceType == "FIXED_SPACE") {
        selected.spaceType = "固定车位";
      } else if (selected.spaceType == "NO_FIXED_SPACE") {
        selected.spaceType = "非固定车位";
      }

      this.selectedInfo = selected;
      this.parLotIndex = index;
      this.vehPaiList = [];
    },
    // 操作月份
    /**
     * @param {String} type 添加add || 减少reduce
     */
    operMonth(type) {
      let selectedInfo = this.selectedInfo,
        payMoney = selectedInfo.monthAmount, //初始化支付价格 按月付价格
        payInfo = selectedInfo, //弹框支付信息赋值
        price = selectedInfo.monthAmount; //单价不变 不渲染页面 只计算合计

      let month = this.month;
      if (type == "add") {
        // 添加月
        if (month == 12) {
          this.$toast("最多只可购12个月时长");
          return;
        }
        this.month += 1;
      } else {
        // 减少月
        if (month == 1) {
          return;
        }
        this.month -= 1;
      }
      if (this.month != 3 && this.month != 6 && this.month != 12) {
        this.discountStatus = false;
        this.payMoney = parseFloat(price * this.month).toFixed(2);
      } else {
        if (this.month == 3) {
          if (payInfo.seasonAmount || payInfo.seasonAmount == 0) {
            this.discountStatus = true;
            this.payMoney = payInfo.seasonAmount;
          } else {
            this.discountStatus = false;
            this.payMoney = parseFloat(price * this.month).toFixed(2);
          }
        }
        if (this.month == 6) {
          if (payInfo.halfYearAmount || payInfo.halfYearAmount == 0) {
            this.discountStatus = true;
            this.payMoney = payInfo.halfYearAmount;
          } else {
            this.discountStatus = false;
            this.payMoney = parseFloat(price * this.month).toFixed(2);
          }
        }
        if (this.month == 12) {
          if (payInfo.yearAmount || payInfo.yearAmount == 0) {
            this.discountStatus = true;
            this.payMoney = payInfo.yearAmount;
          } else {
            this.discountStatus = false;
            this.payMoney = parseFloat(price * this.month).toFixed(2);
          }
        }
      }
    },
    // 子组件改变购买月份和价格 父组件实时渲染
    changePayInfo(e) {
      this.month = e.month;
      this.payMoney = e.payMoney;
      this.discountStatus = e.discountStatus; //有无优化
    },
    showSelectFun() {
      if (this.option.length == 0) {
        //添加车牌
        this.showToast = true;
      } else {
        //选择车牌;
        this.selectCarArr = [];
        //选择默认的
        for (let i in this.vehPaiList) {
          this.selectCarArr.push(this.vehPaiList[i]);
        }
        for (let j in this.option) {
          if (this.vehPaiList.indexOf(this.option[j].name) != -1) {
            this.option[j].className = "selected";
          } else {
            this.option[j].className = "";
          }
        }
        this.showSelect = true;
      }
    },
    closeTc() {
      this.showToast = false;
    },
    affirms(e) {
      let { obj } = this,
        flag = obj.flag,
        payInfo = obj.payInfo,
        that = this;
      if (flag == 15) {
        let payStatus = this.payStatus;
        try {
          let { parkinglotId, parkinglotName, index } = this.$route.query;
          // 避免用户点击多次确认支付 初始化为true
          if (payStatus) {
            this.payStatus = false;
            if (this.zghS == "M") {
              //智谷汇App 支付流程
           
              // 调取支付
              let params = {
                amountPayed: e.payMoney,
                carLicenses:
                  this.vehPaiList.length > 0 ? this.vehPaiList.join(",") : "",
                parkinglotId,
                priceId: payInfo.priceId,
                productId: payInfo.informationId,
                purchasingMonth: e.month,
                recordId: "", //this.recordId,
                userId: this.userId, //localStorage.getItem("userId"),
                openId: this.userInfo.openId,
                sceneType: payInfo.sceneType
              };
              buyProduct(params).then(ret => {
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
              // 调取支付
              let params = {
                amountPayed: e.payMoney,
                carLicenses:
                  this.vehPaiList.length > 0 ? this.vehPaiList.join(",") : "",
                parkinglotId,
                priceId: payInfo.priceId,
                productId: payInfo.informationId,
                purchasingMonth: e.month,
                recordId: "", //this.recordId,
                userId: this.userId, //localStorage.getItem("userId"),
                openId: this.userInfo.openId,
                sceneType: payInfo.sceneType
              };
              buyProduct(params).then(ret => {
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

            console.log(e);
          }
        } catch (err) {
          this.payStatus = true;
          this.$toast(`${err.name}：${err.message}`);
        }
      } else if (flag == 10) {
        this.$router.push({ path: "/myCar" });
      }

      this.showToast = false;
    },
    /**
     * 智谷汇调用支付
     */
    zghAffirms(e) {
      let { obj } = this,
        flag = obj.flag,
        payInfo = obj.payInfo,
        that = this;
      let { parkinglotId, parkinglotName, index } = this.$route.query;
      let params = {
        token: "",
        sceneType: this.$appSceneType,
        parkinglotId,
        amountTotal: e.payMoney,
        amountDiscount: 0,
        amountCurrentPay: e.payMoney,
        brandId: "",
        estateId: "",
        agentId: "",
        dataId: this.dataId,
        incomeName: this.swiperList.productName,
        carLicense: this.vehPaiList.length > 0 ? this.vehPaiList.join(",") : "",
        userIp: "",
        webUrl: "",
        registrationId: this.userId, //localStorage.getItem("userId"),
        monthlySpace: e.month,
        productName: this.swiperList.productName,
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
            window.location.href = ret.data.h5PayBody + "&redirect_url=" + encodeURIComponent(paySucUrl);
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
    selectCarNumber() {
      //  选择车牌确定按钮
      if (this.selectCarArr.length > this.selectedInfo.carNumber) {
        this.$toast(
          "该车位最多支持添加" + this.selectedInfo.carNumber + "个车位"
        );
        return;
      }
      this.vehPaiList = [];
      for (let i in this.selectCarArr) {
        this.vehPaiList.push(this.selectCarArr[i]);
      }
      this.showSelect = false;
    },
    onSelect(item, index) {
      let option = this.option,
        clickItem = option[index];

      // 排量不符合当前月卡标准
      if (clickItem.notCheck) {
        return;
      }

      //可以选择车牌；
      for (let i in this.option) {
        if (item == this.option[i].name) {
          if (this.option[i].className == "") {
            this.selectCarArr.push(item);
            this.option[i].className = "selected";
          } else {
            this.option[i].className = "";
            var sindex = this.selectCarArr.indexOf(item);
            if (sindex > -1) this.selectCarArr.splice(sindex, 1);
          }
        }
      }
    },
    getRandomColor() {
      var letters = "0123456789ABCDEF";
      var color = "#";
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },
    getBgColor() {
      for (let i in this.swiperList) {
        if (i % 5 == 0) {
          this.swiperList[i].bgColor = "#5178A7";
          this.swiperList[i].bgShadow =
            "box-shadow:0px 10px 24px 0px rgba(81,120,167,0.45);";
        } else if (i % 5 == 1 || i == 0) {
          this.swiperList[i].bgColor = "#BF78F9";
          this.swiperList[i].bgShadow =
            "box-shadow:0px 10px 24px 0px rgba(191,120,249,0.45);";
        } else if (i % 5 == 2) {
          this.swiperList[i].bgColor = "#F7B14E";
          this.swiperList[i].bgShadow =
            "box-shadow:0px 10px 24px 0px rgba(247,177,78,0.55);";
        } else if (i % 5 == 3) {
          this.swiperList[i].bgColor = "#34BA94";
          this.swiperList[i].bgShadow =
            "box-shadow:0px 10px 24px 0px rgba(52,186,148,0.4);";
        } else if (i % 5 == 4) {
          this.swiperList[i].bgColor = "#34BA94";
          this.swiperList[i].bgShadow =
            "box-shadow:0px 10px 24px 0px rgba(52,186,148,0.4);";
        }
      }
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
            this.payStatus = true;
            if (res.err_msg == "get_brand_wcpay_request:ok") {
              this.$router.push("buySuccess");
            } else {
              this.$toast("支付失败!");
            }
            console.log(res);
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
.card_header {
  padding: 48px 48px 34px;
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
.card_name_header {
  font-size: 40px;
  color: #fff;
  margin-bottom: 24px;
}
.card_tips,
.card_park_address,
.card_bottom {
  font-size: 24px;
  color: #fff;
  opacity: 0.85;
}
.card_bottom {
  width: 100%;
  padding-top: 16px;
  border-top: 1px dashed rgba(255, 255, 255, 0.15);
}
.address_text {
  margin-left: 12px;
}
.header_swiper {
  width: 750px;
  margin: 34px auto 40px;
  --swiper-theme-color: #008cff;
}
.swiper-container {
  width: 750px;
  height: 322px;
  padding: 0 40px;
  box-sizing: border-box;
}
.swiper-pagination {
  bottom: 0 !important;
}
.swiper-pagination-bullet {
  width: 8px;
  height: 4px;
  border-radius: 4px;
  background-color: #ddd;
  display: inline-block;
}
.swiper-pagination-bullet-active {
  width: 24px;
  background-color: #008cff;
}
.swiper_item_info {
  width: 560px;
  height: 304px;
  padding: 40px 40px 16px;
  box-sizing: border-box;
  align-items: flex-start;
}
.swiper-slide {
  width: 560px;
  height: 304px;
  border-radius: 16px;
  opacity: 0.95;
}

/* 月卡信息 */
.card_name {
  font-size: 40px;
  color: #fff;
  margin-bottom: 8px;
}
.card_info,
.basic_bottom {
  font-size: 24px;
  color: #fff;
  opacity: 0.85;
}
.basic_bottom {
  margin-top: 40px;
}
.parking_address {
  margin-left: 6px;
}
.item_basic_bottom {
  width: 100%;
  padding-top: 16px;
  margin-top: 24px;
  border-top: 1px dashed rgba(255, 255, 255, 0.15);
  font-size: 24px;
  color: #fff;
  opacity: 0.65;
}

.section_content_select {
  width: 660px;
}
.section_top_tips {
  font-size: 24px;
  color: #999;
  margin-bottom: 40px;
}

/* 车位类型 */
.vehicle_type {
  margin-bottom: 48px;
}
.content_title {
  font-size: 36px;
  color: #333;
  font-weight: 500;
}
.type_info {
  width: 160px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  font-size: 28px;
  color: #bbb;
  border: 2px solid rgba(0, 0, 0, 0.1);
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 8px;
  margin-top: 16px;
}

/* 车位数 */
.veh_num_tips {
  font-size: 24px;
  color: #999;
  margin: 8px 0 16px;
}
.par_log_select_item {
  width: 160px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  font-size: 28px;
  color: #d9974e;
  background-color: rgba(217, 151, 78, 0.05);
  margin-right: 16px;
  border-radius: 8px;
  position: relative;
  box-sizing: border-box;
}
.par_log_select_item.active {
  background: linear-gradient(
    239deg,
    rgba(255, 232, 211, 0) 0%,
    rgba(255, 232, 211, 0.8) 100%
  );
  color: #333;
  border: none;
  border: 2px solid rgba(217, 151, 78, 1);
}
.selected_icon {
  width: 48px;
  height: 28px;
  position: absolute;
  left: 0;
  top: 0;
}
.veh_add_title {
  font-size: 28px;
  font-weight: 500;
  color: #333;
  margin: 0 0 16px;
}
.parking_lot_select {
  margin-bottom: 32px;
}
/* 选择车牌 */
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
  margin: 0 16px 20px 0;
}
.user_add_item {
  width: 196px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  font-size: 28px;
  color: #d9974e;
  background-color: rgba(217, 151, 78, 0.05);
  border-radius: 8px;
  border: 2px solid rgba(217, 151, 78, 1);
  margin: 0 16px 20px 0;
}
.veh_add_tips {
  width: 654px;
  height: 72px;
  line-height: 72px;
  font-size: 24px;
  color: #999;
  padding-left: 24px;
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 8px;
  margin-top: 4px;
}
/* 购买须知 */
.pur_ins {
  margin-top: 40px;
}
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
.footer {
  width: 750px;
  margin-top: 60px;
  padding: 32px 48px;
  box-sizing: border-box;
  border-top: 2px solid #e1e1e1;
  background-color: #fff;
}
.footer_money_oper {
  justify-content: space-between;
}
.left_gj {
  font-size: 24px;
  color: #333;
}
.money_symbol,
.money_decimal {
  font-size: 28px;
  color: #ff5765;
}
.money_decimal {
  font-weight: bold;
}
.big_money {
  font-size: 48px;
  font-weight: bold;
  color: #ff5765;
}
.discount {
  font-size: 24px;
  color: #999;
}
.yes_dis {
  font-size: 24px;
  color: #ff5765;
}
.oper_money_img {
  width: 40px;
  height: 40px;
}
.add_month {
  font-size: 28px;
  color: #000;
  margin: 0 24px;
}
.footer_btn {
  width: 654px;
  height: 88px;
  line-height: 88px;
  text-align: center;
  font-size: 32px;
  color: #fff;
  border-radius: 44px;
  background-color: #008cff;
  margin: 40px 0 24px;
}
.footer_tips {
  justify-content: center;
}
.footer_tips_icon {
  width: 32px;
  height: 32px;
  margin-right: 16px;
}
.ips_info {
  font-size: 24px;
  line-height: 24px;
  color: #999;
}
.look_agr {
  font-size: 24px;
  line-height: 24px;
  color: #008cff;
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
.selectList li.not_check {
  color: #aaa;
}

/* 支付方式 */
.paylist {
  margin: 40px auto;
}
.payitemimg {
  width: 35px;
  height: 35px;
}
.payitem {
  position: relative;
  margin-bottom: 10px 0 0 0;
}
.textwrap,
.payitemimg {
  display: inline-block;
  vertical-align: middle;
}
.textwrap {
  margin-bottom: 15px;
}
.textwrap .paytitle {
  font-size: 26px;
  margin-bottom: 5px;
}
.textwrap .paydesc {
  font-size: 22px;
  color: #999;
}
.chooseImg {
  position: absolute;
  right: 0;
  top: 8px;
}
</style>