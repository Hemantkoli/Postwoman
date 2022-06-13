import React, { createContext, useContext, useReducer } from "react";

type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

type ActionType =
  | "START_RESPONSE_LOADER"
  | "STOP_RESPONSE_LOADER"
  | "SET_RESPONSE_DATA"
  | "SET_ERROR"
  | "SET_ACTIVE_SCREEN"
  | "SET_REQUEST_DATA"
  | "DELETE_REQUEST_SCREEN"
  | "ADD_NEW_REQUEST_SCREEN"
  | "ADD_VARIABLE"
  | "REMOVE_VARIABLE"
  | "UPDATE_VARIABLE";

export enum Types {
  startResponseLoader = "START_RESPONSE_LOADER",
  stopResponseLoader = "STOP_RESPONSE_LOADER",
  setError = "SET_ERROR",
  setActiveScreen = "SET_ACTIVE_SCREEN",
  setRequestData = "SET_REQUEST_DATA",
  setResponseData = "SET_RESPONSE_DATA",
  deleteScreen = "DELETE_REQUEST_SCREEN",
  addNewScreen = "ADD_NEW_REQUEST_SCREEN",
  addVariable = "ADD_VARIABLE",
  removeVariable = "REMOVE_VARIABLE",
  updateVariable = "UPDATE_VARIABLE",
}

type Payload = {
  [Types.startResponseLoader]: {
    id: number;
    name: string;
    price: number;
  };
  [Types.stopResponseLoader]: {
    id: number;
  };
};

interface RequestScreen {
  id: number;
  name: string;
  requestData: {
    type: "GET" | "POST" | "PUT" | "DELETE";
    url: string;
    body: string;
    queryParams: {
      id: number;
      key: string;
      value: string;
    }[];
  };
  responseData: {
    statusCode: number;
    content: any;
    size: string;
    time: any;
  };
  error: boolean;
}

interface Variable {
  id: number;
  key: string;
  value: string;
  // description:string
}
interface State {
  requestScreens: RequestScreen[];
  activeRequestScreenId: number;
  responseLoading: boolean;
  variables: Variable[];
}

interface Action {
  type: ActionType;
  payload?:
    | any
    | {
        id: number;
        key: string;
        data: any;
        requestScreen: RequestScreen;
      };
}

// create two context; one for the state and one for the dispatch
const StateContext = createContext<State>(undefined);

const DispatchContext = createContext<React.Dispatch<Action>>(null);

const reducer = (state: State, { type, payload }: Action): State => {
  switch (type) {
    case "START_RESPONSE_LOADER":
      return {
        ...state,
        responseLoading: true,
      };
    case "STOP_RESPONSE_LOADER":
      return {
        ...state,
        responseLoading: false,
      };
    case "SET_ERROR": {
      const { screenId, requestScreen } = payload;

      const updatedRequest = {
        ...requestScreen,
        error: true,
      };

      const updatedRequestScreens = state.requestScreens.map((request) =>
        request.id === screenId ? updatedRequest : request
      );

      return {
        ...state,
        requestScreens: updatedRequestScreens,
      };
    }
    case "SET_REQUEST_DATA": {
      const { id, key, data, requestScreen } = payload;
      // console.log({ payload });

      const updatedRequest = {
        ...requestScreen,
        requestData: {
          ...requestScreen.requestData,
          [key]: data,
        },
      };

      const updatedRequestScreens = state.requestScreens.map((request) =>
        request.id === id ? updatedRequest : request
      );

      return {
        ...state,
        requestScreens: updatedRequestScreens,
      };
    }
    case "SET_RESPONSE_DATA": {
      const { dataObj, requestScreen, id, error } = payload;
      const updatedScreen = {
        ...requestScreen,
        responseData: dataObj,
        error: error,
      };

      const updatedRequestScreens = state.requestScreens.map((screen) => (screen.id === id ? updatedScreen : screen));
      return {
        ...state,
        requestScreens: updatedRequestScreens,
      };
    }
    case "SET_ACTIVE_SCREEN":
      return {
        ...state,
        activeRequestScreenId: payload,
      };
    case "ADD_NEW_REQUEST_SCREEN":
      const newRequestScreen = {
        id: Math.floor(Math.random() * 2000000),
        name: "New Request",
        requestData: {
          type: "GET",
          url: "https://abc.com/",
          body: "{\n\t\n}",
          queryParams: [
            {
              id: Math.floor(Math.random() * 2000),
              key: "",
              value: "",
            },
          ],
        },
        responseData: {
          statusCode: null,
          content: JSON.stringify({}, null, 2),
          size: null,
          time: null,
        },
        responseLoading: false,
      };

      return {
        ...state,
        activeRequestScreenId: newRequestScreen.id,
        //@ts-ignore // TODO FIX ts
        requestScreens: [...state.requestScreens, newRequestScreen],
      };

    case "DELETE_REQUEST_SCREEN":
      const updatedScreens = state.requestScreens.filter((screen) => screen.id !== payload);
      console.log({ updatedScreens }, updatedScreens[updatedScreens.length - 1].id);

      return {
        ...state,
        activeRequestScreenId: updatedScreens[updatedScreens.length - 1].id,
        requestScreens: updatedScreens,
      };

    case "ADD_VARIABLE":
      return {
        ...state,
        variables: [
          ...state.variables,
          {
            id: Math.floor(Math.random() * 2000),
            key: "",
            value: "",
          },
        ],
      };
    case "REMOVE_VARIABLE":
      const id = payload;
      const updatedVariables = state.variables.filter((pair) => pair.id !== id);
      return {
        ...state,
        variables: updatedVariables,
      };
    case "UPDATE_VARIABLE": {
      const { id, type, value } = payload;
      let tempPairs = [...state.variables];
      const pairIndex = state.variables.findIndex((pair) => pair.id === id);
      tempPairs[pairIndex] = { ...tempPairs[pairIndex], [type]: value };
      console.log({ id, type, value, tempPairs });

      return {
        ...state,
        variables: tempPairs,
      };
    }
    default:
      throw new Error(`Unknown action type"${type}`);
  }
};

export const LayoutProvider = ({ children }) => {
  const [state, dispatch] = useReducer<React.Reducer<State, Action>>(reducer, {
    activeRequestScreenId: 1,
    requestScreens: [
      {
        id: 1,
        name: "Log in",
        requestData: {
          type: "GET",
          url: "https://jsonplaceholder.typicode.com/todos/1",
          body: "{\n\t\n}",
          queryParams: [
            {
              id: Math.floor(Math.random() * 2000),
              key: "",
              value: "",
            },
            {
              id: Math.floor(Math.random() * 2000),
              key: "",
              value: "",
            },
          ],
        },
        responseData: {
          statusCode: null,
          content: null,
          size: null,
          time: null,
        },
        error: false,
      },
      {
        id: 2,
        name: "Log out",
        requestData: {
          type: "DELETE",
          url: "https://delete.com/",
          body: "{\n\t\n}",
          queryParams: [
            {
              id: 11,
              key: "d",
              value: "xyz",
            },
          ],
        },
        responseData: {
          statusCode: null,
          content: null,
          size: null,
          time: null,
        },
        error: false,
      },
    ],
    responseLoading: false,
    variables: [
      {
        id: Math.floor(Math.random() * 200000),
        key: "",
        value: "",
      },
    ],
  });

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export const useLayoutState = () => useContext(StateContext);
export const useLayoutDispatch = () => useContext(DispatchContext);
