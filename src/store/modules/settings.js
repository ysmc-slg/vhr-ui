import defaultSettings from '@/settings'

const { sideTheme, showSettings, topNav, tagsView, fixedHeader, sidebarLogo, dynamicTitle } = defaultSettings
// 从本地缓存中读取配置
const storageSetting = JSON.parse(localStorage.getItem('layout-setting')) || ''
const state = {
  title: '',
  theme: storageSetting.theme || '#409EFF',
  // 侧边栏主题 深色主题theme-dark，浅色主题theme-light
  sideTheme: storageSetting.sideTheme || sideTheme,
  // 是否点击布局配置 默认 false
  showSettings: showSettings,
  // 是否显示顶部导航 默认false,如果本地有缓存就用缓存的
  topNav: storageSetting.topNav === undefined ? topNav : storageSetting.topNav,
  // 是否显示 tagsView 默认 true
  tagsView: storageSetting.tagsView === undefined ? tagsView : storageSetting.tagsView,
  // 是否固定头部 默认 false
  fixedHeader: storageSetting.fixedHeader === undefined ? fixedHeader : storageSetting.fixedHeader,
  // 是否显示logo 默认true
  sidebarLogo: storageSetting.sidebarLogo === undefined ? sidebarLogo : storageSetting.sidebarLogo,
  // 是否显示动态标题 默认true
  dynamicTitle: storageSetting.dynamicTitle === undefined ? dynamicTitle : storageSetting.dynamicTitle
} 
const mutations = { 
  CHANGE_SETTING: (state, { key, value }) => {  
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  // 修改布局设置
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  },
  // 设置网页标题
  setTitle({ commit }, title) {
    state.title = title
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

