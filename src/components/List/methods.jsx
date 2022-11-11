import { KEY_STORE } from '../../provider'
import { HANDLE_CASE } from './List'

function reCreateData({type, payload}) {
  switch(type) {
    case HANDLE_CASE.EDIT : 
      const editListData = payload.listData.map(list => ({
        ...list,
        active : false,
        listName : (list.id === payload.id) ? payload.value : list.listName
      }));

      return editListData;

    case HANDLE_CASE.SELECT :
      const { listData, selectedList, prevSelectedList } = payload;
      const resetSelectedData = listData.map(list => {
        if(listData.length <= 1 || selectedList === prevSelectedList) return list;
        return {
          ...list,
          active : false
        }
      });

      const dataWithSelectedList = resetSelectedData.map(list => {
        return { 
          ...list, 
          active : (list.id === payload.id) ? !list.active : list.active 
        }
      });

      return dataWithSelectedList;  
  }
}

export {
  reCreateData
}