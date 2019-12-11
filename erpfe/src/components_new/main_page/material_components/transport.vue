<template>
<div>

  <div class="search_transport_part">
    <el-row>

      <span class="searchtransporttip">物料编号：</span>
      <el-input placeholder="请输入物料编号"
        class='searchtransportinput'
        v-model="searchTransport.id"
        clearable/>

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
    <el-button icon="el-icon-edit"
      type="primary" @click='handleNewTransport'>
        增加新的配送
    </el-button>
  </div>

  <el-table
    class="transport_table_class"
    :data="transportData"
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
        <span>{{transportClass[scope.row.class-1].name}}</span>
      </template>
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
      prop="lasttransport"
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
    :page-size="10"
    :current-page.sync="currentPage"
    background
    layout="prev, pager, next"
    @current-change="handlePagination"
    :total="transportesNumber">
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
                  v-model="newTransport.id"
                  clearable/>
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
        <div class='transporttip'>修改数量：</div>
        <div class='transportinput'>
          <el-input placeholder="请输入配送数量"
                  v-model="currentTransport.mount"
                  clearable/>
        </div>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyTransportDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleModifySubmit">修 改</el-button>
      </span>
  </el-dialog>

</div>
</template>

<script>
import testtransport from '@/config_new/testtransport.js'
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
      transportesNumber: 20,
      transportData: testtransport,
      transportClass: materialclass,
      transportStatus: materialstatus,
      newTransportDialogVisible: false,
      modifyTransportDialogVisible: false,
      dataLoading: false,
      newTransport: {
        id: '',
        operation: '',
        mount: ''
      },
      currentTransport: {
        id: '',
        name: '',
        class: 1,
        lasttransport: '',
        mount: 0
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
      // reload transport data
      this.dataLoading = true
      var self = this
      setTimeout(function () { self.dataLoading = false }, 1000)
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
      this.newTransportDialogVisible = false
      // reload transport data
      this.dataLoading = true
      var self = this
      setTimeout(function () { self.dataLoading = false }, 1000)
    },
    handleTransport (row) {
      this.modifyTransportDialogVisible = true
      this.currentTransport.id = row.id
      this.currentTransport.name = row.name
      this.currentTransport.class = row.class
      this.currentTransport.lasttransport = row.lasttransport
      this.currentTransport.mount = row.remain
    },
    handleModifySubmit () {
      console.log('Modify transport......')
      console.log(this.currentTransport)
      this.modifyTransportDialogVisible = false
      this.dataLoading = true
      var self = this
      setTimeout(function () { self.dataLoading = false }, 1000)
    },
    handlePagination () {
      console.log('Page to ' + this.currentPage)
      // reload transport data
      this.dataLoading = true
      var self = this
      setTimeout(function () { self.dataLoading = false }, 1000)
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
    }
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
