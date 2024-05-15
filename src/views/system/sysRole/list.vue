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
          <el-button type="primary" icon="el-icon-search" size="mini" @click="fetchData()">検索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetData">リセット</el-button>
        </el-row>
      </el-form>
    </div>
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
        <template slot-scope="scope">
          {{ (page - 1) * size + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="roleName" label="ロール名称" />
      <el-table-column prop="roleCode" label="ロールコード" />
      <el-table-column prop="createTime" label="CreatTime" width="160" />
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" title="編集" @click="edit(scope.row.id)" />
          <el-button type="danger" icon="el-icon-delete" size="mini" title="削除" @click="removeDataById(scope.row.id)" />
        </template>
      </el-table-column>
    </el-table>

    <!--ページネーション-->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="size"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="fetchData"
    />
  </div>
</template>
<script>
// jsファイルをimport
import api from '@/api/role/role'

export default {
  data() {
    return {
      listLoading: true,
      // デフォルトの設定
      list: [], // 取得したデータを保管する
      total: 0, // 全ページ数
      page: 1, // currentページ、デフォルトは1にする
      size: 2, // ページの容量、デフォルトは2にする
      searchObj: {} // 条件で探すデータ、Objectで表示
    }
  },
  // lifeMethod
  created() {
    this.fetchData()
  },
  methods: {
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
    }
  }
}
</script>
