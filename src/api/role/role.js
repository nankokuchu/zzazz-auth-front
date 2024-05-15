import request from '@/utils/request'

// basePath
const API_PATH = '/admin/system/sysRole'

// 全てのroleを取得
export default {
  getPageList(page, size, searchObj) {
    return request({
      // APIのpath
      // url: '/admin/system/sysRole' + page + '/' + size,
      url: `${API_PATH}/${page}/${size}`,
      method: 'get',
      // Parameter
      params: searchObj
    })
  }
}
