<template>
  <div class="invoice-history">
    <div class="ih-wrapper">
      <div class="history-list-wrap">
        <scroll
          v-if="invoinceHisList.length > 0"
          class="content"
          ref="scroll"
          @pullingUp="loadMore"
          @scroll="contentScroll"
          :probeType="3"
          :pullUpLoad="true"
        >
          <ul class="hist-list column">
            <!-- 开票中无法跳转 -->
            <li
              class="hist-list-item"
              @click="toDetails(item)"
              v-for="(item, index) in invoinceHisList"
              :key="index"
            >
              <div class="item-title row">
                <div class="title-info row">
                  <span class="title-name">{{ item.invoiceTitle }}</span>
                  <span
                    class="title-state"
                    :class=" classFilter(item.invoiceStatus) "
                    >{{ invoinceStatus[item.invoiceStatus] }}</span
                  >
                </div>
                <img
                  src="~assets/img/groupright.png"
                  v-if="item.invoiceStatus != 0"
                  class="item-arrow"
                  alt=""
                />
              </div>
              <div class="item-content row">
                <div class="item-con-left">
                  <div class="item-con-date row">
                    <img
                      src="~assets/img/invoice-date-icon.png"
                      class="date-icon"
                    />
                    <span class="item-date-text">{{
                      filterTime(item.applyDate)
                    }}</span>
                  </div>
                  <div class="item-con-comp row">
                    <img
                      src="~assets/img/invoice-comp-icon.png"
                      class="comp-icon"
                    />
                    <span class="item-comp-text"
                      >开票公司：{{ item.parkCompanyName }}</span
                    >
                  </div>
                </div>
                <div class="item-con-right">
                  <div class="item-price row">
                    <small>￥</small>
                    <span>{{ parseInt(item.amount) }}</span>
                    <small>.{{ filterAcount(item.amount) }}</small>
                  </div>
                </div>
              </div>
            </li>
            <div class="not-more" v-show="currentPage == pages">没有更多了</div>
          </ul>
        </scroll>

        <van-empty v-if="invoinceHisList.length == 0" class="custom-image"
  :image="seat"
  description="您还没有开票历史记录"/>
      </div>
    </div>
  </div>
</template>

<script>
import Scroll from "components/scroll/Scroll";

import { Tab, Tabs, Empty } from "vant";

import { setBg, removeBg } from 'common/util/util'

import * as API from "network";

export default {
  name: "InvoiceHistory",
  components: {
    Scroll,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Empty.name]: Empty
  },
  data() {
    return {
      seat: require("@/assets/img/invoice-history-seat.png"),
      unionId: "o1cjJwTERPUHzO4lywh9kIzyqt_4",
      invoinceHisList: [],
      invoinceStatus: ["开票中", "已开票", "", "开票失败"],

      pages: 1, //总页数
      currentPage: 1, //页码
      pageSize: 15, //条数
    };
  },
  created() {},
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const that = this
      that.getOrderList()
    },
    async getOrderList() {
      let that = this,
        { unionId, currentPage, pageSize } = that,
        params = {
          unionId,
          currentPage,
          pageSize,
          terminalType: "wxAccount",
        };
      await API.invoiceHisInvoiceList(params).then((res) => {
        that.pages = res.data.pages;
        that.invoinceHisList = [...that.invoinceHisList, ...res.data.detail];
      });

      // 重新计算滚动距离
      this.$nextTick(() => {
        this.$refs.scroll.refresh();
      });

      // 上拉加载结束后调用  finishPullUp组件中封装好的方法 才可继续上拉加载更多
      this.$refs.scroll.finishPullUp();
    },
    // 列表项跳转
    toDetails(item) {
      console.log(item);
      const that = this,
        state = item.invoiceStatus;
      if (state == 0) return;

      if (state == 1)
        this.$router.push({
          name: "InvoiceDetails",
          params: { detailInfo: JSON.stringify(item) },
        }); //开票成功
      if (state == 3)
        this.$router.push({
          name: "OpenInvoice",
          params: { detailInfo: JSON.stringify(item) },
        }); //开票失败
    },

    // 上拉加载更多 触发子组件$emit自定义事件
    loadMore() {
      const that = this,
        { currentPage, pages } = that;
      if (pages != 0) {
        if (currentPage == pages) {
          return;
        } else {
          that.currentPage += 1;
          that.getOrderList();
        }
      }

      console.log("到底了");
    },
    // 监听页面滚动
    contentScroll(position) {
      // console.log(position)
    },
    classFilter(state) {
      switch (state) {
        case 0:
          return "ing";
        case 1:
          return "suc";
        case 3:
          return "fail";
      }
    },
    filterAcount(value) {
      console.log(value);
      if (Number.isInteger(value)) {
        //是整数的时候
        return "00";
      }
      //非整数
      let res = value.toString().split(".")[1];
      if (res.length == 1) {
        return res + "0";
      } else {
        return res;
      }
    },
    filterTime(value) {
      if (value) {
        let yearDate = value.toString().split(" ")[0],
          yearDe = yearDate.toString().split("-"),
          timeDe = value.toString().split(" ")[1],
          index = new Date(yearDate).getDay(),
          week = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
        return (
          yearDe[0] +
          "年" +
          yearDe[1] +
          "月" +
          yearDe[2] +
          "日" +
          "（" +
          week[index] +
          "）" +
          timeDe.substring(0, 5)
        );
      }
    },
  },
  watch: {},
  computed: {},
   activated() {
    setBg("#f5f5f5")
  },
  deactivated() {
    removeBg()
  }
};
</script>
<style scoped>
/* 滚动区域的高度 */
.content {
  overflow: hidden;

  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0;
  right: 0;
}
.mask {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
}
.hist-list {
  padding: 20px 0;
}
.hist-list-item {
  width: 686px;
  min-height: 212px;
  padding: 32px 26px 32px 32px;
  box-sizing: border-box;
  background-color: #fff;
  margin-top: 16px;
}
.title-name {
  font-size: 32px;
  color: #333;
  font-weight: 600;
}
.title-state {
  padding: 4px 8px;
  font-size: 20px;
  border-radius: 8px;
  margin-left: 8px;
}
.title-state.ing {
  color: #008cff;
  background-color: rgba(0, 140, 255, 0.1);
}
.title-state.suc {
  color: #999;
  background-color: rgba(225, 225, 225, 0.4);
}
.title-state.fail {
  color: #ff5765;
  background-color: rgba(255, 87, 101, 0.1);
}
.item-title {
  justify-content: space-between;
}
.item-arrow {
  width: 32px;
  height: 32px;
}

.item-content {
  margin-top: 16px;
  justify-content: space-between;
}
.item-con-date {
  margin-bottom: 12px;
}
.date-icon {
  width: 24px;
  height: 24px;
  margin-right: 16px;
}
.item-date-text,
.item-comp-text {
  font-size: 28px;
  line-height: 28px;
  color: #999;
}
.item-con-comp {
  max-width: 450px;
  align-items: flex-start;
}
.comp-icon {
  width: 24px;
  height: 24px;
  margin-right: 16px;
}
.item-price {
  align-items: flex-end;
}
.item-price small {
  font-size: 28px;
  font-weight: 600;
  color: #333;
}
.item-price span {
  font-size: 48px;
  line-height: 48px;
  font-weight: 600;
  color: #333;
}

.tab-bar ::v-deep .header-vant-tab ::v-deep .van-tabs__wrap {
  height: auto;
  width: calc(750px - 150px);
}

.not-more {
  width: 350px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  font-size: 24px;
  color: #bbb;
  margin: 12px auto 0;
  position: relative;
  /* padding-bottom: 40px; */
}
.not-more::after {
  content: "";
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 88px;
  height: 1px;
  background-color: #e1e1e1;
}
.not-more::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 88px;
  height: 1px;
  background-color: #e1e1e1;
}

.custom-image{
  position: absolute;
  bottom: 40%;
  left: 50%;
  transform: translate(-50%,-50%);
  padding: 0;
}
.custom-image ::v-deep .van-empty__image{
  width: 238px;
  height: 182px;
}

.custom-image ::v-deep .van-empty__description{
  margin-top: 40px;
}
</style>