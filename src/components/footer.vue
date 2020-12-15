<template>
  <div class="footer-bar">
    <ul class="footer-list">
      <li
        class="footer-item"
        v-for="(item, index) in listData"
        :key="index"
        @click="changeBar(index)"
      >
        <img :src="item.xzImg" class="tab-img" v-if="activeIndex == index" />
        <img :src="item.morenImg" class="tab-img" v-else />
        <p :style="activeIndex == index ? 'color:#008CFF' : 'color:#999999'">
          {{ item.title }}
        </p>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: ["activeIndex"],
  data() {
    return {
      listData: [
        {
          title: "停车月卡",
          morenImg: require("assets/img/yueka@2x.png"),
          xzImg: require("assets/img/yuekaxz@2x.png"),
        },
        {
          title: "我的",
          morenImg: require("assets/img/wode@2x.png"),
          xzImg: require("assets/img/wodexz@2x.png"),
        },
      ],
    };
  },
  methods: {
    changeBar(index) {
      if (index == 0) this.$router.push({ path: "/cardIndex" });
      if (index == 1) this.$router.push({ path: "/Mine" });
    },
  },
};
</script>

<style>
/* 底部公共 */
.footer-bar {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  padding: 22px 0 18px 0;
  background: #fff;
}
.footer-bar ul {
  display: flex;
  justify-content: space-around;
  text-align: center;
  font-size: 20px;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
  line-height: 20px;
}
.footer-item .tab-img {
  height: 44px;
  width: 44px;
  margin-bottom: 8px;
}
</style>