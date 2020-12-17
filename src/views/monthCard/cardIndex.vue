<template>
  <div class="card_container column" v-if="showContainer">
    <template v-if="!pageLoad">
      <van-loading size="24px" vertical class="center_loading"
        >加载中...</van-loading
      >
    </template>
    <template v-else>
      <div class="not_card column" v-if="myCardList.length == 0">
        <div class="not_default column">
          <img src="@/assets/img/meiyouyueka@2x.png" class="not_icon" />
          <div class="not_title">您还未办理任何月卡</div>
          <div class="not_tips">您可以选择车场购买月卡产品</div>
        </div>
      </div>
      <div v-else>
        <div
          :class="'my_month_card' + ' ' + item.class"
          v-for="(item, index) in myCardList"
          :key="index"
          @click="toDetail(item)"
        >
          <div class="my_card_title">{{ item.productName }}</div>
          <div
            class="right_date"
            :style="{ backgroundImage: 'url(' + rightBg + ')' }"
          >
            有效期至{{ item.effectiveEndDate.split(" ")[0] }}
          </div>
          <div class="belong row">
            <span class="parking_name">{{ item.parkinglotName }}</span>
            <div class="look_detail row">
              <div class="look_text">权益详情</div>
              <van-icon name="arrow" />
            </div>
          </div>
        </div>
      </div>
      <!-- v-if="userCity == '成都市'" -->
      <div class="chuan_retrieve row">
        <div class="ret_text">驿停车成都车场老月卡用户可找回月卡续费</div>
        <router-link :to="{ path: '/chuanBind' }" class="ret_btn"
          >找回月卡</router-link
        >
      </div>

      <div class="select_tips">请选择要购买月卡的车场：</div>
      <div class="nav_city row">
        <div
          class="nav_item"
          :class="{ active: index == navIndex }"
          v-for="(item, index) in city"
          :key="item.name"
          @click="toggleNav(index)"
        >
          {{ item.name }}
        </div>
      </div>
      <div class="parking_list column">
        <div
          class="parking_item"
          v-for="(item, index) in cdList"
          :key="index"
          @click="selectParking(item)"
        >
          {{ item.parkinglotName }}
        </div>
      </div>
      <!-- <van-index-bar :sticky="false" :index-list="indexBarList">
      <div class="anchor_box" v-for="(item,index) in parkingList" :key="index">
        <van-index-anchor  :index="item.initial">{{item.initial}}</van-index-anchor>
        <div class="cell_box">
          <van-cell 
            @click="selectParking(citem)"
            v-for="(citem,cindex) in item.list"
            :key="cindex"
            :title="citem.title"
           ></van-cell>
        </div>
      </div>
      </van-index-bar>-->
      <footer-bar :activeIndex="activeIndex"></footer-bar>
    </template>
  </div>
</template>

<script>
import footerBar from "components/footer";
import { getMyCards, queryAllParkinglot } from "network/index";

import { IndexBar, IndexAnchor, Cell, Icon, Loading } from "vant";

export default {
  components: {
    [IndexBar.name]: IndexBar,
    [IndexAnchor.name]: IndexAnchor,
    [Cell.name]: Cell,
    [Icon.name]: Icon,
    footerBar,
    [Loading.name]: Loading,
  },
  data() {
    return {
      userCity: "", //用户所在城市
      userId: "355f51a76a584db181cc669c9d3b4db1", //localStorage.getItem("userId"),
      pageLoad: false,
      rightBg: require("@/assets/img/card-bg.png"),
      city: [
        {
          name: "全部",
        },
      ],
      navIndex: 0,
      parkingList: [
        {
          initial: "A",
          list: [
            {
              id: 1,
              title: "A停车场",
            },
            {
              id: 2,
              title: "Aa停车场",
            },
          ],
        },
        {
          initial: "B",
          list: [
            {
              id: 3,
              title: "B停车场",
            },
            {
              id: 4,
              title: "Bb停车场",
            },
          ],
        },
      ],
      indexBarList: ["A", "B"],
      cdList: [], //成都停车场列表
      myCardList: [],
      activeIndex: 0,
      showContainer: false,
    };
  },
  created() {
    this.$nextTick(() => {
      this.init();

      // 获取用户所在城市
      this.$util.getUserCity((ret) => {
        console.log(ret, "cardIndex Line ---> 144");
        let userCity = ret.address.city; //用户所在城市
        this.userCity = userCity;
        console.log(userCity, "cardIndex Line ---> 147");
      });
    });
  },
  methods: {
    init() {
      // 获取我的月卡
      this.getMyCardList();
      // 获取车场列表
      this.getQueryAllParkinglot();
    },
    getMyCardList() {
      let params = {
        userId: this.userId,
      };
      getMyCards(params).then((ret) => {
        this.myCardList = ret.data;
        this.getBgColor();
      });
    },
    getBgColor() {
      for (let i in this.myCardList) {
        if (!this.myCardList[i].oldMonthId) {
          if (i % 5 == 0) {
            this.myCardList[i].class = "bg1";
            this.myCardList[i].bgColor = "#5178A7";
            this.myCardList[i].bgShadow =
              "0px 10px 24px 0px rgba(81,120,167,0.45);";
          } else if (i % 5 == 1 || i == 0) {
            this.myCardList[i].class = "bg2";
            this.myCardList[i].bgColor = "#BF78F9";
            this.myCardList[i].bgShadow =
              "0px 10px 24px 0px rgba(191,120,249,0.45);";
          } else if (i % 5 == 2) {
            this.myCardList[i].class = "bg3";
            this.myCardList[i].bgColor = "#F7B14E";
            this.myCardList[i].bgShadow =
              "0px 10px 24px 0px rgba(247,177,78,0.55);";
          } else if (i % 5 == 3) {
            this.myCardList[i].class = "bg4";
            this.myCardList[i].bgColor = "#34BA94";
            this.myCardList[i].bgShadow =
              "0px 10px 24px 0px rgba(52,186,148,0.4);";
          } else if (i % 5 == 4) {
            this.myCardList[i].class = "bg5";
            this.myCardList[i].bgColor = "#34BA94";
            this.myCardList[i].bgShadow =
              "0px 10px 24px 0px rgba(52,186,148,0.4);";
          }
        } else {
          this.myCardList[i].class = "bg6";
          this.myCardList[i].bgColor = "#5175FF";
          this.myCardList[i].bgShadow =
            "0px 10px 24px 0px rgba(81,117,255,0.45);";
        }
      }
    },
    getQueryAllParkinglot() {
      queryAllParkinglot({}).then((ret) => {
        if (ret.status == 200) {
          let list = ret.data,
            cdList = this.cdList;
          list.forEach((item, index) => {
            if (item.areaName == "成都市" || item.areaName == "上海市") {
              cdList.push(item);
            }
          });
        } else {
          this.$toast(ret.message);
        }
        this.pageLoad = true;
        this.showContainer = true;
      });
    },
    toggleNav(index) {
      console.log(index);
      this.navIndex = index;
    },
    // 选择停车场
    selectParking(item) {
      console.log(item);
      this.$router.push({ path: "monthCard", query: item });
    },
    toDetail(item) {
      //flag存在是老月卡，不存在即新越开
      if (item.oldMonthId){
        this.$router.push({
          path: "cardDetails",
          query: {
            recordId: item.recordId,
            bgColor: item.bgColor,
            bgShadow: item.bgShadow,
          },
        });
      }
        
      if (!item.oldMonthId){
        this.$router.push({
          path: "cardLook",
          query: {
            recordId: item.recordId,
            bgColor: item.bgColor,
            bgShadow: item.bgShadow,
          },
        })
      }
        
    },
  },
};
</script>
    
<style>
.bg1 {
  background: #5178a7;
  box-shadow: 0px 10px 24px 0px rgba(81, 120, 167, 0.45);
}
.bg2 {
  background: #bf78f9;
  box-shadow: 0px 10px 24px 0px rgba(191, 120, 249, 0.45);
}
.bg3 {
  background: #f7b14e;
  box-shadow: 0px 10px 24px 0px rgba(247, 177, 78, 0.55);
}
.bg4 {
  background: #34ba94;
  box-shadow: 0px 10px 24px 0px rgba(52, 186, 148, 0.4);
}
.bg5 {
  background: #34ba94;
  box-shadow: 0px 10px 24px 0px rgba(52, 186, 148, 0.4);
}
.bg6 {
  background: #5175ff;
  box-shadow: 0px 10px 24px 0px rgba(81, 117, 255, 0.45);
}
/* 没有月卡 */
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
  margin: 24px 0 8px;
  font-size: 32px;
  color: #000;
}
.not_tips {
  font-size: 28px;
  color: #bbb;
}
.chuan_retrieve {
  position: relative;
  width: 654px;
  background: rgba(255, 250, 217, 1);
  border-radius: 16px;
  padding: 32px 24px;
  box-sizing: border-box;
  justify-content: space-between;
  margin-bottom: 40px;
}
.ret_icon {
  position: absolute;
  left: 0;
  top: 0;
  width: 44px;
  height: 40px;
}
.ret_text {
  width: 416px;
  font-size: 24px;
  color: rgba(222, 162, 51, 1);
}
.ret_btn {
  width: 144px;
  height: 56px;
  line-height: 56px;
  text-align: center;
  background: rgba(222, 162, 51, 1);
  border-radius: 28px;
  opacity: 0.65;
  font-size: 24px;
  color: #fff;
}
.my_month_card {
  width: 654px;
  height: 170px;
  padding: 42px 24px 46px 32px;
  margin: 40px 0 30px;
  /* background-color: #5175ff; */
  border-radius: 8px;
  opacity: 0.95;
  box-sizing: border-box;
  position: relative;
  /* box-shadow:0px 10px 24px 0px rgba(81,117,255,0.45); */
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
.select_tips {
  width: 750px;
  padding-left: 48px;
  box-sizing: border-box;
  font-size: 28px;
  color: #999;
  margin-bottom: 24px;
}
.nav_city {
  width: 750px;
  padding-left: 48px;
  box-sizing: border-box;
}
.nav_item {
  font-size: 28px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  padding-bottom: 28px;
  margin-right: 64px;
}
.nav_item.active {
  color: #2167fa;
  border-bottom: 4px solid #2167fa;
}
.van-index-anchor {
  width: 750px;
  height: 64px;
  line-height: 64px;
  font-size: 28px;
  color: rgba(0, 0, 0, 0.65);
  padding-left: 48px;
  background-color: rgba(242, 242, 242, 1);
  box-sizing: border-box;
}
.van-cell {
  padding: 32px 0 32px 48px;
  font-size: 32px;
  color: rgba(0, 0, 0, 0.85);
}
.van-index-bar__sidebar {
  right: 6px;
}
.van-index-bar__index {
  font-size: 22px;
  line-height: 27px;
  color: rgba(0, 0, 0, 0.15);
}
.van-cell::after {
  left: 48px;
  right: 74px;
}
.card_container {
  font-size: 14px;
  padding-bottom: 120px;
}

.parking_item {
  width: 628px;
  border-bottom: 2px solid rgba(242, 242, 242, 1);
  padding: 32px 0;
  font-size: 32px;
  color: #000;
}
.center_loading {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>