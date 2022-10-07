export function generateQueryItem(field, dataType, queryMethod, value) {
  return { 'Field': field, 'DataType': dataType, 'QueryMethod': queryMethod, 'Value': value }
}
