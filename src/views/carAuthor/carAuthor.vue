<template>
  <div class="carAuthor" v-if="pageLoad">
    <!-- 审核未通过的时候显示 -->
    <div class="titleNotTitle" v-if="notPassArr.length > 0">
      <p>
        <img :src="shenHeImg" />审核未通过原因：
      </p>
      <p v-for="(item,index) in notPassArr" :key="index">{{item}}</p>
    </div>
    <!-- 未提交审核和审核通过显示 -->
    <div class="titleTip">
      <p>认证请提供以下资料</p>
      <p>购买包月服务需车主认证，请提供以下资料</p>
    </div>
    <div class="listContainer">
      <ul class="upNeedImg">
        <li class="item" v-for="(item,index) in initSet" :key="index">
          <div class="firstImg">
            <img :src="item.morenSrc" class="upImg" v-if="item.photo == '' || !item.photo" />
            <!--如果有上传的图片  -->
            <img :src="item.photo" class="upImg" v-else @click="lookBigPic(item.photo)" />
          </div>
          <div class="secondTips">
            <p>
              <img :src="passImg" v-if="item.status == 'SUCCESSFUL_REVIEW'" />
              <span>{{item.title}}</span>
            </p>
            <p v-if="item.status == 'SUCCESSFUL_REVIEW'">已通过认证</p>
            <p class="notPassTip" v-else-if="item.option">{{item.option}}</p>
            <p v-else>{{item.subdes}}</p>
          </div>
          <!-- 审核失败和未审核过 -->
          <div
            class="takePhoto"
            v-if="item.status == 'NOT_CERTIFIED' || item.status == 'AUDIT_FAILURE' || !item.status"
          >
            <div style="position:relative">
              <input
                @change="afterRead($event,index)"
                type="file"
                class="upload_file"
                accept="image/*"
              />
              <!-- <van-uploader :after-read="afterRead" :name="index"> -->
              <button class="takePhotoBtn">拍照上传</button>
              <!-- </van-uploader> -->
            </div>
          </div>
          <!-- 审核中 -->
          <img :src="shenHeIng" v-if="item.status == 'UNDER_REVIEW'" class="checkIng" />
          <!-- 审核成功 -->
          <div
            class="lookBigPic"
            @click="lookPicture(index,0)"
            v-if="item.status == 'SUCCESSFUL_REVIEW'"
          >
            <span>查看大图</span>
            <img :src="rightImg" />
          </div>
        </li>
      </ul>
      <p class="carTitle">请上传对应车牌行驶证</p>
      <ul class="upNeedImg">
        <li class="item" v-for="(item,index) in carList" :key="index">
          <div class="firstImg">
            <img
              :src="item.vehicleLicensePhoto"
              class="upImg"
              v-if="item.vehicleLicensePhoto && item.vehicleLicensePhoto !=''"
              @click="lookBigPic(item.vehicleLicensePhoto)"
            />
            <img :src="xsz" class="upImg" v-else />
          </div>
          <div class="secondTips">
            <p>
              <img :src="passImg" v-if="item.vehicleLicenseStatus == 'SUCCESSFUL_REVIEW'" />
              <span>行驶证</span>
            </p>
            <div>
              <span class="carNumber">{{item.carLicense}}</span>
              <span
                @click="selectPai(index)"
                class="selectDisplace"
                v-if="item.vehicleLicenseStatus == 'NOT_CERTIFIED' ||item.vehicleLicenseStatus == 'AUDIT_FAILURE' || !item.vehicleLicenseStatus"
              >
                {{valueArr[index]}}
                <van-icon name="arrow-down" style="margin-left:3px;" />
              </span>
              <span
                v-if="item.vehicleLicenseStatus == 'SUCCESSFUL_REVIEW' || item.vehicleLicenseStatus == 'UNDER_REVIEW'"
                style="color:#999"
              >{{valueArr[index]}}</span>
            </div>
          </div>
          <div
            class="takePhoto"
            v-if="item.vehicleLicenseStatus == 'NOT_CERTIFIED' ||item.vehicleLicenseStatus == 'AUDIT_FAILURE' || !item.vehicleLicenseStatus"
          >
            <van-uploader :after-read="afterReadCar" :name="index">
              <button class="takePhotoBtn">拍照上传</button>
            </van-uploader>
          </div>
          <img :src="shenHeIng" v-if="item.vehicleLicenseStatus == 'UNDER_REVIEW'" class="checkIng" />
          <!-- 审核成功 -->
          <div
            class="lookBigPic"
            @click="lookPicture(index,1)"
            v-if="item.vehicleLicenseStatus == 'SUCCESSFUL_REVIEW'"
          >
            <span>查看大图</span>
            <img :src="rightImg" />
          </div>
        </li>
      </ul>
    </div>
    <van-action-sheet :round="false" v-model="showSelect" cancel-text="取消" close-on-click-action>
      <ul class="selectList">
        <li
          v-for="(item,index) in option"
          :key="index"
          @click="onSelect(item.name)"
          :class="item.className"
          :style="{backgroundImage: 'url(' + (item.className ? selected : '') + ')'}"
        >{{item.name}}</li>
      </ul>
    </van-action-sheet>
    <!-- <van-loading /> <van-loading type="spinner" /> -->
    <div class="handBtn" v-if="showHandBtn">
      <button @click="handleDataBtn">提交认证</button>
    </div>
    <van-loading size="24px" vertical class="center_up_loading" v-if="upLoading">上传中...</van-loading>
    <dialogs :show="showToast" :obj="obj" @closepop="closeTc" @affirmBtn="affirms" />
  </div>
</template>

<script>
import {
  Uploader,
  ActionSheet,
  Icon,
  ImagePreview,
  Loading,
  ContactEdit,
  Toast,
} from "vant";
import * as API from "network/index";
import dialogs from "components/dialog.vue";
export default {
  components: {
    [Uploader.name]: Uploader,
    [ActionSheet.name]: ActionSheet,
    [Icon.name]: Icon,
    [ImagePreview.Component.name]: ImagePreview.Component,
    [Loading.name]: Loading,
    [Toast.name]: Toast,
    dialogs,
  },
  data() {
    return {
      sfzzm: require("assets/img/sfzzm@2x.png"),
      sfzbm: require("assets/img/sfzbm@2x.png"),
      jsz: require("assets/img/jsz@2x.png"),
      xsz: require("assets/img/xsz@2x.png"),
      selected: require("assets/img/carjiantou.png"),
      shenHeImg: require("assets/img/zhuyi@2x.png"),
      shenHeIng: require("assets/img/shenhezhong@2x.png"),
      rightImg: require("assets/img/jiantou2@2x.png"),
      passImg: require("assets/img/tongguo@2x.png"),
      pageLoad: false, //页面加载loading
      showSelect: false,
      whritColor: "#008CFF",
      selectIndex: 0,
      valueArr: [],
      notPassArr: [],
      checkResult: 0, //行驶证认证状态,未认证：NOT_CERTIFIED； 审核中：UNDER_REVIEW； 审核失败：AUDIT_FAILURE；
      option: [
        { name: "请选择排量", className: "selected" },
        { name: "2.2L以下排量", className: "" },
        { name: "2.2L及以上排量", className: "" },
      ],
      initSet: [
        {
          title: "身份证正面",
          subdes: "请上传身份证正面",
          morenSrc: require("assets/img/sfzzm@2x.png"),
          status: "",
          photo: "",
          option: "",
        },
        {
          title: "身份证背面",
          subdes: "请上传身份证背面",
          morenSrc: require("assets/img/sfzbm@2x.png"),
          status: "",
          photo: "",
          option: "",
        },
        {
          title: "驾驶证",
          subdes: "请上传驾驶证照片",
          morenSrc: require("assets/img/jsz@2x.png"),
          status: "",
          photo: "",
          option: "",
        },
      ],
      upLoading: false,
      userId: localStorage.getItem("userId"),
      // userId: "89b989fb92d24c88b4b08fc85144e7ed",
      resultData: "",
      carList: [],
      changeListArr: [], //行驶证修改的数组;
      showToast: false,
      obj: {
        flag: 1,
      },
      showHandBtn: true,
    };
  },

  created() {
    this.$toast.loading({
      type: "loading",
      message: "加载中...",
      duration: 0, //一直loading 数据加载完成后 通过 this.$toast.clear(); 隐藏loading
      overlay: true,
    });

    this.$nextTick(() => {
      //请求认证的状态
      this.getAuthorStatus();
      console.log(this.$data);
    });
  },
  methods: {
    fileChange(e) {
      console.log(e);
    },
    getAuthorStatus() {
      let data = {
        userId: this.userId,
      };
      API.getCertifiedFun(data).then((res) => {
        let data = res.data;
        this.resultData = res.data;
        this.carList = data.carInfoList;
        this.initSet[0].status = data.idCardFrontStatus;
        this.initSet[0].photo = data.idCardFrontPhoto;
        this.initSet[0].option = data.idCardFrontAuditOpinion;
        this.initSet[1].status = data.idCardBackStatus;
        this.initSet[1].photo = data.idCardBackPhoto;
        this.initSet[1].option = data.idCardBackAuditOpinion;
        this.initSet[2].status = data.drivingLicenseStatus;
        this.initSet[2].photo = data.drivingLicensePhoto;
        this.initSet[2].option = data.drivingLicenseAuditOpinion;
        //行驶证认证状态,未认证：NOT_CERTIFIED； 审核中：UNDER_REVIEW； 审核失败：AUDIT_FAILURE；审核成功：SUCCESSFUL_REVIEW
        //标记是否上传过必传的三个证件;
        //记录一下是否全部通过验证;
        let trueArr = [];
        if (data.idCardFrontStatus === "SUCCESSFUL_REVIEW") {
          trueArr.push(true);
        } else {
          trueArr.push(false);
        }
        if (data.idCardBackStatus === "SUCCESSFUL_REVIEW") {
          trueArr.push(true);
        } else {
          trueArr.push(false);
        }
        if (data.drivingLicenseStatus === "SUCCESSFUL_REVIEW") {
          trueArr.push(true);
        } else {
          trueArr.push(false);
        }
        if (data.idCardFrontStatus === "AUDIT_FAILURE")
          this.notPassArr.push(data.idCardFrontAuditOpinion);
        if (data.idCardBackStatus === "AUDIT_FAILURE")
          this.notPassArr.push(data.idCardBackAuditOpinion);
        if (data.drivingLicenseStatus === "AUDIT_FAILURE")
          this.notPassArr.push(data.drivingLicenseAuditOpinion);

        for (let i = 0; i < data.carInfoList.length; i++) {
          if (data.carInfoList[i].vehicleLicenseStatus == "SUCCESSFUL_REVIEW") {
            trueArr.push(true);
          } else {
            trueArr.push(false);
          }
          if (data.carInfoList[i].vehicleLicenseStatus == "AUDIT_FAILURE") {
            this.notPassArr.push(data.carInfoList[i].auditOpinion);
          }
          if (data.carInfoList[i].displacementType == "ABOVE_AND_2200") {
            this.valueArr.push("2.2L及以上排量");
          } else if (data.carInfoList[i].displacementType == "BELOW_OR_2200") {
            this.valueArr.push("2.2L以下排量");
          } else {
            this.valueArr.push("请选择排量");
          }
        }
        console.log(this.valueArr);
        //如果没有其他状态
        if (trueArr.indexOf(false) == -1) {
          this.showHandBtn = false;
        }
        this.pageLoad = true;
        //判断是否有未审核的
      });

      // 页面数据加载完成后 隐藏loading
      this.$toast.clear();
    },
    selectPai(index) {
      //选择排量
      for (let i in this.option) {
        delete this.option[i].className;
        //如果值相等
        if (this.valueArr[index] == this.option[i].name) {
          this.option[i].className = "selected";
        }
      }
      this.selectIndex = index;
      this.showSelect = true;
    },
    onSelect(item) {
      this.valueArr[this.selectIndex] = item;
      this.showSelect = false;
      this.carList[this.selectIndex].displacementType = item;
    },
    lookPicture(index, flag) {
      //查看大图
      let img;
      if (flag == 0) {
        img = this.initSet[index].photo;
      } else if (flag == 1) {
        img = this.carList[index].vehicleLicensePhoto;
      }
      ImagePreview([img]);
    },
    lookBigPic(img) {
      ImagePreview([img]);
    },
    afterReadCar(file, name) {
      //上传和修改行驶证
      if (!file) {
        return;
      }
      this.actionUpLoad(file.file, name.name,2);//准备上传，1 上传默认图片，2，上传驾驶证;
    },
    afterRead(e, index) {
      if (!e.target.files[0]) {
        return;
      }
      this.actionUpLoad(e.target.files[0], index,1);//准备上传，1 上传默认图片，2，上传驾驶证;
    },
    actionUpLoad(fileData, index,flag){
      console.log(fileData)
      let that = this;
      this.upLoading = true;
      if (fileData.size / 1024 > 1025) {
        // 文件大于1M（根据需求更改），进行压缩上传
        this.photoCompress(
          fileData,
          {
            // 调用压缩图片方法
            quality: 0.2,
          },
          function (base64Codes) {
            // console.log("压缩后：" + base.length / 1024 + " " + base);
            let bl = that.base64UrlToBlob(base64Codes);
            // file.append('file', bl, 'file_' + Date.parse(new Date()) + '.jpg') // 文件对象
            that.uploadLice(bl,index,flag); // 请求图片上传接口
          }
        );
      } else {
        // 小于等于1M 原图上传
        this.uploadLice(fileData,index,flag);
      }
    },
    base64UrlToBlob(urlData) {
      let arr = urlData.split(","),
        mime = arr[0].match(/:(.*?);/)[1], // 去掉url的头，并转化为byte
        bstr = atob(arr[1]), // 处理异常,将ascii码小于0的转换为大于0
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      // 转blob
      // return new Blob([u8arr], {type: mime})
      let filename = Date.parse(new Date()) + ".jpg";
      // 转file
      return new File([u8arr], filename, { type: mime });
    },

    photoCompress(file, obj, callback) {
      let that = this;
      let ready = new FileReader();
      /* 开始读取指定File对象中的内容. 读取操作完成时,返回一个URL格式的字符串. */
      ready.readAsDataURL(file);
      ready.onload = function () {
        let re = this.result;
        that.canvasDataURL(re, obj, callback); // 开始压缩
      };
    },
    canvasDataURL(path, obj, callback) {
      let img = new Image();
      img.src = path;
      img.onload = function () {
        let that = this; // 指到img
        // 默认按比例压缩
        let w = that.width,
          h = that.height,
          scale = w / h;
        w = obj.width || w;
        h = obj.height || w / scale;
        let quality = 0.2; // 默认图片质量为0.7
        // 生成canvas
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        // 创建属性节点
        let anw = document.createAttribute("width");
        anw.nodeValue = w;
        let anh = document.createAttribute("height");
        anh.nodeValue = h;
        canvas.setAttributeNode(anw);
        canvas.setAttributeNode(anh);
        ctx.drawImage(that, 0, 0, w, h);
        // 图像质量
        if (obj.quality && obj.quality >= 1 && obj.quality < 0) {
          quality = obj.quality;
        }
        // quality值越小，所绘制出的图像越模糊
        let base64 = canvas.toDataURL("image/jpeg", quality);
        // 回调函数返回base64的值
        callback(base64);
      };
    },
    uploadLice(file,index,flag) {
      console.log(file)
      let formData = new FormData();
      formData.append("file", file);
      API.uploadFileFun(formData).then((res) => {
        this.upLoading = false;
        if(flag == 1){
            this.initSet[index].photo = res.data;
        }else if(flag == 2){
          this.carList[index].vehicleLicensePhoto = res.data;
        }
        
      });      
    },
    handleDataBtn() {
      //如果有正在审核的，禁止提交;
      if (
        this.initSet[0].status == "UNDER_REVIEW" ||
        this.initSet[1].status == "UNDER_REVIEW" ||
        this.initSet[2].status == "UNDER_REVIEW"
      ) {
        Toast("正在审核中");
        return;
      }
      for (let j in this.carList) {
        if (this.carList[j].status == "UNDER_REVIEW") {
          Toast("正在审核中");
          return;
        }
      }
      //提交认证;
      if (
        !this.initSet[0].photo ||
        !this.initSet[1].photo ||
        !this.initSet[2].photo
      ) {
        this.showToast = true;
        this.obj = {
          btn: "我知道了", //单个按钮名称
          type: 1, //控制按钮, 1 单按钮 2 双按钮
          flag: 1, //控制弹窗显示内容
        };
        return;
      }

      for (let i in this.carList) {
        if (this.carList[i].displacementType == "2.2L及以上排量")
          this.carList[i].displacementType = "ABOVE_AND_2200";
        if (this.carList[i].displacementType == "2.2L以下排量")
          this.carList[i].displacementType = "BELOW_OR_2200";
        if (
          this.carList[i].vehicleLicensePhoto &&
          (this.carList[i].displacementType == "请选择排量" ||
            !this.carList[i].displacementType)
        ) {
          Toast("请选择排量");
          return;
        }
        if (
          !this.carList[i].vehicleLicensePhoto &&
          this.carList[i].displacementType != "请选择排量"
        ) {
          this.obj = {
            btn: "我知道了", //单个按钮名称
            type: 1, //控制按钮, 1 单按钮 2 双按钮
            flag: 1, //控制弹窗显示内容
          };
          this.showToast = true;
          return;
        }
      }
      this.showToast = true;
      this.obj = {
        btn: "确认提交", //单个按钮名称
        type: 1, //控制按钮, 1 单按钮 2 双按钮
        flag: 9, //控制弹窗显示内容
      };
    },
    closeTc() {
      this.showToast = false;
    },
    affirms(e) {
      if (this.obj.flag == 1) {
        this.showToast = false;
      } else if (this.obj.flag == 9) {
        this.handleData();
      }
    },
    handleData() {
      let _this = this;
      for (let i in this.carList) {
        if (this.carList[i].displacementType == "请选择排量") {
          this.carList[i].displacementType = "";
        }
      }
      let data = {
        carAttestationVoList: this.carList,
        drivingLicensePhoto: this.initSet[2].photo,
        idCardBackPhoto: this.initSet[1].photo,
        idCardFrontPhoto: this.initSet[0].photo,
        userId: this.userId,
      };
      API.handleCertifyFun(data).then((res) => {
        this.$toast(`提交成功`);
        setTimeout(function () {
          _this.$router.push({
            path: "myCar",
          });
        }, 300);
      });
    },
  },
};
</script>

<style>
.listContainer {
  padding: 0 32px;
}
.carAuthor {
  padding-bottom: 168px;
  margin-bottom: 64px;
}
.titleTip {
  padding: 40px 0 24px 32px;
}
.titleTip p:nth-of-type(1) {
  font-size: 28px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 40px;
  margin-bottom: 8px;
}
.titleTip p:nth-of-type(2) {
  font-size: 24px;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
  line-height: 34px;
}
.titleNotTitle {
  background: rgba(255, 250, 217, 1);
  padding: 24px 48px;
  box-sizing: border-box;
  font-size: 24px;
  font-weight: 400;
  color: rgba(222, 162, 51, 1);
  line-height: 34px;
}
.titleNotTitle p {
  margin-bottom: 4px;
}
.titleNotTitle p:nth-of-type(1) {
  font-size: 28px;
  line-height: 40px;
  margin-bottom: 8px;
}
.titleNotTitle p:nth-of-type(1) img {
  width: 28px;
  height: 28px;
  vertical-align: middle;
  margin-right: 6px;
  margin-top: -3px;
}
.item {
  padding: 32px 24px;
  box-sizing: border-box;
  position: relative;
}
.item > div {
  display: inline-block;
  vertical-align: top;
}
.checkIng {
  position: absolute;
  top: 0;
  right: 24px;
  height: 96px;
  width: 120px;
}
.upNeedImg li:nth-of-type(1) {
  border-bottom: 1px solid rgba(225, 225, 225, 0.45);
}
.upNeedImg li:nth-of-type(2) {
  border-bottom: 1px solid rgba(225, 225, 225, 0.45);
}
.upNeedImg {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 6px 20px 0px rgba(0, 0, 0, 0.05);
  border-radius: 2px;
  margin: 0 auto;
}
.firstImg img {
  width: 140px;
  height: 92px;
}
.firstImg {
  margin-right: 12px;
}
.takePhoto,
.lookBigPic {
  position: absolute;
  top: 50px;
  right: 24px;
}
.lookBigPic span {
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
}
.lookBigPic img {
  width: 12px;
  height: 18px;
  vertical-align: middle;
}
.lookBigPic {
  font-size: 24px;
  font-weight: 500;
  color: rgba(0, 140, 255, 1);
  line-height: 34px;
}
.secondTips {
  margin-top: 6px;
}
.secondTips p:nth-of-type(1) {
  font-size: 28px;
  font-weight: 500;
  color: rgba(34, 34, 34, 1);
  line-height: 40px;
  margin-bottom: 8px;
}
.secondTips p:nth-of-type(1) img {
  width: 32px;
  height: 32px;
  vertical-align: middle;
  margin-right: 8px;
}
.secondTips p:nth-of-type(1) span {
  display: inline-block;
  vertical-align: middle;
}
.secondTips p:nth-of-type(2) {
  font-size: 24px;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
  line-height: 34px;
  width: 288px;
}
.takePhotoBtn,
.upload_file {
  width: 160px;
  height: 56px;
  background: rgba(0, 140, 255, 1);
  border-radius: 44px;
  color: #fff;
  font-size: 24px;
  line-height: 44px;
  text-align: center;
  border: none;
}
.upload_file {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  opacity: 0;
}
.carTitle {
  font-size: 24px;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
  line-height: 34px;
  margin: 64px 0 24px 0;
}
.carNumber {
  font-size: 24px;
  color: #222;
  margin-right: 2px;
}
/* 修改选择框 */
.selectDisplace {
  color: #008cff;
  font-size: 24px;
  font-weight: 400;
  line-height: 34px;
}
.selectList li,
.van-action-sheet__cancel {
  line-height: 60px;
  border-bottom: 1px solid rgba(225, 225, 225, 0.45);
  font-size: 26px;
  color: #333333;
  text-align: center;
}
.selectList li {
  line-height: 104px;
  font-size: 26px;
}
.selectList li.selected {
  color: #008cff;
  background-repeat: no-repeat;
  background-size: 20px 10px;
  background-position: 65% 47px;
}
.secondTips p.notPassTip {
  font-size: 24px;
  font-weight: 400;
  color: rgba(255, 87, 101, 1);
  line-height: 34px;
}
.handBtn {
  height: 168px;
  background: rgba(255, 255, 255, 1);
  border-top: 2px solid rgba(225, 225, 225, 0.45);
  padding: 40px 0;
  box-sizing: border-box;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
}
.handBtn button {
  width: 654px;
  height: 88px;
  background: rgba(0, 140, 255, 1);
  border-radius: 44px;
  display: block;
  margin: 0 auto;
  border: none;
  outline: none;
  color: #fff;
  font-size: 32px;
}
.center_loading {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.center_up_loading {
  position: absolute;
  left: 50%;
  top: 50%;
  bottom: 0;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  padding-top: 70%;
  color: #008cff;
  box-sizing: border-box;
}
.center_up_loading .van-loading__text {
  color: #008cff;
}
.van-toast--loading {
  width: 180px;
  height: 180px;
}
.van-toast--loading .van-loading__spinner--circular {
  width: 60px;
  height: 60px;
}
</style>