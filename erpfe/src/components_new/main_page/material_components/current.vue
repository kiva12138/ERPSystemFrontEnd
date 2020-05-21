<template>
<div>
  <div class='material_current_hint'>
    {{hintText}}
  </div>

  <div class="search_current_part">
    <el-row>

      <span class="searchcurrenttip">按物料编号筛选：</span>
      <el-input placeholder="请输入物料编号"
        class='searchcurrentinput'
        size="small"
        v-model="searchCurrent.materialId"
        type="number"/>

      <span class="searchcurrenttip">按工位名称：</span>
      <el-input placeholder="请输入工位名称"
        class='searchcurrentinput'
        size="small"
        v-model="searchCurrent.stationName"
        clearable/>

      <el-button icon="el-icon-search"
        :disabled='searchDisabled'
        size="small"
        style="margin-left: 40px;"
        type="primary" @click='handleSearch'>筛选并查看物料分布</el-button>

      <span class='material_current_hint' style="font-size: 90%;">{{hintText2}}</span>

    </el-row>
  </div>

  <div class="material_current_table">
    <el-row :gutter="tableGutter"
      v-loading="dataLoading"
      class="material_current_row">
      <el-col v-for="(item, index) in testMaterialCurrent"
        :key = "index"
        :span="randomSpan"
        class="material_current_col">
        <el-popover
          placement="top"
          width="300"
          trigger="hover">
          <div v-for="(mitem, index) in item.uses" :key="index">
            <span style="color: #C0C4CC">{{mitem.id}}</span>
            <span>{{mitem.name}}</span>
            <span style="color: #67C23A" v-if="item.status===1">
              正在使用{{mitem.mount}}件
            </span>
            <span style="color: #F56C6C" v-if="item.status===2">
              正在使用{{mitem.mount}}件
            </span>
            <span style="color: #E6A23C" v-if="item.status===3">
              正在使用{{mitem.mount}}件
            </span>
            <span style="color: #409EFF" v-if="item.status===4">
              正在使用{{mitem.mount}}件
            </span>
          </div>
          <div class="grid-content" slot="reference">
            <div><span style="color: #909399;">编号:{{item.id}}</span></div>
            <div>{{item.name}}</div>
            <div v-if="item.status===1" style="color: #67C23A;">
              {{stationStatus[item.status-1].name}}
            </div>
            <div v-if="item.status===2" style="color: #F56C6C;">
              {{stationStatus[item.status-1].name}}
            </div>
            <div v-if="item.status===3" style="color: #F56C6C;">
              {{stationStatus[item.status-1].name}}
            </div>
            <div v-if="item.status===4" style="color: #E6A23C;">
              {{stationStatus[item.status-1].name}}
            </div>
            <el-progress :percentage="item.process"
              v-if="item.status===1" status="success"/>
            <el-progress :percentage="item.process"
              v-if="item.status===2" status="exception"/>
            <el-progress :percentage="item.process"
              v-if="item.status===3" status="warning"/>
            <el-progress :percentage="item.process"
              v-if="item.status===4"/>
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
    style="text-align: center; margin: 20px;"
    @current-change="handlePagination"
    :total="pagination.stationNumber">
  </el-pagination>

</div>
</template>

<script>
// import testMaterialCurrent from '../../../config_new/testmaterialcurrent.js'
import stationstatus from '../../../config_new/stationstatus.js'

export default {
  name: 'Current',
  data () {
    return {
      hintText: '以下为当前物料在工位的分布情况，若要对工位、设备管理请前往工位管理' +
        '; 若要对物料数量进行操作，请前往配送管理。',
      hintText2: '点击具体工位以查看具体物料情况',
      searchCurrent: {
        materialId: '',
        stationName: ''
      },
      dataLoading: false,
      testMaterialCurrent: [],
      stationStatus: stationstatus,
      pagination: {
        currentPage: 1,
        pageSize: 50,
        stationNumber: 0
      },
      tableGutter: 10,
      tableStationSpan: [2, 4, 6, 8]
    }
  },
  methods: {
    reloadData () {
      this.dataLoading = true
      this.$axios({
        method: 'get',
        url: this.GLOBAL.backEndIp + '/api/station/getcurrent',
        params: {
          mid: this.searchCurrent.materialId,
          sname: this.searchCurrent.stationName,
          page: this.pagination.currentPage - 1,
          size: this.pagination.pageSize
        }
      }).then(response => {
        if (response.data.code === 1) {
          this.testMaterialCurrent = response.data.data
          this.pagination.total = response.data.allLength
          console.log(response.data)
        } else {
          this.$message({
            message: '查找失败。' + '错误原因：' + response.data.code + '-' + response.data.message,
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
      let i = 0
      for (i = 0; i < this.testMaterialCurrent.length; i++) {
        this.testMaterialCurrent[i].span = Math.random() * 4
      }
    },
    handleSearch () {
      console.log(this.searchCurrent)
      this.reloadData()
    },
    handlePagination () {
      this.reloadData()
    }
  },
  mounted () {
    this.reloadData()
  },
  computed: {
    searchDisabled () {
      return this.searchCurrent.materialId === '' &&
        this.searchCurrent.stationId === ''
    },
    randomSpan () {
      var j = Math.random() * 5 + 3
      return parseInt(j)
    }
  }
}
</script>

<style>
.material_current_hint {
  color: #909399;
  margin: 20px;
}
.search_current_part {
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.searchcurrentinput {
  width: 12%;
  display: inline-block;
  white-space:nowrap;
}
.searchcurrenttip {
  width: 10%;
  margin-left: 5px;
  margin-top: 10px;
  margin-bottom: 20px;
  font-size: 90%;
  color: #606266;
  text-align: right;
  display: inline-block;
  white-space:nowrap;
}
.material_current_table {
  margin: 10px;
}
.material_current_row {
}
.material_current_col {
  margin-bottom: 10px;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
}
.grid-content {
  border-radius: 4px;
  min-height: 60px;
  background: #d3dce6;
  color: #606266;
  text-align: center;
  font-size: 80%;
}
</style>
