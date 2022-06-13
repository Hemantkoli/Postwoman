import RequestSection from "./RequestSection";
import ResponseSection from "./ResponseSection";

const RequestScreen = () => {
  return (
    <div className="flex flex-col w-full h-full ">
      <RequestSection />
      <ResponseSection />
    </div>
  );
};

export default RequestScreen;
