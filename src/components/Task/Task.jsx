import { useReducer, useEffect } from "react";
import {
  getFromLocale,
  getSelectedList,
  getUniqueId,
  KEY_STORE,
  saveSectionDataToLocale,
  SECTION_COMPONENT,
} from "../../provider";
import {
  SubmitTaskFormButton,
  ClearTaskButton,
  DeleteTaskButton
} from './TaskActionButtons';
import {
  infoTaskUpdater
} from './methods';
import TasksMenu from "./TasksMenu";
import TasksInfo from "./TasksInfo";

const INITIAL_STATE = {
  taskName : "",
  taskData : [],
  selectedListName : "",
  editModeState : false,
  fetchDataFromLocalComplete : false
}

const HANDLE_CASE = {
  COMPLETE : 'handle_complete',
  CLEAR : 'handle_clear',
  DELETE : 'handle_delete',
  ADD : 'handle_add',
  EDIT : 'handle_edit',
  CHANGE : 'handle_change',
  GET : 'handle_get',
}

function reducer(state, {type, payload}) {
  switch(type) {
    case HANDLE_CASE.CHANGE :
      return {
        ...state,
        taskName : payload
      }

    case HANDLE_CASE.ADD :
      if(payload.currentList === null || payload.taskName === "") return {
        ...state,
        taskName : ""
      };

      const {currentList, taskName} = payload;

      // Check Previous Task Data
      if(state.taskData && state.taskData.length !== 0 && state.taskData.some((data) => data.id === currentList.id)) {
        const taskData_add = state.taskData.map(data => {
          if(data.id === currentList.id) {
            const newTask = {
              taskName,
              complete : false,
              id : getUniqueId()
            };
            
            // update tasks section
            data.tasks.push(newTask);
          }

          // update info task data
          const result = infoTaskUpdater(data);
          return result;
        });

        saveSectionDataToLocale({
          section : SECTION_COMPONENT.TASK,
          value : taskData_add
        });

        return {
          ...state,
          taskData : taskData_add,
          taskName : ""
        }
      }

      const initialTaskDataStructure = [
        ...state.taskData,
        {
          listName : currentList.listName,
          id : currentList.id,
          tasks : [
            {
              taskName,
              complete : false,
              id : getUniqueId()
            }
          ],
          tasksAmount : 1,
          completedTasks : 0,
          uncompletedTasks : 1 
        }
      ];

      saveSectionDataToLocale({
        section : SECTION_COMPONENT.TASK,
        value : initialTaskDataStructure
      });

      return {
        ...state,
        taskData : initialTaskDataStructure,
        taskName : ""
      }

    case HANDLE_CASE.COMPLETE : 
      const taskData_complete = state.taskData.map(outerData => {
        if(outerData.id === payload.currentList.id) {
          outerData.tasks.map(task => {
            if(task.id === payload.id) task.complete = !task.complete;
            return task;
          });
        }

        // update info task data
        const result = infoTaskUpdater(outerData);
        return result;
      });

      saveSectionDataToLocale({
        section : SECTION_COMPONENT.TASK,
        value : taskData_complete
      });

      return {
        ...state,
        taskData : taskData_complete
      };

    case HANDLE_CASE.DELETE :
      if(!payload || !state.taskData.length) return state;

      const taskData_delete = state.taskData.map(data => {
        if(data.id === payload.id) {
          const newDataForTasksSection = data.tasks.filter(({complete}) => complete === false);
          data.tasks = newDataForTasksSection;
        }

        // update info task data
        const result = infoTaskUpdater(data);
        return result;
      });

      saveSectionDataToLocale({
        section : SECTION_COMPONENT.TASK,
        value : taskData_delete
      })

      return {
        ...state,
        taskData : taskData_delete
      };

    case HANDLE_CASE.CLEAR :
      if(!payload) return state;

      const taskData_clear = state.taskData.map(data => {
        if(data.id === payload.id && data.tasks.length) {
          const lengthTasksData = data.tasks.length;
          data.tasks.splice(0, lengthTasksData);
        }

        // update info task data
        const result = infoTaskUpdater(data);
        return result;
      });

      saveSectionDataToLocale({
        section : SECTION_COMPONENT.TASK,
        value : taskData_clear
      });

      return {
        ...state,
        taskData : taskData_clear,
        taskName : ""
      };

    // Selected List
    case HANDLE_CASE.GET :
      const {currentDataList, listDataFull} = payload;

      if(!state.fetchDataFromLocalComplete) {
        const taskData_get = getFromLocale(KEY_STORE);
        if(taskData_get && taskData_get['task']) {
          const selectedList = getSelectedList(taskData_get['list']);
          return {
            ...state,
            selectedListName : selectedList.listName,
            taskData : taskData_get['task'] || [],
            fetchDataFromLocalComplete : true
          }
        }

        return {
          ...state,
          selectedListName : "",
          fetchDataFromLocalComplete : true,
        }
      }

      // Synchronize Task Data with List Data
      if(listDataFull && !Array.isArray(listDataFull) && listDataFull.eventIndicator) {
        // Remove List Data
        if(listDataFull.eventIndicator === HANDLE_CASE.DELETE || listDataFull.eventIndicator === HANDLE_CASE.CLEAR) {
          const {listData, trash_idDeletedList} = listDataFull;  

          // Clear Action || Empty Task Data
          if(!listData.length || !state.taskData.length) {
            return {
              ...state,
              selectedListName : "",
              taskName : "",
              taskData : []
            }
          }

          // Delete Action
          const taskData_removeDataList = state.taskData.filter(({id}) => id !== trash_idDeletedList);
          
          saveSectionDataToLocale({
            section : SECTION_COMPONENT.TASK,
            value : taskData_removeDataList
          });

          return {
            ...state,
            selectedListName : "",
            taskData : taskData_removeDataList
          }
        }

        // Edit List Data
        if(listDataFull.eventIndicator === HANDLE_CASE.EDIT) {
          const {listData, idEditedList} = payload.listDataFull;
          const taskData_editedList = state.taskData.map(data => {
            if(data.id === idEditedList) {
              const listNameOfeditedList = listData.filter(({id}) => id === idEditedList)[0]['listName'];
              data.listName = listNameOfeditedList;
            }

            return data;
          });

          saveSectionDataToLocale({
            section : SECTION_COMPONENT.TASK,
            value : taskData_editedList
          });

          console.log(state.taskData)

          return {
            ...state,
            selectedListName : "",
            taskData : taskData_editedList
          }
        }
      }
      
      if(!currentDataList) return {
        ...state,
        selectedListName : ""
      }

      return {
        ...state,
        selectedListName : currentDataList.listName
      }
    
    default :
      return state;
  }
}

function Task({ dispatchTask, currentDataList, listDataFull }) {
  const [{selectedListName, taskName, taskData, editModeState}, setTaskData] = useReducer(reducer, INITIAL_STATE);
  
  useEffect(() => {
    setTaskData({
      type : HANDLE_CASE.GET,
      payload : {
        currentDataList,
        listDataFull
      }
    });
  }, [currentDataList, listDataFull]);

  return (
    <div className="m-8">
      <h1 className="text-2xl">Tugas</h1>

      {/* Task title */}
      <h1 className="my-4 font-semibold">
        {selectedListName ? 
        `◈ ${selectedListName}` :
        'Belum ada list yang dipilih!'} 
      </h1>

      {/* Task Menu */}
      <TasksMenu taskData={taskData} currentList={currentDataList} dispatch={setTaskData} />

      {/* Tasks Info */}
      <TasksInfo taskData={taskData} currentList={currentDataList}/>

      {/* Task Form */}
      <form
        className="flex"
        onSubmit={(e) => {
          e.preventDefault();
          setTaskData({
            type : HANDLE_CASE.ADD,
            payload : {
              currentList : currentDataList,
              taskName
            }
          })
        }}>
        <label htmlFor="addTask">
          Tambah Tugas :
          <input
            id="addTask"
            autoComplete="off"
            className="outline-none mx-2 px-2 border-b-2 
          border-slate-800"
            type="text"
            onChange={(e) => {
              setTaskData({
                type : HANDLE_CASE.CHANGE,
                payload : e.target.value
              })
            }}
            value={taskName}
          />
        </label>

        <SubmitTaskFormButton dispatch={setTaskData} payload={{ 
          currentList : currentDataList,
          taskName
        }}/>
      </form>

      {/* Clear All Task */}
      <ClearTaskButton dispatch={setTaskData} payload={currentDataList}/>

      {/* Delete All Selected Tasks */}
      <DeleteTaskButton dispatch={setTaskData} payload={currentDataList}/>
    </div>
  )
}

export {
  Task,
  HANDLE_CASE
}