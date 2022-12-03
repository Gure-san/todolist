import { useEffect, useState } from "react";
import clearDark from "../../../assets/List-Section/clear-dark.png";
import clearLight from "../../../assets/List-Section/clear-light.png";
import { ActionsModal, MODAL_SECTION, THEME_VARIANTS } from "../../../provider";
import { HANDLE_CASE } from "../list_fractionCollection";
import { SEPARATOR_TYPE } from "./body_fractionCollection";

const ICON_SIZE = 16;

function Separator({ type, extraStyle, dispatch, derivedItems, theme }) {
  // Functional Confirm Action For Separator Type Clear
  const [modalData, setModalData] = useState({
    openModal: false,
    confirm: false,
  });

  useEffect(() => {
    // Confirm Clear Action
    if (modalData.confirm) {
      dispatch({
        type: HANDLE_CASE.CLEAR,
        payload: { dispatchApp: derivedItems.dispatchApp },
      });
    }
  }, [modalData]);

  switch (type) {
    case SEPARATOR_TYPE.NORMAL:
      return (
        <hr
          id={
            derivedItems && derivedItems.hasId
              ? `separator-${derivedItems.id}`
              : ""
          }
          className={`border-0 h-0.5 w-full rounded-full ${extraStyle || ""}`}
        />
      );

    case SEPARATOR_TYPE.CLEAR:
      return (
        <section className="w-full relative flex justify-center items-center">
          {/* Modal */}
          {modalData.openModal ? (
            <ActionsModal
              isOpen={modalData.openModal}
              modalRegulator={setModalData}
              modalSection={MODAL_SECTION.LISTBODY_CLEAR}
            />
          ) : null}
          <hr
            className={`absolute border-0 h-0.5 w-full rounded-full ${
              extraStyle || ""
            }`}
          />
          <button
            onClick={() =>
              setModalData({
                openModal: !modalData.openModal,
                confirm: false,
              })
            }
            className="dark:bg-secondary-100 dark:hover:bg-secondary-150 dark:border-secondary-150 dark:shadow-primary dark:shadow-[inset_0px_0px_1rem_bg-primary] hover:bg-tertiary-150 bg-tertiary-100 border-tertiary-150 shadow-tertiary-150 shadow-[inset_0px_0px_1rem_bg-tertiary-150] selection:bg-transparent p-2.5 rounded-full cursor-pointer duration-100 border-2 mr-2.5 active:translate-y-0.5 z-10"
            type="button"
          >
            <img
              src={theme === THEME_VARIANTS.DARK_MODE ? clearDark : clearLight}
              width={ICON_SIZE}
              height={ICON_SIZE}
            />
          </button>
        </section>
      );
  }
}

export { Separator };
