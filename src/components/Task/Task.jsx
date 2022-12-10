import { useReducer, useEffect } from "react";
import {
  getFromLocale,
  getSelectedList,
  getUniqueId,
  KEY_STORE,
  saveSectionDataToLocale,
  SECTION_COMPONENT,
} from "../../provider";
import { HANDLE_CASE, infoTaskUpdater } from "./task_fractionCollections";
import TaskHead from "./Head/TaskHead";
import TaskBody from "./Body/TaskBody";

const INITIAL_STATE = {
  taskName: "",
  taskData: [],
  selectedListName: "",
  editModeState: false,
  fetchDataFromLocalComplete: false,
};

function reducer(state, { type, payload }) {
  switch (type) {
    case HANDLE_CASE.CHANGE:
      return {
        ...state,
        taskName: payload,
      };

    case HANDLE_CASE.ADD:
      if (payload.currentList === null || payload.taskName === "")
        return {
          ...state,
          taskName: "",
        };

      const { currentList, taskName } = payload;

      // Check Previous Task Data
      if (
        state.taskData &&
        state.taskData.length !== 0 &&
        state.taskData.some((data) => data.id === currentList.id)
      ) {
        const taskData_add = state.taskData.map((data) => {
          if (data.id === currentList.id) {
            const newTask = {
              taskName,
              complete: false,
              id: getUniqueId(),
            };

            // update tasks section
            data.tasks.push(newTask);
          }

          // update info task data
          const result = infoTaskUpdater(data);
          return result;
        });

        saveSectionDataToLocale({
          section: SECTION_COMPONENT.TASK,
          value: taskData_add,
        });

        return {
          ...state,
          taskData: taskData_add,
          taskName: "",
        };
      }

      const initialTaskDataStructure = [
        ...state.taskData,
        {
          listName: currentList.listName,
          id: currentList.id,
          tasks: [
            {
              taskName,
              complete: false,
              id: getUniqueId(),
            },
          ],
          tasksAmount: 1,
          completedTasks: 0,
          uncompletedTasks: 1,
        },
      ];

      saveSectionDataToLocale({
        section: SECTION_COMPONENT.TASK,
        value: initialTaskDataStructure,
      });

      return {
        ...state,
        taskData: initialTaskDataStructure,
        taskName: "",
      };

    case HANDLE_CASE.COMPLETE:
      const taskData_complete = state.taskData.map((outerData) => {
        if (outerData.id === payload.currentList.id) {
          outerData.tasks.map((task) => {
            if (task.id === payload.id) task.complete = !task.complete;
            return task;
          });
        }

        // update info task data
        const result = infoTaskUpdater(outerData);
        return result;
      });

      saveSectionDataToLocale({
        section: SECTION_COMPONENT.TASK,
        value: taskData_complete,
      });

      return {
        ...state,
        taskData: taskData_complete,
      };

    case HANDLE_CASE.DELETE:
      if (!payload || !state.taskData.length) return state;

      const taskData_delete = state.taskData.map((data) => {
        if (data.id === payload.id) {
          const newDataForTasksSection = data.tasks.filter(
            ({ complete }) => complete === false
          );
          data.tasks = newDataForTasksSection;
        }

        // update info task data
        const result = infoTaskUpdater(data);
        return result;
      });

      saveSectionDataToLocale({
        section: SECTION_COMPONENT.TASK,
        value: taskData_delete,
      });

      return {
        ...state,
        taskData: taskData_delete,
      };

    case HANDLE_CASE.CLEAR:
      if (!payload) return state;

      const taskData_clear = state.taskData.map((data) => {
        if (data.id === payload.id && data.tasks.length) {
          const lengthTasksData = data.tasks.length;
          data.tasks.splice(0, lengthTasksData);
        }

        // update info task data
        const result = infoTaskUpdater(data);
        return result;
      });

      saveSectionDataToLocale({
        section: SECTION_COMPONENT.TASK,
        value: taskData_clear,
      });

      return {
        ...state,
        taskData: taskData_clear,
        taskName: "",
      };

    // Selected List
    case HANDLE_CASE.GET:
      const { currentDataList, listDataFull } = payload;

      if (!state.fetchDataFromLocalComplete) {
        const taskData_get = getFromLocale(KEY_STORE);
        if (taskData_get && taskData_get["task"]) {
          const selectedList = getSelectedList(taskData_get["list"]);
          return {
            ...state,
            selectedListName: selectedList.listName,
            taskData: taskData_get["task"] || [],
            fetchDataFromLocalComplete: true,
          };
        }

        return {
          ...state,
          selectedListName: "",
          fetchDataFromLocalComplete: true,
        };
      }

      // Synchronize Task Data with List Data
      if (
        listDataFull &&
        !Array.isArray(listDataFull) &&
        listDataFull.eventIndicator
      ) {
        // Remove List Data
        if (
          listDataFull.eventIndicator === HANDLE_CASE.DELETE ||
          listDataFull.eventIndicator === HANDLE_CASE.CLEAR
        ) {
          const { listData, trash_idDeletedList } = listDataFull;

          // Clear Action || Empty Task Data
          if (!listData.length || !state.taskData.length) {
            return {
              ...state,
              selectedListName: "",
              taskName: "",
              taskData: [],
            };
          }

          // Delete Action
          const taskData_removeDataList = state.taskData.filter(
            ({ id }) => id !== trash_idDeletedList
          );

          saveSectionDataToLocale({
            section: SECTION_COMPONENT.TASK,
            value: taskData_removeDataList,
          });

          return {
            ...state,
            selectedListName: "",
            taskData: taskData_removeDataList,
          };
        }

        // Edit List Data
        if (listDataFull.eventIndicator === HANDLE_CASE.EDIT) {
          let newSelectedListName = null;
          const { listData, idEditedList } = payload.listDataFull;
          const taskData_editedList = state.taskData.map((data) => {
            if (data.id === idEditedList) {
              const listNameOfeditedList = listData.filter(
                ({ id }) => id === idEditedList
              )[0]["listName"];
              data.listName = listNameOfeditedList;
            }

            return data;
          });

          saveSectionDataToLocale({
            section: SECTION_COMPONENT.TASK,
            value: taskData_editedList,
          });

          return {
            ...state,
            selectedListName: payload.currentDataList.listName || "",
            taskData: taskData_editedList,
          };
        }
      }

      if (!currentDataList)
        return {
          ...state,
          selectedListName: "",
        };

      return {
        ...state,
        selectedListName: currentDataList.listName,
      };

    default:
      return state;
  }
}

function Task({ dispatchApp, currentDataList, listDataFull, appData }) {
  const [{ selectedListName, taskName, taskData, editModeState }, setTaskData] =
    useReducer(reducer, INITIAL_STATE);

  useEffect(() => {
    setTaskData({
      type: HANDLE_CASE.GET,
      payload: {
        currentDataList,
        listDataFull,
      },
    });
  }, [currentDataList, listDataFull]);

  return (
    <section className="mb-8">
      {/* Task Head */}
      <TaskHead
        currentDataList={currentDataList}
        selectedListName={selectedListName}
        taskName={taskName}
        dispatch={setTaskData}
      />

      {/* Task Body */}
      <TaskBody
        taskData={taskData}
        currentList={currentDataList}
        dispatch={setTaskData}
        appData={appData}
      />
    </section>
  );
}

export { Task };
