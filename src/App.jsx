import React from "react";
import { useReducer } from "react";
import { List } from "./components/List";
import { Task } from "./components/Task";
import { SECTION_COMPONENT } from './provider';

const INITIAL_STATE = {
  LIST_DATA : null,
  TASK_DATA : null
}

function reducer(state, {type, payload}) {
  switch(type) {
    case SECTION_COMPONENT.LIST : 
      const {currentList, listDataFull} = payload;

      return {
        ...state,
        LIST_DATA : {
          currentList : currentList.length ? currentList[0] : null,
          listDataFull
        },
      }

    case SECTION_COMPONENT.TASK : 

    default :
      return state;
  }
}

function App() {
  const [{ LIST_DATA, TASK_DATA }, setSelectedData] = useReducer(reducer, INITIAL_STATE);

  return (
    <React.Fragment>
      <List dispatchApp={setSelectedData}/>
      <Task 
      listDataFull={!LIST_DATA ? LIST_DATA : LIST_DATA.listDataFull}
      currentDataList={!LIST_DATA ? LIST_DATA : LIST_DATA.currentList}
      dispatchTask={setSelectedData}/>
    </React.Fragment>
  )
}

export default App;
