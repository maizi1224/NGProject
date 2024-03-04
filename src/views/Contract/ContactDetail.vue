<!--
 * @Author: maizi 851620279@qq.com
 * @Date: 2022-10-24 21:29:15
 * @LastEditors: maizi 851620279@qq.com
 * @LastEditTime: 2024-01-15 02:03:08
 * @FilePath: \NGProject\src\views\Contract\ContactDetail.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="app-container">
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
  </div>
</template>
<script >
import RuYiAdminBasePage from '@/components/BasePage/RuYiAdminBasePage'

export default ({
  name: 'ContractDetail',
  extends: RuYiAdminBasePage,
  data() {
    return {

    }
  }
})
</script>
