import { RuYiAdmin } from '@/api/base-api'

export function getCode(code) {
  const url = 'CodeTableManagement/GetChildrenByCode/' + code
  return RuYiAdmin.Get(url, null)
}
