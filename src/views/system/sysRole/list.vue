<template>
  <div class="app-container">
    <h1>ユーザーロール</h1>
    <div class="search-div">
      <el-form label-width="100px" size="small">
        <el-row>
          <el-col :span="24">
            <el-form-item label="ロール名称">
              <el-input v-model="searchObj.roleName" style="width: 100%" placeholder="ロール名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display:flex">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="fetchData()">検 索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetData">リセット</el-button>
        </el-row>
      </el-form>
    </div>
    <!--検索エリアーEND-->
    <div class="tools-div">
      <el-button type="success" icon="el-icon-plus" size="mini" @click="addRole">追 加</el-button>
      <el-button class="btn-add" size="mini" @click="batchRemove">一括删除</el-button>
    </div>
    <!--追加END-->
    <el-table
      v-loading="listLoading"
      :data="list"
      stripe
      border
      style="width: 100%;margin-top: 10px;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" />

      <el-table-column
        label="番号"
        width="70"
        align="center"
      >
        <template v-slot="scope">
          {{ (page - 1) * size + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="roleName" label="ロール名称" />
      <el-table-column prop="roleCode" label="ロールコード" />
      <el-table-column prop="description" label="ロール説明" />
      <el-table-column prop="createTime" label="CreatTime" width="160" />
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" title="編 集" @click="editRole(scope.row.id)" />
          <el-button type="danger" icon="el-icon-delete" size="mini" title="削 除" @click="removeDataById(scope.row.id)" />
          <el-button type="warning" icon="el-icon-baseball" size="mini" title="ロール給与" @click="showAssignAuth(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <!--メインテーブルEND-->
    <el-dialog title="新規追加/更新" :visible.sync="dialogVisible" width="40%">
      <el-form ref="dataForm" :model="sysRole" label-width="150px" size="small" style="padding-right: 40px;">
        <el-form-item label="ロール名称">
          <el-input v-model="sysRole.roleName" />
        </el-form-item>
        <el-form-item label="ロールコード">
          <el-input v-model="sysRole.roleCode" />
        </el-form-item>
        <el-form-item label="ロール説明">
          <el-input v-model="sysRole.description" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" icon="el-icon-refresh-right" @click="dialogVisible = false">キャンセル</el-button>
        <el-button type="primary" icon="el-icon-check" size="small" @click="saveOrUpdate()">保 存</el-button>
      </span>
    </el-dialog>
    <!--ダイアローグEND-->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="size"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="fetchData"
    />
    <!--ページネーションEND-->
  </div>
</template>
<script>
// jsファイルをimport
import api from '@/api/system/role'

export default {
  data() {
    return {
      listLoading: true,
      // デフォルトの設定
      list: [], // 取得したデータを保管する
      total: 0, // 全ページ数
      page: 1, // currentページ、デフォルトは1にする
      size: 5, // ページの容量、デフォルトは2にする
      searchObj: {}, // 条件で探すデータ、Objectで表示
      dialogVisible: false,
      sysRole: {},
      roleList: []
    }
  },
  // lifeMethod
  created() {
    this.fetchData()
  },
  methods: {
    showAssignAuth(row) {
      this.$router.push('/system/assignAuth?id=' + row.id + '&roleName=' + row.roleName)
    },
    // 追加ボタンん
    addRole() {
      this.dialogVisible = true
      this.sysRole = {}
    },
    // 更新ボタン
    editRole(id) {
      api.getRoleById(id).then(res => {
        // 1,データに値を入れる
        this.sysRole = res.data
        // 2,ダイアローグ表示
        this.dialogVisible = true
      })
    },
    // 複数選択した際の動作
    handleSelectionChange(selectValue) {
      this.roleList = selectValue
    },
    // 複数削除ボタン
    batchRemove() {
      if (this.roleList.length === 0) {
        this.$message(
          {
            type: 'warning',
            message: '選択してください!!!!!'
          }
        )
        return
      }
      this.$confirm('データを削除しますか?', '確認', {
        confirmButtonText: '確定',
        cancelButtonText: 'キャンセル',
        type: 'warning'
      }).then(() => {
        const idList = []
        // idを配列の格納
        this.roleList.forEach((role) => {
          idList.push(role.id)
        })
        console.log(idList)
        api.batchRemove(idList)
          .then(res => {
            this.$message({
              type: 'success',
              message: '削除成功しました!'
            })
            this.fetchData()
          })
      })
    },
    // saveOrUpdate
    saveOrUpdate() {
      // sysRoleにidがあれば更新、なければ新規追加
      if (!this.sysRole.id) {
        this.saveRole(this.sysRole)
      } else {
        this.updateRole(this.sysRole)
      }
    },
    // ユーザーロールを追加
    saveRole(sysRole) {
      // 1,保存作業
      api.saveRole(sysRole).then(res => {
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
    // ユーザーロールをupdate
    updateRole(sysRole) {
      // 1,更新作業
      api.updateRole(sysRole).then(res => {
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
    // リセット
    resetData() {
      // inputをリッセット
      this.searchObj = {}
      // 表示をリセット
      this.fetchData()
    },
    // pageNUm:検索するページす数、デフォルトは1
    fetchData(pageNum = 1) {
      this.page = pageNum
      // ajaxリクエスト
      api.getPageList(this.page, this.size, this.searchObj)
        .then(res => {
          // console.log(res)
          this.listLoading = false
          this.list = res.data.records
          this.total = res.data.total
        })
    },
    // idで削除
    removeDataById(id) {
      this.$confirm('データを削除しますか?', '確認', {
        confirmButtonText: '確定',
        cancelButtonText: 'キャンセル',
        type: 'warning'
      }).then(() => {
        api.removeRoleById(id)
          .then(res => {
            this.$message({
              type: 'success',
              message: '削除成功しました!'
            })
            this.fetchData()
          })
      })
    }
  }
}
</script>
