<template>
<div>

  <div class="new_distributedbill_class" style="color: #606266;">
    <span>目前有
      <span style="color: #409EFF; font-size: 150%;">
        {{distributedData.distributed + distributedData.stationRejected}}
      </span>
      工单已经分配至具体工位；
    </span>
    <span>其中
      <span style="color: #67C23A; font-size: 150%;">{{distributedData.distributed}}</span>
      工单正在等待工位回复；
    </span>
    <span>同时有
      <span style="color: #F56C6C; font-size: 150%;">{{distributedData.stationRejected}}</span>
      工单被工位退回拒绝接受，等待进一步处理；
    </span>
    <span>退回率为
      <span style="color: #E6A23C; font-size: 150%;">{{(distributedData.stationRejected / (distributedData.distributed + distributedData.stationRejected)).toFixed(4) * 100}}%</span>
    </span>
  </div>

  <div class="search_distributedbill_part">
    <el-row>
      <span class="searchdistributedbilltip">工单编号：</span>
      <el-input placeholder="请输入工单编号"
        class='searchdistributedbillinput'
        type="number"
        v-model="searchDistributedBill.id"
        clearable/>

      <span class="searchdistributedbilltip">工单名称：</span>
      <el-input placeholder="请输入工单名称"
        class='searchdistributedbillinput'
        v-model="searchDistributedBill.name"
        clearable/>

      <span class="searchdistributedbilltip">产出物料种类：</span>
      <el-select v-model="searchDistributedBill.outputclass" placeholder="请选择种类"
        class='searchdistributedbillinput'>
        <el-option
          v-for="item in materialClass"
          v-if="item.id !== '1'"
          :key="item.id"
          :label="item.name"
          :value="item.id" />
      </el-select>

      <span class="searchdistributedbilltip">分配工位：</span>
      <el-input placeholder="请输入工位编号"
        class='searchdistributedbillinput'
        v-model="searchDistributedBill.station"
        type="number"
        clearable/>

    </el-row>

    <el-row>

      <span class="searchdistributedbilltip">产出物料编号：</span>
      <el-input placeholder="请输入产出物料编号"
        class='searchdistributedbillinput'
        v-model="searchDistributedBill.outputname"
        type="number"
        clearable/>

      <span class="searchdistributedbilltip">所需物料编号：</span>
      <el-input placeholder="请输入所需物料编号"
        class='searchdistributedbillinput'
        type="number"
        v-model="searchDistributedBill.materialname"
        clearable/>

      <span class="searchdistributedbilltip">订单状态</span>
      <el-select v-model="searchDistributedBill.billstatus" placeholder="请选择种类"
        class='searchdistributedbillinput'>
        <el-option
          v-for="item in billStatus"
          v-if="item.id === '2' || item.id === '3'"
          :key="item.id"
          :label="item.name"
          :value="item.id" />
      </el-select>

      <el-button icon="el-icon-search"
        :disabled='searchDisabled'
        style="margin-left: 40px;"
        type="primary" @click='handleSearch'>筛选工单</el-button>

    </el-row>
  </div>

  <el-table
    class="distributedbill_table_class"
    :data="testDistributedBill"
    :default-sort = "{prop: 'id', order: 'descending'}"
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
      width="120">
    </el-table-column>
    <el-table-column
      label="产出物料"
      align="center"
      width="120">
      <template slot-scope="scope">
        <span>{{scope.row.output}}*{{scope.row.outputMount}}</span>
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
      prop="estimateTime"
      sortable
      label="预计工时(时)"
      align="center"
      width="140">
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
      width="100">
      <template slot-scope="scope">
        <i class="el-icon-refresh" style="color: #67C23A;" v-if="scope.row.status===2"/>
        <i class="el-icon-circle-close" style="color: #F56C6C;" v-if="scope.row.status===3"/>
        <span style="color: #67C23A;" v-if="scope.row.status===2">
          {{billStatus[scope.row.status - 1].name}}
        </span>
        <span style="color: #F56C6C;" v-if="scope.row.status===3">
          {{billStatus[scope.row.status - 1].name}}
        </span>
      </template>
    </el-table-column>
    <el-table-column
      label="拒收原因"
      align="center"
      width="180">
      <template slot-scope="scope">
        <span v-if="scope.row.status===2">-</span>
        <el-popover
          v-if="scope.row.status===3"
          placement="top"
          width="250"
          trigger="hover">
          <div>
            {{scope.row.refuseReason}}
          </div>
          <div slot="reference">
              <span style="white-space: nowrap; text-overflow:ellipsis; overflow:hidden;">
                {{scope.row.refuseReason}}
              </span>
          </div>
        </el-popover>
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
      width="150">
      <template slot-scope="scope">
        <el-button type="text" size="small"
          @click='handleReDistribute(scope.row)'>重新分配</el-button>
        <el-button type="text" size="small" style="color: #F56C6C;"
          @click='handleDelete(scope.row.id)'>删除</el-button>
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
    title="重新分配工单"
    :visible.sync="reDistributingVisible"
    width="30%">
    <el-row>
      <div class='distributedbilltip'>工单编号：</div>
      <div class='distributedbillinput'>
        <span>{{distributeBill.id}}</span>
      </div>
    </el-row>
    <el-row>
      <div class='distributedbilltip'>工单名称：</div>
      <div class='distributedbillinput'>
        <span>{{distributeBill.name}}</span>
      </div>
    </el-row>
    <el-row>
      <div class='distributedbilltip'>分配工位：</div>
      <div class='distributedbillinput'>
        <el-input placeholder="请输入工位编号"
          class='billinput'
          v-model="distributeBill.stationId"
          clearable/>
      </div>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="reDistributingVisible = false">取 消</el-button>
      <el-button type="primary"
        @click="handleReDistributeSubmit"
        :disabled="distributeDisabled">确认重新分配</el-button>
    </span>
  </el-dialog>

</div>
</template>

<script>
import billstatus from '../../../config_new/billstatus.js'
import materialclass from '../../../config_new/materialclass.js'
// import testdistributedbill from '../../../config_new/testdistributedbill.js'

export default {
  name: 'Distributed',
  data () {
    return {
      billStatus: billstatus,
      materialClass: materialclass,
      testDistributedBill: [],
      editDistributedBillVisible: false,
      reDistributingVisible: false,
      dataLoading: false,
      distributedData: {
        distributed: 0,
        stationRejected: 0
      },
      searchDistributedBill: {
        id: '',
        name: '',
        outputclass: '',
        outputname: '',
        materialname: '',
        billstatus: '待接收',
        station: ''
      },
      pagination: {
        pageSize: 15,
        total: 0,
        currentPage: 1
      },
      distributeBill: {
        id: '',
        name: '',
        stationId: ''
      }
    }
  },
  methods: {
    handleSearch () {
      this.reloadData()
    },
    reloadData () {
      console.log('Reload Data......')
      this.dataLoading = true
      var id = 0
      if (this.searchDistributedBill.id !== '') {
        id = this.searchDistributedBill.id
      }
      var kind = 0
      if (this.searchDistributedBill.outputclass !== '') {
        kind = this.searchDistributedBill.outputclass
      }
      var output = 0
      if (this.searchDistributedBill.outputname !== '') {
        output = this.searchDistributedBill.outputname
      }
      var material = 0
      if (this.searchDistributedBill.materialname !== '') {
        material = this.searchDistributedBill.materialname
      }
      var station = 0
      if (this.searchDistributedBill.staion !== '') {
        station = this.searchDistributedBill.station
      }
      var status = 2
      if (this.searchDistributedBill.billstatus !== '待接收') {
        status = this.searchDistributedBill.billstatus
      }
      this.$axios({
        method: 'get',
        url: this.GLOBAL.backEndIp + '/api/bill/findwithstatus',
        params: {
          id: id,
          name: this.searchDistributedBill.name,
          kind: kind,
          status: status,
          output: output,
          material: material,
          stationId: station,
          page: this.pagination.currentPage - 1
        }
      }).then(response => {
        if (response.data.code === 1) {
          this.testDistributedBill = response.data.data
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
    handleDelete (id) {
      this.$confirm('此操作将删除该工单，请谨慎操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios({
          method: 'post',
          url: this.GLOBAL.backEndIp + '/api/bill/delete',
          params: {
            billId: id
          }
        }).then(response => {
          if (response.data.code === 1) {
            this.$message({
              message: '删除成功。',
              type: 'success'
            })
            this.reloadData()
          } else {
            this.$message({
              message: '删除失败。' + '错误原因：' + response.data.code + '-' + response.data.message,
              type: 'error'
            })
          }
        }).catch(error => {
          this.$message({
            message: '删除错误。' + '错误原因：' + error.response.status,
            type: 'error'
          })
        })
      }).catch(() => {})
    },
    handleReDistribute (row) {
      this.reDistributingVisible = true
      this.distributeBill = {
        id: row.id,
        name: row.name,
        stationId: row.distributedStation
      }
    },
    handleReDistributeSubmit (row) {
      this.$axios({
        method: 'post',
        url: this.GLOBAL.backEndIp + '/api/bill/distribute',
        params: {
          stationId: this.distributeBill.stationId,
          billId: this.distributeBill.id
        }
      }).then(response => {
        if (response.data.code === 1) {
          this.$message({
            message: '分配成功。',
            type: 'success'
          })
          this.reDistributingVisible = false
          this.reloadData()
        } else {
          this.$message({
            message: '分配失败。' + '错误原因：' + response.data.code + '-' + response.data.message,
            type: 'error'
          })
        }
      }).catch(error => {
        this.$message({
          message: '分配错误。' + '错误原因：' + error.response.status,
          type: 'error'
        })
      })
    },
    handlePagination () {
      this.reloadData()
    }
  },
  mounted () {
    this.reloadData()
    this.$axios({
      method: 'get',
      url: this.GLOBAL.backEndIp + '/api/bill/alldata'
    }).then(response => {
      if (response.data.code === 1) {
        this.$message({
          message: '查询成功。',
          type: 'success'
        })
        this.distributedData = {
          distributed: response.data.waiting + response.data.refused,
          stationRejected: response.data.refused
        }
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
  },
  computed: {
    searchDisabled () {
      return this.searchDistributedBill.id === '' &&
        this.searchDistributedBill.name === '' &&
        this.searchDistributedBill.outputclass === '' &&
        this.searchDistributedBill.outputname === '' &&
        this.searchDistributedBill.materialname === '' &&
        this.searchDistributedBill.billstatus === '' &&
        this.searchDistributedBill.station === ''
    },
    distributeDisabled () {
      return this.distributeBill.stationId === ''
    }
  }
}
</script>

<style>
.search_distributedbill_part {
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.searchdistributedbilltip {
  width: 8%;
  margin-left: 5px;
  margin-top: 10px;
  margin-bottom: 20px;
  color: #606266;
  text-align: right;
  display: inline-block;
  white-space:nowrap;
}
.searchdistributedbillinput {
  width: 14%;
  display: inline-block;
  white-space:nowrap;
}
.new_distributedbill_class {
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.pagination_class {
  margin: 40px;
  text-align: center;
}
.distributedbilltip {
  display: inline-block;
  width: 25%;
  text-align: right;
  vertical-align: center;
  margin-top: 10px;
  white-space:nowrap;
}
.distributedbillinput {
  display: inline-block;
  width: 70%;
  margin-top: 10px;
  white-space:nowrap;
}
.distributedbillinputsp {
  display: inline-block;
  width: 70%;
  margin-top: 10px;
}
</style>
