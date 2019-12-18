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

      <span class="searchbilltip">产出物料名称：</span>
      <el-input placeholder="请输入产出物料名称"
        class='searchbillinput'
        v-model="searchBill.outputname"
        clearable/>

      <span class="searchbilltip">所需物料名称：</span>
      <el-input placeholder="请输入所需物料名称"
        class='searchbillinput'
        v-model="searchBill.materialname"
        clearable/>

      <span class="searchdistributedbilltip">订单状态</span>
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
        <span>{{scope.row.output}} * {{scope.row.outputmount}}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="分配工位"
      align="center"
      prop="distributedStation"
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
        <span>{{scope.row.actualTime}}小时</span>
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
import testcompletebill from '../../../config_new/testcompletebill.js'

export default {
  name: 'Completed',
  data () {
    return {
      billStatus: billstatus,
      materialClass: materialclass,
      testCompleteBill: testcompletebill,
      dataLoading: false,
      searchBill: {
        id: '',
        name: '',
        outputclass: '',
        outputname: '',
        materialname: '',
        billstatus: ''
      },
      pagination: {
        pageSize: 10,
        total: 90,
        currentPage: 1
      },
      multipleSelection: []
    }
  },
  methods: {
    handleSearch () {
      console.log('Searching...')
      console.log(this.searchBill)
      this.reloadData()
    },
    reloadData () {
      console.log('Reload Data......')
      this.dataLoading = true
      var self = this
      setTimeout(function () { self.dataLoading = false }, 1000)
    },
    handleDelete (id) {
      console.log('Delete......')
      console.log(id)
    },
    handleDeleteMul () {
      console.log('Delete Multi......')
      console.log(this.multipleSelection)
    },
    handlePagination () {
      console.log('Page to ' + this.pagination.currentPage)
      this.reloadData()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
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
