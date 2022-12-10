import { motion } from "framer-motion";
import { useEffect, useReducer, useRef, useState } from "react";
import deleteDark from "../../../assets/List-Section/delete-dark.png";
import deleteLight from "../../../assets/List-Section/delete-light.png";
import editDark from "../../../assets/List-Section/edit-dark.png";
import editLight from "../../../assets/List-Section/edit-light.png";
import confirmEditDark from "../../../assets/List-Section/confirm-dark.png";
import confirmEditLight from "../../../assets/List-Section/confirm-light.png";
import { HANDLE_CASE } from "../list_fractionCollection";
import {
  MODAL_SECTION,
  SECTION_COMPONENT,
  SEPARATOR_TYPE,
  THEME_VARIANTS,
  ActionsModal,
  Separator,
} from "../../../provider";
import {
  displayImplementer,
  getEditIconSrc,
  HANDLE_CASE_LISTMENU,
  LISTMENU_TYPE,
} from "./body_fractionCollection";

const ROOT_ELEMENT = document.getElementById("root");
const SIZE_ICON_NORMAL = 14;
const SIZE_ICON_COLLAPSE = 14;

const INITIALSTATE_LISTMENU = {
  modalData: {
    openModal: false,
    confirm: false,
    idForDelete: null,
  },
  editModeState: {
    commit: false,
    active: false,
    idListMenu: null,
    inputElement: null,
  },
  collapseData: [],
  newListName: "",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case HANDLE_CASE_LISTMENU.COLLAPSE:
      // reset collapse data
      if (typeof payload === "object" && payload.reset) {
        return {
          ...state,
          collapseData: INITIALSTATE_LISTMENU.collapseData,
          editModeState: INITIALSTATE_LISTMENU.editModeState,
          newListName: INITIALSTATE_LISTMENU.newListName,
        };
      }

      const twinIdData = state.collapseData.some(({ id }) => id === payload);

      if (twinIdData) {
        const listMenuData_collapse = state.collapseData.map((data) => {
          if (data.id === payload) data.active = !data.active;
          return data;
        });

        // display implementer
        displayImplementer(listMenuData_collapse);

        // With Reset Edit Mode State
        return {
          ...state,
          collapseData: listMenuData_collapse,
          editModeState: INITIALSTATE_LISTMENU.editModeState,
          newListName: INITIALSTATE_LISTMENU.newListName,
        };
      }

      const initialCollapseData = {
        id: payload,
        active:
          state.collapseData.active && state.collapseData.id !== payload
            ? true
            : !state.collapseData.active,
        collapsibleElements: {
          separator: document.getElementById(`separator-${payload}`),
          collapsibleElement: document.getElementById(`collapsible-${payload}`),
        },
      };

      const listMenuData_collapse = [
        ...state.collapseData,
        initialCollapseData,
      ];

      // display implementer
      displayImplementer(listMenuData_collapse);

      // With Reset Edit Mode State
      return {
        ...state,
        collapseData: listMenuData_collapse,
        editModeState: {
          active: false,
          idListMenu: null,
          inputElement: null,
        },
      };

    case HANDLE_CASE_LISTMENU.MODAL:
      const { openModal, confirm, idForDelete } = payload;

      // With Reset Edit Mode State
      return {
        ...state,
        modalData: {
          openModal,
          confirm,
          idForDelete,
        },
        editModeState: INITIALSTATE_LISTMENU.editModeState,
        newListName: INITIALSTATE_LISTMENU.newListName,
      };

    case HANDLE_CASE_LISTMENU.EDIT:
      if (payload.reset) {
        return {
          ...state,
          editModeState: INITIALSTATE_LISTMENU.editModeState,
          newListName: INITIALSTATE_LISTMENU.newListName,
        };
      }

      const { commit, idListMenu, inputElement } = payload;
      const listMenuData_Edit = {
        commit,
        active:
          state.editModeState.idListMenu &&
          state.editModeState.idListMenu === idListMenu
            ? !state.editModeState.active
            : true,
        idListMenu,
        inputElement,
      };

      return {
        ...state,
        newListName: payload.listName,
        editModeState: listMenuData_Edit,
      };

    case HANDLE_CASE_LISTMENU.CHANGE:
      return {
        ...state,
        newListName: payload,
      };

    case HANDLE_CASE_LISTMENU.default:
      return state;
  }
}

function ListMenu({ type, derivedItems, dispatch, appData }) {
  const [
    { modalData, editModeState, collapseData, newListName },
    setListMenuData,
  ] = useReducer(reducer, INITIALSTATE_LISTMENU);

  useEffect(() => {
    // Handle collapse data
    if (type === LISTMENU_TYPE.NORMAL && collapseData.length > 0) {
      setListMenuData({
        type: HANDLE_CASE_LISTMENU.COLLAPSE,
        payload: {
          reset: true,
        },
      });
    }

    // Handle Edit Mode State
    const resetEditModeState = !editModeState.active
      ? null
      : (e) => {
          console.dir(e.target);
          const buttonEdit = document.getElementById(
            `buttonEdit-${editModeState.idListMenu}`
          );
          const editModeElements = [
            editModeState.inputElement,
            buttonEdit,
            buttonEdit.firstElementChild,
            document.getElementById(
              `hiddenSubmitEditMode-${editModeState.idListMenu}`
            ),
            ,
          ];
          if (!editModeElements.some((element) => element === e.target)) {
            ROOT_ELEMENT.removeEventListener("click", resetEditModeState);
            setListMenuData({
              type: HANDLE_CASE_LISTMENU.EDIT,
              payload: {
                reset: true,
              },
            });
          }
        };

    if (editModeState.active) {
      editModeState.inputElement.focus();
      ROOT_ELEMENT.addEventListener("click", resetEditModeState);
    } else {
      ROOT_ELEMENT.removeEventListener("click", resetEditModeState);
      setListMenuData({
        type: HANDLE_CASE_LISTMENU.EDIT,
        payload: {
          reset: true,
        },
      });
    }

    if (editModeState.commit && newListName) {
      dispatch({
        type: HANDLE_CASE.EDIT,
        payload: {
          id: editModeState.idListMenu,
          newListName,
          dispatchApp: derivedItems.dispatchApp,
        },
      });
    }

    // Confirm Delete List
    if (modalData.confirm) {
      dispatch({
        type: HANDLE_CASE.DELETE,
        payload: {
          idForDelete: modalData.idForDelete,
          dispatchApp: derivedItems.dispatchApp,
        },
      });
    }
  }, [modalData, editModeState, type]);

  switch (type) {
    case LISTMENU_TYPE.NORMAL:
      return (
        <form
          className="dark:text-tertiary-100 dark:font-normal text-primary font-semibold text-sm"
          onSubmit={(e) => {
            e.preventDefault();
            setListMenuData({
              type: HANDLE_CASE_LISTMENU.EDIT,
              payload: {
                reset: true,
              },
            });

            dispatch({
              type: HANDLE_CASE.EDIT,
              payload: {
                id: editModeState.idListMenu,
                newListName,
                dispatchApp: derivedItems.dispatchApp,
              },
            });
          }}
        >
          <ul>
            {derivedItems.listData.map(
              ({ id, listName, active, day, date }) => (
                <li className="mb-6" key={id} id={`menu-${id}`}>
                  <label className="flex w-full" htmlFor={`list-${id}`}>
                    <input
                      className="mr-4 appearance-none w-10 h-10 rounded-md bg-tertiary-100 border-tertiary-150 shadow-tertiary-150 shadow-[inset_0px_0px_1rem_bg-tertiary-150] dark:bg-secondary-100 dark:border-secondary-150 dark:before:bg-extra-100 border-2 dark:shadow-primary dark:shadow-[inset_0px_0px_1rem_bg-primary]
                      relative checked:before:opacity-100 before:opacity-0 before:absolute before:w-3.5 before:h-3.5 before:bg-secondary-100 before:rounded-sm before:top-[11px] before:left-[11px]"
                      type="checkbox"
                      id={`list-${id}`}
                      checked={active}
                      onChange={(e) => {
                        dispatch({
                          type: HANDLE_CASE.SELECT,
                          payload: {
                            id,
                            listData: derivedItems.listData,
                            selectedList: e.target,
                            dispatchApp: derivedItems.dispatchApp,
                          },
                        });
                      }}
                    />

                    {/* List Info */}
                    <div className="mr-4 dark:bg-secondary-100 bg-tertiary-150 flex justify-between items-center px-4 rounded-md w-full max-w-[555px]">
                      <div>
                        <input
                          id={`listName-${id}`}
                          type="text"
                          autoComplete="off"
                          onChange={(e) =>
                            setListMenuData({
                              type: HANDLE_CASE_LISTMENU.CHANGE,
                              payload: e.target.value,
                            })
                          }
                          className={`bg-transparent max-w-max outline-none capitalize ${
                            editModeState.active &&
                            editModeState.idListMenu === id
                              ? "selection:bg-primary"
                              : "pointer-events-none selection:bg-transparent"
                          }`}
                          readOnly={
                            editModeState.active &&
                            editModeState.idListMenu === id
                              ? false
                              : true
                          }
                          value={
                            newListName &&
                            editModeState.active &&
                            editModeState.idListMenu === id
                              ? newListName
                              : listName
                          }
                        />

                        {/* Hidden Submit Button */}
                        {editModeState.active &&
                        editModeState.idListMenu === id &&
                        newListName ? (
                          <button
                            id={`hiddenSubmitEditMode-${id}`}
                            type="submit"
                          />
                        ) : null}
                      </div>
                      <p className="selection:bg-transparent">
                        {day} - {date}
                      </p>
                    </div>

                    {/* List Actions */}
                    <div className="flex w-max">
                      {/* Edit */}
                      <button
                        className="dark:hover:bg-secondary-150 dark:bg-secondary-100 dark:border-secondary-150 dark:shadow-primary dark:shadow-[inset_0px_0px_1rem_bg-primary] hover:bg-tertiary-150 bg-tertiary-100 border-tertiary-150 shadow-tertiary-150 shadow-[inset_0px_0px_1rem_bg-tertiary-150] py-2 px-3 mr-2 selection:bg-transparent rounded-md cursor-pointer duration-100 border-2"
                        id={`buttonEdit-${id}`}
                        onClick={() =>
                          setListMenuData({
                            type: HANDLE_CASE_LISTMENU.EDIT,
                            payload: {
                              commit: editModeState.active,
                              idListMenu: id,
                              inputElement: document.getElementById(
                                `listName-${id}`
                              ),
                            },
                          })
                        }
                        title={
                          editModeState.active &&
                          editModeState.idListMenu === id
                            ? "Konfirmasi Perubahan"
                            : "Edit Nama Kategori"
                        }
                        type="button"
                      >
                        <img
                          width={SIZE_ICON_NORMAL}
                          height={SIZE_ICON_NORMAL}
                          src={getEditIconSrc(appData.theme, editModeState, id)}
                        />
                      </button>

                      {/* Delete List Category */}
                      {/* Pop Up Confirm Action */}
                      {modalData.openModal && modalData.idForDelete === id ? (
                        <ActionsModal
                          modalSection={MODAL_SECTION.LISTBODY_LISTMENU}
                          isOpen={modalData.openModal}
                          modalRegulator={setListMenuData}
                          payload={{ modalData }}
                          listName={listName}
                        />
                      ) : null}
                      <button
                        className="dark:hover:bg-secondary-150 dark:bg-secondary-100 dark:border-secondary-150 dark:shadow-primary dark:shadow-[inset_0px_0px_1rem_bg-primary] hover:bg-tertiary-150 bg-tertiary-100 border-tertiary-150 shadow-tertiary-150 shadow-[inset_0px_0px_1rem_bg-tertiary-150] py-2 px-3 selection:bg-transparent rounded-md cursor-pointer duration-100 border-2"
                        type="button"
                        title="Hapus Kategori"
                        onClick={() => {
                          setListMenuData({
                            type: HANDLE_CASE_LISTMENU.MODAL,
                            payload: {
                              openModal: true,
                              confirm: false,
                              idForDelete: id,
                            },
                          });
                        }}
                      >
                        <img
                          width={SIZE_ICON_NORMAL}
                          height={SIZE_ICON_NORMAL}
                          src={
                            appData.theme === THEME_VARIANTS.DARK_MODE
                              ? deleteDark
                              : deleteLight
                          }
                        />
                      </button>
                    </div>
                  </label>
                </li>
              )
            )}
          </ul>
        </form>
      );

    case LISTMENU_TYPE.COLLAPSIBLE:
      return (
        <motion.form
          className="dark:text-tertiary-100 dark:font-normal font-semibold text-primary text-sm"
          onSubmit={(e) => {
            e.preventDefault();
            setListMenuData({
              type: HANDLE_CASE_LISTMENU.EDIT,
              payload: {
                reset: true,
              },
            });

            dispatch({
              type: HANDLE_CASE.EDIT,
              payload: {
                id: editModeState.idListMenu,
                newListName,
                dispatchApp: derivedItems.dispatchApp,
              },
            });
          }}
        >
          <ul id="listMenuContainer">
            {derivedItems.listData.map(
              ({ id, listName, active, day, date }) => (
                <li className="mb-6" key={id} id={`menu-${id}`}>
                  <label
                    className="w-full flex relative"
                    htmlFor={`list-${id}`}
                  >
                    {/* Checkbox */}
                    <section className="absolute -top-2 -left-2">
                      <input
                        className="relative appearance-none w-6 h-6 rounded-md border-2 bg-tertiary-100 border-tertiary-150 dark:bg-secondary-100 dark:border-secondary-150 dark:before:bg-extra-100
                        before:bg-secondary-100 checked:before:opacity-100 before:opacity-0 before:absolute before:w-2.5 before:h-2.5  before:rounded-sm before:top-[5px] before:left-[5px]"
                        type="checkbox"
                        id={`list-${id}`}
                        checked={active}
                        onChange={(e) => {
                          dispatch({
                            type: HANDLE_CASE.SELECT,
                            payload: {
                              id,
                              listData: derivedItems.listData,
                              selectedList: e.target,
                              dispatchApp: derivedItems.dispatchApp,
                            },
                          });
                        }}
                      />
                    </section>

                    {/* Collapsible List Info */}
                    <motion.section
                      animate={{ height: null }}
                      className="flex flex-col w-full dark:bg-secondary-100 bg-tertiary-150 rounded-md px-5 py-2 duration-300"
                    >
                      {/* First Part */}
                      <section className="flex justify-between items-end w-full">
                        {/* List Name */}
                        <div>
                          <input
                            id={`listName-${id}`}
                            type="text"
                            autoComplete="off"
                            onChange={(e) =>
                              setListMenuData({
                                type: HANDLE_CASE_LISTMENU.CHANGE,
                                payload: e.target.value,
                              })
                            }
                            className={`bg-transparent max-w-max outline-none capitalize ${
                              editModeState.active &&
                              editModeState.idListMenu === id
                                ? "selection:bg-primary"
                                : "pointer-events-none selection:bg-transparent"
                            }`}
                            readOnly={
                              editModeState.active &&
                              editModeState.idListMenu === id
                                ? false
                                : true
                            }
                            value={
                              (newListName || newListName === "") &&
                              editModeState.active &&
                              editModeState.idListMenu === id
                                ? newListName
                                : listName
                            }
                          />

                          {/* Hidden Submit Button */}
                          {editModeState.active &&
                          editModeState.idListMenu === id &&
                          newListName ? (
                            <button
                              id={`hiddenSubmitEditMode-${id}`}
                              type="submit"
                            />
                          ) : null}
                        </div>

                        {/* Collapse Button */}
                        <button
                          type="button"
                          className="bg-secondary-100 dark:bg-primary text-extra-100 px-3 rounded-md font-bold text-base selection:bg-transparent overflow-hidden"
                          onClick={() =>
                            setListMenuData({
                              type: HANDLE_CASE_LISTMENU.COLLAPSE,
                              payload: id,
                            })
                          }
                        >
                          <span className="block -translate-y-1 pointer-events-none">
                            ...
                          </span>
                        </button>
                      </section>

                      {/* Separator */}
                      <Separator
                        payload={{ hasId: true, id }}
                        type={SEPARATOR_TYPE.NORMAL}
                        extraStyle={`hidden my-2 bg-secondary-150`}
                      />

                      {/* Second Part */}
                      <motion.section
                        id={`collapsible-${id}`}
                        className={`hidden justify-between items-center py-1`}
                      >
                        {/* Date Info */}
                        <p className="flex flex-wrap">
                          <span>{day} - </span>
                          <span className="block ml-1"> {date}</span>
                        </p>

                        {/* List Actions */}
                        <div className="flex flex-wrap justify-between selection:bg-transparent w-[5.3rem]">
                          {/* Edit Name List */}
                          <button
                            id={`buttonEdit-${id}`}
                            onClick={() =>
                              setListMenuData({
                                type: HANDLE_CASE_LISTMENU.EDIT,
                                payload: {
                                  commit: editModeState.active,
                                  idListMenu: id,
                                  inputElement: document.getElementById(
                                    `listName-${id}`
                                  ),
                                  newListName,
                                },
                              })
                            }
                            title={
                              editModeState.active &&
                              editModeState.idListMenu === id
                                ? "Konfirmasi Perubahan"
                                : "Edit Nama Kategori"
                            }
                            className="dark:bg-primary bg-secondary-100 py-2 px-3 rounded-md"
                            type="button"
                          >
                            <img
                              width={SIZE_ICON_COLLAPSE}
                              height={SIZE_ICON_COLLAPSE}
                              src={
                                editModeState.active &&
                                editModeState.idListMenu === id
                                  ? confirmEditDark
                                  : editDark
                              }
                            />
                          </button>

                          {/* Delete List Category */}
                          {/* Pop Up Confirm Action */}
                          {modalData.openModal &&
                          modalData.idForDelete === id ? (
                            <ActionsModal
                              modalSection={MODAL_SECTION.LISTBODY_LISTMENU}
                              isOpen={modalData.openModal}
                              modalRegulator={setListMenuData}
                              payload={{ modalData }}
                              listName={listName}
                            />
                          ) : null}
                          <button
                            onClick={() =>
                              setListMenuData({
                                type: HANDLE_CASE_LISTMENU.MODAL,
                                payload: {
                                  openModal: true,
                                  confirm: false,
                                  idForDelete: id,
                                },
                              })
                            }
                            title="Hapus Kategori"
                            className="dark:bg-primary bg-secondary-100 py-2 px-3 rounded-md"
                            type="button"
                          >
                            <img
                              width={SIZE_ICON_COLLAPSE}
                              height={SIZE_ICON_COLLAPSE}
                              src={deleteDark}
                            />
                          </button>
                        </div>
                      </motion.section>
                    </motion.section>
                  </label>
                </li>
              )
            )}
          </ul>
        </motion.form>
      );

    default:
      return null;
  }
}

export { ListMenu };
