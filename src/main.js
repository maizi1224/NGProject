import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import VForm from 'vform-builds' // 引入VForm库
import './styles/element-variables.scss'
// import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖
import 'vform-builds/dist/VFormDesigner.css' // 引入VForm样式

Vue.config.productionTip = false

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import DataV from '@jiaminghi/data-view'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters
import md5 from 'js-md5'
import { JWT_USER_NAME, JWT_PASSWORD } from '@/constants/jwt-constant'
import { QueryMethod } from '@/constants/query-method'
import { DataType } from '@/constants/data-type'
import { OperationType } from '@/constants/operation-type'
import moment from 'moment'
import { MenuType } from '@/constants/menu-type'
import { encrypt, decrypt } from '@/utils/rsa'
import VueParticles from 'vue-particles'
import { MessageType } from '@/constants/message-type'
import { getCode } from '@/utils/code'
import { CellDataType } from '@/constants/cell-data-type'
import { JobStatus } from '@/constants/job-status'
import { RuYiAdmin } from '@/api/base-api'
import { BusinessLanguage } from '@/constants/business-language'
import { DeletionType } from '@/constants/deletion-type'
import { Guid } from '@/constants/guid'
import { DateTime } from '@/constants/date'
import { MessageLevel } from '@/constants/message-level'
import CryptoJS from 'crypto-js'

Vue.use(VueParticles)
Vue.use(DataV)

Vue.prototype.md5 = md5
Vue.prototype.JWT_USER_NAME = JWT_USER_NAME
Vue.prototype.JWT_PASSWORD = JWT_PASSWORD
Vue.prototype.QueryMethod = QueryMethod
Vue.prototype.DataType = DataType
Vue.prototype.OperationType = OperationType
Vue.prototype.$moment = moment
Vue.prototype.MenuType = MenuType
Vue.prototype.rsaEncrypt = encrypt
Vue.prototype.rsaDecrypt = decrypt
Vue.prototype.MessageType = MessageType
Vue.prototype.getCodes = getCode
Vue.prototype.CellDataType = CellDataType
Vue.prototype.JobStatus = JobStatus
Vue.prototype.RuYiAdmin = RuYiAdmin
Vue.prototype.BusinessLanguage = BusinessLanguage
Vue.prototype.DeletionType = DeletionType
Vue.prototype.Guid = Guid
Vue.prototype.DateTime = DateTime
Vue.prototype.MessageLevel = MessageLevel
Vue.prototype.CryptoJS = CryptoJS

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

Vue.use(Element, {
  size: Cookies.get('size') || 'medium'//, // set element-ui default size
  // locale: enLang // 如果使用中文，无需设置，请删除
})

Vue.use(VForm) // 全局注册VForm(同时注册了v-form-designer和v-form-render组件)

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
