<template>
  <div class="select-open-invoice">
    <!-- 临停 -->
    <template v-if="invoiceType == 'parkingInvoice'">
      <tab-bar
        class="tab-bar"
        :platesList="platesList"
        :tabCurrIndex="amCurrIndex"
        @tabSelect="handleTabsSelect"
        @showAll="showAllPark"
      >
        <template v-slot:screen>
          <div class="header-screen row" @click="showScreen">
            <img class="screen-img" src="~assets/img/invoice-screen.png" alt="" />
            <span class="screen-text">筛选</span>
          </div>
        </template>
      </tab-bar>
    </template>
    <!-- 月租 -->
    <template v-else-if="invoiceType == 'monthlyInvoice'">
      <div class="month-fixed-top row">
        <div class="header-screen row" @click="showScreen">
          <img class="screen-img" src="~assets/img/invoice-screen.png" alt="" />
          <span class="screen-text">筛选</span>
        </div>
      </div>
    </template>
    <div class="parking-records">
      <!-- <scroll
        class="content"
        ref="scroll"
        @pullingUp="loadMore"
        @scroll="contentScroll"
        :probeType="3"
        :pullUpLoad="true"
      > -->
      <div
        class="records-content column"
        v-for="(val, key) in parkingRecordList"
        :key="key"
      >
        <div class="records-month">{{ key }}</div>
        <div class="records-list">
          <div
            class="item-info row"
            v-for="item in val"
            :key="item.dataId"
            @click="checkItem(item)"
          >
            <img class="item-icon" :src="item.check ? checked : check" />
            <div class="item-content row">
              <div class="item-left column">
                <!-- 如果为临停开票 template v-if -->
                <template v-if="invoiceType == 'parkingInvoice'">
                  <span class="item-name">{{ item.parkingName }}</span>
                  <span class="item-stop-time">{{ item.stopTime }}</span>
                </template>
                <!-- 如果为月租开票 template v-else -->
                <template v-else-if="invoiceType == 'monthlyInvoice'">
                  <span class="item-name">我是月卡名称</span>
                  <span class="item-stop-time">{{ item.parkingName }}</span>
                </template>
                <!-- 都显示记录时间 -->
                <span class="item-records-time">{{ item.payTime }}</span>
              </div>
              <div class="item-right row">
                <small>￥</small>
                <span class="big-price">{{ parseInt(item.amountPayed) }}</span>
                <small>.{{ filterAcount(item.amountPayed) }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="not-more" v-show="scrollTop > 400">没有更多了</div>

      <van-empty
        v-if="Object.keys(parkingRecordList).length == 0"
        class="custom-image"
        :image="seat"
        description="您还没有可开票订单"
      />
      <!-- </scroll> -->
    </div>

    <div class="soi-footer">
      <div class="select-info row">
        <div class="order-info row">
          <span class="order-num">{{ orderNum }}</span>
          <span class="order-text">个订单，共</span>
          <span class="order-price"
            >￥{{ parseFloat(totalPrice).toFixed(2) }}</span
          >
        </div>
        <span class="footer-tips">车场分为多主体将分拆开具多张发票</span>
      </div>
      <div class="footer-oper row">
        <div class="all-select row" @click="handleSelectAll">
          <img class="select-all-icon" :src="selectAllIcon" alt="" />
          <span class="select-all-text">全选</span>
        </div>
        <div class="next-btn" @click="handleNext">下一步</div>
      </div>
    </div>

    <div class="mask" v-if="mask" @click="hideAllModel"></div>

    <!-- 点击全部展示 -->
    <plates-number-list
      v-show="paltesAllShow"
      :platesList="platesList"
      @hide="showAllPark"
      @listSelect="handleTabsSelect"
      :listCurrIndex="amCurrIndex"
    ></plates-number-list>

    <!-- 点击筛选展示 -->
    <div class="screen-model column" v-if="screenShow">
      <div class="soi-header row set-just">
        <div class="vehicle-num row" v-if="invoiceType == 'parkingInvoice'">
          <span class="num-text">{{ currPlatesName }}</span>
        </div>
        <div
          class="header-screen row"
          @click="showScreen"
          :class="{ 'flex-end': invoiceType == 'monthlyInvoice' }"
        >
          <img class="screen-img" src="~assets/img/invoice-screen.png" alt="" />
          <span class="screen-text">筛选</span>
        </div>
      </div>

      <div class="input-group row">
        <span class="smode-title">停车场名称</span>
        <input
          type="text"
          placeholder="请输入停车场名称"
          class="input-name"
          v-model="screenInfo.parkinglotName"
        />
      </div>
      <div class="input-group row" @click="showSelectDate">
        <span class="smode-title">选择起始日期</span>
        <input type="text" class="input-date" v-model="screenInfo.date" />
      </div>
      <div class="input-group row">
        <span class="smode-title">金额（元）</span>
        <input
          type="number"
          placeholder="最小金额"
          class="input-price"
          v-model="screenInfo.amountPayedGt"
        />
        <span class="model-line">-</span>
        <input
          type="number"
          placeholder="最大金额"
          class="input-price"
          v-model="screenInfo.amountPayedLt"
        />
      </div>
      <div class="model-footer row">
        <div class="reset-btn" @click="resetScreen">重置</div>
        <div class="sure-btn" @click="sureScreen">确认</div>
      </div>
      <van-calendar
        v-model="dateSelect"
        title="起始日期"
        type="range"
        :style="{ height: '500px' }"
        :min-date="new Date(2008, 8, 8)"
        :show-confirm="false"
        position="top"
        @confirm="onConfirm"
      />
    </div>
  </div>
</template>

<script>
import TabBar from "./components/TabBar";
import PlatesNumberList from "./components/PlatesNumberList";
import { Icon, ActionSheet, Loading, Calendar, Tab, Tabs, Empty } from "vant";
import { setBg, removeBg } from 'common/util/util'

import { invoiceSelectList, invoiceUserCarLicense } from "network/index";

export default {
  name: "SelectOpenInvoice",
  components: {
    TabBar,
    PlatesNumberList,
    [Icon.name]: Icon,
    [ActionSheet.name]: ActionSheet,
    [Loading.name]: Loading,
    [Calendar.name]: Calendar,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Empty.name]: Empty,
  },

  data() {
    return {
      unionId: "o1cjJwTERPUHzO4lywh9kIzyqt_4",
      selectAll: false,
      mask: false,
      selectAllIcon: require("@/assets/img/butongyi@2x.png"),
      seat: require("@/assets/img/invoice-order-seat.png"),
      orderNum: 0, //选中了几个订单
      totalPrice: 0, //选中的订单共多少钱
      paltesAllShow: false, //控制是否展示全部车牌
      platesList: [], //车牌列表
      parkingRecordList: {}, //停车记录列表
      check: require("@/assets/img/butongyi@2x.png"),
      checked: require("@/assets/img/tongyi@2x.png"),
      screenShow: false, //操作筛选弹框
      dateSelect: false, //操作日期控件
      // 筛选对象
      screenInfo: {
        parkinglotName: "", //停车场名称
        payTimeGt: "", //最小日期
        payTimeLt: "", //最大日期
        amountPayedGt: "", //最小金额
        amountPayedLt: "", //最大金额
      },
      invoiceType: "", //页面数据 是月租 || 临停
      amCurrIndex: 0, //选中的车牌下标
      currPlatesName: "", //选中的车牌号

      scrollTop: -1, //页面滚动距离
    };
  },
  created() {
    let that = this,
      { type } = that.$route.query;

    that.invoiceType = type;
  },
  mounted() {
    const that = this;
    that.init();
  },
  methods: {
    init() {
      const { invoiceType } = this;

      console.log(invoiceType);
      if (invoiceType == "parkingInvoice") {
        // 临停 获取车牌列表
        this.getCarNumList();
      } else {
        // 获取 月租 可开发票订单列表
        this.getOrderList();
      }
      this.listenerScroll();
    },
    // 获取车牌列表
    async getCarNumList() {
      const that = this;
      //获取用户车牌列表
      await invoiceUserCarLicense({ unionId: that.unionId }).then((res) => {
        that.platesList = res.data;
        // 初始化渲染 筛选弹框中的车牌号
        that.currPlatesName = res.data[0];
      });

      // 渲染车牌的可开票订单列表
      that.getOrderList(that.platesList[0]);
    },

    // 获取临停 || 月租 可开发票列表
    getOrderList(carLicense = "", screen = false) {
      const that = this,
        { unionId, invoiceType, screenInfo } = that;
      let params = {
        carLicense,
        unionId,
        invoiceStatus: 0,
        invoiceType,
      };

      // 月租 不传车牌号
      if (invoiceType == "monthlyInvoice") {
        delete params.carLicense;
      }
      // 筛选调用
      if (screen) {
        // 判断用户是否输入了筛选内容
        let screenState = Object.values(screenInfo).some((item) => {
          return item != "";
        });
        if (!screenState) {
          that.$toast("请输入筛选条件!");
          return;
        }

        Object.assign(params, screenInfo);
        // 关闭弹出层
        that.hideAllModel();
      }
      console.log(params);
      invoiceSelectList(params).then((res) => {
        let detail = res.data;

        // 初始化所有列表项都为未选中状态
        Object.keys(detail).map((key) => {
          detail[key].map((item) => {
            item.check = false;
          });
        });

        that.parkingRecordList = detail;
        console.log(res);
      });
    },

    // 确认筛选
    sureScreen() {
      const that = this,
        { invoiceType } = that;
      if (invoiceType == "monthlyInvoice") {
        that.getOrderList("", true);
        return;
      }
      // 获取筛选的数据
      that.getOrderList(that.currPlatesName, true);
    },

    // 全部车牌列表 选中效果实现
    handleTabsSelect(i) {
      const that = this,
        { platesList, invoiceType } = that;
      that.amCurrIndex = i;

      // 切换后底部信息初始化
      that.selectAll = false;
      that.orderNum = 0;
      that.totalPrice = 0;

      // 关闭弹出层
      that.hideAllModel();

      // 清空数据
      that.parkingRecordList = [];
      // 请求接口，渲染列表数据
      // 加载用户点击车牌的对应列表数据

      // 月租
      if (invoiceType == "monthlyInvoice") {
        that.getOrderList();
        return;
      }
      // 临停
      that.getOrderList(platesList[i]);
    },
    // 操作列表每一项
    checkItem(item) {
      const that = this,
        { selectAll, parkingRecordList } = that; //全选状态,列表对象

      item.check = !item.check;
      // 渲染底部订单个数&定价总价
      if (item.check) {
        that.totalPrice += parseFloat(item.amountPayed);
        that.orderNum++;
      } else {
        that.orderNum--;
        if (that.totalPrice - parseFloat(item.amountPayed) < 0) {
          that.totalPrice = 0;
        } else {
          that.totalPrice -= parseFloat(item.amountPayed);
        }
      }

      // 当前为全选状态下 取消全选按钮渲染
      if (selectAll) {
        that.selectAll = item.check;
      } else {
        let checkArr = [];
        // 获取所有列表项选中状态
        Object.keys(parkingRecordList).map((key) => {
          parkingRecordList[key].map((listItem) => {
            checkArr.push(listItem.check);
          });
        });

        // 如果所有列表项选中状态都为true
        if (!checkArr.includes(false)) {
          // 全选按钮选中
          that.selectAll = true;
        }
        console.log(checkArr);
      }
    },
    // 全选 or 取消全选
    handleSelectAll() {
      let that = this,
        { parkingRecordList } = that;
      that.selectAll = !that.selectAll;

      // 清除之前选中的订单个数与总价
      that.totalPrice = 0;
      that.orderNum = 0;

      // 改变所有的列表项选中状态
      Object.keys(parkingRecordList).map((key) => {
        parkingRecordList[key].map((listItem) => {
          listItem.check = that.selectAll;
          if (that.selectAll) {
            that.totalPrice += parseFloat(listItem.amountPayed);
            that.orderNum += 1;
          }
        });
      });
    },

    // 下一步
    handleNext() {
      let { parkingRecordList, orderNum, totalPrice } = this,
        submitIdArr = []; //选中的车牌列表incomeId

      Object.keys(parkingRecordList).map((key) => {
        parkingRecordList[key].map((listItem) => {
          if (listItem.check) {
            submitIdArr.push(listItem.incomeId);
          }
        });
      });
      if (submitIdArr.length != 0) {
        // 选中的订单id存入缓存
        localStorage.setItem("incomeIds", submitIdArr.join(","));
        console.log(submitIdArr);
        this.$router.push({
          path: "/openInvoice",
          query: {
            orderNum,
            totalPrice,
          },
        });
        return;
      }
      this.$toast("请选择开票订单!");
    },
    // 显示关闭筛选弹出层
    showScreen() {
      this.screenShow = !this.screenShow;
      this.mask = !this.mask;
    },
    // 显示关闭全部车牌弹出层
    showAllPark() {
      this.paltesAllShow = !this.paltesAllShow;
      this.mask = !this.mask;
    },
    // 弹出层遮罩 关闭所有弹出层
    hideAllModel() {
      this.screenShow = false;
      this.paltesAllShow = false;
      this.mask = false;
    },

    // 显示选择起始日期控件
    showSelectDate() {
      this.dateSelect = true;
    },

    // 获取起始日期
    formatDate(date) {
      return `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    },

    onConfirm(date) {
      const [start, end] = date;
      this.screenInfo["payTimeGt"] = this.formatDate(start);
      this.screenInfo["payTimeLt"] = this.formatDate(end);

      this.screenInfo["date"] = `${this.formatDate(start)} - ${this.formatDate(
        end
      )}`;
      this.dateSelect = false;
      console.log(this.screenInfo);
    },

    // 重置筛选
    resetScreen() {
      let that = this,
        { screenInfo, invoiceType } = this;
      Object.keys(screenInfo).map((key) => {
        that.screenInfo[key] = "";
      });

      // 月租列表
      if (invoiceType == "monthlyInvoice") {
        that.getOrderList();
        return;
      }

      // 临停列表
      that.getOrderList(this.currPlatesName);
    },
    // 监听页面滚动
    listenerScroll() {
      window.addEventListener("scroll", this.handleScroll);
    },
    handleScroll(e) {
      this.scrollTop =
        e.target.documentElement.scrollTop || e.target.body.scrollTop;
    },
    filterAcount(value) {
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
  },
  watch: {
    // 监听全选状态改变
    selectAll(state) {
      if (state) {
        this.selectAllIcon = require("@/assets/img/tongyi@2x.png");
      } else {
        this.selectAllIcon = require("@/assets/img/butongyi@2x.png");
      }
      // console.log(state)
    },
    // 监听车牌选中 获取当前选中的车牌号
    amCurrIndex(index) {
      let { platesList } = this;
      this.currPlatesName = platesList[index];
    },
  },
  computed: {},
  activated() {
    setBg("#f5f5f5")
  },
  deactivated() {
    document.removeEventListener("scroll", this.handleScroll);
    removeBg()
  }
};
</script>
<style scoped>
/* 滚动区域的高度 */
.content {
  overflow: hidden;

  position: absolute;
  top: 88px;
  bottom: 190px;
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
.soi-header {
  width: 100%;
  height: 88px;
  background-color: #fff;
  border-bottom: 1px solid #e1e1e1;
  position: relative;
}
.set-just {
  justify-content: space-between;
}
.vehicle-num {
  margin: 0 42px 0 32px;
}
.num-text {
  width: 176px;
  height: 56px;
  line-height: 56px;
  text-align: center;
  border: 1px solid rgba(51, 51, 51, 0.15);
  border-radius: 28px;
  font-size: 24px;
  color: #333;
  font-weight: 600;
}
.header-screen {
  margin-right: 32px;
}
.header-screen.flex-end {
  width: 100%;
  justify-content: flex-end;
}

.screen-img {
  width: 32px;
  height: 32px;
  margin-right: 10px;
}
.screen-text {
  font-size: 24px;
  color: #333;
}

/* 筛选浮层 */
.screen-model {
  width: 100%;
  height: 570px;
  border-radius: 0px 0px 16px 16px;
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 30;
}
.input-group {
  width: 686px;
  height: 102px;
  border-bottom: 1px solid #e1e1e1;
}
.smode-title {
  width: 200px;
  font-size: 28px;
  font-weight: 600;
  color: #333;
}
.input-name,
.input-date {
  width: 60%;
  font-size: 28px;
}
.input-price:first-child {
  text-align: left;
}
.input-price:last-child {
  text-align: right;
}
.input-price {
  width: 150px;
  font-size: 28px;
}
.model-line {
  font-size: 30px;
  color: #bbb;
}
input {
  border: none;
  padding: 0;
}
.model-footer {
  width: 686px;
  margin: 40px 0 48px;
  justify-content: flex-end;
}
.model-footer > div {
  width: 200px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  font-size: 32px;
  border-radius: 40px;
}
.reset-btn {
  color: #333;
  background-color: #f5f5f5;
  margin-right: 20px;
}
.sure-btn {
  color: #fff;
  background-color: #008cff;
}
.van-calendar__day--start {
  height: 64px !important;
}

/* 开具发票列表 */
.parking-records {
  padding-bottom: 300px;
}
.records-content {
  align-items: flex-start;
}
.records-list {
  width: 686px;
  margin: 0 auto;
  padding-left: 24px;
  background-color: #fff;
  border-radius: 8px;
  box-sizing: border-box;
}
.records-list > .item-info:last-child .item-content {
  border: none;
}
.records-month {
  margin: 32px 0 16px 56px;
  font-size: 28px;
  color: #999;
}
.item-icon {
  width: 36px;
  height: 36px;
  margin-right: 24px;
}
.item-content {
  width: 100%;
  justify-content: space-between;
  padding: 32px 0;
  border-bottom: 1px solid #e1e1e1;
}
.item-left {
  align-items: flex-start;
}
.item-name {
  font-size: 32px;
  color: #333;
  line-height: 44px;
}
.item-stop-time {
  margin: 8px 0 4px;
}
.item-stop-time,
.item-records-time {
  font-size: 24px;
  color: #999;
  line-height: 34px;
}
.item-right {
  font-size: 40px;
  color: #333;
  margin-right: 26px;
  align-items: flex-end;
}
.big-price {
  font-size: 40px;
  line-height: 40px;
  color: #333;
  font-weight: 600;
}
.item-right > small {
  font-size: 28px;
  line-height: 30px;
  color: #333;
  font-weight: 600;
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

/* 底部信息 */
.soi-footer {
  width: 100%;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 9;
}
.select-info {
  height: 64px;
  justify-content: space-between;
  padding: 0 32px;
  border-bottom: 2px solid #e1e1e1;
  box-sizing: border-box;
}
.select-info span {
  font-size: 24px;
}
.order-num,
.order-price {
  color: #ff5765;
}
.order-text {
  color: #333;
}
.footer-tips {
  color: #999;
}

.footer-oper {
  height: 126px;
  justify-content: space-between;
  padding: 0 32px;
}
.select-all-icon {
  width: 36px;
  height: 36px;
  margin-right: 8px;
}
.select-all-text {
  font-size: 28px;
  color: #333;
}
.next-btn {
  width: 240px;
  height: 88px;
  line-height: 88px;
  text-align: center;
  border-radius: 44px;
  background-color: #008cff;
  font-size: 32px;
  color: #fff;
}
.tab-bar ::v-deep(.van-tabs) {
  width: calc(100vw - 272px);
  height: 100%;
  overflow: hidden;
}

.month-fixed-top {
  width: 100%;
  height: 88px;
  background-color: #fff;
  border-bottom: 1px solid #e1e1e1;
  position: relative;
  justify-content: flex-end;
}

.custom-image {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0;
}
.custom-image ::v-deep(.van-empty__image) {
  width: 198px;
  height: 166px;
}
.custom-image ::v-deep(.van-empty__description) {
  margin-top: 40px;
}
</style>