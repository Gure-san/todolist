import EmptyTaskCover from "./EmtpyTaskCover";
import TaskMenu from "./TaskMenu";
import { SEPARATOR_TYPE, Separator, MODAL_SECTION } from "../../../provider";
import { useEffect, useReducer, useState } from "react";
import { getIndexTaskInfo } from "./helper";
import { HANDLE_CASE } from "../task_fractionCollections";

const HANDLE_CASE_TASKBODY = {
  GET: "handle_get",
  UPDATE_INFO: "hanlde_update_info",
  RESET: "handle_reset",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case HANDLE_CASE_TASKBODY.GET:
      const taskBodyData_get = payload.taskData.filter((task) => {
        if (task.id !== payload.currentList.id) return null;
        return task;
      })[0];

      if (!taskBodyData_get || !taskBodyData_get.tasks.length) return null;

      const initialTaskInfo = {
        tasksAmount: `${taskBodyData_get.tasksAmount} Tugas`,
        complete: `${taskBodyData_get.completedTasks} Selesai`,
        uncomplete: `${taskBodyData_get.uncompletedTasks} Belum Selesai`,
      };

      if (state && state.currentTaskInfo) {
        return {
          ...state,
          taskMenu: taskBodyData_get.tasks,
          taskInfo: initialTaskInfo,
          deleteCompletedTasks: taskBodyData_get.completedTasks ? true : false,
          currentTaskInfo: {
            key: state.currentTaskInfo.key,
            value: initialTaskInfo[state.currentTaskInfo.key],
          },
        };
      }

      return {
        ...state,
        taskMenu: taskBodyData_get.tasks,
        taskInfo: initialTaskInfo,
        deleteCompletedTasks: taskBodyData_get.completedTasks ? true : false,
        currentTaskInfo: {
          key: Object.keys(initialTaskInfo)[0],
          value: initialTaskInfo.tasksAmount,
        },
      };

    case HANDLE_CASE_TASKBODY.UPDATE_INFO:
      const taskInfoType = Object.keys(state.taskInfo);
      const key = taskInfoType[getIndexTaskInfo(taskInfoType.length)];
      const taskInfo = state.taskInfo[key];
      return {
        ...state,
        currentTaskInfo: {
          key,
          value: taskInfo,
        },
      };

    case HANDLE_CASE_TASKBODY.RESET:
      const taskBodyData_reset = null;
      return taskBodyData_reset;

    default:
      return state;
  }
}

export default function TaskBody({ taskData, currentList, dispatch, appData }) {
  const [taskBodyData, setTaskBodyData] = useReducer(reducer, null);

  useEffect(() => {
    if (taskData && taskData.length && currentList) {
      setTaskBodyData({
        type: HANDLE_CASE_TASKBODY.GET,
        payload: {
          taskData,
          currentList,
        },
      });
    } else {
      setTaskBodyData({ type: HANDLE_CASE_TASKBODY.RESET });
    }
  }, [taskData, currentList]);

  if (!taskBodyData) return <EmptyTaskCover />;

  return (
    <section>
      <Separator
        modalSection={MODAL_SECTION.TASKBODY_DELETE}
        type={SEPARATOR_TYPE.TASK_INFO}
        extraStyle={{
          outer: "my-8",
          separator: "bg-secondary-150",
        }}
        payload={
          taskBodyData && {
            keyDispatches: ["deleteCompletedTasks", "updateTaskInfo"],
            deleteCompletedTasks: taskBodyData.deleteCompletedTasks,
            currentTaskInfo: taskBodyData.currentTaskInfo.value,
          }
        }
        dispatches={{
          deleteCompletedTasks: () => {
            dispatch({
              type: HANDLE_CASE.DELETE,
              payload: {
                id: currentList.id,
              },
            });
          },
          updateTaskInfo: () => {
            setTaskBodyData({ type: HANDLE_CASE_TASKBODY.UPDATE_INFO });
          },
        }}
      />

      <TaskMenu
        dispatch={dispatch}
        filteredTaskData={taskBodyData && taskBodyData.taskMenu}
        currentList={currentList}
      />

      <Separator
        type={SEPARATOR_TYPE.CLEAR}
        modalSection={MODAL_SECTION.TASKBODY_CLEAR}
        extraStyle={{
          outer: "my-8",
          separator: "bg-secondary-150",
        }}
        dispatches={{
          dispatchCallbackClear: () => {
            dispatch({
              type: HANDLE_CASE.CLEAR,
              payload: currentList,
            });
          },
        }}
        payload={{ theme: appData.theme }}
      />
    </section>
  );
}
