import Delete from "../../assets/delete.png";
import Edit from "../../assets/edit.png";
import Add from "../../assets/add.png";
import Clear from "../../assets/clear.png";
import { HANDLE_CASE } from "./Task";

const WIDTH_ICON = 20;
const HEIGHT_ICON = 20;

function SubmitTaskFormButton({dispatch, payload}) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        dispatch({
          type : HANDLE_CASE.ADD,
          payload
        });
      }}
      type="submit"
      className="flex bg-slate-200 px-4 py-1.5 rounded-md border-2 border-slate-300 text-sm">
      Tambah
      <img
        className="ml-2"
        src={Add}
        alt="tambah task"
        width={WIDTH_ICON}
        height={HEIGHT_ICON}
      />
    </button>
  );
}

function ClearTaskButton({dispatch, payload}) {
  return (
    <button
      onClick={() => dispatch({
        type : HANDLE_CASE.CLEAR,
        payload
      })}
      className="flex my-4 bg-slate-200 px-4 py-1.5 rounded-md border-2 border-slate-300 text-sm">
      Hapus Semua Tugas
      <img
        className="ml-2"
        src={Clear}
        alt="hapus semua list"
        width={WIDTH_ICON}
        height={HEIGHT_ICON}
      />
    </button>
  )
}

function DeleteTaskButton({dispatch, payload}) {
  return (
    <button
      onClick={() => dispatch({
        type : HANDLE_CASE.DELETE,
        payload
      })}
      className="flex my-4 bg-slate-200 px-4 py-1.5 rounded-md border-2 border-slate-300 text-sm">
      Hapus Semua Tugas yang Selesai
      <img
        className="ml-2"
        src={Clear}
        alt="hapus semua task yang selesai"
        width={WIDTH_ICON}
        height={HEIGHT_ICON}
      />
    </button>
  )
}

export {
  SubmitTaskFormButton,
  ClearTaskButton,
  DeleteTaskButton
}