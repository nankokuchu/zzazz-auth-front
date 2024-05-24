import request from '@/utils/request'

const API_PATH = '/admin/process'

export default {

  getPageList(page, limit, searchObj) {
    return request({
      url: `${API_PATH}/${page}/${limit}`,
      method: 'get',
      params: searchObj
    })
  }
}
