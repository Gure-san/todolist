const KEY_STORE = "advancedTodoList";
const SECTION_COMPONENT = {
  LIST : 'list',
  TASK : 'task'
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

function saveSectionDataToLocale({ section, value }) {
  const prevStoredData = getFromLocale(KEY_STORE);
  switch(section) {
    case SECTION_COMPONENT.LIST : 
      const dataFromList = {
        list : value,
        task : (prevStoredData && prevStoredData.task) ? [...prevStoredData.task] : null
      }

      return saveData(dataFromList);

    case SECTION_COMPONENT.TASK :
      const dataFromTask = {
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

export {
  KEY_STORE,
  SECTION_COMPONENT,
  getUniqueId,
  saveSectionDataToLocale,
  getFromLocale,
  getSelectedList,
  deleteFromLocale,
}