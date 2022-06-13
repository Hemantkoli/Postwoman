import axios from "axios";
const apiClient = axios.create();

apiClient.interceptors.request.use(
  function (config) {
    //@ts-ignore
    config.metadata = { startTime: new Date() };
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  function (response) {
    //@ts-ignore
    response.config.metadata.endTime = new Date();
    //@ts-ignore
    response.duration = response.config.metadata.endTime - response.config.metadata.startTime;
    return response;
  },
  function (error) {
    error.config.metadata.endTime = new Date();
    error.duration = error.config.metadata.endTime - error.config.metadata.startTime;
    return Promise.reject(error);
  }
);
export default apiClient;
