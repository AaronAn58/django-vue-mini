import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'
// import { AxiosPromise } from 'axios';

/**
 * 封装get请求
 * @param {string} url 请求连接
 * @param {Object} params 请求参数
 * @param {Object} header 请求需要设置的header头
 */
export const get = (url: string, params: object, header: { charset: string }): AxiosPromise<unknown> => {
  return request({
    url,
    method: 'get',
    params,
    headers: header,
  })
}

/**
 * 封装post请求
 * @param {string} url 请求连接
 * @param {Object} params 请求参数
 * @param {Object} header 请求的header头
 */
export const post = (
  url: string,
  params: object,
  header: { charset: string; 'Content-Type': string },
  timeout = 10000
) => {
  return request({
    url,
    method: 'post',
    timeout,
    data: params,
    headers: header,
  })
}

/**
 * 封装put请求
 * @param {string} url 请求连接
 * @param {Object} params 请求参数
 * @param {Object} header 请求设置的header头
 */
export const put = (url: string, params: object, header: { any }, timeout = 5000) => {
  return request({
    url,
    method: 'put',
    timeout,
    data: params,
    headers: header,
  })
}

/**
 * 封装delete请求
 * @param {string} url 请求连接
 * @param {Object} params 请求参数
 * @param {Object} header 请求设置的header头
 */
export const del = (url: string, params: object, header: { any }, timeout = 5000) => {
  return request({
    url,
    method: 'delete',
    data: params,
    timeout,
    headers: header,
  })
}

export const defaultGetConfig = {
  charset: 'utf-8',
}

export const defaultPostConfig = {
  ...defaultGetConfig,
  'Content-Type': 'application/json',
}
