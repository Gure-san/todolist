import React, { useEffect, useReducer, useRef } from "react";
import ListHead from "./Head/ListHead";
import ListBody from "./Body/ListBody";
import {
  KEY_STORE,
  SECTION_COMPONENT,
  getFromLocale,
  getUniqueId,
  getSelectedList,
  saveSectionDataToLocale,
  getDate,
} from "../../provider";
import { HANDLE_CASE } from "./list_fractionCollection";

const INITIAL_STATE = {
  listName: "",
  listData: [],
  editModeState: false,
  dispatchDataList: false,
  fetchDataLocalComplete: false,
};

function reCreateData({ type, payload }) {
  switch (type) {
    case HANDLE_CASE.EDIT:
      const editListData = payload.listData.map((list) => ({
        ...list,
        active: false,
        listName: list.id === payload.id ? payload.value : list.listName,
      }));

      return editListData;

    case HANDLE_CASE.SELECT:
      const { listData, selectedList, prevSelectedList } = payload;
      const resetSelectedData = listData.map((list) => {
        if (listData.length <= 1 || selectedList === prevSelectedList)
          return list;
        return {
          ...list,
          active: false,
        };
      });

      const dataWithSelectedList = resetSelectedData.map((list) => {
        return {
          ...list,
          active: list.id === payload.id ? !list.active : list.active,
        };
      });

      return dataWithSelectedList;
  }
}

function reducer(state, { type, payload }) {
  switch (type) {
    case HANDLE_CASE.CHANGE:
      return {
        ...state,
        listName: payload,
      };

    case HANDLE_CASE.ADD:
      if (!payload) return state;

      const { date, day } = getDate();
      const listData_add = [
        ...state.listData,
        {
          id: getUniqueId(),
          active: false,
          listName: payload,
          date,
          day,
        },
      ];

      saveSectionDataToLocale({
        section: SECTION_COMPONENT.LIST,
        value: listData_add,
      });

      return {
        ...state,
        listName: "",
        listData: listData_add,
        dispatchDataList: false,
      };

    //Dispath Data List Event
    case HANDLE_CASE.EDIT:
      if (!payload || !payload.newListName) return state;

      const listData_edit = state.listData.map((data) => {
        if (data.id === payload.id) data.listName = payload.newListName;
        return data;
      });

      saveSectionDataToLocale({
        section: SECTION_COMPONENT.LIST,
        value: listData_edit,
      });

      return {
        ...state,
        listName: "",
        listData: listData_edit,
        dispatchDataList: () => {
          payload.dispatchApp({
            section: SECTION_COMPONENT.LIST,
            payload: {
              currentList: getSelectedList(listData_edit),
              listDataFull: {
                listData: listData_edit,
                idEditedList: state.currentIdSelectedList,
                eventIndicator: HANDLE_CASE.EDIT,
              },
            },
          });
        },
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
        dispatchDataList: () => {
          payload.dispatchApp({
            section: SECTION_COMPONENT.LIST,
            payload: {
              currentList: getSelectedList(listData_get),
              listDataFull: listData_get,
            },
          });
        },
      };

    //Dispath Data List Event
    case HANDLE_CASE.DELETE:
      const listData_delete = state.listData.filter(
        ({ id }) => id !== payload.idForDelete
      );

      saveSectionDataToLocale({
        section: SECTION_COMPONENT.LIST,
        value: listData_delete,
      });

      // Task Checker
      const taskData = getFromLocale(KEY_STORE)["task"];
      if (taskData) {
        const residualData = taskData.filter(
          ({ id }) => id !== payload.idForDelete
        );

        saveSectionDataToLocale({
          section: SECTION_COMPONENT.TASK,
          value: residualData.length ? residualData : null,
        });
      }

      return {
        ...state,
        listData: listData_delete,
        dispatchDataList: () => {
          payload.dispatchApp({
            section: SECTION_COMPONENT.LIST,
            payload: {
              currentList: getSelectedList(listData_delete),
              listDataFull: {
                listData: listData_delete,
                trash_idDeletedList: payload.idForDelete,
                eventIndicator: HANDLE_CASE.DELETE,
              },
            },
          });
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
        dispatchDataList: () => {
          dispatchApp({
            section: SECTION_COMPONENT.LIST,
            payload: {
              currentList: getSelectedList(listData_select),
              listDataFull: listData_select,
            },
          });
        },
      };

    //Dispath Data List Event
    case HANDLE_CASE.CLEAR:
      saveSectionDataToLocale({
        section: SECTION_COMPONENT.LIST,
        value: null,
      });

      return {
        ...state,
        listName: "",
        listData: [],
        dispatchDataList: () => {
          payload.dispatchApp({
            section: SECTION_COMPONENT.LIST,
            payload: {
              currentList: [],
              listDataFull: {
                listData: [],
                trash_idDeletedList: [],
                eventIndicator: HANDLE_CASE.CLEAR,
              },
            },
          });
        },
      };

    default:
      return state;
  }
}

function List({ dispatchApp, appData }) {
  const [
    {
      listName,
      listData,
      editModeState,
      dispatchDataList,
      fetchDataLocalComplete,
    },
    setListsData,
  ] = useReducer(reducer, INITIAL_STATE);
  const inputFormElement = useRef();

  useEffect(() => {
    // Dispath data to parent component
    if (typeof dispatchDataList === "function" && fetchDataLocalComplete)
      dispatchDataList();
    // Get data from local storage when page reloading
    if (!editModeState && !fetchDataLocalComplete) {
      const dataFromLocale = getFromLocale(KEY_STORE);
      if (dataFromLocale && dataFromLocale["list"]) {
        setListsData({
          type: HANDLE_CASE.GET,
          payload: {
            dataLocal: dataFromLocale["list"],
            dispatchApp,
          },
        });
      }
    }
  }, [editModeState, dispatchDataList]);

  return (
    <section>
      {/* List - Head */}
      <ListHead
        appData={appData}
        dispatch={setListsData}
        derivedItems={{
          listData,
          listName,
          editModeState,
          inputFormElement,
          dispatchApp,
        }}
      />

      {/* List - Body */}
      <ListBody
        appData={appData}
        dispatch={setListsData}
        derivedItems={{
          listData,
          dispatchApp,
        }}
      />
    </section>
  );
}

export { List };
