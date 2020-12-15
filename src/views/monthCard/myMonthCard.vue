<template>
  <div v-show="showContainer">
    <div class="not_card column" v-if="myCardList.length == 0">
      <div class="not_default column">
        <img src="~assets/img/meiyouyueka@2x.png" class="not_icon" />
        <div class="not_title">您还未办理任何月卡</div>
        <div class="not_tips">您可以选择车场购买月卡产品</div>
        <button class="buyBtn" @click="buyCard">立即购买</button>
      </div>
    </div>
    <div v-else>
      <div
        :class=" 'my_month_card' +' '+ item.class"
        v-for="(item,index) in myCardList"
        :key="index"
        @click="toDetail(item)"
      >
        <div class="my_card_title">{{item.productName}}</div>
        <div
          class="right_date"
          :style="{backgroundImage:'url(' + (rightBg) + ')'}"
        >有效期至{{item.effectiveEndDate.split(" ")[0]}}</div>
        <div class="belong row">
          <span class="parking_name">{{item.parkinglotName}}</span>
          <div class="look_detail row">
            <div class="look_text">权益详情</div>
            <van-icon name="arrow" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as API from "network/index";
import { Cell, Icon, Loading } from "vant";
export default {
  components: {
    [Cell.name]: Cell,
    [Icon.name]: Icon,
    [Loading.name]: Loading,
  },
  data() {
    return {
      myCardList: [],
      userId:localStorage.getItem("userId"),//'89b989fb92d24c88b4b08fc85144e7ed', //355f51a76a584db181cc669c9d3b4db1
      rightBg: require("assets/img/card-bg.png"),
      showContainer:false,
    };
  },
  created() {
    this.getMyCardList();
  },
  methods: {
    getMyCardList() {
      let params = {
        userId: this.userId,
      };
      API.getMyCards(params).then((ret) => {
        this.myCardList = ret.data;
        this.showContainer = true;
        if(this.myCardList.length == 0){
             document.body.style.backgroundColor = '#F5F5F5 !important'
        }
        this.getBgColor();
      });
    },
    buyCard(){
        this.$router.push({ path: "cardIndex", });
    },
    toDetail(item) {
      //flag存在是老月卡，不存在即新越开
      if (item.oldMonthId)
        this.$router.push({
          path: "cardDetails",
          query: {
            recordId: item.recordId,
            bgColor: item.bgColor,
            bgShadow: item.bgShadow,
          },
        });
      if (!item.oldMonthId)
        this.$router.push({
          path: "cardLook",
          query: {
            recordId: item.recordId,
            bgColor: item.bgColor,
            bgShadow: item.bgShadow,
          },
        });
    },
    getBgColor() {
      for (let i in this.myCardList) {
        if (!this.myCardList[i].oldMonthId) {
          if (i % 5 == 0) {
            this.myCardList[i].class = 'bg1'
            this.myCardList[i].bgColor = "#5178A7";
            this.myCardList[i].bgShadow = "0px 10px 24px 0px rgba(81,120,167,0.45);";
          } else if (i % 5 == 1 || i == 0) {
            this.myCardList[i].class = 'bg2'
            this.myCardList[i].bgColor = "#BF78F9";
            this.myCardList[i].bgShadow = "0px 10px 24px 0px rgba(191,120,249,0.45);";
          } else if (i % 5 == 2) {
            this.myCardList[i].class = 'bg3'
            this.myCardList[i].bgColor = "#F7B14E";
            this.myCardList[i].bgShadow ="0px 10px 24px 0px rgba(247,177,78,0.55);";
          } else if (i % 5 == 3) {
            this.myCardList[i].class = 'bg4'
            this.myCardList[i].bgColor = "#34BA94";
            this.myCardList[i].bgShadow ="0px 10px 24px 0px rgba(52,186,148,0.4);";
          } else if (i % 5 == 4) {
            this.myCardList[i].class = 'bg5'
            this.myCardList[i].bgColor = "#34BA94";
            this.myCardList[i].bgShadow ="0px 10px 24px 0px rgba(52,186,148,0.4);";
          }
        } else {
        this.myCardList[i].class = 'bg6'
          this.myCardList[i].bgColor = "#5175FF";
          this.myCardList[i].bgShadow = "0px 10px 24px 0px rgba(81,117,255,0.45);";
        }
      }
    },
  },
};
</script>

<style>
/* 没有月卡 */
.bg1{
    background: #5178A7;
    box-shadow: 0px 10px 24px 0px rgba(81,120,167,0.45)
}
.bg2{
    background: #BF78F9;
    box-shadow: 0px 10px 24px 0px rgba(191,120,249,0.45)
}
.bg3{
    background: #F7B14E;
    box-shadow: 0px 10px 24px 0px rgba(247,177,78,0.55)
}
.bg4{
    background: #34BA94;
    box-shadow:0px 10px 24px 0px rgba(52,186,148,0.4)
}
.bg5{
    background: #34BA94;
    box-shadow: 0px 10px 24px 0px rgba(52,186,148,0.4)
}
.bg6{
    background: #5175FF;
    box-shadow: 0px 10px 24px 0px rgba(81,117,255,0.45)
}
.not_card {
  padding-top: 34px;
  margin-bottom: 48px;
  width: 750px;
  background: linear-gradient(
    180deg,
    rgba(245, 245, 245, 1) 0%,
    rgba(255, 255, 255, 0) 100%
  );
}
.not_icon {
  width: 172px;
  height: 168px;
}
.not_title {
  margin: 42px 0 8px;
  font-size: 32px;
  color: #000;
}
.not_tips {
  font-size: 28px;
  color: #bbb;
  margin-bottom: 80px;
}
.my_month_card {
  width: 654px;
  height: 170px;
  padding: 42px 24px 46px 32px;
  margin: 40px auto 30px;
  border-radius: 8px;
  opacity: 0.95;
  box-sizing: border-box;
  position: relative;
}
.my_card_title {
  font-size: 32px;
  color: #fff;
  margin-bottom: 4px;
}
.belong {
  justify-content: space-between;
}
.right_date {
  width: 300px;
  height: 62px;
  font-size: 20px;
  color: #895323;
  opacity: 0.85;
  /* background: url("../../assets/img/card-bg.png") no-repeat; */
  background-size: 100% 100%;
  position: absolute;
  right: 0;
  top: 0;
  padding: 12px 0 0 32px;
  box-sizing: border-box;
  text-align: center;
  white-space: nowrap;
}
.parking_name,
.look_text,
.van-icon-arrow {
  font-size: 24px;
  color: #fff;
  opacity: 0.65;
}
.look_text {
  line-height: 24px;
}
.buyBtn{
    width:320px;
    height:88px;
    background:rgba(0,140,255,1);
    border-radius:44px;
    font-size:32px;
    font-weight:500;
    color:rgba(255,255,255,1);
    line-height:88px;
    text-align: center;
    border: none;
}
</style>