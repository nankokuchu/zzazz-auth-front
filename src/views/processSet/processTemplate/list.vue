<template>
  <div class="app-container">
    <!-- Util -->
    <div class="tools-div">
      <el-button
        type="success"
        icon="el-icon-plus"
        size="mini"
        :disabled="$hasBP('bnt.processTemplate.templateSet') === false"
        @click="add()"
      >新 規 追 加
      </el-button>
    </div>
    <!-- データエリアー -->
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
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      iconPath
      <el-table-column prop="name" label="認証名称" />
      <el-table-column label="アイコン" width="80">
        <template v-slot="scope">
          <img :src="scope.row.iconUrl" style="width: 30px;height: 30px;vertical-align: text-bottom;">
        </template>
      </el-table-column>
      <el-table-column prop="processTypeName" label="認証タイプ" />
      <el-table-column prop="description" label="説明" />
      <el-table-column prop="createTime" label="作成時間" />
      <el-table-column prop="updateTime" label="更新時間" />
      <el-table-column label="操作" width="500" align="center">
        <template v-slot="scope">
          <el-button type="success" size="mini" @click="show(scope.row)">認証設定確認</el-button>
          <el-button
            v-if="scope.row.status === 0"
            type="warning"
            size="mini"
            :disabled="$hasBP('bnt.processTemplate.publish') === false"
            @click="publish(scope.row.id)"
          >公開
          </el-button>
          <el-button
            type="primary"
            size="mini"
            :disabled="$hasBP('bnt.processTemplate.templateSet') === false"
            @click="edit(scope.row.id)"
          >認証設定更新
          </el-button>
          <el-button
            type="danger"
            size="mini"
            :disabled="$hasBP('bnt.processTemplate.remove') === false"
            @click="removeDataById(scope.row.id)"
          >削除
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
    <el-dialog title="認証設定確認" :visible.sync="formDialogVisible" width="30%">
      <h3>基本情報</h3>
      <el-divider />
      <el-form ref="flashPromotionForm" label-width="150px" size="small" style="padding-right: 40px;">
        <el-form-item label="認証タイプ" style="margin-bottom: 0;">{{ processTemplate.processTypeName }}</el-form-item>
        <el-form-item label="認証名称" style="margin-bottom: 0;">{{ processTemplate.name }}</el-form-item>
        <el-form-item label="作成時間" style="margin-bottom: 0;">{{ processTemplate.createTime }}</el-form-item>
      </el-form>
      <h3>フォーム情報</h3>
      <el-divider />
      <div>
        <form-create
          :rule="rule"
          :option="option"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="formDialogVisible = false">キャンセル</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import api from '@/api/process/processTemplate'

export default {
  data() {
    return {
      listLoading: true,
      list: null,
      total: 0,
      page: 1,
      limit: 10,
      searchObj: {},

      rule: [],
      option: {},
      processTemplate: {},
      formDialogVisible: false
    }
  },
  created() {
    this.fetchData()
  },
  mounted() {
    console.log('....mounted')
  },
  methods: {
    publish(id) {
      api.publish(id).then(response => {
        this.$message.success('公開しました!!!!')
        this.fetchData(this.page)
      })
    },
    show(row) {
      this.rule = JSON.parse(row.formProps)
      this.option = JSON.parse(row.formOptions)
      this.processTemplate = row
      this.formDialogVisible = true
    },
    changeSize(size) {
      this.limit = size
      this.fetchData(1)
    },
    fetchData(page = 1) {
      this.page = page
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
        this.$message.info('削除をキャンセルしました')
      })
    },
    add() {
      this.$router.push('/processSet/templateSet')
    },
    edit(id) {
      this.$router.push('/processSet/templateSet?id=' + id)
    }
  }
}
</script>
