<template>
  <div>
    <img class="bindPlate_img" src="~assets/images/car_bg@2x.png" alt srcset />
    <p class="bindPlate_tit">绑定车牌</p>
    <plateNumbers @getPlateLicense="getPlateLicense" :istrue="num" :datas="datas" :flag="flag"></plateNumbers>
    <div class="submit-box">
      <button @click="submitFn">确认</button>
    </div>

    <dialogs :show="show" :obj="obj" @closepop="closeTc" @affirmBtn="affirms" v-if="show" />
  </div>
</template>

<script>
import {
  bindMyCars,
  changeMyCars,
  retCard,
  queryOldMonthCardsToShow,
  saveMonthToProductAddCar,
} from "network/index";
import dialogs from "components/dialog.vue";
import { Toast } from "vant";
import plateNumbers from "components/plateNumber";
export default {
  data() {
    return {
      flag: true,
      num: 0,
      numArr: [],
      length: 1,
      oldCar: "",
      datas: {
        type: 1, //1 绑定 2更改
      },
      // 弹框组件
      show: false,
      obj: {
        btn: "确认支付", //单个按钮名称
        btn1: "稍后再说", //双按钮第一个
        btn2: "立即认证", //双按钮第二个
        type: 1, //控制按钮, 1 单按钮 2 双按钮
        flag: -1, //控制弹窗显示内容
      },
      userId: localStorage.getItem("userId"), //'355f51a76a584db181cc669c9d3b4db1',
      licensePlate: "", //用户输入的车牌号
    };
  },
  components: {
    plateNumbers,
    dialogs,
  },
  created() {
    this.oldCar = this.$route.query.car;
    if (this.$route.query.car != "" && this.$route.query.car != undefined) {
      console.log(this.$route.query.car);
      if (this.$route.query.car.length == 7) {
        this.length = 1;
      } else if (this.$route.query.car.length == 8) {
        this.length = 2;
      }
      this.numArr = this.$route.query.car.split("");
      this.datas = {
        type: 2,
        length: this.length,
        numArr: this.numArr,
      };
    }
  },

  mounted() {},
  methods: {
    submitFn() {
      this.num++;
    },
    getPlateLicense(data) {
      console.log("组件传出的data", data);

      let _this = this,
        licensePlate = data, //车牌
        dialogObj = this.obj; //弹框组件对象

      this.licensePlate = data;

      this.$toast.loading({
        type: "loading",
        message: "正在查询您的车辆历史数据",
        duration: 0, //一直loading 数据加载完成后 通过 this.$toast.clear(); 隐藏loading
        overlay: true,
      });

      // phone: this.phoneNum,
      let selectParams = {
        carLicense: licensePlate,
        userId: this.userId,
        // userId: '355f51a76a584db181cc669c9d3b4db1',
      };

      // 绑定车牌
      if (this.datas.type == 1) {
        // 绑定之前查询月卡
        queryOldMonthCardsToShow(selectParams).then((ret) => {
          // 接口请求成功
          if (ret.status == "200") {
            // 有返回月卡列表
            if (ret.data) {
              // 隐藏加载loading
              this.$toast.clear();

              // 显示月卡列表弹框
              dialogObj.cardList = ret.data; //月卡列表
              dialogObj.flag = 19;
              dialogObj.type = 1;
              dialogObj.btn = "立即领取";
              this.show = true;
            } else {
              // 走绑定车牌接口
              bindMyCars(selectParams)
                .then((res) => {
                  console.log(res);
                  if (res.status == "200") {
                    // 绑定成功
                    dialogObj.flag = 2;
                    dialogObj.type = 2; //显示双按钮
                    // 页面数据加载完成后 隐藏loading
                    this.$toast.clear();
                    this.show = true;
                  } else {
                    _this.$toast(res.message);
                  }
                })
                .catch((res) => {
                  _this.$toast("该车牌已被绑定");
                });
            }
          }
          console.log(ret);
        });
      } else {
        // 更正车牌
        let param = {
          userId: _this.userId,
          carLicense: _this.oldCar,
          newCarLicense: licensePlate,
        };
        changeMyCars(param)
          .then((res) => {
            console.log(res);
            if (res.status == "200") {
              _this.$toast("更正成功");
              _this.$router.push({ path: "/myCar" });
            } else {
              _this.$toast(res.message);
            }
          })
          .catch((res) => {
            _this.$toast("该车牌已被绑定");
          });
      }
    },

    // 弹框操作
    closeTc() {
      let _this = this,
        dialogObj = _this.obj;
      this.show = false;
      if(dialogObj.flag == 2){
        _this.$router.push({ path: "/myCar" });
      }
    },
    affirms(e) {
      let _this = this,
        dialogObj = _this.obj;
      // 绑定成功
      if (dialogObj.flag == 2) {
        _this.$router.push({ path: "/carAuthor" });
      }

      // 领取月卡
      if (dialogObj.flag == 19) {
        _this.$toast.loading({
          type: "loading",
          message: "领取中...",
          duration: 0, //一直loading 数据加载完成后 通过 this.$toast.clear(); 隐藏loading
          overlay: true,
        });
        let param = {
          userId: _this.userId,
          carLicense: _this.licensePlate, //车牌号
          phone: e.userPhone,
        };
        

        console.log(param);

        saveMonthToProductAddCar(param)
          .then((ret) => {
            console.log(ret);
            if (ret.status == "200") {
              // 绑定车牌
              return bindMyCars({
                carLicense: param.carLicense,
                userId: _this.userId,
              });
            } else {
              _this.$toast(ret.message);
            }
          })
          .then((ret) => {
            if (ret.status == "200") {
              _this.$toast.clear();
              // 绑定成功
              dialogObj.flag = 18;
              dialogObj.btn = "好的";
              return; //避免直接跳转到mine页面
            } else {
              _this.$toast(ret.message);
            }
          });
      }

      // 月卡领取成功跳转
      if (dialogObj.flag == 18) {
        _this.$router.push({ path: "/mine" });
      }
      console.log(_this.obj);
      console.log(e);
    },
  },
};
</script>

<style scope>
.bindPlate_img {
  width: 480px;
  height: 234px;
  display: block;
  margin: 32px auto;
}
.bindPlate_tit {
  font-size: 36px;
  font-weight: 600;
  color: rgba(51, 51, 51, 1);
  text-align: center;
  margin: 0 0 26px;
}
.submit-box button {
  width: 644px;
  height: 88px;
  line-height: 88px;
  text-align: center;
  background: rgba(0, 140, 255, 1);
  border-radius: 44px;
  font-size: 32px;
  display: block;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  border: 0;
  margin: 48px auto;
}
.van-toast--loading {
  width: auto !important;
}
</style>
