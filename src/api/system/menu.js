import request from '@/utils/request'

// メニューに関するAPI
const API_PATH = '/admin/system/sysMenu'

export default {
  // 全てのメニュー取得
  findNodes() {
    return request({
      url: `${API_PATH}/getMenu`,
      method: 'get'
    })
  },

  // 削除
  removeById(id) {
    return request({
      url: `${API_PATH}/removeMenu/${id}`,
      method: 'delete'
    })
  },

  // 保存
  save(sysMenu) {
    return request({
      url: `${API_PATH}/saveMenu`,
      method: 'post',
      data: sysMenu
    })
  },

  // 更新
  updateById(sysMenu) {
    return request({
      url: `${API_PATH}/updateMenu`,
      method: 'put',
      data: sysMenu
    })
  },
  toAssign(roleId) {
    return request({
      url: `${API_PATH}/toAssign/${roleId}`,
      method: 'get'
    })
  },
  doAssign(assignMenuVo) {
    return request({
      url: `${API_PATH}/doAssign`,
      method: 'post',
      data: assignMenuVo
    })
  }
}
