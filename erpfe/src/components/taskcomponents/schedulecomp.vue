<template>
<div>
  <div class="search_task_part">
    <el-row>
      <span class="searchtasktip">工单编号：</span>
      <el-input placeholder="请输入工单编号"
        class='searchtaskinput'
        v-model="searchBillId"
        clearable/>
      <span class="searchtasktip">工序名称：</span>
      <el-input placeholder="请输入工序名称"
        class='searchtaskinput'
        v-model="searchProcessName"
        clearable/>
      <el-button icon="el-icon-search"
        :disabled='searchDisabled'
        style="margin-left: 40px;"
        type="primary" @click='handleSearch'>搜 索</el-button>
    </el-row>
  </div>
  <div class="new_task_class">
    <el-button icon="el-icon-edit"
      type="primary" @click='handleAutoSchedule'>
        全部自动排程
    </el-button>
  </div>
  <el-table
    class="task_table_class"
    :data="tasksData"
    :default-sort = "{prop: 'id', order: 'descending'}"
    stripe
    style="width: 100%">
    <el-table-column
      fixed="left"
      prop="billid"
      sortable
      label="工单编号"
      width="150">
    </el-table-column>
    <el-table-column
      prop="id"
      sortable
      label="任务编号"
      width="150">
    </el-table-column>
    <el-table-column
      prop="name"
      sortable
      label="工序名称"
      width="180">
    </el-table-column>
    <el-table-column
      width="180"
      sortable
      label="任务状态">
      <template slot-scope="scope">
        <span>{{taskStatus[scope.row.status-1].name}}</span>
      </template>
    </el-table-column>
    <el-table-column
      sortable
      label="产出物料"
      width="180">
      <template slot-scope="scope">
        <span>{{scope.row.output}}*{{scope.row.outputmount}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="station"
      sortable
      label="工位"
      width="180">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="250">
      <template slot-scope="scope">
        <el-button type="text" size="small"
          v-if="scope.row.status === '1'"
          @click='handleManualSchedule(scope.row)'>手动排程</el-button>
        <el-button type="text" size="small"
          @click='handleRemove(scope.row.id)'>移除</el-button>
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
    :total="tasksNumber">
  </el-pagination>
  <el-dialog
    :modal="false"
    title="手动排程"
    :visible.sync="manualScheduleDialogVisibale"
    width="40%">
      <el-row>
        <div class='tip'>工单编号：</div>
        <div class='input'>
          {{currentTask.billid}}
        </div>
      </el-row>
      <el-row>
        <div class='tip'>任务编号：</div>
        <div class='input'>
          {{currentTask.id}}
        </div>
      </el-row>
      <el-row>
        <div class='tip'>工序名称：</div>
        <div class='input'>
          {{currentTask.name}}
        </div>
      </el-row>
      <el-row>
        <div class='tip'>物料产出：</div>
        <div class='input'>
          {{currentTask.output}} * {{currentTask.outputmount}}
        </div>
      </el-row>
      <el-row>
        <div class='tip'>工位编号：</div>
        <div class='input'>
          <el-input placeholder="请输入工位编号"
                  v-model="currentTask.station"
                  clearable/>
        </div>
      </el-row>
      <el-row>
        <div class='tip'>起始时间：</div>
        <div class='input'>
          <el-date-picker
            v-model="currentTask.starttime"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions">
          </el-date-picker>
        </div>
      </el-row>
      <el-row>
        <div class='tip'>完成时间：</div>
        <div class='input'>
          <el-date-picker
            v-model="currentTask.endtime"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions">
          </el-date-picker>
        </div>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="manualScheduleDialogVisibale = false">取 消</el-button>
        <el-button type="primary" @click="handleManualScheduleSubmit">确定排程</el-button>
      </span>
  </el-dialog>
</div>
</template>

<script>
import testtask from '../../config/testtask.js'
import taskstatus from '../../config/taskstatus.js'

export default {
  name: 'ProcessComp',
  data () {
    return {
      searchBillId: '',
      searchProcessName: '',
      currentPage: 1,
      taskStatus: taskstatus,
      tasksData: testtask,
      tasksNumber: 20,
      manualScheduleDialogVisibale: false,
      currentTask: {
        id: '1010',
        billid: '1001',
        name: 'name5',
        output: 'output',
        outputmount: 2,
        station: 'N号工位',
        starttime: '',
        endtime: ''
      },
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      }
    }
  },
  methods: {
    handleSearch () {
      console.log('Searching...' + this.searchBillId + this.searchProcessName)
      // reload task data
    },
    handleAutoSchedule () {
      console.log('Auto Schedule ')
    },
    handleRemove (id) {
      console.log('Remove' + id)
    },
    handleManualSchedule (row) {
      this.manualScheduleDialogVisibale = true
      this.currentTask.id = row.id
      this.currentTask.billid = row.billid
      this.currentTask.name = row.name
      this.currentTask.output = row.output
      this.currentTask.outputmount = row.outputmount
      this.currentTask.station = row.station
    },
    handlePagination () {
      console.log('Page to ' + this.currentPage)
      // reload process data
    },
    handleManualScheduleSubmit () {
      this.manualScheduleDialogVisibale = false
      console.log('Manual Schedule ')
      console.log(this.currentTask)
    }
  },
  computed: {
    searchDisabled () {
      return this.searchBillId === '' &&
        this.searchProcessName === ''
    }
  }
}
</script>

<style>
.search_task_part {
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.searchtasktip {
  width: 7%;
  margin-left: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  color: #606266;
  text-align: center;
  display: inline-block;
}
.searchtaskinput {
  width: 20%;
  margin-right: 20px;
  display: inline-block;
}
.new_task_class {
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.pagination_class {
  margin: 40px;
  text-align: center;
}
.tip {
  display: inline-block;
  width: 20%;
  text-align: center;
  vertical-align: center;
  margin-top: 10px;
}
.input {
  display: inline-block;
  width: 79%;
  margin-top: 10px;
}
</style>
