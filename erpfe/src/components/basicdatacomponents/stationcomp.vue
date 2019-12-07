<template>
<div>
  <div class="search_station_part">
    <el-row>
      <span class="searchstationtip">工位编号：</span>
      <el-input placeholder="请输入工位编号"
        class='searchstationinput'
        v-model="searchId"
        clearable/>
      <span class="searchstationtip">工位名称：</span>
      <el-input placeholder="请输入工位名称"
        class='searchstationinput'
        v-model="searchName"
        clearable/>
      <span class="searchstationtip">状态：</span>
      <el-select v-model="searchStatus" placeholder="请选择状态">
        <el-option :label="stationStatus[0].name" :value="stationStatus[0].id"></el-option>
        <el-option :label="stationStatus[1].name" :value="stationStatus[1].id"></el-option>
        <el-option :label="stationStatus[2].name" :value="stationStatus[2].id"></el-option>
      </el-select>
      <el-button icon="el-icon-search"
        :disabled='searchDisabled'
        style="margin-left: 40px;"
        type="primary" @click='handleSearch'>搜 索</el-button>
    </el-row>
  </div>
  <div class="new_station_class">
    <el-button icon="el-icon-edit"
      type="primary" @click='handleNewStation'>
        增加新工位
    </el-button>
  </div>
  <el-table
    class="station_table_class"
    :data="stationsData"
    :default-sort = "{prop: 'id', order: 'descending'}"
    stripe
    style="width: 100%">
    <el-table-column
      fixed="left"
      prop="id"
      sortable
      label="工位编号"
      width="120">
    </el-table-column>
    <el-table-column
      prop="name"
      sortable
      label="工位名称"
      width="120">
    </el-table-column>
    <el-table-column
      prop="equipment"
      sortable
      label="工位设备编号"
      width="150">
    </el-table-column>
    <el-table-column
      width="180"
      sortable
      label="状态">
      <template slot-scope="scope">
        <span>{{stationStatus[scope.row.status-1].name}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="description"
      width="450"
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
          v-if="scope.row.status !== '1'"
          @click='handleStart(scope.row.id)'>启用</el-button>
        <el-button type="text" size="small"
          v-if="scope.row.status !== '2'"
          @click='handleMaintain(scope.row.id)'>维护</el-button>
        <el-button type="text" size="small"
          v-if="scope.row.status !== '3'"
          @click='handleStop(scope.row.id)'>暂时停用</el-button>
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
    :total="stationsNumber">
  </el-pagination>
  <el-dialog
    class="new_station_dialog_class"
    :modal="false"
    title="增加新工位"
    :visible.sync="newStationDialogVisible"
    width="30%">
      <el-row>
        <div class='tip'>名称：</div>
        <div class='input'>
          <el-input placeholder="请输入工位名称"
                  v-model="newStation.name"
                  clearable/>
        </div>
      </el-row>
      <el-row>
        <div class='tip'>状态：</div>
        <div class='input'>
          <el-select v-model="newStation.status" placeholder="请选择状态">
            <el-option :label="stationStatus[0].name" :value="stationStatus[0].id"></el-option>
            <el-option :label="stationStatus[1].name" :value="stationStatus[1].id"></el-option>
            <el-option :label="stationStatus[2].name" :value="stationStatus[2].id"></el-option>
          </el-select>
        </div>
      </el-row>
      <el-row>
        <div class='tip'>设备：</div>
        <div class='input'>
          <el-input placeholder="请输入工位设备编号"
                  v-model="newStation.equipment"
                  clearable/>
        </div>
      </el-row>
      <el-row>
        <div class='tip'>描述：</div>
        <div class='input'>
          <el-input placeholder="请输入工位详细描述"
                  type="textarea"
                  v-model="newStation.description"
                  clearable/>
        </div>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newStationDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleNewStationSubmit">新 建</el-button>
      </span>
  </el-dialog>
  <el-dialog
    class="modify_station_dialog_class"
    :modal="false"
    title="修改工位"
    :visible.sync="modifyStationDialogVisible"
    width="30%">
     <el-row>
        <div class='tip'>工位编号：</div>
        <div class='input'>
          {{currentStation.id}}
        </div>
      </el-row>
      <el-row>
        <div class='tip'>工位名称：</div>
        <div class='input'>
          <el-input placeholder="请输入工位名称"
                  v-model="currentStation.name"
                  clearable/>
        </div>
      </el-row>
      <el-row>
        <div class='tip'>状态：</div>
        <div class='input'>
          <el-select v-model="currentStation.status" placeholder="请选择状态">
            <el-option :label="stationStatus[0].name" :value="stationStatus[0].id"></el-option>
            <el-option :label="stationStatus[1].name" :value="stationStatus[1].id"></el-option>
            <el-option :label="stationStatus[2].name" :value="stationStatus[2].id"></el-option>
          </el-select>
        </div>
      </el-row>
      <el-row>
        <div class='tip'>设备：</div>
        <div class='input'>
          <el-input placeholder="请输入工位设备编号"
                  v-model="currentStation.equipment"
                  clearable/>
        </div>
      </el-row>
      <el-row>
        <div class='tip'>描述：</div>
        <div class='input'>
          <el-input placeholder="请输入工位详细描述"
                  type="textarea"
                  v-model="currentStation.description"
                  clearable/>
        </div>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyStationDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleModifySubmit">修 改</el-button>
      </span>
  </el-dialog>
</div>
</template>

<script>
import teststation from '../../config/teststation.js'
import stationstatus from '../../config/stationstatus.js'

export default {
  name: 'StationComp',
  data () {
    return {
      searchId: '',
      searchName: '',
      searchStatus: '',
      currentPage: 1,
      stationStatus: stationstatus,
      stationsData: teststation,
      stationsNumber: 20,
      newStationDialogVisible: false,
      modifyStationDialogVisible: false,
      newStation: {
        name: '',
        status: '',
        equipment: '',
        description: ''
      },
      currentStation: {
        id: '',
        name: '',
        status: 1,
        equipment: '',
        description: ''
      }
    }
  },
  methods: {
    handleSearch () {
      console.log('Searching...' + this.searchId + this.searchName + this.searchStatus)
      // reload station data
    },
    handleNewStation () {
      this.newStationDialogVisible = true
      this.newStation = {
        name: '',
        status: '',
        description: ''
      }
    },
    handleMaintain (id) {
      console.log('Maintain ' + id)
    },
    handleEdit (row) {
      this.modifyStationDialogVisible = true
      this.currentStation.id = row.id
      this.currentStation.name = row.name
      this.currentStation.status = row.status
      this.currentStation.description = row.description
      // reload station data
    },
    handleModifySubmit () {
      console.log('Modify Station ' + this.currentStation.id + this.currentStation.name + this.currentStation.status + this.currentStation.description)
      this.modifyStationDialogVisible = false
    },
    handleStart (id) {
      console.log('Start' + id)
      // reload station data
    },
    handleStop (id) {
      console.log('Stop' + id)
      // reload station data
    },
    handlePagination () {
      console.log('Page to ' + this.currentPage)
      // reload station data
    },
    handleNewStationSubmit () {
      console.log('New Station ' + this.newStation.name + this.newStation.status + this.newStation.description)
      this.newStationDialogVisible = false
      // reload station data
    }
  },
  computed: {
    searchDisabled () {
      return this.searchId === '' &&
        this.searchName === '' &&
        this.searchStatus === ''
    }
  }
}
</script>

<style>
.search_station_part {
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.searchstationtip {
  width: 7%;
  margin-left: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  color: #606266;
  text-align: center;
  display: inline-block;
}
.searchstationinput {
  width: 20%;
  margin-right: 20px;
  display: inline-block;
}
.new_station_class {
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.station_table_class {
  padding-left: 20px;
  padding-right: 20px;
}
.pagination_class {
  margin: 40px;
  text-align: center;
}
.tip {
  display: inline-block;
  width: 20%;
  text-align: center;
  vertical-align: center;
  margin-top: 10px;
}
.input {
  display: inline-block;
  width: 79%;
  margin-top: 10px;
}
</style>
