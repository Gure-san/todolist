import { THEME_VARIANTS } from "../../../provider";
import editDark from "../../../assets/List-Section/edit-dark.png";
import editLight from "../../../assets/List-Section/edit-light.png";
import confirmEditDark from "../../../assets/List-Section/confirm-dark.png";
import confirmEditLight from "../../../assets/List-Section/confirm-light.png";

const HANDLE_CASE_LISTMENU = {
  COLLAPSE: "handle_collapse",
  CLEAR: "handle_clear",
  MODAL: "handle_modal",
  EDIT: "handle_edit",
  CHANGE: "handle_change",
};

const LISTMENU_TYPE = {
  NORMAL: "normal",
  COLLAPSIBLE: "collapsible",
};

function displayImplementer(data) {
  return data.forEach(({ active, collapsibleElements }) => {
    const { separator, collapsibleElement } = collapsibleElements;
    if (active) {
      separator.style.display = "block";
      collapsibleElement.style.display = "flex";
    } else {
      separator.style.display = "none";
      collapsibleElement.style.display = "none";
    }
  });
}

function getEditIconSrc(theme, editModeData, currentId) {
  let src = null;

  if (editModeData.active && editModeData.idListMenu === currentId) {
    src =
      theme === THEME_VARIANTS.DARK_MODE ? confirmEditDark : confirmEditLight;
    return src;
  }

  src = theme === THEME_VARIANTS.DARK_MODE ? editDark : editLight;
  return src;
}

export {
  HANDLE_CASE_LISTMENU,
  LISTMENU_TYPE,
  displayImplementer,
  getEditIconSrc,
};
