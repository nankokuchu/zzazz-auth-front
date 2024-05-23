<template>
  <div class="app-container">
    <!-- 工具条 -->
    <div class="tools-div">
      <el-button
        type="success"
        icon="el-icon-plus"
        size="mini"
        :disabled="$hasBP('bnt.processType.add') === false"
        @click="add"
      >新 規 追 加
      </el-button>
    </div>
    <!-- banner -->
    <el-table
      v-loading="listLoading"
      :data="list"
      stripe
      border
      style="width: 100%;margin-top: 10px;"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        label="番号"
        width="70"
        align="center"
      >
        <template v-slot="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="タイプ名称" />
      <el-table-column prop="description" label="説明" />
      <el-table-column prop="createTime" label="作成時間" />
      <el-table-column prop="updateTime" label="更新時間" />
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            :disabled="$hasBP('bnt.processType.update') === false"
            @click="edit(scope.row.id)"
          >更 新
          </el-button>
          <el-button
            type="danger"
            size="mini"
            :disabled="$hasBP('bnt.processType.remove') === false"
            @click="removeDataById(scope.row.id)"
          >削 除
          </el-button>
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
    <el-dialog title="追加/更新" :visible.sync="dialogVisible" width="40%">
      <el-form ref="flashPromotionForm" label-width="150px" size="small" style="padding-right: 40px;">
        <el-form-item label="タイプ名称">
          <el-input v-model="processType.name" />
        </el-form-item>
        <el-form-item label="説明">
          <el-input v-model="processType.description" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="saveOrUpdate()">確 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import api from '@/api/process/processType'

const defaultForm = {
  id: '',
  name: '',
  description: ''
}
export default {
  data() {
    return {
      listLoading: true, // リロードしているかを判断
      list: null, // bannerリスト
      total: 0, // DBのデータ数
      page: 1, // デフォルトのページ数
      limit: 10, // 1ページに表示されるデータ数
      searchObj: {}, // 検索Formのオブジェクト
      dialogVisible: false,
      processType: defaultForm,
      saveBtnDisabled: false
    }
  },
  created() {
    this.fetchData()
  },
  mounted() {
  },
  methods: {
    changeSize(size) {
      console.log(size)
      this.limit = size
      this.fetchData(1)
    },
    fetchData(page = 1) {
      this.page = page
      api.getPageList(this.page, this.limit, this.searchObj).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    // リーセット
    resetData() {
      console.log('リーセット')
      this.searchObj = {}
      this.fetchData()
    },
    // idで削除
    removeDataById(id) {
      this.$confirm('データを削除しますか?', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: 'キャンセル',
        type: 'warning'
      }).then(() => { // promise
        return api.removeById(id)
      }).then((response) => {
        this.fetchData(this.page)
        this.$message.success(response.message)
      }).catch(() => {
        this.$message.info('削除をキャンセルしました!!!')
      })
    },
    add() {
      this.dialogVisible = true
      this.processType = Object.assign({}, defaultForm)
    },
    edit(id) {
      this.dialogVisible = true
      this.fetchDataById(id)
    },
    fetchDataById(id) {
      api.getById(id).then(response => {
        this.processType = response.data
      })
    },
    saveOrUpdate() {
      this.saveBtnDisabled = true // 重複提出を防止
      if (!this.processType.id) {
        this.saveData()
      } else {
        this.updateData()
      }
    },
    // insert
    saveData() {
      api.save(this.processType).then(response => {
        this.$message.success(response.message || '保存成功')
        this.dialogVisible = false
        this.fetchData(this.page)
      })
    },
    // idでupdate
    updateData() {
      api.updateById(this.processType).then(response => {
        this.$message.success(response.message || 'アップデート成功')
        this.dialogVisible = false
        this.fetchData(this.page)
      })
    }
  }
}
</script>
