<template>
<div>

  <div class="new_producingbill_class" style="color: #606266;">
    <span>目前有
      <span style="color: #409EFF; font-size: 150%;">
        {{producingData.producing}}
      </span>
      工单正在工位进行生产；
    </span>
    <span>其中
      <span style="color: #F56C6C; font-size: 150%;">{{producingData.overTime}}</span>
      工单生产已经超时；
    </span>
    <span>超时率为
      <span style="color: #E6A23C; font-size: 150%;">
        {{((producingData.overTime / producingData.producing).toFixed(3)) * 100}}%
      </span>
    </span>
  </div>

  <div class="search_producingbill_part">
    <el-row>
      <span class="searchproducingbilltip">工单编号：</span>
      <el-input placeholder="请输入工单编号"
        class='searchproducingbillinput'
        v-model="searchProducingBill.id"
        clearable/>

      <span class="searchproducingbilltip">工单名称：</span>
      <el-input placeholder="请输入工单名称"
        class='searchproducingbillinput'
        v-model="searchProducingBill.name"
        clearable/>

      <span class="searchproducingbilltip">产出物料种类：</span>
      <el-select v-model="searchProducingBill.outputclass" placeholder="请选择种类"
        class='searchproducingbillinput'>
        <el-option
          v-for="item in materialClass"
          v-if="item.id !== '1'"
          :key="item.id"
          :label="item.name"
          :value="item.id" />
      </el-select>

      <span class="searchproducingbilltip">分配工位：</span>
      <el-input placeholder="请输入工位编号"
        class='searchproducingbillinput'
        type="number"
        v-model="searchProducingBill.station"
        clearable/>

    </el-row>

    <el-row>

      <span class="searchproducingbilltip">产出物料编号：</span>
      <el-input placeholder="请输入产出物料名称"
        class='searchproducingbillinput'
        type="number"
        v-model="searchProducingBill.outputname"
        clearable/>

      <span class="searchproducingbilltip">所需物料编号：</span>
      <el-input placeholder="请输入所需物料名称"
        type="number"
        class='searchproducingbillinput'
        v-model="searchProducingBill.materialname"
        clearable/>

      <span class="searchproducingbilltip">订单状态</span>
      <el-select v-model="searchProducingBill.billstatus" placeholder="请选择种类"
        class='searchproducingbillinput'>
        <el-option
          v-for="item in billStatus"
          v-if="item.id === '4' || item.id === '5'"
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
    class="producingbill_table_class"
    :data="testProducingBill"
    size="small"
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
      sortable
      label="剩余时间"
      align="center"
      width="100">
      <template slot-scope="scope">
        <span style="color: #E6A23C;" v-if="scope.row.status===4">
          {{getRemainTime(scope.row.estimateTime, scope.row.acceptedTime)}}小时</span>
        <span style="color: #F56C6C;" v-if="scope.row.status===5">
          {{getRemainTime(scope.row.estimateTime, scope.row.acceptedTime)}}小时</span>
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
      width="200">
      <template slot-scope="scope">
        <i class="el-icon-refresh" style="color: #67C23A;" v-if="scope.row.status===4"/>
        <i class="el-icon-circle-close" style="color: #F56C6C;" v-if="scope.row.status===5"/>
        <span style="color: #67C23A;" v-if="scope.row.status===4">
          {{billStatus[scope.row.status - 1].name}}
        </span>
        <span style="color: #F56C6C;" v-if="scope.row.status===5">
          {{billStatus[scope.row.status - 1].name}}
        </span>
        <el-progress
          v-if="scope.row.status===4"
          :percentage="getPercentage(scope.row.estimateTime, scope.row.acceptedTime)"/>
        <el-progress
          v-if="scope.row.status===5"
          :percentage="100" status="exception"/>
      </template>
    </el-table-column>
    <el-table-column
      label="已分配物料"
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
          @click='handleReDistribute(scope.row)'>重新分配工时</el-button>
        <el-button type="text" size="small" style="color: #E6A23C;"
          @click='handleStop(scope.row.id)'>暂停生产</el-button>
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
    title="重新分配时间"
    :visible.sync="reDistributingVisible"
    width="30%">
    <el-row>
      <div class='producingbilltip'>工单编号：</div>
      <div class='producingbillinput'>
        <span>{{distributeTime.id}}</span>
      </div>
    </el-row>
    <el-row>
      <div class='producingbilltip'>工单名称：</div>
      <div class='producingbillinput'>
        <span>{{distributeTime.name}}</span>
      </div>
    </el-row>
    <el-row>
      <div class='producingbilltip'>分配工位：</div>
      <div class='producingbillinput'>
        <span>{{distributeTime.stationId}}</span>
      </div>
    </el-row>
    <el-row>
      <div class='producingbilltip'>分配时间：</div>
      <div class='producingbillinput'>
        <el-input-number v-model="distributeTime.time" :min="1" :max="99999"></el-input-number>
      </div>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="reDistributingVisible = false">取 消</el-button>
      <el-button type="primary"
        @click="handleReDistributeSubmit">确认重新分配</el-button>
    </span>
  </el-dialog>

</div>
</template>

<script>
import billstatus from '../../../config_new/billstatus.js'
import materialclass from '../../../config_new/materialclass.js'
// import testproducingbill from '../../../config_new/testproducingbill.js'

export default {
  name: 'Producing',
  data () {
    return {
      billStatus: billstatus,
      materialClass: materialclass,
      testProducingBill: [],
      editProducingBillVisible: false,
      reDistributingVisible: false,
      dataLoading: false,
      producingData: {
        producing: 0,
        overTime: 0
      },
      searchProducingBill: {
        id: '',
        name: '',
        outputclass: '',
        outputname: '',
        materialname: '',
        station: '',
        billstatus: '生产中'
      },
      distributeTime: {
        id: '',
        name: '',
        stationId: '',
        time: 0
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
      console.log('Searching...')
      console.log(this.searchProducingBill)
      this.reloadData()
    },
    reloadData () {
      console.log('Reload Data......')
      this.dataLoading = true
      var id = 0
      if (this.searchProducingBill.id !== '') {
        id = this.searchProducingBill.id
      }
      var kind = 0
      if (this.searchProducingBill.outputclass !== '') {
        kind = this.searchProducingBill.outputclass
      }
      var output = 0
      if (this.searchProducingBill.outputname !== '') {
        output = this.searchProducingBill.outputname
      }
      var material = 0
      if (this.searchProducingBill.materialname !== '') {
        material = this.searchProducingBill.materialname
      }
      var station = 0
      if (this.searchProducingBill.staion !== '') {
        station = this.searchProducingBill.station
      }
      var status = 4
      if (this.searchProducingBill.billstatus !== '生产中') {
        status = this.searchProducingBill.billstatus
      }
      this.$axios({
        method: 'get',
        url: this.GLOBAL.backEndIp + '/api/bill/findwithstatus',
        params: {
          id: id,
          name: this.searchProducingBill.name,
          kind: kind,
          status: status,
          output: output,
          material: material,
          stationId: station,
          page: this.pagination.currentPage - 1
        }
      }).then(response => {
        if (response.data.code === 1) {
          this.testProducingBill = response.data.data
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
    handleStop (id) {
      this.$confirm('我们极其不推荐进行此操作，此操作会导致该工单物料无法自动回收。如果需要，请前往单工位管理处停止工单，请谨慎操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.$axios({
          method: 'get',
          url: this.GLOBAL.backEndIp + '/api/bill/stopproduce',
          params: {
            id: id
          }
        }).then(response => {
          if (response.data.code === 1) {
            this.$message({
              message: '暂停生产成功。',
              type: 'success'
            })
            this.reloadData()
          } else {
            this.$message({
              message: '暂停生产失败。' + '错误原因：' + response.data.code + '-' + response.data.message,
              type: 'error'
            })
          }
        }).catch(error => {
          this.$message({
            message: '暂停生产错误。' + '错误原因：' + error.response.status,
            type: 'error'
          })
        })
      }).catch(() => {})
    },
    handleReDistribute (row) {
      this.reDistributingVisible = true
      this.distributeTime = {
        id: row.id,
        name: row.name,
        stationId: row.station + '号工位',
        time: row.estimatetime
      }
    },
    handleReDistributeSubmit (row) {
      this.$axios({
        method: 'get',
        url: this.GLOBAL.backEndIp + '/api/bill/redistributetime',
        params: {
          id: this.distributeTime.id,
          time: this.distributeTime.time
        }
      }).then(response => {
        if (response.data.code === 1) {
          this.$message({
            message: '重新分配成功。',
            type: 'success'
          })
          this.reDistributingVisible = false
          this.reloadData()
        } else {
          this.$message({
            message: '重新分配失败。' + '错误原因：' + response.data.code + '-' + response.data.message,
            type: 'error'
          })
        }
      }).catch(error => {
        this.$message({
          message: '重新分配错误。' + '错误原因：' + error.response.status,
          type: 'error'
        })
      })
    },
    handlePagination () {
      this.reloadData()
    },
    getRemainTime (estimateTime, acceptedTime) {
      var dateStrs = acceptedTime.split('T')[0].split('-')
      var timeStrs = acceptedTime.split('T')[1].split('.')[0].split(':')
      var year = parseInt(dateStrs[0], 10)
      var month = parseInt(dateStrs[1], 10)
      var day = parseInt(dateStrs[2], 10)
      var hour = parseInt(timeStrs[0], 10)
      var minute = parseInt(timeStrs[1], 10)
      var second = parseInt(timeStrs[2], 10)
      var accTime = new Date(year, month - 1, day, hour, minute, second)
      accTime.setHours(accTime.getHours() + estimateTime)
      var now = new Date()
      var usedTime = accTime - now
      var result = (usedTime / (1000 * 60 * 60)).toFixed(2)
      return result
    },
    getPercentage (estimateTime, acceptedTime) {
      return ((estimateTime - this.getRemainTime(estimateTime, acceptedTime)) / estimateTime).toFixed(4) * 100
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
        this.producingData = {
          producing: response.data.producing + response.data.overtime,
          overTime: response.data.overtime
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
      return this.searchProducingBill.id === '' &&
        this.searchProducingBill.name === '' &&
        this.searchProducingBill.outputclass === '' &&
        this.searchProducingBill.outputname === '' &&
        this.searchProducingBill.materialname === '' &&
        this.searchProducingBill.station === '' &&
        this.searchProducingBill.billstatus === ''
    }
  }
}
</script>

<style>
.search_producingbill_part {
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.searchproducingbilltip {
  width: 8%;
  margin-left: 5px;
  margin-top: 10px;
  margin-bottom: 20px;
  color: #606266;
  text-align: right;
  display: inline-block;
  white-space:nowrap;
}
.searchproducingbillinput {
  width: 14%;
  display: inline-block;
  white-space:nowrap;
}
.new_producingbill_class {
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.pagination_class {
  margin: 40px;
  text-align: center;
}
.producingbilltip {
  display: inline-block;
  width: 25%;
  text-align: right;
  vertical-align: center;
  margin-top: 10px;
  white-space:nowrap;
}
.producingbillinput {
  display: inline-block;
  width: 70%;
  margin-top: 10px;
  white-space:nowrap;
}
.producingbillinputsp {
  display: inline-block;
  width: 70%;
  margin-top: 10px;
}
</style>
