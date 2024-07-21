import dayjs from "dayjs";
import editForm from "./form.vue";
import { message as toast } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { addDialog } from "@/components/ReDialog";
import type { DictDataFormItemProps } from "../utils/types";
import type { PaginationProps } from "@pureadmin/table";
import { deviceDetection } from "@pureadmin/utils";
import { reactive, ref, h, toRaw } from "vue";
import { showDialog } from "@/components/HalcyonDialog";
import {
  addDictData,
  updateDictData,
  listDictData,
  deleteDictData
} from "@/api/dict/dict-data";
export function useDictData() {
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const form = reactive({
    dictId: null,
    name: "",
    value: "",
    status: "",
    size: pagination.pageSize,
    current: pagination.currentPage
  });
  const curRow = ref();
  const formRef = ref();
  const tableRef = ref();
  const dataList = ref([]);
  const isShow = ref(false);
  const loading = ref(true);
  const isLinkage = ref(false);
  const switchLoadMap = ref({});
  const selectedNum = ref(0);
  const columns: TableColumnList = [
    {
      label: "勾选列", // 如果需要表格多选，此处label必须设置
      type: "selection",
      fixed: "left",
      reserveSelection: true // 数据刷新后保留选项
    },
    {
      label: "数据项名称",
      prop: "name",
      width: 200,
      fixed: "left"
    },
    {
      label: "数据项值",
      prop: "value",
      width: 100,
      fixed: "left"
    },
    {
      label: "状态",
      cellRenderer: scope => (
        <el-switch
          size={scope.props.size === "small" ? "small" : "default"}
          loading={switchLoadMap.value[scope.index]?.loading}
          v-model={scope.row.status}
          active-value={0}
          inactive-value={1}
          active-text="已启用"
          inactive-text="已停用"
          style="--el-switch-on-color: #13ce66"
          inline-prompt
          onChange={() => onChange(scope as any)}
        />
      ),
      minWidth: 80
    },
    {
      label: "颜色",
      prop: "color",
      cellRenderer: scope => (
        <el-tag color={scope.row.color}>
          {scope.row.color === "" ? "无" : scope.row.color}
        </el-tag>
      ),
      minWidth: 80
    },
    {
      label: "创建时间",
      prop: "createTime",
      minWidth: 100,
      formatter: ({ createTime }) =>
        dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "备注",
      prop: "remark",
      minWidth: 160
    },

    {
      label: "操作",
      fixed: "right",
      width: 150,
      slot: "operation"
    }
  ];

  function onChange({ row, index }) {
    ElMessageBox.confirm(
      `确认要<strong>${
        row.status === 1 ? "停用" : "启用"
      }</strong><strong style='color:var(--el-color-primary)'>${
        row.name
      }</strong>吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(async () => {
        switchLoadMap.value[index] = Object.assign(
          {},
          switchLoadMap.value[index],
          {
            loading: true
          }
        );
        const res = await updateDictData(row);
        if (res.code == "H200") {
          switchLoadMap.value[index] = Object.assign(
            {},
            switchLoadMap.value[index],
            {
              loading: false
            }
          );
          toast(`已${row.status === 1 ? "停用" : "启用"}${row.name}`, {
            type: "success"
          });
        } else {
          toast(res.message, { type: "error" });
        }
        onSearch();
      })
      .catch(() => {
        row.status === 0 ? (row.status = 1) : (row.status = 0);
      });
  }

  function handleDelete(row) {
    showDialog("警告", {
      contentRenderer: () => (
        <p style="text-align: center;margin-bottom:20px">
          确认要删除
          <strong style="color:var(--el-color-danger);margin:0 5px">
            {row.name}
          </strong>
          吗?
        </p>
      ),
      beforeSure: async done => {
        const res = await deleteDictData([row.id]);
        if (res.code == "H200") {
          toast(`已删除${row.name}`, {
            type: "success"
          });
        } else {
          toast(res.message, { type: "error" });
        }
        done(); // 关闭弹框
        onSearch();
      }
    });
  }

  function handleSizeChange(val: number) {
    pagination.currentPage = 1;
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  function handleSelectionChange(val) {
    selectedNum.value = val.length;
    // 重置表格高度
    tableRef.value.setAdaptive();
  }

  async function onSearch() {
    loading.value = true;
    form.current = pagination.currentPage;
    form.size = pagination.pageSize;
    const { code, data, message } = await listDictData(toRaw(form));
    if (code != "H200") {
      toast(message, { type: "error" });
    } else {
      dataList.value = data.records;
      pagination.total = data.total;
      pagination.pageSize = data.size;
      pagination.currentPage = data.current;
    }
    loading.value = false;
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  function openDialog(title = "新增", row?: DictDataFormItemProps) {
    addDialog({
      title: `${title}字典数据项`,
      props: {
        formInline: {
          id: row?.id ?? null,
          dictId: form.dictId,
          name: row?.name ?? "",
          value: row?.value ?? "",
          color: row?.color ?? "",
          status: row?.status ?? 0,
          sortOrder: row?.sortOrder ?? 1,
          remark: row?.remark ?? ""
        }
      },
      width: "35%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as DictDataFormItemProps;
        function chores() {
          toast(`您${title}了数据项名称为${curData.name}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(async valid => {
          if (valid) {
            console.log("curData", row);
            // 表单规则校验通过
            if (title === "新增") {
              // 实际开发先调用新增接口，再进行下面操作
              const res = await addDictData(curData);
              if (res.code == "H200") {
                chores();
              } else {
                toast(res.message, { type: "error" });
              }
            } else {
              // 实际开发先调用修改接口，再进行下面操作
              const res = await updateDictData(curData);
              if (res.code == "H200") {
                chores();
              } else {
                toast(res.message, { type: "error" });
              }
            }
          }
        });
      }
    });
  }

  function handleDrawerOpen(dictObj) {
    form.dictId = dictObj.id;
    pagination.currentPage = 1;
    pagination.pageSize = 10;
    resetForm(formRef.value);
  }

  function handleDrawerClose() {
    dataList.value = [];
  }

  function handleSelectionCancel() {
    selectedNum.value = 0;
    // 用于多选表格，清空用户的选择
    tableRef.value.getTableRef().clearSelection();
  }

  function handlebatchDelete() {
    // 返回当前选中的行
    const curSelected = tableRef.value.getTableRef().getSelectionRows();
    showDialog("警告", {
      contentRenderer: () => (
        <p style="text-align: center;margin-bottom:20px">
          确认要删除
          {curSelected.map((item, index) => (
            <strong style="color:var(--el-color-danger);margin:0 5px">
              {item.name}
              {index < curSelected.length - 1 ? "、" : ""}
            </strong>
          ))}
          吗?
        </p>
      ),
      beforeSure: async done => {
        const selectedIds = curSelected.map(item => item.id);
        console.log("selectedIds", curSelected);
        const res = await deleteDictData(selectedIds);
        if (res.code == "H200") {
          toast(`删除成功`, {
            type: "success"
          });
        } else {
          toast(res.message, { type: "error" });
        }
        done(); // 关闭弹框
        tableRef.value.getTableRef().clearSelection();
        onSearch();
      }
    });
  }
  return {
    form,
    isShow,
    curRow,
    loading,
    columns,
    dataList,
    isLinkage,
    pagination,
    formRef,
    tableRef,
    selectedNum,
    onSearch,
    resetForm,
    openDialog,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    handleDrawerOpen,
    handleDrawerClose,
    handleSelectionCancel,
    handlebatchDelete
  };
}
