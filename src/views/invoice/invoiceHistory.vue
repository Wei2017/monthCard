<template>
  <div class="invoice-history">
    <div class="ih-wrapper">
      <div class="history-list-wrap">
        <scroll
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
              v-for="(item, index) in state.invoinceHisList"
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
            <div class="not-more" v-show="state.currentPage == state.pages">没有更多了</div>
          </ul>
        </scroll>

        <van-empty v-if="state.invoinceHisList.length == 0" class="custom-image"
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

import { defineComponent, ref, computed, watch, onMounted, nextTick, reactive, onActivated, onDeactivated } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: "InvoiceHistory",
  components: {
    Scroll,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Empty.name]: Empty
  },
  setup (props, context) {
    const route = useRoute()
    const router = useRouter()
    const unionId = "o1cjJwTERPUHzO4lywh9kIzyqt_4"
    const invoinceStatus = ["开票中", "已开票", "", "开票失败"]

    const scroll = ref(null) //获取ref为scroll的代理对象
    // reactive 返回对象的响应式副本
    let state = reactive({
      invoinceHisList: [],
      pages: 1, //总页数
      currentPage: 1, //页码
    })
    const pageSize = 15 //条数
    const init = () => {
      getOrderList()
    }
    const getOrderList = async () => {
      let params = {
          unionId,
          currentPage: state.currentPage,
          pageSize,
          terminalType: "wxAccount",
        };
      await API.invoiceHisInvoiceList(params).then((res) => {
        state.pages = res.data.pages;
        
        state.invoinceHisList = [...state.invoinceHisList, ...res.data.detail];
      });
      // 重新计算滚动距离
      nextTick(() => {
        // 调scroll中的refresh方法  vue2.0写法 this.$refs.scroll.refresh()
        scroll.value.refresh();  //vue3.0
      });

      // 上拉加载结束后调用  finishPullUp组件中封装好的方法 才可继续上拉加载更多
      scroll.value.finishPullUp();

    }
    onMounted(() => {
      init()
    })
    const toDetails = (item) => {
      console.log(item);
      const status = item.invoiceStatus;
      if (status == 0) return;

      if (status == 1)
        router.push({
          name: "InvoiceDetails",
          params: { detailInfo: JSON.stringify(item) },
        }); //开票成功
      if (status == 3)
        router.push({
          name: "OpenInvoice",
          params: { detailInfo: JSON.stringify(item) },
        }); //开票失败
    }
    const loadMore = () => {
      const { currentPage, pages } = state;
      if (pages != 0) {
        if (currentPage == pages) {
          return;
        } else {
          state.currentPage += 1;
          getOrderList();
        }
      }
      console.log("到底了");
    }
    
    // 监听页面滚动
    const contentScroll = (position) => {
      // console.log(position)
    }
    const classFilter = (state) => {
      switch (state) {
        case 0:
          return "ing";
        case 1:
          return "suc";
        case 3:
          return "fail";
      }
    }
    const filterAcount = (value) => {
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
    }
    const filterTime = (value) => {
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
    }

    // 当前页面处于活跃状态
    onActivated(() => {
      setBg("#f5f5f5")
    })

    // 不处于活跃状态
    onDeactivated(() => {
      removeBg()
    })
    return {
      seat: require("@/assets/img/invoice-history-seat.png"),
      invoinceStatus,
      loadMore,
      state,

      toDetails,
      contentScroll,
      classFilter,
      filterAcount,
      filterTime,

      scroll
    };
  },
   activated() {
  },
  deactivated() {
  }
});
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

.tab-bar ::v-deep(.header-vant-tab) ::v-deep(.van-tabs__wrap) {
  /* height: auto; */
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
.custom-image ::v-deep(.van-empty__image) {
  width: 238px;
  height: 182px;
}

.custom-image ::v-deep(.van-empty__description) {
  margin-top: 40px;
}
</style>