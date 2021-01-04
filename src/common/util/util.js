import router from '../../router'
import axios from "axios";

  /**
 * 2020.12.31 杜晓伟
 * 函数节流
 * @param {*} fn 
 * @param {*} gapTime 
 */
export const throttle = (fn, gapTime = 1000) => {
  let _lastTime = null

  // 返回新的函数
  return function () {
    let _nowTime = +new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments) //将this和参数传给原函数
      _lastTime = _nowTime
    }
  }
}
 
  // 正则验证手机号
export const checkPhone = phone => {
    if (!(/^1[3456789]\d{9}$/.test(phone))) {
      return false;
    }
    return true
  }

  // 未获取到用户id 跳转授权页
export const userAuthorStatus = () => {
    let userId = localStorage.getItem('userId')
    if (!userId) {
      router.push("/wxAuthor");
      return false
    }
    return true
  }

  // 获取用户所在城市
export const getUserCity = (callBack) => {
    var geolocation = new window.BMap.Geolocation();
    var gc = new window.BMap.Geocoder();
    geolocation.getCurrentPosition((a) => {
      var pt = a.point;
      gc.getLocation(pt, function (rs) {
        console.log(rs, 'common Link ---> 32');
      });
      callBack(a)
    });
  }
  /**
   * 两个数组之间 进行匹配
   * @param {Array} arr1  
   * @param {Array} arr2 
   * @return {Array} 返回不相等的数组
   */
export const getArrDifference = (arr1, arr2) => {
    return arr1.concat(arr2).filter(function (v, i, arr) {
      return arr.indexOf(v) === arr.lastIndexOf(v);
    })
  }



export const ajax = (option) => {
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
  }
  //日期格式化
export const formatDate = (date, format) => {
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

  // 设置页面背景
  export const setBg = (bg) => {
    window.document.body.style.backgroundColor = bg;
  }

  // 离开页面清除背景
  export const removeBg = () => {
    window.document.body.style.backgroundColor = "";
  }