import { useState } from "react";
import Button from "./Button";
import Transcription from "./Transcription";
import { useRecall } from "../contexts/RecallProvider";

const views = [
  "Transcription",
  "Translation",
  "Summarization",
  "Sentiment Analysis",
];

function getComponent(currentView: string, text: string): React.ReactNode {
  switch (currentView) {
    case "Transcription":
      return <Transcription text={text} />;
    default:
      return null;
  }
}

const Insights = () => {
  const [currentView, setCurrentView] = useState("Transcription");
  const {
    transcriptionLanguage,
    transcriptionLoading,
    fileNames,
    transcription,
  } = useRecall();
  const [language, setLanguage] = useState(transcriptionLanguage);
  const [currentAudio, setCurrentAudio] = useState(fileNames[0]);

  return (
    <div className="flex h-full grow flex-col gap-4 rounded-lg bg-[#cccccc10] p-4 shadow">
      <h3 className="flex items-center justify-between text-lg text-gray-300">
        <div>
          <label htmlFor="language" className="text-gray-300">
            Language:
          </label>
          <select
            name="language"
            id="language"
            defaultValue={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="ml-2 cursor-pointer border-b border-b-white bg-transparent
                 text-center text-gray-300 outline-none"
            disabled={currentView !== "Translation"}
          >
            <option className="text-black" value="">
              Auto
            </option>
            <option className="text-black" value="Enligsh">
              English
            </option>
            <option className="text-black" value="Hindi">
              Hindi
            </option>
            <option className="text-black" value="French">
              French
            </option>
            <option className="text-black" value="German">
              German
            </option>
          </select>
        </div>
        <select
          name="current-view"
          id="current-view"
          value={currentView}
          onChange={(e) => setCurrentView(e.target.value)}
          className="ml-2 cursor-pointer border-b border-b-white bg-transparent
         text-center font-semibold text-gray-300 outline-none"
        >
          {views.map((view) => (
            <option key={view} value={view} className="text-black">
              {view}
            </option>
          ))}
        </select>
        <div>
          <label htmlFor="audio-files" className="text-gray-300">
            Audio:
          </label>
          <select
            name="audio-files"
            id="audio-files"
            value={currentAudio}
            onChange={(e) => setCurrentAudio(e.target.value)}
            className="ml-2 w-[100px] cursor-pointer overflow-hidden text-ellipsis
                 whitespace-nowrap border-b border-b-white bg-transparent text-center text-gray-300 outline-none"
          >
            {fileNames.map((fileName) => (
              <option key={fileName} className="text-black" value={fileName}>
                {fileName}
              </option>
            ))}
          </select>
        </div>
      </h3>
      <div className="grow text-white">
        {transcriptionLoading
          ? "Loading..."
          : getComponent(
              currentView,
              transcription?.[currentAudio]?.[language]
            )}
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
