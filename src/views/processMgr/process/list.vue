<template>
  <div class="app-container">
    <div class="search-div">
      <el-form label-width="100px" size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="キーワード">
              <el-input v-model="searchObj.keyword" style="width: 95%" placeholder="認証番号/タイトル/電話番号/名前" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状態">
              <el-select
                v-model="searchObj.status"
                placeholder="状態を選択"
                style="width: 50%;"
              >
                <el-option
                  v-for="item in statusList"
                  :key="item.status"
                  :label="item.name"
                  :value="item.status"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="操作時間">
              <el-date-picker
                v-model="createTimes"
                type="datetimerange"
                range-separator="~"
                start-placeholder="開始時間"
                end-placeholder="締切時間"
                value-format="yyyy-MM-dd"
                style="margin-right: 10px;width: 100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display:flex">
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            :loading="loading"
            @click="fetchData()"
          >検索
          </el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetData">リセット</el-button>
        </el-row>
      </el-form>
    </div>
    <!-- データ -->
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
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="processCode" label="認証番号" width="130" />
      <el-table-column prop="title" label="タイトル" width="180" />
      <el-table-column prop="name" label="ユーザー" />
      <el-table-column prop="processTypeName" label="認証タイプ" />
      <el-table-column prop="processTemplateName" label="認証テンプ" />
      <el-table-column prop="description" label="説明" width="180" />
      <el-table-column label="状態">
        <template slot-scope="scope">
          {{ scope.row.status === 1 ? '承認中' : scope.row.status === 2 ? '承認' : '否認' }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="作成時間" width="160" />

      <el-table-column label="操作" width="120" align="center">
        <template v-slot="scope">
          <el-button type="text" size="mini" @click="show(scope.row.id)">詳細確認</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- ページネーション -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
      style="padding: 30px 0; text-align: center;"
      layout="sizes, prev, pager, next, jumper, ->, total, slot"
      @current-change="fetchData"
      @size-change="changeSize"
    />
  </div>
</template>

<script>
import api from '@/api/process/process'

export default {
  data() {
    return {
      listLoading: true,
      list: null,
      total: 0,
      page: 1,
      limit: 10,
      searchObj: {},
      statusList: [
        { 'status': '1', 'name': '承認中' },
        { 'status': '2', 'name': '承認' },
        { 'status': '-1', 'name': '否認' }
      ],
      createTimes: []
    }
  },

  created() {
    console.log('list created......')
    this.fetchData()
  },

  mounted() {
    console.log('list mounted......')
  },

  methods: {
    changeSize(size) {
      console.log(size)
      this.limit = size
      this.fetchData(1)
    },

    fetchData(page = 1) {
      this.page = page

      if (this.createTimes && this.createTimes.length === 2) {
        this.searchObj.createTimeBegin = this.createTimes[0]
        this.searchObj.createTimeEnd = this.createTimes[1]
      }

      api.getPageList(this.page, this.limit, this.searchObj).then(
        response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        }
      )
    },
    resetData() {
      this.searchObj = {}
      this.fetchData()
    },

    show(id) {
      console.log(id)
    }
  }
}
</script>
