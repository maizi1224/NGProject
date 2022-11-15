<template>
  <div class="app-container">
    <!--
       头部查询
    -->
    <el-form
      ref="queryForm"
      :model="queryForm"
      label-width="100px"
      :inline="true"
      border
    >
      <el-form-item
        :label="
          BusinessLanguage.GetMenuName(
            BusinessLanguage.AssetMent.Placeholder.AssetCode
          )
        "
        prop="assetsCode"
      >
        <el-input
          v-model="queryForm.assetsCode"
          :placeholder="
            BusinessLanguage.GetMenuName(
              BusinessLanguage.AssetMent.Placeholder.Search
            )
          "
          prefix-icon="el-icon-search"
          clearable
          @keyup.enter.native="searchData"
        />
      </el-form-item>
      <el-form-item
        :label="
          BusinessLanguage.GetMenuName(
            BusinessLanguage.AssetMent.Placeholder.Adress
          )
        "
        label-width="50px"
        prop="assetsAdress"
      >
        <el-input
          v-model="queryForm.assetsAdress"
          :placeholder="
            BusinessLanguage.GetMenuName(
              BusinessLanguage.AssetMent.Placeholder.Search
            )
          "
          prefix-icon="el-icon-search"
          clearable
          @keyup.enter.native="searchData"
        />
      </el-form-item>
      <el-form-item inline="true">
        <el-button
          v-if="ButtonPermission('Asset:qurey:list')"
          type="success"
          size="mini"
          icon="el-icon-search"
          plain
          @click="searchData"
        >{{
          BusinessLanguage.GetMenuName(BusinessLanguage.Common.Button.Search)
        }}
        </el-button>
        <el-button
          v-if="ButtonPermission('Asset:qurey:list')"
          type="warning"
          size="mini"
          icon="el-icon-refresh-left"
          plain
          @click="ResetQueryFrom"
        >{{
          BusinessLanguage.GetMenuName(BusinessLanguage.Common.Button.Reset)
        }}
        </el-button>

      </el-form-item>

    </el-form>
    <!--
      新增丶修改丶删除丶刷新 功能按钮
     -->
    <el-row style="margin-bottom: 5px">
      <el-col>
        <el-button
          v-if="ButtonPermission('job:add:entity')"
          :disabled="addDisabled"
          icon="el-icon-circle-plus-outline"
          plain
          size="mini"
          type="primary"
          @click="add"
        >
          {{ BusinessLanguage.GetMenuName(BusinessLanguage.Common.Button.Add) }}
        </el-button>
        <el-button
          v-if="ButtonPermission('job:edit:entity')"
          :disabled="editDisabled"
          icon="el-icon-edit"
          plain
          size="mini"
          type="success"
          @click="edit"
        >
          {{
            BusinessLanguage.GetMenuName(BusinessLanguage.Common.Button.Edit)
          }}
        </el-button>
        <el-button
          v-if="ButtonPermission('job:del:entity')"
          :disabled="editDisabled"
          icon="el-icon-circle-close"
          plain
          size="mini"
          type="danger"
          @click="Delete"
        >{{
          BusinessLanguage.GetMenuName(BusinessLanguage.Common.Button.Delete)
        }}
        </el-button>
        <el-button
          v-if="ButtonPermission('schedule:job:resume')"
          type="success"
          :disabled="editDisabled"
          icon="el-icon-refresh-left"
          plain
          size="mini"
          @click="resume"
        >
          {{
            BusinessLanguage.GetMenuName(
              BusinessLanguage.AssetMent.Placeholder.Refresh
            )
          }}
        </el-button>
      </el-col>
    </el-row>

    <!--
      显示内容的table
     -->
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      align="center"
      stripe
      row-key="id"
      border
      :header-cell-style="{ textAlign: 'center' }"
      @selection-change="HandleSelectionChange"
    >
      <el-table-column align="center" type="selection" />
      <el-table-column
        prop="id"
        align="center"
        :label="
          BusinessLanguage.GetMenuName(BusinessLanguage.AssetMent.Grid.AssetsCode)
        "
      />
      <el-table-column
        prop="assetsTypeId"
        align="center"
        :label="
          BusinessLanguage.GetMenuName(
            BusinessLanguage.AssetMent.Grid.AssetsType
          )
        "
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.assetsTypeId === 0">
            租赁型住宅
          </el-tag>
          <el-tag v-else-if="scope.assetsTypeId === 1">
            租赁型门面房
          </el-tag>
          <el-tag v-else-if="scope.assetsTypeId === 2">
            土地
          </el-tag>
          <el-tag v-else-if="scope.assetsTypeId === 3">
            经营性用房
          </el-tag>
          <el-tag v-else-if="scope.assetsTypeId === 4">
            商服用房
          </el-tag>
          <el-tag v-else-if="scope.assetsTypeId === 5">
            工厂用房
          </el-tag>
          <el-tag v-else>
            沿街商铺
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="assetsState"
        align="center"
        :label="
          BusinessLanguage.GetMenuName(
            BusinessLanguage.AssetMent.Grid.AssetsState
          )
        "
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.assetsState === 0">
            闲置中
          </el-tag>
          <el-tag v-else>
            出租
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="assetsArea"
        align="center"
        :label="
          BusinessLanguage.GetMenuName(
            BusinessLanguage.AssetMent.Grid.AssetsArea
          )
        "
      />
      <el-table-column
        prop="assetsAdress"
        align="center"
        :label="
          BusinessLanguage.GetMenuName(
            BusinessLanguage.AssetMent.Grid.AssetsAdress
          )
        "
      />
      <el-table-column
        prop="currentcontract.lessee"
        align="center"
        :label="
          BusinessLanguage.GetMenuName(
            BusinessLanguage.AssetMent.Grid.lessee
          )
        "
      />
      <el-table-column
        prop="currentcontract.lesseePhone"
        align="center"
        :label="
          BusinessLanguage.GetMenuName(
            BusinessLanguage.AssetMent.Grid.lesseePhone
          )
        "
      />
      <el-table-column
        prop="currentcontract.contracStartDate"
        align="center"
        :formatter="formatterDate"
        :label="
          BusinessLanguage.GetMenuName(
            BusinessLanguage.AssetMent.Grid.ContracStartDate
          )
        "
      />
      <el-table-column
        prop="currentcontract.contractEndDate"
        align="center"
        :formatter="formatterDate"
        :label="
          BusinessLanguage.GetMenuName(
            BusinessLanguage.AssetMent.Grid.ContractEndDate
          )
        "
      />
      <el-table-column
        prop="currentcontract.contractPrice"
        align="center"
        :label="
          BusinessLanguage.GetMenuName(
            BusinessLanguage.AssetMent.Grid.ContractPrice
          )
        "
      />
      <el-table-column
        prop="currentcontract.contractMoney"
        align="center"
        :label="
          BusinessLanguage.GetMenuName(
            BusinessLanguage.AssetMent.Grid.ContractMoney
          )
        "
      />
      <el-table-column
        prop="assetUseType"
        align="center"
        :label="
          BusinessLanguage.GetMenuName(
            BusinessLanguage.AssetMent.Grid.AssetUseType
          )
        "
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.assetUseType === 0">
            移交
          </el-tag>
          <el-tag v-else-if="scope.assetUseType === 1">
            拆迁
          </el-tag>
          <el-tag v-else-if="scope.assetUseType === 2">
            出借
          </el-tag>
          <el-tag v-else-if="scope.assetUseType === 3" type="danger">
            停用
          </el-tag>
          <el-tag v-else type="success">
            正常管理

          </el-tag>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        :current-page="queryCondition.PageIndex"
        :page-sizes="[10, 15, 20, 40, 60, 80, 100]"
        :page-size="queryCondition.PageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="queryCondition.TotalCount"
        @size-change="HandleSizeChange"
        @current-change="HandleCurrentChange"
      />
    </div>
    <el-drawer ref="drawer" title="新增资产" :visible.sync="dialogFormVisible" direction="ttb" :before-close="handleClose" size="100%" class="Maindrawer">

      <el-card class="box-card">

        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-width="auto"
          label-position="left"
          size="small"
          class="overflowauto"
        >
          <el-row>
            <el-col :span="24">
              <el-divider content-position="center">资产基本信息</el-divider>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item
                label="资产编号"
                label-width="auto"
                prop="id"
              >
                <el-input
                  v-model="form.id"
                  prefix-icon="el-icon-search"
                  :disabled="true"
                  class="colWidth"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="档案编号"
                prop="assetsCode"
              >
                <el-input
                  v-model="form.assetsCode"
                  prefix-icon="el-icon-search"
                  placeholder="请输入档案编号"
                  class="colWidth"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="资产取得时间"
                prop="assetsGetDate"
              >
                <el-date-picker
                  v-model="form.assetsGetDate"
                  type="date"
                  placeholder="请输入资产取得时间"
                  :picker-options="pickerOptions"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item
                label="资产类型"
                prop="assetsTypeId"
              >
                <el-select v-model="form.assetsTypeId" class="colWidth" placeholder="请选择资产类型">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="资产来源"
                prop="assetsSourceId"
              >
                <el-select v-model="form.assetsSourceId" class="colWidth" placeholder="请选择资产来源">
                  <el-option
                    v-for="item in options2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="资产状态"
                prop="assetsState"
              >
                <el-select v-model="form.assetsState" class="colWidth2" placeholder="请选择资产状态">
                  <el-option
                    v-for="item in options3"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>

            <el-col :span="8">
              <el-form-item
                label="产权人"
                prop="propertyOwner"
              >
                <el-select v-model="form.propertyOwner" class="colWidth">
                  <el-option
                    v-for="item in options4"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="处置方式"
                prop="assetsSourceId"
              >
                <el-select v-model="form.assetUseType" class="colWidth" placeholder="请选择资产来源">
                  <el-option
                    v-for="item in options6"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="地图标注"
                prop="mapInfo"
              >
                <el-input
                  v-model="form.mapInfo"
                  prefix-icon="el-icon-search"
                  placeholder="请输入地图标注"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="资产地址" prop="assetsAdress">
                <el-input v-model="form.assetsAdress" type="textarea" prefix-icon="el-icon-search" placeholder="请输入资产地址" />
              </el-form-item>
            </el-col>

          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item
                label="资产用途描述"
                prop="assetsFor"
              >
                <el-input
                  v-model="form.assetsFor"
                  type="textarea"
                  class="colWidth2"
                  placeholder="请输入资产用途描述"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item
                label="相关资料附件"
                prop="assetsFor"
              >
                <el-upload
                  class="upload-demo"
                  :action="importUrl0"
                  :headers="headers"
                  :before-remove="beforeRemove"
                  multiple
                  :limit="limit"
                  :on-exceed="handleExceed"
                  :on-success="handleSuccess"
                  :before-upload="beforeUpload"
                  :file-list="form.assetsFileGroupFiles"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-divider content-position="center">产权信息</el-divider>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="房产证号" prop="assetsGetDate">
                <el-input v-model="form.propertyCode" placeholder="请输入房产证号" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="土地证号" prop="assetsCode">
                <el-input v-model="form.landCode" placeholder="请输入土地证号" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="不动产权号" prop="assetsCode">
                <el-input v-model="form.landPropertyInfo" placeholder="请输入不动产权号" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item
                label="产权资料附件"
              >
                <el-upload
                  class="upload-demo"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :before-remove="beforeRemove"
                  multiple
                  :limit="5"
                  :on-exceed="handleExceed"
                  :before-upload="beforeUpload"
                  :file-list="form.propertyFileGroupFiles"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-divider content-position="center">资产评估信息</el-divider>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item
                label="评估基准日期"
              >
                <el-date-picker
                  v-model="form.assetsMent.buildDate"
                  type="date"
                  placeholder="请输入评估基准日期"
                  :picker-options="pickerOptions"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="评估面积"
              >
                <el-input v-model="form.assetsMent.assessArea" placeholder="评估面积"><template slot="append">m²</template></el-input>

              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="评估价值"
              >
                <el-input v-model="form.assetsMent.assetPriceOneYear" placeholder="评估租赁价值"><template slot="append">元/年</template></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-divider content-position="center">最近合同信息</el-divider>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item label="合同编号" prop="assetsGetDate">
                <el-input v-model="form.contractinfo.contractCode" placeholder="请输入合同编号" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="合同类型"
                prop="assetsState"
              >
                <el-select v-model="form.contractinfo.contractType" class="colWidth2" placeholder="请选择合同类型">
                  <el-option
                    v-for="item in options5"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item label="承租人" prop="assetsGetDate">
                <el-input v-model="form.contractinfo.lessee" placeholder="承租人(单位)" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系电话" prop="assetsGetDate">
                <el-input v-model="form.contractinfo.lesseePhone" placeholder="" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item
                label="承租起始日期"
                prop="assetsGetDate"
              >
                <el-date-picker
                  v-model="form.contractinfo.contracStartDate"
                  type="date"
                  placeholder=""
                  :picker-options="pickerOptions"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="终止日期"
                prop="assetsGetDate"
              >
                <el-date-picker
                  v-model="form.contractinfo.contractEndDate"
                  type="date"
                  placeholder=""
                  :picker-options="pickerOptions"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="总租期" prop="assetsGetDate">
                <el-input v-model="form.contractinfo.contractLife" placeholder="">
                  <template slot="append">年</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="保证金" prop="assetsGetDate">
                <el-input v-model="form.contractinfo.contractPrice" placeholder="">
                  <template slot="append">元/年</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="年租金" prop="assetsGetDate">
                <el-input v-model="form.contractinfo.contractPromiseMoney" placeholder="">
                  <template slot="append">元/年</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="合同总金额" prop="assetsGetDate">
                <el-input v-model="form.contractinfo.contractMoney" placeholder="">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>

      </el-card>
      <div class="demo-drawer__footer">
        <el-button @click="cancelForm">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="SubmitForm">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import RuYiAdminBasePage from '@/components/BasePage/RuYiAdminBasePage'
import { generateQueryItem } from '@/utils/query-item'

export default {
  name: 'AssetMent',
  extends: RuYiAdminBasePage,
  data() {
    return {
      limit: 5,
      headers: null,
      importUrl0: process.env.VUE_APP_BASE_API + '/Files/UploadFiles?businessId=0',
      importUrl1: process.env.VUE_APP_BASE_API + '/Files/UploadFiles?businessId=1',
      timer: null,
      loading: false,
      restaurants: [],
      fileList: [],
      queryForm: {
        AssetCode: null,
        assetsAdress: null

      },
      form: {
        id: '',
        assetsCode: '',
        assetsGetDate: null,
        assetsTypeId: -1,
        assetsSourceId: -1,
        assetsState: 0,
        assetsAdress: '',
        propertyOwner: '',
        assetsFor: '',
        assetsFileGroupId: '',
        assetsFileGroupFiles: [],
        assetsMent: {
          buildDate: null,
          assessArea: null,
          assetPriceOneYear: null
        },
        propertyCode: '',
        landCode: null,
        landPropertyInfo: null,
        propertyFileGroupId: '',
        propertyFileGroupFiles: [],
        contractinfo: {
          contractCode: '',
          contractType: -1,
          lessee: '',
          lesseePhone: '',
          contracStartDate: null,
          contractEndDate: null,
          contractLife: null,
          contractPrice: null,
          contractPromiseMoney: null,
          contractMoney: null
        },
        assetUseType: -1
      },
      rules: {
        AssetCode: [
          {
            required: true,
            message: this.BusinessLanguage.GetMenuName(
              this.BusinessLanguage.AssetMent.Placeholder.AssetMentCode
            ),
            trigger: 'blur'
          },
          {
            min: 0,
            max: 255,
            message: this.BusinessLanguage.GetMenuName(
              this.BusinessLanguage.ScheduleJob.Form.Rule.MinLength255
            ),
            trigger: 'blur'
          }
        ]

      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }]
      },
      options: [{
        value: -1,
        label: ' '
      }, {
        value: 0,
        label: '租赁型住宅'
      }, {
        value: 1,
        label: '租赁型门面房'
      }, {
        value: 2,
        label: '土地'
      }, {
        value: 3,
        label: '经营性用房'
      },
      {
        value: 4,
        label: '商服用房'
      },
      {
        value: 5,
        label: '工厂用房'
      }, {
        value: 6,
        label: '沿街商铺'
      }],
      options2: [
        {
          value: -1,
          label: ' '
        },
        {
          value: 0,
          label: '代管'

        },
        {
          value: 1,
          label: '自购'

        }
      ],
      options3: [
        {
          value: 0,
          label: '闲置中'

        },
        {
          value: 1,
          label: '出租中'

        }
      ],
      options4: [
        { 'value': '宁国市燕津投资管理有限公司' },
        { 'value': '宁国市国有资产投资运营公司' },
        { 'value': '宁国市新城镇化建设有限公司' }
      ],
      options5: [
        {
          value: -1,
          label: ' '
        },
        {
          value: 0,
          label: '公开租拍合同'
        },
        {
          value: 1,
          label: '协议租赁合同'
        },
        {
          value: 3,
          label: '出借协议'
        }
      ],
      options6: [
        {
          value: -1,
          label: ' '
        },
        {
          value: 0,
          label: '移交'
        },
        {
          value: 1,
          label: '拆迁'
        },
        {
          value: 2,
          label: '出借'
        },
        {
          value: 3,
          label: '停用'
        },
        {
          value: 4,
          label: '正常管理'
        }

      ]
    }
  },
  watch: {},
  created() {
    // window.addEventListener('storage', this.afterQRScan)
    this.url.queryList = 'Asset/Post'
    this.url.queryEntity = 'ScheduleJobManagement/GetById/'
    this.url.addEntity = 'Asset/Add'
    this.url.editEntity = 'ScheduleJobManagement/Put'
    this.url.deleteEntity = 'ScheduleJobManagement/Delete/'
    this.queryCondition.Sort = 'Id ASC'
    this.refreshLocalToken()
  },
  mounted() {

  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    SubmitForm: function() {
      this.$refs.drawer.closeDrawer()
      if (this.form.id === '') {
        this.AddEntity(this.form).then(response => {
          this.$message({
            showClose: true,
            message: '资产档案新建成功',
            type: 'success'
          })
          this.loading = false
          this.dialogFormVisible = false
          this.InitData()
        })
      } else {
        this.EditEntity(this.form).then(response => {
          this.$message({
            showClose: true,
            message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Common.Dialog.Message.Edit),
            type: 'success'
          })
          this.dialogFormVisible = false
          this.editDisabled = true
          this.delDisabled = true
          this.InitData()
        })
      }
    },
    refreshLocalToken: function() {
      this.RuYiAdmin.RefreshLocalToken()
      this.headers = {
        'Authorization': 'Bearer ' + sessionStorage.getItem('access-token'),
        'RefreshToken': sessionStorage.getItem('refresh-token'),
        'token': sessionStorage.getItem('EncryptUserToken'),
        'ts': sessionStorage.getItem('ts')
      }
    },
    handleSuccess: function(response, file, fileList) {
      this.refreshLocalToken()
      if (response.message === 'OK') {
        this.form.assetsFileGroupId = response.object[0].fileId
      }
    },
    beforeUpload: function(file) {
      this.refreshLocalToken()
      // 获取上传文件大小
      const imgSize = Number(file.size / 1024 / 1024)
      if (imgSize > 20) {
        this.$msgbox({ title: '', message: '文件大小不能超过20MB', type: 'warning' })
        return false
      }
      return true
    },
    cancelForm() {
      this.$confirm('是否在离开前保存资产信息?', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '保存',
        cancelButtonText: '放弃修改'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.loading = false
          this.dialogFormVisible = false
          clearTimeout(this.timer)
        })
        .catch(action => {
          this.$message({
            type: 'info',
            message: action === 'cancel'
              ? '放弃保存并离开页面'
              : '停留在当前页面'
          })
          this.loading = false
          this.dialogFormVisible = false
          clearTimeout(this.timer)
        })
    },
    handleClose(done) {
      if (this.loading) {
        return
      }
      this.loading = true
      this.timer = setTimeout(() => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        // 动画关闭需要一定的时间
        setTimeout(() => {
          this.loading = false
          this.dialogFormVisible = false
          clearTimeout(this.timer)
        }, 400)
      }, 2000)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    querySearch(queryString, cb) {
      var results = queryString ? this.options4.filter(this.createFilter(queryString)) : this.options4
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    searchData: function() {
      this.queryCondition.PageIndex = 0
      this.queryCondition.QueryItems = []
      if (this.queryForm.assetsCode) {
        this.queryCondition.QueryItems.push(
          generateQueryItem(
            'assetsCode',
            this.DataType.String,
            this.QueryMethod.Like,
            this.queryForm.assetsCode
          )
        )
      }
      if (this.queryForm.assetsAdress) {
        this.queryCondition.QueryItems.push(
          generateQueryItem(
            'assetsAdress',
            this.DataType.String,
            this.QueryMethod.Like,
            this.queryForm.assetsAdress
          )
        )
      }
      this.InitData()
    },
    formatterDate: function(row, column, cellValue, index) {
      const daterc = cellValue
      if (daterc != null && daterc !== '0001-01-01T00:00:00') {
        var date = new Date(daterc)
        var year = date.getFullYear()
        /* 在日期格式中，月份是从0开始，11结束，因此要加0
                     * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
                     * */
        var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
        var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        // var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
        // var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
        // var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
        // 拼接
        // return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
        return year + '-' + month + '-' + day
      }
    },
    add: function() {
      this.resetForm()
      this.title = '新增资产'
      this.dialogFormVisible = true
    },
    edit: function() {
      this.loading = true
      this.resetForm()
      this.GetEntity(this.multipleSelection[0].id).then((response) => {
        this.title = this.BusinessLanguage.GetMenuName(
          this.BusinessLanguage.ScheduleJob.DialogTitle.Edit
        )
        Object.assign(this.form, response.object)
        this.form.jobName = this.multipleSelection[0].jobName
        this.dialogFormVisible = true
        this.loading = false
      })
    },
    resetForm: function() {
      this.form.id = ''
      this.form.assetsCode = ''
      this.form.assetsGetDate = new Date()
      this.form.assetsTypeId = -1
      this.form.assetsSourceId = -1
      this.form.assetsState = 0
      this.form.assetsAdress = ''
      this.form.propertyOwner = ''
      this.form.assetsFor = ''
      this.form.assetsFileGroupId = ''
      this.form.assetsFileGroupFiles = []
      this.form.assetsMent.buildDate = null
      this.form.assetsMent.assessArea = null
      this.form.assetsMent.assetPriceOneYear = null
      this.form.propertyCode = ''
      this.form.landCode = ''
      this.form.landPropertyInfo = ''
      this.form.propertyFileGroupId = ''
      this.form.propertyFileGroupFiles = []
      this.form.contractinfo.contractCode = ''
      this.form.contractinfo.contractType = -1
      this.form.contractinfo.lessee = ''
      this.form.contractinfo.lesseePhone = ''
      this.form.contractinfo.contracStartDate = null
      this.form.contractinfo.contractEndDate = null
      this.form.contractinfo.contractLife = null
      this.form.contractinfo.contractPrice = null
      this.form.contractinfo.contractPromiseMoney = null
      this.form.contractinfo.contractMoney = null
      this.form.assetUseType = -1
    },
    resume: function() {
      const row = this.multipleSelection[0]
      if (row.jobStatus !== this.JobStatus.Stopped) {
        this.$message({
          showClose: true,
          message: this.BusinessLanguage.GetMenuName(
            this.BusinessLanguage.ScheduleJob.Grid.Tooltip.Unstopped
          ),
          type: 'warning'
        })
        return
      }
      this.RuYiAdmin.Get(
        'ScheduleJobManagement/ResumeScheduleJob/' + row.id,
        null
      ).then((response) => {
        this.$message({
          showClose: true,
          message: this.BusinessLanguage.GetMenuName(
            this.BusinessLanguage.ScheduleJob.Grid.Message.Resume
          ),
          type: 'success'
        })
        this.editDisabled = true
        this.delDisabled = true
        setTimeout(() => {
          this.InitData()
        }, 1000)
      })
    }
  }
}
</script>

  <style scoped>
  .box-card {
  width: 1000px;
  margin: auto;
}
.colWidth
{
width: 200px;
}
.colWidth2
{
  width: 100%;
}
.upload-demo
{
  width:100%;
  text-align: left;
}
.Maindrawer  {
  text-align: center;
}
.overflowauto{
    overflow-y: auto;
    width: 100%;
    height: 750px;
    padding-right: 15px;
}
.overflowauto::-webkit-scrollbar
{
  height: 6px;
  width: 6px;
  margin-left: 10px;
}
.overflowauto::-webkit-scrollbar-thumb{
  background: rgb(224, 214, 235);
}
.demo-drawer__footer{
  margin-top: 10px;
}
</style>
