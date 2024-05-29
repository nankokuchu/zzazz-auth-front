import request from '@/utils/request'

const API_PATH = '/admin/line/menu'

export default {
  findMenuInfo() {
    return request({
      url: `${API_PATH}/findMenuInfo`,
      method: `get`
    })
  },
  getById(id) {
    return request({
      url: `${API_PATH}/getById/${id}`,
      method: `get`
    })
  },
  save(menu) {
    return request({
      url: `${API_PATH}/save`,
      method: `post`,
      data: menu
    })
  },
  updateById(menu) {
    return request({
      url: `${API_PATH}/updateById`,
      method: `put`,
      data: menu
    })
  },
  removeById(id) {
    return request({
      url: `${API_PATH}/removeById/${id}`,
      method: `delete`
    })
  }
}
