<template>
  <div class="open-invoice">
    <!-- 开票失败显示 -->
    <template v-if="openFail">
      <div class="total-money">
        <div class="detail-item row">
          <div class="detail-left-title">电子发票</div>
          <div class="detail-right-info row">
            <span class="fail-text">开票失败</span>
          </div>
        </div>
        <div class="detail-item row">
          <div class="detail-left-title">所属车牌</div>
          <div class="detail-right-info row">
            <span class="fail-park-num">{{ failCarName }}</span>
          </div>
        </div>
      </div>
    </template>
    <div class="oi-detail">
      <div class="detail-title">发票详情</div>

      <div class="detail-content column">
        <div class="detail-item detail-tab row">
          <div class="detail-left-title">抬头类型</div>
          <div class="detail-right-info row">
            <div
              class="detail-tab-item"
              :class="{ active: tabCurrIndex == 0 }"
              @click="tabClick(0)"
            >
              企业单位
            </div>
            <div
              class="detail-tab-item"
              :class="{ active: tabCurrIndex == 1 }"
              @click="tabClick(1)"
            >
              个人/非企业单位
            </div>
          </div>
        </div>
        <div class="detail-item row">
          <div class="detail-left-title">发票抬头</div>
          <div class="detail-right-info row set-flex">
            <input
              type="text"
              placeholder="请输入发票抬头（必填）"
              class="input-item"
              v-model="invoiceTitle"
            />
            <img
              src="~assets/img/invoice-title-menu.png"
              class="invoice-title-icon"
              @click="showMoreTitle"
              v-if="tabCurrIndex == 0"
            />
          </div>
        </div>

        <!-- 企业单位展示 -->
        <template v-if="tabCurrIndex == 0">
          <div class="detail-item row">
            <div class="detail-left-title">公司税号</div>
            <div class="detail-right-info">
              <input
                type="text"
                placeholder="请输入纳税人识别号（必填）"
                class="input-item update-width"
                v-model="compInvoiceInfo.taxNo"
              />
            </div>
          </div>
          <div class="detail-item row" @click="showMoreInfo">
            <div class="detail-left-title">更多信息</div>
            <div class="detail-right-info row set-flex">
              <span class="mi-placeholder">企业地址、电话、开户行等</span>
              <img
                src="~assets/img/invoice-arrow.png"
                class="more-info-icon"
                alt=""
              />
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- 总金额 -->
    <div class="total-money">
      <div class="detail-item row">
        <div class="detail-left-title">总金额</div>
        <div class="detail-right-info row set-flex">
          <span class="total-price">￥{{ totalPrice }}</span>
          <span class="total-num">{{ orderNum }}个消费记录</span>
        </div>
      </div>
    </div>

    <!-- 接收方式 -->
    <div class="receive-mode">
      <div class="detail-title">接收方式</div>
      <div class="receive-info">
        <div class="detail-item row">
          <div class="detail-left-title">电子邮件</div>
          <div class="detail-right-info">
            <input
              type="text"
              placeholder="用于向您发送电子发票（必填）"
              class="input-item update-width"
              v-model="receiveEmail"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="footer-btn row">
      <div class="sure-btn" @click="sureOpenInvoice">
        {{ openFail ? "重新" : "确认" }}开票
      </div>
    </div>

    <!-- 发票抬头浮层列表 -->
    <van-action-sheet v-model:show="moreTitle">
      <div class="more-title-content">
        <div class="mt-header row">
          <span class="mt-left-title">请选择发票抬头</span>
          <img
            src="~assets/img/guanbi@2x.png"
            class="mt-close-icon"
            @click="showMoreTitle"
          />
        </div>
        <ul class="mt-list column">
          <li
            class="mt-list-item row"
            v-for="(item, index) in moreTitleList"
            :key="item.invoiceTitleId"
            @click="selectListItem(item)"
          >
            <div class="mt-item-left column">
              <span class="comp-name">{{ item.invoiceTitle }}</span>
              <span class="duty-num">{{ item.taxNo }}</span>
            </div>
            <div
              class="mt-item-del"
              @click.stop="delListIten(index, item.invoiceTitleId)"
              :class="{ 'no-del': delStatus == index }"
            >
              删除
            </div>
          </li>
        </ul>
      </div>
    </van-action-sheet>

    <!--  更多信息右侧浮层 -->
    <van-popup
      v-model:show="moreInfo"
      position="right"
      :style="{ width: '100%', height: '100%', background: '#f5f5f5' }"
    >
      <img
        src="~assets/img/guanbi@2x.png"
        class="other-close-icon"
        @click="closeMoreInfo"
      />
      <div class="other-info column">
        <div class="other-item row">
          <div class="other-title">公司地址</div>
          <input
            type="text"
            placeholder="请输入公司地址（非必填）"
            class="other-input"
            v-model="compInvoiceInfo.address"
          />
        </div>
        <div class="other-item row">
          <div class="other-title">公司电话</div>
          <input
            type="text"
            placeholder="请输入公司电话（非必填）"
            class="other-input"
            v-model="compInvoiceInfo.phone"
          />
        </div>
        <div class="other-item row">
          <div class="other-title">公司开户行</div>
          <input
            type="text"
            placeholder="请输入公司开户行名称（非必填）"
            class="other-input"
            v-model="compInvoiceInfo.bankName"
          />
        </div>
        <div class="other-item row">
          <div class="other-title">开户行帐号</div>
          <input
            type="text"
            placeholder="请输入开户行帐号（非必填）"
            class="other-input"
            v-model="compInvoiceInfo.bankAccount"
          />
        </div>
      </div>
      <div class="other-btn" @click="closeMoreInfo">确定</div>
    </van-popup>

    <dialogs
      :show="dialogsShow"
      :obj="dialogsObj"
      @affirmBtn="affirms"
      v-if="dialogsShow"
    />
  </div>
</template>

<script>
import { throttle } from "common/util/util"

import { setBg, removeBg } from 'common/util/util'

import { Icon, ActionSheet, Popup } from "vant";
import dialogs from "components/dialog";

import {
  invoiceTitleSave,
  invoiceTitleList,
  invoiceNewOpen,
  invoiceDelTitle,
  invoiceReopen,
} from "network/index";

export default {
  name: "OpenInvoice",
  components: {
    dialogs,
    [Icon.name]: Icon,
    [ActionSheet.name]: ActionSheet,
    [Popup.name]: Popup,
  },
  data() {
    return {
      unionId: "o1cjJwTERPUHzO4lywh9kIzyqt_4",
      orderNum: "", //上一页面传入的订单数量
      totalPrice: "", //上一页面传入的总价

      failCarName: "", //失败的车牌号

      invoiceTitleId: "", //当前发票抬头的id

      openFail: false, //开票失败进入当前页面
      tabCurrIndex: 0, //企业 0 || 个人 1
      moreTitle: false, //控制 更多发票抬头底部弹出层
      moreTitleList: [], //更多发票抬头列表
      moreInfo: false, //控制 更多信息右侧浮层
      //企业开票信息
      compInvoiceInfo: {},
      personalInvoiceInfo: {}, //个人开票信息,
      invoiceTitle: "", //最终的发票抬头
      receiveEmail: "", //最终接收的邮箱

      dialogsShow: false,
      dialogsObj: {
        btn: "好的", //单个按钮名称
        btn1: "取消", //双按钮第一个
        btn2: "继续", //双按钮第二个
        type: 1, //控制按钮, 1 单按钮 2 双按钮
        flag: 22, //控制弹窗显示内容
      },
      delStatus: -1,
    };
  },
  created() {},
  mounted() {
    const that = this;
    let { orderNum, totalPrice } = that.$route.query;
    let detailInfo = JSON.parse(that.$route.params.detailInfo);
    // detailInfo存在 则开票失败进入此页面
    if (detailInfo) {
      that.openFail = true;
      if (detailInfo.titleType == 0) {
        that.compInvoiceInfo = detailInfo;
      } else {
        that.personalInvoiceInfo = detailInfo;
      }

      // 抬头、邮箱、抬头id、发票类型 赋值
      that.invoiceTitle = detailInfo.invoiceTitle;
      that.receiveEmail = detailInfo.email;
      that.invoiceTitleId = detailInfo.invoiceTitleId;
      that.tabCurrIndex = detailInfo.titleType;
      that.orderNum = detailInfo.orderCount;
      that.totalPrice = detailInfo.amount;
      that.failCarName = detailInfo.incomeName;
      console.log(detailInfo);
    } else {
      that.orderNum = orderNum;
      that.totalPrice = totalPrice;
    }
    this.getUserInvoiceTitleList();
  },
  methods: {
    // 获取用户所有的发票抬头列表
    getUserInvoiceTitleList() {
      invoiceTitleList({ unionId: this.unionId }).then((res) => {
        this.moreTitleList = res.data;
        console.log(res);
      });
    },
    // 确认开票  函数节流 2s内避免用户频繁请求
    sureOpenInvoice: throttle(async function() {
      const that = this,
        { openFail } = that,
        params = that.getOpenReqParams(); //object
      if (params) {
        console.log(params)
        // 新增 || 编辑发票抬头 params.invoiceTitleId 有值 则编辑
        await invoiceTitleSave(params).then((res) => {
          if (res.status == "200") {
            if (!params.invoiceTitleId) {
              that.invoiceTitleId = res.data.invoiceTitleId;
            }
          } else {
            this.$toast(res.message);
          }
          console.log(res);
        });

        // 如果开票失败进入
        let reOpenParams = {}
        if (openFail) {
          reOpenParams['invoiceInfoId'] = params.invoiceInfoId
          reOpenParams['invoiceTitleId'] = params.invoiceTitleId
          reOpenParams['email'] = params.email
        }
        // 新开
        let newOpenParams = {
          invoiceTitleId: that.invoiceTitleId,
          incomeIds: localStorage.getItem("incomeIds"),
        };

        // 获取开票参数
        let invoiceParasm = openFail ? reOpenParams : newOpenParams

        await that.userOpenInvoice(invoiceParasm).then(res => {
          if (res.status != "200") {
            that.$toast(res.message);
            return;
          }
          that.dialogsShow = true;
          console.log(res);
        })
      }
    },2000),
    /**
     * @reutrn {Object} 新增||编辑发票抬头的请求数据
     */
    // 获取用户填写的开票信息
    getOpenReqParams() {
      let that = this,
        {
          tabCurrIndex,
          compInvoiceInfo,
          personalInvoiceInfo,
          invoiceTitle,
          receiveEmail,
          unionId,
        } = that;

      if (invoiceTitle == "") {
        this.$toast("请输入发票抬头!");
        return;
      }
      if (receiveEmail == "") {
        this.$toast("请输入电子邮件接收地址!");
        return;
      }
      // 公司
      if (tabCurrIndex == 0) {
        if (!compInvoiceInfo.taxNo) {
          this.$toast("请输入公司税号!");
          return;
        }
        compInvoiceInfo["unionId"] = unionId;
        compInvoiceInfo["invoiceTitle"] = invoiceTitle;
        compInvoiceInfo["email"] = receiveEmail;
        compInvoiceInfo["titleType"] = "0";
        compInvoiceInfo["isDefault"] = "0"; //是否为默认抬头
        return compInvoiceInfo;
      } else {
        // 个人  请求接口传递的参数 Obj
        personalInvoiceInfo["unionId"] = unionId;
        personalInvoiceInfo["invoiceTitle"] = invoiceTitle;
        personalInvoiceInfo["email"] = receiveEmail;
        personalInvoiceInfo["titleType"] = "1";
        personalInvoiceInfo["isDefault"] = "0";
        return personalInvoiceInfo;
      }
    },

    // 用户开发票 || 重开
    userOpenInvoice(params) {
      const that = this
      if(!that.openFail) { //新开
        return invoiceNewOpen(params)
      }else { //失败重开
        return invoiceReopen(params)
      }
    },

    affirms() {
      this.$router.go(-2);
    },

    // 发票抬头列表选择并渲染
    selectListItem(item) {
      const that = this,
        { compInvoiceInfo, personalInvoiceInfo } = that;

      // 当前用户点击的类型 0 公司  1个人
      if (item.titleType == 0) {
        that.compInvoiceInfo = item;
      } else {
        that.personalInvoiceInfo = item;
      }

      // 抬头、邮箱、抬头id、发票类型 赋值
      that.invoiceTitle = item.invoiceTitle;
      that.receiveEmail = item.email;
      that.invoiceTitleId = item.invoiceTitleId;
      that.tabCurrIndex = item.titleType;

      // 隐藏底部列表弹出层
      that.moreTitle = !that.moreTitle;
    },

    // 发票抬头列表选择删除
    delListIten(i, id) {
      let { moreTitleList, delStatus } = this;
      // 当前页面渲染的抬头信息禁止用户删除
      if(i == delStatus) {
        return
      }
      invoiceDelTitle({ invoiceTitleId: id }).then((res) => {
        if (res.status != "200") {
          this.$toast(res.message);
          return;
        }
        this.$toast("删除成功!");

        moreTitleList.splice(i, 1);

        // 删除所有后隐藏底部弹出层
        if (moreTitleList.length == 0) {
          this.moreTitle = false;
        }
      });
    },
    // 抬头类型 tab 切换
    tabClick(index) {
      const that = this;
      if (index != that.tabCurrIndex) {
        that.tabCurrIndex = index;
      }

      if (index == 0) {
        that.compInvoiceInfo = {};
      } else {
        that.personalInvoiceInfo = {};
      }
      that.invoiceTitleId = "";
      that.invoiceTitle = "";
      that.receiveEmail = "";
    },

    // 更多发票抬头
    showMoreTitle() {
      if (this.moreTitleList.length > 0) {
        this.moreTitle = !this.moreTitle;
      } else {
        this.$toast("暂无更多发票抬头!");
      }
    },

    // 展示更多信息右侧浮层
    showMoreInfo() {
      this.moreInfo = true;
    },

    // 隐藏更多信息浮层
    closeMoreInfo() {
      this.moreInfo = !this.moreInfo;
    },
  },
  watch: {
    invoiceTitleId() {
      const { invoiceTitleId, moreTitleList } = this
      moreTitleList.map((item, index) => {
        if(item.invoiceTitleId == invoiceTitleId) {
          // 当前页面渲染的发票抬头信息下标  删除时使用 限制不可删除
          this.delStatus = index
        }
      })
    }
  },
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
.detail-item {
  width: 100%;
  height: 104px;
  border-bottom: 1px solid #e1e1e1;
  padding-left: 24px;
  box-sizing: border-box;
}
.detail-item:last-child {
  border: none;
}
.detail-title {
  font-size: 28px;
  font-weight: 600;
  color: #999;
  margin: 32px 0 16px 56px;
}
.detail-content,
.total-money,
.receive-info {
  width: 686px;
  background-color: #fff;
  border-radius: 8px;
  margin: 0 auto;
}
.total-money {
  margin: 16px auto 32px;
}
.detail-left-title {
  width: 120px;
  font-size: 28px;
  color: #333;
  margin-right: 30px;
}
.detail-tab-item {
  padding: 0 24px;
  height: 56px;
  line-height: 56px;
  box-sizing: border-box;
  font-size: 24px;
  color: #999;
  border-radius: 35px;
  border: 2px solid rgba(51, 51, 51, 0.15);
  margin-right: 16px;
}
.detail-tab-item.active {
  border-color: #008cff;
  color: #008cff;
}
.detail-right-info {
  width: calc(100% - 150px);
}
.input-item {
  font-size: 28px;
}
.update-width {
  width: 100%;
}
.invoice-title-icon {
  width: 40px;
  height: 40px;
  margin-right: 32px;
}
.more-info-icon {
  width: 32px;
  height: 32px;
  margin-right: 32px;
}
.set-flex {
  justify-content: space-between;
}
input {
  border: none;
  padding: 0;
}

.total-price {
  font-size: 28px;
  color: #ff5765;
}
.total-num {
  font-size: 28px;
  color: #bbb;
  margin-right: 32px;
}

.footer-btn {
  width: 100%;
  position: fixed;
  bottom: 80px;
  justify-content: center;
}
.sure-btn {
  width: 654px;
  height: 88px;
  line-height: 88px;
  text-align: center;
  font-size: 32px;
  color: #fff;
  border-radius: 44px;
  background-color: #008cff;
}

/* 更多发票抬头底部弹出层 */
.more-title-content {
  padding: 40px 0 0;
  max-height: 980px;
}

.mt-header {
  width: 750px;
  padding: 0 48px 32px;
  box-sizing: border-box;
  justify-content: space-between;
  border-bottom: 1px solid #e1e1e1;
}
.mt-left-title {
  font-size: 28px;
  color: #999;
}
.mt-close-icon {
  width: 32px;
  height: 32px;
}
.mt-list {
  padding-left: 48px;
}
.mt-list-item {
  width: 100%;
  padding: 40px 0;
  border-bottom: 1px solid #e1e1e1;
  justify-content: space-between;
}
.mt-list-item:last-child {
  border: none;
}
.mt-item-left {
  align-items: flex-start;
}
.comp-name {
  font-size: 32px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}
.duty-num {
  font-size: 28px;
  color: #999;
}
.mt-item-del {
  height: 92px;
  line-height: 92px;
  border-left: 1px solid #e1e1e1;
  font-size: 28px;
  color: #008cff;
  text-align: center;
  padding: 0 48px;
}
.mt-item-del.no-del {
  color: #bbb;
}

input::placeholder {
  color: #bbb !important;
}
.mi-placeholder {
  font-size: 28px;
  color: #bbb;
}

/* 更多信息 */
.other-title {
  width: 200px;
  font-size: 28px;
  color: #333;
  margin-right: 24px;
}
.other-info {
  width: 686px;
  background-color: #fff;
  border-radius: 8px;
  margin: 80px auto 0;
}
.other-item {
  width: 100%;
  min-height: 106px;
  padding: 30px 0 30px 24px;
  box-sizing: border-box;
  border-bottom: 1px solid #e1e1e1;
}
.other-item:last-child {
  border: none;
}
.other-btn {
  width: 686px;
  height: 88px;
  line-height: 88px;
  text-align: center;
  border-radius: 44px;
  background-color: #008cff;
  font-size: 32px;
  color: #fff;
  margin: 100px auto 0;
}
.other-input {
  width: 100%;
  font-size: 28px;
}
.other-close-icon {
  width: 32px;
  height: 32px;
  position: absolute;
  right: 40px;
  top: 30px;
}

/* 失败渲染 */
.fail-text {
  font-size: 28px;
  color: #ff5765;
}
.fail-park-num {
  font-size: 28px;
  color: #333;
}
</style>