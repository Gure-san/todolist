import { useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import { Temporal, toTemporalInstant } from "@js-temporal/polyfill";

const KEY_STORE = "advancedTodoList";
const SECTION_COMPONENT = {
  APP : 'app',
  LIST : 'list',
  TASK : 'task',
}

const THEME_VARIANTS = {
  DARK_MODE : 'dark',
  LIGHT_MODE : 'light'
}

const INITIAL_APP_CONFIG = {
  theme : THEME_VARIANTS.DARK_MODE,
  swapComponentPosition : false,
  noDialog : {
    section : {
      list : false,
      task : false
    }
  } 
}

const CONFIG_ACTIONS = {
  THEME : 'theme',
  SWAP : 'swap',
  NO_DIALOG : 'noDialog',
  INITIAL_CHECK_DATA_LOCAL : 'check_data_local'
}


const iterationUniqueId = (() => {
  let numb = 0;
  return () => numb += 1;
})();

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
  const rootElement = document.getElementById('root');
  document.body.className = 'bg-tertiary-100 dark:bg-primary duration-300';
  rootElement.className = 'max-w-[768px] mx-auto px-6 bg-inherit';

  switch(theme) {
    case THEME_VARIANTS.DARK_MODE : 
      if(topLevelElement.classList.contains(THEME_VARIANTS.LIGHT_MODE)) {
        return topLevelElement.classList.replace(
          THEME_VARIANTS.LIGHT_MODE,
          THEME_VARIANTS.DARK_MODE
          );
        }
        
      return topLevelElement.classList.add(THEME_VARIANTS.DARK_MODE); 
      
    case THEME_VARIANTS.LIGHT_MODE : 
      if(topLevelElement.classList.contains(THEME_VARIANTS.DARK_MODE)) {
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
  switch(section) {
    case SECTION_COMPONENT.APP : 
      const dataFromApp = {
        app : value,
        list : (prevStoredData && prevStoredData.list) ? [...prevStoredData.list] : null,
        task : (prevStoredData && prevStoredData.task) ? [...prevStoredData.task] : null
      }

      return saveData(dataFromApp);

    case SECTION_COMPONENT.LIST : 
      if(!value) {
        const dataFromList = {
          app : {...prevStoredData.app},
          list : null,
          task : null
        };

        return saveData(dataFromList);
      }

      const dataFromList = {
        app : {...prevStoredData.app},
        list : value,
        task : (prevStoredData && prevStoredData.task) ? [...prevStoredData.task] : null
      }

      return saveData(dataFromList);

    case SECTION_COMPONENT.TASK :
      const dataFromTask = {
        app : {...prevStoredData.app},
        list : (prevStoredData && prevStoredData.list) ? [...prevStoredData.list] : null,
        task : value
      }

      return saveData(dataFromTask);
  }
}

function getFromLocale(key) {
  const items = localStorage.getItem(key);
  return items !== null ? JSON.parse(items) : items;
}

function getSelectedList(dataList) {
  const result = dataList.filter(list => {
    if(!list.active) return null;
    return list;
  });

  return result;
}

function deleteFromLocale(key) {
  return localStorage.removeItem(key);
}

function ActionsModal({isOpen, modalRegulator}) {
  if(!isOpen) return null;

  return ReactDOM.createPortal((
    <dialog
    className="fixed z-10 top-0" 
    open={isOpen}>
      <span className="block">Coba Pop Up</span>
      <button
      className="flex my-4 bg-slate-200 px-4 py-1.5 rounded-md border-2 border-slate-300 text-sm" 
      onClick={() => modalRegulator(data => ({
        openModal : !data.openModal,
        confirm : false
      }))}>
        kembali
      </button>

      <button
      className="flex my-4 bg-slate-200 px-4 py-1.5 rounded-md border-2 border-slate-300 text-sm" 
      onClick={() => modalRegulator(data => ({
        openModal : !data.openModal,
        confirm : true
      }))}>
        konfirmasi
      </button>
    </dialog>
  ), document.getElementById('portal'));
}

function monthFormatter(monthNumber) {
  let month = null;
  
  switch(monthNumber) {
    case 1 : 
      month = 'Januari';
      break;

    case 2 : 
      month = 'Februari';
      break;

    case 3 : 
      month = 'Maret';
      break;

    case 4 : 
      month = 'April'
      break;

    case 5 : 
      month = 'Mei';
      break;

    case 6 : 
      month = 'Juni';
      break;

    case 7 : 
      month = 'Juli';
      break;

    case 8 : 
      month = 'Agustus';
      break;

    case 9 : 
      month = 'September';
      break;

    case 10 : 
      month = 'Oktober';
      break;

    case 11 : 
      month = 'November';
      break;

    case 12 : 
      month = 'Desember';
      break;
  }

  return month;
}

function getDate() {
  const { day, month, year } = Temporal.Now.plainDateISO();
  const formattedMonth = monthFormatter(month);
  const today = `${day} ${formattedMonth} ${year}`;
  return today;
}

export {
  KEY_STORE,
  SECTION_COMPONENT,
  THEME_VARIANTS,
  INITIAL_APP_CONFIG,
  CONFIG_ACTIONS,
  themeInitializer,
  getUniqueId,
  saveSectionDataToLocale,
  getFromLocale,
  getSelectedList,
  deleteFromLocale,
  ActionsModal,
  getDate
}