import auth from './auth'
import cache from './cache'

export default {
  install(Vue) {
    // 认证对象
    Vue.prototype.$auth = auth
    // 缓存对象
    Vue.prototype.$cache = cache
  }
}
