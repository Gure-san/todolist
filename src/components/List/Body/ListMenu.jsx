import { motion } from "framer-motion";
import { useEffect, useReducer, useRef, useState } from "react";
import deleteDark from "../../../assets/List-Section/delete-dark.png";
import deleteLight from "../../../assets/List-Section/delete-light.png";
import editDark from "../../../assets/List-Section/edit-dark.png";
import editLight from "../../../assets/List-Section/edit-light.png";
import confirmEditDark from "../../../assets/List-Section/confirm-dark.png";
import confirmEditLight from "../../../assets/List-Section/confirm-light.png";
import { Separator, SEPARATOR_TYPE } from "./Separator";
import { HANDLE_CASE } from "../List";
import {
  ActionsModal,
  SECTION_COMPONENT,
  MODAL_SECTION,
} from "../../../provider";
import { displayImplementer } from "./helper";

const ROOT_ELEMENT = document.getElementById("root");
const SIZE_ICON = 14;

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

const HANDLE_CASE_LISTMENU = {
  COLLAPSE: "handle_collapse",
  CLEAR: "handle_clear",
  MODAL: "handle_modal",
  EDIT: "handle_edit",
};

const LISTMENU_TYPE = {
  NORMAL: "normal",
  COLLAPSIBLE: "collapsible",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case HANDLE_CASE_LISTMENU.COLLAPSE:
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
          editModeState: {
            active: false,
            idListMenu: null,
            inputElement: null,
          },
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
        editModeState: {
          active: false,
          idListMenu: null,
          inputElement: null,
        },
      };

    case HANDLE_CASE_LISTMENU.EDIT:
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

      console.log(listMenuData_Edit);
      console.log("asw tenan su asw");
      return {
        ...state,
        editModeState: listMenuData_Edit,
      };

    case HANDLE_CASE_LISTMENU.default:
      return state;
  }
}

function handleChange(target, dispatch, inputElement) {
  return dispatch(target.value);
}

function ListMenu({ type, derivedItems, dispatch }) {
  const [
    { modalData, editModeState, collapseData, newListName },
    setListMenuData,
  ] = useReducer(reducer, INITIALSTATE_LISTMENU);

  useEffect(() => {
    // Handle Edit Mode State
    if (editModeState.active) {
      editModeState.inputElement.focus();
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
  }, [modalData, editModeState]);

  switch (type) {
    case LISTMENU_TYPE.NORMAL:
      return (
        <form
          className="text-tertiary-100 text-sm"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <ul>
            <li>
              <label className="flex" htmlFor="ok">
                <input type="checkbox" id="ok" />

                {/* List Info */}
                <div className="flex ml-2 mr-4">
                  <input
                    // ref={inputElement}
                    onChange={(e) => console.log(1)}
                    className={`bg-slate-500 max-w-max`}
                    readOnly={false}
                    type="text"
                  />
                  <p className="selection:bg-transparent">18 November 2023</p>
                </div>

                {/* List Actions */}
                <div>
                  {/* Delete */}
                  <button type="button">
                    <img width={SIZE_ICON} height={SIZE_ICON} src={editDark} />
                  </button>

                  {/* Edit Name */}
                  <button type="button">
                    <img
                      width={SIZE_ICON}
                      height={SIZE_ICON}
                      src={deleteDark}
                    />
                  </button>
                </div>
              </label>
            </li>
          </ul>
        </form>
      );

    case LISTMENU_TYPE.COLLAPSIBLE:
      return (
        <motion.form
          className="text-tertiary-100 text-sm"
          onSubmit={(e) => {
            e.preventDefault();
            alert("Perubahan dikonfirmasi");
          }}
        >
          <ul id="listMenuContainer">
            {derivedItems.listData.map(({ id, listName, active, date }) => (
              <li className="mb-6" key={id} id={`menu-${id}`}>
                <label className="w-full flex relative" htmlFor={`list-${id}`}>
                  {/* Checkbox */}
                  <section className="absolute -top-2 -left-2">
                    <input
                      className="relative appearance-none w-6 h-6 rounded-md bg-secondary-100 border-secondary-150 border-2 checked:before:opacity-100 before:opacity-0 before:absolute before:w-2.5 before:h-2.5 before:bg-extra-100 before:rounded-sm before:top-[5px] before:left-[5px]"
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
                    className="flex flex-col w-full bg-secondary-100 rounded-md px-5 py-2 duration-300"
                  >
                    {/* First Part */}
                    <section className="flex justify-between items-end p w-full">
                      {/* List Name */}
                      <input
                        id={`listName-${id}`}
                        type="text"
                        onChange={(e) => console.log(e.target)}
                        className={`bg-transparent max-w-max outline-none ${
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
                        value={listName}
                      />

                      {/* Collapse Button */}
                      <button
                        type="button"
                        className="bg-primary text-extra-100 px-3 rounded-md font-bold text-base selection:bg-transparent overflow-hidden"
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
                      derivedItems={{ hasId: true, id }}
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
                        <span>Senin - </span>
                        <span className="block ml-1"> {date}</span>
                      </p>

                      {/* List Actions */}
                      <div className="flex flex-wrap justify-between selection:bg-transparent w-[5.3rem]">
                        {/* Edit Name List */}
                        <button
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
                          title={`${
                            editModeState.active &&
                            editModeState.idListMenu === id
                              ? "Konfirmasi Perubahan"
                              : "Edit Nama Kategori"
                          }`}
                          className="bg-primary py-2 px-3 rounded-md"
                          type={`${
                            editModeState.active &&
                            editModeState.idListMenu === id
                              ? "submit"
                              : "button"
                          }`}
                        >
                          <img
                            width={SIZE_ICON}
                            height={SIZE_ICON}
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
                        {modalData.openModal && !modalData.confirm ? (
                          <ActionsModal
                            modalSection={MODAL_SECTION.LISTBODY_LISTMENU}
                            isOpen={modalData.openModal}
                            modalRegulator={setListMenuData}
                            payload={{ modalData }}
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
                          className="bg-primary py-2 px-3 rounded-md"
                          type="button"
                        >
                          <img
                            width={SIZE_ICON}
                            height={SIZE_ICON}
                            src={deleteDark}
                          />
                        </button>
                      </div>
                    </motion.section>
                  </motion.section>
                </label>
              </li>
            ))}
          </ul>
        </motion.form>
      );

    default:
      return null;
  }
}

export { ListMenu, LISTMENU_TYPE, HANDLE_CASE_LISTMENU };
