import { useEffect, useState } from "react";
import clearDark from "../../../assets/List-Section/clear-dark.png";
import clearLight from "../../../assets/List-Section/clear-light.png";
import { ActionsModal } from "../../../provider";
import { HANDLE_CASE } from "../List";

const ICON_SIZE = 16;

const SEPARATOR_TYPE = {
  NORMAL: "normal",
  LISTNAME_LISTDATE: "listName_listDate",
  CLEAR: "clear",
};

function Separator({ type, extraStyle = "", dispatch, derivedItems }) {
  // Functional Confirm Action For Separator Type Clear
  const [{ openModal, confirm }, setConfirmAction] = useState({
    openModal: false,
    confirm: false,
  });

  useEffect(() => {
    // Confirm Clear Action
    if (confirm) {
      dispatch({
        type: HANDLE_CASE.CLEAR,
        payload: { dispatchApp: derivedItems.dispatchApp },
      });
    }
  }, [openModal]);

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
          {openModal ? (
            <ActionsModal
              isOpen={openModal}
              modalRegulator={setConfirmAction}
            />
          ) : null}
          <hr
            className={`absolute border-0 h-0.5 w-full rounded-full ${
              extraStyle || ""
            }`}
          />
          <button
            onClick={
              () => console.log("clear button clicked")
              // setConfirmAction({
              //   openModal: !openModal,
              //   confirm: false,
              // })
            }
            className="dark:bg-secondary-100 dark:hover:bg-secondary-150 dark:border-secondary-150 dark:shadow-primary dark:shadow-[inset_0px_0px_1rem_bg-primary] selection:bg-transparent p-2.5 rounded-full cursor-pointer duration-100 border-2 mr-2.5 active:translate-y-0.5 z-10"
            type="button"
          >
            <img src={clearDark} width={ICON_SIZE} height={ICON_SIZE} />
          </button>
        </section>
      );
  }
}

export { Separator, SEPARATOR_TYPE };
