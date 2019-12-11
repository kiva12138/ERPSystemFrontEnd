<template>
<div>
  <span class='material_current_hint'>
    {{hintText}}
  </span>

  <div class="search_current_part">
    <el-row>

      <span class="searchcurrenttip">按物料编号筛选：</span>
      <el-input placeholder="请输入物料编号"
        class='searchcurrentinput'
        v-model="searchCurrent.materialId"
        clearable/>

      <span class="searchcurrenttip">按工位筛选：</span>
      <el-input placeholder="请输入物料名称"
        class='searchcurrentinput'
        v-model="searchCurrent.stationId"
        clearable/>

      <el-button icon="el-icon-search"
        :disabled='searchDisabled'
        style="margin-left: 40px;"
        type="primary" @click='handleSearch'>筛选并查看物料分布</el-button>

      <span class='material_current_hint'>{{hintText2}}</span>

    </el-row>
  </div>

  <div class="material_current_table">
    <el-row :gutter="tableGutter"
      v-loading="dataLoading"
      class="material_current_row">
      <el-col v-for="(item, index) in testMaterialCurrent"
        :key = "index"
        :span="tableStationSpan[item.span]"
        class="material_current_col">
        <el-popover
          placement="top"
          width="250"
          trigger="hover">
          <div v-for="(mitem, index) in item.material" :key="index">
            <span style="color: #C0C4CC">{{mitem.materialId}}</span>
            <span>{{mitem.materialName}}</span>
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
            <div><span style="color: #909399;">编号:{{item.stationid}}</span></div>
            <div>{{item.stationname}} {{item.equipment}}台设备</div>
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
import testMaterialCurrent from '../../../config_new/testmaterialcurrent.js'
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
        stationId: ''
      },
      dataLoading: false,
      testMaterialCurrent: testMaterialCurrent,
      stationStatus: stationstatus,
      pagination: {
        currentPage: 1,
        pageSize: 50,
        stationNumber: 200
      },
      tableGutter: 10,
      tableStationSpan: [2, 4, 6, 8]
    }
  },
  methods: {
    reloadData () {
      console.log('Reload Data......')
      this.dataLoading = true
      var self = this
      setTimeout(function () { self.dataLoading = false }, 1000)
      let i = 0
      for (i = 0; i < this.testMaterialCurrent.length; i++) {
        if (this.testMaterialCurrent[i].equipment >= 4) {
          this.testMaterialCurrent[i].span = 3
        } else if (this.testMaterialCurrent[i].equipment === 3) {
          this.testMaterialCurrent[i].span = 2
        } else if (this.testMaterialCurrent[i].equipment === 2) {
          this.testMaterialCurrent[i].span = 1
        } else {
          this.testMaterialCurrent[i].span = 0
        }
      }
    },
    handleSearch () {
      console.log('Searching...')
      console.log(this.searchCurrent)
      this.reloadData()
    },
    handlePagination () {
      console.log('Page to ' + this.pagination.currentPage)
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
