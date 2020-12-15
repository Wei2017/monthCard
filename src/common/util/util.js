// import Vue from 'vue'
// import Router from 'vue-router'
import router from '../../router'
import axios from "axios";
// Vue.use(Router)
// const originalPush = Router.prototype.push
// Router.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }
export default {
  // 正则验证手机号
  checkPhone(phone) {
    if (!(/^1[3456789]\d{9}$/.test(phone))) {
      return false;
    }
    return true
  },

  // 未获取到用户id 跳转授权页
  userAuthorStatus() {
    let userId = localStorage.getItem('userId')
    if (!userId) {
      router.push("/wxAuthor");
      return false
    }
    return true
  },

  // 获取用户所在城市
  getUserCity(callBack) {
    var geolocation = new window.BMap.Geolocation();
    var gc = new window.BMap.Geocoder();
    geolocation.getCurrentPosition((a) => {
      var pt = a.point;
      gc.getLocation(pt, function (rs) {
        console.log(rs, 'common Link ---> 32');
      });
      callBack(a)
    });
  },
  /**
   * 两个数组之间 进行匹配
   * @param {Array} arr1  
   * @param {Array} arr2 
   * @return {Array} 返回不相等的数组
   */
  getArrDifference(arr1, arr2) {
    return arr1.concat(arr2).filter(function (v, i, arr) {
      return arr.indexOf(v) === arr.lastIndexOf(v);
    })
  },



  ajax(option) {
    var Method = option.method || "GET"
    var data = option.data || {} // {pageNum:1, pageSize:10}
    var url = axios.defaults.baseURL + option.url   // http://localhost:3000/api/film/getList
    var type = option.type || 'json'

    if (Method == 'GET') {
      var str = "?"
      for (var key in data) {
        str += key + "=" + data[key] + "&" // pageNum=1pageSize=10
      }
      // 切除掉最后一个 & 
      str = str.slice(0, str.length - 1)
      url += str
    }
    // 将参数拼接到URL上
    console.log(url)
    // 1.创建ajax对象
    var xhr = new XMLHttpRequest()
    // 2.建立连接
    xhr.open(Method, url, true)
    if (type == 'json') {
      xhr.setRequestHeader(
        "Content-type",
        "application/json;charset=UTF-8"
      );
    }

    // 3.发送请求
    xhr.send(data)
    // 4.监听数据回来
    xhr.onreadystatechange = function () {
      // xhr.readyState === 4 意味这服务器返回数据
      // xhr.status == 200 服务器返回正确的数据
      if (xhr.readyState === 4 && xhr.status == 200) {

        var res = JSON.parse(xhr.responseText)
        option.success(res)
      }
    }
  },
  //日期格式化
  formatDate(date,format){
    var o = {
      "M+": date.getMonth() + 1, // month
      "d+": date.getDate(), // day
      "h+": date.getHours(), // hour
      "m+": date.getMinutes(), // minute
      "s+": date.getSeconds(), // second
      "q+": Math.floor((date.getMonth() + 3) / 3), // quarter
      // millisecond
    }

    if (/(y+)/.test(format))
      format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    return format;
  }
}