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

      <el-button icon="el-icon-search"
        :disabled='searchDisabled'
        style="margin-left: 40px;"
        type="primary" @click='handleSearch'>筛选物料</el-button>

    </el-row>
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
      prop="remain"
      sortable
      label="剩余数量"
      align="center"
      width="100">
    </el-table-column>
    <el-table-column
      label="偏少阈值"
      align="center"
      width="250">
      <template
        slot="header"
        slot-scope="{ column, $index }">
        <i class="el-icon-warning"
          style="color: #E6A23C;">
          <span>偏少阈值</span>
        </i>
      </template>
      <template slot-scope="scope">
        <el-input-number v-model="scope.row.warn" :min="1" :max="99999"/>
      </template>
    </el-table-column>
    <el-table-column
      label="缺货阈值"
      align="center"
      width="250">
      <template
        slot="header"
        slot-scope="{ column, $index }">
        <i class="el-icon-error"
          style="color: #F56C6C;">
          <span>缺货阈值</span>
        </i>
      </template>
      <template slot-scope="scope">
        <el-input-number v-model="scope.row.error" :min="1" :max="99999"/>
      </template>
    </el-table-column>
    <el-table-column
      fixed="right"
      align="center"
      label="操作">
      <template slot-scope="scope">
        <el-button type="text" size="small"
          @click='handleEdit(scope.row.id, scope.row.warn, scope.row.error)'>修改提交</el-button>
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

</div>
</template>

<script>
import testwarnsetmaterial from '@/config_new/testwarnsetmaterial.js'
import materialstatus from '@/config_new/materialstatus.js'

export default {
  name: 'Overall',
  data () {
    return {
      searchMaterial: {
        id: '',
        name: '',
        status: ''
      },
      currentPage: 1,
      materialesNumber: 20,
      materialData: testwarnsetmaterial,
      materialStatus: materialstatus,
      dataLoading: false
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
    handleEdit (id, warn, error) {
      // reload material data
      console.log(id + ' ' + warn + ' ' + error)
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
        this.searchMaterial.status === ''
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
.pagination_class {
  margin: 40px;
  text-align: center;
}
</style>
