import { useEffect, useRef } from "react";
import addTask_dark from "../../../assets/List-Section/add-dark.png";
import addTask_light from "../../../assets/List-Section/add-light.png";
import prohibited_dark from "../../../assets/Task-Section/prohibited-dark.png";
import prohibited_light from "../../../assets/Task-Section/prohibited-light.png";
import { stringTrimmer } from "./taskHead_fractionCollections";
import { HANDLE_CASE } from "../task_fractionCollections";

const SIZE_ICON = 16;

export default function TaskHead({
  selectedListName,
  taskName,
  currentDataList,
  dispatch,
}) {
  const listName_title = useRef();

  useEffect(() => {
    // List Name Trimmer
    stringTrimmer(listName_title.current);
  }, [listName_title]);

  return (
    <section className="flex flex-wrap justify-between items-center">
      {/* List Name and Tasks Info */}
      <div className="dark:text-tertiary-100 text-xl text-primary flex items-center w-max">
        <span className="mr-2 text-xl dark:text-extra-100 text-secondary-100">
          ◈
        </span>
        <h1
          ref={listName_title}
          className="capitalize font-bold text-xl tracking-wider"
        >
          {selectedListName || "Tugas"}
        </h1>
      </div>

      {/* Form Add Task */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          dispatch({
            type: HANDLE_CASE.ADD,
            payload: {
              currentList: currentDataList,
              taskName,
            },
          });
        }}
        className="mt-2 flex items-center w-full sm:mt-0 sm:w-1/2"
      >
        <input
          onChange={(e) => {
            dispatch({
              type: HANDLE_CASE.CHANGE,
              payload: e.target.value,
            });
          }}
          autoComplete="off"
          placeholder={
            selectedListName
              ? "Tambah tugas"
              : "-- tidak ada kategori yang dipilih"
          }
          className={`dark:bg-secondary-100 dark:text-tertiary-100 dark:border-secondary-150 dark:shadow-primary dark:shadow-[inset_0px_0px_1rem_bg-primary] border-2 placeholder:text-gray-400 rounded-md outline-none text-sm py-1.5 px-4 w-full mr-2 ${
            selectedListName
              ? "dark:selection:bg-primary"
              : "pointer-events-none selection:bg-transparent selection:text-current"
          }`}
          type="text"
          value={taskName}
        />

        {/* Submit Button */}
        <button
          type="submit"
          onSubmit={(e) => {
            e.preventDefault();
            dispatch({
              type: HANDLE_CASE.ADD,
              payload: {
                currentList: currentDataList,
                taskName,
              },
            });
          }}
          title="Tambah Kategori"
          className={`dark:hover:bg-secondary-150 dark:bg-secondary-100 dark:border-secondary-150 dark:shadow-primary dark:shadow-[inset_0px_0px_1rem_bg-primary] selection:bg-transparent p-2.5 rounded-md cursor-pointer duration-100 border-2 ${
            selectedListName ? "" : "pointer-events-none"
          }`}
        >
          <img
            width={SIZE_ICON}
            height={SIZE_ICON}
            src={selectedListName ? addTask_dark : prohibited_dark}
          />
        </button>
      </form>
    </section>
  );
}
