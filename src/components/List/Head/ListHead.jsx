import addList_dark from "../../../assets/List-Section/add-dark.png";
import addList_light from "../../../assets/List-Section/add-light.png";
import { THEME_VARIANTS } from "../../../provider";
import { HANDLE_CASE } from "../list_fractionCollection";

const SIZE_ICON = 16;

export default function ListHead({ appData, dispatch, derivedItems }) {
  const { theme } = appData;
  const { listData, listName, editModeState, inputFormElement, dispatchApp } =
    derivedItems;
  let styleHeadSection, srcSubmitButton;

  if (theme === THEME_VARIANTS.DARK_MODE) {
    styleHeadSection = {
      title: "dark:text-tertiary-100",
      inputForm:
        "dark:bg-secondary-100 dark:text-tertiary-100 dark:selection:bg-primary dark:border-secondary-150 dark:shadow-primary dark:shadow-[inset_0px_0px_1rem_bg-primary]",

      submitButton:
        "dark:hover:bg-secondary-150 dark:bg-secondary-100 dark:border-secondary-150 dark:shadow-primary dark:shadow-[inset_0px_0px_1rem_bg-primary]",
    };
    srcSubmitButton = addList_dark;
  }

  if (theme === THEME_VARIANTS.LIGHT_MODE) {
    styleHeadSection = {
      title: "text-primary",
      inputForm:
        "bg-tertiary-100 text-primary selection:bg-primary selection:text-tertiary-100 border-tertiary-150 shadow-tertiary-150 shadow-[inset_0px_0px_1rem_bg-tertiary-150]",

      submitButton:
        "hover:bg-tertiary-150 bg-tertiary-100 border-tertiary-150 shadow-tertiary-150 shadow-[inset_0px_0px_1rem_bg-tertiary-150]",
    };
    srcSubmitButton = addList_light;
  }

  return (
    <section className="flex justify-between items-center flex-wrap w-full">
      {/* Section Name */}
      <h1
        className={`${styleHeadSection.title} font-bold text-xl tracking-wider`}
      >
        Daftar Kategori
      </h1>

      {/* Form Add List Category */}
      <form
        className="flex items-center sm:w-1/2 sm:my-0 w-full mt-2"
        onSubmit={(e) => {
          e.preventDefault();
          dispatch({
            type:
              editModeState && editModeState.editMode
                ? HANDLE_CASE.EDIT
                : HANDLE_CASE.ADD,

            payload:
              editModeState && editModeState.editMode
                ? {
                    listData,
                    value: listName,
                    changeListData: true,
                    dispatchApp,
                  }
                : listName,
          });
        }}
      >
        <input
          onChange={(e) => {
            dispatch({
              type: HANDLE_CASE.CHANGE,
              payload: e.target.value,
            });
          }}
          value={listName}
          autoComplete="off"
          ref={inputFormElement}
          placeholder="Tambah Kategori"
          className={`${styleHeadSection.inputForm} border-2 placeholder:text-gray-400 rounded-md outline-none text-sm py-1.5 px-4 w-full mr-2`}
          type="text"
        />

        {/* Submit Button */}
        <button
          title="Tambah Kategori"
          onClick={(e) => {
            e.preventDefault();
            dispatch({
              type:
                editModeState && editModeState.editMode
                  ? HANDLE_CASE.EDIT
                  : HANDLE_CASE.ADD,

              payload:
                editModeState && editModeState.editMode
                  ? {
                      listData,
                      value: listName,
                      changeListData: true,
                      dispatchApp,
                    }
                  : listName,
            });
          }}
          className={`${styleHeadSection.submitButton} selection:bg-transparent p-2.5 rounded-md cursor-pointer duration-100 border-2`}
        >
          <img width={SIZE_ICON} height={SIZE_ICON} src={srcSubmitButton} />
        </button>
      </form>
    </section>
  );
}
