import request from '@/utils/request'

const API_PATH = '/admin/process/processType'

export default {
  // バックエンドCRUDのapiを設定
  getPageList(page, limit) {
    return request({
      url: `${API_PATH}/${page}/${limit}`,
      method: 'get'
    })
  },
  getById(id) {
    return request({
      url: `${API_PATH}/get/${id}`,
      method: 'get'
    })
  },
  save(role) {
    return request({
      url: `${API_PATH}/save`,
      method: 'post',
      data: role
    })
  },
  updateById(role) {
    return request({
      url: `${API_PATH}/update`,
      method: 'put',
      data: role
    })
  },
  removeById(id) {
    return request({
      url: `${API_PATH}/remove/${id}`,
      method: 'delete'
    })
  },
  findAll() {
    return request({
      url: `${API_PATH}/findAll`,
      method: 'get'
    })
  }
}
