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
      method: 'get', // httpMethod
      // Parameter
      params: searchObj
    })
  },
  removeRoleById(id) {
    return request({
      // APIのpath
      url: `${API_PATH}/remove/${id}`,
      method: 'delete' // httpMethod
    })
  },
  saveRole(role) {
    return request({
      // APIのpath
      url: `${API_PATH}/save`,
      method: 'post', // httpMethod
      data: role
    })
  },
  getRoleById(id) {
    return request({
      // APIのpath
      url: `${API_PATH}/get/${id}`,
      method: 'get' // httpMethod
    })
  },
  updateRole(role) {
    return request({
      // APIのpath
      url: `${API_PATH}/update`,
      method: 'put', // httpMethod
      data: role
    })
  },
  batchRemove(idList) {
    console.log(idList)
    return request({
      url: `${API_PATH}/batchRemove`,
      method: 'delete', // httpMethod
      data: idList
    })
  },
  // ユーザーIDで、該当するユーザーの全てのロールを取得
  getRolesByUserId(userId) {
    return request({
      url: `${API_PATH}/toAssign/${userId}`,
      method: 'get'
    })
  },
  // ユーザにロールを割り当てる
  assignRoles(assignRoleVo) {
    return request({
      url: `${API_PATH}/doAssign`,
      method: 'post',
      data: assignRoleVo
    })
  }
}
