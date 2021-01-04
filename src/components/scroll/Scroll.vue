<template>
  <div class="wrapper" ref="wrapper">
    <div class="content" ref="datas">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";

export default {
  name: "Scroll",
  props: {
    probeType: {
      type: Number,
      default: 0,
    },
    pullUpLoad: {
      type: Boolean,
      default: false,
    },
    scrollX: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      bs: null,
      flag: false,
    };
  },
  mounted() {
    this.bs = new BScroll(this.$refs.wrapper, {
      click: true, //页面点击事件
      probeType: this.probeType,
      pullUpLoad: this.probeType, //控制上拉加载更多
      scrollX: this.scrollX,
    });

    // 用户滚动出发 获取 x,y轴
    this.bs.on("scroll", (position) => {
      this.$emit("scroll", position);
      // 用户开始滚动
      if (position.y !== 0) {
        // 只调用一次 this.bs.refresh()方法
        if (!this.flag) {
          this.flag = true;
          this.bs.refresh();
        }
      }
    });

    this.bs.on("pullingUp", () => {
      // 调接口 加载数据  完成后finishPullUp()方法
      this.$emit("pullingUp");
    });
  },
  methods: {
    // 返回顶部 x,y,和过渡毫秒
    scrollToFn(x, y, time = 300) {
      this.bs.scrollTo(x, y, time);
    },

    finishPullUp() {
      this.bs.finishPullUp();
    },

    refresh() {
      this.bs.refresh()
    },

    // 获取页面离开是scroll滚动距离
    getScrollY() {
      return this.bs ? this.bs.y : 0
    }
  },
};
</script>
<style scoped>
</style>