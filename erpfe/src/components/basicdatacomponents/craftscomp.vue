<template>
<div>
  <div class="search_craft_part">
    <el-row>
      <span class="searchtip">编号：</span>
      <el-input placeholder="请输入您工艺编号"
        class='searchinput'
        v-model="searchId"
        clearable/>
      <span class="searchtip">名称：</span>
      <el-input placeholder="请输入您工艺名称"
        class='searchinput'
        v-model="searchName"
        clearable/>
      <span class="searchtip">状态：</span>
      <el-select v-model="searchStatus" placeholder="请选择状态">
        <el-option :label="craftStatus[0].name" :value="craftStatus[0].id"></el-option>
        <el-option :label="craftStatus[1].name" :value="craftStatus[1].id"></el-option>
      </el-select>
      <el-button icon="el-icon-search"
        :disabled='searchDisabled'
        style="margin-left: 40px;"
        type="primary" @click='handleSearch'>搜 索</el-button>
    </el-row>
    <el-row>
      <span class="searchtip">工序编号：</span>
      <el-input placeholder="请输入工序编号"
        class='searchinput'
        v-model="searchProcessId"
        clearable/>
      <span class="searchtip">工序名称：</span>
      <el-input placeholder="请输入工序名称"
        class='searchinput'
        v-model="searchProcessName"
        clearable/>
    </el-row>
  </div>
  <div class="new_craft_class">
    <el-button icon="el-icon-edit"
      type="primary" @click='handleNewCraft'>
        创建工艺路线
    </el-button>
  </div>
  <el-table
    class="craft_table_class"
    :data="craftesData"
    :default-sort = "{prop: 'id', order: 'descending'}"
    stripe
    style="width: 100%">
    <el-table-column
      fixed="left"
      prop="id"
      sortable
      label="工艺编号"
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
        <span>{{craftStatus[scope.row.status-1].name}}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="工序路线">
      <template slot-scope="scope">
        <span v-for="(process, index) in scope.row.processes"
          style="color: #909399;"
          :key=index>
          {{process.id + '/' + process.name + ' '}}
        </span>
      </template>
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
          @click='handleStart(scope.row.id)'>发布</el-button>
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
    :total="craftesNumber">
  </el-pagination>
  <el-dialog
    class="new_craft_dialog_class"
    :modal="false"
    title="新建工艺"
    :visible.sync="newCraftDialogVisible"
    width="30%">
      <el-row>
        <div class='tip'>名称：</div>
        <div class='input'>
          <el-input placeholder="请输入工艺名称"
                  v-model="newCraft.name"
                  clearable/>
        </div>
      </el-row>
      <el-row>
        <div class='tip'>状态：</div>
        <div class='input'>
          <el-select v-model="newCraft.status" placeholder="请选择状态">
            <el-option :label="craftStatus[0].name" :value="craftStatus[0].id"></el-option>
            <el-option :label="craftStatus[1].name" :value="craftStatus[1].id"></el-option>
          </el-select>
        </div>
      </el-row>
      <el-row>
        <div class='tip'>工序路线：</div>
        <div class='input'>
          <el-tag
            :key="tag"
            v-for="tag in newCraft.processes"
            closable
            :disable-transitions="false"
            @close="handleCloseNewProcess(tag)">
            {{tag}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small"
            @click="showInput">+ 新工序编号</el-button>
        </div>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newCraftDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleNewCraftSubmit">新 建</el-button>
      </span>
  </el-dialog>
  <el-dialog
    class="craft_detail_dialog_class"
    title="工艺详情"
    :modal="false"
    :visible.sync="craftDetailDialogVisible"
    width="30%">
      <el-row>
        <div class='tip'>编号：</div>
        <div class='input'>{{currentCraft.id}}</div>
      </el-row>
      <el-row>
        <div class='tip'>名称：</div>
        <div class='input'>{{currentCraft.name}}</div>
      </el-row>
      <el-row>
        <div class='tip'>状态：</div>
        <div class='input'>
          {{craftStatus[currentCraft.status - 1].name}}
        </div>
      </el-row>
      <el-row>
        <div class='tip'>工序路线：</div>
        <div class='input'>
          <span v-for="(process, index) in currentCraft.processes"
            style="color: #909399;"
            :key=index>
            {{process.id + '/' + process.name + ' '}}
          </span>
        </div>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="craftDetailDialogVisible = false">
          取 消
        </el-button>
        <el-button type="primary"
          @click="craftDetailDialogVisible = false">
          确 定
        </el-button>
      </span>
  </el-dialog>
  <el-dialog
    class="modify_craft_dialog_class"
    :modal="false"
    title="修改工艺"
    :visible.sync="modifyCraftDialogVisible"
    width="30%">
     <el-row>
        <div class='tip'>编号：</div>
        <div class='input'>
          {{currentCraft.id}}
        </div>
      </el-row>
      <el-row>
        <div class='tip'>名称：</div>
        <div class='input'>
          <el-input placeholder="请输入工艺名称"
                  v-model="currentCraft.name"
                  clearable/>
        </div>
      </el-row>
      <el-row>
        <div class='tip'>状态：</div>
        <div class='input'>
          <el-select v-model="currentCraft.status" placeholder="请选择状态">
            <el-option :label="craftStatus[0].name" :value="craftStatus[0].id"></el-option>
            <el-option :label="craftStatus[1].name" :value="craftStatus[1].id"></el-option>
          </el-select>
        </div>
      </el-row>
      <el-row>
        <div class='tip'>工序路线：</div>
        <div class='input'>
          <el-tag
            :key="tag.id"
            v-for="tag in currentCraft.processes"
            closable
            :disable-transitions="false"
            @close="handleCloseCurrentProcess(tag)">
            {{tag.id}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirmCurrent"
            @blur="handleInputConfirmCurrent"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small"
            @click="showInput">+ 新工序编号</el-button>
        </div>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyCraftDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleModifySubmit">修 改</el-button>
      </span>
  </el-dialog>
</div>
</template>

<script>
import testcraft from '../../config/testcraft.js'
import craftstatus from '../../config/craftsstatus.js'

export default {
  name: 'CraftsComp',
  data () {
    return {
      searchId: '',
      searchName: '',
      searchStatus: '',
      searchProcessId: '',
      searchProcessName: '',
      currentPage: 1,
      craftStatus: craftstatus,
      craftesData: testcraft,
      craftesNumber: 20,
      newCraftDialogVisible: false,
      craftDetailDialogVisible: false,
      modifyCraftDialogVisible: false,
      newCraft: {
        name: '',
        status: '',
        processes: []
      },
      currentCraft: {
        id: '',
        name: '',
        status: 1,
        processes: []
      },
      inputVisible: false,
      inputValue: ''
    }
  },
  methods: {
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm () {
      let inputValue = this.inputValue
      if (inputValue) {
        this.newCraft.processes.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    handleCloseNewProcess (tag) {
      this.newCraft.processes.splice(this.newCraft.processes.indexOf(tag), 1)
    },
    showInputCurrent () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirmCurrent () {
      let inputValue = this.inputValue
      if (inputValue) {
        this.currentCraft.processes.push({'id': inputValue, 'name': 'tmp'})
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    handleCloseCurrentProcess (tag) {
      this.currentCraft.processes.splice(this.currentCraft.processes.indexOf(tag), 1)
    },
    handleSearch () {
      console.log('Searching...' + this.searchId + this.searchName + this.searchStatus)
      // reload craft data
    },
    handleNewCraft () {
      this.newCraftDialogVisible = true
      this.newCraft = {
        name: '',
        status: '',
        processes: []
      }
    },
    handleEdit (row) {
      this.modifyCraftDialogVisible = true
      this.currentCraft.id = row.id
      this.currentCraft.name = row.name
      this.currentCraft.status = row.status
      this.currentCraft.processes = row.processes
      // reload craft data
    },
    handleModifySubmit () {
      console.log('Modify craft ' + this.currentCraft.id + this.currentCraft.name + this.currentCraft.status + this.currentCraft.processes)
      this.modifyCraftDialogVisible = false
    },
    handleStart (id) {
      console.log('Start' + id)
      // reload craft data
    },
    handleStop (id) {
      console.log('Stop' + id)
      // reload craft data
    },
    handleLookUp (row) {
      this.craftDetailDialogVisible = true
      this.currentCraft.id = row.id
      this.currentCraft.name = row.name
      this.currentCraft.status = row.status
      this.currentCraft.processes = row.processes
    },
    handlePagination () {
      console.log('Page to ' + this.currentPage)
      // reload craft data
    },
    handleNewCraftSubmit () {
      console.log('New craft ' + this.newCraft.name + this.newCraft.status + this.newCraft.processes)
      this.newCraftDialogVisible = false
      // reload craft data
    }
  },
  computed: {
    searchDisabled () {
      return this.searchId === '' &&
        this.searchName === '' &&
        this.searchStatus === '' &&
        this.searchProcessName === '' &&
        this.searchProcessId === ''
    }
  }
}
</script>

<style>
.search_craft_part {
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.searchtip {
  width: 7%;
  margin-left: 10px;
  margin-top: 10px;
  margin-bottom: 20px;
  color: #606266;
  text-align: right;
  display: inline-block;
}
.searchinput {
  width: 20%;
  margin-right: 20px;
  display: inline-block;
}
.new_craft_class {
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.craft_table_class {
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
.el-tag + .el-tag {
  margin-left: 10px;
  margin-top: 10px;
}
.button-new-tag {
  margin-left: 10px;
  margin-top: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  margin-top: 10px;
  vertical-align: bottom;
}
</style>
