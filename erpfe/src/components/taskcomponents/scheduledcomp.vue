<template>
<div>
  <div class="search_scheduledtask_part">
    <el-row>
      <span class="searchscheduledtip">工单编号：</span>
      <el-input placeholder="请输入工单编号"
        class='searchscheduledinput'
        v-model="searchBillId"
        clearable/>
        <span class="searchscheduledtip">任务编号：</span>
      <el-input placeholder="请输入任务编号"
        class='searchscheduledinput'
        v-model="searchId"
        clearable/>
      <span class="searchscheduledtip">工序名称：</span>
      <el-input placeholder="请输入您工序名称"
        class='searchscheduledinput'
        v-model="searchProcessName"
        clearable/>
      <el-button icon="el-icon-search"
        :disabled='searchDisabled'
        style="margin-left: 40px;"
        type="primary" @click='handleSearch'>搜 索</el-button>
    </el-row>
  </div>
  <el-table
    class="task_table_class"
    :data="scheduledtasksData"
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
          @click='handleProduce(scope.row.id)'>下发任务</el-button>
        <el-button type="text" size="small"
          @click='handleRemove(scope.row.id)'>取消排程</el-button>
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
    :total="scheduledtasksNumber">
  </el-pagination>
</div>
</template>

<script>
import testscheduledtask from '../../config/testscheduletasks.js'
import scheduledtaskstatus from '../../config/taskstatus.js'

export default {
  name: 'SchduledTaskComp',
  data () {
    return {
      searchBillId: '',
      searchId: '',
      searchProcessName: '',
      currentPage: 1,
      taskStatus: scheduledtaskstatus,
      scheduledtasksData: testscheduledtask,
      scheduledtasksNumber: 20
    }
  },
  methods: {
    handleSearch () {
      console.log('Searching...' + this.searchId + this.searchProcessName + this.searchBillId)
      // reload scheduledtask data
    },
    handlePagination () {
      console.log('Page to ' + this.currentPage)
      // reload scheduledtask data
    },
    handleRemove (id) {
      console.log('Remove' + id)
    },
    handleProduce (id) {
      console.log('Produce' + id)
    }
  },
  computed: {
    searchDisabled () {
      return this.searchId === '' &&
        this.searchProcessName === '' &&
        this.searchBillId === ''
    }
  }
}
</script>

<style>
.search_scheduledtask_part {
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.searchscheduledtip {
  width: 7%;
  margin-left: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  color: #606266;
  text-align: center;
  display: inline-block;
}
.searchscheduledinput {
  width: 18%;
  margin-right: 20px;
  display: inline-block;
}
.new_scheduledtask_class {
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
