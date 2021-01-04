<template>
  <div class='invoice-order-list'>
    <div class="iol-wrapper">
      <ul class="order-list">
        <li class="order-item" v-for="item in orderList" :key="item.incomeId">
          <p class="item-title">{{item.parkName}}</p>
          <div class="item-content row">
            <div class="item-left-con">
              <div class="item-left-info row">
                <img src="~assets/img/invoice-p-icon.png" class="address-icon" alt="">
                <span class="left-text">{{item.incomeName}}</span>
              </div>
              <div class="item-left-info row">
                <img src="~assets/img/invoice-date-icon.png" class="date-icon" alt="">
                <span class="left-text">{{item.payTime}}</span>
              </div>
            </div>
            <div class="item-right-price row">
              <small>￥</small>
              <span class="right-price">{{parseInt(item.amountPayed)}}</span>
              <small>.{{ filterAcount(item.amountPayed) }}</small>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { setBg, removeBg } from 'common/util/util'

import { invoiceDetails } from "network/index";

export default {
  name: 'InvoiceOrderList',
  components: {},
  data() {
    return {
      invoiceInfoId: '',
      orderList: []
    }
  },
  created() {},
  mounted() {
    const that = this,
          { invoiceInfoId } = that.$route.query
    console.log(invoiceInfoId)
    
    that.getDetailsInfo(invoiceInfoId)

  },
  methods: {
    getDetailsInfo(invoiceInfoId) {
      const params = {
        terminalType: "wxAccount",
        invoiceInfoId
      }
      invoiceDetails(params).then((res) => {
        let orderList = res.data
        this.orderList = orderList
      });
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
  .order-item{
    width: 686px;
    background-color: #fff;
    border-radius: 8px;
    margin: 16px auto 0;
    padding: 32px 26px 32px 32px;
    box-sizing: border-box;
  }
  .item-title{
    font-size: 32px;
    font-weight: 600;
    color: #333;
    margin-bottom: 16px;
  }
  .item-content{
    justify-content: space-between;
  }
  .item-left-info{
    margin-bottom: 8px;
  }
  .address-icon{
    width: 24px;
    height: 24px;
  }
  .date-icon{
    width: 24px;
    height: 24px;
  }
  .left-text{
    font-size: 28px;
    color: #999;
    margin-left: 16px;
  }
  .item-right-price{
    align-items: flex-end;
  }
  .item-right-price small{
    font-size: 28px;
    font-weight: 600;
    color: #333;
  }
  .right-price{
    font-size: 48px;
    font-weight: 600;
    line-height: 48px;
    color: #333;
  }
</style>