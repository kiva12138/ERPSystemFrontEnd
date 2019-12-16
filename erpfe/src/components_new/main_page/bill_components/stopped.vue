<template>
<div>

  <div class="new_stoppedbill_class" style="color: #606266;">
    <span>目前有
      <span style="color: #409EFF; font-size: 150%;">
        {{stoppedData.producing}}
      </span>
      工单正在工位进行生产；
    </span>
    <span>同时有
      <span style="color: #F56C6C; font-size: 150%;">{{stoppedData.stopped}}</span>
      工单生产处于停滞状态；
    </span>
    <span>停滞工单比率为
      <span style="color: #E6A23C; font-size: 150%;">
        {{((stoppedData.stopped/(stoppedData.stopped+stoppedData.producing)).toFixed(3)) * 100}}%
      </span>。
    </span>
    <div style="padding-top: 10px;">
      您可以对停滞中的工单进行物料回收、重新启动生产、物料增加等操作。
    </div>
  </div>

  <div class="search_stoppedbill_part">
    <el-row>
      <span class="searchstoppedbilltip">工单编号：</span>
      <el-input placeholder="请输入工单编号"
        class='searchstoppedbillinput'
        v-model="searchStoppedBill.id"
        clearable/>

      <span class="searchstoppedbilltip">工单名称：</span>
      <el-input placeholder="请输入工单名称"
        class='searchstoppedbillinput'
        v-model="searchStoppedBill.name"
        clearable/>

      <span class="searchstoppedbilltip">产出物料种类：</span>
      <el-select v-model="searchStoppedBill.outputclass" placeholder="请选择种类"
        class='searchstoppedbillinput'>
        <el-option
          v-for="item in materialClass"
          v-if="item.id !== '1'"
          :key="item.id"
          :label="item.name"
          :value="item.id" />
      </el-select>

      <span class="searchstoppedbilltip">分配工位：</span>
      <el-input placeholder="请输入工位编号"
        class='searchstoppedbillinput'
        v-model="searchStoppedBill.station"
        clearable/>

    </el-row>

    <el-row>

      <span class="searchstoppedbilltip">产出物料名称：</span>
      <el-input placeholder="请输入产出物料名称"
        class='searchstoppedbillinput'
        v-model="searchStoppedBill.outputname"
        clearable/>

      <span class="searchstoppedbilltip">所需物料名称：</span>
      <el-input placeholder="请输入所需物料名称"
        class='searchstoppedbillinput'
        v-model="searchStoppedBill.materialname"
        clearable/>

      <el-button icon="el-icon-search"
        :disabled='searchDisabled'
        style="margin-left: 40px;"
        type="primary" @click='handleSearch'>筛选工单</el-button>

    </el-row>
  </div>

  <div style="margin: 10px;">
    <el-button size="small" @click='handleRestart()'
      type="success" :disabled="restartDisabled">
      重新启动选中工单
    </el-button>
    <el-button size="small" @click='handleStop()'
      type="danger" :disabled="restartDisabled">
      物料回收并停止选中工单
    </el-button>
  </div>

  <el-table
    class="stoppedbill_table_class"
    :data="testStoppedBill"
    :default-sort = "{prop: 'id', order: 'descending'}"
    @selection-change="handleSelectionChange"
    stripe
    v-loading="dataLoading"
    style="width: 100%;">
    <el-table-column
      type="selection"
      width="50">
    </el-table-column>
    <el-table-column
      fixed="left"
      prop="id"
      sortable
      label="工单编号"
      align="center"
      width="100">
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
        <span>{{scope.row.output}}*{{scope.row.outputmount}}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="已产出物料"
      align="center"
      width="100">
      <template slot-scope="scope">
          <span v-for="(mitem, index1) in scope.row.meta.haveOutput" :key="index1">
            {{mitem.name}}*{{mitem.mount}} </span>
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
      label="已停滞时间"
      align="center"
      width="120">
      <template slot-scope="scope">
        <span>{{scope.row.meta.stoppedTime}}小时</span>
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
      width="100">
      <template slot-scope="scope">
        <i class="el-icon-circle-close" style="color: #F56C6C;" v-if="scope.row.status===6"/>
        <span style="color: #F56C6C;" v-if="scope.row.status===6">
          {{billStatus[scope.row.status - 1].name}}
        </span>
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
      label="停滞原因">
      <template slot-scope="scope">
        <el-popover
          placement="top"
          width="300"
          trigger="hover">
          <div>
            {{scope.row.meta.reason}}
          </div>
          <div slot="reference">
            <span style="white-space: nowrap; text-overflow:ellipsis; overflow:hidden;">
              {{scope.row.meta.reason}}
            </span>
          </div>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="220">
      <template slot-scope="scope">
        <el-button type="text" size="small"
          @click='handleLookUp(scope.row)'>查看详情</el-button>
        <el-button type="text" size="small"
          @click='handleRedistribute(scope.row)'>重新分配物料并启动</el-button>
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
    title="停滞工单详情"
    :visible.sync="lookupVisible"
    width="30%">
    <el-row>
      <div class='stoppedbilltip'>工单编号：</div>
      <div class='stoppedbillinput'>
        <span>{{currentBill.id}}</span>
      </div>
    </el-row>
    <el-row>
      <div class='stoppedbilltip'>工单名称：</div>
      <div class='stoppedbillinput'>
        <span>{{currentBill.name}}</span>
      </div>
    </el-row>
    <el-row>
      <div class='stoppedbilltip'>状态：</div>
      <div class='stoppedbillinput'>
        <i class="el-icon-circle-close" style="color: #F56C6C;"/>
        <span style="color: #F56C6C;">
          {{billStatus[currentBill.status - 1].name}}
        </span>
      </div>
    </el-row>
    <el-row>
      <div class='stoppedbilltip'>已停滞时间：</div>
      <div class='stoppedbillinput' style="color: #E6A23C;">
        <span>{{currentBill.meta.stoppedTime}}小时</span>
      </div>
    </el-row>
    <el-row>
      <div class='stoppedbilltip'>预计完成时间：</div>
      <div class='stoppedbillinput' style="color: #E6A23C;">
        <span>{{currentBill.estimatetime}}小时</span>
      </div>
    </el-row>
    <el-row>
      <div class='stoppedbilltip'>停滞原因：</div>
      <div class='stoppedbillinput'>
        <span>{{currentBill.meta.reason}}</span>
      </div>
    </el-row>
    <el-row>
      <div class='stoppedbilltip'>预计生产：</div>
      <div class='stoppedbillinput'>
        <span>{{currentBill.output}}*{{currentBill.outputmount}}</span>
      </div>
    </el-row>
    <el-row>
      <div class='stoppedbilltip'>停滞前已生产：</div>
      <div class='stoppedbillinput' style="color: #67C23A;">
        <span v-for="(mitem, index1) in currentBill.meta.haveOutput" :key="index1">
          {{mitem.name}}*{{mitem.mount}} </span>
      </div>
    </el-row>
    <el-row>
      <div class='stoppedbilltip'>停滞前分配物料：</div>
      <div class='stoppedbillinput'>
        <span v-for="(mitem, index1) in currentBill.material" :key="index1">
          {{mitem.name}} </span>
      </div>
    </el-row>
    <el-row>
      <div class='stoppedbilltip'>停滞前使用物料：</div>
      <div class='stoppedbillinput'>
        <span v-for="(mitem, index1) in currentBill.meta.haveUsed" :key="index1">
          {{mitem.name}} </span>
      </div>
    </el-row>
    <el-row>
      <div class='stoppedbilltip'>停滞后剩余物料：</div>
      <div class='stoppedbillinput'>
        <span v-for="(mitem, index1) in currentBill.meta.left" :key="index1">
          {{mitem.name}} </span>
      </div>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary"
        @click="lookupVisible = false">确 定</el-button>
    </span>
  </el-dialog>

  <el-drawer
    title="重新分配物料并启动生产"
    :visible.sync="reDistributingVisible"
    direction="rtl"
    ref="drawer"
    style="width: 100%;">
    <el-row>
      <div class='stoppedbilldrawertip'>工单编号：</div>
      <div class='stoppedbilldrawerinput'>
        <span>{{redistribute.id}}</span>
      </div>
    </el-row>
    <el-row>
      <div class='stoppedbilldrawertip'>工单名称：</div>
      <div class='stoppedbilldrawerinput'>
        <span>{{redistribute.name}}</span>
      </div>
    </el-row>
    <el-row>
      <div class='stoppedbilldrawertip'>已产出物料：</div>
      <div class='stoppedbilldrawerinput'>
        <span v-for="(mitem, index1) in redistribute.output" :key="index1">
          {{mitem.name}}*{{mitem.mount}} </span>
      </div>
    </el-row>
    <el-row>
      <div class='stoppedbilldrawertip'>剩余物料：</div>
      <div class='stoppedbilldrawerinput'>
        <span v-for="(mitem, index1) in redistribute.left" :key="index1">
          {{mitem.name}} </span>
      </div>
    </el-row>
    <el-row>
      <div class='stoppedbilldrawertip'>新增物料：</div>
      <div class='stoppedbilldrawerinputsp'>
        <el-tag
          :key="tag"
          v-for="tag in redistribute.add"
          closable
          :disable-transitions="false"
          @close="handleEditBillClose(tag)">
          {{tag}}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="editBillInput.inputVisible"
          v-model="editBillInput.inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleEditBillInputConfirm"
          @blur="handleEditBillInputConfirm"/>
        <el-button v-else class="button-new-tag" size="small" @click="showEditBillInput">+ 新物料</el-button>
      </div>
    </el-row>
    <div>
      <div class='stoppedbilldrawertip'>
        <span style="color: #909399; margin-left: 20px;">
          提示：
        </span>
      </div>
      <div class='stoppedbilldrawerinput'>
        <span style="color: #909399; margin-left: 20px;">
          若需要多个物料则使用*隔开，如物料A*4
        </span>
      </div>
    </div>
    <div>
      <el-row style="text-align: center; margin-top: 40px;">
        <el-button icon="el-icon-edit"
          type="primary" @click='handleRedistributeSubmit'>
            修 改
        </el-button>
      </el-row>
    </div>
  </el-drawer>

</div>
</template>

<script>
import billstatus from '../../../config_new/billstatus.js'
import materialclass from '../../../config_new/materialclass.js'
import teststoppedbill from '../../../config_new/teststoppedbill.js'

export default {
  name: 'Stopped',
  data () {
    return {
      billStatus: billstatus,
      materialClass: materialclass,
      testStoppedBill: teststoppedbill,
      lookupVisible: false,
      reDistributingVisible: false,
      dataLoading: false,
      multipleSelection: [],
      stoppedData: {
        producing: 873,
        stopped: 211
      },
      searchStoppedBill: {
        id: '',
        name: '',
        outputclass: '',
        outputname: '',
        materialname: '',
        station: ''
      },
      pagination: {
        pageSize: 10,
        total: 90,
        currentPage: 1
      },
      currentBill: {
        id: '',
        name: '',
        status: 6,
        output: '',
        outputmount: 0,
        outputclass: 2,
        estimatetime: 72,
        material: [],
        meta: {
          reason: '',
          stoppedTime: 2,
          haveOutput: [],
          haveUsed: [],
          left: []
        },
        distributedStation: '',
        description: ''
      },
      redistribute: {
        id: '',
        name: '',
        output: '',
        left: '',
        add: ''
      },
      editBillInput: {
        inputVisible: false,
        inputValue: ''
      }
    }
  },
  methods: {
    handleSearch () {
      console.log('Searching...')
      console.log(this.searchStoppedBill)
      this.reloadData()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    reloadData () {
      console.log('Reload Data......')
      this.dataLoading = true
      var self = this
      setTimeout(function () { self.dataLoading = false }, 1000)
    },
    handleRestart () {
      console.log('Restart ')
      console.log(this.multipleSelection)
    },
    handleStop () {
      console.log('Stop......')
      console.log(this.multipleSelection)
    },
    handleRedistribute (row) {
      this.redistribute = {
        id: row.id,
        name: row.name,
        output: row.meta.haveOutput,
        left: row.meta.left,
        add: []
      }
      this.reDistributingVisible = true
    },
    handleRedistributeSubmit (row) {
      console.log(this.redistribute)
      this.reDistributingVisible = false
    },
    handleLookUp (row) {
      console.log('Look Up ' + row.id)
      this.currentBill = Object.assign({}, row)
      this.lookupVisible = true
    },
    handlePagination () {
      console.log('Page to ' + this.pagination.currentPage)
      this.reloadData()
    },
    handleEditBillClose (tag) {
      this.redistribute.add.splice(this.redistribute.add.indexOf(tag), 1)
    },
    showEditBillInput () {
      this.editBillInput.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleEditBillInputConfirm () {
      let inputValue = this.editBillInput.inputValue
      if (inputValue) {
        this.redistribute.add.push(inputValue)
      }
      this.editBillInput.inputVisible = false
      this.editBillInput.inputValue = ''
    }
  },
  mounted () {
    this.reloadData()
  },
  computed: {
    searchDisabled () {
      return this.searchStoppedBill.id === '' &&
        this.searchStoppedBill.name === '' &&
        this.searchStoppedBill.outputclass === '' &&
        this.searchStoppedBill.outputname === '' &&
        this.searchStoppedBill.materialname === '' &&
        this.searchStoppedBill.station === ''
    },
    restartDisabled () {
      return this.multipleSelection.length === 0
    }
  }
}
</script>

<style>
.search_stoppedbill_part {
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.searchstoppedbilltip {
  width: 8%;
  margin-left: 5px;
  margin-top: 10px;
  margin-bottom: 20px;
  color: #606266;
  text-align: right;
  display: inline-block;
  white-space:nowrap;
}
.searchstoppedbillinput {
  width: 14%;
  display: inline-block;
  white-space:nowrap;
}
.new_stoppedbill_class {
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.pagination_class {
  margin: 40px;
  text-align: center;
}
.stoppedbilltip {
  display: inline-block;
  width: 29%;
  text-align: right;
  vertical-align: center;
  margin-top: 10px;
}
.stoppedbillinput {
  display: inline-block;
  width: 70%;
  margin-top: 10px;
}
.stoppedbillinputsp {
  display: inline-block;
  width: 70%;
  margin-top: 10px;
}
.stoppedbilldrawertip {
  display: inline-block;
  width: 25%;
  text-align: right;
  vertical-align: center;
  margin-top: 10px;
}
.stoppedbilldrawerinput {
  display: inline-block;
  width: 70%;
  margin-top: 10px;
}
.stoppedbilldrawerinputsp {
  display: inline-block;
  width: 70%;
  margin-top: 10px;
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
