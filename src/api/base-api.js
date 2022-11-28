import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import { encrypt } from '@/utils/rsa'

export const RuYiAdmin = {
  PostData: function(url, param) {
    return request({
      url: url,
      method: 'post',
      data: param
    })
  },
  GetList: function(url, param) {
    return request({
      url: url,
      method: 'post',
      data: param
    })
  },
  GetEntity: function(url, param) {
    return request({
      url: url + param,
      method: 'get'
    })
  },
  AddEntity: function(url, param) {
    return request({
      url: url,
      method: 'post',
      data: param
    })
  },
  EditEntity: function(url, param) {
    return request({
      url: url,
      method: 'put',
      data: param
    })
  },
  DeleteEntity: function(url, param) {
    return request({
      url: url + param,
      method: 'get'
    })
  },
  DeleteEntities: function(url, param) {
    return request({
      url: url + param,
      method: 'post'
    })
  },
  DownloadFile: function(url, param) {
    return request({
      url: url + param,
      method: 'get',
      responseType: 'blob'
    })
  },
  Post: function(url, param) {
    return request({
      url: url,
      method: 'post',
      data: param
    })
  },
  Get: function(url, param) {
    return request({
      url: url,
      method: 'get',
      param: param
    })
  },
  GetSalt: function(param) {
    return request({
      url: 'JwtSecurityAuthentication/Get',
      method: 'get',
      params: param
    })
  },
  GetJwtToken: function(data) {
    return request({
      url: 'JwtSecurityAuthentication/Post',
      method: 'post',
      data: data
    })
  },
  RefreshToken: function() {
    return request({
      url: 'JwtSecurityAuthentication/RefreshToken',
      method: 'get'
    })
  },
  GetCaptcha: function() {
    return request({
      url: 'NGAdminCaptcha/GetCaptcha',
      method: 'get'
    })
  },
  Login: function(data) {
    return request({
      url: 'UserManagement/Logon',
      method: 'post',
      data: data
    })
  },
  Logout: function(token) {
    request({
      url: 'UserManagement/Logout/' + token,
      method: 'get'
    })
    return request({
      url: '/vue-element-admin/user/logout',
      method: 'post'
    })
  },
  RefreshLocalToken: function() {
    let userToken = getToken()
    if (userToken) {
      const uuid = require('uuid')
      const salt = uuid.v4()
      userToken = encrypt(userToken + '^' + salt)
      sessionStorage.setItem('EncryptUserToken', userToken)
      sessionStorage.setItem('ts', salt)
    }
  }
}

