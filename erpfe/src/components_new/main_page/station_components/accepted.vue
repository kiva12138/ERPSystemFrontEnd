<template>
<div>
  <SelectStation/>
  <div v-if="selectStationId===''"
    style="color: #606266; text-align: center; font-size: 200%; padding-top: 20%;">
    请首先选择工位。
  </div>
  <div v-else>
    <el-table
      class="stationacceptedbill_table_class"
      :data="testStationAcceptedBill"
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
          <span>{{scope.row.output}} * {{scope.row.outputmount}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="产出类型"
        align="center"
        width="100">
        <template slot-scope="scope">
          <span>{{materialClass[scope.row.outputclass - 1].name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        label="预计工时"
        align="center"
        width="100">
        <template slot-scope="scope">
          <span>{{scope.row.estimatetime}}小时</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="distributedStation"
        sortable
        label="分配工位"
        align="center"
        width="100">
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
            <div v-for="(mitem, index1) in scope.row.material" :key="index1">
              <span style="color: #C0C4CC">{{mitem.id}}</span>
              <span> {{mitem.name}}</span>
            </div>
            <div slot="reference">
                <span v-for="(item, index) in scope.row.material" :key="index"
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
            @click='handleProduce(scope.row)'>分配任务并进行生产</el-button>
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
      title="分配任务至具体设备并生产"
      :visible.sync="refuseDialogVisible"
      width="30%">
      <el-row>
        <div class='stationacceptedbilltip'>工单编号：</div>
        <div class='stationacceptedbillinput'>
          <span>{{currentBill.id}}</span>
        </div>
      </el-row>
      <el-row>
        <div class='stationacceptedbilltip'>工单名称：</div>
        <div class='stationacceptedbillinput'>
          <span>{{currentBill.name}}</span>
        </div>
      </el-row>
      <el-row>
        <div class='stationacceptedbilltip'>预计工时：</div>
        <div class='stationacceptedbillinput'>
          <span>{{currentBill.estimatetime}}小时</span>
        </div>
      </el-row>
      <el-row>
        <div class='stationacceptedbilltip'>产出物料：</div>
        <div class='stationacceptedbillinput'>
          <span>{{currentBill.output}} * {{currentBill.outputmount}}</span>
        </div>
      </el-row>
      <el-row>
        <div class='stationacceptedbilltip'>所需物料：</div>
        <div class='stationacceptedbillinput'>
          <span v-for="(item, index) in currentBill.material" :key="index"> {{item.name}}
          </span>
        </div>
      </el-row>
      <el-row>
        <div class='stationacceptedbilltip'>分配设备编号：</div>
        <div class='stationacceptedbillinput'>
          <el-input :clearable="true" v-model="equipmentid"
            placeholder="请输入设备编号" class="stationacceptedbillinput"/>
        </div>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="refuseDialogVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="searchRefuseDisabled"
          @click="handleRefuseSubmit">确认分配</el-button>
      </span>
    </el-dialog>

  </div>
</div>
</template>

<script>
import selectstation from './select_components/selectstation.vue'
import billstatus from '../../../config_new/billstatus.js'
import materialclass from '../../../config_new/materialclass.js'
import teststationunaccbill from '../../../config_new/teststationaccepted.js'

export default {
  name: 'Accepted',
  components: {
    'SelectStation': selectstation
  },
  data () {
    return {
      selectStationId: '',
      billStatus: billstatus,
      materialClass: materialclass,
      testStationAcceptedBill: teststationunaccbill,
      dataLoading: false,
      refuseDialogVisible: false,
      pagination: {
        pageSize: 10,
        total: 5,
        currentPage: 1
      },
      equipmentid: '',
      currentBill: {
        id: '',
        name: '',
        output: '',
        outputmount: 3,
        estimatetime: 72,
        material: []
      }
    }
  },
  methods: {
    reloadData () {
      console.log('Reload Data......')
      this.dataLoading = true
      var self = this
      setTimeout(function () { self.dataLoading = false }, 1000)
    },
    handleProduce (row) {
      console.log('Produce......')
      console.log(row.id)
      this.currentBill = {
        id: row.id,
        name: row.name,
        output: row.output,
        outputmount: row.outputmount,
        estimatetime: row.estimatetime,
        material: row.material
      }
      this.refuseDialogVisible = true
    },
    handleRefuseSubmit (row) {
      console.log(this.equipmentid)
      this.refuseDialogVisible = false
    },
    handlePagination () {
      console.log('Page to ' + this.pagination.currentPage)
      this.reloadData()
    }
  },
  mounted () {
    this.reloadData()
    if (this.$cookies.isKey('selectStationId')) {
      this.selectStationId = this.$cookies.get('selectStationId')
      this.testStationAcceptedBill = teststationunaccbill
      this.pagination.total = this.testStationAcceptedBill.length
    }
  },
  computed: {
    searchRefuseDisabled () {
      return this.equipmentid === ''
    }
  }
}
</script>

<style>
.pagination_class {
  margin: 40px;
  text-align: center;
}
.stationacceptedbilltip {
  display: inline-block;
  width: 25%;
  text-align: right;
  vertical-align: center;
  margin-top: 10px;
  white-space:nowrap;
}
.stationacceptedbillinput {
  display: inline-block;
  width: 70%;
  margin-top: 10px;
  white-space:nowrap;
}
</style>
