<template>
  <div class="app-container">

    <!--トップ追加エリアー-->
    <div class="tools-div">
      <el-button class="btn-add" size="mini" @click="add">新 規 追 加</el-button>
    </div>

    <el-table
      :data="list"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      default-expand-all
      :tree-props="{children: 'children'}"
    >

      <el-table-column label="メニュー名" prop="name" width="350" />
      <el-table-column label="タイプ" width="100">
        <template v-slot="scope">
          {{ scope.row.type === 'view' ? 'リンク' : scope.row.type === 'click' ? 'イベント' : '' }}
        </template>
      </el-table-column>
      <el-table-column label="メニューURL" prop="url" />
      <el-table-column label="メニューKEY" prop="menuKey" width="130" />
      <el-table-column label="ソート" prop="sort" width="70" />
      <el-table-column label="操作" width="170" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.parentId > 0" type="primary" size="mini" @click="edit(scope.row.id)">更新</el-button>
          <el-button v-if="scope.row.parentId > 0" type="error" size="mini" @click="removeDataById(scope.row.id)">削除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="追加/更新" :visible.sync="dialogVisible" width="40%">
      <el-form ref="flashPromotionForm" label-width="150px" size="small" style="padding-right: 40px;">

        <el-form-item label="トップメニューを選択してください">
          <el-select
            v-model="menu.parentId"
            placeholder="選択してください"
          >
            <el-option
              v-for="item in list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="メニュー名">
          <el-input v-model="menu.name" />
        </el-form-item>
        <el-form-item label="メニュータイプ">
          <el-radio-group v-model="menu.type">
            <el-radio label="view">リンク</el-radio>
            <el-radio label="click">イベント</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="menu.type === 'view'" label="リンク">
          <el-input v-model="menu.url" />
        </el-form-item>
        <el-form-item v-if="menu.type === 'click'" label="メニューKEY">
          <el-input v-model="menu.menuKey" />
        </el-form-item>
        <el-form-item label="ソート">
          <el-input v-model="menu.sort" />
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
import menuApi from '@/api/line/menu'
const defaultForm = {
  id: null,
  parentId: 1,
  name: '',
  nameId: null,
  sort: 1,
  type: 'view',
  menuKey: '',
  url: ''
}
export default {

  // データを定義
  data() {
    return {
      list: [],
      dialogVisible: false,
      menu: defaultForm,
      saveBtnDisabled: false
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    // 全てのデータを取得
    fetchData() {
      menuApi.findMenuInfo().then(response => {
        this.list = response.data
      })
    },

    // idから削除
    removeDataById(id) {
      // debugger
      this.$confirm('データを削除しますか?', '確認', {
        confirmButtonText: '確定',
        cancelButtonText: 'キャンセル',
        type: 'warning'
      }).then(() => {
        return menuApi.removeById(id)
      }).then((response) => {
        this.fetchData(this.page)
        this.$message.success(response.message || '削除成功しました')
      }).catch(() => {
        this.$message.info('削除を取消しました!!!!!')
      })
    },

    add() {
      this.dialogVisible = true
      this.menu = Object.assign({}, defaultForm)
    },

    edit(id) {
      this.dialogVisible = true
      this.fetchDataById(id)
    },

    fetchDataById(id) {
      menuApi.getById(id).then(response => {
        this.menu = response.data
      })
    },

    saveOrUpdate() {
      this.saveBtnDisabled = true

      if (!this.menu.id) {
        this.saveData()
      } else {
        this.updateData()
      }
    },

    // C
    saveData() {
      menuApi.save(this.menu).then(response => {
        this.$message.success(response.message || '成功しました!!!!!')
        this.dialogVisible = false
        this.fetchData(this.page)
      })
    },

    // U
    updateData() {
      menuApi.updateById(this.menu).then(response => {
        this.$message.success(response.message || '成功しました!!!!!')
        this.dialogVisible = false
        this.fetchData(this.page)
      })
    }
  }
}
</script>
