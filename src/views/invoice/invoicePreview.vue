<template>
  <div class="invoice-preview">
    <div class="ip-wrapper">
      <img :src="previewImg" class="invoice-img" alt="" />
    </div>

    <div class="ip-footer row">
      <div class="ip-again-push" @click="reopenInvoice">再次推送</div>
      <a
        class="ip-down-invoice"
        :href="downloadUrl"
        :download="downloadfilename"
        @click="downInvoice(previewImg)"
        >下载发票</a
      >
    </div>

    <dialogs :show="dialogsShow" :obj="dialogsObj" @closepop="closeTc" @affirmBtn="affirms" v-if="dialogsShow" />

  </div>
</template>

<script>
import { setBg, removeBg } from 'common/util/util'

import { invoicePreview, invoiceReopen } from "network/index";

import dialogs from "components/dialog";

export default {
  name: "InvoicePreview",
  components: {
    dialogs
  },
  data() {
    return {
      invoiceInfoId: "", //开票id
      invoiceTitleId: "",//抬头id
      previewImg: "", //base64文件名
      downloadUrl: "", //下载的地址
      downloadfilename: "", //下载的文件名
      email: '',

      dialogsShow: false,
      dialogsObj: {
        btn: "好的", //单个按钮名称
        btn1: "取消", //双按钮第一个
        btn2: "再次推送", //双按钮第二个
        type: 2, //控制按钮, 1 单按钮 2 双按钮
        flag: 23, //控制弹窗显示内容
      },
    };
  },
  created() {},
  mounted() {
    const { invoiceInfoId, invoiceTitleId, email} = this.$route.query
    this.invoiceInfoId = invoiceInfoId
    this.invoiceTitleId = invoiceTitleId
    this.email = email
    this.getPreviewInfo();
  },
  methods: {
    getPreviewInfo() {
      invoicePreview({ invoiceInfoId: this.invoiceInfoId }).then((res) => {
        if (res.status == "200") {
          this.previewImg = res.data;
          return;
        }
        this.$toast(res.message);
      });
    },
    // 再次推送发票
    reopenInvoice() {
      const that = this,
           { dialogsObj } = that
          //  赋值上一页面传过来的邮箱地址
           dialogsObj.email = that.email
          //  显示是否修改邮箱弹框
           that.dialogsShow = true
    },
    affirms(e) {
      const that = this,
            { invoiceInfoId, invoiceTitleId, dialogsObj } = that,
            params = {
              invoiceInfoId,
              invoiceTitleId,
              email: dialogsObj.email
            }
      console.log(params)

      invoiceReopen(params).then(res => {
        if(res.status != '200') {
          that.$toast(res.message)
          return
        }
        that.$toast('推送成功!')
        that.closeTc()
        console.log(res)
      })
    },

    // 下载发票
    downInvoice(imgUrl) {
      let timestamp = new Date().getTime();
      let name = imgUrl.substring(22, 30) + timestamp + ".png";
      this.downloadUrl = imgUrl;
      this.downloadfilename = name;
    },
    closeTc() {
      this.dialogsShow = false
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
.ip-wrapper {
  margin-top: 16px;
}
.invoice-img {
  width: 100%;
}
.ip-footer {
  width: 100%;
  position: fixed;
  bottom: 80px;
  justify-content: space-evenly;
}
.ip-footer > div,
.ip-footer > a {
  width: 316px;
  height: 88px;
  line-height: 88px;
  text-align: center;
  font-size: 32px;
  border-radius: 44px;
  border: 2px solid rgba(0, 140, 255, 0.65);
  box-sizing: border-box;
}
.ip-again-push {
  color: #008cff;
}
.ip-down-invoice {
  color: #fff;
  background-color: #008cff;
}
</style>