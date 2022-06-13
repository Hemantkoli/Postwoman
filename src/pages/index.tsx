import RequestScreen from "@components/RequestScreen";
import Tabs from "@components/Tabs";
import { useState } from "react";
import { FaForward } from "react-icons/fa";
import { IoMdArrowForward } from "react-icons/io";
import Link from "next/link";
import { MdLightbulbOutline } from "react-icons/md";
interface Pair {
  id: number;
  key: string;
  value: string;
}

export default function Home() {
  return (
    <div className="h-screen p-4 ">
      <div className="border border-gray-600">
        <Tabs />
        <div className="flex items-center p-2 ">
          <div className="flex items-center space-x-1 tracking-wide text-white">
            <MdLightbulbOutline />
            <span>
              Tip : use format {"{variableName}"} to use variable in url field. Ex : {"{host}"}/todos/1 where host is a
              variable
            </span>
          </div>
          <Link href="/variables">
            <a className="flex justify-center w-40 ml-auto bg-transparent border button">
              <span className="hidden sm:block">Variables </span>
              <IoMdArrowForward />
            </a>
          </Link>
        </div>
        <RequestScreen />
      </div>
    </div>
  );
}
