<template>
<div>

  <div class="search_material_part">
    <el-row>

      <span class="searchtreetip">生产树名称：</span>
      <el-input placeholder="请输入生产树名称"
        class='searchtreeinput'
        v-model="searchMaterial.name"
        clearable/>

      <span class="searchtreetip">目标物料名称：</span>
      <el-input placeholder="请输入产出物料名称"
        class='searchtreeinput'
        v-model="searchMaterial.opname"
        clearable/>

      <span class="searchtreetip">所需物料名称：</span>
      <el-input placeholder="请输入所需物料名称"
        class='searchtreeinput'
        v-model="searchMaterial.needname"
        clearable/>

      <el-button icon="el-icon-search"
        :disabled='searchDisabled'
        style="margin-left: 40px;"
        type="primary" @click='handleSearch'>搜索生产树</el-button>

    </el-row>
  </div>

  <div class="new_material_class">
    <el-button icon="el-icon-edit"
      size="small"
      type="primary" @click='handleNewTree'>
        增加新的生产树
    </el-button>
  </div>

  <div class="tree_table_class" v-loading="dataLoading">
    <el-row :gutter="tableGutter"
      v-loading="dataLoading"
      class="tree_current_row">
      <el-col v-for="(item, index) in treeData"
        :key = "index"
        :span="getSpan(item.need.length)"
        class="tree_current_col"
        style="position: relative; background-color: #d3dce6;">
        <el-popover
          @show="handleSingleTreeShow(item)"
          placement="top"
          width="350"
          trigger="click">
          <div>
            <div>
              <span class="treeedittip">生产树编号：</span>
              <span class="treeeditinput">{{currentTree.id}}</span>
            </div>
            <div>
              <span class="treeedittip">生产树名称：</span>
              <el-input class="treeeditinput" v-model="currentTree.name"></el-input>
            </div>
            <div>
              <span class="treeedittip">产出物料：</span>
              <span class="treeeditinput">{{item.opname}}(编号{{item.opmid}})</span>
            </div>
            <div>
              <span class="treeedittip">修改产出：</span>
              <el-input class="treeeditinput" v-model="currentTree.opmid"
                placeholder="按照编号形式" type="number"></el-input>
            </div>
            <div>
              <span class="treeedittip">当前状态：</span>
              <span class="treeeditinput" :style="{'color': getColor(index)}">{{treeStatus[item.status - 1].name}}</span>
            </div>
            <div>
              <span class="treeedittip">修改状态：</span>
              <el-select v-model="currentTree.status"
                class='treeeditinput'>
                <el-option
                  v-for="i in treeStatus"
                  :key="i.id"
                  :label="i.name"
                  :value="i.id" />
              </el-select>
            </div>
            <div>
              <span class="treeedittip">描述：</span>
              <el-input class="treeeditinput" v-model="currentTree.description"></el-input>
            </div>
            <div v-for="(use, index2) in item.need" :key="index2">
              <span class="treeedittip">所需物料{{index2 + 1}}：</span>
              <span  class="treeeditinput">
                <span>{{use.mount}} * {{use.name}}(编号{{use.id}})</span>
                <br>
              </span>
            </div>
            <div>
              <span class="treeedittip">修改所需物料：</span>
              <span class="treeeditinput">
                <el-tag :key="tag"
                  v-for="tag in currentTree.needs"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag)">
                  {{tag}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">
                  + 新物料
                </el-button>
              </span>
            </div>
            <el-divider/>
            <div style="text-align: center;">
              <el-button type="primary" icon="el-icon-check" circle
              :disabled="modifyDisable"
              @click="handleModifySubmit()"></el-button>

              <el-button type="danger" icon="el-icon-delete" circle
              @click="handleDelete(item.id)"></el-button>
            </div>
          </div>
          <div class="grid-content" slot="reference">
            <hr style="width: 0px; height: 70px; border: 1px solid #606266; position: absolute; top: 20px; left: 0; right: 0;"/>
            <hr style="width: 75%; border: 1px solid #606266;
            position: absolute; top: 90px; left: 0; right: 0;"/>
            <div style="position: relative; top: 0px;">
              <el-row>
                <el-button plain :style="{'background-color': getColor(index), 'color': 'white'}">{{item.opname}}</el-button>
              </el-row>
              <el-row style="overflow:auto; width: 100%; margin-top: 30px;">
                <span v-for="(needitem, index1) in item.need"
                  :key = "index1" :style="'display: inline-block; width: ' + 100 / item.need.length + '%;'">
                  <el-button plain :style="{'background-color': getColor(index), 'color': 'white'}">{{needitem.name}}*{{needitem.mount}}</el-button>
                </span>
              </el-row>
            </div>
          </div>
        </el-popover>
      </el-col>
    </el-row>
  </div>

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
    class="new_material_dialog_class"
    :modal="false"
    title="新建生产树"
    :visible.sync="newMaterialDialogVisible"
    width="30%">
      <el-row>
        <div class='treeedittip'>生产树名称：</div>
        <div class='treeeditinput'>
          <el-input placeholder="请输入生产树名称"
                  v-model="newMaterial.name"
                  clearable/>
        </div>
      </el-row>
      <el-row>
        <div class='treeedittip'>目标物料ID：</div>
        <div class='treeeditinput'>
          <el-input placeholder="请输入输出物料ID"
                  v-model="newMaterial.targetmid"
                  type="number"
                  clearable/>
        </div>
      </el-row>
      <el-row>
        <div class='treeedittip'>生产树描述：</div>
        <div class='treeeditinput'>
          <el-input placeholder="请输入描述（可选）"
                  v-model="newMaterial.description"
                  type="textarea"
                  clearable/>
        </div>
      </el-row>
      <el-row>
        <div class='treeedittip'>所需物料：</div>
        <div class='treeeditinput'>
          <el-tag :key="tag"
            v-for="tag in newMaterial.needs"
            closable
            :disable-transitions="false"
            @close="handleCloseNew(tag)">
            {{tag}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisibleNew"
            v-model="inputValueNew"
            ref="saveTagInputNew"
            size="small"
            @keyup.enter.native="handleInputConfirmNew"
            @blur="handleInputConfirmNew">
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInputNew">
            + 新物料
          </el-button>
        </div>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newMaterialDialogVisible = false">取 消</el-button>
        <el-button type="primary"
          @click="handleNewMaterialSubmit"
          :disabled="newMaterialSubmitDisabled">新 建</el-button>
      </span>
  </el-dialog>

</div>
</template>

<script>
// import testtree from '@/config_new/testtree.js'
import treetatus from '@/config_new/treestatus.js'

export default {
  name: 'Tree',
  data () {
    return {
      tableGutter: 0,
      tableStationSpan: [2, 4, 6, 8],
      searchMaterial: {
        name: '',
        opname: '',
        needname: ''
      },
      pagination: {
        pageSize: 15,
        currentPage: 1,
        total: 0
      },
      currentTree: {
        id: '',
        opmid: '',
        name: '',
        status: '',
        description: '',
        needs: []
      },
      inputVisible: false,
      inputValue: '',
      treeData: [],
      treeStatus: treetatus,
      newMaterialDialogVisible: false,
      dataLoading: false,
      newMaterial: {
        name: '',
        targetmid: '',
        description: '',
        needs: []
      },
      inputVisibleNew: false,
      inputValueNew: ''
    }
  },
  methods: {
    handleClose (tag) {
      this.currentTree.needs.splice(this.currentTree.needs.indexOf(tag), 1)
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm () {
      let inputValue = this.inputValue
      if (inputValue) {
        this.currentTree.needs.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    handleCloseNew (tag) {
      this.newMaterial.needs.splice(this.newMaterial.needs.indexOf(tag), 1)
    },
    showInputNew () {
      this.inputVisibleNew = true
      this.$nextTick(_ => {
        this.$refs.saveTagInputNew.$refs.input.focus()
      })
    },
    handleInputConfirmNew () {
      let inputValueNew = this.inputValueNew
      if (inputValueNew) {
        console.log(this.newMaterial)
        this.newMaterial.needs.push(inputValueNew)
      }
      this.inputVisibleNew = false
      this.inputValueNew = ''
    },
    handleSingleTreeShow (item) {
      this.currentTree = {
        id: item.id,
        opmid: '',
        name: item.name,
        status: item.status,
        description: item.description,
        needs: []
      }
      // var i = 0
      // for (i = 0; i < item.need.length; i++) {
      //   this.currentTree.needs.push(item.need[i].id + '*' + item.need[i].mount)
      // }
    },
    getSpan (len) {
      var j = len * 3
      return parseInt(j)
    },
    getColor (i) {
      var color = ''
      if (this.treeData[i].status === 1) {
        color = '#67C23A'
      }
      if (this.treeData[i].status === 2) {
        color = '#E6A23C'
      }
      if (this.treeData[i].status === 3) {
        color = '#F56C6C'
      }
      return color
    },
    handleSearch () {
      console.log(this.searchMaterial)
      this.dataLoading = true
      this.searchData()
      this.dataLoading = false
    },
    handleNewTree () {
      this.newMaterialDialogVisible = true
      this.newMaterial = {
        name: '',
        targetmid: '',
        description: '',
        needs: []
      }
    },
    handleNewMaterialSubmit () {
      console.log(this.newMaterial)
      this.$axios({
        method: 'post',
        url: this.GLOBAL.backEndIp + '/api/tree/createnew',
        data: {
          name: this.newMaterial.name,
          targetmid: this.newMaterial.targetmid,
          description: this.newMaterial.description,
          needs: this.newMaterial.needs
        }
      }).then(response => {
        if (response.data.code === 1) {
          this.$message({
            message: '新增成功。',
            type: 'success'
          })
        } else {
          this.$message({
            message: '新增失败。' + '错误原因：' + response.data.code + '-' + response.data.message,
            type: 'error'
          })
        }
      }).catch(error => {
        this.$message({
          message: '新增错误。' + '错误原因：' + error.response.status,
          type: 'error'
        })
      })
      this.newMaterialDialogVisible = false
      this.dataLoading = true
      this.searchData()
      this.dataLoading = false
    },
    handleModifySubmit () {
      console.log(this.currentTree)
      this.$axios({
        method: 'post',
        url: this.GLOBAL.backEndIp + '/api/tree/edit',
        data: {
          id: this.currentTree.id,
          name: this.currentTree.name,
          targetmid: this.currentTree.opmid,
          description: this.currentTree.description,
          status: this.currentTree.status,
          needs: this.currentTree.needs
        }
      }).then(response => {
        if (response.data.code === 1) {
          this.$message({
            message: '修改成功。',
            type: 'success'
          })
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
      this.dataLoading = true
      this.searchData()
      this.dataLoading = false
    },
    handleDelete (id) {
      this.$confirm('此操作将永久删除该物料生成树, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios({
          method: 'post',
          url: this.GLOBAL.backEndIp + '/api/tree/delete',
          params: {
            id: id
          }
        }).then(response => {
          if (response.data.code === 1) {
            this.$message({
              message: '删除成功。',
              type: 'success'
            })
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
      this.dataLoading = true
      this.searchData()
      this.dataLoading = false
    },
    handlePagination () {
      this.dataLoading = true
      this.searchData()
      this.dataLoading = false
    },
    searchData () {
      var name = ''
      var needname = ''
      var opname = ''
      if (this.searchMaterial.name !== '') {
        name = this.searchMaterial.name
      }
      if (this.searchMaterial.opname !== '') {
        opname = this.searchMaterial.opname
      }
      if (this.searchMaterial.needname !== '') {
        needname = this.searchMaterial.needname
      }
      this.$axios({
        method: 'get',
        url: this.GLOBAL.backEndIp + '/api/tree/get',
        params: {
          name: name,
          opname: opname,
          needname: needname,
          page: this.pagination.currentPage - 1
        }
      }).then(response => {
        if (response.data.code === 1) {
          this.treeData = response.data.data
          this.pagination.total = response.data.allLength
        } else {
          this.$message({
            message: '查找错误。' + '错误原因：' + response.data.code + '-' + response.data.message,
            type: 'error'
          })
        }
      }).catch(error => {
        this.$message({
          message: '查找错误。' + '错误原因：' + error.response.status,
          type: 'error'
        })
      })
    }
  },
  computed: {
    searchDisabled () {
      return this.searchMaterial.opname === '' &&
        this.searchMaterial.name === '' &&
        this.searchMaterial.needname === ''
    },
    newMaterialSubmitDisabled () {
      return this.newMaterial.name === '' ||
        this.newMaterial.targetmid === ''
    },
    modifyDisable () {
      return this.currentTree.name === '' ||
        this.currentTree.opmid === ''
    }
  },
  mounted () {
    this.dataLoading = true
    this.searchData()
    this.dataLoading = false
  }
}
</script>

<style>
.search_material_part {
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.tree_table_class {
  margin: 10px;
}
.searchtreetip {
  width: 9%;
  margin-left: 5px;
  margin-top: 10px;
  margin-bottom: 20px;
  color: #606266;
  text-align: right;
  display: inline-block;
  white-space:nowrap;
}
.searchtreeinput {
  width: 15%;
  display: inline-block;
  white-space:nowrap;
}
.new_material_class {
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.pagination_class {
  margin: 40px;
  text-align: center;
}
.treeedittip {
  display: inline-block;
  width: 25%;
  text-align: right;
  margin-top: 10px;
  white-space:nowrap;
  vertical-align: top;
}
.treeeditinput {
  display: inline-block;
  width: 70%;
  text-align: left;
  margin-top: 10px;
  vertical-align: top;
}
.tree_current_row {
  height: 100%;
}
.tree_current_col {
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  padding: 5px;
  margin: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  font-size: 80%;
  height: 100%;
}
.el-tag + .el-tag {
  margin-left: 10px;
  margin-top: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  margin-top: 10px;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
  margin-top: 10px;
}
</style>
