<template>
<div>

  <div class="new_producingbill_class" style="color: #606266;">
    <span>目前有
      <span style="color: #409EFF; font-size: 150%;">
        {{producingData.producing}}
      </span>
      工单正在工位进行生产；
    </span>
    <span>其中
      <span style="color: #F56C6C; font-size: 150%;">{{producingData.overTime}}</span>
      工单生产已经超时；
    </span>
    <span>超时率为
      <span style="color: #E6A23C; font-size: 150%;">
        {{((producingData.overTime / producingData.producing).toFixed(3)) * 100}}%
      </span>
    </span>
  </div>

  <div class="search_producingbill_part">
    <el-row>
      <span class="searchproducingbilltip">工单编号：</span>
      <el-input placeholder="请输入工单编号"
        class='searchproducingbillinput'
        v-model="searchProducingBill.id"
        clearable/>

      <span class="searchproducingbilltip">工单名称：</span>
      <el-input placeholder="请输入工单名称"
        class='searchproducingbillinput'
        v-model="searchProducingBill.name"
        clearable/>

      <span class="searchproducingbilltip">产出物料种类：</span>
      <el-select v-model="searchProducingBill.outputclass" placeholder="请选择种类"
        class='searchproducingbillinput'>
        <el-option
          v-for="item in materialClass"
          v-if="item.id !== '1'"
          :key="item.id"
          :label="item.name"
          :value="item.id" />
      </el-select>

      <span class="searchproducingbilltip">分配工位：</span>
      <el-input placeholder="请输入工位编号"
        class='searchproducingbillinput'
        v-model="searchProducingBill.station"
        clearable/>

    </el-row>

    <el-row>

      <span class="searchproducingbilltip">产出物料名称：</span>
      <el-input placeholder="请输入产出物料名称"
        class='searchproducingbillinput'
        v-model="searchProducingBill.outputname"
        clearable/>

      <span class="searchproducingbilltip">所需物料名称：</span>
      <el-input placeholder="请输入所需物料名称"
        class='searchproducingbillinput'
        v-model="searchProducingBill.materialname"
        clearable/>

      <el-button icon="el-icon-search"
        :disabled='searchDisabled'
        style="margin-left: 40px;"
        type="primary" @click='handleSearch'>筛选工单</el-button>

    </el-row>
  </div>

  <el-table
    class="producingbill_table_class"
    :data="testProducingBill"
    :default-sort = "{prop: 'id', order: 'descending'}"
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
      label="剩余时间"
      align="center"
      width="100">
      <template slot-scope="scope">
        <span style="color: #E6A23C;" v-if="scope.row.status===4">{{scope.row.meta.remainTime}}小时</span>
        <span style="color: #F56C6C;" v-if="scope.row.status===5">{{scope.row.meta.remainTime}}小时</span>
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
      label="状态"
      align="center"
      width="200">
      <template slot-scope="scope">
        <i class="el-icon-refresh" style="color: #67C23A;" v-if="scope.row.status===4"/>
        <i class="el-icon-circle-close" style="color: #F56C6C;" v-if="scope.row.status===5"/>
        <span style="color: #67C23A;" v-if="scope.row.status===4">
          {{billStatus[scope.row.status - 1].name}}
        </span>
        <span style="color: #F56C6C;" v-if="scope.row.status===5">
          {{billStatus[scope.row.status - 1].name}}
        </span>
        <el-progress
          v-if="scope.row.status===4"
          :percentage="((scope.row.estimatetime-scope.row.meta.remainTime)/scope.row.estimatetime).toFixed(4) * 100"/>
        <el-progress
          v-if="scope.row.status===5"
          :percentage="100" status="exception"/>
      </template>
    </el-table-column>
    <el-table-column
      label="已分配物料"
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
          @click='handleReDistribute(scope.row)'>重新分配工时</el-button>
        <el-button type="text" size="small"
          @click='handleStop(scope.row.id)'>暂停生产</el-button>
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
    title="重新分配时间"
    :visible.sync="reDistributingVisible"
    width="30%">
    <el-row>
      <div class='producingbilltip'>工单编号：</div>
      <div class='producingbillinput'>
        <span>{{distributeTime.id}}</span>
      </div>
    </el-row>
    <el-row>
      <div class='producingbilltip'>工单名称：</div>
      <div class='producingbillinput'>
        <span>{{distributeTime.name}}</span>
      </div>
    </el-row>
    <el-row>
      <div class='producingbilltip'>分配工位：</div>
      <div class='producingbillinput'>
        <span>{{distributeTime.stationId}}</span>
      </div>
    </el-row>
    <el-row>
      <div class='producingbilltip'>分配时间：</div>
      <div class='producingbillinput'>
        <el-input-number v-model="distributeTime.time" :min="1" :max="99999"></el-input-number>
      </div>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="reDistributingVisible = false">取 消</el-button>
      <el-button type="primary"
        @click="handleReDistributeSubmit">确认重新分配</el-button>
    </span>
  </el-dialog>

</div>
</template>

<script>
import billstatus from '../../../config_new/billstatus.js'
import materialclass from '../../../config_new/materialclass.js'
import testproducingbill from '../../../config_new/testproducingbill.js'

export default {
  name: 'Producing',
  data () {
    return {
      billStatus: billstatus,
      materialClass: materialclass,
      testProducingBill: testproducingbill,
      editProducingBillVisible: false,
      reDistributingVisible: false,
      dataLoading: false,
      producingData: {
        producing: 873,
        overTime: 211
      },
      searchProducingBill: {
        id: '',
        name: '',
        outputclass: '',
        outputname: '',
        materialname: '',
        station: ''
      },
      distributeTime: {
        id: '',
        name: '',
        stationId: '',
        time: 0
      },
      pagination: {
        pageSize: 10,
        total: 90,
        currentPage: 1
      },
      distributeBill: {
        id: '',
        name: '',
        stationId: ''
      }
    }
  },
  methods: {
    handleSearch () {
      console.log('Searching...')
      console.log(this.searchProducingBill)
      this.reloadData()
    },
    reloadData () {
      console.log('Reload Data......')
      this.dataLoading = true
      var self = this
      setTimeout(function () { self.dataLoading = false }, 1000)
    },
    handleStop (id) {
      console.log('Stop......')
      console.log(id)
    },
    handleReDistribute (row) {
      this.reDistributingVisible = true
      this.distributeTime = {
        id: row.id,
        name: row.name,
        stationId: row.distributedStation,
        time: row.estimatetime
      }
    },
    handleReDistributeSubmit (row) {
      console.log(this.distributeTime)
      this.reDistributingVisible = false
    },
    handlePagination () {
      console.log('Page to ' + this.pagination.currentPage)
      this.reloadData()
    }
  },
  mounted () {
    this.reloadData()
  },
  computed: {
    searchDisabled () {
      return this.searchProducingBill.id === '' &&
        this.searchProducingBill.name === '' &&
        this.searchProducingBill.outputclass === '' &&
        this.searchProducingBill.outputname === '' &&
        this.searchProducingBill.materialname === '' &&
        this.searchProducingBill.station === ''
    }
  }
}
</script>

<style>
.search_producingbill_part {
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.searchproducingbilltip {
  width: 8%;
  margin-left: 5px;
  margin-top: 10px;
  margin-bottom: 20px;
  color: #606266;
  text-align: right;
  display: inline-block;
  white-space:nowrap;
}
.searchproducingbillinput {
  width: 14%;
  display: inline-block;
  white-space:nowrap;
}
.new_producingbill_class {
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.pagination_class {
  margin: 40px;
  text-align: center;
}
.producingbilltip {
  display: inline-block;
  width: 25%;
  text-align: right;
  vertical-align: center;
  margin-top: 10px;
  white-space:nowrap;
}
.producingbillinput {
  display: inline-block;
  width: 70%;
  margin-top: 10px;
  white-space:nowrap;
}
.producingbillinputsp {
  display: inline-block;
  width: 70%;
  margin-top: 10px;
}
</style>
