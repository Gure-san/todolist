import Delete from "../../assets/delete.png";
import Edit from "../../assets/edit.png";
import Add from "../../assets/add.png";
import Clear from "../../assets/clear.png";
import React from "react";
import { HANDLE_CASE } from "./List";

const WIDTH_ICON = 20;
const HEIGHT_ICON = 20;

function SubmitListFormButton({ dispatch, payload, editMode }) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        dispatch({ 
          type: editMode ? HANDLE_CASE.EDIT : HANDLE_CASE.ADD, 
          payload });
      }}
      type="submit"
      className="flex bg-slate-200 px-4 py-1.5 rounded-md border-2 border-slate-300 text-sm">
      {editMode ? 'Edit' : 'Tambah'}
      <img
        className="ml-2"
        src={editMode ? Edit : Add}
        alt="tambah list"
        width={WIDTH_ICON}
        height={HEIGHT_ICON}
      />
    </button>
  );
}

function ClearListButton({ dispatch }) {
  return (
    <button
      onClick={() => dispatch.setListsData({ 
        type: HANDLE_CASE.CLEAR,
        payload : { dispatchApp : dispatch.dispatchApp }
      })}
      className="flex my-4 bg-slate-200 px-4 py-1.5 rounded-md border-2 border-slate-300 text-sm"
    >
      Hapus Semua List
      <img
        className="ml-2"
        src={Clear}
        alt="hapus semua list"
        width={WIDTH_ICON}
        height={HEIGHT_ICON}
      />
    </button>
  );
}

function ActionListButtons({ 
  dispatch, 
  idForDelete, 
  elementToFocus, 
  listNameForEdit }) {
  return (
    <React.Fragment>
      <button
        onClick={() => dispatch.setListsData({
          type : HANDLE_CASE.DELETE, 
          payload : { idForDelete, dispatchApp : dispatch.dispatchApp } })}>
        <img
          src={Delete}
          width={WIDTH_ICON}
          height={HEIGHT_ICON}
          alt="Delete List"/>
      </button>

      <button
        onClick={() => dispatch.setListsData({
          type : HANDLE_CASE.EDIT,
          payload : {
            element : elementToFocus,
            listName : listNameForEdit
          } })}>
        <img
          src={Edit}
          width={WIDTH_ICON}
          height={HEIGHT_ICON}
          alt="Edit List"/>
      </button>
    </React.Fragment>
  );
}

export { 
  ActionListButtons, 
  SubmitListFormButton, 
  ClearListButton 
};
