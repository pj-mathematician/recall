import { ScaleLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="flex h-full w-full items-center justify-center text-2xl text-white">
      <div className="flex items-center gap-4">
        <span>Analysing Audio</span>
        <ScaleLoader color="#ffffff" height="20px" speedMultiplier={1.3} />
      </div>
    </div>
  );
};

export default Loading;
