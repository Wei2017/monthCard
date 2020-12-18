<template>
  <div id="page">
    <div class="wrap">
      <div class="radio-box" v-show="flag">
        <label :class="formData.commonCard == 1 ? 'active' : ''">
          <input
            type="radio"
            v-model="formData.commonCard"
            value="1"
          />汽油车</label
        >
        <label :class="formData.commonCard == 2 ? 'active' : ''">
          <input
            type="radio"
            v-model="formData.commonCard"
            value="2"
          />新能源</label
        >
      </div>
      <!-- <div class="card-header">车牌号码：</div> -->
      <div class="num-box">
        <div class="num0" @click="clickFirstWrap()">
          <span>{{ formData.num0 }}</span>
        </div>
        <div class="num1" @click="clickKeyWordWrap(1)">
          <span>{{ formData.num1 }}</span>
        </div>
        <em class="spot"></em>
        <div class="num1" @click="clickKeyWordWrap(2)">
          <span>{{ formData.num2 }}</span>
        </div>
        <div class="num1" @click="clickKeyWordWrap(3)">
          <span>{{ formData.num3 }}</span>
        </div>
        <div class="num1" @click="clickKeyWordWrap(4)">
          <span>{{ formData.num4 }}</span>
        </div>
        <div class="num1" @click="clickKeyWordWrap(5)">
          <span>{{ formData.num5 }}</span>
        </div>
        <div class="num1" @click="clickKeyWordWrap(6)">
          <span>{{ formData.num6 }}</span>
        </div>
        <div
          v-if="formData.commonCard == '2'"
          class="num1"
          @click="clickKeyWordWrap(7)"
        >
          <span>{{ formData.num7 }}</span>
        </div>
        <div v-else class="num1 num2" @click="changeCarNum">
          <p>+</p>
          <p>新能源</p>
        </div>
      </div>
    </div>
    <div class="first-word-wrap" v-if="firstWrapStatus">
      <div class="first-word" @click="selectFirstWord($event)">
        <div class="word">
          <span>京</span>
        </div>
        <div class="word">
          <span>湘</span>
        </div>
        <div class="word">
          <span>津</span>
        </div>
        <div class="word">
          <span>鄂</span>
        </div>
        <div class="word">
          <span>沪</span>
        </div>
        <div class="word">
          <span>粤</span>
        </div>
        <div class="word">
          <span>渝</span>
        </div>
        <div class="word">
          <span>琼</span>
        </div>
        <div class="word">
          <span>冀</span>
        </div>
        <div class="word">
          <span>川</span>
        </div>
      </div>
      <div class="first-word" @click="selectFirstWord($event)">
        <div class="word">
          <span>晋</span>
        </div>
        <div class="word">
          <span>贵</span>
        </div>
        <div class="word">
          <span>辽</span>
        </div>
        <div class="word">
          <span>云</span>
        </div>
        <div class="word">
          <span>吉</span>
        </div>
        <div class="word">
          <span>陕</span>
        </div>
        <div class="word">
          <span>黑</span>
        </div>
        <div class="word">
          <span>甘</span>
        </div>
        <div class="word">
          <span>苏</span>
        </div>
        <div class="word">
          <span>青</span>
        </div>
      </div>
      <div class="first-word" @click="selectFirstWord($event)">
        <div class="word">
          <span>浙</span>
        </div>
        <div class="word">
          <span>皖</span>
        </div>
        <div class="word">
          <span>藏</span>
        </div>
        <div class="word">
          <span>闽</span>
        </div>
        <div class="word">
          <span>蒙</span>
        </div>
        <div class="word">
          <span>赣</span>
        </div>
        <div class="word">
          <span>桂</span>
        </div>
        <div class="word">
          <span>鲁</span>
        </div>
        <div class="word">
          <span>宁</span>
        </div>
        <div class="word">
          <span>豫</span>
        </div>
      </div>
      <div class="first-word">
        <div class="word word1" @click="firstWrapStatus = false">
          <span>完成</span>
        </div>
        <div class="word" @click="selectFirstWord($event)">
          <span>新</span>
        </div>
        <div class="word" @click="selectFirstWord($event)">
          <span>使</span>
        </div>
        <div class="word" @click="selectFirstWord($event)">
          <span>警</span>
        </div>
        <div class="word" @click="selectFirstWord($event)">
          <span>学</span>
        </div>
        <div class="word" @click="selectFirstWord($event)">
          <span>港</span>
        </div>
        <div class="word" @click="selectFirstWord($event)">
          <span>澳</span>
        </div>
        <div class="word word1" @click="firstWrapStatus = false">
          <img src="~assets/images/delete@2x.png" alt="" srcset="" />
        </div>
      </div>
    </div>
    <div class="keyboard-wrap" v-if="keyBoardStatus === true">
      <!-- <div class="number-wrap"></div>
      <div class="letter-wrap"></div>
      <div class="cn-wrap"></div> -->
      <div class="keyboard" v-if="activeKeyWordIndex !== 1">
        <span
          v-for="(item, index) in allKeyWord._1"
          :key="index"
          @click="clickKeyBoard(item)"
          >{{ item }}</span
        >
      </div>
      <div class="keyboard">
        <span
          v-for="(item, index) in allKeyWord._2"
          :key="index"
          @click="clickKeyBoard(item)"
          >{{ item }}</span
        >
      </div>
      <div class="keyboard keyboard1">
        <span
          v-for="(item, index) in allKeyWord._3"
          :key="index"
          @click="clickKeyBoard(item)"
          >{{ item }}</span
        >
      </div>
      <div class="keyboard">
        <span class="back" @click="keyBoardStatus = false">返回</span>
        <span
          v-for="(item, index) in allKeyWord._4"
          :key="index"
          @click="clickKeyBoard(item)"
          >{{ item }}</span
        >
        <span class="delete" @click="deleteWord">
          <img src="~assets/images/delete@2x.png" alt="" />
        </span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formData: {
        commonCard: "1",
        num0: "",
        num1: "",
        num2: "",
        num3: "",
        num4: "",
        num5: "",
        num6: "",
        num7: "",
      },
      allKeyWord: {
        _1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
        _2: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        _3: ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
        _4: ["Z", "X", "C", "V", "B", "N", "M"],
      },
      activeKeyWordIndex: 1, // 当前车牌号
      keyBoardStatus: false,
      firstWrapStatus: false, // 选择弹窗
      confirmTitle: "",
      submitConfirm: false,
      submitConfirmFalse: false,
      submitConfirmText: "",
    };
  },
  props: {
    datas: {
      type: Object,
    },
    flag: {
      type: Boolean,
    },
  },
  created() {},
  mounted() {},
  methods: {
    clickFirstWrap() {
      // 点击第一个输入框
      this.firstClickStatus = true;
      this.firstWrapStatus = true;
      this.keyBoardStatus = false;
      this.formData.num0 = "";
    },
    selectFirstWord(event) {
      // 选择省份
      if (event.target.localName !== "span") {
        return;
      }
      this.formData.num0 = event.target.innerText;
      this.firstSelectStatus = true;
      this.firstWrapStatus = false;
      this.firstClickStatus = false;
      this.keyBoardStatus = true;
      this.activeKeyWordIndex = 1;
      // this.$refs.num1.focus()
      // document.getElementById('num1').focus()
    },
    clickKeyBoard(item) {
      // 点击自定义键盘
      console.log(item);
      this.formData[`num${this.activeKeyWordIndex}`] = item;
      if (this.formData.commonCard === "1") {
        this.activeKeyWordIndex++;
        if (this.activeKeyWordIndex > 6) {
          this.keyBoardStatus = false;
        }
      } else {
        this.activeKeyWordIndex++;
        if (this.activeKeyWordIndex > 7) {
          this.keyBoardStatus = false;
        }
      }
    },
    deleteWord() {
      // 退格
      console.log(this.activeKeyWordIndex);
      // console.log(this.formData['num' + (this.activeKeyWordIndex - 1)])
      if (this.activeKeyWordIndex > 1) {
        this.formData[`num${this.activeKeyWordIndex - 1}`] = "";
        this.activeKeyWordIndex--;
      } else if (this.activeKeyWordIndex == 1) {
        this.formData["num0"] = "";
        this.activeKeyWordIndex = 0;
        this.firstWrapStatus = true;
        this.keyBoardStatus = false;
      }
    },
    clickKeyWordWrap(activeKeyWordIndex) {
      this.keyBoardStatus = true;
      this.activeKeyWordIndex = activeKeyWordIndex;
      this.formData[`num${this.activeKeyWordIndex}`] = "";
    },
    submitFn() {
      let plateLicense;
      if (this.formData.commonCard == "1") {
        plateLicense = this.plate_license_1;
        plateLicense = this.palindrome(plateLicense);
        if (plateLicense.length < 7) {
          this.$toast("请输入正确的车牌号");
          return;
        }
      }
      if (this.formData.commonCard == "2") {
        plateLicense = this.plate_license_2;
        plateLicense = this.palindrome(plateLicense);
        if (plateLicense.length < 8) {
          this.$toast("请输入正确的车牌号");
          return;
        }
      }
      this.$emit("getPlateLicense", plateLicense);
      console.log(plateLicense);
      // Toast(plateLicense);
    },
    palindrome(str) {
      var arr = str.split("");
      arr = arr.filter(function (val) {
        return (
          val !== " " &&
          val !== "," &&
          val !== "." &&
          val !== "?" &&
          val !== ":" &&
          val !== ";" &&
          val !== "`" &&
          val !== "'" &&
          val !== "_" &&
          val !== "/" &&
          val !== "-" &&
          val !== "\\" &&
          val !== "" &&
          val !== "(" &&
          val !== ")"
        );
      });
      return arr.join("");
    },
    checkIsHasSpecialStr(str) {
      var flag = false;
      var arr = str.split("");
      arr.forEach((val) => {
        if (
          val === "!" ||
          val === "}" ||
          val === "{" ||
          val === "]" ||
          val === "[" ||
          val === "&" ||
          val === "$" ||
          val === "@" ||
          val === " " ||
          val === "," ||
          val === "." ||
          val === "?" ||
          val === ":" ||
          val === ";" ||
          val === "`" ||
          val === "'" ||
          val === "_" ||
          val === "/" ||
          val === "-" ||
          val === "\\" ||
          val === "" ||
          val === "(" ||
          val === ")"
        ) {
          flag = true;
        }
      });
      return flag;
    },
    checkIsHasChineseStr(str) {
      var Reg = /.*[\u4e00-\u9fa5]+.*/;
      if (Reg.test(str)) {
        return true;
      }
      return false;
    },
    changeCarNum() {
      this.formData.commonCard = 2;
    },
  },
  watch: {
    datas: function (datas) {
      if (datas.type == 2) {
        this.formData["commonCard"] = datas.length;
        datas.numArr.forEach((item, index) => {
          this.formData[`num${index}`] = item;
        });

        if (datas.length == 1) {
          this.formData.num7 = "";
        } else {
          this.formData.num7 = datas.numArr[7];
        }
      }
    },
    flag: function (val) {},
  },
  computed: {
    plate_license_1() {
      return (
        this.formData.num0 +
        this.formData.num1 +
        this.formData.num2 +
        this.formData.num3 +
        this.formData.num4 +
        this.formData.num5 +
        this.formData.num6
      );
    },
    plate_license_2() {
      return (
        this.formData.num0 +
        this.formData.num1 +
        this.formData.num2 +
        this.formData.num3 +
        this.formData.num4 +
        this.formData.num5 +
        this.formData.num6 +
        this.formData.num7
      );
    },
  },
};
</script>

<style lang="less" >
@import "~assets/style/toast.css";
.wrap {
  width: 100%;
  .radio-box {
    display: flex;
    justify-content: center;
    margin: 0 0 48px;
    input[type="radio"] {
      display: none;
    }
    label {
      cursor: pointer;
      width: 128px;
      height: 56px;
      line-height: 56px;
      text-align: center;
      border-radius: 32px;
      border: 2px solid rgba(225, 225, 225, 1);
      font-size: 24px;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
    }
    label:first-of-type {
      margin-right: 80px;
    }
    .active {
      border: 2px solid rgba(0, 140, 255, 0.25);
      color: rgba(0, 140, 255, 1);
    }
  }
  // input输入框
  .num-box {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .spot {
      width: 10px;
      height: 10px;
      background: rgba(225, 225, 225, 1);
      border-radius: 50%;
      margin: 0 8px;
    }
    & > div {
      width: 68px;
      height: 88px;
      border-radius: 4px;
      text-align: center;
      border: 2px solid rgba(225, 225, 225, 1);
      margin-right: 8px;

      span {
        display: inline-block;
        line-height: 88px;
        font-size: 36px;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
      }
    }
    & > div:last-of-type {
      margin-right: 0;
    }
    & > .num2 {
      width: 68px;
      height: 88px;
      background: rgba(225, 225, 225, 0.35);
      border-radius: 4px;
      border: 2px solid rgba(225, 225, 225, 1);
      text-align: center;
      font-size: 20px;
      font-weight: 400;
      color: rgba(153, 153, 153, 0.85);
      opacity: 0.45;
    }
    & > .num2 > p:first-of-type {
      margin: 10px 0 8px;
    }
  }
}
.first-word-wrap {
  background-color: #d2d5db;
  padding: 20px 10px 28px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  .first-word {
    display: flex;
    justify-content: space-between;
    .word {
      width: 66px;
      height: 86px;
      line-height: 86px;
      border-radius: 10px;
      text-align: center;
      margin: 0 0 20px;
      box-shadow: 0px 2px 0px 0px rgba(169, 169, 169, 1);
      background: #fff;
      span {
        width: 100%;
        height: 100%;
        display: inline-block;
        font-size: 28px;
      }
      &:active {
        background: rgba(0, 140, 255, 1);
        color: #fff;
      }
    }
    .word1 {
      width: 140px;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 52px;
        height: 36px;
      }
    }
  }
}
.keyboard-wrap {
  background-color: rgba(215, 216, 220, 1);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px 10px 28px;
  .keyboard {
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      text-align: center;
      display: flex;
      width: 66px;
      align-items: center;
      justify-content: center;
      height: 86px;
      margin: 0 0 20px;
      font-size: 28px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 2px 0px 0px rgba(169, 169, 169, 1);
      border-radius: 10px;
      &:active {
        background: rgba(0, 140, 255, 1);
        color: #fff;
      }
    }
    .back {
      width: 102px;
    }
    .delete {
      width: 104px;
      img {
        width: 52px;
        height: 36px;
      }
    }
  }
  .keyboard1 {
    padding: 0 36px;
    box-sizing: border-box;
  }
}
</style>
