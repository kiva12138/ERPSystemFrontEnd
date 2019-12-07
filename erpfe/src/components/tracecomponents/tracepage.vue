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
      <el-button icon="el-icon-search"
        :disabled='searchDisabled'
        style="margin-left: 40px;"
        type="primary" @click='handleSearch'>搜 索</el-button>
      </el-row>
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
          @click='handleTrace(scope.row.id)'>查看追溯</el-button>
        <el-button type="text" size="small"
          @click='handleDelete(scope.row.id)'>删除工单</el-button>
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
  <el-dialog
    class="trace_dialog_class"
    :modal="false"
    title="追溯详情"
    :visible.sync="traceDialogVisible"
    width="40%">
      <el-row>
        <div class='tracetip'>工单编号：</div>
        <div class='traceinput'>
          {{traceResult.id}}
        </div>
      </el-row>
      <el-row>
        <div class='tracetip'>产出物料名称：</div>
        <div class='traceinput'>
          {{traceResult.output}}
        </div>
      </el-row>
      <el-row>
        <div class='tracetip'>产出数量：</div>
        <div class='traceinput'>
          {{traceResult.outputmount}}
        </div>
      </el-row>
      <el-row>
        <div class='tracetip'>工序路线：</div>
        <div class='traceinput'>
          <el-tag v-for="(procedure, index) in traceResult.detail"
            style="margin: 10px;"
            type="info"
            :key="index">
            {{procedure.station}}[{{procedure.process}}]
          </el-tag>
        </div>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="traceDialogVisible = false">
          确 定
        </el-button>
      </span>
  </el-dialog>
</div>
</template>

<script>
import NavBar from '@/components/pathbarcomponents/pathbarcomp.vue'
import testbill from '../../config/testbill.js'

export default {
  name: 'TracePage',
  components: {
    'navbar': NavBar
  },
  data () {
    return {
      searchId: '',
      searchOutput: '',
      currentPage: 1,
      billsNumber: 20,
      billsData: testbill,
      traceDialogVisible: false,
      traceResult: {
        id: '11111',
        output: 'Output',
        outputmount: '22',
        detail: [
          {
            process: '工序1',
            station: '10002'
          },
          {
            process: '工序2',
            station: '10003'
          },
          {
            process: '工序4',
            station: '10004'
          }
        ]
      }
    }
  },
  methods: {
    handleSearch () {
      console.log('Searching...' + this.searchId + this.searchName)
      // reload bill data
    },
    handleTrace (id) {
      console.log('Trace' + id)
      this.traceDialogVisible = true
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
        this.searchOutput === ''
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
.tracetip {
  display: inline-block;
  width: 25%;
  text-align: right;
  vertical-align: center;
  margin-top: 10px;
}
.traceinput {
  display: inline-block;
  width: 74%;
  margin-top: 10px;
}
</style>
