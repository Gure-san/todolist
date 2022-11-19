import { motion } from "framer-motion";
import { useEffect, useReducer, useRef, useState } from "react";
import deleteDark from "../../../assets/List-Section/delete-dark.png";
import deleteLight from "../../../assets/List-Section/delete-light.png";
import editDark from "../../../assets/List-Section/edit-dark.png";
import editLight from "../../../assets/List-Section/edit-light.png";
import { Separator, SEPARATOR_TYPE } from "./Separator";

const SIZE_ICON = 14;
const DEFAULT_SIZE_INPUT = 15;

const LISTMENU_TYPE = {
  NORMAL: "normal",
  COLLAPSIBLE: "collapsible",
};

function setLengthInput(stateValue) {
  return stateValue ? stateValue.length : DEFAULT_SIZE_INPUT;
}

function handleChange(target, dispatch) {
  return dispatch(target.value);
}

function ListMenu({ type }) {
  const [inputValue, setInputValue] = useState("Sekolah");
  const [collapse, setCollapse] = useState(false);
  const inputElement = useRef();
  const secondPartContent = useRef();

  useEffect(() => {
    inputElement.current.style.width = `${setLengthInput(inputValue)}ch`;
  }, [inputValue]);

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
                    ref={inputElement}
                    onChange={(e) => handleChange(e)}
                    className={`bg-slate-500 max-w-max`}
                    readOnly={false}
                    type="text"
                    value={inputValue}
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
          }}
        >
          <ul>
            <li>
              <label 
              className="w-full flex relative" 
              htmlFor="ok">
                {/* Checkbox */}
                <section 
                className="absolute -top-2 -left-2">
                  <input
                  onChange={(e) => console.log(e.target.checked)}
                  className="relative appearance-none w-6 h-6 rounded-md bg-secondary-100 border-secondary-150 border-2 checked:before:opacity-100 before:opacity-0 before:absolute before:w-2.5 before:h-2.5 before:bg-extra-100 before:rounded-sm before:top-[5px] before:left-[5px]" 
                  type="checkbox" 
                  id="ok" />
                </section>

                {/* Collapsible List Info */}
                <motion.section 
                
                className="flex flex-col w-full bg-secondary-100 rounded-md px-5 py-2 duration-300">
                  {/* First Part */}
                  <section
                  className="flex justify-between items-end p w-full">
                    {/* List Name */}
                    <input
                      ref={inputElement}
                      onChange={(e) => handleChange(e.target, setInputValue)}
                      className={`bg-transparent max-w-max pointer-events-none selection:bg-transparent`}
                      readOnly={true}
                      type="text"
                      value={inputValue}
                    />

                    {/* Collapse Button */}
                    <button
                    type="button"
                    className="bg-primary text-extra-100 px-3 rounded-md font-bold text-base selection:bg-transparent overflow-hidden"
                    onClick={() => {
                      console.log(secondPartContent.current.parentElement.parentElement)
                      setCollapse(collapseState => !collapseState)
                    }}>
                      <span className="block -translate-y-1">...</span>
                    </button>
                  </section>

                  {/* Separator */} 
                  <Separator 
                  type={SEPARATOR_TYPE.NORMAL} 
                  extraStyle={`my-2 bg-secondary-150 ${collapse ? "" : "hidden"}`}/>

                  {/* Second Part */}
                  <motion.section 
                  className={`${collapse ? "flex" : "hidden"} justify-between items-center py-1`}>
                    {/* Date Info */}
                    <p>19 Desember 2022</p>

                    {/* List Actions */}
                    <div 
                    ref={secondPartContent}
                    className="selection:bg-transparent">
                      <button 
                      title="Edit Nama Kategori"
                      className="mr-2 bg-primary py-2 px-3 rounded-md"
                      type="button">
                        <img width={SIZE_ICON} height={SIZE_ICON} src={editDark} />
                      </button>

                      {/* Edit Name */}
                      <button
                      title="Hapus Kategori"
                      className="bg-primary py-2 px-3 rounded-md"
                      type="button">
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
          </ul>
        </motion.form>
      );

    default:
      return null;
  }
}

export { ListMenu, LISTMENU_TYPE };
