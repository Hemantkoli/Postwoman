import axios, { AxiosError, CancelTokenSource } from "axios";
import { useEffect, useRef, useState } from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import QueryParams from "./QueryParams";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import { Controlled as ControlledEditor } from "react-codemirror2";
if (typeof navigator !== "undefined") {
  require("codemirror/mode/javascript/javascript");
  require("codemirror/addon/edit/closebrackets");
}
//TODO remove this library, add regex from SOverflow
import validUrl from "valid-url";
import isUrl from "is-url";
import { FaGithub, FaSave } from "react-icons/fa";
import { RiSendPlaneFill } from "react-icons/ri";
import clientInstance from "utils/apiClient";
import classNames from "classnames";
import { useLayoutDispatch, useLayoutState } from "src/context/layout.context";

const options = ["GET", "POST", "PUT", "DELETE", "PATCH"];

//! of no use so far
function isURL(str: string) {
  var urlRegex = /(?:^|[ \t])((https?:\/\/)?(?:localhost|[\w-]+(?:\.[\w-]+)+)(:\d+)?(\/\S*)?)/;

  var url = new RegExp(urlRegex, "i");
  return str.length < 2083 && url.test(str);
}

let cancelTokenSource: CancelTokenSource;

// const variables = [
//   {
//     name: "BASE_URL",
//     value: "http://localhost:3000",
//   },
//   {
//     name: "BASE_URL_2",
//     value: "http://localhost:3002",
//   },
// ];

// url = "{BASE_URL}/api/todos/";

const RequestSection = () => {
  const { responseLoading } = useLayoutState();
  const { activeRequestScreenId, requestScreens, variables } = useLayoutState();
  const urlInput = useRef(null);

  const activeRequestScreenIndex = requestScreens.findIndex(
    (requestScreen) => requestScreen.id === activeRequestScreenId
  );

  const requestScreen = requestScreens[activeRequestScreenIndex];
  const {
    requestData: { type, body, queryParams, url },
  } = requestScreen;
  const layoutDispatch = useLayoutDispatch();

  const [currentTab, setCurrentTab] = useState<"Params" | "Headers" | "Tests" | "Body">("Params");
  // const [url, setUrl] = useState("");
  // const [method, setMethod] = useState<"GET" | "POST" | "PUT" | "DELETE" | "PATCH">("GET");

  const keyValuePairsToObject = () => {
    const obj = {};
    requestScreen.requestData.queryParams.map((pair) => {
      if (!pair.key) return;
      obj[pair.key] = pair.value;
    });
    return obj;
  };

  const getValue = (variableName: string) => variables.find((v) => v.key === variableName)?.value;
  const getRawURL = (url: string) => {
    // extract all the variables eg : {BASE_URL} => remove the braces => replace with the values
    return url.replace(/{(.*?)}/gi, (x: string) => getValue(x.substring(1, x.length - 1)));
  };

  const [notValidUrl, setNotValidUrl] = useState(false);

  useEffect(() => {
    const listener = async (event) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        // check if input is in focus or not
        if (document.activeElement !== urlInput.current) return;

        if (responseLoading) cancelRequest();
        else await makeRequest();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, []);

  // Cancel request
  const cancelRequest = () => {
    cancelTokenSource.cancel();
  };

  const makeRequest = async () => {
    console.log("make req");

    let newUrl: string;
    if (url.search(/{(.*?)}/) === -1) newUrl = url;
    else newUrl = getRawURL(url);

    console.log("valid", isUrl(newUrl));

    if (!isUrl(newUrl)) {
      console.log("here");

      setNotValidUrl(true);
      return;
    }

    layoutDispatch({ type: "START_RESPONSE_LOADER" });
    cancelTokenSource = axios.CancelToken.source();
    try {
      const response = await clientInstance({
        method: type,
        url: newUrl,
        params: keyValuePairsToObject(),
        data: JSON.parse(requestScreen.requestData.body),
        cancelToken: cancelTokenSource.token,
      });

      layoutDispatch({
        type: "SET_RESPONSE_DATA",
        payload: {
          dataObj: {
            content: JSON.stringify(response.data, null, 2),
            statusCode: response.status,
            size: "100", // TODO
            //@ts-ignore
            duration: response.duration / 1000.0,
          },
          requestScreen: requestScreen,
          id: requestScreen.id,
          error: false,
        },
      });

      // setResponseContent();
    } catch (error) {
      const err: AxiosError = error;
      //499 Client Closed Request Used when the client has closed the request before the server could send a response.
      // console.log(error.response.data.message);

      layoutDispatch({
        type: "SET_RESPONSE_DATA",
        payload: {
          dataObj: {
            content: err.response?.data?.message || err.message,
            statusCode: err?.response?.status || 499,
            size: "0", // TODO
            //@ts-ignore
            duration: 0, // TODO FIX
          },
          requestScreen: requestScreen,
          id: requestScreen.id,
          error: true,
        },
      });
      layoutDispatch({
        type: "SET_ERROR",
        payload: {
          screenId: requestScreen.id,
          requestScreen,
        },
      });
    } finally {
      layoutDispatch({ type: "STOP_RESPONSE_LOADER" });
    }
  };

  const handleRequestMethod = (type) => {
    layoutDispatch({
      type: "SET_REQUEST_DATA",
      payload: { key: "method", data: type.value, requestScreen: requestScreen, id: requestScreen.id },
    });
  };

  const handleRequestBody = (value) => {
    layoutDispatch({
      type: "SET_REQUEST_DATA",
      payload: { key: "body", data: value, requestScreen: requestScreen, id: requestScreen.id },
    });
  };

  const handelUrlChange = (value) => {
    setNotValidUrl(false);
    layoutDispatch({
      type: "SET_REQUEST_DATA",
      payload: { key: "url", data: value, requestScreen: requestScreen, id: requestScreen.id },
    });
  };
  const handleQueryPairs = (pairs) => {
    layoutDispatch({
      type: "SET_REQUEST_DATA",
      payload: { key: "queryParams", data: pairs, requestScreen: requestScreen, id: requestScreen.id },
    });
  };

  return (
    <div className="h-auto border-b border-gray-600 ">
      {/* header start */}
      <div className="flex items-center space-x-2 ">
        <div className="flex flex-1 ">
          <Dropdown
            options={options}
            onChange={handleRequestMethod}
            value={type}
            placeholder="Select an option"
            className=""
            controlClassName="dropdownControlClass"
          />

          <input
            className={classNames("flex-1 px-4 text-white outline-none bg-dark-700", {
              "border-red-500 border": notValidUrl,
            })}
            placeholder="https://jsonplaceholder.typicode.com/todos/1"
            value={url}
            ref={urlInput}
            onChange={(e) => handelUrlChange(e.target.value)}
            type="url"
            size={1}
          />
        </div>
        <button
          className={classNames("button ", {
            "bg-red-500": responseLoading,
          })}
          onClick={responseLoading ? cancelRequest : makeRequest}
        >
          <RiSendPlaneFill />
          <span className="hidden sm:block">{responseLoading ? "Cancel" : "Send"}</span>
        </button>
        <button className="button">
          <FaSave />
          <span className="hidden sm:block">Save</span>
        </button>
        <button
          className="bg-yellow-800 button"
          onClick={() => window.open("")}
        >
          <FaGithub />
          <span className="hidden sm:block">Github</span>
        </button>
      </div>
      {/* header end */}

      {/* body start*/}

      {/* tabs */}
      <div className="flex mt-4 space-x-5 border-b border-gray-600">
        <button className={classNames("p-2 focus:outline-none",{
          "border-2 border-white":currentTab==="Params",
        })}
         onClick={() => setCurrentTab("Params")}>
          Params
        </button>
        <button className={classNames("p-2 focus:outline-none",{
          "border-2  border-white":currentTab==="Headers",
        })}
         onClick={() => setCurrentTab("Headers")}>
          Headers
        </button>
        <button className={classNames("p-2 focus:outline-none",{
          "border-2 border-white":currentTab==="Body",
        })}
         onClick={() => setCurrentTab("Body")}>
          Body
        </button>
        <button className={classNames("p-2 focus:outline-none",{
          "border-2 border-white":currentTab==="Tests",
        })}
         onClick={() => setCurrentTab("Tests")}>
          Tests
        </button>
      </div>

      <div className="h-56 my-2">
        {currentTab === "Params" && (
          <QueryParams pairs={requestScreen.requestData.queryParams} setPairs={handleQueryPairs} />
        )}
        {currentTab === "Body" && (
          <ControlledEditor
            onBeforeChange={(editor, data, value) => handleRequestBody(value)}
            value={requestScreen.requestData.body}
            className="code-mirror-wrapper"
            options={{
              lineWrapping: true,
              theme: "material",
              lineNumbers: true,
              mode: {
                name: "javascript",
                json: true,
                statementIndent: 4,
                indentUnit: 10,
              },
              autoCloseBrackets: true,

              tabSize: 4,
            }}
          />
        )}
      </div>
      {/* body end*/}
    </div>
  );
};

export default RequestSection;
