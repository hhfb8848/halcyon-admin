<script setup lang="ts">
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { ref, onMounted, nextTick } from "vue";
import ListCard from "./components/ListCard.vue";
import ListDialogForm from "./components/ListDialogForm.vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import AddFill from "@iconify-icons/ri/add-circle-line";
import { FormItemProps } from "./utils/types";
import { useConfig } from "./utils/hook";

import Refresh from "@iconify-icons/ep/refresh";
defineOptions({
  name: "SystemConfig"
});
const {
  form,
  pagination,
  searchValue,
  loading,
  dataList,
  onSearch,
  resetForm,
  openDialog,
  handleSizeChange,
  handleCurrentChange,
  handleManageItem,
  handleDeleteItem,
  handleRefreshCache
} = useConfig();
</script>

<template>
  <div>
    <div class="w-full flex justify-between mb-4">
      <div>
        <el-button :icon="useRenderIcon(AddFill)" @click="openDialog()">
          新建配置
        </el-button>
        <el-button
          v-ripple
          v-optimize="{
            event: 'click',
            fn: handleRefreshCache,
            immediate: true,
            timeout: 4000
          }"
          :icon="useRenderIcon(Refresh)"
          type="primary"
          plain
        >
          刷新缓存
        </el-button>
      </div>

      <el-input
        v-model="form.configName"
        v-optimize="{ event: 'input', fn: onSearch, timeout: 400 }"
        style="width: 300px"
        placeholder="请输入配置名称"
        clearable
      >
        <template #suffix>
          <el-icon class="el-input__icon">
            <IconifyIconOffline
              v-show="searchValue.length === 0"
              icon="ri:search-line"
            />
          </el-icon>
        </template>
      </el-input>
    </div>
    <div v-loading="loading">
      <el-empty
        v-show="dataList.length === 0"
        :description="`${dataList.length > 0 ? '配置未找到' : '暂无配置'}`"
      />
      <template v-if="pagination.total > 0">
        <el-row :gutter="16">
          <el-col
            v-for="(config, index) in dataList"
            :key="index"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="6"
            :xl="4"
          >
            <ListCard
              :config="config"
              @delete-config="handleDeleteItem"
              @manage-config="handleManageItem"
            />
          </el-col>
        </el-row>
        <el-pagination
          v-model:currentPage="pagination.currentPage"
          class="float-right"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[12, 24, 36]"
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </template>
    </div>
  </div>
</template>
