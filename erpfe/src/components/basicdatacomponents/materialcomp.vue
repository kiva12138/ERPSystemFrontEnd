<template>
<div>
  <div class="search_material_part">
    <el-row>
      <span class="searchmaterialtip">物料编号：</span>
      <el-input placeholder="请输入物料编号"
        class='searchmaterialinput'
        v-model="searchId"
        clearable/>
      <span class="searchmaterialtip">物料名称：</span>
      <el-input placeholder="请输入物料名称"
        class='searchmaterialinput'
        v-model="searchName"
        clearable/>
      <el-button icon="el-icon-search"
        :disabled='searchDisabled'
        style="margin-left: 40px;"
        type="primary" @click='handleSearch'>搜 索</el-button>
    </el-row>
  </div>
  <div class="new_material_class">
    <el-button icon="el-icon-edit"
      type="primary" @click='handleNewMaterial'>
        创建物料
    </el-button>
  </div>
  <el-table
    class="material_table_class"
    :data="materialesData"
    :default-sort = "{prop: 'id', order: 'descending'}"
    stripe
    style="width: 100%">
    <el-table-column
      fixed="left"
      prop="id"
      sortable
      label="物料编号"
      width="150">
    </el-table-column>
    <el-table-column
      prop="name"
      sortable
      label="物料名称"
      width="150">
    </el-table-column>
    <el-table-column
      prop="mount"
      sortable
      label="剩余数量"
      width="150">
    </el-table-column>
    <el-table-column
      prop="description"
      label="描述">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="250">
      <template slot-scope="scope">
        <el-button type="text" size="small"
          @click='handleEdit(scope.row)'>编辑</el-button>
        <el-button type="text" size="small"
          @click='handleDelete(scope.row.id)'>删除</el-button>
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
    :total="materialesNumber">
  </el-pagination>
  <el-dialog
    class="new_material_dialog_class"
    :modal="false"
    title="新建物料"
    :visible.sync="newMaterialDialogVisible"
    width="30%">
      <el-row>
        <div class='materialtip'>物料名称：</div>
        <div class='materialinput'>
          <el-input placeholder="请输入物料名称"
                  v-model="newMaterial.name"
                  clearable/>
        </div>
      </el-row>
      <el-row>
        <div class='materialtip'>剩余数量：</div>
        <div class='materialinput'>
          <el-input
            placeholder="0"
            v-model="newMaterial.mount"
            clearable/>
        </div>
      </el-row>
      <el-row>
        <div class='materialtip'>物料描述：</div>
        <div class='materialinput'>
          <el-input placeholder="请输入物料描述"
                  v-model="newMaterial.description"
                  type="textarea"
                  clearable/>
        </div>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newMaterialDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleNewMaterialSubmit">新 建</el-button>
      </span>
  </el-dialog>
  <el-dialog
    class="modify_material_dialog_class"
    :modal="false"
    title="编辑物料"
    :visible.sync="modifyMaterialDialogVisible"
    width="30%">
     <el-row>
        <div class='materialtip'>物料编号：</div>
        <div class='materialinput'>
          {{currentMaterial.id}}
        </div>
      </el-row>
      <el-row>
        <div class='materialtip'>物料名称：</div>
        <div class='materialinput'>
          <el-input placeholder="请输入物料名称"
                  v-model="currentMaterial.name"
                  clearable/>
        </div>
      </el-row>
      <el-row>
        <div class='materialtip'>剩余数量：</div>
        <div class='materialinput'>
          <el-input placeholder="请输入剩余数量"
                  v-model="currentMaterial.mount"
                  clearable/>
        </div>
      </el-row>
      <el-row>
        <div class='materialtip'>物料描述：</div>
        <div class='materialinput'>
          <el-input placeholder="请输入物料描述"
                  v-model="currentMaterial.description"
                  clearable/>
        </div>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyMaterialDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleModifySubmit">修 改</el-button>
      </span>
  </el-dialog>
</div>
</template>

<script>
import testmaterial from '../../config/testmaterial.js'

export default {
  name: 'MaterialComp',
  data () {
    return {
      searchId: '',
      searchName: '',
      currentPage: 1,
      materialesData: testmaterial,
      materialesNumber: 20,
      newMaterialDialogVisible: false,
      modifyMaterialDialogVisible: false,
      newMaterial: {
        name: '',
        mount: 0,
        description: ''
      },
      currentMaterial: {
        id: '',
        name: '',
        mount: 0,
        description: ''
      }
    }
  },
  methods: {
    handleSearch () {
      console.log('Searching...' + this.searchId + this.searchName)
      // reload material data
    },
    handleNewMaterial () {
      this.newMaterialDialogVisible = true
      this.newMaterial = {
        name: '',
        status: '',
        mount: 0,
        description: ''
      }
    },
    handleNewMaterialSubmit () {
      console.log('New material ' + this.newMaterial.name + this.newMaterial.description)
      this.newMaterialDialogVisible = false
      // reload material data
    },
    handleEdit (row) {
      this.modifyMaterialDialogVisible = true
      this.currentMaterial.id = row.id
      this.currentMaterial.name = row.name
      this.currentMaterial.mount = row.mount
      this.currentMaterial.description = row.description
      // reload material data
    },
    handleModifySubmit () {
      console.log('Modify material ' + this.currentMaterial.id + this.currentMaterial.name + this.currentMaterial.description)
      this.modifyMaterialDialogVisible = false
    },
    handleDelete (id) {
      console.log('Delete' + id)
      // reload material data
    },
    handlePagination () {
      console.log('Page to ' + this.currentPage)
      // reload material data
    }
  },
  computed: {
    searchDisabled () {
      return this.searchId === '' &&
        this.searchName === ''
    }
  }
}
</script>

<style>
.search_material_part {
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.searchmaterialtip {
  width: 12%;
  margin-left: 10px;
  margin-top: 10px;
  margin-bottom: 20px;
  color: #606266;
  text-align: right;
  display: inline-block;
}
.searchmaterialinput {
  width: 15%;
  margin-right: 20px;
  display: inline-block;
}
.new_material_class {
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.material_table_class {
  padding-left: 20px;
  padding-right: 20px;
}
.pagination_class {
  margin: 40px;
  text-align: center;
}
.materialtip {
  display: inline-block;
  width: 25%;
  text-align: right;
  vertical-align: center;
  margin-top: 10px;
}
.materialinput {
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
