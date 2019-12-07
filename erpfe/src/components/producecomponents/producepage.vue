<template>
<div>
  <navbar/>
  <span class="produce_tip_class">
    提示：此页面可以直接对已分配任务进行操作，实际生产中应该在具体工位上配合MIS系统实现该功能，您可以按工位筛选完成任务
  </span>
  <div class="search_station_part">
    <el-row>
      <span class="searchstationtip">工位编号：</span>
      <el-input placeholder="请输入工位编号"
        class='searchstationinput'
        v-model="searchStationId"
        clearable/>
      <el-button icon="el-icon-search"
        :disabled='searchDisabled'
        style="margin-left: 40px;"
        type="primary" @click='handleSearch'>筛 选</el-button>
    </el-row>
  </div>
  <el-table
    class="station_table_class"
    :data="stationData"
    :default-sort = "{prop: 'id', order: 'descending'}"
    stripe
    style="width: 100%">
    <el-table-column
      fixed="left"
      prop="id"
      sortable
      label="工位编号"
      width="150">
    </el-table-column>
    <el-table-column
      prop="name"
      sortable
      label="工位名称"
      width="150">
    </el-table-column>
    <el-table-column
      prop="taskId"
      sortable
      label="任务编号"
      width="150">
    </el-table-column>
    <el-table-column
      prop="processName"
      sortable
      label="工序名称"
      width="150">
    </el-table-column>
    <el-table-column
      width="120"
      sortable
      label="任务状态">
      <template slot-scope="scope">
        <span>{{tasktatus[scope.row.status-1].name}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="startTime"
      sortable
      label="开始时间"
      width="150">
    </el-table-column>
    <el-table-column
      prop="endTime"
      sortable
      label="要求结束时间"
      width="150">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="200">
      <template slot-scope="scope">
        <el-button type="text" size="small"
          @click='handleOver(scope.row.taskId)'>完成任务</el-button>
        <el-button type="text" size="small"
          @click='handleNotOver(scope.row.taskId)'>任务未完成</el-button>
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
    :total="processesNumber">
  </el-pagination>
</div>
</template>

<script>
import NavBar from '@/components/pathbarcomponents/pathbarcomp.vue'
import testproduce from '../../config/testproduce.js'
import producestatus from '../../config/taskstatus.js'

export default {
  name: 'ProducePage',
  data () {
    return {
      searchStationId: '',
      processesNumber: 20,
      currentPage: 1,
      stationData: testproduce,
      tasktatus: producestatus
    }
  },
  components: {
    'navbar': NavBar
  },
  computed: {
    searchDisabled () {
      return this.searchStationId === ''
    }
  },
  methods: {
    handleSearch () {
      console.log(this.searchStationId)
    },
    handleOver (id) {
      console.log('Over' + id)
    },
    handleNotOver (id) {
      console.log('Not Over' + id)
    },
    handlePagination () {
      console.log('Page to ' + this.currentPage)
    }
  }
}
</script>

<style>
.produce_tip_class {
  color: #606266;
  margin-left: 20px;
  margin-bottom: 20px;
}
.search_station_part {
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.searchstationtip {
  width: 12%;
  margin-left: 10px;
  margin-top: 10px;
  margin-bottom: 20px;
  color: #606266;
  text-align: right;
  display: inline-block;
}
.searchstationinput {
  width: 15%;
  margin-right: 20px;
  display: inline-block;
}
.pagination_class {
  text-align: center;
  margin-top: 20px;
}
</style>
