<template>
<div>

  <div class="search_material_part">
    <el-row>

      <span class="searchmaterialtip">物料编号：</span>
      <el-input placeholder="请输入物料编号"
        class='searchmaterialinput'
        type="number"
        v-model="searchMaterial.id"
        clearable/>

      <span class="searchmaterialtip">工位编号：</span>
      <el-input placeholder="请输入工位编号"
        class='searchmaterialinput'
        type="number"
        v-model="searchMaterial.stationid"
        clearable/>

      <span class="searchmaterialtip">记录类型：</span>
      <el-select v-model="searchMaterial.type" placeholder="请选择种类"
        class='searchmaterialinput'>
        <el-option
          v-for="item in operation"
          :key="item.id"
          :label="item.name"
          :value="item.id" />
      </el-select>

      <el-button icon="el-icon-search"
        :disabled='searchDisabled'
        style="margin-left: 40px;"
        type="primary" @click='handleSearch'>筛选记录</el-button>

    </el-row>

    <el-row>
      <span class="searchmaterialtip">开始日期：</span>
      <el-date-picker
        v-model="searchMaterial.starttime"
        align="right"
        type="date"
        placeholder="选择开始日期"
        :picker-options="pickerOptions">
      </el-date-picker>

      <span class="searchmaterialtip">结束日期：</span>
      <el-date-picker
        v-model="searchMaterial.endtime"
        align="right"
        type="date"
        placeholder="选择结束日期"
        :picker-options="pickerOptions">
      </el-date-picker>
    </el-row>
  </div>

  <div class="new_material_class">
    <el-button icon="el-icon-delete"
      size="small" :disabled="deleteDisabled"
      type="warning" @click='handleDeleteMul'>
        删除所选记录
    </el-button>
  </div>

  <el-table
    class="material_table_class"
    :data="materialData"
    @selection-change="handleSelectionChange"
    size="mini"
    :default-sort = "{prop: 'id', order: 'descending'}"
    v-loading="dataLoading"
    style="width: 100%;">
    <el-table-column
      type="selection"
      width="50"/>
    <el-table-column
      fixed="left"
      prop="id"
      sortable
      label="记录编号"
      align="center"
      width="150">
    </el-table-column>
    <el-table-column
      prop="time"
      sortable
      label="记录时间"
      align="center"
      width="200">
      <template slot-scope="scope">
        <span>{{scope.row.time.split('T')[0]}}</span>
      </template>
    </el-table-column>
    <el-table-column
      sortable
      label="产出/消耗"
      align="center"
      width="200">
      <template slot-scope="scope">
        <span>{{scope.row.mid}}号物料</span>
      </template>
    </el-table-column>
    <el-table-column
      sortable
      label="记录类型"
      align="center"
      width="150">
      <template slot-scope="scope">
        <span>{{operation[scope.row.way -1].name}}</span>
      </template>
    </el-table-column>
    <el-table-column
      sortable
      label="数量"
      align="center"
      width="120">
      <template slot-scope="scope">
        <span>{{scope.row.mount}} 件</span>
      </template>
    </el-table-column>
    <el-table-column
      sortable
      prop="stationId"
      align="center"
      label="工位编号">
      <template slot-scope="scope">
        <span>{{scope.row.stationId}}号工位</span>
      </template>
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="150">
      <template slot-scope="scope">
        <el-button type="text" size="small"
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

</div>
</template>

<script>
import testrecord from '@/config_new/testrecord.js'
import materialclass from '@/config_new/materialclass.js'
import materialstatus from '@/config_new/materialstatus.js'

export default {
  name: 'Overall',
  data () {
    return {
      operation: [
        {
          id: 1,
          name: '产出'
        },
        {
          id: 2,
          name: '消耗'
        }
      ],
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      searchMaterial: {
        starttime: '',
        endtime: '',
        id: '',
        stationid: '',
        type: ''
      },
      pagination: {
        pageSize: 15,
        currentPage: 1,
        total: 0
      },
      materialData: [],
      multipleSelection: [],
      materialClass: materialclass,
      materialStatus: materialstatus,
      dataLoading: false
    }
  },
  methods: {
    handleDeleteMul () {
      console.log(this.multipleSelection)
      this.$confirm('此操作将删除所选物料生产记录，请谨慎操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        for (var i = 0; i < this.multipleSelection.length; i++) {
          this.$axios({
            method: 'post',
            url: this.GLOBAL.backEndIp + '/api/materialproduce/deletebyid',
            params: {
              id: this.multipleSelection[i].id
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
        }
        this.reloadData()
      }).catch(() => {})
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleSearch () {
      console.log(this.searchMaterial)
      this.dataLoading = true
      this.searchData()
      this.dataLoading = false
    },
    handleDelete (id) {
      this.$confirm('此操作将永久删除该生产记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios({
          method: 'post',
          url: this.GLOBAL.backEndIp + '/api/materialproduce/deletebyid',
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
      var starttime = ''
      var endtime = ''
      var id = 0
      var stationid = 0
      var type = 0
      if (this.searchMaterial.starttime !== '') {
        starttime = this.searchMaterial.starttime.getFullYear() + '-' +
                    (this.searchMaterial.starttime.getMonth() + 1) + '-' +
                    this.searchMaterial.starttime.getDate()
      }
      if (this.searchMaterial.endtime !== '') {
        endtime = this.searchMaterial.endtime.getFullYear() + '-' +
                    (this.searchMaterial.endtime.getMonth() + 1) + '-' +
                    this.searchMaterial.endtime.getDate()
      }
      if (this.searchMaterial.id !== '') {
        id = this.searchMaterial.id
      }
      if (this.searchMaterial.stationid !== '') {
        stationid = this.searchMaterial.stationid
      }
      if (this.searchMaterial.type !== '') {
        type = this.searchMaterial.type
      }
      this.materialData = testrecord
      this.$axios({
        method: 'get',
        url: this.GLOBAL.backEndIp + '/api/materialproduce/get',
        params: {
          id: id,
          stationid: stationid,
          type: type,
          starttime: starttime,
          endtime: endtime,
          page: this.pagination.currentPage - 1
        }
      }).then(response => {
        if (response.data.code === 1) {
          this.materialData = response.data.records
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
      return this.searchMaterial.time === '' &&
        this.searchMaterial.name === '' &&
        this.searchMaterial.class === '' &&
        this.searchMaterial.type === ''
    },
    deleteDisabled () {
      return this.multipleSelection.length === 0
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
  margin: 10px;
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
