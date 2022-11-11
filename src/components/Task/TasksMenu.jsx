import { getUniqueId } from '../../provider';
import DefaultTaskPlaceholder from './DefaultTaskPlaceholder';
import { HANDLE_CASE } from './Task';

export default function TasksMenu({ taskData, currentList, dispatch }) {
  const filteredTaskData = (taskData !== null && currentList !== null) ? taskData.filter(task => {
    if(task.id !== currentList.id) return null;
    return task;
  })[0] : null;

  return (
    (currentList !== null && filteredTaskData && filteredTaskData.tasks.length) ? 
    <ul className='my-4'>
      {filteredTaskData.tasks.map(({taskName, complete, id}) => (
        <li
        className='selection:bg-transparent' 
        key={getUniqueId()}>
          <label htmlFor={`task${id}`}>
            <input
            onChange={() => {
              dispatch({
                type : HANDLE_CASE.COMPLETE,
                payload : {
                  currentList,
                  id
                }
              })
            }}
            checked={complete}
            className='mr-2.5' 
            type="checkbox" 
            id={`task${id}`}/>
            {taskName}
          </label>
        </li>
      ))}
    </ul> :
    <DefaultTaskPlaceholder/>
  )
}