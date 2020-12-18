<template>
  <div @click="hidden" v-if="carList.length != 0">
    <ul class="mycar_list">
      <li class="mycar_li" v-for="(item, index) in carList" v-bind:key="index">
        <div class="mycar_li_one">
          <span class="mycar_li_one_cont">{{ item.carLicense }}</span>
          <span class="mycar_li_one_cont_tips" v-if="item.displacementType=='ABOVE_AND_2200'">2.2L及以上排量</span>
        </div>
        <div class="mycar_li_two">
          <div class="mycar_li_two_img" :data-ind="index" @click="show">
            <img
              class="mycar_dot"
              :data-ind="index"
              src="~assets/images/dot@2x.png"
            />
          </div>
          <div class="mycar_li_two_go">
            <span
              class="mycar_li_two_tips_yes"
              v-if="item.vehicleLicenseStatus == 'SUCCESSFUL_REVIEW'"
              >已认证</span
            >
            <span
              class="mycar_li_two_tips_ing"
              v-else-if="item.vehicleLicenseStatus == 'UNDER_REVIEW'"
              >认证中</span
            >
            <span v-else>
              <span class="mycar_li_two_tips_no">未认证</span>
              <span class="mycar_li_two_btn" @click="goList">立即认证</span>
            </span>
          </div>
        </div>
        <div class="mycar_fex" v-show="item.flag">
          <p
            class="mycar_fex_btn"
            @click.stop="change(item.carLicense)"
            v-if="
              item.vehicleLicenseStatus != 'SUCCESSFUL_REVIEW' &&
                item.vehicleLicenseStatus != 'UNDER_REVIEW'
            "
          >
            更正
          </p>
          <p class="mycar_fex_btn" @click.stop="remove(item.carLicense)">
            解绑
          </p>
        </div>
      </li>
    </ul>
    <router-link :to="{path:'/bindPlate'}" class="bind_new_carpai">
      <img src="~assets/img/chepai.png" class="add_carpai_icon" alt="">
    </router-link>
    <dialogs
      :show="shows"
      :obj="obj"
      @closepop="closeTc"
      @affirmBtn="affirms"
    />
  </div>
  <div v-else>
    <img
      class="mycar_img"
      src="~assets/images/car_bg@2x.png"
      alt=""
      srcset=""
    />
    <p class="mycar_tips">您还未绑定任何车辆～</p>
    <p class="mycar_btn" @click="goBind">立即添加</p>
  </div>
</template>

<script>
import { getMineCar, removeMyCars } from "network/index";
import dialogs from "components/dialog.vue";
export default {
  data() {
    return {
      shows: false,
      obj: {},
      num: 1,
      flag: false,
      carList: [],
      carLicense: "",
      userId: '355f51a76a584db181cc669c9d3b4db1',//localStorage.getItem("userId")
    };
  },
  components: {
    dialogs
  },
  created() {
    this.getData();
  },

  mounted() {},
  methods: {
    getData() {
      let _this = this;
      let param = {
        userId: _this.userId
      };
      getMineCar(param).then(res => {
        console.log(res);
        if (res.status == 200) {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].flag = false;
          }
          _this.carList = res.data;
          console.log(_this.carList);
        }else{
          _this.$toast(res.message);
        }
      });
    },
    goList(){
      this.$router.push({ name: "/carAuthor" });
    },
    closeTc() {
      this.shows = false;
    },
    affirms(e) {
      console.log(e);
      let _this = this;
      this.shows = false;
      let param = {
        userId: _this.userId,
        carLicense: this.carLicense
      };
      removeMyCars(param).then(res => {
        console.log(res);
        if (res.status == 200) {
          _this.shows = false;
          _this.getData();
        }else{
          _this.$toast(res.message);
        }
      });
    },
    goBind() {
      this.$router.push({ path: "/bindPlate" });
    },
    show(e) {
      this.carList[Number(e.target.dataset.ind)].flag = true;
      e.stopPropagation();
    },
    hidden() {
      for (let i = 0; i < this.carList.length; i++) {
        this.carList[i].flag = false;
      }
    },
    change(car) {
      this.$router.push({
        path: "/bindPlate",
        query: { car }
      });
    },
    remove(car) {
      this.shows = true;
      this.carLicense = car;
      this.obj = {
        car,
        btn: "我知道了", //单个按钮名称
        btn1: "取消", //双按钮第一个
        btn2: "继续", //双按钮第二个
        type: 2, //控制按钮, 1 单按钮 2 双按钮
        flag: 16 //控制弹窗显示内容
      };
    }
  }
};
</script>

<style>
.mycar_img {
  width: 480px;
  height: 234px;
  display: block;
  margin: 32px auto 50px;
}
.mycar_tips {
  text-align: center;
  font-size: 24px;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
}
.mycar_btn {
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
.mycar_list {
  width: 686px;
  margin: 40px auto;
  box-shadow: 0px 6px 20px 0px rgba(0, 0, 0, 0.05);
}
.mycar_li {
  width: 100%;
  padding: 48px 24px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid rgba(225, 225, 225, 1);
  position: relative;
}
.mycar_li:last-of-type {
  border: 0;
}
.mycar_li_one_cont {
  display: inline-block;
  height: 88px;
  border-radius: 8px;
  border: 2px solid rgba(225, 225, 225, 1);
  border-bottom: 4px solid rgba(225, 225, 225, 1);
  text-align: center;
  line-height: 88px;
  font-size: 32px;
  font-weight: 600;
  color: rgba(51, 51, 51, 1);
  padding: 0 16px 0 64px;
  box-sizing: border-box;
  vertical-align: bottom;
  background: url("~assets/images/car@2x.png") no-repeat 16px 24px;
  background-size: 40px 40px;
}
.mycar_li_one_cont_tips {
  font-size: 24px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  margin-left: 6px;
}
.mycar_dot {
  width: 26px;
  height: 6px;
  vertical-align: top;
}
.mycar_li_two_img {
  text-align: right;
  height: 6px;
  padding: 0 0 10px;
  margin: 0 0 30px;
}
.mycar_li_two_tips_ing {
  width: 84px;
  height: 40px;
  display: inline-block;
  line-height: 40px;
  text-align: center;
  background: rgba(222, 162, 51, 0.1);
  box-shadow: 0px 6px 20px 0px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  font-size: 20px;
  font-weight: 400;
  color: rgba(222, 162, 51, 1);
}
.mycar_li_two_tips_yes {
  width: 84px;
  height: 40px;
  display: inline-block;
  line-height: 40px;
  text-align: center;
  background: rgba(11, 177, 160, 0.1);
  box-shadow: 0px 6px 20px 0px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  font-size: 20px;
  font-weight: 400;
  color: rgba(11, 177, 160, 1);
}
.mycar_li_two_tips_no {
  width: 84px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  display: inline-block;
  background: rgba(255, 87, 101, 0.1);
  box-shadow: 0px 6px 20px 0px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  font-size: 20px;
  font-weight: 400;
  color: rgba(255, 87, 101, 1);
}
.mycar_li_two_btn {
  margin-left: 8px;
  font-size: 24px;
  font-weight: 500;
  color: rgba(0, 140, 255, 1);
  display: inline-block;
  padding-right: 16px;
  background: url("~assets/images/jiantou2@2x.png") no-repeat right
    center;
  background-size: 8px 18px;
}
.mycar_fex {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.mycar_fex_btn {
  width: 104px;
  height: 104px;
  background: rgba(255, 255, 255, 1);
  text-align: center;
  line-height: 104px;
  font-size: 24px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  border-radius: 50%;
}
.bind_new_carpai{
  width: 122px;
  height: 84px;
  position: fixed;
  bottom: 80px;
  right: 0;
}
.add_carpai_icon{
  width: 122px;
  height: 84px;
}
</style>
