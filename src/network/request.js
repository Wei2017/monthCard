import axios from 'axios'
import qs from 'qs'

export function reqMethod(url, obj = {}, method = 'POST') {
  // console.log(qs)

  let modeKey = ['post', 'put'].includes(method.toLowerCase()) ? 'data' : 'params'
  let config = {
    url,
    method,
    [modeKey]: obj
  }

  /**
   * 为什么要创建axios的实例？
   *  当我们从axios模块中导入对象时，使用的实例是默认的实例
   *  当给该实例设置一些默认配置时，这些配置就被固定下来了
   *  但是后续开发中，某些配置可能会不太一样
   *  比如某些请求需要使用特定的baseURL或者timeout或者content-Type等
   *  这个时候，我们就可以创建新的实例，并且传入属于该实例的配置信息
   */

  console.log(process.env)
  //1、 创建axios实例
  const instance = axios.create({
    baseURL: process.env.VUE_APP_BASE_URL,
    timeout: 5000,
    transformRequest: data => {
      return qs.stringify(data, { allowDots: true })
    }
  })

  // 2、拦截器
  // 拦截当前axios实例  请求拦截request

  // 2.1请求拦截的作用
  instance.interceptors.request.use(
    config => {
      // const token = '99610ca1255b4fbbad2b7fbb140228da'
      // // const token = userInfo.token || '';
      // // header中携带token
      // config.headers = Object.assign({ token }, config.headers);

      // 待测试
      // if (config.method === 'post') {
      //   // 将对象序列化成URL的形式，以&进行拼接
      //   const str = qs.stringify(config.data);
      //   Object.assign(config, {
      //     ...config,
      //     data: str
      //   });
      // }
      // console.log(config)

      return config;
      // 1、比如config中的一些信息不符合服务器的要求

      // 2、比如每次发送网络请求时，都希望在界面中显示一个请求的loading图标

      // 3、某些网络请求(比如登录(token)),必须携带一些特殊的信息 没有携带则跳转某页面
      // 请求成功
      // console.log(config)
      // return config
    },
    err => Promise.reject(error)
  )

  // 2.2 响应拦截
  instance.interceptors.response.use(res => {
    // 响应成功 拦截
    console.log(res);
    const { data: { data, message, status} } = res;
    
    // 输出res.data中的以下三个属性的值
    // console.log(success,data,returnCode)

    if(status == '200'){
      return res.data
    }

    // alert(res.data['错误信息'])

    return Promise.reject(res.data);
  }, err => {
    // 响应失败 拦截
    console.log(err);
    if (err.response.status === 401) {
      window.top.location = '/login.php';
    }
    alert(`${err.name}：${err.message}`)
    Promise.reject(err);
  })
  // 全局拦截器
  // axios.interceptors
  // console.log(config)

  return instance(config)
}