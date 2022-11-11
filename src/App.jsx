import React from "react";
import { useReducer } from "react";
import { List } from "./components/List";
import { Task } from "./components/Task";
import { SECTION_COMPONENT } from './provider';

const INITIAL_STATE = {
  selectedListData : null,
  selectedTaskData : null
}

function reducer(state, {type, payload}) {
  switch(type) {
    case SECTION_COMPONENT.LIST : 
      if(!payload.length) return {
        ...state,
        selectedListData : null
      }

      return {
        ...state,
        selectedListData : payload[0]
      }

    case SECTION_COMPONENT.TASK : 

    default :
      return state;
  }
}

function App() {
  const [{ selectedListData, selectedTaskData }, setSelectedData] = useReducer(reducer, INITIAL_STATE);

  return (
    <React.Fragment>
      <List dispatchApp={setSelectedData}/>
      <Task 
      dataList={selectedListData}
      dispatchTask={setSelectedData}/>
    </React.Fragment>
  )
}

export default App;
