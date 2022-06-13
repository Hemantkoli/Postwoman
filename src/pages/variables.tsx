import Variables from "@components/Variables";
import Link from "next/link";
import { IoMdArrowBack } from "react-icons/io";

const variables = () => {
  return (
    <div className="h-screen p-6 ">
      <Link href="/">
        <a className="flex items-center p-4 space-x-3 text-sm border border-gray-600 bg-dark-700 w-max">
          <IoMdArrowBack size={20} />
          <span>Go to Workspace</span>
        </a>
      </Link>
      <h5 className="p-2 text-sm border border-gray-600">
        Global variables for a workspace are a set of variables that are always available within the scope of that
        workspace. They can be viewed and edited by anyone in that workspace.{" "}
      </h5>
      <div className="border border-gray-600">
        <Variables />
      </div>
    </div>
  );
};

export default variables;
