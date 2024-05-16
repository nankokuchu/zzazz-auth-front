import request from '@/utils/request'

// basePath
const API_PATH = '/admin/system/sysUser'

export default {
  // R->pagination
  getUserList(page, size, searchObj) {
    return request({
      url: `${API_PATH}/${page}/${size}`,
      method: 'get', // httpMethod
      // Parameter
      params: searchObj
    })
  },
  // R->One
  getUserById(id) {
    return request({
      // APIのpath
      url: `${API_PATH}/get/${id}`,
      method: 'get' // httpMethod
    })
  },
  // C
  saveUser(user) {
    return request({
      // APIのpath
      url: `${API_PATH}/save`,
      method: 'post', // httpMethod
      data: user
    })
  },
  // U
  updateUser(user) {
    return request({
      // APIのpath
      url: `${API_PATH}/update`,
      method: 'put', // httpMethod
      data: user
    })
  },
  // D
  removeUserById(id) {
    return request({
      // APIのpath
      url: `${API_PATH}/remove/${id}`,
      method: 'delete' // httpMethod
    })
  }
}
