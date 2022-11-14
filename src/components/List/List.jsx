import React, { useEffect, useReducer, useRef } from "react";
import DefaultListPlaceholder from "./DefaultListPlaceholder";
import {
  ActionListButtons,
  SubmitListFormButton,
  ClearListButton,
} from "./ListActionButtons";
import {
  KEY_STORE,
  SECTION_COMPONENT,
  deleteFromLocale,
  getFromLocale,
  getUniqueId,
  getSelectedList,
  saveSectionDataToLocale,
  getDate
} from "../../provider";
import { 
  reCreateData,
} from "./methods";

const INITIAL_STATE = {
  listName: "",
  listData: [],
  editModeState: false,
  dispatchDataList: false,
  fetchDataLocalComplete: false
};
const HANDLE_CASE = {
  CHANGE: "handle_change",
  ADD: "handle_add",
  SELECT: "handle_select",
  EDIT: "handle_edit",
  DELETE: "handle_delete",
  CLEAR: "handle_clear",
  GET: "handle_getFromLocale",
  DEBUG : 'handle_debug'
};

function reducer(state, { type, payload }) {
  switch (type) {
    case HANDLE_CASE.DEBUG : 
      console.log(payload)
      return state;

    case HANDLE_CASE.CHANGE:
      return {
        ...state,
        listName: payload,
      };

    case HANDLE_CASE.ADD:
      if (!payload) return state;

      const data = [
        ...state.listData,
        {
          id: getUniqueId(),
          active: false,
          listName: payload,
          date : getDate()
        },
      ];

      saveSectionDataToLocale({
        section: SECTION_COMPONENT.LIST,
        value: data,
      });

      return {
        ...state,
        listName: "",
        listData: data,
        dispatchDataList : false
      };

    //Dispath Data List Event
    case HANDLE_CASE.GET:
      const listData_get = payload.dataLocal.map((list) => ({
        id: getUniqueId(),
        ...list,
      }));

      return {
        ...state,
        listName: "",
        listData: listData_get,
        fetchDataLocalComplete: true,
        dispatchDataList : () => {
          payload.dispatchApp({
            type : SECTION_COMPONENT.LIST,
            payload : {
              currentList : getSelectedList(listData_get),
              listDataFull : listData_get
            }
          })
        },
      };

    //Dispath Data List Event
    case HANDLE_CASE.DELETE:
      const listData_delete = state.listData.filter(({ id }) => id !== payload.idForDelete);

      saveSectionDataToLocale({
        section: SECTION_COMPONENT.LIST,
        value: listData_delete,
      });

      // Task Checker 
      const taskData = getFromLocale(KEY_STORE)['task'];
      if(taskData) {
        const residualData = taskData.filter(({id}) => id !== payload.idForDelete);

        saveSectionDataToLocale({
          section : SECTION_COMPONENT.TASK,
          value: residualData.length ? residualData : null
        })
      }

      return {
        ...state,
        listData: listData_delete,
        dispatchDataList : () => {
          payload.dispatchApp({
            type : SECTION_COMPONENT.LIST,
            payload : {
              currentList : getSelectedList(listData_delete),
              listDataFull : {
                listData : listData_delete,
                trash_idDeletedList : payload.idForDelete,
                eventIndicator : HANDLE_CASE.DELETE
              }
            }
          })
        },
      };

    //Dispath Data List Event
    case HANDLE_CASE.EDIT:
      if (state.editModeState && payload.changeListData) {
        const { value, listData, dispatchApp } = payload;
        const listData_edit = reCreateData({
          type: HANDLE_CASE.EDIT,
          payload: { value, listData, id: state.currentIdSelectedList },
        });

        saveSectionDataToLocale({
          section: SECTION_COMPONENT.LIST,
          value: listData_edit,
        });

        return {
          ...state,
          listName: "",
          listData: listData_edit,
          dispatchDataList : () => {
            dispatchApp({
              type : SECTION_COMPONENT.LIST,
              payload : {
                currentList : getSelectedList(listData_edit),
                listDataFull : {
                  listData : listData_edit,
                  idEditedList : state.currentIdSelectedList,
                  eventIndicator : HANDLE_CASE.EDIT
                }
              }
            })
          },
          editModeState: false,
        };
      }

      return {
        ...state,
        listName: payload.listName,
        dispatchDataList : false,
        editModeState: {
          editMode: true,
          changeListData: false,
          elementToFocus: payload.element,
        },
      };

    //Dispath Data List Event
    case HANDLE_CASE.SELECT:
      const { listData, selectedList, dispatchApp } = payload;
      const listData_select = reCreateData({
        type: HANDLE_CASE.SELECT,
        payload: {
          listData,
          id: payload.id,
          selectedList,
          prevSelectedList: state.prevSelectedList || null,
        },
      });

      saveSectionDataToLocale({
        section: SECTION_COMPONENT.LIST,
        value: listData_select,
      });

      return {
        ...state,
        listData: listData_select,
        prevSelectedList: selectedList,
        editModeState: false,
        currentIdSelectedList: payload.id,
        dispatchDataList : () => {
          dispatchApp({
            type : SECTION_COMPONENT.LIST,
            payload : {
              currentList : getSelectedList(listData_select),
              listDataFull : listData_select,
            }
          })
        },
      };

    //Dispath Data List Event
    case HANDLE_CASE.CLEAR:
      deleteFromLocale(KEY_STORE);
      return {
        ...state,
        listName: "",
        listData: [],
        dispatchDataList : () => {
          payload.dispatchApp({
            type : SECTION_COMPONENT.LIST,
            payload : {
              currentList : [],
              listDataFull : {
                listData : [],
                trash_idDeletedList : [],
                eventIndicator : HANDLE_CASE.CLEAR
              }
            }
          })
        }
      };

    default:
      return state;
  }
}

function List({ dispatchApp }) {
  const [{ listName, listData, editModeState, dispatchDataList, fetchDataLocalComplete }, setListsData] = useReducer(
    reducer,
    INITIAL_STATE
  );
  const inputFormElement = useRef();

  useEffect(() => {
    // Dispath data to parent component
    if(typeof dispatchDataList === 'function' && fetchDataLocalComplete) dispatchDataList();

    // Get data from local storage when page reloading
    if(!editModeState && !fetchDataLocalComplete) {
      const dataFromLocale = getFromLocale(KEY_STORE);
      if (dataFromLocale) {
        setListsData({ 
          type: HANDLE_CASE.GET, 
          payload: {
            dataLocal : dataFromLocale['list'],
            dispatchApp
          }
        });
      }
    }

    // Edit Mode
    if (editModeState && editModeState.editMode) {
      editModeState.elementToFocus.selectionStart = 0;
      editModeState.elementToFocus.selectionEnd = listName.length;
      editModeState.elementToFocus.focus();
    }
  }, [editModeState, dispatchDataList]);

  return (
    <div className="m-8">
      <h1 className="text-2xl"> List </h1>

      {/* List Menu */}
      {!listData.length ? (
        <DefaultListPlaceholder />
      ) : (
        <ul className="my-4" id="ListContainer">
          {listData.map(({ id, listName, active }) => (
            <li key={id}>
              <label
                className="selection:bg-transparent"
                htmlFor={`list-${id}`}>
                <input
                  id={`list-${id}`}
                  className="mr-2"
                  type="checkbox"
                  checked={active}
                  onChange={(e) =>
                    setListsData({
                      type: HANDLE_CASE.SELECT,
                      payload: {
                        id,
                        listData,
                        selectedList: e.target,
                        dispatchApp
                      },
                    })
                  }
                />
                {listName}

                {/* Action Buttons */}
                {active && (
                  <ActionListButtons
                    dispatch={{ setListsData, dispatchApp }}
                    idForDelete={id}
                    elementToFocus={inputFormElement.current}
                    listNameForEdit={listName}
                  />
                )}
              </label>
            </li>
          ))}
        </ul>
      )}

      {/* List Form */}
      <form
        className="flex"
        onSubmit={(e) => {
          e.preventDefault();
          setListsData({
            type:
              editModeState && editModeState.editMode
                ? HANDLE_CASE.EDIT
                : HANDLE_CASE.ADD,
            payload:
              editModeState && editModeState.editMode
                ? {
                    listData,
                    value: listName,
                    changeListData: true,
                    dispatchApp
                  }
                : listName,
          });
        }}
      >
        <label htmlFor="addList">
          Tambah List :
          <input
            id="addList"
            autoComplete="off"
            className="outline-none mx-2 px-2 border-b-2 
          border-slate-800 "
            type="text"
            ref={inputFormElement}
            onChange={(e) => {
              setListsData({
                type: HANDLE_CASE.CHANGE,
                payload: e.target.value,
              });
            }}
            value={listName}
          />
        </label>

        <SubmitListFormButton
          dispatch={setListsData}
          payload={
            editModeState && editModeState.editMode
              ? {
                  listData,
                  value: listName,
                  changeListData: true,
                  dispatchApp
                }
              : listName
          }
          editMode={
            editModeState && editModeState.editMode
              ? editModeState.editMode
              : editModeState
          }
        />
      </form>

      {/* Clear List Menu */}
      <ClearListButton dispatch={{ setListsData, dispatchApp }} listData={listData}/>
    </div>
  );
}

export { List, HANDLE_CASE  }