import Button from "./Button";
import Transcription from "./Transcription";

const Insights = () => {
  return (
    <div className="flex h-full grow flex-col gap-4 rounded-lg bg-[#cccccc10] p-4 shadow">
      <h3 className="text-center text-lg font-semibold text-gray-300">
        Transcription
      </h3>
      <div className="grow text-white">
        <Transcription text="" />
      </div>
      <div className="ml-auto flex items-center gap-4">
        <div>
          <label htmlFor="export-as" className="text-gray-300">
            Export As:
          </label>
          <select
            name="export-as"
            id="export-as"
            defaultValue="text"
            className="ml-2 cursor-pointer border-b border-b-white bg-transparent
                 text-center text-gray-300 outline-none"
          >
            <option className="text-black" value="text">
              Text
            </option>
            <option className="text-black" value="vtt">
              VTT
            </option>
            <option className="text-black" value="srt">
              SRT
            </option>
          </select>
        </div>
        <Button text="Export" />
      </div>
    </div>
  );
};

export default Insights;
