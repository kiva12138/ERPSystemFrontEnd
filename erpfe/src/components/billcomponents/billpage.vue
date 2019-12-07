<template>
<div>
  <navbar/>
  <div class="search_bill_part">
    <el-row>
      <span class="searchtip">编号：</span>
      <el-input placeholder="请输入订单编号"
        class='searchinput'
        v-model="searchId"
        clearable/>
      <span class="searchtip">产出：</span>
      <el-input placeholder="请输入产出名称"
        class='searchinput'
        v-model="searchOutput"
        clearable/>
      <span class="searchtip">状态：</span>
      <el-select v-model="searchStatus" placeholder="请选择状态">
        <el-option :label="billStatus[0].name" :value="billStatus[0].id"></el-option>
        <el-option :label="billStatus[1].name" :value="billStatus[1].id"></el-option>
      </el-select>
      <el-button icon="el-icon-search"
        :disabled='searchDisabled'
        style="margin-left: 40px;"
        type="primary" @click='handleSearch'>搜 索</el-button>
      </el-row>
  </div>
  <div class="new_bill_class">
    <span>若创建新订单需要首先创建BOM，然后从BOM生成订单</span>
  </div>
  <el-table
    class="bill_table_class"
    :data="billsData"
    :default-sort = "{prop: 'id', order: 'descending'}"
    stripe
    style="width: 100%">
    <el-table-column
      fixed="left"
      prop="id"
      sortable
      label="订单编号"
      width="150">
    </el-table-column>
    <el-table-column
      prop="output"
      sortable
      label="产出名称"
      width="150">
    </el-table-column>
    <el-table-column
      prop="outputmount"
      sortable
      label="产出数量"
      width="100">
    </el-table-column>
    <el-table-column
      width="180"
      sortable
      label="状态">
      <template slot-scope="scope">
        <span>{{billStatus[scope.row.status-1].name}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="description"
      width="450"
      label="描述">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="250">
      <template slot-scope="scope">
        <el-button type="text" size="small"
          v-if="scope.row.status !== '1'"
          @click='handleStart(scope.row.id)'>下发</el-button>
        <el-button type="text" size="small"
          v-if="scope.row.status !== '2'"
          @click='handleStop(scope.row.id)'>停止</el-button>
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
    :total="billsNumber">
  </el-pagination>
</div>
</template>

<script>
import NavBar from '@/components/pathbarcomponents/pathbarcomp.vue'
import billstatus from '../../config/billstatus.js'
import testbill from '../../config/testbill.js'

export default {
  name: 'BillComp',
  data () {
    return {
      searchId: '',
      searchOutput: '',
      searchStatus: '',
      currentPage: 1,
      billStatus: billstatus,
      billsData: testbill,
      billsNumber: 20
    }
  },
  components: {
    'navbar': NavBar
  },
  methods: {
    handleSearch () {
      console.log('Searching...' + this.searchId + this.searchName + this.searchStatus)
      // reload bill data
    },
    handleStart (id) {
      console.log('Start' + id)
      // reload bill data
    },
    handleStop (id) {
      console.log('Stop' + id)
      // reload bill data
    },
    handlePagination () {
      console.log('Page to ' + this.currentPage)
      // reload bill data
    }
  },
  computed: {
    searchDisabled () {
      return this.searchId === '' &&
        this.searchOutput === '' &&
        this.searchStatus === ''
    }
  }
}
</script>

<style>
.search_bill_part {
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.searchtip {
  width: 5%;
  margin-left: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  color: #606266;
  text-align: center;
  display: inline-block;
}
.searchinput {
  width: 20%;
  margin-right: 20px;
  display: inline-block;
}
.new_bill_class {
  color: #606266;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.bill_table_class {
  padding-left: 20px;
  padding-right: 20px;
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
