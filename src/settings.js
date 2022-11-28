/*
 * @Author: maizi 851620279@qq.com
 * @Date: 2022-10-08 02:20:47
 * @LastEditors: maizi 851620279@qq.com
 * @LastEditTime: 2022-11-27 23:58:43
 * @FilePath: \NGProject\src\settings.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
module.exports = {
  title: '宁国市乡村振兴投资集团有限公司',

  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showSettings: true,

  /**
   * @type {boolean} true | false
   * @description Whether need tagsView
   */
  tagsView: true,

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: false,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: false,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production',

  /**
   * apiBaseUrl: 'http://127.0.0.1:5000'
   */
  apiBaseUrl: 'http://localhost:5000'
}
