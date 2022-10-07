import { getToken } from '@/utils/auth'

export function btnPermission(code) {
  const userToken = getToken()
  const codes = sessionStorage.getItem(userToken + '_codes').replace('[', '').replace(']', '').split(',')
  if (codes.includes(code)) {
    return true
  }
  return false
}
