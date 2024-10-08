import { reactive, ref } from "vue";
import GroupLine from "@iconify-icons/ri/group-line";
import Question from "@iconify-icons/ri/question-answer-line";
import CheckLine from "@iconify-icons/ri/chat-check-line";
import Smile from "@iconify-icons/ri/star-smile-line";
import dayjs from "dayjs";
export function useWelcome() {
  // 项目总数，传感数据点，触发器数，接入设备数
  const chartData = reactive([
    {
      icon: GroupLine,
      bgColor: "#effaff",
      color: "#41b6ff",
      duration: 2200,
      name: "项目总数",
      value: 10,
      percent: "+88%",
      data: [1, 2, 1, 0, 0, 1],
      unit: "个"
    },
    {
      icon: Question,
      bgColor: "#fff5f4",
      color: "#e85f33",
      duration: 1600,
      name: "传感数据点",
      value: 16580,
      percent: "+70%",
      data: [2216, 1148, 1255, 788, 4821, 1973, 4379],
      unit: "条"
    },
    {
      icon: CheckLine,
      bgColor: "#eff8f4",
      color: "#26ce83",
      duration: 1500,
      name: "触发器数",
      value: 16499,
      percent: "+99%",
      data: [861, 1002, 3195, 1715, 3666, 2415, 3645],
      unit: "个"
    },
    {
      type: "double",
      icon: Smile,
      bgColor: "#f6f4fe",
      color: "#7846e5",
      duration: 100,
      name: "接入设备数",
      value: 100,
      percent: "+100%",
      data: [23, 0],
      unit: "个"
    }
  ]);
  const projectList = [
    { id: 1, name: "测试县污水处理系统" },
    {
      id: 2,
      name: "测试农村垃圾清运监控系统"
    },
    {
      id: 3,
      name: "测试电梯监控系统"
    }
  ];
  // 选中的项目
  const curProject = ref(projectList[0].id);
  // 项目数据
  const curProjectData = reactive([
    {
      name: "数据传感点",
      // 按月
      data: [100, 200, 0, 40, 50, 60, 70, 80, 90, 100, 34, 43],
      itemStyle: {
        color: "#e85f33"
      },
      emphasis: {
        focus: "series"
      }
    },
    {
      name: "触发器数",
      // 按月
      data: [100, 200, 0, 40, 50, 60, 70, 83, 90, 10, 34, 43],
      itemStyle: {
        color: "#26ce83"
      },
      emphasis: {
        focus: "series"
      }
    },
    {
      name: "接入设备数",
      // 按月
      data: [0, 0, 0, 40, 50, 60, 70, 83, 90, 10, 34, 43],
      itemStyle: {
        color: "#7846e5"
      },
      emphasis: {
        focus: "series"
      }
    }
  ]);
  // 报警数据
  const alarmData = reactive([
    {
      name: "(设傍屯)2号提升泵异常报警",
      alarmTime: dayjs().format("YYYY-MM-DD HH:mm:ss")
    },
    {
      name: "	(甘水屯)清水池水位异常报警",
      alarmTime: dayjs().format("YYYY-MM-DD HH:mm:ss")
    },
    {
      name: "(甘水屯)1号清水泵异常报警",
      alarmTime: dayjs().format("YYYY-MM-DD HH:mm:ss")
    },
    {
      name: "(坡莫屯)2号曝气机异常报警",
      alarmTime: dayjs().format("YYYY-MM-DD HH:mm:ss")
    },
    {
      name: "(甘水屯)3号清水泵异常报警",
      alarmTime: dayjs().format("YYYY-MM-DD HH:mm:ss")
    },
    {
      name: "(甘水屯)4号清水泵异常报警",
      alarmTime: dayjs().format("YYYY-MM-DD HH:mm:ss")
    }
  ]);
  function onProjectChange() {
    // 随机改变数据
    curProjectData[0].data = generateRandomData();
    curProjectData[1].data = generateRandomData();
    curProjectData[2].data = generateRandomData();
  }
  function generateRandomData(num = 12, min = 0, max = 10000) {
    return Array.from(
      { length: num },
      () => Math.floor(Math.random() * (max - min + 1)) + min
    );
  }
  return {
    chartData,
    projectList,
    curProject,
    curProjectData,
    alarmData,
    onProjectChange
  };
}
