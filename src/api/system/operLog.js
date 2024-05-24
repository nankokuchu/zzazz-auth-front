import request from '@/utils/request'

// ログイン操作に関すAPI
const API_PATH = '/admin/system/sysOperLog'

export default {
  // データ取得
  getLoginLogList(page, size, searchObj) {
    return request({
      url: `${API_PATH}/${page}/${size}`,
      method: 'get', // httpMethod
      params: searchObj
    })
  }
}
