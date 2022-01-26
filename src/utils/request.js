import axios from 'axios'
import { Notification, MessageBox, Message, Loading } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import errorCode from '@/utils/errorCode'
import { tansParams } from '@/utils/vhr'
import cache from '@/plugins/cache'



let downloadLoadingInstance;
// 是否显示重新登录
let isReloginShow;

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

// 创建 axios 实例
const service = axios.create({
   // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: process.env.VUE_APP_BASE_API, 
  // 超时
  timeout: 5000 
})

// request拦截器
service.interceptors.request.use(config => {
  // 是否不需要设置token，true为不需要，false 为需要，如果不需要token 必须在请求的时候添加headers
  const isNotToken = (config.headers || {}).isToken === false 
  // 是否需要防止数据重复提交
  // 这里默认为都需要防止数据重复提交，所以不需要在axios中设置headers 和 repeatSubmit属性
  const isRepeatSubmit = (config.headers || {}).repeatSubmit === false
  // 让需要 token的 每个请求携带自定义token 请根据实际情况自行修改
  if(getToken() && !isNotToken){
    config.headers['Authorization'] = 'Bearer ' + getToken()
  }

  // get请求映射params参数
  if (config.method === 'get' && config.params) {
    let url = config.url + '?' + tansParams(config.params);
    url = url.slice(0, -1);
    config.params = {};
    config.url = url;
  }
  // 防止重复提交，只有post 和 put 请求才触发
  if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
    const requestObj = {
      url: config.url,
      data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
      time: new Date().getTime()
    }
    const sessionObj = cache.session.getJSON('sessionObj')
    if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
      cache.session.setJSON('sessionObj', requestObj)
    } else {
      const s_url = sessionObj.url;                  // 请求地址
      const s_data = sessionObj.data;                // 请求数据
      const s_time = sessionObj.time;                // 请求时间
      const interval = 1000;                         // 间隔时间(ms)，小于此时间视为重复提交
      if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
        const message = '数据正在处理，请勿重复提交';
        console.warn(`[${s_url}]: ` + message)
        return Promise.reject(new Error(message))
      } else {
        cache.session.setJSON('sessionObj', requestObj)
      }
    }
  }
  return config

}, error =>{
    console.log(error)
    Promise.reject(error)
})

// response 拦截器
service.interceptors.response.use(
  res => {
   // 未设置状态码则默认成功状态
   const code = res.data.code || 200;
   // 获取错误信息
   const msg = errorCode[code] || res.data.msg || errorCode['default']
   // 二进制数据则直接返回
   if(res.request.responseType ===  'blob' || res.request.responseType ===  'arraybuffer'){
     return res.data
   }
   if (code === 401) {
     if (!isReloginShow) {
       console.log('过期了')
       isReloginShow = true;
       MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
         confirmButtonText: '重新登录',
         cancelButtonText: '取消',
         type: 'warning'
       }
     ).then(() => {
       isReloginShow = false;
       store.dispatch('LogOut').then(() => {
         // 如果是登录页面不需要重新加载
         if (window.location.hash.indexOf("#/login") != 0) {
           location.href = '/index';
         }
       })
     }).catch(() => {
       isReloginShow = false;
     });
   }
     return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
   } else if (code === 500) {
     Message({
       message: msg,
       type: 'error'
     })
     return Promise.reject(new Error(msg))
   } else if (code !== 200) {
     Notification.error({
       title: msg
     })
     return Promise.reject('error')
   } else {
     console.log(res.data)
     return res.data
   }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
