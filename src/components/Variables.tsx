import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { useLayoutDispatch, useLayoutState } from "src/context/layout.context";

const Variables = () => {
  const { variables } = useLayoutState();
  const layoutDispatch = useLayoutDispatch();

  const addNewVariableField = () => {
    layoutDispatch({ type: "ADD_VARIABLE" });
  };

  const deleteField = (id: Number) => {
    layoutDispatch({ type: "REMOVE_VARIABLE", payload: id });
  };

  const updatePair = (event, id: Number, type: "key" | "value") => {
    console.log({ id, type });

    layoutDispatch({
      type: "UPDATE_VARIABLE",
      payload: {
        id,
        type,
        value: event.target.value,
      },
    });
  };

  return (
    <div>
      {/* create variables */}
      <div className="text-sm flex w-full uppercase border-[0.5px] border-gray-600 divide-x divide-gray-600 ">
        <span className="flex-1 px-2 py-2 bg-transparent outline-none">Variable</span>
        <span className="flex-1 px-2 py-2 bg-transparent outline-none">Value</span>
      </div>
      {variables.map((pair) => (
        <div key={pair.id} className="relative flex w-full border-[0.5px] border-t-0 items-center border-gray-600">
          <input
            className="border-r border-gray-600 query-inputs"
            type="text"
            placeholder="Add a new variable"
            value={pair.key}
            onChange={(event) => updatePair(event, pair.id, "key")}
          />
          <input
            className=" query-inputs"
            type="text"
            placeholder="value"
            value={pair.value}
            onChange={(event) => updatePair(event, pair.id, "value")}
          />
          {/* <input className="query-inputs" type="text" placeholder="description" /> */}
          <MdDelete onClick={() => deleteField(pair.id)} className="absolute text-gray-400 cursor-pointer right-2" />
        </div>
      ))}
      <button onClick={addNewVariableField} className="mt-2 ml-2 text-white ">
        <IoMdAdd size={26} className="text-gray-400 opacity-50" />
      </button>
    </div>
  );
};

export default Variables;
