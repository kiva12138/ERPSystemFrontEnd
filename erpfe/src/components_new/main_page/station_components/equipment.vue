<template>
<div>
  <SelectStation/>
  <div style="text-align: center;">
    <div v-if="selectStationId===''"
      style="color: #606266; text-align: center; font-size: 200%; padding-top: 20%;">
      请首先选择工位。
    </div>
    <div v-else>
      <el-table
        size="small"
        :data="testStationEquipment"
        :default-sort = "{prop: 'id', order: 'descending'}"
        stripe
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
          <div class='editequipmenttip'>设备编号：</div>
          <div class='editequipmentinput'>
            <span>{{currentEquipment.id}}</span>
          </div>
        </el-row>
        <el-row>
          <div class='editequipmenttip'>设备名称：</div>
          <div class='editequipmentinput'>
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
  </div>
</div>
</template>

<script>
import selectstation from './select_components/selectstation.vue'
import teststationequipment from '../../../config_new/teststationequipment.js'
import equipmentstatus from '../../../config_new/equipmentstatus.js'

export default {
  name: 'Equipment',
  data () {
    return {
      selectStationId: '',
      testStationEquipment: '',
      editEquipmentNameVisible: false,
      equipmentStatus: equipmentstatus,
      pagination: {
        pageSize: 10,
        total: 3,
        currentPage: 1
      },
      currentEquipment: {
        id: '',
        name: ''
      }
    }
  },
  methods: {
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
  components: {
    'SelectStation': selectstation
  },
  mounted () {
    if (this.$cookies.isKey('selectStationId')) {
      this.selectStationId = this.$cookies.get('selectStationId')
      this.testStationEquipment = teststationequipment
      this.pagination.total = this.testStationEquipment.length
    }
  },
  computed: {
    modifyDisabled () {
      return this.currentEquipment.name === ''
    }
  }
}
</script>

<style>
.editequipmenttip {
  display: inline-block;
  width: 25%;
  text-align: right;
  vertical-align: center;
  margin-top: 10px;
  white-space:nowrap;
}
.editequipmentinput {
  display: inline-block;
  width: 70%;
  margin-top: 20px;
}
</style>
