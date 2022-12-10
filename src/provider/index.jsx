import ReactDOM from "react-dom";
import { Temporal } from "@js-temporal/polyfill";
import {
  HANDLE_CASE_LISTMENU,
  LISTMENU_TYPE,
} from "../components/List/Body/body_fractionCollection";
import deleteSingle from "../assets/Modal/deleteSingle.png";
import deleteAll from "../assets/Modal/deleteAll.png";
import clearDark from "../assets/List-Section/clear-dark.png";
import clearLight from "../assets/List-Section/clear-light.png";
import changeDark from "../assets/Task-Section/change-dark.png";
import changeLight from "../assets/Task-Section/change-light.png";
import removeCompleteTasksDark from "../assets/Task-Section/removeSelectedTask-dark.png";
import removeCompleteTasksLight from "../assets/Task-Section/removeSelectedTask-light.png";
import React, { useState, useEffect, useRef } from "react";

const KEY_STORE = "advancedTodoList";
const DESKTOP_MINIMUM_SIZE = 769;
const ICON_MODAL_SIZE = 64;
const ICON_SEPARATOR_SIZE = 16;

const SECTION_COMPONENT = {
  APP: "app",
  LIST: "list",
  TASK: "task",
};

const MODAL_SECTION = {
  LISTBODY_LISTMENU: "listBody_listMenu",
  LISTBODY_CLEAR: "listBody_clear",
  TASKBODY_CLEAR: "taskBody_clear",
  TASKBODY_DELETE: "taskBody_delete",
};

const DECISIONS = {
  CONFIRM: "confirm",
  CANCEL: "cancel",
};

const THEME_VARIANTS = {
  DARK_MODE: "dark",
  LIGHT_MODE: "light",
};

const INITIAL_APP_CONFIG = {
  theme: THEME_VARIANTS.DARK_MODE,
  switchComponentPosition: false,
  noDialog: {
    section: {
      list: false,
      task: false,
    },
  },
};

const CONFIG_ACTIONS = {
  THEME: "theme",
  SWAP: "swap",
  NO_DIALOG: "noDialog",
  INITIAL_CHECK_DATA_LOCAL: "check_data_local",
};

const SEPARATOR_TYPE = {
  NORMAL: "normal",
  CLEAR: "clear",
  DOUBLE: "doulbe",
  TASK_INFO: "task_info",
};

const iterationUniqueId = (() => {
  let numb = 0;
  return () => (numb += 1);
})();

function debounce(callback, delay = 2000) {
  let timeOut;
  return (arg) => {
    clearTimeout(timeOut);
    timeOut = setTimeout(() => {
      callback(arg);
    }, delay);
  };
}

function sizeObserver(targetToObserve, dispatch) {
  const debounceUpdater = debounce((type) => dispatch(type));
  const observer = new ResizeObserver((entries, thisObserver) => {
    entries.forEach((obj) => {
      // Mobile Size
      if (obj.contentRect.width < DESKTOP_MINIMUM_SIZE)
        debounceUpdater(LISTMENU_TYPE.COLLAPSIBLE);

      // Desktop Size
      if (obj.contentRect.width > DESKTOP_MINIMUM_SIZE)
        debounceUpdater(LISTMENU_TYPE.NORMAL);
    });
  });

  observer.observe(targetToObserve);
}

function getUniqueId() {
  const primariNumb = new Date().getMilliseconds();
  const secondaryNumb = iterationUniqueId();
  return primariNumb + secondaryNumb;
}

function saveData(obj) {
  const objToString = JSON.stringify(obj);
  return localStorage.setItem(KEY_STORE, objToString);
}

function themeInitializer(appData) {
  const { theme } = appData;
  const topLevelElement = document.documentElement;
  const rootElement = document.getElementById("root");
  document.body.className = "bg-tertiary-100 dark:bg-primary duration-300";
  rootElement.className = "max-w-[768px] mx-auto px-6 bg-inherit";

  switch (theme) {
    case THEME_VARIANTS.DARK_MODE:
      if (topLevelElement.classList.contains(THEME_VARIANTS.LIGHT_MODE)) {
        return topLevelElement.classList.replace(
          THEME_VARIANTS.LIGHT_MODE,
          THEME_VARIANTS.DARK_MODE
        );
      }

      return topLevelElement.classList.add(THEME_VARIANTS.DARK_MODE);

    case THEME_VARIANTS.LIGHT_MODE:
      if (topLevelElement.classList.contains(THEME_VARIANTS.DARK_MODE)) {
        return topLevelElement.classList.replace(
          THEME_VARIANTS.DARK_MODE,
          THEME_VARIANTS.LIGHT_MODE
        );
      }

      return topLevelElement.classList.add(THEME_VARIANTS.LIGHT_MODE);
  }
}

function saveSectionDataToLocale({ section, value }) {
  const prevStoredData = getFromLocale(KEY_STORE);
  switch (section) {
    case SECTION_COMPONENT.APP:
      const dataFromApp = {
        app: value,
        list:
          prevStoredData && prevStoredData.list
            ? [...prevStoredData.list]
            : null,
        task:
          prevStoredData && prevStoredData.task
            ? [...prevStoredData.task]
            : null,
      };

      return saveData(dataFromApp);

    case SECTION_COMPONENT.LIST:
      if (!value) {
        const dataFromList = {
          app: { ...prevStoredData.app },
          list: null,
          task: null,
        };

        return saveData(dataFromList);
      }

      const dataFromList = {
        app: { ...prevStoredData.app },
        list: value,
        task:
          prevStoredData && prevStoredData.task
            ? [...prevStoredData.task]
            : null,
      };

      return saveData(dataFromList);

    case SECTION_COMPONENT.TASK:
      const dataFromTask = {
        app: { ...prevStoredData.app },
        list:
          prevStoredData && prevStoredData.list
            ? [...prevStoredData.list]
            : null,
        task: value,
      };

      return saveData(dataFromTask);
  }
}

function getFromLocale(key) {
  const items = localStorage.getItem(key);
  return items !== null ? JSON.parse(items) : items;
}

function getSelectedList(dataList) {
  const result = dataList.filter((list) => {
    if (!list.active) return null;
    return list;
  });

  return result;
}

function deleteFromLocale(key) {
  return localStorage.removeItem(key);
}

// Dispatch Modal Filter
function dispatchModalFilter({
  decision,
  modalSection,
  modalRegulator,
  payload,
}) {
  switch (modalSection) {
    case MODAL_SECTION.LISTBODY_LISTMENU:
      // Cancel
      if (decision === DECISIONS.CANCEL) {
        return modalRegulator({
          type: HANDLE_CASE_LISTMENU.MODAL,
          payload: {
            openModal: false,
            confirm: false,
            idForDelete: null,
          },
        });
      }

      // Confirm
      return modalRegulator({
        type: HANDLE_CASE_LISTMENU.MODAL,
        payload: {
          openModal: false,
          confirm: true,
          idForDelete: payload.modalData.idForDelete,
        },
      });

    case MODAL_SECTION.LISTBODY_CLEAR:
      // Cancel
      if (decision === DECISIONS.CANCEL) {
        return modalRegulator({
          openModal: false,
          confirm: false,
        });
      }

      // Confirm
      return modalRegulator({
        openModal: false,
        confirm: true,
      });

    case MODAL_SECTION.TASKBODY_CLEAR:
      // Cancel
      if (decision === DECISIONS.CANCEL) {
        return modalRegulator({
          openModal: false,
          confirm: false,
        });
      }

      // Confirm
      return modalRegulator({
        openModal: false,
        confirm: true,
      });

    case MODAL_SECTION.TASKBODY_DELETE:
      // Cancel
      if (decision === DECISIONS.CANCEL) {
        return modalRegulator({
          openModal: false,
          confirm: false,
        });
      }

      // Confirm
      return modalRegulator({
        openModal: false,
        confirm: true,
      });
  }
}

// Modal Message
function PopUpMessage({ modalsection, payload }) {
  switch (modalsection) {
    case MODAL_SECTION.LISTBODY_CLEAR:
      return (
        <React.Fragment>
          <p className="my-4 text-center">
            Hapus semua kategori? <br />
            Semua tugas-tugas yang ada didalam kategori akan ikut terhapus!
          </p>
        </React.Fragment>
      );

    case MODAL_SECTION.LISTBODY_LISTMENU:
      return (
        <React.Fragment>
          <p className="my-4 text-center">
            Hapus Kategori "
            <span className="font-bold tracking-wider capitalize">
              {payload}
            </span>
            "?
            <br />
            Mungkin saja ada tugas didalam kategori ini!
          </p>
        </React.Fragment>
      );

    case MODAL_SECTION.TASKBODY_CLEAR:
      return (
        <React.Fragment>
          <p className="my-4 text-center">Hapus semua tugas?</p>
        </React.Fragment>
      );

    case MODAL_SECTION.TASKBODY_DELETE:
      return (
        <React.Fragment>
          <p className="my-4 text-center">
            Hapus semua tugas yang sudah selesai?
          </p>
        </React.Fragment>
      );
  }
}

// Modal
function ActionsModal({
  isOpen,
  modalRegulator,
  modalSection,
  payload,
  listName = null,
}) {
  const [modalState, setModalState] = useState(true);
  const dialogContainer = useRef();
  useEffect(() => {
    if (!modalState) {
      dialogContainer.current.removeEventListener("click", getActiveElement);
      dispatchModalFilter({
        decision: DECISIONS.CANCEL,
        payload,
        modalRegulator,
        modalSection,
      });
    }
    dialogContainer.current.addEventListener("click", getActiveElement);
    function getActiveElement(e) {
      return e.target.tagName === "DIV" && setModalState(false);
    }
  }, [modalState]);

  return ReactDOM.createPortal(
    <div
      ref={dialogContainer}
      className="fixed flex items-center justify-center top-0 left-0 right-0 bottom-0 bg-extra-900 z-50"
    >
      <dialog
        className="bg-primary text-tertiary-100 flex flex-col items-center justify-center w-full max-w-[300px] sm:max-w-[425px] sm:px-6 sm:py-8 rounded-md px-8 py-6 selection:bg-secondary-100"
        open={isOpen}
      >
        {/* Icon modal type */}
        <img
          src={listName ? deleteSingle : deleteAll}
          width={ICON_MODAL_SIZE}
        />

        {/* Message */}
        <PopUpMessage modalsection={modalSection} payload={listName} />

        <div className="flex w-full justify-center items-center">
          {/* Cancel Action */}
          <button
            className="flex bg-secondary-100 px-4 py-1.5 rounded-md border-2 border-secondary-150 text-sm mr-5"
            onClick={() => {
              dispatchModalFilter({
                decision: DECISIONS.CANCEL,
                payload,
                modalRegulator,
                modalSection,
              });
            }}
          >
            Batal
          </button>

          {/* Confirm Action */}
          <button
            className="flex bg-secondary-100 px-4 py-1.5 rounded-md border-2 border-secondary-150 text-sm"
            onClick={() => {
              dispatchModalFilter({
                decision: DECISIONS.CONFIRM,
                payload,
                modalRegulator,
                modalSection,
              });
            }}
          >
            Hapus
          </button>
        </div>
      </dialog>
    </div>,
    document.getElementById("portal")
  );
}

// Separator
function Separator({ modalSection, type, dispatches, extraStyle, payload }) {
  // Functional Confirm Action For Separator Type Clear
  const [modalData, setModalData] = useState({
    openModal: false,
    confirm: false,
  });

  useEffect(() => {
    // Confirm Clear Action
    if (modalData.confirm)
      if (payload && payload.keyDispatches) {
        dispatches.deleteCompletedTasks();
      } else {
        dispatches.dispatchCallbackClear();
      }
  }, [modalData]);

  switch (type) {
    case SEPARATOR_TYPE.NORMAL:
      return (
        <hr
          id={payload && payload.hasId ? `separator-${payload.id}` : ""}
          className={`border-0 h-0.5 w-full rounded-full ${extraStyle || ""}`}
        />
      );

    case SEPARATOR_TYPE.CLEAR:
      return (
        <section
          className={`w-full relative flex justify-end items-center ${
            extraStyle.outer || ""
          }`}
        >
          {/* Modal */}
          {modalData.openModal ? (
            <ActionsModal
              isOpen={modalData.openModal}
              modalRegulator={setModalData}
              modalSection={modalSection}
            />
          ) : null}
          <hr
            className={`absolute border-0 h-0.5 w-full rounded-full ${
              extraStyle.separator || ""
            }`}
          />
          <button
            onClick={() =>
              setModalData({
                openModal: !modalData.openModal,
                confirm: false,
              })
            }
            className="dark:bg-secondary-100 dark:hover:bg-secondary-150 dark:border-secondary-150 dark:shadow-primary dark:shadow-[inset_0px_0px_1rem_bg-primary] hover:bg-tertiary-150 bg-tertiary-100 border-tertiary-150 shadow-tertiary-150 shadow-[inset_0px_0px_1rem_bg-tertiary-150] selection:bg-transparent p-2.5 rounded-full cursor-pointer duration-100 border-2 active:translate-y-0.5 z-10"
            type="button"
          >
            <img
              src={
                payload.theme === THEME_VARIANTS.DARK_MODE
                  ? clearDark
                  : clearLight
              }
              width={ICON_SEPARATOR_SIZE}
              height={ICON_SEPARATOR_SIZE}
            />
          </button>
        </section>
      );

    case SEPARATOR_TYPE.TASK_INFO:
      return (
        <section
          className={`w-full relative flex items-center ${
            extraStyle.outer || ""
          }`}
        >
          {/* Label Task Info */}
          <div className="z-10 flex items-center">
            {/* Delete Completed Tasks */}
            {modalData.openModal ? (
              <ActionsModal
                isOpen={modalData.openModal}
                modalRegulator={setModalData}
                modalSection={modalSection}
                listName={true}
              />
            ) : null}
            <button
              onClick={() => {
                setModalData({
                  openModal: !modalData.openModal,
                  confirm: false,
                });
              }}
              className={`${
                payload.deleteCompletedTasks ? "block" : "hidden"
              } text-sm px-2 py-2 w-max h-max dark:text-tertiary-150 dark:bg-secondary-100 dark:hover:bg-secondary-150 dark:border-secondary-150 dark:shadow-primary dark:shadow-[inset_0px_0px_1rem_bg-primary] hover:bg-tertiary-150 text-secondary-150 bg-tertiary-100 border-tertiary-150 shadow-tertiary-150 shadow-[inset_0px_0px_1rem_bg-tertiary-150] selection:bg-transparent rounded-md cursor-pointer duration-100 border-2`}
              id="taskInfo"
            >
              <img
                src={removeCompleteTasksDark}
                width={ICON_SEPARATOR_SIZE}
                height={ICON_SEPARATOR_SIZE}
              />
            </button>

            <button
              onClick={dispatches.updateTaskInfo}
              className={`text-sm px-4 py-0.5 w-max h-max dark:text-tertiary-150 dark:bg-secondary-100 dark:hover:bg-secondary-150 dark:border-secondary-150 dark:shadow-primary dark:shadow-[inset_0px_0px_1rem_bg-primary] hover:bg-tertiary-150 text-secondary-150 bg-tertiary-100 border-tertiary-150 shadow-tertiary-150 shadow-[inset_0px_0px_1rem_bg-tertiary-150] selection:bg-transparent rounded-md cursor-pointer duration-100 border-2 ${
                payload.deleteCompletedTasks ? "ml-2" : ""
              }`}
              id="taskInfo"
            >
              {payload.currentTaskInfo}
            </button>
          </div>

          <hr
            className={`absolute border-0 h-0.5 w-full rounded-full ${
              extraStyle.separator || ""
            }`}
          />
        </section>
      );
  }
}

function monthFormatter(monthNumber) {
  let month = null;

  switch (monthNumber) {
    case 1:
      month = "Januari";
      break;

    case 2:
      month = "Februari";
      break;

    case 3:
      month = "Maret";
      break;

    case 4:
      month = "April";
      break;

    case 5:
      month = "Mei";
      break;

    case 6:
      month = "Juni";
      break;

    case 7:
      month = "Juli";
      break;

    case 8:
      month = "Agustus";
      break;

    case 9:
      month = "September";
      break;

    case 10:
      month = "Oktober";
      break;

    case 11:
      month = "November";
      break;

    case 12:
      month = "Desember";
      break;
  }

  return month;
}

function dayFormatter(dayOfWeekNumber) {
  let day = null;

  switch (dayOfWeekNumber) {
    case 1:
      day = "Senin";
      break;

    case 2:
      day = "Selasa";
      break;

    case 3:
      day = "Rabu";
      break;

    case 4:
      day = "Kamis";
      break;

    case 5:
      day = "Jum'at";
      break;

    case 6:
      day = "Sabtu";
      break;

    case 7:
      day = "Minggu";
      break;
  }

  return day;
}

function getDate() {
  const { day, dayOfWeek, month, year } = Temporal.Now.plainDateISO();
  const date = `${day} ${monthFormatter(month)} ${year}`;
  return {
    date,
    day: dayFormatter(dayOfWeek),
  };
}

export {
  KEY_STORE,
  SECTION_COMPONENT,
  THEME_VARIANTS,
  INITIAL_APP_CONFIG,
  CONFIG_ACTIONS,
  MODAL_SECTION,
  SEPARATOR_TYPE,
  themeInitializer,
  getUniqueId,
  saveSectionDataToLocale,
  getFromLocale,
  getSelectedList,
  deleteFromLocale,
  ActionsModal,
  Separator,
  getDate,
  sizeObserver,
};
