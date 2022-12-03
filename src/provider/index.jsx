import ReactDOM from "react-dom";
import { Temporal } from "@js-temporal/polyfill";
import { HANDLE_CASE_LISTMENU } from "../components/List/Body/body_fractionCollection";
import { LISTMENU_TYPE } from "../components/List/Body/body_fractionCollection";
import deleteSingle from "../assets/Modal/deleteSingle.png";
import deleteAll from "../assets/Modal/deleteAll.png";

const DESKTOP_MINIMUM_SIZE = 769;

const KEY_STORE = "advancedTodoList";
const SECTION_COMPONENT = {
  APP: "app",
  LIST: "list",
  TASK: "task",
};

const MODAL_SECTION = {
  LISTBODY_LISTMENU: "listBody_listMenu",
  LISTBODY_CLEAR: "listBody_clear",
};

const ICON_MODAL_SIZE = 64;

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

// Modal
function ActionsModal({
  isOpen,
  modalRegulator,
  modalSection,
  payload,
  listName = null,
}) {
  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <div className="fixed flex items-center justify-center top-0 left-0 right-0 bottom-0 bg-extra-900 z-50">
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
        {listName ? (
          <p className="my-4 text-center">
            Hapus Kategori "
            <span className="font-bold tracking-wider">{listName}</span>
            "?
            <br />
            Mungkin saja ada tugas didalam kategori ini!
          </p>
        ) : (
          <p className="my-4 text-center">
            Hapus semua kategori? <br />
            Semua tugas-tugas yang ada didalam kategori akan ikut terhapus!
          </p>
        )}

        <div className="flex w-full justify-center items-center">
          {/* Cancel Action */}
          <button
            className="flex bg-secondary-100 px-4 py-1.5 rounded-md border-2 border-secondary-150 text-sm mr-5"
            onClick={() => {
              if (modalSection === MODAL_SECTION.LISTBODY_LISTMENU) {
                return modalRegulator({
                  type: HANDLE_CASE_LISTMENU.MODAL,
                  payload: {
                    openModal: false,
                    confirm: false,
                    idForDelete: null,
                  },
                });
              }

              if (modalSection === MODAL_SECTION.LISTBODY_CLEAR) {
                return modalRegulator({
                  openModal: false,
                  confirm: false,
                });
              }
            }}
          >
            Batal
          </button>

          {/* Confirm Action */}
          <button
            className="flex bg-secondary-100 px-4 py-1.5 rounded-md border-2 border-secondary-150 text-sm"
            onClick={() => {
              if (modalSection === MODAL_SECTION.LISTBODY_LISTMENU) {
                return modalRegulator({
                  type: HANDLE_CASE_LISTMENU.MODAL,
                  payload: {
                    openModal: false,
                    confirm: true,
                    idForDelete: payload.modalData.idForDelete,
                  },
                });
              }

              if (modalSection === MODAL_SECTION.LISTBODY_CLEAR) {
                return modalRegulator({
                  openModal: false,
                  confirm: true,
                });
              }
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
  themeInitializer,
  getUniqueId,
  saveSectionDataToLocale,
  getFromLocale,
  getSelectedList,
  deleteFromLocale,
  ActionsModal,
  getDate,
  sizeObserver,
};
