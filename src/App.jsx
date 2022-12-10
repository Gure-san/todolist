import React from "react";
import { useReducer, useEffect } from "react";
import { List } from "./components/List";
import { Task } from "./components/Task";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import {
  SECTION_COMPONENT,
  THEME_VARIANTS,
  INITIAL_APP_CONFIG,
  KEY_STORE,
  themeInitializer,
  saveSectionDataToLocale,
  getFromLocale,
  CONFIG_ACTIONS,
} from "./provider";

const INITIAL_STATE = {
  APP_DATA: { ...INITIAL_APP_CONFIG },
  LIST_DATA: null,
  TASK_DATA: null,
  CHECK_DATA_LOCAL: false,
};

function reducer(state, { section, payload }) {
  switch (section) {
    case SECTION_COMPONENT.APP:
      if (!payload) return state;

      // initial check data local
      if (payload && payload.type === CONFIG_ACTIONS.INITIAL_CHECK_DATA_LOCAL) {
        const { value } = payload;

        saveSectionDataToLocale({
          section: SECTION_COMPONENT.APP,
          value,
        });

        return {
          ...state,
          APP_DATA: { ...value },
          CHECK_DATA_LOCAL: true,
        };
      }

      const dataConfig_app = { ...payload };

      saveSectionDataToLocale({
        section: SECTION_COMPONENT.APP,
        value: dataConfig_app,
      });

      return {
        ...state,
        APP_DATA: dataConfig_app,
      };

    case SECTION_COMPONENT.LIST:
      const { currentList, listDataFull } = payload;
      return {
        ...state,
        LIST_DATA: {
          currentList: currentList.length ? currentList[0] : null,
          listDataFull,
        },
      };

    case SECTION_COMPONENT.TASK:

    default:
      return state;
  }
}

function App() {
  const [{ APP_DATA, LIST_DATA, TASK_DATA, CHECK_DATA_LOCAL }, setData] =
    useReducer(reducer, INITIAL_STATE);

  useEffect(() => {
    // Initialize theme
    if (!CHECK_DATA_LOCAL) {
      const dataAppLocal = getFromLocale(KEY_STORE);
      if (dataAppLocal) {
        const dataConfig_app = dataAppLocal.app;
        setData({
          section: SECTION_COMPONENT.APP,
          payload: {
            type: CONFIG_ACTIONS.INITIAL_CHECK_DATA_LOCAL,
            value: dataConfig_app,
          },
        });
      }

      if (!dataAppLocal) {
        setData({
          section: SECTION_COMPONENT.APP,
          payload: {
            type: CONFIG_ACTIONS.INITIAL_CHECK_DATA_LOCAL,
            value: APP_DATA,
          },
        });
      }
    }

    themeInitializer(APP_DATA);
  }, [APP_DATA]);

  return (
    <React.Fragment>
      <Header dispatchApp={setData} appData={APP_DATA} />
      <List dispatchApp={setData} appData={APP_DATA} />
      <Task
        listDataFull={!LIST_DATA ? LIST_DATA : LIST_DATA.listDataFull}
        currentDataList={!LIST_DATA ? LIST_DATA : LIST_DATA.currentList}
        dispatchApp={setData}
        appData={APP_DATA}
      />
      <Footer />
    </React.Fragment>
  );
}

export default App;
