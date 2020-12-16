<template>
  <div class="mine_container">
    <div class="header" :style="{ backgroundImage: 'url(' + bgImg + ')' }">
      <div class="header_img">
        <img :src="headerImg" v-if="averter == ''" />
        <img :src="averter" v-else />
      </div>
      <div class="header_name">
        <p>{{ nickName }}</p>
        <p v-if="phone">{{ phone }}</p>
        <p v-else style="color: #999">暂无</p>
      </div>
    </div>
    <div class="mine_body">
      <div
        class="carNum"
        :style="{ backgroundImage: 'url(' + carbg + ')' }"
        @click="toMyCard"
      >
        <p>我的月卡</p>
        <p>您目前有{{ myCardList.length }}张月卡</p>
        <span class="carArrow">
          查看月卡
          <img :src="carArrow" />
        </span>
      </div>
      <ul class="menu_list">
        <li @click="toMyCar">
          <img :src="renzImg" />
          <div
            :style="{ backgroundImage: 'url(' + rightImg + ')' }"
            class="bgRight"
          >
            <span>我的爱车</span>
          </div>
          <div class="renzheng">
            <span style="color: #999999"
              >您现在有{{ carList.length }}辆爱车</span
            >
          </div>
          <!-- <div v-if="carList.length == 0" class="renzheng">
                        <span  style="color:#61ACF9" @click="cerTify">立即认证</span>
                    </div>
                    <div class="carCerInfo" v-else @click="goCerTify">
                        <span v-if="adopt != 0">{{adopt}}辆车已认证</span>
                        <span v-if="adopt != 0 && failed != 0">，</span>
                        <span style="color:#FF5765" v-if="failed != 0">{{failed}}辆认证未通过</span>
                    </div>       -->
        </li>
        <li @click="toBuyCar">
          <img :src="bugImg" />
          <div
            class="bgRight"
            :style="{ backgroundImage: 'url(' + rightImg + ')' }"
          >
            <span>购买记录</span>
          </div>
        </li>
        <li @click="goMyinvoice">
          <img :src="invoiceImg" />
          <div
            class="bgRight"
            :style="{ backgroundImage: 'url(' + rightImg + ')' }"
          >
            <span>我的发票</span>
          </div>
        </li>
      </ul>
    </div>
    <div
      class="footer_mine"
      :style="{ backgroundImage: 'url(' + footerbg + ')' }"
    >
      <p><img :src="phonemnhb" /><a href="tel:400-0400-697">400-0400-697</a></p>
      <p>如有疑问，请联系客服</p>
    </div>
    <footer-bar :activeIndex="activeIndex"></footer-bar>
    <!-- 提示弹框 -->
    <dialogs
      :show="showToast"
      :obj="obj"
      @closepop="closeTc"
      @affirmBtn="affirms"
    />
  </div>
</template>

<script>
import footerBar from "components/footer";
import dialogs from "components/dialog";
import * as API from "network/index";
export default {
  name: "Mine",
  components: { footerBar, dialogs },
  data() {
    return {
      headerImg: require("assets/img/moren.png"),
      renzImg: require("assets/img/aiche.png"),
      bugImg: require("assets/img/record.png"),
      bgImg: require("assets/img/wodebg@2x.png"),
      carbg: require("assets/img/yuekabg.png"),
      footerbg: require("assets/img/kefubg.png"),
      phonemnhb: require("assets/img/kefu@2x.png"),
      rightImg: require("assets/img/groupright.png"),
      invoiceImg: require("assets/img/fapiao.png"),
      carArrow: require("assets/img/jiantou.png"),
      activeIndex: 1,
      userId: "",
      carList: [],
      adopt: "",
      failed: "",
      showToast: false,
      obj: {
        btn: "绑定爱车", //单个按钮名称
        btn1: "取消", //双按钮第一个
        btn2: "继续", //双按钮第二个
        type: 1, //控制按钮, 1 单按钮 2 双按钮
        flag: 3, //控制弹窗显示内容
      },
      averter: "",
      phone: "",
      nickName: "",
      myCardList: [],
    };
  },
  created() {
    // let storeTh = {"userId":"","userName":"口畏喂喂","gender":0,"headImgUrl":"http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI5QDU194vRTw9sUjUJcRNK8GwSJPA3T9Ahn4bI6Cic5PhOdT7BKz8QsoVrzicPyYCibJnLLU8IGt5Vw/132","phoneMobile":"","openId":"oCF6KwIWArn8xEVy9dqBE_OjWy0U","unionId":"o1cjJwV0hcqHEPxjAMac6c2Apdds"}
    // let storeTh = {"userId":"355f51a76a584db181cc669c9d3b4db1","userName":"undefined","gender":1,"headImgUrl":"https://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83ep9YJC0GnicC7Su4S9iaMRFQsXMOYL1PU71qxibpibS6GMpBMjrKWsU4U2mrGPsyPicHxtXxxzr1eWJNvg/132","phoneMobile":"13911963987","openId":"ow7iCwjEOTrEBoW2KkWxThss8nAE","unionId":"o1cjJwTERPUHzO4lywh9kIzyqt_4"}
    let storeTh = JSON.parse(localStorage.getItem("userInfo"));
    // console.log(storeTh)
    this.userId = storeTh.userId;
    this.averter = storeTh.headImgUrl;
    this.nickName = storeTh.userName;
    this.phone = storeTh.phoneMobile;
    this.getCarInfo(); //获取车辆的总数
    // this.getCertyInfo();//获取车辆的总数
    this.getMyCardList(); //我的月卡列表
  },

  methods: {
    getMyCardList() {
      let params = {
        userId: this.userId,
      };
      API.getMyCards(params).then((ret) => {
        console.log(ret)
        this.myCardList = ret.data;
      });
    },
    goMyinvoice() {
      if (this.carList.length == 0) {
        this.obj = {
          btn: "绑定爱车", //单个按钮名称
          btn1: "取消", //双按钮第一个
          btn2: "继续", //双按钮第二个
          type: 1, //控制按钮, 1 单按钮 2 双按钮
          flag: 20, //控制弹窗显示内容
        };
        this.showToast = true;
      } else {
        window.location.href = window.location.origin + "/orderListInvoice";
      }
    },
    getCarInfo() {
      let data = {
        userId: this.userId,
      };
      API.getMineCar(data).then((res) => {
        console.log(res);
        this.carList = res.data;
      });
    },
    getCertyInfo() {
      let data = {
        userId: this.userId,
      };
      API.getCerTify(data).then((res) => {
        this.adopt = res.data.adopt;
        this.failed = res.data.failed;
      });
    },
    toMyCard() {
      this.$router.push({ path: "/myMonthCard" });
    },
    cerTify() {
      this.obj = {
        btn: "绑定爱车", //单个按钮名称
        btn1: "取消", //双按钮第一个
        btn2: "继续", //双按钮第二个
        type: 1, //控制按钮, 1 单按钮 2 双按钮
        flag: 3, //控制弹窗显示内容
      };
      //立即去认证;如果没有车提示去绑定车牌
      this.showToast = true;
    },
    goCerTify() {
      //有车提示去认证；
      this.$router.push({ path: "/carAuthor" });
    },
    closeTc() {
      this.showToast = false;
    },
    showTc() {
      this.showToast = true;
    },
    affirms(e) {
      this.showToast = false;
      this.$router.push({ path: "/bindPlate" });
    },
    toMyCar() {
      this.$router.push({ path: "/myCar" });
    },
    toBuyCar() {
      this.$router.push({ path: "/cardIndex" });
    },
  },
};
</script>
<style>
body {
  background: #fff !important;
}
.header {
  padding: 48px;
  background-size: 100%;
  height: 308px;
  background-repeat: no-repeat;
}
.header > div {
  display: inline-block;
  vertical-align: middle;
}
.header_img {
  margin-right: 24px;
}
.header_img img {
  width: 128px;
  height: 128px;
  border-radius: 50%;
}
.header_name p:nth-of-type(1) {
  font-size: 40px;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 40px;
  margin-bottom: 24px;
}
.header_name p:nth-of-type(2) {
  line-height: 24px;
  font-size: 24px;
  font-weight: 500;
  color: rgba(153, 153, 153, 1);
}
.mine_body {
  position: relative;
  top: -100px;
  /* padding-top: 32px; */
}
.carNum {
  width: 100%;
  height: 176px;
  /* position: absolute;
  top: -180px;
  left: 14px;
  right: 0; */
  padding: 40px 0 0 62px;
  box-sizing: border-box;
  color: #fff;
  background-repeat: no-repeat;
  background-size: 100%;
}
.carNum p:nth-of-type(1) {
  font-size: 32px;
  line-height: 36px;
  font-weight: 500;
  margin-bottom: 8px;
  position: relative;
}
.carNum p:nth-of-type(2) {
  line-height: 24px;
  font-size: 24px;
  font-weight: 400;
}
.menu_list li {
  padding-left: 48px;
  font-size: 28px;
  line-height: 104px;
  display: flex;
  align-items: center;
  position: relative;
}
.menu_list li img {
  width: 40px;
  height: 40px;
  margin-right: 24px;
}
.menu_list li div {
  border-bottom: 1px solid rgba(225, 225, 225, 0.45);
  flex: 1;
  padding-right: 10px;
}
.footer_mine {
  position: fixed;
  bottom: 112px;
  left: 0;
  right: 0;
  height: 158px;
  width: 100%;
  background-repeat: no-repeat;
  background-size: 100%;
  text-align: center;
  font-size: 28px;
  color: #008cff;
}
.footer_mine p:nth-of-type(1) {
  margin-bottom: 10px;
}
.footer_mine p:nth-of-type(2) {
  font-size: 24px;
  color: #999;
}
.footer_mine img {
  height: 30px;
  width: 28px;
  vertical-align: middle;
  margin-right: 6px;
}
.footer_mine a {
  display: inline-block;
  vertical-align: middle;
}
.carCerInfo {
  position: absolute;
  font-size: 24px;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
  line-height: 32px;
  right: 80px;
  top: 36px;
  border: none !important;
  padding-right: 10px !important;
}
.renzheng {
  position: absolute;
  right: 80px;
  top: 0;
}
.bgRight {
  background-repeat: no-repeat;
  background-size: 24px 24px;
  background-position: 92% 40px;
}
.carArrow {
  position: absolute;
  top: 75px;
  right: 50px;
  font-size: 24px;
}
.carArrow img {
  height: 22px;
  width: 16px;
}
</style>
