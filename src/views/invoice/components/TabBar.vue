<template>
  <div class="tab-bar">
    <div class="tab-bar-header row">
      <div class="header-vant-tab row">
        <van-tabs
          v-model="tCurrIndex"
          swipe-threshold="1"
          line-width="0"
          title-active-color="#333"
          title-inactive-color="#999"
          @click="tabsSelect"
        >
          <van-tab
            v-for="(val,key) in platesList"
            :title="val"
            :key="val[key]"
          >
          </van-tab>
        </van-tabs>
      </div>
      <div class="header-all-screen row">
        <div class="header-all row" @click="tabShowAll" v-show="platesList.length >= 4">
          <span class="all-text">全部</span>
          <img src="~assets/img/invoice-more.png" class="all-icon" alt="" />
        </div>
        <slot name="screen"></slot>


      </div>
    </div>
  </div>
</template>

<script>
import { Tab, Tabs } from "vant";

export default {
  name: "TabBar",
  components: {
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
  },
  props: {
    platesList: Array, //车牌列表
    tabCurrIndex: Number, //点击的tab下标 不能直接修改v-model 监听tabCurrIndex改变 v-model绑定tCurrIndex
  },
  data() {
    return {
      tCurrIndex: 0,
    };
  },
  created() {},
  mounted() {},
  methods: {
    tabsSelect(i) {
      // tab选择
      this.$emit('tabSelect',i)
    },
    tabShowAll() {
      // 全部车牌列表弹出层
      this.$emit('showAll')
    },
  },
  watch: {
    tabCurrIndex(i) {
      this.tCurrIndex = i
    }
  },
  computed: {},
};
</script>
<style scoped>
.tab-bar-header {
  width: 100%;
  height: 88px;
  background-color: #fff;
  border-bottom: 1px solid #e1e1e1;
  position: relative;
}
.header-vant-tab{
  width: 100%;
  padding-left: 32px;
  box-sizing: border-box;
  height: 88px;   
}
.header-vant-tab ::v-deep(.van-tab--active) {
  border-radius: 50px;
  border: 1px solid rgba(51,51,51,.15);
}
.header-vant-tab ::v-deep(.van-tab) {
  width: 176px;
  height: 56px;
  line-height: 56px;
  flex: none;
}
.header-vant-tab ::v-deep(.van-tabs__wrap) {
  height: 100%; 
}
.header-vant-tab ::v-deep(.van-tabs__nav--line){ 
  padding-bottom: 0;
  align-items: center;
  padding: 0;
  margin: 0;
}
.header-vant-tab ::v-deep(.van-tabs__nav) {
  align-items: center;
}
.header-vant-tab ::v-deep(.van-tab__text) {
  font-size: 24px;
}
.header-all-screen{
  position: absolute;
  right: 0;
  height: 100%;
  z-index: 9;
  background-color: #fff;
}
.header-all{
  padding:0 16px;
  height: 40px;
  position: relative;
}
.header-all::after{
  content: '';
  width: 24px;
  height: 48px;
  position: absolute;
  background: url('~assets/img/shadow.png')no-repeat left;
  background-size: 24px 48px;
  left: -24px;
}
.all-text{
  font-size: 24px;
  color: #333;
}
.all-icon{
  width: 32px;
  height: 32px;
}
</style>