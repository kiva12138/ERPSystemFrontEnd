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

      <span class="searchstoppedbilltip">产出物料编号：</span>
      <el-input placeholder="请输入产出物料名称"
        class='searchstoppedbillinput'
        type="number"
        v-model="searchStoppedBill.outputname"
        clearable/>

      <span class="searchstoppedbilltip">所需物料编号：</span>
      <el-input placeholder="请输入所需物料名称"
        class='searchstoppedbillinput'
        type="number"
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
      icon="el-icon-refresh"
      type="success" :disabled="restartDisabled">
      重新启动选中工单
    </el-button>
    <el-button size="small" @click='handleStop()'
      icon="el-icon-delete"
      type="danger" :disabled="restartDisabled">
      物料回收并停止选中工单
    </el-button>
  </div>

  <el-table
    class="stoppedbill_table_class"
    size="small"
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
        <span>{{scope.row.output}}*{{scope.row.outputMount}}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="已产出物料"
      align="center"
      width="100">
      <template slot-scope="scope">
        <span>{{scope.row.output}}*{{scope.row.haveoutputMount}}</span>
      </template>
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
      label="已停滞时间"
      align="center"
      width="120">
      <template slot-scope="scope">
        <span>{{getStoppedTime(scope.row.estimateTime, scope.row.stoppedTime)}}小时</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="station"
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
          <div v-for="(mitem, index1) in scope.row.materials" :key="index1">
            <span style="color: #C0C4CC">{{mitem.id}}</span>
            <span> {{mitem.name}}</span>
          </div>
          <div slot="reference">
              <span v-for="(item, index) in scope.row.materials" :key="index"
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
            {{scope.row.stoppedReason}}
          </div>
          <div slot="reference">
            <span style="white-space: nowrap; text-overflow:ellipsis; overflow:hidden;">
              {{scope.row.stoppedReason}}
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
      <div class='stoppedbilltip'>停滞时间：</div>
      <div class='stoppedbillinput' style="color: #E6A23C;">
        <span>{{getTimeInFormat(currentBill.stoppedTime)}}</span>
      </div>
    </el-row>
    <el-row>
      <div class='stoppedbilltip'>预计完成时间：</div>
      <div class='stoppedbillinput' style="color: #E6A23C;">
        <span>{{currentBill.estimateTime}}小时</span>
      </div>
    </el-row>
    <el-row>
      <div class='stoppedbilltip'>停滞原因：</div>
      <div class='stoppedbillinput'>
        <span>{{currentBill.stoppedReason}}</span>
      </div>
    </el-row>
    <el-row>
      <div class='stoppedbilltip'>预计生产：</div>
      <div class='stoppedbillinput'>
        <span>{{currentBill.output}} * {{currentBill.outputMount}} 件</span>
      </div>
    </el-row>
    <el-row>
      <div class='stoppedbilltip'>停滞前已生产：</div>
      <div class='stoppedbillinput' style="color: #67C23A;">
        <span>{{currentBill.output}} * {{currentBill.haveoutputMount}} 件</span>
      </div>
    </el-row>
    <el-row>
      <div class='stoppedbilltip'>停滞前分配物料：</div>
      <div class='stoppedbillinput'>
        <span v-for="(mitem, index1) in currentBill.materials" :key="index1">
          {{mitem.name}} </span>
      </div>
    </el-row>
    <el-row>
      <div class='stoppedbilltip'>停滞前已使用物料：</div>
      <div class='stoppedbillinput'>
        <span v-for="(mitem, index1) in currentBill.haveused" :key="index1">
          {{mitem.name}} </span>
      </div>
    </el-row>
    <!--
    <el-row>
      <div class='stoppedbilltip'>停滞后剩余物料：</div>
      <div class='stoppedbillinput'>
        <span v-for="(mitem, index1) in currentBill.meta.left" :key="index1">
          {{mitem.name}} </span>
      </div>
    </el-row>
    -->
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
      <div class='stoppedbilldrawertip'>欲产出物料：</div>
      <div class='stoppedbilldrawerinput'>
        <span>{{redistribute.output}}</span>
      </div>
    </el-row>
    <el-row>
      <div class='stoppedbilldrawertip'>已产出物料：</div>
      <div class='stoppedbilldrawerinput'>
        <span>{{redistribute.haveoutput}} </span>
      </div>
    </el-row>
    <el-row>
      <div class='stoppedbilldrawertip'>已分配物料：</div>
      <div class='stoppedbilldrawerinput'>
        <span v-for="(mitem, index1) in redistribute.materials" :key="index1">
          {{mitem.name}} </span>
      </div>
    </el-row>
    <el-row>
      <div class='stoppedbilldrawertip'>已使用物料：</div>
      <div class='stoppedbilldrawerinput'>
        <span v-for="(mitem, index1) in redistribute.usedmaterials" :key="index1">
          {{mitem.name}} </span>
      </div>
    </el-row>
    <el-row>
      <div class='stoppedbilldrawertip'>新分配物料：</div>
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
        <span style="color: #909399; margin-left: 20px; vertical-align: top;">
          提示：
        </span>
      </div>
      <div class='stoppedbilldrawerinput'>
        <span style="color: #909399;">
          若需要多个物料则使用*隔开，如物料A*4
        </span>
      </div>
    </div>
    <div>
      <div class='stoppedbilldrawertip'>
        <span style="color: #909399; margin-left: 20px; vertical-align: top;">
        </span>
      </div>
      <div class='stoppedbilldrawerinput'>
        <span style="color: #909399; ">
          重新分配物料不包含上次剩余物料，上次剩余物料会自动回收。
        </span>
      </div>
    </div>
    <div>
      <el-row style="text-align: center; margin-top: 40px;">
        <el-button icon="el-icon-edit"
          type="primary" @click='handleRedistributeSubmit'>
            分配并重启
        </el-button>
      </el-row>
    </div>
  </el-drawer>

</div>
</template>

<script>
import billstatus from '../../../config_new/billstatus.js'
import materialclass from '../../../config_new/materialclass.js'
// import teststoppedbill from '../../../config_new/teststoppedbill.js'

export default {
  name: 'Stopped',
  data () {
    return {
      billStatus: billstatus,
      materialClass: materialclass,
      testStoppedBill: [],
      lookupVisible: false,
      reDistributingVisible: false,
      dataLoading: false,
      multipleSelection: [],
      stoppedData: {
        producing: 0,
        stopped: 0
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
        pageSize: 15,
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
        haveoutput: '',
        materials: '',
        usedmaterials: '',
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
      console.log(this.searchStoppedBill)
      this.reloadData()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    reloadData () {
      console.log('Reload Data......')
      this.dataLoading = true
      var id = 0
      if (this.searchStoppedBill.id !== '') {
        id = this.searchStoppedBill.id
      }
      var kind = 0
      if (this.searchStoppedBill.outputclass !== '') {
        kind = this.searchStoppedBill.outputclass
      }
      var output = 0
      if (this.searchStoppedBill.outputname !== '') {
        output = this.searchStoppedBill.outputname
      }
      var material = 0
      if (this.searchStoppedBill.materialname !== '') {
        material = this.searchStoppedBill.materialname
      }
      var station = 0
      if (this.searchStoppedBill.staion !== '') {
        station = this.searchStoppedBill.station
      }
      this.$axios({
        method: 'get',
        url: this.GLOBAL.backEndIp + '/api/bill/findwithstatus',
        params: {
          id: id,
          name: this.searchStoppedBill.name,
          kind: kind,
          status: 6,
          output: output,
          material: material,
          stationId: station,
          page: this.pagination.currentPage - 1
        }
      }).then(response => {
        if (response.data.code === 1) {
          this.testStoppedBill = response.data.data
          this.pagination.total = response.data.allLength
        } else {
          this.$message({
            message: '查询失败。' + '错误原因：' + response.data.code + '-' + response.data.message,
            type: 'error'
          })
        }
      }).catch(error => {
        this.$message({
          message: '查询错误。' + '错误原因：' + error.response.status,
          type: 'error'
        })
      })
      this.dataLoading = false
    },
    handleRestart () {
      for (var i = 0; i < this.multipleSelection.length; i++) {
        this.$axios({
          method: 'post',
          url: this.GLOBAL.backEndIp + '/api/bill/restart',
          params: {
            id: this.multipleSelection[i].id
          }
        }).then(response => {
          if (response.data.code === 1) {
            this.$message({
              message: '重新启动成功。',
              type: 'success'
            })
          } else {
            this.$message({
              message: '重新启动失败。' + '错误原因：' + response.data.code + '-' + response.data.message,
              type: 'error'
            })
          }
        }).catch(error => {
          this.$message({
            message: '重新启动错误。' + '错误原因：' + error.response.status,
            type: 'error'
          })
        })
      }
      this.reloadData()
    },
    handleStop () {
      for (var i = 0; i < this.multipleSelection.length; i++) {
        this.$axios({
          method: 'post',
          url: this.GLOBAL.backEndIp + '/api/bill/recycleandstop',
          params: {
            id: this.multipleSelection[i].id
          }
        }).then(response => {
          if (response.data.code === 1) {
            this.$message({
              message: '回收成功。',
              type: 'success'
            })
          } else {
            this.$message({
              message: '回收失败。' + '错误原因：' + response.data.code + '-' + response.data.message,
              type: 'error'
            })
          }
        }).catch(error => {
          this.$message({
            message: '回收错误。' + '错误原因：' + error.response.status,
            type: 'error'
          })
        })
      }
      this.reloadData()
    },
    handleRedistribute (row) {
      this.redistribute = {
        id: row.id,
        name: row.name,
        output: row.output + ' * ' + row.outputMount + '件',
        haveoutput: row.haveoutputMount + '件',
        materials: row.materials,
        usedmaterials: row.haveused,
        add: []
      }
      this.reDistributingVisible = true
    },
    handleRedistributeSubmit (row) {
      console.log(this.redistribute)
      this.reDistributingVisible = false
      this.$axios({
        method: 'post',
        url: this.GLOBAL.backEndIp + '/api/bill/redistributeandstart',
        data: {
          id: this.redistribute.id,
          materials: this.redistribute.add
        }
      }).then(response => {
        if (response.data.code === 1) {
          this.$message({
            message: '分配成功。',
            type: 'success'
          })
        } else {
          this.$message({
            message: '分配失败。' + '错误原因：' + response.data.code + '-' + response.data.message,
            type: 'error'
          })
        }
      }).catch(error => {
        this.$message({
          message: '分配错误。' + '错误原因：' + error.response.status,
          type: 'error'
        })
      })
      this.reloadData()
    },
    handleLookUp (row) {
      this.currentBill = Object.assign({}, row)
      console.log(this.currentBill)
      this.lookupVisible = true
    },
    handlePagination () {
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
    },
    getStoppedTime (estimateTime, acceptedTime) {
      var dateStrs = acceptedTime.split('T')[0].split('-')
      var timeStrs = acceptedTime.split('T')[1].split('.')[0].split(':')
      var year = parseInt(dateStrs[0], 10)
      var month = parseInt(dateStrs[1], 10)
      var day = parseInt(dateStrs[2], 10)
      var hour = parseInt(timeStrs[0], 10)
      var minute = parseInt(timeStrs[1], 10)
      var second = parseInt(timeStrs[2], 10)
      var accTime = new Date(year, month - 1, day, hour, minute, second)
      accTime.setHours(accTime.getHours() + estimateTime)
      var now = new Date()
      var usedTime = now - accTime
      var result = (usedTime / (1000 * 60 * 60)).toFixed(2)
      return result
    },
    getTimeInFormat (time) {
      if (time === undefined) {
        return ''
      }
      var dateStrs = time.split('T')[0].split('-')
      var timeStrs = time.split('T')[1].split('.')[0].split(':')
      var year = parseInt(dateStrs[0], 10)
      var month = parseInt(dateStrs[1], 10) + 1
      var day = parseInt(dateStrs[2], 10)
      var hour = parseInt(timeStrs[0], 10)
      var minute = parseInt(timeStrs[1], 10)
      var second = parseInt(timeStrs[2], 10)
      return year + '年' + month + '月' + day + '日 ' +
        hour + '时' + minute + '分' + second + '秒'
    }
  },
  mounted () {
    this.reloadData()
    this.$axios({
      method: 'get',
      url: this.GLOBAL.backEndIp + '/api/bill/alldata'
    }).then(response => {
      if (response.data.code === 1) {
        this.$message({
          message: '查询成功。',
          type: 'success'
        })
        this.stoppedData = {
          producing: response.data.producing + response.data.overtime,
          stopped: response.data.stopped
        }
      } else {
        this.$message({
          message: '查询失败。' + '错误原因：' + response.data.code + '-' + response.data.message,
          type: 'error'
        })
      }
    }).catch(error => {
      this.$message({
        message: '查询错误。' + '错误原因：' + error.response.status,
        type: 'error'
      })
    })
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
  width: 33%;
  text-align: right;
  vertical-align: center;
  margin-top: 10px;
}
.stoppedbillinput {
  display: inline-block;
  width: 65%;
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
