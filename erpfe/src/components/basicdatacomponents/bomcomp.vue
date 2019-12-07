<template>
<div>
  <div class="search_bom_part">
    <el-row>
      <span class="searchbomtip">成品物料编号：</span>
      <el-input placeholder="请输入成品物料编号"
        class='searchbominput'
        v-model="searchId"
        clearable/>
      <span class="searchbomtip">成品物料名称：</span>
      <el-input placeholder="请输入成品物料名称"
        class='searchbominput'
        v-model="searchName"
        clearable/>
      <span class="searchtbomip">状态：</span>
      <el-select v-model="searchStatus" placeholder="请选择状态">
        <el-option :label="bomStatus[0].name" :value="bomStatus[0].id"></el-option>
        <el-option :label="bomStatus[1].name" :value="bomStatus[1].id"></el-option>
      </el-select>
    </el-row>
    <el-row>
      <span class="searchbomtip">工艺路线编号：</span>
      <el-input placeholder="请输入工艺编号"
        class='searchbominput'
        v-model="searchCraftId"
        clearable/>
      <span class="searchbomtip">工艺名称：</span>
      <el-input placeholder="请输入工艺名称"
        class='searchbominput'
        v-model="searchCraftName"
        clearable/>
    </el-row>
    <el-row>
      <span class="searchbomtip">所需物料编号：</span>
      <el-input placeholder="请输入物料编号"
        class='searchbominput'
        v-model="searchMaterialId"
        clearable/>
      <span class="searchbomtip">所需物料名称：</span>
      <el-input placeholder="请输入物料名称"
        class='searchbominput'
        v-model="searchMaterialName"
        clearable/>
      <el-button icon="el-icon-search"
        :disabled='searchDisabled'
        style="margin-left: 40px;"
        type="primary" @click='handleSearch'>搜 索</el-button>
    </el-row>
  </div>
  <div class="new_bom_class">
    <el-button icon="el-icon-edit"
      type="primary" @click='handleNewBom'>
        创建BOM
    </el-button>
  </div>
  <el-table
    class="bom_table_class"
    :data="bomesData"
    :default-sort = "{prop: 'id', order: 'descending'}"
    stripe
    style="width: 100%">
    <el-table-column
      fixed="left"
      prop="id"
      sortable
      label="成品物料编号"
      width="150">
    </el-table-column>
    <el-table-column
      prop="name"
      sortable
      label="成品物料名称"
      width="150">
    </el-table-column>
    <el-table-column
      prop="outputmount"
      sortable
      label="产出数量"
      width="100">
    </el-table-column>
    <el-table-column
      width="120"
      sortable
      label="状态">
      <template slot-scope="scope">
        <span>{{bomStatus[scope.row.status-1].name}}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="工艺路线">
      <template slot-scope="scope">
        <span v-for="(craft, index) in scope.row.crafts"
          style="color: #909399;"
          :key=index>
          {{craft.id + '/' + craft.name + ' '}}
        </span>
      </template>
    </el-table-column>
    <el-table-column
      label="所需物料">
      <template slot-scope="scope">
        <span v-for="(material, index) in scope.row.material"
          style="color: #909399;"
          :key=index>
          {{material.id + '/' + material.name + '*' +material.mount + ' '}}
        </span>
      </template>
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="200">
      <template slot-scope="scope">
        <el-button type="text" size="small"
          @click='handleEdit(scope.row)'>编辑</el-button>
        <el-button type="text" size="small"
          v-if="scope.row.status !== '2'"
          @click='handleProduce(scope.row.id)'>作为工单发布</el-button>
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
    :total="bomesNumber">
  </el-pagination>
  <el-dialog
    class="new_bom_dialog_class"
    :modal="false"
    title="新建BOM"
    :visible.sync="newBomDialogVisible"
    width="40%">
      <el-row>
        <div class='bomtip'>产出物料名称：</div>
        <div class='bominput'>
          <el-input placeholder="请输入物料名称"
                  v-model="newBom.name"
                  clearable/>
        </div>
      </el-row>
      <el-row>
        <div class='bomtip'>产出数量：</div>
        <div class='bominput'>
          <el-input placeholder="请输入产出数量"
                  v-model="newBom.outputmount"
                  clearable/>
        </div>
      </el-row>
      <el-row>
        <div class='bomtip'>状态：</div>
        <div class='bominput'>
          <el-select v-model="newBom.status" placeholder="请选择状态">
            <el-option :label="bomStatus[0].name" :value="bomStatus[0].id"></el-option>
            <el-option :label="bomStatus[1].name" :value="bomStatus[1].id"></el-option>
          </el-select>
        </div>
      </el-row>
      <el-row>
        <div class='bomtip'>工艺路线：</div>
        <div class='bominput'>
          <el-tag
            :key="tag"
            v-for="tag in newBom.crafts"
            closable
            :disable-transitions="false"
            @close="handleCloseNewCraft(tag)">
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
            @click="showInput">+ 工艺编号</el-button>
        </div>
      </el-row>
      <el-row>
        <div class='bomtip'>所需物料：</div>
        <div class='bominput'>
          <el-tag
            :key="tag"
            type="success"
            v-for="tag in newBom.material"
            closable
            :disable-transitions="false"
            @close="handleCloseNewMaterial(tag)">
            {{tag}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisibleMaterial"
            v-model="inputValueMaterial"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirmMaterial"
            @blur="handleInputConfirmMaterial"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small"
            @click="showInputMaterial">+ 物料编号</el-button>
        </div>
      </el-row>
      <el-row>
        <div class='bomtip' style="color: #909399; vertical-align: top;">提示：</div>
        <div class='bominput' style="color: #909399; vertical-align: top;">
          如需要多个物料，则需使用*号来表示，如物料A*4
        </div>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newBomDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleNewBomSubmit">创 建</el-button>
      </span>
  </el-dialog>
  <el-dialog
    class="modify_bom_dialog_class"
    :modal="false"
    title="编辑BOM"
    :visible.sync="modifyBomDialogVisible"
    width="40%">
     <el-row>
        <div class='bomtip'>编号：</div>
        <div class='bominput'>
          {{currentBom.id}}
        </div>
      </el-row>
      <el-row>
        <div class='bomtip'>产出物料名称：</div>
        <div class='bominput'>
          <el-input placeholder="请输入物料名称"
                  v-model="currentBom.name"
                  clearable/>
        </div>
      </el-row>
      <el-row>
        <div class='bomtip'>产出数量：</div>
        <div class='bominput'>
          <el-input placeholder="请输入产出数量"
                  v-model="currentBom.outputmount"
                  clearable/>
        </div>
      </el-row>
      <el-row>
        <div class='bomtip'>状态：</div>
        <div class='bominput'>
          <el-select v-model="currentBom.status" placeholder="请选择状态">
            <el-option :label="bomStatus[0].name" :value="bomStatus[0].id"></el-option>
            <el-option :label="bomStatus[1].name" :value="bomStatus[1].id"></el-option>
          </el-select>
        </div>
      </el-row>
      <el-row>
        <div class='bomtip'>工艺路线：</div>
        <div class='bominput'>
          <el-tag
            :key="tag.id"
            v-for="tag in currentBom.crafts"
            closable
            :disable-transitions="false"
            @close="handleCloseCurrentCraft(tag)">
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
            @click="showInput">+ 新工艺编号</el-button>
        </div>
      </el-row>
      <el-row>
        <div class='bomtip'>所需材料：</div>
        <div class='bominput'>
          <el-tag
            type="success"
            :key="tag.id"
            v-for="tag in currentBom.material"
            closable
            :disable-transitions="false"
            @close="handleCloseCurrentMaterial(tag)">
            {{tag.id}}*{{tag.mount}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisibleMaterial"
            v-model="inputValueMaterial"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirmCurrentMaterial"
            @blur="handleInputConfirmCurrentMaterial"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small"
            @click="showInputCurrentMaterial">+ 新所需物料</el-button>
        </div>
      </el-row>
      <el-row>
        <div class='bomtip' style="color: #909399; vertical-align: top;">提示：</div>
        <div class='bominput' style="color: #909399; vertical-align: top;">
          如需要多个物料，则需使用*号来表示，如物料A*4
        </div>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyBomDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleModifySubmit">修 改</el-button>
      </span>
  </el-dialog>
</div>
</template>

<script>
import testbom from '../../config/testbom.js'
import bomstatus from '../../config/bomstatus.js'

export default {
  name: 'BomComp',
  data () {
    return {
      searchId: '',
      searchName: '',
      searchStatus: '',
      searchCraftId: '',
      searchCraftName: '',
      searchMaterialId: '',
      searchMaterialName: '',
      currentPage: 1,
      bomStatus: bomstatus,
      bomesData: testbom,
      bomesNumber: 20,
      newBomDialogVisible: false,
      modifyBomDialogVisible: false,
      newBom: {
        name: '',
        status: '',
        outputmount: 1,
        crafts: [],
        material: []
      },
      currentBom: {
        id: '',
        name: '',
        status: 1,
        outputmount: 1,
        crafts: [],
        material: []
      },
      inputVisible: false,
      inputValue: '',
      inputVisibleMaterial: false,
      inputValueMaterial: ''
    }
  },
  methods: {
    showInputCurrentMaterial () {
      this.inputVisibleMaterial = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirmCurrentMaterial () {
      let inputValueMaterial = this.inputValueMaterial
      let materialName = inputValueMaterial.split('*')[0]
      let materialMount = 1
      if (inputValueMaterial.split('*').length === 2) {
        materialMount = inputValueMaterial.split('*')[1]
      }
      if (inputValueMaterial) {
        this.currentBom.material.push({'id': materialName, 'name': 'tmp', 'mount': materialMount})
      }
      this.inputVisibleMaterial = false
      this.inputValueMaterial = ''
    },
    handleCloseCurrentMaterial (tag) {
      this.currentBom.material.splice(this.currentBom.material.indexOf(tag), 1)
    },
    showInputMaterial () {
      this.inputVisibleMaterial = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirmMaterial () {
      let inputValueMaterial = this.inputValueMaterial
      if (inputValueMaterial) {
        this.newBom.material.push(inputValueMaterial)
      }
      this.inputVisibleMaterial = false
      this.inputValueMaterial = ''
    },
    handleCloseNewMaterial (tag) {
      this.newBom.material.splice(this.newBom.material.indexOf(tag), 1)
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
        this.newBom.crafts.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    handleCloseNewCraft (tag) {
      this.newBom.crafts.splice(this.newBom.crafts.indexOf(tag), 1)
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
        this.currentBom.crafts.push({'id': inputValue, 'name': 'tmp'})
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    handleCloseCurrentCraft (tag) {
      this.currentBom.crafts.splice(this.currentBom.crafts.indexOf(tag), 1)
    },
    handleSearch () {
      console.log('Searching...' + this.searchId + this.searchName + this.searchStatus)
      // reload bom data
    },
    handleNewBom () {
      this.newBomDialogVisible = true
      this.newBom = {
        name: '',
        status: '',
        outputmount: 1,
        crafts: [],
        material: []
      }
    },
    handleEdit (row) {
      this.modifyBomDialogVisible = true
      this.currentBom.id = row.id
      this.currentBom.name = row.name
      this.currentBom.status = row.status
      this.currentBom.crafts = row.crafts
      this.currentBom.material = row.material
      this.currentBom.outputmount = row.outputmount
      // reload bom data
    },
    handleModifySubmit () {
      console.log('Modify bom ' + this.currentBom)
      this.modifyBomDialogVisible = false
    },
    handleStart (id) {
      console.log('Start' + id)
      // reload bom data
    },
    handleProduce (id) {
      console.log('Produce' + id)
      // reload bom data
    },
    handleStop (id) {
      console.log('Stop' + id)
      // reload bom data
    },
    handlePagination () {
      console.log('Page to ' + this.currentPage)
      // reload bom data
    },
    handleNewBomSubmit () {
      console.log('New bom ')
      console.log(this.newBom)
      this.newBomDialogVisible = false
      // reload bom data
    }
  },
  computed: {
    searchDisabled () {
      return this.searchId === '' &&
        this.searchName === '' &&
        this.searchStatus === '' &&
        this.searchCraftName === '' &&
        this.searchCraftId === '' &&
        this.searchMaterialName === '' &&
        this.searchMaterialId === ''
    }
  }
}
</script>

<style>
.search_bom_part {
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.searchbomtip {
  width: 12%;
  margin-left: 10px;
  margin-top: 10px;
  margin-bottom: 20px;
  color: #606266;
  text-align: right;
  display: inline-block;
}
.searchbominput {
  width: 15%;
  margin-right: 20px;
  display: inline-block;
}
.new_bom_class {
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.bom_table_class {
  padding-left: 20px;
  padding-right: 20px;
}
.pagination_class {
  margin: 40px;
  text-align: center;
}
.bomtip {
  display: inline-block;
  width: 25%;
  text-align: right;
  vertical-align: center;
  margin-top: 10px;
}
.bominput {
  display: inline-block;
  width: 74%;
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
