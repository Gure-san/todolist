import React, { useEffect, useState } from "react";
import EmptyListCover from "./EmptyListCover";
import { ListMenu } from "./ListMenu";
import { Separator } from "./Separator";
import { LISTMENU_TYPE, SEPARATOR_TYPE } from "./body_fractionCollection";
import { sizeObserver, THEME_VARIANTS } from "../../../provider";

export default function ListBody({ appData, dispatch, derivedItems }) {
  const [listMenuTypeData, setListMenuType] = useState(
    LISTMENU_TYPE.COLLAPSIBLE
  );

  useEffect(() => {
    sizeObserver(window.document.body, setListMenuType);
  }, []);

  return (
    <section>
      <Separator
        type={SEPARATOR_TYPE.NORMAL}
        extraStyle={`my-6 ${
          appData.theme === THEME_VARIANTS.DARK_MODE
            ? "bg-extra-100"
            : "bg-tertiary-150"
        }`}
      />

      {!derivedItems.listData.length ? (
        <EmptyListCover />
      ) : (
        <React.Fragment>
          {/* List Menu */}
          <ListMenu
            dispatch={dispatch}
            derivedItems={derivedItems}
            type={listMenuTypeData}
            appData={appData}
          />

          {/* Clear List Menu */}
          <Separator
            type={SEPARATOR_TYPE.CLEAR}
            extraStyle={`my-6 ${
              appData.theme === THEME_VARIANTS.DARK_MODE
                ? "bg-extra-100"
                : "bg-tertiary-150"
            }`}
            dispatch={dispatch}
            derivedItems={derivedItems}
            theme={appData.theme}
          />
        </React.Fragment>
      )}
    </section>
  );
}
