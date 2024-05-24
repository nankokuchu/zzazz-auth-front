<template>
  <div class="app-container">
    <div class="search-div">
      <el-form label-width="100px" size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="ユーザー名">
              <el-input v-model="searchObj.username" style="width: 95%" placeholder="ユーザー名" />
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
      <el-table-column prop="username" label="ユーザーID" />
      <el-table-column prop="ipaddr" label="登録IP" />
      <el-table-column prop="statusStr" label="登録状態" />
      <el-table-column prop="msg" label="メッセージ" />
      <el-table-column prop="accessTime" label="アクセス時間" width="160" />
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
  </div>
</template>
<script>
import api from '@/api/system/loginLog'

export default {
  data() {
    return {
      listLoading: true,
      // デフォルトの設定
      list: [], // 取得したデータを保管する
      total: 0, // 全ページ数
      page: 1, // currentページ、デフォルトは1にする
      size: 10, // ページの容量、デフォルトは2にする
      searchObj: {}, // 条件で探すデータ、Objectで表示
      dialogVisible: false,
      createTimes: []
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
      this.createTimes = []
      // 表示をリセット
      this.fetchData()
    },
    // pageNUm:検索するページす数、デフォルトは1
    fetchData(pageNum = 1) {
      this.page = pageNum
      // ajaxリクエスト
      api.getLoginLogList(this.page, this.size, this.searchObj)
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
