<template>
<div>
  <div class="equipment_overall_class">
    <div style="width: 20%; text-align: center; display: inline-block;">
      <div>
        <span style="font-size: 250%; color: #409EFF;">
          {{allData.all}}
        </span>
        <span style="font-size: 80%; color: #606266;">台</span>
      </div>
      <div>
        <span style="font-size: 100%; color: #303133;">所有设备</span>
      </div>
    </div>

    <div style="width: 20%; text-align: center; display: inline-block;">
      <div>
        <span style="font-size: 250%; color: #67C23A;">
          {{allData.producing}}
        </span>
        <span style="font-size: 80%; color: #606266;">台</span>
      </div>
      <div>
        <span style="font-size: 100%; color: #303133;">设备正在生产</span>
      </div>
    </div>

    <div style="width: 20%; text-align: center; display: inline-block;">
      <div>
        <span style="font-size: 250%; color: #E6A23C;">
          {{allData.resting + allData.maintain}}
        </span>
        <span style="font-size: 80%; color: #606266;">台</span>
      </div>
      <div>
        <span style="font-size: 100%; color: #303133;">设备正在休整或保养中</span>
      </div>
    </div>

    <div style="width: 20%; text-align: center; display: inline-block;">
      <div>
        <span style="font-size: 250%; color: #E6A23C;">
          {{allData.repairing}}
        </span>
        <span style="font-size: 80%; color: #606266;">台</span>
      </div>
      <div>
        <span style="font-size: 100%; color: #303133;">设备正在维修中</span>
      </div>
    </div>

    <div style="width: 18%; text-align: center; display: inline-block;">
      <div>
        <span style="font-size: 250%; color: #F56C6C;">
          {{allData.broken}}
        </span>
        <span style="font-size: 80%; color: #606266;">台</span>
      </div>
      <div>
        <span style="font-size: 100%; color: #303133;">设备已经发生故障</span>
      </div>
    </div>
  </div>

  <div class="search_equipment_overall_part">
    <el-row>
      <span class="searchequipmentoveralltip">设备编号：</span>
      <el-input placeholder="请输入设备编号"
        class='searchequipmentoverallinput'
        v-model="searchEquipmentOverall.id"
        clearable/>

      <span class="searchequipmentoveralltip">设备名称：</span>
      <el-input placeholder="请输入设备名称"
        class='searchequipmentoverallinput'
        v-model="searchEquipmentOverall.name"
        clearable/>

      <span class="searchequipmentoveralltip">设备状态：</span>
      <el-select v-model="searchEquipmentOverall.status" placeholder="请选择状态"
        class='searchequipmentoverallinput'>
        <el-option
          v-for="item in equipmentStatus"
          :key="item.id"
          :label="item.name"
          :value="item.id" />
      </el-select>

    </el-row>

    <el-row>
      <span class="searchequipmentoveralltip">所属工位编号：</span>
      <el-input placeholder="请输入所属工位编号"
        class='searchequipmentoverallinput'
        v-model="searchEquipmentOverall.stationid"
        clearable/>

      <span class="searchequipmentoveralltip">所属工位名称：</span>
      <el-input placeholder="请输入所属工位名称"
        class='searchequipmentoverallinput'
        v-model="searchEquipmentOverall.stationname"
        clearable/>

      <el-button icon="el-icon-search"
        :disabled='searchDisabled'
        style="margin-left: 40px;"
        type="primary" @click='handleSearch'>筛选设备</el-button>
    </el-row>
  </div>

  <div class="new_equipment_class">
    <div style="color: #909399; margin: 10px;">注意：此页面的操作除新建设备外应该下放到工位执行，请谨慎操作。</div>
    <el-button icon="el-icon-edit" size="small"
      type="primary" @click='handleNewEquipment'>
        创建新的设备
    </el-button>
  </div>

  <el-drawer
    title="新建设备"
    :visible.sync="newEquipmentVisible"
    direction="rtl"
    custom-class="newequipment-drawer"
    ref="drawer">
    <div class="newequipment-drawer__content">
      <el-row>
        <div class='newstaiontip'>设备名称：</div>
        <div class='newstaioninput'>
          <el-input placeholder="请输入设备名称" v-model="newEquipment.name" clearable/>
        </div>
      </el-row>
      <el-row>
        <div class='newstaiontip'>所属工位编号：</div>
        <div class='newstaioninput'>
          <el-input placeholder="所属工位编号" v-model="newEquipment.stationname" clearable/>
        </div>
      </el-row>
      <el-row>
        <div class='newstaiontip'>
          <span style="color: #909399; margin-left: 20px;">
            提示：
          </span>
        </div>
        <div class='newstaioninputsp'>
          <span style="color: #909399;">创建新的设备默认状态为休整中，您可以稍后对其进行修改</span>
        </div>
      </el-row>
      <div class="newequipment-drawer__footer">
        <el-row style="text-align: center; margin-top: 40px;">
          <el-button icon="el-icon-edit"
            :disabled="newEquipmentDisabled"
            type="primary" @click='handleNewEquipmentSubmit'>
              创 建
          </el-button>
        </el-row>
      </div>
    </div>
  </el-drawer>

  <el-table
    size="small"
    :data="equipmentData"
    :default-sort = "{prop: 'id', order: 'descending'}"
    stripe
    v-loading="dataLoading"
    style="width: 100%;">
    <el-table-column
      fixed="left"
      prop="id"
      sortable
      label="设备编号"
      align="center"
      width="110">
    </el-table-column>
    <el-table-column
      prop="name"
      sortable
      label="设备名称"
      align="center"
      width="100">
    </el-table-column>
    <el-table-column
      label="所属工位"
      align="center"
      width="100">
      <template slot-scope="scope">
        <span>{{scope.row.stationid}}</span><br><span>{{scope.row.stationname}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="lastmaintain"
      sortable
      label="上次保养时间"
      align="center"
      width="150">
    </el-table-column>
    <el-table-column
      prop="lastrepair"
      sortable
      label="上次维修时间"
      align="center"
      width="150">
    </el-table-column>
    <el-table-column
      sortable
      label="总计维修次数"
      align="center"
      width="120">
      <template slot-scope="scope">
        <span>{{scope.row.repairtime}}次</span>
      </template>
    </el-table-column>
    <el-table-column
      label="状态"
      align="center"
      width="100">
      <template slot-scope="scope">
        <i class="el-icon-circle-check" style="color: #67C23A;" v-if="scope.row.status===1"/>
        <span style="color: #67C23A;" v-if="scope.row.status===1">
          {{equipmentStatus[scope.row.status - 1].name}}
        </span>
        <i class="el-icon-warning-outline" style="color: #E6A23C;" v-if="scope.row.status===2"/>
        <span style="color: #E6A23C;" v-if="scope.row.status===2">
          {{equipmentStatus[scope.row.status - 1].name}}
        </span>
        <i class="el-icon-warning-outline" style="color: #E6A23C;" v-if="scope.row.status===3"/>
        <span style="color: #E6A23C;" v-if="scope.row.status===3">
          {{equipmentStatus[scope.row.status - 1].name}}
        </span>
        <i class="el-icon-warning-outline" style="color: #E6A23C;" v-if="scope.row.status===4"/>
        <span style="color: #E6A23C;" v-if="scope.row.status===4">
          {{equipmentStatus[scope.row.status - 1].name}}
        </span>
        <i class="el-icon-circle-close" style="color: #F56C6C;" v-if="scope.row.status===5"/>
        <span style="color: #F56C6C;" v-if="scope.row.status===5">
          {{equipmentStatus[scope.row.status - 1].name}}
        </span>
      </template>
    </el-table-column>
    <el-table-column
      label="设备描述"
      width="200"
      align="center">
      <template slot-scope="scope">
        <el-popover
          placement="top"
          width="250"
          trigger="hover">
          <div>
            <span>{{scope.row.description}}</span>
          </div>
          <div slot="reference">
            <span>{{scope.row.description}}</span>
          </div>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="350">
      <template slot-scope="scope">
        <el-button type="text" size="small"
          @click='handleEditName(scope.row)'>编辑名称</el-button>

        <el-button type="text" size="small" v-if="scope.row.status!==2 && scope.row.status!==5"
          @click='handleRest(scope.row.id)' style="color: #E6A23C;">休整</el-button>

        <el-button type="text" size="small" v-if="scope.row.status===1 || scope.row.status===2"
          @click='handleMaintain(scope.row.id)' style="color: #E6A23C;">保养</el-button>

        <el-button type="text" size="small"
          v-if="scope.row.status===2 || scope.row.status===3 || scope.row.status===4"
          @click='handleRecover(scope.row.id)' style="color: #67C23A;">恢复生产</el-button>

        <el-button type="text" size="small" v-if="scope.row.status===5"
          @click='handleRepair(scope.row.id)' style="color: #E6A23C;">维修</el-button>

        <el-button type="text" size="small" style="color: #F56C6C;"
          v-if="scope.row.status!==4 && scope.row.status!==5"
          @click='handleStop(scope.row.id)'>发生故障</el-button>

        <el-button type="text" size="small" style="color: #F56C6C;" v-if="scope.row.status===2"
          @click='handleDelete(scope.row.id)'>删除设备</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog
    :modal="false"
    title="编辑设备名称"
    :visible.sync="editEquipmentNameVisible"
    width="30%">
    <el-row>
      <div class='newstaiontip'>设备编号：</div>
      <div class='newstaioninput'>
        <span>{{currentEquipment.id}}</span>
      </div>
    </el-row>
    <el-row>
      <div class='newstaiontip'>设备名称：</div>
      <div class='newstaioninput'>
        <el-input v-model="currentEquipment.name"></el-input>
      </div>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="editEquipmentNameVisible = false">取 消</el-button>
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
import equipmentstatus from '../../../config_new/equipmentstatus.js'
import equipmentData from '../../../config_new/testequipments.js'

export default {
  name: 'Equipments',
  data () {
    return {
      dataLoading: false,
      allData: {
        all: 207,
        producing: 180,
        resting: 14,
        maintain: 4,
        repairing: 6,
        broken: 3
      },
      searchEquipmentOverall: {
        id: '',
        name: '',
        status: '',
        stationid: '',
        stationname: ''
      },
      equipmentStatus: equipmentstatus,
      equipmentData: equipmentData,
      newEquipmentVisible: false,
      editEquipmentNameVisible: false,
      newEquipment: {
        name: '',
        stationname: ''
      },
      currentEquipment: {
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
      console.log(this.searchEquipmentOverall)
    },
    handleNewEquipment () {
      this.newEquipmentVisible = true
    },
    handleNewEquipmentSubmit () {
      console.log(this.newEquipment)
      this.newEquipmentVisible = false
    },
    handleEditName (row) {
      this.editEquipmentNameVisible = true
      this.currentEquipment = {
        id: row.id,
        name: row.name
      }
    },
    handleModifySubmit () {
      console.log(this.currentEquipment)
      this.editEquipmentNameVisible = false
    },
    handleMaintain (id) {
      console.log('Maintain ' + id)
    },
    handleRest (id) {
      console.log('Rest ' + id)
    },
    handleRecover (id) {
      console.log('Recover ' + id)
    },
    handleDelete (id) {
      console.log('Delete ' + id)
    },
    handleRepair (id) {
      console.log('Repair ' + id)
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
      return this.searchEquipmentOverall.id === '' &&
        this.searchEquipmentOverall.name === '' &&
        this.searchEquipmentOverall.status === '' &&
        this.searchEquipmentOverall.stationid === '' &&
        this.searchEquipmentOverall.stationname === ''
    },
    modifyDisabled () {
      return this.currentEquipment.name === ''
    },
    newEquipmentDisabled () {
      return this.newEquipment.name === '' &&
        this.newEquipment.stationname === ''
    }
  }
}
</script>

<style>
.equipment_overall_class {
  margin-bottom: 20px;
}
.search_equipment_overall_part {
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);}
.searchequipmentoveralltip {
  width: 10%;
  margin-left: 5px;
  margin-top: 10px;
  margin-bottom: 20px;
  color: #606266;
  text-align: right;
  display: inline-block;
  white-space:nowrap;
}
.searchequipmentoverallinput {
  width: 15%;
  display: inline-block;
  white-space:nowrap;
}
.pagination_class {
  margin: 40px;
  text-align: center;
}
.new_equipment_class {
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
