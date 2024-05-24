<template>
  <div class="app-container">
    <el-steps :active="stepIndex" finish-status="success">
      <el-step title="基本設定" />
      <el-step title="フォーム設定" />
      <el-step title="プロセス設定" />
    </el-steps>

    <div class="tools-div">
      <el-button
        v-if="stepIndex > 1"
        icon="el-icon-check"
        type="primary"
        size="small"
        round
        @click="pre()"
      >前へ
      </el-button>
      <el-button
        icon="el-icon-check"
        type="primary"
        size="small"
        round
        @click="next()"
      >{{ stepIndex === 3 ? '保存' : '次へ' }}
      </el-button>
      <el-button type="primary" size="small" @click="back()">戻る</el-button>
    </div>

    <!-- 基本設定 -->
    <div v-show="stepIndex === 1" style="margin-top: 20px;">
      <el-form ref="flashPromotionForm" label-width="150px" size="small" style="padding-right: 40px;">
        <el-form-item label="認証タイプ">
          <el-select v-model="processTemplate.processTypeId" placeholder="認証タイプを選んでください">
            <el-option v-for="item in processTypeList" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="認証名称">
          <el-input v-model="processTemplate.name" />
        </el-form-item>
        <el-form-item label="認証アイコン">
          <el-select v-model="processTemplate.iconUrl" placeholder="認証アイコンを選んでくさい">
            <el-option v-for="item in iconUrlList" :label="item.iconUrl" :value="item.iconUrl">
              <img :src="item.iconUrl" style="width: 30px;height: 30px;vertical-align: text-bottom;">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="説明">
          <el-input v-model="processTemplate.description" />
        </el-form-item>
      </el-form>
    </div>

    <!-- フォーム設定 -->
    <div v-show="stepIndex === 2" style="margin-top: 20px;">
      <!--フォーム設定-->
      <fc-designer ref="designer" class="form-build" />
    </div>

    <!-- プロセス設定 -->
    <div v-show="stepIndex === 3" style="margin-top: 20px;">
      <el-upload
        class="upload-demo"
        drag
        action="/dev-api/admin/process/processTemplate/uploadProcessDefinition"
        :headers="uploadHeaders"
        multiple="false"
        :before-upload="beforeUpload"
        :on-success="onUploadSuccess"
        :file-list="fileList"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">ファイルをドロップ，もしくは<em>アップロード</em></div>
        <div slot="tip" class="el-upload__tip">zipファイルのみアップロード可能、且つサイズは2048kbは超えない</div>
      </el-upload>
    </div>
  </div>
</template>

<script>
import api from '@/api/process/processTemplate'
import processTypeApi from '@/api/process/processType'
import store from '@/store'

const defaultForm = {
  id: '',
  name: '',
  iconUrl: '',
  formProps: '',
  formOptions: '',
  processDefinitionKey: '',
  processDefinitionPath: '',
  description: ''
}
export default {
  data() {
    return {
      stepIndex: 1,
      processTypeList: [],
      processTemplate: defaultForm,
      iconUrlList: [
        { iconUrl: 'https://gw.alicdn.com/tfs/TB1t695CFYqK1RjSZLeXXbXppXa-102-102.png', tag: '请假' },
        { iconUrl: 'https://gw.alicdn.com/tfs/TB1bHOWCSzqK1RjSZFjXXblCFXa-112-112.png', tag: '出差' },
        { iconUrl: 'https://gw.alicdn.com/tfs/TB1cbCYCPTpK1RjSZKPXXa3UpXa-112-112.png', tag: '机票出差' },
        { iconUrl: 'https://gw.alicdn.com/tfs/TB1cbCYCPTpK1RjSZKPXXa3UpXa-112-112.png', tag: '机票改签' },
        { iconUrl: 'https://gw.alicdn.com/tfs/TB1e76lCOLaK1RjSZFxXXamPFXa-112-112.png', tag: '外出' },
        { iconUrl: 'https://gw.alicdn.com/tfs/TB1Yfa0CG6qK1RjSZFmXXX0PFXa-112-112.png', tag: '补卡申请' },
        { iconUrl: 'https://gw.alicdn.com/tfs/TB1Y8PlCNjaK1RjSZKzXXXVwXXa-112-112.png', tag: '加班' },
        { iconUrl: 'https://gw.alicdn.com/tfs/TB11X99CNTpK1RjSZFKXXa2wXXa-102-102.png', tag: '居家隔离' },
        { iconUrl: 'https://gw.alicdn.com/tfs/TB1_YG.COrpK1RjSZFhXXXSdXXa-102-102.png', tag: '请假' },
        { iconUrl: 'https://gw.alicdn.com/tfs/TB13ca1CMDqK1RjSZSyXXaxEVXa-102-102.png', tag: '调岗' },
        { iconUrl: 'https://gw.alicdn.com/tfs/TB1U9iBCSzqK1RjSZPcXXbTepXa-102-102.png', tag: '离职' },
        { iconUrl: 'https://gw.alicdn.com/tfs/TB11pS_CFzqK1RjSZSgXXcpAVXa-102-102.png', tag: '费用申请' },
        { iconUrl: 'https://gw.alicdn.com/tfs/TB1t695CFYqK1RjSZLeXXbXppXa-102-102.png', tag: '用章申请' }
      ],
      uploadHeaders: {
        'token': store.getters.token
      },
      fileList: []
    }
  },

  created() {
    const id = this.$route.query.id
    console.log(id)
    if (id > 0) {
      this.fetchDataById(id)
    }
    this.fetchProcessTypeData()
  },

  methods: {
    pre() {
      this.stepIndex -= 1
    },

    next() {
      if (this.stepIndex === 2) {
        this.processTemplate.formProps = JSON.stringify(this.$refs.designer.getRule())
        this.processTemplate.formOptions = JSON.stringify(this.$refs.designer.getOption())
        console.log(JSON.stringify(this.processTemplate))
      }
      if (this.stepIndex === 3) {
        this.saveOrUpdate()
      }

      this.stepIndex += 1
    },

    fetchProcessTypeData() {
      processTypeApi.findAll().then(response => {
        this.processTypeList = response.data
      })
    },
    fetchDataById(id) {
      api.getById(id).then(response => {
        this.processTemplate = response.data
        // フォームに値を設定
        this.$refs.designer.setRule(JSON.parse(this.processTemplate.formProps))
        this.$refs.designer.setOption(JSON.parse(this.processTemplate.formOptions))
        this.fileList = [{
          name: this.processTemplate.processDefinitionPath,
          url: this.processTemplate.processDefinitionPath
        }]
      })
    },

    saveOrUpdate() {
      this.saveBtnDisabled = true
      if (!this.processTemplate.id) {
        this.saveData()
      } else {
        this.updateData()
      }
    },

    // insert
    saveData() {
      api.save(this.processTemplate).then(response => {
        this.$router.push('/processSet/processTemplate')
      })
    },

    // updateById
    updateData() {
      api.updateById(this.processTemplate).then(response => {
        this.$router.push('/processSet/processTemplate')
      })
    },

    // ファイルをアップロードする前
    beforeUpload(file) {
      const isZip = file.type === 'application/x-zip-compressed'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isZip) {
        this.$message.error('ファイル形式が間違っています!!!!!!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('アップロードできるサイズは 2MB!!!!!')
        return false
      }
      return true
    },

    // ファイルをアップロード後のcallback
    onUploadSuccess(res, file) {
      this.processTemplate.processDefinitionPath = res.data.processDefinitionPath
      this.processTemplate.processDefinitionKey = res.data.processDefinitionKey
    },

    back() {
      this.$router.push('/processSet/processTemplate')
    }
  }
}
</script>
