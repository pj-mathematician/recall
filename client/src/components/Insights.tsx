import React from "react";
import { useState } from "react";
import Button from "./Button";
import { useRecall } from "../contexts/RecallProvider";
import Loading from "./Loading";
import { downloadTextFile, downloadSrtFile } from "../utils/export";

const Transcription = React.lazy(() => import("./Transcription"));
const Translation = React.lazy(() => import("./Translation"));
const Summarization = React.lazy(() => import("./Summarization"));

const views = [
  "Transcription",
  "Translation",
  "Summarization",
  "Sentiment Analysis",
];

function getComponent(
  currentView: string,
  translation: any,
  currentAudio: string,
  language: any,
  transcriptionLanguage: string,
  summarization: any
): React.ReactNode {
  switch (currentView) {
    case "Transcription":
      return (
        <Transcription
          text={translation?.[currentAudio]?.[transcriptionLanguage] ?? ""}
        />
      );
    case "Translation":
      return (
        <Translation
          text={translation?.[currentAudio]?.[language[currentAudio]] ?? ""}
        />
      );
    case "Summarization":
      return <Summarization text={summarization?.[currentAudio] ?? ""} />;
    default:
      return null;
  }
}

const Insights = () => {
  const [currentView, setCurrentView] = useState("Transcription");
  const [exportAs, setExportAs] = useState("text");
  const {
    transcriptionLanguage,
    loading,
    fileNames,
    translation,
    translateText,
    summarization,
    summarizeText,
  } = useRecall();

  const [language, setLanguage] = useState<any>(
    fileNames.reduce(
      (prev, filename) => ({ ...prev, [filename]: transcriptionLanguage }),
      {}
    )
  );
  const [currentAudio, setCurrentAudio] = useState(fileNames[0]);

  async function handleLanguageChange(e: React.ChangeEvent<HTMLSelectElement>) {
    translateText(
      translation?.[currentAudio]?.[language[currentAudio]] ?? "",
      e.target.value,
      currentAudio
    );
    setLanguage({ ...language, [currentAudio]: e.target.value });
  }

  function handleViewChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setCurrentView(e.target.value);
    if (e.target.value === "Transcription") {
      setLanguage({ ...language, [currentAudio]: transcriptionLanguage });
    } else if (e.target.value === "Translation") {
      translateText(
        translation?.[currentAudio]?.[language[currentAudio]] ?? "",
        language[currentAudio],
        currentAudio
      );
    } else if (e.target.value === "Summarization") {
      summarizeText(
        translation?.[currentAudio]?.[transcriptionLanguage] ?? "",
        currentAudio
      );
    }
  }

  function handleExport() {
    const textElement = document.getElementById(
      "audio-content"
    )! as HTMLDivElement;
    const text = textElement.innerText;
    if (exportAs === "text") {
      downloadTextFile(text, currentAudio);
    } else if (exportAs === "srt") {
      downloadSrtFile(text, currentAudio);
    }
  }

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
            defaultValue={language[currentAudio]}
            onChange={handleLanguageChange}
            className="ml-2 cursor-pointer border-b border-b-white bg-transparent
                 text-center text-gray-300 outline-none"
            disabled={currentView !== "Translation" || loading}
          >
            <option className="text-black" value="">
              Auto
            </option>
            <option className="text-black" value="English">
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
          onChange={handleViewChange}
          disabled={loading}
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
            disabled={loading}
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
      <div id="audio-content" className="grow text-white">
        {loading ? (
          <Loading />
        ) : (
          getComponent(
            currentView,
            translation,
            currentAudio,
            language,
            transcriptionLanguage,
            summarization
          )
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
            value={exportAs}
            onChange={(e) => setExportAs(e.target.value)}
            className="ml-2 cursor-pointer border-b border-b-white bg-transparent
                 text-center text-gray-300 outline-none"
          >
            <option className="text-black" value="text">
              Text
            </option>
            <option className="text-black" value="srt">
              SRT
            </option>
          </select>
        </div>
        <Button text="Export" onClick={handleExport} />
      </div>
    </div>
  );
};

export default Insights;
