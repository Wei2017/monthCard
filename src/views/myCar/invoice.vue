<template>
  <div class="invoice">
    <ul class="invoice_ul">
      <li class="invoice_item" @click="goOther">
        <p class="invoice_item_p">
          <span>临停开票</span>
          <img src="~assets/img/groupright.png" alt="" srcset="" />
        </p>
      </li>
      <li class="invoice_item" @click="goTc">
        <p class="invoice_item_p">
          <span>月租开票</span>
          <img src="~assets/img/groupright.png" alt="" srcset="" />
        </p>
      </li>
    </ul>
    <dialogs
      :show="shows"
      :obj="obj"
      @closepop="closeTc"
      @affirmBtn="affirms"
    />
  </div>
</template>
<script>
import dialogs from "components/dialog";
export default {
  data() {
    return {
      shows: false,
      obj: {
        btn: "我知道了", //单个按钮名称
        btn1: "取消", //双按钮第一个
        btn2: "继续", //双按钮第二个
        type: 1, //控制按钮, 1 单按钮 2 双按钮
        flag: 17 //控制弹窗显示内容
      }
    };
  },
  components: {
    dialogs
  },
  created() {},
  mounted() {},
  methods: {
    closeTc() {
      this.shows = false;
    },
    affirms(e) {
      this.shows = false;
    },
    goOther() {
      window.location.href = window.location.origin+"/orderListInvoice";
    },
    goTc() {
      this.shows = true;
    }
  }
};
</script>
<style scope>
 body {
  background: rgba(245, 245, 245, 1);
}
.invoice_ul {
  width: 100%;
  margin: 34px 0 0;
}
.invoice_item {
  width: 100%;
  line-height: 104px;
  padding: 0 0 0 112px;
  box-sizing: border-box;
  font-size: 28px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
}
.invoice_item:first-of-type {
  background: url("~assets/images/linting@2x.png") no-repeat 48px center;
  background-size: 40px 40px;
  background-color: #fff;
}
.invoice_item:nth-of-type(2) {
  background: url("~assets/images/yuezu@2x.png") no-repeat 48px center;
  background-size: 40px 40px;
  background-color: #fff;
}
.invoice_item_p {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px 0 0;
  box-sizing: border-box;
  border-bottom: 2px solid #e1e1e1;
}
.invoice_item_p > img {
  width: 36px;
  height: 36px;
}</style
>>
