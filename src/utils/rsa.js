import JSEncrypt from 'jsencrypt'

const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCDzNqPhq2nk1aIsIK30X7UAHC5jNqVKk12ZxsVEOjPFajV82VuJ7a31uLtU3NWRN4SIzhXmhAiptiDXq04AReV6veh3xdI069xmsIx/EEJNHnL034is6gSVev8p7wJ+qevxdYUGaMVgAV6osYAeQhMTTld emiiriKVAoeezhs5fQIDAQAB'
const privateKey = ''

export function encrypt(data) {

  //new一个对象
  let encrypt = new JSEncrypt()

  //设置公钥
  encrypt.setPublicKey(publicKey)

  let result = encrypt.encrypt(data)

  return result
}

export function decrypt(data) {

  //new一个对象
  let decrypt = new JSEncrypt()

  //设置公钥
  encrypt.setPrivateKey(privateKey)

  let result = decrypt.decrypt(data)

  return result
}
