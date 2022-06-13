import axios from "axios";
import { SetStateAction } from "react";
import { Dispatch, FC, useState } from "react";
import { MdDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { useLayoutState } from "src/context/layout.context";

interface Pair {
  id: number;
  key: string;
  value: string;
}

type Props = {
  pairs: Pair[];
  setPairs: Dispatch<SetStateAction<Pair[]>>;
};

const QueryParams: FC<Props> = ({ pairs, setPairs }) => {
  const addQueryParamField = () => {
    setPairs([
      ...pairs,
      {
        id: Math.floor(Math.random() * 2000),
        key: "",
        value: "",
      },
    ]);
  };

  const deleteField = (id: Number) => {
    const updatedPairs = pairs.filter((pair) => pair.id !== id);
    setPairs(updatedPairs);
  };

  const updatePair = (event, id: Number, type: "key" | "value") => {
    let tempPairs = [...pairs];
    const pairIndex = pairs.findIndex((pair) => pair.id === id);
    tempPairs[pairIndex] = { ...tempPairs[pairIndex], [type]: event.target.value };
    setPairs(tempPairs);
  };

  return (
    <>
      <h1 className="px-2 mb-2 text-sm">Query Params</h1>

      <div className="text-sm flex w-full uppercase border-[0.5px] border-gray-600 divide-x divide-gray-600 ">
        <span className="flex-1 px-2 py-2 bg-transparent outline-none">Key</span>
        <span className="flex-1 px-2 py-2 bg-transparent outline-none">Value</span>
      </div>
      {pairs.map((pair) => (
        <div key={pair.id} className="relative flex w-full border-[0.5px] border-t-0 items-center border-gray-600">
          <input
            className="border-r border-gray-600 query-inputs "
            type="text"
            placeholder="key"
            size={1}
            value={pair.key}
            onChange={(event) => updatePair(event, pair.id, "key")}
          />
          <input
            className=" query-inputs"
            type="text"
            placeholder="value"
            size={1}
            value={pair.value}
            onChange={(event) => updatePair(event, pair.id, "value")}
          />
          {/* <input className="query-inputs" type="text" placeholder="description" /> */}
          <MdDelete onClick={() => deleteField(pair.id)} className="absolute text-gray-400 cursor-pointer right-2" />
        </div>
      ))}
      <button onClick={addQueryParamField} className="mt-2 text-white ">
        <IoMdAdd size={26} className="text-gray-500" />
      </button>
    </>
  );
};

export default QueryParams;

// function keyValuePairsToObjects(container) {
//   const pairs = container.querySelectorAll("[data-key-value-pair]");
//   return [...pairs].reduce((data, pair) => {
//     const key = pair.querySelector("[data-key]").value;
//     const value = pair.querySelector("[data-value]").value;

//     if (key === "") return data;
//     return { ...data, [key]: value };
//   }, {});
// }
