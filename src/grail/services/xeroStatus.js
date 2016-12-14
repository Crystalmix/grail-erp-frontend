/* @flow */
/* eslint no-param-reassign: 0 */

type TokenInfo = null | {|
  expires_at: string,
  now: string,
  lifetime: string,
|}

export default (api: any) => {
  class XeroStatus {
    isXeroExpired: boolean = false
    xeroTokenInfo: TokenInfo = null

    async checkXeroStatus() {
      const res = await api.getXeroToken()
      this.xeroTokenInfo = res.data
      this.isXeroExpired = this.xeroTokenInfo.lifetime <= 300
    }
  }

  return new XeroStatus()
}
