<template>
<div>
  <div class="station_overall_class">
    <div style="width: 20%; text-align: center; display: inline-block;">
      <div>
        <span style="font-size: 250%; color: #409EFF;">
          {{allData.all}}
        </span>
        <span style="font-size: 80%; color: #606266;">个</span>
      </div>
      <div>
        <span style="font-size: 100%; color: #303133;">所有工位</span>
      </div>
    </div>

    <div style="width: 20%; text-align: center; display: inline-block;">
      <div>
        <span style="font-size: 250%; color: #67C23A;">
          {{allData.producing}}
        </span>
        <span style="font-size: 80%; color: #606266;">个</span>
      </div>
      <div>
        <span style="font-size: 100%; color: #303133;">工位正在生产</span>
      </div>
    </div>

    <div style="width: 20%; text-align: center; display: inline-block;">
      <div>
        <span style="font-size: 250%; color: #E6A23C;">
          {{allData.resting}}
        </span>
        <span style="font-size: 80%; color: #606266;">个</span>
      </div>
      <div>
        <span style="font-size: 100%; color: #303133;">工位正在休整中</span>
      </div>
    </div>

    <div style="width: 20%; text-align: center; display: inline-block;">
      <div>
        <span style="font-size: 250%; color: #E6A23C;">
          {{allData.partresting}}
        </span>
        <span style="font-size: 80%; color: #606266;">个</span>
      </div>
      <div>
        <span style="font-size: 100%; color: #303133;">工位部分休整中</span>
      </div>
    </div>

    <div style="width: 18%; text-align: center; display: inline-block;">
      <div>
        <span style="font-size: 250%; color: #F56C6C;">
          {{allData.stopped}}
        </span>
        <span style="font-size: 80%; color: #606266;">个</span>
      </div>
      <div>
        <span style="font-size: 100%; color: #303133;">工位正在停工中</span>
      </div>
    </div>
  </div>

  <div class="search_station_overall_part">
    <el-row>
      <span class="searchstationoveralltip">工位编号：</span>
      <el-input placeholder="请输入工单编号"
        class='searchstationoverallinput'
        v-model="searchStationOverall.id"
        clearable/>

      <span class="searchstationoveralltip">工位名称：</span>
      <el-input placeholder="请输入工单名称"
        class='searchstationoverallinput'
        v-model="searchStationOverall.name"
        clearable/>

      <span class="searchstationoveralltip">工位状态：</span>
      <el-select v-model="searchStationOverall.status" placeholder="请选择状态"
        class='searchstationoverallinput'>
        <el-option
          v-for="item in stationStatus"
          :key="item.id"
          :label="item.name"
          :value="item.id" />
      </el-select>

      <el-button icon="el-icon-search"
        :disabled='searchDisabled'
        style="margin-left: 40px;"
        type="primary" @click='handleSearch'>筛选工位</el-button>
    </el-row>
  </div>

  <div class="new_station_class">
    <el-button icon="el-icon-edit" size="small"
      type="primary" @click='handleNewStation'>
        创建新的工位
    </el-button>
  </div>

  <el-drawer
    title="新建工位"
    :visible.sync="newStationVisible"
    direction="rtl"
    custom-class="newstation-drawer"
    ref="drawer">
    <div class="newstation-drawer__content">
      <el-row>
        <div class='newstaiontip'>工位名称：</div>
        <div class='newstaioninput'>
          <el-input placeholder="请输入工位名称" v-model="newStation.name" clearable/>
        </div>
      </el-row>
      <el-row>
        <div class='newstaiontip'>
          <span style="color: #909399; margin-left: 20px;">
            提示：
          </span>
        </div>
        <div class='newstaioninputsp'>
          <span style="color: #909399;">创建新的工位默认状态为休整中，您可以稍后对其进行修改</span>
        </div>
      </el-row>
      <div class="newstation-drawer__footer">
        <el-row style="text-align: center; margin-top: 40px;">
          <el-button icon="el-icon-edit"
            type="primary" @click='handleNewStationSubmit'>
              创 建
          </el-button>
        </el-row>
      </div>
    </div>
  </el-drawer>

  <el-table
    size="small"
    :data="stationData"
    :default-sort = "{prop: 'id', order: 'descending'}"
    stripe
    v-loading="dataLoading"
    style="width: 100%;">
    <el-table-column
      fixed="left"
      prop="id"
      sortable
      label="工位编号"
      align="center"
      width="110">
    </el-table-column>
    <el-table-column
      prop="name"
      sortable
      label="工位名称"
      align="center"
      width="100">
    </el-table-column>
    <el-table-column
      label="设备数量"
      align="center"
      width="100">
      <template slot-scope="scope">
        <span>{{scope.row.equipmount}}台</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="lastmaintain"
      sortable
      label="上次维护时间"
      align="center"
      width="180">
    </el-table-column>
    <el-table-column
      label="状态"
      align="center"
      width="120">
      <template slot-scope="scope">
        <i class="el-icon-circle-check" style="color: #67C23A;" v-if="scope.row.status===1"/>
        <span style="color: #67C23A;" v-if="scope.row.status===1">
          {{stationStatus[scope.row.status - 1].name}}
        </span>
        <i class="el-icon-circle-close" style="color: #F56C6C;" v-if="scope.row.status===2"/>
        <span style="color: #F56C6C;" v-if="scope.row.status===2">
          {{stationStatus[scope.row.status - 1].name}}
        </span>
        <i class="el-icon-warning-outline" style="color: #E6A23C;" v-if="scope.row.status===3"/>
        <span style="color: #E6A23C;" v-if="scope.row.status===3">
          {{stationStatus[scope.row.status - 1].name}}
        </span>
        <i class="el-icon-warning-outline" style="color: #E6A23C;" v-if="scope.row.status===4"/>
        <span style="color: #E6A23C;" v-if="scope.row.status===4">
          {{stationStatus[scope.row.status - 1].name}}
        </span>
      </template>
    </el-table-column>
    <el-table-column
      label="工位设备"
      align="center">
      <template slot-scope="scope">
        <el-popover
          placement="top"
          width="250"
          trigger="hover">
          <div v-for="(mitem, index1) in scope.row.equipment" :key="index1">
            <span style="color: #C0C4CC; margin-right: 10px;">{{mitem.id}}</span>
            <span> {{mitem.name}}</span>
          </div>
          <div slot="reference">
              <span v-for="(item, index) in scope.row.equipment" :key="index"
              style="white-space: nowrap; text-overflow:ellipsis; overflow:hidden;">
                {{item.name}} </span>
          </div>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="250">
      <template slot-scope="scope">
        <el-button type="text" size="small"
          @click='handleEditName(scope.row)'>编辑名称</el-button>

        <el-button type="text" size="small" v-if="scope.row.status===1 || scope.row.status===4"
          @click='handleMaintain(scope.row.id)' style="color: #E6A23C;">维护休整</el-button>

        <el-button type="text" size="small" v-if="scope.row.status===2 || scope.row.status===3"
          @click='handleRecover(scope.row.id)' style="color: #67C23A;">恢复生产</el-button>

        <el-button type="text" size="small" style="color: #F56C6C;" v-if="scope.row.status!==2"
          @click='handleStop(scope.row.id)'>停工</el-button>

        <el-button type="text" size="small" style="color: #F56C6C;" v-if="scope.row.status===2"
          @click='handleDelete(scope.row.id)'>删除工位</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog
    :modal="false"
    title="编辑工位名称"
    :visible.sync="editStationNameVisible"
    width="30%">
    <el-row>
      <div class='newstaiontip'>工位编号：</div>
      <div class='newstaioninput'>
        <span>{{currentStation.id}}</span>
      </div>
    </el-row>
    <el-row>
      <div class='newstaiontip'>工位名称：</div>
      <div class='newstaioninput'>
        <el-input v-model="currentStation.name"></el-input>
      </div>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="editStationNameVisible = false">取 消</el-button>
      <el-button type="primary"
        @click="handleModifySubmit"
        :disabled="modifyDisabled">确认修改</el-button>
    </span>
  </el-dialog>

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
import stationstatus from '../../../config_new/stationstatus.js'
import stationData from '../../../config_new/teststations.js'

export default {
  name: 'Overall',
  data () {
    return {
      dataLoading: false,
      allData: {
        all: 204,
        producing: 180,
        stopped: 14,
        resting: 4,
        partresting: 6
      },
      searchStationOverall: {
        id: '',
        name: '',
        status: ''
      },
      stationStatus: stationstatus,
      stationData: stationData,
      newStationVisible: false,
      editStationNameVisible: false,
      newStation: {
        name: ''
      },
      currentStation: {
        id: '',
        name: ''
      },
      pagination: {
        pageSize: 10,
        total: 90,
        currentPage: 1
      }
    }
  },
  methods: {
    reloadData () {
      console.log('Reload Data......')
      this.dataLoading = true
      var self = this
      setTimeout(function () { self.dataLoading = false }, 1000)
    },
    handleSearch () {
      console.log(this.searchStationOverall)
    },
    handleNewStation () {
      this.newStationVisible = true
    },
    handleNewStationSubmit () {
      console.log(this.newStation)
      this.newStationVisible = false
    },
    handleEditName (row) {
      this.editStationNameVisible = true
      this.currentStation = {
        id: row.id,
        name: row.name
      }
    },
    handleModifySubmit () {
      console.log(this.currentStation)
      this.editStationNameVisible = false
    },
    handleMaintain (id) {
      console.log('Maintain ' + id)
    },
    handleRecover (id) {
      console.log('Recover ' + id)
    },
    handleDelete (id) {
      console.log('Delete ' + id)
    },
    handleStop (id) {
      console.log('Stop ' + id)
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
      return this.searchStationOverall.id === '' &&
        this.searchStationOverall.name === '' &&
        this.searchStationOverall.status === ''
    },
    modifyDisabled () {
      return this.currentStation.name === ''
    }
  }
}
</script>

<style>
.station_overall_class {
  margin-bottom: 20px;
}
.search_station_overall_part {
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);}
.searchstationoveralltip {
  width: 10%;
  margin-left: 5px;
  margin-top: 10px;
  margin-bottom: 20px;
  color: #606266;
  text-align: right;
  display: inline-block;
  white-space:nowrap;
}
.searchstationoverallinput {
  width: 15%;
  display: inline-block;
  white-space:nowrap;
}
.pagination_class {
  margin: 40px;
  text-align: center;
}
.new_station_class {
  padding: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.newstaiontip {
  display: inline-block;
  width: 25%;
  text-align: right;
  vertical-align: center;
  margin-top: 10px;
  white-space:nowrap;
}
.newstaioninput {
  display: inline-block;
  width: 70%;
  margin-top: 20px;
}
.newstaioninputsp {
  display: inline-block;
  width: 70%;
  margin-top: 20px;
  font-size: 80%;
  vertical-align: center;
}
</style>
