<template>
<div>

  <div class="search_bill_part">
    <el-row>
      <span class="searchbilltip">工单编号：</span>
      <el-input placeholder="请输入工单编号"
        class='searchbillinput'
        v-model="searchBill.id"
        type="number"
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

      <span class="searchbilltip">产出物料编号：</span>
      <el-input placeholder="请输入产出物料编号"
        class='searchbillinput'
        type="number"
        v-model="searchBill.outputname"
        clearable/>

      <span class="searchbilltip">所需物料编号：</span>
      <el-input placeholder="请输入所需物料编号"
        class='searchbillinput'
        type="number"
        v-model="searchBill.materialname"
        clearable/>

      <el-button icon="el-icon-search"
        :disabled='searchDisabled'
        style="margin-left: 40px;"
        type="primary" @click='handleSearch'>筛选工单</el-button>

    </el-row>
  </div>

  <div class="new_bill_class">
    <el-button icon="el-icon-edit"
      size="small"
      type="primary" @click='handleNewBill'>
        创建新的工单
    </el-button>
  </div>

  <el-table
    class="bill_table_class"
    :data="testCreatedBill"
    :default-sort = "{prop: 'id', order: 'descending'}"
    stripe
    size="small"
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
      width="120">
      <template slot-scope="scope">
        <span>{{scope.row.output}} * {{scope.row.outputMount}}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="产出类型"
      align="center"
      width="100">
      <template slot-scope="scope">
        <span>{{materialClass[scope.row.outputKind - 1].name}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="estimateTime"
      sortable
      label="预计完成时间(时)"
      align="center"
      width="180">
    </el-table-column>
    <el-table-column
      label="状态"
      align="center"
      width="100">
      <template slot-scope="scope">
        <i class="el-icon-circle-check" style="color: #409EFF;"/>
        <span style="color: #409EFF;">{{billStatus[scope.row.status - 1].name}}</span>
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
        <el-button type="text" size="small"
          @click='handleEdit(scope.row)'>编辑</el-button>
        <el-button type="text" size="small"
          @click='handleDistributed(scope.row)'>分配</el-button>
        <el-button type="text" size="small" style="color: #F56C6C;"
          @click='handleDelete(scope.row.id)'>删除</el-button>
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
    title="分配工单"
    :visible.sync="distributeBillVisible"
    width="30%">
    <el-row>
      <div class='billtip'>工单编号：</div>
      <div class='billinput'>
        <span>{{distributingBill.id}}</span>
      </div>
    </el-row>
    <el-row>
      <div class='billtip'>工单名称：</div>
      <div class='billinput'>
        <span>{{distributingBill.name}}</span>
      </div>
    </el-row>
    <el-row>
      <div class='billtip'>分配工位：</div>
      <div class='billinput'>
        <el-input placeholder="请输入工位编号"
          class='billinput'
          type="number"
          v-model="distributingBill.stationId"
          clearable/>
      </div>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="distributeBillVisible = false">取 消</el-button>
      <el-button type="primary"
        @click="handleDistributionSubmit"
        :disabled="distributeDisabled">确认分配</el-button>
    </span>
  </el-dialog>

  <el-drawer
    title="新建工单"
    :visible.sync="newBillVisible"
    direction="rtl"
    custom-class="newbill-drawer"
    ref="drawer"
    >
    <div class="newbill-drawer__content">
      <el-row>
        <div class='billtip'>工单名称：</div>
        <div class='billinput'>
          <el-input placeholder="请输入工单名称" v-model="newBill.name" clearable/>
        </div>
      </el-row>
      <el-row>
        <div class='billtip'>产出物料：</div>
        <div class='billinput'>
          <el-input placeholder="请输入产出物料ID" v-model="newBill.outputid" type="number" clearable/>
        </div>
      </el-row>
      <el-row>
        <div class='billtip'>产出数量：</div>
        <div class='billinput'>
          <el-input-number v-model="newBill.outputmount" :min="1" :max="99999"/>
        </div>
      </el-row>
      <el-row>
        <div class='billtip'>预计时间(时)：</div>
        <div class='billinput'>
          <el-input-number v-model="newBill.estimatetime" :min="1" :max="99999"/>
        </div>
      </el-row>
      <el-row>
        <div class='billtip'>使用生产树：</div>
        <div class='billinput'>
          <el-switch
            v-model="useTree"
            active-color="#13ce66"
            inactive-color="#ff4949"/>
          <span style="color: #909399; font-size: 80%;">   *系统推荐使用生产树</span>
        </div>
      </el-row>
      <span v-if="!useTree">
        <el-row>
          <div class='billtip'>所需物料：</div>
          <div class='billinput'>
            <el-tag
              :key="tag"
              v-for="tag in newBill.material"
              closable
              :disable-transitions="false"
              @close="handleNewBillClose(tag)">
              {{tag}}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="newBillInput.inputVisible"
              v-model="newBillInput.inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleNewBillInputConfirm"
              @blur="handleNewBillInputConfirm"/>
            <el-button v-else class="button-new-tag" size="small" @click="showNewBillInput">+ 新物料</el-button>
          </div>
        </el-row>
        <el-row>
          <div class='billtip'>
            <span style="color: #909399; margin-left: 20px;">
              提示：
            </span>
          </div>
          <div class='billinput'>
            <span style="color: #909399; margin-left: 20px;">
              若需要多个物料则使用*隔开，如物料A*4
            </span>
          </div>
        </el-row>
      </span>
      <span v-if="useTree">
        <el-row>
          <div class='billtip'>生产树编号：</div>
          <div class='billinput'>
            <el-input v-model="newBill.treeid" type="number" placeholder="请输入生产树ID"/>
          </div>
        </el-row>
      </span>
      <el-row>
        <div class='billtip'>描述：</div>
        <div class='billinput'>
          <el-input v-model="newBill.description" type="textarea" placeholder="请输入工单名称" clearable/>
        </div>
      </el-row>
      <div class="newbill-drawer__footer">
        <el-row style="text-align: center; margin-top: 40px;">
          <el-button icon="el-icon-edit"
            :disabled="newDisabled"
            type="primary" @click='handleNewBillSubmit'>
              创 建
          </el-button>
        </el-row>
      </div>
    </div>
  </el-drawer>

  <el-drawer
    title="修改工单"
    :visible.sync="editBillVisible"
    direction="rtl"
    custom-class="editbill-drawer"
    ref="drawer"
    style="width: 100%;"
    >
    <el-row>
      <div class='billtip'>工单名称：</div>
      <div class='billinput'>
        <el-input placeholder="请输入工单名称" v-model="editBill.name" clearable/>
      </div>
    </el-row>
    <el-row>
      <div class='billtip'>产出物料：</div>
      <div class='billinput'>
        <el-input placeholder="请输入产出物料编号" v-model="editBill.outputname" type="number" clearable/>
      </div>
    </el-row>
    <el-row>
      <div class='billtip'>产出数量：</div>
      <div class='billinput'>
        <el-input-number v-model="editBill.outputmount" :min="1" :max="99999"/>
      </div>
    </el-row>
    <el-row>
      <div class='billtip'>预计时间(时)：</div>
      <div class='billinput'>
        <el-input-number v-model="editBill.estimatetime" :min="1" :max="99999"/>
      </div>
    </el-row>
    <el-row>
      <div class='billtip'>使用生产树：</div>
      <div class='billinput'>
        <el-switch
          v-model="useTree"
          active-color="#13ce66"
          inactive-color="#ff4949"/>
        <span style="color: #909399; font-size: 80%;">   *系统推荐使用生产树</span>
      </div>
    </el-row>
    <span v-if="!useTree">
      <el-row>
        <div class='billtip'>所需物料：</div>
        <div class='billinputsp'>
          <el-tag
            :key="tag"
            v-for="tag in editBill.material"
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
        <div>
          <div class='billtip'>
            <span style="color: #909399; margin-left: 20px;">
              提示：
            </span>
          </div>
          <div class='billinput'>
            <span style="color: #909399; margin-left: 20px;">
              若需要多个物料则使用*隔开，如物料A*4
            </span>
          </div>
        </div>
      </el-row>
    </span>
    <span v-if="useTree">
        <el-row>
          <div class='billtip'>生产树编号：</div>
          <div class='billinput'>
            <el-input v-model="editBill.treeid" type="number" placeholder="请输入生产树ID"/>
          </div>
        </el-row>
    </span>
    <el-row>
      <div class='billtip'>描述：</div>
      <div class='billinput'>
        <el-input v-model="editBill.description" type="textarea" placeholder="请输入工单描述" clearable/>
      </div>
    </el-row>
    <div>
      <el-row style="text-align: center; margin-top: 40px;">
        <el-button icon="el-icon-edit"
          type="primary" @click='handleEditBillSubmit'>
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
// import testcreatedbill from '../../../config_new/testcreatedbill.js'

export default {
  name: 'Created',
  data () {
    return {
      billStatus: billstatus,
      materialClass: materialclass,
      testCreatedBill: [],
      newBillVisible: false,
      editBillVisible: false,
      distributeBillVisible: false,
      dataLoading: false,
      useTree: true,
      searchBill: {
        id: '',
        name: '',
        outputclass: '',
        outputname: '',
        materialname: ''
      },
      pagination: {
        pageSize: 15,
        total: 0,
        currentPage: 1
      },
      newBill: {
        name: '',
        outputid: '',
        outputmount: 1,
        estimatetime: 12,
        material: [],
        description: '',
        treeid: ''
      },
      newBillInput: {
        inputVisible: false,
        inputValue: ''
      },
      editBill: {
        id: '',
        name: '',
        outputname: '',
        outputmount: 1,
        estimatetime: 12,
        material: [],
        description: '',
        treeid: ''
      },
      editBillInput: {
        inputVisible: false,
        inputValue: ''
      },
      distributingBill: {
        id: '',
        name: '',
        stationId: ''
      }
    }
  },
  methods: {
    handleSearch () {
      console.log(this.searchBill)
      this.reloadData()
    },
    handleNewBill () {
      this.newBillVisible = true
      this.newBill = {
        name: '',
        outputid: '',
        outputmount: 1,
        estimatetime: 12,
        material: [],
        description: ''
      }
    },
    handleNewBillSubmit () {
      if (this.useTree) {
        this.$axios({
          method: 'post',
          url: this.GLOBAL.backEndIp + '/api/bill/createnewwithtree',
          data: {
            name: this.newBill.name,
            output: this.newBill.outputid,
            outputMount: this.newBill.outputmount,
            estimateTime: this.newBill.estimatetime,
            treeId: this.newBill.treeid,
            description: this.newBill.description
          }
        }).then(response => {
          if (response.data.code === 1) {
            this.$message({
              message: '增加成功。',
              type: 'success'
            })
            this.reloadData()
          } else {
            this.$message({
              message: '增加失败。' + '错误原因：' + response.data.code + '-' + response.data.message,
              type: 'error'
            })
          }
        }).catch(error => {
          this.$message({
            message: '增加错误。' + '错误原因：' + error.response.status,
            type: 'error'
          })
        })
      } else {
        this.$axios({
          method: 'post',
          url: this.GLOBAL.backEndIp + '/api/bill/createnew',
          data: {
            name: this.newBill.name,
            output: this.newBill.outputid,
            outputMount: this.newBill.outputmount,
            estimateTime: this.newBill.estimatetime,
            materials: this.newBill.material,
            description: this.newBill.description
          }
        }).then(response => {
          if (response.data.code === 1) {
            this.$message({
              message: '增加成功。',
              type: 'success'
            })
            this.reloadData()
          } else {
            this.$message({
              message: '增加失败。' + '错误原因：' + response.data.code + '-' + response.data.message,
              type: 'error'
            })
          }
        }).catch(error => {
          this.$message({
            message: '增加错误。' + '错误原因：' + error.response.status,
            type: 'error'
          })
        })
      }
    },
    handleDistributed (row) {
      console.log('Distributing...')
      this.distributeBillVisible = true
      this.distributingBill = {
        id: row.id,
        name: row.name,
        stationId: ''
      }
    },
    handleDistributionSubmit () {
      this.$axios({
        method: 'post',
        url: this.GLOBAL.backEndIp + '/api/bill/distribute',
        params: {
          stationId: this.distributingBill.stationId,
          billId: this.distributingBill.id
        }
      }).then(response => {
        if (response.data.code === 1) {
          this.$message({
            message: '分配成功。',
            type: 'success'
          })
          this.distributeBillVisible = false
          this.reloadData()
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
    },
    reloadData () {
      this.dataLoading = true
      var id = 0
      if (this.searchBill.id !== '') {
        id = this.searchBill.id
      }
      var kind = 0
      if (this.searchBill.outputclass !== '') {
        kind = this.searchBill.outputclass
      }
      var output = 0
      if (this.searchBill.outputname !== '') {
        output = this.searchBill.outputname
      }
      var material = 0
      if (this.searchBill.materialname !== '') {
        material = this.searchBill.materialname
      }
      this.$axios({
        method: 'get',
        url: this.GLOBAL.backEndIp + '/api/bill/findwithstatus',
        params: {
          id: id,
          name: this.searchBill.name,
          kind: kind,
          status: 1,
          output: output,
          material: material,
          stationId: 0,
          page: this.pagination.currentPage - 1
        }
      }).then(response => {
        if (response.data.code === 1) {
          this.testCreatedBill = response.data.data
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
    handleDelete (id) {
      this.$confirm('此操作将删除该工单，请谨慎操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios({
          method: 'post',
          url: this.GLOBAL.backEndIp + '/api/bill/delete',
          params: {
            billId: id
          }
        }).then(response => {
          if (response.data.code === 1) {
            this.$message({
              message: '删除成功。',
              type: 'success'
            })
            this.reloadData()
          } else {
            this.$message({
              message: '删除失败。' + '错误原因：' + response.data.code + '-' + response.data.message,
              type: 'error'
            })
          }
        }).catch(error => {
          this.$message({
            message: '删除错误。' + '错误原因：' + error.response.status,
            type: 'error'
          })
        })
      }).catch(() => {})
    },
    handleEdit (row) {
      this.editBill = {
        id: row.id,
        name: row.name,
        outputname: 0,
        outputmount: row.outputMount,
        estimatetime: row.estimateTime,
        material: [],
        description: row.description
      }
      /*
      var i = 0
      for (i = 0; i < row.materials.length; i++) {
        this.editBill.material.push(row.materials[i].name)
      }
      */
      this.editBillVisible = true
    },
    handleEditBillSubmit () {
      if (this.useTree) {
        this.$axios({
          method: 'post',
          url: this.GLOBAL.backEndIp + '/api/bill/editwithtree',
          data: {
            id: this.editBill.id,
            name: this.editBill.name,
            output: this.editBill.outputname,
            outputMount: this.editBill.outputmount,
            estimateTime: this.editBill.estimatetime,
            treeId: this.editBill.treeid,
            description: this.editBill.description
          }
        }).then(response => {
          if (response.data.code === 1) {
            this.$message({
              message: '修改成功。',
              type: 'success'
            })
            this.reloadData()
          } else {
            this.$message({
              message: '修改失败。' + '错误原因：' + response.data.code + '-' + response.data.message,
              type: 'error'
            })
          }
        }).catch(error => {
          this.$message({
            message: '修改错误。' + '错误原因：' + error.response.status,
            type: 'error'
          })
        })
      } else {
        this.$axios({
          method: 'post',
          url: this.GLOBAL.backEndIp + '/api/bill/edit',
          data: {
            id: this.editBill.id,
            name: this.editBill.name,
            output: this.editBill.outputname,
            outputMount: this.editBill.outputmount,
            estimateTime: this.editBill.estimatetime,
            materials: this.editBill.material,
            description: this.editBill.description
          }
        }).then(response => {
          if (response.data.code === 1) {
            this.$message({
              message: '修改成功。',
              type: 'success'
            })
            this.reloadData()
          } else {
            this.$message({
              message: '修改失败。' + '错误原因：' + response.data.code + '-' + response.data.message,
              type: 'error'
            })
          }
        }).catch(error => {
          this.$message({
            message: '修改错误。' + '错误原因：' + error.response.status,
            type: 'error'
          })
        })
      }
      this.editBillVisible = false
    },
    handlePagination () {
      this.reloadData()
    },
    handleNewBillClose (tag) {
      this.newBill.material.splice(this.newBill.material.indexOf(tag), 1)
    },
    showNewBillInput () {
      this.newBillInput.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleNewBillInputConfirm () {
      let inputValue = this.newBillInput.inputValue
      if (inputValue) {
        this.newBill.material.push(inputValue)
      }
      this.newBillInput.inputVisible = false
      this.newBillInput.inputValue = ''
    },
    handleEditBillClose (tag) {
      this.editBill.material.splice(this.editBill.material.indexOf(tag), 1)
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
        this.editBill.material.push(inputValue)
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
      return this.searchBill.id === '' &&
        this.searchBill.name === '' &&
        this.searchBill.outputclass === '' &&
        this.searchBill.outputname === '' &&
        this.searchBill.materialname === ''
    },
    newDisabled () {
      return this.newBill.name === '' ||
        this.newBill.outputid === '' ||
        (this.newBill.material.length === 0 &&
          this.newBill.treeid === '')
    },
    distributeDisabled () {
      return this.distributingBill.stationId === ''
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
.new_bill_class {
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.pagination_class {
  margin: 40px;
  text-align: center;
}
.billtip {
  display: inline-block;
  width: 25%;
  text-align: right;
  vertical-align: center;
  margin-top: 10px;
  white-space:nowrap;
}
.billinput {
  display: inline-block;
  width: 70%;
  margin-top: 10px;
  white-space:nowrap;
}
.billinputsp {
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
