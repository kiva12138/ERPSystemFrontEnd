<template>
<div>
  <SelectStation/>
  <div v-if="selectStationId===''"
    style="color: #606266; text-align: center; font-size: 200%; padding-top: 20%;">
    请首先选择工位。
  </div>
  <div v-else>
    <el-table
      class="stationproducingbill_table_class"
      :data="testStationProducingBill"
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
        sortable
        label="分配设备"
        align="center"
        width="100">
        <template slot-scope="scope">
          <span>{{scope.row.distributedequipment}}号设备</span>
        </template>
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
          <el-button type="text" size="small" style="color: #67C23A;"
            @click='handleComplete(scope.row.id)'>完成任务</el-button>
          <el-button type="text" size="small" style="color: #F56C6C;"
            @click='handleStop(scope.row)'>停滞任务</el-button>
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

    <el-drawer
      title="停滞任务"
      :visible.sync="stopBillVisible"
      direction="rtl"
      custom-class="newbill-drawer"
      ref="drawer" >
      <div class="newbill-drawer__content">
        <el-row>
          <div class='stationproducingbilltip'>工单编号：</div>
          <div class='stationproducingbillinput'>
            <span>{{currentBill.id}}</span>
          </div>
        </el-row>
        <el-row>
          <div class='stationproducingbilltip'>工单名称：</div>
          <div class='stationproducingbillinput'>
            <span>{{currentBill.name}}</span>
          </div>
        </el-row>
        <el-row>
          <div class='stationproducingbilltip'>状态：</div>
          <div class='stationproducingbillinput'>
            <span>{{billStatus[currentBill.status-1].name}}</span>
          </div>
        </el-row>
        <el-row>
          <div class='stationproducingbilltip'>预计时间：</div>
          <div class='stationproducingbillinput'>
            <span>{{currentBill.estimatetime}}小时</span>
          </div>
        </el-row>
        <el-row>
          <div class='stationproducingbilltip'>已分配物料：</div>
          <div class='stationproducingbillinput'>
            <span v-for="(item, index) in currentBill.material" :key="index">
              {{item.name}} </span>
          </div>
        </el-row>
        <el-row>
          <div class='stationproducingbilltip'>停滞原因：</div>
          <div class='stationproducingbillinput'>
            <el-input placeholder="请输入停滞原因" v-model="currentBill.reason" clearable/>
          </div>
        </el-row>
        <el-row>
          <div class='stationproducingbilltip'>已产出物料：</div>
          <div class='stationproducingbillinput'>
            <el-tag
              :key="tag"
              v-for="tag in currentBill.haveOutput"
              closable
              :disable-transitions="false"
              @close="handleHaveOutputClose(tag)">
              {{tag}}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="haveOutputInput.inputVisible"
              v-model="haveOutputInput.inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleHaveOutputConfirm"
              @blur="handleHaveOutputConfirm"/>
            <el-button v-else class="button-new-tag" size="small" @click="showHaveOutputInput">
              + 新物料
            </el-button>
          </div>
        </el-row>
        <el-row>
          <div class='stationproducingbilltip'>已使用物料：</div>
          <div class='stationproducingbillinput'>
            <el-tag
              :key="tag"
              v-for="tag in currentBill.haveUsed"
              closable
              :disable-transitions="false"
              @close="handleHaveUsedClose(tag)">
              {{tag}}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="haveUsedInput.inputVisible"
              v-model="haveUsedInput.inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleHaveUsedConfirm"
              @blur="handleHaveUsedConfirm"/>
            <el-button v-else class="button-new-tag" size="small" @click="showHaveUsedInput">
              + 新物料
            </el-button>
          </div>
        </el-row>
        <el-row>
          <div class='stationproducingbilltip'>
            <span style="color: #909399;">
              提示：
            </span>
          </div>
          <div class='stationproducingbillinput'>
            <span style="color: #909399;">
              若需要多个物料则使用*隔开，如物料A*4
            </span>
          </div>
        </el-row>
        <div class="newbill-drawer__footer">
          <el-row style="text-align: center; margin-top: 40px;">
            <el-button icon="el-icon-edit"
              :disabled="stopDisabled"
              type="primary" @click='handleStopSubmit'>
                确认停滞
            </el-button>
          </el-row>
        </div>
      </div>
    </el-drawer>
  </div>

</div>
</template>

<script>
import selectstation from './select_components/selectstation.vue'
import billstatus from '../../../config_new/billstatus.js'
import materialclass from '../../../config_new/materialclass.js'
import teststationunaccbill from '../../../config_new/teststationproducing.js'

export default {
  name: 'Producing',
  components: {
    'SelectStation': selectstation
  },
  data () {
    return {
      selectStationId: '',
      billStatus: billstatus,
      materialClass: materialclass,
      testStationProducingBill: teststationunaccbill,
      dataLoading: false,
      stopBillVisible: false,
      pagination: {
        pageSize: 10,
        total: 5,
        currentPage: 1
      },
      currentBill: {
        id: '',
        name: '',
        status: 4,
        output: '',
        outputmount: 3,
        estimatetime: 72,
        material: [],
        reason: '',
        haveOutput: [],
        haveUsed: []
      },
      haveOutputInput: {
        inputVisible: false,
        inputValue: ''
      },
      haveUsedInput: {
        inputVisible: false,
        inputValue: ''
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
    handleComplete (id) {
      console.log('Complete......')
      console.log(id)
    },
    handleStop (row) {
      this.currentBill = {
        id: row.id,
        name: row.name,
        status: row.status,
        output: row.output,
        outputmount: row.outputmount,
        estimatetime: row.estimatetime,
        material: row.material,
        reason: '',
        haveOutput: [],
        haveUsed: []
      }
      this.stopBillVisible = true
    },
    handleStopSubmit (row) {
      this.stopBillVisible = false
      console.log(this.currentBill)
    },
    handlePagination () {
      console.log('Page to ' + this.pagination.currentPage)
      this.reloadData()
    },
    handleHaveOutputClose (tag) {
      this.currentBill.haveOutput.splice(this.currentBill.haveOutput.indexOf(tag), 1)
    },
    showHaveOutputInput () {
      this.haveOutputInput.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleHaveOutputConfirm () {
      let inputValue = this.haveOutputInput.inputValue
      if (inputValue) {
        this.currentBill.haveOutput.push(inputValue)
      }
      this.haveOutputInput.inputVisible = false
      this.haveOutputInput.inputValue = ''
    },
    handleHaveUsedClose (tag) {
      this.currentBill.haveUsed.splice(this.currentBill.haveUsed.indexOf(tag), 1)
    },
    showHaveUsedInput () {
      this.haveUsedInput.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleHaveUsedConfirm () {
      let inputValue = this.haveUsedInput.inputValue
      if (inputValue) {
        this.currentBill.haveUsed.push(inputValue)
      }
      this.haveUsedInput.inputVisible = false
      this.haveUsedInput.inputValue = ''
    }
  },
  mounted () {
    this.reloadData()
    if (this.$cookies.isKey('selectStationId')) {
      this.selectStationId = this.$cookies.get('selectStationId')
      this.testStationProducingBill = teststationunaccbill
      this.pagination.total = this.testStationProducingBill.length
    }
  },
  computed: {
    stopDisabled () {
      return this.currentBill.reason === ''
    }
  }
}
</script>

<style>
.pagination_class {
  margin: 40px;
  text-align: center;
}
.stationproducingbilltip {
  display: inline-block;
  width: 25%;
  text-align: right;
  vertical-align: center;
  margin-top: 10px;
  white-space:nowrap;
}
.stationproducingbillinput {
  display: inline-block;
  width: 70%;
  margin-top: 10px;
  white-space:nowrap;
}
.el-tag + .el-tag {
  margin-left: 10px;
  margin-top: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0px;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
