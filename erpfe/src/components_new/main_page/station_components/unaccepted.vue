<template>
<div>
  <SelectStation/>
  <div v-if="selectStationId===''"
    style="color: #606266; text-align: center; font-size: 200%; padding-top: 20%;">
    请首先选择工位。
  </div>
  <div v-else>
    <el-table
      class="stationunacceptedbill_table_class"
      :data="testStationUnacceptedBill"
      :default-sort = "{prop: 'id', order: 'descending'}"
      size="small"
      stripe
      v-loading="dataLoading"
      style="width: 100%;">
      <el-table-column
        fixed="left"
        prop="id"
        sortable
        label="工单编号"
        align="center"
        width="110">
      </el-table-column>
      <el-table-column
        prop="name"
        sortable
        label="工单名称"
        align="center"
        width="100">
      </el-table-column>
      <el-table-column
        label="产出物料"
        align="center"
        width="100">
        <template slot-scope="scope">
          <span>{{scope.row.output}} * {{scope.row.outputMount}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="产出类型"
        align="center"
        width="100">
        <template slot-scope="scope">
          <span>{{materialClass[scope.row.outputKind - 1].name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        label="预计工时"
        align="center"
        width="100">
        <template slot-scope="scope">
          <span>{{scope.row.estimateTime}}小时</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="station"
        sortable
        label="分配工位"
        align="center"
        width="100">
      </el-table-column>
      <el-table-column
        label="状态"
        align="center"
        width="150">
        <template slot-scope="scope">
          <i class="el-icon-refresh" style="color: #67C23A;"/>
          <span style="color: #67C23A;">
            {{billStatus[scope.row.status - 1].name}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="所需物料"
        align="center"
        width="180">
        <template slot-scope="scope">
          <el-popover
            placement="top"
            width="250"
            trigger="hover">
            <div v-for="(mitem, index1) in scope.row.materials" :key="index1">
              <span style="color: #C0C4CC">{{mitem.id}}</span>
              <span> {{mitem.name}}</span>
            </div>
            <div slot="reference">
                <span v-for="(item, index) in scope.row.materials" :key="index"
                style="white-space: nowrap; text-overflow:ellipsis; overflow:hidden;">
                  {{item.name}} </span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        width="180"
        label="描述">
        <template slot-scope="scope">
          <el-popover
            placement="top"
            width="250"
            trigger="hover">
            <div>
              {{scope.row.description}}
            </div>
            <div slot="reference">
              <span style="white-space: nowrap; text-overflow:ellipsis; overflow:hidden;">
                {{scope.row.description}}
              </span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="200">
        <template slot-scope="scope">
          <el-button type="text" size="small"
            @click='handleAccept(scope.row.id)'>接收任务</el-button>
          <el-button type="text" size="small" style="color: #E6A23C;"
            @click='handleRefuse(scope.row)'>拒绝接收任务</el-button>
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
      :modal="false"
      title="拒绝接收任务"
      :visible.sync="refuseDialogVisible"
      width="30%">
      <el-row>
        <div class='stationunacceptedbilltip'>工单编号：</div>
        <div class='stationunacceptedbillinput'>
          <span>{{currentBill.id}}</span>
        </div>
      </el-row>
      <el-row>
        <div class='stationunacceptedbilltip'>工单名称：</div>
        <div class='stationunacceptedbillinput'>
          <span>{{currentBill.name}}</span>
        </div>
      </el-row>
      <el-row>
        <div class='stationunacceptedbilltip'>任务状态：</div>
        <div class='stationunacceptedbillinput'>
          <span>{{billStatus[currentBill.status].name}}</span>
        </div>
      </el-row>
      <el-row>
        <div class='stationunacceptedbilltip'>预计工时：</div>
        <div class='stationunacceptedbillinput'>
          <span>{{currentBill.estimatetime}}小时</span>
        </div>
      </el-row>
      <el-row>
        <div class='stationunacceptedbilltip'>产出物料：</div>
        <div class='stationunacceptedbillinput'>
          <span>{{currentBill.output}} * {{currentBill.outputmount}}</span>
        </div>
      </el-row>
      <el-row>
        <div class='stationunacceptedbilltip'>所需物料：</div>
        <div class='stationunacceptedbillinput'>
          <span v-for="(item, index) in currentBill.material" :key="index"> {{item.name}}
          </span>
        </div>
      </el-row>
      <el-row>
        <div class='stationunacceptedbilltip'>拒收原因：</div>
        <div class='stationunacceptedbillinput'>
          <el-select v-model="refuseKind" placeholder="请选择拒绝原因">
            <el-option
              v-for="item in refuseReasons"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
      </el-row>
      <el-row>
        <div class='stationunacceptedbilltip'>拒收附加信息：</div>
        <div class='stationunacceptedbillinput'>
          <el-input :clearable="true" v-model="refuseReason"
            placeholder="请输入拒绝原因" class="stationunacceptedbillinput"/>
        </div>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="refuseDialogVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="searchRefuseDisabled"
          @click="handleRefuseSubmit">确认拒绝</el-button>
      </span>
    </el-dialog>
  </div>

</div>
</template>

<script>
import selectstation from './select_components/selectstation.vue'
import billstatus from '../../../config_new/billstatus.js'
import materialclass from '../../../config_new/materialclass.js'
import refusereason from '../../../config_new/refusereason.js'
// import teststationunaccbill from '../../../config_new/teststationunaccepted.js'

export default {
  name: 'Unaccepted',
  components: {
    'SelectStation': selectstation
  },
  data () {
    return {
      selectStationId: '',
      billStatus: billstatus,
      refuseReasons: refusereason,
      refuseKind: '',
      materialClass: materialclass,
      testStationUnacceptedBill: [],
      dataLoading: false,
      refuseDialogVisible: false,
      pagination: {
        pageSize: 10,
        total: 5,
        currentPage: 1
      },
      refuseReason: '',
      currentBill: {
        id: '',
        name: '',
        status: 2,
        output: '',
        outputmount: 3,
        estimatetime: 72,
        refuseReason: 1,
        material: []
      }
    }
  },
  methods: {
    reloadData () {
      console.log('Reload Data......')
      this.dataLoading = true
      this.$axios({
        method: 'get',
        url: this.GLOBAL.backEndIp + '/api/bill/findwithstatus',
        params: {
          id: 0,
          name: '',
          kind: 0,
          status: 2,
          output: 0,
          material: 0,
          stationId: this.selectStationId,
          page: this.pagination.currentPage - 1
        }
      }).then(response => {
        if (response.data.code === 1) {
          this.testStationUnacceptedBill = response.data.data
          this.pagination.total = response.data.allLength
        } else {
          this.$message({
            message: '查询失败。' + '错误原因：' + response.data.code + '-' + response.data.message,
            type: 'error'
          })
        }
      }).catch(error => {
        this.$message({
          message: '查询错误。' + '错误原因：' + error.response.status,
          type: 'error'
        })
      })
      this.dataLoading = false
    },
    handleAccept (id) {
      this.$axios({
        method: 'post',
        url: this.GLOBAL.backEndIp + '/api/bill/accept',
        params: {
          billId: id
        }
      }).then(response => {
        if (response.data.code === 1) {
          this.$message({
            message: '接收成功。',
            type: 'success'
          })
          this.reloadData()
        } else {
          this.$message({
            message: '接收失败。' + '错误原因：' + response.data.code + '-' + response.data.message,
            type: 'error'
          })
        }
      }).catch(error => {
        this.$message({
          message: '接收错误。' + '错误原因：' + error.response.status,
          type: 'error'
        })
      })
    },
    handleRefuse (row) {
      this.currentBill = {
        id: row.id,
        name: row.name,
        status: row.status,
        output: row.output,
        outputmount: row.outputMount,
        estimatetime: row.estimateTime,
        material: row.materials
      }
      this.refuseDialogVisible = true
    },
    handleRefuseSubmit () {
      this.$axios({
        method: 'post',
        url: this.GLOBAL.backEndIp + '/api/bill/refuse',
        params: {
          billId: this.currentBill.id,
          reason: this.refuseReason,
          kind: this.refuseKind
        }
      }).then(response => {
        if (response.data.code === 1) {
          this.$message({
            message: '拒绝成功。',
            type: 'success'
          })
          this.refuseDialogVisible = false
          this.reloadData()
        } else {
          this.$message({
            message: '拒绝失败。' + '错误原因：' + response.data.code + '-' + response.data.message,
            type: 'error'
          })
        }
      }).catch(error => {
        this.$message({
          message: '拒绝错误。' + '错误原因：' + error.response.status,
          type: 'error'
        })
      })
      this.refuseDialogVisible = false
    },
    handlePagination () {
      this.reloadData()
    }
  },
  mounted () {
    this.reloadData()
    if (this.$cookies.isKey('selectStationId')) {
      this.selectStationId = this.$cookies.get('selectStationId')
      this.reloadData()
    }
  },
  computed: {
    searchRefuseDisabled () {
      return this.refuseReason === '' || this.refuseKind === ''
    }
  }
}
</script>

<style>
.pagination_class {
  margin: 40px;
  text-align: center;
}
.stationunacceptedbilltip {
  display: inline-block;
  width: 25%;
  text-align: right;
  vertical-align: center;
  margin-top: 10px;
  white-space:nowrap;
}
.stationunacceptedbillinput {
  display: inline-block;
  width: 70%;
  margin-top: 10px;
  white-space:nowrap;
}
</style>
