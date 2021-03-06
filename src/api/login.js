
import request from '@/utils/request'

// 登录
export function login(username,password,code,uuid) {

  const data = {
    username,
    password,
    code,
    uuid
  }
  return request({
    url: '/login',
    method: 'post',
    headers: {
      isToken: false
    },
    data
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/captchaImage',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/getInfo',
    method: 'get'
  })
}

// 退出系统
export function logout(){
  return request({
    url: '/logout',
    method: 'post'
  })
}