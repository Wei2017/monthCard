<template>
  <div>
    <div class="monthCard_move" v-if="productList.length == 0">
      <img
        class="monthCard_move_img"
        src="~assets/images/meiyouyueka@2x.png"
        alt=""
        srcset=""
      />
      <p class="monthCard_move_txt">该车场暂无月卡产品～</p>
      <p class="monthCard_move_btn" @click="goBack">返回</p>
    </div>
    <div v-else>
      <div v-for="(item, index) in productList" v-bind:key="index">
        <div
          class="monthCard_bod monthCard_bod_bck"
          v-if="
            item.displacementType == null && item.spaceType == 'NO_FIXED_SPACE'
          "
        >
          <div class="monthCard_bod_cont">
            <div>
              <div class="monthCard_bod_txt_one">
                {{ item.productName }}
                <span
                  class="monthCard_bod_txt_one_tip monthCard_bod_txt_one_tip_bg"
                  >非固定车位</span
                >
              </div>
              <div class="monthCard_bod_txt_two">24小时减免停车费</div>
            </div>
            <div
              class="monthCard_bod_btn monthCard_bod_btn_bg"
              @click="goPay(item,index)"
            >
              立即购买
            </div>
          </div>
        </div>
        <div
          class="monthCard_bods monthCard_bod_bcks"
          v-else-if="
            item.displacementType != null && item.spaceType == 'NO_FIXED_SPACE'
          "
        >
          <div class="monthCard_bod_cont">
            <div>
              <div class="monthCard_bod_txt_one">
                {{ item.productName }}
                <span
                  class="monthCard_bod_txt_one_tip monthCard_bod_txt_one_tip_bg"
                  >非固定车位</span
                >
              </div>
              <div class="monthCard_bod_txt_two">24小时减免停车费</div>
            </div>
            <div
              class="monthCard_bod_btn monthCard_bod_btn_bg"
              @click="goPay(item,index)"
            >
              立即购买
            </div>
          </div>
          <p class="monthCard_bod_tips" v-if="item.displacementType=='ABOVE_AND_2200'">2.2L及以上排量</p>
          <p class="monthCard_bod_tips" v-else>2.2L及以下排量</p>
        </div>
        <div
          class="monthCard_bod monthCard_bod_bck_o"
          v-else-if="
            item.displacementType == null && item.spaceType == 'FIXED_SPACE'
          "
        >
          <div class="monthCard_bod_cont">
            <div>
              <div class="monthCard_bod_txt_one">
                {{ item.productName }}
                <span
                  class="monthCard_bod_txt_one_tip monthCard_bod_txt_one_tip_bgs"
                  >固定车位</span
                >
              </div>
              <div class="monthCard_bod_txt_two">24小时减免停车费</div>
            </div>
            <div
              class="monthCard_bod_btn monthCard_bod_btn_bgs"
              @click="goPay(item,index)"
            >
              立即购买
            </div>
          </div>
        </div>
        <div
          class="monthCard_bods monthCard_bod_bcks_o"
          v-else-if="
            item.displacementType != null && item.spaceType == 'FIXED_SPACE'
          "
        >
          <div class="monthCard_bod_cont">
            <div>
              <div class="monthCard_bod_txt_one">
                {{ item.productName }}
                <span
                  class="monthCard_bod_txt_one_tip monthCard_bod_txt_one_tip_bgs"
                  >固定车位</span
                >
              </div>
              <div class="monthCard_bod_txt_two">24小时减免停车费</div>
            </div>
            <div
              class="monthCard_bod_btn monthCard_bod_btn_bgs"
              @click="goPay(item,index)"
            >
              立即购买
            </div>
          </div>
          <p class="monthCard_bod_tips" v-if="item.displacementType=='ABOVE_AND_2200'">2.2L及以上排量</p>
          <p class="monthCard_bod_tips" v-else>2.2L及以下排量</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getProduct } from "network/index";
export default {
  data() {
    return {
      productList: [],
      data:''
    };
  },

  mounted() {
    this.data = this.$route.query;
    let param = {
      parkinglotId: this.$route.query.parkinglotId
    };
    getProduct(param).then(res => {
      console.log(res);
      this.productList = res.data;
    });
  },

  computed: {},
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    goPay(item,index) {
      this.data.index = index;
      console.log(this.data)
      this.$router.push({
        path: "cardSelect",
        query: this.data
      });
    }
  }
};
</script>

<style>
.monthCard_bod {
  width: 726px;
  height: 240px;
  margin: 0 auto;
  padding: 20px 0 0;
}
.monthCard_bods {
  width: 726px;
  height: 280px;
  margin: 0 auto;
  padding: 20px 0 0;
}
.monthCard_bod_bck {
  background: url("~assets/images/bgl.png") no-repeat;
  background-size: 100% 240px;
}
.monthCard_bod_bck_o {
  background: url("~assets/images/bglv.png") no-repeat;
  background-size: 100% 240px;
}
.monthCard_bod_bcks {
  background: url("~assets/images/bgl.png") no-repeat;
  background-size: 100% 280px;
}
.monthCard_bod_bcks_o {
  background: url("~assets/images/bglv.png") no-repeat;
  background-size: 100% 280px;
}
.monthCard_bod_cont {
  width: 686px;
  height: 198px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  box-sizing: border-box;
}
.monthCard_bod_txt_one {
  font-size: 32px;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}
.monthCard_bod_txt_one_tip {
  font-size: 20px;
  font-weight: 400;
  line-height: 36px;
  padding: 0 10px;
}
.monthCard_bod_txt_one_tip_bg {
  color: rgba(0, 140, 255, 1);
  background: rgba(0, 140, 255, 0.1);
}
.monthCard_bod_txt_one_tip_bgs {
  color: rgba(11, 177, 160, 1);
  background: rgba(11, 177, 160, 0.1);
}

.monthCard_bod_txt_two {
  font-size: 24px;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
  margin-top: 10px;
}
.monthCard_bod_btn {
  width: 160px;
  height: 56px;
  line-height: 56px;
  text-align: center;
  border-radius: 27px;
  font-size: 24px;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
}
.monthCard_bod_btn_bg {
  background: rgba(0, 140, 255, 1);
}
.monthCard_bod_btn_bgs {
  background: rgba(23, 198, 180, 1);
}
.monthCard_bod_tips {
  width: 686px;
  margin: -32px auto 0;
  padding: 0 40px;
  font-size: 24px;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
  box-sizing: border-box;
}

/* 没有月卡 */
.monthCard_move {
  padding: 90px 0 0px;
}
.monthCard_move_img {
  width: 172px;
  display: block;
  height: 168px;
  margin: 0 auto 24px;
}
.monthCard_move_txt {
  font-size: 32px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  text-align: center;
}
.monthCard_move_btn {
  width: 168px;
  height: 56px;
  background: rgba(0, 140, 255, 1);
  border-radius: 32px;
  text-align: center;
  line-height: 56px;
  color: #fff;
  margin: 80px auto 0;
}
</style>
