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

  <el-table
    class="material_table_class"
    :data="treeData"
    size="small"
    :default-sort = "{prop: 'id', order: 'descending'}"
    stripe
    v-loading="dataLoading"
    style="width: 100%;">
    <el-table-column
      fixed="left"
      prop="id"
      sortable
      label="生产树编号"
      align="center"
      width="150">
    </el-table-column>
    <el-table-column
      prop="name"
      sortable
      label="生产树名称"
      align="center"
      width="150">
    </el-table-column>
    <el-table-column
      prop="opname"
      sortable
      label="目标物料名称"
      align="center"
      width="150">
    </el-table-column>
    <el-table-column
      prop="mount"
      sortable
      label="近30天使用次数"
      align="center"
      width="150">
    </el-table-column>
    <el-table-column
      prop="status"
      sortable
      label="生产树状态"
      align="center"
      width="120">
      <template slot-scope="scope">
        <i class="el-icon-warning"
          style="color: #E6A23C;"
          v-if="treeStatus[scope.row.status-1].id==='3'">
          <span>
            {{treeStatus[scope.row.status-1].name}}
          </span>
        </i>
        <i class="el-icon-success"
          style="color: #67C23A;"
          v-if="treeStatus[scope.row.status-1].id==='1'">
          <span>
            {{treeStatus[scope.row.status-1].name}}
          </span>
        </i>
        <i class="el-icon-error"
          style="color: #F56C6C;"
          v-if="treeStatus[scope.row.status-1].id==='2'">
          <span>
            {{treeStatus[scope.row.status-1].name}}
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
          @click='handleLookUp(scope.row)'>查看</el-button>
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
    class="modify_material_dialog_class"
    :modal="false"
    :title="currentTree.name + '生产树 状态：'+ treeStatus[currentTree.status-1].name  "
    :visible.sync="lookupVisible"
    width="40%">
    <hr style="width: 0px; height: 70px; border: 1px solid #606266; position: absolute; top: 100px; left: 0; right: 0;"/>
    <hr style="width: 50%; border: 1px solid #606266;
    position: absolute; top: 170px; left: 0; right: 0;"/>
    <div style="position: relative; top: 0px; text-align: center;">
      <el-row>
        <el-button plain :style="{'background-color': getColor(), 'color': 'white'}">{{currentTree.name}}</el-button>
      </el-row>
      <el-row style="overflow:auto; width: 100%; margin-top: 30px;">
        <span v-for="(needitem, index1) in currentTree.need"
          :key = "index1" :style="'display: inline-block; width: ' + 100 / currentTree.need.length + '%;'">
          <el-button plain :style="{'background-color': getColor(), 'color': 'white'}">{{needitem.name}}*{{needitem.mount}}</el-button>
        </span>
      </el-row>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="lookupVisible = false">确 定</el-button>
    </span>
  </el-dialog>

</div>
</template>

<script>
import treetatus from '@/config_new/treestatus.js'

export default {
  name: 'Statistic',
  data () {
    return {
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
      treeData: [],
      treeStatus: treetatus,
      dataLoading: false,
      lookupVisible: false,
      currentTree: {
        status: 1
      }
    }
  },
  methods: {
    getColor () {
      var color = ''
      if (this.currentTree.status === 1) {
        color = '#67C23A'
      }
      if (this.currentTree.status === 2) {
        color = '#E6A23C'
      }
      if (this.currentTree.status === 3) {
        color = '#F56C6C'
      }
      return color
    },
    handleLookUp (row) {
      this.lookupVisible = true
      this.currentTree = row
    },
    handleSearch () {
      console.log(this.searchMaterial)
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
        url: this.GLOBAL.backEndIp + '/api/tree/getwithmount',
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
      return this.searchMaterial.id === '' &&
        this.searchMaterial.name === '' &&
        this.searchMaterial.class === '' &&
        this.searchMaterial.status === ''
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
.searchtreetip {
  width: 10%;
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
