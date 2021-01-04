<template>
  <div class="invoice-details">
    <div class="id-wrapper column">
      <div class="info-group">
        <div class="info-item row" @click="toPreview">
          <div class="item-left-title">电子发票</div>
          <div class="item-right-info row">
            <span class="invoice-state">已开票</span>
            <img
              src="~assets/img/invoice-arrow.png"
              class="arrow-icon"
              alt=""
            />
          </div>
        </div>
        <div class="info-item row">
          <div class="item-left-title">所属车牌</div>
          <div class="item-right-info">
            <span class="iri-text">{{ invoiceInfo.incomeName }}</span>
          </div>
        </div>
      </div>
      <div class="info-group">
        <div class="info-item row">
          <div class="item-left-title">公司名称</div>
          <div class="item-right-info">
            <span class="iri-text">{{ invoiceInfo.companyName || invoiceInfo.invoiceTitle }}</span>
          </div>
        </div>
        <div class="info-item row" v-if="invoiceInfo.titleType == 0">
          <div class="item-left-title">公司税号</div>
          <div class="item-right-info">
            <span class="iri-text">{{ invoiceInfo.taxNo }}</span>
          </div>
        </div>
        <div class="info-item row">
          <div class="item-left-title">发票金额</div>
          <div class="item-right-info">
            <span class="iri-text">¥{{ invoiceInfo.amount }}</span>
          </div>
        </div>
        <div class="info-item row" :class="{ 'no-border': !showMoreState }">
          <div class="item-left-title">申请时间</div>
          <div class="item-right-info">
            <span class="iri-text">{{
              filterTime(invoiceInfo.applyDate)
            }}</span>
          </div>
        </div>
        <div
          class="open-more-info row"
          v-if="!showMoreState && invoiceInfo.titleType == 0"
          @click="showMoreInfo"
        >
          <span class="open-more-text">展开更多信息</span>
          <img src="~assets/img/invoice-open.png" class="more-icon" alt="" />
        </div>

        <template v-if="showMoreState">
          <div class="info-item row">
            <div class="item-left-title">公司地址</div>
            <div class="item-right-info">
              <span class="iri-text">{{ invoiceInfo.address }}</span>
            </div>
          </div>
          <div class="info-item row">
            <div class="item-left-title">公司电话</div>
            <div class="item-right-info">
              <span class="iri-text">{{ invoiceInfo.phone }}</span>
            </div>
          </div>
          <div class="info-item row">
            <div class="item-left-title">公司开户行</div>
            <div class="item-right-info">
              <span class="iri-text">{{ invoiceInfo.bankName }}</span>
            </div>
          </div>
          <div class="info-item row">
            <div class="item-left-title">开户行帐号</div>
            <div class="item-right-info">
              <span class="iri-text">{{ invoiceInfo.bankAccount }}</span>
            </div>
          </div>
        </template>
      </div>

      <div class="info-group">
        <div class="info-item row sra" @click="toOrderList">
          <div class="item-left-order">
            <span class="invoice-order-total"
              >1张发票，含{{ invoiceInfo.orderCount }}个订单</span
            >
            <p class="io-date">{{minDate}} 至 {{maxDate}}</p>
          </div>
          <div class="item-right-info">
            <img
              src="~assets/img/invoice-arrow.png"
              class="arrow-icon"
              alt=""
            />
          </div>
        </div>
      </div>

      <div class="info-group">
        <div class="info-item row">
          <div class="item-left-title">接收邮箱</div>
          <div class="item-right-info">
            <span class="iri-text">{{ invoiceInfo.email }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="id-footer">
      <div class="again-push" @click="handleReopen">再次推送</div>
    </div>
  </div>
</template>

<script>
import { setBg, removeBg } from 'common/util/util'

import { invoiceDetails, invoiceReopen  } from "network/index";

export default {
  name: "InvoiceDetails",
  components: {},
  data() {
    return {
      showMoreState: false, //是否展示了更多信息
      invoiceInfoId: "", //详情id
      invoiceInfo: {},
      timeStampArr: [],//所有订单列表时间戳
      minDate: '', //最小日期
      maxDate: '', //最大日期
    };
  },
  created() {},
  mounted() {},

  // 页面不活跃状态下 隐藏更多信息
  deactivated() {
    this.showMoreState = false
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      console.log(vm)
      vm.newPath = from.name
      // 如果发票历史列表进入 则重新渲染页面数据 否则通过keep-alive缓存页面数据
      if(from.name == "InvoiceHistory") {
        vm.init()
      }
    });
  },

  methods: {
    init() {
      const that = this;
      let invoiceInfo = JSON.parse(this.$route.params.detailInfo) ;
      that.$nextTick(() => {
        that.invoiceInfo = invoiceInfo;
        // 获取列表信息 取第一个&最后一个payTime渲染日期
        that.getDetailsInfo(invoiceInfo.invoiceInfoId);
      });
    },

    // 获取当前发票下的所有订单 用于渲染最小日期 至 最大日期展示
    async getDetailsInfo(invoiceInfoId) {
      const params = {
        terminalType: "wxAccount",
        invoiceInfoId
      }
      await invoiceDetails(params).then((res) => {
        let orderList = res.data
        this.timeStampArr = orderList.map(item => {
          let time = item.payTime.replace(/-/g,'/')
          return this.getDateTime(time)
        })
      });

      this.getShowDate()
    },
    // 显示更多信息
    showMoreInfo() {
      this.showMoreState = true;
    },

    // 跳转订单列表页
    toOrderList() {
      this.$router.push({
        path: "/invoiceOrderList",
        query: {
          invoiceInfoId: this.invoiceInfo.invoiceInfoId
        }
      });
    },

    // 跳转发票预览
    toPreview() {
      const { invoiceInfoId, invoiceTitleId, email } = this.invoiceInfo
      this.$router.push({
        path: '/invoicePreview',
        query: {
          invoiceInfoId,
          invoiceTitleId,
          email
        }
      });
    },
    // 再次推送发票
    handleReopen() {
      const that = this,
      { invoiceInfo: { invoiceInfoId, invoiceTitleId } } = that,
            params = {
              invoiceInfoId,
              invoiceTitleId
            }
      invoiceReopen(params).then(res => {
        if(res.status != '200') {
          that.$toast(res.message)
          return
        }
        that.$toast("推送成功!")
      })
    },
    // 获取订单信息下的最大最小日期渲染
    getShowDate() {
      const that = this,
            timeStampArr = this.timeStampArr,
            minStamp = Math.min.apply(null, timeStampArr.map(item => (new Date(item)).valueOf())),  //最小时间戳
            maxStamp = Math.max.apply(null, timeStampArr.map(item => (new Date(item)).valueOf()))   //最大时间戳

      that.minDate = that.getDateFormat(minStamp)
      that.maxDate = that.getDateFormat(maxStamp)
    },
    // 时间戳转换 年月日 时分
    getDateFormat(timestamp) {
      let time = new Date(timestamp),
          year = time.getFullYear(),
          month = (time.getMonth() + 1).toString().padStart(2, '0'),
          date = (time.getDate()).toString().padStart(2, '0'),
          hours = (time.getHours()).toString().padStart(2, '0'),
          minute = (time.getMinutes()).toString().padStart(2, '0'),
          second = (time.getSeconds()).toString().padStart(2, '0');

      return `${year}年${month}月${date} ${hours}:${minute}`
    },


    /**
     * 日期传时间戳
     * @return {Number} 时间戳
     */
    getDateTime(time) {
      let date = new Date(time);
      return date.getTime();
    },
    filterTime(value) {
      if (value) {
        let yearDate = value.split(" ")[0],
          yearDe = yearDate.split("-"),
          timeDe = value.split(" ")[1],
          index = new Date(yearDate).getDay(),
          week = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
        console.log(value, yearDate, yearDe, timeDe, index, week);
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
.info-group {
  width: 686px;
  background-color: #fff;
  border-radius: 8px;
  margin-top: 16px;
}

.info-item {
  min-height: 104px;
  border-bottom: 1px solid #e1e1e1;
  padding: 0 24px;
}
.info-group .info-item:last-child {
  border: none;
}

.info-item.no-border {
  border: none;
}

.item-left-title {
  font-size: 28px;
  color: #999;
  width: 140px;
  margin-right: 24px;
}
.item-right-info.row {
  width: calc(100% - 170px);
  justify-content: space-between;
}
.arrow-icon {
  width: 32px;
  height: 32px;
}
.invoice-state {
  font-size: 28px;
  color: #008cff;
}
.iri-text {
  font-size: 28px;
  color: #333;
}
.open-more-info {
  padding-bottom: 30px;
  justify-content: center;
}
.open-more-text {
  font-size: 24px;
  line-height: 24px;
  color: #bbb;
}
.more-icon {
  width: 24px;
  height: 24px;
  margin-left: 10px;
}

.invoice-order-total {
  font-size: 28px;
  font-weight: 600;
  color: #333;
}
.io-date {
  font-size: 24px;
  color: #999;
}
.sra {
  justify-content: space-between;
}
.again-push {
  width: 654px;
  height: 88px;
  line-height: 88px;
  text-align: center;
  font-size: 32px;
  color: #fff;
  border-radius: 44px;
  background-color: #008cff;
  margin: 42px auto 78px;
}
</style>