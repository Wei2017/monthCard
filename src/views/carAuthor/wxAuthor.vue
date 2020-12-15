<template>
  <div class="wxAuthor" v-if="isshow">
    <img :src="logoImg" class="logo" />
    <p class="title">驿停车账号授权</p>
    <p class="tips">驿停车月卡管理办理需要您授权信息</p>
    <button class="authorBtn" @click="authorBtn">授权</button>
  </div>
</template>

<script>
import { getAuthor, getzghUserInfo } from "network/index";
import { Toast } from "vant";
export default {
  name: 'WxAuthor',
  data() {
    return {
      appid: "wxf93d34d4624ff859", //测试公众号appid
      // appid:'wx3290b40f0f472c97',//正式公众号appid
      logoImg: require("assets/img/yitingche-logo@2x.png"),
      city: "",
      isshow: false
    };
  },
  mounted() {
    let that = this,
        { NODE_ENV } = process.env
    console.log(NODE_ENV)
    switch(NODE_ENV) {
      case 'development':
        this.appid = "wxf93d34d4624ff859"; //测试
        break;
      case 'production':   
        this.appid = "wx3290b40f0f472c97"; //正式
        break;
      case 'gray':
        this.appid = "wx3290b40f0f472c97"; //灰度
        break;
    }

    const obj = that.$route.query;
    if (obj.hasOwnProperty("s")) {
      that.isshow = false;
      //智谷汇获取根据code获取用户信息
      that.getzghUserId(obj);
      localStorage.setItem("zghS", obj.s);
    } else {
      localStorage.setItem("zghS", "");
      that.isshow = true;
      let code = that.getQueryVariable("code");
      if (code != "") {
        that.$toast("跳转中");
        let param = {
          code: code
        };
        getAuthor(param)
          .then(res => {
            console.log(res);
            if (res.status == 200) {
              localStorage.setItem("userInfo", JSON.stringify(res.data));
              localStorage.setItem("userId", res.data.userId);
              localStorage.setItem("unionId", res.data.unionId);

              // 通过城市名跳转不同页面
              that.cityJump(that.city)
            } else {
              that.$toast("授权失败");
              window.location.href =
                window.location.origin +
                window.location.pathname +
                window.location.hash;
            }
          })
          .catch(res => {
            //   window.location.href=window.location.origin+window.location.pathname+window.location.hash;
          });
      }
      if (localStorage.getItem("userInfo") != null) {
        // 通过城市名跳转不同页面
        that.cityJump(that.city)
      }
    }

    // 获取用户所在城市
    this.$util.getUserCity(ret => {
      console.log(ret, "cardIndex Line ---> 144");
      let userCity = ret.address.city; //用户所在城市
      this.city = userCity;
      localStorage.setItem("city", userCity);
      console.log(userCity);
    });
  },
  methods: {
    /**
     * 智谷汇App获取用户信息
     */
    getzghUserId(obj) {
      var that = this;
      var params = {
        code: obj.code,
        s: obj.s,
        redirectUri: window.location.href
      };
      getzghUserInfo(params).then(ret => {
        console.log(ret);
        if (ret.status == "200" || ret.status == 200) {
          if (ret.data == null) {
            that.$toast("您还不是注册用户，请到公众号进行注册");
            setTimeout(() => {
              ehopenapi.closeWindow();
            }, 3000);
          } else {
            localStorage.setItem("userInfo", JSON.stringify(ret.data));
            localStorage.setItem("userId", ret.data.registrationId);
            localStorage.setItem("unionId", ret.data.unionId);
            // 通过城市名跳转不同页面
            that.cityJump(that.city)
             // if (that.city == "成都市") {
            //   this.$router.push('/chuanBind')
            //   // window.location.href = window.location.origin + window.location.pathname +"#/chuanBind";
            // } else {
            //   this.$router.push('/mine')
            //   // window.location.href =
            //   // window.location.origin + window.location.pathname + "#/mine";
            // }
          }
        } else {
          this.$toast("授权失败，请重新授权");
          setTimeout(() => {
            ehopenapi.closeWindow();
          }, 2000);
        }
      });
    },
    authorBtn() {
      let href = encodeURIComponent(window.location.href);
      window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.appid}&redirect_uri=${href}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
    },
    getQueryVariable(variable) {
      var query = window.location.search.substring(1);
      var vars = query.split("&");
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
          return pair[1];
        }
      }
      return false;
    },
    cityJump(city) {
      if(city == '成都市'){
        this.$router.push('/chuanBind')
      }else{
        this.$router.push('/mine')
      }
    }
  }
};
</script>

<style>
.wxAuthor {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 80px;
}
.logo {
  height: 204px;
  width: 204px;
  margin-bottom: 126px;
}
.title {
  font-size: 36px;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 36px;
  margin-bottom: 26px;
}
.tips {
  font-size: 24px;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
  line-height: 24px;
}
.authorBtn {
  width: 400px;
  height: 88px;
  background: rgba(0, 140, 255, 1);
  border-radius: 44px;
  border: none;
  color: #fff;
  text-align: center;
  line-height: 88px;
  outline: none;
  margin-top: 80px;
  font-size: 32px;
}
</style>
