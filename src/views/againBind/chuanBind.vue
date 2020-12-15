<template>
  <div class="chuan-container">
    <!-- <div class="header_info" :style="'background':hearImg"> -->
    <div class="header_info" :style="{backgroundImage: 'url(' + hearImg + ')'}">
      <div class="info_box row">
        <img src="~assets/img/logo@2x.png" class="logo_icon" />
        <span class="header_span">包月用户服务</span>
      </div>
    </div>
    <div class="section_wrap_cb column">
      <div class="section_content">
        <div class="zy_tips">
          <p class="tips_title">重要提示</p>
          <div
            class="tips_content"
          >各位月卡会员，因系统升级，历史线上办理用户数据需重新迁移。若您已办理过月卡，可输入您的手机号和车牌号领取您的历史月卡，查看相关权益及续费操作。</div>
        </div>
        <div class="user_phone">
          <div class="phone_tips">(若您没有预留或忘记手机号，请联系客服处理后在找回)</div>
          <input
            type="phone"
            placeholder="您办理月卡时的手机号码"
            class="phone_input"
            v-model="phoneNum"
            maxlength="11"
          />
        </div>
        <div class="user_brand">
          <div class="brand_tips">(若多个号牌，输入一个即可)</div>
          <!-- <input type="text" placeholder="请输入您的车牌号" class="phone_input" v-model="barndNum" /> -->
          <plateNumbers
            @getPlateLicense="getPlateLicense"
            :istrue="num"
            :datas="datas"
            :flag="flag"
          ></plateNumbers>
        </div>
        <div class="section_bottom column">
          <div class="retrieve_btn" @click="retrieveTap">找回会员卡</div>
          <div class="ret_tips">
            <div class="ret_tips_con">请领取自己的会员卡，若恶意查看他人会员信息，我们将酌情封禁您此微信管理月卡信息。</div>
            <div class="concat_tel">
              云客服电话：
              <a href="tel:400-0400-697" class="tel">400-0400-697</a>
            </div>
          </div>
        </div>
      </div>
      <div class="chuaBind_footer column">
        <div class="chuaBind_footer_tips">我并未在线办理过月卡，点击“我是新用户”进入</div>
        <div class="my_new_user" @click="goMy">我是新用户</div>
      </div>
    </div>

    <template v-if="show">
      <dialogs :show="show" :obj="obj" @closepop="closeTc" @affirmBtn="affirms"></dialogs>
    </template>
  </div>
</template>
<script>
import { retCard, getMyMonthCard } from "network/index";
import plateNumbers from "components/plateNumber";
import dialogs from "components/dialog";
export default {
  name: 'ChuanBind',
  data() {
    return {
      type: 1, //1领取月卡 2 不是老用户 3 没有权限
      flag: false,
      num: 0,
      datas: {
        type: 1, //1 绑定 2更改
      },
      phoneNum: "",
      barndNum: "",
      status: 1,
      show: false,
      obj: {},
      hearImg:require("../../assets/img/bzbg@2x.png"),
      // flag 5 不是老用户 flag 7 您没有该号牌管理权限！ flag 14 查询到的月卡列表
      userId:localStorage.getItem("userId")
    };
  },
  components: {
    dialogs,
    plateNumbers,
  },
  created() {
    this.$nextTick(() => {
      this.$util.userAuthorStatus()
    })
  },

  methods: {
    goMy() {
      this.$router.push({ path: "cardIndex" });
    },
    getPlateLicense(data) {
      console.log("组件传出的data", data);
      let _this = this;
      this.barndNum = data;
      let params = {
        carLicense: this.barndNum,
        phone: this.phoneNum,
        userId: this.userId,
        // userId: '355f51a76a584db181cc669c9d3b4db1',
      };
      retCard(params).then((res) => {
        console.log(res);
        if (res.status == 200) {
          if (res.data) {
            _this.type = 1;
            _this.show = true;
            let respData = res.data,
            isOverdue = false
            for(let item of respData){
              let lDateArr = item.effectiveEndDate.split(' '),
                  dateArr = Number.parseInt(lDateArr[0].replace(/-/g,''))
              console.log(dateArr)
              if(Number.parseInt(item.nowDate) >= dateArr){
                // 包含过期的月卡
                isOverdue = true
                break
              }
            }
            console.log(respData,'120Line')
            _this.obj = {
              btn: "立即领取", //单个按钮名称
              btn1: "取消", //双按钮第一个
              btn2: "继续", //双按钮第二个
              type: 1, //控制按钮, 1 单按钮 2 双按钮
              flag: 14, //控制弹窗显示内容
              cardList: respData,
              isOverdue
            };
          }else{
            this.$toast(`未查询到您的月卡或\n月卡已被其他用户找回!`)
          }
        } else if (res.status == 500) {
          _this.type = 2;
          _this.show = true;
          _this.obj = {
            btn: "好的", //单个按钮名称
            btn1: "取消", //双按钮第一个
            btn2: "继续", //双按钮第二个
            type: 1, //控制按钮, 1 单按钮 2 双按钮
            flag: 5, //控制弹窗显示内容
          };
        } else if (res.status == 0) {
          _this.type = 3;
          _this.show = true;
          _this.obj = {
            btn: "关闭", //单个按钮名称
            btn1: "继续找回", //双按钮第一个
            btn2: "绑定爱车", //双按钮第二个
            type: 1, //控制按钮, 1 单按钮 2 双按钮
            flag: 7, //控制弹窗显示内容
          };
        }
      });
    },
    // 找回会员卡
    retrieveTap() {
      // 验证用户输入手机号
      if (!this.$util.checkPhone(this.phoneNum)) {
        console.log("手机号输入错误");
        this.$toast("手机号输入错误");
        return;
      }
      this.num++;
    },
    closeTc() {
      this.show = false;
    },
    affirms(e) {
      console.log(e);
      if (this.type == 1) {
        let _this = this;
        let params = {
          userId: this.userId,
          // userId: 'd319d6f111bd4bf98646c9e7cdfa08fb',
          carLicense: this.barndNum,
          phone: this.phoneNum,
        };
        getMyMonthCard(params).then((res) => {
          console.log(res);
          if(res.status == 200){
             _this.show = false;
            _this.$router.push({ path: "myMonthCard" });
          }else{
            // _this.show = false;
            _this.$toast(res.message)
          }
         
        });
      } else if (this.type == 3) {
        this.$router.push({ path: "bindPlate" });
      } else {
        this.show = false;
      }
    },
  },
};
</script>
<style scope>
.header_info {
  width: 750px;
  height: 392px;
  background-repeat:no-repeat;
  background-size: 100% 100%;
  align-items: flex-end;
}
.info_box {
  width: 686px;
  justify-content: space-between;
  padding-top: 80px;
  margin: 0 auto;
}
.logo_icon {
  width: 216px;
  height: 54px;
}
.header_span {
  font-size: 32px;
  color: #fff;
}
.section_wrap_cb {
  width: 100%;
  position: absolute;
  top: 160px;
  left: 50%;
  transform: translateX(-50%);
}
.section_content {
  width: 686px;
  box-shadow: 0px 6px 20px 0px rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  background-color: #fff;
  padding: 60px 44px 40px;
  box-sizing: border-box;
  margin-bottom: 48px;
}
.tips_title {
  font-size: 40px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 18px;
}
.tips_content {
  font-size: 28px;
  line-height: 40px;
  color: #555;
  text-indent: 56px;
}
.zy_tips {
  margin-bottom: 64px;
}
.user_phone {
  margin-bottom: 48px;
}
.phone_tips {
  font-size: 24px;
  color: #999;
  margin-bottom: 16px;
}
.phone_input {
  width: 598px;
  font-size: 28px;
  color: #333;
  padding: 20px 0 20px 24px;
  border: 2px solid #e1e1e1;
  box-sizing: border-box;
}
.phone_input::placeholder {
  font-size: 28px;
  color: #bbb;
}
.brand_tips {
  font-size: 24px;
  color: #999;
  margin-bottom: 16px;
}
.user_brand {
  margin-bottom: 64px;
}
/* 找回会员卡 */
.retrieve_btn {
  width: 518px;
  height: 88px;
  line-height: 88px;
  text-align: center;
  font-size: 32px;
  color: #fff;
  border-radius: 44px;
  background-color: #008cff;
  margin-bottom: 24px;
}
.ret_tips {
  width: 528px;
}
.ret_tips_con,
.concat_tel {
  font-size: 24px;
  color: #bbb;
  text-align: center;
  line-height: 34px;
}
.concat_tel .tel {
  color: #008cff;
}
.chuaBind_footer{
  padding-bottom: 40px;
}
.chuaBind_footer_tips {
  font-size: 28px;
  color: #999;
  margin-bottom: 24px;
}
.my_new_user {
  width: 240px;
  height: 72px;
  line-height: 72px;
  text-align: center;
  font-size: 28px;
  color: #008cff;
  border: 2px solid rgba(0, 140, 255, 0.65);
  border-radius: 44px;
}
</style>