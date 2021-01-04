<template>
  <div class='plates-num-list'>
        <!-- 点击全部展示 -->
    <div class="all-model">
      <div class="am-header row">
        <span class="am-header-text">全部车牌</span>
        <img
          src="~assets/img/guanbi@2x.png"
          class="am-close"
          @click="hideAllPlates"
        />
      </div>
      <div class="am-wrapper">
        <ul class="am-park-list row">
          <li
            class="apl-item"
            v-for="(item, index) in platesList"
            :key="item"
            :class="{ active: index == listCurrIndex }"
            @click="listSelect(index)"
          >
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlatesNumberList',
  props: {
    platesList: Array, //全部车牌列表
    listCurrIndex: Number
  },
  components: {},
  data() {
    return {
    }
  },
  created() {},
  mounted() {},
  methods: {
    hideAllPlates() {
      this.$emit('hide')
    },

    listSelect(i) {
      this.$emit('listSelect',i)
    }
  },
  watch: {

  },
  computed: {},
};
</script>
<style scoped>
  /* 全部车牌 */
.all-model {
  width: 100%;
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 30;
}
.am-header {
  height: 88px;
  border-bottom: 1px solid #e1e1e1;
  justify-content: center;
  position: relative;
}
.am-header-text {
  font-size: 28px;
  color: #333;
}
.am-close {
  width: 32px;
  height: 32px;
  position: absolute;
  right: 32px;
}
.am-park-list {
  width: 636px;
  flex-wrap: wrap;
  margin: 0 auto;
  padding: 40px 0 8px;
}
.apl-item {
  width: 176px;
  height: 56px;
  line-height: 56px;
  text-align: center;
  font-size: 24px;
  color: #999;
  border-radius: 28px;
  margin: 0 54px 32px 0;
  box-sizing: border-box;
}
.apl-item:nth-of-type(3n+0),
.apl-item:last-child{
  margin-right: 0;
}
.apl-item.active {
  border: 1px solid rgba(51, 51, 51, 0.15);
  color: #333;
  font-weight: 600;
}
</style>