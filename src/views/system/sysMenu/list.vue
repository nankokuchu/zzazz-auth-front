<template>
  <div class="app-container">

    <div class="tools-div">
      <el-button type="success" icon="el-icon-plus" size="mini" @click="add()">新 規 追 加</el-button>
    </div>
    <el-table
      :data="sysMenuList"
      style="width: 100%;margin-bottom: 20px;margin-top: 10px;"
      row-key="id"
      border
      :default-expand-all="false"
      :tree-props="{children: 'children'}"
    >

      <el-table-column prop="name" label="メニュ名前" width="160" />
      <el-table-column label="アイコン" width="100">
        <template v-slot="scope">
          <i :class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column prop="perms" label="権限path" width="160" />
      <el-table-column prop="path" label="ルートpath" width="120" />
      <el-table-column prop="component" label="ルートview" width="160" />
      <el-table-column prop="sortValue" label="Order" width="60" />
      <el-table-column label="ステータス" width="100">
        <template v-slot="scope">
          <el-switch v-model="scope.row.status === 1" @change="switchStatus(scope.row)" />
        </template>
        <!--disabled="true"-->
      </el-table-column>
      <el-table-column prop="createTime" label="作成時間" width="160" />
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template v-slot="scope">
          <el-button
            v-if="scope.row.type !== 2"
            type="success"
            icon="el-icon-plus"
            size="mini"
            title="下層メニュー追加"
            @click="add(scope.row)"
          />
          <el-button type="primary" icon="el-icon-edit" size="mini" title="修改" @click="edit(scope.row)" />
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            title="削除"
            :disabled="scope.row.children.length > 0"
            @click="removeDataById(scope.row.id)"
          />
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
      <el-form ref="dataForm" :model="sysMenu" label-width="150px" size="small" style="padding-right: 40px;">
        <el-form-item v-if="sysMenu.id === ''" label="上级部门">
          <el-input v-model="sysMenu.parentName" disabled="true" />
        </el-form-item>
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="sysMenu.type" :disabled="typeDisabled">
            <el-radio :label="0" :disabled="type0Disabled">目录</el-radio>
            <el-radio :label="1" :disabled="type1Disabled">菜单</el-radio>
            <el-radio :label="2" :disabled="type2Disabled">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="sysMenu.name" />
        </el-form-item>
        <el-form-item v-if="sysMenu.type !== 2" label="アイコン" prop="icon">
          <el-select v-model="sysMenu.icon" clearable>
            <el-option v-for="item in iconList" :key="item.class" :label="item.class" :value="item.class">
              <span style="float: left;">
                <i :class="item.class" />  <!-- 如果动态显示图标，这里添加判断 -->
              </span>
              <span style="padding-left: 6px;">{{ item.class }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排列">
          <el-input-number v-model="sysMenu.sortValue" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item prop="path">
          <span slot="label">
            <el-tooltip content="访问的路由地址，如：`sysUser`" placement="top">
              <i class="el-icon-question" />
            </el-tooltip>
            路由地址
          </span>
          <el-input v-model="sysMenu.path" placeholder="请输入路由地址" />
        </el-form-item>
        <el-form-item v-if="sysMenu.type !== 0" prop="component">
          <span slot="label">
            <el-tooltip content="访问的组件路径，如：`system/user/index`，默认在`views`目录下" placement="top">
              <i class="el-icon-question" />
            </el-tooltip>
            组件路径
          </span>
          <el-input v-model="sysMenu.component" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item v-if="sysMenu.type === 2">
          <el-input v-model="sysMenu.perms" placeholder="请输入权限标识" maxlength="100" />
          <span slot="label">
            <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(hasAuthority('bnt.sysRole.list'))" placement="top">
              <i class="el-icon-question" />
            </el-tooltip>
            权限字符
          </span>
        </el-form-item>
        <el-form-item label="状态" prop="type">
          <el-radio-group v-model="sysMenu.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" icon="el-icon-refresh-right" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" icon="el-icon-check" size="small" @click="saveOrUpdate()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/system/menu'

const defaultForm = {
  id: '',
  parentId: '',
  name: '',
  type: 0,
  path: '',
  component: '',
  perms: '',
  icon: '',
  sortValue: 1,
  status: 1
}
export default {
  data() {
    return {
      sysMenuList: [],
      expandKeys: [],
      //
      typeDisabled: false,
      type0Disabled: false,
      type1Disabled: false,
      type2Disabled: false,
      //
      dialogTitle: '',
      dialogVisible: false,
      sysMenu: defaultForm,
      saveBtnDisabled: false,

      iconList: [
        {
          class: 'el-icon-s-tools'
        },
        {
          class: 'el-icon-s-custom'
        },
        {
          class: 'el-icon-setting'
        },
        {
          class: 'el-icon-user-solid'
        },
        {
          class: 'el-icon-s-help'
        },
        {
          class: 'el-icon-phone'
        },
        {
          class: 'el-icon-s-unfold'
        },
        {
          class: 'el-icon-s-operation'
        },
        {
          class: 'el-icon-more-outline'
        },
        {
          class: 'el-icon-s-check'
        },
        {
          class: 'el-icon-tickets'
        },
        {
          class: 'el-icon-s-goods'
        },
        {
          class: 'el-icon-document-remove'
        },
        {
          class: 'el-icon-warning'
        },
        {
          class: 'el-icon-warning-outline'
        },
        {
          class: 'el-icon-question'
        },
        {
          class: 'el-icon-info'
        }
      ]
    }
  },

  // lifeMethod
  created() {
    this.fetchData()
  },

  methods: {
    // データを取得
    fetchData() {
      api.findNodes().then(response => {
        this.sysMenuList = response.data
        // console.log(this.sysMenuList)
      })
    },
    switchStatus(sysMenu) {
      sysMenu.status = sysMenu.status ? 0 : 1
      // 1,更新作業
      api.updateById(sysMenu).then(() => {
        // 2,結果を通知
        this.$message({
          type: 'success',
          message: '更新しました!'
        })
        // 3,ページをリーロドする
        this.fetchData()
      })
    },
    // idから削除
    removeDataById(id) {
      // debugger
      this.$confirm('データを削除しますか?', '確認', {
        confirmButtonText: '確定',
        cancelButtonText: 'キャンセル',
        type: 'warning'
      }).then(() => { // promise
        return api.removeById(id)
      }).then(() => {
        this.fetchData()
        this.$message({
          type: 'success',
          message: '削除成功しました!'
        })
      }).catch(() => {
        this.$message.info('キャンセル')
      })
    },

    // 追加
    add(row) {
      debugger
      this.typeDisabled = false
      this.dialogTitle = '下層メニュー追加'
      this.dialogVisible = true

      this.sysMenu = Object.assign({}, defaultForm)
      this.sysMenu.id = ''
      if (row) {
        this.sysMenu.parentId = row.id
        this.sysMenu.parentName = row.name
        // this.sysMenu.component = 'ParentView'
        if (row.type === 0) {
          this.sysMenu.type = 1
          this.typeDisabled = false
          this.type0Disabled = false
          this.type1Disabled = false
          this.type2Disabled = true
        } else if (row.type === 1) {
          this.sysMenu.type = 2
          this.typeDisabled = true
        }
      } else {
        this.dialogTitle = '添加目录节点'
        this.sysMenu.type = 0
        this.sysMenu.component = 'Layout'
        this.sysMenu.parentId = 0
        this.typeDisabled = true
      }
    },

    // 編集
    edit(row) {
      debugger
      this.dialogTitle = 'メニューを編集'
      this.dialogVisible = true

      this.sysMenu = Object.assign({}, row)
      this.typeDisabled = true
    },

    // 保存OR更新
    saveOrUpdate() {
      if (this.sysMenu.type === 0 && this.sysMenu.parentId !== 0) {
        this.sysMenu.component = 'ParentView'
      }
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.saveBtnDisabled = true // 重複提出を禁止
          if (!this.sysMenu.id) {
            this.save()
          } else {
            this.update()
          }
        }
      })
    },

    // 追加
    save() {
      api.save(this.sysMenu).then(() => {
        this.$message.success('追加成功しました!!!!')
        this.dialogVisible = false
        this.fetchData(this.page)
      })
    },

    // 更新
    update() {
      api.updateById(this.sysMenu).then(() => {
        this.$message.success('更新成功しました!!!!')
        this.dialogVisible = false
        this.fetchData()
      })
    }
  }
}
</script>
