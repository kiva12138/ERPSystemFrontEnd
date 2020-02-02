<template>
<div>

  <div class="search_bill_part">
    <el-row>
      <span class="searchbilltip">工单编号：</span>
      <el-input placeholder="请输入工单编号"
        class='searchbillinput'
        v-model="searchBill.id"
        clearable/>

      <span class="searchbilltip">工单名称：</span>
      <el-input placeholder="请输入工单名称"
        class='searchbillinput'
        v-model="searchBill.name"
        clearable/>

      <span class="searchbilltip">产出物料种类：</span>
      <el-select v-model="searchBill.outputclass" placeholder="请选择种类"
        class='searchbillinput'>
        <el-option
          v-for="item in materialClass"
          v-if="item.id !== '1'"
          :key="item.id"
          :label="item.name"
          :value="item.id" />
      </el-select>

    </el-row>

    <el-row>

      <span class="searchbilltip">产出物料编号：</span>
      <el-input placeholder="请输入产出物料编号"
        class='searchbillinput'
        type="number"
        v-model="searchBill.outputname"
        clearable/>

      <span class="searchbilltip">所需物料编号：</span>
      <el-input placeholder="请输入所需物料编号"
        class='searchbillinput'
        type="number"
        v-model="searchBill.materialname"
        clearable/>

      <span class="searchbilltip">订单状态</span>
      <el-select v-model="searchBill.billstatus" placeholder="请选择种类"
        class='searchbillinput'>
        <el-option
          v-for="item in billStatus"
          v-if="item.id === '7' || item.id === '8'"
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

  <div style="margin: 10px;">
    <el-button size="small" @click='handleDeleteMul()'
      icon="el-icon-delete"
      type="danger" :disabled="deleteDisabled">
      永久删除选中工单
    </el-button>
  </div>

  <el-table
    class="bill_table_class"
    :data="testCompleteBill"
    size="small"
    :default-sort = "{prop: 'id', order: 'descending'}"
    stripe
    v-loading="dataLoading"
    @selection-change="handleSelectionChange"
    style="width: 100%;">
    <el-table-column
      type="selection"
      width="50"/>
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
      label="分配工位"
      align="center"
      prop="station"
      width="100">
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
      label="实际工时"
      align="center"
      width="100">
      <template slot-scope="scope">
        <span v-if="scope.row.status===7">
          {{getActualTime(scope.row.acceptedTime, scope.row.completeTime)}}小时
        </span>
        <span v-if="scope.row.status===8">
          {{getActualTime(scope.row.acceptedTime, scope.row.stoppedTime)}}小时
        </span>
      </template>
    </el-table-column>
    <el-table-column
      label="状态"
      align="center"
      width="100">
      <template slot-scope="scope">
        <i class="el-icon-circle-check" style="color: #67C23A;" v-if="scope.row.status===7"/>
        <span style="color: #67C23A;" v-if="scope.row.status===7">
          {{billStatus[scope.row.status - 1].name}}
        </span>
        <i class="el-icon-circle-close" style="color: #F56C6C;" v-if="scope.row.status===8"/>
        <span style="color: #F56C6C;" v-if="scope.row.status===8">
          {{billStatus[scope.row.status - 1].name}}
        </span>
      </template>
    </el-table-column>
    <el-table-column
      sortable
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
        <el-button type="text" size="small" style="color: #F56C6C;"
          @click='handleDelete(scope.row.id)'>永久删除</el-button>
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

</div>
</template>

<script>
import billstatus from '../../../config_new/billstatus.js'
import materialclass from '../../../config_new/materialclass.js'
// import testcompletebill from '../../../config_new/testcompletebill.js'

export default {
  name: 'Completed',
  data () {
    return {
      billStatus: billstatus,
      materialClass: materialclass,
      testCompleteBill: [],
      dataLoading: false,
      searchBill: {
        id: '',
        name: '',
        outputclass: '',
        outputname: '',
        materialname: '',
        billstatus: '已完成'
      },
      pagination: {
        pageSize: 15,
        total: 0,
        currentPage: 1
      },
      multipleSelection: []
    }
  },
  methods: {
    handleSearch () {
      console.log(this.searchBill)
      this.reloadData()
    },
    reloadData () {
      console.log('Reload Data......')
      this.dataLoading = true
      var id = 0
      if (this.searchBill.id !== '') {
        id = this.searchBill.id
      }
      var kind = 0
      if (this.searchBill.outputclass !== '') {
        kind = this.searchBill.outputclass
      }
      var output = 0
      if (this.searchBill.outputname !== '') {
        output = this.searchBill.outputname
      }
      var material = 0
      if (this.searchBill.materialname !== '') {
        material = this.searchBill.materialname
      }
      var status = 7
      if (this.searchBill.billstatus !== '已完成') {
        status = this.searchBill.billstatus
      }
      this.$axios({
        method: 'get',
        url: this.GLOBAL.backEndIp + '/api/bill/findwithstatus',
        params: {
          id: id,
          name: this.searchBill.name,
          kind: kind,
          status: status,
          output: output,
          material: material,
          stationId: 0,
          page: this.pagination.currentPage - 1
        }
      }).then(response => {
        if (response.data.code === 1) {
          this.testCompleteBill = response.data.data
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
      console.log(id)
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
    handleDeleteMul () {
      console.log(this.multipleSelection)
      this.$confirm('此操作将删除所选工单，请谨慎操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        for (var i = 0; i < this.multipleSelection.length; i++) {
          this.$axios({
            method: 'post',
            url: this.GLOBAL.backEndIp + '/api/bill/delete',
            params: {
              billId: this.multipleSelection[i].id
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
        }
      }).catch(() => {})
    },
    handlePagination () {
      console.log('Page to ' + this.pagination.currentPage)
      this.reloadData()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    getActualTime (acceptedTime, completeTime) {
      var dateStrs = acceptedTime.split('T')[0].split('-')
      var timeStrs = acceptedTime.split('T')[1].split('.')[0].split(':')
      var year = parseInt(dateStrs[0], 10)
      var month = parseInt(dateStrs[1], 10)
      var day = parseInt(dateStrs[2], 10)
      var hour = parseInt(timeStrs[0], 10)
      var minute = parseInt(timeStrs[1], 10)
      var second = parseInt(timeStrs[2], 10)
      var accTime = new Date(year, month - 1, day, hour, minute, second)

      dateStrs = completeTime.split('T')[0].split('-')
      timeStrs = completeTime.split('T')[1].split('.')[0].split(':')
      year = parseInt(dateStrs[0], 10)
      month = parseInt(dateStrs[1], 10)
      day = parseInt(dateStrs[2], 10)
      hour = parseInt(timeStrs[0], 10)
      minute = parseInt(timeStrs[1], 10)
      second = parseInt(timeStrs[2], 10)
      var comTime = new Date(year, month - 1, day, hour, minute, second)

      var usedTime = comTime - accTime
      var result = (usedTime / (1000 * 60 * 60)).toFixed(2)
      return result
    }
  },
  mounted () {
    this.reloadData()
  },
  computed: {
    searchDisabled () {
      return this.searchBill.id === '' &&
        this.searchBill.name === '' &&
        this.searchBill.outputclass === '' &&
        this.searchBill.outputname === '' &&
        this.searchBill.materialname === '' &&
        this.searchBill.billstatus === ''
    },
    deleteDisabled () {
      return this.multipleSelection.length === 0
    }
  }
}
</script>

<style>
.search_bill_part {
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.searchbilltip {
  width: 10%;
  margin-left: 5px;
  margin-top: 10px;
  margin-bottom: 20px;
  color: #606266;
  text-align: right;
  display: inline-block;
  white-space:nowrap;
}
.searchbillinput {
  width: 15%;
  display: inline-block;
  white-space:nowrap;
}
.pagination_class {
  margin: 40px;
  text-align: center;
}
</style>
