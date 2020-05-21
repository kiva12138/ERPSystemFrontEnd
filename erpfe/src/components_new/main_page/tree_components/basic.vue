<template>
<div>

  <div style="width: 50%; text-align: center; display: inline-block;margin-bottom: 10px;">
    <div>
      <span style="font-size: 80%; color: #606266;">总计</span>
      <span style="font-size: 250%; color: #409EFF;">
        {{pagination.total}}
      </span>
      <span style="font-size: 80%; color: #606266;">种生产原料</span>
    </div>
  </div>
  <div style="width: 30%; text-align: center; display: inline-block;margin-bottom: 10px;">
    <div>
      <span style="font-size: 80%; color: #606266;">其中</span>
      <span style="font-size: 250%; color: #E6A23C;">
        {{pagination.warningNumber}}
      </span>
      <span style="font-size: 80%; color: #606266;">种原料的剩余数量</span>
      <span style="font-size: 80%; color: #E6A23C;">处于预警状态</span>
    </div>
  </div>

  <div class="search_material_part">
    <el-row>

      <span class="searchmaterialtip">物料编号：</span>
      <el-input placeholder="请输入物料编号"
        class='searchmaterialinput'
        v-model="searchMaterial.id"
        type="number"/>

      <span class="searchmaterialtip">物料名称：</span>
      <el-input placeholder="请输入物料名称"
        class='searchmaterialinput'
        v-model="searchMaterial.name"
        clearable/>

      <span class="searchmaterialtip">物料状态：</span>
      <el-select v-model="searchMaterial.status" placeholder="请选择状态"
        class='searchmaterialinput'>
        <el-option
          v-for="item in materialStatus"
          :key="item.id"
          :label="item.name"
          :value="item.id" />
      </el-select>

      <el-button icon="el-icon-search"
        :disabled='searchDisabled'
        style="margin-left: 40px;"
        type="primary" @click='handleSearch'>筛选生产原料</el-button>

    </el-row>
  </div>

  <el-table
    class="material_table_class"
    :data="materialData"
    size="small"
    :default-sort = "{prop: 'id', order: 'descending'}"
    stripe
    v-loading="dataLoading"
    style="width: 100%;">
    <el-table-column
      fixed="left"
      prop="id"
      sortable
      label="物料编号"
      align="center"
      width="150">
    </el-table-column>
    <el-table-column
      prop="name"
      sortable
      label="物料名称"
      align="center"
      width="150">
    </el-table-column>
    <el-table-column
      prop="mount"
      sortable
      label="总数量"
      align="center"
      width="150">
    </el-table-column>
    <el-table-column
      prop="remain"
      sortable
      label="剩余数量"
      align="center"
      width="150">
    </el-table-column>
    <el-table-column
      prop="distributed"
      sortable
      label="已分配数量"
      align="center"
      width="150">
    </el-table-column>
    <el-table-column
      prop="status"
      sortable
      label="物料状态"
      align="center"
      width="100">
      <template slot-scope="scope">
        <i class="el-icon-warning"
          style="color: #E6A23C;"
          v-if="materialStatus[scope.row.status-1].id==='3'">
          <span>
            {{materialStatus[scope.row.status-1].name}}
          </span>
        </i>
        <i class="el-icon-success"
          style="color: #67C23A;"
          v-if="materialStatus[scope.row.status-1].id==='1'">
          <span>
            {{materialStatus[scope.row.status-1].name}}
          </span>
        </i>
        <i class="el-icon-error"
          style="color: #F56C6C;"
          v-if="materialStatus[scope.row.status-1].id==='2'">
          <span>
            {{materialStatus[scope.row.status-1].name}}
          </span>
        </i>
      </template>
    </el-table-column>
    <el-table-column
      prop="description"
      align="center"
      label="描述">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="150">
      <template slot-scope="scope">
        <el-button type="text" size="small"
          @click='handleEdit(scope.row)'>编辑</el-button>
        <el-button type="text" size="small"
          @click='handlePreTransport(scope.row)'>数量调整</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-pagination
    class="pagination_class"
    :page-size="pagination.pageSize"
    :current-page.sync="pagination.currentPage"
    background
    layout="prev, pager, next"
    @current-change="handlePagination"
    :total="pagination.total">
  </el-pagination>

  <el-dialog
    class="modify_material_dialog_class"
    :modal="false"
    title="编辑物料"
    :visible.sync="modifyMaterialDialogVisible"
    width="30%">
     <el-row>
        <div class='materialtip'>物料编号：</div>
        <div class='materialinput'>
          {{currentMaterial.id}}
        </div>
      </el-row>
      <el-row>
        <div class='materialtip'>物料名称：</div>
        <div class='materialinput'>
          <el-input placeholder="请输入物料名称"
                  v-model="currentMaterial.name"
                  clearable/>
        </div>
      </el-row>
      <el-row>
        <div class='materialtip'>物料种类：</div>
        <div class='materialinput'>
          <el-select v-model="currentMaterial.class"
            placeholder="请选择种类">
            <el-option
              v-for="item in materialClass"
              :key="item.id"
              :label="item.name"
              :value="item.id" />
          </el-select>
        </div>
      </el-row>
      <el-row>
        <div class='materialtip'>物料描述：</div>
        <div class='materialinput'>
          <el-input placeholder="请输入物料描述"
                  v-model="currentMaterial.description"
                  clearable/>
        </div>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyMaterialDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleModifySubmit"
          :disabled="editMaterialSubmitDisabled">修 改</el-button>
      </span>
  </el-dialog>

  <el-dialog
    class="modify_material_dialog_class"
    :modal="false"
    title="修改剩余数量"
    :visible.sync="transportDialogVisible"
    width="30%">
     <el-row>
        <div class='materialtip'>物料编号：</div>
        <div class='materialinput'>
          {{currentTransport.id}}
        </div>
      </el-row>
      <el-row>
        <div class='materialtip'>物料名称：</div>
        <div class='materialinput'>
          {{currentTransport.name}}
        </div>
      </el-row>
      <el-row>
        <div class='materialtip'>物料种类：</div>
        <div class='materialinput'>
          {{materialClass[currentTransport.class - 1].name}}
        </div>
      </el-row>
      <el-row>
        <div class='materialtip'>剩余数量：</div>
        <div class='materialinput'>
          {{currentTransport.left}}
        </div>
      </el-row>
      <el-row>
        <div class='materialtip'>配送操作：</div>
        <div class='materialinput'>
          <el-select v-model="currentTransport.operation" placeholder="请选择种类">
            <el-option
              v-for="item in operation"
              :key="item.id"
              :label="item.name"
              :value="item.id" />
          </el-select>
        </div>
      </el-row>
      <el-row>
        <div class='materialtip'>配送数量：</div>
        <div class='materialinput'>
          <el-input placeholder="请输入配送数量"
                  v-model="currentTransport.operationmount"
                  type="number"/>
        </div>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="transportDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleTransport"
          :disabled="newModifySubmitDisabled">修 改</el-button>
      </span>
  </el-dialog>

</div>
</template>

<script>
// import testmaterial from '@/config_new/testmaterialcategory.js'
import materialclass from '@/config_new/materialclass.js'
import materialstatus from '@/config_new/materialstatus.js'

export default {
  name: 'Basic',
  data () {
    return {
      searchMaterial: {
        id: '',
        name: '',
        status: ''
      },
      pagination: {
        pageSize: 15,
        currentPage: 1,
        total: 0,
        warningNumber: 3
      },
      materialData: [],
      materialClass: materialclass,
      materialStatus: materialstatus,
      modifyMaterialDialogVisible: false,
      transportDialogVisible: false,
      dataLoading: false,
      currentMaterial: {
        id: '',
        name: '',
        class: 0,
        description: ''
      },
      currentTransport: {
        id: '',
        name: '',
        class: 1,
        left: '',
        operation: '',
        operationmount: ''
      },
      operation: [
        {
          id: 'in',
          name: '入库配送'
        },
        {
          id: 'out',
          name: '出库配送'
        }
      ]
    }
  },
  methods: {
    handleSearch () {
      console.log(this.searchMaterial)
      this.dataLoading = true
      this.searchData()
      this.dataLoading = false
    },
    handleEdit (row) {
      this.modifyMaterialDialogVisible = true
      console.log(row)
      this.currentMaterial = {
        id: row.id,
        name: row.name,
        class: row.mclass,
        description: row.description
      }
    },
    handleModifySubmit () {
      this.$axios({
        method: 'post',
        url: this.GLOBAL.backEndIp + '/api/material/updatecategory',
        params: {
          id: this.currentMaterial.id,
          name: this.currentMaterial.name,
          kind: this.currentMaterial.class,
          description: this.currentMaterial.description
        }
      }).then(response => {
        if (response.data.code === 1) {
          this.$message({
            message: '修改成功。',
            type: 'success'
          })
        } else {
          this.$message({
            message: '修改失败。' + '错误原因：' + response.data.code + '-' + response.data.message,
            type: 'error'
          })
        }
      }).catch(error => {
        this.$message({
          message: '修改错误。' + '错误原因：' + error.response.status,
          type: 'error'
        })
      })
      this.modifyMaterialDialogVisible = false
      this.dataLoading = true
      this.searchData()
      this.dataLoading = false
    },
    handlePreTransport (row) {
      this.currentTransport = {
        id: row.id,
        name: row.name,
        class: row.mclass,
        left: row.remain,
        operation: '',
        operationmount: ''
      }
      this.transportDialogVisible = true
    },
    handleTransport () {
      var operation = 1
      if (this.currentTransport.operation === 'out') {
        operation = -1
      }
      this.$axios({
        method: 'post',
        url: this.GLOBAL.backEndIp + '/api/transport/add',
        params: {
          mid: this.currentTransport.id,
          mount: this.currentTransport.operationmount,
          way: operation,
          description: ''
        }
      }).then(response => {
        if (response.data.code === 1) {
          this.$message({
            message: '新增成功。',
            type: 'success'
          })
        } else {
          this.$message({
            message: '新增失败。' + '错误原因：' + response.data.code + '-' + response.data.message,
            type: 'error'
          })
        }
      }).catch(error => {
        this.$message({
          message: '新增错误。' + '错误原因：' + error.response.status,
          type: 'error'
        })
      })
      this.transportDialogVisible = false
      this.dataLoading = true
      this.searchData()
      this.dataLoading = false
    },
    handlePagination () {
      this.dataLoading = true
      this.searchData()
      this.dataLoading = false
    },
    searchData () {
      var id = 0
      var name = ''
      var status = 0
      if (this.searchMaterial.id !== '') {
        id = this.searchMaterial.id
      }
      if (this.searchMaterial.name !== '') {
        name = this.searchMaterial.name
      }
      if (this.searchMaterial.status !== '') {
        status = this.searchMaterial.status
      }
      this.$axios({
        method: 'get',
        url: this.GLOBAL.backEndIp + '/api/material/getcategory',
        params: {
          id: id,
          name: name,
          status: status,
          kind: 1,
          page: this.pagination.currentPage - 1,
          size: this.pagination.pageSize
        }
      }).then(response => {
        if (response.data.code === 1) {
          this.materialData = response.data.materials
          this.pagination.total = response.data.allLength
        } else {
          this.$message({
            message: '查找错误。' + '错误原因：' + response.data.code + '-' + response.data.message,
            type: 'error'
          })
        }
      }).catch(error => {
        this.$message({
          message: '查找错误。' + '错误原因：' + error.response.status,
          type: 'error'
        })
      })
      this.$axios({
        method: 'get',
        url: this.GLOBAL.backEndIp + '/api/material/getcategorymountexceptstatus',
        params: {
          id: id,
          name: name,
          status: 1,
          kind: 1
        }
      }).then(response => {
        if (response.data.code === 1) {
          this.pagination.warningNumber = response.data.mount
        } else {
          this.$message({
            message: '查找错误。' + '错误原因：' + response.data.code + '-' + response.data.message,
            type: 'error'
          })
        }
      }).catch(error => {
        this.$message({
          message: '查找错误。' + '错误原因：' + error.response.status,
          type: 'error'
        })
      })
    }
  },
  computed: {
    searchDisabled () {
      return this.searchMaterial.id === '' &&
        this.searchMaterial.name === '' &&
        this.searchMaterial.class === '' &&
        this.searchMaterial.status === ''
    },
    editMaterialSubmitDisabled () {
      return this.currentMaterial.name === '' ||
        this.currentMaterial.class === 0 ||
        this.currentMaterial.class === ''
    },
    newModifySubmitDisabled () {
      return this.currentTransport.operation === '' ||
        this.currentTransport.operationmount === ''
    }
  },
  mounted () {
    this.dataLoading = true
    this.searchData()
    this.dataLoading = false
  }
}
</script>

<style>
.search_material_part {
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.searchmaterialtip {
  width: 8%;
  margin-left: 5px;
  margin-top: 10px;
  margin-bottom: 20px;
  color: #606266;
  text-align: right;
  display: inline-block;
  white-space:nowrap;
}
.searchmaterialinput {
  width: 12%;
  display: inline-block;
  white-space:nowrap;
}
.pagination_class {
  margin: 40px;
  text-align: center;
}
.materialtip {
  display: inline-block;
  width: 25%;
  text-align: right;
  vertical-align: center;
  margin-top: 10px;
  white-space:nowrap;
}
.materialinput {
  display: inline-block;
  width: 74%;
  margin-top: 10px;
  white-space:nowrap;
}
</style>
