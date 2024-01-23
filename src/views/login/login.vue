<template>
    <div class="login-page">
      <div class="login-page-lf">
        <div class="login-page-lf-body animate__animated animate__fadeInLeft">
          <div>企业级后台管理系统</div>
        </div>
      </div>
      <div class="login-page-rg">
        <div class="login-page-rg-body animate__animated animate__fadeInUp">
          <div class="login-page-rg-body-tile">欢迎登陆</div>
          <div class="login-page-rg-body-form">
            <Form :model="formState" :rules="rules(getUsernameMsg)" name="basic" autocomplete="off" @finish="onFinish">
              <FormItem name="username" class="margin-bottom-20">
                <Input
                  v-model:value="formState.username"
                  class="login-input"
                  allow-clear
                  :placeholder="getUsernameMsg()"
                />
              </FormItem>
              <FormItem v-if="!state.isForget" name="password" class="margin-bottom-20">
                <InputPassword
                  v-model:value="formState.password"
                  class="login-input"
                  type="password"
                  allow-clear
                  placeholder="请输入密码"
                />
              </FormItem>
  
              <FormItem v-if="state.isRegister || state.isForget" name="email" class="margin-bottom-20">
                <Input
                  v-model:value="formState.email"
                  class="login-input"
                  allow-clear
                  :placeholder="state.isForget ? '请输入注册邮箱' : '请输入邮箱'"
                />
              </FormItem>
  
              <FormItem v-if="state.isRegister" name="phone" class="margin-bottom-20">
                <Input v-model:value="formState.phone" class="login-input" allow-clear placeholder="请输入电话" />
              </FormItem>
  
              <div v-if="!state.isRegister && !state.isForget" class="login-page-rg-body-form-other">
                <!-- 功能未真正实现，历史遗留 -->
                <Checkbox v-model:checked="formState.remember">记住我</Checkbox>
                <!-- 逻辑有问题，暂时不开放 -->
                <Tooltip placement="top">
                  <template #title>
                    <span>功能暂未开放</span>
                  </template>
                  <a @click="forgetPassword">忘记密码</a>
                </Tooltip>
              </div>
              <Button class="form-btn" type="primary" html-type="submit" :loading="state.loading" style="width: 100%">
                {{ getButton() }}
              </Button>
              <div v-if="!state.isRegister && !state.isForget" class="form-register">
                没有账号？
                <a @click="goRegister">立即创建你的账号。</a>
              </div>
              <div v-else class="form-register">
                <a @click="goLogin">去登陆</a>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { onMounted, reactive } from 'vue'
  import { Login, Register } from '@/api/user/user'
  import { RES_CODE, Res } from '@/type'
  import { Form, FormItem, Input, InputPassword, Checkbox, Button, Tooltip } from 'ant-design-vue'
  import CryptoJS from 'crypto-js'
  import { loginAction, rules } from './helper'
  
  interface FormState {
    username: string
    password: string
    phone: string
    email: string
    remember: boolean
  }
  interface MyState {
    loading: boolean
    isRegister: boolean
    isForget: boolean
  }
  const formState = reactive<FormState>({
    username: '',
    password: '',
    remember: false,
    phone: '',
    email: '',
  })
  const state = reactive<MyState>({
    loading: false,
    isRegister: false,
    isForget: false,
  })
  
  const getUsernameMsg = (): string => {
    return state.isForget ? '请输入注册账号' : '请输入账号'
  }
  
  onMounted(() => {
    initAccount()
  })
  
  const initAccount = (): void => {
    const username = localStorage.getItem('username') || ''
    let password = localStorage.getItem('checkCode')
    if (username) formState.username = username
    if (!password) return
    password = CryptoJS.AES.decrypt(password, 'checkCode').toString(CryptoJS.enc.Utf8)
    formState.password = password || ''
    formState.remember = true
  }
  
  const onFinish = (values): void => {
    if (state.isRegister) {
      onRegister(values)
      return
    }
    onLogin(values)
  }
  
  const onLogin = async (values: FormState): Promise<void> => {
    try {
      const { password, remember } = values
      const params = {
        username: values.username,
        password: values.password,
        remember: values.remember,
      }
      // console.log('onLogin', params)
      state.loading = true
      const res = await Login(params)
      state.loading = false
      const { data, status } = res || {}
      if (status !== RES_CODE.SUCCESS) return
      const actionParams = {
        ...data,
        password,
        remember,
        formState,
      }
      loginAction(actionParams)
    } catch (error) {
      state.loading = false
      console.error('onLogin->', error)
    }
  }
  
  const onRegister = async (values: FormState): Promise<void> => {
    try {
      const { username, password, phone, email, remember } = values
      const params = {
        username,
        password,
        phone,
        email,
        remember,
      }
      console.log('onRegister', values, params)
      state.loading = true
      const res = (await Register(values)) as unknown as Res<boolean>
      state.loading = false
      const { status } = res || {}
      if (status !== RES_CODE.SUCCESS) return
      formState.email = ''
      formState.phone = ''
      state.isRegister = false
      state.isForget = false
    } catch (error) {
      console.error('onRegister->', error)
    }
  }
  
  // const resetPassword = async (values: FormState): Promise<void> => {
  //   try {
  //     const { username, email } = values
  //     const params = {
  //       username,
  //       email,
  //     }
  //     console.log('resetPassword', values, params)
  //     // const res = (await resetPwd(params)) as unknown as Res<boolean>
  //     //   const { status } = res || {}
  //     //   if (status !== RES_CODE.SUCCESS) return
  //     //   state.isRegister = false
  //   } catch (error) {
  //     console.error('resetPassword->', error)
  //   }
  // }
  
  const goRegister = () => {
    // router.push('/register')
    state.isRegister = true
  }
  
  const getButton = (): string => {
    if (state.isRegister) return '注册'
    if (state.isForget) return '重置密码'
    return '登录'
  }
  
  const goLogin = (): void => {
    state.isRegister = false
    state.isForget = false
  }
  
  const forgetPassword = (): void => {
    console.log('forgetPassword')
    // state.isForget = true
    // state.isRegister = false
  }
  </script>
  <style lang="less" scoped>
  @import './index.less';
  </style>
  