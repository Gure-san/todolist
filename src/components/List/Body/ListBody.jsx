import React from "react";
import EmptyListCover from "./EmptyListCover";
import { ListMenu, LISTMENU_TYPE } from "./ListMenu";
import { Separator, SEPARATOR_TYPE } from "./Separator";

export default function ListBody({ appData, dispatch, derivedItems }) {
  return (
    <section>
      <Separator
        type={SEPARATOR_TYPE.NORMAL}
        extraStyle={"my-6 bg-extra-100"}
      />

      {!derivedItems.listData.length ? (
        <EmptyListCover />
      ) : (
        <React.Fragment>
          {/* List Menu */}
          <ListMenu
            dispatch={dispatch}
            derivedItems={derivedItems}
            type={LISTMENU_TYPE.COLLAPSIBLE}
          />

          {/* Clear List Menu */}
          <Separator
            type={SEPARATOR_TYPE.CLEAR}
            extraStyle={"my-6 bg-extra-100"}
            dispatch={dispatch}
            derivedItems={derivedItems}
          />
        </React.Fragment>
      )}
    </section>
  );
}
