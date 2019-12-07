<template>
<div>
  <div class="search_producingtask_part">
    <el-row>
      <span class="searchproducingtip">工单编号：</span>
      <el-input placeholder="请输入工单编号"
        class='searchproducinginput'
        v-model="searchBillId"
        clearable/>
        <span class="searchproducingtip">任务编号：</span>
      <el-input placeholder="请输入任务编号"
        class='searchproducinginput'
        v-model="searchId"
        clearable/>
      <span class="searchproducingtip">工序名称：</span>
      <el-input placeholder="请输入您工序名称"
        class='searchproducinginput'
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
    :data="producingtasksData"
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
          @click='handleOverEarly(scope.row.id)'>提前结束</el-button>
        <el-button type="text" size="small"
          @click='handleRemove(scope.row.id)'>取消任务</el-button>
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
    :total="producingtasksNumber">
  </el-pagination>
</div>
</template>

<script>
import testproducingtask from '../../config/testproducingtasks.js'
import taskstatus from '../../config/taskstatus.js'

export default {
  name: 'SchduledTaskComp',
  data () {
    return {
      searchBillId: '',
      searchId: '',
      searchProcessName: '',
      currentPage: 1,
      taskStatus: taskstatus,
      producingtasksData: testproducingtask,
      producingtasksNumber: 20
    }
  },
  methods: {
    handleSearch () {
      console.log('Searching...' + this.searchBillId + this.searchId + this.searchProcessName)
      // reload producingtask data
    },
    handlePagination () {
      console.log('Page to ' + this.currentPage)
      // reload producingtask data
    },
    handleRemove (id) {
      console.log('Remove' + id)
    },
    handleOverEarly (id) {
      console.log('Over Early ' + id)
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
.search_producingtask_part {
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.searchproducingtip {
  width: 7%;
  margin-left: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  color: #606266;
  text-align: center;
  display: inline-block;
}
.searchproducinginput {
  width: 18%;
  margin-right: 20px;
  display: inline-block;
}
.new_producingtask_class {
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
