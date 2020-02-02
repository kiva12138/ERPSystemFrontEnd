<template>
<div class="nar_body">
  <navhead class="nav_head"/>
  <el-menu class="nav_el_menu"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    @select="handleSelect">
    <div v-for="(navitem, index) in navItems"
      v-bind:key='index + "" '>
      <el-submenu
        :index='index+""'
        :disabled='menuDisabled'
        v-if="navitem.submenu.length!==0">
        <template slot="title">
          <i class="el-icon-s-operation"></i>
          <span>{{navitem.name}}</span>
        </template>
        <el-menu-item
          class="nav_el_sub_menu_item"
          v-for="(navsubitem, indexsub) in navitem.submenu"
          :index="index+'-'+indexsub"
          v-bind:key='indexsub'>
            {{navsubitem.name}}
        </el-menu-item>
      </el-submenu>
      <el-menu-item :index='index+""'
        :disabled='menuDisabled'
        v-else >
        <template slot="title">
          <i class="el-icon-s-operation"></i>
          <span>{{navitem.name}}</span>
        </template>
      </el-menu-item>
    </div>
  </el-menu>
  <div class="search_part">
    <el-button type="info" @click="preFind" :disabled="quickFindDisable">快速查找物料与工位</el-button>
  </div>

  <el-drawer
    title="快速查找物料与工位"
    :visible.sync="findVisible"
    direction="ltr"
    custom-class="findquick-drawer"
    ref="drawer"
    >
    <div class="findquick-drawer__content">
      <el-row>
        <div class='findquicktip'>{{searchItems[currentSearch]}}名称：</div>
        <div class='findquickinput'>
          <el-input placeholder="请输入名称" v-model="searchName" clearable/>
        </div>
      </el-row>

      <el-row style="text-align: center;">
        <el-switch
          style="margin: 10px;"
          v-model="buttonValue"
          active-text="查找工位"
          inactive-text="查找物料">
        </el-switch>
        <el-button icon="el-icon-edit"
          style="margin: 10px;"
          :disabled="searchDisable"
          type="primary" @click='handleSearch'>
            搜 索
        </el-button>
      </el-row>

      <el-row style="text-align: center;">
      </el-row>

      <el-table
        class="quick_find_table_class"
        :data="testData"
        size="small"
        :default-sort = "{prop: 'id', order: 'descending'}"
        stripe
        v-loading="dataLoading"
        style="width: 100%;">
        <el-table-column
          fixed="left"
          prop="id"
          sortable
          label="编号"
          align="center"
          width="200">
        </el-table-column>
        <el-table-column
          prop="name"
          sortable
          label="名称"
          align="center"
          width="200">
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
  </el-drawer>
</div>
</template>

<script>

import navhead from './navhead.vue'
import menuData from '../../config_new/menu.js'
// import testtransport from '@/config_new/testtransport.js'

export default {
  name: 'NavBar',
  data () {
    return {
      navItems: menuData,
      menuDisabled: true,

      findVisible: false,
      searchItems: ['物料', '工位'],
      searchName: '',
      buttonValue: true,

      testData: [],
      dataLoading: false,
      pagination: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      }
    }
  },
  components: {
    'navhead': navhead
  },
  methods: {
    handleSelect (key, keyPath) {
      let paths = keyPath[keyPath.length - 1].split('-')
      let path = this.navItems[paths[0]].url
      if (this.navItems[paths[0]].submenu.length !== 0) {
        path += ('/' + this.navItems[paths[0]].submenu[paths[1]].url)
      }
      this.$router.push({
        'path': path
      })
      this.$cookies.set('path1', paths[0], {expires: '24h'})
      this.$cookies.set('path2', paths[1], {expires: '24h'})
    },
    preFind () {
      this.findVisible = true
    },
    handleSearch () {
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
      if (this.buttonValue) {
        this.$axios({
          method: 'get',
          url: this.GLOBAL.backEndIp + '/api/station/find',
          params: {
            id: 0,
            name: this.searchName,
            status: 0,
            page: this.pagination.currentPage - 1,
            size: this.pagination.pageSize
          }
        }).then(response => {
          if (response.data.code === 1) {
            this.testData = response.data.data
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
      } else {
        this.$axios({
          method: 'get',
          url: this.GLOBAL.backEndIp + '/api/material/getcategory',
          params: {
            id: 0,
            name: this.searchName,
            status: 0,
            kind: 0,
            page: this.pagination.currentPage - 1,
            size: this.pagination.pageSize
          }
        }).then(response => {
          if (response.data.code === 1) {
            this.testData = response.data.materials
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
    }
  },
  mounted () {
    this.menuDisabled = !this.$cookies.isKey('login')
  },
  computed: {
    currentSearch () {
      if (this.buttonValue) {
        return 1
      } else {
        return 0
      }
    },
    quickFindDisable () {
      return !this.$cookies.isKey('login')
    },
    searchDisable () {
      return this.searchName === ''
    }
  }
}
</script>

<style>
.nav_head {
margin: 5px;
}
.nav_el_menu {
margin-right: -1px;
}
.nav_el_sub_menu_item {
margin-left: 30px;
}
.nar_body {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}
.search_part {
  flex: 1;
  margin-top: 30px;
  margin-bottom: 30px;
  min-height: 50%;
  color: #EBEEF5;
  text-align: center;
}

.findquicktip {
  display: inline-block;
  width: 25%;
  text-align: right;
  vertical-align: center;
  margin-top: 10px;
  white-space:nowrap;
}
.findquickinput {
  display: inline-block;
  width: 70%;
  margin-top: 10px;
  white-space:nowrap;
}
.findquick-drawer__content {
  text-align: center;
}
.quick_find_table_class {
  text-align: center;
  margin-left: 20px;
  margin-right: 20px;
}
</style>
