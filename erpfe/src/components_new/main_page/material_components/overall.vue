<template>
<div>

  <div class="search_material_part">
    <el-row>

      <span class="searchmaterialtip">物料编号：</span>
      <el-input placeholder="请输入物料编号"
        class='searchmaterialinput'
        v-model="searchMaterial.id"
        clearable/>

      <span class="searchmaterialtip">物料名称：</span>
      <el-input placeholder="请输入物料名称"
        class='searchmaterialinput'
        v-model="searchMaterial.name"
        clearable/>

      <span class="searchmaterialtip">物料状态：</span>
      <el-select v-model="searchMaterial.status" placeholder="请选择状态"
        class='searchmaterialinput'>
        <el-option
          v-for="item in materialStatus"
          :key="item.id"
          :label="item.name"
          :value="item.id" />
      </el-select>

      <span class="searchmaterialtip">物料种类：</span>
      <el-select v-model="searchMaterial.class" placeholder="请选择种类"
        class='searchmaterialinput'>
        <el-option
          v-for="item in materialClass"
          :key="item.id"
          :label="item.name"
          :value="item.id" />
      </el-select>

      <el-button icon="el-icon-search"
        :disabled='searchDisabled'
        style="margin-left: 40px;"
        type="primary" @click='handleSearch'>筛选物料</el-button>

    </el-row>
  </div>

  <div class="new_material_class">
    <el-button icon="el-icon-edit"
      type="primary" @click='handleNewMaterial'>
        增加新的物料种类
    </el-button>
  </div>

  <el-table
    class="material_table_class"
    :data="materialData"
    :default-sort = "{prop: 'id', order: 'descending'}"
    stripe
    v-loading="dataLoading"
    style="width: 100%;">
    <el-table-column
      fixed="left"
      prop="id"
      sortable
      label="物料编号"
      align="center"
      width="150">
    </el-table-column>
    <el-table-column
      prop="name"
      sortable
      label="物料名称"
      align="center"
      width="150">
    </el-table-column>
    <el-table-column
      prop="mount"
      sortable
      label="总数量"
      align="center"
      width="100">
    </el-table-column>
    <el-table-column
      prop="remain"
      sortable
      label="剩余数量"
      align="center"
      width="100">
    </el-table-column>
    <el-table-column
      prop="distributed"
      sortable
      label="已分配数量"
      align="center"
      width="120">
    </el-table-column>
    <el-table-column
      sortable
      label="物料类别"
      align="center"
      width="100">
      <template slot-scope="scope">
        <span>{{materialClass[scope.row.class-1].name}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="status"
      sortable
      label="物料状态"
      align="center"
      width="100">
      <template slot-scope="scope">
        <i class="el-icon-warning"
          style="color: #E6A23C;"
          v-if="materialStatus[scope.row.status-1].id==='3'">
          <span>
            {{materialStatus[scope.row.status-1].name}}
          </span>
        </i>
        <i class="el-icon-success"
          style="color: #67C23A;"
          v-if="materialStatus[scope.row.status-1].id==='1'">
          <span>
            {{materialStatus[scope.row.status-1].name}}
          </span>
        </i>
        <i class="el-icon-error"
          style="color: #F56C6C;"
          v-if="materialStatus[scope.row.status-1].id==='2'">
          <span>
            {{materialStatus[scope.row.status-1].name}}
          </span>
        </i>
      </template>
    </el-table-column>
    <el-table-column
      prop="description"
      align="center"
      label="描述">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="150">
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
        <div class='materialtip'>物料种类：</div>
        <div class='materialinput'>
          <el-select v-model="newMaterial.class" placeholder="请选择种类">
            <el-option
              v-for="item in materialClass"
              :key="item.id"
              :label="item.name"
              :value="item.id" />
          </el-select>
        </div>
      </el-row>
      <el-row>
        <div class='materialtip'>物料描述：</div>
        <div class='materialinput'>
          <el-input placeholder="请输入物料描述(可选)"
                  v-model="newMaterial.description"
                  type="textarea"
                  clearable/>
        </div>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newMaterialDialogVisible = false">取 消</el-button>
        <el-button type="primary"
          @click="handleNewMaterialSubmit"
          :disabled="newMaterialSubmitDisabled">新 建</el-button>
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
        <div class='materialtip'>物料种类：</div>
        <div class='materialinput'>
          <el-select v-model="currentMaterial.class"
            placeholder="请选择种类">
            <el-option
              v-for="item in materialClass"
              :key="item.id"
              :label="item.name"
              :value="item.id" />
          </el-select>
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
import testmaterial from '@/config_new/testmaterialcategory.js'
import materialclass from '@/config_new/materialclass.js'
import materialstatus from '@/config_new/materialstatus.js'

export default {
  name: 'Overall',
  data () {
    return {
      searchMaterial: {
        id: '',
        name: '',
        class: '',
        status: ''
      },
      currentPage: 1,
      materialesNumber: 20,
      materialData: testmaterial,
      materialClass: materialclass,
      materialStatus: materialstatus,
      newMaterialDialogVisible: false,
      modifyMaterialDialogVisible: false,
      dataLoading: false,
      newMaterial: {
        name: '',
        class: '',
        description: ''
      },
      currentMaterial: {
        id: '',
        name: '',
        class: 0,
        description: ''
      }
    }
  },
  methods: {
    handleSearch () {
      console.log('Searching...')
      console.log(this.searchMaterial)
      // reload material data
      this.dataLoading = true
      var self = this
      setTimeout(function () { self.dataLoading = false }, 1000)
    },
    handleNewMaterial () {
      this.newMaterialDialogVisible = true
      this.newMaterial = {
        name: '',
        class: '',
        description: ''
      }
    },
    handleNewMaterialSubmit () {
      console.log('New material......')
      console.log(this.newMaterial)
      this.newMaterialDialogVisible = false
      // reload material data
      this.dataLoading = true
      var self = this
      setTimeout(function () { self.dataLoading = false }, 1000)
    },
    handleEdit (row) {
      this.modifyMaterialDialogVisible = true
      this.currentMaterial.id = row.id
      this.currentMaterial.name = row.name
      this.currentMaterial.class = row.class
      this.currentMaterial.description = row.description
      // reload material data
    },
    handleModifySubmit () {
      console.log('Modify material......')
      console.log(this.currentMaterial)
      this.modifyMaterialDialogVisible = false
      this.dataLoading = true
      var self = this
      setTimeout(function () { self.dataLoading = false }, 1000)
    },
    handleDelete (id) {
      console.log('Delete' + id)
      // reload material data
      this.dataLoading = true
      var self = this
      setTimeout(function () { self.dataLoading = false }, 1000)
    },
    handlePagination () {
      console.log('Page to ' + this.currentPage)
      // reload material data
      this.dataLoading = true
      var self = this
      setTimeout(function () { self.dataLoading = false }, 1000)
    }
  },
  computed: {
    searchDisabled () {
      return this.searchMaterial.id === '' &&
        this.searchMaterial.name === '' &&
        this.searchMaterial.class === '' &&
        this.searchMaterial.status === ''
    },
    newMaterialSubmitDisabled () {
      return this.newMaterial.name === '' ||
        this.newMaterial.class === ''
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
  width: 8%;
  margin-left: 5px;
  margin-top: 10px;
  margin-bottom: 20px;
  color: #606266;
  text-align: right;
  display: inline-block;
  white-space:nowrap;
}
.searchmaterialinput {
  width: 12%;
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
.materialtip {
  display: inline-block;
  width: 25%;
  text-align: right;
  vertical-align: center;
  margin-top: 10px;
  white-space:nowrap;
}
.materialinput {
  display: inline-block;
  width: 74%;
  margin-top: 10px;
  white-space:nowrap;
}
</style>
