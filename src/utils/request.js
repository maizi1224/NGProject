import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { encrypt } from '@/utils/rsa'
import { RuYiAdmin } from '@/api/base-api'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (config.headers['Content-Type'] === undefined) {
      config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    }

    const accessToken = sessionStorage.getItem('access-token')
    const refreshToken = sessionStorage.getItem('refresh-token')
    config.headers['Authorization'] = 'Bearer ' + accessToken
    config.headers['RefreshToken'] = refreshToken

    let userToken = getToken()
    if (userToken) {
      const uuid = require('uuid')
      const salt = uuid.v4()

      userToken = encrypt(userToken + '^' + salt)
      sessionStorage.setItem('EncryptUserToken', userToken)
      config.headers['token'] = userToken

      sessionStorage.setItem('ts', salt)
      config.headers['ts'] = salt
    }

    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    if (res.httpStatusCode === 200) {
      return res
    }

    if (response.status === 200) {
      return response
    }

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }

      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    if (error.response && error.response.status === 401) {
      if (error.response.headers.act && error.response.headers.act === 'expired') {
        RuYiAdmin.RefreshToken().then(res => {
          sessionStorage.setItem('access-token', res.object.accessToken)
          sessionStorage.setItem('refresh-token', res.object.refreshToken)
        })
      } else {
        Message({ message: error.response.data, type: 'error', duration: 5 * 1000 })
        return Promise.reject(error)
      }
    } else if (error.response && error.response.status === 400) {
      if (error.response.data.Message) {
        Message({ message: error.response.data.Message, type: 'error', duration: 5 * 1000 })
      }
      return Promise.reject(error)
    } else if (error.response && error.response.status === 429) {
      Message({ message: error.response.data.Message, type: 'error', duration: 5 * 1000 })
      return Promise.reject(error)
    } else {
      console.log('err' + error) // for debug
      Message({ message: error.message, type: 'error', duration: 5 * 1000 })
      return Promise.reject(error)
    }
  }
)

export default service
