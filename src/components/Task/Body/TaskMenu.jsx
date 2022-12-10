import { HANDLE_CASE } from "../task_fractionCollections";
import { getUniqueId } from "../../../provider";

export default function TaskMenu({ filteredTaskData, currentList, dispatch }) {
  return (
    <ul className="my-4">
      {filteredTaskData.map(({ taskName, complete, id }) => (
        <li
          className="selection:bg-transparent mb-5 w-full"
          key={getUniqueId()}
        >
          <label
            className="flex justify-between items-start w-full dark:bg-secondary-100 bg-tertiary-150 dark:text-tertiary-100 text-primary rounded-md px-6 py-2 duration-300 cursor-pointer"
            htmlFor={`task${id}`}
          >
            <p
              className={`w-max max-w-[85%] break-words ${
                complete ? "line-through text-tertiary-150" : ""
              }`}
            >
              {taskName}
            </p>
            <input
              onChange={() => {
                dispatch({
                  type: HANDLE_CASE.COMPLETE,
                  payload: {
                    currentList,
                    id,
                  },
                });
              }}
              checked={complete}
              className="relative appearance-none w-6 h-6 rounded-md border-2 bg-tertiary-100 border-tertiary-150 dark:bg-secondary-100 dark:border-secondary-150 dark:checked:before:bg-extra-100 dark:before:bg-red-400
              before:bg-secondary-100 before:absolute before:w-2.5 before:h-2.5 before:rounded-sm before:top-[5px] before:left-[5px]"
              type="checkbox"
              id={`task${id}`}
            />
          </label>
        </li>
      ))}
    </ul>
  );
}
