<template>
<div>

  <div class="search_material_part">
    <el-row>

      <span class="searchmaterialtip">物料编号：</span>
      <el-input placeholder="请输入物料编号"
        class='searchmaterialinput'
        v-model="searchMaterial.id"
        type="number"/>

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
    size="small"
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
        <el-input-number v-model="scope.row.danger" :min="1" :max="99999"/>
      </template>
    </el-table-column>
    <el-table-column
      label="当前状态"
      align="center"
      width="150">
      <template slot-scope="scope">
        <i class="el-icon-warning"
          style="color: #E6A23C;"
          v-if="materialStatus[scope.row.status-1].id==='3'">
          <span icon="el-icon-warning">
            {{materialStatus[scope.row.status-1].name}}
          </span>
        </i>
        <i class="el-icon-success"
          style="color: #67C23A;"
          v-if="materialStatus[scope.row.status-1].id==='1'">
          <span icon="el-icon-warning">
            {{materialStatus[scope.row.status-1].name}}
          </span>
        </i>
        <i class="el-icon-error"
          style="color: #F56C6C;"
          v-if="materialStatus[scope.row.status-1].id==='2'">
          <span icon="el-icon-warning">
            {{materialStatus[scope.row.status-1].name}}
          </span>
        </i>
      </template>
    </el-table-column>
    <el-table-column
      fixed="right"
      align="center"
      label="操作">
      <template slot-scope="scope">
        <el-button type="text" size="small"
          @click='handleEdit(scope.row)'>修改提交</el-button>
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
// import testwarnsetmaterial from '@/config_new/testwarnsetmaterial.js'
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
      materialesNumber: 0,
      total: 0,
      pageSize: 15,
      materialData: [],
      materialStatus: materialstatus,
      dataLoading: false
    }
  },
  methods: {
    handleSearch () {
      this.searchData()
    },
    handleEdit (row) {
      this.$axios({
        method: 'post',
        url: this.GLOBAL.backEndIp + '/api/material/updatethreshold',
        params: {
          id: row.id,
          warn: row.warn,
          danger: row.danger
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
    },
    handlePagination () {
      this.searchData()
    },
    searchData () {
      this.dataLoading = true
      var id = 0
      var name = ''
      var status = 0
      if (this.searchMaterial.id !== '') {
        id = this.searchMaterial.id
      }
      if (this.searchMaterial.name !== '') {
        name = this.searchMaterial.name
      }
      if (this.searchMaterial.status !== '') {
        status = this.searchMaterial.status
      }
      this.$axios({
        method: 'get',
        url: this.GLOBAL.backEndIp + '/api/material/getthreshold',
        params: {
          id: id,
          name: name,
          status: status,
          kind: 0,
          page: this.currentPage - 1,
          size: this.pageSize
        }
      }).then(response => {
        if (response.data.code === 1) {
          this.materialData = response.data.data
          this.total = response.data.allLength
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
      this.dataLoading = false
    }
  },
  computed: {
    searchDisabled () {
      return this.searchMaterial.id === '' &&
        this.searchMaterial.name === '' &&
        this.searchMaterial.status === ''
    }
  },
  mounted () {
    this.searchData()
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
