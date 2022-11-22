/*
 * @Author: maizi 851620279@qq.com
 * @Date: 2022-10-08 02:20:47
 * @LastEditors: maizi 851620279@qq.com
 * @LastEditTime: 2022-11-20 17:14:09
 * @FilePath: \NGProject\src\utils\get-page-title.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
  import defaultSettings from '@/settings'
*/

const title = '宁国市乡村振兴投资集团有限公司'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
