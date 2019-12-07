<template>
<div>
  <div class="search_process_part">
    <el-row>
      <span class="searchtip">编号：</span>
      <el-input placeholder="请输入您工序编号"
        class='searchinput'
        v-model="searchId"
        clearable/>
      <span class="searchtip">名称：</span>
      <el-input placeholder="请输入您工序名称"
        class='searchinput'
        v-model="searchName"
        clearable/>
      <span class="searchtip">状态：</span>
      <el-select v-model="searchStatus" placeholder="请选择状态">
        <el-option :label="processStatus[0].name" :value="processStatus[0].id"></el-option>
        <el-option :label="processStatus[1].name" :value="processStatus[1].id"></el-option>
        <el-option :label="processStatus[2].name" :value="processStatus[2].id"></el-option>
      </el-select>
      <el-button icon="el-icon-search"
        :disabled='searchDisabled'
        style="margin-left: 40px;"
        type="primary" @click='handleSearch'>搜 索</el-button>
    </el-row>
  </div>
  <div class="new_process_class">
    <el-button icon="el-icon-edit"
      type="primary" @click='handleNewProcess'>
        创建新工序
    </el-button>
  </div>
  <el-table
    class="process_table_class"
    :data="processesData"
    :default-sort = "{prop: 'id', order: 'descending'}"
    stripe
    style="width: 100%">
    <el-table-column
      fixed="left"
      prop="id"
      sortable
      label="工序编号"
      width="120">
    </el-table-column>
    <el-table-column
      prop="name"
      sortable
      label="名称"
      width="120">
    </el-table-column>
    <el-table-column
      width="120"
      sortable
      label="状态">
      <template slot-scope="scope">
        <span>{{processStatus[scope.row.status-1].name}}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="所需物料"
      width="360">
      <template slot-scope="scope">
        <span v-for="(material, index) in scope.row.material"
          style="color: #909399;"
          :key=index>
          {{material.id + '/' + material.name + '*' + material.mount + ' '}}
        </span>
      </template>
    </el-table-column>
    <el-table-column
      prop="output"
      label="产出"
      width="180">
      <template slot-scope="scope">
        <span>{{scope.row.output}} * {{scope.row.outputmount}}</span>
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
          @click='handleLookUp(scope.row)'>查看</el-button>
        <el-button type="text" size="small"
          @click='handleEdit(scope.row)'>编辑</el-button>
        <el-button type="text" size="small"
          v-if="scope.row.status !== '1'"
          @click='handleStart(scope.row.id)'>启用</el-button>
        <el-button type="text" size="small"
          v-if="scope.row.status !== '2'"
          @click='handleStop(scope.row.id)'>停用</el-button>
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
  <el-dialog
    class="new_process_dialog_class"
    :modal="false"
    title="新建工序"
    :visible.sync="newProcessDialogVisible"
    width="30%">
      <el-row>
        <div class='tip'>名称：</div>
        <div class='input'>
          <el-input placeholder="请输入工序名称"
                  v-model="newProcess.name"
                  clearable/>
        </div>
      </el-row>
      <el-row>
        <div class='tip'>状态：</div>
        <div class='input'>
          <el-select v-model="newProcess.status" placeholder="请选择状态">
            <el-option :label="processStatus[0].name" :value="processStatus[0].id"></el-option>
            <el-option :label="processStatus[1].name" :value="processStatus[1].id"></el-option>
            <el-option :label="processStatus[2].name" :value="processStatus[2].id"></el-option>
          </el-select>
        </div>
      </el-row>
      <el-row>
        <div class='tip'>描述：</div>
        <div class='input'>
          <el-input placeholder="请输入工序详细描述"
                  type="textarea"
                  v-model="newProcess.description"
                  clearable/>
        </div>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newProcessDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleNewProcessSubmit">新 建</el-button>
      </span>
  </el-dialog>
  <el-dialog
    class="process_detail_dialog_class"
    title="工序详情"
    :modal="false"
    :visible.sync="processDetailDialogVisible"
    width="30%">
      <el-row>
        <div class='tip'>编号：</div>
        <div class='input'>{{currentProcess.id}}</div>
      </el-row>
      <el-row>
        <div class='tip'>名称：</div>
        <div class='input'>{{currentProcess.name}}</div>
      </el-row>
      <el-row>
        <div class='tip'>状态：</div>
        <div class='input'>
          {{processStatus[currentProcess.status - 1].name}}
        </div>
      </el-row>
      <el-row>
        <div class='tip'>描述：</div>
        <div class='input'>{{currentProcess.description}}</div>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="processDetailDialogVisible = false">
          取 消
        </el-button>
        <el-button type="primary"
          @click="processDetailDialogVisible = false">
          确 定
        </el-button>
      </span>
  </el-dialog>
  <el-dialog
    class="modify_process_dialog_class"
    :modal="false"
    title="修改工序"
    :visible.sync="modifyProcessDialogVisible"
    width="30%">
     <el-row>
        <div class='tip'>编号：</div>
        <div class='input'>
          {{currentProcess.id}}
        </div>
      </el-row>
      <el-row>
        <div class='tip'>名称：</div>
        <div class='input'>
          <el-input placeholder="请输入工序名称"
                  v-model="currentProcess.name"
                  clearable/>
        </div>
      </el-row>
      <el-row>
        <div class='tip'>状态：</div>
        <div class='input'>
          <el-select v-model="currentProcess.status" placeholder="请选择状态">
            <el-option :label="processStatus[0].name" :value="processStatus[0].id"></el-option>
            <el-option :label="processStatus[1].name" :value="processStatus[1].id"></el-option>
            <el-option :label="processStatus[2].name" :value="processStatus[2].id"></el-option>
          </el-select>
        </div>
      </el-row>
      <el-row>
        <div class='tip'>描述：</div>
        <div class='input'>
          <el-input placeholder="请输入工序详细描述"
                  type="textarea"
                  v-model="currentProcess.description"
                  clearable/>
        </div>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyProcessDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleModifySubmit">修 改</el-button>
      </span>
  </el-dialog>
</div>
</template>

<script>
import testprocess from '../../config/testprocess.js'
import processstatus from '../../config/processstatus.js'

export default {
  name: 'ProcessComp',
  data () {
    return {
      searchId: '',
      searchName: '',
      searchStatus: '',
      currentPage: 1,
      processStatus: processstatus,
      processesData: testprocess,
      processesNumber: 20,
      newProcessDialogVisible: false,
      processDetailDialogVisible: false,
      modifyProcessDialogVisible: false,
      newProcess: {
        name: '',
        status: '',
        description: ''
      },
      currentProcess: {
        id: '',
        name: '',
        status: 1,
        description: ''
      }
    }
  },
  methods: {
    handleSearch () {
      console.log('Searching...' + this.searchId + this.searchName + this.searchStatus)
      // reload process data
    },
    handleNewProcess () {
      this.newProcessDialogVisible = true
      this.newProcess = {
        name: '',
        status: '',
        description: ''
      }
    },
    handleEdit (row) {
      this.modifyProcessDialogVisible = true
      this.currentProcess.id = row.id
      this.currentProcess.name = row.name
      this.currentProcess.status = row.status
      this.currentProcess.description = row.description
      // reload process data
    },
    handleModifySubmit () {
      console.log('Modify Process ' + this.currentProcess.id + this.currentProcess.name + this.currentProcess.status + this.currentProcess.description)
      this.modifyProcessDialogVisible = false
    },
    handleStart (id) {
      console.log('Start' + id)
      // reload process data
    },
    handleStop (id) {
      console.log('Stop' + id)
      // reload process data
    },
    handleLookUp (row) {
      this.processDetailDialogVisible = true
      this.currentProcess.id = row.id
      this.currentProcess.name = row.name
      this.currentProcess.status = row.status
      this.currentProcess.description = row.description
    },
    handlePagination () {
      console.log('Page to ' + this.currentPage)
      // reload process data
    },
    handleNewProcessSubmit () {
      console.log('New Process ' + this.newProcess.name + this.newProcess.status + this.newProcess.description)
      this.newProcessDialogVisible = false
      // reload process data
    }
  },
  computed: {
    searchDisabled () {
      return this.searchId === '' &&
        this.searchName === '' &&
        this.searchStatus === ''
    }
  }
}
</script>

<style>
.search_process_part {
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
.new_process_class {
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.process_table_class {
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
