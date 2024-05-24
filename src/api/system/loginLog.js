import request from '@/utils/request'

// ログインログに関すAPI
const API_PATH = '/admin/system/sysLoginLog'

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
