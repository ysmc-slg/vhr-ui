import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    // 用户角色
    roles: [],
    // 权限字符串
    Permissions: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const { username, password, code, uuid } = userInfo
      return new Promise((resolve, reject) => {
        login(username.trim(), password, code, uuid).then(res => {
          // 将token 保存到 cookie
          setToken(res.token)
          commit('SET_TOKEN', res.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          const {user} = res.user
          const avatar = user.avatar == "" ? require("@/assets/images/profile.jpg") : process.env.VUE_APP_BASE_API + user.avatar;
          // 验证返回的 roles 是否是一个非空数组
          if(res.roles && res.roles.length > 0){
            commit('SET_ROLES',res.roles)
            commit('SET_PERMISSIONS',res.permissions)
          } else {
            commit('SET_ROLES','ROLE_DEFAULT')
          }
          commit('SET_NAME', user.userName)
          commit('SET_AVATAR', avatar)
          console.log(res)

          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    Logout({ commit,state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN','')
          commit('SET_ROLES',[])
          commit('SET_PERMISSIONS',[])
          // 删除token
          removeToken() 
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}
export default user

