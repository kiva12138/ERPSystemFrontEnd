<template>
<div>

  <div class="search_transport_part">
    <el-row>

      <span class="searchtransporttip">物料编号：</span>
      <el-input placeholder="请输入物料编号"
        class='searchtransportinput'
        type="number"
        v-model="searchTransport.id"/>

      <span class="searchtransporttip">物料名称：</span>
      <el-input placeholder="请输入物料名称"
        class='searchtransportinput'
        v-model="searchTransport.name"
        clearable/>

      <span class="searchtransporttip">物料状态：</span>
      <el-select v-model="searchTransport.status" placeholder="请选择状态"
        class='searchtransportinput'>
        <el-option
          v-for="item in transportStatus"
          :key="item.id"
          :label="item.name"
          :value="item.id" />
      </el-select>

      <el-button icon="el-icon-search"
        :disabled='searchDisabled'
        style="margin-left: 40px;"
        type="primary" @click='handleSearch'>筛选物料</el-button>

    </el-row>
  </div>

  <div class="new_transport_class">
    <el-button icon="el-icon-edit" size="small"
      type="primary" @click='handleNewTransport'>
        增加新的配送
    </el-button>
  </div>

  <el-table
    class="transport_table_class"
    :data="transportData"
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
      width="100">
    </el-table-column>
    <el-table-column
      prop="remain"
      sortable
      label="剩余数量"
      align="center"
      width="100">
    </el-table-column>
    <el-table-column
      prop="distributed"
      sortable
      label="已分配数量"
      align="center"
      width="120">
    </el-table-column>
    <el-table-column
      sortable
      label="物料类别"
      align="center"
      width="100">
      <template slot-scope="scope">
        <span>{{transportClass[scope.row.mclass-1].name}}</span>
      </template>
    </el-table-column>
    <el-table-column
      sortable
      label="物料状态"
      align="center"
      width="100">
      <template slot-scope="scope">
        <i class="el-icon-warning"
          style="color: #E6A23C;"
          v-if="transportStatus[scope.row.status-1].id==='3'">
          <span icon="el-icon-warning">
            {{transportStatus[scope.row.status-1].name}}
          </span>
        </i>
        <i class="el-icon-success"
          style="color: #67C23A;"
          v-if="transportStatus[scope.row.status-1].id==='1'">
          <span icon="el-icon-warning">
            {{transportStatus[scope.row.status-1].name}}
          </span>
        </i>
        <i class="el-icon-error"
          style="color: #F56C6C;"
          v-if="transportStatus[scope.row.status-1].id==='2'">
          <span icon="el-icon-warning">
            {{transportStatus[scope.row.status-1].name}}
          </span>
        </i>
      </template>
    </el-table-column>
    <el-table-column
      prop="lastransport"
      align="center"
      label="上次配送时间">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="150">
      <template slot-scope="scope">
        <el-button type="text" size="small"
          @click='handleTransport(scope.row)'>单独修改</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-pagination
    class="pagination_class"
    :page-size="pageSize"
    :current-page.sync="currentPage"
    background
    layout="prev, pager, next"
    @current-change="handlePagination"
    :total="total">
  </el-pagination>

  <el-dialog
    class="new_transport_dialog_class"
    :modal="false"
    title="单独配送"
    :visible.sync="newTransportDialogVisible"
    width="30%">
      <el-row>
        <div class='transporttip'>物料编号：</div>
        <div class='transportinput'>
          <el-input placeholder="请输入物料编号"
                  type="number"
                  v-model="newTransport.id"/>
        </div>
      </el-row>
      <el-row>
        <div class='transporttip'>配送操作：</div>
        <div class='transportinput'>
          <el-select v-model="newTransport.operation" placeholder="请选择种类">
            <el-option
              v-for="item in operation"
              :key="item.id"
              :label="item.name"
              :value="item.id" />
          </el-select>
        </div>
      </el-row>
      <el-row>
        <div class='transporttip'>配送数量：</div>
        <div class='transportinput'>
          <el-input placeholder="请输入配送数量"
                  v-model="newTransport.mount"
                  type="number"/>
        </div>
      </el-row>
      <el-row>
        <div class='transporttip'>配送说明：</div>
        <div class='transportinput'>
          <el-input placeholder="请输入配送说明"
                  v-model="newTransport.description"
                  type="textarea"
                  clearable/>
        </div>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newTransportDialogVisible = false">取 消</el-button>
        <el-button type="primary"
          @click="handleNewTransportSubmit"
          :disabled="newTransportSubmitDisabled">确认配送</el-button>
      </span>
  </el-dialog>

  <el-dialog
    class="modify_transport_dialog_class"
    :modal="false"
    title="单独修改"
    :visible.sync="modifyTransportDialogVisible"
    width="30%">
     <el-row>
        <div class='transporttip'>物料编号：</div>
        <div class='transportinput'>
          {{currentTransport.id}}
        </div>
      </el-row>
      <el-row>
        <div class='transporttip'>物料名称：</div>
        <div class='transportinput'>
          {{currentTransport.name}}
        </div>
      </el-row>
      <el-row>
        <div class='transporttip'>物料种类：</div>
        <div class='transportinput'>
          {{transportClass[currentTransport.class-1].name}}
        </div>
      </el-row>
      <el-row>
        <div class='transporttip'>上次配送：</div>
        <div class='transportinput'>
          {{currentTransport.lasttransport}}
        </div>
      </el-row>
      <el-row>
        <div class='transporttip'>剩余数量：</div>
        <div class='transportinput'>
          {{currentTransport.mount}}
        </div>
      </el-row>
      <el-row>
        <div class='transporttip'>配送操作：</div>
        <div class='transportinput'>
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
        <div class='transporttip'>配送数量：</div>
        <div class='transportinput'>
          <el-input placeholder="请输入配送数量"
                  v-model="currentTransport.operationmount"
                  type="number"/>
        </div>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyTransportDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleModifySubmit"
          :disabled="newModifySubmitDisabled">修 改</el-button>
      </span>
  </el-dialog>

</div>
</template>

<script>
// import testtransport from '@/config_new/testtransport.js'
import materialclass from '@/config_new/materialclass.js'
import materialstatus from '@/config_new/materialstatus.js'

export default {
  name: 'Transport',
  data () {
    return {
      searchTransport: {
        id: '',
        name: '',
        status: ''
      },
      currentPage: 1,
      total: 0,
      pageSize: 15,
      transportData: [],
      transportClass: materialclass,
      transportStatus: materialstatus,
      newTransportDialogVisible: false,
      modifyTransportDialogVisible: false,
      dataLoading: false,
      newTransport: {
        id: '',
        operation: '',
        mount: '',
        description: ''
      },
      currentTransport: {
        id: '',
        name: '',
        class: 1,
        lasttransport: '',
        mount: 0,
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
      console.log('Searching...')
      console.log(this.searchTransport)
      this.searchData()
    },
    handleNewTransport () {
      this.newTransportDialogVisible = true
      this.newTransport = {
        id: '',
        operation: '',
        mount: ''
      }
    },
    handleNewTransportSubmit () {
      console.log('New transport......')
      console.log(this.newTransport)
      var operation = 1
      if (this.newTransport.operation === 'out') {
        operation = -1
      }
      this.$axios({
        method: 'post',
        url: this.GLOBAL.backEndIp + '/api/transport/add',
        params: {
          mid: this.newTransport.id,
          mount: this.newTransport.mount,
          way: operation,
          description: this.newTransport.description
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
      this.newTransportDialogVisible = false
      this.searchData()
    },
    handleTransport (row) {
      this.modifyTransportDialogVisible = true
      this.currentTransport.id = row.id
      this.currentTransport.name = row.name
      this.currentTransport.class = row.mclass
      this.currentTransport.lasttransport = row.lastransport
      this.currentTransport.mount = row.remain
      this.currentTransport.operation = ''
      this.currentTransport.operationmount = ''
    },
    handleModifySubmit () {
      console.log('Modify transport......')
      console.log(this.currentTransport)
      this.dataLoading = true
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
      this.dataLoading = false
      this.modifyTransportDialogVisible = false
    },
    handlePagination () {
      console.log('Page to ' + this.currentPage)
      this.searchData()
    },
    searchData () {
      this.dataLoading = true
      var id = 0
      var name = ''
      var status = 0
      if (this.searchTransport.id !== '') {
        id = this.searchTransport.id
      }
      if (this.searchTransport.name !== '') {
        name = this.searchTransport.name
      }
      if (this.searchTransport.status !== '') {
        status = this.searchTransport.status
      }
      this.$axios({
        method: 'get',
        url: this.GLOBAL.backEndIp + '/api/material/getcategory',
        params: {
          id: id,
          name: name,
          status: status,
          kind: 0,
          page: this.currentPage - 1,
          size: this.pageSize
        }
      }).then(response => {
        if (response.data.code === 1) {
          this.transportData = response.data.materials
          this.total = response.data.allLength
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
      this.dataLoading = false
    }
  },
  computed: {
    searchDisabled () {
      return this.searchTransport.id === '' &&
        this.searchTransport.name === '' &&
        this.searchTransport.status === ''
    },
    newTransportSubmitDisabled () {
      return this.newTransport.id === '' ||
        this.newTransport.operation === '' ||
        this.newTransport.mount === ''
    },
    newModifySubmitDisabled () {
      return this.currentTransport.operation === '' ||
        this.currentTransport.operationmount === ''
    }
  },
  mounted () {
    this.searchData()
  }
}
</script>

<style>
.search_transport_part {
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.searchtransporttip {
  width: 8%;
  margin-left: 5px;
  margin-top: 10px;
  margin-bottom: 20px;
  color: #606266;
  text-align: right;
  display: inline-block;
  white-space:nowrap;
}
.searchtransportinput {
  width: 12%;
  display: inline-block;
  white-space:nowrap;
}
.new_transport_class {
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.pagination_class {
  margin: 40px;
  text-align: center;
}
.transporttip {
  display: inline-block;
  width: 25%;
  text-align: right;
  vertical-align: center;
  margin-top: 10px;
  white-space:nowrap;
}
.transportinput {
  display: inline-block;
  width: 74%;
  margin-top: 10px;
  white-space:nowrap;
}
</style>
