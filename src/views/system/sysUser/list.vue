<template>
  <div class="app-container">
    <div class="search-div">
      <el-form label-width="100px" size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="キーワード">
              <el-input v-model="searchObj.keyword" style="width: 95%" placeholder="ユーザー名/名前/電話番号" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="操作時間">
              <el-date-picker
                v-model="createTimes"
                type="datetimerange"
                range-separator="~"
                start-placeholder="START-TIME"
                end-placeholder="END-TIME"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="margin-right: 10px;width: 100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display:flex">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="fetchData()">検索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetData">リセット</el-button>
        </el-row>
      </el-form>
    </div>
    <!--検索エリアーEND-->
    <div class="tools-div">
      <el-button
        type="success"
        icon="el-icon-plus"
        size="mini"
        :disabled="!$hasBP('bnt.sysUser.add')"
        @click="add"
      >追 加
      </el-button>
    </div>
    <!--検索エリアーEND-->
    <el-table
      v-loading="listLoading"
      :data="list"
      stripe
      border
      style="width: 100%;margin-top: 10px;"
    >

      <el-table-column
        label="番号"
        width="70"
        align="center"
      >
        <template v-slot="scope">
          {{ (page - 1) * size + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="username" label="ユーザー名" width="180" />
      <el-table-column prop="name" label="名前" width="200" />
      <el-table-column prop="phone" label="電話番号" width="150" />
      <el-table-column label="ステータス" width="100">
        <template v-slot="scope">
          <el-switch
            v-model="scope.row.status === 1"
            :disabled="$hasBP('bnt.sysUser.switchStatus')"
            @change="switchStatus(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="作成時間" />

      <el-table-column label="操作" align="center" fixed="right">
        <template v-slot="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            title="編集"
            :disabled="$hasBP('bnt.sysUser.edit')"
            @click="editUser(scope.row.id)"
          />
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            title="削除"
            :disabled="$hasBP('bnt.sysUser.remove')"
            @click="removeDataById(scope.row.id)"
          />
          <el-button
            type="warning"
            icon="el-icon-baseball"
            size="mini"
            title="ロール設定"
            :disabled="$hasBP('bnt.sysUser.showAssignRole')"
            @click="showAssignRole(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <!--メインテーブルEND-->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="size"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="fetchData"
    />
    <!--ページネーションEND-->

    <el-dialog title="追加/更新" :visible.sync="dialogVisible" width="40%">
      <el-form ref="dataForm" :model="sysUser" label-width="100px" size="small" style="padding-right: 40px;">
        <el-form-item label="ユーザー名" prop="username">
          <el-input v-model="sysUser.username" />
        </el-form-item>
        <el-form-item v-if="!sysUser.id" label="パースワード" prop="password">
          <el-input v-model="sysUser.password" type="password" />
        </el-form-item>
        <el-form-item label="名前" prop="name">
          <el-input v-model="sysUser.name" />
        </el-form-item>
        <el-form-item label="電話番号" prop="phone">
          <el-input v-model="sysUser.phone" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" icon="el-icon-refresh-right" @click="dialogVisible = false">キャンセル</el-button>
        <el-button type="primary" icon="el-icon-check" size="small" @click="saveOrUpdateUser()">保 存</el-button>
      </span>
    </el-dialog>
    <!--追加・更新ダイアローグEND-->

    <el-dialog title="ロール設定" :visible.sync="dialogRoleVisible">
      <el-form label-width="100px">
        <el-form-item label="ユーザー名">
          <el-input disabled :value="sysUser.username" />
        </el-form-item>

        <el-form-item label="ロール名">
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全て
          </el-checkbox>
          <div style="margin: 15px 0;" />
          <el-checkbox-group v-model="userRoleIds" @change="handleCheckedChange">
            <el-checkbox v-for="role in allRoles" :key="role.id" :label="role.id">{{ role.roleName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="small" @click="dialogRoleVisible = false">キャンセル</el-button>
        <el-button type="primary" size="small" @click="assignRole">保 存</el-button>
      </div>
    </el-dialog>
    <!--ロール設定ダイアローグEND-->
  </div>
</template>
<script>
import api from '@/api/system/user'
import roleApi from '@/api/system/role'

const defaultForm = {
  id: '',
  username: '',
  password: '',
  name: '',
  phone: '',
  status: 1
}
export default {
  data() {
    return {
      listLoading: true,
      list: [],
      total: 0,
      page: 1,
      size: 10,
      searchObj: {},

      createTimes: [],

      dialogVisible: false,
      sysUser: defaultForm,
      saveBtnDisabled: false,

      dialogRoleVisible: false,
      allRoles: [],
      userRoleIds: [],
      isIndeterminate: false,
      checkAll: false
    }
  },
  // lifeMethod
  created() {
    this.fetchData()
  },

  // lifeMethod
  mounted() {
    console.log('.......')
  },

  methods: {
    fetchData(pageNum = 1) {
      this.page = pageNum
      // ajaxリクエスト
      api.getUserList(this.page, this.size, this.searchObj)
        .then(res => {
          this.listLoading = false
          this.list = res.data.records
          this.total = res.data.total
        })
    },
    resetData() {
      this.searchObj = {}
      this.fetchData()
    },
    add() {
      this.sysUser = {}
      this.dialogVisible = true
    },
    removeDataById(id) {
      this.$confirm('データを削除しますか?', '確認', {
        confirmButtonText: '確定',
        cancelButtonText: 'キャンセル',
        type: 'warning'
      }).then(() => {
        api.removeUserById(id)
          .then(() => {
            this.$message({
              type: 'success',
              message: '削除成功しました!'
            })
            this.fetchData()
          })
      })
    },
    editUser(id) {
      api.getUserById(id).then(res => {
        this.sysUser = res.data
        this.dialogVisible = true
      })
    },
    saveOrUpdateUser() {
      if (!this.sysUser.id) {
        this.saveUser(this.sysUser)
      } else {
        this.updateUser(this.sysUser)
      }
    },
    saveUser(sysUser) {
      // 1,保存作業
      api.saveUser(sysUser).then(() => {
        // 2,結果を表示
        this.$message({
          type: 'success',
          message: '新規追加しました!'
        })
        // 3,ダイアローグ閉じる
        this.dialogVisible = false
        // 4,ページをリーロドする
        this.fetchData()
      })
    },
    updateUser(sysUser) {
      // 1,更新作業
      api.updateUser(sysUser).then(() => {
        // 2,結果を表示
        this.$message({
          type: 'success',
          message: '更新しました!'
        })
        // 3,ダイアローグ閉じる
        this.dialogVisible = false
        // 4,ページをリーロドする
        this.fetchData()
      })
    },
    switchStatus(sysUser) {
      sysUser.status = sysUser.status ? 0 : 1
      // 1,更新作業
      api.updateUser(sysUser).then(() => {
        // 2,結果を通知
        this.$message({
          type: 'success',
          message: '更新しました!'
        })
        // 3,ページをリーロドする
        this.fetchData()
      })
    },
    // ロールを表示する
    showAssignRole(row) {
      this.sysUser = row
      this.allRoles = {}
      this.dialogRoleVisible = true
      roleApi.getRolesByUserId(row.id).then(res => {
        this.allRoles = res.data.allRoles
        this.userRoleIds = res.data.userRoleIds
        this.checkAll = this.userRoleIds.length === this.allRoles.length
        this.isIndeterminate = this.userRoleIds.length > 0 && this.userRoleIds.length < this.allRoles.length
      })
    },
    handleCheckAllChange(value) {
      this.userRoleIds = value ? this.allRoles.map(item => item.id) : []
      this.isIndeterminate = false
    },
    handleCheckedChange(value) {
      const { userRoleIds, allRoles } = this
      this.checkAll = userRoleIds.length === allRoles.length && allRoles.length > 0
      this.isIndeterminate = userRoleIds.length > 0 && userRoleIds.length < allRoles.length
    },
    assignRole() {
      const assignRoleVo = {
        userId: this.sysUser.id,
        roleIdList: this.userRoleIds
      }
      roleApi.assignRoles(assignRoleVo).then(res => {
        this.$message.success('更新しました!')
        this.dialogRoleVisible = false
        this.fetchData(this.page)
      })
    }
  }
}
</script>
