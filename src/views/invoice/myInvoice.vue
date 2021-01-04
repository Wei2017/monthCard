<template>
  <div class="my-invoice column">
    <div class="invoice-group">
      <ul class="invoice-list">
        <li class="invoice-item row" @click="jumpView('/selectOpenInvoice','parkingInvoice')">
          <span class="item-title">临停发票</span>
          <img class="item-img" src="~assets/img/groupright.png" alt="" />
        </li>
        <li class="invoice-item row" @click="jumpView('/selectOpenInvoice','monthlyInvoice')">
          <span class="item-title">月租发票</span>
          <img class="item-img" src="~assets/img/groupright.png" alt="" />
        </li>
      </ul>
    </div>

    <div class="other-group">
      <ul class="other-list">
        <li class="other-item row" @click="jumpView('/invoiceHistory')">
          <span class="item-title">开票历史</span>
          <img class="item-img" src="~assets/img/groupright.png" alt="" />
        </li>
        <!-- <li class="other-item row">
          <span class="item-title">开票帮助</span>
          <img class="item-img" src="~assets/img/groupright.png" alt="" />
        </li> -->
      </ul>
    </div>

    <div class="invoice-tips">
      <h6 class="tips-title">温馨提示</h6>
      <p class="tips-content">
        目前仅支持开具一个月内支付宝订单发票，请您注意订单期限，如需发票，请您尽快开具，若开具更多订单发票请联系云客服。
      </p>
    </div>
  </div>
</template>

<script>
import { setBg, removeBg } from 'common/util/util'

export default {
  name: "MyInvoice",
  components: {},
  data() {
    return {};
  },
  created() {},
  mounted() {
    setBg("#f5f5f5")
  },
  methods: {
    // 页面跳转
    jumpView(path, type = '') {
      console.log(path)
      if(type != '') {
        this.$router.push( { path, query: { type } })
        return
      }
      this.$router.push( path )
    }
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
.invoice-group,
.other-group {
  width: 686px;
  /* height: 210px; */
  border-radius: 8px;
  background-color: #fff;
  margin: 32px 0 16px;
}
.other-group {
  margin-top: 0;
}
.invoice-item,
.other-item {
  padding: 0 24px;
  height: 104px;
  border-bottom: 1px solid #e1e1e1;
  box-sizing: border-box;
  justify-content: space-between;
}
.invoice-item:last-child,
.other-item:last-child {
  border: none;
}
.item-title {
  font-size: 28px;
  color: #333;
}
.item-img {
  width: 24px;
  height: 24px;
}
.invoice-tips {
  width: 696px;
}
.tips-title,
.tips-content {
  font-size: 24px;
  color: #999;
}
</style>