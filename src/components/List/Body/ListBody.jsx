import React, { useEffect, useState } from "react";
import EmptyListCover from "./EmptyListCover";
import { ListMenu } from "./ListMenu";
import { HANDLE_CASE } from "../list_fractionCollection";
import { LISTMENU_TYPE } from "./body_fractionCollection";
import {
  SEPARATOR_TYPE,
  MODAL_SECTION,
  THEME_VARIANTS,
  Separator,
  sizeObserver,
} from "../../../provider";

export default function ListBody({ appData, dispatch, derivedItems }) {
  const [listMenuTypeData, setListMenuType] = useState(
    LISTMENU_TYPE.COLLAPSIBLE
  );

  useEffect(() => {
    sizeObserver(window.document.body, setListMenuType);
  }, []);

  return (
    <section className="mb-4 sm:mb-6">
      {!derivedItems.listData.length ? (
        <React.Fragment>
          <Separator
            type={SEPARATOR_TYPE.NORMAL}
            extraStyle={`my-8 ${
              appData.theme === THEME_VARIANTS.DARK_MODE
                ? "bg-extra-100"
                : "bg-tertiary-150"
            }`}
          />

          <EmptyListCover />

          <Separator
            type={SEPARATOR_TYPE.NORMAL}
            extraStyle={`my-8 ${
              appData.theme === THEME_VARIANTS.DARK_MODE
                ? "bg-extra-100"
                : "bg-tertiary-150"
            }`}
          />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Separator
            type={SEPARATOR_TYPE.NORMAL}
            extraStyle={`my-8 ${
              appData.theme === THEME_VARIANTS.DARK_MODE
                ? "bg-secondary-150"
                : "bg-tertiary-150"
            }`}
          />

          {/* List Menu */}
          <ListMenu
            dispatch={dispatch}
            derivedItems={derivedItems}
            type={listMenuTypeData}
            appData={appData}
          />

          {/* Clear List Menu */}
          <Separator
            modalSection={MODAL_SECTION.LISTBODY_CLEAR}
            type={SEPARATOR_TYPE.CLEAR}
            payload={{
              theme: appData.theme,
            }}
            extraStyle={{
              outer: "my-6",
              separator: `${
                appData.theme === THEME_VARIANTS.DARK_MODE
                  ? "bg-secondary-150"
                  : "bg-tertiary-150"
              }`,
            }}
            dispatches={{
              dispatchCallbackClear: () => {
                dispatch({
                  type: HANDLE_CASE.CLEAR,
                  payload: { dispatchApp: derivedItems.dispatchApp },
                });
              },
            }}
          />
        </React.Fragment>
      )}
    </section>
  );
}
