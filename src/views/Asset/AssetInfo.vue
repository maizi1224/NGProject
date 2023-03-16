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
      size="mini"
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
          v-if="ButtonPermission('assetinfo:add:entity')"
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
          v-if="ButtonPermission('asset:edit:entity')"
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
          v-if="ButtonPermission('asset:delete:entity')"
          :disabled="editDisabled"
          icon="el-icon-circle-close"
          plain
          size="mini"
          type="danger"
          @click="del"
        >{{
          BusinessLanguage.GetMenuName(BusinessLanguage.Common.Button.Delete)
        }}
        </el-button>
        <el-button
          type="success"
          icon="el-icon-refresh-left"
          plain
          size="mini"
          @click="refresh"
        >
          {{
            BusinessLanguage.GetMenuName(
              BusinessLanguage.AssetMent.Placeholder.Refresh
            )
          }}
        </el-button>
        <!-- <el-button
          type="success"
          icon="el-icon-printer"
          plain
          size="mini"
          @click="print"
        >
          打印
        </el-button> -->
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

      border
      :header-cell-style="{ textAlign: 'center' }"
      @row-dblclick="dbclick"
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
      />
      <el-table-column
        prop="assetsState"
        align="center"
        label="承租情况"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.assetsState === 0">
            未出租
          </el-tag>
          <el-tag v-else type="success">
            已出租
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
        prop="assetsName"
        align="center"
        label="原用途"
      />
      <!-- <el-table-column
        prop="contractinfo[0].lessee"
        align="center"
        :label="
          BusinessLanguage.GetMenuName(
            BusinessLanguage.AssetMent.Grid.lessee
          )
        "
      />
      <el-table-column
        prop="contractinfo[0].lesseePhone"
        align="center"
        :label="
          BusinessLanguage.GetMenuName(
            BusinessLanguage.AssetMent.Grid.lesseePhone
          )
        "
      />
      <el-table-column
        prop="contractinfo[0].contracStartDate"
        align="center"
        :formatter="formatterDate"
        :label="
          BusinessLanguage.GetMenuName(
            BusinessLanguage.AssetMent.Grid.ContracStartDate
          )
        "
      />
      -->
      <!-- <el-table-column
        prop="contractinfo[0].contractEndDate"
        align="center"
        :formatter="formatterDate"
        :label="
          BusinessLanguage.GetMenuName(
            BusinessLanguage.AssetMent.Grid.ContractEndDate
          )
        "
      /> -->
      <!-- <el-table-column
        prop="contractinfo[0].contractPrice"
        align="center"
        :label="
          BusinessLanguage.GetMenuName(
            BusinessLanguage.AssetMent.Grid.ContractPrice
          )
        "
      />
     <el-table-column
        prop="contractinfo[0].contractMoney"
        align="center"
        :label="
          BusinessLanguage.GetMenuName(
            BusinessLanguage.AssetMent.Grid.ContractMoney
          )
        "
      /> -->
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
          <el-tag v-if="scope.row.assetUseType === 0" type="success">
            正常管理
          </el-tag>
          <el-tag v-else-if="scope.assetUseType === 1" type="success">
            拆迁
          </el-tag>
          <el-tag v-else-if="scope.assetUseType === 2" type="success">
            正常管理
          </el-tag>
          <el-tag v-else-if="scope.assetUseType === 3" type="danger">
            正常管理
          </el-tag>
          <el-tag v-else type="success">
            正常管理

          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="contractinfo[0].contractEndDate"
        align="center"
        :formatter="formatterDate"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleVideo(scope.$index, scope.row)"
          >查看监控</el-button>

        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        :current-page.sync="queryCondition.PageIndex"
        :page-sizes="[10, 15, 20, 40, 60, 80, 100]"
        :page-size="queryCondition.PageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="queryCondition.TotalCount"
        @size-change="HandleSizeChange"
        @current-change="HandleCurrentChange"
      />
    </div>
    <el-drawer ref="drawer" :title="title" :visible.sync="dialogFormVisible" direction="ttb" :before-close="handleClose" size="100%" class="Maindrawer">

      <el-card class="box-card">

        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-width="auto"
          label-position="left"
          size="small"
          class="overflowauto"
          :disabled="Isdisabled"
        >
          <el-row>
            <el-col :span="24">
              <el-divider content-position="center">不动产登记情况</el-divider>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8" style="display:none">
              <el-form-item
                label="资产id"
                label-width="90px"
                prop="id"
              >
                <el-input
                  v-model="form.id"
                  prefix-icon="el-icon-search"
                  :disabled="true"
                  placeholder="自动生成无需输入"
                  style="margin-left:-80px;"
                  class="colWidth"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="档案号"
                prop="assetsCode"
                label-width="90px"
              >
                <el-input
                  v-model="form.assetsCode"

                  style="margin-left:-80px;"
                  class="colWidth"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="名称原用途"
                label-width="90px"
              >
                <el-input
                  v-model="form.assetsName"
                  style="margin-left:-80px;"
                  class="colWidth"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="建档日期"
                prop="assetsGetDate"
                label-width="90px"
                style="display:none"
              >
                <el-date-picker
                  v-model="form.assetsGetDate"
                  class="colWidth"
                  type="date"

                  style="margin-left:-80px;"
                  :picker-options="pickerOptions"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="资产地址" label-width="90px">
                <el-input v-model="form.assetsAdress" style="margin-left:-80px;" class="colWidth" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="不动产权号" prop="assetsCode" label-width="90px">
                <el-input v-model="form.landPropertyInfo" style="margin-left:-80px;" class="colWidth" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="产权人"
                prop="propertyOwner"
                label-width="90px"
              >
                <el-input
                  v-model="form.propertyOwner"
                  style="margin-left:-80px;"
                  class="colWidth"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="共有情况"
                label-width="90px"
              >
                <el-input v-model="form.gyqk" style="margin-left:-80px;" class="colWidth" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="不动单元号" label-width="90px">
                <el-input v-model="form.bdcdyh" style="margin-left:-80px;" class="colWidth" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="资产类型"
                prop="assetsTypeId"
                label-width="90px"
              >
                <el-input v-model="form.assetsTypeId" style="margin-left:-80px;" class="colWidth" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="权利性质"
                prop="assetsSourceId"
                label-width="90px"
              >
                <el-select v-model="form.assetUseType" style="margin-left:-80px;" class="colWidth">
                  <el-option
                    v-for="item in options6"
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
              <el-form-item label="用途" label-width="90px">
                <el-input v-model="form.yt" style="margin-left:-80px;" class="colWidth" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="土地使用面积" label-width="90px" class="lineheight" prop="tdsymj">
                <el-input v-model="form.tdsymj" class="colWidth" style="margin-left:-80px;">
                  <template slot="append">m²</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="房屋建筑面积" label-width="90px" class="lineheight" prop="fwjzmj">
                <el-input v-model="form.fwjzmj" style="margin-left:-80px;" class="colWidth">
                  <template slot="append">m²</template>
                </el-input>
              </el-form-item>
            </el-col>

          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="期限" label-width="90px" prop="qx">

                <el-input v-model="form.qx" style="margin-left:-80px;" class="colWidth">
                  <template slot="append">年</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="起止日期" label-width="90px">
                <el-date-picker
                  v-model="form.assetDate"
                  type="daterange"
                  style="margin-left:-18px;"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
            </el-col>

          </el-row>

          <!-- <el-row>
            <el-col :span="24">
              <el-divider content-position="center">资产现状</el-divider>
            </el-col>
          </el-row> -->
          <el-row>
            <el-col :span="8">
              <el-form-item label="层数" label-width="90px">
                <el-input v-model="form.cs" class="colWidth" style="margin-left:-80px;" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="房屋结构形式/分类情况" label-width="90px" class="lineheight">
                <el-input v-model="form.fwjg" style="margin-left:-80px;" class="colWidth" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="建设年度" label-width="90px">
                <el-input v-model="form.jsnd" style="margin-left:-80px;" class="colWidth" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item
                label="备注"
                prop="assetsState"
                label-width="90px"
              >
                <el-input
                  v-model="form.remarks"

                  style="margin-left:-80px;"
                  class="colWidth"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="地图标注"
                prop="mapInfo"
                label-width="90px"
              >
                <el-input
                  v-model="form.mapInfo"
                  style="margin-left:-80px;"
                  class="colWidth"
                  @dblclick.native="BaiduClick"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item
                label="不动产资料附件"
                prop="assetsFor"
                label-width="90px"
                class="lineheight"
              >
                <el-upload
                  class="upload-demo"
                  :headers="headers"
                  action=""
                  :before-remove="beforeRemove"
                  :multiple="true"
                  :limit="limit"
                  :auto-upload="false"
                  :on-exceed="handleExceed"
                  :on-change="(file,file_list)=>{return fileChange(file,file_list,'1')}"
                  :on-preview="handlePreview"
                  :file-list="form.assetsFileGroupFiles"
                >
                  <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
                  <el-button size="small" type="success" style="margin-left:50px" @click="submitUpload('1')">点击上传</el-button>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-divider content-position="center">资产抵押情况</el-divider>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="抵押权人" label-width="90px">
                <el-input v-model="form.dyqr" class="colWidth" style="margin-left:-80px;" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="抵押金额" label-width="90px" prop="dyje">
                <el-input v-model="form.dyje" style="margin-left:-80px;" class="colWidth">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="抵押期限" label-width="90px">
                <el-input v-model="form.dyqx" style="margin-left:-80px;" class="colWidth" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-collapse accordion>
            <el-collapse-item>
              <template slot="title">
                <p>资产日常巡查情况  </p><i class="header-icon el-icon-school" />

              </template>
              <el-collapse>
                <el-collapse-item title="结构安全" name="1">

                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="巡查时间" prop="propertyCode" label-width="90px">
                        <el-date-picker
                          v-model="form.xcsj1"
                          class="colWidth"
                          type="date"

                          style="margin-left:-80px;"
                          :picker-options="pickerOptions"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="巡查情况" prop="assetsCode" label-width="90px">
                        <el-input v-model="form.xcqk1" style="margin-left:-80px;" class="colWidth" />
                      </el-form-item>
                    </el-col>

                  </el-row>
                </el-collapse-item>

                <el-collapse-item title="消防设施" name="2">

                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="巡查时间" prop="propertyCode" label-width="90px">
                        <el-date-picker
                          v-model="form.xcsj2"
                          class="colWidth"
                          type="date"

                          style="margin-left:-80px;"
                          :picker-options="pickerOptions"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="巡查情况" prop="assetsCode" label-width="90px">
                        <el-input v-model="form.xcqk2" style="margin-left:-80px;" class="colWidth" />
                      </el-form-item>
                    </el-col>

                  </el-row>
                </el-collapse-item>

                <el-collapse-item title="资产使用情况" name="3">

                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="巡查时间" prop="propertyCode" label-width="90px">
                        <el-date-picker
                          v-model="form.xcsj3"
                          class="colWidth"
                          type="date"

                          style="margin-left:-80px;"
                          :picker-options="pickerOptions"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="巡查情况" prop="assetsCode" label-width="90px">
                        <el-input v-model="form.xcqk3" style="margin-left:-80px;" class="colWidth" />
                      </el-form-item>
                    </el-col>

                  </el-row>
                </el-collapse-item>
              </el-collapse>

            </el-collapse-item>
          </el-collapse>

          <el-collapse accordion value="1">
            <el-collapse-item>
              <template slot="title">
                <p>资产评估  </p><i class="header-icon el-icon-school" />

              </template>

              <el-row>
                <el-col :span="8">
                  <el-form-item
                    label="评估日期"
                    label-width="90px"
                    class="lineheight"
                  >
                    <el-date-picker
                      v-model="form.assetsMent.buildDate"
                      style="margin-left:-80px;"
                      class="colWidth"
                      type="date"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="评估编号" label-width="90px" class="lineheight">
                    <el-input v-model="form.assetsMent.assetCode" class="colWidth" style="margin-left:-80px;" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="评估价值"
                    label-width="90px"
                    class="lineheight"
                    prop="pgjz"
                  >
                    <el-input v-model="form.assetsMent.assetPriceOneYear" style="margin-left:-80px;" class="colWidth"><template slot="append">万元</template></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>

                <el-col :span="8">
                  <el-form-item label="土地面积" label-width="90px" class="lineheight" prop="tdmj">
                    <el-input v-model="form.tdmj" class="colWidth" style="margin-left:-80px;" prop="tdmj">
                      <template slot="append">m²</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="土地评估价值" label-width="90px" class="lineheight" prop="tdpgjz">
                    <el-input v-model="form.tdpgjz" class="colWidth" style="margin-left:-80px;">
                      <template slot="append">万元</template>
                    </el-input>
                  </el-form-item>
                </el-col>

              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="房产面积" label-width="90px" class="lineheight" prop="fwmj">
                    <el-input v-model="form.fwmj" style="margin-left:-80px;" class="colWidth">
                      <template slot="append">m²</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="房产评估价值" label-width="90px" class="lineheight" pro="fwpgjz">
                    <el-input v-model="form.fwpgjz" class="colWidth" style="margin-left:-80px;">
                      <template slot="append">万元</template>
                    </el-input>
                  </el-form-item>
                </el-col>

              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item
                    label="资产评估资料附件"
                    label-width="90px"
                    class="lineheight"
                  >
                    <el-upload
                      class="upload-demo"
                      :headers="headers"
                      action=""
                      :before-remove="beforeRemove"
                      :multiple="true"
                      :limit="limit"
                      :auto-upload="false"
                      :on-exceed="handleExceed"
                      :on-change="(file,file_list)=>{return fileChange(file,file_list,'2')}"
                      :on-preview="handlePreview"
                      :file-list="form.propertyFileGroupFiles"
                    >
                      <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
                      <el-button size="small" type="success" style="margin-left:50px" @click="submitUpload('2')">点击上传</el-button>
                    </el-upload>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>

            <el-collapse-item name="1">
              <template slot="title">
                <p>合同信息  </p><i class="header-icon el-icon-notebook-2" />
              </template>
              <el-row>
                <el-col :span="8">
                  <el-form-item
                    label=""
                    prop="assetsFor"
                    class="lineheight"
                  >

                    <el-button size="small" type="primary" style="margin-left:-115px;" @click="addDomain">新增合同</el-button>

                  </el-form-item>
                </el-col>
              </el-row>
              <el-collapse v-for="(domain,index) in form.contractinfo" :key="index" value="1">
                <el-collapse-item :title="'合同'+(index+1)" name="1">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="合同编号" label-width="90px">
                        <el-input v-model="domain.id" :disabled="true" class="col3" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="签订日期" label-width="90px">
                        <el-date-picker v-model="domain.contractDate" type="date" :picker-options="pickerOptions" class="col3" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item
                        label="合同类型"
                        prop="assetsState"
                        label-width="90px"
                      >
                        <el-select v-model="domain.contractType" class="col3">
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
                    <el-col :span="8">
                      <el-form-item label="起始日期" label-width="90px">
                        <el-date-picker v-model="domain.contracStartDate" :disabled="domain.contractPrice>0" type="date" class="col3" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item
                        label="终止日期"
                        label-width="90px"
                      >
                        <el-date-picker
                          v-model="domain.contractEndDate"
                          type="date"
                          class="col3"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item
                        label="总租期"
                        label-width="90px"
                        :prop="'contractinfo.'+index+'.contractLife'"
                        :rules="{ pattern: /^(\d+|\d+\.\d{1,2})$/, message: '总租期需为数字', trigger: 'blur'}"
                      >
                        <el-input v-model="domain.contractLife" class="col3" placeholder="">
                          <template slot="append">年</template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item
                        label="保证金"
                        label-width="90px"
                        :prop="'contractinfo.'+index+'.contractPromiseMoney'"
                        :rules="{ pattern: /^(\d+|\d+\.\d{1,2})$/, message: '保证金需为数字', trigger: 'blur'}"
                      >
                        <el-input v-model="domain.contractPromiseMoney" class="col3" placeholder="">
                          <template slot="append">元</template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item
                        label="年租金"
                        label-width="90px"
                        :prop="'contractinfo.'+index+'.contractPrice'"
                        :rules="{ pattern: /^(\d+|\d+\.\d{1,2})$/, message: '年租金需为数字', trigger: 'blur'}"
                      >
                        <el-input v-model="domain.contractPrice" class="col3" placeholder="">
                          <template slot="append">元/年</template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item
                        label="合同总金额"
                        label-width="90px"
                        :prop="'contractinfo.'+index+'.contractMoney'"
                        :rules="{ pattern: /^(\d+|\d+\.\d{1,2})$/, message: '合同总金额需为数字', trigger: 'blur'}"
                      >
                        <el-input v-model="domain.contractMoney" class="col3" placeholder="">
                          <template slot="append">元</template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="缴纳方式" label-width="90px">
                        <el-select v-model="domain.contractPayment" :disabled="domain.contractPrice>0" class="col3">
                          <el-option
                            v-for="item in options7"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="合同状态" label-width="90px">
                        <el-select v-model="domain.contractState" class="col3">
                          <el-option
                            v-for="item in options8"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-form-item label="合同备注" label-width="90px" class="nowrap">
                      <el-col :span="24">
                        <el-input
                          v-model="domain.remark"
                          class="htbz"
                          type="textarea"
                        />
                      </el-col>
                    </el-form-item>

                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="出租方(甲方) " class="nowrap" label-width="90px">
                        <el-input v-model="domain.lessor" class="colWidth2" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="承租方(乙方) " class="nowrap" label-width="90px">
                        <el-input v-model="domain.lessee" class="colWidth2" />
                      </el-form-item>
                    </el-col>

                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="甲方联系方式" label-width="90px" class="nowrap">
                        <el-input v-model="domain.lessorPhone" class="colWidth2" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item
                        label="乙方联系方式"
                        class="nowrap"
                        label-width="90px"
                        :prop="'contractinfo.'+index+'.lesseePhone'"
                        :rules="{ pattern: /^1\d{10}$/, message: '乙方联系方式需为号码', trigger: 'blur'}"
                      >
                        <el-input v-model="domain.lesseePhone" class="colWidth2" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="甲方地址" label-width="90px" class="nowrap">
                        <el-input v-model="domain.lessorAdress" class="colWidth2" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="乙方地址" class="nowrap" label-width="90px">
                        <el-input v-model="domain.lesseeAdress" class="colWidth2" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="甲方统一社会信用代码(身份证)" label-width="160px">
                        <el-input v-model="domain.lessorId" class="colWidth2" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="乙方统一社会信用代码(身份证)" label-width="160px">
                        <el-input v-model="domain.lesseeId" class="colWidth2" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item
                        label="纸质合同附件"
                        label-width="100px"
                      >
                        <!-- <el-upload
                          :id="index"
                          class="upload-demo"
                          :action="importUrl"
                          :before-remove="beforeRemove"
                          :headers="headers"
                          :multiple="true"
                          :limit="50"
                          :on-exceed="handleExceed"
                          :on-success="(response,file,file_list)=>{return handleSuccess3(response,file,file_list,index)}"
                          :on-preview="handlePreview"
                          :file-list="domain.contractPdfGroupFiles"
                        >
                          <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload> -->

                        <el-upload
                          class="upload-demo"
                          :headers="headers"
                          action=""
                          :before-remove="beforeRemove"
                          :multiple="true"
                          :limit="limit"
                          :auto-upload="false"
                          :on-exceed="handleExceed"
                          :on-change="(file,file_list)=>{return fileChange(file,file_list,'3',index)}"
                          :on-preview="handlePreview"
                          :file-list="domain.contractPdfGroupFiles"
                        >
                          <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
                          <el-button size="small" type="success" style="margin-left:50px" @click="submitUpload('3',index)">点击上传</el-button>
                          <el-button size="small" type="danger" style="margin-left:50px" @click="delDomain(domain.id)">删除合同</el-button>
                        </el-upload>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-collapse-item>
              </el-collapse>

            </el-collapse-item>
          </el-collapse>
        </el-form>

      </el-card>
      <div class="demo-drawer__footer">
        <el-button @click="cancelForm">取 消</el-button>
        <el-button type="primary" :disabled="Isdisabled" :loading="loading" @click="SubmitForm">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
      </div>
    </el-drawer>
    <el-dialog
      title="地图标注"
      :visible.sync="BaiduMapVisible"
      width="60%"
    >
      <baidu-map
        class="map-wrap"
        :center="mapData.center"
        :zoom="mapData.zoom"
        style="height:600px;width: 1000px;"
        :enable-scroll-wheel-zoom="true"
        @ready="mapHandler"
        @click="getLocation"
      >

        <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT" />
        <bm-city-list anchor="BMAP_ANCHOR_TOP_RIGHT" />
        <bm-geolocation
          anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
          :show-address-bar="true"
          :auto-location="true"
        />
      </baidu-map>
      <span slot="footer" class="dialog-footer">
        <el-button @click="BaiduMapVisible = false">取 消</el-button>
        <el-button type="primary" @click="BaiduMapVisible = false">确 定</el-button>
      </span>
    </el-dialog>
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
      realfilelist: [],
      filecount: 0,
      oldFileList: [],
      location: '北京',
      keyword: '百度',
      // 商家信息(包含坐标信息)
      businessDetail: {},
      // 地图数据
      mapData: {
        // 中心坐标
        center: { lng: 0, lat: 0 },
        // 缩放级别
        zoom: 18
      },
      // BMap类
      BMap: null,
      // 地图对象
      map: null,
      title: '',
      BaiduMapVisible: false,
      IsdisabledDate: false,
      Isdisabled: false,
      activeNames: ['1'],
      uploadParam: {},
      limit: 50,
      headers: null,
      importUrl: process.env.VUE_APP_BASE_API + '/Files/UploadFiles',
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
        isdel: 0,
        assetsCode: null,
        assetsGetDate: null,
        assetsTypeId: null,
        assetsSourceId: -1,
        assetsBefore: null,
        assetsValue: null,
        assetsState: 0,
        assetsAdress: null,
        propertyOwner: null,
        assetsFor: null,
        assetsFileGroupId: null,
        assetsFileGroupFiles: [],
        assetsMent: {
          id: null,
          assetMentId: null,
          buildDate: null,
          assessArea: null,
          assetCode: null,
          assetPriceOneYear: null
        },
        propertyCode: null,
        landCode: null,
        landPropertyInfo: null,
        propertyFileGroupId: null,
        propertyFileGroupFiles: [],
        contractinfo: [{
          id: null,
          contractCode: null,
          contractType: -1,
          contractDate: new Date(),
          lessee: null,
          lesseePhone: null,
          lessorPhone: null,
          lessorAdress: null,
          lessor: null,
          lessorId: null,
          lesseeAdress: null,
          lesseeId: null,
          contractPdfGroupFiles: [],
          ContractPdfGroupId: null,
          contractPayment: -1,
          contracStartDate: null,
          contractEndDate: null,
          contractLife: null,
          contractPrice: null,
          contractPromiseMoney: null,
          contractState: 2,
          contractMoney: null,
          remark: ''
        }],
        contract_groupId: null,
        assetUseType: -1,
        gyqk: null,
        bdcdyh: null,
        qlxz: null,
        yt: null,
        tdsymj: null,
        fwjzmj: null,
        qx: null,
        bgtime: null,
        endtime: null,
        ateassetD: null,
        cs: null,
        fwjg: null,
        jsnd: null,
        tdmj: null,
        fwmj: null,
        dyqr: null,
        dyje: null,
        dyqx: null,
        xcsj1: null,
        xcqk1: null,
        xcsj2: null,
        xcqk2: null,
        xcsj3: null,
        xcqk3: null,
        assetDate: [],
        remarks: null,
        assetsName: null,
        tdpgjz: null,
        fwpgjz: null
      },
      rules: {

        tdsymj: [
          { required: true, message: '土地使用面积不能为空', trigger: 'blur' },
          { pattern: /^(\d+|\d+\.\d{1,2})$/, message: '土地使用面积需为数字', trigger: 'blur' }
        ],
        fwjzmj: [
          { required: true, message: '房屋检测面积不能为空', trigger: 'blur' },
          { pattern: /^(\d+|\d+\.\d{1,2})$/, message: '房屋检测面积需为数字', trigger: 'blur' }
        ],
        qx: [
          { pattern: /^(\d+|\d+\.\d{1,2})$/, message: '期限需为数字', trigger: 'blur' }
        ],
        pgjz: [
          { pattern: /^(\d+|\d+\.\d{1,2})$/, message: '评估价值需为数字', trigger: 'blur' }
        ],
        dyje: [
          { pattern: /^(\d+|\d+\.\d{1,2})$/, message: '抵押金额需为数字', trigger: 'blur' }
        ]
        // fwmj: [
        //   { pattern: /^(\d+|\d+\.\d{1,2})$/, message: '抵押金额需为数字', trigger: 'blur' }
        // ],
        // tdpgjz: [
        //   { pattern: /^(\d+|\d+\.\d{1,2})$/, message: '抵押金额需为数字', trigger: 'blur' }
        // ],
        // fwpgjz: [
        //   { pattern: /^(\d+|\d+\.\d{1,2})$/, message: '抵押金额需为数字', trigger: 'blur' }
        // ]
        // contractLife: [
        //   { required: true, message: '土地使用面积不能为空', trigger: 'blur' },
        //   { pattern: /^(\d+|\d+\.\d{1,2})$/, message: '合同期限需为数字', trigger: 'blur' }
        // ],
        // contractPrice: [
        //   { pattern: /^(\d+|\d+\.\d{1,2})$/, message: '保证金需为数字', trigger: 'blur' }
        // ], contractPromiseMoney: [
        //   { pattern: /^(\d+|\d+\.\d{1,2})$/, message: '年租金需为数字', trigger: 'blur' }
        // ],
        // contractMoney: [{ pattern: /^(\d+|\d+\.\d{1,2})$/, message: '合同金额需为数字', trigger: 'blur' }]
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
        label: '国有建设用地使用权房屋所有权'
      }

      ],
      options2: [
        {
          value: -1,
          label: ' '
        },
        {
          value: 0,
          label: '单独所有'

        }

      ],

      options4: [
        { 'value': '宁国市乡村振兴投资集团有限公司' }
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
          label: '出让/自建房'
        },
        {
          value: 1,
          label: '出让'
        },
        {
          value: 2,
          label: '划拨/自建房'
        }
        // {
        //   value: 3,
        //   label: '停用'
        // },
        // {
        //   value: 4,
        //   label: '正常管理'
        // }

      ],
      options7: [
        {
          value: -1,
          label: ' '
        },
        {
          value: 0,
          label: '半年一交'
        },
        {
          value: 1,
          label: '一年一交'
        }

      ],
      options8: [
        {
          value: 2,
          label: '不存在逾期'
        },
        {
          value: 1,
          label: '合同逾期'
        },
        {
          value: 0,
          label: '合同完结'
        }

      ]
    }
  },
  watch: {},
  created() {
    // window.addEventListener('storage', this.afterQRScan)
    this.url.queryList = 'Asset/Post'
    this.url.queryEntity = 'Asset/GetById/'
    this.url.addEntity = 'Asset/Add'
    this.url.editEntity = 'Asset/UpdateById'
    this.url.deleteEntity = 'Asset/DeleteById/'
    this.queryCondition.Sort = 'Id ASC'
    this.refreshLocalToken()
  },
  mounted() {

  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    // 地图预处理
    async mapHandler({ BMap, map }) {
      if (this.businessId) {
        // 可以在此处请求接口获取坐标数据
        await this.getMallBusinessDetail()
      }
      // 保存百度地图类
      this.BMap = BMap
      // 保存地图对象
      this.map = map

      map.enableScrollWheelZoom(true)
      // 如果一开始坐标存在(编辑的时候)
      if (this.businessDetail.longitude && this.businessDetail.latitude) {
        // 设置坐标
        this.mapData.center.lng = this.businessDetail.longitude
        this.mapData.center.lat = this.businessDetail.latitude
      } else {
        // 如果坐标不存在则动态获取当前浏览器坐标（创建的时候）
        const geolocation = new BMap.Geolocation()
        // 获取当前的坐标（使用promise 将异步转换为同步）
        await new Promise((resolve) => {
          geolocation.getCurrentPosition((r) => {
            this.mapData.center.lng = this.businessDetail.longitude =
              r.point.lng
            this.mapData.center.lat = this.businessDetail.latitude = r.point.lat
            resolve()
          })
        })
      }
      // 创建定位标记
      const marker = new BMap.Marker(
        new BMap.Point(
          this.businessDetail.longitude,
          this.businessDetail.latitude
        )
      )
      // 将标记添加到地图上
      map.addOverlay(marker)
    },
    // 在地图上选择区域
    getLocation(e) {
      // 设置经度
      this.businessDetail.longitude = e.point.lng
      // 设置纬度
      this.businessDetail.latitude = e.point.lat
      // 百度地图类
      const BMapGL = this.BMap
      // 地图对象
      const map = this.map
      // 清除地图上所有的覆盖物(保证每次点击只有一个标记)
      map.clearOverlays()
      // 创建定位标记
      const marker = new BMapGL.Marker(new BMapGL.Point(e.point.lng, e.point.lat))
      // 将标记添加到地图上
      map.addOverlay(marker)
      // 创建坐标解析对象
      const geoc = new BMapGL.Geocoder()
      // 解析当前的坐标成地址
      geoc.getLocation(e.point, (rs) => {
        // 获取地址对象
        const addressComp = rs.addressComponents
        // 拼接出详细地址
        this.businessDetail.address =
          addressComp.province +
          addressComp.city +
          addressComp.district +
          addressComp.street +
          addressComp.streetNumber + rs.surroundingPois[0].title
        this.form.mapInfo = this.businessDetail.address

        // 向地图添加了一个文本标注，并使用默认的标注样式：
        var label = new BMapGL.Label(this.businessDetail.address, { // 创建文本标注
          position: e.point, // 设置标注的地理位置
          offset: new BMapGL.Size(10, 20) // 设置标注的偏移量
        })
        map.addOverlay(label) // 将标注添加到地图中 作者：星银色飞行船 https://www.bilibili.com/read/cv16784331/ 出处：bilibili
      })
    },
    BaiduClick() {
      this.BaiduMapVisible = true
    },
    handleVideo() {
      window.open('https://36.34.229.143:8443', '_blank')
    },
    delDomain(obj) {
      this.$confirm(
        '是否确认删除?',
        '确认信息',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        if (obj != null) {
          this.PostData('Contract/DeleteById', { id: obj }).then((response) => {
            this.form.assetsState = response.object
            Object.assign(this.form, response.object)
            const id1 = this.form.contractinfo.findIndex(item => {
              if (item.id === obj) {
                return true
              }
            })
            this.form.contractinfo.splice(id1, 1)
          })
        } else {
          const id1 = this.form.contractinfo.findIndex(item => {
            if (item.id === obj) {
              return true
            }
          })
          this.form.contractinfo.splice(id1, 1)
        }
      })
    },
    addDomain() {
      this.form.contractinfo.push({
        id: null,
        contractCode: null,
        contractType: -1,
        contractDate: new Date(),
        lessee: null,
        lesseePhone: null,
        lessorPhone: null,
        lessorAdress: null,
        lessor: null,
        lessorId: null,
        lesseeAdress: null,
        lesseeId: null,
        contractPdfGroupFiles: [],
        ContractPdfGroupId: null,
        contractPayment: -1,
        contracStartDate: null,
        contractEndDate: null,
        contractLife: null,
        contractPrice: null,
        contractPromiseMoney: null,
        contractState: 2,
        contractMoney: null,
        remark: ''
      })
    },
    dbclick: function(row, column) {
      this.loading = true
      this.resetForm()
      this.PostData('Asset/GetById', { id: row.id }).then((response) => {
        this.title = '查看资产'
        Object.assign(this.form, response.object)
        this.dialogFormVisible = true
        this.loading = false
        this.Isdisabled = true
        this.IsdisabledDate = true
      })
    },
    refresh: function() {
      this.InitData()
    },
    del: function() {
      this.$confirm(
        '是否确认删除?',
        '确认信息',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        if (this.multipleSelection.length === 1) {
          this.PostData('Asset/DeleteById', { id: this.multipleSelection[0].id, contractinfo: [{ id: this.multipleSelection[0].contractinfo }] }).then(response => {
            this.$message({
              showClose: true,
              message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Common.Dialog.Message.Delete),
              type: 'error'
            })
            this.editDisabled = true
            this.delDisabled = true
            this.InitData()
          })
        }
        // else {
        //   const ids = this.multipleSelection.map((item) => {
        //     return item.id
        //   })
        //   this.DeleteEntities(ids.toString()).then(response => {
        //     this.$message({
        //       showClose: true,
        //       message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Common.Dialog.Message.Delete),
        //       type: 'error'
        //     })
        //     this.editDisabled = true
        //     this.delDisabled = true
        //     this.getTreeNodes()
        //     this.InitData()
        //   })
        // }
      })
    },
    SubmitForm: function() {
      this.$refs.form.validate((valid) => {
        if (valid) {
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
                message: '资产档案修改成功',
                type: 'success'
              })
              this.loading = false
              this.dialogFormVisible = false
              this.InitData()
            })
          }
        }
      })
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
    handlePreview: function(file) {
      this.DownloadFile(
        'Files/DownloadFiles/', file.id, file.name
      )
    },
    fileChange(file, fileList, param, p2) {
      if (param === '1') {
        this.form.assetsFileGroupFiles = fileList
      } else if (param === '2') {
        this.form.propertyFileGroupFiles = fileList
      } else if (param === '3') {
        this.form.contractinfo[p2].contractPdfGroupFiles = fileList
      }
    },
    submitUpload(param, p2) { // 提交点击
      this.uploadFile(param, p2)
    },
    uploadFile(param, p2) { // 文件上传方法
      this.refreshLocalToken()
      const formData = new FormData()

      if (param === '1') {
        this.form.assetsFileGroupFiles.forEach(file => {
          formData.append('multipartFiles', file.raw)
        })
      } else if (param === '2') {
        this.form.propertyFileGroupFiles.forEach(file => {
          formData.append('multipartFiles', file.raw)
        })
      } else if (param === '3') {
        this.form.contractinfo[p2].contractPdfGroupFiles.forEach(file => {
          formData.append('multipartFiles', file.raw)
        })
      }

      const VueThis = this
      this.PostData('/Files/UploadFiles', formData).then(response => {
        this.$message({
          showClose: true,
          message: '成功',
          type: 'success'
        })
        const files = []

        if (param === '1') {
          // 资产附件
          response.object.forEach(element => {
            VueThis.form.assetsFileGroupId = element.fileId
            files.push({ name: element.fileName, url: element.fileUrl, id: element.id })
          })
          VueThis.form.assetsFileGroupFiles.forEach(element => {
            if (element.id) {
              files.push(element)
            }
          })
          VueThis.form.assetsFileGroupFiles = files
        } else if (param === '2') {
          // 评估附件
          response.object.forEach(element => {
            VueThis.form.propertyFileGroupId = element.fileId
            files.push({ name: element.fileName, url: element.fileUrl, id: element.id })
          })
          VueThis.form.propertyFileGroupFiles.forEach(element => {
            if (element.id) {
              files.push(element)
            }
          })
          VueThis.form.propertyFileGroupFiles = files
        } else if (param === '3') {
          // 评估附件
          response.object.forEach(element => {
            VueThis.form.contractinfo[p2].ContractPdfGroupId = element.fileId
            files.push({ name: element.fileName, url: element.fileUrl, id: element.id })
          })
          VueThis.form.contractinfo[p2].contractPdfGroupFiles.forEach(element => {
            if (element.id) {
              files.push(element)
            }
          })
          VueThis.form.contractinfo[p2].contractPdfGroupFiles = files
        }
      })
    },
    handleSuccess2: function(response, file, fileList) {
      this.refreshLocalToken()
      if (response.message === 'OK') {
        this.form.propertyFileGroupId = response.object[0].fileId
        this.form.propertyFileGroupFiles.push({ name: response.object[0].fileName, url: response.object[0].fileUrl, id: response.object[0].id })
      }
    },
    handleSuccess3: function(response, file, fileList, j) {
      this.refreshLocalToken()
      if (response.message === 'OK') {
        this.form.contractinfo[j].ContractPdfGroupId = response.object[0].fileId
        this.form.contractinfo[j].contractPdfGroupFiles.push({ name: response.object[0].fileName, url: response.object[0].fileUrl, id: response.object[0].id })
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
      if (this.Isdisabled) {
        this.loading = false
        this.dialogFormVisible = false
        clearTimeout(this.timer)
      } else {
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
      }
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
      return this.$confirm(`确定移除 ${file.name}？`, '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消' }).then(() => {
        this.DeleteFile('Files/DeleteFiles/', file.id).then(response => {
          if (response.message === 'OK') {
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            })
            return true
          } else {
            this.$message({
              showClose: true,
              message: '删除失败',
              type: 'error'
            })
            return false
          }
        })
      })
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
      this.Isdisabled = false
      this.IsdisabledDate = false
    },
    edit: function() {
      this.loading = true
      this.PostData('Asset/GetById', { id: this.multipleSelection[0].id }).then((response) => {
        this.title = '修改资产'
        Object.assign(this.form, response.object)
        this.dialogFormVisible = true
        this.loading = false
        this.Isdisabled = false
        this.IsdisabledDate = true
      })
    },
    resetForm: function() {
      this.form.id = ''
      this.form.assetsCode = null
      this.form.assetsBefore = null
      this.form.assetsValue = null
      this.form.assetsGetDate = new Date()
      this.form.assetsTypeId = null
      this.form.assetsSourceId = -1
      this.form.assetsState = 0
      this.form.assetsAdress = null
      this.form.propertyOwner = null
      this.form.assetsFor = null
      this.form.assetsFileGroupId = null
      this.form.assetsFileGroupFiles = []
      this.form.assetsMent.id = null
      this.form.assetsMent.assetMentId = null
      this.form.assetsMent.buildDate = null
      this.form.assetsMent.assessArea = null
      this.form.assetsMent.assetPriceOneYear = null
      this.form.assetsMent.assetCode = null
      this.form.propertyCode = null
      this.form.landCode = null
      this.form.landPropertyInfo = null
      this.form.propertyFileGroupId = null
      this.form.propertyFileGroupFiles = []
      this.form.contract_groupId = null
      this.form.contractinfo = [{
        id: null,
        contractCode: null,
        contractType: -1,
        lessorAdress: null,
        contractDate: new Date(),
        lessee: null,
        lesseePhone: null,
        lessorPhone: null,
        lessor: null,
        lessorId: null,
        lesseeAdress: null,
        lesseeId: null,
        contractPdfGroupFiles: [],
        ContractPdfGroupId: null,
        contractPayment: -1,
        contracStartDate: null,
        contractEndDate: null,
        contractLife: null,
        contractPrice: null,
        contractPromiseMoney: null,
        contractState: 2,
        contractMoney: null,
        remark: null
      }]

      this.form.assetUseType = -1
      this.form.gyqk = null
      this.form.bdcdyh = null
      this.form.qlxz = null
      this.form.yt = null
      this.form.tdsymj = null
      this.form.fwjzmj = null
      this.form.qx = null
      this.form.bgtime = null
      this.form.endtime = null
      this.form.assetDate = null
      this.form.cs = null
      this.form.fwjg = null
      this.form.jsnd = null
      this.form.tdmj = null
      this.form.fwmj = null
      this.form.dyqr = null
      this.form.dyje = null
      this.form.dyqx = null
      this.form.xcsj1 = null
      this.form.xcqk1 = null
      this.form.xcsj2 = null
      this.form.xcqk2 = null
      this.form.xcsj3 = null
      this.form.xcqk3 = null
      this.form.assetsName = null
      this.form.remarks = null
      this.form.tdpgjz = null
      this.form.fwpgjz = null
    }
  }
}
</script>

  <style scoped>
  .box-card {
  width: 1200px;
  margin: auto;
}
.colWidth
{
width: 240px;

}
.colWidth2
{
  width: 92%;
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
/deep/ .el-collapse-item__header{
  font-weight: 700;
  padding-left: 45%;
}
/deep/ .el-form-item__label-wrap
{
  margin-left: 15px;
}
/* /deep/ .el-form-item__label
{
    line-height: 20px;
} */
.header-icon{
  margin-left: 5px;
}
.nowrap{
  white-space: nowrap;
}
.col3{
  margin-left: -60px;
  width: 200px;
}
.htbz{
  margin-left: -50px;
  width: 92%;
}
.lineheight /deep/ .el-form-item__label{
  line-height: 20px;
}
</style>
