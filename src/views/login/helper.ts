import router from '@/router'
import { RuleObject } from 'ant-design-vue/lib/form'
import CryptoJS from 'crypto-js'

export const rules = (getUsernameMsg): Record<string, RuleObject[]> => {
  const trigger: ('blur' | 'change')[] = ['change', 'blur']
  return {
    username: [
      {
        required: true,
        message: getUsernameMsg(),
        trigger,
      },
    ],
    password: [
      {
        required: true,
        message: '请输入密码',
        trigger,
      },
    ],
    email: [
      {
        required: true,
        pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
        message: '请输入正确的邮箱',
        trigger,
      },
    ],
    phone: [
      {
        required: true,
        pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
        message: '请输入电话号码',
        trigger,
      },
    ],
  }
}

export const loginAction = (actionParams): void => {
  const { username, token, password, remember } = actionParams
  localStorage.setItem('username', username)
  localStorage.setItem('token', token)
  sessionStorage.setItem('isLogin', 'true')

  if (!remember) {
    localStorage.removeItem('checkCode')
    router.push('/dashBoard')
    return
  }
  localStorage.setItem('checkCode', CryptoJS.AES.encrypt(password, 'checkCode').toString())
  router.push('/dashBoard')
}
