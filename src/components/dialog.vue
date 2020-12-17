<template>
  <div v-show="show">
    <div class="dialog_bod">
      <div class="dialog_bod_cont">
        <img
          class="dialog_close"
          @click="closeTc"
          src="~assets/images/close.png"
        />
        <!-- 上传证件 -->
        <div v-if="obj.flag == 1">
          <div class="dialog_tit">请上传所有证件，进行车主认证审核</div>
          <div class="dialog_txt">认证通过后即可购买月卡</div>
        </div>
        <!-- 绑定成功 -->
        <div v-else-if="obj.flag == 2">
          <div class="dialog_tit">恭喜您，绑定成功！</div>
          <div class="dialog_txt">认证后即可购买月卡，是否立即认证？</div>
        </div>
        <!-- 绑定认证  -->
        <div v-else-if="obj.flag == 3">
          <div class="dialog_tit">请绑定爱车后再进行认证哦～</div>
          <div class="dialog_txt">认证后即可购买月卡，是否立即认证？</div>
        </div>
        <!-- 排量不符合该月卡购买要求  -->
        <div v-else-if="obj.flag == 4">
          <div class="dialog_tit">该号牌排量不符合该月卡购买要求！</div>
          <div class="dialog_txt">认证后即可购买月卡，是否立即认证？</div>
        </div>
        <!-- 您不是老用户  -->
        <div v-else-if="obj.flag == 5">
          <div class="dialog_tit">您不是老用户</div>
          <div class="dialog_txt">您的号牌没有办理过历史月卡</div>
        </div>
        <!-- 确认更换车牌？  -->
        <div v-else-if="obj.flag == 6">
          <div class="dialog_tit">确认更换车牌？</div>
          <div class="dialog_txt">车牌更换后将在次日0时生效，生效前有效</div>
          <div class="dialog_txt">车牌仍未更换前车辆。</div>
        </div>
        <!-- 您没有该号牌管理权限！  -->
        <div v-else-if="obj.flag == 7">
          <div class="dialog_tit">您没有该号牌管理权限！</div>
          <div class="dialog_txt">请确认购买月卡时的手机号码与号牌是否对应</div>
        </div>
        <!-- 该号牌还未认证车主，是否去认证  -->
        <div v-else-if="obj.flag == 8">
          <div class="dialog_tit">该号牌还未认证车主，是否去认证</div>
          <div class="dialog_txt">请确认您的号牌排量及月卡要求</div>
        </div>
        <!-- 确认提交以上信息？  -->
        <div v-else-if="obj.flag == 9">
          <div class="dialog_tit">确认提交以上信息？</div>
          <div class="dialog_txt">审核通过后即可购买对应月卡产品，</div>
          <div class="dialog_txt">审核时间1个工作日内完成审核。</div>
        </div>
        <!-- 您还未添加任何车辆  -->
        <div v-else-if="obj.flag == 10">
          <div class="dialog_tit">您还未添加任何车辆</div>
          <div class="dialog_txt">添加爱车后才可添加车牌</div>
        </div>
        <!-- 该号牌已有其他月卡产品，无法添加  -->
        <div v-else-if="obj.flag == 11">
          <div class="dialog_tit">该号牌已有其他月卡产品，无法添加</div>
          <div class="dialog_txt">请选择未购买服务产品的车牌号，或</div>
          <div class="dialog_txt">其他月卡产品到期后再行购买</div>
        </div>
        <!-- 确认更换车牌？  -->
        <div v-else-if="obj.flag == 12">
          <div class="dialog_tit">确认更换车牌？</div>
          <div class="dialog_txt">车牌更换后将次日0时生效，生效前有效</div>
          <div class="dialog_txt">车牌仍未更换前车辆。</div>
        </div>
        <!-- 您确定解绑该号牌月卡？  -->
        <div v-else-if="obj.flag == 13">
          <div class="dialog_tit">您确定解绑该号牌月卡？</div>
          <div class="dialog_txt">解绑后，您可以重新找回月卡，</div>
          <div class="dialog_txt">并管理续费。</div>
        </div>
        <!-- 恭喜您，已查询到您的月卡！  -->
        <div v-else-if="obj.flag == 14">
          <div class="dialog_tit">恭喜您，已查询到您的月卡！</div>
          <template v-if="obj.cardList">
            <div class="dialog_mycard" v-if="obj.cardList.length == 1">
              <p class="dialog_mycard_tit">我的月卡</p>
              <p class="dialog_mycard_txt">{{ obj.cardList[0].productName }}</p>
              <p class="dialog_mycard_set">
                {{ obj.cardList[0].parkinglotName }}
              </p>
            </div>
            <div class="dialog_mycard_list" v-else>
              <div
                class="dialog_mycard dialog_mycards"
                v-for="(item, index) in obj.cardList"
                :key="index"
              >
                <p class="dialog_mycard_tit">我的月卡</p>
                <p class="dialog_mycard_txt">{{ item.productName }}</p>
                <p class="dialog_mycard_set">{{ item.parkinglotName }}</p>
              </div>
            </div>
          </template>
          <div class="over_date" v-if="obj.isOverdue">
            您的月卡已过期，若继续使用请及时续费！
          </div>
        </div>
        <!-- 续费信息  -->
        <div v-else-if="obj.flag == 15">
          <div class="dialog_tit">
            {{ payInfo.sceneType == "102H7001" ? "支付" : "续费" }}信息
          </div>
          <div class="dialog_xf_top">
            <p class="dialog_xf_top_p">
              <span class="dialog_xf_top_p_one">车场</span>
              <span class="dialog_xf_top_p_two">
                {{ payInfo.parkinglotName }}
              </span>
            </p>
            <p class="dialog_xf_top_p">
              <span class="dialog_xf_top_p_one">单价</span>
              <span class="dialog_xf_top_p_two"
                >{{ payInfo.monthAmount }}元/月</span
              >
            </p>
            <p class="dialog_xf_top_p">
              <span class="dialog_xf_top_p_one">车位信息</span>
              <span class="dialog_xf_top_p_two"
                >{{ payInfo.spaceType }} * {{ payInfo.spaceNum }}个</span
              >
            </p>
            <div class="dialog_xf_top_p" v-if="payInfo.sceneType != '102H7001'">
              <span class="dialog_xf_top_p_one">车牌号码</span>
              <div class="card_pai_list row">
                <div
                  class="car_pai_item"
                  v-for="(item, index) in payInfo.carLicense"
                  :key="index"
                >
                  {{ item }}
                </div>
              </div>
            </div>
          </div>
          <div
            class="dialog_xf_center"
            v-if="payInfo.sceneType != '102H7001' && payInfo.dateFlag == 'N'"
          >
            <p class="center_tips">
              您的月卡已过期，请选择续费生效时间，若您的车一直在车场内建议“续接到期日”
            </p>
            <div class="center_select row">
              <div
                class="center_select_item"
                :class="renewIndex == 1 ? 'active' : ''"
                @click="userRenew('CONTINUE', 1)"
              >
                续接到期日
              </div>
              <div
                class="center_select_item"
                :class="renewIndex == 2 ? 'active' : ''"
                @click="userRenew('TODAY', 2)"
              >
                今日生效
              </div>
            </div>
          </div>
          <div class="dialog_xf_bottom">
            <div class="dialog_xf_bottom_txt">
              <p class="dialog_xf_bottom_p">
                合计：
                <span class="dialog_xf_bottom_p_color">
                  <b class="dialog_xf_bottom_p_num">{{ payMoney }}</b
                  >元
                </span>
              </p>
              <p class="dialog_xf_bottom_p">
                <img
                  class="dialog_xf_bottom_p_img"
                  src="@/assets/images/-@2x.png"
                  alt
                  @click="operMonth('reduce')"
                />
                <span class="dialog_xf_bottom_p_txt">{{ month }}个月</span>
                <img
                  class="dialog_xf_bottom_p_img"
                  src="@/assets/images/+@2x.png"
                  alt
                  srcset
                  @click="operMonth('add')"
                />
              </p>
            </div>
            <p
              class="dialog_xf_bottom_tip"
              v-if="payInfo.sceneType != '102H7001'"
            >
              续费后,有效期限为：
              <span class="dialog_xf_bottom_tip_date"
                >{{ payInfo.sxDate }}至{{ changeDate }}</span
              >
            </p>
          </div>
          <ul class="paylist" v-if="payInfo.zghS == 'M'">
            <li
              class="payitem"
              v-for="payItem in payInfo.paywayList"
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
                  data-val="payItem.preCode"
                  :src="payradio == payItem.preCode ? radioChecked : radioNot"
                  @click="choosetype(payItem.preCode)"
                />
              </div>
            </li>
          </ul>
        </div>
        <!--  解绑车牌 -->
        <div v-else-if="obj.flag == 16">
          <div class="dialog_tit">您确定解绑{{ obj.car }}？</div>
          <div class="dialog_txt">车辆解绑后，无法再享受所购月卡权益</div>
        </div>
        <!-- 功能开发中  -->
        <div v-else-if="obj.flag == 17">
          <div class="dialog_tit">功能开发中</div>
          <div class="dialog_txt">如需开票，请联系现场工作人员</div>
          <div class="dialog_txt">客服电话：400-0400-697</div>
        </div>
        <!-- 绑定车牌新增 领取成功 -->
        <div v-else-if="obj.flag == 18">
          <div class="dialog_tit">领取成功！</div>
          <div class="dialog_txt">
            您可在<span class="txt_blod">【停车月卡】</span>首页顶部或<span
              class="txt_blod"
              >【我的】</span
            >页面<br /><span class="txt_blod">【我的月卡】</span
            >中查看您找回的月卡并续费~
          </div>
        </div>
        <div v-else-if="obj.flag == 19">
          <div class="dialog_tit">您已购买过历史月卡，请领取！</div>
          <div class="dialog_mycard_group column">
            <div
              class="dialog_mycard_item"
              v-for="(item, index) in obj.cardList"
              :key="index"
            >
              <div class="dialog_item_info">
                <div class="dialog_item_name">{{ item.productName }}</div>
                <div class="dialog_item_time">
                  {{
                    item.productType == "ORDINARY_MONTH"
                      ? "普通包月"
                      : "分时包月"
                  }}
                </div>
              </div>
              <div class="dialog_item_address">
                <van-icon name="location" />
                <span class="address_text">{{ item.parkinglotName }}</span>
              </div>
            </div>
          </div>
          <div class="dialog_receive_info">
            <p class="dialog_rec_title">
              输入办理月卡时预留的手机号，即可领取月卡
            </p>
            <input
              type="number"
              class="dialog_rec_phone"
              oninput="if(value.length > 11)value = value.slice(0, 11)"
              v-model="userPhone"
              placeholder="您办理月卡时的手机号码"
              placeholder-class="place_class"
            />
            <p class="dialog_rec_tips">
              (若没有预留或忘记手机号，请联系客服处理后再找回)
            </p>
          </div>
        </div>
        <!-- 绑定开票  -->
        <div v-else-if="obj.flag == 20">
          <div class="dialog_tit">请绑定爱车</div>
          <div class="dialog_txt">绑定车牌后进行开票</div>
        </div>
        <div class="dialog_btn">
          <div class="dialog_btn_one" v-if="obj.type == 1" @click="affirm">
            {{ obj.btn }}
          </div>
          <div class="dialog_btns" v-else>
            <span class="dialog_btn_two" @click="closeTc">{{ obj.btn1 }}</span>
            <span class="dialog_btn_three" @click="affirm">{{ obj.btn2 }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from "vant";

export default {
  name: 'Dialog',
  components: {
    [Icon.name]: Icon,
  },
  props: {
    show: {
      type: Boolean,
    },
    obj: {
      type: Object,
    },
    payradio: {
      type: Object,
    },
  },
  data() {
    return {
      month: 1, //月份 最小1 最多12
      payMoney: 300, //支付价格
      payInfo: {}, //弹框支付信息
      price: 0, //单价 计算合计
      renewIndex: 1,
      defaultDate: "",
      changeDate: "",
      userPhone: "", //用户输入手机号
      radioChecked: require("@/assets/img/tongyi@2x.png"),
      radioNot: require("@/assets/img/butongyi@2x.png"),
    };
  },
  created() {
    console.log(this.obj);
    if (this.obj.flag == 15) {
      let payInfo = this.obj.payInfo; //支付弹框的数据
      this.payMoney = payInfo.payMoney ? payInfo.payMoney : payInfo.monthAmount; //初始化支付价格 按月付价格 monthAmount
      this.payInfo = payInfo; //弹框支付信息赋值
      this.defaultDate = payInfo.sxDate ? payInfo.sxDate : "";
      this.price = payInfo.monthAmount; //单价不变 不渲染页面 只计算合计
      if (payInfo.month) {
        this.month = payInfo.month;
      }
      // 续费计算日期
      if (payInfo.sceneType != "102H7001") {
        let day = payInfo.sxDate
          ? Number.parseInt(payInfo.sxDate.split("-")[2]) - 1
          : "";
        console.log(day);
        day = day > 0 ? day : "01"; //避免月初1号 -1天 day最小值为01
        console.log(payInfo.sxDate);

        this.changeDate = this.getMonthBeforeFormatAndDay(
          payInfo.sxDate,
          1,
          "-",
          day
        );
      }
    }
  },
  mounted() {
    // console.log(this.obj);
  },

  computed: {},
  watch: {
    shows: function (val) {
      console.log(val);
      this.show = true;
    },
    objs: function (val) {
      console.log(val);
      this.obj = val;
    },
  },

  methods: {
    choosetype(preCode) {
      this.$emit("choosepop", preCode);
    },
    closeTc() {
      this.$emit("closepop");
    },
    affirm() {
      if (this.obj.flag == 15) {
        let data = {
          month: this.month, //购买的月份
          payMoney: this.payMoney, //支付金额
        };
        this.$emit("affirmBtn", data);
      } else if (this.obj.flag == 19) {
        let userPhone = this.userPhone;
        console.log(userPhone);
        if (!this.common.checkPhone(userPhone)) {
          this.$toast("手机号输入错误");
          return;
        }
        this.$emit("affirmBtn", { userPhone });
      } else {
        this.$emit("affirmBtn", "你好");
      }
    },
    userRenew(type, i) {
      let sxDate = this.defaultDate, //初始化生效日期
        day = "";
      if (i == 2) {
        this.obj.payInfo.sxDate = this.getTime();
        day = Number.parseInt(this.getTime().split("-")[2]) - 1;
        day = day > 0 ? day : "01"; //避免月初1号 -1天 day最小值为01
        this.changeDate = this.getMonthBeforeFormatAndDay(
          this.getTime(),
          this.month,
          "-",
          day
        );
      } else {
        this.obj.payInfo.sxDate = sxDate;
        day = Number.parseInt(sxDate.split("-")[2]) - 1;
        day = day > 0 ? day : "01"; //避免月初1号 -1天 day最小值为01
        this.changeDate = this.getMonthBeforeFormatAndDay(
          sxDate,
          this.month,
          "-",
          day
        );
      }
      this.renewIndex = i;
      this.obj.dateFlag = type;
    },
    getTime() {
      var d = new Date();
      var YMD =
        d.getFullYear() +
        "-" +
        (d.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        d.getDate().toString().padStart(2, "0");
      return YMD;
    },

    // 操作支付弹框
    operMonth(type) {
      let { month, payMoney, payInfo, price } = this;
      let discountStatus = false,
        day = "";

      if (type == "add") {
        // 添加月
        if (month == 12) {
          this.$toast("最多只可购12个月时长");
          return;
        }
        this.month += 1;

        // 只有操作续费才计算日期
        if (payInfo.sceneType != "102H7001") {
          day = Number.parseInt(payInfo.sxDate.split("-")[2]) - 1;
          day = day > 0 ? day : "01"; //避免月初1号 -1天 day最小值为01
          this.changeDate = this.getMonthBeforeFormatAndDay(
            payInfo.sxDate,
            this.month,
            "-",
            day
          );
        }
      } else {
        // 减少月
        if (month == 1) {
          return;
        }
        this.month -= 1;
        if (payInfo.sceneType != "102H7001") {
          day = Number.parseInt(payInfo.sxDate.split("-")[2]) - 1;
          day = day > 0 ? day : "01"; //避免月初1号 -1天 day最小值为01
          this.changeDate = this.getMonthBeforeFormatAndDay(
            payInfo.sxDate,
            this.month,
            "-",
            day
          );
        }
      }
      if (this.month != 3 && this.month != 6 && this.month != 12) {
        discountStatus = false;
        this.payMoney = parseFloat(price * this.month).toFixed(2);
      } else {
        if (this.month == 3) {
          // 后台返回的字段不为null
          if (payInfo.seasonAmount || payInfo.seasonAmount == 0) {
            discountStatus = true;
            this.payMoney = payInfo.seasonAmount;
          } else {
            discountStatus = false;
            this.payMoney = parseFloat(price * this.month).toFixed(2);
          }
        }
        if (this.month == 6) {
          if (payInfo.halfYearAmount || payInfo.halfYearAmount == 0) {
            discountStatus = true;
            this.payMoney = payInfo.halfYearAmount;
          } else {
            discountStatus = false;
            this.payMoney = parseFloat(price * this.month).toFixed(2);
          }
        }
        if (this.month == 12) {
          if (payInfo.yearAmount || payInfo.yearAmount == 0) {
            discountStatus = true;
            this.payMoney = payInfo.yearAmount;
          } else {
            discountStatus = false;
            this.payMoney = parseFloat(price * this.month).toFixed(2);
          }
        }
      }

      this.$emit("changePayInfo", {
        month: this.month,
        payMoney: this.payMoney,
        discountStatus,
      });
      // console.log(this.payMoney);
    },

    //求自然月日期
    getMonthBeforeFormatAndDay(currDate, num, format, day) {
      let that = this;
      var date = new Date(currDate);
      date.setMonth(date.getMonth() + num * 1, 1);
      //读取日期自动会减一，所以要加一
      var mo = date.getMonth() + 1;
      // console.log(mo);
      //小月
      if (mo == 4 || mo == 6 || mo == 9 || mo == 11) {
        if (day > 30) {
          day = 30;
        }
      }
      //2月
      else if (mo == 2) {
        if (that.isLeapYear(date.getFullYear())) {
          if (day > 29) {
            day = 29;
          } else {
            if (day != "01") {
              day = 28;
            }
          }
        }
        if (day > 28) {
          day = 28;
        }
      }
      //大月
      else {
        if (day > 31) {
          day = 31;
        }
      }
      console.log(currDate.split("-"));
      console.log(day);
      // 生效日期为下月一号
      let currDay = currDate.split("-")[2],
        monthNum = Number.parseInt(currDate.split("-")[1]); //续费开始的月份
      if (currDay.indexOf("01") != -1 && day == 1) {
        console.log("月初到月底 自然月");
        let currMonth = mo != 1 ? mo - 1 : 12;
        let year = Number.parseInt(currDate.split("-")[0]);
        let dataMonth = this.month;

        if (monthNum + dataMonth > 12 && (monthNum + dataMonth) % 12 > 1) {
          year += 1;
        }
        var myDate = new Date(year, currMonth, 0);
        var lastDay =
          year +
          "-" +
          currMonth.toString().padStart(2, 0) +
          "-" +
          myDate.getDate().toString().padStart(2, 0); //上个月的最后一天
        // console.log(lastDay,'上月底最后一天')
        return lastDay;
      }

      day = day.toString().padStart(2, 0);
      let retureValue = that.$util.formatDate(
        date,
        "yyyy" + format + "MM" + format + day
      );

      console.log(retureValue);
      return retureValue;
    },

    //JS判断闰年代码
    isLeapYear(Year) {
      if ((Year % 4 == 0 && Year % 100 != 0) || Year % 400 == 0) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>

<style>
.dialog_xf_center {
  width: 552px;
  padding: 32px 0 40px;
  border-top: 1px solid #e1e1e1;
  margin: 0 auto;
}
.center_select_item {
  padding: 12px 24px;
  border: 1px solid #e7e7e7;
  border-radius: 8px;
  font-size: 28px;
  color: #333;
}
.center_select_item:first-child {
  margin-right: 24px;
}
.center_select_item.active {
  border-color: #008cff;
  color: #008cff;
  background: rgba(0, 140, 255, 0.1);
}
.over_date {
  font-size: 24px;
  color: #ef7500;
  text-align: center;
}
.center_tips {
  font-size: 24px;
  color: #999;
  line-height: 36px;
  margin-bottom: 24px;
}
.dialog_bod {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.dialog_bod_cont {
  width: 630px;
  position: relative;
  border-radius: 12px;
  padding: 80px 0;
  background: url("~assets/images/dialogbj.png") no-repeat 0 0;
  background-size: 100% 320px;
  background-color: #fff;
}
.dialog_close {
  width: 32px;
  height: 32px;
  position: absolute;
  right: 24px;
  top: 24px;
}
.dialog_tit {
  text-align: center;
  font-size: 36px;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
  margin: 0 0 48px;
}
.dialog_txt {
  font-size: 28px;
  font-weight: 300;
  color: rgba(153, 153, 153, 1);
  text-align: center;
  line-height: 36px;
}
.txt_blod {
  font-weight: bold;
  color: #333;
}
.dialog_btn {
  width: 100%;
  padding: 0 60px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  margin: 48px 0 0;
}
.dialog_btn_one {
  width: 400px;
  height: 88px;
  line-height: 88px;
  background: rgba(0, 140, 255, 1);
  border-radius: 44px;
  color: #fff;
  text-align: center;
}
.dialog_btns {
  display: flex;
  justify-content: space-between;
}
.dialog_btn_two {
  display: inline-block;
  width: 230px;
  height: 84px;
  line-height: 84px;
  text-align: center;
  border-radius: 44px;
  border: 2px solid rgba(0, 140, 255, 0.65);
  font-size: 32px;
  font-weight: 500;
  color: rgba(0, 140, 255, 1);
}
.dialog_btn_three {
  display: inline-block;
  width: 234px;
  height: 88px;
  line-height: 88px;
  text-align: center;
  border-radius: 44px;
  font-size: 32px;
  font-weight: 500;
  color: #fff;
  background: rgba(0, 140, 255, 1);
  margin-left: 42px;
}
.dialog_mycard_list {
  width: 474px;
  height: 420px;
  overflow: hidden;
  overflow-y: scroll;
  margin: 48px auto;
}
.dialog_mycard {
  width: 474px;
  height: 256px;
  background: rgba(81, 117, 255, 0.95);
  border-radius: 16px;
  margin: 48px auto;
  padding: 40px;
  box-sizing: border-box;
}
.dialog_mycards {
  margin: 0 0 24px;
}
.dialog_mycards:last-of-type {
  margin: 0;
}
.dialog_mycard_tit {
  font-size: 40px;
  font-weight: 600;
  color: rgba(255, 255, 255, 1);
}
.dialog_mycard_txt {
  font-size: 24px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.85);
  margin: 8px 0 44px;
}
.dialog_mycard_set {
  background: url("~assets/images/dingwei@2x.png") no-repeat 0 0;
  background-size: 32px 32px;
  font-size: 24px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.85);
  padding: 0 0 0 30px;
  box-sizing: border-box;
  line-height: 32px;
}
.dialog_xf_top {
  padding: 0 40px 24px;
  box-sizing: border-box;
  margin: 40px 0 0;
  /* border-bottom: 1px solid rgba(225, 225, 225, 1); */
}
.dialog_xf_top_p {
  display: flex;
  justify-content: space-between;
  margin: 0 0 24px;
}
.dialog_xf_top_p_one {
  font-size: 28px;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
}
.dialog_xf_top_p_two {
  font-size: 28px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
}
.dialog_xf_bottom {
  padding: 0 40px;
  box-sizing: border-box;
  border-top: 1px solid #e1e1e1;
  padding-top: 40px;
}
.dialog_xf_bottom_txt {
  display: flex;
  justify-content: space-between;
  line-height: 48px;
}
.dialog_xf_bottom_p {
  font-size: 24px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  vertical-align: middle;
}
.dialog_xf_bottom_p_color {
  font-size: 24px;
  font-weight: 400;
  color: rgba(255, 87, 101, 1);
}
.dialog_xf_bottom_p_num {
  font-size: 48px;
  color: rgba(255, 87, 101, 1);
}
.dialog_xf_bottom_p_img {
  width: 40px;
  height: 40px;
  vertical-align: middle;
}
.dialog_xf_bottom_p_txt {
  vertical-align: middle;
  display: inline-block;
  font-size: 28px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 40px;
  margin: 0 24px;
}
.dialog_xf_bottom_tip {
  margin: 16px 0 0;
  font-size: 24px;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
}
.dialog_xf_bottom_tip_date {
  font-size: 24px;
  color: #ff5765;
}
.card_pai_list {
  width: 310px;
  flex-wrap: wrap;
  justify-content: flex-end;
  max-height: 100px;
  overflow-y: scroll;
  align-items: flex-start;
}
.car_pai_item {
  font-size: 28px;
  color: #333;
}
.car_pai_item:nth-of-type(2n + 0)::before {
  content: "/";
}
.dialog_mycard_item {
  width: 474px;
  height: 256px;
  padding: 40px;
  box-sizing: border-box;
  border-radius: 16px;
  background-color: #5175ff;
  opacity: 0.95;
  justify-content: space-between;
  margin: 0 auto 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-shadow: 0px 10px 24px 0px rgba(81, 117, 255, 0.45);
}
.dialog_item_info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.dialog_item_name {
  font-size: 40px;
  color: #fff;
  margin-bottom: 8px;
}
.dialog_item_time,
.dialog_item_address {
  font-size: 24px;
  color: rgba(255, 255, 255, 0.65);
}
.dialog_item_address {
  display: flex;
  align-items: center;
}
.address_text {
  margin-left: 8px;
}
.dialog_rec_title {
  font-size: 28px;
  color: #333;
}
.dialog_rec_phone {
  width: 558px;
  padding: 20px 0 20px 24px;
  font-size: 28px;
  color: #333;
  box-sizing: border-box;
  border: 2px solid #e1e1e1;
  border-radius: 4px;
  margin: 12px 0 16px;
}
.dialog_rec_tips {
  font-size: 24px;
  color: #999;
}
.dialog_receive_info {
  margin-top: 48px;
}

.dialog_rec_phone::-moz-placeholder,
.dialog_rec_phone::-webkit-input-placeholder,
.dialog_rec_phone::-ms-input-placeholder {
  color: #bbb;
  font-size: 24px;
}
.dialog_mycard_group {
  max-height: 420px;
  overflow: hidden;
  overflow-y: scroll;
}
.dialog_receive_info {
  display: flex;
  flex-direction: column;
  align-items: center;
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
.footer_tips_icon {
  width: 35px;
  height: 35px;
  margin-right: 38px;
}
.footer_tips_icon {
  display: inline-block;
  vertical-align: middle;
}
</style>
