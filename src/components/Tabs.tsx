import classNames from "classnames";
import React, { FC } from "react";
import { useLayoutDispatch, useLayoutState } from "src/context/layout.context";

import { AiOutlinePlus } from "react-icons/ai";

const Tabs = () => {
  const { activeRequestScreenId, requestScreens } = useLayoutState();
  const layoutDispatch = useLayoutDispatch();

  const setActiveScreen = (id: number) => {
    layoutDispatch({ type: "SET_ACTIVE_SCREEN", payload: id });
  };

  const addNewScreen = () => {
    layoutDispatch({ type: "ADD_NEW_REQUEST_SCREEN" });
  };
  const removeRequestScreen = (screenId: number) => {
    layoutDispatch({ type: "DELETE_REQUEST_SCREEN", payload: screenId });
  };

  return (
    <div className="flex text-sm ">
      {requestScreens.map(({ id, requestData, name }) => (
        <div
          key={id}
          className={classNames(
            "flex items-center border-r border-b border-t min-w-[180px] py-2 px-3 border-gray-500  cursor-pointer",
            {
              "border-green-400 border-t-2 border-b-0 border-r-2": activeRequestScreenId === id,
            }
          )}
          onClick={() => setActiveScreen(id)}
        >
          <span className="mx-2 text-xs">{requestData.type}</span>
          <span>{name}</span>
          <button
            className="ml-auto"
            onClick={(e) => {
              e.stopPropagation();
              removeRequestScreen(id);
            }}
          >
            <AiOutlinePlus className="self-end rotate-45 opacity-40 " size={22} />
          </button>
        </div>
      ))}
      <button onClick={addNewScreen}>
        <AiOutlinePlus size={22} className="mx-2 focus:outline-none" />
      </button>
    </div>
  );
};
export default React.memo(Tabs);
