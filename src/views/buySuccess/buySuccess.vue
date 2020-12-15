<template>
  <div class="buy_success">
    <div class="pay_img">
      <img :src="payFinish" alt="" />
      <p class="successTip" @click="toList">车位卡购买成功</p>
    </div>
    <router-link :to="{ path: '/cardIndex' }" class="lookCard"
      >查看我的车位卡</router-link
    >
    <!-- <div class="payInfo">
            <ul>
                <li>
                    <span>车牌号码</span>
                    <span>川N·8827S</span>
                </li>
                <li>
                    <span>车场名称</span>
                    <span>成都高新区公共停车场</span>
                </li>
                <li>
                    <span>有效时间</span>
                    <span>2020.08.05 ~ 2020.11.04</span>
                </li>
            </ul>
            <button class="lookCard">查看我的车位卡</button>
        </div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      payFinish: require("assets/img/payfinish.gif"),
    };
  },
  methods: {
    toList() {
      this.$router.push("/cardIndex");
    },
  },
};
</script>

<style>
.pay_img {
  text-align: center;
  margin-top: 125px;
}
.pay_img img {
  width: 148px;
  height: 120px;
}
.successTip {
  font-size: 32px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.85);
  line-height: 44px;
  margin-top: 34px;
}
.payInfo {
  margin: 120px 0 78px 0;
  padding: 0 72px;
}
.payInfo ul {
  border-top: 2px solid rgba(225, 225, 225, 0.45);
  border-bottom: 2px solid rgba(225, 225, 225, 0.45);
  padding: 22px 0 24px 0;
}
.payInfo ul li {
  line-height: 64px;
  display: flex;
  justify-content: space-between;
  font-size: 28px;
  font-weight: 400;
}
.payInfo ul li span:nth-of-type(1) {
  color: rgba(153, 153, 153, 1);
}
.payInfo ul li span:nth-of-type(2) {
  color: rgba(51, 51, 51, 1);
}
.lookCard {
  width: 606px;
  height: 88px;
  background: rgba(0, 140, 255, 1);
  border-radius: 44px;
  text-align: center;
  line-height: 88px;
  color: #fff;
  font-size: 32px;
  border: none;
  outline: none;
  display: block;
  margin: 78px auto 0;
}
</style>